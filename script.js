const toTopButton = document.querySelector('#to-top');
const menuToggle = document.querySelector('.menu-toggle');
const siteNavigation = document.querySelector('#site-nav');
const prefersReducedMotion = window.matchMedia('(prefers-reduced-motion: reduce)').matches;

toTopButton?.addEventListener('click', () => {
  window.scrollTo({ top: 0, behavior: prefersReducedMotion ? 'auto' : 'smooth' });
});

menuToggle?.addEventListener('click', () => {
  const isOpen = menuToggle.getAttribute('aria-expanded') === 'true';
  menuToggle.setAttribute('aria-expanded', String(!isOpen));
  siteNavigation?.classList.toggle('nav-open', !isOpen);
});

siteNavigation?.querySelectorAll('a').forEach((link) => {
  link.addEventListener('click', () => {
    menuToggle?.setAttribute('aria-expanded', 'false');
    siteNavigation.classList.remove('nav-open');
  });
});

const motionElements = document.querySelectorAll(
  '.page-previews, .job-card, .education-page, .project-card, .skills, .portfolio-heading, .contact-links',
);

motionElements.forEach((element, index) => {
  element.classList.add('motion-ready');
  element.style.setProperty('--reveal-delay', `${Math.min(index * 70, 210)}ms`);
});

if (!prefersReducedMotion && 'IntersectionObserver' in window) {
  const revealObserver = new IntersectionObserver(
    (entries) => {
      entries.forEach((entry) => {
        if (!entry.isIntersecting) return;
        entry.target.classList.add('motion-visible');
        revealObserver.unobserve(entry.target);
      });
    },
    { threshold: 0.12 },
  );
  motionElements.forEach((element) => revealObserver.observe(element));
} else {
  motionElements.forEach((element) => element.classList.add('motion-visible'));
}

const allocationChart = document.querySelector('.allocation-chart');
if (allocationChart) {
  if (!prefersReducedMotion && 'IntersectionObserver' in window) {
    const portfolioObserver = new IntersectionObserver(
      ([entry]) => {
        if (!entry.isIntersecting) return;
        allocationChart.classList.add('chart-visible');
        portfolioObserver.disconnect();
      },
      { threshold: 0.35 },
    );
    portfolioObserver.observe(allocationChart);
  } else {
    allocationChart.classList.add('chart-visible');
  }

  const portfolioToggles = document.querySelectorAll('.portfolio-toggle');
  const fundRows = document.querySelectorAll('.fund-list article');
  const portfolioTotal = document.querySelector('#portfolio-total');
  const portfolioTotalLabel = document.querySelector('#portfolio-total-label');

  portfolioToggles.forEach((toggle) => {
    toggle.addEventListener('click', () => {
      const view = toggle.dataset.view;
      portfolioToggles.forEach((button) => {
        const isActive = button === toggle;
        button.classList.toggle('active', isActive);
        button.setAttribute('aria-pressed', String(isActive));
      });
      fundRows.forEach((row) => {
        row.querySelector('.fund-value').textContent = row.dataset[view];
      });
      const showingReturn = view === 'return';
      portfolioTotal.textContent = showingReturn ? '+23.94%' : '3';
      portfolioTotalLabel.textContent = showingReturn ? 'return since purchase' : 'funds';
      allocationChart.classList.toggle('showing-return', showingReturn);
      allocationChart.classList.remove('chart-pulse');
      requestAnimationFrame(() => allocationChart.classList.add('chart-pulse'));
    });
  });
}
