// Demo data for publications, news, and marketplace
import type { Product } from '@/types/cart';

// ============== DEMO POSTS ==============
export interface DemoPost {
  id: string;
  title: string;
  description: string;
  media_url: string;
  category: string;
  location: string;
  like_count: number;
  view_count: number;
  comment_count: number;
  is_featured: boolean;
  is_monetized: boolean;
  price?: number;
  created_at: string;
  profiles: {
    name: string;
    avatar_url: string;
    is_verified: boolean;
    country: string;
  };
}

export const DEMO_POSTS: DemoPost[] = [
  {
    id: 'demo-1',
    title: 'Festival MASA 2025 - Abidjan en fête ! 🎭',
    description: 'Le Marché des Arts du Spectacle d\'Abidjan (MASA) revient cette année avec une programmation exceptionnelle. Plus de 200 artistes de 30 pays africains se produiront pendant 7 jours de spectacles, musique et danse traditionnelle. Ne manquez pas cet événement culturel majeur du continent ! 🌍✨',
    media_url: 'https://images.unsplash.com/photo-1533174072545-7a4b6ad7a6c3?w=800',
    category: 'culture',
    location: 'Abidjan, Côte d\'Ivoire',
    like_count: 2847,
    view_count: 15420,
    comment_count: 156,
    is_featured: true,
    is_monetized: false,
    created_at: new Date(Date.now() - 2 * 60 * 60 * 1000).toISOString(),
    profiles: {
      name: 'AfriCulture Magazine',
      avatar_url: 'https://images.unsplash.com/photo-1507003211169-0a1dd7228f2d?w=150',
      is_verified: true,
      country: 'Côte d\'Ivoire'
    }
  },
  {
    id: 'demo-2',
    title: 'Recette du jour : Poulet Yassa Sénégalais 🍗',
    description: 'Découvrez ma recette traditionnelle du Poulet Yassa, un plat emblématique de la cuisine sénégalaise. Oignons caramélisés, citron, moutarde... tous les secrets pour réussir ce délice ! Parfait pour vos réunions de famille. Qui a déjà goûté ? 😋',
    media_url: 'https://images.unsplash.com/photo-1604908176997-125f25cc6f3d?w=800',
    category: 'gastronomie',
    location: 'Dakar, Sénégal',
    like_count: 1523,
    view_count: 8934,
    comment_count: 89,
    is_featured: false,
    is_monetized: false,
    created_at: new Date(Date.now() - 5 * 60 * 60 * 1000).toISOString(),
    profiles: {
      name: 'Fatou Cuisinière',
      avatar_url: 'https://images.unsplash.com/photo-1494790108377-be9c29b29330?w=150',
      is_verified: false,
      country: 'Sénégal'
    }
  },
  {
    id: 'demo-3',
    title: 'Nouvelle collection Bogolan - Artisanat malien 🎨',
    description: 'Présentation de ma nouvelle collection de tissus Bogolan faits main ! Chaque pièce raconte une histoire, avec des motifs traditionnels du pays Dogon. Disponible sur commande. DM pour plus d\'infos. Livraison possible dans toute l\'Afrique de l\'Ouest.',
    media_url: 'https://images.unsplash.com/photo-1590735213920-68192a487bc2?w=800',
    category: 'mode',
    location: 'Bamako, Mali',
    like_count: 956,
    view_count: 4521,
    comment_count: 67,
    is_featured: true,
    is_monetized: true,
    price: 25000,
    created_at: new Date(Date.now() - 8 * 60 * 60 * 1000).toISOString(),
    profiles: {
      name: 'Aminata Bogolan',
      avatar_url: 'https://images.unsplash.com/photo-1531123897727-8f129e1688ce?w=150',
      is_verified: true,
      country: 'Mali'
    }
  },
  {
    id: 'demo-4',
    title: 'Les Lions de la Teranga en finale ! 🦁⚽',
    description: 'HISTORIQUE ! Le Sénégal se qualifie pour la finale de la CAN après une victoire 3-1 contre le Nigeria. Sadio Mané a encore brillé avec un doublé. Rendez-vous dimanche pour le match final ! Allez les Lions ! 🇸🇳🏆',
    media_url: 'https://images.unsplash.com/photo-1574629810360-7efbbe195018?w=800',
    category: 'sport',
    location: 'Abidjan, Côte d\'Ivoire',
    like_count: 8934,
    view_count: 45230,
    comment_count: 423,
    is_featured: true,
    is_monetized: false,
    created_at: new Date(Date.now() - 12 * 60 * 60 * 1000).toISOString(),
    profiles: {
      name: 'Sport Africa',
      avatar_url: 'https://images.unsplash.com/photo-1472099645785-5658abf4ff4e?w=150',
      is_verified: true,
      country: 'Sénégal'
    }
  },
  {
    id: 'demo-5',
    title: 'Startup tech africaine lève 5 millions $ 💰',
    description: 'PayAfrika, la startup fintech basée à Lagos, vient de lever 5 millions de dollars pour étendre son service de paiement mobile en Afrique de l\'Ouest. Une nouvelle preuve que l\'innovation africaine attire les investisseurs ! 🚀',
    media_url: 'https://images.unsplash.com/photo-1556761175-b413da4baf72?w=800',
    category: 'business',
    location: 'Lagos, Nigeria',
    like_count: 1287,
    view_count: 6789,
    comment_count: 54,
    is_featured: false,
    is_monetized: false,
    created_at: new Date(Date.now() - 24 * 60 * 60 * 1000).toISOString(),
    profiles: {
      name: 'TechAfrica News',
      avatar_url: 'https://images.unsplash.com/photo-1560250097-0b93528c311a?w=150',
      is_verified: true,
      country: 'Nigeria'
    }
  }
];

