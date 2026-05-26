import React, { useState, useEffect } from 'react';
import { useNavigate, useLocation } from 'react-router-dom';
import { ArrowLeft, ShoppingBag, X, Plus, Minus, Flame, Leaf } from 'lucide-react';
import { motion, AnimatePresence } from 'framer-motion';
import Footer from '../components/Footer';
import Navbar from '../components/Navbar';
import api from '../services/api';

export default function POSPage() {
  const navigate = useNavigate();
  const location = useLocation();
  const [categories, setCategories] = useState(['All']);
  const [activeCategory, setActiveCategory] = useState('All');
  const [cart, setCart] = useState([]);
  const [isCartOpen, setIsCartOpen] = useState(false);
  const [menuItems, setMenuItems] = useState([]);
  const [loading, setLoading] = useState(true);
  const [searchTerm, setSearchTerm] = useState('');
  const isBookingFlow = !!location.state?.date;

  useEffect(() => {
    api.get('/menu')
      .then(res => {
        // If the backend has no items, we might want to default to empty
        if (res.data.items && res.data.items.length > 0) {
          setMenuItems(res.data.items);
          setCategories(['All', ...res.data.categories]);
        }
        setLoading(false);
      })
      .catch(err => {
        console.error("Failed to load menu from server, using demo data instead", err);
        const demoData = {
          items: [
            { id: 1, name: 'Burrata & Heirloom Tomato', price: 680, category: 'Starters', isVegetarian: true, isSpicy: false, image: 'https://images.unsplash.com/photo-1540189549336-e6e99c3679fe?auto=format&fit=crop&w=800&q=80' },
            { id: 2, name: 'Pan-Seared Foie Gras', price: 1250, category: 'Starters', isVegetarian: false, isSpicy: false, image: 'https://images.unsplash.com/photo-1504674900247-0877df9cc836?auto=format&fit=crop&w=800&q=80' },
            { id: 3, name: 'Truffle Mushroom Arancini', price: 550, category: 'Starters', isVegetarian: true, isSpicy: false, image: 'https://images.unsplash.com/photo-1574484284002-952d92456975?auto=format&fit=crop&w=800&q=80' },
            { id: 4, name: 'Spicy Wagyu Carpaccio', price: 780, category: 'Starters', isVegetarian: false, isSpicy: true, image: '/images/wagyu_carpaccio.png' },
            { id: 5, name: 'Pan-Seared Hokkaido Scallops', price: 850, category: 'Starters', isVegetarian: false, isSpicy: false, image: '/images/hokkaido_scallops.png' },
            { id: 6, name: 'A5 Wagyu Beef Tenderloin', price: 3500, category: 'Mains', isVegetarian: false, isSpicy: false, image: 'https://images.unsplash.com/photo-1546964124-0cce460f38ef?auto=format&fit=crop&w=800&q=80' },
            { id: 7, name: 'Maine Lobster Ravioli', price: 1450, category: 'Mains', isVegetarian: false, isSpicy: false, image: 'https://images.unsplash.com/photo-1551183053-bf91a1d81141?auto=format&fit=crop&w=800&q=80' },
            { id: 8, name: 'Spicy Blue Crab Tagliolini', price: 950, category: 'Mains', isVegetarian: false, isSpicy: true, image: '/images/crab_tagliolini.png' },
            { id: 9, name: 'Mediterranean Pan-Seared Seabass', price: 980, category: 'Mains', isVegetarian: false, isSpicy: false, image: 'https://images.unsplash.com/photo-1519708227418-c8fd9a32b7a2?auto=format&fit=crop&w=800&q=80' },
            { id: 10, name: 'Pan-Seared Duck Breast', price: 890, category: 'Mains', isVegetarian: false, isSpicy: false, image: 'https://images.unsplash.com/photo-1518492104633-130d0cc84637?auto=format&fit=crop&w=800&q=80' },
            { id: 11, name: 'Pizza Margherita D.O.C.', price: 550, category: 'Artisan Pizza', isVegetarian: true, isSpicy: false, image: 'https://images.unsplash.com/photo-1604068549290-dea0e4a305ca?auto=format&fit=crop&w=800&q=80' },
            { id: 12, name: 'Pizza Black Truffle & Porcini', price: 890, category: 'Artisan Pizza', isVegetarian: true, isSpicy: false, image: 'https://images.unsplash.com/photo-1513104890138-7c749659a591?auto=format&fit=crop&w=800&q=80' },
            { id: 13, name: 'Pizza Diavola & Spicy Nduja', price: 690, category: 'Artisan Pizza', isVegetarian: false, isSpicy: true, image: 'https://images.unsplash.com/photo-1534308983496-4fabb1a015ee?auto=format&fit=crop&w=800&q=80' },
            { id: 14, name: 'Pizza Prosciutto di Parma & Burrata', price: 850, category: 'Artisan Pizza', isVegetarian: false, isSpicy: false, image: 'https://images.unsplash.com/photo-1574071318508-1cdbab80d002?auto=format&fit=crop&w=800&q=80' },
            { id: 15, name: 'Pizza 4 Formaggi & Organic Honey', price: 680, category: 'Artisan Pizza', isVegetarian: true, isSpicy: false, image: 'https://images.unsplash.com/photo-1593560708920-61dd98c46a4e?auto=format&fit=crop&w=800&q=80' },
            { id: 16, name: 'Pizza Spicy Seafood Marinara', price: 890, category: 'Artisan Pizza', isVegetarian: false, isSpicy: true, image: '/images/seafood_pizza.png' },
            { id: 17, name: 'Signature Deconstructed Tiramisu', price: 450, category: 'Desserts', isVegetarian: true, isSpicy: false, image: 'https://images.unsplash.com/photo-1571877227200-a0d98ea607e9?auto=format&fit=crop&w=800&q=80' },
            { id: 18, name: 'Deconstructed Lemon Meringue Tart', price: 420, category: 'Desserts', isVegetarian: true, isSpicy: false, image: 'https://images.unsplash.com/photo-1519869325930-281384150729?auto=format&fit=crop&w=800&q=80' },
            { id: 19, name: 'Warm Belgian Chocolate Lava Cake', price: 480, category: 'Desserts', isVegetarian: true, isSpicy: false, image: 'https://images.unsplash.com/photo-1606313564200-e75d5e30476c?auto=format&fit=crop&w=800&q=80' },
            { id: 20, name: 'Ruby Signature Cocktail', price: 550, category: 'Drinks', isVegetarian: true, isSpicy: false, image: 'https://images.unsplash.com/photo-1536935338788-846bb9981813?auto=format&fit=crop&w=800&q=80' },
            { id: 21, name: 'Smoked Rosemary Old Fashioned', price: 620, category: 'Drinks', isVegetarian: true, isSpicy: false, image: 'https://images.unsplash.com/photo-1514362545857-3bc16c4c7d1b?auto=format&fit=crop&w=800&q=80' },
            { id: 22, name: 'Alta Vigna - Cannonau di Sardegna', price: 2560, category: 'Premium Wines', isVegetarian: true, isSpicy: false, image: '/images/bottle_red_1779331900703.png' },
            { id: 23, name: 'Vento Rosso - Sardinian Rosé', price: 1820, category: 'Premium Wines', isVegetarian: true, isSpicy: false, image: '/images/bottle_rose_1779331914384.png' },
            { id: 24, name: 'Luce Di Terra - Isola dei Nuraghi', price: 3200, category: 'Premium Wines', isVegetarian: true, isSpicy: false, image: '/images/bottle_white_1779331929194.png' },
            { id: 25, name: 'Étoile d\'Or - Vintage Champagne Brut', price: 6500, category: 'Premium Wines', isVegetarian: true, isSpicy: false, image: '/images/wine_champagne.png' }
          ],
          categories: ['Starters', 'Mains', 'Artisan Pizza', 'Desserts', 'Drinks', 'Premium Wines']
        };
        setMenuItems(demoData.items);
        setCategories(['All', ...demoData.categories]);
        setLoading(false);
      });
  }, []);

  const categoryOrder = ['Starters', 'Mains', 'Artisan Pizza', 'Desserts', 'Drinks', 'Premium Wines'];
  const filteredMenu = menuItems
    .filter(item => {
      const matchesCategory = activeCategory === 'All' || item.category === activeCategory;
      const matchesSearch = item.name.toLowerCase().includes(searchTerm.toLowerCase()) || 
                            (item.description && item.description.toLowerCase().includes(searchTerm.toLowerCase()));
      return matchesCategory && matchesSearch;
    })
    .sort((a, b) => {
      let indexA = categoryOrder.indexOf(a.category);
      let indexB = categoryOrder.indexOf(b.category);
      if (indexA === -1) indexA = 999;
      if (indexB === -1) indexB = 999;
      return indexA - indexB;
    });

  const addToCart = (item) => {
    const existing = cart.find(c => c.id === item.id);
    if (existing) {
      setCart(cart.map(c => c.id === item.id ? { ...c, qty: c.qty + 1 } : c));
    } else {
      setCart([...cart, { ...item, qty: 1 }]);
    }
  };

  const updateQty = (id, delta) => {
    setCart(cart.map(c => {
      if (c.id === id) return { ...c, qty: c.qty + delta };
      return c;
    }).filter(c => c.qty > 0));
  };

  const total = cart.reduce((sum, item) => sum + (item.price * item.qty), 0);

  return (
    <div style={{ position: 'relative', minHeight: '100vh', fontFamily: 'var(--font)', color: '#F6F4EE', paddingBottom: 100 }}>
      
      {/* Background Image matching home page */}
      <div style={{
        position: 'fixed', inset: 0, zIndex: -1,
        background: 'linear-gradient(to bottom, rgba(15,5,5,0.85) 0%, rgba(5,5,5,0.95) 100%), url("https://images.unsplash.com/photo-1566417713940-fe7c737a9ef2?auto=format&fit=crop&w=1920&q=80")',
        backgroundSize: 'cover', backgroundPosition: 'center'
      }}></div>

      {/* Reusable Luxury Navbar */}
      <Navbar>
        {isBookingFlow && (
          <div className="pos-cart-actions">
            <button onClick={() => navigate('/checkout', { state: { ...location.state, cart } })} style={{ background: 'var(--brand-red)', border: 'none', color: '#fff', padding: '8px 16px', borderRadius: 'var(--radius-sm)', cursor: 'pointer', fontSize: '0.85rem', fontWeight: 600, textTransform: 'uppercase', letterSpacing: '1px' }}>
              {cart.length > 0 ? "Checkout" : "Skip to Checkout"}
            </button>
            <button onClick={() => setIsCartOpen(true)} style={{ background: 'none', border: 'none', color: '#F6F4EE', display: 'flex', alignItems: 'center', gap: 8, cursor: 'pointer', fontSize: '0.85rem', fontWeight: 600, textTransform: 'uppercase', letterSpacing: '1px', position: 'relative', transition: '0.2s' }} onMouseOver={e => e.currentTarget.style.color='var(--brand-red)'} onMouseOut={e => e.currentTarget.style.color='#F6F4EE'}>
              <ShoppingBag size={20} /> Cart
              {cart.length > 0 && (
                <span style={{ position: 'absolute', top: -8, right: -12, background: 'var(--brand-red)', color: '#fff', width: 20, height: 20, borderRadius: '50%', display: 'flex', alignItems: 'center', justifyContent: 'center', fontSize: '0.7rem' }}>{cart.length}</span>
              )}
            </button>
          </div>
        )}
      </Navbar>

      {/* Menu Header */}
      <div style={{ textAlign: 'center', padding: '64px 20px', background: 'linear-gradient(to bottom, rgba(15,5,5,0.6), rgba(5,5,5,0.8))', borderBottom: '1px solid rgba(246, 244, 238, 0.1)' }}>
        <h1 style={{ fontFamily: 'var(--font-serif)', fontSize: '3rem', fontWeight: 400, marginBottom: 16, color: '#F6F4EE' }}>Curated Selection</h1>
        <p style={{ color: '#C8C4B7', fontSize: '1rem', maxWidth: 600, margin: '0 auto', lineHeight: 1.6 }}>
          Indulge in our carefully crafted dishes, prepared with the finest ingredients.{isBookingFlow ? " Curate your dining experience by selecting your preferred dishes in advance." : ""}
        </p>
      </div>

      {/* Search Bar */}
      <div style={{ padding: '0 24px', maxWidth: 600, margin: '32px auto 0' }}>
        <input 
          type="text" 
          placeholder="Search for a dish..." 
          value={searchTerm}
          onChange={(e) => setSearchTerm(e.target.value)}
          style={{ width: '100%', padding: '14px 24px', borderRadius: 'var(--radius-full)', border: '1px solid rgba(246, 244, 238, 0.2)', background: 'rgba(255, 255, 255, 0.05)', color: '#F6F4EE', fontSize: '1rem', outline: 'none', transition: '0.2s' }}
          onFocus={e => e.currentTarget.style.borderColor = 'var(--brand-red)'}
          onBlur={e => e.currentTarget.style.borderColor = 'rgba(246, 244, 238, 0.2)'}
        />
      </div>

      {/* Categories */}
      <div className="menu-categories-wrapper">
        {categories.map(cat => (
          <button 
            key={cat} 
            onClick={() => setActiveCategory(cat)}
            className={`menu-category-btn ${activeCategory === cat ? 'active' : ''}`}
          >
            {cat}
          </button>
        ))}
      </div>

      {/* Menu Grid */}
      <div className="menu-items-grid">
        {filteredMenu.map(item => (
          <div key={item.id} style={{ display: 'flex', flexDirection: 'column' }}>
            <div style={{ position: 'relative', width: '100%', paddingTop: '100%', overflow: 'hidden', borderRadius: 'var(--radius-md)', marginBottom: 24, background: 'rgba(255, 255, 255, 0.05)', border: '1px solid rgba(246, 244, 238, 0.1)' }}>
              <img src={item.image} alt={item.name} style={{ position: 'absolute', top: 0, left: 0, width: '100%', height: '100%', objectFit: (item.category === 'Premium Wines' || item.name.includes('Evian')) ? 'contain' : 'cover', objectPosition: item.name === 'Madagascar Vanilla Crème Brûlée' ? '80% 50%' : (item.name.includes('Tokyo Sour') ? '80% 50%' : 'center'), transition: 'transform 0.5s ease', padding: (item.category === 'Premium Wines' || item.name.includes('Evian')) ? '20px' : '0' }} onMouseOver={e => e.currentTarget.style.transform = 'scale(1.05)'} onMouseOut={e => e.currentTarget.style.transform = 'scale(1)'} />
            </div>
            
            {/* Title with single clean header */}
            <div style={{ display: 'flex', flexDirection: 'column', gap: 4, marginBottom: 8 }}>
              <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'flex-start' }}>
                <h3 style={{ fontFamily: 'var(--font-serif)', fontSize: '1.4rem', fontWeight: 500, color: '#F6F4EE', margin: 0 }}>{item.name}</h3>
                <span style={{ fontSize: '1.2rem', fontWeight: 600, color: '#D4AF37', marginLeft: 8 }}>฿{item.price}</span>
              </div>
            </div>

            {/* Diet / Spiciness Badges */}
            {(item.isVegetarian || item.isSpicy) && (
              <div style={{ display: 'flex', gap: 8, marginBottom: 12 }}>
                {item.isVegetarian && (
                  <span style={{ 
                    display: 'inline-flex', alignItems: 'center', gap: 4, 
                    fontSize: '0.75rem', fontWeight: 600, color: '#10b981', 
                    background: 'rgba(16, 185, 129, 0.1)', padding: '4px 10px', 
                    borderRadius: 12, textTransform: 'uppercase', letterSpacing: '0.5px' 
                  }}>
                    <Leaf size={12} /> Vegetarian
                  </span>
                )}
                {item.isSpicy && (
                  <span style={{ 
                    display: 'inline-flex', alignItems: 'center', gap: 4, 
                    fontSize: '0.75rem', fontWeight: 600, color: '#ef4444', 
                    background: 'rgba(239, 68, 68, 0.1)', padding: '4px 10px', 
                    borderRadius: 12, textTransform: 'uppercase', letterSpacing: '0.5px' 
                  }}>
                    <Flame size={12} /> Spicy
                  </span>
                )}
              </div>
            )}
            <p style={{ color: '#C8C4B7', fontSize: '0.9rem', lineHeight: 1.6, marginBottom: 24, flex: 1 }}>{item.description}</p>
            {isBookingFlow && (
              <button onClick={() => addToCart(item)} style={{ background: 'transparent', color: '#F6F4EE', border: '1px solid rgba(246, 244, 238, 0.2)', padding: '12px', fontSize: '0.85rem', fontWeight: 600, textTransform: 'uppercase', letterSpacing: '1px', cursor: 'pointer', borderRadius: 'var(--radius-sm)', transition: '0.2s' }} onMouseOver={e => { e.currentTarget.style.background = 'var(--brand-red)'; e.currentTarget.style.color = '#fff'; e.currentTarget.style.borderColor = 'var(--brand-red)'; }} onMouseOut={e => { e.currentTarget.style.background = 'transparent'; e.currentTarget.style.color = '#F6F4EE'; e.currentTarget.style.borderColor = 'rgba(246, 244, 238, 0.2)'; }}>
                Add to selection
              </button>
            )}
          </div>
        ))}
      </div>

      {/* Cart Drawer */}
      <AnimatePresence>
        {isCartOpen && (
          <>
            <div onClick={() => setIsCartOpen(false)} style={{ position: 'fixed', inset: 0, background: 'rgba(0,0,0,0.6)', zIndex: 90, backdropFilter: 'blur(4px)' }}></div>
            <motion.div 
              initial={{ x: '100%' }} animate={{ x: 0 }} exit={{ x: '100%' }} transition={{ type: 'tween', duration: 0.3 }}
              style={{ position: 'fixed', top: 0, right: 0, bottom: 0, width: 400, background: '#0C0C0C', borderLeft: '1px solid rgba(246, 244, 238, 0.15)', zIndex: 100, display: 'flex', flexDirection: 'column', boxShadow: '-10px 0 30px rgba(0,0,0,0.5)' }}
            >
              <div style={{ padding: '32px 24px', borderBottom: '1px solid rgba(246, 244, 238, 0.15)', display: 'flex', justifyContent: 'space-between', alignItems: 'center', color: '#F6F4EE' }}>
                <h2 style={{ fontFamily: 'var(--font-serif)', fontSize: '1.5rem', fontWeight: 500 }}>Your Selection</h2>
                <button onClick={() => setIsCartOpen(false)} style={{ background: 'none', border: 'none', cursor: 'pointer', color: '#C8C4B7' }} onMouseOver={e => e.currentTarget.style.color='#F6F4EE'} onMouseOut={e => e.currentTarget.style.color='#C8C4B7'}><X size={24} /></button>
              </div>

              <div style={{ flex: 1, overflowY: 'auto', padding: 24 }}>
                {cart.length === 0 ? (
                  <div style={{ textAlign: 'center', color: '#C8C4B7', marginTop: 40 }}>Your selection is empty.</div>
                ) : (
                  cart.map(item => (
                    <div key={item.id} style={{ display: 'flex', gap: 16, marginBottom: 24 }}>
                      <img src={item.image} alt={item.name} style={{ width: 80, height: 80, objectFit: 'cover', borderRadius: 'var(--radius-sm)', border: '1px solid rgba(246, 244, 238, 0.1)' }} />
                      <div style={{ flex: 1 }}>
                        <h4 style={{ fontFamily: 'var(--font-serif)', fontSize: '1.1rem', fontWeight: 500, marginBottom: 4, color: '#F6F4EE' }}>{item.name}</h4>
                        <div style={{ color: '#D4AF37', fontWeight: 600, marginBottom: 8 }}>฿{item.price}</div>
                        <div style={{ display: 'flex', alignItems: 'center', gap: 16 }}>
                          <button onClick={() => updateQty(item.id, -1)} style={{ background: 'none', border: '1px solid rgba(246, 244, 238, 0.2)', borderRadius: '50%', width: 28, height: 28, display: 'flex', alignItems: 'center', justifyContent: 'center', cursor: 'pointer', color: '#F6F4EE' }} onMouseOver={e => e.currentTarget.style.borderColor='#F6F4EE'} onMouseOut={e => e.currentTarget.style.borderColor='rgba(246, 244, 238, 0.2)'}><Minus size={14}/></button>
                          <span style={{ fontSize: '0.9rem', fontWeight: 600, color: '#F6F4EE' }}>{item.qty}</span>
                          <button onClick={() => updateQty(item.id, 1)} style={{ background: 'none', border: '1px solid rgba(246, 244, 238, 0.2)', borderRadius: '50%', width: 28, height: 28, display: 'flex', alignItems: 'center', justifyContent: 'center', cursor: 'pointer', color: '#F6F4EE' }} onMouseOver={e => e.currentTarget.style.borderColor='#F6F4EE'} onMouseOut={e => e.currentTarget.style.borderColor='rgba(246, 244, 238, 0.2)'}><Plus size={14}/></button>
                        </div>
                      </div>
                    </div>
                  ))
                )}
              </div>

              {cart.length > 0 && (
                <div style={{ padding: 24, borderTop: '1px solid rgba(246, 244, 238, 0.15)', background: '#121212' }}>
                  <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: 24, color: '#F6F4EE' }}>
                    <span style={{ fontSize: '1.1rem', fontWeight: 600 }}>Subtotal</span>
                    <span style={{ fontSize: '1.4rem', fontWeight: 600, color: '#D4AF37' }}>฿{total.toLocaleString()}</span>
                  </div>
                  <button onClick={() => { setIsCartOpen(false); navigate('/checkout', { state: { ...location.state, cart } }); }} style={{ width: '100%', background: 'var(--brand-red)', color: '#fff', border: 'none', padding: 18, fontSize: '0.95rem', fontWeight: 600, textTransform: 'uppercase', letterSpacing: '2px', cursor: 'pointer', borderRadius: 'var(--radius-sm)', boxShadow: '0 4px 12px rgba(138,30,32,0.3)' }} onMouseOver={e => e.currentTarget.style.background='var(--brand-red-dark)'} onMouseOut={e => e.currentTarget.style.background='var(--brand-red)'}>
                    Continue to Booking
                  </button>
                </div>
              )}
            </motion.div>
          </>
        )}
      </AnimatePresence>
      <Footer />
    </div>
  );
}
