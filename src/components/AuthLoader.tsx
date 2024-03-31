import { type VoidComponent } from "solid-js";

/**
 * Un composant qui affiche un message de chargement
 * lorsque le `UserProvider` est en train de vérifier
 * l'authentification de l'utilisateur.
 */
const UserContextLoader: VoidComponent = () => {
  return (
    <div>
      <h2>Vérification de l'authentification...</h2>
    </div>
  );
};

export default UserContextLoader;
