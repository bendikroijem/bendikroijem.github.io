document.querySelector('#to-top').addEventListener('click', () => {
  window.scrollTo({ top: 0, behavior: 'smooth' });
});

const portfolioToggles = document.querySelectorAll('.portfolio-toggle');
const fundRows = document.querySelectorAll('.fund-list article');
const portfolioTotal = document.querySelector('#portfolio-total');
const portfolioTotalLabel = document.querySelector('#portfolio-total-label');
const allocationChart = document.querySelector('.allocation-chart');

const prefersReducedMotion = window.matchMedia('(prefers-reduced-motion: reduce)').matches;

const portfolioObserver = new IntersectionObserver(
  ([entry]) => {
    if (!entry.isIntersecting) return;
    allocationChart.classList.add('chart-visible');
    portfolioObserver.disconnect();
  },
  { threshold: 0.35 },
);

portfolioObserver.observe(allocationChart);

document.querySelectorAll('.about, .results, .portfolio-heading, .project-card, .cv').forEach((element, index) => {
  element.classList.add('motion-ready');
  element.style.setProperty('--reveal-delay', `${Math.min(index * 70, 210)}ms`);
});

if (!prefersReducedMotion) {
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

  document.querySelectorAll('.motion-ready').forEach((element) => revealObserver.observe(element));
} else {
  document.querySelectorAll('.motion-ready').forEach((element) => element.classList.add('motion-visible'));
}

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
    portfolioTotal.textContent = showingReturn ? '+23,94 %' : '3';
    portfolioTotalLabel.textContent = showingReturn ? 'avkastning siden kjøp' : 'fond';
    allocationChart.classList.toggle('showing-return', showingReturn);
    allocationChart.classList.remove('chart-pulse');
    requestAnimationFrame(() => allocationChart.classList.add('chart-pulse'));
  });
});
