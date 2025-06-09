<script lang="ts">
	import { goto } from "$app/navigation";
    import { Button } from "$lib/components/ui/button";
    import Book from "lucide-svelte/icons/book-open-text"
    import * as Card from "$lib/components/ui/card/index.js";
	import type { PageServerData } from "./$types";

    let {data}: {
      data: PageServerData
    } = $props()
</script>

<svelte:head>
    <title>Tutorials | SwiftCloud Labs</title>
</svelte:head>

<div class="container py-10">
    <div class="grid grid-cols-2 gap-4 place-content-between">
        <div class="flex h-5 items-center space-x-4 text-sm">
        </div>
        <div>
          <Button class="float-right" href="/dash/lessons/new">
            Create New Tutorial
          </Button>
        </div>
      </div>
      <br />
    <main  class="container py-10 grid md:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-5 place-content-evenly">
        {#if data?.tutorials}
          {#await data?.tutorials}
            <p> Loading... </p>
          {:then tutorials}
           {#each tutorials as tutorial}
           <button
                type="button"
                onclick={() => goto(`/dash/lessons/${tutorial.id}`)}
                onkeydown={(e) => e.key === 'Enter' && goto(`/dash/lessons/${tutorial.id}`)}
                class="text-left w-full"
            >
              <Card.Root>
                  <Card.Header>
                      <Card.Title>{tutorial.title}</Card.Title>
                      <Card.Description></Card.Description>
                  </Card.Header>
                  <Card.Content>
                    <Book />
                 </Card.Content>
              </Card.Root>
            </button>
           {/each}
          {:catch error}
          <div class="flex items-center space-x-4">
            <div>
              <img src="/error.svg" alt="error" class="h-auto w-full" />
            </div>
              <div class="space-y-2">
                  <p class="font-bold">{error.message}</p>
                  <br />
              </div> 
          </div>
          {/await}
        {/if}
    </main>
</div>
