import { PrismaLibSql } from "@prisma/adapter-libsql";
import path from "node:path";
import { PrismaClient } from "../src/generated/prisma/client";

const adapter = new PrismaLibSql({
  url: `file:${path.join(process.cwd(), "dev.db")}`,
});
const prisma = new PrismaClient({ adapter });

const img = (file: string) =>
  `https://commons.wikimedia.org/wiki/Special:FilePath/${encodeURIComponent(
    file.replace(/ /g, "_"),
  )}?width=600`;

type Spec = { labelFr: string; labelAr: string; value: string };
type SeedProduct = {
  sku: string;
  slug: string;
  nameFr: string;
  nameAr: string;
  brand: string;
  category: string;
  price: number;
  promoPrice?: number;
  stock: number;
  image: string;
  descriptionFr: string;
  descriptionAr: string;
  specs: Spec[];
  rating: number;
  reviewCount: number;
};

const categories = [
  {
    slug: "tv-video",
    nameFr: "TV & Vidéo",
    nameAr: "التلفزيونات والفيديو",
    imageUrl: img("A_Flat_Screen_Television.jpg"),
    order: 1,
  },
  {
    slug: "telephones",
    nameFr: "Téléphones",
    nameAr: "الهواتف",
    imageUrl: img("SAMSUNG_Galaxy_S24_Ultra_(5).jpg"),
    order: 2,
  },
  {
    slug: "ordinateurs",
    nameFr: "Ordinateurs",
    nameAr: "الحواسيب",
    imageUrl: img("Samsung_Galaxy_Book.jpg"),
    order: 3,
  },
  {
    slug: "audio",
    nameFr: "Audio",
    nameAr: "الصوتيات",
    imageUrl: img("Sony_WH-CH510_Bluetooth_Over-Ear_Headphone.jpg"),
    order: 4,
  },
  {
    slug: "electromenager",
    nameFr: "Électroménager",
    nameAr: "الأجهزة المنزلية",
    imageUrl: img("Front_Load_Washing_Machine.jpg"),
    order: 5,
  },
  {
    slug: "gaming",
    nameFr: "Console & Gaming",
    nameAr: "الأجهزة والألعاب",
    imageUrl: img("PS5DigitalEdition.png"),
    order: 6,
  },
  {
    slug: "photo",
    nameFr: "Photo",
    nameAr: "التصوير",
    imageUrl: img("Sony_Cybershot_DSC_W210.jpg"),
    order: 7,
  },
  {
    slug: "accessoires",
    nameFr: "Accessoires & Maison",
    nameAr: "الإكسسوارات والمنزل",
    imageUrl: img("Samsung_Gear_S3.jpg"),
    order: 8,
  },
];

const brands = [
  { slug: "samsung", name: "Samsung" },
  { slug: "lg", name: "LG" },
  { slug: "sony", name: "Sony" },
  { slug: "tcl", name: "TCL" },
  { slug: "philips", name: "Philips" },
  { slug: "bosch", name: "Bosch" },
  { slug: "candy", name: "Candy" },
  { slug: "moulinex", name: "Moulinex" },
  { slug: "xiaomi", name: "Xiaomi" },
  { slug: "microsoft", name: "Microsoft" },
  { slug: "nintendo", name: "Nintendo" },
  { slug: "jbl", name: "JBL" },
  { slug: "canon", name: "Canon" },
  { slug: "siemens", name: "Siemens" },
  { slug: "acer", name: "Acer" },
];

