import { PrismaClient } from '@prisma/client';
const prisma = new PrismaClient();

const updates = {
  'Burrata & Heirloom Tomato': 450,
  'Pan-Seared Foie Gras': 890,
  'Truffle Mushroom Arancini': 320,
  'Spicy Wagyu Carpaccio': 550,
  'Pan-Seared Hokkaido Scallops': 590,
  'A5 Wagyu Beef Tenderloin': 1850,
  'Maine Lobster Ravioli': 850,
  'Spicy Blue Crab Tagliolini': 590,
  'Mediterranean Pan-Seared Seabass': 650,
  'Pan-Seared Duck Breast': 580,
  'Pizza Margherita D.O.C.': 350,
  'Pizza Black Truffle & Porcini': 550,
  'Pizza Diavola & Spicy Nduja': 420,
  'Pizza Prosciutto di Parma & Burrata': 490,
  'Pizza 4 Formaggi & Organic Honey': 420,
  'Pizza Spicy Seafood Marinara': 550,
  'Signature Deconstructed Tiramisu': 280,
  'Deconstructed Lemon Meringue Tart': 250,
  'Warm Belgian Chocolate Lava Cake': 290,
  'Ruby Signature Cocktail': 320,
  'Smoked Rosemary Old Fashioned': 350,
  'Alta Vigna - Cannonau di Sardegna': 1800,
  'Vento Rosso - Sardinian Rosé': 1450,
  'Luce Di Terra - Isola dei Nuraghi': 2200,
  "Étoile d'Or - Vintage Champagne Brut": 3500
};

async function main() {
  for (const [name, price] of Object.entries(updates)) {
    await prisma.menuItem.updateMany({
      where: { name },
      data: { price }
    });
  }
  console.log("Prices updated successfully.");
}

main().finally(() => prisma.$disconnect());
