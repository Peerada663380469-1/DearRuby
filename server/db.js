import { PrismaClient } from '@prisma/client';
import bcrypt from 'bcryptjs';

const prisma = new PrismaClient();

const IMAGES = {
  // Fallbacks for missing images
  beef_starter: 'https://images.unsplash.com/photo-1504674900247-0877df9cc836?auto=format&fit=crop&w=800&q=80',
  seafood: 'https://images.unsplash.com/photo-1551183053-bf91a1d81141?auto=format&fit=crop&w=800&q=80',
  
  // Drinks/Wines (user didn't upload these yet)
  cocktail_red: 'https://images.unsplash.com/photo-1536935338788-846bb9981813?auto=format&fit=crop&w=800&q=80',
  cocktail_dark: 'https://images.unsplash.com/photo-1514362545857-3bc16c4c7d1b?auto=format&fit=crop&w=800&q=80',
  cocktail_yellow: 'https://images.unsplash.com/photo-1551538827-9c037cb4f32a?auto=format&fit=crop&w=800&q=80',
  wine_bottle: 'https://images.unsplash.com/photo-1584916201218-f4242ceb4809?auto=format&fit=crop&w=800&q=80',
  wine_glass: 'https://images.unsplash.com/photo-1506377247377-2a5b3b417ebb?auto=format&fit=crop&w=800&q=80',
};

