// Shared JS for navigation, carousels, and dynamic content placeholders

(function () {
  const mobileMenuBtn = document.getElementById('mobileMenuBtn');
  const mobileMenu = document.getElementById('mobileMenu');
  if (mobileMenuBtn && mobileMenu) {
    mobileMenuBtn.addEventListener('click', () => {
      mobileMenu.classList.toggle('hidden');
    });
  }

  const yearEl = document.getElementById('year');
  if (yearEl) yearEl.textContent = new Date().getFullYear();
  
  // Sticky header shadow on scroll
  const header = document.querySelector('header');
  if (header) {
    const onScroll = () => {
      if (window.scrollY > 4) header.classList.add('scrolled');
      else header.classList.remove('scrolled');
    };
    window.addEventListener('scroll', onScroll, { passive: true });
    onScroll();
  }

  // Reveal-on-scroll animations
  const reveals = document.querySelectorAll('.reveal');
  if ('IntersectionObserver' in window && reveals.length) {
    const io = new IntersectionObserver((entries) => {
      entries.forEach((entry) => {
        if (entry.isIntersecting) {
          entry.target.classList.add('in');
          io.unobserve(entry.target);
        }
      });
    }, { threshold: 0.15 });
    reveals.forEach((el) => io.observe(el));
  } else {
    reveals.forEach((el) => el.classList.add('in'));
  }

  // Smooth anchor scrolling
  document.querySelectorAll('a[href^="#"]').forEach((a) => {
    a.addEventListener('click', (e) => {
      const id = a.getAttribute('href');
      if (id && id.length > 1) {
        const target = document.querySelector(id);
        if (target) {
          e.preventDefault();
          target.scrollIntoView({ behavior: 'smooth', block: 'start' });
        }
      }
    });
  });
})();

