// ===========================
// GLOBAL VARIABLES & SETUP
// ===========================

document.addEventListener('DOMContentLoaded', () => {
    initializeApp();
});

function initializeApp() {
    setupNavigation();
    setupHeroSlideshow();
    setupParticles();
    setupScrollEffects();
    setupAnimations();
    setupForms();
    setupGalleryFilter();
    setupLightbox();
    setupCarousels();
    setupDestinationCarousel();
    setupGalleryCarousel();
    setupDestinationGalleryControls();
    setupTestimonialsCarousel();
    setupCollabShowcases();
    setupCounters();
}

// ===========================
// NAVIGATION SETUP
// ===========================

function setupNavigation() {
    const hamburger = document.getElementById('hamburger');
    const navMenu = document.getElementById('navMenu');
    const navLinks = document.querySelectorAll('.nav-link');

    // Hamburger menu toggle
    if (hamburger) {
        hamburger.addEventListener('click', () => {
            hamburger.classList.toggle('active');
            navMenu.classList.toggle('active');
        });
    }

    // Close menu when link clicked
    navLinks.forEach(link => {
        link.addEventListener('click', () => {
            hamburger?.classList.remove('active');
            navMenu?.classList.remove('active');
        });
    });

    // Set active nav based on current page
    const currentPage = window.location.pathname.split('/').pop() || 'index.html';
    navLinks.forEach(link => {
        const href = link.getAttribute('href');
        if (href === currentPage || (currentPage === '' && href === 'index.html')) {
            link.classList.add('active');
        } else {
            link.classList.remove('active');
        }
    });
}

// ===========================
// HERO SLIDESHOW
// ===========================

function setupHeroSlideshow() {
    const slides = document.querySelectorAll('.hero-slide');
    if (slides.length === 0) return;

    let currentSlide = 0;

    function showSlide(n) {
        slides.forEach(slide => slide.classList.remove('active'));
        slides[n].classList.add('active');
    }

    function nextSlide() {
        currentSlide = (currentSlide + 1) % slides.length;
        showSlide(currentSlide);
    }

    // Show first slide
    showSlide(0);

    // Change slide every 8 seconds
    setInterval(nextSlide, 8000);
}

// ===========================
// PARTICLE ANIMATION
// ===========================

function setupParticles() {
    const particlesContainer = document.getElementById('particles');
    if (!particlesContainer) return;

    function createParticle() {
        const particle = document.createElement('div');
        particle.className = 'particle';
        
        const size = Math.random() * 6 + 2;
        particle.style.width = size + 'px';
        particle.style.height = size + 'px';
        particle.style.left = Math.random() * 100 + '%';
        particle.style.top = Math.random() * 100 + '%';
        particle.style.animationDuration = (Math.random() * 15 + 10) + 's';
        particle.style.animationDelay = Math.random() * 2 + 's';
        
        particlesContainer.appendChild(particle);

        // Remove particle after animation
        setTimeout(() => particle.remove(), 25000);
    }

    // Create particles at intervals
    setInterval(createParticle, 300);
}

// ===========================
// SCROLL EFFECTS
// ===========================

function setupScrollEffects() {
    const navbar = document.querySelector('.navbar');
    const scrollProgress = document.querySelector('.scroll-progress');

    window.addEventListener('scroll', () => {
        // Navbar scroll effect
        if (navbar) {
            if (window.scrollY > 100) {
                navbar.classList.add('scroll-active');
            } else {
                navbar.classList.remove('scroll-active');
            }
        }

        // Scroll progress bar
        if (scrollProgress) {
            const scrollTop = window.scrollY;
            const docHeight = document.documentElement.scrollHeight - window.innerHeight;
            const scrolled = (scrollTop / docHeight) * 100;
            scrollProgress.style.width = scrolled + '%';
        }
    });
}

// ===========================
// INTERSECTION OBSERVER (SCROLL ANIMATIONS)
// ===========================

