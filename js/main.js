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
  
    // Optional inline status area (add a <p id="form-status"></p> under the button if you want)
    const status = document.getElementById('form-status');
  
    form.addEventListener('submit', async (e) => {
      // Progressive enhancement: if fetch isn't available, allow normal POST
      if (!window.fetch) return;
  
      e.preventDefault();
  
      const submitBtn = form.querySelector('button[type="submit"]');
      const originalText = submitBtn.textContent;
  
      submitBtn.textContent = 'Se trimite... / Sending...';
      submitBtn.disabled = true;
  
      try {
        const res = await fetch(form.action || 'https://formspree.io/f/YOUR_ID', {
          method: 'POST',
          body: new FormData(form),
          headers: { 'Accept': 'application/json' } // prevents redirect; returns JSON
        });
  
        if (res.ok) {
          form.reset();
          if (status) {
            status.textContent = 'Mesaj trimis cu succes! / Message sent successfully!';
            status.style.color = 'green';
          } else {
            alert('Mesaj trimis cu succes! / Message sent successfully!');
          }
        } else {
          // Try to read Formspree error body
          let errText = 'Eroare la trimitere. Verifică ID-ul formularului.';
          try {
            const data = await res.json();
            if (data && data.errors && data.errors.length) {
              errText = data.errors.map(e => e.message).join(', ');
            }
          } catch {}
          if (status) { status.textContent = errText; status.style.color = 'crimson'; }
          else { alert(errText); }
        }
      } catch (err) {
        if (status) { status.textContent = 'Nu pot contacta serverul. Verifică conexiunea.'; status.style.color = 'crimson'; }
        else { alert('Nu pot contacta serverul. Verifică conexiunea.'); }
      } finally {
        submitBtn.textContent = originalText;
        submitBtn.disabled = false;
      }
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
