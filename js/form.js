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

    quoteForm.addEventListener('submit', async (e) => {
      e.preventDefault();
      let valid = true;
      const name = quoteForm.querySelector('[name="name"]');
      const phone = quoteForm.querySelector('[name="phone"]');
      const email = quoteForm.querySelector('[name="email"]');
      const from = quoteForm.querySelector('[name="from"]');
      const to = quoteForm.querySelector('[name="to"]');
      const service = quoteForm.querySelector('[name="service"]');
      const consent = quoteForm.querySelector('[name="consent"]');

      if(!name.value.trim()){ setError(name.closest('.form-group'),'Bitte geben Sie Ihren Namen ein.'); valid=false; }
      if(!isValidPhone(phone.value)){ setError(phone.closest('.form-group'),'Bitte gültige Telefonnummer eingeben.'); valid=false; }
      if(email && email.value.trim() && !isValidEmail(email.value)){ setError(email.closest('.form-group'),'Bitte gültige E-Mail-Adresse eingeben.'); valid=false; }
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

      // EmailJS sender feedback (heuristik 1)
      const btn = quoteForm.querySelector('.form-submit');
      const originalText = btn.innerHTML;
      btn.disabled = true;
      btn.innerHTML = '<span>Wird gesendet…</span>';

      try{
        await sendEmail(buildQuoteParams(quoteForm));
        const success = document.getElementById('quoteSuccess');
        if(success) success.classList.add('show');
        quoteForm.reset();
        window.showToast && showToast({
          type:'success',
          title:'Anfrage gesendet',
          message:'Wir melden uns innerhalb von 24 Stunden bei Ihnen.'
        });
      }catch(error){
        console.error('EmailJS send failed:', error);
        window.showToast && showToast({
          type:'error',
          title:'Senden fehlgeschlagen',
          message:'Bitte versuchen Sie es erneut oder rufen Sie uns direkt an.'
        });
      }finally{
        btn.disabled = false;
        btn.innerHTML = originalText;
      }
    });
  }

  // Simple forms (callback + contact-strip)
  document.querySelectorAll('.js-simple-form').forEach(form => {
    form.addEventListener('submit', async (e) => {
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

      try{
        await sendEmail(buildCallbackParams(form));
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
      }catch(error){
        console.error('EmailJS callback send failed:', error);
        btn.disabled = false;
        btn.innerHTML = original;
        window.showToast && showToast({
          type:'error',
          title:'Senden fehlgeschlagen',
          message:'Bitte versuchen Sie es erneut oder rufen Sie uns direkt an.'
        });
      }
    });
  });
})();