// Home page interactions
(function () {
  const heroImages = [
    'https://images.unsplash.com/photo-1548013146-72479768bada?q=80&w=1600&auto=format&fit=crop',
    'https://images.unsplash.com/photo-1526779259212-939e64788e3c?q=80&w=1600&auto=format&fit=crop',
    'https://images.unsplash.com/photo-1488085061387-422e29b40080?q=80&w=1600&auto=format&fit=crop'
  ];
  let heroIndex = 0;
  const heroImageEl = document.getElementById('heroImage');
  const heroPrev = document.getElementById('heroPrev');
  const heroNext = document.getElementById('heroNext');
  if (heroImageEl && heroPrev && heroNext) {
    const setHero = (idx) => {
      heroIndex = (idx + heroImages.length) % heroImages.length;
      heroImageEl.src = heroImages[heroIndex];
    };
    heroPrev.addEventListener('click', () => setHero(heroIndex - 1));
    heroNext.addEventListener('click', () => setHero(heroIndex + 1));
    setInterval(() => setHero(heroIndex + 1), 6000);
  }

  const customTripForm = document.getElementById('customTripForm');
  const customTripMsg = document.getElementById('customTripMsg');
  if (customTripForm && customTripMsg) {
    customTripForm.addEventListener('submit', (e) => {
      e.preventDefault();
      customTripMsg.classList.remove('hidden');
      customTripForm.reset();
    });
  }

  // Populate featured sections with sample cards
  function createCard({ title, subtitle, image, href }) {
    const div = document.createElement('div');
    div.className = 'group border border-gray-200 rounded-xl overflow-hidden hover:shadow-lg hover:-translate-y-0.5 transition bg-white';
    div.innerHTML = `
      <a href="${href || '#'}" class="block">
        <div class="aspect-video bg-gray-100">
          <img src="${image}" alt="${title}" class="w-full h-full object-cover transition-transform duration-300 group-hover:scale-[1.03]" />
        </div>
        <div class="p-4">
          <p class="font-medium">${title}</p>
          <p class="text-sm text-gray-600">${subtitle}</p>
        </div>
      </a>
    `;
    return div;
  }

  const featuredHotels = document.getElementById('featuredHotels');
  if (featuredHotels) {
    [
      { title: 'Seaside Resort', subtitle: 'Goa · 5★', image: 'https://images.unsplash.com/photo-1540541338287-41700207dee6?q=80&w=1200&auto=format&fit=crop', href: 'hotel-details.html' },
      { title: 'Royal Palace', subtitle: 'Jaipur · 5★', image: 'https://images.unsplash.com/photo-1551882547-ff40c63fe5fa?q=80&w=1200&auto=format&fit=crop', href: 'hotel-details.html' },
      { title: 'Mountain Retreat', subtitle: 'Manali · 4★', image: 'https://images.unsplash.com/photo-1499793983690-e29da59ef1c2?q=80&w=1200&auto=format&fit=crop', href: 'hotel-details.html' },
      { title: 'City Business Hotel', subtitle: 'Kolkata · 4★', image: 'https://images.unsplash.com/photo-1564501049412-61c2a3083791?q=80&w=1200&auto=format&fit=crop', href: 'hotel-details.html' }
    ].forEach(card => featuredHotels.appendChild(createCard(card)));
  }

  const featuredDestinations = document.getElementById('featuredDestinations');
  if (featuredDestinations) {
    [
      { title: 'Kashmir', subtitle: '7D/6N', image: 'https://images.unsplash.com/photo-1615909692708-33ea538408c4?q=80&w=1200&auto=format&fit=crop', href: 'destination-details.html' },
      { title: 'Rajasthan', subtitle: '6D/5N', image: 'https://images.unsplash.com/photo-1588099768531-a7f85a5b4a10?q=80&w=1200&auto=format&fit=crop', href: 'destination-details.html' },
      { title: 'Sikkim', subtitle: '5D/4N', image: 'https://images.unsplash.com/photo-1629932628390-62ae9f9a3d1e?q=80&w=1200&auto=format&fit=crop', href: 'destination-details.html' },
      { title: 'Thailand', subtitle: '5D/4N', image: 'https://images.unsplash.com/photo-1506126613408-eca07ce68773?q=80&w=1200&auto=format&fit=crop', href: 'destination-details.html' }
    ].forEach(card => featuredDestinations.appendChild(createCard(card)));
  }

  const testimonials = document.getElementById('testimonials');
  if (testimonials) {
    [
      { quote: 'Flawless experience from booking to return. Highly recommend!', name: 'Ananya S.' },
      { quote: 'Our corporate offsite was perfectly executed.', name: 'Rahul K.' },
      { quote: 'Family trip to Kashmir was unforgettable!', name: 'Priya D.' }
    ].forEach(t => {
      const div = document.createElement('div');
      div.className = 'border rounded p-4';
      div.innerHTML = `<p class="italic">“${t.quote}”</p><p class="mt-3 font-medium">${t.name}</p>`;
      testimonials.appendChild(div);
    });
  }

  const faqs = document.getElementById('faqs');
  if (faqs) {
    [
      { q: 'Do you offer corporate packages?', a: 'Yes, we curate end‑to‑end solutions for teams.' },
      { q: 'Can I customize an itinerary?', a: 'Absolutely, use the custom trip form or contact us.' },
      { q: 'Which payment methods are accepted?', a: 'All major cards, UPI, and bank transfers.' }
    ].forEach((f, i) => {
      const item = document.createElement('div');
      item.className = 'p-4';
      item.innerHTML = `
        <button class="w-full flex items-center justify-between text-left" aria-expanded="false" data-faq-idx="${i}">
          <span class="font-medium">${f.q}</span>
          <span class="ml-4 text-gray-500">+</span>
        </button>
        <div class="mt-2 text-gray-600 hidden" id="faq-${i}">${f.a}</div>
      `;
      faqs.appendChild(item);
    });
    faqs.addEventListener('click', (e) => {
      const btn = e.target.closest('button[aria-expanded]');
      if (!btn) return;
      const idx = btn.getAttribute('data-faq-idx');
      const ans = document.getElementById(`faq-${idx}`);
      if (ans) ans.classList.toggle('hidden');
    });
  }
})();

