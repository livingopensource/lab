<script lang="ts">
  import type { PageServerData } from "./$types";
  import * as Tabs from "$lib/components/ui/tabs/index";
  import Play from "lucide-svelte/icons/play";
  import Stop from "lucide-svelte/icons/square";
  import Book from 'lucide-svelte/icons/book';
  import { page } from "$app/stores";
	import { Separator } from "$lib/components/ui/separator";
  import {powerOn, powerOff, execConnection } from "$lib/helpers/instance.client";
	import { goto, invalidateAll } from "$app/navigation";
	import { toast } from "svelte-sonner";
	import type { operationResponse } from "$lib/server/incus.types";
	import type { FitAddon } from "@xterm/addon-fit";
	import type { AttachAddon } from "@xterm/addon-attach";
	import { onDestroy, onMount } from "svelte";
	import * as Card from "$lib/components/ui/card/index";
  import * as Table from "$lib/components/ui/table/index"
  import * as Pagination from "$lib/components/ui/pagination/index"
  import byteSize from 'byte-size';
  import dateFormat  from 'dateformat';
	import Skeleton from "$lib/components/ui/skeleton/skeleton.svelte";
	import { browser } from "$app/environment";
	import { fetchBooks } from "$lib/helpers/misc";
  import Warning from "lucide-svelte/icons/triangle-alert";
    let data: {
      data: PageServerData
    } = $props()

    let xterminal: HTMLDivElement
    let screen: HTMLElement
    let pdfCanvas: HTMLCanvasElement
    let xterm: { Terminal: any; default?: any; }
    let tab: string = $state("overview")
    let lessonDoc: string = $state("/LFCS.pdf")
    let pageNumber: number = $state(1);
    let totalPages: number = $state(0);
    let pathName: string =$page.url.pathname
    $page.url.searchParams.get("tab") && (tab = $page.url.searchParams.get("tab")!)
    $page.url.searchParams.get("doc") && (lessonDoc = $page.url.searchParams.get("doc")!)
    $page.url.searchParams.get("page") && (pageNumber = parseInt($page.url.searchParams.get("page")!))

    function showTerminal(po: HTMLElement) {
      // Only load the terminal if the instance is running
      //@ts-ignore
       if (data.data.instance.status == "Running") {
        loadTerminal();
      }
    }

    async function loadTerminal() {
      xterm = (await import("@xterm/xterm"));
      const termReq = await execConnection($page.params.name)
      if (!termReq.ok) {
        toast.error("Unable to connect to console", {
          description: "Unable to connect to instance console, please try again"
        })
        return
      }
      const termData = await termReq.json() as operationResponse
      // Check if we are able to connect to backend service
      if (data.data?.operations_url) {
        fetch(data.data.operations_url, {mode: "no-cors"})
        .then(resp => {
          // toast.success("It works, we are able to connect to websocket")
          var term = new xterm.Terminal({
            screenKeys: true,
            useStyle: true,
            cursorBlink: true,
            fullscreenWin: true,
            maximizeWin: true,
            screenReaderMode: true,
            cols: 128,
          })
          term.open(xterminal);
          execConsoleConnect(termData, term)
        })
        .catch(err => toast.error("Unable to connect to websocket server", {
          description: "Unable to connect to websocket server, "+err.message
        }))
      } else {
        toast.error("Unable to connect to websocket server", {
          description: "Operations URL is not available"
        })
      }
    }

    function convertArrayBuffer2String(buf: AllowSharedBufferSource | undefined) {
      var encoding = 'utf8';
      var decoder = new TextDecoder(encoding);
    	  var str = decoder.decode(buf);
      return str
    }

    function convertString2ArrayBuffer(str: string) {
      var buf = new ArrayBuffer(str.length);
      var bufView = new Uint8Array(buf);
      for (var i=0, strLen=str.length; i < strLen; i++) {
        bufView[i] = str.charCodeAt(i);
      }
      return buf;
    }

    var execControlSocket: WebSocket;
    var execDataSocket: WebSocket;
    
    function closeExecConnection() {

      if (execControlSocket == null || execControlSocket == undefined || execControlSocket.CLOSED) {
        return
      }
      // Sending Ctrl+d (exit) three times to back out of potential nested shells or logins up to three deep. 
      // If not logged out, WebSocket operation may continue to run.
      execDataSocket.send(convertString2ArrayBuffer('\x04 \r \x04 \r \x04 \r'))
        
      // Closing the "control" websocket for console operations will stop the operation without crashing existing host WebSockets.
      execControlSocket.close();
      execDataSocket.close();
    }

    async function execConsoleConnect(payload: operationResponse, term: {
		[x: string]: any; loadAddon: (arg0: FitAddon | AttachAddon) => void; 
    }) {
      const secret = payload.metadata.metadata.fds[0]
      const control = payload.metadata.metadata.fds["control"]

      // Make sure we are able to get the keys needed to connect to the two expected
      // websockets
      if (control === "" && secret === "") {
        toast.error("Unable to establish connection", {
          description: "Unable to connect to remote backend, please try refreshing this page"
        })
        // Dont proceed any further, if we cant get the websocket secret and control string
        return
      }

      const execControlURL = data.data.operations_url + payload.operation + "/websocket?secret=" + control;
      const execDataURL = data.data.operations_url + payload.operation + "/websocket?secret=" + secret;
      execControlSocket = new WebSocket(execControlURL);
      const attachAddon = (await import("@xterm/addon-attach"));
      const attachAddonInstance = new attachAddon.AttachAddon(execControlSocket);
      const fitAddon = (await import("@xterm/addon-fit"));
      const fitAddonInstance = new fitAddon.FitAddon();

      term.loadAddon(fitAddonInstance);

       //Listen for "control" websocket errors
       execControlSocket.onerror = function (e: any) {
         toast.error("WebSocket error", {
          description: "Unable to connect to remote backend, "+e.message
         });
       }
      //Listen for "control" websocket opening connection
      execControlSocket.onopen = function(e) {
        term.loadAddon(attachAddonInstance);
        term._initialized = true
        term.focus()

        term.onResize(function (event: { rows: any; cols: any; }) {
          var rows = event.rows;
          var cols = event.cols;
          var size = JSON.stringify({cols: cols, rows: rows});
          execControlSocket.send("\x04" + size);
        }); 

        const xterm_resize_ob = new ResizeObserver(function () {
        // Rerun the fitAddon to resize the terminal everytime the container size changes
        try {
            fitAddonInstance && fitAddonInstance.fit();
          } catch (err: any) {
            toast.warning("Terminal resizing error", {
              description: "Failed resizing terminal boundaries "
            })
          }
        });

        // start observing for resize
        xterm_resize_ob.observe(xterminal);

        //TODO: lISTEN FOR WEBSOCKET CLOSE OPERATION

      }

      //Create a new "data" websocket
      execDataSocket = new WebSocket(execDataURL);

      execDataSocket.onerror = function(e: any) {
        toast.error("WebSocket error", {
          description: "Unable to connect to remote backend, "+ e.message
        });
      }

      //Listen for "data" websocket messages
      execDataSocket.onmessage = function (e) {      
      if (typeof e.data === "string") {
          term.write(e.data);
          return;
        }
        void e.data?.text().then((text: any) => {
          term.write(text);
        });
      };

      //Setup listener for Exec terminal
      term.onData( (data: string) => {
        if (execDataSocket.readyState === 1) {
          execDataSocket.send(convertString2ArrayBuffer(data))
        }
      });
      //Listen for "data" websocket closing
      execDataSocket.onclose = function (e) {
        term.dispose();
      };
    }

    function loadPDF(node: HTMLCanvasElement, data: { url: any; }) {
      showPDF(node, data)
    }

    async function showPDF(node: HTMLCanvasElement, data: { url: any; }) {
      const PDFJS = await import('pdfjs-dist');
      //@ts-ignore
      const pdfjsWorker = await import('pdfjs-dist/build/pdf.worker.min.mjs');

      //PDFJS.GlobalWorkerOptions.workerSrc = pdfjsWorker;

      const loadingTask = PDFJS.getDocument({url: data.url});

      const pdf = await loadingTask.promise;

      const page = await pdf.getPage(pageNumber);

      // Get the pdf total pages
      totalPages = pdf.numPages;

      const scale = 1;

      const viewport = page.getViewport({ scale });

      const canvas = node;

      const context = canvas.getContext("2d");

      canvas.height = viewport.height;

      canvas.width = viewport.width;

      const renderContext = {

            canvasContext: context,

            viewport: viewport,

      };

      //@ts-ignore
      await page.render(renderContext);
    }
  
  onDestroy(() => {
    if (data.data.instance?.status == "Running") {
      closeExecConnection()
    }
  })

  onMount(async () => {
    if (data.data.instance?.status == "Running") {
      // Create VNC Connection if machine is running and is a vm
      if (data.data.instance.type == "virtual-machine") {
        const { default: RFB } = await import('@novnc/novnc/lib/rfb');
        let rfb;
        let vmiName = $page.params.name;
        const url = `${data.data.operation_ks_url}/1.0/virtual-machines/${vmiName}/vnc?project=project-hwhn2r5gy6c5qm7wavvf`;

        // Creating a new RFB object will start a new connection
        rfb = new RFB(screen, url,{});

        // Add listeners to important events from the RFB module
        rfb.addEventListener("connect",  () => {});
        rfb.addEventListener("disconnect", () => {});
        rfb.addEventListener("credentialsrequired", () => {});
        rfb.addEventListener("desktopname", () => {});
      }
    }
  })
