import { useState, useEffect } from 'react';

// Fallback high-quality mock product data matching new navigation categories
const MOCK_PRODUCTS = [
  {
    id: 1,
    name: 'Classic Black T-Shirt',
    description: '100% premium cotton classic black crewneck t-shirt with a comfortable fit.',
    price: 1500.00,
    image_url: 'https://images.unsplash.com/photo-1521572267360-ee0c2909d518?q=80&w=600&auto=format&fit=crop',
    category: 'TOPS',
    gender: 'UNISEX'
  },
  {
    id: 2,
    name: 'Blue Denim Jeans',
    description: 'Slim fit blue denim jeans crafted from high-quality stretchable fabric.',
    price: 3500.00,
    image_url: 'https://images.unsplash.com/photo-1542272604-787c3835535d?q=80&w=600&auto=format&fit=crop',
    category: 'DENIMS',
    gender: 'MEN'
  },
  {
    id: 3,
    name: 'Summer Floral Dress',
    description: 'Lightweight, flowy floral summer dress perfect for casual outings.',
    price: 4500.00,
    image_url: 'https://images.unsplash.com/photo-1595777457583-95e059d581b8?q=80&w=600&auto=format&fit=crop',
    category: 'TOPS',
    gender: 'WOMEN'
  },
  {
    id: 4,
    name: 'Moose Premium Hoodie',
    description: 'Cozy, heavyweight fleece hoodie designed for cool evenings and streetwear.',
    price: 5200.00,
    image_url: 'https://images.unsplash.com/photo-1556821840-3a63f95609a7?q=80&w=600&auto=format&fit=crop',
    category: 'HOODIES & SWEATERS',
    gender: 'UNISEX'
  },
  {
    id: 5,
    name: 'Rugged Cargo Pants',
    description: 'Multi-pocket cargo pants built with heavy-duty cotton ripstop fabric.',
    price: 3800.00,
    image_url: 'https://images.unsplash.com/photo-1517462964-21fdcec3f25b?q=80&w=600&auto=format&fit=crop',
    category: 'PANTS',
    gender: 'MEN'
  },
  {
    id: 6,
    name: 'Kafri Sports Cap',
    description: 'Breathable athletic cap featuring the Kafri crest. Perfect for cricket and outdoors.',
    price: 950.00,
    image_url: 'https://images.unsplash.com/photo-1588850561407-ed78c282e89b?q=80&w=600&auto=format&fit=crop',
    category: 'CRICKET',
    gender: 'UNISEX'
  }
];

