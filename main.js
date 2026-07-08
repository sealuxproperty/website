const RATES = {
  USD: 1,
  GBP: 0.79,
  EUR: 0.92,
  AUD: 1.53,
  SGD: 1.35
};

const SYMBOLS = {
  USD: '$',
  GBP: '£',
  EUR: '€',
  AUD: 'A$',
  SGD: 'S$'
};

// ─────────────────────────────
// Property list
// ─────────────────────────────

const PROPERTY_LIST = [
  "Select development",
  "Haraya - Pasig",
  "Laya - Pasig",
  "Shang Summit - Quezon",
  "Shang Bauhinia - Cebu",
  "Bluroc - Hua Hin",
  "Not sure yet"
];

function populatePropertySelects() {

  document.querySelectorAll('select[name="property"]').forEach(select => {

    const current = select.dataset.selected || "";

    select.innerHTML = "";

    PROPERTY_LIST.forEach(property => {

      const option = document.createElement("option");

      option.value = property;
      option.textContent = property;

      if (property === current)
        option.selected = true;

      select.appendChild(option);

    });

  });

}

function setSelectedProperty(property) {

  document.querySelectorAll('select[name="property"]').forEach(select => {

    select.value = property;

  });

}

// ─────────────────────────────
// Currency
// ─────────────────────────────

function setCurrency(code) {

  localStorage.setItem('sealux-currency', code);

  document.querySelectorAll('.currency-btn').forEach(btn => {

    btn.classList.toggle(
      'active',
      btn.dataset.currency === code
    );

  });

  document.querySelectorAll('[data-usd]').forEach(el => {

    const value =
      parseFloat(el.dataset.usd) * RATES[code];

    el.textContent =
      value >= 1000000
        ? SYMBOLS[code] +
        (value / 1000000).toFixed(2) +
        'M'
        : SYMBOLS[code] +
        Math.round(value / 1000) +
        'k';

  });

}

// ── Developments page filters ──
// ── Budget page filters ─────────────────────────────

function applyFilters() {

  const budgetEl = document.getElementById("f-budget");
  const countryEl = document.getElementById("f-country");

  if (!budgetEl) return;

  // Budget range

  let min = 0;
  let max = Infinity;

  if (budgetEl.value !== "0,9999999") {

    const parts = budgetEl.value.split(",");

    min = parseInt(parts[0], 10);
    max = parseInt(parts[1], 10);

  }

  const country = countryEl.value;

  let totalVisible = 0;

  document.querySelectorAll(".dev-group").forEach(group => {

    const groupCountry = group.dataset.country;

    const countryMatch =
      !country || groupCountry === country;

    let visibleCards = 0;

    group.querySelectorAll(".unit-card").forEach(card => {

      const price = parseInt(card.dataset.from || 0, 10);

      const budgetMatch =
        price >= min &&
        price <= max;

      const show =
        countryMatch &&
        budgetMatch;

      card.style.display = show ? "" : "none";

      if (show)
        visibleCards++;

    });

    group.style.display =
      visibleCards ? "" : "none";

    totalVisible += visibleCards;

  });

  const noResults =
    document.getElementById("no-results");

  if (noResults)
    noResults.style.display =
      totalVisible ? "none" : "block";

}

window.applyFilters = applyFilters;


// ─────────────────────────────
// Unit detail panel
// UNIT_DATA comes from each HTML page
// ─────────────────────────────

function showUnitDetail(key) {

  if (typeof UNIT_DATA === 'undefined')
    return;

  const data = UNIT_DATA[key];

  if (!data)
    return;

  document.querySelectorAll('.unit-card')
    .forEach(card => {

      card.classList.toggle(
        'active',
        card.dataset.unit === key
      );

    });

  const panel =
    document.getElementById('unit-detail');

  if (!panel)
    return;

  panel.innerHTML = `

<div class="unit-detail-grid">

<div class="unit-floorplan">

<h4>
${data.label} — Floor Plan
</h4>

<img
src="${data.floorplan}"
alt="${data.label} floor plan">

</div>


<div>

<h4>${data.label}</h4>

<p class="unit-size">${data.size}</p>

<p class="unit-desc">${data.info}</p>

<p class="unit-price">From <span data-usd="${data.price}"></span></p>

<p style="color:var(--text-mid)">
${data.description}
</p>

<div class="unit-gallery">

${data.gallery.map(src => `

<img
src="${src}"
alt="${data.label}">

`).join('')}

</div>

<button
type="button"
class="btn btn-gold unit-inquire"
data-unit-label="${data.label}"
style="margin-top:24px">

Inquire About This Unit

</button>

</div>

</div>

`;

  const currentCurrency = localStorage.getItem('sealux-currency') || 'USD';
  setCurrency(currentCurrency);



}


