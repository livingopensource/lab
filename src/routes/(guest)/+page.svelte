<script lang="ts">
  import { onMount, onDestroy } from 'svelte';
  import { slide } from 'svelte/transition';
  import * as Card from "$lib/components/ui/card";
  import { Badge } from '$lib/components/ui/badge';
  import { Button } from '$lib/components/ui/button';
  import { goto } from '$app/navigation';
  import Terminal from '$lib/components/los/terminal.svelte';

  let greetings = ['Linux', 'Docker', 'Kubernetes'];

  let index = $state(0);
  let roller: string | number | NodeJS.Timeout | undefined;

  onMount(async () => {
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
    <title>Living Open Source Linux, Docker & Kubernetes Lab - Hands-on Cloud Training</title>
    <link rel="stylesheet" href="/css/xterm.css" />
</svelte:head>

<div class="container py-12">
  <!-- Hero Section -->
  <div class="text-center mb-16">
    {#key index}
      <h1 transition:slide class="text-black dark:text-white relative mx-auto max-w-4xl pt-8 text-left md:text-center font-bold md:text-6xl lg:text-7xl text-4xl mb-6">
        The Fun & Easy Way To Learn <span class="text-orange-500">{greetings[index]}</span>
      </h1>
    {/key}
    <p class="text-center font-light text-foreground max-w-2xl mx-auto text-lg sm:text-xl mb-12">
      No need to spend valuable time tackling lab environment setup, configurations, cleanups and repeating the process all the time.
      <span class="block mt-2">Focus on your learning and skip the noise.</span>
    </p>

    <div class="flex justify-center gap-4">
      <Button variant="default" size="lg" onclick={() => goto('/dash')}>
        Get Started
      </Button>
      <Button variant="outline" size="lg" onclick={() => goto('/signin')}>
        Sign In
      </Button>
    </div>
  </div>

  <!-- Terminal Demo Section -->
  <div class="grid md:grid-cols-2 gap-8 mb-20">
    <div class="rounded-2xl overflow-hidden border border-border shadow-lg">
      <div class="bg-gray-800 px-4 py-2 flex items-center gap-2">
        <div class="w-3 h-3 rounded-full bg-red-500"></div>
        <div class="w-3 h-3 rounded-full bg-yellow-500"></div>
        <div class="w-3 h-3 rounded-full bg-green-500"></div>
        <span class="text-white text-sm ml-4">Terminal Demo</span>
      </div>
      <div class="p-4 bg-gray-900">
        <Terminal />
      </div>
    </div>
    <div class="flex flex-col justify-center p-6">
      <h2 class="text-3xl font-bold mb-4 text-center md:text-left">Hands-On Learning Experience</h2>
      <p class="text-lg mb-6 text-center md:text-left">
        We provide the environment for you to test, experiment and learn in a real cloud environment.
      </p>
      <ul class="space-y-3 mb-6">
        <li class="flex items-center">
          <svg class="w-5 h-5 mr-2 text-green-500" fill="none" stroke="currentColor" viewBox="0 0 24 24" xmlns="http://www.w3.org/2000/svg">
            <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M5 13l4 4L19 7"></path>
          </svg>
          Disposable virtual machines with super fast cold starts
        </li>
        <li class="flex items-center">
          <svg class="w-5 h-5 mr-2 text-green-500" fill="none" stroke="currentColor" viewBox="0 0 24 24" xmlns="http://www.w3.org/2000/svg">
            <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M5 13l4 4L19 7"></path>
          </svg>
          Real cloud computing environment
        </li>
        <li class="flex items-center">
          <svg class="w-5 h-5 mr-2 text-green-500" fill="none" stroke="currentColor" viewBox="0 0 24 24" xmlns="http://www.w3.org/2000/svg">
            <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M5 13l4 4L19 7"></path>
          </svg>
          No setup or configuration required
        </li>
      </ul>
      <div class="flex justify-center md:justify-start">
        <img src="/cloud-learner.jpeg" alt="Learning in cloud environment" class="rounded-xl shadow-lg max-w-full h-auto"/>
      </div>
    </div>
  </div>

  <!-- Training Cards Section -->
  <div class="mb-16">
    <h2 class="text-3xl font-bold text-center mb-12">Our Training Programs</h2>
    <div class="grid grid-cols-1 md:grid-cols-3 gap-8">
      <Card.Root class="relative cursor-pointer transition-all duration-300 ease-in-out hover:-translate-y-2 hover:shadow-xl overflow-hidden">
        <div class="overflow-hidden">
          <img src="/linux.png" alt="Linux training" class="w-full h-48 object-cover transition-transform duration-300 hover:scale-110"/>
        </div>
        <Card.Content class="p-6">
          <div class="flex flex-col h-full">
            <div class="flex-1">
              <h3 class="mb-2 text-2xl font-semibold">Linux Training</h3>
              <p class="text-muted-foreground mb-4">Hands-on Linux training with real commands and scenarios</p>
            </div>
            <div class="flex justify-between items-center">
              <Button variant="outline" onclick={() => goto(`/dash/instances`)}>
                Start Learning
              </Button>
              <Badge class="bg-orange-500 hover:bg-orange-600">Linux</Badge>
            </div>
          </div>
        </Card.Content>
      </Card.Root>

      <Card.Root class="relative cursor-pointer transition-all duration-300 ease-in-out hover:-translate-y-2 hover:shadow-xl overflow-hidden">
        <div class="overflow-hidden">
          <img src="/docker.png" alt="Docker training" class="w-full h-48 object-cover transition-transform duration-300 hover:scale-110"/>
        </div>
        <Card.Content class="p-6">
          <div class="flex flex-col h-full">
            <div class="flex-1">
              <h3 class="mb-2 text-2xl font-semibold">Docker Training</h3>
              <p class="text-muted-foreground mb-4">Master containerization with hands-on Docker labs</p>
            </div>
            <div class="flex justify-between items-center">
              <Button variant="outline" onclick={() => goto(`/dash/instances`)}>
                Start Learning
              </Button>
              <Badge class="bg-blue-500 hover:bg-blue-600">Docker</Badge>
            </div>
          </div>
        </Card.Content>
      </Card.Root>

      <Card.Root class="relative cursor-pointer transition-all duration-300 ease-in-out hover:-translate-y-2 hover:shadow-xl overflow-hidden">
        <div class="overflow-hidden">
          <img src="/kubernetes.png" alt="Kubernetes training" class="w-full h-48 object-cover transition-transform duration-300 hover:scale-110"/>
        </div>
        <Card.Content class="p-6">
          <div class="flex flex-col h-full">
            <div class="flex-1">
              <h3 class="mb-2 text-2xl font-semibold">Kubernetes Training</h3>
              <p class="text-muted-foreground mb-4">Deploy and manage containerized applications at scale</p>
            </div>
            <div class="flex justify-between items-center">
              <Button variant="outline" onclick={() => goto(`/dash/kubernetes`)}>
                Start Learning
              </Button>
              <Badge class="bg-purple-500 hover:bg-purple-600">K8s</Badge>
            </div>
          </div>
        </Card.Content>
      </Card.Root>
    </div>
  </div>

  <!-- CTA Section -->
  <div class="bg-gradient-to-r from-orange-400 to-orange-600 rounded-3xl p-10 text-center text-white">
    <h2 class="text-3xl md:text-4xl font-bold mb-4">Ready to start your cloud journey?</h2>
    <p class="text-xl mb-8 max-w-2xl mx-auto">Join thousands of developers mastering Linux, Docker, and Kubernetes</p>
    <div class="flex flex-col sm:flex-row justify-center gap-4">
      <Button
        variant="secondary"
        size="lg"
        class="bg-white text-orange-600 hover:bg-gray-100"
        onclick={() => goto('/dash')}
      >
        Get Started Now
      </Button>
      <Button
        variant="outline"
        size="lg"
        class="border-2 border-white text-white hover:bg-white hover:text-orange-600"
        onclick={() => goto('/signin')}
      >
        Sign In
      </Button>
    </div>
  </div>
</div>