<script lang="ts">
    import DataTable from "./data-table.svelte";
    import { columns } from "./columns";
    export let instances;
</script>

<div>
    {#await instances}
      <DataTable loading={true} data={instances} {columns}/>
    {:then instances}
      <DataTable loading={false} data={instances.metadata} {columns}/>
    {:catch error}
    <div class="flex items-center space-x-4">
      <div>
        <img src="/error.svg" alt="error" class="h-auto w-full" />
      </div>
        <div class="space-y-2">
            <p class="font-bold">{error.message}</p>
            <br />
        </div> 
    </div>
    {/await}
</div>

