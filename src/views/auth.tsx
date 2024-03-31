import { createSignal } from "solid-js";

import { TextField } from "@kobalte/core";
import ShowWhenNotAuthenticated from "~/components/ShowWhenNotAuthenticated";
import supabase from "~/utils/supabase";

export default function AuthView () {
  const [email, setEmail] = createSignal("");
  const [password, setPassword] = createSignal("");

  const handleLogin = async (event: SubmitEvent) => {
    event.preventDefault();

    const emailValue = email();
    const passwordValue = password();

    // On ne fait rien si les champs sont vides.
    if (!emailValue || !passwordValue) return;

    // On authentifie l'utilisateur.
    await supabase.auth.signInWithPassword({
      email: emailValue,
      password: passwordValue
    });
  };

  return (
    <ShowWhenNotAuthenticated>
      <form onSubmit={handleLogin}>
        <TextField.Root value={email()} onChange={setEmail}>
          <TextField.Label>
            E-Mail
          </TextField.Label>
          <TextField.Input type="email" />
        </TextField.Root>

        <TextField.Root value={password()} onChange={setPassword}>
          <TextField.Label>
            Mot de passe
          </TextField.Label>
          <TextField.Input type="password" />
        </TextField.Root>

        <button type="submit">
          Se connecter
        </button>
      </form>
    </ShowWhenNotAuthenticated>
  )
};
