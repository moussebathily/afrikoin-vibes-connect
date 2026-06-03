// Compact FAQ snapshot for the AI assistant. Keep this in sync with src/data/faqData.ts.
export interface FaqEntry {
  id: string
  audience: "buyer" | "seller"
  question: { fr: string; wo: string; ha: string; en: string }
  answer: { fr: string; wo: string; ha: string; en: string }
}

export const FAQ_ITEMS: FaqEntry[] = [
  {
    id: "buyer-seller-trust",
    audience: "buyer",
    question: {
      fr: "Comment savoir si un vendeur est fiable ?",
      wo: "Naka laay xam ne jaaykat ji wóorul ?",
      ha: "Ta yaya zan san cewa mai sayarwa abin amincewa ne?",
      en: "How do I know if a seller is trustworthy?",
    },
    answer: {
      fr: "Vérifiez le badge bleu Vérifié, le score de confiance et les avis. Privilégiez les vendeurs Premium ou avec plus de 10 ventes.",
      wo: "Seetal màrk bu xonq, score bu wóor, ak xelu ñi gënë jënd.",
      ha: "Duba shaidar shudi, kima da ra'ayoyi. Fifita Premium ko sama 10.",
      en: "Check the blue Verified badge, trust score and reviews. Prefer Premium sellers or 10+ sales.",
    },
  },
  {
    id: "buyer-scam-protection",
    audience: "buyer",
    question: {
      fr: "Que faire si je me fais arnaquer ?",
      wo: "Lan laay def su ñu ma naxee ?",
      ha: "Me zan yi idan an yaudare ni?",
      en: "What should I do if I get scammed?",
    },
    answer: {
      fr: "Ne payez jamais hors AfriKoin. Ouvrez un litige sous 7 jours depuis la commande, l'équipe enquête et rembourse les paiements éligibles.",
      wo: "Bul fay ci biir AfriKoin rekk. Ubbil dossier ci 7 fan.",
      ha: "Kada ka biya a wajen AfriKoin. Bude kara cikin kwana 7.",
      en: "Never pay outside AfriKoin. Open a dispute within 7 days; the team investigates and refunds eligible payments.",
    },
  },
  {
    id: "buyer-counterfeit",
    audience: "buyer",
    question: {
      fr: "Comment éviter les contrefaçons ?",
      wo: "Naka laay moytu marsandiis yu dul yu wóor ?",
      ha: "Ta yaya zan guji jabu?",
      en: "How do I avoid counterfeits?",
    },
    answer: {
      fr: "Exigez photos réelles, numéro de série ou facture, et privilégiez les vendeurs au score élevé.",
      wo: "Ñaan nataal yu jëkki, làmb-laaj wala faktiir.",
      ha: "Nemi hotunan gaski, lambar siriya ko rasit.",
      en: "Demand real photos, serial number or invoice; prefer high-score sellers.",
    },
  },
  {
    id: "buyer-mobile-money-providers",
    audience: "buyer",
    question: {
      fr: "Quels Mobile Money sont acceptés ?",
      wo: "Ban Mobile Money lañu nangu ?",
      ha: "Wadanne Mobile Money ake karba?",
      en: "Which Mobile Money providers are accepted?",
    },
    answer: {
      fr: "Orange Money, Wave, MTN MoMo et Moov Money. Traitement en quelques secondes, chiffrement bout-en-bout, aucuns frais cachés.",
      wo: "Orange Money, Wave, MTN MoMo, Moov Money.",
      ha: "Orange Money, Wave, MTN MoMo, Moov Money.",
      en: "Orange Money, Wave, MTN MoMo and Moov Money. Seconds to process, encrypted, no hidden fees.",
    },
  },
  {
    id: "buyer-cash-on-delivery",
    audience: "buyer",
    question: {
      fr: "Puis-je payer à la livraison (cash) ?",
      wo: "Mën naa fay bés bi ñu ma indil ?",
      ha: "Zan iya biya lokacin bayarwa?",
      en: "Can I pay cash on delivery?",
    },
    answer: {
      fr: "Oui, disponible dans la plupart des grandes villes. Vérifiez l'option au checkout; des frais supplémentaires peuvent s'appliquer.",
      wo: "Waaw, ci dëkk yu mag.",
      ha: "Eh, a manyan birane.",
      en: "Yes, in most major cities. Check at checkout; extra fees may apply.",
    },
  },
  {
    id: "buyer-payment-security",
    audience: "buyer",
    question: {
      fr: "Mes informations de paiement sont-elles sécurisées ?",
      wo: "Ndax xibaar yu sama fay yi wóor nañu ?",
      ha: "Bayanan biyana suna da tsaro?",
      en: "Is my payment information secure?",
    },
    answer: {
      fr: "Oui. AfriKoin ne stocke jamais vos identifiants. Partenaires PCI-DSS certifiés, chiffrement TLS 1.3.",
      wo: "Waaw. AfriKoin du denc sa identifiants.",
      ha: "Eh. AfriKoin ba ya adana bayanan ku.",
      en: "Yes. Never stored. PCI-DSS partners, TLS 1.3.",
    },
  },
  {
    id: "buyer-delivery-zones",
    audience: "buyer",
    question: {
      fr: "Livrez-vous dans mon village ou quartier ?",
      wo: "Yegle ngeen ca sama dëkk ?",
      ha: "Kuna isar zuwa ƙauyena?",
      en: "Do you deliver to my village?",
    },
    answer: {
      fr: "AfriKoin couvre 15 pays africains. Saisissez votre adresse au checkout pour voir les options (livraison rurale via partenaires possible).",
      wo: "15 réew yu Afrique.",
      ha: "Kasashen Afirka 15.",
      en: "AfriKoin covers 15 African countries. Enter your address at checkout to see options.",
    },
  },
  {
    id: "buyer-delivery-time",
    audience: "buyer",
    question: {
      fr: "Combien de temps prend la livraison ?",
      wo: "Ñaata jamono lay jël yónnee bi ?",
      ha: "Tsawon lokaci nawa?",
      en: "How long does delivery take?",
    },
    answer: {
      fr: "Express 24-48h, standard 3-5 jours, international CEDEAO 5-10 jours. Suivi GPS temps réel inclus.",
      wo: "Express 24-48h, standard 3-5 fan.",
      ha: "Express 24-48h, standard kwana 3-5.",
      en: "Express 24-48h, standard 3-5 days, ECOWAS 5-10 days. GPS tracking included.",
    },
  },
  {
    id: "buyer-tracking",
    audience: "buyer",
    question: {
      fr: "Puis-je suivre mon colis en temps réel ?",
      wo: "Mën naa toppatoo sama colis bi ?",
      ha: "Zan iya bin diddigi?",
      en: "Can I track my package?",
    },
    answer: {
      fr: "Oui. Onglet Suivi, numéro de commande ou QR code. Position GPS du livreur et ETA.",
      wo: "Waaw. Dem ci Tracking.",
      ha: "Eh, a shafin Tracking.",
      en: "Yes. Tracking tab, order number or QR. GPS and ETA.",
    },
  },
  {
    id: "buyer-return-defective",
    audience: "buyer",
    question: {
      fr: "Comment retourner un article défectueux ?",
      wo: "Naka laay delloo marsandiis bu yàqu ?",
      ha: "Ta yaya zan mayar?",
      en: "How do I return a defective item?",
    },
    answer: {
      fr: "Sous 7 jours, commande > Retourner. Joindre photos/vidéo. Si validé, bon de retour gratuit, remboursement sous 5-10 jours ouvrés.",
      wo: "Ci 7 fan, ubbi commande > Delloo.",
      ha: "Cikin kwana 7.",
      en: "Within 7 days, open order > Return. Attach photos. Free return label, refund 5-10 days.",
    },
  },
  {
    id: "buyer-refund-time",
    audience: "buyer",
    question: {
      fr: "Quand vais-je recevoir mon remboursement ?",
      wo: "Kañ laay jot sama xaalis ?",
      ha: "Yaushe zan karbi?",
      en: "When will I get my refund?",
    },
    answer: {
      fr: "Mobile Money 24-72h, carte 5-10 jours ouvrés, wallet AfriKoin instantané.",
      wo: "Mobile Money 24-72h.",
      ha: "Mobile Money 24-72h.",
      en: "Mobile Money 24-72h, card 5-10 days, wallet instant.",
    },
  },
  {
    id: "buyer-negotiate",
    audience: "buyer",
    question: {
      fr: "Puis-je négocier le prix ?",
      wo: "Mën naa wàllitoo prix ?",
      ha: "Zan iya tattauna farashi?",
      en: "Can I negotiate the price?",
    },
    answer: {
      fr: "Oui : bouton « Faire une offre » ou messagerie (traduction auto FR/WO/HA).",
      wo: "Waaw.",
      ha: "Eh.",
      en: "Yes: 'Make an Offer' or chat (auto-translation FR/WO/HA).",
    },
  },
  {
    id: "seller-fees",
    audience: "seller",
    question: {
      fr: "Combien ça coûte de vendre sur AfriKoin ?",
      wo: "Ñaata lay jar jaay ?",
      ha: "Nawa farashin sayarwa?",
      en: "How much to sell on AfriKoin?",
    },
    answer: {
      fr: "Compte gratuit. Commission 5% (3% Premium). Pas de frais d'annonce. Premium 5000 FCFA/mois.",
      wo: "Free. Commission 5% walla 3%.",
      ha: "Kyauta. 5% (3% Premium).",
      en: "Free account. 5% commission (3% Premium). No listing fees.",
    },
  },
  {
    id: "seller-verification",
    audience: "seller",
    question: {
      fr: "Comment obtenir le badge Vérifié ?",
      wo: "Naka laay am màrk Wóoraat ?",
      ha: "Ta yaya zan samu shaidar?",
      en: "How to get the Verified badge?",
    },
    answer: {
      fr: "Pièce d'identité + selfie + téléphone vérifié. Validation 24h. +20 au score de confiance.",
      wo: "CIN + selfie + numéro.",
      ha: "ID + selfie + lambar waya.",
      en: "ID + selfie + SMS phone. 24h validation. +20 trust score.",
    },
  },
  {
    id: "seller-payout",
    audience: "seller",
    question: {
      fr: "Quand je reçois mon argent après une vente ?",
      wo: "Kañ laa jot sama xaalis ?",
      ha: "Yaushe zan karbi kuɗina?",
      en: "When do I get paid?",
    },
    answer: {
      fr: "Fonds crédités au wallet après confirmation acheteur (auto sous 7 jours). Retrait Mobile Money instantané, 1% (min 100 FCFA).",
      wo: "Ci wallet ginnaaw 7 fan.",
      ha: "Bayan kwana 7.",
      en: "Funds to wallet after confirmation (auto 7 days). Instant Mobile Money withdraw, 1%.",
    },
  },
  {
    id: "seller-visibility",
    audience: "seller",
    question: {
      fr: "Comment apparaître en premier dans les résultats ?",
      wo: "Naka laay nekk ci tóskat ?",
      ha: "Ta yaya zan zama na farko?",
      en: "How do I rank first?",
    },
    answer: {
      fr: "Premium (priorité algo), Boost produit (500 FCFA/24h), SEO (titre + 5+ photos + description IA + mots-clés).",
      wo: "Premium, Boost, SEO.",
      ha: "Premium, Boost, SEO.",
      en: "Premium, per-product Boost (500 FCFA/24h), SEO.",
    },
  },
  {
    id: "seller-cross-border",
    audience: "seller",
    question: {
      fr: "Puis-je vendre dans plusieurs pays (CEDEAO) ?",
      wo: "Mën naa jaay ci ay réew ?",
      ha: "Zan iya sayarwa a kasashe?",
      en: "Can I sell across countries (ECOWAS)?",
    },
    answer: {
      fr: "Oui. Activez Livraison internationale, AfriKoin gère multi-devises et TVA. Prévoyez les codes HS pour les douanes.",
      wo: "Waaw.",
      ha: "Eh.",
      en: "Yes. Enable international delivery; AfriKoin handles multi-currency & VAT.",
    },
  },
  {
    id: "seller-dispute",
    audience: "seller",
    question: {
      fr: "Que faire si un acheteur refuse le colis ?",
      wo: "Lan laay def su jëndakat bañ colis bi ?",
      ha: "Idan mai saye ya ki?",
      en: "What if a buyer refuses the package?",
    },
    answer: {
      fr: "Retour aux frais d'AfriKoin si motif non-conforme. Litige possible pour réclamer le transport.",
      wo: "Colis dina dellu, fay AfriKoin.",
      ha: "Za a mayar, AfriKoin ya biya.",
      en: "Return at platform expense if invalid. Open dispute to claim shipping.",
    },
  },
  {
    id: "seller-stock",
    audience: "seller",
    question: {
      fr: "Comment gérer mon stock efficacement ?",
      wo: "Naka laay topp sama stock ?",
      ha: "Ta yaya zan kula da stock?",
      en: "How to manage stock?",
    },
    answer: {
      fr: "Dashboard vendeur : seuils de réapprovisionnement, l'IA suggère prix et quantité optimaux.",
      wo: "Ci dashboard.",
      ha: "A dashboard.",
      en: "Seller dashboard: reorder thresholds; AI suggests price/quantity.",
    },
  },
  {
    id: "seller-ai-listing",
    audience: "seller",
    question: {
      fr: "L'IA peut-elle rédiger mes fiches produit ?",
      wo: "Ndax IA mën na bind sama fiches ?",
      ha: "Shin AI zai iya rubuta?",
      en: "Can the AI write my listings?",
    },
    answer: {
      fr: "Oui. Photo → titre SEO, description multilingue, catégorie, prix suggéré en 5 secondes. Gratuit.",
      wo: "Waaw.",
      ha: "Eh.",
      en: "Yes. Photo → SEO title, multilingual desc, category, price in 5s. Free.",
    },
  },
  {
    id: "seller-bad-buyer",
    audience: "seller",
    question: {
      fr: "Comment me protéger des faux acheteurs ?",
      wo: "Naka laay musëlu ci jëndakat yu dul ?",
      ha: "Ta yaya zan kare daga karya?",
      en: "How to avoid fake buyers?",
    },
    answer: {
      fr: "AfriKoin vérifie chaque acheteur. N'expédiez jamais avant que le paiement apparaisse dans votre wallet.",
      wo: "Bul yónnee marsandiis bu wallet bi feeñagul.",
      ha: "Kada ka aika kafin kuɗi.",
      en: "AfriKoin verifies buyers. Never ship before payment lands in your wallet.",
    },
  },
  {
    id: "seller-respond-fast",
    audience: "seller",
    question: {
      fr: "Pourquoi répondre vite aux clients ?",
      wo: "Lu tax tontu gaaw ?",
      ha: "Me ya sa amsa da sauri?",
      en: "Why respond fast?",
    },
    answer: {
      fr: "Réponse < 1h : +60% de conversion. Badge « Répond rapidement » si < 30 min. Traduction auto FR/WO/HA.",
      wo: "Tontu ci 1h dafay yokk buy yi 60%.",
      ha: "Amsa 1h yana ƙara 60%.",
      en: "Reply <1h: +60% conversion. 'Responds quickly' badge if <30 min.",
    },
  },
]
