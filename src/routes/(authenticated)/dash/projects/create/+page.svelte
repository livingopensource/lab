<script lang="ts">
    import * as Form from "$lib/components/ui/form";
    import { Input } from "$lib/components/ui/input";
    import * as Card from "$lib/components/ui/card";
    import { formSchema } from "./schema";
    import {
      superForm,
    } from "sveltekit-superforms";
    import { zodClient } from "sveltekit-superforms/adapters";
    import { toast } from "svelte-sonner";
    import { goto } from "$app/navigation";
   
    let {data} = $props()
   
    const form = superForm(data.form, {
      validators: zodClient(formSchema),
      onUpdated: ({ form: f }) => {
        if (f.valid) {
          toast.success(`Creating project ${f.data.project} `);
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
              Create User Project
          </Card.Title>
          <Card.Description>
              Manage user project resource allocations.
          </Card.Description>
      </Card.Header>
      <Card.Content>
        <div class="grid md:grid-cols-2">
          <div class="order-2 md:order-1">
            <form method="POST" >
              <Form.Field {form} name="project">
                <Form.Control>
                  {#snippet children({ props })}
                    <Form.Label>Project Name</Form.Label>
                    <Input {...props} bind:value={$formData.project} />
                  {/snippet}
                </Form.Control>
                <Form.Description>The project name (email).</Form.Description>
                <Form.FieldErrors />
              </Form.Field>
              
              <Form.Field {form} name="instanceCount">
                <Form.Control>
                  {#snippet children({ props })}
                    <Form.Label>Instance Count </Form.Label>
                    <Input {...props} bind:value={$formData.instanceCount} type="number"/>
                  {/snippet}
                </Form.Control>
                <Form.FieldErrors />
              </Form.Field>
      
              <Form.Field {form} name="kubernetesNodeCount">
                <Form.Control>
                  {#snippet children({ props })}
                    <Form.Label>Kubernetes Nodes</Form.Label>
                    <Input {...props} bind:value={$formData.kubernetesNodeCount} type="number"/>
                  {/snippet}
                </Form.Control>
                <Form.FieldErrors />
              </Form.Field>
      
              <Form.Button type="submit">Create</Form.Button>
            </form>
          </div>
          <div class="order-1 md:order-2">
            <img src="/cluster.svg" alt="Create Instance" class="w-auto h-full" />
          </div>
      </div>
      </Card.Content>
    </Card.Root>
  </div>