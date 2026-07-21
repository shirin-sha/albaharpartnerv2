// Runs before React to set <html dir> and the .rtl class based on route pathname.
// Keeps SSR/Hydration consistent and prevents layout flashing.
export const rtlInitScript = `
(function() {
  try {
    // Check if pathname starts with /ar for RTL
    var pathname = window.location.pathname;
    var isRtl = pathname && pathname.startsWith('/ar');

    // Apply to <html> immediately
    var html = document.documentElement;
    var nextDir = isRtl ? 'rtl' : 'ltr';
    if (html.getAttribute('dir') !== nextDir) html.setAttribute('dir', nextDir);

    // Ensure .rtl class toggled
    if (isRtl) {
      if (!html.classList.contains('rtl')) html.classList.add('rtl');
    } else {
      if (html.classList.contains('rtl')) html.classList.remove('rtl');
    }
  } catch (e) {
    // fail-safe: do nothing
  }
})();
`;
