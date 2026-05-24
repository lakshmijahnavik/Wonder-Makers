// contactForm.js - Contact form handling
document.addEventListener('DOMContentLoaded', () => {
  const form = document.getElementById('contact-form');
  const successMsg = document.getElementById('form-success');
  const submitBtn = document.getElementById('form-submit');

  if (!form) return;

  form.addEventListener('submit', (e) => {
    e.preventDefault();

    // Basic validation
    const name = document.getElementById('contact-name');
    const email = document.getElementById('contact-email');
    const message = document.getElementById('contact-message');

    let valid = true;

    [name, email, message].forEach(field => {
      if (!field || !field.value.trim()) {
        field.style.borderColor = '#ff4444';
        valid = false;
      } else {
        field.style.borderColor = '';
      }
    });

    if (email && email.value && !/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(email.value)) {
      email.style.borderColor = '#ff4444';
      valid = false;
    }

    if (!valid) return;

    // Simulate send
    if (submitBtn) {
      submitBtn.disabled = true;
      submitBtn.textContent = 'Sending...';
    }

    setTimeout(() => {
      if (submitBtn) {
        submitBtn.textContent = 'Sent!';
        submitBtn.style.background = 'var(--accent)';
        submitBtn.style.color = '#000';
        submitBtn.style.borderColor = 'var(--accent)';
      }

      if (successMsg) successMsg.style.display = 'block';

      form.reset();

      setTimeout(() => {
        if (submitBtn) {
          submitBtn.disabled = false;
          submitBtn.innerHTML = 'Send Message <span class="btn-submit__arrow"><svg viewBox="0 0 9 15" fill="none"><path d="M1 13.6953L7.34767 7.34767L1 1" stroke="currentColor" stroke-width="2" stroke-linecap="round"/></svg></span>';
          submitBtn.style.background = '';
          submitBtn.style.color = '';
          submitBtn.style.borderColor = '';
        }
        if (successMsg) successMsg.style.display = 'none';
      }, 5000);
    }, 1200);
  });

  // Clear error styling on input
  form.querySelectorAll('input, textarea, select').forEach(field => {
    field.addEventListener('input', () => { field.style.borderColor = ''; });
    field.addEventListener('change', () => { field.style.borderColor = ''; });
  });
});
