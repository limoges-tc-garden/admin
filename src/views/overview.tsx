import ShowWhenAuthenticated from "~/components/ShowWhenAuthenticated";

/**
 * @route `/`
 */
export default function OverviewView () {
  return (
    <ShowWhenAuthenticated>
      <h1 class="text-2xl pt-6 text-center font-medium">
        Bienvenue dans l'administration du club LTCG !
      </h1>

    </ShowWhenAuthenticated>
  )
};
