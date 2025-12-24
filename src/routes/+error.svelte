<script lang="ts">
	import { page } from "$app/stores";
    import { Button } from "$lib/components/ui/button";
    import SwiftCloud from "lucide-svelte/icons/cloud";
</script>

<svelte:head>
    <title>Error {$page.status || 500}</title>
</svelte:head>

<div class="min-h-screen flex flex-col bg-background">
  <header class="sticky top-0 z-50 w-full border-b bg-background/80 backdrop-blur">
    <div class="container flex h-16 items-center justify-between px-4">
      <div class="flex items-center space-x-2">
        <a href="/" class="flex items-center space-x-2">
          <div class="bg-orange-100 p-2 rounded-lg">
            <SwiftCloud class="text-2xl text-orange-600"/>
          </div>
          <span class="hidden font-bold sm:inline-block text-xl">
            SwiftCloud Labs
          </span>
        </a>
      </div>
      <div class="flex items-center space-x-4">
        <a href="/dash" class="text-sm font-medium transition-colors hover:text-primary hidden sm:block">
          Playground
        </a>
        <a href="/signin" class="text-sm font-medium transition-colors hover:text-primary">
          Sign In
        </a>
      </div>
    </div>
  </header>

  <main class="flex-1 flex items-center justify-center p-4">
    <div class="max-w-md w-full text-center">
      <div class="mb-8">
        <div class="mx-auto bg-orange-100 w-24 h-24 rounded-full flex items-center justify-center mb-6">
          <SwiftCloud class="text-5xl text-orange-600" />
        </div>
        <h1 class="text-6xl font-bold text-gray-800 dark:text-gray-200 mb-4">
          {$page.status || 500}
        </h1>
        <h2 class="text-2xl font-semibold text-gray-700 dark:text-gray-300 mb-4">
          Oops! Something went wrong
        </h2>
        <p class="text-lg text-gray-600 dark:text-gray-400 mb-8">
          {$page.error?.message || 'An unexpected error occurred. Please try again.'}
        </p>
      </div>

      <div class="flex flex-col sm:flex-row gap-4 justify-center">
        <Button
          variant="default"
          size="lg"
          onclick={() => window.location.href = '/'}
        >
          Go to Homepage
        </Button>
        <Button
          variant="outline"
          size="lg"
          onclick={() => window.location.reload()}
        >
          Try Again
        </Button>
      </div>
    </div>
  </main>

  <footer class="py-6 border-t">
    <div class="container">
      <div class="flex flex-col md:flex-row justify-between items-center">
        <p class="text-sm text-muted-foreground mb-4 md:mb-0">
          © {new Date().getFullYear()} Living Open Source Foundation. All rights reserved.
        </p>
        <ul class="flex gap-6 text-sm text-muted-foreground">
          <li><a href="/terms-of-service" class="hover:text-primary transition-colors">Terms</a></li>
          <li><a href="/privacy-policy" class="hover:text-primary transition-colors">Privacy</a></li>
        </ul>
      </div>
    </div>
  </footer>
</div>