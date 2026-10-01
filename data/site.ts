import type { Coordinates } from "@/lib/delivery";

export type DropStatus = "between" | "live";

export const siteConfig = {
  deliveryLocationsAreDemo: true,
  dropStatus: "between" as DropStatus,
  whatsappNumber: process.env.NEXT_PUBLIC_WHATSAPP_NUMBER || "919270730491",
  whatsappMessage:
    "Hey! 👋 I’d love a heads-up when the next Local Food Drop opens.",
  chefWhatsappMessage:
    "Hey! 👋 I’m a chef and I’d love to cook something for a Local Food Drop. Can we chat?",
  homeCookWhatsappMessage:
    "Hey! 👋 I’m a home cook and I’d love to cook something for The Local Food Drop. Can we chat?",
  collaboratorWhatsappMessage:
    "Hey! 👋 I’d love to team up with the Local Food Drop. I work in design / photo / video / delivery / something else local — can we chat?",
  hostWhatsappMessage:
    "Hey! 👋 I’d love to bring the Local Food Drop to my city or neighbourhood. Can we chat about launching a drop?",
  liveOrderHref: "/thelocalfooddrop/order",
  localities: [
    { name: "Panjim", active: false },
    { name: "Mapusa", active: false },
    { name: "Candolim", active: false },
    { name: "Calangute", active: false },
    { name: "Porvorim", active: false },
    { name: "Benaulim", active: true, pincode: "403716" },
    { name: "Varca", active: true, pincode: "403721" },
    { name: "Colva", active: true, pincode: "403708" },
    { name: "Aquem", active: true, pincode: "403601" },
    { name: "Gogol", active: true, pincode: "403601" },
    { name: "Housing Board", active: true, pincode: "403601" },
    { name: "Davorlim", active: true, pincode: "403729" },
    { name: "Betalbatim", active: true, pincode: "403713" },
    { name: "Margao", active: true, pincode: "403601" },
    { name: "Comba", active: true, pincode: "403601" },
    { name: "Fatorda", active: true, pincode: "403602" },
    { name: "Navelim", active: false },
    { name: "Cuncolim", active: false },
    { name: "Loutolim", active: false },
    { name: "Curtorim", active: false },
    { name: "Majorda", active: false },
    { name: "Chandor", active: false },
    { name: "Raia", active: false },
    { name: "Cansaulim", active: false },
    { name: "Vasco", active: false },
    { name: "Ponda", active: false },
    { name: "Sernabatim", active: false },
  ],
};

export type SpiceLevel = "Not spicy" | "Mildly spicy" | "Very spicy";

