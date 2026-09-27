// Portfolio interactivity: Bootstrap navbar + ES6 DOM events.
document.addEventListener('DOMContentLoaded', () => {
  initMobileMenu();
  initThemeToggle();
  initProjectFilter();
  initScrollSpy();
  initFormValidation();
});

const initMobileMenu = () => {
  const toggle = document.getElementById('menu-toggle');
  const nav = document.getElementById('site-nav');
  if (!toggle || !nav) return;

  toggle.addEventListener('click', () => {
    const isOpen = nav.classList.toggle('show');
    toggle.setAttribute('aria-expanded', String(isOpen));
  });

  nav.querySelectorAll('a').forEach((link) => {
    link.addEventListener('click', () => {
      nav.classList.remove('show');
      toggle.setAttribute('aria-expanded', 'false');
    });
  });
};

const initThemeToggle = () => {
  const root = document.documentElement;
  const button = document.getElementById('theme-toggle');
  const label = button?.querySelector('.theme-toggle-label');
  const icon = button?.querySelector('.theme-toggle-icon');

  const savedTheme = localStorage.getItem('portfolio-theme');
  applyTheme(savedTheme || 'light');

  button?.addEventListener('click', () => {
    const current = root.dataset.theme === 'dark' ? 'dark' : 'light';
    const next = current === 'dark' ? 'light' : 'dark';
    applyTheme(next);
    localStorage.setItem('portfolio-theme', next);
  });

  function applyTheme(theme) {
    root.dataset.theme = theme;
    const isDark = theme === 'dark';
    button?.setAttribute('aria-pressed', String(isDark));
    if (label) label.textContent = isDark ? 'Light mode' : 'Dark mode';
    if (icon) icon.textContent = isDark ? '☀' : '☾';
  }
};

const initProjectFilter = () => {
  const buttons = [...document.querySelectorAll('.filter-btn')];
  const cards = [...document.querySelectorAll('.project-card-wrap')];
  const emptyMessage = document.getElementById('filter-empty');

  buttons.forEach((button) => {
    button.addEventListener('click', () => {
      buttons.forEach((item) => item.classList.remove('active'));
      button.classList.add('active');

      const filter = button.dataset.filter;
      let visibleCount = 0;

      cards.forEach((card) => {
        const matches = filter === 'all' || card.dataset.category === filter;
        card.classList.toggle('is-hidden', !matches);
        if (matches) visibleCount += 1;
      });

      emptyMessage?.classList.toggle('is-hidden', visibleCount > 0);
    });
  });
};

const initScrollSpy = () => {
  const sections = [...document.querySelectorAll('main section[id]')];
  const links = [...document.querySelectorAll('#nav-links .nav-link')];
  if (!sections.length || !links.length) return;

  const observer = new IntersectionObserver((entries) => {
    entries.forEach((entry) => {
      if (!entry.isIntersecting) return;
      links.forEach((link) => link.classList.remove('active'));
      document.querySelector(`#nav-links a[href="#${entry.target.id}"]`)?.classList.add('active');
    });
  }, { rootMargin: '-35% 0px -55% 0px', threshold: 0 });

  sections.forEach((section) => observer.observe(section));
};

const initFormValidation = () => {
  const form = document.getElementById('contact-form');
  const alertBox = document.getElementById('form-alert');
  if (!form || !alertBox) return;

  const fields = [
    { element: form.name, validate: (value) => value.trim().length >= 2 },
    { element: form.email, validate: (value) => /^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(value.trim()) },
    { element: form.message, validate: (value) => value.trim().length >= 10 }
  ];

  fields.forEach(({ element, validate }) => {
    element.addEventListener('input', () => validateField(element, validate));
  });

  form.addEventListener('submit', (event) => {
    event.preventDefault();
    const valid = fields.map(({ element, validate }) => validateField(element, validate)).every(Boolean);

    if (!valid) {
      showAlert('danger', 'Please fix the highlighted fields before sending.');
      return;
    }

    showAlert('success', `Thanks, ${form.name.value.trim()} — your message looks good. Connect a backend or form service to actually send it.`);
    form.reset();
    fields.forEach(({ element }) => element.classList.remove('is-valid', 'is-invalid'));
  });

  function validateField(element, validate) {
    const valid = validate(element.value);
    element.classList.toggle('is-valid', valid);
    element.classList.toggle('is-invalid', !valid);
    return valid;
  }

  function showAlert(type, message) {
    alertBox.className = `alert alert-${type}`;
    alertBox.textContent = message;
    alertBox.classList.remove('is-hidden');
  }
};
