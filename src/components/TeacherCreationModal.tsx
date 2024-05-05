import { type Component, createSignal, type Setter, batch, Show } from "solid-js";
import { Dialog, TextField } from "@kobalte/core";
import supabase from "~/utils/supabase";
import { createFileUploadToSupabase } from "~/utils/create-file-upload";

const TeacherCreationModal: Component<{
  open: boolean;
  setOpen: Setter<boolean>;

  /** Utilitaire pour rafraîchir les données du composant parent. */
  refetch: () => Promise<void>;
}> = (props) => {
  const [firstName, setFirstName] = createSignal("");
  const [lastName, setLastName] = createSignal("");
  const [avatarID, setAvatarID] = createSignal<number | null>(null);

  const handleSubmit = async (event: SubmitEvent) => {
    event.preventDefault();

    const firstNameValue = firstName();
    const lastNameValue = lastName();

    if (!firstNameValue || !lastNameValue) {
      throw new Error("Veuillez remplir tous les champs.");
    }

    const { error } = await supabase.from("teachers").insert({
      avatar_file_id: avatarID() ?? void 0,
      first_name: firstNameValue,
      last_name: lastNameValue,
    });

    if (error) console.error(error);
    else {
      batch(() => {
        // On réinitialise les champs.
        setFirstName("");
        setLastName("");
        
        // On ferme le dialogue.
        props.setOpen(false);
      });

      // On rafraîchit les données du composant parent.
      await props.refetch();
    }
  };

  return (
    <Dialog.Root open={props.open} onOpenChange={props.setOpen}>
      <Dialog.Portal>
        <Dialog.Overlay class="fixed inset-0 z-50 bg-black/20" />
        <div class="fixed inset-0 z-50 flex items-center justify-center">
          <Dialog.Content class="z-50 bg-white p-4 shadow-md">
            <div class="flex">
              <Dialog.Title class="">
                Ajouter un(e) enseignant(e)
              </Dialog.Title>
              <Dialog.CloseButton class="">
                Fermer!
              </Dialog.CloseButton>
            </div>

            <form onSubmit={handleSubmit}>
              <TextField.Root value={firstName()} onChange={setFirstName}>
                <TextField.Label>
                  Prénom
                </TextField.Label>
                <TextField.Input type="text" />
              </TextField.Root>

              <TextField.Root value={lastName()} onChange={(value) => setLastName(value.toUpperCase())}>
                <TextField.Label>
                  NOM
                </TextField.Label>
                <TextField.Input type="text" />
              </TextField.Root>

              <Show when={avatarID() === null}>
                <button type="button"
                  onClick={async () => {
                    const fileID = await createFileUploadToSupabase("Photo d'enseignant(e)");
                    if (typeof fileID !== "number") return;
                    setAvatarID(fileID);
                  }}
                >
                  Ajouter une photo
                </button>
              </Show>

              <button type="submit">
                Enregistrer
              </button>
            </form>
          </Dialog.Content>
        </div>
      </Dialog.Portal>
    </Dialog.Root>
  )
};

export default TeacherCreationModal;
