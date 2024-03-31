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
      <h1>Nouveau tournoi</h1>
      <p>
        Choisissez un titre.
      </p>

      <form onSubmit={handleSubmit}>
        <TextField.Root value={title()} onChange={setTitle}>
          <TextField.Label>
            Titre
          </TextField.Label>
          <TextField.Input type="text" />
        </TextField.Root>

        <button type="submit">
          Créer
        </button>
      </form>
    </ShowWhenAuthenticated>
  )
};
