<script lang="ts">
  import DataTable from "./data-table.svelte";
  import { columns } from "./columns";
	import type { PageServerData } from "./$types";
  import { source } from 'sveltekit-sse';
	import { Button } from "$lib/components/ui/button";
	import { invalidateAll } from "$app/navigation";
	import { onMount } from "svelte";
	import { toast } from "svelte-sonner";

  let data: {
    data: PageServerData
  } = $props();

  let event: string = $state("")

  onMount(async () => {
  const connection = source('/api/sse-events', {
    close({ connect }) {
      console.log("reconnecting")
      connect()
    }
  })

  const sse = connection.select("message")
  sse.subscribe(async (message) => {
    event = message
  })

  });

  $effect(() => {
    if (event == "deleted vmi") {
      toast.success("Powered off", {
        description: "Machine gracefully powered off"
      })
    }
    invalidateAll()
  })
 
</script>
<svelte:head>
    <title>Instances | SwiftCloud Labs</title>
</svelte:head>

<div class="container py-10">
  <div class="grid grid-cols-2 gap-4 place-content-between">
    <div class="flex h-5 items-center space-x-4 text-sm">
    </div>
    <div>
      <Button class="float-right" href="/dash/instances/create">
        Create New Instance
      </Button>
    </div>
  </div>
  <br />
  <div>
    {/* @ts-ignore */ null}
    <DataTable data={data.data.instances} {columns} />
  </div>
</div>