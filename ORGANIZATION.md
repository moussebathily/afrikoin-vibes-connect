# AfriKoin - Structure Organisationnelle GitHub

## 🏢 Équipes et Responsabilités

### @afrikoin-team/core
**Responsabilités**: Architecture globale, décisions techniques majeures, revue de code critique
- **Permissions**: Admin sur tous les repositories
- **Membres recommandés**: Lead developers, architects
- **Accès**: Tous les secrets de production

### @afrikoin-team/frontend
**Responsabilités**: Interface utilisateur, expérience utilisateur, composants React
- **Permissions**: Write sur les dossiers `/src/components/`, `/src/pages/`
- **Revue requise**: Changements UI/UX, nouveaux composants
- **Stack**: React, TypeScript, Tailwind CSS

### @afrikoin-team/mobile
**Responsabilités**: Application mobile, configuration Capacitor, builds Android/iOS
- **Permissions**: Write sur `/android/`, `/ios/`, `capacitor.config.ts`
- **Revue requise**: Changements de configuration mobile, builds de production
- **Stack**: Capacitor, Android, iOS

### @afrikoin-team/backend
**Responsabilités**: API Supabase, edge functions, base de données
- **Permissions**: Write sur `/supabase/`, `/src/integrations/supabase/`
- **Revue requise**: Changements de schéma DB, nouvelles functions
- **Stack**: Supabase, PostgreSQL, TypeScript

### @afrikoin-team/ai
**Responsabilités**: Fonctionnalités IA, intégrations ML, modération de contenu
- **Permissions**: Write sur `/src/components/ai/`, `/supabase/functions/ai-*`
- **Revue requise**: Nouveaux modèles IA, changements d'algorithmes
- **Stack**: Hugging Face, OpenAI, transformers

### @afrikoin-team/devops
**Responsabilités**: CI/CD, déploiement, infrastructure, monitoring
- **Permissions**: Write sur `/.github/`, `/scripts/`, configurations de déploiement
- **Revue requise**: Changements de workflow, configurations de production
- **Stack**: GitHub Actions, Vercel, Google Cloud, Docker

### @afrikoin-team/security
**Responsabilités**: Sécurité, authentification, gestion des accès
- **Permissions**: Write sur les fonctions d'auth et de paiement
- **Revue requise**: Changements d'authentification, gestion des permissions
- **Accès**: Secrets de sécurité uniquement

### @afrikoin-team/payments
**Responsabilités**: Intégration de paiement, transactions, facturation
- **Permissions**: Write sur les fonctions de paiement
- **Revue requise**: Toute modification liée aux paiements
- **Stack**: Stripe, PayPal, webhook handlers

### @afrikoin-team/i18n
**Responsabilités**: Internationalisation, traductions, localisation
- **Permissions**: Write sur `/src/i18n/`, composants de langue
- **Revue requise**: Nouvelles traductions, changements de structure i18n
- **Langues**: EN, FR, AR, HA, PT, SW, YO

### @afrikoin-team/documentation
**Responsabilités**: Documentation technique, guides utilisateur, API docs
- **Permissions**: Write sur tous les fichiers `.md`
- **Revue requise**: Changements de documentation majeure

## 🔒 Niveaux d'Accès

### Administrateurs
- **Qui**: @afrikoin-team/core + mainteneurs senior
- **Accès**: Tous les secrets, paramètres d'organisation, branch protection
- **Responsabilités**: Gestion des équipes, sécurité globale

### Mainteneurs
- **Qui**: Leads techniques de chaque équipe
- **Accès**: Secrets de développement, merge des PR
- **Responsabilités**: Revue de code, mentoring, direction technique

### Développeurs
- **Qui**: Contributeurs réguliers
- **Accès**: Repository read/write selon l'équipe
- **Responsabilités**: Développement, tests, documentation

### Contributeurs Externes
- **Qui**: Contributeurs occasionnels, open source
- **Accès**: Fork et PR uniquement
- **Responsabilités**: Contributions ponctuelles

## 🛡️ Configuration de Sécurité

### Branch Protection (main)
- ✅ Require pull request reviews (minimum 2)
- ✅ Dismiss stale reviews when new commits are pushed
- ✅ Require review from code owners
- ✅ Restrict pushes that create public repositories
- ✅ Require branches to be up to date before merging
- ✅ Require status checks to pass before merging
- ✅ Include administrators in restrictions

### Required Status Checks
- ✅ Build and Test (`npm run build`)
- ✅ Type Check (`tsc --noEmit`)
- ✅ Lint (`eslint`)
- ✅ Security Scan (Dependabot)

### Secrets Management
- **Production**: Accès limité aux administrateurs
- **Staging**: Accès aux mainteneurs et core team
- **Development**: Accès aux équipes concernées
- **Rotation**: Quarterly pour les secrets critiques

## 📋 Processus de Review

### PR Standard
1. **Assignation automatique**: Selon CODEOWNERS
2. **Checks requis**: Build, tests, lint, type-check
3. **Reviews**: Minimum 2 approvals
4. **Merge**: Squash and merge preferred

### PR Critique (Production, Sécurité, Paiements)
1. **Reviews**: Minimum 3 approvals incluant un administrateur
2. **Checks étendus**: Tests d'intégration, audit de sécurité
3. **Validation**: Test en staging obligatoire
4. **Merge**: Merge commit avec signature GPG

### PR Emergency (Hotfix)
1. **Fast-track**: Avec approbation d'un administrateur
2. **Post-deployment**: Review obligatoire dans les 24h
3. **Documentation**: Incident report requis

## 🔄 Workflow de Collaboration

### Développement
1. **Feature branch**: `feature/team-description`
2. **Commits**: Conventional commits obligatoires
3. **Tests**: Couverture minimale 80%
4. **Documentation**: Mise à jour obligatoire

### Release
1. **Release branch**: `release/vX.Y.Z`
2. **Testing**: Full regression testing
3. **Approval**: Core team sign-off
4. **Deployment**: Staged rollout

### Hotfix
1. **Hotfix branch**: `hotfix/description`
2. **Fast merge**: Avec approbation admin
3. **Backport**: Vers develop après validation

## 📊 Monitoring et Audit

### Métriques Surveillées
- **PR Metrics**: Temps de review, taux d'approbation
- **Code Quality**: Coverage, complexity, duplication
- **Security**: Vulnerability scans, dependency updates
- **Performance**: Build times, deployment frequency

### Audit de Sécurité
- **Accès**: Review trimestrielle des permissions
- **Secrets**: Rotation automatique
- **Dependencies**: Scan hebdomadaire
- **Code**: Security review mensuelle

## 🎓 Onboarding

### Nouveaux Membres
1. **Invitation**: Par un administrateur
2. **Équipe**: Assignation selon expertise
3. **Formation**: Onboarding doc + pairing session
4. **Accès graduel**: Permissions étendues après validation

### Processus de Départ
1. **Révocation**: Immédiate de tous les accès
2. **Secrets**: Rotation des secrets partagés
3. **Handover**: Documentation des responsabilités
4. **Archive**: Sauvegarde des contributions

## 📞 Support et Escalation

### Support Technique
- **L1**: Questions générales → @afrikoin-team/documentation
- **L2**: Bugs et features → Équipe concernée
- **L3**: Architecture et sécurité → @afrikoin-team/core

### Escalation d'Urgence
- **P0 (Critical)**: Security breach, production down → Administrateurs
- **P1 (High)**: Feature broken, data loss → Équipe + core
- **P2 (Medium)**: Performance issue → Équipe concernée
- **P3 (Low)**: Enhancement request → Product team