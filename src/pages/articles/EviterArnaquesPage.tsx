import { ArticleLayout } from "./ArticleLayout"

export default function EviterArnaquesPage() {
  return (
    <ArticleLayout
      slug="eviter-arnaques"
      title="Comment éviter les arnaques quand on achète en ligne en Afrique"
      description="Guide complet pour reconnaître les vendeurs fiables, sécuriser vos paiements Mobile Money et réagir en cas de litige sur AfriKoin."
      publishedAt="2026-06-03"
      readingMinutes={6}
    >
      <p>
        L'e-commerce explose en Afrique, mais les arnaques aussi. Voici les
        réflexes essentiels pour <strong>acheter en toute confiance</strong> sur
        AfriKoin et les autres plateformes panafricaines.
      </p>

      <h2>1. Vérifier le profil du vendeur avant tout achat</h2>
      <p>
        Avant de cliquer sur « Acheter », prenez 30 secondes pour examiner le
        profil :
      </p>
      <ul>
        <li>
          <strong>Badge « Vérifié »</strong> bleu : indique que l'identité a été
          contrôlée (pièce d'identité + selfie + téléphone)
        </li>
        <li>
          <strong>Score de confiance</strong> : agrégat de ventes, avis et
          ancienneté. Cherchez 70/100 minimum.
        </li>
        <li>
          <strong>Avis vérifiés</strong> : lisez surtout les avis 1 à 3 étoiles
          pour repérer les motifs récurrents
        </li>
        <li>
          <strong>Réponses du vendeur</strong> : un vendeur qui répond
          professionnellement aux critiques est rassurant
        </li>
      </ul>

      <h2>2. Ne jamais payer en dehors de la plateforme</h2>
      <p>
        C'est la règle d'or. Un vendeur qui vous demande de payer par WhatsApp,
        virement direct ou Mobile Money personnel <strong>n'est pas protégé</strong>{" "}
        par AfriKoin. En payant via la plateforme :
      </p>
      <ul>
        <li>Les fonds sont bloqués en séquestre jusqu'à réception</li>
        <li>Vous pouvez ouvrir un litige sous 7 jours</li>
        <li>Le remboursement est automatique si la réception n'est pas confirmée</li>
      </ul>

      <h2>3. Exiger des photos réelles</h2>
      <p>
        Méfiez-vous des annonces avec une seule photo de catalogue. Demandez :
      </p>
      <ul>
        <li>2 à 3 photos sous différents angles</li>
        <li>Une photo avec une note manuscrite portant la date du jour</li>
        <li>Pour l'électronique : le numéro de série visible</li>
      </ul>

      <h2>4. Reconnaître les signaux d'alerte</h2>
      <p>Soyez vigilant si :</p>
      <ul>
        <li>Le prix est anormalement bas (–50 % vs marché)</li>
        <li>Le vendeur insiste pour une transaction urgente</li>
        <li>L'orthographe et la grammaire sont approximatives</li>
        <li>Le profil a moins d'une semaine d'ancienneté</li>
        <li>Le vendeur refuse l'appel vidéo de vérification</li>
      </ul>

      <h2>5. Que faire en cas d'arnaque ?</h2>
      <p>Agissez vite :</p>
      <ol>
        <li>
          Ouvrez immédiatement un <strong>litige depuis la commande</strong>{" "}
          (bouton « Signaler un problème »)
        </li>
        <li>
          Joignez toutes les preuves (captures d'écran de messages, photos,
          vidéos)
        </li>
        <li>L'équipe AfriKoin enquête sous 48h ouvrées</li>
        <li>Si éligible, vous êtes remboursé sur votre Mobile Money initial</li>
        <li>Signalez le profil pour protéger les autres acheteurs</li>
      </ol>

      <h2>6. Pour les vendeurs : éviter les faux acheteurs</h2>
      <p>
        Les arnaques marchent dans les deux sens. Si vous vendez,{" "}
        <strong>n'expédiez jamais un produit avant que le paiement
        n'apparaisse dans votre wallet AfriKoin</strong>. Les SMS Mobile Money
        peuvent être falsifiés — seul votre solde réel compte.
      </p>

      <h2>En résumé</h2>
      <p>
        Acheter en confiance se résume à 3 réflexes : <strong>payer via la
        plateforme</strong>, <strong>vérifier le profil</strong>, et{" "}
        <strong>signaler vite</strong> au moindre doute. AfriKoin investit dans
        la vérification d'identité, le séquestre et le support pour faire
        reculer la fraude en Afrique.
      </p>
    </ArticleLayout>
  )
}
