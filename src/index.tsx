import "@unocss/reset/tailwind.css"
import "virtual:uno.css";

/* @refresh reload */
import { render } from 'solid-js/web'
import { lazy, Suspense } from "solid-js";
import { Router, Route, Navigate } from "@solidjs/router";

import RouteLoader from "~/components/RouteLoader";
import UserProvider from "~/contexts/user";

// On charge dynamiquement les vues pour améliorer les performances.
const ArticlesView = lazy(() => import('~/views/articles'));
const AuthView = lazy(() => import('~/views/auth'));
const ConstantsView = lazy(() => import('~/views/constants'));
const LeadersView = lazy(() => import('~/views/leaders'));
const OverviewView = lazy(() => import('~/views/overview'));
const PartnersView = lazy(() => import('~/views/partners'));
const TournamentsView = lazy(() => import('~/views/tournaments'));
const UserView = lazy(() => import('~/views/user'));

render(() => (
  <UserProvider>
    <Router root={(props) => (
      <Suspense fallback={<RouteLoader />}>
        {props.children}
      </Suspense>
    )}>
      <Route path="/articles" component={ArticlesView} />
      <Route path="/auth" component={AuthView} />
      <Route path="/constantes" component={ConstantsView} />
      <Route path="/dirigeants" component={LeadersView} />
      <Route path="/" component={OverviewView} />
      <Route path="/partenaires" component={PartnersView} />
      <Route path="/tournois" component={TournamentsView} />
      <Route path="/utilisateur" component={UserView} />

      {/* On redirige vers `/` si jamais rien ne correspond. */}
      <Route path="*404" component={() => <Navigate href="/" />} />
    </Router>
  </UserProvider>
), document.getElementById('root') as HTMLDivElement);
