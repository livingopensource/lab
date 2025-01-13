<script>
	// Import markdown conversion library
  import { marked } from 'marked'
  import { Textarea } from "$lib/components/ui/textarea/index";
  
	// Declare a variable to store the markdown data
  let markdown = $state("")
</script>

<h1>Markdown Editor</h1>

<!-- Declare a textarea where the user can enter markdown, and bind it to the variable `markdown` -->
<Textarea bind:value={markdown} placeholder="Enter markdown here" />
<br />
<!-- Convert the markdown to HTML and display it -->
<div class="w-full custom-render">{@html marked(markdown)}</div>


<style lang="postcss">
    :global(.custom-render h1) {
        @apply text-2xl;
    }

    :global(.custom-render h2) {
        @apply text-xl;
    }

    :global(.custom-render h3) {
        @apply text-lg;
    }
</style>
