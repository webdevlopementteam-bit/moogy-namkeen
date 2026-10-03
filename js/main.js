// ===============================
// PRELOADER
// ===============================

const moogyLoader = document.getElementById("moogyLoader");

window.addEventListener("load", () => {
    setTimeout(() => {
        if (moogyLoader) moogyLoader.classList.add("hidden");
    }, 550);
});

// safety net – agar load event miss ho jaye
setTimeout(() => {
    if (moogyLoader) moogyLoader.classList.add("hidden");
}, 4000);



// ===============================
// MOBILE MENU
// ===============================

const menuToggle = document.querySelector(".menu-toggle");
const mainNav = document.querySelector(".main-nav");
const navLinks = document.querySelectorAll(".main-nav a");

if (menuToggle && mainNav) {

    menuToggle.addEventListener("click", () => {
        mainNav.classList.toggle("mobile-active");
        menuToggle.classList.toggle("active");
        document.body.classList.toggle("menu-open");
    });

}


navLinks.forEach((link) => {

    link.addEventListener("click", () => {

        if (window.innerWidth <= 800) {
            mainNav.classList.remove("mobile-active");
            menuToggle.classList.remove("active");
            document.body.classList.remove("menu-open");
        }

    });

});



// ===============================
// HEADER SHADOW + SCROLL PROGRESS
// ===============================

const header = document.querySelector(".site-header");
const progressBar = document.getElementById("scrollProgress");
const toTopBtn = document.getElementById("toTopBtn");


function onScrollUI() {

    const scrolled = window.scrollY;

    if (header) {
        header.classList.toggle("scrolled", scrolled > 20);
    }

    if (progressBar) {

        const docHeight =
            document.documentElement.scrollHeight - window.innerHeight;

        const percent = docHeight > 0 ? (scrolled / docHeight) * 100 : 0;

        progressBar.style.width = percent + "%";

    }

    if (toTopBtn) {
        toTopBtn.classList.toggle("show", scrolled > 600);
    }

}


window.addEventListener("scroll", onScrollUI, { passive: true });
window.addEventListener("load", onScrollUI);


if (toTopBtn) {

    toTopBtn.addEventListener("click", () => {
        window.scrollTo({ top: 0, behavior: "smooth" });
    });

}



// ===============================
// SCROLL REVEAL
// ===============================

const revealItems = document.querySelectorAll("[data-reveal]");

if ("IntersectionObserver" in window && revealItems.length) {

    const revealObserver = new IntersectionObserver((entries) => {

        entries.forEach((entry) => {

            if (entry.isIntersecting) {
                entry.target.classList.add("revealed");
                revealObserver.unobserve(entry.target);
            }

        });

    }, {
        threshold: 0.12,
        rootMargin: "0px 0px -60px 0px"
    });


    // stagger cards inside a grid
    document.querySelectorAll(
        ".products-grid, .why-grid, .voices-grid, .stats-wrapper, .moments-grid"
    ).forEach((grid) => {

        grid.querySelectorAll("[data-reveal]").forEach((item, i) => {
            item.style.transitionDelay = (i % 8) * 0.07 + "s";
        });

    });


    revealItems.forEach((item) => revealObserver.observe(item));

} else {

    revealItems.forEach((item) => item.classList.add("revealed"));

}



// ===============================
// COUNT UP NUMBERS
// ===============================

const counters = document.querySelectorAll(".count-up");

if ("IntersectionObserver" in window && counters.length) {

    const countObserver = new IntersectionObserver((entries) => {

        entries.forEach((entry) => {

            if (!entry.isIntersecting) return;

            const el = entry.target;

            const target = parseInt(el.dataset.target, 10) || 0;
            const suffix = el.dataset.suffix || "";

            const duration = 1400;
            const startTime = performance.now();


            function tick(now) {

                const progress = Math.min((now - startTime) / duration, 1);

                // ease-out
                const eased = 1 - Math.pow(1 - progress, 3);

                el.textContent =
                    Math.round(target * eased) + suffix;

                if (progress < 1) {
                    requestAnimationFrame(tick);
                }

            }

            requestAnimationFrame(tick);

            countObserver.unobserve(el);

        });

    }, { threshold: 0.5 });


    counters.forEach((el) => countObserver.observe(el));

}



// ===============================
// FAQ ACCORDION
// ===============================

const faqItems = document.querySelectorAll(".faq-item");

