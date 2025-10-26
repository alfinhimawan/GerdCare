document.addEventListener("DOMContentLoaded", function () {
  document.querySelectorAll(".faq-category").forEach((category) => {
    category.addEventListener("click", () => {
      document.querySelectorAll(".faq-category").forEach((cat) => {
        cat.classList.remove("active");
      });

      category.classList.add("active");

      document.querySelectorAll(".faq-group").forEach((group) => {
        group.classList.remove("active");
      });

      const targetCategory = category.getAttribute("data-category");
      const targetGroup = document.querySelector(
        `.faq-group[data-category="${targetCategory}"]`
      );
      if (targetGroup) {
        targetGroup.classList.add("active");
      }
    });
  });

  document.querySelectorAll(".nav-pill").forEach((pill) => {
    pill.addEventListener("click", () => {
      document.querySelectorAll(".nav-pill").forEach((p) => {
        p.classList.remove("active");
      });

      pill.classList.add("active");

      document.querySelectorAll(".faq-group").forEach((group) => {
        group.classList.remove("active");
      });

      const targetCategory = pill.getAttribute("data-category");
      const targetGroup = document.querySelector(
        `.faq-group[data-category="${targetCategory}"]`
      );
      if (targetGroup) {
        targetGroup.classList.add("active");
      }
    });
  });

  document.querySelectorAll(".question-wrapper").forEach((question) => {
    question.addEventListener("click", () => {
      const card = question.closest(".faq-card");
      if (!card) return;

      const parentGroup = card.closest(".faq-group");
      if (parentGroup) {
        parentGroup.querySelectorAll(".faq-card").forEach((otherCard) => {
          if (otherCard !== card) {
            otherCard.classList.remove("active");
            const otherWrapper = otherCard.querySelector(".answer-wrapper");
            if (otherWrapper) {
              otherWrapper.style.maxHeight = "0px";
              otherWrapper.style.visibility = "hidden";
            }
          }
        });
      }

      card.classList.toggle("active");
      
      const answerWrapper = card.querySelector(".answer-wrapper");
      if (answerWrapper) {
        if (card.classList.contains("active")) {
          answerWrapper.style.visibility = "visible";
          answerWrapper.style.maxHeight =
            answerWrapper.scrollHeight + 100 + "px";
        } else {
          answerWrapper.style.maxHeight = "0px";
          setTimeout(() => {
            if (!card.classList.contains("active")) {
              answerWrapper.style.visibility = "hidden";
            }
          }, 400);
        }
      }
    });
  });

  document.querySelectorAll(".helpful-btn").forEach((btn) => {
    btn.addEventListener("click", (e) => {
      e.stopPropagation(); 

      const buttons = btn
        .closest(".helpful-buttons")
        .querySelectorAll(".helpful-btn");
      buttons.forEach((b) => b.classList.remove("active"));
      btn.classList.add("active");
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
  const navList = document.querySelector(".nav-list");
  let isMenuOpen = false;

  function closeMobileMenu() {
    isMenuOpen = false;
    navList.classList.remove("active");
    mobileMenuBtn.classList.remove("active");
    const bars = mobileMenuBtn.querySelectorAll(".bar");
    bars[0].style.transform = "none";
    bars[1].style.opacity = "1";
    bars[2].style.transform = "none";
  }

  if (mobileMenuBtn) {
    mobileMenuBtn.addEventListener("click", () => {
      isMenuOpen = !isMenuOpen;
      navList.classList.toggle("active");
      mobileMenuBtn.classList.toggle("active");
      toggleBodyScroll(isMenuOpen);

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

  function toggleBodyScroll(disable) {
    document.body.style.overflow = disable ? "hidden" : "";
  }

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
        if (window.innerWidth <= 768) {
          closeMobileMenu();
        }
      }
    });
  });

  document.addEventListener("click", (e) => {
    if (
      isMenuOpen &&
      !e.target.closest(".nav-list") &&
      !e.target.closest(".mobile-menu-btn")
    ) {
      closeMobileMenu();
    }
  });

  window.addEventListener("resize", () => {
    if (window.innerWidth > 768 && isMenuOpen) {
      closeMobileMenu();
    }
  });
});
