import { ArticleLayout } from "./ArticleLayout"

export default function RetoursRemboursementsPage() {
  return (
    <ArticleLayout
      slug="retours"
      title="Retours et remboursements sur AfriKoin : procédure et délais"
      description="Tout sur les retours AfriKoin : 7 jours pour retourner, motifs acceptés, frais, remboursement Mobile Money en 24-72h et résolution des litiges."
      publishedAt="2026-06-03"
      readingMinutes={5}
      faqs={[
        { q: "Combien de temps ai-je pour retourner un article ?", a: "Vous disposez de 7 jours après réception pour signaler un défaut ou une non-conformité et demander un retour." },
        { q: "Qui paie les frais de retour ?", a: "AfriKoin et/ou le vendeur prennent en charge les frais si le motif est recevable (défaut, non conforme). Sinon, ils sont à la charge de l'acheteur." },
        { q: "En combien de temps suis-je remboursé ?", a: "Le remboursement est crédité sur votre Mobile Money entre 24 et 72h après réception du colis retourné par le vendeur." },
      ]}
    >
      <p>
        Acheter en ligne sans pouvoir toucher le produit nécessite un filet de
        sécurité. AfriKoin garantit <strong>7 jours pour retourner</strong> tout
        article défectueux ou non conforme, avec un remboursement rapide sur
        votre Mobile Money.
      </p>

      <h2>Quels motifs de retour sont acceptés ?</h2>
      <ul>
        <li>Produit défectueux ou cassé à réception</li>
        <li>Article non conforme à la description (couleur, taille, modèle)</li>
        <li>Contrefaçon avérée</li>
        <li>Erreur d'envoi du vendeur</li>
        <li>Colis incomplet (pièces manquantes)</li>
      </ul>
      <p>
        Les retours « j'ai changé d'avis » sont possibles selon la politique du
        vendeur (indiquée sur la fiche produit) mais les frais de retour sont
        alors à votre charge.
      </p>

      <h2>Procédure en 5 étapes</h2>
      <ol>
        <li>
          Allez dans <strong>Mes commandes &gt; Détails</strong> de la commande
          concernée
        </li>
        <li>Cliquez sur « Retourner cet article »</li>
        <li>
          Sélectionnez le motif et joignez{" "}
          <strong>2 à 5 photos / 1 vidéo</strong> du défaut
        </li>
        <li>
          Le vendeur a 48h pour répondre. À défaut, le litige est arbitré par
          AfriKoin
        </li>
        <li>
          Si validé, vous recevez un <strong>bon de retour gratuit</strong>{" "}
          (QR code) à présenter au point de dépôt
        </li>
      </ol>

      <h2>Délais de remboursement</h2>
      <ul>
        <li>
          <strong>Mobile Money</strong> (Orange, Wave, MTN, Moov) : 24-72h après
          validation du retour
        </li>
        <li>
          <strong>Carte bancaire</strong> : 5-10 jours ouvrés (délai banque)
        </li>
        <li>
          <strong>Wallet AfriKoin</strong> : instantané, utilisable
          immédiatement pour un nouvel achat
        </li>
        <li>
          <strong>Cash à la livraison</strong> : crédité sur votre wallet
          AfriKoin
        </li>
      </ul>

      <h2>Et si le vendeur refuse le retour ?</h2>
      <p>
        Pas de panique. AfriKoin <strong>arbitre tous les litiges</strong> sous
        48h ouvrées :
      </p>
      <ol>
        <li>L'équipe litiges examine vos preuves et la réponse du vendeur</li>
        <li>Vous pouvez ajouter des éléments complémentaires</li>
        <li>
          Décision finale communiquée par email + notification dans l'app
        </li>
        <li>
          Si vous obtenez gain de cause, remboursement automatique sans
          intervention du vendeur
        </li>
      </ol>

      <h2>Frais de retour</h2>
      <table>
        <thead>
          <tr>
            <th>Motif</th>
            <th>Frais</th>
          </tr>
        </thead>
        <tbody>
          <tr>
            <td>Défaut / non conformité</td>
            <td>Gratuit (à la charge du vendeur)</td>
          </tr>
          <tr>
            <td>Erreur du vendeur</td>
            <td>Gratuit</td>
          </tr>
          <tr>
            <td>Changement d'avis</td>
            <td>À votre charge (selon politique vendeur)</td>
          </tr>
        </tbody>
      </table>

      <h2>Côté vendeur : que se passe-t-il en cas de retour ?</h2>
      <ul>
        <li>
          Le retour vous est expédié sous 48h après le dépôt par l'acheteur
        </li>
        <li>
          Une fois reçu, vous avez 24h pour inspecter et valider le retour
        </li>
        <li>
          Le montant est débité automatiquement de votre wallet et reversé à
          l'acheteur
        </li>
        <li>
          Un taux de retour élevé (&gt; 10 %) peut affecter votre score de
          confiance — soyez précis dans vos descriptions et photos !
        </li>
      </ul>
    </ArticleLayout>
  )
}
