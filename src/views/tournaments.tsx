import ShowWhenAuthenticated from "~/components/ShowWhenAuthenticated";

/**
 * Liste des tournois dans la base de données.
 * Permet de visualiser les tournois enregistrés.
 * 
 * @route `/tournois`
 */
export default function TournamentsView () {
  return (
    <ShowWhenAuthenticated>
      <h1>Tournois</h1>
    </ShowWhenAuthenticated>
  )
};
