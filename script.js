document.querySelector('#to-top').addEventListener('click', () => {
  window.scrollTo({ top: 0, behavior: 'smooth' });
});

const portfolioToggles = document.querySelectorAll('.portfolio-toggle');
const fundRows = document.querySelectorAll('.fund-list article');
const portfolioTotal = document.querySelector('#portfolio-total');
const portfolioTotalLabel = document.querySelector('#portfolio-total-label');
const allocationChart = document.querySelector('.allocation-chart');

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
    portfolioTotal.textContent = showingReturn ? '+23,93 %' : '3';
    portfolioTotalLabel.textContent = showingReturn ? 'samlet avkastning' : 'fond';
    allocationChart.classList.toggle('showing-return', showingReturn);
  });
});