const products: SeedProduct[] = [
  // ── TV & Vidéo ──────────────────────────────────────────────────────────
  {
    sku: "TV-SAM-QN90D-65",
    slug: "samsung-qe65qn90d-neo-qled-65",
    nameFr: "Samsung QE65QN90D TV Neo QLED 4K 65\"",
    nameAr: "سامسونج QE65QN90D تلفاز Neo QLED 4K 65 بوصة",
    brand: "samsung",
    category: "tv-video",
    price: 14999,
    promoPrice: 11999,
    stock: 7,
    image: img("A_Flat_Screen_Television.jpg"),
    descriptionFr:
      "Le nec plus ultra du catalogue 4K : dalle QLED 200 Hz, traitement anti-reflet et mode jeu automatique. La mise en marche est offerte en magasin.",
    descriptionAr:
      "أفضل ما تقدّمه سلسلة 4K: لوحة QLED بتردد 200 هرتز، معالجة للانعكاسات ووضع ألعاب تلقائي. مع التركيب المجاني داخل المتجر.",
    specs: [
      { labelFr: "Taille", labelAr: "الحجم", value: "65 pouces" },
      { labelFr: "Dalle", labelAr: "اللوحة", value: "Neo QLED" },
      { labelFr: "Définition", labelAr: "الدقة", value: "3840 x 2160 (4K UHD)" },
      { labelFr: "Fréquence", labelAr: "التردد", value: "200 Hz" },
      { labelFr: "Connectique", labelAr: "المنافذ", value: "4 HDMI, 2 USB" },
    ],
    rating: 4.7,
    reviewCount: 128,
  },
  {
    sku: "TV-LG-OLED55C4",
    slug: "lg-oled55c4-oled-evo-55",
    nameFr: "LG OLED55C4 TV OLED evo 4K 55\"",
    nameAr: "إل جي OLED55C4 تلفاز OLED evo 4K 55 بوصة",
    brand: "lg",
    category: "tv-video",
    price: 10999,
    stock: 5,
    image: img("LG_OLED_TV.jpg"),
    descriptionFr:
      "Un écran OLED auto-emissive au contraste infini et aux couleurs affinées par le processeur α9 de 6e génération.",
    descriptionAr: "شاشة OLED ذات إضاءة ذاتية وتباين لا نهائي وألوان دقيقة بمعالج α9 من الجيل السادس.",
    specs: [
      { labelFr: "Taille", labelAr: "الحجم", value: "55 pouces" },
      { labelFr: "Dalle", labelAr: "اللوحة", value: "OLED evo" },
      { labelFr: "Fréquence", labelAr: "التردد", value: "144 Hz" },
      { labelFr: "Audio", labelAr: "الصوت", value: "40 W, 2.2 canaux" },
    ],
    rating: 4.8,
    reviewCount: 86,
  },
  {
    sku: "TV-SON-X85L-55",
    slug: "sony-kd55x85l-bravia-4k-55",
    nameFr: "Sony KD-55X85L TV Bravia 4K LED 55\"",
    nameAr: "سوني KD-55X85L تلفاز Bravia 4K LED 55 بوصة",
    brand: "sony",
    category: "tv-video",
    price: 7499,
    promoPrice: 5999,
    stock: 12,
    image: img("A_flat-screen_television.jpg"),
    descriptionFr:
      "Le traitement d'image XR de Sony est la référence du genre pour le sport et le cinéma à la maison. Google TV intégré.",
    descriptionAr:
      "معالجة الصور XR من سوني هي المرجع في الرياضيات والسينما المنزلية، مع نظام Google TV مدمج.",
    specs: [
      { labelFr: "Taille", labelAr: "الحجم", value: "55 pouces" },
      { labelFr: "Technologie", labelAr: "التقنية", value: "XR Triluminos Pro" },
      { labelFr: "Système", labelAr: "النظام", value: "Google TV" },
      { labelFr: "HDMI", labelAr: "منافذ HDMI", value: "4 ports HDMI 2.1" },
    ],
    rating: 4.6,
    reviewCount: 54,
  },
  {
    sku: "TV-TCL-50V6B",
    slug: "tcl-50v6b-qled-4k-50",
    nameFr: "TCL 50V6B TV QLED 4K 50\"",
    nameAr: "TCL 50V6B تلفاز QLED 4K 50 بوصة",
    brand: "tcl",
    category: "tv-video",
    price: 3999,
    promoPrice: 2999,
    stock: 23,
    image: img("TCL_4K_tv_(24478123585).jpg"),
    descriptionFr:
      "Le meilleur rapport qualité-prix de la sélection : QLED, HDR10+ et assistant vocal à portée de voix, le tout sous les 3 000 DH en promotion.",
    descriptionAr:
      "أفضل قيمة مقابل السعر في التشكيلة: QLED وHDR10+ والمساعد الصوتي، بأقل من 3000 درهم بعد التخفيض.",
    specs: [
      { labelFr: "Taille", labelAr: "الحجم", value: "50 pouces" },
      { labelFr: "Dalle", labelAr: "اللوحة", value: "QLED" },
      { labelFr: "HDR", labelAr: "HDR", value: "HDR10+" },
      { labelFr: "Audio", labelAr: "الصوت", value: "20 W" },
    ],
    rating: 4.3,
    reviewCount: 41,
  },

  // ── Téléphones ──────────────────────────────────────────────────────────
  {
    sku: "TEL-SAM-S24U-256",
    slug: "samsung-galaxy-s24-ultra-256",
    nameFr: "Samsung Galaxy S24 Ultra 256 Go",
    nameAr: "سامسونج جالكسي S24 ألترا 256 غيغابايت",
    brand: "samsung",
    category: "telephones",
    price: 17999,
    promoPrice: 14999,
    stock: 9,
    image: img("SAMSUNG_Galaxy_S24_Ultra_(5).jpg"),
    descriptionFr:
      "Le flagship de l'année : stylet S Pen intégré, zoom optique 5x et l'écran le plus lumineux de la gamme. Réservé aux clients fidélité.",
    descriptionAr:
      "هاتف العام: قلم S Pen مدمج، تقريب بصري 5x وأسطع شاشة في التشكيلة. مخصص لعملاء الولاء.",
    specs: [
      { labelFr: "Écran", labelAr: "الشاشة", value: "6,8 pouces AMOLED 120 Hz" },
      { labelFr: "Processeur", labelAr: "المعالج", value: "Snapdragon 8 Gen 3" },
      { labelFr: "Mémoire", labelAr: "الذاكرة", value: "12 Go RAM" },
      { labelFr: "Stockage", labelAr: "التخزين", value: "256 Go" },
      { labelFr: "Photo", labelAr: "الكاميرا", value: "200 MP + 12 MP + 50 MP" },
    ],
    rating: 4.8,
    reviewCount: 213,
  },
  {
    sku: "TEL-SAM-S23-128",
    slug: "samsung-galaxy-s23-128",
    nameFr: "Samsung Galaxy S23 128 Go",
    nameAr: "سامسونج جالكسي S23 128 غيغابايت",
    brand: "samsung",
    category: "telephones",
    price: 7999,
    promoPrice: 6499,
    stock: 17,
    image: img("Samsung_S24_Ultra_Phone.png"),
    descriptionFr:
      "Compact, rapide et encore très demandé. Un achat qui ne déçoit pas à ce tarif, avec 24 mois de garantie constructeur.",
    descriptionAr:
      "هاتف مدمج وسريع وما زال المطلوب بكثرة. ضمان المصنع 24 شهراً.",
    specs: [
      { labelFr: "Écran", labelAr: "الشاشة", value: "6,1 pouces AMOLED 120 Hz" },
      { labelFr: "Processeur", labelAr: "المعالج", value: "Snapdragon 8 Gen 2" },
      { labelFr: "Stockage", labelAr: "التخزين", value: "128 Go" },
      { labelFr: "Photo", labelAr: "الكاميرا", value: "50 MP + 12 MP + 10 MP" },
    ],
    rating: 4.5,
    reviewCount: 97,
  },
  {
    sku: "TEL-SAM-A15-128",
    slug: "samsung-galaxy-a15-128",
    nameFr: "Samsung Galaxy A15 128 Go",
    nameAr: "سامسونج جالكسي A15 128 غيغابايت",
    brand: "samsung",
    category: "telephones",
    price: 2299,
    promoPrice: 1899,
    stock: 34,
    image: img(
      "Samsung_Galaxy_A40_und_Samsung_Galaxy_A15_20240529_HOF7492_RAW-Export_cens.png",
    ),
    descriptionFr:
      "L'entrée de gamme qui suffit pour le quotidien : écran Super AMOLED 90 Hz, 5 000 mAh et port micro-USB-C.",
    descriptionAr:
      "الفئة الاقتصادية التي تكفي للاستعمال اليومي: شاشة Super AMOLED بتردد 90 هرتز وبطارية 5000 مللي أمبير.",
    specs: [
      { labelFr: "Écran", labelAr: "الشاشة", value: "6,5 pouces Super AMOLED 90 Hz" },
      { labelFr: "Batterie", labelAr: "البطارية", value: "5 000 mAh, 25 W" },
      { labelFr: "Stockage", labelAr: "التخزين", value: "128 Go" },
      { labelFr: "Photo", labelAr: "الكاميرا", value: "50 MP triple" },
    ],
    rating: 4.2,
    reviewCount: 156,
  },
  {
    sku: "TEL-XIA-RED13P-256",
    slug: "xiaomi-redmi-note-13-pro-256",
    nameFr: "Xiaomi Redmi Note 13 Pro 256 Go",
    nameAr: "شاومي ريدمي نوت 13 برو 256 غيغابايت",
    brand: "xiaomi",
    category: "telephones",
    price: 3299,
    promoPrice: 2799,
    stock: 26,
    image: img("Redmi_Note_11_back.jpg"),
    descriptionFr:
      "Capteur principal de 200 MP, charge rapide 67 W et dalle AMOLED 120 Hz. Le champion du milieu de gamme chez Xiaomi.",
    descriptionAr:
      "مستشعر رئيسي 200 ميغابكسل، شحن سريع 67 وات وشاشة AMOLED بتردد 120 هرتز.",
    specs: [
      { labelFr: "Écran", labelAr: "الشاشة", value: "6,67 pouces AMOLED 120 Hz" },
      { labelFr: "Charge", labelAr: "الشحن", value: "67 W turbo" },
      { labelFr: "Stockage", labelAr: "التخزين", value: "256 Go" },
      { labelFr: "Photo", labelAr: "الكاميرا", value: "200 MP + 8 MP + 2 MP" },
    ],
    rating: 4.4,
    reviewCount: 188,
  },

  // ── Ordinateurs ─────────────────────────────────────────────────────────
  {
    sku: "ORD-SAM-BK4P-14",
    slug: "samsung-galaxy-book4-pro-14",
    nameFr: "Samsung Galaxy Book4 Pro 14\" Core Ultra 7",
    nameAr: "سامسونج غالكسي بوك 4 برو 14 بوصة",
    brand: "samsung",
    category: "ordinateurs",
    price: 11999,
    promoPrice: 9999,
    stock: 8,
    image: img("Samsung_Galaxy_Book.jpg"),
    descriptionFr:
      "Un châssis en aluminium de 1,23 kg, un écran Dynamic AMOLED 2X et une autonomie qui tient la journée de travail.",
    descriptionAr: "هيكل ألمنيوم بوزن 1.23 كغ، شاشة Dynamic AMOLED 2X وبطارية تكفي يوم عمل كامل.",
    specs: [
      { labelFr: "Écran", labelAr: "الشاشة", value: "14 pouces Dynamic AMOLED 2X" },
      { labelFr: "Processeur", labelAr: "المعالج", value: "Intel Core Ultra 7 155H" },
      { labelFr: "Mémoire", labelAr: "الذاكرة", value: "16 Go LPDDR5X" },
      { labelFr: "Stockage", labelAr: "التخزين", value: "512 Go SSD" },
      { labelFr: "Poids", labelAr: "الوزن", value: "1,23 kg" },
    ],
    rating: 4.6,
    reviewCount: 43,
  },
  {
    sku: "ORD-SAM-BK3-15",
    slug: "samsung-galaxy-book3-15",
    nameFr: "Samsung Galaxy Book3 15\" Core i5",
    nameAr: "سامسونج غالكسي بوك 3 15 بوصة",
    brand: "samsung",
    category: "ordinateurs",
    price: 6999,
    stock: 11,
    image: img("System76_product_lemp11.webp"),
    descriptionFr:
      "Le portable bureautique du quotidien : 15 pouces Full HD, 16 Go de mémoire et un clavier rétro-éclairé confortable.",
    descriptionAr:
      "حاسوب محمول للعمل اليومي: شاشة 15 بوصة Full HD وذاكرة 16 غيغابايت ولوحة مفاتيح بإضاءة خلفية.",
    specs: [
      { labelFr: "Écran", labelAr: "الشاشة", value: "15,6 pouces Full HD" },
      { labelFr: "Processeur", labelAr: "المعالج", value: "Intel Core i5-1235U" },
      { labelFr: "Mémoire", labelAr: "الذاكرة", value: "16 Go DDR4" },
      { labelFr: "Ports", labelAr: "المنافذ", value: "2 USB-C, HDMI 2.1" },
    ],
    rating: 4.2,
    reviewCount: 37,
  },
  {
    sku: "ORD-XIA-RMB15",
    slug: "xiaomi-redmibook-15-ryzen-5",
    nameFr: "Xiaomi RedmiBook 15 Ryzen 5",
    nameAr: "شاومي ريدمي بوك 15",
    brand: "xiaomi",
    category: "ordinateurs",
    price: 4299,
    promoPrice: 3599,
    stock: 19,
    image: img("System76_product_pang12.webp"),
    descriptionFr:
      "Sobre et abordable pour des études ou de la bureautique. Écran 15 pouces et processeur Ryzen 5.",
    descriptionAr: "مصمم وميسور التكلفة للدراسة أو الأعمال المكتبية، بمقاس 15 بوصة.",
    specs: [
      { labelFr: "Écran", labelAr: "الشاشة", value: "15,6 pouces Full HD" },
      { labelFr: "Processeur", labelAr: "المعالج", value: "AMD Ryzen 5 5500U" },
      { labelFr: "Mémoire", labelAr: "الذاكرة", value: "8 Go" },
      { labelFr: "Stockage", labelAr: "التخزين", value: "512 Go SSD" },
    ],
    rating: 4,
    reviewCount: 62,
  },
  {
    sku: "ORD-ACE-SG14",
    slug: "acer-swift-go-14-oled",
    nameFr: "Acer Swift Go 14 OLED",
    nameAr: "أيسر سويفت غو 14 أولد",
    brand: "acer",
    category: "ordinateurs",
    price: 5499,
    promoPrice: 4799,
    stock: 14,
    image: img("Benq_joybook_transparent.png"),
    descriptionFr:
      "OLED 2,8K et 1,3 kg : lePc portable nomade par excellence. Les finitions sont soignées.",
    descriptionAr: "شاشة OLED بدقة 2.8K ووزن 1.3 كغ، حاسوب محمول خفيف أنيق.",
    specs: [
      { labelFr: "Écran", labelAr: "الشاشة", value: "14 pouces OLED 2,8K 90 Hz" },
      { labelFr: "Processeur", labelAr: "المعالج", value: "Intel Core i5-13500H" },
      { labelFr: "Mémoire", labelAr: "الذاكرة", value: "16 Go LPDDR5" },
      { labelFr: "Poids", labelAr: "الوزن", value: "1,3 kg" },
    ],
    rating: 4.4,
    reviewCount: 29,
  },

  // ── Audio ───────────────────────────────────────────────────────────────
  {
    sku: "AUD-SON-CH510",
    slug: "sony-wh-ch510-casque-bluetooth",
    nameFr: "Sony WH-CH510 Casque Bluetooth",
    nameAr: "سوني WH-CH510 سماعة رأس بلوتوث",
    brand: "sony",
    category: "audio",
    price: 899,
    promoPrice: 649,
    stock: 28,
    image: img("Sony_WH-CH510_Bluetooth_Over-Ear_Headphone.jpg"),
    descriptionFr:
      "Léger (152 g), 40 h d'autonomie et recharge USB-C. Le casque d'entrée de gamme qui ne transige pas sur le confort.",
    descriptionAr: "خفيف بوزن 152 غراماً، 40 ساعة استقلال وشحن USB-C.",
    specs: [
      { labelFr: "Type", labelAr: "النوع", value: "Circumauriculaire" },
      { labelFr: "Autonomie", labelAr: "الاستقلال", value: "40 heures" },
      { labelFr: "Bluetooth", labelAr: "البلوتوث", value: "5.2, multipoint" },
      { labelFr: "Poids", labelAr: "الوزن", value: "152 g" },
    ],
    rating: 4.5,
    reviewCount: 74,
  },
  {
    sku: "AUD-PHI-9140",
    slug: "philips-hts9140-barre-de-son",
    nameFr: "Philips HTS9140 Barre de son Ambisound",
    nameAr: "فيليبس HTS9140 شريط صوت",
    brand: "philips",
    category: "audio",
    price: 3499,
    promoPrice: 2499,
    stock: 6,
    image: img("Philips_Soundbar_with_Ambisound_HTS9140_front.jpg"),
    descriptionFr:
      "Un caisson intégré et un doublage surround arrière : 3.1 canaux dans un boîtier de 26 cm qui se glisse sous le tv.",
    descriptionAr: "صوت bass مدمج وقنوات محيطة خلفية: 3.1 قناة في علبة عرضها 26 سم.",
    specs: [
      { labelFr: "Canaux", labelAr: "القنوات", value: "3.1 (Dolby Atmos)" },
      { labelFr: "Puissance", labelAr: "القدرة", value: "320 W RMS" },
      { labelFr: "Connectique", labelAr: "المنافذ", value: "HDMI ARC, optical, Bluetooth" },
      { labelFr: "Largeur", labelAr: "العرض", value: "26,5 cm" },
    ],
    rating: 4.1,
    reviewCount: 22,
  },
  {
    sku: "AUD-SAM-J250",
    slug: "samsung-hw-j250-barre-de-son",
    nameFr: "Samsung HW-J250 Barre de son 2.0",
    nameAr: "سامسونج HW-J250 شريط صوت 2.0",
    brand: "samsung",
    category: "audio",
    price: 999,
    stock: 31,
    image: img("SAMSUNG_SOUNDBAR_HW-J250.jpg"),
    descriptionFr:
      "Format compact, mode dialogue pour les news et connexion optique ou Bluetooth. Une barre simple qui fait le travail.",
    descriptionAr: "حجم مدمج، وضع حوار للأخبار واتصال ضوئي أو بلوتوث.",
    specs: [
      { labelFr: "Canaux", labelAr: "القنوات", value: "2.0" },
      { labelFr: "Puissance", labelAr: "القدرة", value: "200 W" },
      { labelFr: "Mode", labelAr: "الوضع", value: "Dialogue, Musique, Sport" },
    ],
    rating: 3.9,
    reviewCount: 58,
  },
  {
    sku: "AUD-JBL-FLIP5",
    slug: "jbl-flip-5-enceinte-bluetooth",
    nameFr: "JBL Flip 5 Enceinte Bluetooth",
    nameAr: "جي بي إل فليب 5 مكبر صوت",
    brand: "jbl",
    category: "audio",
    price: 1299,
    promoPrice: 999,
    stock: 24,
    image: img("JBL_Flip_3_bluetooth_speaker_(DSCF2653).jpg"),
    descriptionFr:
      "Étanche IPX7, 12 heures d'écoute et fonction PartyBoost pour chaîner plusieurs enceintes. Le compagnon des pique-niques.",
    descriptionAr: "مقاوم للماء بمعيار IPX7، 12 ساعة تشغيل وميزة PartyBoost لربط عدة مكبرات.",
    specs: [
      { labelFr: "Puissance", labelAr: "القدرة", value: "20 W RMS" },
      { labelFr: "Étanchéité", labelAr: "مقاومة الماء", value: "IPX7" },
      { labelFr: "Autonomie", labelAr: "الاستقلال", value: "12 heures" },
      { labelFr: "Lien", labelAr: "الربط", value: "PartyBoost" },
    ],
    rating: 4.6,
    reviewCount: 91,
  },

  // ── Électroménager ──────────────────────────────────────────────────────
  {
    sku: "ELE-BOS-WAN28281",
    slug: "bosch-wan28281ff-lave-linge-9kg",
    nameFr: "Bosch WAN28281FF Lave-linge 9 kg 1400 tr/min",
    nameAr: "بوش WAN28281FF غسالة 9 كغ 1400 دورة",
    brand: "bosch",
    category: "electromenager",
    price: 5499,
    promoPrice: 4299,
    stock: 10,
    image: img("Fagor_washing_machine_front_FF6314.jpg"),
    descriptionFr:
      "Classe A+++ guaranteed, moteur EcoSilence et 15 programmes dont le cycle rapide de 15 minutes. Installation et mise en marche offertes.",
    descriptionAr:
      "فئة A+++، محرك EcoSilence و15 برنامجاً منها دورة 15 دقيقة. التركيب والتشغيل مجاناً.",
    specs: [
      { labelFr: "Capacité", labelAr: "السعة", value: "9 kg" },
      { labelFr: "Vitesse", labelAr: "السرعة", value: "1 400 tr/min" },
      { labelFr: "Classe énergétique", labelAr: "فئة الطاقة", value: "A+++" },
      { labelFr: "Programmes", labelAr: "البرامج", value: "15 programmes" },
      { labelFr: "Largeur", labelAr: "العرض", value: "60 cm" },
    ],
    rating: 4.5,
    reviewCount: 47,
  },
  {
    sku: "ELE-CAN-FDP2107",
    slug: "candy-fdp-2-107-lave-linge-sechant",
    nameFr: "Candy FDP 2-107 Lave-linge séchant 9 kg",
    nameAr: "كاندي FDP 2-107 غسالة ومجففة 9 كغ",
    brand: "candy",
    category: "electromenager",
    price: 6499,
    promoPrice: 4999,
    stock: 7,
    image: img("Front_Load_Washing_Machine.jpg"),
    descriptionFr:
      "Lave et sèche en une passe : 9 kg de linge traité sans étendoir. Connectée, elle se pilote depuis l'application Candy.",
    descriptionAr: "تغسل وتجفف في دورة واحدة: 9 كغ دون تجفيف، مع تحكم عبر تطبيق Candy.",
    specs: [
      { labelFr: "Capacité lavage", labelAr: "سعة الغسيل", value: "9 kg" },
      { labelFr: "Capacité séchage", labelAr: "سعة التجفيف", value: "5 kg" },
      { labelFr: "Vitesse", labelAr: "السرعة", value: "1 400 tr/min" },
      { labelFr: "Connecté", labelAr: "متصل", value: "Oui, Wi-Fi" },
    ],
    rating: 4.2,
    reviewCount: 33,
  },
  {
    sku: "ELE-BOS-KGN39X",
    slug: "bosch-kgn39xw326-refrigerateur-330l",
    nameFr: "Bosch KGN39XW326 Réfrigérateur 2 portes 330 L",
    nameAr: "بوش KGN39XW326 ثلاجة ببابين 330 لتر",
    brand: "bosch",
    category: "electromenager",
    price: 7999,
    promoPrice: 6499,
    stock: 9,
    image: img(
      "Whirlpool_Stainless_Steel_Refrigerator_-_Kitchen_Appliances_(53075130097).jpg",
    ),
    descriptionFr:
      "Froid réparti No Frost, 330 litres utiles et une consommation de 245 kWh par an. Un fonctionnement silencieux, pensé pour un salon.",
    descriptionAr: "توزيع تبريد No Frost، 330 لتراً مفيدة واستهلاك 245 ك.و.س سنوياً، تشغيل هادئ.",
    specs: [
      { labelFr: "Volume total", labelAr: "الحجم الإجمالي", value: "330 L" },
      { labelFr: "Technologie", labelAr: "التقنية", value: "No Frost, 2 portes" },
      { labelFr: "Consommation", labelAr: "الاستهلاك", value: "245 kWh/an" },
      { labelFr: "Classe", labelAr: "الفئة", value: "A+" },
    ],
    rating: 4.4,
    reviewCount: 28,
  },
  {
    sku: "ELE-MOU-MICRO32",
    slug: "moulinex-micro-32-four-micro-ondes",
    nameFr: "Moulinex Micro-32 Four micro-ondes 20 L",
    nameAr: "موليكس ميكرو-32 فرن ميكروويف 20 لتر",
    brand: "moulinex",
    category: "electromenager",
    price: 899,
    promoPrice: 649,
    stock: 40,
    image: img("TOSHIBA_Microwave_Oven_ER-J3_.jpg"),
    descriptionFr:
      "Cinq niveaux de puissance, décongélation rapide et plateauPivotant. Le micro-ondes du quotidien, sans complication.",
    descriptionAr: "خمسة مستويات للطاقة، إذابة سريعة وطبق دوّار.",
    specs: [
      { labelFr: "Volume", labelAr: "الحجم", value: "20 L" },
      { labelFr: "Puissance", labelAr: "القدرة", value: "800 W" },
      { labelFr: "Niveaux", labelAr: "المستويات", value: "5 niveaux" },
      { labelFr: "Plateau", labelAr: "الطبق", value: "Pivoteur, 25,5 cm" },
    ],
    rating: 4,
    reviewCount: 66,
  },

  // ── Console & Gaming ────────────────────────────────────────────────────
  {
    sku: "GAM-SON-PS5SLIM",
    slug: "sony-playstation-5-slim-1to",
    nameFr: "Sony PlayStation 5 Slim 1 To",
    nameAr: "سوني بلايستيشن 5 سليم 1 تيرابايت",
    brand: "sony",
    category: "gaming",
    price: 6499,
    promoPrice: 5499,
    stock: 15,
    image: img("PS5DigitalEdition.png"),
    descriptionFr:
      "Le format slim de la PS5, deux fois moins profond. 1 To de stockage, retour neuronal et sortie 4K à 120 images/seconde.",
    descriptionAr: "نسخة بلايستيشن 5 الرفيعة، أخف بعمق، تخزين 1 تيرابايت وإخراج 4K بتردد 120 إطاراً.",
    specs: [
      { labelFr: "Stockage", labelAr: "التخزين", value: "1 To SSD" },
      { labelFr: "Sortie vidéo", labelAr: "إخراج الفيديو", value: "4K 120 Hz, HDR" },
      { labelFr: "Type", labelAr: "النوع", value: "Console complète" },
      { labelFr: "Poids", labelAr: "الوزن", value: "2,6 kg" },
    ],
    rating: 4.7,
    reviewCount: 84,
  },
  {
    sku: "GAM-SON-DUALSENSE",
    slug: "sony-dualsense-manette-sans-fil",
    nameFr: "Sony DualSense Manette sans fil",
    nameAr: "سوني دوالسينس يد تحكم لاسلكية",
    brand: "sony",
    category: "gaming",
    price: 749,
    promoPrice: 599,
    stock: 38,
    image: img("PlayStation_5_and_DualSense_with_transparent_background.png"),
    descriptionFr:
      "Retour haptique précis, microphone intégré et grips=texturés. Compatible PC via le câble USB fourni.",
    descriptionAr: "تغذية راجعة لمسية دقيقة، ميكروفون مدمج ومقبض محفور، ومتوافقة مع الحاسوب عبر USB.",
    specs: [
      { labelFr: "Connexion", labelAr: "الاتصال", value: "Bluetooth + USB" },
      { labelFr: "Autonomie", labelAr: "الاستقلال", value: "20 heures" },
      { labelFr: "Compatibilité", labelAr: "التوافق", value: "PS5, PC" },
    ],
    rating: 4.6,
    reviewCount: 112,
  },
  {
    sku: "GAM-MIC-XBOX",
    slug: "microsoft-manette-xbox-sans-fil",
    nameFr: "Microsoft Manette Xbox sans fil",
    nameAr: "مايكروسوفت يد تحكم إكس بوكس لاسلكية",
    brand: "microsoft",
    category: "gaming",
    price: 699,
    stock: 22,
    image: img("Xbox-360-Controller-Black.jpg"),
    descriptionFr:
      "Gâches à impulsion et connectique 3,5 mm : elle fonctionne aussi sur PC et sur smartphone, piles AA fournies.",
    descriptionAr: "أزرار استجابة سريعة ومنفذ 3.5 ملم، تعمل أيضاً على الحاسوب والهاتف مع بطاريات مرفقة.",
    specs: [
      { labelFr: "Connexion", labelAr: "الاتصال", value: "Bluetooth 5.0" },
      { labelFr: "Sortie casque", labelAr: "مخرج السماعة", value: "3,5 mm" },
      { labelFr: "Alimentation", labelAr: "الطاقة", value: "2 piles AA" },
    ],
    rating: 4,
    reviewCount: 47,
  },
  {
    sku: "GAM-NIN-PROCON",
    slug: "nintendo-manette-pro-switch",
    nameFr: "Nintendo Manette Pro pour Switch",
    nameAr: "نيتندو يد تحكم احترافية للسويتش",
    brand: "nintendo",
    category: "gaming",
    price: 699,
    promoPrice: 549,
    stock: 20,
    image: img("Nintendo-Switch-Pro-Controller-FL.jpg"),
    descriptionFr:
      "Deux sticks analogiques, vibration HD et mode ami. Rechargeable par USB-C.",
    descriptionAr: "عصا تحكم تناظريتان، اهتزاز HD ووضع أصدقاء، قابلة للشحن عبر USB-C.",
    specs: [
      { labelFr: "Compatibilité", labelAr: "التوافق", value: "Nintendo Switch" },
      { labelFr: "Stick", labelAr: "العصا", value: "2 analogiques" },
      { labelFr: "Charge", labelAr: "الشحن", value: "USB-C" },
    ],
    rating: 4.3,
    reviewCount: 36,
  },

  // ── Photo ───────────────────────────────────────────────────────────────
  {
    sku: "PHO-SON-W210",
    slug: "sony-cybershot-dsc-w210",
    nameFr: "Sony Cyber-shot DSC-W210 8 Mpx",
    nameAr: "سوني Cyber-shot DSC-W210 8 ميغابكسل",
    brand: "sony",
    category: "photo",
    price: 1299,
    promoPrice: 899,
    stock: 16,
    image: img("Sony_Cybershot_DSC_W210.jpg"),
    descriptionFr:
      "Compact de poche stabilisé, 5 zooms optiques et mode Sweep Panorama. Carte mémoire 32 Go offerte.",
    descriptionAr: "كاميرا جيبية بمثبت صورة، تقريب بصري 5x ووضع بانوراما، مع بطاقة ذاكرة 32 غيغابايت.",
    specs: [
      { labelFr: "Définition", labelAr: "الدقة", value: "8 Mpx" },
      { labelFr: "Zoom optique", labelAr: "التقريب البصري", value: "5x" },
      { labelFr: "Vidéo", labelAr: "الفيديو", value: "720p" },
      { labelFr: "Stabilisation", labelAr: "تثبيت الصورة", value: "Optique" },
    ],
    rating: 3.8,
    reviewCount: 19,
  },
  {
    sku: "PHO-CAN-A2600",
    slug: "canon-powershot-a2600",
    nameFr: "Canon PowerShot A2600",
    nameAr: "كانون باورشوت A2600",
    brand: "canon",
    category: "photo",
    price: 1799,
    promoPrice: 1399,
    stock: 13,
    image: img("GE_A1250_Digital_Camera_(1).jpg"),
    descriptionFr:
      "Vingt mégapixels, zoom 8x et écran LCD inclinable : le choix facile à tenir en main pour un débutant.",
    descriptionAr: "عشرون ميغابكسل، تقريب 8x وشاشة LCD قابلة للميل، سهلة الاستعمال للمبتدئ.",
    specs: [
      { labelFr: "Définition", labelAr: "الدقة", value: "20 Mpx" },
      { labelFr: "Zoom optique", labelAr: "التقريب البصري", value: "8x" },
      { labelFr: "Écran", labelAr: "الشاشة", value: "2,7 pouces inclinable" },
      { labelFr: "Vidéo", labelAr: "الفيديو", value: "1080p" },
    ],
    rating: 4,
    reviewCount: 24,
  },
  {
    sku: "PHO-CAN-EOS2000D",
    slug: "canon-eos-2000d-reflex",
    nameFr: "Canon EOS 2000D Reflex",
    nameAr: "كانون EOS 2000D كاميرا مرآة",
    brand: "canon",
    category: "photo",
    price: 5299,
    promoPrice: 4499,
    stock: 8,
    image: img("GE_Digital_Camera_X5.jpg"),
    descriptionFr:
      "Le reflex d'entrée pour apprendre : 24,2 Mpx, vidéo 4K et écran à orientation variable. Objectif 18-45 mm inclus.",
    descriptionAr: "كاميرا مرآة للمبتدئين: 24.2 ميغابكسل، فيديو 4K وشاشة متحركة، بعدسة 18-45 ملم مرفقة.",
    specs: [
      { labelFr: "Capteur", labelAr: "المستشعر", value: "APS-C 24,2 Mpx" },
      { labelFr: "Vidéo", labelAr: "الفيديو", value: "4K 24 ips" },
      { labelFr: "Objectif", labelAr: "العدسة", value: "18-45 mm inclus" },
      { labelFr: "Écran", labelAr: "الشاشة", value: "3 pouces orientable" },
    ],
    rating: 4.5,
    reviewCount: 31,
  },
  {
    sku: "PHO-SAM-WB350F",
    slug: "samsung-wb350f-12mpx",
    nameFr: "Samsung WB350F 12 Mpx Wi-Fi",
    nameAr: "سامسونج WB350F 12 ميغابكسل واي فاي",
    brand: "samsung",
    category: "photo",
    price: 1499,
    stock: 11,
    image: img("12_MP_digital_camera_-_red.jpg"),
    descriptionFr:
      "Partage instantané par Wi-Fi et NFC, 24 modes de scène. Une option correcte pour les photos de famille.",
    descriptionAr: "مشاركة فورية عبر Wi-Fi وNFC مع 24 وضعية مشهد.",
    specs: [
      { labelFr: "Définition", labelAr: "الدقة", value: "12 Mpx" },
      { labelFr: "Zoom optique", labelAr: "التقريب البصري", value: "4x" },
      { labelFr: "Connectivité", labelAr: "الاتصال", value: "Wi-Fi, NFC" },
    ],
    rating: 3.7,
    reviewCount: 14,
  },

  // ── Accessoires & Maison ────────────────────────────────────────────────
  {
    sku: "ACC-SAM-WATCH4",
    slug: "samsung-galaxy-watch-4",
    nameFr: "Samsung Galaxy Watch 4",
    nameAr: "سامسونج جالكسي ووتش 4",
    brand: "samsung",
    category: "accessoires",
    price: 1299,
    promoPrice: 999,
    stock: 21,
    image: img("Samsung_Gear_S3.jpg"),
    descriptionFr:
      "Capteur ECG, suivi du sommeil et 36 h d'autonomie. Compatible Android, y compris les Unexpected Galaxy.",
    descriptionAr: "مستشعر تخطيط القلب، تتبع النوم و36 ساعة استقلال، متوافقة مع أجهزة أندرويد.",
    specs: [
      { labelFr: "Écran", labelAr: "الشاشة", value: "0,9 AMOLED" },
      { labelFr: "Autonomie", labelAr: "الاستقلال", value: "36 heures" },
      { labelFr: "Capteurs", labelAr: "المستشعرات", value: "ECG, SpO2, GPS" },
      { labelFr: "Étanchéité", labelAr: "مقاومة الماء", value: "5 ATM" },
    ],
    rating: 4.4,
    reviewCount: 63,
  },
  {
    sku: "ACC-XIA-MOUSE",
    slug: "xiaomi-souris-sans-fil",
    nameFr: "Xiaomi Souris sans fil",
    nameAr: "شاومي فأرة لاسلكية",
    brand: "xiaomi",
    category: "accessoires",
    price: 149,
    promoPrice: 99,
    stock: 55,
    image: img("A_wireless_computer_mouse.jpg"),
    descriptionFr:
      "802.11 2,4 GHz, 1600 dpi et une pile AAA qui tient des mois. Aucun récepteur à perdre : le dongle est dans la souris.",
    descriptionAr: "اتصال 2.4 غيغاهرتز، 1600 نقطة لكل بوصة، والبطارية تدوم أشهراً.",
    specs: [
      { labelFr: "Résolution", labelAr: "الدقة", value: "1600 dpi" },
      { labelFr: "Connexion", labelAr: "الاتصال", value: "2,4 GHz, récepteur USB" },
      { labelFr: "Alimentation", labelAr: "الطاقة", value: "1 pile AAA" },
    ],
    rating: 4.1,
    reviewCount: 89,
  },
  {
    sku: "ACC-PHI-AIR3000",
    slug: "philips-friteuse-air-serie-3000",
    nameFr: "Philips Friteuse à air Série 3000 6,2 L",
    nameAr: "فيليبس قلاية هوائية سلسلة 3000 بسعة 6.2 لتر",
    brand: "philips",
    category: "accessoires",
    price: 1499,
    promoPrice: 1149,
    stock: 18,
    image: img("Ninja_Foodi_MAX_Health_Grill_%26_Air_Fryer_AG551EU.jpg"),
    descriptionFr:
      "Frites, nuggets et poisson sans huile : la technologie Rapid Air fait circuler l'air à 360°. Panneau de 8 préréglages.",
    descriptionAr: "بطاطس و Nuggets وسمك بدون زيت، بتقنية Rapid Air التي تدور الهواء 360 درجة.",
    specs: [
      { labelFr: "Contenance", labelAr: "السعة", value: "6,2 L" },
      { labelFr: "Puissance", labelAr: "القدرة", value: "1 400 W" },
      { labelFr: "Programmes", labelAr: "البرامج", value: "8 préréglages" },
      { labelFr: "Lave-vaisselle", labelAr: "غسالة الأواني", value: "Panier amovible" },
    ],
    rating: 4.5,
    reviewCount: 51,
  },
  {
    sku: "ACC-SIE-VS08P",
    slug: "siemens-aspirateur-sans-sac",
    nameFr: "Siemens Aspirateur sans sac VS08P",
    nameAr: "سيمنز مكنسة كهربائية بدون كيس",
    brand: "siemens",
    category: "accessoires",
    price: 1899,
    promoPrice: 1399,
    stock: 12,
    image: img("Siemens_vacuum_cleaner_Super_500.jpg"),
    descriptionFr:
      "Sans sac à racheter, 6 000 Pa d'aspiration et un set complet : sols durs, tapis et une brosse pour les canapés.",
    descriptionAr: "بدون أكياس، بقوة شفط 6000 باسكال ومجموعة كاملة للمفروشات والأرضيات.",
    specs: [
      { labelFr: "Puissance", labelAr: "القدرة", value: "6 000 Pa" },
      { labelFr: "Capacité", labelAr: "السعة", value: "0,9 L" },
      { labelFr: "Brosse", labelAr: "الفرشاة", value: "Set Complete 3 pièces" },
      { labelFr: "Filtre", labelAr: "الفلتر", value: "HEPA" },
    ],
    rating: 4.3,
    reviewCount: 27,
  },
];

