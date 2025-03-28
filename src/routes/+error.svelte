<script lang="ts">
	import { page } from "$app/stores";
    import { Button } from "$lib/components/ui/button"
</script>

<svelte:head>
    <title>Error {$page.status}</title>
</svelte:head>

<div class="container content-center w-screen h-screen">
    <div>
    </div>
    <div class="flex flex-col items-center justify-center">
        <img src="/error.svg" class="w-mid h-full" alt="Error" />
        <h1 class="text-9xl">{$page.status}</h1>
        <p class="text-4xl">{$page.error?.message}</p>
        <br />
        <div class="flex flex-col items-center justify-center">
            <Button href="/dash">Go Home</Button>
        </div>
    </div>
</div>