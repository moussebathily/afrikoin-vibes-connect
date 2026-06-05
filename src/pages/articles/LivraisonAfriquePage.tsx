import { ArticleLayout } from "./ArticleLayout"

export default function LivraisonAfriquePage() {
  return (
    <ArticleLayout
      slug="livraison"
      title="Livraison en Afrique : zones, délais, suivi GPS et tarifs"
      description="Comprendre la livraison AfriKoin : couverture 15 pays, délais express 24-48h, suivi GPS temps réel, livraison rurale et transport international CEDEAO."
      publishedAt="2026-06-03"
      readingMinutes={5}
      faqs={[
        { q: "Dans quels pays AfriKoin livre-t-il ?", a: "AfriKoin livre dans 15 pays d'Afrique de l'Ouest, centrale et de l'Est, capitales et grandes villes en express 24-48h." },
        { q: "Comment suivre mon colis en temps réel ?", a: "Le suivi GPS s'active automatiquement dès l'enlèvement. Vous le consultez depuis l'onglet 'Suivi' ou via le lien reçu par SMS." },
        { q: "La livraison rurale est-elle possible ?", a: "Oui, via nos partenaires locaux. Le délai passe à 3-7 jours et un supplément peut s'appliquer selon la distance." },
      ]}
    >
      <p>
        Recevoir son colis vite et dans de bonnes conditions, c'est souvent le
        critère décisif pour acheter en ligne en Afrique. AfriKoin opère un
        réseau de logistique panafricain pour <strong>15 pays</strong> avec des
        délais et tarifs transparents.
      </p>

      <h2>Couverture géographique</h2>
      <p>AfriKoin livre dans :</p>
      <ul>
        <li>
          <strong>Afrique de l'Ouest</strong> : Sénégal, Côte d'Ivoire, Mali,
          Burkina Faso, Togo, Bénin, Ghana, Nigeria, Guinée
        </li>
        <li>
          <strong>Afrique centrale</strong> : Cameroun, Gabon, Congo
        </li>
        <li>
          <strong>Afrique de l'Est & australe</strong> : Kenya, Ouganda, Afrique
          du Sud
        </li>
      </ul>

      <h2>Délais de livraison</h2>
      <table>
        <thead>
          <tr>
            <th>Mode</th>
            <th>Délai</th>
            <th>Tarif indicatif</th>
          </tr>
        </thead>
        <tbody>
          <tr>
            <td>Express (même ville)</td>
            <td>24-48h</td>
            <td>1 500-3 000 FCFA</td>
          </tr>
          <tr>
            <td>Standard national</td>
            <td>3-5 jours ouvrés</td>
            <td>500-2 000 FCFA</td>
          </tr>
          <tr>
            <td>Rural (via partenaires)</td>
            <td>5-10 jours</td>
            <td>2 000-5 000 FCFA</td>
          </tr>
          <tr>
            <td>International CEDEAO</td>
            <td>5-10 jours</td>
            <td>5 000-15 000 FCFA</td>
          </tr>
        </tbody>
      </table>

      <h2>Suivi GPS en temps réel</h2>
      <p>
        Chaque commande génère un numéro de tracking. Depuis l'onglet{" "}
        <strong>« Suivi »</strong> de l'app vous voyez :
      </p>
      <ul>
        <li>La position GPS exacte du livreur sur la carte</li>
        <li>Les étapes franchies (collecté, en transit, en cours de livraison)</li>
        <li>L'heure estimée d'arrivée mise à jour toutes les 2 minutes</li>
        <li>Le numéro et la note du livreur</li>
      </ul>
      <p>
        Notifications push à chaque étape — plus besoin d'appeler pour savoir où
        est votre colis.
      </p>

      <h2>Livraison en zone rurale</h2>
      <p>
        AfriKoin s'appuie sur un réseau de <strong>relais locaux</strong>{" "}
        (boutiques, points de retrait, agences Mobile Money) pour atteindre les
        villages. Vous récupérez votre colis avec votre numéro de commande et
        votre pièce d'identité.
      </p>

      <h2>Que faire si mon colis est en retard ?</h2>
      <ol>
        <li>Vérifiez le statut dans l'app (un retard léger est fréquent)</li>
        <li>Au-delà de 48h de retard, contactez le livreur via le chat</li>
        <li>
          Si le livreur ne répond pas, ouvrez un ticket — l'équipe support
          escalade au transporteur
        </li>
        <li>
          Si le colis est perdu, vous êtes remboursé à 100 % sous 5 jours
          ouvrés
        </li>
      </ol>

      <h2>Conseils pour vendeurs</h2>
      <ul>
        <li>
          Emballez avec du carton ondulé + papier bulle pour la fragilité
        </li>
        <li>Indiquez clairement les dimensions et le poids</li>
        <li>
          Activez l'option « Préparation rapide » pour gagner le badge{" "}
          <em>Expédition sous 24h</em> (+15 % de conversion en moyenne)
        </li>
      </ul>
    </ArticleLayout>
  )
}