// ─────────────────────────────
// DOM Ready
// ─────────────────────────────

document.addEventListener('DOMContentLoaded', () => {


  // Currency buttons

  document
    .querySelectorAll('.currency-btn')
    .forEach(btn => {

      btn.addEventListener(
        'click',
        () => setCurrency(btn.dataset.currency)
      );

    });

  const savedCurrency = localStorage.getItem('sealux-currency') || 'USD';
  setCurrency(savedCurrency);

  populatePropertySelects();
  // Active nav

  const path =
    window.location.pathname;

  document
    .querySelectorAll('.nav-links a')
    .forEach(link => {

      if (
        path.endsWith(
          link.getAttribute('href')
        )
      ) {

        link.classList.add('active');

      }

    });


  // Mobile menu

  const hamburger =
    document.getElementById('hamburger');

  const mobileNav =
    document.getElementById('mobile-nav');

  if (
    hamburger &&
    mobileNav
  ) {

    hamburger.addEventListener(
      'click',
      () => {

        hamburger.classList.toggle('open');

        mobileNav.classList.toggle('open');

      }
    );

    mobileNav
      .querySelectorAll('a')
      .forEach(link => {

        link.addEventListener(
          'click',
          () => {

            hamburger.classList.remove('open');

            mobileNav.classList.remove('open');

          }
        );

      });

  }

  // ─────────────────────────────
  // Floating contact form
  // (missing previously — float-btn had no listener,
  // so #float-form-wrap never opened or closed)
  // ─────────────────────────────

  const floatBtn =
    document.getElementById('float-btn');

  const floatFormWrap =
    document.getElementById('float-form-wrap');

  const floatFormClose =
    document.getElementById('float-form-close');

  if (floatBtn && floatFormWrap) {

    floatBtn.addEventListener('click', () => {

      floatFormWrap.classList.toggle('open');

    });

  }

  if (floatFormClose && floatFormWrap) {

    floatFormClose.addEventListener('click', () => {

      floatFormWrap.classList.remove('open');

    });

  }

  // ─────────────────────────────
  // Hero carousel
  // ─────────────────────────────

  const slides =
    document.querySelectorAll('.hero-slide');

  const dots =
    document.querySelectorAll('.hero-dot');

  const progressBar =
    document.querySelector('.hero-progress-bar');

  let currentSlide = 0;
  let advanceTimer = null;

  function clearAdvanceTimer() {
    if (advanceTimer) {
      clearTimeout(advanceTimer);
      advanceTimer = null;
    }
  }

  function runProgressBar(durationMs) {
    if (!progressBar) return;
    // reset instantly, no transition
    progressBar.style.transition = 'none';
    progressBar.style.width = '0%';
    // force reflow so the reset actually applies before we animate
    void progressBar.offsetWidth;
    progressBar.style.transition = `width ${durationMs}ms linear`;
    progressBar.style.width = '100%';
  }

  function goToNext() {
    currentSlide++;
    if (currentSlide >= slides.length) currentSlide = 0;
    showSlide(currentSlide);
  }

  function showSlide(index) {

    if (!slides.length) return;

    clearAdvanceTimer();

    const fallbackDuration = 8000; // used for non-video slides, or if video metadata isn't ready

    slides.forEach((slide, i) => {

      slide.classList.toggle('active', i === index);

      const video = slide.querySelector('video');
      if (video) {
        // remove any previous 'ended' listener from earlier activations
        video.onended = null;

        if (i === index) {
          video.currentTime = 0;
          const playPromise = video.play();
          if (playPromise) playPromise.catch(() => { });

          // advance as soon as this video finishes, instead of on a fixed timer
          video.onended = goToNext;

          // drive the progress bar off the real video duration once known
          if (video.readyState >= 1 && video.duration) {
            runProgressBar(video.duration * 1000);
          } else {
            video.addEventListener('loadedmetadata', () => {
              if (slide.classList.contains('active')) {
                runProgressBar(video.duration * 1000);
              }
            }, { once: true });
            // safety net in case metadata never fires
            advanceTimer = setTimeout(goToNext, fallbackDuration);
          }
        } else {
          video.pause();
        }
      } else if (i === index) {
        // non-video slide: just use a fixed duration
        runProgressBar(fallbackDuration);
        advanceTimer = setTimeout(goToNext, fallbackDuration);
      }

    });

    dots.forEach((dot, i) => {
      dot.classList.toggle('active', i === index);
    });

  }

  if (slides.length) {
    showSlide(0);
  }


  // ─────────────────────────────
  // Hero dots
  // ─────────────────────────────

  dots.forEach((dot, i) => {

    dot.addEventListener(
      'click',
      () => {

        currentSlide = i;

        showSlide(currentSlide);

      }
    );

  });


  // ─────────────────────────────
  // Unit cards
  // ─────────────────────────────

  document
    .querySelectorAll('.unit-card')
    .forEach(card => {

      card.addEventListener(
        'click',
        () => {

          showUnitDetail(
            card.dataset.unit
          );

        }
      );

    });


  if (
    typeof UNIT_DATA !== 'undefined'
    &&
    document.getElementById(
      'unit-detail'
    )
  ) {

    const firstCard =
      document.querySelector(
        '.unit-card'
      );

    if (firstCard) {

      showUnitDetail(
        firstCard.dataset.unit
      );

    }

  }


  // ─────────────────────────────
  // Tabs
  // ─────────────────────────────

  document
    .querySelectorAll('.tab-btn')
    .forEach(btn => {

      btn.addEventListener(
        'click',
        () => {

          const tab =
            btn.dataset.tab;

          document
            .querySelectorAll('.tab-btn')
            .forEach(b =>
              b.classList.remove(
                'active'
              )
            );

          btn.classList.add(
            'active'
          );

          document
            .querySelectorAll(
              '.tab-panel'
            )
            .forEach(panel => {

              panel.classList.toggle(
                'active',
                panel.id === tab
              );

            });

        }
      );

    });


  // ─────────────────────────────
  // Image overlay
  // ─────────────────────────────

  const overlay =
    document.getElementById(
      'image-overlay'
    );

  const overlayImg =
    document.getElementById(
      'overlay-img'
    );

  const closeBtn =
    document.querySelector(
      '.overlay-close'
    );


  document.addEventListener(
    'click',
    e => {

      const img =
        e.target.closest(

          '.amenity-gallery img, .unit-gallery img, .unit-floorplan img'

        );

      if (
        !img ||
        !overlay
      )
        return;

      overlay.style.display =
        'flex';

      overlayImg.src =
        img.src;

      overlayImg.alt =
        img.alt;

    });


  if (
    closeBtn
  ) {

    closeBtn.addEventListener(
      'click',
      () => {

        overlay.style.display =
          'none';

      }
    );

  }


  if (
    overlay
  ) {

    overlay.addEventListener(
      'click',
      e => {

        if (
          e.target === overlay
        ) {

          overlay.style.display =
            'none';

        }

      }
    );

  }


  document.addEventListener(
    'keydown',
    e => {

      if (

        e.key === 'Escape'
        &&
        overlay
        &&
        overlay.style.display ===
        'flex'

      ) {

        overlay.style.display =
          'none';

      }

    });


  // ─────────────────────────────
  // Inquiry buttons
  // ─────────────────────────────

  // ─────────────────────────────
  // Inquiry buttons
  // ─────────────────────────────

  document.addEventListener("click", e => {

    const btn = e.target.closest(".enquire-btn, .unit-inquire");

    if (!btn)
      return;

    e.preventDefault();

    const property = btn.dataset.property || "";
    const unit = btn.dataset.unit || "";

    if (property)
      setSelectedProperty(property);

    const message = document.querySelector('textarea[name="message"]');

    if (message) {

      if (unit)
        message.value = `I would like more information about the ${unit} at ${property}.`;
      else
        message.value = `I would like more information about ${property}.`;

    }

    const floatForm = document.getElementById("float-form-wrap");

    if (floatForm)
      floatForm.classList.add("open");

  });


  // ─────────────────────────────
  // Forms
  // Sends enquiries to the Google Sheet via Apps Script.

  // editor (Deploy > Manage deployments) that this is still the
  // active Web App URL before relying on it.
  //
  // This is scoped by CLASS, not id, so the same template can be
  // used more than once on one page (e.g. an inline form + the
  // floating overlay form) without any id collisions. Each form
  // must be wrapped in an element with class "enquiry-form-block"
  // — error/success messages are looked up relative to that
  // wrapper, not globally, so multiple instances stay independent.
  // ─────────────────────────────

 const SHEET_URL = 'https://script.google.com/macros/s/AKfycbxJEZBdTri9zWdtszwoHg_xgRxObBCllHqdmmoNtkaJ0csIIPc3InNS-FjfyFCWXm6pIg/exec';

  function initContactForm(form) {

    if (!form) return;

    const wrap = form.closest('.enquiry-form-block') || form.parentElement;

    const missingErrorEl = form.querySelector('.form-error--missing');
    const phoneErrorEl = form.querySelector('.form-error--phone');
    const successEl = wrap ? wrap.querySelector('.form-success') : null;
    const submitBtn = form.querySelector('.enquiry-submit, button[type="submit"]');
    const honeypot = form.querySelector('input[name="website"]');

    const formLoadTime = Date.now();

    form.addEventListener('submit', e => {

      e.preventDefault();

      // ── bot checks ──
      if (honeypot && honeypot.value.trim() !== '') return;
      if (Date.now() - formLoadTime < 3000) return;

      const lastSubmit = localStorage.getItem('sealux-last-submit');
      if (lastSubmit && Date.now() - parseInt(lastSubmit, 10) < 60000) return;
      // ── end bot checks ──

      const email = form.email.value.trim();
      const phone = form.phone.value.trim();

      if (missingErrorEl) missingErrorEl.style.display = 'none';
      if (phoneErrorEl) phoneErrorEl.style.display = 'none';

      if (!email && !phone) {
        if (missingErrorEl) missingErrorEl.style.display = 'block';
        return;
      }

      if (phone && !/^[0-9+\s\-()]{7,}$/.test(phone)) {
        if (phoneErrorEl) phoneErrorEl.style.display = 'block';
        return;
      }

      if (submitBtn) {
        submitBtn.textContent = 'Sending...';
        submitBtn.disabled = true;
      }

      const data = {
        name: form.name.value,
        email: email,
        phone: phone,
        property: form.property.value,
        message: form.message.value
      };

      fetch(SHEET_URL, {
        method: 'POST',
        mode: 'no-cors',
        body: JSON.stringify(data)
      })
        .then(() => {

          localStorage.setItem('sealux-last-submit', Date.now().toString());

          form.style.display = 'none';

          if (successEl) successEl.style.display = 'block';

          if (submitBtn) {
            submitBtn.textContent = 'Send enquiry';
            submitBtn.disabled = false;
          }

        })
        .catch(() => {

          if (submitBtn) {
            submitBtn.textContent = 'Send enquiry';
            submitBtn.disabled = false;
          }

          if (missingErrorEl) {
            missingErrorEl.textContent = 'Something went wrong — please try again.';
            missingErrorEl.style.display = 'block';
          }

        });

    });

  }

  document
    .querySelectorAll('.enquiry-form')
    .forEach(initContactForm);

});



