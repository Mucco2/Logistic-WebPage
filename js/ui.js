/* ========================================
   UI: animationer, back-to-top, lightbox, cookie, tæller
   ======================================== */
(function(){

  /* Fade-up ved scroll */
  const observer = new IntersectionObserver((entries) => {
    entries.forEach(e => {
      if(e.isIntersecting){
        e.target.classList.add('visible');
        observer.unobserve(e.target);
      }
    });
  }, { threshold: 0.12 });
  document.querySelectorAll('.fade-up').forEach(el => observer.observe(el));

  /* Back-to-top */
  const backBtn = document.getElementById('backToTop');
  if(backBtn){
    window.addEventListener('scroll', () => {
      backBtn.classList.toggle('visible', window.scrollY > 500);
    }, {passive:true});
    backBtn.addEventListener('click', () => {
      window.scrollTo({top:0, behavior:'smooth'});
    });
  }

  /* Lightbox for gallery */
  const lightbox = document.getElementById('lightbox');
  if(lightbox){
    const lbImg = lightbox.querySelector('img');
    const lbCaption = lightbox.querySelector('.lightbox-caption');
    const lbClose = lightbox.querySelector('.lightbox-close');

    document.querySelectorAll('.gallery-item').forEach(item => {
      item.addEventListener('click', () => {
        const img = item.querySelector('img');
        if(!img) return;
        lbImg.src = img.src;
        lbImg.alt = img.alt || '';
        lbCaption.textContent = img.alt || '';
        lightbox.classList.add('open');
        document.body.style.overflow = 'hidden';
      });
      item.addEventListener('keydown', (e) => {
        if(e.key === 'Enter' || e.key === ' '){
          e.preventDefault();
          item.click();
        }
      });
      item.setAttribute('tabindex','0');
      item.setAttribute('role','button');
    });

    const close = () => {
      lightbox.classList.remove('open');
      document.body.style.overflow = '';
    };
    lbClose.addEventListener('click', close);
    lightbox.addEventListener('click', (e) => {
      if(e.target === lightbox) close();
    });
    document.addEventListener('keydown', (e) => {
      if(e.key === 'Escape' && lightbox.classList.contains('open')) close();
    });
  }

  /* Cookie consent */
  const cookie = document.getElementById('cookieBanner');
  if(cookie){
    if(!localStorage.getItem('lw_cookie_choice')){
      setTimeout(() => cookie.classList.add('show'), 1200);
    }
    cookie.querySelector('.cookie-accept')?.addEventListener('click', () => {
      localStorage.setItem('lw_cookie_choice','accepted');
      cookie.classList.remove('show');
    });
    cookie.querySelector('.cookie-decline')?.addEventListener('click', () => {
      localStorage.setItem('lw_cookie_choice','declined');
      cookie.classList.remove('show');
    });
  }

  /* Count-up ved trust-tal */
  const counters = document.querySelectorAll('.count-up');
  const counterObs = new IntersectionObserver((entries) => {
    entries.forEach(e => {
      if(!e.isIntersecting) return;
      const el = e.target;
      const target = parseInt(el.dataset.target, 10);
      if(isNaN(target)){ counterObs.unobserve(el); return; }
      const suffix = el.dataset.suffix || '';
      const dur = 1400;
      const start = performance.now();
      const tick = (now) => {
        const p = Math.min((now - start)/dur, 1);
        const val = Math.floor(target * (1 - Math.pow(1 - p, 3)));
        el.textContent = val + suffix;
        if(p < 1) requestAnimationFrame(tick);
        else el.textContent = target + suffix;
      };
      requestAnimationFrame(tick);
      counterObs.unobserve(el);
    });
  }, {threshold:0.4});
  counters.forEach(c => counterObs.observe(c));

  /* Current year i footer */
  const yearEl = document.getElementById('currentYear');
  if(yearEl) yearEl.textContent = new Date().getFullYear();

})();
