<script lang="ts" generics="TData, TValue">
  import { 
      type ColumnDef, 
      type SortingState,
      type PaginationState,
      getCoreRowModel,
      getPaginationRowModel,
   } from "@tanstack/table-core";
  import {
   createSvelteTable,
   FlexRender,
  } from "$lib/components/ui/data-table/index.js";
  import * as Table from "$lib/components/ui/table/index.js";
  import { Button } from "$lib/components/ui/button/index.js";
  import { goto } from "$app/navigation";
  
  type DataTableProps<TData, TValue> = {
   columns: ColumnDef<TData, TValue>[];
   data: TData[];
  };
  
  let { data, columns }: DataTableProps<TData, TValue> = $props();
  let pagination = $state<PaginationState>({ pageIndex: 0, pageSize: 10 });
  let sorting = $state<SortingState>([]);
  
  const table = createSvelteTable({
   get data() {
    return data;
   },
   columns,
   state: {
    get pagination() {
      return pagination;
    },
    get sorting() {
      return sorting;
    }
  },
  onSortingChange: (updater) => {
    if (typeof updater === "function") {
      sorting = updater(sorting);
    } else {
      sorting = updater;
    }
  },
  onPaginationChange: (updater) => {
    if (typeof updater === "function") {
      pagination = updater(pagination);
    } else {
      pagination = updater;
    }
  },
   getCoreRowModel: getCoreRowModel(),
  });
 </script>
  
 <div class="rounded-md border">
  <Table.Root>
   <Table.Header>
    {#each table.getHeaderGroups() as headerGroup (headerGroup.id)}
     <Table.Row>
      {#each headerGroup.headers as header (header.id)}
       <Table.Head>
        {#if !header.isPlaceholder}
         <FlexRender
          content={header.column.columnDef.header}
          context={header.getContext()}
         />
        {/if}
       </Table.Head>
      {/each}
     </Table.Row>
    {/each}
   </Table.Header>
   <Table.Body>
    {#each table.getRowModel().rows as row (row.id)}
     <Table.Row data-state={row.getIsSelected() && "selected"}>
      {#each row.getVisibleCells() as cell (cell.id)}
        {#if cell.id != row.id+"_actions"}
          <Table.Cell onclick={() => goto(`/dash/instances/${row.getValue("name")}`)} class="cursor-pointer">
           <FlexRender
            content={cell.column.columnDef.cell}
            context={cell.getContext()}
           />
          </Table.Cell>
        {:else}
          <Table.Cell>
            <FlexRender
             content={cell.column.columnDef.cell}
             context={cell.getContext()}
            />
         </Table.Cell>
        {/if}
      {/each}
     </Table.Row>
    {:else}
     <Table.Row>
      <Table.Cell colspan={columns.length} class="h-24 text-center">
       You don't have any kubernetes clusters yet.
      </Table.Cell>
     </Table.Row>
    {/each}
   </Table.Body>
  </Table.Root>
 </div>
 <div class="flex items-center justify-end space-x-2 py-4">
  <Button
    variant="outline"
    size="sm"
    onclick={() => table.previousPage()}
    disabled={!table.getCanPreviousPage()}
  >
    Previous
  </Button>
  <Button
    variant="outline"
    size="sm"
    onclick={() => table.nextPage()}
    disabled={!table.getCanNextPage()}
  >
    Next
  </Button>
</div>