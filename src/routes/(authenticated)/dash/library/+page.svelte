<script>
	import { browser } from "$app/environment";
	import { goto } from "$app/navigation";
	import { page } from "$app/stores";
	import * as Card  from "$lib/components/ui/card/index";
	import { Separator } from "$lib/components/ui/separator";
	import { Skeleton } from "$lib/components/ui/skeleton";
	import { fetchBooks } from "$lib/helpers/misc";
	import Book from "lucide-svelte/icons/book";
</script>

<svelte:head>
    <title>Library | SwiftCloud Labs</title>
</svelte:head>

<div class="container py-10 grid md:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-5 place-content-evenly">
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
            goto("/proxy?url="+lesson.url)
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