const steps = [...document.querySelectorAll('.wizard-step')];
const form = document.getElementById('strategyForm');
const prevBtn = document.getElementById('prevBtn');
const nextBtn = document.getElementById('nextBtn');
const progressLabel = document.getElementById('progressLabel');
const progressFill = document.getElementById('progressFill');
const summaryBox = document.getElementById('summaryBox');
const qualification = document.getElementById('qualification');
const tier = document.getElementById('tier');

let current = 0;

function scoreFromBudget(value) {
  if (value === '$20k+') return 4;
  if (value === '$8k - $20k') return 3;
  if (value === '$3k - $8k') return 2;
  return 1;
}

function scoreFromRevenue(value) {
  if (value === '$20M+') return 4;
  if (value === '$5M - $20M') return 3;
  if (value === '$1M - $5M') return 2;
  return 1;
}

function getLevel(score) {
  if (score >= 7) return ['Fit: Strategic', 'Scale Tier'];
  if (score >= 5) return ['Fit: Strong', 'Growth Tier'];
  return ['Fit: Emerging', 'Foundation Tier'];
}

function updateSummary() {
  const data = Object.fromEntries(new FormData(form).entries());
  const fields = ['industry', 'companySize', 'revenue', 'services', 'budget', 'timeline', 'name', 'email', 'company'];
  const hasAny = fields.some((k) => data[k]);

  if (!hasAny) {
    summaryBox.innerHTML = '<p class="small">Complete the form to generate your strategic summary.</p>';
    qualification.textContent = 'Fit: Pending';
    tier.textContent = 'Tier: Pending';
    return;
  }

  summaryBox.innerHTML = `
    <ul class="list">
      <li><strong>Industry:</strong> ${data.industry || '—'}</li>
      <li><strong>Company size:</strong> ${data.companySize || '—'}</li>
      <li><strong>Revenue:</strong> ${data.revenue || '—'}</li>
      <li><strong>Services:</strong> ${data.services || '—'}</li>
      <li><strong>Budget:</strong> ${data.budget || '—'}</li>
      <li><strong>Timeline:</strong> ${data.timeline || '—'}</li>
      <li><strong>Contact:</strong> ${(data.name || '—')} / ${(data.email || '—')} / ${(data.company || '—')}</li>
    </ul>
  `;

  const score = scoreFromBudget(data.budget) + scoreFromRevenue(data.revenue);
  const [fit, suggestedTier] = getLevel(score);
  qualification.textContent = fit;
  tier.textContent = suggestedTier;
}

function setStep(index) {
  current = index;
  steps.forEach((step, i) => step.classList.toggle('active', i === current));
  prevBtn.style.visibility = current === 0 ? 'hidden' : 'visible';
  nextBtn.textContent = current === steps.length - 1 ? 'Finish' : 'Next';
  progressLabel.textContent = `Step ${current + 1} of ${steps.length}`;
  progressFill.style.width = `${((current + 1) / steps.length) * 100}%`;
  updateSummary();
}

function validateCurrentStep() {
  const inputs = [...steps[current].querySelectorAll('input, select')];
  for (const input of inputs) {
    if (!input.checkValidity()) {
      input.reportValidity();
      return false;
    }
  }
  return true;
}

nextBtn.addEventListener('click', () => {
  if (!validateCurrentStep()) return;
  if (current < steps.length - 1) {
    setStep(current + 1);
  } else {
    updateSummary();
    nextBtn.disabled = true;
    nextBtn.textContent = 'Submitted';
  }
});

prevBtn.addEventListener('click', () => {
  if (current > 0) setStep(current - 1);
});

form.addEventListener('change', updateSummary);
setStep(0);
