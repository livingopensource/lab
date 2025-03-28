<script lang="ts">
	import Slides from '$lib/deck/slide.svelte'
	import '../../../app.postcss'
	import type { PageData } from './$types';

  let {data}: {
    data: PageData
  } = $props()

</script>

<svelte:head>
	<title>Presentation</title>
</svelte:head>

<Slides presenatation={data.html} />