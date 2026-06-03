export type FaqLang = "fr" | "wo" | "ha" | "en"
export type FaqCategory = "trust" | "payment" | "delivery" | "returns" | "seller"
export type FaqAudience = "buyer" | "seller"

export interface FaqLocalized {
  fr: string
  wo: string
  ha: string
  en: string
}

export interface FaqItem {
  id: string
  audience: FaqAudience
  category: FaqCategory
  tags: string[]
  question: FaqLocalized
  answer: FaqLocalized
  articleSlug?: string
}

export const FAQ_CATEGORIES: { key: FaqCategory; label: FaqLocalized }[] = [
  {
    key: "trust",
    label: {
      fr: "Confiance & arnaques",
      wo: "Wóoluwaay & ay nax",
      ha: "Amincewa & yaudara",
      en: "Trust & scams",
    },
  },
  {
    key: "payment",
    label: {
      fr: "Paiement Mobile Money",
      wo: "Fay ak Mobile Money",
      ha: "Biyan Mobile Money",
      en: "Mobile Money payment",
    },
  },
  {
    key: "delivery",
    label: { fr: "Livraison", wo: "Yónnee", ha: "Bayarwa", en: "Delivery" },
  },
  {
    key: "returns",
    label: { fr: "Retours & remboursements", wo: "Delloo & ñu fay la", ha: "Mayarwa & maido", en: "Returns & refunds" },
  },
  {
    key: "seller",
    label: { fr: "Vendre sur AfriKoin", wo: "Jaay ci AfriKoin", ha: "Sayarwa a AfriKoin", en: "Selling on AfriKoin" },
  },
]

