<script lang="ts">
    import { page } from "$app/stores"
</script>

<svelte:head>
    <title>Error {$page.status}</title>
</svelte:head>

<div class="container content-center w-screen h-screen">
    <div>
    </div>
    <div class="flex flex-col items-center justify-center">
        <h1 class="text-9xl">{$page.status}</h1>
        <p class="text-4xl">{$page.error?.message}</p>
    </div>
</div>