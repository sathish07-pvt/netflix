// ---------- Background slideshow ----------
const slides = document.querySelectorAll('.bg-slide');
let slideIdx = 0;
setInterval(() => {
  slides[slideIdx].classList.remove('active');
  slideIdx = (slideIdx + 1) % slides.length;
  slides[slideIdx].classList.add('active');
}, 8000);

// ---------- Floating particles ----------
const particlesRoot = document.getElementById('particles');
for (let i = 0; i < 22; i++) {
  const p = document.createElement('span');
  p.className = 'particle';
  const size = 2 + Math.random() * 4;
  p.style.width = `${size}px`;
  p.style.height = `${size}px`;
  p.style.left = `${Math.random() * 100}%`;
  p.style.top = `${Math.random() * 100}%`;
  p.style.animationDuration = `${10 + Math.random() * 18}s`;
  p.style.animationDelay = `${Math.random() * -20}s`;
  p.style.setProperty('--dx', `${(Math.random() - 0.5) * 200}px`);
  p.style.setProperty('--dy', `${-100 - Math.random() * 300}px`);
  particlesRoot.appendChild(p);
}

// ---------- Password toggle ----------
const pwInput = document.getElementById('password');
const toggle = document.getElementById('togglePw');
const eyeIcon = document.getElementById('eyeIcon');
const EYE = `<path d="M1 12s4-8 11-8 11 8 11 8-4 8-11 8-11-8-11-8z"/><circle cx="12" cy="12" r="3"/>`;
const EYE_OFF = `<path d="M17.94 17.94A10.07 10.07 0 0 1 12 20c-7 0-11-8-11-8a18.45 18.45 0 0 1 5.06-5.94M9.9 4.24A9.12 9.12 0 0 1 12 4c7 0 11 8 11 8a18.5 18.5 0 0 1-2.16 3.19m-6.72-1.07a3 3 0 1 1-4.24-4.24"/><line x1="1" y1="1" x2="23" y2="23"/>`;

toggle.addEventListener('click', () => {
  const isPw = pwInput.type === 'password';
  pwInput.type = isPw ? 'text' : 'password';
  eyeIcon.innerHTML = isPw ? EYE_OFF : EYE;
  toggle.setAttribute('aria-label', isPw ? 'Hide password' : 'Show password');
});

// ---------- Ripple ----------
function ripple(e) {
  const btn = e.currentTarget;
  const circle = document.createElement('span');
  const diameter = Math.max(btn.clientWidth, btn.clientHeight);
  const radius = diameter / 2;
  const rect = btn.getBoundingClientRect();
  circle.style.width = circle.style.height = `${diameter}px`;
  circle.style.left = `${e.clientX - rect.left - radius}px`;
  circle.style.top = `${e.clientY - rect.top - radius}px`;
  circle.classList.add('ripple');
  const existing = btn.querySelector('.ripple');
  if (existing) existing.remove();
  btn.appendChild(circle);
}
document.getElementById('signInBtn').addEventListener('click', ripple);

// ---------- Toast ----------
const toastEl = document.getElementById('toast');
const toastTitle = document.getElementById('toastTitle');
const toastDesc = document.getElementById('toastDesc');
let toastTimer;
function showToast(title, desc) {
  toastTitle.textContent = title;
  toastDesc.textContent = desc;
  toastEl.classList.add('show');
  clearTimeout(toastTimer);
  toastTimer = setTimeout(() => toastEl.classList.remove('show'), 3200);
}

// ---------- Form submit ----------
const form = document.getElementById('loginForm');
const emailEl = document.getElementById('email');
const emailErr = document.getElementById('emailErr');
const pwErr = document.getElementById('pwErr');
const btn = document.getElementById('signInBtn');
const rememberEl = document.getElementById('remember');

form.addEventListener('submit', (e) => {
  e.preventDefault();
  emailErr.textContent = '';
  pwErr.textContent = '';
  let ok = true;

  if (!emailEl.value || emailEl.value.trim().length < 5) {
    emailErr.textContent = 'Please enter a valid email or phone number.';
    ok = false;
  }
  if (!pwInput.value || pwInput.value.length < 4) {
    pwErr.textContent = 'Your password must contain between 4 and 60 characters.';
    ok = false;
  }
  if (!ok) return;

  btn.disabled = true;
  btn.innerHTML = '<span class="spinner"></span>Signing in…';

  setTimeout(() => {
    btn.disabled = false;
    btn.innerHTML = 'Sign In';
    if (rememberEl.checked) {
      try { localStorage.setItem('nf_remember', emailEl.value); } catch (_) {}
    }
    showToast('Welcome back', 'Signing you in to Netflix…');
  }, 900);
});

// ---------- Social & guest ----------
function socialSignIn(provider) {
  showToast(`${provider} sign-in`, 'Redirecting…');
}
function continueAsGuest() {
  showToast('Continuing as guest', 'Limited catalog preview.');
}

// ---------- Restore remembered email ----------
try {
  const saved = localStorage.getItem('nf_remember');
  if (saved) emailEl.value = saved;
} catch (_) {}