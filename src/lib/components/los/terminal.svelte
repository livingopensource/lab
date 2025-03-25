<script lang="ts">
    import { onMount } from 'svelte';
    let output = "";
    let command = "";
    
    function typeText(text: string, callback: { (): void; (): void; } | undefined) {
        let index = 0;
        function typeChar() {
            if (index < text.length) {
                output += text.charAt(index);
                index++;
                setTimeout(typeChar, 50);
            } else {
                output += "\n";
                if (callback) callback();
            }
        }
        typeChar();
    }
    
    function handleCommand() {
        if (command.trim() === "clear") {
            output = "";
        } else {
            typeText(`user@machine:~$ ${command}\n`, () => {
                typeText("Command not found.\n", () => {});
            });
        }
        command = "";
    }
    
    onMount(() => {
        typeText("user@machine:~$ ls", () => {
            typeText("Desktop  Documents  Downloads  Pictures  Videos", () => {
                typeText("user@machine:~$ docker ps", () => {
                    typeText("CONTAINER ID   IMAGE         STATUS        PORTS", () => {
                        typeText("123abc         nginx         Up 2 hours    80/tcp", () => {
                            typeText("user@machine:~$ kubectl get pods", () => {
                                typeText("NAME         READY   STATUS    RESTARTS", () => {
                                    typeText("web-pod      1/1     Running   0", () => {});
                                });
                            });
                        });
                    });
                });
            });
        });
    });
</script>

<div class="bg-gray-900 flex items-center justify-center">
    <div class="h-full w-full max-w-2xl dark:bg-black text-green-400 font-mono p-4 rounded-lg shadow-lg">
        <div class="h-64 overflow-y-auto p-2 whitespace-pre-line">{output}</div>
        <div class="border-t border-gray-700 pt-2 flex items-center">
            <span class="text-green-400">user@machine:~$</span>
        </div>
    </div>
</div>