// Destinations listing: search, filter, sort, render
(function () {
  const grid = document.getElementById('destinationsGrid');
  const q = document.getElementById('searchDestinations');
  const region = document.getElementById('filterRegion');
  const pkg = document.getElementById('filterPackage');
  const sortBy = document.getElementById('sortBy');
  if (!grid || !q || !region || !pkg || !sortBy) return;

  const destinations = [
    { id: 'kashmir', title: 'Kashmir', subtitle: '7D/6N', region: 'North', packageType: 'Standard', price: 34999, rating: 4.7, image: 'https://images.unsplash.com/photo-1615909692708-33ea538408c4?q=80&w=1200&auto=format&fit=crop' },
    { id: 'rajasthan', title: 'Rajasthan', subtitle: '6D/5N', region: 'West', packageType: 'Luxury', price: 45999, rating: 4.6, image: 'https://images.unsplash.com/photo-1588099768531-a7f85a5b4a10?q=80&w=1200&auto=format&fit=crop' },
    { id: 'goa', title: 'Goa', subtitle: '5D/4N', region: 'West', packageType: 'Economy', price: 19999, rating: 4.5, image: 'https://images.unsplash.com/photo-1500530855697-b586d89ba3ee?q=80&w=1200&auto=format&fit=crop' },
    { id: 'sikkim', title: 'Sikkim', subtitle: '5D/4N', region: 'East', packageType: 'Standard', price: 27999, rating: 4.4, image: 'https://images.unsplash.com/photo-1629932628390-62ae9f9a3d1e?q=80&w=1200&auto=format&fit=crop' },
    { id: 'delhi-agra', title: 'Delhi & Agra', subtitle: '4D/3N', region: 'North', packageType: 'Economy', price: 16999, rating: 4.2, image: 'https://images.unsplash.com/photo-1506806732259-39c2d0268443?q=80&w=1200&auto=format&fit=crop' },
    { id: 'thailand', title: 'Thailand', subtitle: '5D/4N', region: 'International', packageType: 'Standard', price: 39999, rating: 4.6, image: 'https://images.unsplash.com/photo-1506126613408-eca07ce68773?q=80&w=1200&auto=format&fit=crop' }
  ];

  function renderCard(item) {
    const div = document.createElement('div');
    div.className = 'group border border-gray-200 rounded-xl overflow-hidden hover:shadow-lg hover:-translate-y-0.5 transition bg-white';
    div.innerHTML = `
      <a href="destination-details.html" class="block">
        <div class="aspect-video bg-gray-100">
          <img src="${item.image}" alt="${item.title}" class="w-full h-full object-cover transition-transform duration-300 group-hover:scale-[1.03]" />
        </div>
        <div class="p-4 space-y-1">
          <p class="font-medium">${item.title} <span class="text-xs text-yellow-600">★ ${item.rating}</span></p>
          <p class="text-sm text-gray-600">${item.subtitle} · ${item.region} · ${item.packageType}</p>
          <p class="text-sm font-semibold">₹${item.price.toLocaleString('en-IN')}</p>
        </div>
      </a>
    `;
    return div;
  }

  function applyFilters() {
    const text = q.value.trim().toLowerCase();
    const r = region.value;
    const p = pkg.value;
    let list = destinations.filter(d => (
      (!text || d.title.toLowerCase().includes(text)) &&
      (!r || d.region === r) &&
      (!p || d.packageType === p)
    ));

    switch (sortBy.value) {
      case 'priceLow':
        list.sort((a, b) => a.price - b.price); break;
      case 'priceHigh':
        list.sort((a, b) => b.price - a.price); break;
      case 'rating':
        list.sort((a, b) => b.rating - a.rating); break;
      default:
        // popularity placeholder: keep original order
        break;
    }

    grid.innerHTML = '';
    if (!list.length) {
      const empty = document.createElement('div');
      empty.className = 'text-sm text-gray-600';
      empty.textContent = 'No destinations match your filters.';
      grid.appendChild(empty);
      return;
    }
    list.forEach(item => grid.appendChild(renderCard(item)));
  }

  [q, region, pkg, sortBy].forEach(el => el.addEventListener('input', applyFilters));
  [region, pkg, sortBy].forEach(el => el.addEventListener('change', applyFilters));
  applyFilters();
})();

