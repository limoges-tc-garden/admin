import { createSignal } from "solid-js";
import { TextField } from "@kobalte/core";

import ShowWhenNotAuthenticated from "~/components/ShowWhenNotAuthenticated";
import supabase from "~/utils/supabase";

/**
 * Page d'authentification.
 * 
 * Toutes les autres routes sont protégées par l'authentification
 * et redirigent automatiquement vers cette page si l'utilisateur
 * n'est pas connecté.
 * 
 * @route `/auth`
 */
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
      <main class="min-h-screen h-full flex justify-center items-center flex-col gap-4 bg-gray-1">
        <h1 class="text-2xl font-medium pb-4">Administration LTCG</h1>
        <form onSubmit={handleLogin} class="max-w-[500px] w-full flex flex-col items-end gap-4 border bg-white shadow-lg p-6 rounded-xl">

          <TextField.Root value={email()} onChange={setEmail} class="flex flex-col w-full">
            <TextField.Label>
              E-Mail
            </TextField.Label>
            <TextField.Input type="email" class="bg-white border focus:border-orange outline-orange px-2 py-2 rounded-lg" />
          </TextField.Root>

          <TextField.Root value={password()} onChange={setPassword} class="flex flex-col w-full">
            <TextField.Label>
              Mot de passe
            </TextField.Label>
            <TextField.Input type="password" class="bg-white border focus:border-orange outline-orange px-2 py-2 rounded-lg" />
          </TextField.Root>

          <button type="submit" class="bg-orange-8 text-white px-4 py-1.5 rounded-lg hover:(bg-orange text-white) transition">
            Se connecter
          </button>
        </form>
      </main>
    </ShowWhenNotAuthenticated>
  )
};
