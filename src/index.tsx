import "@unocss/reset/tailwind.css"
import "virtual:uno.css";

/* @refresh reload */
import { render } from 'solid-js/web'
import { Router, Route, Navigate } from "@solidjs/router";

import UserProvider from "~/contexts/user";

import OverviewView from '~/views/overview';
import AuthView from '~/views/auth';

render(() => (
  <UserProvider>
    <Router>
      <Route path="/" component={OverviewView} />
      <Route path="/auth" component={AuthView} />

      {/* On redirige vers `/` si jamais rien ne correspond. */}
      <Route path="*404" component={() => <Navigate href="/" />} />
    </Router>
  </UserProvider>
), document.getElementById('root') as HTMLDivElement);
