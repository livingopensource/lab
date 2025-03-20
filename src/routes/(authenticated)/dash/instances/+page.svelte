<script lang="ts">
	import type { PageServerData } from "./$types";
	import { Button } from "$lib/components/ui/button";
	import Instances from "./instances.svelte";

  let {data}: {
    data: PageServerData
  } = $props()
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
        Create Instance
      </Button>
    </div>
  </div>
  <br />
  <div>
    <Instances instances={data.instances}/>
  </div>
</div>