// Blog listing and details
(function () {
  const grid = document.getElementById('blogGrid');
  const categoriesEl = document.getElementById('blogCategories');
  const search = document.getElementById('searchBlog');
  const article = document.getElementById('blogArticle');

  const posts = [
    { id: 'corporate-offsites', title: 'Planning Corporate Offsites in India', category: 'Corporate', image: 'https://images.unsplash.com/photo-1504384308090-c894fdcc538d?q=80&w=1200&auto=format&fit=crop', excerpt: 'Tips to plan productive and fun offsites.', content: '<p>Corporate offsites need balance between work and relaxation...</p>' },
    { id: 'family-kashmir', title: 'Family Trip to Kashmir', category: 'Family', image: 'https://images.unsplash.com/photo-1615909692708-33ea538408c4?q=80&w=1200&auto=format&fit=crop', excerpt: 'How to make the most of 6 days in Kashmir.', content: '<p>Explore Srinagar, Gulmarg, and Pahalgam with kids...</p>' },
    { id: 'international-starters', title: 'First Time International Destinations', category: 'International', image: 'https://images.unsplash.com/photo-1526779259212-939e64788e3c?q=80&w=1200&auto=format&fit=crop', excerpt: 'Beginner-friendly international trips from India.', content: '<p>Thailand, Bali, and Dubai are great starters...</p>' }
  ];

  if (grid && categoriesEl && search) {
    const categories = Array.from(new Set(posts.map(p => p.category)));
    categoriesEl.innerHTML = categories.map(c => `<li><label class="inline-flex items-center gap-2"><input type="checkbox" value="${c}"><span>${c}</span></label></li>`).join('');

    function renderCard(p) {
      const div = document.createElement('div');
      div.className = 'group border border-gray-200 rounded-xl overflow-hidden hover:shadow-lg hover:-translate-y-0.5 transition bg-white';
      div.innerHTML = `
        <a href="blog-details.html#${p.id}" class="block">
          <div class="aspect-video bg-gray-100"><img src="${p.image}" alt="${p.title}" class="w-full h-full object-cover transition-transform duration-300 group-hover:scale-[1.03]"/></div>
          <div class="p-4 space-y-1">
            <p class="text-xs text-gray-500">${p.category}</p>
            <p class="font-medium">${p.title}</p>
            <p class="text-sm text-gray-600">${p.excerpt}</p>
          </div>
        </a>`;
      return div;
    }

    function applyFilters() {
      const text = search.value.trim().toLowerCase();
      const checked = Array.from(categoriesEl.querySelectorAll('input[type="checkbox"]:checked')).map(i => i.value);
      let list = posts.filter(p => (
        (!text || p.title.toLowerCase().includes(text) || p.excerpt.toLowerCase().includes(text)) &&
        (!checked.length || checked.includes(p.category))
      ));
      grid.innerHTML = '';
      if (!list.length) {
        const empty = document.createElement('div');
        empty.className = 'text-sm text-gray-600';
        empty.textContent = 'No articles match your search.';
        grid.appendChild(empty);
        return;
      }
      list.forEach(p => grid.appendChild(renderCard(p)));
    }

    categoriesEl.addEventListener('change', applyFilters);
    search.addEventListener('input', applyFilters);
    applyFilters();
  }

  if (article) {
    const id = location.hash.replace('#', '') || posts[0].id;
    const p = posts.find(x => x.id === id) || posts[0];
    article.innerHTML = `
      <h1>${p.title}</h1>
      <p class="lead text-gray-600">${p.excerpt}</p>
      ${p.content}
    `;
  }
})();

// Contact/About: team cards and contact cards population
(function () {
  const teamGrid = document.getElementById('teamGrid');
  const contactCards = document.getElementById('contactCards');
  if (!teamGrid || !contactCards) return;

  const team = [
    { name: 'Adrija Sen', role: 'Founder & CEO', image: 'https://images.unsplash.com/photo-1544005313-94ddf0286df2?q=80&w=800&auto=format&fit=crop' },
    { name: 'Arjun Gupta', role: 'Head of Operations', image: 'https://images.unsplash.com/photo-1547425260-76bcadfb4f2c?q=80&w=800&auto=format&fit=crop' },
    { name: 'Mira Das', role: 'Customer Success', image: 'https://images.unsplash.com/photo-1542596768-5d1d21f1cf98?q=80&w=800&auto=format&fit=crop' }
  ];

  const contacts = [
    { title: 'Call Us', detail: '+91 98765 43210', icon: '📞' },
    { title: 'Email', detail: 'hello@adrijatours.com', icon: '✉️' },
    { title: 'Office', detail: 'Kolkata, West Bengal', icon: '📍' }
  ];

  teamGrid.innerHTML = '';
  team.forEach(m => {
    const div = document.createElement('div');
    div.className = 'border rounded overflow-hidden text-center';
    div.innerHTML = `
      <div class="aspect-square bg-gray-100"><img src="${m.image}" alt="${m.name}" class="w-full h-full object-cover"/></div>
      <div class="p-3">
        <p class="font-medium">${m.name}</p>
        <p class="text-sm text-gray-600">${m.role}</p>
      </div>`;
    teamGrid.appendChild(div);
  });

  contactCards.innerHTML = '';
  contacts.forEach(c => {
    const div = document.createElement('div');
    div.className = 'border rounded p-4 flex items-start gap-3';
    div.innerHTML = `<div class="text-2xl">${c.icon}</div><div><p class="font-medium">${c.title}</p><p class="text-sm text-gray-600">${c.detail}</p></div>`;
    contactCards.appendChild(div);
  });
})();

