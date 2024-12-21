<script lang="ts">
	import { ModeWatcher, mode } from 'mode-watcher';
	import '../app.css';
	import NavigationLoader from '$lib/components/NavigationLoader.svelte';
	let { children } = $props();
	let color: string = $derived($mode == "light" ? "#007FFF" : "#D0D0D0")
</script>

<ModeWatcher />
<NavigationLoader animationDuration={250} {color} height={3} />
{@render children?.()}
