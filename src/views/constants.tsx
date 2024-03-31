import ShowWhenAuthenticated from "~/components/ShowWhenAuthenticated";

/**
 * Permet de visualiser et modifier les constantes du site web.
 * 
 * Une constante et une valeur associé à un identifiant qui ne bouge pas.
 * Dans l'interface du site web publié, une constante peut être
 * l'adresse e-mail de contact, l'identifiant du club, ...
 * 
 * @route `/constantes`
 */
export default function ConstantsView () {
  return (
    <ShowWhenAuthenticated>
      <h1>Constantes</h1>
    </ShowWhenAuthenticated>
  )
};
