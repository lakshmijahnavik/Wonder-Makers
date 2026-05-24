// Small enhancement: ensure details elements behave consistently across browsers
document.addEventListener('DOMContentLoaded', () => {
  const details = document.querySelectorAll('.faq-list details');
  details.forEach(d => {
    d.addEventListener('toggle', () => {
      // close others when one opens
      if (d.open) {
        details.forEach(other => { if (other !== d) other.open = false; });
      }
    });
  });
});
