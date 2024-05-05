import { type Component } from "solid-js";

const NavBar: Component = () => {
  return (
    <header>
      <nav class="flex gap-4 px-6 py-4 border-b">
        <a href="/articles">Articles</a>
        <a href="/tournois">Tournois</a>
        <a href="/partenaires">Partenaires</a>
        <a href="/dirigeants">Dirigeants</a>
        <a href="/enseignants">Enseignants</a>
    
        <a href="/utilisateur" class="ml-auto">Mon compte</a>
        <a href="https://ltcg.club/" target="_blank">Voir le site publié</a>
      </nav>
    </header>
  )
};

export default NavBar;