function setupAnimations() {
    const observerOptions = {
        threshold: 0.1,
        rootMargin: '0px 0px -100px 0px'
    };

    const observer = new IntersectionObserver((entries) => {
        entries.forEach(entry => {
            if (entry.isIntersecting) {
                entry.target.style.animation = entry.target.dataset.aos + ' 0.8s ease-out forwards';
                observer.unobserve(entry.target);
            }
        });
    }, observerOptions);

    // Observe all elements with data-aos attribute
    document.querySelectorAll('[data-aos]').forEach(el => {
        if (!el.classList.contains('gallery-item')) {
            observer.observe(el);
        }
    });

    // Also observe cards for fade-up effect
    const cards = document.querySelectorAll('.episode-card, .short-card, .destination-card, .team-card, .benefit-card');
    cards.forEach((card, index) => {
        card.style.animation = `fadeInUp 0.8s ease-out ${index * 0.1}s forwards`;
        card.style.opacity = '0';
    });
}

// ===========================
// STATISTICS COUNTER
// ===========================

function setupCounters() {
    const counters = document.querySelectorAll('.stat-number');
    
    function animateCounter(element) {
        const target = parseInt(element.dataset.target);
        let current = 0;
        const increment = target / 50; // Animate over 50 steps

        const interval = setInterval(() => {
            current += increment;
            if (current >= target) {
                element.textContent = target.toLocaleString();
                clearInterval(interval);
            } else {
                element.textContent = Math.floor(current).toLocaleString();
            }
        }, 30);
    }

    const observer = new IntersectionObserver((entries) => {
        entries.forEach(entry => {
            if (entry.isIntersecting) {
                animateCounter(entry.target);
                observer.unobserve(entry.target);
            }
        });
    }, { threshold: 0.5 });

    counters.forEach(counter => observer.observe(counter));
}

// ===========================
// FORMS HANDLING
// ===========================

