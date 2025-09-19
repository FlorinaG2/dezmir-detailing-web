// Main JavaScript functionality
document.addEventListener('DOMContentLoaded', function() {
    // Initialize all functionality
    initHeader();
    initLanguageSwitching();
    initSmoothScrolling();
    initCompareSlider();
    initGallery();
    initContactForm();
    initLightbox();
    initAnimations();
});

// Header functionality
function initHeader() {
    const header = document.getElementById('header');
    const mobileMenuBtn = document.getElementById('mobile-menu-btn');
    const navMobile = document.getElementById('nav-mobile');
    const navLinks = document.querySelectorAll('.nav-link');

    // Scroll effect
    window.addEventListener('scroll', function() {
        if (window.scrollY > 50) {
            header.classList.add('scrolled');
        } else {
            header.classList.remove('scrolled');
        }
    });

    // Mobile menu toggle
    mobileMenuBtn.addEventListener('click', function() {
        mobileMenuBtn.classList.toggle('active');
        navMobile.classList.toggle('active');
    });

    // Close mobile menu when clicking on links
    navLinks.forEach(link => {
        link.addEventListener('click', function() {
            mobileMenuBtn.classList.remove('active');
            navMobile.classList.remove('active');
        });
    });

    // Active navigation highlighting
    window.addEventListener('scroll', updateActiveNav);
}

function updateActiveNav() {
    const sections = document.querySelectorAll('section[id]');
    const navLinks = document.querySelectorAll('.nav-link');
    
    let current = '';
    sections.forEach(section => {
        const sectionTop = section.offsetTop - 100;
        const sectionHeight = section.clientHeight;
        if (window.scrollY >= sectionTop && window.scrollY < sectionTop + sectionHeight) {
            current = section.getAttribute('id');
        }
    });

    navLinks.forEach(link => {
        link.classList.remove('active');
        if (link.getAttribute('data-section') === current) {
            link.classList.add('active');
        }
    });
}

// Language switching
function initLanguageSwitching() {
    const langBtns = document.querySelectorAll('.lang-btn');
    const currentLang = getCurrentLanguage();

    // Set initial language
    setLanguage(currentLang);

    langBtns.forEach(btn => {
        btn.addEventListener('click', function() {
            const lang = this.getAttribute('data-lang');
            setLanguage(lang);
            saveLanguagePreference(lang);
        });
    });
}

function getCurrentLanguage() {
    // Check URL first
    const path = window.location.pathname;
    if (path.includes('/en.html') || path.includes('/en')) {
        return 'en';
    }
    
    // Check saved preference
    const saved = localStorage.getItem('language');
    if (saved) {
        return saved;
    }
    
    // Default to Romanian
    return 'ro';
}

function setLanguage(lang) {
    const elements = document.querySelectorAll('[data-translate]');
    
    elements.forEach(element => {
        const key = element.getAttribute('data-translate');
        if (translations[lang] && translations[lang][key]) {
            element.textContent = translations[lang][key];
        }
    });

    // Update active language button
    document.querySelectorAll('.lang-btn').forEach(btn => {
        btn.classList.remove('active');
        if (btn.getAttribute('data-lang') === lang) {
            btn.classList.add('active');
        }
    });

    // Update page language
    document.documentElement.lang = lang;
}

function saveLanguagePreference(lang) {
    localStorage.setItem('language', lang);
}

// Smooth scrolling
function initSmoothScrolling() {
    const navLinks = document.querySelectorAll('a[href^="#"]');
    
    navLinks.forEach(link => {
        link.addEventListener('click', function(e) {
            e.preventDefault();
            const targetId = this.getAttribute('href').substring(1);
            const targetElement = document.getElementById(targetId);
            
            if (targetElement) {
                const headerHeight = document.getElementById('header').offsetHeight;
                const targetPosition = targetElement.offsetTop - headerHeight;
                
                window.scrollTo({
                    top: targetPosition,
                    behavior: 'smooth'
                });
            }
        });
    });
}

