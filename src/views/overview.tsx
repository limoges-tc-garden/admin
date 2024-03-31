import ShowWhenAuthenticated from "~/components/ShowWhenAuthenticated";

/**
 * @route `/`
 */
export default function OverviewView () {
  return (
    <ShowWhenAuthenticated>
      <h1>Vue d'ensemble</h1>
      <p>Vous êtes authentifié !</p>
    </ShowWhenAuthenticated>
  )
};
