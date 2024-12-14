import type { instanceResponse } from "$lib/server/incus.types";
import type { ColumnDef } from "@tanstack/table-core";
import { renderComponent } from "$lib/components/ui/data-table/index";
import DataTableActions from "./data-table-actions.svelte";
import DataTableNameSort from "./data-table-name-sort.svelte";
import DataTableStatusIcon from "./data-table-status-icon.svelte";

export const columns: ColumnDef<instanceResponse["metadata"]>[] = [
    {
        accessorKey: "name",
        header: ({ column }) =>
        renderComponent(DataTableNameSort, {
          onclick: () => column.toggleSorting(column.getIsSorted() === "asc"),
        }),
    },
    {
        accessorKey: "type",
        header: "Type"
    },
    {
        accessorKey: "status",
        header: "Status",
        cell: ({ row }) => {
           return renderComponent(DataTableStatusIcon, {
            instance: row.original
           })
        }
    },
    {
        accessorFn: (a) =>  a.config["image.os"]+" "+a.config["image.release"],
        header: "OS"
    },
    {
        id: "actions",
        cell: ({ row }) => {
          return renderComponent(DataTableActions, { instance: row.original });
        },
    }
];