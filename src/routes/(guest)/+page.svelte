<script lang="ts">
   import { onMount, onDestroy } from 'svelte';
   import { slide } from 'svelte/transition';
	
	let greetings = ['Linux', 'Docker', 'Kubernetes'];
    let images = ["linux.png", "docker.png", "kubernetes.png"];
	let index = 0;
	let roller: string | number | NodeJS.Timeout | undefined;
	
	onMount(() => {
		roller = setInterval(() => {
			if (index === greetings.length - 1) index = 0;
			else index++;
		}, 3000);
	});
	
	onDestroy(() => {
		clearInterval(roller);
	});
</script>

<svelte:head>
    <title>Welcome | Anvil Cloud</title>
</svelte:head>

<div class="container py-10">
    {#key index}
        <h1 transition:slide class="text-black dark:text-white relative mx-0 max-w-[43.5rem] pt-5 md:mx-auto md:px-4 md:py-2 text-left tracking-tighter text-balance md:text-center font-semibold md:text-7xl lg:text-7xl sm:text-7xl text-5xl">The Fun & Easy Way To Learn <span>{greetings[index]}</span></h1>
    {/key}
    <div class="grid justify-items-center">
        <p></p>
        <p class="text-center font-light text-foreground mt-4 max-w-[42rem] text-lg sm:text-xl">Why spend valuable time tackling lab environment setup, configurations, cleanups and repeating the process all the time?<span> <!-- -->&nbsp;Focus on your learning and skip the noise.</span></p>
        <p></p>
    </div>

    <div class="grid justify-items-center">
        {#key index}
            <img transition:slide src={images[index]} alt="Anvil Cloud" class="object-scale-down h-48" />
        {/key}
    </div>
    
</div>