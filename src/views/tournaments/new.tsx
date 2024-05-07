import ShowWhenAuthenticated from "~/components/ShowWhenAuthenticated";
import { TextField } from "@kobalte/core";
import { createSignal } from "solid-js";
import supabase from "~/utils/supabase";
import { useNavigate } from "@solidjs/router";

/**
 * Permet d'ajouter un nouveau tournoi dans la base de données.
 * @route `/tournois/nouveau`
 */
export default function NewTournamentView () {
  const navigate = useNavigate();
  const [title, setTitle] = createSignal("");

  const handleSubmit = async (event: SubmitEvent) => {
    event.preventDefault();
    
    // On évite les titres vides.
    const titleValue = title();
    if (!titleValue) return;

    // On demande la création d'un nouveau tournoi.
    const { error, data } = await supabase.from("tournaments").insert({
      title: titleValue,
      draft: true
    }).select("id").single();

    if (error) { // TODO: Montrer une erreur à l'utilisateur.
      console.error("error", error);
      return;
    }

    // On redirige l'utilisateur vers l'éditeur pour le tournoi créé.
    navigate(`/tournois/edition/${data.id}`);
  }
  
  return (
    <ShowWhenAuthenticated>
      <h1 class="text-center text-2xl font-medium">
        Nouveau tournoi
      </h1>
      <p class="text-center">
        Choisissez un titre.
      </p>

      <form onSubmit={handleSubmit}>
        <TextField.Root value={title()} onChange={setTitle} class="flex flex-col gap-1">
          <TextField.Label>
            Titre
          </TextField.Label>
          <TextField.Input class="border border-orange rounded-lg px-3 py-1" type="text" />
        </TextField.Root>

        <button type="submit" class="bg-orange rounded-lg mx-auto px-4 py-2 text-white mt-6 w-full">
          Créer
        </button>
      </form>
    </ShowWhenAuthenticated>
  )
};