function setupForms() {
    const phoneInstances = new Map();

    function clearFieldValidityOnInput(field) {
        field.addEventListener('input', () => {
            field.setCustomValidity('');
        });
    }

    function initializePhoneInputs() {
        const phoneInputs = document.querySelectorAll('input.js-phone-input[type="tel"]');
        if (phoneInputs.length === 0 || typeof window.intlTelInput !== 'function') return;

        phoneInputs.forEach((input) => {
            const iti = window.intlTelInput(input, {
                initialCountry: 'et',
                preferredCountries: ['et', 'ke', 'us', 'gb', 'ae'],
                separateDialCode: true,
                nationalMode: true,
                autoPlaceholder: 'aggressive',
                // Accept all number types (mobile, fixed-line, etc.)
                validationNumberTypes: null,
                strictMode: false
            });

            phoneInstances.set(input, iti);
            clearFieldValidityOnInput(input);
        });
    }

    function validateTextLengths(form) {
        const lengthRules = [
            { id: 'fullName', min: 3, msg: 'Please enter at least 3 characters for full name.' },
            { id: 'company', min: 2, msg: 'Please enter at least 2 characters for company name.' },
            { id: 'contactName', min: 3, msg: 'Please enter at least 3 characters for your name.' },
            { id: 'contactSubject', min: 3, msg: 'Please enter at least 3 characters for subject.' },
            { id: 'message', min: 12, msg: 'Please enter at least 12 characters for your message.' },
            { id: 'contactMessage', min: 12, msg: 'Please enter at least 12 characters for your message.' }
        ];

        let isValid = true;
        lengthRules.forEach((rule) => {
            const field = form.querySelector(`#${rule.id}`);
            if (!field) return;
            const value = field.value.trim();
            if (value.length < rule.min) {
                field.setCustomValidity(rule.msg);
                isValid = false;
            } else {
                field.setCustomValidity('');
            }
        });

        return isValid;
    }

    function validatePhoneFields(form) {
        const telFields = form.querySelectorAll('input.js-phone-input[type="tel"]');
        let isValid = true;

        telFields.forEach((field) => {
            const value = field.value.trim();
            const iti = phoneInstances.get(field);
            field.setCustomValidity('');

            if (!value) {
                if (field.required) {
                    field.setCustomValidity('Phone number is required.');
                    isValid = false;
                }
                return;
            }

            if (iti && typeof iti.isValidNumber === 'function') {
                const isPossible = typeof iti.isPossibleNumber === 'function' ? iti.isPossibleNumber() : true;
                const isValid = iti.isValidNumber();

                if (!isPossible && !isValid) {
                    field.setCustomValidity('Please enter a valid phone number with country code.');
                    isValid = false;
                } else if (typeof iti.getNumber === 'function') {
                    const e164Number = iti.getNumber();
                    if (e164Number) field.value = e164Number;
                }
            } else {
                const plainDigits = value.replace(/\D/g, '');
                if (plainDigits.length < 7 || plainDigits.length > 15) {
                    field.setCustomValidity('Please enter a valid phone number.');
                    isValid = false;
                }
            }
        });

        return isValid;
    }

    function bindFormValidation(form, successMessage) {
        if (!form) return;

        form.querySelectorAll('input, select, textarea').forEach(clearFieldValidityOnInput);

        form.addEventListener('submit', (e) => {
                e.preventDefault();

                const textValid = validateTextLengths(form);
                const phoneValid = validatePhoneFields(form);

                if (!textValid || !phoneValid || !form.checkValidity()) {
                    form.reportValidity();
                    return;
                }

                // If this form is configured to use Formspree, submit via fetch
                const action = (form.getAttribute('action') || '').trim();
                if (action && action.includes('formspree.io')) {
                    (async () => {
                        const submitBtn = form.querySelector('button[type="submit"]');
                        if (submitBtn) submitBtn.disabled = true;
                        const fd = new FormData(form);
                        // ensure reply-to is set when an email input exists
                        const emailInput = form.querySelector('input[type="email"]');
                        if (emailInput && !fd.get('_replyto')) fd.set('_replyto', emailInput.value || '');
                        if (!fd.get('_subject')) fd.set('_subject', 'Website submission');

                        try {
                            const res = await fetch(action, { method: 'POST', body: fd, headers: { 'Accept': 'application/json' } });
                            if (res.ok) {
                                showNotification(successMessage);
                                form.reset();
                            } else {
                                showNotification('Submission failed — please try again.');
                            }
                        } catch (err) {
                            showNotification('Submission failed — please check your connection.');
                        } finally {
                            if (submitBtn) submitBtn.disabled = false;
                        }
                    })();
                    return;
                }

                // Fallback: local UI-only notification (no external submit)
                showNotification(successMessage);
                form.reset();
        });
    }

    initializePhoneInputs();

    // Newsletter form
    const newsletterForms = document.querySelectorAll('#newsletterForm');
    newsletterForms.forEach(form => {
        form.addEventListener('submit', (e) => {
            e.preventDefault();
            const email = form.querySelector('input[type="email"]').value;
            if (email) {
                showNotification('Thank you for subscribing!');
                form.reset();
            }
        });
    });

    // Collaboration form
    const collabForm = document.getElementById('collabForm');
    bindFormValidation(collabForm, 'Thank you! We\'ll review your proposal and contact you soon.');

    // Contact form
    const contactForm = document.getElementById('contactForm');
    bindFormValidation(contactForm, 'Thank you for your message! We\'ll get back to you shortly.');
}

function showNotification(message) {
    const notification = document.createElement('div');
    notification.className = 'notification';
    notification.style.cssText = `
        position: fixed;
        top: 100px;
        right: 20px;
        background: linear-gradient(135deg, #FFB74D, #FF9800);
        color: #000;
        padding: 20px 30px;
        border-radius: 10px;
        box-shadow: 0 10px 30px rgba(0, 0, 0, 0.3);
        font-weight: 600;
        z-index: 3000;
        animation: slideInUp 0.3s ease-out;
    `;
    notification.textContent = message;
    document.body.appendChild(notification);

    setTimeout(() => {
        notification.style.animation = 'slideInDown 0.3s ease-out reverse';
        setTimeout(() => notification.remove(), 300);
    }, 3000);
}

// ===========================
// GALLERY FILTER
// ===========================

function setupGalleryFilter() {
    const filterButtons = document.querySelectorAll('.gallery-filter-btn, .filter-btn');
    const items = document.querySelectorAll('.gallery-item, .episode-card-large, .short-card-page');

    filterButtons.forEach(btn => {
        btn.addEventListener('click', () => {
            // Update active button
            filterButtons.forEach(b => b.classList.remove('active'));
            btn.classList.add('active');

            const filter = btn.dataset.filter;

            // Filter items
            items.forEach(item => {
                const category = item.dataset.category;
                if (filter === 'all' || category === filter) {
                    item.style.display = 'block';
                } else {
                    item.style.display = 'none';
                }
            });
        });
    });
}

