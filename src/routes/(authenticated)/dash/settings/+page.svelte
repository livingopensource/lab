<script lang="ts">
  import * as Card from "$lib/components/ui/card"
  import * as Avatar from "$lib/components/ui/avatar"
  import * as Form from "$lib/components/ui/form"
  import {Skeleton} from "$lib/components/ui/skeleton";
  import { Input } from "$lib/components/ui/input"
  import { page } from "$app/stores";
  import { nickName } from "$lib/helpers/misc.js";
  import { toast } from "svelte-sonner";
  import { goto } from "$app/navigation";
  import { zodClient } from "sveltekit-superforms/adapters";
  import { superForm } from "sveltekit-superforms";
  import { formSchema } from "./schema";
	import { Button } from "$lib/components/ui/button";
	import { Search } from "lucide-svelte";

    let {data} = $props()

    const form = superForm(data.form, {
    validators: zodClient(formSchema),
    onUpdated: ({ form: f }) => {
      if (f.valid) {
        toast.success(`Creating ${f.data.name} instance`);
        setTimeout(() => {
          goto("/dashboard/organisers")
        }, 1000);
      } else {
        toast.error("Please fix the errors in the form.");
      }
    }
  });

  const { form: formData, enhance } = form;
</script>
<svelte:head>
    <title>Settings | SwiftCloud Labs</title>
</svelte:head>

<div class="container py-10 gap-5 place-content-evenly">
    <div class="grid grid-cols-2 gap-4 place-content-between">
      <div>
      </div>
      <div>
      </div>
    </div>
    <div>
      <Card.Root>
          <Card.Header>
              <Card.Title>
                  Profile Configurations
              </Card.Title>
              <Card.Description>
                  Manage your profile configurations.
              </Card.Description>
          </Card.Header>
          <Card.Content>
              <div class="grid grid-cols-2">
                <div></div>
                <div>
                    <Avatar.Root>
                      <Avatar.Image src={$page.data.session?.user?.image} alt="user avatar" />
                      <Avatar.Fallback>{nickName($page.data.session?.user?.name ?? "NA")}</Avatar.Fallback>
                    </Avatar.Root>
                    <form>
                        <Form.Field {form} name="name">
                          <Form.Control>
                            {#snippet children({ props })}
                              <Form.Label>Name</Form.Label>
                              <Input {...props} bind:value={$formData.name} />
                            {/snippet}
                          </Form.Control>
                          <Form.Description>Your name.</Form.Description>
                          <Form.FieldErrors />
                        </Form.Field>

                        <Form.Field {form} name="email">
                          <Form.Control>
                            {#snippet children({ props })}
                              <Form.Label>Email</Form.Label>
                              <Input disabled {...props} bind:value={$formData.email} />
                            {/snippet}
                          </Form.Control>
                          <Form.Description>Your email address.</Form.Description>
                          <Form.FieldErrors />
                        </Form.Field>
                    </form>
                </div>
              </div>
          </Card.Content>
      </Card.Root>
    </div>
    <br />
    {#if data.isAdmin}
    <div>
        <Card.Root>
            <Card.Header>
                <Card.Title>
                    User Projects
                </Card.Title>
                <Card.Description>
                    Manage all user projects configurations.
                </Card.Description>
            </Card.Header>
            <Card.Content class="overflow-x-auto">
                <div class="grid grid-cols-2 gap-4 place-content-between">
                  <div class="flex h-5 items-center space-x-4 text-sm mb-10">
                    <form method="GET" action="/dash/projects/user" >
                      <div class="mt-10 w-full mx-auto px-4 sm:px-6 lg:px-8">
                        <div class="relative">
                          <Input
                            name="email"
                            type="text"
                            class="p-4 block w-full rounded-full"
                            placeholder="Search for user by email address..."
                          />
                          <div class="absolute top-1/2 right-2 -translate-y-1/2">
                            <Button size="sm" variant="ghost" class="rounded-full">
                              <Search class="shrink-0 w-6 h-6" />
                            </Button>
                          </div>
                        </div>
                      </div>
                    </form>
                  </div>
                  <div>
                    <Button class="float-right" href="/dash/projects/create">
                      Create Project
                    </Button>
                  </div>
                </div>
                {#await data.projects}
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
                {:then projects}
                    {#each projects.metadata as project}
                        <a href="/dash/projects/{project.split("/")[project.split("/").length - 1]}">{project.split("/")[project.split("/").length - 1]}</a> <br />
                    {/each}
                {:catch err}
                    <p>Error loading projects</p>
                {/await}
            </Card.Content>
        </Card.Root>
    </div>
    {/if}
</div>