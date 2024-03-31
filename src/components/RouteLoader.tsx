import { type VoidComponent } from "solid-js";

/**
 * Un composant qui affiche un message de chargement
 * lorsque le composant d'une route est en train de charger.
 */
const RouteLoader: VoidComponent = () => {
  return (
    <div>
      <h2>Chargement de la page...</h2>
    </div>
  );
};

export default RouteLoader;
