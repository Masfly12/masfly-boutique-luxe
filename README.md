# MASFLY — Boutique & Marketplace au Bénin

Application e-commerce full-stack pour la vente de produits mode, électronique et importés au Bénin.

## Stack technique

- **Frontend** : React 18 + TypeScript + Vite
- **UI** : Tailwind CSS + shadcn/ui (Radix UI)
- **Backend** : Supabase (PostgreSQL + Auth + Storage + RLS)
- **State** : TanStack Query v5
- **Routing** : React Router v6

## Démarrage rapide

```bash
# 1. Cloner le repo
git clone https://github.com/Masfly12/masfly-boutique-luxe.git
cd masfly-boutique-luxe

# 2. Installer les dépendances
npm install

# 3. Configurer les variables d'environnement
cp .env.example .env
# Remplir VITE_SUPABASE_URL et VITE_SUPABASE_PUBLISHABLE_KEY

# 4. Lancer en développement
npm run dev
```

## Configuration Supabase

1. Créer un projet sur [supabase.com](https://supabase.com)
2. Exécuter `supabase/schema/masfly_schema_complet.sql` dans l'éditeur SQL
3. Copier les clés API dans `.env`
4. Créer un compte admin :
   ```sql
   INSERT INTO public.user_roles (user_id, role) VALUES ('ton-uid', 'admin');
   ```

## Structure du projet

```
src/
├── pages/          # Pages de l'application (routes)
├── components/     # Composants UI réutilisables
│   ├── admin/      # Dashboard admin
│   └── vendor/     # Espace vendeur
├── hooks/          # Hooks React (data fetching, state)
├── integrations/   # Client Supabase + types
└── lib/            # Utilitaires (WhatsApp, classnames)

supabase/
├── migrations/     # Historique des migrations SQL
└── config.toml     # Config Supabase CLI
```

## Scripts disponibles

```bash
npm run dev      # Développement local
npm run build    # Build production
npm run preview  # Prévisualiser le build
npm run lint     # Vérifier le code
npm run test     # Lancer les tests
```

## Fonctionnalités

- 🛍️ Catalogue produits avec filtres et recherche serveur
- 🛒 Panier persistant (localStorage) + commandes sauvegardées en DB
- 📱 Checkout via WhatsApp
- ❤️ Favoris
- ⭐ Avis produits
- 👑 Dashboard admin (produits, commandes, vendeurs)
- 🏪 Espace multi-vendeurs avec validation admin obligatoire
- 🔐 Authentification Supabase + RLS

## Licence

Propriété de MASFLY. Tous droits réservés.