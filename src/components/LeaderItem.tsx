import type { Database } from "~/utils/database.types"
import { Show, type Component, createSignal, batch } from "solid-js";
import supabase from "~/utils/supabase";

type Leader = Database["public"]["Tables"]["leaders"]["Row"];
const LeaderItem: Component<{
  leader: Leader
  refetch: () => Promise<void>;
}> = (props) => {
  const [editing, setEditing] = createSignal(false);

  // Valeurs pour les champs éditables.
  const [editedFirstName, setEditedFirstName] = createSignal("");
  const [editedLastName, setEditedLastName] = createSignal("");
  const [editedHeadline, setEditedHeadline] = createSignal("");

  /** Supprime le dirigeant de la base de données. */
  const removeFromRemote = async (): Promise<void> => {
    const { error } = await supabase.from("leaders").delete().eq("id", props.leader.id);
    if (error) console.error(error);
    else await props.refetch();
  };
  
  const startEditing = () => batch(() => {
    // On met les valeurs par défaut aux valeurs actuelles.
    setEditedFirstName(props.leader.first_name);
    setEditedLastName(props.leader.last_name);
    setEditedHeadline(props.leader.headline);
    // On active le mode édition.
    setEditing(true);
  })

  const pushToRemote = async (): Promise<void> => {
    const firstNameValue = editedFirstName();
    const lastNameValue = editedLastName();
    const headlineValue = editedHeadline();

    if (!firstNameValue || !lastNameValue || !headlineValue) {
      throw new Error("Veuillez remplir tous les champs.");
    }

    const { error } = await supabase.from("leaders").update({
      first_name: firstNameValue,
      last_name: lastNameValue,
      headline: headlineValue,
    }).eq("id", props.leader.id);

    if (error) console.error(error);
    else {
      batch(() => {
        // On réinitialise les champs.
        setEditedFirstName("");
        setEditedLastName("");
        setEditedHeadline("");
        // On désactive le mode édition.
        setEditing(false);
      });

      // On rafraîchit les données du composant parent.
      await props.refetch();
    }
  };

  return (
    <div class="flex">
      
      <div class="flex flex-col">
        <Show when={!editing()} fallback={
          <div>
            <input
              type="text"
              value={editedFirstName()}
              onInput={e => setEditedFirstName(e.currentTarget.value)}
            />
            <input
              type="text"
              value={editedLastName()}
              onInput={e => setEditedLastName(e.currentTarget.value)}
            />
            <input
              type="text"
              value={editedHeadline()}
              onInput={e => setEditedHeadline(e.currentTarget.value)}
            />
          </div>
        }>
          <div class="flex items-center gap-1">
            <Show when={props.leader.direction}>
              <p>(direction)</p>
            </Show>
            <h2>{props.leader.first_name} {props.leader.last_name}</h2>
          </div>
          <p>{props.leader.headline}</p>
        </Show>
      </div>

      <div class="ml-auto flex gap-4">
        <Show when={!editing()}
          fallback={
            <button type="button" onClick={pushToRemote}>
              Sauvegarder
            </button>
          }
        >
          <button type="button" onClick={startEditing}>
            Éditer
          </button>
        </Show>

        <button type="button" onClick={removeFromRemote}>
          Supprimer
        </button>
      </div>
    </div>
  )
};

export default LeaderItem;