// ============== DEMO NEWS ==============
export interface DemoNews {
  id: string;
  title: string;
  content: string;
  category_slug: string;
  category_label: string;
  image_url: string;
  source: string;
  is_breaking: boolean;
  is_featured: boolean;
  country_codes: string[];
  published_at: string;
}

export const DEMO_NEWS: DemoNews[] = [
  // Politique
  {
    id: 'news-1',
    title: 'Sommet de l\'Union Africaine : les dirigeants s\'engagent pour l\'intégration économique',
    content: 'Les chefs d\'État africains réunis à Addis-Abeba ont adopté une feuille de route ambitieuse pour accélérer la mise en œuvre de la Zone de libre-échange continentale africaine (ZLECAf).',
    category_slug: 'politique',
    category_label: 'Politique',
    image_url: 'https://images.unsplash.com/photo-1529107386315-e1a2ed48a620?w=400',
    source: 'AfricaNews',
    is_breaking: true,
    is_featured: true,
    country_codes: ['ET', 'ZA', 'NG', 'KE'],
    published_at: new Date(Date.now() - 30 * 60 * 1000).toISOString()
  },
  {
    id: 'news-2',
    title: 'Le Ghana inaugure sa première usine de transformation de cacao',
    content: 'Le président ghanéen a inauguré une usine ultramoderne qui permettra de transformer localement 50% du cacao produit, créant 2000 emplois directs.',
    category_slug: 'economie',
    category_label: 'Économie',
    image_url: 'https://images.unsplash.com/photo-1606312619070-d48b4c652a52?w=400',
    source: 'Ghana Business',
    is_breaking: false,
    is_featured: true,
    country_codes: ['GH'],
    published_at: new Date(Date.now() - 2 * 60 * 60 * 1000).toISOString()
  },
  // Sports
  {
    id: 'news-3',
    title: 'CAN 2025 : La Côte d\'Ivoire prête à accueillir le monde',
    content: 'Tous les stades sont fin prêts pour la Coupe d\'Afrique des Nations. 6 villes hôtes accueilleront les 24 équipes qualifiées pour ce qui s\'annonce comme la plus grande CAN de l\'histoire.',
    category_slug: 'sports',
    category_label: 'Sport',
    image_url: 'https://images.unsplash.com/photo-1431324155629-1a6deb1dec8d?w=400',
    source: 'Sport Ivoire',
    is_breaking: false,
    is_featured: true,
    country_codes: ['CI'],
    published_at: new Date(Date.now() - 3 * 60 * 60 * 1000).toISOString()
  },
  {
    id: 'news-4',
    title: 'Basket : L\'Afrique brille aux éliminatoires de la Coupe du Monde',
    content: 'Le Nigeria et le Sénégal se qualifient pour le Mondial de basket après des performances impressionnantes face aux équipes européennes.',
    category_slug: 'sports',
    category_label: 'Sport',
    image_url: 'https://images.unsplash.com/photo-1546519638-68e109498ffc?w=400',
    source: 'FIBA Africa',
    is_breaking: false,
    is_featured: false,
    country_codes: ['NG', 'SN'],
    published_at: new Date(Date.now() - 5 * 60 * 60 * 1000).toISOString()
  },
  // Culture
  {
    id: 'news-5',
    title: 'Burna Boy sacré meilleur artiste africain aux Grammy Awards',
    content: 'Le chanteur nigérian remporte son deuxième Grammy Award consécutif, confirmant le rayonnement mondial de l\'Afrobeats.',
    category_slug: 'culture',
    category_label: 'Culture',
    image_url: 'https://images.unsplash.com/photo-1493225457124-a3eb161ffa5f?w=400',
    source: 'Music Africa',
    is_breaking: true,
    is_featured: true,
    country_codes: ['NG'],
    published_at: new Date(Date.now() - 1 * 60 * 60 * 1000).toISOString()
  },
  {
    id: 'news-6',
    title: 'Le cinéma africain en vedette au Festival de Cannes',
    content: 'Trois films africains sélectionnés en compétition officielle, un record historique pour le continent sur la Croisette.',
    category_slug: 'culture',
    category_label: 'Culture',
    image_url: 'https://images.unsplash.com/photo-1485846234645-a62644f84728?w=400',
    source: 'Afrique Cinema',
    is_breaking: false,
    is_featured: false,
    country_codes: ['SN', 'MA', 'ZA'],
    published_at: new Date(Date.now() - 6 * 60 * 60 * 1000).toISOString()
  },
  // Économie
  {
    id: 'news-7',
    title: 'Le Kenya lance sa propre monnaie numérique',
    content: 'La Banque Centrale du Kenya annonce le lancement pilote du "eShilling", une monnaie numérique visant à faciliter les transactions et l\'inclusion financière.',
    category_slug: 'economie',
    category_label: 'Économie',
    image_url: 'https://images.unsplash.com/photo-1621761191319-c6fb62004040?w=400',
    source: 'Kenya Finance',
    is_breaking: true,
    is_featured: true,
    country_codes: ['KE'],
    published_at: new Date(Date.now() - 4 * 60 * 60 * 1000).toISOString()
  },
  // Technologie
  {
    id: 'news-8',
    title: 'Starlink déploie l\'internet haut débit dans 10 nouveaux pays africains',
    content: 'L\'entreprise d\'Elon Musk étend sa couverture satellite, offrant un accès internet rapide aux zones rurales du continent.',
    category_slug: 'technologie',
    category_label: 'Tech',
    image_url: 'https://images.unsplash.com/photo-1451187580459-43490279c0fa?w=400',
    source: 'Tech Africa',
    is_breaking: false,
    is_featured: true,
    country_codes: ['KE', 'NG', 'ZA', 'GH', 'CI'],
    published_at: new Date(Date.now() - 7 * 60 * 60 * 1000).toISOString()
  },
  // Santé
  {
    id: 'news-9',
    title: 'Vaccin anti-paludisme : l\'Afrique franchit le cap des 100 millions de doses',
    content: 'L\'OMS célèbre cette étape majeure dans la lutte contre le paludisme, avec une réduction de 30% des cas graves chez les enfants.',
    category_slug: 'sante',
    category_label: 'Santé',
    image_url: 'https://images.unsplash.com/photo-1584820927498-cfe5211fd8bf?w=400',
    source: 'Santé Afrique',
    is_breaking: false,
    is_featured: false,
    country_codes: ['GH', 'KE', 'MW'],
    published_at: new Date(Date.now() - 8 * 60 * 60 * 1000).toISOString()
  },
  // Environnement
  {
    id: 'news-10',
    title: 'Grande Muraille Verte : 15% de l\'objectif atteint',
    content: 'Le projet ambitieux de reforestation du Sahel progresse avec plus de 4 millions d\'hectares restaurés dans 11 pays africains.',
    category_slug: 'environnement',
    category_label: 'Environnement',
    image_url: 'https://images.unsplash.com/photo-1441974231531-c6227db76b6e?w=400',
    source: 'Green Africa',
    is_breaking: false,
    is_featured: false,
    country_codes: ['SN', 'ML', 'NE', 'BF'],
    published_at: new Date(Date.now() - 10 * 60 * 60 * 1000).toISOString()
  }
];