const banners = [
  {
    titleFr: "L'été en grand écran",
    titleAr: "الصيف على شاشة كبيرة",
    subtitleFr: "Jusqu'à -40% sur une sélection de TV 4K",
    subtitleAr: "حتى -40% على تشكيلة مختارة من أجهزة التلفاز 4K",
    imageUrl: img("TCL_4K_tv_(24478123585).jpg"),
    ctaLabelFr: "Voir les télévisions",
    ctaLabelAr: "شاهد أجهزة التلفاز",
    ctaHref: "/c/tv-video",
    order: 1,
  },
  {
    titleFr: "Rentrée connectée",
    titleAr: "انطلاقة متصلة",
    subtitleFr: "Smartphones et ordinateurs pour la rentrée, à prix réduit",
    subtitleAr: "هواتف وحاسيب محمول الدخول المدرسي بأسعار مخفضة",
    imageUrl: img("Samsung_Galaxy_Book.jpg"),
    ctaLabelFr: "Voir la sélection",
    ctaLabelAr: "شاهد التشكيلة",
    ctaHref: "/c/ordinateurs",
    order: 2,
  },
  {
    titleFr: "Froid & lavage",
    titleAr: "التبريد والغسيل",
    subtitleFr: "Réfrigérateurs et lave-linges, installation offerte en magasin",
    subtitleAr: "ثلاجات وغسالات مع تركيب مجاني داخل المتجر",
    imageUrl: img("Whirlpool_Stainless_Steel_Refrigerator_-_Kitchen_Appliances_(53075130097).jpg"),
    ctaLabelFr: "Voir l'électroménager",
    ctaLabelAr: "شاهد الأجهزة المنزلية",
    ctaHref: "/c/electromenager",
    order: 3,
  },
];

