
<script lang="ts">
    import { Button } from '$lib/components/ui/button/index'
</script>

 <div class="md:hidden">
	<div class="lg:p-8 pt-20">
		<div class="mx-auto flex w-full flex-col justify-center space-y-6 sm:w-[350px]">
			<div class="flex flex-col space-y-2 text-center">
				<h1 class="text-2xl font-semibold tracking-tight">Sign Out</h1>
				<p class="text-muted-foreground text-sm">
					Please confirm sign out by clicking the button below
				</p>
			</div>
			<div class="text-center">
				<form method="POST">
					<Button type="submit">Sign Me Out</Button>
				</form>
      </div>
		</div>
	</div>
</div>
<div
	class="container relative hidden h-[800px] flex-col items-center justify-center md:grid lg:max-w-none lg:grid-cols-2 lg:px-0"
>
	<Button
		href="/"
		variant="ghost"
		class="absolute right-4 top-4 md:right-8 md:top-8"
	>
		Home
	</Button>
	<div class="bg-muted relative hidden h-full flex-col p-10 text-white lg:flex dark:border-r">
		<div
			class="absolute inset-0 bg-cover"
			style="
				background-image:
					url(https://images.unsplash.com/photo-1590069261209-f8e9b8642343?ixlib=rb-4.0.3&ixid=MnwxMjA3fDB8MHxwaG90by1wYWdlfHx8fGVufDB8fHx8&auto=format&fit=crop&w=1376&q=80);"
		></div>
		<div class="relative z-20 flex items-center text-lg font-medium">
			<!-- <Command class="mr-2 h-6 w-6" /> -->
			Anvil Cloud
		</div>
		<div class="relative z-20 mt-auto">
			<blockquote class="space-y-2">
				<p class="text-lg">
					<!-- &ldquo;This library has saved me countless hours of work and helped me deliver
					stunning designs to my clients faster than ever before. Highly
					recommended!&rdquo; -->
				</p>
				<footer class="text-sm">Endless Possibilities</footer>
			</blockquote>
		</div>
	</div>
	
	<div class="lg:p-8">
		<div class="mx-auto flex w-full flex-col justify-center space-y-6 sm:w-[350px]">
			<div class="flex flex-col space-y-2 text-center">
				<h1 class="text-2xl font-semibold tracking-tight">Sign Out</h1>
				<p class="text-muted-foreground text-sm">
					Please confirm sign out by clicking the button below
				</p>
			</div>
			<div class="text-center">
				<form method="POST">
					<Button type="submit">Sign Me Out</Button>
				</form>
      </div>
		</div>
	</div>
</div>