<script lang="ts">
  import { Button } from "$lib/components/ui/button/index";
  import Play from "lucide-svelte/icons/play";
  import Stop from "lucide-svelte/icons/square";
  import Trash from "lucide-svelte/icons/trash";
  import * as AlertDialog from "$lib/components/ui/alert-dialog/index"
  import { buttonVariants } from "$lib/components/ui/button/index";
  import type { instanceResponse } from "$lib/server/incus.types";
  import {powerOn, powerOff} from "$lib/helpers/instance.client";
  import { invalidateAll } from "$app/navigation";
  import { toast } from "svelte-sonner";
  
  let { instance }: { instance: instanceResponse["metadata"] } = $props();
  let openAlert = $state(false);
</script>
  
<span class="flex gap-2">
  {#if instance.status == "Stopped"}
       <Button variant="ghost" onclick={() =>{
        powerOn(instance.name, instance.project)
        setTimeout(() => invalidateAll(), 1000)
       }}><Play /></Button>
  {/if}
  {#if instance.status == "Running"}
       <Button variant="ghost" onclick={() => {
        powerOff(instance.name, instance.project)
        setTimeout(() => invalidateAll(), 1000)
       }}><Stop /></Button>
  {/if}

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