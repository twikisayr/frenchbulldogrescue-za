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

  form.addEventListener('submit', function () {
    setValue('submitted-at-iso', new Date().toISOString());
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
  });
})();