// ===========================
// LIGHTBOX FUNCTIONALITY
// ===========================

function setupLightbox() {
    const lightbox = document.getElementById('lightbox');
    const lightboxImage = document.getElementById('lightboxImage');
    const lightboxCaption = document.getElementById('lightboxCaption');
    const expandButtons = document.querySelectorAll('.gallery-expand-btn');
    const galleryItems = document.querySelectorAll('.gallery-item img');

    let currentImageIndex = 0;
    let allImages = [];

    function openLightbox(index) {
        currentImageIndex = index;
        if (allImages[index]) {
            lightboxImage.src = allImages[index].src;
            const title = allImages[index].closest('.gallery-item')?.querySelector('.gallery-title')?.textContent;
            lightboxCaption.textContent = title || '';
            lightbox.classList.add('active');
        }
    }

    function closeLightbox() {
        lightbox.classList.remove('active');
    }

    function nextImage() {
        currentImageIndex = (currentImageIndex + 1) % allImages.length;
        openLightbox(currentImageIndex);
    }

    function prevImage() {
        currentImageIndex = (currentImageIndex - 1 + allImages.length) % allImages.length;
        openLightbox(currentImageIndex);
    }

    // Setup gallery images
    galleryItems.forEach((img, index) => {
        allImages.push(img);
        
        const btn = img.closest('.gallery-item')?.querySelector('.gallery-expand-btn');
        if (btn) {
            btn.addEventListener('click', (e) => {
                e.preventDefault();
                openLightbox(index);
            });
        }
    });

    // Lightbox controls
    if (lightbox) {
        document.querySelector('.lightbox-close')?.addEventListener('click', closeLightbox);
        document.querySelector('.lightbox-next')?.addEventListener('click', nextImage);
        document.querySelector('.lightbox-prev')?.addEventListener('click', prevImage);

        // Close on outside click
        lightbox.addEventListener('click', (e) => {
            if (e.target === lightbox) closeLightbox();
        });

        // Keyboard navigation
        document.addEventListener('keydown', (e) => {
            if (lightbox.classList.contains('active')) {
                if (e.key === 'ArrowRight') nextImage();
                if (e.key === 'ArrowLeft') prevImage();
                if (e.key === 'Escape') closeLightbox();
            }
        });
    }
}

// ===========================
// CAROUSEL/SCROLL FUNCTIONALITY
// ===========================

function setupCarousels() {
    const carousels = document.querySelectorAll('.episodes-carousel, .shorts-carousel, .gallery-showcase, .testimonials-carousel, .benefits-carousel-track');

    carousels.forEach(carousel => {
        // Smooth scrolling for carousels
        let isDown = false;
        let startX;
        let scrollLeft;

        carousel.addEventListener('mousedown', (e) => {
            isDown = true;
            startX = e.pageX - carousel.offsetLeft;
            scrollLeft = carousel.scrollLeft;
        });

        carousel.addEventListener('mouseleave', () => {
            isDown = false;
        });

        carousel.addEventListener('mouseup', () => {
            isDown = false;
        });

        carousel.addEventListener('mousemove', (e) => {
            if (!isDown) return;
            e.preventDefault();
            const x = e.pageX - carousel.offsetLeft;
            const walk = (x - startX) * 1;
            carousel.scrollLeft = scrollLeft - walk;
        });

        // Touch support for mobile
        carousel.addEventListener('touchstart', (e) => {
            startX = e.touches[0].pageX - carousel.offsetLeft;
            scrollLeft = carousel.scrollLeft;
        });

        carousel.addEventListener('touchmove', (e) => {
            const x = e.touches[0].pageX - carousel.offsetLeft;
            const walk = (x - startX) * 1;
            carousel.scrollLeft = scrollLeft - walk;
        });
    });
}

// ===========================
// DESTINATIONS ROW CAROUSEL
// ===========================

