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

export const chefs = [
  {
    name: "Chef Anne",
    homeDeliveryEnabled: true, // Temporary demo availability.
    dish: "Slow-Cooked Goan Pork Vindaloo",
    image: "/dishes/pork-vindaloo.jpg",
    chefImage: "/chefs/chef-anne.jpg",
    price: 450,
    tone: "watermelon" as const,
    line:
      "A dish tied to home, memory and the way food gets passed from one person to another.",
    ingredients: "Ingredient list coming soon",
    dietary: "Non-Vegetarian Dish",
    allergens: "Allergen details soon",
    portions: "20 portions only being cooked",
    // DEMO ONLY: replace with the verified pickup pin before launch.
    pickupCoordinates: { latitude: 15.256, longitude: 73.926 } as Coordinates | null,
    pickupLocation: "Anne’s Heritage Kitchen",
    pickupAddress: "House No. 142/A, Mazilvaddo, Near St. John the Baptist Church, Benaulim, South Goa 403716",
    pickupMapsUrl: "https://www.google.com/maps/search/?api=1&query=Mazilvaddo+Benaulim+Goa",
    pickupDay: "Saturday",
    pickupDate: "26 Sep",
    closeDay: "Friday",
    closeTime: "8 PM",
  },
  {
    name: "Chef Vasant",
    homeDeliveryEnabled: false, // Temporary demo availability.
    dish: "Prawn Balchão Risotto",
    image: "/dishes/prawn-risotto.jpg",
    chefImage: "/chefs/chef-vasant.jpg",
    price: 550,
    tone: "kiwi" as const,
    line:
      "One plate, one point of view — the kind of thing a chef makes because they really want you to taste it.",
    ingredients: "Ingredient list coming soon",
    dietary: "Non-Vegetarian Dish",
    allergens: "Allergen details soon",
    portions: "20 portions only being cooked",
    // DEMO ONLY: replace with the verified pickup pin before launch.
    pickupCoordinates: { latitude: 15.279, longitude: 73.932 } as Coordinates | null,
    pickupLocation: "Vasant’s Kitchen Studio",
    pickupAddress: "Villa 8, Colva Beach Road, Behind Old Colva Post Office, Colva, South Goa 403708",
    pickupMapsUrl: "https://www.google.com/maps/search/?api=1&query=Colva+Beach+Road+Colva+Goa",
    pickupDay: "Sunday",
    pickupDate: "27 Sep",
    closeDay: "Saturday",
    closeTime: "8 PM",
  },
  {
    name: "Chef Vivek",
    homeDeliveryEnabled: true, // Temporary demo availability.
    dish: "Kokum-Glazed BBQ Ribs",
    image: "/dishes/bbq-ribs.jpg",
    chefImage: "/chefs/chef-vivek.jpg",
    price: 480,
    tone: "olive" as const,
    line:
      "A small story told through technique, place and the flavours the chef keeps coming back to.",
    ingredients: "Ingredient list coming soon",
    dietary: "Vegan Dish",
    allergens: "Allergen details soon",
    portions: "10 portions only being cooked",
    // DEMO ONLY: replace with the verified pickup pin before launch.
    pickupCoordinates: { latitude: 15.299, longitude: 73.967 } as Coordinates | null,
    pickupLocation: "Vivek’s Smokehouse",
    pickupAddress: "Plot 24, Stadium Cross Road, Near Jawaharlal Nehru Stadium, Fatorda, Margao, South Goa 403602",
    pickupMapsUrl: "https://www.google.com/maps/search/?api=1&query=Fatorda+Margao+Goa",
    pickupDay: "Friday",
    pickupDate: "25 Sep",
    closeDay: "Thursday",
    closeTime: "8 PM",
  },
  {
    name: "Chef Ram",
    homeDeliveryEnabled: false, // Temporary demo availability.
    dish: "Bebinca Crème Brûlée",
    image: "/dishes/bebinca-creme-brulee.jpg",
    chefImage: "/chefs/chef-ram.jpg",
    price: 350,
    tone: "lemon" as const,
    line:
      "Something personal enough to cook in a small batch, and special enough to share with the neighbourhood.",
    ingredients: "Ingredient list coming soon",
    dietary: "Vegetarian Dish",
    allergens: "Allergen details soon",
    portions: "25 portions only being cooked",
    // DEMO ONLY: replace with the verified pickup pin before launch.
    pickupCoordinates: { latitude: 15.274, longitude: 73.957 } as Coordinates | null,
    pickupLocation: "Ram’s Pastry Lab",
    pickupAddress: "Shop 4, Rua de Comba, Near Holy Spirit Institute, Comba, Margao, South Goa 403601",
    pickupMapsUrl: "https://www.google.com/maps/search/?api=1&query=Comba+Margao+Goa",
    pickupDay: "Sunday",
    pickupDate: "27 Sep",
    closeDay: "Saturday",
    closeTime: "8 PM",
  },
];
