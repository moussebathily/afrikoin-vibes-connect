import { ArticleLayout } from "./ArticleLayout"

export default function PayerMobileMoneyPage() {
  return (
    <ArticleLayout
      slug="paiement-mobile-money"
      title="Payer en ligne avec Mobile Money : guide Orange, Wave, MTN, Moov"
      description="Tout savoir sur le paiement Mobile Money en Afrique : opérateurs acceptés, frais, sécurité, cash à la livraison et délai de versement vendeur sur AfriKoin."
      publishedAt="2026-06-03"
      readingMinutes={5}
    >
      <p>
        Le <strong>Mobile Money</strong> est devenu le moyen de paiement n°1 en
        Afrique de l'Ouest et centrale. Plus de 600 millions de comptes actifs
        sur le continent. Voici comment payer (et être payé) sans friction sur
        AfriKoin.
      </p>

      <h2>Les opérateurs acceptés sur AfriKoin</h2>
      <ul>
        <li>
          <strong>Orange Money</strong> — Sénégal, Mali, Côte d'Ivoire, Burkina,
          Cameroun, Madagascar et 11 autres pays
        </li>
        <li>
          <strong>Wave</strong> — Sénégal, Côte d'Ivoire, Mali, Burkina, Ouganda
          (0 % de frais utilisateur)
        </li>
        <li>
          <strong>MTN Mobile Money (MoMo)</strong> — Ghana, Nigeria, Ouganda,
          Cameroun, Bénin, Rwanda, etc.
        </li>
        <li>
          <strong>Moov Money</strong> — Côte d'Ivoire, Togo, Bénin, Burkina,
          Centrafrique
        </li>
      </ul>

      <h2>Comment payer en 4 étapes</h2>
      <ol>
        <li>Sur la fiche produit, cliquez « Acheter maintenant »</li>
        <li>
          Choisissez votre opérateur Mobile Money et entrez votre numéro
        </li>
        <li>Validez le push reçu sur votre téléphone (code PIN)</li>
        <li>Le paiement est confirmé sous 5 à 15 secondes</li>
      </ol>

      <h2>Frais et coûts cachés ?</h2>
      <p>
        AfriKoin ne prélève <strong>aucun frais supplémentaire</strong> côté
        acheteur sur Mobile Money. Les seuls frais sont ceux de votre opérateur
        (souvent 1 % plafonné). Wave est gratuit pour les utilisateurs. Comparez
        toujours avant de transférer.
      </p>

      <h2>Cash à la livraison : quand et où ?</h2>
      <p>
        Le <strong>paiement à la livraison</strong> est disponible dans :
      </p>
      <ul>
        <li>Toutes les capitales et grandes villes (Dakar, Abidjan, Lagos…)</li>
        <li>Pour les commandes inférieures à 100 000 FCFA</li>
        <li>Pour les vendeurs ayant activé l'option dans leurs paramètres</li>
      </ul>
      <p>
        Frais de livraison généralement +500 à +2 000 FCFA par rapport à un
        paiement digital.
      </p>

      <h2>Sécurité : vos données sont-elles protégées ?</h2>
      <p>
        AfriKoin ne stocke <strong>jamais</strong> votre code PIN ni votre numéro
        Mobile Money en clair. Les transactions transitent par des partenaires
        certifiés PCI-DSS Level 1 avec chiffrement TLS 1.3. Aucun employé
        AfriKoin n'a accès à vos identifiants.
      </p>

      <h2>Quand le vendeur reçoit-il l'argent ?</h2>
      <p>Pour protéger les acheteurs, les fonds sont libérés :</p>
      <ul>
        <li>
          <strong>Automatiquement</strong> 7 jours après livraison sans litige
        </li>
        <li>
          <strong>Immédiatement</strong> dès que l'acheteur confirme la
          réception
        </li>
      </ul>
      <p>
        Le vendeur peut ensuite retirer instantanément vers son Mobile Money
        (frais 1 %, minimum 100 FCFA).
      </p>

      <h2>Bon à savoir</h2>
      <ul>
        <li>Limites : Wave 1 M FCFA/jour, Orange Money 2 M FCFA/jour</li>
        <li>
          En cas d'échec de paiement, votre solde n'est jamais débité — vérifiez
          votre couverture réseau
        </li>
        <li>
          Pour les paiements transfrontaliers (CEDEAO), AfriKoin convertit
          automatiquement au taux du jour
        </li>
      </ul>
    </ArticleLayout>
  )
}
