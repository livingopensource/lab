<script lang="ts">
  import { Button } from "$lib/components/ui/button/index";
  import Play from "lucide-svelte/icons/play";
  import Stop from "lucide-svelte/icons/square";
  import Trash from "lucide-svelte/icons/trash";
  import Edit from "lucide-svelte/icons/pencil"
  import * as AlertDialog from "$lib/components/ui/alert-dialog/index"
  import { buttonVariants } from "$lib/components/ui/button/index";
import type { instanceResponse } from "$lib/server/incus.types";
  import {powerOn, powerOff, renameInstance} from "$lib/helpers/instance.client"
import { invalidateAll } from "$app/navigation";
import * as Sheet from "$lib/components/ui/sheet/index";
import { Label } from "$lib/components/ui/label";
import { Input } from "$lib/components/ui/input";
import { toast } from "svelte-sonner";
  
  let { instance }: { instance: instanceResponse["metadata"] } = $props();
  let newInstanceName: string = $state(instance.name)
  let openAlert = $state(false);
  let openInstanceRename = $state(false);
 </script>
  
 <span class="flex gap-2">
  {#if instance.status == "Stopped"}
       <Button variant="ghost" onclick={() =>{
        powerOn(instance.name)
        setTimeout(() => invalidateAll(), 1000)
       }}><Play /></Button>
  {/if}
  {#if instance.status == "Running"}
       <Button variant="ghost" onclick={() => {
        powerOff(instance.name)
        setTimeout(() => invalidateAll(), 1000)
       }}><Stop /></Button>
  {/if}
  <Sheet.Root bind:open={openInstanceRename}>
    <Sheet.Trigger class="float-right">
      <Button variant="ghost"> <Edit /></Button>
    </Sheet.Trigger>
    <Sheet.Content side="right">
      <Sheet.Header>
        <Sheet.Title>Rename {instance.name} Instance</Sheet.Title>
        <Sheet.Description>
          Give your instance a new name
        </Sheet.Description>
      </Sheet.Header>
      <div class="grid gap-4 py-4">
        <div class="grid grid-cols-4 items-center gap-4">
          <Label for="name" class="text-right">Name</Label>
          <Input id="name" bind:value={newInstanceName} class="col-span-3" required />
        </div>
      </div>
      <Sheet.Footer>
        <Button class={buttonVariants({ variant: "default" })} onclick={async () => {
            if (newInstanceName != instance.name 
                && newInstanceName != ""
            ) {
                renameInstance(instance.name, newInstanceName)
                openInstanceRename = false;
                setTimeout(() => invalidateAll(), 1000)
            } else {
                toast.error("Provide a new name", {
                    description: "The new name is required"
                })
            }
        }}>
          Save
        </Button>
      </Sheet.Footer>
    </Sheet.Content>
  </Sheet.Root>
  <AlertDialog.Root bind:open={openAlert}>
    <AlertDialog.Trigger class={buttonVariants({ variant: "secondary" })}>
        <Trash />
    </AlertDialog.Trigger>
    <AlertDialog.Content>
      <AlertDialog.Header>
        <AlertDialog.Title>Are you absolutely sure?</AlertDialog.Title>
        <AlertDialog.Description>
          This action cannot be undone. This will permanently delete the instance
          {instance.name} and remove the associated data.
        </AlertDialog.Description>
      </AlertDialog.Header>
      <AlertDialog.Footer>
        <AlertDialog.Cancel>Cancel</AlertDialog.Cancel>
        <AlertDialog.Action onclick={ async () => {
          const res = await fetch(`/api/${instance.name}`, {
            method: "DELETE"
          })
          if (res.ok) {
            toast.success("Instance deleted", {
              description: "Instance has been successfully deleted"
            })
            setTimeout(() => invalidateAll(), 1000)
          } else {
            toast.error("Instance delete failed", {
              description: `Unable to delete ${instance.name} instance`
            })
          }
          openAlert = false
        }}>Continue</AlertDialog.Action>
      </AlertDialog.Footer>
    </AlertDialog.Content>
  </AlertDialog.Root>
 </span>