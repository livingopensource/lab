<script lang="ts">
  import type { instanceResponse } from "$lib/server/incus.types";
  import PowerOff from "lucide-svelte/icons/power-off";
  import PowerOn from "lucide-svelte/icons/power";
  import Loader from "lucide-svelte/icons/loader-circle";
	import type { VirtualMachine } from "$lib/server/k8s/vms.types";
  let { instance }: { instance: VirtualMachine | instanceResponse["metadata"] } = $props();
</script>
{/* @ts-ignore */ null}
{#if instance.status == "Running" || instance.status.printableStatus == "Running"}
  <span class="flex gap-2"><PowerOn class="text-green-500 size-4" />Running</span>
{:else}
  {/* @ts-ignore */ null}
  {#if instance.status != "Running" && instance.status.printableStatus != "Running" && instance.status.printableStatus != null && instance.status.printableStatus != "Stopped"}
  {/* @ts-ignore */ null}
	<span class="flex gap-2"><Loader class="size-4 animate-spin" />{instance.status.printableStatus}</span>
  {:else}
  	<span class="flex gap-2"><PowerOff class="size-4" />Stopped</span>
  {/if}
{/if}

