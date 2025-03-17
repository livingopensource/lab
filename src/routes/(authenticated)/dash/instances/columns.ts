import type { instanceResponse } from "$lib/server/incus.types";
import type { ColumnDef } from "@tanstack/table-core";
import { renderComponent } from "$lib/components/ui/data-table/index";
import DataTableActions from "./data-table-actions.svelte";
import DataTableNameSort from "./data-table-name-sort.svelte";
import DataTableStatusIcon from "./data-table-status-icon.svelte";
import type { VirtualMachine } from "$lib/server/k8s/vms.types";

export const columns: ColumnDef<VirtualMachine | instanceResponse["metadata"]>[] = [
    {
        id: "name",
        accessorFn: (a) => {
            //@ts-expect-error a.name is not defined if running k8s implementation
            return a?.name ?? a?.metadata?.name},
        header: ({ column }) =>
        renderComponent(DataTableNameSort, {
          onclick: () => column.toggleSorting(column.getIsSorted() === "asc"),
        }),
    },
    {
        id: "type",
        accessorFn: (a) => {
            //@ts-expect-error a.type is not defined if running k8s implementation
            return a.type ?? a.kind
        },
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
        id: "os",
        accessorFn: (a) =>  {
            //@ts-expect-error a.config is not defined if running k8s implementation
            if (a.config?.["image.os"] != undefined) {
            //@ts-expect-error a.config is not defined if running k8s implementation
            return a.config?.["image.os"]+" "+a.config?.["image.release"]
            }
            //@ts-expect-error a.config is not defined if running k8s implementation
            return a.metadata?.labels?.["kubevirt.io/os"]
        },
        header: "OS"
    },
    {
        id: "actions",
        header: "Actions",
        cell: ({ row }) => {
          return renderComponent(DataTableActions, { instance: row.original });
        },
    }
];