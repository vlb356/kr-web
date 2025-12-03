// src/features/explore/venuesData.js

import basketballKaunas from "@/assets/venues/basketball-kaunas.png";
import footballVilnius from "@/assets/venues/football-vilnius.png";
import gymKaunas from "@/assets/venues/gym-kaunas.png";
import paddelVinius from "@/assets/venues/paddel-vinius.png"; // nombre del archivo tal cual
import swimmingKaunas from "@/assets/venues/swimming-kaunas.png";
import yogaVilnius from "@/assets/venues/yoga-vilnius.png";

export const venuesData = [
    {
        id: "1",
        name: "Impulsas Gym Kaunas",
        city: "Kaunas",
        type: "Gym",
        address: "Savanorių pr. 110",
        image: gymKaunas,
        description:
            "Modern gym with functional training zones, cardio equipment, free weights and sauna.",
        features: ["Cardio", "Weights", "Sauna", "Functional"],
        rating: 4.7,
    },
    {
        id: "2",
        name: "Padel Arena Vilnius",
        city: "Vilnius",
        type: "Padel",
        address: "Ozo g. 18",
        image: paddelVinius,
        description:
            "Indoor and outdoor padel courts with premium lighting and racket rental.",
        features: ["Indoor Courts", "Rentals", "Lighting"],
        rating: 4.8,
    },
    {
        id: "3",
        name: "Kaunas Swimming Center",
        city: "Kaunas",
        type: "Swimming",
        address: "Karaliaus Mindaugo pr. 45",
        image: swimmingKaunas,
        description:
            "Olympic-size pool perfect for training, recreational swimming and group classes.",
        features: ["Olympic Pool", "Lockers", "Showers"],
        rating: 4.6,
    },
    {
        id: "4",
        name: "Vilnius Football Dome",
        city: "Vilnius",
        type: "Football",
        address: "Ukmergės g. 240",
        image: footballVilnius,
        description:
            "Indoor football dome with artificial turf available for matches and training.",
        features: ["Indoor Field", "Artificial Turf", "Lighting"],
        rating: 4.5,
    },
    {
        id: "5",
        name: "Kaunas Basketball Center",
        city: "Kaunas",
        type: "Basketball",
        address: "Taikos pr. 141",
        image: basketballKaunas,
        description:
            "Professional basketball courts suitable for team practice, tournaments and casual games.",
        features: ["Full Court", "Wood Floor", "Training Hoops"],
        rating: 4.9,
    },
    {
        id: "6",
        name: "Vilnius Yoga Loft",
        city: "Vilnius",
        type: "Yoga",
        address: "A. Goštauto g. 8",
        image: yogaVilnius,
        description:
            "Peaceful yoga studio offering space for stretching, meditation and group sessions.",
        features: ["Yoga Mats", "Ambient Light", "Calm Atmosphere"],
        rating: 4.7,
    },
];
