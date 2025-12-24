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
        <footer class="mt-24 pt-8 border-t">
            <div class="grid grid-cols-1 md:grid-cols-4 gap-8 mb-8">
                <div class="col-span-1">
                    <div class="flex items-center gap-2">
                        <a href="/">
                            <img
                                src="/LOSF Orange.png"
                                alt="Living Open Source Foundation"
                                title="LOSF Logo"
                                class="h-10"
                            />
                        </a>
                    </div>
                    <p class="mt-2 text-sm text-muted-foreground">Empowering developers through open source education.</p>
                </div>

                <div>
                    <h3 class="font-semibold mb-4">Product</h3>
                    <ul class="space-y-2 text-sm text-muted-foreground">
                        <li><a href="/dash" class="hover:text-primary transition-colors">Playground</a></li>
                        <li><a href="/dash/instances" class="hover:text-primary transition-colors">Linux Training</a></li>
                        <li><a href="/dash/instances" class="hover:text-primary transition-colors">Docker Training</a></li>
                        <li><a href="/dash/kubernetes" class="hover:text-primary transition-colors">Kubernetes Training</a></li>
                    </ul>
                </div>

                <div>
                    <h3 class="font-semibold mb-4">Company</h3>
                    <ul class="space-y-2 text-sm text-muted-foreground">
                        <li><a href="/" class="hover:text-primary transition-colors">About</a></li>
                        <li><a href="/terms-of-service" class="hover:text-primary transition-colors">Terms of Service</a></li>
                        <li><a href="/privacy-policy" class="hover:text-primary transition-colors">Privacy Policy</a></li>
                    </ul>
                </div>

                <div>
                    <h3 class="font-semibold mb-4">Connect</h3>
                    <ul class="space-y-2 text-sm text-muted-foreground">
                        <li class="flex items-center">
                            <Linkedin class="mr-2" />
                            <a href="https://www.linkedin.com/showcase/losf" class="hover:text-primary transition-colors">LinkedIn</a>
                        </li>
                    </ul>
                </div>
            </div>

            <div class="flex flex-col md:flex-row justify-between items-center pt-8 border-t border-border">
                <p class="text-sm text-muted-foreground mb-4 md:mb-0">
                    © {new Date().getFullYear()} Living Open Source Foundation. All rights reserved.
                </p>
                <ul class="flex gap-6 text-sm text-muted-foreground">
                    <li><a href="/terms-of-service" class="hover:text-primary transition-colors">Terms</a></li>
                    <li><a href="/privacy-policy" class="hover:text-primary transition-colors">Privacy</a></li>
                </ul>
            </div>
        </footer>
    </div>
</section>
