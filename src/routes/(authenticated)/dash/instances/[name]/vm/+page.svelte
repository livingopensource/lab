<script lang="ts">
	import { page } from "$app/stores";
	import { onMount } from "svelte";
	import type { PageServerData } from "./$types";

    let data: {
      data: PageServerData
    } = $props()
    let screen: HTMLElement

    onMount(async () => {
    if (data.data.instance?.status.printableStatus == "Running") {
        const { default: RFB } = await import('@novnc/novnc/lib/rfb');
        let rfb;
        let vmiName = $page.params.name;
        const url = `${data.data.operation_ks_url}/1.0/virtual-machines/${vmiName}/vnc?project=${data.data.project}`;

        // Creating a new RFB object will start a new connection
        rfb = new RFB(screen, url,{});
        //rfb.scaleViewport = true;
        //rfb.resizeSession = true;
        //rfb.clipViewport = true;

        // Add listeners to important events from the RFB module
        rfb.addEventListener("connect",  () => {});
        rfb.addEventListener("disconnect", () => {});
        rfb.addEventListener("credentialsrequired", () => {});
        rfb.addEventListener("desktopname", () => {});
    }
  })
</script>

<svelte:head>
    <title>{$page.params.name} Instance | SwiftCloud Labs</title>
</svelte:head>

<div class="container py-10">
    <div class="grid grid-cols-2 gap-4 place-content-between mb-10">
        <div class="flex h-5 items-center space-x-4 text-sm">
            <h1 class="text-2xl">{data.data.instance.metadata.name}</h1>
        </div>
        <div>
            <!-- This is where the remote screen will appear -->
        </div>
    </div>
    <div class="flex flex-wrap gap-4 place-content-between">
        <div class="flex-auto w-64" bind:this={screen}>
            <!-- This is where the remote screen will appear -->
        </div>
        <div class="flex-auto w-14">
        </div>
    </div>
</div>