// Compare slider
function initCompareSlider() {
    const slider = document.getElementById('compare-slider');
    const handle = document.getElementById('compare-handle');
    const afterImg = document.querySelector('.compare-after');
    
    if (!slider || !handle || !afterImg) return;

    let isDragging = false;

    function updateSlider(x) {
        const rect = slider.getBoundingClientRect();
        const percentage = Math.max(0, Math.min(100, ((x - rect.left) / rect.width) * 100));
        
        afterImg.style.width = percentage + '%';
        handle.style.left = percentage + '%';
    }

    // Mouse events
    slider.addEventListener('mousedown', function(e) {
        isDragging = true;
        updateSlider(e.clientX);
    });

    document.addEventListener('mousemove', function(e) {
        if (isDragging) {
            updateSlider(e.clientX);
        }
    });

    document.addEventListener('mouseup', function() {
        isDragging = false;
    });

    // Touch events
    slider.addEventListener('touchstart', function(e) {
        isDragging = true;
        updateSlider(e.touches[0].clientX);
    });

    document.addEventListener('touchmove', function(e) {
        if (isDragging) {
            e.preventDefault();
            updateSlider(e.touches[0].clientX);
        }
    });

    document.addEventListener('touchend', function() {
        isDragging = false;
    });
}

// Gallery functionality
function initGallery() {
    const galleryGrid = document.getElementById('gallery-grid');
    const filterBtns = document.querySelectorAll('.filter-btn');
    
    if (!galleryGrid) return;

    // Render gallery
    renderGallery('all');

    // Filter functionality
    filterBtns.forEach(btn => {
        btn.addEventListener('click', function() {
            const filter = this.getAttribute('data-filter');
            
            // Update active button
            filterBtns.forEach(b => b.classList.remove('active'));
            this.classList.add('active');
            
            // Filter gallery
            renderGallery(filter);
        });
    });
}

function renderGallery(filter) {
    const galleryGrid = document.getElementById('gallery-grid');
    if (!galleryGrid) return;

    let filteredData = galleryData;
    if (filter !== 'all') {
        filteredData = galleryData.filter(item => item.tag === filter);
    }

    galleryGrid.innerHTML = filteredData.map(item => `
        <div class="gallery-item" data-tag="${item.tag}" onclick="openLightbox(${item.id})">
            <img src="${item.src}" alt="${item.caption}" loading="lazy">
            <div class="gallery-overlay">
                <div class="gallery-tag">${item.tag}</div>
            </div>
        </div>
    `).join('');
}

// Lightbox functionality
function initLightbox() {
    const lightbox = document.getElementById('lightbox');
    const lightboxImg = document.getElementById('lightbox-img');
    const lightboxTag = document.getElementById('lightbox-tag');
    const lightboxCaption = document.getElementById('lightbox-caption');
    const lightboxClose = document.getElementById('lightbox-close');
    const lightboxPrev = document.getElementById('lightbox-prev');
    const lightboxNext = document.getElementById('lightbox-next');

    if (!lightbox) return;

    // Close lightbox
    lightboxClose.addEventListener('click', closeLightbox);
    lightbox.addEventListener('click', function(e) {
        if (e.target === lightbox) {
            closeLightbox();
        }
    });

    // Keyboard navigation
    document.addEventListener('keydown', function(e) {
        if (lightbox.classList.contains('active')) {
            if (e.key === 'Escape') {
                closeLightbox();
            } else if (e.key === 'ArrowLeft') {
                prevImage();
            } else if (e.key === 'ArrowRight') {
                nextImage();
            }
        }
    });

    // Navigation buttons
    if (lightboxPrev) lightboxPrev.addEventListener('click', prevImage);
    if (lightboxNext) lightboxNext.addEventListener('click', nextImage);
}

let currentImageIndex = 0;
let currentFilter = 'all';

