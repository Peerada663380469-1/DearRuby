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
      { name: 'Osetra Caviar Service', price: 4500, category: 'Starters', isVegetarian: false, isSpicy: false, image: '/images/Osetra -Caviar -Service.png', description: 'ไข่ปลาคาเวียร์ระดับพรีเมียม เสิร์ฟสุดหรูบนชามน้ำแข็งคริสตัล พร้อมแครกเกอร์กรอบและเครื่องเคียงแบบดั้งเดิม' },
      { name: 'Wagyu Beef Tartare', price: 950, category: 'Starters', isVegetarian: false, isSpicy: false, image: '/images/Wagyu Beef Tartare.png', description: 'เนื้อวากิวระดับ A5 สับละเอียด ปรุงรสกลมกล่อม ท็อปด้วยไข่นกกระทาดิบและเห็ดทรัฟเฟิลสไลซ์ เสิร์ฟคู่กับขนมปังอบกรอบ' },
      { name: 'Fresh Oysters Half Dozen', price: 1200, category: 'Starters', isVegetarian: false, isSpicy: false, image: '/images/Fresh Oysters Half Dozen.png', description: 'หอยนางรมสดตัวโตส่งตรงจากทะเล เสิร์ฟเย็นฉ่ำบนน้ำแข็งเกล็ด พร้อมเลมอนและซอสสุดพิเศษ' },
      { name: 'Burrata & Heirloom Tomato', price: 680, category: 'Starters', isVegetarian: true, isSpicy: false, image: '/images/Burrata-Heirloom-Tomato.png', description: 'ชีสบูร์ราตาสดเนื้อเนียนนุ่ม ทานคู่กับมะเขือเทศแฮร์ลูมหลากสี ราดด้วยน้ำมันมะกอกและบัลซามิกชั้นเลิศ' },
      { name: 'Pan-Seared Foie Gras', price: 1250, category: 'Starters', isVegetarian: false, isSpicy: false, image: '/images/Pan-Seared-Foie-Gras.png', description: 'ตับห่านชิ้นโตเซียร์จนเกรียมผิวนอก ด้านในละลายในปาก ราดด้วยซอสผลไม้รสเปรี้ยวอมหวานตัดเลี่ยนอย่างลงตัว' },
      { name: 'Truffle Mushroom Arancini', price: 550, category: 'Starters', isVegetarian: true, isSpicy: false, image: '/images/TruffleMushroom-Arancini.png', description: 'ข้าวรีซอตโตปั้นทอดกรอบสีเหลืองทอง สอดไส้ชีสเยิ้มๆ และหอมกลิ่นเห็ดทรัฟเฟิลเตะจมูก' },
      { name: 'Spicy Wagyu Carpaccio', price: 780, category: 'Starters', isVegetarian: false, isSpicy: true, image: '/images/SpicyWagyuCarpaccio.png', description: 'เนื้อวากิวสไลซ์บางเฉียบ ราดด้วยซอสพริกสูตรเด็ด โรยชีสพาร์เมซานและผักร็อกเก็ตสดกรอบ' },
      { name: 'Pan-Seared Hokkaido Scallops', price: 850, category: 'Starters', isVegetarian: false, isSpicy: false, image: '/images/Pan-SearedHokkaidoScallops.png', description: 'หอยเชลล์ฮอกไกโดตัวอวบอ้วน เซียร์จนหอมกรุ่น เสิร์ฟบนซอสครีมเนื้อเนียนและตกแต่งอย่างประณีต' },
      { name: 'Lobster Bisque', price: 650, category: 'Starters', isVegetarian: false, isSpicy: false, image: '/images/Lobster-Bisque.png', description: 'ซุปข้นกุ้งล็อบสเตอร์สีส้มทอง หอมกลิ่นมันกุ้งและครีม รสชาติเข้มข้นละมุนลิ้น' },
      { name: 'Smoked Salmon Blinis', price: 720, category: 'Starters', isVegetarian: false, isSpicy: false, image: '/images/SmokedSalmonBlinis.png', description: 'แซลมอนรมควันเนื้อนุ่ม วางบนแพนเค้กบลินีชิ้นพอดีคำ แต่งหน้าด้วยครีมสดและผักชีลาว' },

      // Mains (15)
      { name: 'A5 Wagyu Beef Tenderloin', price: 3500, category: 'Mains', isVegetarian: false, isSpicy: false, image: '/images/A5WagyuBeefTenderloin.png', description: 'สเต็กเนื้อวากิว A5 ส่วนสันในสุดนุ่ม ย่างสุกกำลังดีจนเห็นเนื้อในสีชมพูฉ่ำ ราดซอสไวน์แดงเข้มข้น' },
      { name: 'Maine Lobster Ravioli', price: 1450, category: 'Mains', isVegetarian: false, isSpicy: false, image: '/images/MaineLobsterRavioli.png', description: 'พาสต้าราบิโอลีสอดไส้เนื้อกุ้งล็อบสเตอร์เน้นๆ คลุกเคล้าซอสครีมสีเหลืองทองสุดหรูหรา' },
      { name: 'Spicy Blue Crab Tagliolini', price: 950, category: 'Mains', isVegetarian: false, isSpicy: true, image: '/images/SpicyBlueCrabTagliolini.png', description: 'เส้นพาสต้าโฮมเมดผัดซอสรสจัดจ้าน อัดแน่นไปด้วยกรรเชียงปูม้าชิ้นโตเต็มคำ' },
      { name: 'Mediterranean Pan-Seared Seabass', price: 980, category: 'Mains', isVegetarian: false, isSpicy: false, image: '/images/Mediterranean Pan-Seared Seabass.png', description: 'ปลากะพงชิ้นหนาเซียร์จนหนังกรอบ เนื้อในขาวเนียนนุ่ม เสิร์ฟบนผักเคียงและซอสสไตล์เมดิเตอร์เรเนียน' },
      { name: 'Pan-Seared Duck Breast', price: 890, category: 'Mains', isVegetarian: false, isSpicy: false, image: '/images/Pan-Seared Duck Breast.png', description: 'อกเป็ดเนื้อนุ่มชุ่มฉ่ำ หนังย่างจนกรอบเกรียม หั่นสไลซ์พอดีคำ ราดซอสผลไม้รสกลมกล่อม' },
      { name: 'Truffle Mushroom Risotto', price: 850, category: 'Mains', isVegetarian: true, isSpicy: false, image: '/images/Truffle Mushroom Risotto.png', description: 'ข้าวรีซอตโตเม็ดอวบผัดกับครีมเห็ดจนงวด หอมกลิ่นทรัฟเฟิลฟุ้งกระจาย และโรยชีสแผ่นบาง' },
      { name: 'Australian Lamb Rack', price: 1850, category: 'Mains', isVegetarian: false, isSpicy: false, image: '/images/Australian Lamb Rack.png', description: 'ซี่โครงแกะออสเตรเลียชิ้นโต ย่างสุกระดับมีเดียมแรร์ เสิร์ฟพร้อมมันบดและผักย่างสีสันสวยงาม' },
      { name: 'Tomahawk Steak (For 2)', price: 4200, category: 'Mains', isVegetarian: false, isSpicy: false, image: '/images/Tomahawk Steak (For 2).png', description: 'สเต็กเนื้อโทมาฮอว์กชิ้นยักษ์ติดกระดูก ย่างไฟลุกโชนจนได้กลิ่นหอมสโมก เหมาะสำหรับแชร์ความอร่อย' },
      { name: 'Black Cod Miso', price: 1400, category: 'Mains', isVegetarian: false, isSpicy: false, image: '/images/Black Cod Miso.png', description: 'ปลาแบล็คค็อดเนื้อปลามันวาว หมักซอสมิโซะหวานนำ ย่างจนผิวนอกเกรียมหอมละมุน' },
      { name: 'Squid Ink Spaghetti', price: 920, category: 'Mains', isVegetarian: false, isSpicy: true, image: '/images/Squid Ink Spaghetti.png', description: 'สปาเก็ตตี้เส้นดำผัดซอสหมึกดำเข้มข้น จัดเต็มด้วยซีฟู้ดสดๆ รสชาติจัดจ้านถึงใจ' },
      { name: 'Vegetable Ratatouille', price: 580, category: 'Mains', isVegetarian: true, isSpicy: false, image: '/images/Vegetable Ratatouille.png', description: 'สตูว์ผักรวมสไตล์ฝรั่งเศส หั่นชิ้นเรียงสวยงาม อบในซอสมะเขือเทศเข้มข้น ดีต่อสุขภาพ' },
      { name: 'Grilled King Prawns', price: 1650, category: 'Mains', isVegetarian: false, isSpicy: true, image: '/images/Grilled King Prawns.png', description: 'กุ้งลายเสือตัวโตย่างไฟหอมๆ ผ่าครึ่งโชว์เนื้อขาวเด้งและมันกุ้งเยิ้มๆ ทานคู่กับน้ำจิ้มรสเด็ด' },
      { name: 'Beef Wellington', price: 2100, category: 'Mains', isVegetarian: false, isSpicy: false, image: '/images/Beef Wellington.png', description: 'เนื้อสันในห่อด้วยแป้งพายอบจนสีเหลืองทองกรอบ ด้านในสอดไส้เห็ดหอม หั่นโชว์ความสุกที่สมบูรณ์แบบ' },
      { name: 'Wild Boar Ragout Pappardelle', price: 890, category: 'Mains', isVegetarian: false, isSpicy: false, image: '/images/Wild Boar Ragout Pappardelle.png', description: 'พาสต้าเส้นแบนใหญ่ คลุกเคล้าซอสเนื้อหมูป่าตุ๋นเข้มข้น รสชาติจัดจ้านสไตล์อิตาเลียนแท้' },
      { name: 'Vegan Moussaka', price: 650, category: 'Mains', isVegetarian: true, isSpicy: false, image: '/images/Vegan Moussaka.png', description: 'มูซาก้าสูตรมังสวิรัติ อบจนชีสวีแกนด้านบนเหลืองเกรียมหอมกรุ่น' },

      // Artisan Pizza (7)
      { name: 'Pizza Margherita D.O.C.', price: 550, category: 'Artisan Pizza', isVegetarian: true, isSpicy: false, image: '/images/Pizza Margherita D.O.C..png', description: 'พิซซ่าเตาถ่านหน้ามะเขือเทศซานมาร์ซาโน่ โปะด้วยชีสสดเยิ้มๆ และใบโหระพาอิตาเลียน' },
      { name: 'Pizza Black Truffle & Porcini', price: 890, category: 'Artisan Pizza', isVegetarian: true, isSpicy: false, image: '/images/Pizza Black Truffle & Porcini.png', description: 'พิซซ่าหอมกลิ่นทรัฟเฟิลทะลุจอ จัดเต็มด้วยเห็ดพอร์ชินีและชีสยืดๆ สุดฟิน' },
      { name: 'Pizza Diavola & Spicy Nduja', price: 690, category: 'Artisan Pizza', isVegetarian: false, isSpicy: true, image: '/images/Pizza Diavola & Spicy Nduja.png', description: 'พิซซ่ารสจัดจ้าน หั่นเปปเปอโรนีชิ้นโตและซอสเผ็ดร้อนสไตล์อิตาเลียนแท้' },
      { name: 'Pizza Prosciutto di Parma & Burrata', price: 850, category: 'Artisan Pizza', isVegetarian: false, isSpicy: false, image: '/images/Pizza Prosciutto di Parma & Burrata.png', description: 'พิซซ่าท็อปด้วยพาร์มาแฮมแผ่นบางเฉียบและบูร์ราตาชีสก้อนโตตรงกลาง น่าทานสุดๆ' },
      { name: 'Pizza 4 Formaggi & Organic Honey', price: 680, category: 'Artisan Pizza', isVegetarian: true, isSpicy: false, image: '/images/Pizza 4 Formaggi & Organic Honey.png', description: 'พิซซ่ารวมชีส 4 ชนิดอบจนหน้าเกรียมสวยงาม ราดด้วยน้ำผึ้งออร์แกนิกเพิ่มความกลมกล่อม' },
      { name: 'Pizza Spicy Seafood Marinara', price: 890, category: 'Artisan Pizza', isVegetarian: false, isSpicy: true, image: '/images/Pizza Spicy Seafood Marinara.png', description: 'พิซซ่าหน้าซีฟู้ดตู้มๆ ทั้งกุ้ง ปลาหมึก หอยแมลงภู่ ในซอสมะเขือเทศเข้มข้น' },
      { name: 'Pizza Carpaccio', price: 790, category: 'Artisan Pizza', isVegetarian: false, isSpicy: false, image: '/images/Pizza Carpaccio.png', description: 'พิซซ่าท็อปด้วยเนื้อสไลซ์บางเฉียบ โรยร็อกเก็ตสดและชีสพาร์เมซานแบบจัดเต็ม' },

      // Desserts (8)
      { name: 'Signature Deconstructed Tiramisu', price: 450, category: 'Desserts', isVegetarian: true, isSpicy: false, image: '/images/Signature Deconstructed Tiramisu.png', description: 'ทีรามิสุสไตล์โมเดิร์น ครีมมาสคาร์โปนเนียนนุ่ม โรยผงโกโก้เข้มข้น จัดจานอย่างมีศิลปะ' },
      { name: 'Deconstructed Lemon Meringue Tart', price: 420, category: 'Desserts', isVegetarian: true, isSpicy: false, image: '/images/Deconstructed Lemon Meringue Tart.png', description: 'ทาร์ตเลมอนสุดเก๋ โชว์เมอแรงก์ที่เบิร์นไฟจนเป็นสีน้ำตาลทอง ตัดกับครีมเลมอนสีเหลืองสดใส' },
      { name: 'Warm Belgian Chocolate Lava Cake', price: 480, category: 'Desserts', isVegetarian: true, isSpicy: false, image: '/images/Warm Belgian Chocolate Lava Cake.png', description: 'เค้กช็อกโกแลตลาวาอุ่นๆ ตัดปุ๊บช็อกโกแลตไหลเยิ้มปั๊บ ทานคู่กับไอศกรีมวานิลลาเย็นชื่นใจ' },
      { name: 'Madagascar Vanilla Crème Brûlée', price: 380, category: 'Desserts', isVegetarian: true, isSpicy: false, image: '/images/Madagascar Vanilla Crème Brûlée.png', description: 'เครมบรูเล่เนื้อเนียนนุ่ม ด้านบนเป็นน้ำตาลไหม้แผ่นบางกรอบ เคาะดังเป๊าะก่อนทาน' },
      { name: 'Pistachio Gelato', price: 320, category: 'Desserts', isVegetarian: true, isSpicy: false, image: '/images/Pistachio Gelato.png', description: 'เจลาโต้พิสตาชิโอสีเขียวละมุน โรยถั่วพิสตาชิโอบดกรุบกรอบ หวานเย็นชื่นใจ' },
      { name: 'Passionfruit Panna Cotta', price: 390, category: 'Desserts', isVegetarian: true, isSpicy: false, image: '/images/Passionfruit Panna Cotta.png', description: 'พานาคอตต้าเด้งดึ๋งสีขาวนวล ราดด้วยซอสเสาวรสเปรี้ยวอมหวานสีเหลืองสด' },
      { name: 'Macaron Selection (6 pcs)', price: 450, category: 'Desserts', isVegetarian: true, isSpicy: false, image: '/images/Macaron Selection (6 pcs).png', description: 'มาการองสีสันสดใสพาสเทลหลากรสชาติ กรอบนอกนุ่มใน หวานละมุนพอดีคำ' },
      { name: 'Artisanal Cheese Board', price: 950, category: 'Desserts', isVegetarian: true, isSpicy: false, image: '/images/Artisanal Cheese Board.png', description: 'บอร์ดชีสรวมมิตรเกรดพรีเมียม จัดเรียงสวยงามคู่กับแครกเกอร์ องุ่นสด และน้ำผึ้ง' },

      // Signature Cocktails (7)
      { name: 'Ruby Signature Cocktail', price: 550, category: 'Drinks', isVegetarian: true, isSpicy: false, image: IMAGES.cocktail_red, description: 'ค็อกเทลซิกเนเจอร์สีแดงทับทิมสดใส ตกแต่งด้วยกลีบดอกไม้สุดหรูหรา' },
      { name: 'Smoked Rosemary Old Fashioned', price: 620, category: 'Drinks', isVegetarian: true, isSpicy: false, image: IMAGES.cocktail_dark, description: 'ค็อกเทลสีอำพันเสิร์ฟพร้อมควันหอมๆ จากโรสแมรี่เผาไฟ ดูเท่และคลาสสิก' },
      { name: 'Lychee Martini', price: 450, category: 'Drinks', isVegetarian: true, isSpicy: false, image: IMAGES.cocktail_yellow, description: 'มาร์ตินี่ใสแจ๋ว หอมกลิ่นลิ้นจี่ เสิร์ฟในแก้วทรงสวยพร้อมผลลิ้นจี่ประดับ' },
      { name: 'Spicy Mango Margarita', price: 480, category: 'Drinks', isVegetarian: true, isSpicy: true, image: IMAGES.cocktail_yellow, description: 'มาร์การิต้าสีเหลืองมะม่วงสดใส ขอบแก้วคลุกเคล้าเกลือพริกไทยเพิ่มความจัดจ้าน' },
      { name: 'Midnight Espresso Martini', price: 520, category: 'Drinks', isVegetarian: true, isSpicy: false, image: IMAGES.cocktail_dark, description: 'เอสเพรสโซ่มาร์ตินี่สีเข้มข้น มีฟองนุ่มละมุนด้านบน โรยด้วยเมล็ดกาแฟสามเมล็ด' },
      { name: 'Sunset Aperol Spritz', price: 420, category: 'Drinks', isVegetarian: true, isSpicy: false, image: IMAGES.cocktail_red, description: 'ค็อกเทลสีส้มสดใสเหมือนพระอาทิตย์ตก ซ่าสดชื่นด้วยโซดาและส้มฝานชิ้นบาง' },
      { name: 'Tokyo Sour', price: 580, category: 'Drinks', isVegetarian: true, isSpicy: false, image: IMAGES.cocktail_yellow, description: 'ค็อกเทลสีเหลืองนวล มีฟองโฟมไข่ขาวหนานุ่มด้านบน สวยงามสไตล์ญี่ปุ่น' },

      // Premium Wines (3)
      { name: 'Alta Vita - Cannonau di Sardegna', price: 2560, category: 'Premium Wines', isVegetarian: true, isSpicy: false, image: '/images/Alta Vigna - Cannonau di Sardegna.png', description: 'ไวน์แดงสีทับทิมเข้มข้น รสชาติล้ำลึก หอมกลิ่นเชอร์รี่และสมุนไพรเมดิเตอร์เรเนียน' },
      { name: 'Château Juvenal - Les Ribes du Vallat', price: 1820, category: 'Premium Wines', isVegetarian: true, isSpicy: false, image: '/images/Vento Rosso - Sardinian Rosé wine.png', description: 'ไวน์โรเซ่สีชมพูอ่อนใส รสชาติสดชื่น หอมกลิ่นสตรอว์เบอร์รี่และดอกไม้อ่อนๆ' },
      { name: 'Montessu - Isola dei Nuraghi', price: 3200, category: 'Premium Wines', isVegetarian: true, isSpicy: false, image: '/images/Luce Di Terra - Isola dei Nuraghi.png', description: 'ไวน์แดงเกรดพรีเมียม รสชาติซับซ้อนแต่ดื่มง่าย จบด้วยความสดชื่นแบบมีระดับ' }
    ];
    await prisma.menuItem.createMany({ data: menuItems });
    console.log("Luxury menu seeded successfully.");
  }
}

export default prisma;