document
  .querySelectorAll('.amenity-tab')
  .forEach(btn => {

    btn.addEventListener('click', () => {

      const tab = btn.dataset.tab;

      // buttons
      document
        .querySelectorAll('.amenity-tab')
        .forEach(b => b.classList.remove('active'));

      btn.classList.add('active');

      // panels
      document
        .querySelectorAll('.amenity-panel')
        .forEach(panel => {

          panel.classList.toggle(
            'active',
            panel.dataset.panel === tab
          );

        });

    });

  });

// ── Developments page filters (card grid) ──
function applyFiltersDevelopments() {

  const countryEl = document.getElementById("f-country");
  const unitEl = document.getElementById("f-unit");
  const budgetEl = document.getElementById("f-budget");

  if (!countryEl || !unitEl || !budgetEl) return;

  const country = countryEl.value;
  const unit = unitEl.value;
  const maxBudget = budgetEl.value ? parseInt(budgetEl.value, 10) : Infinity;

  let totalVisible = 0;

  document.querySelectorAll("#grid .card").forEach(card => {

    const cardCountry = card.dataset.country || "";
    const cardUnits = (card.dataset.units || "").split(",").map(u => u.trim());

    const countryMatch = !country || cardCountry === country;
    const unitMatch = !unit || cardUnits.includes(unit);

    let price;
    if (unit) {
      const unitPriceAttr = card.getAttribute(`data-price-${unit}`);
      price = unitPriceAttr ? parseInt(unitPriceAttr, 10) : null;
    } else {
      price = parseInt(card.dataset.from || "0", 10);
    }

    const budgetMatch = price !== null && price <= maxBudget;

    const show = countryMatch && unitMatch && budgetMatch;

    card.style.display = show ? "" : "none";

    if (show) totalVisible++;

  });

  const noResults = document.getElementById("no-results");
  if (noResults) noResults.style.display = totalVisible ? "none" : "block";

}

