<script lang="ts">
	import { ModeWatcher, mode } from 'mode-watcher';
	import '../app.css';
	import NavigationLoader from '$lib/components/NavigationLoader.svelte';
	import { Facebook, Instagram, Linkedin } from 'lucide-svelte';
	let { children } = $props();
	let color: string = "#EB601A";
</script>

<ModeWatcher />
<NavigationLoader animationDuration={250} {color} height={3} />
{@render children?.()}
<br />
<section class="align-bottom">
    <div class="container">
        <footer>
            <div class="grid grid-cols-2 gap-8 lg:grid-cols-6">
                <div class="col-span-2 mb-8 lg:mb-0">
                      <div class="flex items-center gap-2 lg:justify-start">
                        <a href="/">
                          <img
                            src="/LOSF Orange.png"
                            alt="losf lABS"
                            title="LOSF Logo"
                            class="h-10"
                          />
                        </a>
                      </div>
                      <p class="mt-4 font-bold">Living Open Source Foundation</p>
                </div>
              </div>
              <div class="mt-24 flex flex-col justify-between gap-4 border-t pt-8 text-sm font-medium text-muted-foreground md:flex-row md:items-center">
                <p>{new Date()}</p>
                <ul class="flex gap-4">
                    <li class="underline hover:text-primary">
                        <a href="https://www.linkedin.com/showcase/losf"><Linkedin /> </a>
                    </li>
                </ul>
            </div>
        </footer>
    </div>
</section>
