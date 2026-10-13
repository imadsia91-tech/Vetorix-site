(function () {
  var d = document, h = d.documentElement;
  h.classList.add('js');
  var lang = (h.lang || 'fr').slice(0, 2);
  var PHONE_WA = '213540574820', MAIL = 'imadsiakheneabderrahmane@gmail.com';

  /* mobile menu */
  var burger = d.querySelector('.burger'), nav = d.querySelector('.nav');
  if (burger && nav) {
    burger.addEventListener('click', function () {
      var o = nav.classList.toggle('open');
      burger.setAttribute('aria-expanded', o ? 'true' : 'false');
    });
    nav.addEventListener('click', function (e) {
      if (e.target.tagName === 'A') { nav.classList.remove('open'); burger.setAttribute('aria-expanded', 'false'); }
    });
  }

  /* reveal on scroll */
  var rv = [].slice.call(d.querySelectorAll('.reveal'));
  if ('IntersectionObserver' in window) {
    var io = new IntersectionObserver(function (es) {
      es.forEach(function (e) { if (e.isIntersecting) { e.target.classList.add('in'); io.unobserve(e.target); } });
    }, { rootMargin: '0px 0px -8% 0px' });
    rv.forEach(function (el) { io.observe(el); });
  } else { rv.forEach(function (el) { el.classList.add('in'); }); }

  /* scale the 880x520 illustrations to their container */
  function fit() {
    [].forEach.call(d.querySelectorAll('.mockwrap'), function (w) {
      var m = w.querySelector('.mock'), cw = w.clientWidth;
      if (!m || !cw) return;
      var s = cw / 880;
      m.style.transform = 'scale(' + s + ')';
      w.style.height = Math.round(520 * s) + 'px';
    });
  }
  fit();
  window.addEventListener('resize', fit);
  window.addEventListener('load', fit);
  if ('ResizeObserver' in window) {
    var ro = new ResizeObserver(fit);
    [].forEach.call(d.querySelectorAll('.mockwrap'), function (w) { ro.observe(w); });
  }

  /* guide search + open/close all */
  var q = d.getElementById('q'), nr = d.getElementById('noresult');
  var accs = [].slice.call(d.querySelectorAll('#guide details.acc'));
  function norm(s) { return (s || '').toLowerCase().normalize('NFD').replace(/[̀-ͯ]/g, ''); }
  if (q) {
    q.addEventListener('input', function () {
      var v = norm(q.value.trim()), shown = 0;
      accs.forEach(function (a) {
        var ok = !v || norm(a.textContent).indexOf(v) > -1;
        a.style.display = ok ? '' : 'none';
        if (ok) shown++;
        if (v && ok) a.open = true;
      });
      if (nr) nr.style.display = (v && !shown) ? 'block' : 'none';
    });
  }
  var oa = d.getElementById('openall'), ca = d.getElementById('closeall');
  if (oa) oa.addEventListener('click', function () { accs.forEach(function (a) { if (a.style.display !== 'none') a.open = true; }); });
  if (ca) ca.addEventListener('click', function () { accs.forEach(function (a) { a.open = false; }); });
  /* open the guide section targeted by a link or chip */
  function openHash() {
    var t = location.hash && d.getElementById(location.hash.slice(1));
    if (t && t.tagName === 'DETAILS') t.open = true;
  }
  window.addEventListener('hashchange', openHash); openHash();

  /* demo / quote form: builds a WhatsApp or e-mail message, nothing is stored */
  var f = d.getElementById('demoform');
  if (f) {
    var T = lang === 'ar' ? {
      subj: 'طلب عرض تجريبي / عرض سعر - Vetorix',
      hello: 'مرحباً، أرغب في الحصول على عرض تجريبي أو عرض سعر لبرنامج Vetorix.',
      clinic: 'العيادة', name: 'الاسم', phone: 'الهاتف', city: 'المدينة', msg: 'ملاحظات',
      err: 'يرجى إدخال الاسم ورقم الهاتف.'
    } : {
      subj: 'Demande de démo / devis Vetorix',
      hello: 'Bonjour, je souhaite une démonstration ou un devis pour Vetorix.',
      clinic: 'Clinique', name: 'Nom', phone: 'Téléphone', city: 'Ville', msg: 'Message',
      err: 'Merci de renseigner votre nom et votre téléphone.'
    };
    var st = d.getElementById('demostatus');
    function body() {
      var g = function (n) { return (f.elements[n] && f.elements[n].value || '').trim(); };
      if (!g('name') || !g('phone')) { if (st) st.textContent = T.err; (g('name') ? f.elements.phone : f.elements.name).focus(); return null; }
      if (st) st.textContent = '';
      var L = [T.hello, ''];
      L.push(T.name + ' : ' + g('name'));
      if (g('clinic')) L.push(T.clinic + ' : ' + g('clinic'));
      L.push(T.phone + ' : ' + g('phone'));
      if (g('city')) L.push(T.city + ' : ' + g('city'));
      if (g('message')) L.push(T.msg + ' : ' + g('message'));
      return L.join('\n');
    }
    f.addEventListener('submit', function (e) { e.preventDefault(); });
    [].forEach.call(f.querySelectorAll('[data-send]'), function (b) {
      b.addEventListener('click', function () {
        var t = body(); if (!t) return;
        if (b.getAttribute('data-send') === 'wa') {
          window.open('https://wa.me/' + PHONE_WA + '?text=' + encodeURIComponent(t), '_blank', 'noopener');
        } else {
          window.open('https://mail.google.com/mail/?view=cm&fs=1&to=' + encodeURIComponent(MAIL) + '&su=' + encodeURIComponent(T.subj) + '&body=' + encodeURIComponent(t), '_blank', 'noopener');
        }
      });
    });
  }
})();
