import ShowWhenAuthenticated from "~/components/ShowWhenAuthenticated";

/**
 * @route `/`
 */
export default function OverviewView () {
  return (
    <ShowWhenAuthenticated>
      <h1>Vue d'ensemble</h1>

      <a href="/articles">Voir les articles</a>
      <a href="/tournois">Voir les tournois</a>
      <a href="/partenaires">Voir les partenaires</a>
      <a href="/dirigeants">Voir les dirigeants</a>
    </ShowWhenAuthenticated>
  )
};
