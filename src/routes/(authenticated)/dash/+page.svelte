<script lang="ts">
import * as Card from "$lib/components/ui/card/index.js";
import type { PageData } from "./$types";
import Library from "lucide-svelte/icons/library-big"
import CreditCard from "lucide-svelte/icons/credit-card"
import Cpu from "lucide-svelte/icons/cpu"
import Settings from "lucide-svelte/icons/settings"
import Home from "lucide-svelte/icons/home"

let data: {
	data: PageData
} = $props();

</script>
<svelte:head>
    <title>Welcome | SwiftCloud Anvil</title>
</svelte:head>

<div class="container py-10 grid md:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-5 place-content-evenly">
    {#each data.data.info as info}
        <div>
            <Card.Root>
                <Card.Header>
                    <Card.Title>{info.title}</Card.Title>
                    <Card.Description>{info.description}</Card.Description>
                </Card.Header>
                <Card.Content>
                    {#if info.Icon == "instances"}
                      <Cpu />
                      {:else if info.Icon == "library"}
                      <Library />
                      {:else if info.Icon == "settings"}
                      <Settings />
                      {:else if info.Icon == "creditcard"}
                      <CreditCard />
                      {:else}
                      <Home />
                    {/if}
                </Card.Content>
            </Card.Root>
        </div>
    {/each}
</div>