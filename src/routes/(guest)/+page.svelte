<script lang="ts">
   import { onMount, onDestroy } from 'svelte';
   import { mode } from 'mode-watcher';
   import { slide } from 'svelte/transition';
   import * as Card from "$lib/components/ui/card";
   import { Badge } from '$lib/components/ui/badge';
   import { goto } from '$app/navigation';
	
	let greetings = ['Linux', 'Docker', 'Kubernetes'];
    // Define themes
    const darkTheme = {
      background: "#1E1E1E",
      foreground: "#D4D4D4",
      cursor: "white",
    };
  
    const lightTheme = {
      background: "#FAFAFA",
      foreground: "#333333",
      cursor: "black",
    };
    
	  let index = $state(0);
	  let roller: string | number | NodeJS.Timeout | undefined;
    let terminalContainer: HTMLElement;
    let theme = $derived($mode == "light" ? lightTheme : darkTheme)

    onMount(async () => {
      roller = setInterval(() => {
	  	if (index === greetings.length - 1) index = 0;
	  	else index++;
	  }, 3000);

      let xterm  = (await import("@xterm/xterm"));
      const term = new xterm.Terminal({
        cursorBlink: true,  // Makes it look interactive
        fontSize: 14,
        theme: theme, // Dark theme
        fontFamily: "monospace",
        lineHeight: 1.2,
        scrollback: 0,
        cursorWidth: 1,
        rescaleOverlappingGlyphs: true,
      });
  
      term.open(terminalContainer);
  
      // Simulated Terminal Output
      function typeCommand(command: string | any[], delay = 100) {
        return new Promise<void>((resolve) => {
          let i = 0;
          const interval = setInterval(() => {
            if (i < command.length) {
              term.write(command[i]);
              i++;
            } else {
              clearInterval(interval);
              term.write("\r\n");
              resolve();
            }
          }, delay);
        });
      }
  
      async function runAnimation() {
        term.writeln("Welcome to Living Open Source Labs! 🌎");
        term.writeln("Launching interactive environment...\r\n");
  
        await typeCommand("ls -la", 80);
        await new Promise((r) => setTimeout(r, 1000));
        term.writeln("drwxr-xr-x  2 user user 4096 Mar 25 10:00 /workspace");
        term.writeln("-rw-r--r--  1 user user  124 Mar 25 10:00 README.md");
  
        await typeCommand("docker run hello-world", 80);
        await new Promise((r) => setTimeout(r, 1500));
        /* term.writeln("\nHello from Docker!\nThis message shows that your installation appears to be working correctly.\n"); */
  
        await typeCommand("kubectl get pods", 80);
        await new Promise((r) => setTimeout(r, 1200));
        term.writeln("NAME                        READY   STATUS    RESTARTS   AGE");
        term.writeln("my-app-12345                1/1     Running   0          5m");
  
        term.writeln("\nEnvironment Ready! 🚀 Start experimenting.");
      }
  
      runAnimation();
    });

    onDestroy(() => {
		clearInterval(roller);
	});
</script>

<svelte:head>
    <title>Living Open Source Linux, Docker & Kubernetes Lab - Hands-on Cloud Training</title>
    <link rel="stylesheet" href="/css/xterm.css" />
</svelte:head>

<div class="container py-10">
    {#key index}
        <h1 transition:slide class="text-black dark:text-white relative mx-0 max-w-[43.5rem] pt-5 md:mx-auto md:px-4 md:py-2 text-left tracking-tighter text-balance md:text-center font-semibold md:text-7xl lg:text-7xl sm:text-7xl text-5xl">The Fun & Easy Way To Learn <span>{greetings[index]}</span></h1>
    {/key}
    <div class="grid justify-items-center">
        <p></p>
        <p class="text-center font-light text-foreground mt-4 max-w-[42rem] text-lg sm:text-xl">No need to spend valuable time tackling lab environment setup, configurations, cleanups and repeating the process all the time.<span> <!-- -->&nbsp;Focus on your learning and skip the noise.</span></p>
        <p></p>
    </div>

    <div class="grid md:grid-cols-2 mt-10 mb-10 gap-4">
        <!-- Container for Xterm.js -->
        <div bind:this={terminalContainer} class="h-full border border-gray-700 rounded-xl overflow-hidden"></div>
        <div class="h-full border border-gray-700 rounded-xl overflow-hidden p-10">
          <img src="/learner.svg" alt="linux's banner" class="h-64 w-full rounded-md object-cover"/>
          <p class="text-center font-light text-foreground mt-4 max-w-[42rem] text-lg text-balance md:text-center font-semibold md:text-3xl lg:text-3xl sm:text-3xl text-2x">
            <span>
              We provide the environment for you to test, experiment and learn.
            </span>
          </p>
        </div>
    </div>

    <div class="w-full">
        <div class="flex flex-wrap justify-around gap-4">
            <Card.Root class="w-64 relative cursor-pointer transition delay-150 duration-300 ease-in-out hover:-translate-y-1 hover:scale-110" onclick={()=> {
                goto(`/dash/instances`)
              }}>
                <img src="/linux.png" alt="linux's banner" class="h-64 w-full rounded-md object-cover"/>
                <Card.Content>
                  <div class="flex flex-col">
                    <div>
                      <p class="text-muted-foreground"> </p>
                    </div>
                    <div>
                      <h1 class="mb-3 text-pretty text-2xl font-semibold truncate">Linux Training</h1>
                    </div>
                    <div>
                      <h1>Hands on Linux training</h1>
                    </div>
                  </div>
                </Card.Content>
                <Badge class="absolute bottom-0 right-0">Linux</Badge>
            </Card.Root>
            <Card.Root class="w-64 relative cursor-pointer transition delay-150 duration-300 ease-in-out hover:-translate-y-1 hover:scale-110" onclick={()=> {
                goto(`/dash/instances`)
              }}>
                <img src="/docker.png" alt="linux's banner" class="h-64 w-full rounded-md object-cover"/>
                <Card.Content>
                  <div class="flex flex-col">
                    <div>
                      <p class="text-muted-foreground"> </p>
                    </div>
                    <div>
                      <h1 class="mb-3 text-pretty text-2xl font-semibold truncate">Docker Training</h1>
                    </div>
                    <div>
                      <h1>Hands on docker training</h1>
                    </div>
                  </div>
                </Card.Content>
                <Badge class="absolute bottom-0 right-0">Docker</Badge>
            </Card.Root>
            <Card.Root class="w-64 relative cursor-pointer transition delay-150 duration-300 ease-in-out hover:-translate-y-1 hover:scale-110" onclick={()=> {
                goto(`/dash/kubernetes`)
              }}>
                <img src="/kubernetes.png" alt="linux's banner" class="h-64 w-full rounded-md object-cover"/>
                <Card.Content>
                  <div class="flex flex-col">
                    <div>
                      <p class="text-muted-foreground"> </p>
                    </div>
                    <div>
                      <h1 class="mb-3 text-pretty text-2xl font-semibold truncate">Kubernetes Training</h1>
                    </div>
                    <div>
                      <h1>Hnads on kubernetes training</h1>
                    </div>
                  </div>
                </Card.Content>
                <Badge class="absolute bottom-0 right-0">kubernetes</Badge>
            </Card.Root>
        </div>
    </div>    
</div>