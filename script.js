/* ══════════════════════════════════════════
   KAYALA THRINETHRA — Portfolio Scripts
   script.js
══════════════════════════════════════════ */

/* ── Custom cursor ── */
const dot  = document.getElementById('cursor-dot');
const ring = document.getElementById('cursor-ring');
let mx = 0, my = 0, rx = 0, ry = 0;

document.addEventListener('mousemove', e => {
  mx = e.clientX;
  my = e.clientY;
});

function animateCursor() {
  rx += (mx - rx) * 0.18;
  ry += (my - ry) * 0.18;
  dot.style.left  = mx + 'px';
  dot.style.top   = my + 'px';
  ring.style.left = rx + 'px';
  ring.style.top  = ry + 'px';
  requestAnimationFrame(animateCursor);
}
if (window.innerWidth > 700) animateCursor();


/* ── Navbar scroll ── */
const navbar = document.getElementById('navbar');
window.addEventListener('scroll', () => {
  navbar.classList.toggle('scrolled', window.scrollY > 40);
});


/* ── Hamburger menu ── */
const ham = document.getElementById('hamburger');
const mob = document.getElementById('mobile-menu');
ham.addEventListener('click', () => mob.classList.toggle('open'));

function closeMobile() {
  mob.classList.remove('open');
}


/* ── Hero canvas — neural mesh ── */
(function () {
  const canvas = document.getElementById('hero-canvas');
  const ctx    = canvas.getContext('2d');
  let W, H, nodes = [];

  function resize() {
    W = canvas.width  = canvas.offsetWidth;
    H = canvas.height = canvas.offsetHeight;
  }

  class Node {
    constructor() { this.reset(); }
    reset() {
      this.x   = Math.random() * W;
      this.y   = Math.random() * H;
      this.vx  = (Math.random() - 0.5) * 0.6;
      this.vy  = (Math.random() - 0.5) * 0.6;
      this.r   = Math.random() * 2 + 1;
      this.hue = Math.random() > 0.5 ? '#7C3AED' : '#38BDF8';
    }
    update() {
      this.x += this.vx;
      this.y += this.vy;
      if (this.x < -20 || this.x > W + 20 || this.y < -20 || this.y > H + 20) {
        this.reset();
      }
    }
  }

  function init() {
    resize();
    nodes = Array.from({ length: 70 }, () => new Node());
  }

  function draw() {
    ctx.clearRect(0, 0, W, H);
    const N = nodes.length;

    for (let i = 0; i < N; i++) {
      nodes[i].update();

      // Draw node dot
      ctx.beginPath();
      ctx.arc(nodes[i].x, nodes[i].y, nodes[i].r, 0, Math.PI * 2);
      ctx.fillStyle = nodes[i].hue + '99';
      ctx.fill();

      // Draw circuit-board style connections
      for (let j = i + 1; j < N; j++) {
        const dx   = nodes[j].x - nodes[i].x;
        const dy   = nodes[j].y - nodes[i].y;
        const dist = Math.sqrt(dx * dx + dy * dy);

        if (dist < 160) {
          const alpha = (1 - dist / 160) * 0.35;
          ctx.beginPath();
          ctx.moveTo(nodes[i].x, nodes[i].y);
          ctx.lineTo(nodes[i].x + dx * 0.5, nodes[i].y); // horizontal
          ctx.lineTo(nodes[j].x, nodes[j].y);             // vertical
          ctx.strokeStyle = `rgba(124,58,237,${alpha})`;
          ctx.lineWidth   = 0.8;
          ctx.stroke();
        }
      }
    }
    requestAnimationFrame(draw);
  }

  window.addEventListener('resize', resize);
  init();
  draw();
})();


/* ── Scroll reveal ── */
const reveals   = document.querySelectorAll('.reveal');
const revealObs = new IntersectionObserver((entries) => {
  entries.forEach(e => {
    if (e.isIntersecting) e.target.classList.add('visible');
  });
}, { threshold: 0.12 });
reveals.forEach(el => revealObs.observe(el));


/* ── Skill bar animation ── */
const bars  = document.querySelectorAll('.skill-bar-fill');
const barObs = new IntersectionObserver((entries) => {
  entries.forEach(e => {
    if (e.isIntersecting) {
      e.target.style.width = e.target.dataset.width + '%';
      barObs.unobserve(e.target);
    }
  });
}, { threshold: 0.2 });
bars.forEach(b => barObs.observe(b));


/* ── Contact form ── */
function submitForm() {
  const name    = document.getElementById('name').value.trim();
  const email   = document.getElementById('email').value.trim();
  const message = document.getElementById('message').value.trim();

  if (!name || !email || !message) {
    alert('Please fill in all fields.');
    return;
  }

  const emailRe = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
  if (!emailRe.test(email)) {
    alert('Please enter a valid email address.');
    return;
  }

  document.getElementById('contact-form').style.display = 'none';
  document.getElementById('form-success').style.display  = 'block';
}
