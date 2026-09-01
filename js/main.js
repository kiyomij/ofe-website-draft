document.addEventListener('DOMContentLoaded', function () {
  var toggle = document.querySelector('.nav-toggle');
  var links = document.querySelector('.nav-links');
  if (toggle && links) {
    toggle.addEventListener('click', function () {
      var isOpen = links.classList.toggle('open');
      toggle.setAttribute('aria-expanded', String(isOpen));
    });
  }

  document.querySelectorAll('.bucket-legend a[href^="#"]').forEach(function (a) {
    a.addEventListener('click', function () {
      var target = document.querySelector(a.getAttribute('href'));
      if (target && target.tagName === 'DETAILS') target.open = true;
    });
  });

  var revealEls = document.querySelectorAll('.reveal');
  if (revealEls.length) {
    var revealSiblingCounts = new Map();
    revealEls.forEach(function (el) {
      if (!el.classList.contains('reveal-stagger')) return;
      var parent = el.parentElement;
      var idx = revealSiblingCounts.get(parent) || 0;
      el.style.transitionDelay = Math.min(idx * 70, 420) + 'ms';
      revealSiblingCounts.set(parent, idx + 1);
    });

    if ('IntersectionObserver' in window) {
      var revealObserver = new IntersectionObserver(function (entries, obs) {
        entries.forEach(function (entry) {
          if (entry.isIntersecting) {
            entry.target.classList.add('is-visible');
            obs.unobserve(entry.target);
          }
        });
      }, { threshold: 0.15, rootMargin: '0px 0px -10% 0px' });
      revealEls.forEach(function (el) { revealObserver.observe(el); });
    } else {
      revealEls.forEach(function (el) { el.classList.add('is-visible'); });
    }
  }

  function wireGoogleScriptForm(formSelector, scriptUrlKey, successMessage) {
    var form = document.querySelector(formSelector);
    if (!form) return;

    form.addEventListener('submit', function (e) {
      e.preventDefault();
      var status = form.querySelector('.form-status');
      var scriptUrl = window[scriptUrlKey];

      if (!scriptUrl) {
        status.textContent = 'This form isn\'t connected yet — the site owner still needs to add the form script URL.';
        status.dataset.state = 'error';
        return;
      }

      var submitBtn = form.querySelector('button[type="submit"]');
      submitBtn.disabled = true;
      status.textContent = 'Sending...';
      status.dataset.state = '';

      fetch(scriptUrl, {
        method: 'POST',
        body: new FormData(form)
      })
        .then(function (res) {
          if (!res.ok) throw new Error('Request failed');
          form.reset();
          status.textContent = successMessage;
          status.dataset.state = 'ok';
        })
        .catch(function () {
          status.textContent = 'Something went wrong sending this. Please try again in a moment.';
          status.dataset.state = 'error';
        })
        .finally(function () {
          submitBtn.disabled = false;
        });
    });
  }

  wireGoogleScriptForm('#contact-form', 'OFE_CONTACT_SCRIPT_URL', 'Message sent — thank you! We\'ll be in touch.');
  wireGoogleScriptForm('#vision-form', 'OFE_VISION_SCRIPT_URL', 'Thanks for sharing — your ideas help shape what comes next.');

  var navDropdown = document.querySelector('.nav-dropdown');
  if (navDropdown) {
    var navDropdownToggle = navDropdown.querySelector('.nav-dropdown-toggle');
    var closeNavDropdown = function () {
      navDropdown.classList.remove('open');
      navDropdownToggle.setAttribute('aria-expanded', 'false');
    };
    navDropdownToggle.addEventListener('click', function () {
      var isOpen = navDropdown.classList.toggle('open');
      navDropdownToggle.setAttribute('aria-expanded', String(isOpen));
    });
    document.addEventListener('click', function (e) {
      if (!navDropdown.contains(e.target)) closeNavDropdown();
    });
    document.addEventListener('keydown', function (e) {
      if (e.key === 'Escape') closeNavDropdown();
    });
    navDropdown.querySelectorAll('.nav-dropdown-menu a').forEach(function (link) {
      link.addEventListener('click', function () {
        closeNavDropdown();
        if (links) links.classList.remove('open');
      });
    });
  }

  var pageTocSidebar = document.querySelector('.page-toc-sidebar');
  if (pageTocSidebar) {
    var tocLinks = Array.prototype.slice.call(pageTocSidebar.querySelectorAll('.page-toc-sidebar-list a'));
    var tocSections = tocLinks
      .map(function (a) { return document.getElementById(a.getAttribute('href').slice(1)); })
      .filter(Boolean);
    var tocActiveIds = {};

    function setActiveTocLink(id) {
      tocLinks.forEach(function (a) {
        var isActive = a.getAttribute('href') === '#' + id;
        a.classList.toggle('is-active', isActive);
        if (isActive) a.setAttribute('aria-current', 'true');
        else a.removeAttribute('aria-current');
      });
    }

    if ('IntersectionObserver' in window && tocSections.length) {
      var tocObserver = new IntersectionObserver(function (entries) {
        entries.forEach(function (entry) {
          if (entry.isIntersecting) tocActiveIds[entry.target.id] = true;
          else delete tocActiveIds[entry.target.id];
        });
        var order = tocSections.map(function (s) { return s.id; });
        var current = order.find(function (id) { return tocActiveIds[id]; });
        if (current) setActiveTocLink(current);
      }, { rootMargin: '-96px 0px -60% 0px', threshold: 0 });
      tocSections.forEach(function (s) { tocObserver.observe(s); });
    }
  }

  var openers = document.querySelectorAll('[data-open]');
  var backdrops = document.querySelectorAll('.modal-backdrop');

  function openModal(id, trigger) {
    var modal = document.getElementById(id);
    if (!modal) return;
    modal.classList.add('open');
    modal._trigger = trigger;
    var closeBtn = modal.querySelector('.modal-close');
    if (closeBtn) closeBtn.focus();
    document.addEventListener('keydown', onKeydown);
  }
  function closeModal(modal) {
    modal.classList.remove('open');
    if (modal._trigger) modal._trigger.focus();
    document.removeEventListener('keydown', onKeydown);
  }
  function onKeydown(e) {
    if (e.key === 'Escape') {
      backdrops.forEach(function (m) { if (m.classList.contains('open')) closeModal(m); });
    }
  }

  openers.forEach(function (btn) {
    btn.addEventListener('click', function () {
      openModal(btn.getAttribute('data-open'), btn);
    });
  });
  backdrops.forEach(function (modal) {
    modal.addEventListener('click', function (e) {
      if (e.target === modal) closeModal(modal);
    });
    modal.querySelectorAll('[data-close]').forEach(function (btn) {
      btn.addEventListener('click', function () { closeModal(modal); });
    });
  });

  function openModalFromHash() {
    var id = window.location.hash.slice(1);
    if (!id) return;
    var modal = document.getElementById(id);
    if (modal && modal.classList.contains('modal-backdrop')) openModal(id);
  }
  openModalFromHash();
  window.addEventListener('hashchange', openModalFromHash);
});
