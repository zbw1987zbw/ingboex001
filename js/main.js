/* ============================================
   INGBOEX - Main JavaScript
   ============================================ */

document.addEventListener('DOMContentLoaded', function() {

  // --- Mobile Menu Toggle ---
  const menuToggle = document.querySelector('.menu-toggle') || document.querySelector('.hamburger');
  const nav = document.querySelector('.nav') || document.querySelector('.nav-menu');

  if (menuToggle && nav) {
    menuToggle.addEventListener('click', function() {
      nav.classList.toggle('open');
      menuToggle.classList.toggle('active');
    });
  }

  // --- Mobile Dropdown Toggle ---
  const dropdowns = document.querySelectorAll('.dropdown');
  dropdowns.forEach(function(dropdown) {
    const link = dropdown.querySelector('.nav-link');
    if (link) {
      link.addEventListener('click', function(e) {
        if (window.innerWidth <= 768) {
          e.preventDefault();
          dropdown.classList.toggle('open');
        }
      });
    }
  });

  // --- Header Scroll Effect ---
  const header = document.querySelector('.header') || document.querySelector('.site-header');
  if (header) {
    window.addEventListener('scroll', function() {
      if (window.scrollY > 50) {
        header.classList.add('scrolled');
      } else {
        header.classList.remove('scrolled');
      }
    });
  }

  // --- Back to Top Button ---
  const backToTop = document.querySelector('.back-to-top');
  if (backToTop) {
    window.addEventListener('scroll', function() {
      if (window.scrollY > 500) {
        backToTop.classList.add('visible');
      } else {
        backToTop.classList.remove('visible');
      }
    });

    backToTop.addEventListener('click', function() {
      window.scrollTo({ top: 0, behavior: 'smooth' });
    });
  }

  // --- FAQ Accordion ---
  const faqItems = document.querySelectorAll('.faq-item');
  faqItems.forEach(function(item) {
    const question = item.querySelector('.faq-question');
    if (question) {
      question.addEventListener('click', function() {
        const isActive = item.classList.contains('active');
        // Close all items
        faqItems.forEach(function(fi) {
          fi.classList.remove('active');
        });
        // Open clicked item (unless it was already open)
        if (!isActive) {
          item.classList.add('active');
        }
      });
    }
  });

  // --- Product Tabs ---
  const productTabs = document.querySelectorAll('.product-tab');
  const productPanels = document.querySelectorAll('.product-detail-panel');

  productTabs.forEach(function(tab) {
    tab.addEventListener('click', function() {
      const target = this.getAttribute('data-tab') || this.getAttribute('data-target');

      // Update tabs
      productTabs.forEach(function(t) { t.classList.remove('active'); });
      this.classList.add('active');

      // Update panels - match by id with or without "panel-" prefix
      productPanels.forEach(function(panel) {
        panel.classList.remove('active');
        const panelId = panel.getAttribute('id');
        if (panelId === target || panelId === 'panel-' + target) {
          panel.classList.add('active');
        }
      });
    });
  });

  // --- Product Filter ---
  const productSearch = document.querySelector('#product-search') || document.querySelector('#product-search-input');
  const productCards = document.querySelectorAll('.product-card') ;
  const categoryCards = document.querySelectorAll('.category-large-card, .category-card');
  const allSearchableCards = productCards.length > 0 ? productCards : categoryCards;

  if (productSearch) {
    productSearch.addEventListener('input', function() {
      const query = this.value.toLowerCase();
      allSearchableCards.forEach(function(card) {
        const text = card.textContent.toLowerCase();
        if (text.includes(query)) {
          card.style.display = '';
        } else {
          card.style.display = 'none';
        }
      });
    });
  }

  // --- Smooth Scroll for Anchor Links ---
  document.querySelectorAll('a[href^="#"]').forEach(function(anchor) {
    anchor.addEventListener('click', function(e) {
      const target = document.querySelector(this.getAttribute('href'));
      if (target) {
        e.preventDefault();
        target.scrollIntoView({ behavior: 'smooth', block: 'start' });
      }
    });
  });

  // --- Intersection Observer for Animations ---
  const animatedElements = document.querySelectorAll('.animate-on-scroll');
  if (animatedElements.length > 0 && 'IntersectionObserver' in window) {
    const observer = new IntersectionObserver(function(entries) {
      entries.forEach(function(entry) {
        if (entry.isIntersecting) {
          entry.target.classList.add('animate');
          observer.unobserve(entry.target);
        }
      });
    }, { threshold: 0.1 });

    animatedElements.forEach(function(el) {
      observer.observe(el);
    });
  }

  // --- Contact Form Validation ---
  const contactForm = document.querySelector('#contact-form');
  if (contactForm) {
    contactForm.addEventListener('submit', function(e) {
      e.preventDefault();

      let valid = true;
      const name = contactForm.querySelector('#name');
      const email = contactForm.querySelector('#email');
      const message = contactForm.querySelector('#message');

      // Clear previous errors
      contactForm.querySelectorAll('.error').forEach(function(el) {
        el.remove();
      });

      if (name && !name.value.trim()) {
        showError(name, 'Please enter your name');
        valid = false;
      }

      if (email && !email.value.trim()) {
        showError(email, 'Please enter your email');
        valid = false;
      } else if (email && !isValidEmail(email.value)) {
        showError(email, 'Please enter a valid email');
        valid = false;
      }

      if (message && !message.value.trim()) {
        showError(message, 'Please enter your message');
        valid = false;
      }

      if (valid) {
        // 获取表单数据
        var nameVal = name ? name.value : '';
        var emailVal = email ? email.value : '';
        var phoneEl = contactForm.querySelector('#phone');
        var companyEl = contactForm.querySelector('#company');
        var productEl = contactForm.querySelector('#product-interest') || contactForm.querySelector('#product');
        var phoneVal = phoneEl ? phoneEl.value : '';
        var companyVal = companyEl ? companyEl.value : '';
        var productVal = productEl ? productEl.value : '';
        var messageVal = message ? message.value : '';

        // 构建 mailto 链接
        var subject = 'Inquiry from ' + nameVal + ' - INGBOEX Website';
        var body = 'Name: ' + nameVal + '\n';
        body += 'Email: ' + emailVal + '\n';
        if (phoneVal) body += 'Phone: ' + phoneVal + '\n';
        if (companyVal) body += 'Company: ' + companyVal + '\n';
        if (productVal) body += 'Product Interest: ' + productVal + '\n';
        body += '\nMessage:\n' + messageVal;

        var mailtoLink = 'mailto:282810882@qq.com?subject=' + encodeURIComponent(subject) + '&body=' + encodeURIComponent(body);

        // 显示成功提示
        var btn = contactForm.querySelector('button[type="submit"]');
        var originalText = btn.textContent;
        btn.textContent = 'Opening Email...';
        btn.style.background = '#10b981';
        btn.disabled = true;

        // 打开邮件客户端
        window.location.href = mailtoLink;

        setTimeout(function() {
          btn.textContent = originalText;
          btn.style.background = '';
          btn.disabled = false;
          contactForm.reset();
        }, 3000);
      }
    });
  }

  function showError(input, message) {
    const error = document.createElement('div');
    error.className = 'error';
    error.style.cssText = 'color:#ef4444;font-size:0.8rem;margin-top:5px;';
    error.textContent = message;
    input.parentNode.appendChild(error);
    input.style.borderColor = '#ef4444';
    input.addEventListener('input', function() {
      input.style.borderColor = '';
      const err = input.parentNode.querySelector('.error');
      if (err) err.remove();
    }, { once: true });
  }

  function isValidEmail(email) {
    return /^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(email);
  }

  // --- Current Year for Footer ---
  const yearEl = document.querySelector('#current-year');
  if (yearEl) {
    yearEl.textContent = new Date().getFullYear();
  }
});
