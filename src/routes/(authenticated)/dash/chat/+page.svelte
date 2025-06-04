<script lang="ts">
  import { Textarea } from "$lib/components/ui/textarea";
  import { Button } from "$lib/components/ui/button";
  import { marked } from "marked";
  import { toast } from "svelte-sonner";

  let chat: { role: string; content: string }[] = $state([]); // Strongly type chat
  let input = $state('');
  let currentAssistantMessage = $state(''); // This will hold the streaming message
  let loading = $state(false); // Enable loading state for better UX

  async function sendMessage() {
      loading = true;
      toast.info("Thinking...");
      let error = null; // Clear previous errors

      // Add the user's message to the chat
      chat.push({ role: 'user', content: input });
      input = ''; // Clear input immediately

      currentAssistantMessage = ''; // Reset the streaming message for the new response

      try {
          const res = await fetch('/api/chat', {
              method: 'POST',
              headers: {
                  'Content-Type': 'application/json'
              },
              body: JSON.stringify([
                  { role: 'user', content: chat[chat.length -1].content } // Send only the latest user message or your full conversation history
              ])
          });

          if (!res.ok) {
              const errorText = await res.text();
              toast.error("Error: " + (res.statusText || errorText));
              loading = false;
              return;
          }

          const reader = res.body?.getReader();
          if (!reader) {
              toast.error("Failed to get reader from response body.");
              loading = false;
              return;
          }

          const decoder = new TextDecoder();
          let buffer = ''; // Use a buffer to handle partial JSON lines

          while (true) {
              const { done, value } = await reader.read();
              if (done) break;

              buffer += decoder.decode(value, { stream: true });
              
              // Process lines from the buffer
              const lines = buffer.split('\n');
              // Keep the last (potentially incomplete) line in the buffer
              buffer = lines.pop() || ''; 

              for (const line of lines) {
                  if (line.trim()) {
                      try {
                          const json = JSON.parse(line);
                          // Ollama's stream typically sends 'content' within 'message'
                          // or directly as 'response' depending on the API endpoint.
                          // Assuming `json.message.content` as per your observation.
                          if (json.message && json.message.content) {
                              currentAssistantMessage += json.message.content;
                          }
                      } catch (e: unknown) {
                          // Log the error but don't stop the stream for a single malformed line
                          console.warn("Could not parse chunk as JSON:", line, e);
                      }
                  }
              }
          }
          
          // After the stream is complete, add the full assistant message to chat
          chat.push({ role: "assistant", content: currentAssistantMessage });
          currentAssistantMessage = ''; // Clear the streaming message for the next turn

      } catch (e: any) {
          toast.error("An unexpected error occurred: " + e.message);
      } finally {
          loading = false;
      }
  }
</script>

<svelte:head>
<title>AI Conversation | SwiftCloud Labs</title>
</svelte:head>

<div class="p-6 max-w-7xl mx-auto space-y-4">
<div class="p-4 rounded h-full shadow space-y-2 h-96 overflow-y-auto">
  {#each chat as msg (msg.content)}
    <p class="p-2 inline-block rounded {msg.role === 'user' ? 'bg-blue-100 dark:bg-blue-900' : 'bg-gray-100 dark:bg-gray-900'}">
      {@html marked(msg.content)}
    </p>
  {/each}

  {#if currentAssistantMessage}
    <p class="p-2 inline-block rounded dark:bg-gray-900 bg-gray-100'">
      {@html marked(currentAssistantMessage)}
    </p>
  {/if}

  <Textarea name="message" bind:value={input} placeholder="Type a message..." class="flex-1" />
  <Button onclick={sendMessage} disabled={loading}>
      {loading ? 'Thinking...' : 'Send'}
  </Button>
</div>
</div>