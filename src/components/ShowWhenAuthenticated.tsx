import { Show, type FlowComponent } from "solid-js";
import { Navigate } from "@solidjs/router";
import { useUser } from "~/contexts/user";

/**
 * Redirection automatique vers `/auth` si l'utilisateur n'est pas connecté.
 */
const ShowWhenAuthenticated: FlowComponent = (props) => {
  const user = useUser();

  return (
    <Show when={user()} fallback={<Navigate href="/auth" />}>
      {props.children}
    </Show>
  )
};

export default ShowWhenAuthenticated;
