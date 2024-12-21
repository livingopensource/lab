<script lang="ts">
	import { browser } from "$app/environment";
	import { goto } from "$app/navigation";
	import { page } from "$app/stores";
	import * as Card  from "$lib/components/ui/card/index";
	import * as Pagination from "$lib/components/ui/pagination/index"
	import { Separator } from "$lib/components/ui/separator";
	import { Skeleton } from "$lib/components/ui/skeleton";
	import { fetchBooks } from "$lib/helpers/misc";
	import Book from "lucide-svelte/icons/book";

  let pdfCanvas: HTMLCanvasElement
  let lessonDoc: string = $state("/LFCS.pdf")
  let pageNumber: number = $state(1);
  let totalPages: number = $state(0);
  let pathName: string =$page.url.pathname
  $page.url.searchParams.get("doc") && (lessonDoc = $page.url.searchParams.get("doc")!)
  $page.url.searchParams.get("page") && (pageNumber = parseInt($page.url.searchParams.get("page")!))

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
</script>

<svelte:head>
    <title>Library | SwiftCloud Labs</title>
</svelte:head>

<div class="container py-10 flex flex-wrap place-content-evenly">
  <div>
    <canvas use:loadPDF="{{ url: lessonDoc}}" bind:this={pdfCanvas}></canvas>
    <div class="m-6 overflow-x-auto">
      <Pagination.Root class="w-max" count={totalPages} perPage={1} page={pageNumber} onPageChange={(page) => {
        pageNumber = page
        goto(pathName+"?page="+pageNumber+"&doc=/proxy?url="+lessonDoc)
        loadPDF(pdfCanvas, {url: lessonDoc})
      }}>
        {#snippet children({ pages, currentPage })}
          <Pagination.Content>
            <Pagination.Item>
              <Pagination.PrevButton onclick={() => {
                pageNumber - 1
                goto($page.url.pathname+"?page="+pageNumber+"&doc=/proxy?url="+lessonDoc)
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
                goto($page.url.pathname+"?page="+pageNumber+"&doc=/proxy?url="+lessonDoc)
                loadPDF(pdfCanvas, {url: lessonDoc})
              }}/>
            </Pagination.Item>
          </Pagination.Content>
        {/snippet}
      </Pagination.Root>
    </div>
  </div>
  <div>
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
            pageNumber - 1
            goto($page.url.pathname+"?page="+pageNumber+"&doc=/proxy?url="+lessonDoc)
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
          <div class="flex items-center space-x-4">{error}</div>
      {/await}
    {/if} 
  </div>
</div>