// Hotel details: populate details and enquiry handler
(function () {
  const title = document.getElementById('hotelTitle');
  const locationEl = document.getElementById('hotelLocation');
  const desc = document.getElementById('hotelDescription');
  const gallery = document.getElementById('hotelGallery');
  const checkIn = document.getElementById('checkIn');
  const checkOut = document.getElementById('checkOut');
  const enquiry = document.getElementById('enquiryBtn');
  if (!title || !locationEl || !desc || !gallery || !checkIn || !checkOut || !enquiry) return;

  const data = {
    title: 'Seaside Resort',
    location: 'Goa, India',
    description: '<p>Relax at our curated seaside resort with beach access, pool, and spa. Perfect for both leisure and corporate retreats.</p>'
  };

  title.textContent = data.title;
  locationEl.textContent = data.location;
  desc.innerHTML = data.description;
  gallery.innerHTML = '<div class="w-full h-full bg-cover bg-center rounded" style="background-image:url(https://images.unsplash.com/photo-1540541338287-41700207dee6?q=80&w=1600&auto=format&fit=crop)"></div>';

  enquiry.addEventListener('click', () => {
    if (!checkIn.value || !checkOut.value) {
      alert('Please select check-in and check-out dates.');
      return;
    }
    alert(`Enquiry sent for ${data.title} | ${checkIn.value} to ${checkOut.value}`);
  });
})();

// Destination details: populate itinerary, description, selectors, add-to-cart stub
(function () {
  const title = document.getElementById('destinationTitle');
  const subtitle = document.getElementById('destinationSubtitle');
  const desc = document.getElementById('destinationDescription');
  const itinerary = document.getElementById('itinerary');
  const dateSel = document.getElementById('dateSelector');
  const pkgSel = document.getElementById('packageSelector');
  const addToCart = document.getElementById('addToCartBtn');
  const gallery = document.getElementById('destinationGallery');
  if (!title || !subtitle || !desc || !itinerary || !dateSel || !pkgSel || !addToCart || !gallery) return;

  const data = {
    title: 'Kashmir Delight',
    subtitle: '7 Days · 6 Nights · Srinagar, Gulmarg, Pahalgam',
    dates: ['2025-10-05', '2025-11-10', '2025-12-15'],
    packages: ['Standard', 'Luxury', 'Economy'],
    itinerary: [
      { day: 1, title: 'Arrive Srinagar', detail: 'Shikara ride on Dal Lake and houseboat stay.' },
      { day: 2, title: 'Srinagar Sightseeing', detail: 'Mughal gardens and local markets.' },
      { day: 3, title: 'Gulmarg Excursion', detail: 'Gondola ride and snow activities.' },
      { day: 4, title: 'Pahalgam Transfer', detail: 'Betaab valley and leisure time.' },
      { day: 5, title: 'Chandanwari / Aru Valley', detail: 'Optional activities and nature walks.' },
      { day: 6, title: 'Return to Srinagar', detail: 'Shopping and cultural evening.' },
      { day: 7, title: 'Departure', detail: 'Airport drop.' }
    ],
    description: '<p>Experience the paradisiacal beauty of Kashmir with thoughtfully curated stays and activities. Ideal for families and small groups.</p>'
  };

  title.textContent = data.title;
  subtitle.textContent = data.subtitle;
  desc.innerHTML = data.description;
  gallery.innerHTML = '<div class="w-full h-full bg-cover bg-center rounded" style="background-image:url(https://images.unsplash.com/photo-1615909692708-33ea538408c4?q=80&w=1600&auto=format&fit=crop)"></div>';

  dateSel.innerHTML = '<option value="">Select Available Date</option>' + data.dates.map(d => `<option value="${d}">${d}</option>`).join('');
  pkgSel.innerHTML = data.packages.map(p => `<option>${p}</option>`).join('');

  itinerary.innerHTML = '';
  data.itinerary.forEach(i => {
    const div = document.createElement('div');
    div.className = 'border rounded p-4';
    div.innerHTML = `<p class="font-medium">Day ${i.day}: ${i.title}</p><p class="text-sm text-gray-600 mt-1">${i.detail}</p>`;
    itinerary.appendChild(div);
  });

  addToCart.addEventListener('click', () => {
    const chosenDate = dateSel.value;
    const chosenPkg = pkgSel.value;
    if (!chosenDate) {
      alert('Please select a date.');
      return;
    }
    // Razorpay integration to be added at cart stage
    alert(`Added to cart: ${data.title} | ${chosenPkg} | ${chosenDate}`);
  });
})();