function setupDestinationCarousel() {
    const track = document.getElementById('destinationsGrid');
    const prevBtn = document.getElementById('destinationPrev');
    const nextBtn = document.getElementById('destinationNext');
    if (!track || !prevBtn || !nextBtn) return;

    const cards = Array.from(track.querySelectorAll('.destination-card'));
    if (cards.length === 0) return;

    function getStepSize() {
        const gap = parseFloat(window.getComputedStyle(track).gap) || 0;
        const cardWidth = cards[0].offsetWidth || 0;
        return cardWidth + gap;
    }

    function updateSelectedCard() {
        const viewportCenter = track.scrollLeft + (track.clientWidth / 2);
        let nearestCard = cards[0];
        let smallestDistance = Infinity;

        cards.forEach((card) => {
            const cardCenter = card.offsetLeft + (card.offsetWidth / 2);
            const distance = Math.abs(cardCenter - viewportCenter);
            if (distance < smallestDistance) {
                smallestDistance = distance;
                nearestCard = card;
            }
        });

        cards.forEach((card) => card.classList.remove('is-selected'));
        nearestCard.classList.add('is-selected');
    }

    function scrollByStep(direction) {
        track.scrollBy({
            left: direction * getStepSize(),
            behavior: 'smooth'
        });
    }

    prevBtn.addEventListener('click', () => scrollByStep(-1));
    nextBtn.addEventListener('click', () => scrollByStep(1));

    cards.forEach((card) => {
        card.addEventListener('click', () => {
            card.scrollIntoView({ behavior: 'smooth', inline: 'center', block: 'nearest' });
        });
    });

    let ticking = false;
    track.addEventListener('scroll', () => {
        if (ticking) return;
        ticking = true;
        window.requestAnimationFrame(() => {
            updateSelectedCard();
            ticking = false;
        });
    }, { passive: true });

    window.addEventListener('resize', updateSelectedCard);

    cards[0].classList.add('is-selected');
    updateSelectedCard();
}

// ===========================
// GALLERY CAROUSEL
// ===========================

function setupGalleryCarousel() {
    const track = document.getElementById('galleryShowcase');
    const prevBtn = document.getElementById('galleryPrev');
    const nextBtn = document.getElementById('galleryNext');
    if (!track || !prevBtn || !nextBtn) return;

    const items = Array.from(track.querySelectorAll('.gallery-item'));
    if (items.length === 0) return;

    function getStepSize() {
        const gap = parseFloat(window.getComputedStyle(track).gap) || 0;
        const itemWidth = items[0].offsetWidth || 0;
        return itemWidth + gap;
    }

    function updateSelectedItem() {
        const viewportCenter = track.scrollLeft + (track.clientWidth / 2);
        let nearestItem = items[0];
        let smallestDistance = Infinity;

        items.forEach((item) => {
            const itemCenter = item.offsetLeft + (item.offsetWidth / 2);
            const distance = Math.abs(itemCenter - viewportCenter);
            if (distance < smallestDistance) {
                smallestDistance = distance;
                nearestItem = item;
            }
        });

        items.forEach((item) => item.classList.remove('is-selected'));
        nearestItem.classList.add('is-selected');
    }

    function scrollByStep(direction) {
        track.scrollBy({
            left: direction * getStepSize(),
            behavior: 'smooth'
        });
    }

    prevBtn.addEventListener('click', () => scrollByStep(-1));
    nextBtn.addEventListener('click', () => scrollByStep(1));

    items.forEach((item) => {
        item.addEventListener('click', () => {
            item.scrollIntoView({ behavior: 'smooth', inline: 'center', block: 'nearest' });
        });
    });

    let ticking = false;
    track.addEventListener('scroll', () => {
        if (ticking) return;
        ticking = true;
        window.requestAnimationFrame(() => {
            updateSelectedItem();
            ticking = false;
        });
    }, { passive: true });

    window.addEventListener('resize', updateSelectedItem);

    items[0].classList.add('is-selected');
    updateSelectedItem();
}

