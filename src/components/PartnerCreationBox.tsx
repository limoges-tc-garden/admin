import { Show, createSignal, type Component } from "solid-js";
import { TextField } from "@kobalte/core";
import supabase from "~/utils/supabase";
import { createFileUploadToSupabase } from "~/utils/create-file-upload";

const PartnerCreationBox: Component<{
  /**
   * Permet d'informer qu'il faut actualiser la liste des partenaires
   * pour le conteneur parent.
   */
  refetch?: () => Promise<void>;

  /** Action lors de la fermeture de la boîte de dialogue. */
  close: () => void;
}> = (props) => {
  const [name, setName] = createSignal("");
  const [url, setURL] = createSignal("");
  const [logoID, setLogoID] = createSignal<number | null>(null);

  const handleSubmit = async (event: SubmitEvent) => {
    event.preventDefault();

    // On évite les noms vides.
    const nameValue = name();
    if (!nameValue) return;

    // On demande la création d'un nouveau partenaire.
    const { error } = await supabase.from("partners").insert({
      logo_file_id: logoID() ?? void 0,
      name: nameValue,
      url: url(),
    });

    if (error) { // TODO: Montrer une erreur à l'utilisateur.
      console.error("error", error);
      return;
    }

    // On actualise la liste des partenaires.
    if (props.refetch) await props.refetch();
    
    // On ferme la boîte de dialogue.
    props.close();
  }
  
  return (
    <div class="border rounded-md">
      <form onSubmit={handleSubmit}
        class="flex flex-col gap-4 p-4"
      >
        <TextField.Root value={name()} onChange={setName}>
          <TextField.Label>
            Nom du partenaire
          </TextField.Label>
          <TextField.Input type="text" />
        </TextField.Root>
        
        <TextField.Root value={url()} onChange={setURL}>
          <TextField.Label>
            URL de redirection
          </TextField.Label>
          <TextField.Input type="url" />
        </TextField.Root>

        <Show when={logoID() === null}>
          <button type="button"
            onClick={async () => {
              const fileID = await createFileUploadToSupabase("Photo de partenaire");
              if (typeof fileID !== "number") return;
              setLogoID(fileID);
            }}
          >
            Ajouter une photo
          </button>
        </Show>

        <div class="flex">
          <button type="button" onClick={() => props.close()}>
            Annuler
          </button>

          <button type="submit">
            Ajouter !
          </button>
        </div>
      </form>
    </div>
  )
};

export default PartnerCreationBox;
