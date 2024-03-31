import { createResource, For, Show, createSignal, Suspense } from "solid-js";
import PartnerCreationBox from "~/components/PartnerCreationBox";
import ShowWhenAuthenticated from "~/components/ShowWhenAuthenticated";
import supabase from "~/utils/supabase";

const fetchPartners = async () => {
  const response = await supabase.from("partners").select("id, name, url, logo_file_id(id)");
  return response.data;
}

/**
 * Permet de visualiser et modifier les partenaires du club.
 * @route `/partenaires`
 */
export default function PartnersView () {
  const [partners, { refetch }] = createResource(fetchPartners);
  const [isCreating, setIsCreating] = createSignal(false);

  const deletePartner = async (id: number): Promise<void> => {
    const { error } = await supabase.from("partners").delete().eq("id", id);

    if (error) {
      console.error("error", error);
      return;
    }

    await refetch();
  }

  return (
    <ShowWhenAuthenticated>
      <h1>Partenaires</h1>

      <button
        type="button"
        onClick={() => refetch()}
      >
        Rafraîchir
      </button>

      <Show when={partners.loading}>
        <p>Chargement des partenaires...</p>
      </Show>

      <div class="flex flex-wrap gap-4">
        <Suspense>
          <For each={partners()} fallback={<p>Aucun partenaire à afficher.</p>}>
            {partner => (
              <article class="flex flex-col p-4 border rounded-md w-fit">
                <h2>{partner.name}</h2>

                <Show when={partner.url}>
                  <a href={partner.url!} target="_blank">
                    Lien associé
                  </a>
                </Show>

                <button type="button"
                  onClick={() => deletePartner(partner.id)}
                >
                  Supprimer
                </button>
              </article>
            )}
          </For>

          <Show when={!isCreating()}
            fallback={
              <PartnerCreationBox
                refetch={async () => void refetch()}
                close={() => setIsCreating(false)}
              />
            }
          >
            <button type="button"
              onClick={() => setIsCreating(true)}
            >
              Ajouter un partenaire
            </button>
          </Show>
        </Suspense>
      </div>
    </ShowWhenAuthenticated>
  )
};
