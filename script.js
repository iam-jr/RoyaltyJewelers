const goldPrices = {
  '10k': { buy: 44.5, sell: 42.0 },
  '14k': { buy: 62.5, sell: 60.0 }
};

const karatButtons = document.querySelectorAll('.karat-btn');
const goldGramsInput = document.getElementById('gold-grams');
const goldResult = document.getElementById('gold-result');
const buyPriceEl = document.getElementById('buy-price');
const sellPriceEl = document.getElementById('sell-price');
const calculateBuyBtn = document.getElementById('calculate-buy');
const calculateSellBtn = document.getElementById('calculate-sell');
let activeCalculation = 'buy';
let selectedKarat = '14k';
let isLanguageReady = false;

const heroVideo = document.querySelector('.hero-video');

function startHeroVideoWithSound() {
  if (!heroVideo) return;

  heroVideo.muted = false;
  heroVideo.volume = 1;

  heroVideo.play().catch(() => {
    // Some mobile browsers block autoplay with sound until first user interaction.
  });
}

function unlockHeroVideoSound() {
  startHeroVideoWithSound();
  window.removeEventListener('click', unlockHeroVideoSound);
  window.removeEventListener('touchstart', unlockHeroVideoSound);
  window.removeEventListener('keydown', unlockHeroVideoSound);
}

startHeroVideoWithSound();
window.addEventListener('click', unlockHeroVideoSound, { once: true });
window.addEventListener('touchstart', unlockHeroVideoSound, { once: true });
window.addEventListener('keydown', unlockHeroVideoSound, { once: true });

function getSelectedPrices() {
  return goldPrices[selectedKarat] || goldPrices['14k'];
}

function refreshGoldPriceDisplay() {
  const prices = getSelectedPrices();
  buyPriceEl.textContent = `$${prices.buy.toFixed(2)}`;
  sellPriceEl.textContent = `$${prices.sell.toFixed(2)}`;
}

function updateResult(type) {
  activeCalculation = type;

  if (isLanguageReady) {
    applyResultText(type);
    return;
  }

  const grams = parseFloat(goldGramsInput.value) || 0;
  const prices = getSelectedPrices();
  const basePrice = type === 'buy' ? prices.buy : prices.sell;
  const total = grams * basePrice;
  goldResult.innerHTML = `Estimated total (${type === 'buy' ? 'buy' : 'sell'}): <strong>$${total.toFixed(2)}</strong>`;
}

calculateBuyBtn.addEventListener('click', () => updateResult('buy'));
calculateSellBtn.addEventListener('click', () => updateResult('sell'));

karatButtons.forEach((button) => {
  button.addEventListener('click', () => {
    const karat = button.getAttribute('data-karat');
    if (!karat || karat === selectedKarat) return;

    selectedKarat = karat;

    karatButtons.forEach((item) => {
      const isActive = item.getAttribute('data-karat') === selectedKarat;
      item.classList.toggle('is-active', isActive);
      item.setAttribute('aria-pressed', String(isActive));
    });

    refreshGoldPriceDisplay();
    updateResult(activeCalculation);
  });
});

goldGramsInput.addEventListener('input', () => {
  updateResult(activeCalculation);
});

refreshGoldPriceDisplay();
updateResult(activeCalculation);

const navToggle = document.querySelector('.nav-toggle');
const navMenu = document.getElementById('nav-menu');

navToggle?.addEventListener('click', () => {
  const isOpen = navMenu.classList.toggle('open');
  navToggle.setAttribute('aria-expanded', String(isOpen));
});

navMenu?.querySelectorAll('a').forEach((link) => {
  link.addEventListener('click', () => {
    navMenu.classList.remove('open');
    navToggle?.setAttribute('aria-expanded', 'false');
  });
});

const buyNowButtons = document.querySelectorAll('.buy-now-btn');
const paymentModal = document.getElementById('payment-modal');
const paymentModalClose = document.getElementById('payment-modal-close');
const paymentModalTitle = document.getElementById('payment-modal-title');
const paymentModalProduct = document.getElementById('payment-modal-product');
const paymentModalDescription = document.getElementById('payment-modal-description');
const paymentModalImage = document.getElementById('payment-modal-image');
const payCard = document.getElementById('pay-card');

