<script lang="ts">
  import * as Sidebar from "$lib/components/ui/sidebar/index.js";
  import AppSidebar from "$lib/components/app-sidebar.svelte";
  import Slash from "lucide-svelte/icons/slash";
  import * as Breadcrumb from "$lib/components/ui/breadcrumb/index.js";
  import { derived } from "svelte/store";
  import { page } from "$app/stores";
  import { Toaster } from "$lib/components/ui/sonner";
	import { Separator } from '$lib/components/ui/separator';
	import { truncateString } from "$lib/utils";
  // Generate breadcrumb items from the current URL
  const breadcrumbItems = derived(page, ($page) => {
    const segments = $page.url.pathname.split('/').filter(Boolean);
    return segments.map((segment, index) => ({
      name: segment.charAt(0).toUpperCase() + segment.slice(1),
      href: '/' + segments.slice(0, index + 1).join('/'),
    }));
  });
   
  let { children } = $props();
</script>

<Toaster expand={true} richColors />
<Sidebar.Provider>
<AppSidebar />
<Sidebar.Inset>
  <header class="flex h-16 w-max shrink-0 items-center gap-2 border-b px-4 absolute overflow-hidden">
    <Sidebar.Trigger class="-ml-1"/>
    <Separator orientation="vertical" class="mr-2 h-4" />
    <Breadcrumb.Root>
      <Breadcrumb.List>
        <!-- Static Home Link -->
        <Breadcrumb.Item>
          <Breadcrumb.Link href="/">Home</Breadcrumb.Link>
        </Breadcrumb.Item>
    
        <!-- Separator after Home -->
        {#if $breadcrumbItems.length > 0}
          <Breadcrumb.Separator>
            <Slash />
          </Breadcrumb.Separator>
        {/if}
    
        <!-- Dynamic Breadcrumb Items -->
        {#each $breadcrumbItems as item, i}
          <Breadcrumb.Item>
            {#if i < $breadcrumbItems.length - 1}
              <Breadcrumb.Link href={item.href}>{item.name}</Breadcrumb.Link>
            {:else}
              <Breadcrumb.Page>{truncateString(item.name, 12)}</Breadcrumb.Page>
            {/if}
          </Breadcrumb.Item>
          {#if i < $breadcrumbItems.length - 1}
            <Breadcrumb.Separator>
              <Slash />
            </Breadcrumb.Separator>
          {/if}
        {/each}
      </Breadcrumb.List>
    </Breadcrumb.Root>
  </header>
</Sidebar.Inset>
  <main class="w-screen py-10">
	  {@render children?.()}
  </main>
</Sidebar.Provider>