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
      { name: 'Osetra Caviar Service', price: 4500, category: 'Starters', isVegetarian: false, isSpicy: false, image: '/images/Osetra -Caviar -Service.png', description: 'Premium Russian Osetra caviar served elegantly over a crystal ice bed, accompanied by traditional blinis and crème fraîche.' },
      { name: 'Wagyu Beef Tartare', price: 950, category: 'Starters', isVegetarian: false, isSpicy: false, image: '/images/Wagyu Beef Tartare.png', description: 'Hand-cut A5 Wagyu delicately seasoned, crowned with a raw quail egg and freshly shaved black truffle, served with toasted brioche.' },
      { name: 'Fresh Oysters Half Dozen', price: 1200, category: 'Starters', isVegetarian: false, isSpicy: false, image: '/images/Fresh Oysters Half Dozen.png', description: 'Six freshly shucked jumbo Fine de Claire oysters, served chilled over crushed ice with zesty lemon wedges.' },
      { name: 'Burrata & Heirloom Tomato', price: 680, category: 'Starters', isVegetarian: true, isSpicy: false, image: '/images/Burrata-Heirloom-Tomato.png', description: 'Silky, creamy fresh burrata cheese paired with vibrant heirloom tomatoes, finished with a drizzle of premium olive oil and aged balsamic.' },
      { name: 'Pan-Seared Foie Gras', price: 1250, category: 'Starters', isVegetarian: false, isSpicy: false, image: '/images/Pan-Seared-Foie-Gras.png', description: 'Thick-cut Rougié foie gras seared to a perfect golden crust, melting instantly, served with a sweet and tangy berry reduction.' },
      { name: 'Truffle Mushroom Arancini', price: 550, category: 'Starters', isVegetarian: true, isSpicy: false, image: '/images/TruffleMushroom-Arancini.png', description: 'Crispy golden risotto spheres stuffed with gooey mozzarella and infused with the rich, earthy aroma of black truffles.' },
      { name: 'Spicy Wagyu Carpaccio', price: 780, category: 'Starters', isVegetarian: false, isSpicy: true, image: '/images/SpicyWagyuCarpaccio.png', description: 'Paper-thin slices of premium Wagyu beef, drizzled with a vibrant spicy chili oil, topped with shaved parmesan and fresh rocket leaves.' },
      { name: 'Pan-Seared Hokkaido Scallops', price: 850, category: 'Starters', isVegetarian: false, isSpicy: false, image: '/images/Pan-SearedHokkaidoScallops.png', description: 'Plump and juicy Hokkaido scallops seared to golden perfection, served atop a smooth cauliflower purée with delicate garnishes.' },
      { name: 'Lobster Bisque', price: 650, category: 'Starters', isVegetarian: false, isSpicy: false, image: '/images/Lobster-Bisque.png', description: 'A velvety, rich soup bursting with the essence of Maine lobster, finished with a touch of cream and fresh tarragon.' },
      { name: 'Smoked Salmon Blinis', price: 720, category: 'Starters', isVegetarian: false, isSpicy: false, image: '/images/SmokedSalmonBlinis.png', description: 'Delicate slices of Norwegian smoked salmon folded gracefully over warm blinis, topped with fresh dill and a dollop of cream.' },

      // Mains (15)
      { name: 'A5 Wagyu Beef Tenderloin', price: 3500, category: 'Mains', isVegetarian: false, isSpicy: false, image: '/images/A5WagyuBeefTenderloin.png', description: 'The ultimate A5 Japanese Wagyu tenderloin, grilled to a flawless medium-rare, exuding melt-in-the-mouth juices with a rich red wine jus.' },
      { name: 'Maine Lobster Ravioli', price: 1450, category: 'Mains', isVegetarian: false, isSpicy: false, image: '/images/MaineLobsterRavioli.png', description: 'Hand-crafted ravioli generously stuffed with sweet Maine lobster meat, enveloped in a luxurious golden saffron cream sauce.' },
      { name: 'Spicy Blue Crab Tagliolini', price: 950, category: 'Mains', isVegetarian: false, isSpicy: true, image: '/images/SpicyBlueCrabTagliolini.png', description: 'Al dente ribbons of fresh pasta tossed in a fiery garlic and chili sauce, loaded with massive chunks of sweet blue crab meat.' },
      { name: 'Mediterranean Pan-Seared Seabass', price: 980, category: 'Mains', isVegetarian: false, isSpicy: false, image: '/images/Mediterranean Pan-Seared Seabass.png', description: 'Crispy-skinned, flaky wild seabass fillet, beautifully plated with roasted asparagus and a vibrant Mediterranean salsa.' },
      { name: 'Pan-Seared Duck Breast', price: 890, category: 'Mains', isVegetarian: false, isSpicy: false, image: '/images/Pan-Seared Duck Breast.png', description: 'Perfectly rendered, crispy-skinned duck breast served medium-rare, glazed with a sophisticated orange and ginger reduction.' },
      { name: 'Truffle Mushroom Risotto', price: 850, category: 'Mains', isVegetarian: true, isSpicy: false, image: '/images/Truffle Mushroom Risotto.png', description: 'Creamy Arborio rice slowly simmered in an earthy wild mushroom broth, generously finished with freshly shaved black truffles.' },
      { name: 'Australian Lamb Rack', price: 1850, category: 'Mains', isVegetarian: false, isSpicy: false, image: '/images/Australian Lamb Rack.png', description: 'A majestic rack of Australian lamb, herb-crusted and roasted to a juicy pink center, served alongside seasonal root vegetables.' },
      { name: 'Tomahawk Steak (For 2)', price: 4200, category: 'Mains', isVegetarian: false, isSpicy: false, image: '/images/Tomahawk Steak (For 2).png', description: 'A massive, show-stopping 1.2kg bone-in Wagyu Tomahawk, flame-grilled to perfection with an irresistible smoky char.' },
      { name: 'Black Cod Miso', price: 1400, category: 'Mains', isVegetarian: false, isSpicy: false, image: '/images/Black Cod Miso.png', description: 'Silky Alaskan black cod marinated in sweet Saikyo miso, broiled until caramelized and flaky, offering a delicate melt-in-the-mouth texture.' },
      { name: 'Squid Ink Spaghetti', price: 920, category: 'Mains', isVegetarian: false, isSpicy: true, image: '/images/Squid Ink Spaghetti.png', description: 'Jet-black spaghetti tossed in an intense, savory squid ink sauce, loaded with a spicy medley of fresh premium seafood.' },
      { name: 'Vegetable Ratatouille', price: 580, category: 'Mains', isVegetarian: true, isSpicy: false, image: '/images/Vegetable Ratatouille.png', description: 'A vibrant, classic French medley of thinly sliced summer vegetables, slowly baked in a rich, herbed tomato sauce.' },
      { name: 'Grilled King Prawns', price: 1650, category: 'Mains', isVegetarian: false, isSpicy: true, image: '/images/Grilled King Prawns.png', description: 'Colossal tiger prawns split and flame-grilled, glistening with garlic butter and served with a zesty, spicy seafood dip.' },
      { name: 'Beef Wellington', price: 2100, category: 'Mains', isVegetarian: false, isSpicy: false, image: '/images/Beef Wellington.png', description: 'A masterpiece of tender beef fillet and mushroom duxelles, encased in golden, flaky puff pastry, baked to sheer perfection.' },
      { name: 'Wild Boar Ragout Pappardelle', price: 890, category: 'Mains', isVegetarian: false, isSpicy: false, image: '/images/Wild Boar Ragout Pappardelle.png', description: 'Wide ribbons of fresh pasta blanketed in a robust, slow-cooked wild boar ragout, delivering deep, hearty Italian flavors.' },
      { name: 'Vegan Moussaka', price: 650, category: 'Mains', isVegetarian: true, isSpicy: false, image: '/images/Vegan Moussaka.png', description: 'A comforting layered bake of roasted eggplant and savory mushroom ragout, crowned with a perfectly golden, dairy-free béchamel.' },

      // Artisan Pizza (7)
      { name: 'Pizza Margherita D.O.C.', price: 550, category: 'Artisan Pizza', isVegetarian: true, isSpicy: false, image: '/images/Pizza Margherita D.O.C..png', description: 'A wood-fired classic featuring vibrant San Marzano tomatoes, melted fresh buffalo mozzarella, and aromatic basil leaves.' },
      { name: 'Pizza Black Truffle & Porcini', price: 890, category: 'Artisan Pizza', isVegetarian: true, isSpicy: false, image: '/images/Pizza Black Truffle & Porcini.png', description: 'An intoxicatingly aromatic pizza generously loaded with earthy porcini mushrooms, rich truffle paste, and gooey mozzarella.' },
      { name: 'Pizza Diavola & Spicy Nduja', price: 690, category: 'Artisan Pizza', isVegetarian: false, isSpicy: true, image: '/images/Pizza Diavola & Spicy Nduja.png', description: 'A fiery Italian masterpiece topped with thick-cut spicy pepperoni, smoky nduja sausage, and a generous layer of melted cheese.' },
      { name: 'Pizza Prosciutto di Parma & Burrata', price: 850, category: 'Artisan Pizza', isVegetarian: false, isSpicy: false, image: '/images/Pizza Prosciutto di Parma & Burrata.png', description: 'An elegant pizza crowned with paper-thin slices of salty Parma ham and a massive, creamy burrata ball in the center.' },
      { name: 'Pizza 4 Formaggi & Organic Honey', price: 680, category: 'Artisan Pizza', isVegetarian: true, isSpicy: false, image: '/images/Pizza 4 Formaggi & Organic Honey.png', description: 'A sophisticated blend of four premium Italian cheeses baked to golden perfection, finished with a drizzle of organic honey.' },
      { name: 'Pizza Spicy Seafood Marinara', price: 890, category: 'Artisan Pizza', isVegetarian: false, isSpicy: true, image: '/images/Pizza Spicy Seafood Marinara.png', description: 'A seafood lover\'s dream, loaded with fresh shrimp, mussels, and squid on a fiery, rich tomato and garlic base.' },
      { name: 'Pizza Carpaccio', price: 790, category: 'Artisan Pizza', isVegetarian: false, isSpicy: false, image: '/images/Pizza Carpaccio.png', description: 'A crispy, ultra-thin base topped with delicate slices of raw beef carpaccio, fresh peppery rocket, and generous shavings of parmesan.' },

      // Desserts (8)
      { name: 'Signature Deconstructed Tiramisu', price: 450, category: 'Desserts', isVegetarian: true, isSpicy: false, image: '/images/Signature Deconstructed Tiramisu.png', description: 'A modern, artistic take on the Italian classic, featuring silky mascarpone cream, espresso-soaked sponge, and rich cocoa dust.' },
      { name: 'Deconstructed Lemon Meringue Tart', price: 420, category: 'Desserts', isVegetarian: true, isSpicy: false, image: '/images/Deconstructed Lemon Meringue Tart.png', description: 'A stunning presentation of zesty lemon curd and buttery pastry crust, topped with perfectly torched, cloud-like meringue.' },
      { name: 'Warm Belgian Chocolate Lava Cake', price: 480, category: 'Desserts', isVegetarian: true, isSpicy: false, image: '/images/Warm Belgian Chocolate Lava Cake.png', description: 'A decadent, warm chocolate cake that gives way to a molten, flowing dark chocolate center, served with vanilla bean ice cream.' },
      { name: 'Madagascar Vanilla Crème Brûlée', price: 380, category: 'Desserts', isVegetarian: true, isSpicy: false, image: '/images/Madagascar Vanilla Crème Brûlée.png', description: 'A silky-smooth, vanilla-infused baked custard concealed beneath a perfectly caramelized, crackling sugar crust.' },
      { name: 'Pistachio Gelato', price: 320, category: 'Desserts', isVegetarian: true, isSpicy: false, image: '/images/Pistachio Gelato.png', description: 'Authentic, rich Italian gelato offering an intensely creamy pistachio flavor, elegantly garnished with crushed roasted nuts.' },
      { name: 'Passionfruit Panna Cotta', price: 390, category: 'Desserts', isVegetarian: true, isSpicy: false, image: '/images/Passionfruit Panna Cotta.png', description: 'A brilliantly white, jiggly vanilla panna cotta crowned with a vibrant, sweet-and-sour yellow passionfruit coulis.' },
      { name: 'Macaron Selection (6 pcs)', price: 450, category: 'Desserts', isVegetarian: true, isSpicy: false, image: '/images/Macaron Selection (6 pcs).png', description: 'An exquisite assortment of six delicate, pastel-colored French macarons, boasting a crisp shell and a chewy, flavorful center.' },
      { name: 'Artisanal Cheese Board', price: 950, category: 'Desserts', isVegetarian: true, isSpicy: false, image: '/images/Artisanal Cheese Board.png', description: 'A beautifully curated board of premium European cheeses, accompanied by crisp crackers, fresh grapes, and golden honeycomb.' },

      // Signature Cocktails (7)
      { name: 'Ruby Signature Cocktail', price: 550, category: 'Drinks', isVegetarian: true, isSpicy: false, image: '/images/Ruby Signature Cocktail.png', description: 'Our luxurious, vibrant ruby-red house special, intricately garnished with delicate edible flower petals.' },
      { name: 'Smoked Rosemary Old Fashioned', price: 620, category: 'Drinks', isVegetarian: true, isSpicy: false, image: '/images/Smoked Rosemary Old Fashioned.png', description: 'A bold, amber-hued classic cocktail infused with the mesmerizing, aromatic smoke of a torched rosemary sprig.' },
      { name: 'Lychee Martini', price: 450, category: 'Drinks', isVegetarian: true, isSpicy: false, image: '/images/Lychee Martin.png', description: 'A crystal-clear, elegant martini radiating sweet lychee aromas, served in a sleek glass with a fresh lychee garnish.' },
      { name: 'Spicy Mango Margarita', price: 480, category: 'Drinks', isVegetarian: true, isSpicy: true, image: '/images/Spicy Mango Margarita.png', description: 'A vibrant, tropical yellow margarita boasting sweet mango flavors, perfectly balanced by a fiery chili-salt rim.' },
      { name: 'Midnight Espresso Martini', price: 520, category: 'Drinks', isVegetarian: true, isSpicy: false, image: '/images/Midnight Espresso Martini.png', description: 'A rich, dark, and velvety cocktail topped with a thick layer of creamy foam and three signature espresso beans.' },
      { name: 'Sunset Aperol Spritz', price: 420, category: 'Drinks', isVegetarian: true, isSpicy: false, image: '/images/Sunset Aperol Spritz.png', description: 'A refreshing, sparkling cocktail glowing with the vibrant orange hues of a sunset, garnished with a fresh citrus slice.' },
      { name: 'Tokyo Sour', price: 580, category: 'Drinks', isVegetarian: true, isSpicy: false, image: '/images/Tokyo Sour.png', description: 'A sophisticated, pale-yellow cocktail crowned with a dense, frothy egg white foam, showcasing elegant Japanese mixology.' },

      // Premium Wines (3)
      { name: 'Alta Vita - Cannonau di Sardegna', price: 2560, category: 'Premium Wines', isVegetarian: true, isSpicy: false, image: '/images/Alta Vigna - Cannonau di Sardegna.png', description: 'A deep, ruby-red wine offering profound, robust flavors of dark cherry and aromatic Mediterranean herbs.' },
      { name: 'Château Juvenal - Les Ribes du Vallat', price: 1820, category: 'Premium Wines', isVegetarian: true, isSpicy: false, image: '/images/Vento Rosso - Sardinian Rosé wine.png', description: 'A crisp, pale-pink rosé bursting with refreshing strawberry notes and delicate, elegant floral aromas.' },
      { name: 'Montessu - Isola dei Nuraghi', price: 3200, category: 'Premium Wines', isVegetarian: true, isSpicy: false, image: '/images/Luce Di Terra - Isola dei Nuraghi.png', description: 'An exceptionally elegant red wine delivering a complex, balanced palate and a sophisticated, mineral-driven finish.' }
    ];
    await prisma.menuItem.createMany({ data: menuItems });
    console.log("Luxury menu seeded successfully.");
  }
}

export default prisma;
