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

// Ensure currentLang is initialized
let currentLang = 'en';

// Define the function globally so onclick="toggleLanguage()" can find it
window.toggleLanguage = function() {
    currentLang = currentLang === 'en' ? 'hi' : 'en';

    const langBtn = document.getElementById('lang-toggle');
    if (langBtn) {
        langBtn.innerText = currentLang === 'en' ? 'हिन्दी' : 'English';
    }

    // Update all elements with data-key attribute
    document.querySelectorAll('[data-key]').forEach(elem => {
        const key = elem.getAttribute('data-key');
        if (translations[key] && translations[key][currentLang]) {
            elem.innerText = translations[key][currentLang];
        }
    });
};

function startWebsite() {
    const overlay = document.getElementById('inauguration-overlay');
    const music = document.getElementById('bg-music');

    // 1. Play the music
    if (music) {
        music.play().catch(error => console.log("Music play blocked by browser:", error));
    }

    // 2. Hide the overlay
    overlay.classList.add('hidden-overlay');

    // Optional: After a few seconds, stop the music or fade it out
    // setTimeout(() => { music.pause(); }, 30000);
}
function playInauguration() {
    const video = document.getElementById('inauguration-video');
    const music = document.getElementById('bg-music');
    const welcomeScreen = document.getElementById('welcome-screen');
    const overlay = document.getElementById('video-overlay');

    // 1. Hide the Welcome Button
    welcomeScreen.style.opacity = '0';

    // 2. Show and Play Video
    video.style.display = 'block';
    video.play();

    // 3. Play Music
    if (music) {
        music.play();
    }

    // 4. When video finishes, fade out the overlay
    video.onended = function() {
        overlay.classList.add('fade-out');

        // Remove from DOM after fade completes so users can interact with home page
        setTimeout(() => {
            overlay.style.display = 'none';
        }, 1500);
    };
}