function openPaymentModal(product) {
  if (!paymentModal || !paymentModalProduct) return;

  const langPack = (typeof translations !== 'undefined' && translations[currentLanguage]) ? translations[currentLanguage] : null;
  const productName = product.name || 'Product';
  const productDescription = product.description || langPack?.modal.defaultDescription || 'Contact us for full details and availability.';
  const productImage = product.image || '';
  const productImageAlt = product.imageAlt || productName;

  if (paymentModalTitle) {
    paymentModalTitle.textContent = productName;
  }

  paymentModalProduct.textContent = langPack?.modal.choosePayment || 'Choose your payment option';
  if (paymentModalDescription) {
    paymentModalDescription.textContent = productDescription;
  }

  if (paymentModalImage && productImage) {
    paymentModalImage.src = productImage;
    paymentModalImage.alt = productImageAlt;
  }

  if (payCard) {
    payCard.href = 'tel:+14072301282';
  }

  paymentModal.classList.add('open');
  paymentModal.setAttribute('aria-hidden', 'false');
  document.body.classList.add('modal-open');
}

function closePaymentModal() {
  if (!paymentModal) return;

  paymentModal.classList.remove('open');
  paymentModal.setAttribute('aria-hidden', 'true');
  document.body.classList.remove('modal-open');
}

buyNowButtons.forEach((button) => {
  button.addEventListener('click', () => {
    const productCard = button.closest('.product-card');
    const productName = button.getAttribute('data-product') || productCard?.querySelector('h3')?.textContent?.trim() || 'Product';
    const productDescription = productCard?.querySelector('p')?.textContent?.trim() || 'Contact us for full details and availability.';
    const productImageEl = productCard?.querySelector('.product-image');

    openPaymentModal({
      name: productName,
      description: productDescription,
      image: productImageEl?.getAttribute('src') || '',
      imageAlt: productImageEl?.getAttribute('alt') || productName
    });
  });
});

paymentModalClose?.addEventListener('click', closePaymentModal);

paymentModal?.addEventListener('click', (event) => {
  if (event.target === paymentModal) {
    closePaymentModal();
  }
});

payCard?.addEventListener('click', () => {
  closePaymentModal();
});

window.addEventListener('keydown', (event) => {
  if (event.key === 'Escape' && paymentModal?.classList.contains('open')) {
    closePaymentModal();
  }
});

const languageToggleBtn = document.getElementById('lang-toggle');
const languageStorageKey = 'royalty-language';
let currentLanguage = localStorage.getItem(languageStorageKey) || 'en';