async function main() {
  console.log("Clearing existing data...");
  await prisma.product.deleteMany();
  await prisma.category.deleteMany();
  await prisma.brand.deleteMany();
  await prisma.banner.deleteMany();

  console.log(`Creating ${categories.length} categories...`);
  await prisma.category.createMany({ data: categories });

  console.log(`Creating ${brands.length} brands...`);
  await prisma.brand.createMany({ data: brands });

  console.log(`Creating ${products.length} products...`);
  for (const p of products) {
    if (!brands.some((b) => b.slug === p.brand)) {
      throw new Error(`Unknown brand "${p.brand}" on ${p.sku}`);
    }
    if (!categories.some((c) => c.slug === p.category)) {
      throw new Error(`Unknown category "${p.category}" on ${p.sku}`);
    }
    await prisma.product.create({
      data: {
        sku: p.sku,
        slug: p.slug,
        nameFr: p.nameFr,
        nameAr: p.nameAr,
        brand: { connect: { slug: p.brand } },
        category: { connect: { slug: p.category } },
        price: p.price,
        promoPrice: p.promoPrice ?? null,
        stock: p.stock,
        imageUrl: p.image,
        descriptionFr: p.descriptionFr,
        descriptionAr: p.descriptionAr,
        specsJson: JSON.stringify(p.specs),
        rating: p.rating,
        reviewCount: p.reviewCount,
        isActive: true,
      },
    });
  }

  console.log(`Creating ${banners.length} banners...`);
  await prisma.banner.createMany({ data: banners });

  const [c, b, p, ba] = await Promise.all([
    prisma.category.count(),
    prisma.brand.count(),
    prisma.product.count(),
    prisma.banner.count(),
  ]);
  console.log(`Done. ${c} categories, ${b} brands, ${p} products, ${ba} banners.`);
}

main()
  .catch((e) => {
    console.error(e);
    process.exitCode = 1;
  })
  .finally(async () => {
    await prisma.$disconnect();
  });