function App() {
  const [products, setProducts] = useState(MOCK_PRODUCTS);
  const [loading, setLoading] = useState(true);
  const [cart, setCart] = useState([]);
  const [searchQuery, setSearchQuery] = useState('');
  const [selectedGender, setSelectedGender] = useState('ALL'); // 'WOMEN', 'MEN', 'UNISEX', 'CRICKET'
  const [selectedSubCategory, setSelectedSubCategory] = useState('ALL'); // 'TOPS', 'PANTS', 'SHORTS', 'DENIMS', 'HOODIES & SWEATERS'
  const [dbStatus, setDbStatus] = useState('Checking API...');
  const [selectedCategoryFilter, setSelectedCategoryFilter] = useState('All Categories');

  const API_URL = import.meta.env.VITE_API_URL || 'http://localhost:5000/api';

  useEffect(() => {
    // Fetch products from backend Node/MySQL API
    fetch(`${API_URL}/products`)
      .then((res) => {
        if (!res.ok) throw new Error('API server issue');
        return res.json();
      })
      .then((data) => {
        if (data.success && data.products && data.products.length > 0) {
          // Map backend category IDs to matching UI categories
          const mapped = data.products.map(p => {
            let cat = 'TOPS';
            let gend = 'UNISEX';
            if (p.category_id === 1) { cat = 'TOPS'; gend = 'UNISEX'; }
            else if (p.category_id === 2) { cat = 'DENIMS'; gend = 'MEN'; }
            else if (p.category_id === 3) { cat = 'TOPS'; gend = 'WOMEN'; }
            else { cat = 'PANTS'; }
            
            return {
              ...p,
              category: cat,
              gender: gend
            };
          });
          setProducts(mapped);
          setDbStatus('Connected to Backend (MySQL)');
        } else {
          setDbStatus('API Connected (No products, showing demo)');
        }
        setLoading(false);
      })
      .catch((err) => {
        console.warn('Backend API connection failed, using mock data:', err.message);
        setDbStatus('Backend Offline (Showing Demo/Mock Data)');
        setLoading(false);
      });
  }, [API_URL]);

  const addToCart = (product) => {
    setCart((prevCart) => {
      const existing = prevCart.find(item => item.id === product.id);
      if (existing) {
        return prevCart.map(item => 
          item.id === product.id ? { ...item, quantity: item.quantity + 1 } : item
        );
      }
      return [...prevCart, { ...product, quantity: 1 }];
    });
  };

  // Filter logic
  const filteredProducts = products.filter(product => {
    // Search Query Match
    const matchesSearch = product.name.toLowerCase().includes(searchQuery.toLowerCase()) || 
                          product.description.toLowerCase().includes(searchQuery.toLowerCase());
    
    // Main Tab Match (Gender/Collection)
    const matchesGender = selectedGender === 'ALL' || 
                          product.gender === selectedGender ||
                          (selectedGender === 'CRICKET' && product.category === 'CRICKET');

    // Sub Category Match
    const matchesSub = selectedSubCategory === 'ALL' || 
                       product.category === selectedSubCategory;

    return matchesSearch && matchesGender && matchesSub;
  });

  const cartTotalItems = cart.reduce((total, item) => total + item.quantity, 0);
  const cartTotalPrice = cart.reduce((total, item) => total + (item.price * item.quantity), 0);

  return (
    <div className="min-h-screen flex flex-col font-sans bg-neutral-50 text-neutral-900">
      
      {/* 1. TOP UTILITY NAVBAR (Premium dual-sided bar) */}
      <div className="bg-neutral-50 border-b border-neutral-200/60 text-[10px] font-bold text-neutral-600 tracking-wider">
        <div className="max-w-6xl mx-auto px-4 sm:px-6 lg:px-8 h-9 flex items-center justify-between">
          <div className="hidden sm:flex items-center gap-4 text-neutral-500">
            <span className="flex items-center gap-1">
              <svg xmlns="http://www.w3.org/2000/svg" className="h-3.5 w-3.5 text-[#901c1d]" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M3 5a2 2 0 012-2h3.28a1 1 0 01.94.725l.548 2.2a1 1 0 01-.321.988l-1.305.98a10.582 10.582 0 004.872 4.872l.98-1.305a1 1 0 01.988-.321l2.2.548a1 1 0 01.725.94V19a2 2 0 01-2 2h-1C9.716 21 3 14.284 3 6V5z" />
              </svg>
              Hotline: +94 74 2216 579
            </span>
            <span className="text-neutral-300">|</span>
            <span className="flex items-center gap-1 uppercase">
              🚀 FREE SHIPPING ON ORDERS OVER LKR 5,000!
            </span>
          </div>
          <div className="flex gap-6 ml-auto sm:ml-0">
            <a href="#" className="hover:text-[#901c1d] transition-colors">TRACK MY ORDER</a>
            <span className="text-neutral-300">|</span>
            <a href="#" className="hover:text-[#901c1d] transition-colors">JOURNAL</a>
            <span className="text-neutral-300">|</span>
            <a href="#" className="hover:text-[#901c1d] transition-colors">ABOUT US</a>
            <span className="text-neutral-300">|</span>
            <a href="#" className="hover:text-[#901c1d] transition-colors flex items-center gap-1">
              <svg xmlns="http://www.w3.org/2000/svg" className="h-3.5 w-3.5 text-[#901c1d]" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M17.657 16.657L13.414 20.9a1.998 1.998 0 01-2.827 0l-4.244-4.243a8 8 0 1111.314 0z" />
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M15 11a3 3 0 11-6 0 3 3 0 016 0z" />
              </svg>
              STORE LOCATOR
            </a>
          </div>
        </div>
      </div>

      {/* 2. MAIN NAVBAR (White background, premium look with active/hover red text & under-indicators) */}
      <header className="bg-white/95 backdrop-blur-md text-zinc-800 z-50 sticky top-0 shadow-sm border-b border-neutral-200/80">
        <div className="max-w-6xl mx-auto px-4 sm:px-6 lg:px-8 h-16 flex items-center justify-between gap-4">
          
          {/* Logo container with rounded double border frames */}
          <div className="flex items-center flex-shrink-0">
            <a href="/" className="bg-white p-2 rounded-md shadow-sm border border-neutral-200/80 hover:scale-[1.02] transition-transform duration-300 flex items-center justify-center">
              <img 
                src="/kafrilogo.png" 
                alt="Kafri Fashion Logo" 
                className="h-9 w-auto object-contain"
                onError={(e) => {
                  e.target.style.display = 'none';
                  e.target.parentNode.innerHTML = '<span class="text-[#901c1d] font-black text-xl tracking-tighter">KAFRI</span>';
                }}
              />
            </a>
          </div>

          {/* Center Main Categories Menu with Sleek Under-Line Indicators */}
          <nav className="hidden lg:flex items-center h-full gap-8 text-[11px] font-black tracking-widest">
            <button 
              onClick={() => { setSelectedGender('WOMEN'); setSelectedSubCategory('ALL'); }}
              className={`h-16 relative transition-colors uppercase ${
                selectedGender === 'WOMEN' ? 'text-[#901c1d]' : 'text-zinc-600 hover:text-[#901c1d]'
              }`}
            >
              <span className="relative py-1.5">
                WOMEN
                {selectedGender === 'WOMEN' && (
                  <span className="absolute -bottom-1 left-1/2 -translate-x-1/2 w-8 h-0.5 bg-[#901c1d] rounded-full" />
                )}
              </span>
            </button>
            <button 
              onClick={() => { setSelectedGender('MEN'); setSelectedSubCategory('ALL'); }}
              className={`h-16 relative transition-colors uppercase ${
                selectedGender === 'MEN' ? 'text-[#901c1d]' : 'text-zinc-600 hover:text-[#901c1d]'
              }`}
            >
              <span className="relative py-1.5">
                MEN
                {selectedGender === 'MEN' && (
                  <span className="absolute -bottom-1 left-1/2 -translate-x-1/2 w-8 h-0.5 bg-[#901c1d] rounded-full" />
                )}
              </span>
            </button>
            <button 
              onClick={() => { setSelectedGender('UNISEX'); setSelectedSubCategory('ALL'); }}
              className={`h-16 relative transition-colors uppercase ${
                selectedGender === 'UNISEX' ? 'text-[#901c1d]' : 'text-zinc-600 hover:text-[#901c1d]'
              }`}
            >
              <span className="relative py-1.5">
                UNISEX
                {selectedGender === 'UNISEX' && (
                  <span className="absolute -bottom-1 left-1/2 -translate-x-1/2 w-8 h-0.5 bg-[#901c1d] rounded-full" />
                )}
              </span>
            </button>
            <button 
              onClick={() => { setSelectedGender('CRICKET'); setSelectedSubCategory('ALL'); }}
              className={`h-16 relative transition-colors uppercase ${
                selectedGender === 'CRICKET' ? 'text-[#901c1d]' : 'text-zinc-600 hover:text-[#901c1d]'
              }`}
            >
              <span className="relative py-1.5">
                CRICKET
                {selectedGender === 'CRICKET' && (
                  <span className="absolute -bottom-1 left-1/2 -translate-x-1/2 w-8 h-0.5 bg-[#901c1d] rounded-full" />
                )}
              </span>
            </button>
            <button 
              onClick={() => { setSelectedGender('ALL'); setSelectedSubCategory('ALL'); }}
              className={`h-16 relative transition-colors uppercase ${
                selectedGender === 'ALL' && selectedSubCategory === 'ALL' ? 'text-[#901c1d]' : 'text-zinc-600 hover:text-[#901c1d]'
              }`}
            >
              <span className="relative py-1.5">
                GIFT CARD
                {selectedGender === 'ALL' && selectedSubCategory === 'ALL' && (
                  <span className="absolute -bottom-1 left-1/2 -translate-x-1/2 w-8 h-0.5 bg-[#901c1d] rounded-full" />
                )}
              </span>
            </button>
          </nav>

          {/* Search bar & Cart area */}
          <div className="flex items-center gap-4 flex-grow max-w-md justify-end lg:flex-grow-0">
            
            {/* Search Input Box with Focus Glow (Light mode matching white navbar) */}
            <div className="relative flex items-center bg-neutral-100 border border-neutral-200 focus-within:border-[#901c1d] focus-within:ring-2 focus-within:ring-[#901c1d]/10 transition-all rounded-md h-10 px-3 w-48 sm:w-64">
              <svg xmlns="http://www.w3.org/2000/svg" className="h-4 w-4 text-neutral-400 mr-2 flex-shrink-0" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M21 21l-6-6m2-5a7 7 0 11-14 0 7 7 0 0114 0z" />
              </svg>
              <input 
                type="text" 
                placeholder="Search me!" 
                value={searchQuery}
                onChange={(e) => setSearchQuery(e.target.value)}
                className="bg-transparent text-xs w-full focus:outline-none placeholder-neutral-400 text-neutral-800"
              />
              {/* Category Dropdown */}
              <div className="border-l border-neutral-300 pl-2 ml-2 hidden sm:block flex-shrink-0">
                <select 
                  value={selectedCategoryFilter}
                  onChange={(e) => {
                    setSelectedCategoryFilter(e.target.value);
                    if (e.target.value === 'All Categories') {
                      setSelectedSubCategory('ALL');
                    } else {
                      setSelectedSubCategory(e.target.value);
                    }
                  }}
                  className="bg-transparent text-[10px] text-neutral-500 focus:outline-none cursor-pointer pr-4 font-bold"
                >
                  <option value="All Categories">Category</option>
                  <option value="TOPS">Tops</option>
                  <option value="PANTS">Pants</option>
                  <option value="DENIMS">Denims</option>
                  <option value="HOODIES & SWEATERS">Hoodies</option>
                </select>
              </div>
            </div>

            {/* Shopping Cart Bag with orange badge */}
            <button className="relative p-2 text-zinc-600 hover:text-[#901c1d] hover:scale-105 transition-all flex items-center gap-1">
              <svg xmlns="http://www.w3.org/2000/svg" className="h-6 w-6 text-amber-500" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M16 11V7a4 4 0 00-8 0v4M5 9h14l1 12H4L5 9z" />
              </svg>
              {cartTotalItems > 0 ? (
                <span className="absolute -top-1 -right-1 bg-[#901c1d] text-white text-[10px] font-black rounded-full w-5 h-5 flex items-center justify-center shadow-md">
                  {cartTotalItems}
                </span>
              ) : (
                <span className="bg-[#901c1d]/10 text-[#901c1d] text-[10px] font-bold rounded-full w-5 h-5 flex items-center justify-center">
                  0
                </span>
              )}
            </button>

            {/* Login / Register */}
            <a href="#" className="hidden md:block text-xs font-bold text-zinc-600 hover:text-[#901c1d] transition-colors">
              Login / Register
            </a>
          </div>

        </div>
      </header>

      {/* 3. SUB-NAVBAR (Black background, capsule badge horizontal scroll items) */}
      <div className="bg-black border-t border-zinc-900 py-2.5">
        <div className="max-w-6xl mx-auto px-4 sm:px-6 lg:px-8 flex items-center gap-3 overflow-x-auto whitespace-nowrap scrollbar-none">
          <button 
            onClick={() => { setSelectedSubCategory('ALL'); setSelectedGender('ALL'); }}
            className={`px-4 py-1.5 rounded-full text-[10px] font-black tracking-widest uppercase transition-all duration-300 ${
              selectedSubCategory === 'ALL' 
                ? 'bg-[#901c1d] text-white shadow' 
                : 'bg-zinc-900 text-zinc-400 hover:text-white hover:bg-zinc-800'
            }`}
          >
            ALL COLLECTIONS
          </button>
          <button 
            onClick={() => setSelectedSubCategory('TOPS')}
            className={`px-4 py-1.5 rounded-full text-[10px] font-black tracking-widest uppercase transition-all duration-300 ${
              selectedSubCategory === 'TOPS' 
                ? 'bg-[#901c1d] text-white shadow' 
                : 'bg-zinc-900 text-zinc-400 hover:text-white hover:bg-zinc-800'
            }`}
          >
            TOPS
          </button>
          <button 
            onClick={() => setSelectedSubCategory('PANTS')}
            className={`px-4 py-1.5 rounded-full text-[10px] font-black tracking-widest uppercase transition-all duration-300 ${
              selectedSubCategory === 'PANTS' 
                ? 'bg-[#901c1d] text-white shadow' 
                : 'bg-zinc-900 text-zinc-400 hover:text-white hover:bg-zinc-800'
            }`}
          >
            PANTS
          </button>
          <button 
            onClick={() => setSelectedSubCategory('SHORTS')}
            className={`px-4 py-1.5 rounded-full text-[10px] font-black tracking-widest uppercase transition-all duration-300 ${
              selectedSubCategory === 'SHORTS' 
                ? 'bg-[#901c1d] text-white shadow' 
                : 'bg-zinc-900 text-zinc-400 hover:text-white hover:bg-zinc-800'
            }`}
          >
            SHORTS
          </button>
          <button 
            onClick={() => setSelectedSubCategory('DENIMS')}
            className={`px-4 py-1.5 rounded-full text-[10px] font-black tracking-widest uppercase transition-all duration-300 ${
              selectedSubCategory === 'DENIMS' 
                ? 'bg-[#901c1d] text-white shadow' 
                : 'bg-zinc-900 text-zinc-400 hover:text-white hover:bg-zinc-800'
            }`}
          >
            DENIMS
          </button>
          <button 
            onClick={() => setSelectedSubCategory('HOODIES & SWEATERS')}
            className={`px-4 py-1.5 rounded-full text-[10px] font-black tracking-widest uppercase transition-all duration-300 ${
              selectedSubCategory === 'HOODIES & SWEATERS' 
                ? 'bg-[#901c1d] text-white shadow' 
                : 'bg-zinc-900 text-zinc-400 hover:text-white hover:bg-zinc-800'
            }`}
          >
            HOODIES & SWEATERS
          </button>
        </div>
      </div>

      {/* 4. PREMIUM HERO BANNER (Maroon theme with deep gradients, White details) */}
      <section className="relative overflow-hidden bg-gradient-to-br from-[#580202] via-[#901c1d] to-[#580202] text-white py-20 lg:py-28 px-4 sm:px-6 lg:px-8">
        
        {/* Soft glowing decorations */}
        <div className="absolute top-0 left-0 w-96 h-96 bg-white/5 rounded-full blur-3xl pointer-events-none" />
        <div className="absolute bottom-0 right-0 w-96 h-96 bg-black/35 rounded-full blur-3xl pointer-events-none" />

        <div className="relative max-w-6xl mx-auto z-10 grid grid-cols-1 lg:grid-cols-2 gap-12 items-center">
          
          {/* Hero text section */}
          <div className="flex flex-col items-start justify-center">
            <span className="inline-block uppercase tracking-widest text-xs font-bold text-white/80 mb-3 bg-white/10 px-4 py-1.5 rounded-full backdrop-blur-sm border border-white/20">
              KAFRI FASHION OFFICIAL STORE
            </span>
            <h1 className="text-4xl sm:text-6xl font-extrabold tracking-tight max-w-xl mb-6 leading-tight">
              Where Style <br/>Meets Comfort.
            </h1>
            <p className="text-sm sm:text-base text-white/90 max-w-lg mb-8 leading-relaxed font-light">
              Explore the latest collections designed using the finest fabrics. Find your perfect fit across Denim, Tops, Sweaters, and Cricket gears with Kafri.
            </p>
            <div className="flex flex-wrap gap-4">
              <a 
                href="#shop-section" 
                className="bg-white text-[#901c1d] px-8 py-3.5 rounded text-xs font-black tracking-widest uppercase hover:bg-neutral-100 transition-colors shadow-lg"
              >
                SHOP COLLECTION
              </a>
              <a 
                href="#" 
                className="border-2 border-white text-white px-8 py-3.5 rounded text-xs font-black tracking-widest uppercase hover:bg-white/10 transition-colors"
              >
                DISCOVER MORE
              </a>
            </div>
          </div>

          {/* Hero visual elements - Unsplash high fashion photo overlaid with maroon theme elements */}
          <div className="relative mx-auto lg:ml-auto max-w-md lg:max-w-none w-full aspect-w-4 aspect-h-5 lg:aspect-square">
            <div className="absolute inset-0 bg-[#901c1d]/10 rounded-xl border border-white/20 -rotate-3 z-0" />
            <div className="absolute inset-0 bg-black/20 rounded-xl border border-white/10 rotate-3 z-0" />
            
            <div className="relative z-10 rounded-xl overflow-hidden shadow-2xl border-4 border-white/95">
              <img 
                src="https://images.unsplash.com/photo-1490481651871-ab68de25d43d?q=80&w=800&auto=format&fit=crop" 
                alt="Kafri Fashion Models Collection" 
                className="w-full h-full object-cover object-center"
              />
              <div className="absolute inset-0 bg-gradient-to-t from-black/60 via-transparent to-transparent" />
              <div className="absolute bottom-6 left-6 right-6">
                <p className="text-white text-xs font-bold tracking-widest uppercase">Premium Fabrics. Perfect Cuts.</p>
                <p className="text-white/80 text-[10px] uppercase mt-1">Starting from LKR 950.00</p>
              </div>
            </div>
          </div>

        </div>
      </section>

      {/* 5. DATABASE CONNECTION / DEMO STATUS BAR */}
      <div className="bg-zinc-100 border-b border-zinc-200 py-2">
        <div className="max-w-6xl mx-auto px-4 sm:px-6 lg:px-8 flex items-center justify-between text-xs text-neutral-500 font-medium">
          <div className="flex items-center gap-2">
            <span className="font-bold text-neutral-700">Database Connection Status:</span>
            <span className={`inline-flex items-center px-2 py-0.5 rounded-full text-[10px] font-bold border ${
              dbStatus.includes('Connected') 
                ? 'bg-emerald-50 text-emerald-700 border-emerald-200' 
                : 'bg-amber-50 text-amber-700 border-amber-200'
            }`}>
              <span className={`w-1.5 h-1.5 mr-1.5 rounded-full ${
                dbStatus.includes('Connected') ? 'bg-emerald-500 animate-pulse' : 'bg-amber-500'
              }`} />
              {dbStatus}
            </span>
          </div>
          <div>
            Showing: <span className="font-bold text-neutral-700">{filteredProducts.length} items</span>
          </div>
        </div>
      </div>

      {/* 6. MAIN SHOPPING CONTENT AREA */}
      <main id="shop-section" className="flex-grow max-w-6xl w-full mx-auto px-4 sm:px-6 lg:px-8 py-12">
        
        {/* Dynamic Filters header bar */}
        <div className="flex flex-col md:flex-row justify-between items-start md:items-center border-b border-neutral-200 pb-4 mb-8">
          <div>
            <h2 className="text-2xl font-black text-neutral-900 tracking-tight">
              {selectedGender} {selectedSubCategory === 'ALL' ? 'COLLECTION' : `/ ${selectedSubCategory}`}
            </h2>
            <p className="text-neutral-500 text-xs mt-1">Explore our range of comfortable clothing items</p>
          </div>
          
          {/* Active Filter Badges */}
          <div className="flex flex-wrap gap-2 mt-4 md:mt-0">
            {(selectedGender !== 'ALL' || selectedSubCategory !== 'ALL' || searchQuery) && (
              <button 
                onClick={() => { setSelectedGender('ALL'); setSelectedSubCategory('ALL'); setSearchQuery(''); }}
                className="text-xs font-bold text-[#901c1d] border border-[#901c1d]/30 hover:border-[#901c1d] px-3 py-1 rounded bg-[#901c1d]/5 transition-colors flex items-center gap-1"
              >
                Clear Filters
                <svg xmlns="http://www.w3.org/2000/svg" className="h-3.5 w-3.5" viewBox="0 0 20 20" fill="currentColor">
                  <path fillRule="evenodd" d="M4.293 4.293a1 1 0 011.414 0L10 8.586l4.293-4.293a1 1 0 111.414 1.414L11.414 10l4.293 4.293a1 1 0 01-1.414 1.414L10 11.414l-4.293 4.293a1 1 0 01-1.414-1.414L8.586 10 4.293 5.707a1 1 0 010-1.414z" clipRule="evenodd" />
                </svg>
              </button>
            )}
          </div>
        </div>

        {/* Loading Indicator */}
        {loading ? (
          <div className="flex justify-center items-center py-24">
            <div className="animate-spin rounded-full h-12 w-12 border-t-2 border-b-2 border-[#901c1d]" />
          </div>
        ) : (
          /* Products Grid with Skye Clothing Inspired Design */
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-x-8 gap-y-12">
            {filteredProducts.map((product) => {
              const discountedPrice = parseFloat(product.price);
              const originalPrice = Math.round(discountedPrice / 0.6 / 10) * 10;
              const installmentPrice = Math.round(discountedPrice / 3);

              return (
                <div 
                  key={product.id} 
                  className="group bg-transparent overflow-hidden flex flex-col items-center"
                >
                  {/* Product Image */}
                  <div className="w-full aspect-[3/4] relative overflow-hidden bg-neutral-100 rounded-sm shadow-sm border border-neutral-100">
                    <img 
                      src={product.image_url} 
                      alt={product.name} 
                      className="w-full h-full object-cover object-center group-hover:scale-102 transition-transform duration-500"
                    />
                    
                    {/* Orange discount ribbon on top-left */}
                    <div className="absolute top-4 left-4">
                      <span className="bg-[#ff5500] text-white text-[10px] font-black px-2.5 py-1 uppercase tracking-wider">
                        UP TO - 40%
                      </span>
                    </div>

                    {/* Subtle watermarked logo on bottom-right */}
                    <div className="absolute bottom-4 right-4 flex items-center gap-1 opacity-50 pointer-events-none">
                      <div className="flex flex-col items-end">
                        <span className="text-[9px] font-black text-white tracking-widest uppercase">KAFRI</span>
                        <span className="text-[5px] font-bold text-white tracking-widest uppercase -mt-0.5">CLOTHING</span>
                      </div>
                    </div>

                    {/* Premium Add to Bag Hover Overlay */}
                    <div className="absolute inset-0 bg-black/25 opacity-0 group-hover:opacity-100 transition-opacity duration-300 flex items-center justify-center p-4">
                      <button 
                        onClick={() => addToCart(product)}
                        className="bg-white text-zinc-950 font-black tracking-widest text-[10px] py-3 px-6 rounded shadow hover:bg-neutral-100 transition-colors w-11/12 uppercase"
                      >
                        ADD TO BAG
                      </button>
                    </div>
                  </div>

                  {/* Product Details Section (Center aligned) */}
                  <div className="pt-5 pb-1 flex flex-col items-center w-full text-center">
                    {/* Product Name */}
                    <h3 className="text-sm font-black text-neutral-900 tracking-wider uppercase mb-1.5 leading-snug">
                      {product.name}
                    </h3>

                    {/* Price Block */}
                    <div className="flex items-center justify-center gap-3 text-sm font-black mb-1.5">
                      <span className="text-zinc-400 line-through text-xs font-semibold">
                        රු.{originalPrice.toLocaleString('en-LK', { minimumFractionDigits: 2, maximumFractionDigits: 2 })}
                      </span>
                      <span className="text-neutral-800">
                        රු.{discountedPrice.toLocaleString('en-LK', { minimumFractionDigits: 2, maximumFractionDigits: 2 })}
                      </span>
                    </div>

                    {/* Installments Block 1 (Mintpay) */}
                    <div className="flex items-center justify-center gap-1.5 text-[9px] text-zinc-500 font-bold leading-tight">
                      <span>3 X Rs. {installmentPrice.toLocaleString('en-LK', { minimumFractionDigits: 0, maximumFractionDigits: 2 })} or 8% Cashback with</span>
                      <span className="bg-[#0f172a] text-white px-1.5 py-0.5 rounded-[2px] text-[7px] font-black tracking-tighter italic uppercase">
                        mintpay
                      </span>
                      <button className="text-zinc-400 hover:text-zinc-600 transition-colors" title="More info">
                        <svg xmlns="http://www.w3.org/2000/svg" className="h-3 w-3" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M13 16h-1v-4h-1m1-4h.01M21 12a9 9 0 11-18 0 9 9 0 0118 0z" />
                        </svg>
                      </button>
                    </div>

                    {/* Installments Block 2 (Koko) */}
                    <div className="flex items-center justify-center gap-1.5 text-[9px] text-zinc-500 font-bold mt-1 leading-tight">
                      <span>or 3 X රු. {installmentPrice.toLocaleString('en-LK', { minimumFractionDigits: 0, maximumFractionDigits: 2 })} with</span>
                      <span className="text-[#a855f7] bg-purple-50 border border-purple-100 px-1 py-0.25 rounded-[2px] text-[7.5px] font-black tracking-tight lowercase">
                        koko
                      </span>
                      <button className="text-zinc-400 hover:text-zinc-600 transition-colors" title="More info">
                        <svg xmlns="http://www.w3.org/2000/svg" className="h-3 w-3" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M13 16h-1v-4h-1m1-4h.01M21 12a9 9 0 11-18 0 9 9 0 0118 0z" />
                        </svg>
                      </button>
                    </div>

                  </div>
                </div>
              );
            })}
          </div>
        )}

        {/* Empty state */}
        {!loading && filteredProducts.length === 0 && (
          <div className="text-center py-24 border border-dashed border-neutral-300 rounded-lg">
            <svg xmlns="http://www.w3.org/2000/svg" className="h-10 w-10 text-neutral-300 mx-auto mb-3" fill="none" viewBox="0 0 24 24" stroke="currentColor">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M3 3h2l.4 2M7 13h10l4-8H5.4M7 13L5.4 5M7 13l-2.293 2.293c-.63.63-.184 1.707.707 1.707H17m0 0a2 2 0 100 4 2 2 0 000-4zm-8 2a2 2 0 11-4 0 2 2 0 014 0z" />
            </svg>
            <p className="text-neutral-500 text-sm font-bold">No clothing items match your search or filter tags.</p>
            <button 
              onClick={() => { setSelectedGender('ALL'); setSelectedSubCategory('ALL'); setSearchQuery(''); }}
              className="mt-4 text-xs font-extrabold text-[#901c1d] underline hover:no-underline"
            >
              Reset filters and try again
            </button>
          </div>
        )}
      </main>

      {/* 7. CART SIDE DRAWER MODAL (Pops out when items added) */}
      {cart.length > 0 && (
        <div className="fixed bottom-6 right-6 z-40 bg-white border border-neutral-200 rounded-lg shadow-2xl p-6 max-w-sm w-full">
          <div className="flex items-center justify-between border-b border-neutral-100 pb-3 mb-4">
            <h4 className="font-bold text-neutral-900 text-sm tracking-wider uppercase">Bag Summary ({cartTotalItems})</h4>
            <button 
              onClick={() => setCart([])} 
              className="text-[10px] text-neutral-400 hover:text-[#901c1d] font-bold uppercase tracking-wider"
            >
              Clear Bag
            </button>
          </div>
          <div className="max-h-32 overflow-y-auto mb-4 space-y-3">
            {cart.map((item) => (
              <div key={item.id} className="flex justify-between text-xs items-center">
                <div className="truncate max-w-[200px]">
                  <span className="font-bold text-neutral-800">{item.name}</span>
                  <span className="text-[10px] text-neutral-400 block">Quantity: {item.quantity}</span>
                </div>
                <span className="font-bold text-neutral-800 text-right">LKR {(item.price * item.quantity).toLocaleString()}</span>
              </div>
            ))}
          </div>
          <div className="border-t border-neutral-100 pt-3 flex justify-between items-center mb-4">
            <span className="text-xs font-bold text-neutral-600 uppercase">Subtotal:</span>
            <span className="text-base font-extrabold text-neutral-950">LKR {cartTotalPrice.toLocaleString()}</span>
          </div>
          <button className="w-full bg-[#901c1d] hover:bg-[#580202] text-white font-extrabold py-2.5 rounded text-xs uppercase tracking-widest transition-colors">
            Proceed to Checkout
          </button>
        </div>
      )}

      {/* 8. FOOTER (Black background, white brandings, bottom maroon touches) */}
      <footer className="bg-black text-neutral-400 border-t border-zinc-900">
        <div className="max-w-6xl mx-auto px-4 sm:px-6 lg:px-8 py-16 grid grid-cols-1 md:grid-cols-4 gap-12">
          <div className="md:col-span-2">
            <div className="bg-white p-2 w-32 rounded flex items-center justify-center mb-4">
              <img 
                src="/kafrilogo.png" 
                alt="Kafri Logo" 
                className="h-8 w-auto object-contain"
                onError={(e) => {
                  e.target.style.display = 'none';
                  e.target.parentNode.innerHTML = '<span class="text-[#901c1d] font-black text-lg tracking-tighter">KAFRI</span>';
                }}
              />
            </div>
            <p className="text-xs leading-relaxed text-neutral-500 max-w-sm">
              Kafri Fashion is your premium destination for high-quality clothing. Explore casualwear, denim, cricket gear, and accessories.
            </p>
          </div>
          <div>
            <h4 className="text-white text-xs font-bold uppercase tracking-widest mb-4">Categories</h4>
            <ul className="space-y-2 text-xs">
              <li><a href="#" className="hover:text-white transition-colors" onClick={() => setSelectedSubCategory('TOPS')}>Tops</a></li>
              <li><a href="#" className="hover:text-white transition-colors" onClick={() => setSelectedSubCategory('PANTS')}>Pants</a></li>
              <li><a href="#" className="hover:text-white transition-colors" onClick={() => setSelectedSubCategory('DENIMS')}>Denims</a></li>
              <li><a href="#" className="hover:text-white transition-colors" onClick={() => setSelectedSubCategory('HOODIES & SWEATERS')}>Hoodies & Sweaters</a></li>
            </ul>
          </div>
          <div>
            <h4 className="text-white text-xs font-bold uppercase tracking-widest mb-4">Contact info</h4>
            <ul className="space-y-2 text-xs">
              <li>Email: contact@kafrifashion.com</li>
              <li>Store Location: Colombo, Sri Lanka</li>
              <li>© {new Date().getFullYear()} Kafri Fashion.</li>
            </ul>
          </div>
        </div>
        <div className="bg-[#580202] h-1.5" />
      </footer>
    </div>
  );
}

export default App;
