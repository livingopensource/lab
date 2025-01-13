<script lang="ts">
	import ShadEditor from "$lib/components/shad-editor/shad-editor.svelte";
    let content = $state("");
</script>

<svelte:head>
    <title>Lessons | SwiftCloud Labs</title>
</svelte:head>

<div class="container py-10">
    <main class="my-10 flex h-full w-full flex-col items-center justify-center">
        <ShadEditor class="h-[40rem]" content={content} />
    </main>
</div>