const translations = {
  en: {
    navMenu: 'Menu',
    navLinks: ['Gold Price', 'Products', 'Contact'],
    heroEyebrow: 'We Buy and Sell Gold',
    heroDescription: 'Buy or sell gold and silver with clear prices and friendly help.',
    heroButtons: ['Check Gold Price', 'Browse Products'],
    sectionHeaders: {
      aboutTitle: 'About Us',
      aboutDesc: 'We are a trusted local shop for buying and selling gold.',
      goldTitle: 'Current Gold Price',
      goldDesc: "See today's gold price and calculate your total.",
      serviceTitle: 'Featured Services',
      serviceDesc: 'Simple services for buying, selling and caring for jewelry.',
      productTitle: 'Premium Products',
      productDesc: 'Beautiful jewelry with fair prices.',
      galleryTitle: 'Gallery',
      galleryDesc: 'See photos of our products and work.',
      faqTitle: 'Frequently Asked Questions',
      faqDesc: 'Quick answers to common questions before your visit.',
      contactTitle: 'Contact',
      contactDesc: 'Contact us for prices, questions or a store visit.'
    },
    about: {
      highlight: 'At Royalty Jewelers, we make every step simple, safe and clear.',
      intro: 'Our team checks your items carefully and gives fair prices.',
      list: [
        '<strong>Item check:</strong> we check gold, silver and stones.',
        '<strong>Fast payment:</strong> get paid in cash or transfer the same day.',
        '<strong>Quality products:</strong> we sell beautiful jewelry for daily use or gifts.',
        '<strong>Friendly service:</strong> clear support for every customer.'
      ],
      panels: [
        { title: 'Mission', text: 'Give honest prices and good service to every person.' },
        { title: 'Vision', text: 'Help more families with safe and simple jewelry services.' },
        { title: 'Values', text: 'Honesty, respect, safety and clear communication.' }
      ],
      features: [
        { title: 'Trust', text: 'We explain every step so you feel safe.' },
        { title: 'Experience', text: 'More than 8 years helping people buy and sell jewelry.' },
        { title: 'Quality', text: 'We choose strong, beautiful pieces with good materials.' }
      ]
    },
    gold: {
      labels: ['Buy price', 'Sell price'],
      note: 'Prices can vary depending on circumstances.',
      purityLabel: 'Gold purity',
      gramsLabel: 'Gold grams',
      actionButtons: ['Calculate Buy', 'Calculate Sell'],
      timeline: [
        { title: 'Evaluation', text: 'We check your item and weight it.' },
        { title: 'Offer', text: 'We give you a clear and fair price.' },
        { title: 'Payment', text: 'If you accept, you get paid right away.' }
      ]
    },
    services: ['Gold Purchase', 'Jewelry Sales', 'Professional Appraisal', 'Repair & Maintenance'],
    serviceTexts: [
      'We buy your gold and pay the same day.',
      'We sell gold and silver jewelry in many styles.',
      'We check gold, silver, diamonds and old pieces.',
      'We clean, fix and adjust your jewelry.'
    ],
    products: [
      { name: '200gr Gold', desc: 'Miami Cuban bracelet. Great for gifts and special moments.' },
      { name: '14K Gold Chain', desc: 'Strong 14K gold chain for everyday use.' },
      { name: 'Cuban Link Gold Chain', desc: 'Thick luxury gold in style. Nice for high class in advance.' },
      { name: 'Diamond Tennis Silver Chain', desc: 'Silver Diamond iced-out for daily wear.' }
    ],
    productBtn: 'View Product',
    faq: [
      {
        q: 'Do I need an appointment?',
        a: 'No appointment is required. You can walk in during business hours.'
      },
      {
        q: 'How do you calculate the price?',
        a: 'We check purity, weight and current market rate, then give you a clear offer.'
      },
      {
        q: 'How do I get paid?',
        a: 'If you accept the offer, we pay you the same day by cash or transfer.'
      },
      {
        q: 'Can I bring damaged jewelry?',
        a: 'Yes. We can evaluate broken or old pieces and still provide an offer.'
      }
    ],
    contact: {
      labels: ['Address:', 'Phone & WhatsApp:', 'Financing Available:', 'Shipping:'],
      values: [
        '615 N Main St Downtown Kissimmee, FL 34744',
        '(407) 230-1282',
        'No credit needed.',
        'Available through the US & PR.'
      ]
    },
    footer: {
      summary: 'We buy and sell gold, check jewelry and offer friendly service.',
      links: ['Gold Price', 'Products', 'Contact'],
      businessHours: 'Business Hours',
      alwaysOnline: 'Always available online 24/7',
      rights: '© 2026 Royalty Jewelers. All rights reserved.'
    },
    modal: {
      choosePayment: 'Choose your payment option',
      defaultDescription: 'Contact us for full details and availability.',
      contactUs: 'Contact Us',
      closeLabel: 'Close payment options'
    },
    goldResult: {
      buy: 'Estimated total (buy):',
      sell: 'Estimated total (sell):'
    },
    switchTo: 'Switch language to Spanish'
  },
  es: {
    navMenu: 'Menu',
    navLinks: ['Precio del Oro', 'Productos', 'Contacto'],
    heroEyebrow: 'Compramos y Vendemos Oro',
    heroDescription: 'Compra o vende oro y plata con precios claros y atencion amigable.',
    heroButtons: ['Ver Precio del Oro', 'Ver Productos'],
    sectionHeaders: {
      aboutTitle: 'Sobre Nosotros',
      aboutDesc: 'Somos una tienda local confiable para comprar y vender oro.',
      goldTitle: 'Precio Actual del Oro',
      goldDesc: 'Mira el precio del oro de hoy y calcula tu total.',
      serviceTitle: 'Servicios Destacados',
      serviceDesc: 'Servicios simples para comprar, vender y cuidar joyeria.',
      productTitle: 'Productos Premium',
      productDesc: 'Joyeria hermosa con precios justos.',
      galleryTitle: 'Galeria',
      galleryDesc: 'Mira fotos de nuestros productos y trabajo.',
      faqTitle: 'Preguntas Frecuentes',
      faqDesc: 'Respuestas rapidas a preguntas comunes antes de tu visita.',
      contactTitle: 'Contacto',
      contactDesc: 'Contactanos para precios, preguntas o visitar la tienda.'
    },
    about: {
      highlight: 'En Royalty Jewelers hacemos cada paso simple, seguro y claro.',
      intro: 'Nuestro equipo revisa tus piezas con cuidado y te da precios justos.',
      list: [
        '<strong>Revision de pieza:</strong> revisamos oro, plata y piedras.',
        '<strong>Pago rapido:</strong> recibe pago en efectivo o transferencia el mismo dia.',
        '<strong>Productos de calidad:</strong> vendemos joyas hermosas para uso diario o regalos.',
        '<strong>Servicio amigable:</strong> apoyo claro para cada cliente.'
      ],
      panels: [
        { title: 'Mision', text: 'Dar precios honestos y buen servicio a cada persona.' },
        { title: 'Vision', text: 'Ayudar a mas familias con servicios de joyeria seguros y simples.' },
        { title: 'Valores', text: 'Honestidad, respeto, seguridad y comunicacion clara.' }
      ],
      features: [
        { title: 'Confianza', text: 'Explicamos cada paso para que te sientas seguro.' },
        { title: 'Experiencia', text: 'Mas de 8 anos ayudando a personas a comprar y vender joyas.' },
        { title: 'Calidad', text: 'Elegimos piezas fuertes y bonitas con buenos materiales.' }
      ]
    },
    gold: {
      labels: ['Precio de compra', 'Precio de venta'],
      note: 'Los precios pueden variar segun las circunstancias.',
      purityLabel: 'Pureza del oro',
      gramsLabel: 'Gramos de oro',
      actionButtons: ['Calcular Compra', 'Calcular Venta'],
      timeline: [
        { title: 'Evaluacion', text: 'Revisamos tu pieza y la pesamos.' },
        { title: 'Oferta', text: 'Te damos una oferta clara y justa.' },
        { title: 'Pago', text: 'Si aceptas, recibes pago de inmediato.' }
      ]
    },
    services: ['Compra de Oro', 'Venta de Joyeria', 'Avaluo Profesional', 'Reparacion y Mantenimiento'],
    serviceTexts: [
      'Compramos tu oro y pagamos el mismo dia.',
      'Vendemos joyeria de oro y plata en muchos estilos.',
      'Revisamos oro, plata, diamantes y piezas antiguas.',
      'Limpiamos, reparamos y ajustamos tus joyas.'
    ],
    products: [
      { name: 'Oro 200gr', desc: 'Pulsera cubana de Miami. Excelente para regalos y momentos especiales.' },
      { name: 'Cadena de Oro 14K', desc: 'Cadena de oro 14K resistente para uso diario.' },
      { name: 'Cadena de Oro Cuban Link', desc: 'Oro grueso y lujoso con estilo. Ideal para una presencia premium.' },
      { name: 'Cadena de Plata Tennis con Diamante', desc: 'Plata iced-out con diamantes para uso diario.' }
    ],
    productBtn: 'Ver Producto',
    faq: [
      {
        q: 'Necesito cita?',
        a: 'No necesitas cita. Puedes visitarnos en horario laboral.'
      },
      {
        q: 'Como calculan el precio?',
        a: 'Revisamos pureza, peso y precio del mercado para darte una oferta clara.'
      },
      {
        q: 'Como recibo el pago?',
        a: 'Si aceptas la oferta, pagamos el mismo dia en efectivo o transferencia.'
      },
      {
        q: 'Puedo llevar joyeria danada?',
        a: 'Si. Podemos evaluar piezas rotas o antiguas y aun asi hacer una oferta.'
      }
    ],
    contact: {
      labels: ['Direccion:', 'Telefono y WhatsApp:', 'Financiamiento Disponible:', 'Envios:'],
      values: [
        '615 N Main St Downtown Kissimmee, FL 34744',
        '(407) 230-1282',
        'No se necesita credito.',
        'Disponible en EE.UU. y Puerto Rico.'
      ]
    },
    footer: {
      summary: 'Compramos y vendemos oro, revisamos joyeria y ofrecemos servicio amigable.',
      links: ['Precio del Oro', 'Productos', 'Contacto'],
      businessHours: 'Horario de Atencion',
      alwaysOnline: 'Siempre disponibles en linea 24/7',
      rights: '© 2026 Royalty Jewelers. Todos los derechos reservados.'
    },
    modal: {
      choosePayment: 'Elige tu opcion de pago',
      defaultDescription: 'Contactanos para detalles completos y disponibilidad.',
      contactUs: 'Contactanos',
      closeLabel: 'Cerrar opciones de pago'
    },
    goldResult: {
      buy: 'Total estimado (compra):',
      sell: 'Total estimado (venta):'
    },
    switchTo: 'Switch language to English'
  }
};

