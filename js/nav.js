/* ========================================
   Navigation: scroll-state, hamburger, active link
   Heuristik 1 (systemstatus) + 3 (brugerkontrol)
   ======================================== */
(function(){
  const nav = document.getElementById('nav');
  const hamburger = document.getElementById('hamburger');
  const navLinks = document.getElementById('navLinks');

  if(!nav) return;

  // Scroll shadow
  window.addEventListener('scroll', () => {
    nav.classList.toggle('scrolled', window.scrollY > 20);
  });

  // Hamburger toggle
  if(hamburger && navLinks){
    hamburger.addEventListener('click', () => {
      const open = navLinks.classList.toggle('open');
      hamburger.classList.toggle('active', open);
      hamburger.setAttribute('aria-expanded', open ? 'true' : 'false');
    });
    navLinks.querySelectorAll('a').forEach(a => {
      a.addEventListener('click', () => {
        hamburger.classList.remove('active');
        navLinks.classList.remove('open');
        hamburger.setAttribute('aria-expanded','false');
      });
    });
  }

  // Luk menu ved klik uden for
  document.addEventListener('click', (e) => {
    if(!navLinks?.classList.contains('open')) return;
    if(nav.contains(e.target)) return;
    navLinks.classList.remove('open');
    hamburger?.classList.remove('active');
  });

  // ESC lukker menu (heuristik 3: brugerkontrol)
  document.addEventListener('keydown', (e) => {
    if(e.key === 'Escape' && navLinks?.classList.contains('open')){
      navLinks.classList.remove('open');
      hamburger?.classList.remove('active');
      hamburger?.focus();
    }
  });

  // Aktivt link baseret på scroll-position
  const links = navLinks ? Array.from(navLinks.querySelectorAll('a[href^="#"]')) : [];
  const sections = links
    .map(a => document.querySelector(a.getAttribute('href')))
    .filter(Boolean);

  if(sections.length){
    const setActive = () => {
      const y = window.scrollY + 120;
      let current = sections[0]?.id;
      sections.forEach(s => { if(s.offsetTop <= y) current = s.id; });
      links.forEach(a => {
        a.classList.toggle('active', a.getAttribute('href') === '#' + current);
      });
    };
    window.addEventListener('scroll', setActive, {passive:true});
    setActive();
  }
})();
