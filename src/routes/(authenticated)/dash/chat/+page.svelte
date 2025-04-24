<script lang="ts">
    import { superForm } from "sveltekit-superforms";
    import { zodClient } from "sveltekit-superforms/adapters";
    import { formSchema } from "./schema";
    import { Textarea } from "$lib/components/ui/textarea";
    import { Button } from "$lib/components/ui/button";
    import { onMount } from 'svelte';
  
    export let data;
    const { form, enhance } = superForm(data.form, {
      validators: zodClient(formSchema)
    });
  
    let chat = data.chat;
  </script>
  
  <div class="p-6 max-w-7xl mx-auto space-y-4">
    <div class="p-4 rounded h-full shadow space-y-2 h-96 overflow-y-auto">
      {#each chat as msg}
        <div class={msg.role === 'user' ? 'text-right' : 'text-left'}>
          <p class="p-2 inline-block rounded dark:bg-gray-800
            {msg.role === 'user' ? 'bg-gray-300' : 'bg-gray-100'}">
            {msg.content}
          </p>
        </div>
      {/each}
      <form method="POST" class="flex gap-2" >
        <Textarea name="message" placeholder="Type a message..." class="flex-1" />
        <Button type="submit">Send</Button>
      </form>
    </div>
  </div>
  