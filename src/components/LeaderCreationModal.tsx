import { type Component, createSignal, type Setter, batch } from "solid-js";
import { Dialog, TextField } from "@kobalte/core";
import supabase from "~/utils/supabase";

const LeaderCreationModal: Component<{
  open: boolean;
  setOpen: Setter<boolean>;

  /** Utilitaire pour rafraîchir les données du composant parent. */
  refetch: () => Promise<void>;
}> = (props) => {
  const [firstName, setFirstName] = createSignal("");
  const [lastName, setLastName] = createSignal("");
  const [headline, setHeadline] = createSignal("");
  const [direction, setDirection] = createSignal(false);
  
  const handleSubmit = async (event: SubmitEvent) => {
    event.preventDefault();

    const firstNameValue = firstName();
    const lastNameValue = lastName();
    const headlineValue = headline();

    if (!firstNameValue || !lastNameValue || !headlineValue) {
      throw new Error("Veuillez remplir tous les champs.");
    }

    const { error } = await supabase.from("leaders").insert({
      first_name: firstNameValue,
      last_name: lastNameValue,
      headline: headlineValue,
      direction: direction(),
    });

    if (error) console.error(error);
    else {
      batch(() => {
        // On réinitialise les champs.
        setFirstName("");
        setLastName("");
        setHeadline("");
        setDirection(false);
        
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
            <div class="flex justify-between">
              <Dialog.Title class="">
                Ajouter un dirigeant
              </Dialog.Title>
              <Dialog.CloseButton class="">
                Fermer
              </Dialog.CloseButton>
            </div>

            <form onSubmit={handleSubmit} class="pt-4 flex flex-col gap-2">
              <TextField.Root value={firstName()} onChange={setFirstName}>
                <TextField.Label>
                  Prénom
                </TextField.Label>
                <TextField.Input type="text" class="w-full border rounded" />
              </TextField.Root>

              <TextField.Root value={lastName()} onChange={(value) => setLastName(value.toUpperCase())}>
                <TextField.Label>
                  NOM
                </TextField.Label>
                <TextField.Input type="text" class="w-full border rounded" />
              </TextField.Root>

              <TextField.Root value={headline()} onChange={setHeadline}>
                <TextField.Label>
                  Intitulé
                </TextField.Label>
                <TextField.Input type="text" class="w-full border rounded" />
              </TextField.Root>

              <label class="flex items-center gap-2 mt-4">
                <input type="checkbox"
                  checked={direction()}
                  onChange={(e) => setDirection(e.currentTarget.checked)}
                />
                Fait partie de la direction ?
              </label>

              <button type="submit"
                class="mt-6 bg-orange text-white px-4 py-2 rounded-lg"
              >
                Enregistrer
              </button>
            </form>
          </Dialog.Content>
        </div>
      </Dialog.Portal>
    </Dialog.Root>
  )
};

export default LeaderCreationModal;
