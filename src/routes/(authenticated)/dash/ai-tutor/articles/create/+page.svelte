<script lang="ts">
  import * as Form from "$lib/components/ui/form/index.js";
  import { Input } from "$lib/components/ui/input/index.js";
  import { formSchema } from "../[id]/schema";
  import {
    superForm,
  } from "sveltekit-superforms";
  import { zodClient } from "sveltekit-superforms/adapters";
  import { Textarea } from "$lib/components/ui/textarea/index.js";
  import { Button } from "$lib/components/ui/button";
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
    <title>Create Lessons | SwiftCloud Labs</title>
</svelte:head>

<div class="container py-10">
    <main class="my-10 h-full w-full flex-col items-center justify-center">
        <form method="POST" use:enhance>
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
                    <Textarea {...props} bind:value={$formData.contents} placeholder="Write your article here ..." class="min-h-96 border-0 p-3 shadow-none focus-visible:ring-0"/>
                  {/snippet}
                </Form.Control>
                <Form.Description>The Content field.</Form.Description>
                <Form.FieldErrors />
              </Form.Field>
            <br />
            <Button type="submit">
                Save
            </Button>
        </form>
    </main>
</div>
