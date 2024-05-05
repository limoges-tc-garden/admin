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
      {props.children}
    </Show>
  )
};

export default ShowWhenAuthenticated;
