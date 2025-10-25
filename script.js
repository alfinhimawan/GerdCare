document.addEventListener("DOMContentLoaded", function () {
  document.querySelectorAll(".faq-question").forEach((question) => {
    question.addEventListener("click", () => {
      const faqItem = question.parentElement;
      const isActive = faqItem.classList.contains("active");

      document.querySelectorAll(".faq-item").forEach((item) => {
        item.classList.remove("active");
      });

      if (!isActive) {
        faqItem.classList.add("active");
      }
    });
  });

  const sections = document.querySelectorAll("section[id]");
  const navItems = document.querySelectorAll(".nav-item");

  function onScroll() {
    const scrollY = window.pageYOffset;

    sections.forEach((section) => {
      const sectionHeight = section.offsetHeight;
      const sectionTop = section.offsetTop - 100;
      const sectionId = section.getAttribute("id");

      if (scrollY > sectionTop && scrollY <= sectionTop + sectionHeight) {
        navItems.forEach((item) => item.classList.remove("active"));

        const currentNav = document.querySelector(
          `.nav-item a[href="#${sectionId}"]`
        );
        if (currentNav) {
          currentNav.parentElement.classList.add("active");
        }
      }
    });
  }
  window.addEventListener("scroll", onScroll);

  onScroll();

  const mobileMenuBtn = document.querySelector(".mobile-menu-btn");
  const navLinks = document.querySelector(".nav-links");
  let isMenuOpen = false;

  if (mobileMenuBtn) {
    mobileMenuBtn.addEventListener("click", () => {
      isMenuOpen = !isMenuOpen;
      navLinks.style.display = isMenuOpen ? "flex" : "none";
      mobileMenuBtn.classList.toggle("active");

      // Animate bars
      const bars = mobileMenuBtn.querySelectorAll(".bar");
      if (isMenuOpen) {
        bars[0].style.transform = "rotate(45deg) translate(5px, 5px)";
        bars[1].style.opacity = "0";
        bars[2].style.transform = "rotate(-45deg) translate(5px, -5px)";
      } else {
        bars[0].style.transform = "none";
        bars[1].style.opacity = "1";
        bars[2].style.transform = "none";
      }
    });
  }
  const diagnosisButton = document.getElementById("diagnosisButton");

  diagnosisButton.addEventListener("click", function () {
    const diagnosisSection = document.getElementById("diagnosis");
    diagnosisSection.scrollIntoView({ behavior: "smooth" });
  });

  const header = document.querySelector(".site-header");
  let lastScroll = 0;

  window.addEventListener("scroll", function () {
    const currentScroll = window.pageYOffset;

    if (currentScroll > 0) {
      header.style.boxShadow = "0 2px 10px rgba(0,0,0,0.1)";
    } else {
      header.style.boxShadow = "0 1px 3px rgba(0,0,0,0.12)";
    }

    lastScroll = currentScroll;
  });

  document.querySelectorAll('a[href^="#"]').forEach((anchor) => {
    anchor.addEventListener("click", function (e) {
      e.preventDefault();
      const targetId = this.getAttribute("href");
      const targetElement = document.querySelector(targetId);

      if (targetElement) {
        targetElement.scrollIntoView({
          behavior: "smooth",
        });
      }
    });
  });
});
