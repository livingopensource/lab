<script lang="ts">
	import { page } from "$app/stores";
	import { onMount } from "svelte";
    import PowerOff from "lucide-svelte/icons/power-off";
    import Restart from "lucide-svelte/icons/rotate-cw";
    import FullScreen from "lucide-svelte/icons/fullscreen";
	import type NoVncClient from "@novnc/novnc/lib/rfb";
	import Lesson from "$lib/components/viewer/lesson.svelte";
    import { buttonVariants } from "$lib/components/ui/button";
    import * as Tooltip from "$lib/components/ui/tooltip/index.js";

    let {
      data
    } = $props()
    let screen: HTMLElement
    let rfb: NoVncClient

    onMount(async () => {
    {/* @ts-ignore */ null}
    if (data.instance?.status.printableStatus == "Running" && data.backend == "k8s") {
        const { default: RFB } = await import('@novnc/novnc/lib/rfb');

        let vmiName = $page.params.name;
        {/* @ts-ignore */ null}
        const url = `${data.operation_ks_url}/1.0/virtual-machines/${vmiName}/vnc?project=${data.project}`;

        // Creating a new RFB object will start a new connection
        rfb = new RFB(screen, url,{});
        rfb.scaleViewport = true
        rfb.showDotCursor = true
	    rfb.focus()
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
            <h1 class="text-2xl uppercase">{data.instance.metadata.name}</h1>
        </div>
        <div class="flex place-content-end h-5 items-center space-x-4 text-sm"> 
            {#if data.instance?.status.printableStatus == "Running"}
            <Tooltip.Provider>
                <Tooltip.Root>
                    <Tooltip.Trigger class={buttonVariants({ variant: "secondary" })}
                        onclick={() => {screen.requestFullscreen()}}>
                        <FullScreen class="mr-2 size-4" />
                    </Tooltip.Trigger>
                    <Tooltip.Content>
                        Enter fullscreen
                    </Tooltip.Content>
                </Tooltip.Root>
            </Tooltip.Provider>
            <Tooltip.Provider>
                <Tooltip.Root>
                    <Tooltip.Trigger class={buttonVariants({ variant: "secondary" })}
                        onclick={() => rfb.sendCtrlAltDel()}>
                        <Restart class="mr-2 size-4" /> Reboot
                    </Tooltip.Trigger>
                    <Tooltip.Content>
                        Reboot machine
                    </Tooltip.Content>
                </Tooltip.Root>
            </Tooltip.Provider>
            {:else}
            <Tooltip.Provider>
                <Tooltip.Root>
                    <Tooltip.Trigger class={buttonVariants({ variant: "secondary" })}
                        disabled>
                        <FullScreen class="mr-2 size-4" />
                    </Tooltip.Trigger>
                    <Tooltip.Content>
                        Enter fullscreen
                    </Tooltip.Content>
                </Tooltip.Root>
            </Tooltip.Provider>
            <Tooltip.Provider>
                <Tooltip.Root>
                    <Tooltip.Trigger class={buttonVariants({ variant: "destructive" })}
                        disabled>
                        <Restart class="mr-2 size-4" /> Reboot
                    </Tooltip.Trigger>
                    <Tooltip.Content>
                        Reboot machine
                    </Tooltip.Content>
                </Tooltip.Root>
            </Tooltip.Provider>
            {/if}
        </div>
    </div>
    <div class="flex max-lg:flex-wrap gap-4 place-content-between">
        <div class="flex-auto w-3/4" bind:this={screen}>
            <!-- This is where the remote screen will appear -->
             {#if data.instance?.status.printableStatus != "Running"}
                <div class="grid place-content-center">
                    <PowerOff size=130/>
                </div>
             {/if}
        </div>
        <div class="flex-auto w-1/4">
            <Lesson />
        </div>
    </div>
</div>
