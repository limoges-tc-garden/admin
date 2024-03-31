import type { User } from "@supabase/supabase-js";
import supabase from "~/utils/supabase";

import {
  type FlowComponent,
  type Accessor,

  createContext,
  createSignal,
  useContext,
  onMount,
  onCleanup,
  batch,
  Show
} from "solid-js";

import UserContextLoader from "~/components/AuthLoader";

const UserContext = createContext<Accessor<User | null>>(
  () => null
);

const UserProvider: FlowComponent = (props) => {
  const [loading, setLoading] = createSignal(true);
  const [user, setUser] = createSignal<User | null>(null);

  onMount(() => {
    const subscription = supabase.auth.onAuthStateChange((_, session) => batch(() => { 
      setLoading(false);
      setUser(session?.user ?? null);
    }));

    onCleanup(() => {
      // On se désabonne de l'écoute des changements d'état de l'authentification.
      subscription.data.subscription.unsubscribe();

      // On se remet à l'état initial: valeurs par défaut.
      batch(() => {
        setLoading(true);
        setUser(null);
      }); 
    })
  })

  return (
    <UserContext.Provider value={user}>
      {/* On affiche uniquement la vue lorsque le chargement est fini. */}
      <Show when={!loading()} fallback={<UserContextLoader />}>
        {props.children}
      </Show>
    </UserContext.Provider>
  )
}

export default UserProvider;
export const useUser = () => useContext(UserContext);