// ============== DEMO PRODUCTS ==============
export const DEMO_PRODUCTS: Product[] = [
  // FRUITS & LÉGUMES
  {
    id: 'prod-1',
    title: 'Mangues Kent Premium - Caisse 10kg',
    description: 'Mangues Kent fraîches du Mali, mûres à point, sucrées et parfumées. Récoltées à la main dans nos vergers familiaux de Sikasso.',
    price: 15000,
    currency: 'XOF',
    country: 'Mali',
    images: ['https://images.unsplash.com/photo-1553279768-865429fa0078?w=600'],
    stock: 45,
    category: 'Fruits',
    is_active: true,
    is_featured: true,
    views_count: 856,
    created_at: new Date().toISOString(),
    updated_at: new Date().toISOString()
  },
  {
    id: 'prod-2',
    title: 'Ananas Pain de Sucre Bio - Lot de 3',
    description: 'Ananas Victoria de Guinée, cultivés sans pesticides. Saveur exceptionnellement sucrée et chair fondante.',
    price: 8500,
    currency: 'XOF',
    country: 'Guinée',
    images: ['https://images.unsplash.com/photo-1550258987-190a2d41a8ba?w=600'],
    stock: 28,
    category: 'Fruits',
    is_active: true,
    is_featured: false,
    views_count: 423,
    created_at: new Date().toISOString(),
    updated_at: new Date().toISOString()
  },
  {
    id: 'prod-3',
    title: 'Bananes Plantain Mûres - 5kg',
    description: 'Plantains parfaits pour l\'alloco ou le foufou. Fraîcheur garantie, livrés dans les 24h.',
    price: 4500,
    currency: 'XOF',
    country: 'Côte d\'Ivoire',
    images: ['https://images.unsplash.com/photo-1571771894821-ce9b6c11b08e?w=600'],
    stock: 120,
    category: 'Fruits',
    is_active: true,
    is_featured: false,
    views_count: 678,
    created_at: new Date().toISOString(),
    updated_at: new Date().toISOString()
  },
  {
    id: 'prod-4',
    title: 'Papayes Solo - Lot de 4',
    description: 'Papayes bio du Sénégal, douces et parfumées. Idéales pour vos jus et desserts tropicaux.',
    price: 6000,
    currency: 'XOF',
    country: 'Sénégal',
    images: ['https://images.unsplash.com/photo-1517282009859-f000ec3b26fe?w=600'],
    stock: 35,
    category: 'Fruits',
    is_active: true,
    is_featured: true,
    views_count: 312,
    created_at: new Date().toISOString(),
    updated_at: new Date().toISOString()
  },
  // MODE & TEXTILE
  {
    id: 'prod-5',
    title: 'Tissu Wax Hollandais Premium - 6 yards',
    description: 'Authentique wax hollandais de qualité supérieure. Couleurs vives et tenue impeccable au lavage. Motifs exclusifs.',
    price: 35000,
    currency: 'XOF',
    country: 'Bénin',
    images: ['https://images.unsplash.com/photo-1590735213920-68192a487bc2?w=600'],
    stock: 50,
    category: 'Mode',
    is_active: true,
    is_featured: true,
    views_count: 1234,
    created_at: new Date().toISOString(),
    updated_at: new Date().toISOString()
  },
  {
    id: 'prod-6',
    title: 'Boubou Homme Brodé Grand Modèle',
    description: 'Boubou traditionnel en bazin riche, broderie faite main par nos artisans de Bamako. Tailles disponibles : M à 3XL.',
    price: 85000,
    currency: 'XOF',
    country: 'Mali',
    images: ['https://images.unsplash.com/photo-1594938298603-c8148c4dae35?w=600'],
    stock: 15,
    category: 'Mode',
    is_active: true,
    is_featured: true,
    views_count: 567,
    created_at: new Date().toISOString(),
    updated_at: new Date().toISOString()
  },
  {
    id: 'prod-7',
    title: 'Robe Dashiki Femme Élégante',
    description: 'Robe longue dashiki avec imprimés Ankara. Coupe moderne et élégante pour toutes vos occasions.',
    price: 45000,
    currency: 'XOF',
    country: 'Ghana',
    images: ['https://images.unsplash.com/photo-1590735213408-9d880847b9ed?w=600'],
    stock: 22,
    category: 'Mode',
    is_active: true,
    is_featured: false,
    views_count: 445,
    created_at: new Date().toISOString(),
    updated_at: new Date().toISOString()
  },
  // ARTISANAT
  {
    id: 'prod-8',
    title: 'Sculpture Masque Africain - Bois d\'Ébène',
    description: 'Masque traditionnel sculpté à la main dans du bois d\'ébène massif. Pièce unique certifiée, hauteur 45cm.',
    price: 125000,
    currency: 'XOF',
    country: 'Cameroun',
    images: ['https://images.unsplash.com/photo-1582582621959-48d27397dc69?w=600'],
    stock: 8,
    category: 'Art',
    is_active: true,
    is_featured: true,
    views_count: 234,
    created_at: new Date().toISOString(),
    updated_at: new Date().toISOString()
  },
  {
    id: 'prod-9',
    title: 'Panier Tressé Bolga - Grand Format',
    description: 'Panier traditionnel du Ghana, tressé à la main avec des fibres d\'éléphant grass. Parfait pour le marché ou la déco.',
    price: 18000,
    currency: 'XOF',
    country: 'Ghana',
    images: ['https://images.unsplash.com/photo-1594631252845-29fc4cc8cde9?w=600'],
    stock: 35,
    category: 'Artisanat',
    is_active: true,
    is_featured: false,
    views_count: 189,
    created_at: new Date().toISOString(),
    updated_at: new Date().toISOString()
  },
  // BIJOUX
  {
    id: 'prod-10',
    title: 'Collier en Or 18 Carats - Style Akan',
    description: 'Collier en or véritable 18 carats, design inspiré des symboles Akan. Certificat d\'authenticité inclus.',
    price: 450000,
    currency: 'XOF',
    country: 'Côte d\'Ivoire',
    images: ['https://images.unsplash.com/photo-1515562141207-7a88fb7ce338?w=600'],
    stock: 3,
    category: 'Bijoux',
    is_active: true,
    is_featured: true,
    views_count: 567,
    created_at: new Date().toISOString(),
    updated_at: new Date().toISOString()
  },
  {
    id: 'prod-11',
    title: 'Bracelet Perles Maasai - Fait Main',
    description: 'Bracelet traditionnel Maasai en perles multicolores. Chaque bracelet soutient les artisanes de notre coopérative.',
    price: 8500,
    currency: 'XOF',
    country: 'Kenya',
    images: ['https://images.unsplash.com/photo-1573408301185-9146fe634ad0?w=600'],
    stock: 60,
    category: 'Bijoux',
    is_active: true,
    is_featured: false,
    views_count: 345,
    created_at: new Date().toISOString(),
    updated_at: new Date().toISOString()
  },
  // BEAUTÉ
  {
    id: 'prod-12',
    title: 'Huile d\'Argan Bio Pure - 100ml',
    description: 'Huile d\'argan 100% pure et bio du Maroc. Première pression à froid. Idéale pour cheveux et peau.',
    price: 22000,
    currency: 'XOF',
    country: 'Maroc',
    images: ['https://images.unsplash.com/photo-1608571423902-eed4a5ad8108?w=600'],
    stock: 40,
    category: 'Beauté',
    is_active: true,
    is_featured: true,
    views_count: 890,
    created_at: new Date().toISOString(),
    updated_at: new Date().toISOString()
  },
  {
    id: 'prod-13',
    title: 'Beurre de Karité Pur du Burkina - 500g',
    description: 'Beurre de karité brut non raffiné. Fabriqué par les femmes de Léo au Burkina Faso. Multi-usage : corps, cheveux, visage.',
    price: 12000,
    currency: 'XOF',
    country: 'Burkina Faso',
    images: ['https://images.unsplash.com/photo-1598440947619-2c35fc9aa908?w=600'],
    stock: 55,
    category: 'Beauté',
    is_active: true,
    is_featured: false,
    views_count: 678,
    created_at: new Date().toISOString(),
    updated_at: new Date().toISOString()
  },
  // ALIMENTATION
  {
    id: 'prod-14',
    title: 'Café Arabica Éthiopien - 500g',
    description: 'Café d\'origine Yirgacheffe, torréfié artisanalement. Notes florales et fruitées. Qualité exportation.',
    price: 18000,
    currency: 'XOF',
    country: 'Éthiopie',
    images: ['https://images.unsplash.com/photo-1447933601403-0c6688de566e?w=600'],
    stock: 70,
    category: 'Alimentation',
    is_active: true,
    is_featured: true,
    views_count: 567,
    created_at: new Date().toISOString(),
    updated_at: new Date().toISOString()
  },
  {
    id: 'prod-15',
    title: 'Piment Habanero Séché - 250g',
    description: 'Piments habanero séchés au soleil. Puissance et saveur authentiques pour vos plats africains.',
    price: 4500,
    currency: 'XOF',
    country: 'Sénégal',
    images: ['https://images.unsplash.com/photo-1526346698789-22fd84314424?w=600'],
    stock: 85,
    category: 'Alimentation',
    is_active: true,
    is_featured: false,
    views_count: 234,
    created_at: new Date().toISOString(),
    updated_at: new Date().toISOString()
  },
  {
    id: 'prod-16',
    title: 'Arachides Grillées - Sac 5kg',
    description: 'Arachides du Sénégal grillées et salées. Parfaites pour vos apéros ou pour la préparation du mafé.',
    price: 7500,
    currency: 'XOF',
    country: 'Sénégal',
    images: ['https://images.unsplash.com/photo-1599599810694-b5b37304c041?w=600'],
    stock: 100,
    category: 'Alimentation',
    is_active: true,
    is_featured: false,
    views_count: 345,
    created_at: new Date().toISOString(),
    updated_at: new Date().toISOString()
  },
  // STATION-SERVICE
  {
    id: 'prod-17',
    title: 'Huile Moteur 5W-40 Synthétique - 5L',
    description: 'Huile moteur haute performance pour tous types de véhicules. Protection maximale et économie de carburant.',
    price: 35000,
    currency: 'XOF',
    country: 'Côte d\'Ivoire',
    images: ['https://images.unsplash.com/photo-1487754180451-c456f719a1fc?w=600'],
    stock: 200,
    category: 'Station-Service',
    is_active: true,
    is_featured: true,
    views_count: 456,
    created_at: new Date().toISOString(),
    updated_at: new Date().toISOString()
  },
  {
    id: 'prod-18',
    title: 'Filtre à Air Universel',
    description: 'Filtre à air haute qualité compatible avec la plupart des véhicules. Installation facile.',
    price: 8500,
    currency: 'XOF',
    country: 'Sénégal',
    images: ['https://images.unsplash.com/photo-1558618666-fcd25c85cd64?w=600'],
    stock: 150,
    category: 'Station-Service',
    is_active: true,
    is_featured: false,
    views_count: 234,
    created_at: new Date().toISOString(),
    updated_at: new Date().toISOString()
  },
  // RESTAURANT
  {
    id: 'prod-19',
    title: 'Thieboudienne Royal - Plat pour 4',
    description: 'Le célèbre riz au poisson sénégalais. Préparé avec du thiof frais, légumes du marché et épices traditionnelles.',
    price: 18000,
    currency: 'XOF',
    country: 'Sénégal',
    images: ['https://images.unsplash.com/photo-1604329760661-e71dc83f8f26?w=600'],
    stock: 20,
    category: 'Restaurant',
    is_active: true,
    is_featured: true,
    views_count: 890,
    created_at: new Date().toISOString(),
    updated_at: new Date().toISOString()
  },
  {
    id: 'prod-20',
    title: 'Poulet Yassa - Portion Familiale',
    description: 'Poulet mariné aux oignons et citron, servi avec riz blanc parfumé. Recette authentique de Casamance.',
    price: 15000,
    currency: 'XOF',
    country: 'Sénégal',
    images: ['https://images.unsplash.com/photo-1604908176997-125f25cc6f3d?w=600'],
    stock: 25,
    category: 'Restaurant',
    is_active: true,
    is_featured: true,
    views_count: 678,
    created_at: new Date().toISOString(),
    updated_at: new Date().toISOString()
  },
  {
    id: 'prod-21',
    title: 'Attiéké Poisson Braisé',
    description: 'Semoule de manioc accompagnée de poisson braisé, sauce tomate et piment. Spécialité ivoirienne.',
    price: 8500,
    currency: 'XOF',
    country: 'Côte d\'Ivoire',
    images: ['https://images.unsplash.com/photo-1544943910-4c1dc44aab44?w=600'],
    stock: 30,
    category: 'Restaurant',
    is_active: true,
    is_featured: false,
    views_count: 567,
    created_at: new Date().toISOString(),
    updated_at: new Date().toISOString()
  },
  // AGRICOLE - BÉTAIL
  {
    id: 'prod-22',
    title: 'Mouton Tabaski - Race Ladoum',
    description: 'Magnifique mouton Ladoum de race pure, élevé en pâturage naturel. Parfait pour la Tabaski. Poids: 60-80kg.',
    price: 350000,
    currency: 'XOF',
    country: 'Sénégal',
    images: ['https://images.unsplash.com/photo-1484557985045-edf25e08da73?w=600'],
    stock: 15,
    category: 'Bétail',
    is_active: true,
    is_featured: true,
    views_count: 1234,
    created_at: new Date().toISOString(),
    updated_at: new Date().toISOString()
  },
  {
    id: 'prod-23',
    title: 'Chèvre Sahélienne - Femelle',
    description: 'Chèvre en excellente santé, race sahélienne adaptée au climat. Idéale pour l\'élevage ou la consommation.',
    price: 75000,
    currency: 'XOF',
    country: 'Mali',
    images: ['https://images.unsplash.com/photo-1524024973431-2ad916746881?w=600'],
    stock: 25,
    category: 'Bétail',
    is_active: true,
    is_featured: false,
    views_count: 456,
    created_at: new Date().toISOString(),
    updated_at: new Date().toISOString()
  },
  {
    id: 'prod-24',
    title: 'Vache Laitière N\'Dama',
    description: 'Vache de race N\'Dama, résistante à la trypanosomiase. Production laitière régulière. Âge: 3 ans.',
    price: 650000,
    currency: 'XOF',
    country: 'Guinée',
    images: ['https://images.unsplash.com/photo-1570042225831-d98fa7577f1e?w=600'],
    stock: 8,
    category: 'Bétail',
    is_active: true,
    is_featured: true,
    views_count: 567,
    created_at: new Date().toISOString(),
    updated_at: new Date().toISOString()
  },
  {
    id: 'prod-25',
    title: 'Poulets de Chair - Lot de 20',
    description: 'Poulets de chair élevés en plein air, nourris au maïs local. Poids moyen 2.5kg. Prêts pour l\'abattage.',
    price: 85000,
    currency: 'XOF',
    country: 'Burkina Faso',
    images: ['https://images.unsplash.com/photo-1548550023-2bdb3c5beed7?w=600'],
    stock: 50,
    category: 'Bétail',
    is_active: true,
    is_featured: false,
    views_count: 789,
    created_at: new Date().toISOString(),
    updated_at: new Date().toISOString()
  },
  {
    id: 'prod-26',
    title: 'Bélier de Race - Reproduction',
    description: 'Superbe bélier reproducteur, race Bali-Bali. Excellent patrimoine génétique pour améliorer votre cheptel.',
    price: 280000,
    currency: 'XOF',
    country: 'Niger',
    images: ['https://images.unsplash.com/photo-1558618047-f4b5d1c7f5a0?w=600'],
    stock: 5,
    category: 'Bétail',
    is_active: true,
    is_featured: true,
    views_count: 345,
    created_at: new Date().toISOString(),
    updated_at: new Date().toISOString()
  },
  // AGRICOLE - PRODUITS
  {
    id: 'prod-27',
    title: 'Semences de Maïs Hybride - 25kg',
    description: 'Semences de maïs à haut rendement, adaptées au climat sahélien. Rendement estimé: 8-10 tonnes/hectare.',
    price: 45000,
    currency: 'XOF',
    country: 'Mali',
    images: ['https://images.unsplash.com/photo-1551754655-cd27e38d2076?w=600'],
    stock: 100,
    category: 'Agricole',
    is_active: true,
    is_featured: true,
    views_count: 678,
    created_at: new Date().toISOString(),
    updated_at: new Date().toISOString()
  },
  {
    id: 'prod-28',
    title: 'Engrais NPK 15-15-15 - Sac 50kg',
    description: 'Engrais complet pour toutes cultures. Améliore le rendement et la qualité des récoltes.',
    price: 28000,
    currency: 'XOF',
    country: 'Côte d\'Ivoire',
    images: ['https://images.unsplash.com/photo-1416879595882-3373a0480b5b?w=600'],
    stock: 200,
    category: 'Agricole',
    is_active: true,
    is_featured: false,
    views_count: 456,
    created_at: new Date().toISOString(),
    updated_at: new Date().toISOString()
  },
  // SALON DE BEAUTÉ - SERVICES
  {
    id: 'prod-29',
    title: 'Tressage Fulani avec Perles',
    description: 'Magnifiques tresses Fulani ornées de perles et coquillages. Service professionnel, durée 4-6h. Sur rendez-vous.',
    price: 25000,
    currency: 'XOF',
    country: 'Sénégal',
    images: ['https://images.unsplash.com/photo-1522337360788-8b13dee7a37e?w=600'],
    stock: 50,
    category: 'Salon Beauté',
    is_active: true,
    is_featured: true,
    views_count: 1567,
    created_at: new Date().toISOString(),
    updated_at: new Date().toISOString()
  },
  {
    id: 'prod-30',
    title: 'Box Braids Classiques',
    description: 'Box braids longues ou mi-longues, mèches incluses. Travail soigné et durable 6-8 semaines.',
    price: 35000,
    currency: 'XOF',
    country: 'Côte d\'Ivoire',
    images: ['https://images.unsplash.com/photo-1595959183082-7b570b7e08e2?w=600'],
    stock: 30,
    category: 'Salon Beauté',
    is_active: true,
    is_featured: true,
    views_count: 1234,
    created_at: new Date().toISOString(),
    updated_at: new Date().toISOString()
  },
  {
    id: 'prod-31',
    title: 'Manucure Gel + Nail Art',
    description: 'Pose de gel semi-permanent avec nail art africain. Tenue 3 semaines garantie. Designs personnalisés.',
    price: 15000,
    currency: 'XOF',
    country: 'Ghana',
    images: ['https://images.unsplash.com/photo-1604654894610-df63bc536371?w=600'],
    stock: 40,
    category: 'Salon Beauté',
    is_active: true,
    is_featured: false,
    views_count: 890,
    created_at: new Date().toISOString(),
    updated_at: new Date().toISOString()
  },
  // PRODUITS DE BEAUTÉ
  {
    id: 'prod-32',
    title: 'Crème Éclaircissante Naturelle - 200ml',
    description: 'Crème unifiante au beurre de karité et vitamine C. 100% naturelle, sans hydroquinone. Résultats visibles en 4 semaines.',
    price: 18000,
    currency: 'XOF',
    country: 'Sénégal',
    images: ['https://images.unsplash.com/photo-1556228720-195a672e8a03?w=600'],
    stock: 60,
    category: 'Beauté',
    is_active: true,
    is_featured: true,
    views_count: 1456,
    created_at: new Date().toISOString(),
    updated_at: new Date().toISOString()
  },
  {
    id: 'prod-33',
    title: 'Huile de Baobab Pure - 100ml',
    description: 'Huile de baobab pressée à froid. Régénérante et nourrissante pour peau et cheveux. Made in Burkina.',
    price: 16000,
    currency: 'XOF',
    country: 'Burkina Faso',
    images: ['https://images.unsplash.com/photo-1608248543803-ba4f8c70ae0b?w=600'],
    stock: 45,
    category: 'Beauté',
    is_active: true,
    is_featured: false,
    views_count: 678,
    created_at: new Date().toISOString(),
    updated_at: new Date().toISOString()
  },
  {
    id: 'prod-34',
    title: 'Kit Défrisage Naturel Aloe Vera',
    description: 'Kit complet pour défrisage doux sans produits chimiques agressifs. Inclus: crème, neutralisant, masque.',
    price: 22000,
    currency: 'XOF',
    country: 'Nigéria',
    images: ['https://images.unsplash.com/photo-1571875257727-256c39da42af?w=600'],
    stock: 35,
    category: 'Beauté',
    is_active: true,
    is_featured: true,
    views_count: 890,
    created_at: new Date().toISOString(),
    updated_at: new Date().toISOString()
  },
  {
    id: 'prod-35',
    title: 'Savon Noir Africain Authentique - 500g',
    description: 'Savon noir traditionnel fabriqué à base de cendres de cacao et huile de palme. Purifiant et hydratant.',
    price: 5500,
    currency: 'XOF',
    country: 'Ghana',
    images: ['https://images.unsplash.com/photo-1600857544200-b2f666a9a2ec?w=600'],
    stock: 100,
    category: 'Beauté',
    is_active: true,
    is_featured: false,
    views_count: 567,
    created_at: new Date().toISOString(),
    updated_at: new Date().toISOString()
  },
  {
    id: 'prod-36',
    title: 'Perruque Lace Front Naturelle',
    description: 'Perruque en cheveux humains brésiliens, lace front invisible. Densité 180%. Longueur 22 pouces.',
    price: 125000,
    currency: 'XOF',
    country: 'Nigéria',
    images: ['https://images.unsplash.com/photo-1580618672591-eb180b1a973f?w=600'],
    stock: 15,
    category: 'Beauté',
    is_active: true,
    is_featured: true,
    views_count: 1890,
    created_at: new Date().toISOString(),
    updated_at: new Date().toISOString()
  }
];

