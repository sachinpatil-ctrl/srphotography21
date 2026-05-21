
document.addEventListener('DOMContentLoaded', () => {

  /* ── Custom Cursor ──────────────────────────────────── */
  const dot  = document.getElementById('cursor-dot');
  const ring = document.getElementById('cursor-ring');
  let mx=0, my=0, rx=0, ry=0;
  document.addEventListener('mousemove', e => { mx=e.clientX; my=e.clientY; dot.style.left=mx+'px'; dot.style.top=my+'px'; });
  function animRing() {
    rx += (mx-rx)*0.14; ry += (my-ry)*0.14;
    ring.style.left=rx+'px'; ring.style.top=ry+'px';
    requestAnimationFrame(animRing);
  }
  animRing();
  document.querySelectorAll('a,button,.project-card,.service-card,.award-row,.exp-item,.marquee-word').forEach(el => {
    el.addEventListener('mouseenter', () => document.body.classList.add('cursor-hover'));
    el.addEventListener('mouseleave', () => document.body.classList.remove('cursor-hover'));
  });

  /* ── Scroll Progress ────────────────────────────────── */
  const prog = document.getElementById('scroll-progress');
  const btt  = document.getElementById('back-to-top');
  const nav  = document.getElementById('site-nav');
  window.addEventListener('scroll', () => {
    const pct = window.scrollY / (document.body.scrollHeight - window.innerHeight) * 100;
    prog.style.width = pct + '%';
    btt.classList.toggle('visible', window.scrollY > 400);
    nav.classList.toggle('scrolled', window.scrollY > 20);
  }, { passive: true });

  /* ── Back to Top ────────────────────────────────────── */
  btt.addEventListener('click', () => window.scrollTo({ top:0, behavior:'smooth' }));

  /* ── Scroll Reveal ──────────────────────────────────── */
  const revObs = new IntersectionObserver((entries) => {
    entries.forEach((e, i) => {
      if (e.isIntersecting) {
        setTimeout(() => e.target.classList.add('visible'), i * 60);
        revObs.unobserve(e.target);
      }
    });
  }, { threshold: 0.08 });
  document.querySelectorAll('.reveal').forEach(el => revObs.observe(el));

  /* ── Smooth Scroll ──────────────────────────────────── */
  document.querySelectorAll('[data-scroll]').forEach(btn => {
    btn.addEventListener('click', () => {
      const target = document.getElementById(btn.dataset.scroll);
      if (target) { closeMobileMenu(); setTimeout(() => target.scrollIntoView({ behavior:'smooth', block:'start' }), 100); }
    });
  });

  /* ── Mobile Menu ────────────────────────────────────── */
  const toggle = document.getElementById('nav-mobile-toggle');
  const menu   = document.getElementById('mobile-menu');
  function closeMobileMenu() { menu.classList.remove('open'); toggle.textContent='Menu'; document.body.style.overflow=''; }
  toggle?.addEventListener('click', () => {
    const open = menu.classList.toggle('open');
    toggle.textContent = open ? '✕ Close' : 'Menu';
    document.body.style.overflow = open ? 'hidden' : '';
  });

  /* ── Active Nav Highlight ───────────────────────────── */
  const sections = document.querySelectorAll('section[id]');
  const navBtns  = document.querySelectorAll('[data-scroll]');
  const secObs = new IntersectionObserver((entries) => {
    entries.forEach(e => {
      if (e.isIntersecting) {
        navBtns.forEach(b => {
          b.classList.toggle('active', b.dataset.scroll === e.target.id);
        });
      }
    });
  }, { threshold: 0.35 });
  sections.forEach(s => secObs.observe(s));

  /* ── Work Filter ────────────────────────────────────── */
  const filterBtns = document.querySelectorAll('.filter-btn');
  const projCards  = document.querySelectorAll('.project-card');
  filterBtns.forEach(btn => {
    btn.addEventListener('click', () => {
      filterBtns.forEach(b => b.classList.remove('active'));
      btn.classList.add('active');
      const f = btn.dataset.filter;
      projCards.forEach(card => {
        const match = f === 'all' || card.dataset.sector === f;
        card.style.transition = 'opacity 0.3s, transform 0.3s';
        if (match) { card.classList.remove('hidden'); card.style.opacity='1'; card.style.transform=''; }
        else { card.style.opacity='0'; card.style.transform='scale(0.97)'; setTimeout(()=>card.classList.add('hidden'),300); }
      });
    });
  });

  /* ── Project Card Click ─────────────────────────────── */
  projCards.forEach(card => {
    card.addEventListener('click', () => {
      const link = card.dataset.link;
      if (link && link !== '#') window.open(link, '_blank');
    });
  });

  /* ── Contact Form ───────────────────────────────────── */
  const form   = document.getElementById('contact-form');
  const submit = document.getElementById('contact-submit');
  form?.addEventListener('submit', async (e) => {
    e.preventDefault();
    const name    = form.querySelector('[name="name"]').value.trim();
    const email   = form.querySelector('[name="email"]').value.trim();
    const message = form.querySelector('[name="message"]').value.trim();
    if (!name || !email || !message) return;
    submit.disabled = true;
    submit.textContent = 'Sending…';
    await new Promise(r => setTimeout(r, 1200));
    submit.textContent = 'Message sent ✓';
    submit.style.background = '#16a34a';
    form.reset();
    setTimeout(() => {
      submit.innerHTML = 'Send message <svg xmlns="http://www.w3.org/2000/svg" width="18" height="18" fill="currentColor" viewBox="0 0 256 256"><path d="M230.14,25.86a20,20,0,0,0-19.57-5.11l-.22.07L18.44,79a20,20,0,0,0-3.06,37.25L99,157l40.71,83.65a19.81,19.81,0,0,0,18,11.38c.57,0,1.15,0,1.73-.07A19.82,19.82,0,0,0,177,237.56L235.18,45.65a1.42,1.42,0,0,0,.07-.22A20,20,0,0,0,230.14,25.86ZM156.91,221.07l-34.37-70.64,46-45.95a12,12,0,0,0-17-17l-46,46L34.93,99.09,210,46Z"></path></svg>';
      submit.style.background = '';
      submit.disabled = false;
    }, 3000);
  });

  /* ── Stat counter animation ─────────────────────────── */
  const statNums = document.querySelectorAll('.stat-num');
  const countObs = new IntersectionObserver((entries) => {
    entries.forEach(e => {
      if (e.isIntersecting) {
        const el = e.target;
        const target = parseInt(el.textContent);
        const suffix = el.innerHTML.includes('+') ? '<span class="accent">+</span>' : '';
        let current = 0;
        const inc = Math.ceil(target / 40);
        const timer = setInterval(() => {
          current = Math.min(current + inc, target);
          el.innerHTML = current + suffix;
          if (current >= target) clearInterval(timer);
        }, 30);
        countObs.unobserve(el);
      }
    });
  }, { threshold: 0.5 });
  statNums.forEach(el => countObs.observe(el));

});