function applyText(selector, text) {
  const element = document.querySelector(selector);
  if (element && typeof text === 'string') {
    element.textContent = text;
  }
}

function applyResultText(type) {
  const grams = parseFloat(goldGramsInput.value) || 0;
  const prices = getSelectedPrices();
  const basePrice = type === 'buy' ? prices.buy : prices.sell;
  const total = grams * basePrice;
  const resultLabel = translations[currentLanguage].goldResult[type === 'buy' ? 'buy' : 'sell'];
  goldResult.innerHTML = `${resultLabel} <strong>$${total.toFixed(2)}</strong>`;
}

function applyLanguage(language) {
  const langPack = translations[language] || translations.en;
  currentLanguage = language;

  document.documentElement.lang = language;
  localStorage.setItem(languageStorageKey, language);

  applyText('.nav-toggle', langPack.navMenu);

  const navLinks = document.querySelectorAll('.nav-menu a');
  navLinks.forEach((link, index) => {
    link.textContent = langPack.navLinks[index] || link.textContent;
  });

  const footerLinks = document.querySelectorAll('.footer-links a');
  footerLinks.forEach((link, index) => {
    link.textContent = langPack.footer.links[index] || link.textContent;
  });

  applyText('.eyebrow', langPack.heroEyebrow);
  applyText('.hero-content > p', langPack.heroDescription);

  const heroButtons = document.querySelectorAll('.hero-actions .btn');
  heroButtons.forEach((button, index) => {
    button.textContent = langPack.heroButtons[index] || button.textContent;
  });

  const headers = document.querySelectorAll('.section-header');
  if (headers[0]) {
    headers[0].querySelector('h2').textContent = langPack.sectionHeaders.aboutTitle;
    headers[0].querySelector('p').textContent = langPack.sectionHeaders.aboutDesc;
  }
  if (headers[1]) {
    headers[1].querySelector('h2').textContent = langPack.sectionHeaders.goldTitle;
    headers[1].querySelector('p').textContent = langPack.sectionHeaders.goldDesc;
  }
  if (headers[2]) {
    headers[2].querySelector('h2').textContent = langPack.sectionHeaders.serviceTitle;
    headers[2].querySelector('p').textContent = langPack.sectionHeaders.serviceDesc;
  }
  if (headers[3]) {
    headers[3].querySelector('h2').textContent = langPack.sectionHeaders.productTitle;
    headers[3].querySelector('p').textContent = langPack.sectionHeaders.productDesc;
  }
  if (headers[4]) {
    headers[4].querySelector('h2').textContent = langPack.sectionHeaders.galleryTitle;
    headers[4].querySelector('p').textContent = langPack.sectionHeaders.galleryDesc;
  }
  if (headers[5]) {
    headers[5].querySelector('h2').textContent = langPack.sectionHeaders.faqTitle;
    headers[5].querySelector('p').textContent = langPack.sectionHeaders.faqDesc;
  }
  if (headers[6]) {
    headers[6].querySelector('h2').textContent = langPack.sectionHeaders.contactTitle;
    headers[6].querySelector('p').textContent = langPack.sectionHeaders.contactDesc;
  }

  applyText('.about-highlight p', langPack.about.highlight);

  const aboutTextParagraphs = document.querySelectorAll('.about-text > p');
  if (aboutTextParagraphs[0]) {
    aboutTextParagraphs[0].textContent = langPack.about.intro;
  }

  const aboutListItems = document.querySelectorAll('.about-list li');
  aboutListItems.forEach((item, index) => {
    item.innerHTML = langPack.about.list[index] || item.innerHTML;
  });

  const panelCards = document.querySelectorAll('.about-panels .panel-card');
  panelCards.forEach((card, index) => {
    const panel = langPack.about.panels[index];
    if (!panel) return;
    const title = card.querySelector('h3');
    const text = card.querySelector('p');
    if (title) title.textContent = panel.title;
    if (text) text.textContent = panel.text;
  });

  const featureCards = document.querySelectorAll('.about-features .feature-card');
  featureCards.forEach((card, index) => {
    const feature = langPack.about.features[index];
    if (!feature) return;
    const title = card.querySelector('h4');
    const text = card.querySelector('p');
    if (title) title.textContent = feature.title;
    if (text) text.textContent = feature.text;
  });

  const goldInfoParagraphs = document.querySelectorAll('.gold-info p');
  if (goldInfoParagraphs[0]) goldInfoParagraphs[0].textContent = langPack.gold.labels[0];
  if (goldInfoParagraphs[1]) goldInfoParagraphs[1].textContent = langPack.gold.labels[1];
  if (goldInfoParagraphs[2]) goldInfoParagraphs[2].textContent = langPack.gold.note;

  const calculatorLabels = document.querySelectorAll('.calculator label');
  if (calculatorLabels[0]) calculatorLabels[0].textContent = langPack.gold.purityLabel;
  if (calculatorLabels[1]) calculatorLabels[1].textContent = langPack.gold.gramsLabel;

  if (calculateBuyBtn) calculateBuyBtn.textContent = langPack.gold.actionButtons[0];
  if (calculateSellBtn) calculateSellBtn.textContent = langPack.gold.actionButtons[1];

  const timelineSteps = document.querySelectorAll('.timeline-step');
  timelineSteps.forEach((step, index) => {
    const timelineData = langPack.gold.timeline[index];
    if (!timelineData) return;
    const title = step.querySelector('h3');
    const text = step.querySelector('p');
    if (title) title.textContent = timelineData.title;
    if (text) text.textContent = timelineData.text;
  });

  const serviceCards = document.querySelectorAll('.service-card');
  serviceCards.forEach((card, index) => {
    const title = card.querySelector('h3');
    const text = card.querySelector('p');
    if (title) title.textContent = langPack.services[index] || title.textContent;
    if (text) text.textContent = langPack.serviceTexts[index] || text.textContent;
  });

  const productCards = document.querySelectorAll('.product-card');
  productCards.forEach((card, index) => {
    const data = langPack.products[index];
    if (!data) return;
    const title = card.querySelector('h3');
    const text = card.querySelector('p');
    const button = card.querySelector('.buy-now-btn');
    if (title) title.textContent = data.name;
    if (text) text.textContent = data.desc;
    if (button) {
      button.textContent = langPack.productBtn;
      button.setAttribute('data-product', data.name);
    }
  });

  const faqCards = document.querySelectorAll('.testimonial-card');
  faqCards.forEach((card, index) => {
    const data = langPack.faq[index];
    if (!data) return;
    const question = card.querySelector('strong');
    const answer = card.querySelector('p');
    if (question) question.textContent = data.q;
    if (answer) answer.textContent = data.a;
  });

  const contactStrongElements = document.querySelectorAll('.contact-card p strong');
  contactStrongElements.forEach((el, index) => {
    el.textContent = langPack.contact.labels[index] || el.textContent;
  });

  const contactParagraphs = document.querySelectorAll('.contact-card p');
  const valueIndexes = [1, 3, 5, 7];
  valueIndexes.forEach((targetIndex, index) => {
    if (contactParagraphs[targetIndex]) {
      contactParagraphs[targetIndex].textContent = langPack.contact.values[index];
    }
  });

  const footerCols = document.querySelectorAll('.footer-col');
  if (footerCols[0]) {
    const summary = footerCols[0].querySelectorAll('p')[1];
    if (summary) summary.textContent = langPack.footer.summary;
  }
  if (footerCols[3]) {
    const footerSmall = footerCols[3].querySelector('.footer-small');
    const footerText = footerCols[3].querySelectorAll('p')[1];
    if (footerSmall) footerSmall.textContent = langPack.footer.businessHours;
    if (footerText) footerText.textContent = langPack.footer.alwaysOnline;
  }

  applyText('.footer-note p', langPack.footer.rights);

  if (paymentModalProduct) {
    paymentModalProduct.textContent = langPack.modal.choosePayment;
  }

  if (paymentModalDescription && !paymentModal.classList.contains('open')) {
    paymentModalDescription.textContent = langPack.modal.defaultDescription;
  }

  if (paymentModalClose) {
    paymentModalClose.setAttribute('aria-label', langPack.modal.closeLabel);
  }

  if (payCard) {
    payCard.textContent = langPack.modal.contactUs;
  }

  if (languageToggleBtn) {
    const nextLanguage = currentLanguage === 'en' ? 'ES' : 'EN';
    languageToggleBtn.textContent = nextLanguage;
    languageToggleBtn.setAttribute('aria-label', langPack.switchTo);
  }

  applyResultText(activeCalculation);
}

if (languageToggleBtn) {
  languageToggleBtn.addEventListener('click', () => {
    const nextLanguage = currentLanguage === 'en' ? 'es' : 'en';
    applyLanguage(nextLanguage);
  });
}

applyLanguage(currentLanguage);
isLanguageReady = true;
