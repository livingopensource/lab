
<script lang="ts">
    import { Button } from '$lib/components/ui/button/index'
    import SwiftCloud from "lucide-svelte/icons/cloud";
</script>

<div class="min-h-screen flex flex-col">
  <div class="flex items-center justify-center p-6 flex-1">
    <div class="w-full max-w-md">
      <div class="flex flex-col items-center mb-10">
        <div class="bg-orange-100 p-4 rounded-full mb-4">
          <SwiftCloud class="text-4xl text-orange-600"/>
        </div>
        <h1 class="text-3xl font-bold">Sign Out</h1>
        <p class="text-muted-foreground mt-2 text-center">
          Are you sure you want to sign out of your account?
        </p>
      </div>

      <div class="space-y-4">
        <form method="POST" class="w-full">
          <Button
            type="submit"
            variant="destructive"
            class="w-full"
          >
            Sign Out
          </Button>
        </form>

        <a href="/" class="w-full block">
          <Button
            type="button"
            variant="outline"
            class="w-full"
          >
            Cancel
          </Button>
        </a>
      </div>
    </div>
  </div>
</div>