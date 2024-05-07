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
      <h1 class="text-center text-2xl font-medium">
        Nouvel article
      </h1>
      <p class="text-center">
        Choisissez un titre pour votre nouveau merveilleux article.
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
