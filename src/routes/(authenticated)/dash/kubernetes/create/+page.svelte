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
    import * as Card from "$lib/components/ui/card";
    import { goto } from "$app/navigation";
    import Warning from "lucide-svelte/icons/triangle-alert";
   
    let {data} = $props()
   
    const form = superForm(data.form, {
      validators: zodClient(formSchema),
      onUpdated: ({ form: f }) => {
        if (f.valid) {
          toast.success(`Creating ${f.data.name} cluster`);
          setTimeout(() => {
            goto("/dash/kubernetes")
          }, 3000);
        } else {
          toast.error("Please fix the errors in the form.");
        }
      }
    });
   
    const { form: formData, enhance } = form;
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
      <title>Create Kubernetes Cluster | SwiftCloud Labs</title>
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
              Create Kubernetes Cluster
          </Card.Title>
          <Card.Description>
              Create a new Kubernetes cluster.
          </Card.Description>
      </Card.Header>
      <Card.Content>
      <div class="grid md:grid-cols-2 space-x-4">
        <div class="order-2 md:order-1">
          <form method="POST" use:enhance>
            <Form.Field {form} name="name">
              <Form.Control>
                {#snippet children({ props })}
                  <Form.Label>Name</Form.Label>
                  <Input {...props} bind:value={$formData.name} disabled={!data.canCreate} />
                {/snippet}
              </Form.Control>
              <Form.Description>The cluster name.</Form.Description>
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
          <img src="/ship.svg" alt="Kubernetes" class="w-auto h-full" />
        </div>
      </div>
      </Card.Content>
    </Card.Root>
  </div>