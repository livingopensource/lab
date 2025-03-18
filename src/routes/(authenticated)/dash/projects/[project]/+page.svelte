<script lang="ts">
    import * as Card from "$lib/components/ui/card";
    import { Skeleton } from "$lib/components/ui/skeleton";
	import type { PageServerData } from "./$types";
    export let data: PageServerData;
</script>

<div class="container py-10 gap-5 place-content-evenly">
    <Card.Root>
        <Card.Header>
            <Card.Title>
                Project Details
            </Card.Title>
            <Card.Description>
                Manage user projects configurations.
            </Card.Description>
        </Card.Header>
        <Card.Content>
            <div class="grid grid-cols-2 gap-4 place-content-between">
              <div class="flex h-5 items-center space-x-4 text-sm mb-10">

              </div>
              <div>
               
              </div>
            </div>
            {#await data.projectDetails}
            <div class="flex items-center space-x-4">
                <div class="space-y-2">
                  <Skeleton class="h-4 w-[250px]" />
                  <Skeleton class="h-4 w-[200px]" />
                </div>
              </div>
              <br />
              <div class="flex items-center space-x-4">
                <div class="space-y-2">
                  <Skeleton class="h-4 w-[250px]" />
                  <Skeleton class="h-4 w-[200px]" />
                </div>
              </div>
              <br />
              <div class="flex items-center space-x-4">
                <div class="space-y-2">
                  <Skeleton class="h-4 w-[250px]" />
                  <Skeleton class="h-4 w-[200px]" />
                </div>
              </div>
            {:then project}
                {#if project == null}
                   <p> No project found for this email address</p>
                {:else}
                <div class="grid grid-cols-2 gap-4">
                    <div>name</div>
                    <div>{project.metadata.description}</div>
                    <div>Compute Instances</div>
                    <div>{project.metadata.config["limits.instances"]}</div>
                </div>
                {/if}
            {:catch err}
                <p>Error loading project</p>
            {/await}
        </Card.Content>
    </Card.Root>
</div>