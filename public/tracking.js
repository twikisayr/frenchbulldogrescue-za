(function () {
  var form = document.getElementById('surrender-form');
  if (!form) return;

  form.addEventListener('submit', function () {
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
