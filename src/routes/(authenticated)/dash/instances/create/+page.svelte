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
	import * as Select from "$lib/components/ui/select/index";
	import { goto } from "$app/navigation";
 
  export let data
 
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
  let images: imagesResponse;

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

  console.log(data)
</script>


<svelte:head>
    <title>Create Instance | SwiftCloud Education</title>
</svelte:head>

<div class="container py-10">
  <div class="grid grid-cols-2 gap-4 place-content-between">
    <div class="flex h-5 items-center space-x-4 text-sm">
    </div>
    <div>
    </div>
  </div>
    <div>
      <form method="POST" use:enhance>
        <Form.Field {form} name="instanceName">
          <Form.Control>
            {#snippet children({ props })}
              <Form.Label>Name</Form.Label>
              <Input {...props} bind:value={$formData.instanceName} />
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
              >
                <Select.Trigger {...props}>
                  {$formData.image
                    ? $formData.image
                    : "Select an image to use"}
                </Select.Trigger>
                <Select.Content>
                  {#each images.metadata as image}
                    <Select.Item value="{image.aliases[0].name}" label="{image.properties.os} {image.properties.release} ({image.properties.variant} {image.type})" />
                  {/each}
                </Select.Content>
              </Select.Root>
            {/snippet}
          </Form.Control>
          <Form.Description>
            You can view available images from the <a href="/images"
              >images section</a
            >.
          </Form.Description>
          <Form.FieldErrors />
        </Form.Field>
        <Form.Button disabled={!data.canCreate} type="submit">Create</Form.Button>
      </form>
    </div>
</div>