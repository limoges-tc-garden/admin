import ShowWhenAuthenticated from "~/components/ShowWhenAuthenticated";

/**
 * Permet de modifier les paramètres de son compte utilisateur.
 * Cela inclut l'adresse e-mail et mot de passe.
 * 
 * @route `/utilisateur`
 */
export default function UserView () {
  return (
    <ShowWhenAuthenticated>
      <h1>Paramètres Utilisateur</h1>
      <p>Modifiez les paramètres de votre compte dans cette page.</p>
    </ShowWhenAuthenticated>
  )
};
