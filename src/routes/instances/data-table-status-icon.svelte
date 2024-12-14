<script lang="ts">
  import type { instanceResponse } from "$lib/server/incus.types";
  import Circle from "lucide-svelte/icons/power-off";
  import CircleCheck from "lucide-svelte/icons/power";  
  let { instance }: { instance: instanceResponse["metadata"] } = $props();
</script>
{/* @ts-ignore */ null}
{#if instance.status == "Running"}
  <span class="flex gap-2"><CircleCheck class="text-green-500 size-4" />Running</span>
{:else}
  <span class="flex gap-2"><Circle class="size-4" />Stopped</span>
{/if}