</script>
<svelte:head>
    <link rel="stylesheet" href="/css/xterm.css" />
    <title>{$page.params.name} Instance | SwiftCloud Labs</title>
</svelte:head>
  
  <div class="container py-10">
    <div class="grid grid-cols-2 gap-4 place-content-between">
      <div class="flex h-5 items-center space-x-4 text-sm">
        <h1 class="text-2xl">{data.data.instance.status}</h1>
        <Separator orientation="vertical" />
        {#if data.data.instance.status == "Stopped"}
        <div><Play onclick={() => {
          powerOn($page.params.name)
          // Refresh the interface data, then wait another 2 seconds
          // Then re-initialise the terminal
          setTimeout(() => {
            invalidateAll()
            setTimeout(() => {
              showTerminal(xterminal)
              invalidateAll()}
              , 2000)
          }, 2000)
        }} /></div>
        {/if}
        <!-- <Separator orientation="vertical" /> -->
        <!-- <div><Restart /></div> -->
        <!-- <Separator orientation="vertical" /> -->
        {#if data.data.instance.status == "Running"}
        <div><Stop onclick={() => {
          powerOff($page.params.name)
          setTimeout(() => invalidateAll(), 2000)
        }} /></div>
        {/if}
      </div>
      <div>
        <!-- <Button class="float-right"><Trash /></Button> -->
      </div>
    </div>
    <br />
    <hr />
    <br />
    <div>
      <Tabs.Root value={tab}>
        <Tabs.List>
          <Tabs.Trigger value="overview" onclick={() => {
            goto(pathName+"?tab=overview")
          }}>Overview</Tabs.Trigger>
          <Tabs.Trigger value="terminal" onclick={() => {
            goto(pathName+"?tab=terminal")
          }}>Terminal</Tabs.Trigger>
          <Tabs.Trigger value="lesson" onclick={() => {
            goto(pathName+"?page="+pageNumber+"&tab=lesson&doc="+lessonDoc)
          }}>Lessons</Tabs.Trigger>
          {#if data.data.backend == "k8s"}
          <Tabs.Trigger value="vnc">VNC</Tabs.Trigger>
          {/if}
        </Tabs.List>
        <Tabs.Content value="overview">
          <Card.Root>
            <Card.Header>
              <Card.Title>General</Card.Title>
              <Card.Description>The instance configuration details</Card.Description>
            </Card.Header>
            <Card.Content>
              <div class="grid grid-cols-2 gap-4">
                <div>Name</div>
                <div>{data.data.instance.name}</div>
                <div>OS</div>
                <div>{data.data.instance.config["image.os"]}</div>
                <div>Release</div>
                <div>{data.data.instance.config["image.release"]}</div>
                <div>Architecture</div>
                <div>{data.data.instance.architecture}</div>
                <div>Type</div>
                <div>{data.data.instance.type}</div>
                <div>Created</div>
                <div>{dateFormat(data.data.instance.created_at, "fullDate")}</div>
                <div>Last Used</div>
                <div>{dateFormat(data.data.instance.last_used_at, "fullDate")}</div>
              </div>
            </Card.Content>
          </Card.Root>
          <br />
          <Card.Root>
            <Card.Header>
              <Card.Title>Compute Resources</Card.Title>
              <Card.Description>The instance compute resource utilisation</Card.Description>
            </Card.Header>
            <Card.Content>
              <Table.Root>
                <Table.Header>
                  <Table.Row>
                    <Table.Head>
                      Resource
                    </Table.Head>
                    <Table.Head>
                      Utilisation
                    </Table.Head>
                    <Table.Head>
                      Total
                    </Table.Head>
                  </Table.Row>
                </Table.Header>
                <Table.Body>
                  <Table.Row>
                    <Table.Cell>
                      CPU
                    </Table.Cell>
                    <Table.Cell>
                      {data.data.instance.state.cpu.usage}
                    </Table.Cell>
                    <Table.Cell>
                      
                    </Table.Cell>
                  </Table.Row>
                  <Table.Row>
                    <Table.Cell>
                      Memory
                    </Table.Cell>
                    <Table.Cell>
                      {byteSize(data.data.instance.state.memory.usage)}
                    </Table.Cell>
                    <Table.Cell>
                      {byteSize(data.data.instance.state.memory.total)}
                    </Table.Cell>
                  </Table.Row>
                  <Table.Row>
                    <Table.Cell>
                      Storage
                    </Table.Cell>
                    <Table.Cell>
                      {#each Object.keys(data.data.instance.state.disk)as disk}
                        <div class="grid grid-cols-2">
                          <div>{disk} disk:</div>
                          <div>{byteSize(data.data.instance.state.disk[disk].usage)}</div>
                        </div>
                      {/each}
                    </Table.Cell>
                    <Table.Cell>
                      {#each Object.keys(data.data.instance.state.disk)as disk}
                        <div class="grid grid-cols-2">
                          <div>{disk} disk:</div>
                          <div>{byteSize(data.data.instance.state.disk[disk].total)}</div>
                        </div>
                      {/each}
                    </Table.Cell>
                  </Table.Row>
                </Table.Body>
              </Table.Root>
            </Card.Content>
          </Card.Root>
          <br />
          <Card.Root>
            <Card.Header>
              <Card.Title>Network</Card.Title>
              <Card.Description>The instance connectivity details</Card.Description>
            </Card.Header>
            <Card.Content>
              <Table.Root>
                <Table.Header>
                  <Table.Row>
                    <Table.Head>
                      Device Name
                    </Table.Head>
                    <Table.Head>
                      IP Addresses
                    </Table.Head>
                    <Table.Head>
                      Traffic
                    </Table.Head>
                  </Table.Row>
                </Table.Header>
                <Table.Body>
                  {#if data.data.instance.state.network != null}
                    {#each Object.keys(data.data.instance.state.network) as network}
                      <Table.Row>
                        <Table.Cell>{network}</Table.Cell>
                        <Table.Cell>
                          {#each data.data.instance.state.network[network].addresses as address}
                            {#if address.family == "inet"}
                            <div class="grid grid-cols-2">
                              <div>IPv4:</div><div>{address.address}</div>
                            </div>
                            {/if}
                            {#if address.family == "inet6"}
                            <div class="grid grid-cols-2">
                              <div>IPv6:</div><div>{address.address}</div>
                            </div>
                            {/if}
                          {/each}
                        </Table.Cell>
                        <Table.Cell>
                          <div class="grid grid-cols-2">
                            <div>Recieved:</div><div>{byteSize(data.data.instance.state.network[network].counters.bytes_received)}</div>
                          </div>
                          <div class="grid grid-cols-2 gap-2">
                            <div>Sent:</div><div>{byteSize(data.data.instance.state.network[network].counters.bytes_sent)}</div>
                          </div>
                        </Table.Cell>
                      </Table.Row>
                    {/each}
                  {/if}
                </Table.Body>
              </Table.Root>
            </Card.Content>
          </Card.Root>
        </Tabs.Content>
        <Tabs.Content value="terminal">
          <div bind:this={xterminal} use:showTerminal class="h-[400]"></div>
        </Tabs.Content>
        <Tabs.Content value="lesson">
          <div class="flex flex-wrap justify-between mt-2">
            <div class="overflow-x-auto">
              <canvas class="overflow-x-auto" use:loadPDF="{{ url: lessonDoc}}" bind:this={pdfCanvas}></canvas>
              <div>
                <Pagination.Root class="w-max" count={totalPages} perPage={1} page={pageNumber} onPageChange={(page) => {
                  pageNumber = page
                  goto(pathName+"?page="+pageNumber+"&tab=lesson&doc="+lessonDoc)
                  loadPDF(pdfCanvas, {url: lessonDoc})
                }}>
                  {#snippet children({ pages, currentPage })}
                    <Pagination.Content>
                      <Pagination.Item>
                        <Pagination.PrevButton onclick={() => {
                          pageNumber - 1
                          goto($page.url.pathname+"?page="+pageNumber+"&tab=lesson&doc="+lessonDoc)
                          loadPDF(pdfCanvas, {url: lessonDoc})
                        }}/>
                      </Pagination.Item>
                      {#each pages as page (page.key)}
                        {#if page.type === "ellipsis"}
                          <Pagination.Item>
                            <Pagination.Ellipsis />
                          </Pagination.Item>
                        {:else}
                          {/* @ts-ignore */ null}
                          <Pagination.Item isVisible={currentPage === page.value}>
                            <Pagination.Link {page} isActive={currentPage === page.value}>
                              {page.value}
                            </Pagination.Link>
                          </Pagination.Item>
                        {/if}
                      {/each}
                      <Pagination.Item>
                        <Pagination.NextButton onclick={() => {
                          pageNumber + 1
                          goto($page.url.pathname+"?page="+pageNumber+"&tab=lesson&doc="+lessonDoc)
                          loadPDF(pdfCanvas, {url: lessonDoc})
                        }}/>
                      </Pagination.Item>
                    </Pagination.Content>
                  {/snippet}
                </Pagination.Root>
              </div>
            </div>
            <div>
              <br />
              <h1 class="mb-4 text-lg font-medium leading-none">Training Documents</h1>
              {#if browser}
                {#await fetchBooks()}
                <div class="flex items-center space-x-4">
                  <Skeleton class="size-12 square-full" />
                  <div class="space-y-2">
                    <Skeleton class="h-4 w-[250px]" />
                    <Skeleton class="h-4 w-[200px]" />
                  </div>
                </div>
                <br />
                <div class="flex items-center space-x-4">
                  <Skeleton class="size-12 square-full" />
                  <div class="space-y-2">
                    <Skeleton class="h-4 w-[250px]" />
                    <Skeleton class="h-4 w-[200px]" />
                  </div>
                </div>
                <br />
                <div class="flex items-center space-x-4">
                  <Skeleton class="size-12 square-full" />
                  <div class="space-y-2">
                    <Skeleton class="h-4 w-[250px]" />
                    <Skeleton class="h-4 w-[200px]" />
                  </div>
                </div>
                {:then data}
                  {#each data as lesson}
                    <Card.Root class="mb-2 cursor-pointer w-80" onclick={() => {
                      lessonDoc = lesson.url
                      pageNumber = 1
                      goto($page.url.pathname+"?page="+pageNumber+"&tab=lesson&doc=/proxy?url="+lessonDoc)
                      loadPDF(pdfCanvas, {url: lessonDoc})
                    }}>
                      <Card.Header>
                        <Card.Title>{lesson.name}</Card.Title>
                        <Card.Description>{lesson.description}</Card.Description>
                      </Card.Header>
                      <Card.Content>
                        <Book />
                      </Card.Content>
                    </Card.Root>
                    <Separator class="my-2" />
                  {/each}
                {:catch error}
                <div class="flex flex-wrap gap-2">
                  <div class="my-5"><Warning /></div>
                  <div><p class="text-sm text-foreground m-5"> Sorry, we are unable to show you libray material, please check your internet connection </p></div>
                </div>
                {/await}
              {/if}
            </div>
          </div>
        </Tabs.Content>
        {#if data.data.backend == "k8s"}
        <Tabs.Content value="vnc">
          <div id="screen" bind:this={screen}>
              <!-- This is where the remote screen will appear -->
          </div>
        </Tabs.Content>
        {/if}
      </Tabs.Root>
    </div>
  </div>