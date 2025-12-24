
<script lang="ts">
    import { SignIn } from "@auth/sveltekit/components"
    import { Button } from '$lib/components/ui/button/index'
    import SwiftCloud from "lucide-svelte/icons/cloud";
    import { Github, Fingerprint } from "lucide-svelte";
</script>

<div class="min-h-screen flex flex-col">
  <div class="flex items-center justify-center p-6 flex-1">
    <div class="w-full max-w-md">
      <div class="flex flex-col items-center mb-10">
        <div class="bg-orange-100 p-4 rounded-full mb-4">
          <SwiftCloud class="text-4xl text-orange-600"/>
        </div>
        <h1 class="text-3xl font-bold">Welcome Back</h1>
        <p class="text-muted-foreground mt-2">Sign in to access your cloud training environment</p>
      </div>

      <div class="space-y-4">
        <div class="w-full">
          <SignIn provider="google">
            <Button
              type="submit"
              variant="outline"
              class="w-full flex items-center justify-center gap-3 bg-white hover:bg-gray-50 border-gray-300 dark:border-gray-600 dark:bg-gray-900 dark:hover:bg-gray-800"
            >
              <Fingerprint class="w-5 h-5" />
              Sign in with Google
            </Button>
          </SignIn>
        </div>

        <div class="w-full">
          <SignIn provider="github">
            <Button
              type="submit"
              variant="outline"
              class="w-full flex items-center justify-center gap-3 bg-white hover:bg-gray-50 border-gray-300 dark:border-gray-600 dark:bg-gray-900 dark:hover:bg-gray-800"
            >
              <Github class="w-5 h-5" />
              Sign in with GitHub
            </Button>
          </SignIn>
        </div>
      </div>

      <div class="mt-8 text-center text-sm text-muted-foreground">
        By signing in, you agree to our
        <a href="/terms-of-service" class="hover:text-primary underline underline-offset-4 ml-1">
          Terms of Service
        </a>
        and
        <a href="/privacy-policy" class="hover:text-primary underline underline-offset-4 ml-1">
          Privacy Policy
        </a>.
      </div>
    </div>
  </div>
</div>