function setupDestinationGalleryControls() {
    const galleries = document.querySelectorAll('.destination-gallery');

    galleries.forEach((gallery) => {
        const preview = gallery.querySelector('.gallery-preview');
        const prevButton = gallery.querySelector('.gallery-control-prev');
        const nextButton = gallery.querySelector('.gallery-control-next');

        if (!preview || !prevButton || !nextButton) return;

        const getScrollAmount = () => preview.clientWidth * 0.9;

        prevButton.addEventListener('click', () => {
            preview.scrollBy({ left: -getScrollAmount(), behavior: 'smooth' });
        });

        nextButton.addEventListener('click', () => {
            preview.scrollBy({ left: getScrollAmount(), behavior: 'smooth' });
        });
    });
}

// ===========================
// TESTIMONIALS CAROUSEL
// ===========================

function setupTestimonialsCarousel() {
    const track = document.getElementById('testimonialsCarousel');
    const prevBtn = document.getElementById('testimonialsPrev');
    const nextBtn = document.getElementById('testimonialsNext');
    if (!track || !prevBtn || !nextBtn) return;

    const cards = Array.from(track.querySelectorAll('.testimonial-card'));
    if (cards.length === 0) return;

    function getStepSize() {
        const gap = parseFloat(window.getComputedStyle(track).gap) || 0;
        const cardWidth = cards[0].offsetWidth || 0;
        return cardWidth + gap;
    }

    function updateSelectedCard() {
        const viewportCenter = track.scrollLeft + (track.clientWidth / 2);
        let nearestCard = cards[0];
        let smallestDistance = Infinity;

        cards.forEach((card) => {
            const cardCenter = card.offsetLeft + (card.offsetWidth / 2);
            const distance = Math.abs(cardCenter - viewportCenter);
            if (distance < smallestDistance) {
                smallestDistance = distance;
                nearestCard = card;
            }
        });

        cards.forEach((card) => card.classList.remove('is-selected'));
        nearestCard.classList.add('is-selected');
    }

    function scrollByStep(direction) {
        track.scrollBy({
            left: direction * getStepSize(),
            behavior: 'smooth'
        });
    }

    prevBtn.addEventListener('click', () => scrollByStep(-1));
    nextBtn.addEventListener('click', () => scrollByStep(1));

    cards.forEach((card) => {
        card.addEventListener('click', () => {
            card.scrollIntoView({ behavior: 'smooth', inline: 'center', block: 'nearest' });
        });
    });

    let ticking = false;
    track.addEventListener('scroll', () => {
        if (ticking) return;
        ticking = true;
        window.requestAnimationFrame(() => {
            updateSelectedCard();
            ticking = false;
        });
    }, { passive: true });

    window.addEventListener('resize', updateSelectedCard);

    cards[0].classList.add('is-selected');
    updateSelectedCard();
}

// ===========================
// COLLABORATION SHOWCASES
// ===========================