// Hotels listing: search, filter, sort, render
(function () {
  const grid = document.getElementById('hotelsGrid');
  const q = document.getElementById('searchHotels');
  const city = document.getElementById('filterCity');
  const stars = document.getElementById('filterStars');
  const sortBy = document.getElementById('sortHotelsBy');
  if (!grid || !q || !city || !stars || !sortBy) return;

  const hotels = [
    { id: 'goa-seaside', title: 'Seaside Resort', city: 'Goa', rating: 5, price: 8999, image: 'https://images.unsplash.com/photo-1540541338287-41700207dee6?q=80&w=1200&auto=format&fit=crop' },
    { id: 'jaipur-palace', title: 'Royal Palace', city: 'Jaipur', rating: 5, price: 12999, image: 'https://images.unsplash.com/photo-1551882547-ff40c63fe5fa?q=80&w=1200&auto=format&fit=crop' },
    { id: 'manali-retreat', title: 'Mountain Retreat', city: 'Manali', rating: 4, price: 5999, image: 'https://images.unsplash.com/photo-1499793983690-e29da59ef1c2?q=80&w=1200&auto=format&fit=crop' },
    { id: 'kolkata-business', title: 'City Business Hotel', city: 'Kolkata', rating: 4, price: 6999, image: 'https://images.unsplash.com/photo-1564501049412-61c2a3083791?q=80&w=1200&auto=format&fit=crop' },
    { id: 'bangkok-sky', title: 'Bangkok Sky Hotel', city: 'International', rating: 5, price: 9999, image: 'https://images.unsplash.com/photo-1496412705862-e0088f16f791?q=80&w=1200&auto=format&fit=crop' }
  ];

  function renderCard(item) {
    const div = document.createElement('div');
    div.className = 'group border border-gray-200 rounded-xl overflow-hidden hover:shadow-lg hover:-translate-y-0.5 transition bg-white';
    div.innerHTML = `
      <a href="hotel-details.html" class="block">
        <div class="aspect-video bg-gray-100">
          <img src="${item.image}" alt="${item.title}" class="w-full h-full object-cover transition-transform duration-300 group-hover:scale-[1.03]" />
        </div>
        <div class="p-4 space-y-1">
          <p class="font-medium">${item.title} <span class="text-xs text-yellow-600">★ ${item.rating}</span></p>
          <p class="text-sm text-gray-600">${item.city}</p>
          <p class="text-sm font-semibold">₹${item.price.toLocaleString('en-IN')}/night</p>
        </div>
      </a>
    `;
    return div;
  }

  function applyFilters() {
    const text = q.value.trim().toLowerCase();
    const c = city.value;
    const s = stars.value ? Number(stars.value[0]) : 0;
    let list = hotels.filter(h => (
      (!text || h.title.toLowerCase().includes(text) || h.city.toLowerCase().includes(text)) &&
      (!c || h.city === c) &&
      (!s || h.rating === s)
    ));

    switch (sortBy.value) {
      case 'priceLow':
        list.sort((a, b) => a.price - b.price); break;
      case 'priceHigh':
        list.sort((a, b) => b.price - a.price); break;
      case 'rating':
        list.sort((a, b) => b.rating - a.rating); break;
      default:
        break;
    }

    grid.innerHTML = '';
    if (!list.length) {
      const empty = document.createElement('div');
      empty.className = 'text-sm text-gray-600';
      empty.textContent = 'No hotels match your filters.';
      grid.appendChild(empty);
      return;
    }
    list.forEach(item => grid.appendChild(renderCard(item)));
  }

  [q, city, stars, sortBy].forEach(el => el.addEventListener('input', applyFilters));
  [city, stars, sortBy].forEach(el => el.addEventListener('change', applyFilters));
  applyFilters();
})();


