import { PrismaClient } from '@prisma/client';

const prisma = new PrismaClient();

const IMAGES = {
  // Starters
  caviar: 'https://images.unsplash.com/photo-1599813083652-3004bbbb5586?auto=format&fit=crop&w=800&q=80', // valid? maybe fallback to burrata if invalid. Let's just use known good.
  burrata: 'https://images.unsplash.com/photo-1540189549336-e6e99c3679fe?auto=format&fit=crop&w=800&q=80',
  beef_starter: 'https://images.unsplash.com/photo-1504674900247-0877df9cc836?auto=format&fit=crop&w=800&q=80',
  arancini: 'https://images.unsplash.com/photo-1574484284002-952d92456975?auto=format&fit=crop&w=800&q=80',
  fine_dining_app: 'https://images.unsplash.com/photo-1600891964092-4316c288032e?auto=format&fit=crop&w=800&q=80',
  
  // Mains
  beef: 'https://images.unsplash.com/photo-1546964124-0cce460f38ef?auto=format&fit=crop&w=800&q=80',
  seafood: 'https://images.unsplash.com/photo-1551183053-bf91a1d81141?auto=format&fit=crop&w=800&q=80',
  fish: 'https://images.unsplash.com/photo-1519708227418-c8fd9a32b7a2?auto=format&fit=crop&w=800&q=80',
  duck: 'https://images.unsplash.com/photo-1518492104633-130d0cc84637?auto=format&fit=crop&w=800&q=80',
  veg_main: 'https://images.unsplash.com/photo-1476124369491-e7addf5db371?auto=format&fit=crop&w=800&q=80',
  
  // Pizzas
  pizza_margherita: 'https://images.unsplash.com/photo-1604068549290-dea0e4a305ca?auto=format&fit=crop&w=800&q=80',
  pizza_truffle: 'https://images.unsplash.com/photo-1513104890138-7c749659a591?auto=format&fit=crop&w=800&q=80',
  pizza_spicy: 'https://images.unsplash.com/photo-1534308983496-4fabb1a015ee?auto=format&fit=crop&w=800&q=80',
  pizza_prosciutto: 'https://images.unsplash.com/photo-1574071318508-1cdbab80d002?auto=format&fit=crop&w=800&q=80',
  pizza_cheese: 'https://images.unsplash.com/photo-1593560708920-61dd98c46a4e?auto=format&fit=crop&w=800&q=80',
  
  // Desserts
  tiramisu: 'https://images.unsplash.com/photo-1571877227200-a0d98ea607e9?auto=format&fit=crop&w=800&q=80',
  lemon_tart: 'https://images.unsplash.com/photo-1519869325930-281384150729?auto=format&fit=crop&w=800&q=80',
  lava_cake: 'https://images.unsplash.com/photo-1606313564200-e75d5e30476c?auto=format&fit=crop&w=800&q=80',
  dessert_generic: 'https://images.unsplash.com/photo-1473347514197-f58c734007b8?auto=format&fit=crop&w=800&q=80',
  
  // Drinks/Wines
  cocktail_red: 'https://images.unsplash.com/photo-1536935338788-846bb9981813?auto=format&fit=crop&w=800&q=80',
  cocktail_dark: 'https://images.unsplash.com/photo-1514362545857-3bc16c4c7d1b?auto=format&fit=crop&w=800&q=80',
  cocktail_yellow: 'https://images.unsplash.com/photo-1551538827-9c037cb4f32a?auto=format&fit=crop&w=800&q=80',
  wine_bottle: 'https://images.unsplash.com/photo-1584916201218-f4242ceb4809?auto=format&fit=crop&w=800&q=80',
  wine_glass: 'https://images.unsplash.com/photo-1506377247377-2a5b3b417ebb?auto=format&fit=crop&w=800&q=80',
};