faqItems.forEach((item) => {

    const question = item.querySelector(".faq-question");
    const answer = item.querySelector(".faq-answer");

    if (!question || !answer) return;


    question.addEventListener("click", () => {

        const isOpen = item.classList.contains("open");


        // sabhi band karo
        faqItems.forEach((other) => {

            other.classList.remove("open");

            const otherAnswer = other.querySelector(".faq-answer");
            if (otherAnswer) otherAnswer.style.maxHeight = null;

        });


        // clicked wala khol do
        if (!isOpen) {
            item.classList.add("open");
            answer.style.maxHeight = answer.scrollHeight + "px";
        }

    });

});


// pehla FAQ by default open
if (faqItems.length) {

    const first = faqItems[0];
    const firstAnswer = first.querySelector(".faq-answer");

    first.classList.add("open");

    window.addEventListener("load", () => {
        if (firstAnswer) {
            firstAnswer.style.maxHeight = firstAnswer.scrollHeight + "px";
        }
    });

}



// ===============================
// FUN ZONE – SNACK PICKER
// ===============================

const spinnerReel = document.getElementById("spinnerReel");
const spinBtn = document.getElementById("spinBtn");
const spinnerResult = document.getElementById("spinnerResult");


const SNACKS = [
    { name: "Kur Karare",       img: "images/kurkarare.png" },
    { name: "Rings",            img: "images/rings.png" },
    { name: "Chaat Chokdi",     img: "images/chaat-chokdi.png" },
    { name: "Cheese Balls",     img: "images/cheese-balls.png" },
    { name: "Jumping Balls",    img: "images/jumping-balls.png" },
    { name: "Nimbu Bhujia",     img: "images/nimbu-bhujia.png" },
    { name: "Masala Idli",      img: "images/idli.png" },
    { name: "Tapatap Kurmure",  img: "images/tapatap.png" },
    { name: "Badam Pakoda",     img: "images/badam-pakoda.png" },
    { name: "Chatori",          img: "images/chatori.png" },
    { name: "Momo",             img: "images/momo.png" },
    { name: "Sab Kuch",         img: "images/sab-kuch.png" }
];


const CHEERS = [
    "Aaj toh banta hai —",
    "Moogy says try",
    "Perfect pick for today —",
    "Your snack of the day —"
];


if (spinnerReel && spinBtn && spinnerResult) {

    // reel banao
    SNACKS.forEach((snack) => {

        const slot = document.createElement("div");
        slot.className = "spinner-slot";

        slot.innerHTML =
            '<img src="' + snack.img + '" alt="' + snack.name + '">' +
            "<b>" + snack.name + "</b>";

        spinnerReel.appendChild(slot);

    });


    let spinning = false;


    spinBtn.addEventListener("click", () => {

        if (spinning) return;

        spinning = true;

        spinBtn.disabled = true;

        spinnerResult.classList.remove("win");
        spinnerResult.textContent = "Picking…";


        const winner = Math.floor(Math.random() * SNACKS.length);

        // kitne steps chalne hain
        const totalSteps = SNACKS.length + winner;

        let step = 0;
        let delay = 65;


        function move() {

            const index = step % SNACKS.length;

            spinnerReel.style.transform =
                "translateX(-" + index * 100 + "%)";

            step++;


            if (step > totalSteps) {

                // finish
                spinning = false;
                spinBtn.disabled = false;

                const cheer =
                    CHEERS[Math.floor(Math.random() * CHEERS.length)];

                spinnerResult.textContent =
                    cheer + " " + SNACKS[winner].name + "!";

                spinnerResult.classList.add("win");

                return;

            }


            // aakhri kuch steps mein slow down
            if (step > totalSteps - 6) {
                delay += 55;
            }

            setTimeout(move, delay);

        }

        move();

    });

}



// ===============================
// FEATURED PRODUCT SLIDER
// ===============================

const slider = document.querySelector(".featured-slider");
const nextBtn = document.querySelector(".next-btn");
const prevBtn = document.querySelector(".prev-btn");

