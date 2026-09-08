# 🚀 Guide de Migration Supabase pour AfriKoin Vibes Connect

## 📋 Table des matières
1. [Vue d'ensemble](#vue-densemble)
2. [Prérequis](#prérequis)
3. [Étapes de migration](#étapes-de-migration)
4. [Configuration Supabase](#configuration-supabase)
5. [Migration des données](#migration-des-données)
6. [Tests et validation](#tests-et-validation)
7. [Déploiement](#déploiement)

---

## 🎯 Vue d'ensemble

AfriKoin Vibes Connect utilise déjà **Supabase** pour l'authentification (`@supabase/supabase-js` v2.101.1). Cette migration optimisera et centralisera l'utilisation de Supabase pour :
- **Authentification** (Auth)
- **Base de données** (PostgreSQL)
- **Stockage de fichiers** (Storage)
- **Fonctions serverless** (Edge Functions)
- **Réplication temps réel** (Realtime)

### Stack actuel
- **Frontend** : React 18 + TypeScript + Vite
- **UI** : shadcn/ui + Tailwind CSS
- **Mobile** : Capacitor (Android/iOS)
- **Requêtes** : TanStack React Query
- **Backend** : PostgreSQL (PLpgSQL)
- **API** : Supabase (partiellement)

---

## ✅ Prérequis

### Avant de commencer
- [ ] Compte Supabase actif (https://supabase.com)
- [ ] Projet Supabase créé
- [ ] CLI Supabase installé : `npm install -g supabase`
- [ ] Variables d'environnement configurées
- [ ] Accès administrateur au repo GitHub
- [ ] Backup de la base de données existante

### Variables d'environnement nécessaires
```bash
# Supabase
VITE_SUPABASE_URL=https://your-project.supabase.co
VITE_SUPABASE_ANON_KEY=your-anon-key
VITE_SUPABASE_SERVICE_ROLE_KEY=your-service-role-key

# API Keys additionnelles (si nécessaire)
VITE_OPENAI_API_KEY=your-openai-key
VITE_STRIPE_PUBLIC_KEY=your-stripe-key
```

---

## 🔄 Étapes de migration

### Phase 1 : Préparation (1-2 jours)

#### 1.1 Audit de la base de données actuelle
```bash
# Listez toutes les tables
\dt

# Exportez le schéma
pg_dump --schema-only -U username -d database_name > schema.sql

# Exportez les données
pg_dump -U username -d database_name > data.sql
```

#### 1.2 Audit du code côté client
- [ ] Identifier toutes les interactions Supabase
- [ ] Lister les tables utilisées
- [ ] Documenter les requêtes RLS (Row Level Security)
- [ ] Vérifier les déclencheurs et fonctions PostgreSQL

#### 1.3 Créer une checklist d'audit
- [ ] Tables principales
- [ ] Colonnes et types de données
- [ ] Contraintes et clés étrangères
- [ ] Index et performances
- [ ] Politiques RLS existantes

---

### Phase 2 : Configuration Supabase (1 jour)

#### 2.1 Initialiser le projet Supabase localement
```bash
# Cloner le repo migration/supabase
git checkout migration/supabase

# Initialiser Supabase localement
supabase init

# Lancer Supabase en local pour tester
supabase start
```

#### 2.2 Création du schéma de base de données
Créez le fichier `supabase/migrations/001_initial_schema.sql` :

```sql
-- Utilisateurs et profils
CREATE TABLE public.users (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  auth_id UUID NOT NULL UNIQUE REFERENCES auth.users(id) ON DELETE CASCADE,
  email TEXT NOT NULL UNIQUE,
  username TEXT UNIQUE,
  full_name TEXT,
  avatar_url TEXT,
  bio TEXT,
  location TEXT,
  website TEXT,
  created_at TIMESTAMP WITH TIME ZONE DEFAULT now(),
  updated_at TIMESTAMP WITH TIME ZONE DEFAULT now()
);

-- Posts
CREATE TABLE public.posts (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  user_id UUID NOT NULL REFERENCES public.users(id) ON DELETE CASCADE,
  content TEXT NOT NULL,
  media_urls TEXT[] DEFAULT '{}',
  likes_count INTEGER DEFAULT 0,
  comments_count INTEGER DEFAULT 0,
  created_at TIMESTAMP WITH TIME ZONE DEFAULT now(),
  updated_at TIMESTAMP WITH TIME ZONE DEFAULT now()
);

-- Likes
CREATE TABLE public.likes (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  user_id UUID NOT NULL REFERENCES public.users(id) ON DELETE CASCADE,
  post_id UUID NOT NULL REFERENCES public.posts(id) ON DELETE CASCADE,
  created_at TIMESTAMP WITH TIME ZONE DEFAULT now(),
  UNIQUE(user_id, post_id)
);

-- Commentaires
CREATE TABLE public.comments (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  user_id UUID NOT NULL REFERENCES public.users(id) ON DELETE CASCADE,
  post_id UUID NOT NULL REFERENCES public.posts(id) ON DELETE CASCADE,
  content TEXT NOT NULL,
  created_at TIMESTAMP WITH TIME ZONE DEFAULT now(),
  updated_at TIMESTAMP WITH TIME ZONE DEFAULT now()
);

-- Suivis (Followers/Following)
CREATE TABLE public.follows (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  follower_id UUID NOT NULL REFERENCES public.users(id) ON DELETE CASCADE,
  following_id UUID NOT NULL REFERENCES public.users(id) ON DELETE CASCADE,
  created_at TIMESTAMP WITH TIME ZONE DEFAULT now(),
  UNIQUE(follower_id, following_id)
);

-- Portefeuille numérique
CREATE TABLE public.wallets (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  user_id UUID NOT NULL UNIQUE REFERENCES public.users(id) ON DELETE CASCADE,
  balance DECIMAL(10, 2) DEFAULT 0,
  currency TEXT DEFAULT 'USD',
  created_at TIMESTAMP WITH TIME ZONE DEFAULT now(),
  updated_at TIMESTAMP WITH TIME ZONE DEFAULT now()
);

-- Transactions
CREATE TABLE public.transactions (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  user_id UUID NOT NULL REFERENCES public.users(id) ON DELETE CASCADE,
  type TEXT NOT NULL CHECK (type IN ('deposit', 'withdrawal', 'transfer', 'payment')),
  amount DECIMAL(10, 2) NOT NULL,
  status TEXT DEFAULT 'pending' CHECK (status IN ('pending', 'completed', 'failed')),
  reference TEXT,
  created_at TIMESTAMP WITH TIME ZONE DEFAULT now(),
  updated_at TIMESTAMP WITH TIME ZONE DEFAULT now()
);

-- Indexes
CREATE INDEX idx_posts_user_id ON public.posts(user_id);
CREATE INDEX idx_posts_created_at ON public.posts(created_at DESC);
CREATE INDEX idx_likes_user_id ON public.likes(user_id);
CREATE INDEX idx_likes_post_id ON public.likes(post_id);
CREATE INDEX idx_comments_post_id ON public.comments(post_id);
CREATE INDEX idx_follows_follower_id ON public.follows(follower_id);
CREATE INDEX idx_follows_following_id ON public.follows(following_id);
```

#### 2.3 Configurer Row Level Security (RLS)
```sql
-- Activer RLS sur les tables
ALTER TABLE public.users ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.posts ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.likes ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.comments ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.follows ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.wallets ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.transactions ENABLE ROW LEVEL SECURITY;

-- Utilisateurs : lecture publique, modification personnelle
CREATE POLICY "Users can view all profiles"
  ON public.users FOR SELECT USING (true);

CREATE POLICY "Users can update their own profile"
  ON public.users FOR UPDATE USING (auth.uid() = id);

-- Posts : lecture publique, création/modification/suppression personnelle
CREATE POLICY "Anyone can view posts"
  ON public.posts FOR SELECT USING (true);

CREATE POLICY "Users can create posts"
  ON public.posts FOR INSERT WITH CHECK (auth.uid() = user_id);

CREATE POLICY "Users can update their own posts"
  ON public.posts FOR UPDATE USING (auth.uid() = user_id);

CREATE POLICY "Users can delete their own posts"
  ON public.posts FOR DELETE USING (auth.uid() = user_id);

-- Likes : gestion personnelle
CREATE POLICY "Users can view likes"
  ON public.likes FOR SELECT USING (true);

CREATE POLICY "Users can create likes"
  ON public.likes FOR INSERT WITH CHECK (auth.uid() = user_id);

CREATE POLICY "Users can delete their own likes"
  ON public.likes FOR DELETE USING (auth.uid() = user_id);

-- Commentaires : gestion personnelle
CREATE POLICY "Anyone can view comments"
  ON public.comments FOR SELECT USING (true);

CREATE POLICY "Users can create comments"
  ON public.comments FOR INSERT WITH CHECK (auth.uid() = user_id);

CREATE POLICY "Users can update their own comments"
  ON public.comments FOR UPDATE USING (auth.uid() = user_id);

CREATE POLICY "Users can delete their own comments"
  ON public.comments FOR DELETE USING (auth.uid() = user_id);

-- Portefeuille : accès personnel uniquement
CREATE POLICY "Users can view their own wallet"
  ON public.wallets FOR SELECT USING (auth.uid() = user_id);

CREATE POLICY "Users can update their own wallet"
  ON public.wallets FOR UPDATE USING (auth.uid() = user_id);

-- Transactions : accès personnel uniquement
CREATE POLICY "Users can view their own transactions"
  ON public.transactions FOR SELECT USING (auth.uid() = user_id);

CREATE POLICY "Users can create transactions"
  ON public.transactions FOR INSERT WITH CHECK (auth.uid() = user_id);
```

---

### Phase 3 : Migration du code (2-3 jours)

#### 3.1 Créer les services Supabase
Créez `src/services/supabase.ts` :

```typescript
import { createClient } from '@supabase/supabase-js';
import type { Database } from './database.types';

const supabaseUrl = import.meta.env.VITE_SUPABASE_URL;
const supabaseAnonKey = import.meta.env.VITE_SUPABASE_ANON_KEY;

if (!supabaseUrl || !supabaseAnonKey) {
  throw new Error('Missing Supabase environment variables');
}

export const supabase = createClient<Database>(supabaseUrl, supabaseAnonKey);

// Auth service
export const authService = {
  signUp: (email: string, password: string) =>
    supabase.auth.signUp({ email, password }),
  signIn: (email: string, password: string) =>
    supabase.auth.signInWithPassword({ email, password }),
  signOut: () => supabase.auth.signOut(),
  getUser: () => supabase.auth.getUser(),
  resetPassword: (email: string) =>
    supabase.auth.resetPasswordForEmail(email),
};

// User service
export const userService = {
  getProfile: (userId: string) =>
    supabase.from('users').select('*').eq('id', userId).single(),
  updateProfile: (userId: string, data: Partial<User>) =>
    supabase.from('users').update(data).eq('id', userId),
  getUserByUsername: (username: string) =>
    supabase.from('users').select('*').eq('username', username).single(),
};

// Posts service
export const postService = {
  getPosts: (limit = 20, offset = 0) =>
    supabase
      .from('posts')
      .select(`*, user:users(*)`)
      .order('created_at', { ascending: false })
      .range(offset, offset + limit - 1),
  getPostById: (id: string) =>
    supabase.from('posts').select('*, user:users(*)').eq('id', id).single(),
  createPost: (userId: string, content: string, mediaUrls?: string[]) =>
    supabase.from('posts').insert({
      user_id: userId,
      content,
      media_urls: mediaUrls || [],
    }),
  updatePost: (id: string, content: string) =>
    supabase.from('posts').update({ content }).eq('id', id),
  deletePost: (id: string) =>
    supabase.from('posts').delete().eq('id', id),
};

// Likes service
export const likeService = {
  getLikes: (postId: string) =>
    supabase.from('likes').select('*').eq('post_id', postId),
  likePost: (userId: string, postId: string) =>
    supabase.from('likes').insert({ user_id: userId, post_id: postId }),
  unlikePost: (userId: string, postId: string) =>
    supabase.from('likes').delete().match({ user_id: userId, post_id: postId }),
};

// Storage service
export const storageService = {
  uploadFile: (bucket: string, path: string, file: File) =>
    supabase.storage.from(bucket).upload(path, file),
  deleteFile: (bucket: string, path: string) =>
    supabase.storage.from(bucket).remove([path]),
  getPublicUrl: (bucket: string, path: string) =>
    supabase.storage.from(bucket).getPublicUrl(path),
};

// Wallet service
export const walletService = {
  getWallet: (userId: string) =>
    supabase.from('wallets').select('*').eq('user_id', userId).single(),
  getTransactions: (userId: string, limit = 50) =>
    supabase
      .from('transactions')
      .select('*')
      .eq('user_id', userId)
      .order('created_at', { ascending: false })
      .limit(limit),
};
```

#### 3.2 Générer les types TypeScript
```bash
# Installer le CLI Supabase
npm install -g supabase

# Générer les types
supabase gen types typescript --project-id your-project-id > src/services/database.types.ts
```

#### 3.3 Remplacer les appels API existants
- [ ] Remplacer les requêtes HTTP par les services Supabase
- [ ] Utiliser React Query avec Supabase
- [ ] Mettre à jour les hooks personnalisés

Créez `src/hooks/useSupabase.ts` :

```typescript
import { useQuery, useMutation, useQueryClient } from '@tanstack/react-query';
import { supabase } from '@/services/supabase';

// Hook pour récupérer les posts
export function usePosts(limit = 20, offset = 0) {
  return useQuery({
    queryKey: ['posts', limit, offset],
    queryFn: async () => {
      const { data, error } = await supabase
        .from('posts')
        .select('*, user:users(*), likes(*)')
        .order('created_at', { ascending: false })
        .range(offset, offset + limit - 1);
      
      if (error) throw error;
      return data;
    },
  });
}

// Hook pour créer un post
export function useCreatePost() {
  const queryClient = useQueryClient();
  
  return useMutation({
    mutationFn: async ({ content, mediaUrls }: { content: string; mediaUrls?: string[] }) => {
      const { data: user } = await supabase.auth.getUser();
      if (!user.user) throw new Error('Not authenticated');
      
      const { data, error } = await supabase
        .from('posts')
        .insert({
          user_id: user.user.id,
          content,
          media_urls: mediaUrls || [],
        })
        .select()
        .single();
      
      if (error) throw error;
      return data;
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['posts'] });
    },
  });
}

// Hook pour liker un post
export function useLikePost() {
  const queryClient = useQueryClient();
  
  return useMutation({
    mutationFn: async ({ postId }: { postId: string }) => {
      const { data: user } = await supabase.auth.getUser();
      if (!user.user) throw new Error('Not authenticated');
      
      const { error } = await supabase
        .from('likes')
        .insert({ user_id: user.user.id, post_id: postId });
      
      if (error) throw error;
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['posts'] });
    },
  });
}
```

---

### Phase 4 : Migration des données (1-2 jours)

#### 4.1 Exporter les données existantes
```bash
# Exporter en format JSON
pg_dump -U username -d database_name --data-only --format=json > data.json

# Ou en CSV
COPY users TO STDOUT CSV HEADER > users.csv;
```

#### 4.2 Script de migration
Créez `scripts/migrate-data.ts` :

```typescript
import { createClient } from '@supabase/supabase-js';
import * as fs from 'fs';

const supabase = createClient(
  process.env.SUPABASE_URL!,
  process.env.SUPABASE_SERVICE_ROLE_KEY!
);

async function migrateUsers() {
  const usersData = JSON.parse(fs.readFileSync('data/users.json', 'utf-8'));
  
  console.log(`Migrating ${usersData.length} users...`);
  
  for (const user of usersData) {
    const { error } = await supabase.from('users').insert({
      id: user.id,
      email: user.email,
      username: user.username,
      full_name: user.full_name,
      avatar_url: user.avatar_url,
      bio: user.bio,
      location: user.location,
      website: user.website,
      created_at: user.created_at,
      updated_at: user.updated_at,
    });
    
    if (error) console.error(`Error migrating user ${user.id}:`, error);
  }
  
  console.log('Users migration completed!');
}

async function migratePosts() {
  const postsData = JSON.parse(fs.readFileSync('data/posts.json', 'utf-8'));
  
  console.log(`Migrating ${postsData.length} posts...`);
  
  for (const post of postsData) {
    const { error } = await supabase.from('posts').insert({
      id: post.id,
      user_id: post.user_id,
      content: post.content,
      media_urls: post.media_urls,
      likes_count: post.likes_count,
      comments_count: post.comments_count,
      created_at: post.created_at,
      updated_at: post.updated_at,
    });
    
    if (error) console.error(`Error migrating post ${post.id}:`, error);
  }
  
  console.log('Posts migration completed!');
}

async function main() {
  try {
    await migrateUsers();
    await migratePosts();
    console.log('Migration completed successfully!');
  } catch (error) {
    console.error('Migration failed:', error);
    process.exit(1);
  }
}

main();
```

Lancez la migration :
```bash
npm run ts-node scripts/migrate-data.ts
```

---

### Phase 5 : Configuration de Supabase Cloud (1 jour)

#### 5.1 Créer les buckets de stockage
```bash
# Via Supabase Dashboard ou CLI
supabase storage create avatars --public
supabase storage create posts --public
supabase storage create documents --public
```

#### 5.2 Configurer l'authentification
- [ ] Google OAuth
- [ ] GitHub OAuth
- [ ] Email/Password
- [ ] Vérification d'email

Allez dans **Supabase Dashboard → Authentication → Providers**

#### 5.3 Configurer les e-mails transactionnels
- [ ] Email de bienvenue
- [ ] Email de réinitialisation de mot de passe
- [ ] Notifications

---

### Phase 6 : Tests et validation (2-3 jours)

#### 6.1 Tests locaux
```bash
# Lancer Supabase localement
supabase start

# Lancer l'application
npm run dev

# Tests
npm run test
```

#### 6.2 Vérifications
- [ ] Authentification complète
- [ ] CRUD posts/commentaires
- [ ] Système de likes
- [ ] Portefeuille numérique
- [ ] Upload de fichiers
- [ ] Performances des requêtes
- [ ] RLS correctement appliquée

#### 6.3 Tests en environnement de staging
```bash
# Déployer sur Vercel avec env Supabase de staging
vercel env add VITE_SUPABASE_URL
vercel env add VITE_SUPABASE_ANON_KEY
vercel deploy --prod
```

---

### Phase 7 : Déploiement en production (1 jour)

#### 7.1 Checklist final
- [ ] Backup complet de la base de données
- [ ] Tous les tests passent
- [ ] RLS validée en staging
- [ ] Performance acceptable
- [ ] Documentation mise à jour
- [ ] Plan de rollback préparé

#### 7.2 Déployer en production
```bash
# Mettre à jour les variables d'environnement production
vercel env add VITE_SUPABASE_URL (production URL)
vercel env add VITE_SUPABASE_ANON_KEY (production key)

# Déployer
vercel deploy --prod

# Vérifier les logs
vercel logs
```

#### 7.3 Monitoring post-déploiement
- [ ] Vérifier les erreurs dans Sentry/Supabase Dashboard
- [ ] Monitorer les performances
- [ ] Vérifier les métriques d'utilisation
- [ ] Support client disponible 24h

---

## 📊 Configuration Supabase

### Fichier `.env.local`
```bash
# Supabase
VITE_SUPABASE_URL=https://your-project.supabase.co
VITE_SUPABASE_ANON_KEY=your-anon-key
VITE_SUPABASE_SERVICE_ROLE_KEY=your-service-role-key

# Développement local
SUPABASE_LOCAL=true
```

### Structure des fichiers
```
supabase/
├── migrations/
│   ├── 001_initial_schema.sql
│   ├── 002_rls_policies.sql
│   ├── 003_functions.sql
│   └── 004_indexes.sql
├── functions/
│   ├── generate-thumbnail/
│   ├── moderate-content/
│   └── send-notifications/
└── config.toml
```

---

## 🧪 Tests et validation

### Scripts de test
```json
{
  "scripts": {
    "test": "vitest",
    "test:e2e": "playwright test",
    "test:supabase": "npm run test -- src/services/supabase",
    "type-check": "tsc --noEmit"
  }
}
```

### Tests unitaires (`src/services/__tests__/supabase.test.ts`)
```typescript
import { describe, it, expect, beforeEach } from 'vitest';
import { userService, postService } from '@/services/supabase';

describe('Supabase Services', () => {
  describe('userService', () => {
    it('should fetch user profile', async () => {
      const { data, error } = await userService.getProfile('user-id');
      expect(error).toBeNull();
      expect(data).toBeDefined();
    });
  });

  describe('postService', () => {
    it('should fetch posts with pagination', async () => {
      const { data, error } = await postService.getPosts(20, 0);
      expect(error).toBeNull();
      expect(data?.length).toBeLessThanOrEqual(20);
    });
  });
});
```

---

## 🚀 Déploiement

### Vercel + Supabase
1. Connecter le repo GitHub
2. Ajouter les variables d'environnement
3. Configurer les webhooks Supabase
4. Déployer automatiquement

### Docker (Optional)
```dockerfile
FROM node:20-alpine
WORKDIR /app
COPY package*.json ./
RUN npm ci
COPY . .
RUN npm run build
EXPOSE 3000
CMD ["npm", "run", "preview"]
```

---

## 📝 Checklist de migration

- [ ] Audit des bases de données
- [ ] Schéma Supabase créé
- [ ] RLS configurée
- [ ] Services TypeScript créés
- [ ] Code migré vers Supabase
- [ ] Données migrées
- [ ] Tests locaux réussis
- [ ] Tests en staging réussis
- [ ] Backup production
- [ ] Déploiement en production
- [ ] Monitoring activé
- [ ] Documentation mise à jour

---

## 🔗 Ressources utiles

- [Supabase Docs](https://supabase.com/docs)
- [Supabase Auth](https://supabase.com/docs/guides/auth)
- [Supabase Database](https://supabase.com/docs/guides/database)
- [Row Level Security](https://supabase.com/docs/guides/auth/row-level-security)
- [React Query Supabase Integration](https://supabase.com/docs/guides/realtime)

---

**Dernière mise à jour** : 2024
**Statut** : Migration en cours
**Branche** : `migration/supabase`
