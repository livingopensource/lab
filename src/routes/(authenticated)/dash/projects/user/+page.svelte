<script lang="ts">
	import { goto } from "$app/navigation";
    import * as Card from "$lib/components/ui/card";
    import * as Form from "$lib/components/ui/form";
    import { Input } from "$lib/components/ui/input";
    import { Skeleton } from "$lib/components/ui/skeleton";
	import { toast } from "svelte-sonner";
	import { superForm } from "sveltekit-superforms";
	import { zodClient } from "sveltekit-superforms/adapters";
    import { formSchema } from "./schema";
	import type { PageServerData } from "./$types";

    export let data: PageServerData;

    $: instances = 0;

    const form = superForm(data.form, {
      validators: zodClient(formSchema),
      onUpdated: ({ form: f }) => {
        if (f.valid) {
          toast.success(`Updating project `);
          setTimeout(() => {
            goto("/dash/settings")
          }, 3000);
        } else {
          toast.error("Please fix the errors in the form.");
        }
      }
    });
   
    const { form: formData, enhance } = form;
</script>

<div class="container py-10 gap-5 place-content-evenly">
    <Card.Root>
        <Card.Header>
            <Card.Title>
                Project for {data.email}
            </Card.Title>
            <Card.Description>
                Manage user projects configurations.
            </Card.Description>
        </Card.Header>
        <Card.Content>
            <div class="grid grid-cols-2 gap-4 place-content-between">
              <div class="flex h-5 items-center space-x-4 text-sm mb-10">

              </div>
              <div>
               
              </div>
            </div>
            {#await data.projectDetails}
            <div class="flex items-center space-x-4">
                <div class="space-y-2">
                  <Skeleton class="h-4 w-[250px]" />
                  <Skeleton class="h-4 w-[200px]" />
                </div>
              </div>
              <br />
              <div class="flex items-center space-x-4">
                <div class="space-y-2">
                  <Skeleton class="h-4 w-[250px]" />
                  <Skeleton class="h-4 w-[200px]" />
                </div>
              </div>
              <br />
              <div class="flex items-center space-x-4">
                <div class="space-y-2">
                  <Skeleton class="h-4 w-[250px]" />
                  <Skeleton class="h-4 w-[200px]" />
                </div>
              </div>
            {:then project}
                {#if project == null}
                   <p> No project found for this email address</p>
                {:else}
                    <form method="POST" >
                        <Form.Field {form} name="instanceCount">
                          <Form.Control>
                            {#snippet children({ props })}
                              <Form.Label>Instance Count</Form.Label>
                              <Input {...props} bind:value={project.metadata.config["limits.instances"]} />
                            {/snippet}
                          </Form.Control>
                          <Form.Description>The total number of instances a user can create.</Form.Description>
                          <Form.FieldErrors />
                        </Form.Field>
                    </form>
                {/if}
            {:catch err}
                <p>Error loading projects</p>
            {/await}
        </Card.Content>
    </Card.Root>
</div>