if (slider) {

    // -------------------------------
    // ORIGINAL PRODUCT CARDS
    // -------------------------------

    const originalCards = Array.from(
        slider.querySelectorAll(".product-card")
    );

    const totalCards = originalCards.length;


    // -------------------------------
    // CREATE CLONES FOR INFINITE LOOP
    // -------------------------------

    if (totalCards > 1 && !slider.querySelector(".slider-clone")) {

        // END CLONES

        originalCards.forEach((card) => {

            const clone = card.cloneNode(true);
            clone.classList.add("slider-clone");
            clone.setAttribute("aria-hidden", "true");

            slider.appendChild(clone);

        });


        // START CLONES

        originalCards
            .slice()
            .reverse()
            .forEach((card) => {

                const clone = card.cloneNode(true);
                clone.classList.add("slider-clone");
                clone.setAttribute("aria-hidden", "true");

                slider.prepend(clone);

            });

    }


    // -------------------------------
    // GET CARD WIDTH
    // -------------------------------

    function getSlideWidth() {

        const card = slider.querySelector(".product-card");

        if (!card) return 0;

        const styles = window.getComputedStyle(slider);
        const gap = parseFloat(styles.gap) || 0;

        return card.offsetWidth + gap;

    }


    // -------------------------------
    // SET INITIAL POSITION
    // -------------------------------

    function setInitialPosition() {

        const slideWidth = getSlideWidth();

        if (!slideWidth) return;

        slider.style.scrollBehavior = "auto";

        slider.scrollLeft = slideWidth * totalCards;

        requestAnimationFrame(() => {
            slider.style.scrollBehavior = "smooth";
        });

    }


    window.addEventListener("load", () => {
        setTimeout(setInitialPosition, 150);
    });


    // ===============================
    // AUTO SLIDER
    // ===============================

    let autoSlide = null;
    let isDragging = false;


    function stopAutoSlide() {

        if (autoSlide) {
            clearInterval(autoSlide);
            autoSlide = null;
        }

    }


    function nextSlide() {

        const slideWidth = getSlideWidth();
        if (!slideWidth) return;

        slider.scrollBy({ left: slideWidth, behavior: "smooth" });

    }


    function prevSlide() {

        const slideWidth = getSlideWidth();
        if (!slideWidth) return;

        slider.scrollBy({ left: -slideWidth, behavior: "smooth" });

    }


    function startAutoSlide() {

        stopAutoSlide();

        autoSlide = setInterval(() => {

            if (!isDragging && !document.hidden) {
                nextSlide();
            }

        }, 3500);

    }


    // -------------------------------
    // NEXT / PREVIOUS BUTTONS
    // -------------------------------

    if (nextBtn) {

        nextBtn.addEventListener("click", () => {
            stopAutoSlide();
            nextSlide();
            setTimeout(startAutoSlide, 1000);
        });

    }


    if (prevBtn) {

        prevBtn.addEventListener("click", () => {
            stopAutoSlide();
            prevSlide();
            setTimeout(startAutoSlide, 1000);
        });

    }


    // ===============================
    // INFINITE LOOP
    // ===============================

    let scrollTimer = null;
    let isAdjusting = false;


    function checkInfiniteLoop() {

        if (isAdjusting) return;

        const slideWidth = getSlideWidth();
        if (!slideWidth) return;

        const oneSetWidth = slideWidth * totalCards;


        // END CLONES

        if (slider.scrollLeft >= (oneSetWidth * 2) - (slideWidth / 2)) {

            isAdjusting = true;

            slider.style.scrollBehavior = "auto";
            slider.scrollLeft = slider.scrollLeft - oneSetWidth;

            requestAnimationFrame(() => {
                slider.style.scrollBehavior = "smooth";
                isAdjusting = false;
            });

        }


        // START CLONES

        else if (slider.scrollLeft <= slideWidth / 2) {

            isAdjusting = true;

            slider.style.scrollBehavior = "auto";
            slider.scrollLeft = slider.scrollLeft + oneSetWidth;

            requestAnimationFrame(() => {
                slider.style.scrollBehavior = "smooth";
                isAdjusting = false;
            });

        }

    }


    slider.addEventListener("scroll", () => {

        clearTimeout(scrollTimer);

        scrollTimer = setTimeout(checkInfiniteLoop, 80);

    });


    // ===============================
    // MOUSE CLICK + DRAG
    // ===============================

    let isMouseDown = false;
    let startX = 0;
    let startScrollLeft = 0;


    slider.addEventListener("mousedown", (e) => {

        if (e.button !== 0) return;

        isMouseDown = true;
        isDragging = true;

        startX = e.pageX;
        startScrollLeft = slider.scrollLeft;

        slider.classList.add("dragging");

        stopAutoSlide();

    });


    window.addEventListener("mousemove", (e) => {

        if (!isMouseDown) return;

        const distance = e.pageX - startX;

        if (Math.abs(distance) > 3) {
            slider.scrollLeft = startScrollLeft - distance;
        }

    });


    function stopMouseDrag() {

        if (!isMouseDown) return;

        isMouseDown = false;
        isDragging = false;

        slider.classList.remove("dragging");

        checkInfiniteLoop();

        setTimeout(startAutoSlide, 1000);

    }


    window.addEventListener("mouseup", stopMouseDrag);


    slider.addEventListener("dragstart", (e) => e.preventDefault());


    // ===============================
    // PAUSE ON HOVER
    // ===============================

    slider.addEventListener("mouseenter", () => {
        if (!isMouseDown) stopAutoSlide();
    });


    slider.addEventListener("mouseleave", () => {

        if (!isMouseDown) {
            setTimeout(startAutoSlide, 500);
        }

    });


    // ===============================
    // TOUCH SUPPORT
    // ===============================

    slider.addEventListener("touchstart", stopAutoSlide, { passive: true });


    slider.addEventListener("touchend", () => {

        checkInfiniteLoop();
        setTimeout(startAutoSlide, 1000);

    }, { passive: true });


    // ===============================
    // RESIZE
    // ===============================

    let resizeTimer;

    window.addEventListener("resize", () => {

        clearTimeout(resizeTimer);
        resizeTimer = setTimeout(setInitialPosition, 300);

    });


    startAutoSlide();

}