// Categories enrichies
export const PRODUCT_CATEGORIES = [
  { id: 'all', name: 'Tous', icon: '🛍️', count: 36 },
  { id: 'fruits', name: 'Fruits', icon: '🥭', count: 4 },
  { id: 'mode', name: 'Mode', icon: '👗', count: 3 },
  { id: 'art', name: 'Art & Artisanat', icon: '🎨', count: 2 },
  { id: 'bijoux', name: 'Bijoux', icon: '💎', count: 2 },
  { id: 'beaute', name: 'Beauté', icon: '✨', count: 7 },
  { id: 'alimentation', name: 'Alimentation', icon: '🍽️', count: 3 },
  { id: 'station-service', name: 'Station-Service', icon: '⛽', count: 2 },
  { id: 'restaurant', name: 'Restaurant', icon: '🍛', count: 3 },
  { id: 'betail', name: 'Bétail', icon: '🐄', count: 5 },
  { id: 'agricole', name: 'Agricole', icon: '🌾', count: 2 },
  { id: 'salon-beaute', name: 'Salon Beauté', icon: '💇‍♀️', count: 3 }
];

export const NEWS_CATEGORIES = [
  { id: 'all', slug: 'all', name: 'Toutes', icon: '📰', color: 'bg-primary' },
  { id: 'politique', slug: 'politique', name: 'Politique', icon: '🏛️', color: 'bg-blue-500' },
  { id: 'economie', slug: 'economie', name: 'Économie', icon: '💰', color: 'bg-green-500' },
  { id: 'sports', slug: 'sports', name: 'Sport', icon: '⚽', color: 'bg-orange-500' },
  { id: 'culture', slug: 'culture', name: 'Culture', icon: '🎭', color: 'bg-purple-500' },
  { id: 'technologie', slug: 'technologie', name: 'Tech', icon: '💻', color: 'bg-cyan-500' },
  { id: 'sante', slug: 'sante', name: 'Santé', icon: '🏥', color: 'bg-red-500' },
  { id: 'environnement', slug: 'environnement', name: 'Environnement', icon: '🌍', color: 'bg-emerald-500' }
];
