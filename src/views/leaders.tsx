import ShowWhenAuthenticated from "~/components/ShowWhenAuthenticated";

/**
 * Permet de visualiser et modifier les dirigeants du club.
 * @route `/dirigeants`
 */
export default function LeadersView () {
  return (
    <ShowWhenAuthenticated>
      <h1>Dirigeants</h1>
    </ShowWhenAuthenticated>
  )
};