function openLightbox(imageId) {
    const lightbox = document.getElementById('lightbox');
    const lightboxImg = document.getElementById('lightbox-img');
    const lightboxTag = document.getElementById('lightbox-tag');
    const lightboxCaption = document.getElementById('lightbox-caption');
    
    if (!lightbox) return;

    // Find image in current filtered data
    const activeFilter = document.querySelector('.filter-btn.active')?.getAttribute('data-filter') || 'all';
    let filteredData = galleryData;
    if (activeFilter !== 'all') {
        filteredData = galleryData.filter(item => item.tag === activeFilter);
    }
    
    currentImageIndex = filteredData.findIndex(item => item.id === imageId);
    currentFilter = activeFilter;

    if (currentImageIndex === -1) return;

    const image = filteredData[currentImageIndex];
    lightboxImg.src = image.src;
    lightboxImg.alt = image.caption;
    lightboxTag.textContent = image.tag;
    lightboxCaption.textContent = image.caption;

    lightbox.classList.add('active');
    document.body.style.overflow = 'hidden';
}

function closeLightbox() {
    const lightbox = document.getElementById('lightbox');
    if (lightbox) {
        lightbox.classList.remove('active');
        document.body.style.overflow = '';
    }
}

function nextImage() {
    const filteredData = currentFilter === 'all' ? galleryData : galleryData.filter(item => item.tag === currentFilter);
    currentImageIndex = (currentImageIndex + 1) % filteredData.length;
    updateLightboxImage(filteredData[currentImageIndex]);
}

function prevImage() {
    const filteredData = currentFilter === 'all' ? galleryData : galleryData.filter(item => item.tag === currentFilter);
    currentImageIndex = currentImageIndex === 0 ? filteredData.length - 1 : currentImageIndex - 1;
    updateLightboxImage(filteredData[currentImageIndex]);
}

function updateLightboxImage(image) {
    const lightboxImg = document.getElementById('lightbox-img');
    const lightboxTag = document.getElementById('lightbox-tag');
    const lightboxCaption = document.getElementById('lightbox-caption');
    
    if (lightboxImg) lightboxImg.src = image.src;
    if (lightboxImg) lightboxImg.alt = image.caption;
    if (lightboxTag) lightboxTag.textContent = image.tag;
    if (lightboxCaption) lightboxCaption.textContent = image.caption;
}

