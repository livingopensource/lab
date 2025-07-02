<script lang="ts">
    import * as Form from "$lib/components/ui/form/index.js";
    import { Input } from "$lib/components/ui/input/index.js";
    import { Textarea } from "$lib/components/ui/textarea/index.js";
    import Trash from "lucide-svelte/icons/trash";
    import { formSchema } from "./schema";
   import * as AlertDialog from "$lib/components/ui/alert-dialog/index"
    import {
      superForm,
    } from "sveltekit-superforms";
    import { zodClient } from "sveltekit-superforms/adapters";
    import { Button, buttonVariants } from "$lib/components/ui/button";
	import type { PageServerData } from "./$types";
	import { toast } from "svelte-sonner";
	import { goto } from "$app/navigation";

    let {data}: {
      data: PageServerData
    } = $props()

    const form = superForm(data.form, {
    validators: zodClient(formSchema),
    onUpdated: ({ form: f }) => {
      if (f.valid) {
        toast.success(`Creating ${f.data.title} articles`);
        setTimeout(() => {
          goto("/dash/ai-tutor/articles");
        }, 3000);
      } else {
        toast.error("Please fix the errors in the form.");
      }
    }
  });
 
  const { form: formData, enhance } = form;

</script>

<svelte:head>
    <title>Lessons | SwiftCloud Labs</title>
</svelte:head>

<div class="container py-10">
    <main class="my-10 h-full w-full flex-col items-center justify-center">
        <form method="POST" action="?/update" use:enhance>
            <Form.Field {form} name="title">
              <Form.Control>
                {#snippet children({ props })}
                  <Form.Label>Title</Form.Label>
                  <Input {...props} bind:value={$formData.title} />
                {/snippet}
              </Form.Control>
              <Form.Description>The article title.</Form.Description>
              <Form.FieldErrors />
            </Form.Field>

            <Form.Field {form} name="contents">
                <Form.Control>
                  {#snippet children({ props })}
                    <Form.Label>Content</Form.Label>
                    <Textarea {...props} bind:value={$formData.contents} class="min-h-96 border-0 p-3 shadow-none focus-visible:ring-0"/>
                  {/snippet}
                </Form.Control>
                <Form.Description>The Content field.</Form.Description>
                <Form.FieldErrors />
              </Form.Field>
            <br />
            <Button type="submit">
                Update
            </Button>
        </form>
        <AlertDialog.Root>
          <AlertDialog.Trigger class={buttonVariants({ variant: "secondary" })}>
              <Trash />
          </AlertDialog.Trigger>
          <AlertDialog.Content>
            <AlertDialog.Header>
              <AlertDialog.Title>Are you absolutely sure?</AlertDialog.Title>
              <AlertDialog.Description>
                This action cannot be undone. This will permanently delete this article
              </AlertDialog.Description>
            </AlertDialog.Header>
            <AlertDialog.Footer>
              <AlertDialog.Cancel>Cancel</AlertDialog.Cancel>
              <form method="post" action="?/delete" >
                <AlertDialog.Action type="submit">Delete</AlertDialog.Action>
              </form>
            </AlertDialog.Footer>
          </AlertDialog.Content>
        </AlertDialog.Root>
    </main>
</div>
