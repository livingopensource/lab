<script lang="ts">
	import { ModeWatcher, mode } from 'mode-watcher';
	import '../app.css';
	import NavigationLoader from '$lib/components/NavigationLoader.svelte';
	let { children } = $props();
	let color: string = "#EB601A";
</script>

<ModeWatcher />
<NavigationLoader animationDuration={250} {color} height={3} />
{@render children?.()}
