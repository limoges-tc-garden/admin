import ShowWhenAuthenticated from "~/components/ShowWhenAuthenticated";

/**
 * Permet de visualiser et modifier les partenaires du club.
 * @route `/partenaires`
 */
export default function PartnersView () {
  return (
    <ShowWhenAuthenticated>
      <h1>Partenaires</h1>
    </ShowWhenAuthenticated>
  )
};
