import { Show, type FlowComponent } from "solid-js";
import { Navigate } from "@solidjs/router";
import { useUser } from "~/contexts/user";

/**
 * Redirection automatique vers `/` si l'utilisateur est déjà connecté.
 */
const ShowWhenNotAuthenticated: FlowComponent = (props) => {
  const user = useUser();

  return (
    <Show when={!user()} fallback={<Navigate href="/" />}>
      {props.children}
    </Show>
  )
};

export default ShowWhenNotAuthenticated;
