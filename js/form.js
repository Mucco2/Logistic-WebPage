/* ========================================
   Form validation + submission
   Heuristik 5 (fejlforebyggelse), 9 (fejlhåndtering), 1 (feedback)
   ======================================== */
(function(){

  // Simpel tysk telefonvalidering
  function isValidPhone(v){
    if(!v) return false;
    const cleaned = v.replace(/[\s\-()]/g,'');
    return /^\+?[0-9]{7,16}$/.test(cleaned);
  }
  function isValidEmail(v){
    return /^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(v || '');
  }

  function setError(group, msg){
    group.classList.add('has-error');
    let err = group.querySelector('.form-error, .error-msg');
    if(err){
      err.textContent = msg;
      err.classList.add('show');
    }
  }
  function clearError(group){
    group.classList.remove('has-error');
    const err = group.querySelector('.form-error, .error-msg');
    if(err) err.classList.remove('show');
    const input = group.querySelector('input,select,textarea');
    if(input) input.classList.remove('error');
  }

  // Quote form (stor)
  const quoteForm = document.getElementById('quoteForm');
  if(quoteForm){
    const groups = quoteForm.querySelectorAll('.form-group');
    // Live-rydning
    groups.forEach(g => {
      const input = g.querySelector('input,select,textarea');
      if(input) input.addEventListener('input', () => clearError(g));
    });

    quoteForm.addEventListener('submit', (e) => {
      e.preventDefault();
      let valid = true;
      const name = quoteForm.querySelector('[name="name"]');
      const phone = quoteForm.querySelector('[name="phone"]');
      const from = quoteForm.querySelector('[name="from"]');
      const to = quoteForm.querySelector('[name="to"]');
      const service = quoteForm.querySelector('[name="service"]');
      const consent = quoteForm.querySelector('[name="consent"]');

      if(!name.value.trim()){ setError(name.closest('.form-group'),'Bitte geben Sie Ihren Namen ein.'); valid=false; }
      if(!isValidPhone(phone.value)){ setError(phone.closest('.form-group'),'Bitte gültige Telefonnummer eingeben.'); valid=false; }
      if(!from.value.trim()){ setError(from.closest('.form-group'),'Bitte Abholort angeben.'); valid=false; }
      if(!to.value.trim()){ setError(to.closest('.form-group'),'Bitte Zielort angeben.'); valid=false; }
      if(service && !service.value){ setError(service.closest('.form-group'),'Bitte wählen Sie eine Leistung.'); valid=false; }
      if(consent && !consent.checked){
        const g = consent.closest('.form-group');
        if(g){ setError(g,'Bitte Datenschutz bestätigen.'); valid=false; }
      }

      if(!valid){
        window.showToast && showToast({type:'error', title:'Bitte prüfen Sie Ihre Eingaben', message:'Einige Felder sind unvollständig.'});
        const firstError = quoteForm.querySelector('.has-error input, .has-error select, .has-error textarea');
        firstError && firstError.focus();
        return;
      }

      // Success (simuleret - heuristik 1)
      const btn = quoteForm.querySelector('.form-submit');
      const originalText = btn.innerHTML;
      btn.disabled = true;
      btn.innerHTML = '<span>Wird gesendet…</span>';

      setTimeout(() => {
        const success = document.getElementById('quoteSuccess');
        if(success) success.classList.add('show');
        quoteForm.reset();
        btn.disabled = false;
        btn.innerHTML = originalText;
        window.showToast && showToast({
          type:'success',
          title:'Anfrage gesendet',
          message:'Wir melden uns innerhalb von 24 Stunden bei Ihnen.'
        });
      }, 900);
    });
  }

  // Simple forms (callback + contact-strip)
  document.querySelectorAll('.js-simple-form').forEach(form => {
    form.addEventListener('submit', (e) => {
      e.preventDefault();
      const input = form.querySelector('input[type="tel"]');
      const group = input.closest('.form-group, .simple-form, label') || input.parentElement;

      if(!isValidPhone(input.value)){
        input.classList.add('error');
        let err = group.querySelector('.error-msg');
        if(!err){
          err = document.createElement('div');
          err.className = 'error-msg';
          input.insertAdjacentElement('afterend', err);
        }
        err.textContent = 'Bitte gültige Telefonnummer eingeben.';
        err.classList.add('show');
        window.showToast && showToast({type:'error', message:'Ungültige Telefonnummer.'});
        input.focus();
        return;
      }

      const btn = form.querySelector('button');
      const original = btn.innerHTML;
      btn.disabled = true;
      btn.innerHTML = '<span>Wird gesendet…</span>';

      setTimeout(() => {
        btn.innerHTML = '<span>✓ Erhalten</span>';
        window.showToast && showToast({
          type:'success',
          title:'Rückruf angefragt',
          message:'Wir rufen Sie in Kürze zurück.'
        });
        input.value = '';
        setTimeout(() => {
          btn.disabled = false;
          btn.innerHTML = original;
        }, 2600);
      }, 700);
    });
  });
})();
