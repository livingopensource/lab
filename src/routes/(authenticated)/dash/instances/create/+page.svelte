<script lang="ts">
  import * as Form from "$lib/components/ui/form/index.js";
  import { Input } from "$lib/components/ui/input/index.js";
  import { formSchema } from "./schema";
  import {
    superForm,
  } from "sveltekit-superforms";
  import { zodClient } from "sveltekit-superforms/adapters";
  import type { imagesResponse } from '$lib/server/incus.types';
	import { onMount } from "svelte";
	import { toast } from "svelte-sonner";
	import * as Select from "$lib/components/ui/select";
  import * as Card from "$lib/components/ui/card";
	import { goto } from "$app/navigation";
  import Warning from "lucide-svelte/icons/triangle-alert";
 
  let {data} = $props()
 
  const form = superForm(data.form, {
    validators: zodClient(formSchema),
    onUpdated: ({ form: f }) => {
      if (f.valid) {
        toast.success(`Creating ${f.data.instanceName} instance`);
        setTimeout(() => {
          goto("/dash/instances")
        }, 3000);
      } else {
        toast.error("Please fix the errors in the form.");
      }
    }
  });
 
  const { form: formData, enhance } = form;
  // svelte-ignore non_reactive_update
  let images: imagesResponse

  onMount(async () => {
    const res = await fetch("/api/images")
    if (!res.ok) {
      toast.error("Unable to fetch images", {
        description: "Unable to fetch OS images, please try refreshing the page"
      })
      return;
    }
    const fetchedImages: imagesResponse = await res.json();
    images = {
      type: fetchedImages.type,
      status: fetchedImages.status,
      status_code: fetchedImages.status_code,
      metadata: fetchedImages.metadata.filter((image) => {
        return image.aliases.length > 0;
      }) as [typeof fetchedImages.metadata[0]]
    };
  })
</script>


<svelte:head>
    <title>Create Instance | SwiftCloud Labs</title>
</svelte:head>

<div class="container py-10">
  <div class="grid grid-cols-2 gap-4 place-content-between">
    <div class="flex h-5 items-center space-x-4 text-sm">
    </div>
    <div>
    </div>
  </div>
  <Card.Root>
    <Card.Header>
        <Card.Title>
            Create Virtual Machine
        </Card.Title>
        <Card.Description>
            Create Virtual Machine lab instance.
        </Card.Description>
    </Card.Header>
    <Card.Content>
    <div class="grid md:grid-cols-2 gap-4">
      <div class="order-2 md:order-1">
        <form method="POST" use:enhance>
          <Form.Field {form} name="instanceName">
            <Form.Control>
              {#snippet children({ props })}
                <Form.Label>Name</Form.Label>
                <Input {...props} bind:value={$formData.instanceName} disabled={!data.canCreate} />
              {/snippet}
            </Form.Control>
            <Form.Description>The instance name.</Form.Description>
            <Form.FieldErrors />
          </Form.Field>
          
          <Form.Field {form} name="image">
            <Form.Control>
              {#snippet children({ props })}
                <Form.Label>Image</Form.Label>
                <Select.Root
                  type="single"
                  bind:value={$formData.image}
                  name={props.name}
                  onValueChange={(v) => {
                    $formData.instanceType = images.metadata.find((i) => i.aliases[0].name === v)?.type || "";
                  }}
                >
                  <Select.Trigger {...props}>
                    {$formData.image
                      ? $formData.image
                      : "Select an image to use"}
                  </Select.Trigger>
                  <Select.Content>
                    {#each images.metadata as image}
                      <Select.Item value={image.aliases[0].name} label="{image.properties.os} {image.properties.release} ({image.properties.variant} {image.type})" />
                    {/each}
                  </Select.Content>
                </Select.Root>
              {/snippet}
            </Form.Control>
            <Form.Description>
              Select an operating system to use with your instance.
            </Form.Description>
            <Form.FieldErrors />
          </Form.Field>
  
          <Form.Field {form} name="instanceType">
            <Form.Control>
              {#snippet children({ props })}
                <Input {...props} bind:value={$formData.instanceType} type="hidden"/>
              {/snippet}
            </Form.Control>
            <Form.FieldErrors />
          </Form.Field>
  
          <Form.Button disabled={!data.canCreate} type="submit">Create</Form.Button>
          {#if !data.canCreate}
            <div class="flex gap-2">
              <div class="my-5"><Warning /></div>
              <div><p class="text-sm text-foreground m-5"> {data.message} </p></div>
            </div>
          {/if}
        </form>
      </div>
      <div class="order-1 md:order-2">
        <img src="/computer-grid.svg" alt="computer grid" class="h-auto w-full" />
      </div>
    </div>
    </Card.Content>
    </Card.Root>
</div>