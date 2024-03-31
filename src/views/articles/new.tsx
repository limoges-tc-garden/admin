import ShowWhenAuthenticated from "~/components/ShowWhenAuthenticated";
import { TextField } from "@kobalte/core";
import { createSignal } from "solid-js";
import supabase from "~/utils/supabase";
import { useNavigate } from "@solidjs/router";

/**
 * Permet d'ajouter un nouvel article dans la base de données.
 * @route `/articles/nouveau`
 */
export default function NewArticleView () {
  const navigate = useNavigate();
  const [title, setTitle] = createSignal("");

  const handleSubmit = async (event: SubmitEvent) => {
    event.preventDefault();
    
    // On évite les titres vides.
    const titleValue = title();
    if (!titleValue) return;

    // On demande la création d'un nouvel article.
    const { error, data } = await supabase.from("articles").insert({
      title: titleValue,
      draft: true
    }).select("id").single();

    if (error) { // TODO: Montrer une erreur à l'utilisateur.
      console.error("error", error);
      return;
    }

    // On redirige l'utilisateur vers l'éditeur pour l'article créé.
    navigate(`/articles/edition/${data.id}`);
  }
  
  return (
    <ShowWhenAuthenticated>
      <h1>Nouvel article</h1>
      <p>
        Choisissez un titre pour votre nouveau merveilleux article.
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
