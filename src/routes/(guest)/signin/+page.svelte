
<script lang="ts">
    import { SignIn } from "@auth/sveltekit/components"
    import { Button } from '$lib/components/ui/button/index'
</script>

 <div class="md:hidden">
	<div class="lg:p-8 p-20">
		<div class="mx-auto flex w-full flex-col justify-center space-y-6 sm:w-[350px]">
			<div class="flex flex-col space-y-2 text-center">
				<h1 class="text-2xl font-semibold tracking-tight">Log In</h1>
				<p class="text-muted-foreground text-sm">
					Select an authentication provider to log in with
				</p>
			</div>
			<div class="text-center">
        <div class="grid grid-cols-2 gap-4">
			<Button>
				<img src="google-logo.svg" width="25" height="25" alt="google logo">
				<SignIn provider="google">
					<p slot="submitButton">Google</p>
				</SignIn>
			</Button>
			<Button>
				<img src="github-logo.svg" width="25" height="25" alt="github logo">
				<SignIn provider="github">
					<p slot="submitButton">Github</p>
				</SignIn>
			</Button>
		</div>
      </div>
			<p class="text-muted-foreground px-8 text-center text-sm">
				By clicking continue, you agree to our
				<a href="/terms-of-service" class="hover:text-primary underline underline-offset-4">
					Terms of Service
				</a>
				and
				<a href="/privacy-policy" class="hover:text-primary underline underline-offset-4">
					Privacy Policy
				</a>
				.
			</p>
		</div>
	</div>
</div>
<div
	class="container relative hidden h-[800px] flex-col items-center justify-center md:grid lg:max-w-none lg:grid-cols-2 lg:px-0"
>
	<div class="bg-muted relative hidden h-full flex-col p-10 text-white lg:flex dark:border-r">
		<div
			class="absolute inset-0 bg-cover"
			style="
				background-image:
					url(https://images.unsplash.com/photo-1590069261209-f8e9b8642343?ixlib=rb-4.0.3&ixid=MnwxMjA3fDB8MHxwaG90by1wYWdlfHx8fGVufDB8fHx8&auto=format&fit=crop&w=1376&q=80);"
		></div>
		<div class="relative z-20 mt-auto">
			<blockquote class="space-y-2">
				<p class="text-lg">
					&ldquo;Hands on practical lab environments with disposable virtual machines that have super fast cold starts!&rdquo;
				</p>
				<footer class="text-sm">Endless Possibilities</footer>
			</blockquote>
		</div>
	</div>
	<div class="lg:p-8">
		<div class="mx-auto flex w-full flex-col justify-center space-y-6 sm:w-[350px]">
			<div class="flex flex-col space-y-2 text-center">
				<h1 class="text-2xl font-semibold tracking-tight">Log In</h1>
				<p class="text-muted-foreground text-sm">
					Select an authentication provider to log in with
				</p>
			</div>
		<div class="text-center">
        <div class="grid grid-cols-2 gap-4">
			<Button>
				<img src="/google-logo.svg" alt="google logo" width="25" height="25">
				<SignIn provider="google">
					<p slot="submitButton">Google</p>
				</SignIn>
			  </Button>
			  <Button>
				  <img src="/github-logo.svg" alt="github logo" width="25" height="25">
				  <SignIn provider="github">
					<p slot="submitButton">Github</p>
				</SignIn>
			</Button>
		</div>
      </div>
			<p class="text-muted-foreground px-8 text-center text-sm">
				By clicking continue, you agree to our
				<a href="/terms-of-service" class="hover:text-primary underline underline-offset-4">
					Terms of Service
				</a>
				and
				<a href="/privacy-policy" class="hover:text-primary underline underline-offset-4">
					Privacy Policy
				</a>
				.
			</p>
		</div>
	</div>
</div>