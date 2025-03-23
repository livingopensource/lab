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
        <div class="space-y-2">
            {error.message}
            <br />
        </div> 
    </div>
    {/await}
</div>