// ===============================
// ACTIVE NAVIGATION
// ===============================

const sections = document.querySelectorAll("section[id]");


function updateActiveLink() {

    let currentSection = "";

    sections.forEach((section) => {

        const sectionTop = section.offsetTop - 160;
        const sectionHeight = section.offsetHeight;

        if (
            window.scrollY >= sectionTop &&
            window.scrollY < sectionTop + sectionHeight
        ) {
            currentSection = section.getAttribute("id");
        }

    });


    navLinks.forEach((link) => {

        link.classList.remove("active");

        if (link.getAttribute("href") === "#" + currentSection) {
            link.classList.add("active");
        }

    });

}


window.addEventListener("scroll", updateActiveLink, { passive: true });
window.addEventListener("load", updateActiveLink);



// ===============================
// CONTACT FORM (WEB3FORMS)
// Sends the same enquiry to 2 inboxes by
// posting once per Web3Forms access key.
// ===============================

const WEB3FORMS_ACCESS_KEYS = [
    "b0300eae-c17f-4dac-9414-82eefe7a21d8",
    "bfc320f9-fc72-4deb-be7f-d6c872250dd8",
];

const WEB3FORMS_SUBJECT = "Moogy Namkeen New Enquiry";
const THANK_YOU_PAGE = "thank-you.html";

const contactForm = document.getElementById("contactForm");

if (contactForm) {

    const formStatus = document.getElementById("formStatus");
    const submitBtn = contactForm.querySelector(".contact-submit-btn");
    const submitBtnLabel = submitBtn.innerHTML;

    contactForm.addEventListener("submit", function (e) {

        e.preventDefault();

        // honeypot: if filled, silently drop (bot submission)
        if (contactForm.botcheck && contactForm.botcheck.checked) {
            return;
        }

        const formData = new FormData(contactForm);

        submitBtn.disabled = true;
        submitBtn.innerHTML = "Sending...";
        formStatus.textContent = "";
        formStatus.className = "form-status";

        const submissions = WEB3FORMS_ACCESS_KEYS.map((key) => {

            const payload = Object.fromEntries(formData);
            payload.access_key = key;
            payload.subject = WEB3FORMS_SUBJECT;

            return fetch("https://api.web3forms.com/submit", {
                method: "POST",
                headers: {
                    "Content-Type": "application/json",
                    "Accept": "application/json"
                },
                body: JSON.stringify(payload)
            }).then((res) => res.json());

        });

        Promise.all(submissions)
            .then((results) => {

                const allSuccess = results.every((r) => r.success);

                if (allSuccess) {
                    contactForm.reset();
                    window.location.href = THANK_YOU_PAGE;
                } else {
                    formStatus.textContent = "Something went wrong. Please try again.";
                    formStatus.classList.add("form-status-error");
                }

            })
            .catch(() => {

                formStatus.textContent = "Network error. Please try again.";
                formStatus.classList.add("form-status-error");

            })
            .finally(() => {

                submitBtn.disabled = false;
                submitBtn.innerHTML = submitBtnLabel;

            });

    });

}