function setupCollabShowcases() {
    const setupScrollButtons = (trackId, prevId, nextId) => {
        const track = document.getElementById(trackId);
        const prevBtn = document.getElementById(prevId);
        const nextBtn = document.getElementById(nextId);

        if (!track || !prevBtn || !nextBtn) return;

        const getStepSize = () => track.clientWidth * 0.9;

        prevBtn.addEventListener('click', () => {
            track.scrollBy({ left: -getStepSize(), behavior: 'smooth' });
        });

        nextBtn.addEventListener('click', () => {
            track.scrollBy({ left: getStepSize(), behavior: 'smooth' });
        });
    };

    setupScrollButtons('benefitsCarousel', 'benefitsPrev', 'benefitsNext');

    const partnersTrack = document.getElementById('partnersCarousel');
    if (partnersTrack) {
        const originals = Array.from(partnersTrack.querySelectorAll('[data-partner-name]:not([data-cloned="true"])'));
        Array.from(partnersTrack.querySelectorAll('[data-cloned="true"]')).forEach((card) => card.remove());

        if (originals.length > 0) {
            originals.forEach((card) => {
                const clone = card.cloneNode(true);
                clone.dataset.cloned = 'true';
                clone.setAttribute('aria-hidden', 'true');
                partnersTrack.appendChild(clone);
            });

            const updateMarqueeSpeed = () => {
                const width = partnersTrack.scrollWidth / 2;
                if (!width) return;
                const duration = Math.max(12, width / 95);
                partnersTrack.style.setProperty('--partner-marquee-duration', `${duration}s`);
            };

            requestAnimationFrame(updateMarqueeSpeed);
            window.addEventListener('resize', updateMarqueeSpeed);
        }
    }

    const modal = document.getElementById('partnerModal');
    const modalLogo = document.getElementById('partnerModalLogo');
    const modalFocus = document.getElementById('partnerModalFocus');
    const modalTitle = document.getElementById('partnerModalTitle');
    const modalSubtitle = document.getElementById('partnerModalSubtitle');
    const modalBody = document.getElementById('partnerModalBody');
    const partnerCards = document.querySelectorAll('[data-partner-name]');

    if (!modal || !modalLogo || !modalFocus || !modalTitle || !modalSubtitle || !modalBody || partnerCards.length === 0) {
        return;
    }

    const logoClassMap = {
        SH: 'partner-modal-logo--gold',
        RV: 'partner-modal-logo--green',
        ST: 'partner-modal-logo--blue',
        LC: 'partner-modal-logo--coral',
        LS: 'partner-modal-logo--purple',
        ES: 'partner-modal-logo--amber'
    };

    function applyModalLogoStyle(logoKey) {
        modalLogo.className = 'partner-modal-logo';
        const logoClass = logoClassMap[logoKey];
        if (logoClass) {
            modalLogo.classList.add(logoClass);
        }
    }

    function openModal(card) {
        const name = card.dataset.partnerName || '';
        const subtitle = card.dataset.partnerSubtitle || '';
        const detail = card.dataset.partnerDetail || '';
        const logo = card.dataset.partnerLogo || '';
        const focus = card.dataset.partnerFocus || 'Partner';
        const image = card.dataset.partnerImage || '';

        modalTitle.textContent = name;
        modalSubtitle.textContent = subtitle;
        modalBody.textContent = detail;
        modalFocus.textContent = focus;
        modalLogo.innerHTML = '';
        if (image) {
            const logoImage = document.createElement('img');
            logoImage.src = image;
            logoImage.alt = `${name} Logo`;
            logoImage.className = 'partner-modal-image';

            // Per-partner color treatment: invert white logos to black when needed
            // SY (SY Creatives) and BF (Besu Fitness) should display black in popup
            if (logo === 'SY' || logo === 'BF') {
                logoImage.style.filter = 'invert(1)';
            } else {
                logoImage.style.filter = '';
            }

            modalLogo.appendChild(logoImage);
        } else {
            modalLogo.textContent = logo;
            applyModalLogoStyle(logo);
        }
        modal.classList.add('active');
        modal.setAttribute('aria-hidden', 'false');
        document.body.style.overflow = 'hidden';
    }

    function closeModal() {
        modal.classList.remove('active');
        modal.setAttribute('aria-hidden', 'true');
        document.body.style.overflow = '';
    }

    partnersTrack?.addEventListener('click', (event) => {
        const card = event.target.closest('[data-partner-name]');
        if (!card) return;
        // allow cloned/ghost cards to open modal as well (they carry the same data-* attributes)
        openModal(card);
    });

    modal.querySelectorAll('[data-partner-close]').forEach((button) => {
        button.addEventListener('click', closeModal);
    });

    modal.addEventListener('click', (event) => {
        if (event.target === modal) {
            closeModal();
        }
    });

    document.addEventListener('keydown', (event) => {
        if (event.key === 'Escape' && modal.classList.contains('active')) {
            closeModal();
        }
    });
}

// ===========================
// SMOOTH SCROLL BEHAVIOR
// ===========================

document.querySelectorAll('a[href^="#"]').forEach(anchor => {
    anchor.addEventListener('click', function (e) {
        const href = this.getAttribute('href');
        if (href === '#') {
            e.preventDefault();
            window.scrollTo({ top: 0, behavior: 'smooth' });
        } else {
            const target = document.querySelector(href);
            if (target) {
                e.preventDefault();
                target.scrollIntoView({ behavior: 'smooth' });
            }
        }
    });
});

// ===========================
// BUTTON INTERACTIONS
// ===========================

