import { ArticleLayout } from "./ArticleLayout"

export default function VendreEnConfiancePage() {
  return (
    <ArticleLayout
      slug="vendre-en-confiance"
      title="Vendre sur AfriKoin : commission, badge Premium et boost visibilité"
      description="Guide vendeur AfriKoin : inscription gratuite, commission 5%, abonnement Premium 5000 FCFA/mois, badge Vérifié, boost produit et IA description automatique."
      publishedAt="2026-06-03"
      readingMinutes={6}
    >
      <p>
        Lancer son activité d'e-commerce en Afrique n'a jamais été aussi simple.
        AfriKoin met à disposition tous les outils — paiement Mobile Money,
        logistique, IA, marketing — pour des vendeurs <strong>indépendants,
        boutiques et grossistes</strong>.
      </p>

      <h2>Inscription en 3 minutes</h2>
      <ol>
        <li>Créez un compte vendeur (gratuit, sans engagement)</li>
        <li>
          Renseignez votre nom de boutique, logo, pays et catégories de produits
        </li>
        <li>
          Ajoutez un numéro Mobile Money pour recevoir vos paiements (Orange,
          Wave, MTN, Moov)
        </li>
      </ol>
      <p>
        Pas de registre de commerce exigé pour démarrer. Pour activer la
        livraison internationale, un IFU (Identifiant Fiscal Unique) ou
        équivalent sera demandé selon le pays.
      </p>

      <h2>Combien coûte la vente sur AfriKoin ?</h2>
      <table>
        <thead>
          <tr>
            <th>Plan</th>
            <th>Commission</th>
            <th>Abonnement</th>
          </tr>
        </thead>
        <tbody>
          <tr>
            <td>Gratuit</td>
            <td>5 % par vente</td>
            <td>0 FCFA</td>
          </tr>
          <tr>
            <td>Premium</td>
            <td>3 % par vente</td>
            <td>5 000 FCFA/mois</td>
          </tr>
        </tbody>
      </table>
      <p>
        <strong>Aucun frais d'annonce.</strong> Vous ne payez que quand vous
        vendez. Le retrait vers Mobile Money coûte 1 % (min 100 FCFA).
      </p>

      <h2>Obtenir le badge « Vérifié »</h2>
      <p>
        Le badge bleu <strong>multiplie vos ventes par 2,5 en moyenne</strong>{" "}
        (statistique AfriKoin Q1 2026). Pour l'obtenir :
      </p>
      <ol>
        <li>Téléversez une pièce d'identité (CIN, passeport, permis)</li>
        <li>Faites un selfie liveness (anti-fraude)</li>
        <li>Confirmez votre numéro de téléphone par SMS</li>
        <li>Validation manuelle sous 24h ouvrées</li>
      </ol>

      <h2>Booster votre visibilité</h2>
      <p>Trois leviers, par ordre d'efficacité :</p>
      <ul>
        <li>
          <strong>1. Abonnement Premium</strong> — priorité dans l'algorithme,
          badge doré, statistiques avancées, support prioritaire
        </li>
        <li>
          <strong>2. Boost produit</strong> — 500 FCFA / 24h pour propulser un
          article en tête de catégorie
        </li>
        <li>
          <strong>3. SEO produit</strong> — titre clair (60 caractères), 5+
          photos HD, description riche en mots-clés, vidéo si possible
        </li>
      </ul>

      <h2>L'IA AfriKoin pour vendre plus vite</h2>
      <p>
        Prenez une photo, l'IA génère <strong>en 5 secondes</strong> :
      </p>
      <ul>
        <li>Un titre optimisé SEO</li>
        <li>Une description complète multilingue (FR, EN, WO, HA, AR)</li>
        <li>Une catégorie suggérée</li>
        <li>Une fourchette de prix selon le marché local</li>
      </ul>
      <p>
        Vous validez, modifiez, publiez. Gratuit pour tous les vendeurs.
      </p>

      <h2>Outils pro inclus</h2>
      <ul>
        <li>Dashboard ventes avec graphiques (jour, semaine, mois)</li>
        <li>Gestion du stock multi-canal avec seuils d'alerte</li>
        <li>Messagerie client avec traduction automatique FR/WO/HA</li>
        <li>Statistiques de conversion par produit</li>
        <li>Export CSV des commandes pour votre comptabilité</li>
      </ul>

      <h2>Les bonnes pratiques des top vendeurs</h2>
      <ol>
        <li>
          <strong>Répondre en moins de 1h</strong> aux messages (multiplie la
          conversion par 1,6)
        </li>
        <li>Expédier sous 24h pour décrocher le badge dédié</li>
        <li>
          Demander un avis après chaque vente livrée (+30 % d'avis collectés)
        </li>
        <li>Refuser fermement les paiements hors plateforme</li>
        <li>
          Publier au moins 3 nouveaux produits par semaine pour rester visible
        </li>
      </ol>

      <h2>Foire aux questions vendeurs</h2>
      <p>
        Plus de questions ? Consultez la <a href="/aide">FAQ complète</a> ou
        posez-les directement à <a href="/aide#assistant">l'assistant IA</a>{" "}
        AfriKoin.
      </p>
    </ArticleLayout>
  )
}
