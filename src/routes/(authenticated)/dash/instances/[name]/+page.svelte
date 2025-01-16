<script lang="ts">
	import { page } from "$app/stores";
	import { onMount } from "svelte";
	import type { PageServerData } from "./vm/$types";
	import { Button } from "$lib/components/ui/button";
    import Restart from "lucide-svelte/icons/rotate-cw";
	import type NoVncClient from "@novnc/novnc/lib/rfb";
	import Lesson from "$lib/components/viewer/lesson.svelte";
    let data: {
      data: PageServerData
    } = $props()
    let screen: HTMLElement
    let rfb: NoVncClient

    function ctrlC() {
        // Then send the C key press
        //rfb.sendKey(3);
    }

    onMount(async () => {
    {/* @ts-ignore */ null}
    if (data.data.instance?.status.printableStatus == "Running" && data.data.backend == "k8s") {
        const { default: RFB } = await import('@novnc/novnc/lib/rfb');

        let vmiName = $page.params.name;
        {/* @ts-ignore */ null}
        const url = `${data.data.operation_ks_url}/1.0/virtual-machines/${vmiName}/vnc?project=${data.data.project}`;

        // Creating a new RFB object will start a new connection
        rfb = new RFB(screen, url,{});
        //rfb.scaleViewport = true;
        //rfb.resizeSession = true;
        //rfb.clipViewport = true;
	    rfb.focus()

        // Add listeners to important events from the RFB module
        /* rfb.addEventListener("connect",  () => {});
        rfb.addEventListener("disconnect", () => {});
        rfb.addEventListener("credentialsrequired", () => {});
        rfb.addEventListener("desktopname", () => {}); */
    }
  })
</script>

<svelte:head>
    <title>{$page.params.name} Instance | SwiftCloud Labs</title>
</svelte:head>

<div class="container py-10">
    <div class="grid grid-cols-2 gap-4 place-content-between mb-10">
        <div class="flex h-5 items-center space-x-4 text-sm">
            {/* @ts-ignore */ null}
            <h1 class="text-2xl">{data.data.instance.metadata.name}</h1>
        </div>
        <div class="flex place-content-end h-5 items-center space-x-4 text-sm"> 
            <Button variant="secondary" onclick={() => ctrlC()}>
                Ctr+C
            </Button>
            <Button variant="destructive" onclick={() => rfb.sendCtrlAltDel()}>
                <Restart class="mr-2 size-4" /> Reboot
            </Button>
        </div>
    </div>
    <div class="flex max-lg:flex-wrap gap-4 place-content-between">
        <div class="flex-auto w-3/4" bind:this={screen}>
            <!-- This is where the remote screen will appear -->
        </div>
        <div class="flex-auto w-1/4">
            <Lesson />
        </div>
    </div>
</div>