document.addEventListener('DOMContentLoaded', () => {
    const buttons = document.querySelectorAll('.btn');
    
    buttons.forEach(btn => {
        btn.addEventListener('click', function(e) {
            // Ripple effect
            const ripple = document.createElement('span');
            const rect = this.getBoundingClientRect();
            const size = Math.max(rect.width, rect.height);
            const x = e.clientX - rect.left - size / 2;
            const y = e.clientY - rect.top - size / 2;
            
            ripple.style.cssText = `
                position: absolute;
                width: ${size}px;
                height: ${size}px;
                background: rgba(255, 255, 255, 0.6);
                border-radius: 50%;
                left: ${x}px;
                top: ${y}px;
                pointer-events: none;
                animation: ripple 0.6s ease-out;
            `;
            
            this.style.position = 'relative';
            this.style.overflow = 'hidden';
            this.appendChild(ripple);
            
            setTimeout(() => ripple.remove(), 600);
        });
    });
});

// Add ripple animation to stylesheet dynamically
const style = document.createElement('style');
style.textContent = `
    @keyframes ripple {
        to {
            transform: scale(4);
            opacity: 0;
        }
    }
`;
document.head.appendChild(style);

// ===========================
// LAZY LOADING IMAGES
// ===========================

function setupLazyLoading() {
    const images = document.querySelectorAll('img[data-src]');
    
    const imageObserver = new IntersectionObserver((entries, observer) => {
        entries.forEach(entry => {
            if (entry.isIntersecting) {
                const img = entry.target;
                img.src = img.dataset.src;
                img.removeAttribute('data-src');
                observer.unobserve(img);
            }
        });
    });

    images.forEach(img => imageObserver.observe(img));
}

// ===========================
// UTILITY FUNCTIONS
// ===========================

function debounce(func, delay) {
    let timeout;
    return function(...args) {
        clearTimeout(timeout);
        timeout = setTimeout(() => func.apply(this, args), delay);
    };
}

// Smooth page transitions
window.addEventListener('beforeunload', () => {
    document.body.style.opacity = '0.8';
});

window.addEventListener('load', () => {
    document.body.style.opacity = '1';
});

// ===========================
// ACCESSIBILITY
// ===========================

// Keyboard navigation for buttons
document.addEventListener('keydown', (e) => {
    if (e.key === 'Enter') {
        const activeElement = document.activeElement;
        if (activeElement && (activeElement.classList.contains('btn') || activeElement.tagName === 'BUTTON')) {
            activeElement.click();
        }
    }
});

// ===========================
// PERFORMANCE OPTIMIZATION
// ===========================

// Prevent layout thrashing
const performanceOptimizations = {
    scrollListener: debounce(() => {
        setupScrollEffects();
    }, 100)
};

// ===========================
// INITIALIZATION ON LOAD
// ===========================

window.addEventListener('load', () => {
    setupLazyLoading();
    
    // Add fade-in animation to body
    document.body.style.opacity = '1';
});

// ===========================
// RESPONSIVE BEHAVIOR
// ===========================

window.addEventListener('resize', debounce(() => {
    // Handle responsive changes
    const navbar = document.querySelector('.navbar');
    if (window.innerWidth > 768) {
        navbar?.classList.remove('scroll-active');
    }
}, 250));

// ===========================
// DARK MODE SUPPORT
// ===========================

// Check for system preference
if (window.matchMedia && window.matchMedia('(prefers-color-scheme: dark)').matches) {
    document.documentElement.style.colorScheme = 'dark';
}

// ===========================
// PRINT STYLES SUPPORT
// ===========================

window.addEventListener('beforeprint', () => {
    document.body.style.backgroundColor = '#fff';
    document.body.style.color = '#000';
});

window.addEventListener('afterprint', () => {
    document.body.style.backgroundColor = 'var(--dark-bg)';
    document.body.style.color = 'var(--text-primary)';
});

// ===========================
// CONSOLE GREETING
// ===========================

console.log('%c🌍 Welcome to Explore Arbaminch!', 'font-size: 20px; font-weight: bold; color: #FFB74D;');
console.log('%cDiscover Ethiopia\'s Hidden Paradise', 'font-size: 14px; color: #FF9800;');