export async function seedDatabase() {
  // 1. Seed Manager User
  const userCount = await prisma.user.count();
  if (userCount === 0) {
    const pinHash = bcrypt.hashSync('1234', 10);
    await prisma.user.create({
      data: { name: 'Manager', pin_hash: pinHash, role: 'manager' }
    });
    console.log("Manager seeded successfully.");
  }

  // 2. Seed Tables
  const tableCount = await prisma.table.count();
  if (tableCount === 0) {
    const tables = [];
    for (let i = 1; i <= 30; i++) {
      tables.push({
        name: `T${i}`,
        seats: i <= 20 ? 4 : 6,
      });
    }
    await prisma.table.createMany({ data: tables });
    console.log("Tables seeded successfully.");
  }

  // 3. Seed Luxury Menu Items
  const menuCount = await prisma.menuItem.count();
  if (menuCount === 0) {
    const menuItems = [
      // Starters (10)
      { name: 'Osetra Caviar Service', price: 4500, category: 'Starters', isVegetarian: false, isSpicy: false, image: '/images/Osetra -Caviar -Service.png', description: 'Premium Russian Osetra caviar served with traditional accompaniments and blinis.' },
      { name: 'Wagyu Beef Tartare', price: 950, category: 'Starters', isVegetarian: false, isSpicy: false, image: '/images/Wagyu Beef Tartare.png', description: 'Hand-cut A5 Wagyu, quail egg, truffle shavings, and toasted brioche.' },
      { name: 'Fresh Oysters Half Dozen', price: 1200, category: 'Starters', isVegetarian: false, isSpicy: false, image: '/images/Fresh Oysters Half Dozen.png', description: 'Fine de Claire oysters served over ice with mignonette and lemon.' },
      { name: 'Burrata & Heirloom Tomato', price: 680, category: 'Starters', isVegetarian: true, isSpicy: false, image: '/images/Burrata-Heirloom-Tomato.png', description: 'Creamy Italian burrata, organic tomatoes, basil oil, and aged balsamic.' },
      { name: 'Pan-Seared Foie Gras', price: 1250, category: 'Starters', isVegetarian: false, isSpicy: false, image: '/images/Pan-Seared-Foie-Gras.png', description: 'Rougié foie gras, caramelized figs, and port wine reduction.' },
      { name: 'Truffle Mushroom Arancini', price: 550, category: 'Starters', isVegetarian: true, isSpicy: false, image: '/images/TruffleMushroom-Arancini.png', description: 'Crispy risotto balls stuffed with mozzarella and black truffle.' },
      { name: 'Spicy Wagyu Carpaccio', price: 780, category: 'Starters', isVegetarian: false, isSpicy: true, image: '/images/SpicyWagyuCarpaccio.png', description: 'Thinly sliced Wagyu, spicy chili oil, parmesan shavings, and rocket.' },
      { name: 'Pan-Seared Hokkaido Scallops', price: 850, category: 'Starters', isVegetarian: false, isSpicy: false, image: '/images/Pan-SearedHokkaidoScallops.png', description: 'Jumbo scallops, cauliflower purée, and crispy pancetta.' },
      { name: 'Lobster Bisque', price: 650, category: 'Starters', isVegetarian: false, isSpicy: false, image: '/images/Lobster-Bisque.png', description: 'Rich and creamy soup with fresh Maine lobster chunks and tarragon.' },
      { name: 'Smoked Salmon Blinis', price: 720, category: 'Starters', isVegetarian: false, isSpicy: false, image: '/images/SmokedSalmonBlinis.png', description: 'Norwegian smoked salmon, dill crème fraîche on warm blinis.' },

      // Mains (15)
      { name: 'A5 Wagyu Beef Tenderloin', price: 3500, category: 'Mains', isVegetarian: false, isSpicy: false, image: '/images/A5WagyuBeefTenderloin.png', description: '200g of the finest Japanese A5 Wagyu, served with truffle mash and red wine jus.' },
      { name: 'Maine Lobster Ravioli', price: 1450, category: 'Mains', isVegetarian: false, isSpicy: false, image: '/images/MaineLobsterRavioli.png', description: 'Handmade ravioli stuffed with lobster, served in a rich saffron cream sauce.' },
      { name: 'Spicy Blue Crab Tagliolini', price: 950, category: 'Mains', isVegetarian: false, isSpicy: true, image: '/images/SpicyBlueCrabTagliolini.png', description: 'Fresh tagliolini tossed with blue crab meat, garlic, chili, and white wine.' },
      { name: 'Mediterranean Pan-Seared Seabass', price: 980, category: 'Mains', isVegetarian: false, isSpicy: false, image: '/images/Mediterranean Pan-Seared Seabass.png', description: 'Wild-caught seabass with Mediterranean salsa and asparagus.' },
      { name: 'Pan-Seared Duck Breast', price: 890, category: 'Mains', isVegetarian: false, isSpicy: false, image: '/images/Pan-Seared Duck Breast.png', description: 'Crispy skin duck breast, orange-ginger glaze, and sweet potato purée.' },
      { name: 'Truffle Mushroom Risotto', price: 850, category: 'Mains', isVegetarian: true, isSpicy: false, image: '/images/Truffle Mushroom Risotto.png', description: 'Arborio rice cooked in mushroom broth, finished with parmesan and fresh black truffle.' },
      { name: 'Australian Lamb Rack', price: 1850, category: 'Mains', isVegetarian: false, isSpicy: false, image: '/images/Australian Lamb Rack.png', description: 'Herb-crusted lamb rack, mint jus, and roasted root vegetables.' },
      { name: 'Tomahawk Steak (For 2)', price: 4200, category: 'Mains', isVegetarian: false, isSpicy: false, image: '/images/Tomahawk Steak (For 2).png', description: '1.2kg Australian Wagyu Tomahawk, served with three sauces and grilled sides.' },
      { name: 'Black Cod Miso', price: 1400, category: 'Mains', isVegetarian: false, isSpicy: false, image: '/images/Black Cod Miso.png', description: 'Alaskan black cod marinated in sweet saikyo miso, broiled to perfection.' },
      { name: 'Squid Ink Spaghetti', price: 920, category: 'Mains', isVegetarian: false, isSpicy: true, image: '/images/Squid Ink Spaghetti.png', description: 'Squid ink pasta, mixed seafood, garlic, and dried chili flakes.' },
      { name: 'Vegetable Ratatouille', price: 580, category: 'Mains', isVegetarian: true, isSpicy: false, image: '/images/Vegetable Ratatouille.png', description: 'Classic French stewed vegetables in a rich tomato and herb sauce.' },
      { name: 'Grilled King Prawns', price: 1650, category: 'Mains', isVegetarian: false, isSpicy: true, image: '/images/Grilled King Prawns.png', description: 'Giant tiger prawns grilled with garlic butter and spicy seafood dip.' },
      { name: 'Beef Wellington', price: 2100, category: 'Mains', isVegetarian: false, isSpicy: false, image: '/images/Beef Wellington.png', description: 'Classic beef tenderloin wrapped in mushroom duxelles and puff pastry.' },
      { name: 'Wild Boar Ragout Pappardelle', price: 890, category: 'Mains', isVegetarian: false, isSpicy: false, image: '/images/Wild Boar Ragout Pappardelle.png', description: 'Slow-cooked wild boar ragout over wide ribbon pasta.' },
      { name: 'Vegan Moussaka', price: 650, category: 'Mains', isVegetarian: true, isSpicy: false, image: '/images/Vegan Moussaka.png', description: 'Layers of eggplant, potato, and lentil ragout, topped with vegan béchamel.' },

      // Artisan Pizza (7)
      { name: 'Pizza Margherita D.O.C.', price: 550, category: 'Artisan Pizza', isVegetarian: true, isSpicy: false, image: '/images/Pizza Margherita D.O.C..png', description: 'San Marzano tomatoes, fresh buffalo mozzarella, and basil.' },
      { name: 'Pizza Black Truffle & Porcini', price: 890, category: 'Artisan Pizza', isVegetarian: true, isSpicy: false, image: '/images/Pizza Black Truffle & Porcini.png', description: 'Porcini mushrooms, truffle paste, mozzarella, and truffle oil.' },
      { name: 'Pizza Diavola & Spicy Nduja', price: 690, category: 'Artisan Pizza', isVegetarian: false, isSpicy: true, image: '/images/Pizza Diavola & Spicy Nduja.png', description: 'Spicy Italian salami, nduja, mozzarella, and chili flakes.' },
      { name: 'Pizza Prosciutto di Parma & Burrata', price: 850, category: 'Artisan Pizza', isVegetarian: false, isSpicy: false, image: '/images/Pizza Prosciutto di Parma & Burrata.png', description: 'Parma ham, whole fresh burrata, cherry tomatoes, and rocket.' },
      { name: 'Pizza 4 Formaggi & Organic Honey', price: 680, category: 'Artisan Pizza', isVegetarian: true, isSpicy: false, image: '/images/Pizza 4 Formaggi & Organic Honey.png', description: 'Mozzarella, gorgonzola, parmesan, fontina, drizzled with organic honey.' },
      { name: 'Pizza Spicy Seafood Marinara', price: 890, category: 'Artisan Pizza', isVegetarian: false, isSpicy: true, image: '/images/Pizza Spicy Seafood Marinara.png', description: 'Mixed seafood, garlic, chili, and San Marzano tomato sauce.' },
      { name: 'Pizza Carpaccio', price: 790, category: 'Artisan Pizza', isVegetarian: false, isSpicy: false, image: '/images/Pizza Carpaccio.png', description: 'Beef carpaccio, parmesan, rocket leaves, and truffle oil on a crispy base.' },

      // Desserts (8)
      { name: 'Signature Deconstructed Tiramisu', price: 450, category: 'Desserts', isVegetarian: true, isSpicy: false, image: '/images/Signature Deconstructed Tiramisu.png', description: 'Mascarpone cream, espresso sponge, and cocoa dust served in a modern style.' },
      { name: 'Deconstructed Lemon Meringue Tart', price: 420, category: 'Desserts', isVegetarian: true, isSpicy: false, image: '/images/Deconstructed Lemon Meringue Tart.png', description: 'Zesty lemon curd, sweet pastry crust, and toasted meringue.' },
      { name: 'Warm Belgian Chocolate Lava Cake', price: 480, category: 'Desserts', isVegetarian: true, isSpicy: false, image: '/images/Warm Belgian Chocolate Lava Cake.png', description: 'Rich molten chocolate center, served with vanilla bean ice cream.' },
      { name: 'Madagascar Vanilla Crème Brûlée', price: 380, category: 'Desserts', isVegetarian: true, isSpicy: false, image: '/images/Madagascar Vanilla Crème Brûlée.png', description: 'Classic baked custard with a brittle crust of caramelized sugar.' },
      { name: 'Pistachio Gelato', price: 320, category: 'Desserts', isVegetarian: true, isSpicy: false, image: '/images/Pistachio Gelato.png', description: 'Authentic Italian pistachio gelato topped with crushed nuts.' },
      { name: 'Passionfruit Panna Cotta', price: 390, category: 'Desserts', isVegetarian: true, isSpicy: false, image: '/images/Passionfruit Panna Cotta.png', description: 'Silky vanilla panna cotta with a tangy passionfruit coulis.' },
      { name: 'Macaron Selection (6 pcs)', price: 450, category: 'Desserts', isVegetarian: true, isSpicy: false, image: '/images/Macaron Selection (6 pcs).png', description: 'Assortment of handmade French macarons.' },
      { name: 'Artisanal Cheese Board', price: 950, category: 'Desserts', isVegetarian: true, isSpicy: false, image: '/images/Artisanal Cheese Board.png', description: 'Selection of European cheeses, crackers, grapes, and honeycomb.' },

      // Signature Cocktails (7)
      { name: 'Ruby Signature Cocktail', price: 550, category: 'Drinks', isVegetarian: true, isSpicy: false, image: IMAGES.cocktail_red, description: 'Our house special with gin, pomegranate, elderflower, and gold flakes.' },
      { name: 'Smoked Rosemary Old Fashioned', price: 620, category: 'Drinks', isVegetarian: true, isSpicy: false, image: IMAGES.cocktail_dark, description: 'Premium bourbon, bitters, and smoked rosemary essence.' },
      { name: 'Lychee Martini', price: 450, category: 'Drinks', isVegetarian: true, isSpicy: false, image: IMAGES.cocktail_yellow, description: 'Vodka, fresh lychee juice, and a hint of vermouth.' },
      { name: 'Spicy Mango Margarita', price: 480, category: 'Drinks', isVegetarian: true, isSpicy: true, image: IMAGES.cocktail_yellow, description: 'Tequila, fresh mango, lime, and a chili-salt rim.' },
      { name: 'Midnight Espresso Martini', price: 520, category: 'Drinks', isVegetarian: true, isSpicy: false, image: IMAGES.cocktail_dark, description: 'Vodka, coffee liqueur, and freshly brewed espresso.' },
      { name: 'Sunset Aperol Spritz', price: 420, category: 'Drinks', isVegetarian: true, isSpicy: false, image: IMAGES.cocktail_red, description: 'Aperol, prosecco, and soda water garnished with an orange slice.' },
      { name: 'Tokyo Sour', price: 580, category: 'Drinks', isVegetarian: true, isSpicy: false, image: IMAGES.cocktail_yellow, description: 'Japanese whisky, yuzu juice, egg white, and matcha dust.' },

      // Premium Wines (3)
      { name: 'Alta Vita - Cannonau di Sardegna', price: 2560, category: 'Premium Wines', isVegetarian: true, isSpicy: false, image: '/images/Alta Vigna - Cannonau di Sardegna.png', description: 'Full-bodied red wine with notes of dark cherry and Mediterranean herbs.' },
      { name: 'Château Juvenal - Les Ribes du Vallat', price: 1820, category: 'Premium Wines', isVegetarian: true, isSpicy: false, image: '/images/Vento Rosso - Sardinian Rosé wine.png', description: 'Crisp and refreshing rosé with hints of strawberry and floral aromas.' },
      { name: 'Montessu - Isola dei Nuraghi', price: 3200, category: 'Premium Wines', isVegetarian: true, isSpicy: false, image: '/images/Luce Di Terra - Isola dei Nuraghi.png', description: 'Elegant red wine showcasing bright acidity, cherry, and a mineral finish.' }
    ];
    await prisma.menuItem.createMany({ data: menuItems });
    console.log("Luxury menu seeded successfully.");
  }
}

export default prisma;