const itemsData = [
  // Starters (10)
  { name: 'Osetra Caviar Service', price: 4500, category: 'Starters', isVegetarian: false, isSpicy: false, image: IMAGES.fine_dining_app, description: 'Premium Russian Osetra caviar served with traditional accompaniments and blinis.' },
  { name: 'Wagyu Beef Tartare', price: 950, category: 'Starters', isVegetarian: false, isSpicy: false, image: IMAGES.beef_starter, description: 'Hand-cut A5 Wagyu, quail egg, truffle shavings, and toasted brioche.' },
  { name: 'Fresh Oysters Half Dozen', price: 1200, category: 'Starters', isVegetarian: false, isSpicy: false, image: IMAGES.seafood, description: 'Fine de Claire oysters served over ice with mignonette and lemon.' },
  { name: 'Burrata & Heirloom Tomato', price: 680, category: 'Starters', isVegetarian: true, isSpicy: false, image: IMAGES.burrata, description: 'Creamy Italian burrata, organic tomatoes, basil oil, and aged balsamic.' },
  { name: 'Pan-Seared Foie Gras', price: 1250, category: 'Starters', isVegetarian: false, isSpicy: false, image: IMAGES.beef_starter, description: 'Rougié foie gras, caramelized figs, and port wine reduction.' },
  { name: 'Truffle Mushroom Arancini', price: 550, category: 'Starters', isVegetarian: true, isSpicy: false, image: IMAGES.arancini, description: 'Crispy risotto balls stuffed with mozzarella and black truffle.' },
  { name: 'Spicy Wagyu Carpaccio', price: 780, category: 'Starters', isVegetarian: false, isSpicy: true, image: IMAGES.beef_starter, description: 'Thinly sliced Wagyu, spicy chili oil, parmesan shavings, and rocket.' },
  { name: 'Pan-Seared Hokkaido Scallops', price: 850, category: 'Starters', isVegetarian: false, isSpicy: false, image: IMAGES.seafood, description: 'Jumbo scallops, cauliflower purée, and crispy pancetta.' },
  { name: 'Lobster Bisque', price: 650, category: 'Starters', isVegetarian: false, isSpicy: false, image: IMAGES.seafood, description: 'Rich and creamy soup with fresh Maine lobster chunks and tarragon.' },
  { name: 'Smoked Salmon Blinis', price: 720, category: 'Starters', isVegetarian: false, isSpicy: false, image: IMAGES.fish, description: 'Norwegian smoked salmon, dill crème fraîche on warm blinis.' },

  // Mains (15)
  { name: 'A5 Wagyu Beef Tenderloin', price: 3500, category: 'Mains', isVegetarian: false, isSpicy: false, image: IMAGES.beef, description: '200g of the finest Japanese A5 Wagyu, served with truffle mash and red wine jus.' },
  { name: 'Maine Lobster Ravioli', price: 1450, category: 'Mains', isVegetarian: false, isSpicy: false, image: IMAGES.seafood, description: 'Handmade ravioli stuffed with lobster, served in a rich saffron cream sauce.' },
  { name: 'Spicy Blue Crab Tagliolini', price: 950, category: 'Mains', isVegetarian: false, isSpicy: true, image: IMAGES.seafood, description: 'Fresh tagliolini tossed with blue crab meat, garlic, chili, and white wine.' },
  { name: 'Mediterranean Pan-Seared Seabass', price: 980, category: 'Mains', isVegetarian: false, isSpicy: false, image: IMAGES.fish, description: 'Wild-caught seabass with Mediterranean salsa and asparagus.' },
  { name: 'Pan-Seared Duck Breast', price: 890, category: 'Mains', isVegetarian: false, isSpicy: false, image: IMAGES.duck, description: 'Crispy skin duck breast, orange-ginger glaze, and sweet potato purée.' },
  { name: 'Truffle Mushroom Risotto', price: 850, category: 'Mains', isVegetarian: true, isSpicy: false, image: IMAGES.veg_main, description: 'Arborio rice cooked in mushroom broth, finished with parmesan and fresh black truffle.' },
  { name: 'Australian Lamb Rack', price: 1850, category: 'Mains', isVegetarian: false, isSpicy: false, image: IMAGES.beef, description: 'Herb-crusted lamb rack, mint jus, and roasted root vegetables.' },
  { name: 'Tomahawk Steak (For 2)', price: 4200, category: 'Mains', isVegetarian: false, isSpicy: false, image: IMAGES.beef, description: '1.2kg Australian Wagyu Tomahawk, served with three sauces and grilled sides.' },
  { name: 'Black Cod Miso', price: 1400, category: 'Mains', isVegetarian: false, isSpicy: false, image: IMAGES.fish, description: 'Alaskan black cod marinated in sweet saikyo miso, broiled to perfection.' },
  { name: 'Squid Ink Spaghetti', price: 920, category: 'Mains', isVegetarian: false, isSpicy: true, image: IMAGES.seafood, description: 'Squid ink pasta, mixed seafood, garlic, and dried chili flakes.' },
  { name: 'Vegetable Ratatouille', price: 580, category: 'Mains', isVegetarian: true, isSpicy: false, image: IMAGES.veg_main, description: 'Classic French stewed vegetables in a rich tomato and herb sauce.' },
  { name: 'Grilled King Prawns', price: 1650, category: 'Mains', isVegetarian: false, isSpicy: true, image: IMAGES.seafood, description: 'Giant tiger prawns grilled with garlic butter and spicy seafood dip.' },
  { name: 'Beef Wellington', price: 2100, category: 'Mains', isVegetarian: false, isSpicy: false, image: IMAGES.beef, description: 'Classic beef tenderloin wrapped in mushroom duxelles and puff pastry.' },
  { name: 'Wild Boar Ragout Pappardelle', price: 890, category: 'Mains', isVegetarian: false, isSpicy: false, image: IMAGES.beef, description: 'Slow-cooked wild boar ragout over wide ribbon pasta.' },
  { name: 'Vegan Moussaka', price: 650, category: 'Mains', isVegetarian: true, isSpicy: false, image: IMAGES.veg_main, description: 'Layers of eggplant, potato, and lentil ragout, topped with vegan béchamel.' },

  // Artisan Pizza (7)
  { name: 'Pizza Margherita D.O.C.', price: 550, category: 'Artisan Pizza', isVegetarian: true, isSpicy: false, image: IMAGES.pizza_margherita, description: 'San Marzano tomatoes, fresh buffalo mozzarella, and basil.' },
  { name: 'Pizza Black Truffle & Porcini', price: 890, category: 'Artisan Pizza', isVegetarian: true, isSpicy: false, image: IMAGES.pizza_truffle, description: 'Porcini mushrooms, truffle paste, mozzarella, and truffle oil.' },
  { name: 'Pizza Diavola & Spicy Nduja', price: 690, category: 'Artisan Pizza', isVegetarian: false, isSpicy: true, image: IMAGES.pizza_spicy, description: 'Spicy Italian salami, nduja, mozzarella, and chili flakes.' },
  { name: 'Pizza Prosciutto di Parma & Burrata', price: 850, category: 'Artisan Pizza', isVegetarian: false, isSpicy: false, image: IMAGES.pizza_prosciutto, description: 'Parma ham, whole fresh burrata, cherry tomatoes, and rocket.' },
  { name: 'Pizza 4 Formaggi & Organic Honey', price: 680, category: 'Artisan Pizza', isVegetarian: true, isSpicy: false, image: IMAGES.pizza_cheese, description: 'Mozzarella, gorgonzola, parmesan, fontina, drizzled with organic honey.' },
  { name: 'Pizza Spicy Seafood Marinara', price: 890, category: 'Artisan Pizza', isVegetarian: false, isSpicy: true, image: IMAGES.pizza_spicy, description: 'Mixed seafood, garlic, chili, and San Marzano tomato sauce.' },
  { name: 'Pizza Carpaccio', price: 790, category: 'Artisan Pizza', isVegetarian: false, isSpicy: false, image: IMAGES.pizza_prosciutto, description: 'Beef carpaccio, parmesan, rocket leaves, and truffle oil on a crispy base.' },

  // Desserts (8)
  { name: 'Signature Deconstructed Tiramisu', price: 450, category: 'Desserts', isVegetarian: true, isSpicy: false, image: IMAGES.tiramisu, description: 'Mascarpone cream, espresso sponge, and cocoa dust served in a modern style.' },
  { name: 'Lemon Meringue Tart', price: 420, category: 'Desserts', isVegetarian: true, isSpicy: false, image: IMAGES.lemon_tart, description: 'Zesty lemon curd, sweet pastry crust, and toasted meringue.' },
  { name: 'Warm Belgian Chocolate Lava Cake', price: 480, category: 'Desserts', isVegetarian: true, isSpicy: false, image: IMAGES.lava_cake, description: 'Rich molten chocolate center, served with vanilla bean ice cream.' },
  { name: 'Madagascar Vanilla Crème Brûlée', price: 380, category: 'Desserts', isVegetarian: true, isSpicy: false, image: IMAGES.dessert_generic, description: 'Classic baked custard with a brittle crust of caramelized sugar.' },
  { name: 'Pistachio Gelato', price: 320, category: 'Desserts', isVegetarian: true, isSpicy: false, image: IMAGES.dessert_generic, description: 'Authentic Italian pistachio gelato topped with crushed nuts.' },
  { name: 'Passionfruit Panna Cotta', price: 390, category: 'Desserts', isVegetarian: true, isSpicy: false, image: IMAGES.dessert_generic, description: 'Silky vanilla panna cotta with a tangy passionfruit coulis.' },
  { name: 'Macaron Selection (6 pcs)', price: 450, category: 'Desserts', isVegetarian: true, isSpicy: false, image: IMAGES.dessert_generic, description: 'Assortment of handmade French macarons.' },
  { name: 'Artisanal Cheese Board', price: 950, category: 'Desserts', isVegetarian: true, isSpicy: false, image: IMAGES.dessert_generic, description: 'Selection of European cheeses, crackers, grapes, and honeycomb.' },

  // Signature Cocktails (7)
  { name: 'Ruby Signature Cocktail', price: 550, category: 'Drinks', isVegetarian: true, isSpicy: false, image: IMAGES.cocktail_red, description: 'Our house special with gin, pomegranate, elderflower, and gold flakes.' },
  { name: 'Smoked Rosemary Old Fashioned', price: 620, category: 'Drinks', isVegetarian: true, isSpicy: false, image: IMAGES.cocktail_dark, description: 'Premium bourbon, bitters, and smoked rosemary essence.' },
  { name: 'Lychee Martini', price: 450, category: 'Drinks', isVegetarian: true, isSpicy: false, image: IMAGES.cocktail_yellow, description: 'Vodka, fresh lychee juice, and a hint of vermouth.' },
  { name: 'Spicy Mango Margarita', price: 480, category: 'Drinks', isVegetarian: true, isSpicy: true, image: IMAGES.cocktail_yellow, description: 'Tequila, fresh mango, lime, and a chili-salt rim.' },
  { name: 'Midnight Espresso Martini', price: 520, category: 'Drinks', isVegetarian: true, isSpicy: false, image: IMAGES.cocktail_dark, description: 'Vodka, coffee liqueur, and freshly brewed espresso.' },
  { name: 'Sunset Aperol Spritz', price: 420, category: 'Drinks', isVegetarian: true, isSpicy: false, image: IMAGES.cocktail_red, description: 'Aperol, prosecco, and soda water garnished with an orange slice.' },
  { name: 'Tokyo Sour', price: 580, category: 'Drinks', isVegetarian: true, isSpicy: false, image: IMAGES.cocktail_yellow, description: 'Japanese whisky, yuzu juice, egg white, and matcha dust.' },

  // Premium Wines (3)
  { name: 'Alta Vigna - Cannonau di Sardegna', price: 2560, category: 'Premium Wines', isVegetarian: true, isSpicy: false, image: IMAGES.wine_bottle, description: 'Full-bodied red wine with notes of dark cherry and Mediterranean herbs.' },
  { name: 'Vento Rosso - Sardinian Rosé', price: 1820, category: 'Premium Wines', isVegetarian: true, isSpicy: false, image: IMAGES.wine_glass, description: 'Crisp and refreshing rosé with hints of strawberry and floral aromas.' },
  { name: 'Luce Di Terra - Isola dei Nuraghi', price: 3200, category: 'Premium Wines', isVegetarian: true, isSpicy: false, image: IMAGES.wine_glass, description: 'Elegant white wine showcasing bright acidity, citrus, and a mineral finish.' }
];


async function seed() {
  console.log('Clearing existing menu items...');
  await prisma.menuItem.deleteMany({});
  
  console.log('Seeding 50 beautifully mapped themed menu items...');
  for (const item of itemsData) {
    await prisma.menuItem.create({
      data: item
    });
  }
  
  console.log('Seeding completed successfully!');
}

seed()
  .catch(e => {
    console.error(e);
    process.exit(1);
  })
  .finally(async () => {
    await prisma.$disconnect();
  });
