/* ========================================
   UI: animationer, back-to-top, lightbox, tæller
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

    if(lbImg && lbCaption && lbClose){
      let opener = null;
      let previousBodyOverflow = '';
      const captionId = lbCaption.id || 'lightbox-caption';

      lbCaption.id = captionId;
      lightbox.setAttribute('aria-modal', 'true');
      lightbox.setAttribute('aria-hidden', 'true');
      lightbox.setAttribute('aria-describedby', captionId);

      const focusCloseButton = () => {
        try{
          lbClose.focus({preventScroll:true});
        }catch(error){
          lbClose.focus();
        }
      };

      const open = (item) => {
        const img = item.querySelector('img');
        if(!img) return;

        opener = item;
        previousBodyOverflow = document.body.style.overflow;
        lbImg.src = img.currentSrc || img.src;
        lbImg.alt = img.alt || '';
        lbCaption.textContent = img.alt || 'Vergrößerte Bildansicht';
        lightbox.classList.add('open');
        lightbox.setAttribute('aria-hidden', 'false');
        document.body.style.overflow = 'hidden';
        requestAnimationFrame(() => {
          if(lightbox.classList.contains('open')) focusCloseButton();
        });
      };

      const close = () => {
        if(!lightbox.classList.contains('open')) return;
        const elementToFocus = opener;
        opener = null;
        if(elementToFocus?.isConnected){
          try{
            elementToFocus.focus({preventScroll:true});
          }catch(error){
            elementToFocus.focus();
          }
        }else{
          lbClose.blur();
        }

        lightbox.classList.remove('open');
        lightbox.setAttribute('aria-hidden', 'true');
        document.body.style.overflow = previousBodyOverflow;
      };

      document.querySelectorAll('.gallery-item').forEach(item => {
        const img = item.querySelector('img');
        if(!img) return;

        if(!item.hasAttribute('tabindex')) item.setAttribute('tabindex','0');
        if(!item.hasAttribute('role')) item.setAttribute('role','button');
        item.setAttribute('aria-haspopup', 'dialog');
        if(!item.hasAttribute('aria-label')){
          item.setAttribute('aria-label', `Bild vergrößern: ${img.alt || 'Galeriebild'}`);
        }

        item.addEventListener('click', () => open(item));
        item.addEventListener('keydown', (e) => {
          if(e.key === 'Enter' || e.key === ' '){
            e.preventDefault();
            open(item);
          }
        });
      });

      lbClose.addEventListener('click', close);
      lightbox.addEventListener('click', (e) => {
        if(e.target === lightbox) close();
      });
      document.addEventListener('keydown', (e) => {
        if(!lightbox.classList.contains('open')) return;

        if(e.key === 'Escape'){
          e.preventDefault();
          close();
          return;
        }

        if(e.key === 'Tab'){
          e.preventDefault();
          focusCloseButton();
        }
      });
    }
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
