<script lang="ts">
  import { Textarea } from "$lib/components/ui/textarea";
  import { Button } from "$lib/components/ui/button";
  import { marked } from "marked";
  import { toast } from "svelte-sonner";
  import { tick } from 'svelte';
  import CornerDownLeft from "lucide-svelte/icons/corner-down-left";
  import * as Tooltip from "$lib/components/ui/tooltip/index.js";
  import Mic from "lucide-svelte/icons/mic";
	import type { PageServerData } from "./$types";

  let {data}: {
      data: PageServerData
    } = $props()
  // Strongly type the chat messages, matching Ollama's expected format
  type ChatMessage = {
      role: 'user' | 'assistant' | 'system';
      content: string;
      type?: 'text' | 'mermaid'; // For internal Svelte rendering logic
      id?: string; // For MermaidDiagram component
  };

  let chat: ChatMessage[] = $state([]);
  let input = $state('');
  let currentAssistantMessage = $state('');
  let loading = $state(false);
  let error: string | null = $state(null);

  let chatContainer: HTMLDivElement;

  function extractMermaidCode(text: string): { text: string; diagram: string | null } {
      const mermaidRegex = /```mermaid\n([\s\S]*?)\n```/g;
      let diagramCode: string | null = null;
      let cleanedText = text;

      const match = mermaidRegex.exec(text);
      if (match && match[1]) {
          diagramCode = match[1].trim();
          cleanedText = text.replace(match[0], '').trim();
      }
      return { text: cleanedText, diagram: diagramCode };
  }

  async function scrollToBottom() {
      await tick();
      if (chatContainer) {
          chatContainer.scrollTop = chatContainer.scrollHeight;
      }
  }

  $effect(() => {
      if (currentAssistantMessage) {
          scrollToBottom();
      }
  });

  $effect(() => {
      if (chat.length > 0) {
          scrollToBottom();
      }
  });

  async function sendMessage() {
      loading = true;
      toast.info("Thinking...");
      error = null;

      // Create the messages array to send to Ollama
      // This will include all previous 'user' and 'assistant' messages
      // plus the current user input.
      const messagesToSend: { role: 'user' | 'assistant' | 'system', content: string }[] = [];

      // Add previous chat history (only role and content)
      chat.forEach(msg => {
          if (msg.type === 'text') { // Only include text messages for context
              messagesToSend.push({ role: msg.role, content: msg.content });
          }
          // You might need to decide how to handle Mermaid diagrams in context.
          // For now, we're only sending text. If the model needs to "see"
          // the diagram definition, you'd include `msg.content` for mermaid type too.
      });

      // Add the current user message to the history
      messagesToSend.push({ role: 'user', content: input });
      
      // Optimistically add user message to the displayed chat
      chat.push({ role: 'user', content: input, type: 'text' });
      input = ''; // Clear input immediately

      currentAssistantMessage = ''; // Reset streaming message

      try {
          const res = await fetch('/api/chat', { // Your SvelteKit API route
              method: 'POST',
              headers: { 'Content-Type': 'application/json' },
              body: JSON.stringify(messagesToSend) // Send the full history
          });

          if (!res.ok) {
              const errorData = await res.text();
              toast.error("Error: " + (res.statusText || errorData));
              throw new Error(res.statusText || errorData || 'Failed to get response from server');
          }

          const reader = res.body?.getReader();
          if (!reader) {
              toast.error("Failed to get reader from response body.");
              throw new Error('Failed to get reader from response body.');
          }

          const decoder = new TextDecoder();
          let buffer = '';
          
          while (true) {
              const { done, value } = await reader.read();
              if (done) break;

              buffer += decoder.decode(value, { stream: true });
              
              const lines = buffer.split('\n');
              buffer = lines.pop() || ''; 

              for (const line of lines) {
                  if (line.trim()) {
                      try {
                          const json = JSON.parse(line);
                          if (json.message && json.message.content) {
                              currentAssistantMessage += json.message.content;
                          }
                      } catch (e: unknown) {
                          console.warn("Could not parse chunk as JSON:", line, e);
                      }
                  }
              }
          }
          
          // After stream is complete, process the final assistant message
          const { text, diagram } = extractMermaidCode(currentAssistantMessage);

          if (text) {
              chat.push({ role: "assistant", content: text, type: 'text' });
          }
          if (diagram) {
              const diagramId = `mermaid-diagram-${chat.length}`; 
              chat.push({ role: "assistant", content: diagram, type: 'mermaid', id: diagramId });
          }

          currentAssistantMessage = ''; 

      } catch (e: any) {
          error = e.message;
          toast.error("An unexpected error occurred: " + e.message);
      } finally {
          loading = false;
      }
  }

  async function enterKey(event: Event) {
    //@ts-ignore
    if (event.code === "Enter") {
      await sendMessage();
    }
  }
</script>

<svelte:head>
<title>AI Tutor| SwiftCloud Labs</title>
</svelte:head>

<div class="p-6 max-w-7xl mx-auto space-y-4">
  <div class="grid grid-cols-2 gap-4 place-content-between">
    <div class="flex h-5 items-center space-x-4 text-sm">
    </div>
    <div>
      {#if data.isAdmin}
      <Button class="float-right" href="/dash/ai-tutor/articles">
        Articles
      </Button>
      {/if}
    </div>
  </div>
  <div class="p-4 rounded h-full shadow space-y-2 h-96 overflow-yidden">
    <div class="bg-muted/50 relative flex h-full min-h-[50vh] flex-col rounded-xl p-4 lg:col-span-2">
         
      <div class="flex-1">
        <div bind:this={chatContainer} class="p-4 rounded shadow space-y-2 h-[60lvh] overflow-y-auto">
          {#each chat as msg (msg.content + msg.role)}
            {#if msg.type === 'text'}
              <p class="p-2 inline-block rounded {msg.role === 'user' ? 'bg-blue-100 dark:bg-blue-900' : ''}">
                {@html marked(msg.content)}
              </p>
              <br />
            {/if}
          {/each}
            
          {#if currentAssistantMessage}
            <p class="p-2 inline-block rounded '">
              {@html marked(currentAssistantMessage)}
            </p>
          {/if}
        </div>
      </div>

      <div class="flex gap-2 items-end">
      <Textarea
      onkeypress={enterKey}
     bind:value={input} placeholder="Ask LOSF Trainer..." 
       class="min-h-12 resize-none border-0 p-3 shadow-none focus-visible:ring-0"
     />
      <div class="flex items-center p-3 pt-0">
        <Tooltip.Root>
          <Tooltip.Trigger>
            <Button variant="ghost" size="icon" onclick={() => {
             toast.error("Not implemented yet, coming soon");
            }} >
              <Mic class="size-4" />
              <span class="sr-only">Use Microphone</span>
            </Button>
          </Tooltip.Trigger>
          <Tooltip.Content side="top">Use Microphone</Tooltip.Content>
        </Tooltip.Root>
        <Button onclick={sendMessage} size="sm" class="ml-auto gap-1.5" disabled={loading}>
         {loading ? 'Thinking...' : ''}
          <CornerDownLeft class="size-4" />
        </Button>
       </div>
      </div>
    </div>
  </div>
</div>