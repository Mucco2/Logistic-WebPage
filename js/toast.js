/* ========================================
   Toast notifications
   Heuristik 1: visibility of system status
   ======================================== */
(function(){
  let container = document.getElementById('toast-container');
  if(!container){
    container = document.createElement('div');
    container.id = 'toast-container';
    container.className = 'toast-container';
    container.setAttribute('aria-live','polite');
    container.setAttribute('aria-atomic','true');
    document.body.appendChild(container);
  }

  const ICONS = {
    success:'<svg width="22" height="22" fill="none" stroke="currentColor" stroke-width="2.5" stroke-linecap="round" stroke-linejoin="round" viewBox="0 0 24 24"><path d="M22 11.08V12a10 10 0 11-5.93-9.14"/><polyline points="22 4 12 14.01 9 11.01"/></svg>',
    error:'<svg width="22" height="22" fill="none" stroke="currentColor" stroke-width="2.5" stroke-linecap="round" stroke-linejoin="round" viewBox="0 0 24 24"><circle cx="12" cy="12" r="10"/><line x1="12" y1="8" x2="12" y2="12"/><line x1="12" y1="16" x2="12.01" y2="16"/></svg>',
    info:'<svg width="22" height="22" fill="none" stroke="currentColor" stroke-width="2.5" stroke-linecap="round" stroke-linejoin="round" viewBox="0 0 24 24"><circle cx="12" cy="12" r="10"/><line x1="12" y1="16" x2="12" y2="12"/><line x1="12" y1="8" x2="12.01" y2="8"/></svg>'
  };

  window.showToast = function(opts){
    const {type='success', title='', message='', duration=4500} = typeof opts === 'string' ? {message:opts} : opts;
    const el = document.createElement('div');
    el.className = `toast ${type}`;
    el.setAttribute('role','status');
    el.innerHTML = `
      <span class="toast-icon">${ICONS[type] || ICONS.info}</span>
      <div class="toast-content">
        ${title ? `<strong>${title}</strong>` : ''}
        <span>${message}</span>
      </div>
      <button class="toast-close" aria-label="Schließen">×</button>
    `;
    container.appendChild(el);
    requestAnimationFrame(() => el.classList.add('show'));
    const remove = () => {
      el.classList.remove('show');
      setTimeout(() => el.remove(), 300);
    };
    el.querySelector('.toast-close').addEventListener('click', remove);
    if(duration > 0) setTimeout(remove, duration);
  };
})();
