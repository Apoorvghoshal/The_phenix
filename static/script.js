// HERO CAROUSEL

document.addEventListener("DOMContentLoaded", function () {
  const slides = document.querySelectorAll(".slide");
  const nextBtn = document.querySelector(".carousel-btn.next");
  const prevBtn = document.querySelector(".carousel-btn.prev");

  let currentIndex = 0;
  let autoSlideTimer;

  function showSlide(index) {
    slides.forEach((slide, i) => {
      slide.classList.toggle("active", i === index);
    });
  }

  function nextSlide() {
    currentIndex = (currentIndex + 1) % slides.length;
    showSlide(currentIndex);
  }

  function prevSlide() {
    currentIndex =
      (currentIndex - 1 + slides.length) % slides.length;
    showSlide(currentIndex);
  }

  function startAutoSlide() {
    autoSlideTimer = setInterval(nextSlide, 4000);
  }

  function resetAutoSlide() {
    clearInterval(autoSlideTimer);
    startAutoSlide();
  }

  nextBtn.addEventListener("click", function () {
    nextSlide();
    resetAutoSlide();
  });

  prevBtn.addEventListener("click", function () {
    prevSlide();
    resetAutoSlide();
  });

  // INIT
  showSlide(currentIndex);
  startAutoSlide();
});



// PROGRAM CAROUSEL
let progIndex = 0;
const progSlides = document.querySelectorAll(".program-slide");

setInterval(() => {
  progSlides[progIndex].classList.remove("active");
  progIndex = (progIndex + 1) % progSlides.length;
  progSlides[progIndex].classList.add("active");
}, 3500);

function toggleMenu() {
  document.getElementById("nav-menu").classList.toggle("show");
}


document.addEventListener("DOMContentLoaded", () => {
  const cards = document.querySelectorAll(".text-card");

  const observer = new IntersectionObserver(
    entries => {
      entries.forEach(entry => {
        if (entry.isIntersecting) {
          entry.target.classList.add("active");
        } else {
          entry.target.classList.remove("active");
        }
      });
    },
    {
      root: null,
      threshold: 0.6   // card must be ~60% visible (near center)
    }
  );

  cards.forEach(card => observer.observe(card));
});

const translations = {
    "home-link": { "en": "Home", "hi": "होम" },
    "about-link": { "en": "About", "hi": "हमारे बारे में" },
    "directory-link": { "en": "Community Directory", "hi": "समाज निर्देशिका" },
    "contact-link": { "en": "Contact", "hi": "संपर्क" },
    "hero-title": { "en": "Khandelwal Samaj Raipur", "hi": "खंडेलवाल समाज रायपुर" }
};

let currentLang = 'en';

function toggleLanguage() {
    currentLang = currentLang === 'en' ? 'hi' : 'en';

    // Update button text
    document.getElementById('lang-toggle').innerText = currentLang === 'en' ? 'हिन्दी' : 'English';

    // Update all elements with data-key attribute
    document.querySelectorAll('[data-key]').forEach(elem => {
        const key = elem.getAttribute('data-key');
        if (translations[key]) {
            elem.innerText = translations[key][currentLang];
        }
    });
}