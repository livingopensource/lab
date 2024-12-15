import { SvelteKitAuth } from "@auth/sveltekit"
import Google from "@auth/sveltekit/providers/google"
import type { Provider } from "@auth/sveltekit/providers"
 
const providers: Provider[] = [Google]
 
export const providerMap = providers.map((provider) => {
  // eslint-disable-next-line @typescript-eslint/ban-ts-comment
  //@ts-expect-error 
  return { id: provider.id, name: provider.name }
})
 
export const { handle, signIn, signOut } = SvelteKitAuth({
  providers,
  pages: {
    signIn: "/signin",
    signOut: "/signout"
  },
})