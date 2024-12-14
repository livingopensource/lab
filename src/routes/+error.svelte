<script lang="ts">
	import {Button} from "$lib/components/ui/button/index.js";
    import { page } from "$app/stores"
</script>

<div class="container content-center w-screen h-screen">
    <div>
    </div>
    <div class="flex flex-col items-center justify-center">
        <h1 class="text-9xl">{$page.status}</h1>
        <p class="text-4xl">{$page.error?.message}</p>
    </div>
</div>