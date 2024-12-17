<script lang="ts">
	import { ModeWatcher } from 'mode-watcher';
	import '../app.css';
	import NavigationLoader from '$lib/components/NavigationLoader.svelte';
	let { children } = $props();
</script>

<ModeWatcher />
<NavigationLoader animationDuration={250} color="#D0D0D0" height={3} />
{@render children?.()}