window.applyFiltersDevelopments = applyFiltersDevelopments;

// ── Lifestyle page filters (pill + country) ──
function initLifestyleFilters() {

  const cards = document.querySelectorAll('.dev-card');
  if (!cards.length) return; // not on the lifestyle page, do nothing

  const countryEl = document.getElementById('f-country');
  const pills = document.querySelectorAll('.pill');
  const noResults = document.getElementById('no-results');

  let activeLifestyle = '';

  function apply() {

    const country = countryEl ? countryEl.value : '';
    let totalVisible = 0;

    cards.forEach(card => {

      const cardCountry = card.dataset.country || '';
      const cardLifestyles = (card.dataset.lifestyle || '').split(',').map(s => s.trim());

      const countryMatch = !country || cardCountry === country;
      const lifestyleMatch = !activeLifestyle || cardLifestyles.includes(activeLifestyle);

      const show = countryMatch && lifestyleMatch;

      card.style.display = show ? '' : 'none';

      if (show) totalVisible++;

    });

    if (noResults) noResults.style.display = totalVisible ? 'none' : 'block';

  }

  if (countryEl) countryEl.addEventListener('change', apply);

  pills.forEach(pill => {
    pill.addEventListener('click', () => {
      pills.forEach(p => p.classList.remove('active'));
      pill.classList.add('active');
      activeLifestyle = pill.dataset.lifestyle || '';
      apply();
    });
  });

  apply();

}

