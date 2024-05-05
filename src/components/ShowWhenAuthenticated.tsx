import { Show, type FlowComponent } from "solid-js";
import { Navigate } from "@solidjs/router";
import { useUser } from "~/contexts/user";
import NavBar from "./NavBar";

/**
 * Redirection automatique vers `/auth` si l'utilisateur n'est pas connecté.
 */
const ShowWhenAuthenticated: FlowComponent = (props) => {
  const user = useUser();

  return (
    <Show when={user()} fallback={<Navigate href="/auth" />}>
      <NavBar />
      <main class="max-w-[1000px] mx-auto px-6">
        {props.children}
      </main>
    </Show>
  )
};

export default ShowWhenAuthenticated;
