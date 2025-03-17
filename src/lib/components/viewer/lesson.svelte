<script lang="ts">
    let {
        content = "<h1><b>Hello World</b> Lesson</h1>" 
    } = $props();
</script>
<div class="container py-10">
    {@html content}
</div>