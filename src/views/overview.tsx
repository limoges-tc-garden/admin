import ShowWhenAuthenticated from "~/components/ShowWhenAuthenticated";

export default function OverviewView () {
  return (
    <ShowWhenAuthenticated>
      <h1>Overview !</h1>
      <p>Vous êtes authentifié !</p>
    </ShowWhenAuthenticated>
  )
};
