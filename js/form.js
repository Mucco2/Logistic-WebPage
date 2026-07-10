/* ========================================
   Form validation + submission
   Heuristik 5 (fejlforebyggelse), 9 (fejlhåndtering), 1 (feedback)
   ======================================== */
(function(){
  const EMAILJS_CONFIG = {
    serviceId: 'service_u95gala',
    templateId: 'template_j0wp79x',
    publicKey: '5EUMvr6Kvm8-Nol4g'
  };
  const EMAILJS_SDK_SRC = 'https://cdn.jsdelivr.net/npm/@emailjs/browser@4/dist/email.min.js';
  let emailJsReady;
  let errorId = 0;
  const submittingForms = new WeakSet();

  function loadEmailJs(){
    if(emailJsReady) return emailJsReady;

    emailJsReady = new Promise((resolve, reject) => {
      if(window.emailjs){
        resolve(window.emailjs);
        return;
      }

      let script = document.querySelector('script[data-emailjs-sdk], script[src*="@emailjs/browser"]');
      if(!script){
        script = document.createElement('script');
        script.src = EMAILJS_SDK_SRC;
        script.async = true;
        script.setAttribute('data-emailjs-sdk', 'true');
        document.head.appendChild(script);
      }

      script.addEventListener('load', () => {
        if(window.emailjs) resolve(window.emailjs);
        else reject(new Error('EmailJS kunne ikke indlæses korrekt.'));
      }, {once:true});

      script.addEventListener('error', () => {
        reject(new Error('EmailJS SDK kunne ikke indlæses.'));
      }, {once:true});
    }).then((emailjs) => {
      if(!emailjs.__aramInitialized){
        emailjs.init({publicKey: EMAILJS_CONFIG.publicKey});
        emailjs.__aramInitialized = true;
      }
      return emailjs;
    });

    return emailJsReady;
  }

  function fieldValue(form, name){
    const field = form.querySelector(`[name="${name}"]`);
    if(!field) return '';
    if(field.type === 'checkbox') return field.checked ? 'Ja' : 'Nein';
    return field.value.trim();
  }

  function hasFilledHoneypot(form){
    const honeypot = form.querySelector('[name="website"]');
    return Boolean(honeypot && honeypot.value.trim());
  }

  function serviceLabel(value){
    const labels = {
      privat: 'Privatumzug',
      firma: 'Firmentransport',
      paket: 'Paketzustellung',
      anders: 'Etwas anderes'
    };
    return labels[value] || value || '';
  }

  function formatMessage(lines){
    return lines
      .filter((line) => line.value)
      .map((line) => `${line.label}: ${line.value}`)
      .join('\n');
  }

  function buildQuoteParams(form){
    const rawService = fieldValue(form, 'service');
    const params = {
      formType: 'Angebot anfordern',
      name: fieldValue(form, 'name'),
      phone: fieldValue(form, 'phone'),
      email: fieldValue(form, 'email'),
      from: fieldValue(form, 'from'),
      to: fieldValue(form, 'to'),
      service: serviceLabel(rawService),
      date: fieldValue(form, 'date'),
      volume: fieldValue(form, 'volume'),
      customerMessage: fieldValue(form, 'message') || 'Keine zusätzliche Nachricht angegeben.',
      consent: fieldValue(form, 'consent'),
      pageUrl: window.location.href,
      submittedAt: new Date().toLocaleString('de-DE')
    };
    const fullMessage = formatMessage([
      {label: 'Formular', value: params.formType},
      {label: 'Name', value: params.name},
      {label: 'Telefon', value: params.phone},
      {label: 'E-Mail', value: params.email},
      {label: 'Abholort / PLZ', value: params.from},
      {label: 'Zielort / PLZ', value: params.to},
      {label: 'Leistung', value: params.service},
      {label: 'Wunschtermin', value: params.date},
      {label: 'Umfang / Gewicht', value: params.volume},
      {label: 'Nachricht', value: params.customerMessage},
      {label: 'Datenschutz akzeptiert', value: params.consent},
      {label: 'Seite', value: params.pageUrl},
      {label: 'Gesendet am', value: params.submittedAt}
    ]);

    return {
      form_type: 'Angebot anfordern',
      subject: 'Neue Transportanfrage von der Webseite',
      name: params.name,
      user_name: params.name,
      from_name: params.name,
      phone: params.phone,
      user_phone: params.phone,
      phone_number: params.phone,
      email: params.email,
      user_email: params.email,
      from_email: params.email,
      reply_to: params.email || 'info@lw-transport.de',
      from: params.from,
      pickup_location: params.from,
      zip_code: params.from,
      to: params.to,
      destination: params.to,
      service: params.service,
      performance: params.service,
      date: params.date,
      volume: params.volume,
      customer_message: params.customerMessage,
      message: fullMessage,
      consent: params.consent,
      page_url: params.pageUrl,
      submitted_at: params.submittedAt
    };
  }

  function buildCallbackParams(form){
    const phone = fieldValue(form, 'phone');
    const submittedAt = new Date().toLocaleString('de-DE');
    const fullMessage = formatMessage([
      {label: 'Formular', value: 'Rückruf anfordern'},
      {label: 'Telefon', value: phone},
      {label: 'Seite', value: window.location.href},
      {label: 'Gesendet am', value: submittedAt}
    ]);

    return {
      form_type: 'Rückruf anfordern',
      subject: 'Neue Rückrufanfrage von der Webseite',
      name: 'Rückrufanfrage',
      user_name: 'Rückrufanfrage',
      phone,
      user_phone: phone,
      email: '',
      user_email: '',
      reply_to: 'info@lw-transport.de',
      from: '',
      pickup_location: '',
      to: '',
      destination: '',
      service: 'Rückruf',
      date: '',
      volume: '',
      customer_message: `Bitte zurückrufen: ${phone}`,
      message: fullMessage,
      consent: 'Nicht abgefragt',
      page_url: window.location.href,
      submitted_at: submittedAt
    };
  }

  async function sendEmail(params){
    const emailjs = await loadEmailJs();
    return emailjs.send(EMAILJS_CONFIG.serviceId, EMAILJS_CONFIG.templateId, params);
  }

  // Simpel tysk telefonvalidering
  function isValidPhone(v){
    if(!v) return false;
    const cleaned = v.replace(/[\s\-()]/g,'');
    return /^\+?[0-9]{7,16}$/.test(cleaned);
  }
  function isValidEmail(v){
    return /^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(v || '');
  }

  function associateError(field, err){
    if(!field || !err) return;

    if(!err.id){
      const baseId = field.id ? `${field.id}-error` : `form-error-${++errorId}`;
      let candidate = baseId;
      while(document.getElementById(candidate) && document.getElementById(candidate) !== err){
        candidate = `${baseId}-${++errorId}`;
      }
      err.id = candidate;
    }

    const describedBy = new Set((field.getAttribute('aria-describedby') || '').split(/\s+/).filter(Boolean));
    describedBy.add(err.id);
    field.setAttribute('aria-describedby', Array.from(describedBy).join(' '));
    err.setAttribute('role', 'alert');
    err.setAttribute('aria-atomic', 'true');
  }

  function updateErrorMessage(err, msg){
    const textTarget = err.querySelector('span');
    if(textTarget) textTarget.textContent = msg;
    else err.textContent = msg;
  }

  function setError(group, msg, field){
    if(!group) return;
    group.classList.add('has-error');
    const input = field || group.querySelector('input,select,textarea');
    const err = group.querySelector('.form-error, .error-msg');
    if(input){
      input.classList.add('error');
      input.setAttribute('aria-invalid', 'true');
    }
    if(err){
      associateError(input, err);
      updateErrorMessage(err, msg);
      err.classList.add('show');
    }
  }
  function clearError(group){
    if(!group) return;
    group.classList.remove('has-error');
    const err = group.querySelector('.form-error, .error-msg');
    if(err) err.classList.remove('show');
    const input = group.querySelector('[aria-invalid], input:not([type="hidden"]), select, textarea');
    if(input){
      input.classList.remove('error');
      input.setAttribute('aria-invalid', 'false');
    }
  }

  function getLiveRegion(form){
    let region = form.querySelector('.js-form-live-region');
    if(region) return region;

    region = document.createElement('div');
    region.className = 'js-form-live-region';
    region.setAttribute('role', 'status');
    region.setAttribute('aria-live', 'polite');
    region.setAttribute('aria-atomic', 'true');
    Object.assign(region.style, {
      position: 'absolute',
      width: '1px',
      height: '1px',
      padding: '0',
      margin: '-1px',
      overflow: 'hidden',
      clip: 'rect(0, 0, 0, 0)',
      clipPath: 'inset(50%)',
      whiteSpace: 'nowrap',
      border: '0'
    });
    form.appendChild(region);
    return region;
  }

  function announce(form, message){
    const region = getLiveRegion(form);
    region.textContent = '';
    const update = () => { region.textContent = message; };
    if(window.requestAnimationFrame) window.requestAnimationFrame(update);
    else setTimeout(update, 0);
  }

  // Quote form (stor)
  const quoteForm = document.getElementById('quoteForm');
  if(quoteForm){
    const groups = quoteForm.querySelectorAll('.form-group');
    // Live-rydning
    groups.forEach(g => {
      const input = g.querySelector('input,select,textarea');
      const err = g.querySelector('.form-error, .error-msg');
      if(input){
        input.setAttribute('aria-invalid', 'false');
        if(err) associateError(input, err);
        input.addEventListener('input', () => clearError(g));
        input.addEventListener('change', () => clearError(g));
      }
    });

    quoteForm.addEventListener('submit', async (e) => {
      e.preventDefault();
      if(submittingForms.has(quoteForm)) return;

      if(hasFilledHoneypot(quoteForm)){
        const success = document.getElementById('quoteSuccess');
        if(success){
          success.setAttribute('role', 'status');
          success.setAttribute('aria-live', 'polite');
          success.setAttribute('aria-atomic', 'true');
          success.classList.add('show');
        }
        quoteForm.reset();
        groups.forEach(clearError);
        announce(quoteForm, 'Ihre Anfrage wurde erfolgreich gesendet.');
        window.showToast && window.showToast({
          type:'success',
          title:'Anfrage gesendet',
          message:'Wir melden uns innerhalb von 24 Stunden bei Ihnen.'
        });
        return;
      }

      groups.forEach(clearError);
      let valid = true;
      const invalidFields = [];
      const name = quoteForm.querySelector('[name="name"]');
      const phone = quoteForm.querySelector('[name="phone"]');
      const email = quoteForm.querySelector('[name="email"]');
      const from = quoteForm.querySelector('[name="from"]');
      const to = quoteForm.querySelector('[name="to"]');
      const service = quoteForm.querySelector('[name="service"]');
      const consent = quoteForm.querySelector('[name="consent"]');

      const invalidate = (field, message) => {
        valid = false;
        if(!field) return;
        invalidFields.push(field);
        setError(field.closest('.form-group'), message, field);
      };

      if(!name?.value.trim()) invalidate(name, 'Bitte geben Sie Ihren Namen ein.');
      if(!phone || !isValidPhone(phone.value)) invalidate(phone, 'Bitte gültige Telefonnummer eingeben.');
      if(email && email.value.trim() && !isValidEmail(email.value)) invalidate(email, 'Bitte gültige E-Mail-Adresse eingeben.');
      if(!from?.value.trim()) invalidate(from, 'Bitte Abholort angeben.');
      if(!to?.value.trim()) invalidate(to, 'Bitte Zielort angeben.');
      if(service && !service.value) invalidate(service, 'Bitte wählen Sie eine Leistung.');
      if(consent && !consent.checked){
        invalidate(consent, 'Bitte Datenschutz bestätigen.');
      }

      if(!valid){
        announce(quoteForm, 'Bitte prüfen Sie die markierten Formularfelder.');
        window.showToast && window.showToast({type:'error', title:'Bitte prüfen Sie Ihre Eingaben', message:'Einige Felder sind unvollständig.'});
        invalidFields[0]?.focus();
        return;
      }

      // EmailJS sender feedback (heuristik 1)
      const btn = quoteForm.querySelector('.form-submit');
      const originalText = btn ? btn.innerHTML : '';
      submittingForms.add(quoteForm);
      quoteForm.setAttribute('aria-busy', 'true');
      if(btn){
        btn.disabled = true;
        btn.setAttribute('aria-disabled', 'true');
        btn.innerHTML = '<span>Wird gesendet…</span>';
      }
      announce(quoteForm, 'Ihre Anfrage wird gesendet.');

      try{
        await sendEmail(buildQuoteParams(quoteForm));
        const success = document.getElementById('quoteSuccess');
        if(success){
          success.setAttribute('role', 'status');
          success.setAttribute('aria-live', 'polite');
          success.setAttribute('aria-atomic', 'true');
          success.classList.add('show');
        }
        quoteForm.reset();
        groups.forEach(clearError);
        announce(quoteForm, 'Ihre Anfrage wurde erfolgreich gesendet.');
        window.showToast && window.showToast({
          type:'success',
          title:'Anfrage gesendet',
          message:'Wir melden uns innerhalb von 24 Stunden bei Ihnen.'
        });
      }catch(error){
        console.error('EmailJS send failed:', error);
        announce(quoteForm, 'Ihre Anfrage konnte nicht gesendet werden. Bitte versuchen Sie es erneut oder rufen Sie uns an.');
        window.showToast && window.showToast({
          type:'error',
          title:'Senden fehlgeschlagen',
          message:'Bitte versuchen Sie es erneut oder rufen Sie uns direkt an.'
        });
      }finally{
        submittingForms.delete(quoteForm);
        quoteForm.setAttribute('aria-busy', 'false');
        if(btn){
          btn.disabled = false;
          btn.removeAttribute('aria-disabled');
          btn.innerHTML = originalText;
        }
      }
    });
  }

  // Simple forms (callback + contact-strip)
  document.querySelectorAll('.js-simple-form').forEach(form => {
    const input = form.querySelector('input[type="tel"]');
    if(!input) return;
    const group = input.closest('.form-group, .simple-form, label') || input.parentElement;
    const existingError = group?.querySelector('.error-msg, .form-error');
    input.setAttribute('aria-invalid', 'false');
    if(existingError) associateError(input, existingError);
    input.addEventListener('input', () => clearError(group));

    form.addEventListener('submit', async (e) => {
      e.preventDefault();
      if(submittingForms.has(form)) return;

      const btn = form.querySelector('button[type="submit"], button:not([type])');
      const original = btn ? btn.innerHTML : '';

      if(hasFilledHoneypot(form)){
        submittingForms.add(form);
        form.setAttribute('aria-busy', 'true');
        form.reset();
        clearError(group);
        if(btn){
          btn.disabled = true;
          btn.setAttribute('aria-disabled', 'true');
          btn.innerHTML = '<span>✓ Erhalten</span>';
        }
        announce(form, 'Ihr Rückruf wurde erfolgreich angefragt.');
        window.showToast && window.showToast({
          type:'success',
          title:'Rückruf angefragt',
          message:'Wir rufen Sie in Kürze zurück.'
        });
        setTimeout(() => {
          submittingForms.delete(form);
          form.setAttribute('aria-busy', 'false');
          if(btn){
            btn.disabled = false;
            btn.removeAttribute('aria-disabled');
            btn.innerHTML = original;
          }
        }, 2600);
        return;
      }

      if(!isValidPhone(input.value)){
        input.classList.add('error');
        let err = group?.querySelector('.error-msg, .form-error');
        if(!err){
          err = document.createElement('div');
          err.className = 'error-msg';
          input.insertAdjacentElement('afterend', err);
        }
        associateError(input, err);
        setError(group, 'Bitte gültige Telefonnummer eingeben.', input);
        announce(form, 'Bitte geben Sie eine gültige Telefonnummer ein.');
        window.showToast && window.showToast({type:'error', message:'Ungültige Telefonnummer.'});
        input.focus();
        return;
      }

      clearError(group);
      submittingForms.add(form);
      form.setAttribute('aria-busy', 'true');
      if(btn){
        btn.disabled = true;
        btn.setAttribute('aria-disabled', 'true');
        btn.innerHTML = '<span>Wird gesendet…</span>';
      }
      announce(form, 'Ihre Rückrufanfrage wird gesendet.');

      try{
        await sendEmail(buildCallbackParams(form));
        if(btn) btn.innerHTML = '<span>✓ Erhalten</span>';
        announce(form, 'Ihr Rückruf wurde erfolgreich angefragt.');
        window.showToast && window.showToast({
          type:'success',
          title:'Rückruf angefragt',
          message:'Wir rufen Sie in Kürze zurück.'
        });
        input.value = '';
        setTimeout(() => {
          submittingForms.delete(form);
          form.setAttribute('aria-busy', 'false');
          if(btn){
            btn.disabled = false;
            btn.removeAttribute('aria-disabled');
            btn.innerHTML = original;
          }
        }, 2600);
      }catch(error){
        console.error('EmailJS callback send failed:', error);
        submittingForms.delete(form);
        form.setAttribute('aria-busy', 'false');
        if(btn){
          btn.disabled = false;
          btn.removeAttribute('aria-disabled');
          btn.innerHTML = original;
        }
        announce(form, 'Ihre Rückrufanfrage konnte nicht gesendet werden. Bitte versuchen Sie es erneut oder rufen Sie uns an.');
        window.showToast && window.showToast({
          type:'error',
          title:'Senden fehlgeschlagen',
          message:'Bitte versuchen Sie es erneut oder rufen Sie uns direkt an.'
        });
      }
    });
  });
})();
