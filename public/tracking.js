(function () {
  var form = document.getElementById('surrender-form');
  if (!form) return;

  function getQueryParam(name) {
    try {
      var params = new URLSearchParams(window.location.search || '');
      return params.get(name) || '';
    } catch (e) {
      return '';
    }
  }

  function setValue(id, value) {
    var el = document.getElementById(id);
    if (el) el.value = value || '';
  }

  var nowIso = new Date().toISOString();
  var leadId = ['fbr', nowIso.replace(/[-:.TZ]/g, '').slice(0, 14), Math.random().toString(36).slice(2, 8)].join('-');

  setValue('submitted-at-iso', nowIso);
  setValue('lead-id', leadId);
  setValue('submission-page-url', window.location.href || '');
  setValue('client-user-agent', navigator.userAgent || '');
  setValue('submission-referrer', document.referrer || 'direct');
  setValue('utm-source', getQueryParam('utm_source'));
  setValue('utm-medium', getQueryParam('utm_medium'));
  setValue('utm-campaign', getQueryParam('utm_campaign'));

  function appendAttributionToThankYou() {
    var nextInput = form.querySelector('input[name="_next"]');
    if (!nextInput || !nextInput.value) return;

    try {
      var url = new URL(nextInput.value, window.location.origin);
      url.searchParams.set('lead_id', leadId);
      ['utm_source', 'utm_medium', 'utm_campaign'].forEach(function (name) {
        var value = getQueryParam(name);
        if (value) url.searchParams.set(name, value);
      });
      if (shouldFastTrackUrgent()) url.searchParams.set('urgent', '1');
      nextInput.value = url.toString();
    } catch (e) {}
  }

  function shouldFastTrackUrgent() {
    var urgentValue = (getQueryParam('urgent') || '').toLowerCase();
    return urgentValue === '1' || urgentValue === 'yes' || urgentValue === 'true' || urgentValue === 'today';
  }

  appendAttributionToThankYou();

  if (shouldFastTrackUrgent()) {
    var urgentChoice = form.querySelector('input[name="urgent"][value="Yes - urgent today"]');
    if (urgentChoice) {
      urgentChoice.checked = true;
    }

    var urgentNote = document.getElementById('urgent-priority-note');
    if (urgentNote) {
      urgentNote.style.display = 'block';
      urgentNote.innerHTML = '<strong>Urgent case fast-track enabled:</strong> we have preselected <em>Yes - urgent today</em>. Please include immediate safety/medical risks so the team can prioritise same-day follow-up.';
    }
  }

  function trackSubmitEvent() {
    try {
      if (window.gtag) {
        window.gtag('event', 'surrender_form_submit', {
          event_category: 'lead',
          event_label: 'frenchie_surrender'
        });
      }
      if (window.plausible) {
        window.plausible('Surrender Form Submit');
      }
    } catch (e) {}
  }

  function redirectToThankYou() {
    var nextInput = form.querySelector('input[name="_next"]');
    window.location.href = nextInput && nextInput.value ? nextInput.value : '/thanks/?lead_id=' + encodeURIComponent(leadId);
  }

  function nativeSubmitFallback() {
    form.removeEventListener('submit', handleSubmit);
    if (form.requestSubmit) {
      form.requestSubmit();
    } else {
      form.submit();
    }
  }

  function handleSubmit(event) {
    setValue('submitted-at-iso', new Date().toISOString());
    appendAttributionToThankYou();
    trackSubmitEvent();

    if (!window.fetch || !window.FormData) return;

    event.preventDefault();

    var submitButton = form.querySelector('button[type="submit"]');
    if (submitButton) {
      submitButton.disabled = true;
      submitButton.textContent = 'Sending confidential request...';
    }

    fetch('https://formsubmit.co/ajax/littledoggyrescue@gmail.com', {
      method: 'POST',
      headers: { Accept: 'application/json' },
      body: new FormData(form)
    }).then(function (response) {
      if (!response.ok) throw new Error('FormSubmit returned ' + response.status);
      redirectToThankYou();
    }).catch(function () {
      if (submitButton) {
        submitButton.disabled = false;
        submitButton.textContent = 'Send confidential surrender request (no public posting)';
      }
      nativeSubmitFallback();
    });
  }

  form.addEventListener('submit', handleSubmit);
})();