export const FAQ_ITEMS: FaqItem[] = [
  // ============ ACHETEURS ============
  {
    id: "buyer-seller-trust",
    audience: "buyer",
    category: "trust",
    tags: ["arnaque", "vendeur", "verifie", "badge", "confiance"],
    question: {
      fr: "Comment savoir si un vendeur est fiable ?",
      wo: "Naka laay xam ne jaaykat ji wóorul ?",
      ha: "Ta yaya zan san cewa mai sayarwa abin amincewa ne?",
      en: "How do I know if a seller is trustworthy?",
    },
    answer: {
      fr: "Vérifiez le badge bleu « Vérifié » sur le profil du vendeur, son score de confiance (basé sur les ventes, avis et vérifications d'identité), et lisez les avis laissés par les autres acheteurs. Privilégiez les vendeurs Premium ou avec plus de 10 ventes.",
      wo: "Seetal màrk bu xonq « Wóoraat » ci profil bi, sa score bu wóor, ak xelu ñi gënë jënd. Tànne jaaykat yu am Premium walla yu gënë jaay 10 yoon.",
      ha: "Duba shaidar shudi mai amincewa, kimar amincewar mai sayarwa, da ra'ayoyin sauran masu saye. Fifita masu sayarwa na Premium ko waɗanda suka sayar fiye da sau 10.",
      en: "Check the blue Verified badge, trust score, and reviews from other buyers. Prefer Premium sellers or those with more than 10 sales.",
    },
    articleSlug: "eviter-arnaques",
  },
  {
    id: "buyer-scam-protection",
    audience: "buyer",
    category: "trust",
    tags: ["arnaque", "protection", "rembourser", "litige"],
    question: {
      fr: "Que faire si je me fais arnaquer ?",
      wo: "Lan laay def su ñu ma naxee ?",
      ha: "Me zan yi idan an yaudare ni?",
      en: "What should I do if I get scammed?",
    },
    answer: {
      fr: "Ne payez jamais en dehors d'AfriKoin. Si vous avez payé via la plateforme, ouvrez un litige depuis la commande dans les 7 jours. Notre équipe enquête et rembourse les paiements éligibles. Signalez le profil pour protéger les autres acheteurs.",
      wo: "Bul fay ci biir AfriKoin rekk. Ubbil dossier ci sa commande ci 7 fan. Sunu équipe dina seet ak fay sa xaalis bu mat. Yegle profil bi ngir musëlu ñeneen.",
      ha: "Kada ka biya a wajen AfriKoin. Bude kara a cikin kwana 7 daga umarni. Mu binciki kuma maida kuɗi idan ya cancanta. Kai rahoton mai sayarwa.",
      en: "Never pay outside AfriKoin. Open a dispute from the order within 7 days. Our team investigates and refunds eligible payments. Report the profile to protect others.",
    },
    articleSlug: "eviter-arnaques",
  },
  {
    id: "buyer-counterfeit",
    audience: "buyer",
    category: "trust",
    tags: ["contrefacon", "authentique", "marque"],
    question: {
      fr: "Comment éviter les contrefaçons ?",
      wo: "Naka laay moytu marsandiis yu dul yu wóor ?",
      ha: "Ta yaya zan guji jabu?",
      en: "How do I avoid counterfeits?",
    },
    answer: {
      fr: "Exigez les photos réelles (pas de visuels de catalogue), demandez le numéro de série ou la facture d'origine, et privilégiez les vendeurs avec un score de confiance élevé. En cas de doute, contactez le support avant de payer.",
      wo: "Ñaan nataal yu jëkki, làmb-laaj wala faktiir bu njëkk, te tànne jaaykat yu am score wu kawe.",
      ha: "Nemi hotunan gaski, lambar siriya ko asalin rasit, kuma fifita masu sayarwa masu kima mai kyau.",
      en: "Demand real photos, ask for the serial number or original invoice, and prefer high trust-score sellers. Contact support before paying if in doubt.",
    },
  },
  {
    id: "buyer-mobile-money-providers",
    audience: "buyer",
    category: "payment",
    tags: ["mobile money", "orange", "wave", "mtn", "moov"],
    question: {
      fr: "Quels Mobile Money sont acceptés ?",
      wo: "Ban Mobile Money lañu nangu ?",
      ha: "Wadanne Mobile Money ake karba?",
      en: "Which Mobile Money providers are accepted?",
    },
    answer: {
      fr: "AfriKoin accepte Orange Money, Wave, MTN MoMo et Moov Money. Les paiements sont traités en quelques secondes et sécurisés par chiffrement bout-en-bout. Aucuns frais cachés.",
      wo: "Nangu nañu Orange Money, Wave, MTN MoMo ak Moov Money. Fay yi dañuy mat ci sécondes te wóor ci chiffrement.",
      ha: "Muna karbar Orange Money, Wave, MTN MoMo da Moov Money. Ana aiwatar da biyan kuɗi a cikin daƙiƙa, lafiya.",
      en: "AfriKoin accepts Orange Money, Wave, MTN MoMo and Moov Money. Payments are processed in seconds with end-to-end encryption. No hidden fees.",
    },
    articleSlug: "paiement-mobile-money",
  },
  {
    id: "buyer-cash-on-delivery",
    audience: "buyer",
    category: "payment",
    tags: ["cash", "livraison", "espece"],
    question: {
      fr: "Puis-je payer à la livraison (cash) ?",
      wo: "Mën naa fay bés bi ñu ma indil ?",
      ha: "Zan iya biya lokacin bayarwa?",
      en: "Can I pay cash on delivery?",
    },
    answer: {
      fr: "Oui, le paiement à la livraison (Cash on Delivery) est disponible dans la plupart des grandes villes. Vérifiez l'option à l'étape paiement du checkout. Des frais de livraison supplémentaires peuvent s'appliquer.",
      wo: "Waaw, fay ci bés yónnee mën na ci dëkk yu mag. Seetal bi ngay fay.",
      ha: "Eh, biya yayin bayarwa yana samuwa a manyan birane. Ka duba lokacin biya.",
      en: "Yes, Cash on Delivery is available in most major cities. Check the option at checkout. Extra delivery fees may apply.",
    },
    articleSlug: "paiement-mobile-money",
  },
  {
    id: "buyer-payment-security",
    audience: "buyer",
    category: "payment",
    tags: ["securite", "donnees", "carte"],
    question: {
      fr: "Mes informations de paiement sont-elles sécurisées ?",
      wo: "Ndax xibaar yu sama fay yi wóor nañu ?",
      ha: "Bayanan biyana suna da tsaro?",
      en: "Is my payment information secure?",
    },
    answer: {
      fr: "Oui. AfriKoin ne stocke jamais vos identifiants Mobile Money ou cartes bancaires. Les transactions passent par des partenaires PCI-DSS certifiés (Stripe, Orange, Wave) avec chiffrement TLS 1.3.",
      wo: "Waaw. AfriKoin du denc sa identifiants Mobile Money. Lépp dafay jaar ci partenaires yu wóor.",
      ha: "Eh. AfriKoin ba ya adana bayanan ku. Mun yi amfani da abokan PCI-DSS masu shaida.",
      en: "Yes. AfriKoin never stores your Mobile Money credentials or bank cards. Transactions go through PCI-DSS certified partners with TLS 1.3.",
    },
  },
  {
    id: "buyer-delivery-zones",
    audience: "buyer",
    category: "delivery",
    tags: ["zone", "ville", "village", "livraison"],
    question: {
      fr: "Livrez-vous dans mon village ou quartier ?",
      wo: "Yegle ngeen ca sama dëkk ?",
      ha: "Kuna isar da kayan zuwa ƙauyena?",
      en: "Do you deliver to my village or neighborhood?",
    },
    answer: {
      fr: "AfriKoin couvre 15 pays africains et la plupart des chefs-lieux. Pour les zones rurales, la livraison via partenaires locaux est possible avec délai prolongé. Saisissez votre adresse au checkout pour voir les options.",
      wo: "Yegle nañu ci 15 réew yu Afrique. Bind sa adresse ngir gis options yi.",
      ha: "AfriKoin yana isar da kaya a kasashen Afirka 15. Saka adireshinka don ganin zaɓuɓɓuka.",
      en: "AfriKoin covers 15 African countries and most regional capitals. For rural areas, local partner delivery is possible with longer lead time.",
    },
    articleSlug: "livraison",
  },
  {
    id: "buyer-delivery-time",
    audience: "buyer",
    category: "delivery",
    tags: ["delai", "temps", "rapide"],
    question: {
      fr: "Combien de temps prend la livraison ?",
      wo: "Ñaata jamono lay jël yónnee bi ?",
      ha: "Tsawon lokaci nawa bayarwa ke ɗauka?",
      en: "How long does delivery take?",
    },
    answer: {
      fr: "Livraison express : 24-48h dans la même ville. Standard : 3-5 jours ouvrés au sein du pays. International (CEDEAO) : 5-10 jours. Vous recevez un suivi GPS en temps réel.",
      wo: "Express : 24-48h. Standard : 3-5 fan. International : 5-10 fan.",
      ha: "Express: 24-48h. Standard: kwana 3-5. International: kwana 5-10.",
      en: "Express: 24-48h same city. Standard: 3-5 business days. International (ECOWAS): 5-10 days. Real-time GPS tracking included.",
    },
    articleSlug: "livraison",
  },
  {
    id: "buyer-tracking",
    audience: "buyer",
    category: "delivery",
    tags: ["suivi", "tracking", "colis"],
    question: {
      fr: "Puis-je suivre mon colis en temps réel ?",
      wo: "Mën naa toppatoo sama colis bi ci waxtu wii ?",
      ha: "Zan iya bin diddigin fakitin?",
      en: "Can I track my package in real time?",
    },
    answer: {
      fr: "Oui. Depuis l'onglet « Suivi » de l'app, entrez votre numéro de commande ou scannez le QR code. Vous voyez la position GPS du livreur, les étapes franchies et l'heure estimée d'arrivée.",
      wo: "Waaw. Dem ci Tracking, bind sa numéro commande.",
      ha: "Eh. A shafin Tracking, saka lambar umarnin ka.",
      en: "Yes. From the Tracking tab, enter your order number or scan the QR code. You'll see the driver's GPS location and ETA.",
    },
    articleSlug: "livraison",
  },
  {
    id: "buyer-return-defective",
    audience: "buyer",
    category: "returns",
    tags: ["retour", "defectueux", "casse"],
    question: {
      fr: "Comment retourner un article défectueux ?",
      wo: "Naka laay delloo marsandiis bu yàqu ?",
      ha: "Ta yaya zan mayar da kaya mara kyau?",
      en: "How do I return a defective item?",
    },
    answer: {
      fr: "Sous 7 jours après réception, ouvrez la commande > « Retourner ». Joignez photos/vidéo du défaut. Si validé, vous recevez un bon de retour gratuit. Remboursement sous 5 à 10 jours ouvrés sur le moyen de paiement initial.",
      wo: "Ci 7 fan ginnaaw bi nga jot, ubbi commande > Delloo. Yónnee nataal. Fay bi dina ñëw ci 5-10 fan.",
      ha: "A cikin kwana 7, bude umarni > Mayarwa. Saka hotuna. Maido a cikin kwana 5-10.",
      en: "Within 7 days of receipt, open the order > Return. Attach photos/video of the defect. If approved, you'll get a free return label. Refund in 5-10 business days.",
    },
    articleSlug: "retours",
  },
  {
    id: "buyer-refund-time",
    audience: "buyer",
    category: "returns",
    tags: ["remboursement", "delai", "argent"],
    question: {
      fr: "Quand vais-je recevoir mon remboursement ?",
      wo: "Kañ laay jot sama xaalis ?",
      ha: "Yaushe zan karbi kuɗina?",
      en: "When will I receive my refund?",
    },
    answer: {
      fr: "Mobile Money : 24-72h après validation du retour. Carte bancaire : 5-10 jours ouvrés. Wallet AfriKoin : instantané. Vous recevez une notification dès le déclenchement du remboursement.",
      wo: "Mobile Money : 24-72h. Carte : 5-10 fan. Wallet : ci waxtu wii.",
      ha: "Mobile Money: 24-72h. Carte: kwana 5-10. Wallet: nan da nan.",
      en: "Mobile Money: 24-72h after return validation. Bank card: 5-10 business days. AfriKoin Wallet: instant.",
    },
    articleSlug: "retours",
  },
  {
    id: "buyer-negotiate",
    audience: "buyer",
    category: "trust",
    tags: ["negocier", "prix", "marchander"],
    question: {
      fr: "Puis-je négocier le prix avec un vendeur ?",
      wo: "Mën naa wàllitoo prix ak jaaykat ji ?",
      ha: "Zan iya tattauna farashi?",
      en: "Can I negotiate the price with a seller?",
    },
    answer: {
      fr: "Oui, utilisez le bouton « Faire une offre » sur la fiche produit ou contactez le vendeur via la messagerie intégrée (traduction automatique FR/WO/HA disponible).",
      wo: "Waaw, jëfandikoo « Faire une offre » walla bind ci messagerie bi.",
      ha: "Eh, danna 'Yi Tayi' ko aika sako.",
      en: "Yes, use 'Make an Offer' on the product page or message the seller (with auto-translation FR/WO/HA).",
    },
  },

  // ============ VENDEURS ============
  {
    id: "seller-fees",
    audience: "seller",
    category: "seller",
    tags: ["commission", "frais", "vendre"],
    question: {
      fr: "Combien ça coûte de vendre sur AfriKoin ?",
      wo: "Ñaata lay jar jaay ci AfriKoin ?",
      ha: "Nawa farashin sayar a AfriKoin?",
      en: "How much does it cost to sell on AfriKoin?",
    },
    answer: {
      fr: "Création de compte vendeur gratuite. Commission de 5% par vente (3% pour les vendeurs Premium). Pas de frais d'annonce. L'abonnement Premium (5 000 FCFA/mois) inclut boost, badge, statistiques avancées et commission réduite.",
      wo: "Account jaaykat amul fay. Commission 5% ci buy walla 3% bu Premium.",
      ha: "Bude asusu kyauta. Kwamishan 5% (3% Premium).",
      en: "Free seller account. 5% commission per sale (3% for Premium). No listing fees. Premium (5,000 FCFA/month) includes boost, badge, advanced stats and reduced commission.",
    },
    articleSlug: "vendre-en-confiance",
  },
  {
    id: "seller-verification",
    audience: "seller",
    category: "seller",
    tags: ["verification", "badge", "kyc"],
    question: {
      fr: "Comment obtenir le badge « Vérifié » ?",
      wo: "Naka laay am màrk « Wóoraat » ?",
      ha: "Ta yaya zan samu shaidar amincewa?",
      en: "How do I get the Verified badge?",
    },
    answer: {
      fr: "Téléversez une pièce d'identité valide + un selfie + votre numéro de téléphone vérifié par SMS. Validation sous 24h. Le badge augmente votre score de confiance de +20 points et booste vos ventes.",
      wo: "Yónnee CIN + selfie + numéro téléphone. Verify dina mat ci 24h.",
      ha: "Loda ID + selfie + lambar waya. Tabbatar a cikin 24h.",
      en: "Upload a valid ID + selfie + SMS-verified phone number. Validation within 24h. The badge boosts your trust score by +20 and increases sales.",
    },
    articleSlug: "vendre-en-confiance",
  },
  {
    id: "seller-payout",
    audience: "seller",
    category: "payment",
    tags: ["retrait", "gain", "wallet"],
    question: {
      fr: "Quand je reçois mon argent après une vente ?",
      wo: "Kañ laa jot sama xaalis ginnaaw nag jaay ?",
      ha: "Yaushe zan karbi kuɗina bayan sayar?",
      en: "When do I receive my money after a sale?",
    },
    answer: {
      fr: "Les fonds sont crédités sur votre wallet AfriKoin après confirmation de réception par l'acheteur (ou automatiquement après 7 jours sans litige). Retrait instantané vers Orange Money, Wave ou MTN MoMo. Frais : 1% (min. 100 FCFA).",
      wo: "Sa xaalis dafay nekk ci wallet bi ginnaaw 7 fan walla bés bi nga jot. Withdraw ci Mobile Money ci waxtu wii.",
      ha: "Kuɗi ya shiga wallet bayan kwana 7 ko tabbatarwa. Withdraw nan da nan.",
      en: "Funds credited to your AfriKoin wallet after buyer confirmation (or auto after 7 days). Instant withdraw to Orange Money, Wave or MTN MoMo. Fee: 1% (min 100 FCFA).",
    },
    articleSlug: "paiement-mobile-money",
  },
  {
    id: "seller-visibility",
    audience: "seller",
    category: "seller",
    tags: ["boost", "premium", "visibilite"],
    question: {
      fr: "Comment apparaître en premier dans les résultats ?",
      wo: "Naka laay nekk ci tóskat ci resulta yi ?",
      ha: "Ta yaya zan zama na farko?",
      en: "How do I appear first in search results?",
    },
    answer: {
      fr: "Trois leviers : (1) abonnement Premium pour priorité algorithmique, (2) Boost ponctuel par produit (500 FCFA/24h), (3) optimisation SEO (titre clair, 5+ photos, description IA, mots-clés). Un score de confiance élevé pèse aussi.",
      wo: "Premium, Boost (500 FCFA/24h), ak nataal yu rafet ak description.",
      ha: "Premium, Boost (500 FCFA/24h), da bayanan kayan zaki.",
      en: "Three levers: (1) Premium subscription for algorithmic priority, (2) Per-product Boost (500 FCFA/24h), (3) SEO optimization (clear title, 5+ photos, AI description, keywords).",
    },
    articleSlug: "vendre-en-confiance",
  },
  {
    id: "seller-cross-border",
    audience: "seller",
    category: "seller",
    tags: ["cedeao", "export", "international"],
    question: {
      fr: "Puis-je vendre dans plusieurs pays (CEDEAO) ?",
      wo: "Mën naa jaay ci ay réew yu bari ?",
      ha: "Zan iya sayarwa a kasashe da yawa?",
      en: "Can I sell in multiple countries (ECOWAS)?",
    },
    answer: {
      fr: "Oui. Activez « Livraison internationale » dans vos paramètres vendeur, choisissez les pays cibles et le tarif. AfriKoin gère la facturation multi-devises et la TVA quand applicable. Pour les douanes, prévoyez les codes HS.",
      wo: "Waaw. Nooss « Livraison internationale » ci sa paramètres.",
      ha: "Eh. Kunna 'Bayarwa ta Kasa da Kasa' a saituka.",
      en: "Yes. Enable 'International delivery' in seller settings, pick countries and rates. AfriKoin handles multi-currency billing and VAT. Plan HS codes for customs.",
    },
  },
  {
    id: "seller-dispute",
    audience: "seller",
    category: "returns",
    tags: ["litige", "refus", "client"],
    question: {
      fr: "Que faire si un acheteur refuse le colis ?",
      wo: "Lan laay def su jëndakat bañ colis bi ?",
      ha: "Me zan yi idan mai saye ya ki ɗauka?",
      en: "What if a buyer refuses the package?",
    },
    answer: {
      fr: "Le colis vous est retourné aux frais de la plateforme si la raison est non-conforme. En cas d'abus répété, l'acheteur est signalé. Vous pouvez ouvrir un litige depuis la commande pour réclamer les frais de transport.",
      wo: "Colis bi dina dellu, fay yi ci AfriKoin. Mën nga ubbi dossier.",
      ha: "Za a mayar da fakiti, AfriKoin ya biya. Bude kara.",
      en: "The package returns to you at the platform's expense if invalid. Repeat offenders flagged. Open a dispute to claim shipping fees.",
    },
    articleSlug: "retours",
  },
  {
    id: "seller-stock",
    audience: "seller",
    category: "seller",
    tags: ["stock", "inventaire", "gestion"],
    question: {
      fr: "Comment gérer mon stock efficacement ?",
      wo: "Naka laay topp sama stock ci yoon wu baax ?",
      ha: "Ta yaya zan kula da stock?",
      en: "How do I manage my stock efficiently?",
    },
    answer: {
      fr: "Depuis le dashboard vendeur, activez les seuils de réapprovisionnement (notification quand stock < X). L'IA AfriKoin suggère aussi le prix optimal et la quantité à commander selon la saisonnalité.",
      wo: "Ci dashboard, defal seuils. AI dina la jox xelu.",
      ha: "A dashboard, saita iyakokin stock. AI zai ba ka shawara.",
      en: "From the seller dashboard, enable reorder thresholds. AfriKoin AI also suggests optimal price and reorder quantity by seasonality.",
    },
  },
  {
    id: "seller-ai-listing",
    audience: "seller",
    category: "seller",
    tags: ["ia", "photo", "description"],
    question: {
      fr: "L'IA peut-elle rédiger mes fiches produit ?",
      wo: "Ndax IA mën na bind sama fiches produit ?",
      ha: "Shin AI zai iya rubuta bayanin kayan?",
      en: "Can the AI write my product listings?",
    },
    answer: {
      fr: "Oui. Prenez une photo, l'IA AfriKoin génère titre SEO, description multilingue, catégorie et prix suggéré en 5 secondes. Vous validez ou modifiez avant publication. Gratuit pour tous les vendeurs.",
      wo: "Waaw. Jël nataal, AI bi defal titre ak description.",
      ha: "Eh. Daukar hoto, AI zai rubuta komai.",
      en: "Yes. Take a photo, AI generates SEO title, multilingual description, category and suggested price in 5 seconds. Free for all sellers.",
    },
  },
  {
    id: "seller-bad-buyer",
    audience: "seller",
    category: "trust",
    tags: ["faux", "acheteur", "fraude"],
    question: {
      fr: "Comment me protéger des faux acheteurs ?",
      wo: "Naka laay musëlu ci jëndakat yu dul yu wóor ?",
      ha: "Ta yaya zan kare kaina daga masu saye na karya?",
      en: "How do I protect myself from fake buyers?",
    },
    answer: {
      fr: "AfriKoin vérifie chaque acheteur (téléphone + email). N'envoyez jamais un produit avant confirmation du paiement dans votre wallet. Les acheteurs avec un score bas affichent un avertissement.",
      wo: "Bul yónnee marsandiis bu sa fay bi feeñagul ci wallet bi.",
      ha: "Kada ka aika kaya kafin kuɗi ya shiga wallet.",
      en: "AfriKoin verifies every buyer (phone + email). Never ship before payment lands in your wallet. Low-score buyers show a warning.",
    },
    articleSlug: "eviter-arnaques",
  },
  {
    id: "seller-respond-fast",
    audience: "seller",
    category: "seller",
    tags: ["reponse", "message", "rapidite"],
    question: {
      fr: "Pourquoi répondre vite aux clients ?",
      wo: "Lu tax tontu gaaw ci sa kiliyaan yi ?",
      ha: "Me ya sa amsa da sauri yake da muhimmanci?",
      en: "Why respond quickly to customers?",
    },
    answer: {
      fr: "Un temps de réponse < 1h augmente le taux de conversion de 60%. AfriKoin affiche votre badge « Répond rapidement » si moins de 30 min en moyenne. La traduction automatique FR/WO/HA accélère encore les échanges.",
      wo: "Tontu ci 1h dafay yokk ay buy yi 60%.",
      ha: "Amsa cikin 1h yana ƙara siyarwa 60%.",
      en: "Response < 1h boosts conversion by 60%. AfriKoin shows a 'Responds quickly' badge if avg < 30 min. Auto-translation FR/WO/HA speeds it up.",
    },
  },
]
