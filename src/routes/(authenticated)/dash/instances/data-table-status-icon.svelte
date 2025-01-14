<script lang="ts">
  import type { instanceResponse } from "$lib/server/incus.types";
  import Circle from "lucide-svelte/icons/power-off";
  import CircleCheck from "lucide-svelte/icons/power";  
	import type { VirtualMachine } from "$lib/server/k8s/vms.types";
  let { instance }: { instance: VirtualMachine | instanceResponse["metadata"] } = $props();
</script>
{/* @ts-ignore */ null}
{#if instance.status == "Running" || instance.status.printableStatus == "Running"}
  <span class="flex gap-2"><CircleCheck class="text-green-500 size-4" />Running</span>
{:else}
  {#if instance.status != "Running" && instance.status.printableStatus != "Running" && instance.status.printableStatus != null}
	<span class="flex gap-2"><Circle class="size-4" />{instance.status.printableStatus}</span>
  {:else}
  	<span class="flex gap-2"><Circle class="size-4" />Stopped</span>
  {/if}
{/if}

