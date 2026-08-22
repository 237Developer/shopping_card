# Shopping Card

Une application de boutique en ligne réalisée avec **React** et **Vite**. Elle permet de parcourir un catalogue de produits, de filtrer ou rechercher un article, puis de gérer un panier avant le passage au paiement.

> Ce projet a avant tout été conçu comme un exercice pratique pour approfondir les fondations de React et construire une interface complète, dynamique et testée.

## Aperçu des fonctionnalités

- Affichage de produits récupérés depuis l’API publique [Fake Store API](https://fakestoreapi.com/)
- Page d’accueil avec mise en avant de produits
- Page boutique avec catégories et recherche avec délai (*debounce*)
- Ajout d’articles au panier et choix de leur quantité
- Modification des quantités directement depuis le panier
- Calcul automatique du sous-total en FCFA
- Barre latérale et navigation entre les pages
- Gestion des états de chargement et d’erreur lors de la récupération des données

## Ce que ce projet m’a permis d’apprendre et d’approfondir

Ce projet m’a permis de consolider plusieurs notions importantes de l’écosystème React :

- **Les composants réutilisables** : découper l’interface en composants indépendants (cartes produit, bouton, navigation, panier, etc.).
- **Les props** : transmettre les données et les fonctions nécessaires entre les composants.
- **Les états (`useState`)** : gérer l’ouverture de la barre latérale, les quantités choisies, les articles du panier, les filtres et la recherche.
- **Les effets (`useEffect`)** : charger les produits depuis une API et réagir aux changements de recherche.
- **Les hooks personnalisés** : isoler la récupération des produits (`useFetchData`) et le délai de recherche (`useDebounce`).
- **Le routage avec React Router** : organiser la navigation entre l’accueil, la boutique et le panier, ainsi que partager l’état du panier via le contexte des routes.
- **Les tests d’interface** : vérifier avec Vitest et React Testing Library l’ajout au panier, la mise à jour des quantités et le recalcul du sous-total.
- **Le style modulaire** : utiliser des CSS Modules pour garder les styles des composants isolés et maintenables.

## Technologies utilisées

- [React](https://react.dev/)
- [Vite](https://vite.dev/)
- [React Router](https://reactrouter.com/)
- [Vitest](https://vitest.dev/) et [React Testing Library](https://testing-library.com/docs/react-testing-library/intro/)
- [Iconify](https://iconify.design/)
- [Fake Store API](https://fakestoreapi.com/)

## Installation en local

### Prérequis

- [Node.js](https://nodejs.org/) (version LTS recommandée)
- npm, inclus avec Node.js

### Étapes

1. Clonez le dépôt puis accédez au dossier du projet :

   ```bash
   git clone https://github.com/237Developer/shopping_card.git
   cd shopping_card
   ```

2. Installez les dépendances :

   ```bash
   npm install
   ```

3. Lancez le serveur de développement :

   ```bash
   npm run dev
   ```

4. Ouvrez l’adresse indiquée dans le terminal — généralement `http://localhost:5173`.

> L’application charge le catalogue depuis Fake Store API : une connexion Internet est donc nécessaire pour afficher les produits.

## Scripts disponibles

| Commande | Description |
| --- | --- |
| `npm run dev` | Démarre le serveur de développement avec rechargement automatique. |
| `npm run build` | Génère une version optimisée de l’application dans `dist/`. |
| `npm run preview` | Prévisualise localement la version construite. |
| `npm run lint` | Analyse le code avec ESLint. |
| `npm test` | Lance les tests avec Vitest. |

Pour exécuter les tests une seule fois :

```bash
npm run test
```

## Structure du projet

```text
src/
├── composants/   # Composants réutilisables de l’interface
├── pages/        # Pages Accueil, Boutique et Panier
├── hooks/        # Hooks personnalisés
├── routes/       # Configuration de React Router
├── styles/       # CSS Modules
├── test/         # Tests des composants et du panier
└── utils/        # Fonctions utilitaires
```

## Tests couverts

Les tests automatisés vérifient notamment :

- le choix d’une quantité et l’ajout d’un produit au panier ;
- la mise à jour d’un article déjà présent sans créer de doublon ;
- l’augmentation et la diminution des quantités depuis le panier ;
- la mise à jour du sous-total après modification d’une quantité.

## Auteur

Projet réalisé dans une démarche d’apprentissage et d’approfondissement de React.

DJIOGUE JUNIOR.