// Contact form
function initContactForm() {
    const form = document.getElementById('contact-form');
    if (!form) return;
  
    const status = document.getElementById('form-status');
  
    form.addEventListener('submit', function(e) {
      e.preventDefault();
      
      const submitBtn = form.querySelector('button[type="submit"]');
      const originalText = submitBtn.textContent;
  
      // Show loading state
      submitBtn.textContent = 'Se trimite...';
      submitBtn.disabled = true;
      status.textContent = '';
      status.style.color = '';
  
      // Get form data
      const formData = new FormData(form);
      const data = Object.fromEntries(formData);
  
      // Validation
      if (!data.name || !data.phone || !data.message) {
        status.textContent = 'Vă rugăm să completați toate câmpurile obligatorii.';
        status.style.color = 'crimson';
        submitBtn.textContent = originalText;
        submitBtn.disabled = false;
        return;
      }
  
      // Create email content
      const subject = `Mesaj nou de la ${data.name} - Dezmir Detailing`;
      const body = `Mesaj nou de la website Dezmir Detailing:

Nume: ${data.name}
Telefon: ${data.phone}
Email: ${data.email || 'Nu a fost furnizat'}

Mesaj:
${data.message}

---
Acest mesaj a fost trimis de pe website-ul dezmirdetailing.com`;

      // Create mailto link
      const mailtoLink = `mailto:contact@dezmirdetailing.com?subject=${encodeURIComponent(subject)}&body=${encodeURIComponent(body)}`;
      
      // Simulate sending
      setTimeout(() => {
        // Open email client
        window.location.href = mailtoLink;
        
        // Show success message
        status.innerHTML = `
          <div style="color: green; margin-top: 1rem; text-align: center;">
            <p><strong>✓ Mesajul a fost pregătit!</strong></p>
            <p>Clientul de email s-a deschis automat. Dacă nu s-a deschis, folosiți butoanele de mai jos:</p>
          </div>
        `;
        
        submitBtn.textContent = originalText;
        submitBtn.disabled = false;
        
        // Reset form
        form.reset();
        
        // Show alternative contact methods
        setTimeout(() => {
          status.innerHTML += `
            <div style="margin-top: 1rem; text-align: center;">
              <p style="color: var(--text-secondary); margin-bottom: 1rem;">Sau contactați-ne direct:</p>
              <div style="display: flex; gap: 1rem; justify-content: center; flex-wrap: wrap;">
                <a href="tel:+40742044770" class="btn btn-secondary" style="display: inline-flex; align-items: center; gap: 0.5rem;">
                  <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2">
                    <path d="M22 16.92v3a2 2 0 0 1-2.18 2 19.79 19.79 0 0 1-8.63-3.07 19.5 19.5 0 0 1-6-6 19.79 19.79 0 0 1-3.07-8.67A2 2 0 0 1 4.11 2h3a2 2 0 0 1 2 1.72 12.84 12.84 0 0 0 .7 2.81 2 2 0 0 1-.45 2.11L8.09 9.91a16 16 0 0 0 6 6l1.27-1.27a2 2 0 0 1 2.11-.45 12.84 12.84 0 0 0 2.81.7A2 2 0 0 1 22 16.92z" />
                  </svg>
                  Sună
                </a>
                <a href="https://wa.me/40742044770" target="_blank" rel="noopener noreferrer" class="btn btn-secondary" style="display: inline-flex; align-items: center; gap: 0.5rem;">
                  <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2">
                    <path d="M21 11.5a8.38 8.38 0 0 1-.9 3.8 8.5 8.5 0 0 1-7.6 4.7 8.38 8.38 0 0 1-3.8-.9L3 21l1.9-5.7a8.38 8.38 0 0 1-.9-3.8 8.5 8.5 0 0 1 4.7-7.6 8.38 8.38 0 0 1 3.8-.9h.5a8.48 8.48 0 0 1 8 8v.5z" />
                  </svg>
                  WhatsApp
                </a>
                <a href="${mailtoLink}" class="btn btn-secondary" style="display: inline-flex; align-items: center; gap: 0.5rem;">
                  <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2">
                    <path d="M4 4h16c1.1 0 2 .9 2 2v12c0 1.1-.9 2-2 2H4c-1.1 0-2-.9-2-2V6c0-1.1.9-2 2-2z" />
                    <polyline points="22,6 12,13 2,6" />
                  </svg>
                  Email
                </a>
              </div>
            </div>
          `;
        }, 1000);
        
      }, 1000);
    });
  }
  

//         // Simulate API call
//         setTimeout(() => {
//             console.log('Form submitted:', data);
//             alert('Mesajul a fost trimis cu succes! / Message sent successfully!');
//             form.reset();
//             submitBtn.textContent = originalText;
//             submitBtn.disabled = false;
//         }, 1000);
//     });
// }

// Animations
function initAnimations() {
    // Intersection Observer for fade-in animations
    const observerOptions = {
        threshold: 0.1,
        rootMargin: '0px 0px -50px 0px'
    };

    const observer = new IntersectionObserver(function(entries) {
        entries.forEach(entry => {
            if (entry.isIntersecting) {
                entry.target.classList.add('animate-fade-in-up');
            }
        });
    }, observerOptions);

    // Observe elements for animation
    const animateElements = document.querySelectorAll('.service-card, .process-step, .package-card, .testimonial-card, .gallery-item');
    animateElements.forEach(el => {
        observer.observe(el);
    });
}

// Utility functions
function scrollToContact() {
    const contactSection = document.getElementById('contact');
    if (contactSection) {
        const headerHeight = document.getElementById('header').offsetHeight;
        const targetPosition = contactSection.offsetTop - headerHeight;
        
        window.scrollTo({
            top: targetPosition,
            behavior: 'smooth'
        });
    }
}

// Global functions for HTML onclick handlers
window.openLightbox = openLightbox;
window.scrollToContact = scrollToContact;
