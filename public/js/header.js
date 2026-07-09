const header = document.querySelector('[data-site-header]');
const toggle = document.getElementById('site-header-toggle');
const links = document.getElementById('site-header-links');
const linkEls = links ? Array.from(links.querySelectorAll('a')) : [];

const setScrolled = () => {
  if (!header) return;
  if (window.scrollY > 24) {
    header.classList.add('is-scrolled');
  } else {
    header.classList.remove('is-scrolled');
  }
};
setScrolled();
window.addEventListener('scroll', setScrolled, { passive: true });

// Below the 1024px breakpoint the nav collapses to a 0-height panel
// (grid-template-rows: 0fr) — but links inside stay in the DOM and, by
// default, in tab order. Without this, a keyboard user tabs through 7
// invisible focus stops (0px-tall, no visible ring) before ever seeing
// where focus is. Mirror the visual collapsed/open state onto tabindex
// so closed-panel links are skipped entirely, matching what's rendered.
const mobileMedia = window.matchMedia('(max-width: 1023px)');
const syncLinkFocusability = () => {
  const isOpen = header?.classList.contains('is-menu-open') ?? false;
  const shouldHide = mobileMedia.matches && !isOpen;
  linkEls.forEach((a) => {
    if (shouldHide) {
      a.setAttribute('tabindex', '-1');
    } else {
      a.removeAttribute('tabindex');
    }
  });
};
syncLinkFocusability();
mobileMedia.addEventListener('change', syncLinkFocusability);

toggle?.addEventListener('click', () => {
  const expanded = toggle.getAttribute('aria-expanded') === 'true';
  toggle.setAttribute('aria-expanded', String(!expanded));
  header?.classList.toggle('is-menu-open', !expanded);
  syncLinkFocusability();
});

linkEls.forEach((a) => {
  a.addEventListener('click', () => {
    toggle?.setAttribute('aria-expanded', 'false');
    header?.classList.remove('is-menu-open');
    syncLinkFocusability();
  });
});