document.addEventListener('DOMContentLoaded', initLifestyleFilters);

// ── Search page filters (country + unit + setting + amenity) ──
function initSearchFilters() {

  const settingEl = document.getElementById('f-setting');
  if (!settingEl) return; // not on the search page, do nothing

  const countryEl = document.getElementById('f-country');
  const unitEl = document.getElementById('f-unit');
  const amenityEl = document.getElementById('f-amenity');
  const cards = document.querySelectorAll('#grid .card');
  const noResults = document.getElementById('no-results');
  const countNum = document.getElementById('count-num');

  function apply() {

    const country = countryEl ? countryEl.value : '';
    const unit = unitEl ? unitEl.value : '';
    const setting = settingEl.value;
    const amenity = amenityEl ? amenityEl.value : '';

    let totalVisible = 0;

    cards.forEach(card => {

      const cardCountry = card.dataset.country || '';
      const cardUnits = (card.dataset.units || '').split(',').map(s => s.trim());
      const cardSettings = (card.dataset.setting || '').split(',').map(s => s.trim());
      const cardAmenities = (card.dataset.amenities || '').split(',').map(s => s.trim());

      const countryMatch = !country || cardCountry === country;
      const unitMatch = !unit || cardUnits.includes(unit);
      const settingMatch = !setting || cardSettings.includes(setting);
      const amenityMatch = !amenity || cardAmenities.includes(amenity);

      const show = countryMatch && unitMatch && settingMatch && amenityMatch;

      card.style.display = show ? '' : 'none';

      if (show) totalVisible++;

    });

    if (noResults) noResults.style.display = totalVisible ? 'none' : 'block';
    if (countNum) countNum.textContent = totalVisible;

  }

  if (countryEl) countryEl.addEventListener('change', apply);
  if (unitEl) unitEl.addEventListener('change', apply);
  settingEl.addEventListener('change', apply);
  if (amenityEl) amenityEl.addEventListener('change', apply);

  window.clearFilters = function () {
    if (countryEl) countryEl.value = '';
    if (unitEl) unitEl.value = '';
    settingEl.value = '';
    if (amenityEl) amenityEl.value = '';
    apply();
  };

  apply();

}

document.addEventListener('DOMContentLoaded', initSearchFilters);