// Ingredient lists, allergens and heat assignments below are temporary preview content; confirm with each chef before launch.
export const chefs = [
  {
    name: "Cherry",
    homeDeliveryEnabled: true, // Temporary demo availability.
    dish: "Chili Con Carne",
    image: "/dishes/cherry-chili-con-carne-toppings.png",
    chefImage: "/chefs/chef-cherry.jpg",
    price: 480,
    tone: "olive" as const,
    specialty: "Artisanal smokehouse barbecue and wood-fired coastal grills",
    whatILoveToCook:
      "Slow simmering rich hearty stews and smoked meats layered with deep aromatic spices.",
    whatKeepsMeCurious:
      "Regional firewoods, fermenting wild chillies, and the rich tradition of community backyard smoking.",
    tonightDishQuote:
      "A hearty bowl of comfort layered with deep, smoky warmth and time-tested spices.",
    line:
      "A hearty bowl of comfort layered with deep, smoky warmth and time-tested spices.",
    ingredients:
      "A slow cooked Tex Mex classic with tender minced meat and beans simmered in a rich sauce of tomatoes, smoky chilies and warm spices",
    ingredientsArePlaceholder: false,
    spice: "Mildly spicy" as SpiceLevel,
    dietary: "Non-Veg",
    allergens: "None",
    allergensArePlaceholder: false,
    portions: "10 portions only",
    // DEMO ONLY: replace with the verified pickup pin before launch.
    pickupCoordinates: { latitude: 15.299, longitude: 73.967 } as Coordinates | null,
    pickupLocation: "Cherry’s Smokehouse",
    pickupAddress: "Plot 24, Stadium Cross Road, Near Jawaharlal Nehru Stadium, Fatorda, Margao, South Goa 403602",
    pickupMapsUrl: "https://www.google.com/maps/search/?api=1&query=Fatorda+Margao+Goa",
    pickupDay: "Friday",
    pickupDate: "25 Sep",
    preorderDate: "24 Sep",
    closeDay: "Thursday",
    closeTime: "8 PM",
  },
  {
    name: "Anne",
    homeDeliveryEnabled: true, // Temporary demo availability.
    dish: "Char Siu Pork Siopao",
    image: "/dishes/anne-siopao-seated.png",
    chefImage: "/chefs/chef-anne.jpg",
    price: 350,
    tone: "watermelon" as const,
    specialty: "Seasonal cooking and comforting neighborhood favorites",
    whatILoveToCook:
      "Slow-cooked, seasonal food made for sharing around a busy neighborhood table.",
    whatKeepsMeCurious:
      "Local markets, long walks, and the everyday stories behind familiar ingredients.",
    tonightDishQuote:
      "This comforting dish brings together familiar flavors and a little something unexpected.",
    line:
      "A dish tied to home, memory and the way food gets passed from one person to another.",
    ingredients:
      "A Filipino street food classic with pillow soft steamed buns filled with tender, sweet and savory braised char siu pork",
    ingredientsArePlaceholder: false,
    spice: "Not spicy" as SpiceLevel,
    dietary: "Non-Veg",
    allergens: "Wheat, soy & oyster sauce",
    allergensArePlaceholder: false,
    portions: "30 portions only",
    // DEMO ONLY: replace with the verified pickup pin before launch.
    pickupCoordinates: { latitude: 15.256, longitude: 73.926 } as Coordinates | null,
    pickupLocation: "Anne’s Heritage Kitchen",
    pickupAddress: "House No. 142/A, Mazilvaddo, Near St. John the Baptist Church, Benaulim, South Goa 403716",
    pickupMapsUrl: "https://www.google.com/maps/search/?api=1&query=Mazilvaddo+Benaulim+Goa",
    pickupDay: "Friday",
    pickupDate: "9 Oct · 6:30–8 PM",
    preorderDate: "8 Oct",
    closeDay: "Thursday",
    closeTime: "8 PM",
  },
  {
    name: "Ranjita",
    homeDeliveryEnabled: false, // Temporary demo availability.
    dish: "Slow Cooked Goan Mangane",
    image: "/dishes/ranjita-mangane-seated.png",
    chefImage: "/chefs/chef-ranjita.jpg",
    price: 350,
    tone: "kiwi" as const,
    specialty: "Traditional Goan festive sweets and heritage recipes",
    whatILoveToCook:
      "Time-honored Goan sweets cooked slowly with fresh coconut milk and local jaggery.",
    whatKeepsMeCurious:
      "Heirloom recipes passed down through generations, festive traditions, and forgotten local flavors.",
    tonightDishQuote:
      "A comforting Goan celebration in a bowl, balancing nutty chana dal, soft sago and rich coconut jaggery.",
    line:
      "A comforting Goan celebration in a bowl, balancing nutty chana dal, soft sago and rich coconut jaggery.",
    ingredients:
      "A cornerstone of Goan Gaud Saraswat Brahmin (GSB) festive feasts—nutty chana dal and soft sago gently simmered in rich coconut milk, infused with fragrant cardamom and deep Goan palm jaggery",
    ingredientsArePlaceholder: false,
    spice: "Not spicy" as SpiceLevel,
    dietary: "Veg",
    allergens: "Cashews (tree nuts)",
    allergensArePlaceholder: false,
    portions: "20 portions only",
    // DEMO ONLY: replace with the verified pickup pin before launch.
    pickupCoordinates: { latitude: 15.279, longitude: 73.932 } as Coordinates | null,
    pickupLocation: "Ranjita’s Kitchen Studio",
    pickupAddress: "Villa 8, Colva Beach Road, Behind Old Colva Post Office, Colva, South Goa 403708",
    pickupMapsUrl: "https://www.google.com/maps/search/?api=1&query=Colva+Beach+Road+Colva+Goa",
    pickupDay: "Thursday",
    pickupDate: "15 Oct · 6:30–8 PM",
    preorderDate: "14 Oct",
    closeDay: "Wednesday",
    closeTime: "8 PM",
  },
  {
    name: "Ram",
    homeDeliveryEnabled: false, // Temporary demo availability.
    dish: "Bebinca Crème\nBrûlée",
    image: "/dishes/bebinca-creme-brulee.jpg",
    chefImage: "/chefs/chef-ram.jpg",
    price: 350,
    tone: "lemon" as const,
    specialty: "Heritage confectionery and delicate Goan-French patisserie",
    whatILoveToCook:
      "Reinventing time-honored desserts through classical technique while preserving their nostalgic warmth.",
    whatKeepsMeCurious:
      "Artisanal jaggery varieties, heirloom spices, and old Portuguese bakeries tucked away in South Goa.",
    tonightDishQuote:
      "Something personal enough to cook in a small batch, and special enough to share with the neighbourhood.",
    line:
      "Something personal enough to cook in a small batch, and special enough to share with the neighbourhood.",
    ingredients: "Coconut milk, eggs, flour, sugar, cream & nutmeg",
    ingredientsArePlaceholder: true,
    spice: "Not spicy" as SpiceLevel,
    dietary: "Veg",
    allergens: "Eggs, milk, wheat",
    allergensArePlaceholder: true,
    portions: "25 portions only",
    // DEMO ONLY: replace with the verified pickup pin before launch.
    pickupCoordinates: { latitude: 15.274, longitude: 73.957 } as Coordinates | null,
    pickupLocation: "Ram’s Pastry Lab",
    pickupAddress: "Shop 4, Rua de Comba, Near Holy Spirit Institute, Comba, Margao, South Goa 403601",
    pickupMapsUrl: "https://www.google.com/maps/search/?api=1&query=Comba+Margao+Goa",
    pickupDay: "Sunday",
    pickupDate: "27 Sep",
    preorderDate: "26 Sep",
    closeDay: "Saturday",
    closeTime: "8 PM",
  },
];
