<script lang="ts">
    import CreditCard from "lucide-svelte/icons/credit-card";
    import House from "lucide-svelte/icons/house";
    import CPU from "lucide-svelte/icons/cpu";
    import Library from "lucide-svelte/icons/library-big";
    import Settings from "lucide-svelte/icons/settings";
    import SwiftCloud from "lucide-svelte/icons/cloud";
    import ChevronUp from "lucide-svelte/icons/chevron-up";
    import * as Sidebar from "$lib/components/ui/sidebar/index.js";
    import * as DropdownMenu from "$lib/components/ui/dropdown-menu/index";
    import type { ComponentProps } from "svelte";
    import { page } from "$app/stores";

    let {
		ref = $bindable(null),
		collapsible = "icon",
		...restProps
	}: ComponentProps<typeof Sidebar.Root> = $props();
    
    // Menu items.
    const items = [
     {
      title: "Home",
      url: "/dash",
      icon: House,
     },
     {
      title: "Instances",
      url: "/dash/instances",
      icon: CPU,
     },
     {
      title: "Library",
      url: "/dash/library",
      icon: Library,
     },
     {
      title: "Subscription",
      url: "/dash/subscription",
      icon: CreditCard,
     },
     {
      title: "Settings",
      url: "/dash/settings",
      icon: Settings,
     },
    ];
   </script>
    
   <Sidebar.Root bind:ref {collapsible} {...restProps}>
    <Sidebar.Header>
     <SwiftCloud class="text-4xl"/>
    </Sidebar.Header>
    <Sidebar.Content>
     <Sidebar.Group>
      <Sidebar.GroupLabel>Playground</Sidebar.GroupLabel>
      <Sidebar.GroupContent>
       <Sidebar.Menu>
        {#each items as item (item.title)}
         <Sidebar.MenuItem>
          {#if $page.url.pathname === item.url}
          <Sidebar.MenuButton isActive>
            {#snippet tooltipContent()}
              {item.title}
            {/snippet}
            {#snippet child({ props })}
             <a href={item.url} {...props}>
              <item.icon />
              <span>{item.title}</span>
             </a>
            {/snippet}
           </Sidebar.MenuButton>
           {:else}
           <Sidebar.MenuButton>
            {#snippet tooltipContent()}
              {item.title}
            {/snippet}
            {#snippet child({ props })}
             <a href={item.url} {...props}>
              <item.icon />
              <span>{item.title}</span>
             </a>
            {/snippet}
           </Sidebar.MenuButton>
           {/if}
         </Sidebar.MenuItem>
        {/each}
       </Sidebar.Menu>
      </Sidebar.GroupContent>
     </Sidebar.Group>
    </Sidebar.Content>
    <Sidebar.Footer>
      <Sidebar.Menu>
        <Sidebar.MenuItem>
          <DropdownMenu.Root>
            <DropdownMenu.Trigger>
              {#snippet child({ props })}
                <Sidebar.MenuButton
                  {...props}
                  class="data-[state=open]:bg-sidebar-accent data-[state=open]:text-sidebar-accent-foreground"
                >
                  Username
                  <ChevronUp class="ml-auto" />
                </Sidebar.MenuButton>
              {/snippet}
            </DropdownMenu.Trigger>
            <DropdownMenu.Content
              side="top"
              class="w-[--bits-dropdown-menu-anchor-width]"
            >
              <DropdownMenu.Item>
                <span>Account</span>
              </DropdownMenu.Item>
              <DropdownMenu.Item>
                <span>Sign out</span>
              </DropdownMenu.Item>
            </DropdownMenu.Content>
          </DropdownMenu.Root>
        </Sidebar.MenuItem>
      </Sidebar.Menu>
    </Sidebar.Footer>
    <Sidebar.Rail />
   </Sidebar.Root>