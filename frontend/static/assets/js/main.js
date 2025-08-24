(function (window, document, $, undefined) {
    "use strict";

    var eduJs = {
        i: function (e) {
            eduJs.d();
            eduJs.methods();
        },

        d: function (e) {
            (this._window = $(window)),
            (this._document = $(document)),
            (this._body = $("body")),
            (this._html = $("html")),
            (this.sideNav = $(".rbt-search-dropdown"));
        },
        methods: function (e) {
            eduJs.salActive();
            eduJs.menuCurrentLink();
            eduJs.eduSwiperActive();
            eduJs.eduBgCardHover();
            eduJs.magnigyPopup();
            eduJs.counterUp();
            eduJs.pricingPlan();
            eduJs.courseView();
            eduJs.stickyHeader();
            eduJs.masonryActivation();
            eduJs._clickDoc();
            eduJs.wowActivation();
            eduJs.radialProgress();
            eduJs.marqueImage();
            eduJs.popupMobileMenu();
            eduJs.headerSticky();
            eduJs.qtyBtn();
            eduJs.checkoutPage();
            eduJs.offCanvas();
            eduJs.onePageNav();
            eduJs.transparentHeader();
            eduJs.categoryMenuHover();
            eduJs.cartSidenav();
            eduJs.filterClickButton();
            eduJs.selectPicker();
            eduJs.headerTopActivation();
            eduJs.magnificPopupActivation();
            eduJs.showMoreBtn();
            eduJs.sidebarVideoHidden();
            eduJs.courseActionBottom();
            eduJs.topbarExpend();
            eduJs.categoryOffcanvas();
            eduJs.autoslidertab();
            eduJs.moveAnimation();
            eduJs.contactForm();
            eduJs.player();
            eduJs.quizAns();
            eduJs.lessonAccor();
            // eduJs.unloadImage(); // This line caused the original bug and is safely commented out.
            eduJs.searchValue();
            eduJs.lessonToggle();
            eduJs.categoryMenuHover2();
            eduJs.typeField(); 
            eduJs.countDown(); 
            eduJs.editor(); 
            eduJs.toggleModal(); 
            eduJs.dnd(); 
            eduJs.multiStepForm(); 
            eduJs.cursorFollow(); 
            eduJs.lmsInit();
        },
        dnd: function () {
            const dnd1 = document.getElementById("dnd1");
            const dnd2 = document.getElementById("dnd2");
            if (dnd1) { new Sortable(dnd1, { animation: 150 }); }
            if (dnd2) { new Sortable(dnd2, { animation: 150 }); }
        },
        editor: function initializeJoditEditors() {
            Jodit.plugins.add("stat", function (editor) {
                const statusbar = document.createElement("div");
                statusbar.style.backgroundColor = "#fff";
                statusbar.style.fontSize = "16px";
                statusbar.style.padding = "1px 4px";
                function calcStat() {
                    var text = Jodit.modules.Helpers.trim(editor.editor.innerText),
                        wordCount = text.split(/[\s\n\r\t]+/).filter(function (value) { return value; }).length,
                        charCount = text.replace(/[\s\n\r\t]+/, "").length;
                    statusbar.innerText = "words: " + wordCount + " chars: " + charCount;
                }
                editor.events
                    .on("change afterInit", editor.async.debounce(calcStat, 100))
                    .on("afterInit", function () {
                        editor.container.appendChild(statusbar);
                    });
            });
            const editor1Element = document.querySelector("#editor1");
            const editor2Element = document.querySelector("#editor2");
            const editor3Element = document.querySelector("#editor3");
            if (editor1Element) { Jodit.make(editor1Element); }
            if (editor2Element) { Jodit.make(editor2Element); }
            if (editor3Element) { Jodit.make(editor3Element); }
        },
        multiStepForm: function () {
            document.addEventListener('DOMContentLoaded', () => {
                const DOMstrings = {
                    stepsBtnClass: 'multisteps-form__progress-btn',
                    stepsBtns: document.querySelectorAll('.multisteps-form__progress-btn'),
                    stepsBar: document.querySelector('.multisteps-form__progress'),
                    stepsForm: document.querySelector('.multisteps-form__form'),
                    stepsFormTextareas: document.querySelectorAll('.multisteps-form__textarea'),
                    stepFormPanelClass: 'multisteps-form__panel',
                    stepFormPanels: document.querySelectorAll('.multisteps-form__panel'),
                    stepPrevBtnClass: 'rbt-step-btn-prev',
                    stepNextBtnClass: 'rbt-step-btn-next',
                };
                const removeClasses = (elemSet, className) => {
                    elemSet.forEach(elem => { elem.classList.remove(className); });
                };
                const findParent = (elem, parentClass) => {
                    let currentNode = elem;
                    while (!currentNode.classList.contains(parentClass)) {
                        currentNode = currentNode.parentNode;
                    }
                    return currentNode;
                };
                const getActiveStep = elem => { return Array.from(DOMstrings.stepsBtns).indexOf(elem); };
                const setActiveStep = activeStepNum => {
                    removeClasses(DOMstrings.stepsBtns, 'rbt-active');
                    DOMstrings.stepsBtns.forEach((elem, index) => {
                        if (index <= activeStepNum) {
                            elem.classList.add('rbt-active');
                        }
                    });
                };
                const getActivePanel = () => {
                    let activePanel;
                    DOMstrings.stepFormPanels.forEach(elem => { if (elem.classList.contains('rbt-active')) { activePanel = elem; } });
                    return activePanel;
                };
                const setActivePanel = activePanelNum => {
                    removeClasses(DOMstrings.stepFormPanels, 'rbt-active');
                    DOMstrings.stepFormPanels.forEach((elem, index) => { if (index === activePanelNum) { elem.classList.add('rbt-active'); } });
                };
                if (DOMstrings.stepsBar) {
                    DOMstrings.stepsBar.addEventListener('click', e => {
                        const eventTarget = e.target;
                        if (!eventTarget.classList.contains(DOMstrings.stepsBtnClass)) { return; }
                        const activeStep = getActiveStep(eventTarget);
                        setActiveStep(activeStep);
                        setActivePanel(activeStep);
                    });
                }
                if (DOMstrings.stepsForm) {
                    DOMstrings.stepsForm.addEventListener('click', e => {
                        const eventTarget = e.target;
                        if (!(eventTarget.classList.contains(DOMstrings.stepPrevBtnClass) || eventTarget.classList.contains(DOMstrings.stepNextBtnClass))) { return; }
                        const activePanel = findParent(eventTarget, DOMstrings.stepFormPanelClass);
                        let activePanelNum = Array.from(DOMstrings.stepFormPanels).indexOf(activePanel);
                        if (eventTarget.classList.contains(DOMstrings.stepPrevBtnClass)) {
                            activePanelNum--;
                        } else {
                            activePanelNum++;
                        }
                        setActiveStep(activePanelNum);
                        setActivePanel(activePanelNum);
                    });
                }
            });
        },
        cursorFollow: function () {
            let mouseX = 0, mouseY = 0;
            let xp = 0, yp = 0;
            const cursorFollower = document.getElementById("cursorFollower");
            const container = document.querySelector(".cf_boundary");
            if (container) {
                document.addEventListener("mousemove", (e) => {
                    const rect = container.getBoundingClientRect();
                    mouseX = e.clientX - rect.left;
                    mouseY = e.clientY - rect.top;
                    const maxX = rect.width - cursorFollower.offsetWidth / 2;
                    const maxY = rect.height - cursorFollower.offsetHeight / 2;
                    const minX = cursorFollower.offsetWidth / 2;
                    const minY = cursorFollower.offsetHeight / 2;
                    mouseX = Math.max(minX, Math.min(mouseX, maxX));
                    mouseY = Math.max(minY, Math.min(mouseY, maxY));
                });
                function animateCursor() {
                    xp += (mouseX - xp) * 0.1;
                    yp += (mouseY - yp) * 0.1;
                    cursorFollower.style.left = `${xp}px`;
                    cursorFollower.style.top = `${yp}px`;
                    requestAnimationFrame(animateCursor);
                }
                animateCursor();
            }
        },
        toggleModal: function () {
            var currentQuestion = 1;
            var totalQuestions = $(".question").length;
            showQuestion(currentQuestion);
            $("#next-btn, #next-btn-2").click(function () {
                if (currentQuestion < totalQuestions) {
                    markQuestionAsComplete(currentQuestion);
                    currentQuestion++;
                    updateProgressBar(currentQuestion);
                    showQuestion(currentQuestion);
                }
            });
            $("#prev-btn").click(function () {
                if (currentQuestion > 1) {
                    currentQuestion--;
                    updateProgressBar(currentQuestion);
                    showQuestion(currentQuestion);
                }
            });
            function showQuestion(questionNumber) {
                $(".question").hide();
                $("#question-" + questionNumber).show();
                if (questionNumber == 1) { $("#prev-btn").prop("disabled", true); } else { $("#prev-btn").prop("disabled", false); }
                if (questionNumber == totalQuestions) { $("#next-btn-2").show(); $("#submit-btn").show(); } else { $("#next-btn-2").show(); $("#submit-btn").hide(); }
            }
            function updateProgressBar(questionNumber) {
                var progressPercentage = (questionNumber / totalQuestions) * 100;
                $(".progress-bar").css("width", progressPercentage + "%");
                $(".progress").attr("aria-valuenow", progressPercentage);
            }
            function markQuestionAsComplete(questionNumber) {
                const buttonSelector = `.quiz-modal-btn:nth-child(${questionNumber})`;
                const button = $(buttonSelector);
                button.html('<i class="feather-check"></i>');
                button.addClass("quiz-modal__active");
                if (questionNumber == 3) { button.html('<i class="feather-check"></i>'); button.addClass("quiz-modal__active"); }
            }
            $("#quiz-form").submit(function (event) { event.preventDefault(); });
        },
        typeField: function () {
            const textarea = document.getElementById("answerTextArea");
            const charCountSpan = document.querySelector(".chr");
            if (textarea && charCountSpan) {
                textarea.addEventListener("input", () => {
                    const currentLength = textarea.value.length;
                    const remainingChars = 500 - currentLength;
                    if (remainingChars >= 0) {
                        charCountSpan.textContent = `Character Remaining: ${remainingChars}`;
                    } else {
                        textarea.value = textarea.value.substring(0, 500);
                        charCountSpan.textContent = `Character Remaining: 0`;
                    }
                });
            }
        },
        countDown: function () {
            let time = 3600;
            let isTimeEnd = false;
            function updateTimer() {
                const timerText = document.getElementById("timerText");
                if (timerText) {
                    if (time <= 0) {
                        isTimeEnd = true;
                        timerText.textContent = "0h 0m 0s";
                        return;
                    }
                    const getHours = Math.floor(time / 3600);
                    const getMinutes = Math.floor((time % 3600) / 60);
                    const getSeconds = time % 60;
                    timerText.textContent = `${getHours}h ${getMinutes}m ${getSeconds}s`;
                    time -= 1;
                } else { clearInterval(interval); }
            }
            const interval = setInterval(() => {
                updateTimer();
                if (isTimeEnd) {
                    clearInterval(interval);
                }
            }, 1000);
        },
        autoslidertab: function (params) {
            function tabChange() {
                var tabs = $(".nav-tabs.splash-nav-tabs > li");
                var active = tabs.find("a.active");
                var next = active.parent("li").next("li").find("a");
                if (next.length === 0) {
                    next = tabs.first().find("a").on("click");
                }
                next.tab("show");
            }
            var tabCycle = setInterval(tabChange, 5000);
        },
        offCanvas: function (params) {
            if ($("#rbt-offcanvas-activation").length) {
                $("#rbt-offcanvas-activation").on("click", function () {
                    $(".side-menu").addClass("side-menu-active"),
                    $("body").addClass("offcanvas-menu-active");
                }),
                $(".close_side_menu").on("click", function () {
                    $(".side-menu").removeClass("side-menu-active"),
                    $("body").removeClass("offcanvas-menu-active");
                }),
                $(".side-menu .side-nav .navbar-nav li a").on("click", function () {
                    $(".side-menu").removeClass("side-menu-active"),
                    $("body").removeClass("offcanvas-menu-active");
                }),
                $("#btn_sideNavClose").on("click", function () {
                    $(".side-menu").removeClass("side-menu-active"),
                    $("body").removeClass("offcanvas-menu-active");
                });
            }
        },
        cartSidenav: function (params) {
            if ($(".rbt-cart-sidenav-activation").length) {
                $(".rbt-cart-sidenav-activation").on("click", function () {
                    $(".rbt-cart-side-menu").addClass("side-menu-active"),
                    $("body").addClass("cart-sidenav-menu-active");
                }),
                $(".minicart-close-button").on("click", function () {
                    $(".rbt-cart-side-menu").removeClass("side-menu-active"),
                    $("body").removeClass("cart-sidenav-menu-active");
                }),
                $(".side-menu .side-nav .navbar-nav li a").on("click", function () {
                    $(".rbt-cart-side-menu").removeClass("side-menu-active"),
                    $("body").removeClass("cart-sidenav-menu-active");
                }),
                $("#btn_sideNavClose, .close_side_menu").on("click", function () {
                    $(".rbt-cart-side-menu").removeClass("side-menu-active"),
                    $("body").removeClass("cart-sidenav-menu-active");
                });
            }
        },
        menuCurrentLink: function () {
            var currentPage = location.pathname.split("/"),
                current = currentPage[currentPage.length - 1];
            $(".mainmenu li a, .dashboard-mainmenu li a, .for-right-content .rbt-course-main-content li a").each(function () {
                var $this = $(this);
                if ($this.attr("href") === current) {
                    $this.addClass("active");
                    $this.parents(".has-menu-child-item").addClass("menu-item-open");
                }
            });
        },
        salActive: function () {
            sal({
                threshold: 0.01,
                once: true,
            });
        },
        eduParalax: function () {
            var scene = document.getElementById("scene");
            var parallaxInstance = new Parallax(scene);
        },
        eduSwiperActive: function () {
            var swiper = new Swiper(".banner-swiper-active", {
                effect: "cards",
                grabCursor: true,
                pagination: { el: ".rbt-swiper-pagination", clickable: true, },
            });
            var swiper = new Swiper(".team-slide-activation", {
                slidesPerView: 1,
                spaceBetween: 30,
                loop: true,
                pagination: { el: ".rbt-swiper-pagination", clickable: true, },
                navigation: { nextEl: ".rbt-arrow-right", prevEl: ".rbt-arrow-left", clickable: true, },
                breakpoints: {
                    575: { slidesPerView: 1, },
                    768: { slidesPerView: 2, },
                    992: { slidesPerView: 3, },
                },
            });
            var swiper = new Swiper(".team-slide-activation-4", {
                slidesPerView: 1,
                spaceBetween: 30,
                loop: true,
                pagination: { el: ".rbt-swiper-pagination", clickable: true, },
                navigation: { nextEl: ".rbt-arrow-right", prevEl: ".rbt-arrow-left", clickable: true, },
                breakpoints: {
                    575: { slidesPerView: 1, },
                    768: { slidesPerView: 2, },
                    992: { slidesPerView: 3, },
                    1200: { slidesPerView: 4, },
                },
            });
            var swiper = new Swiper(".blog-post-gallery-activation", {
                slidesPerView: 1,
                autoHeight: true,
                loop: true,
                navigation: { nextEl: ".rbt-arrow-right", prevEl: ".rbt-arrow-left", clickable: true, },
            });
            var swiper = new Swiper(".team-slide-activation-2", {
                slidesPerView: 3,
                spaceBetween: 0,
                loop: true,
                pagination: { el: ".rbt-swiper-pagination", clickable: true, },
                breakpoints: {
                    320: { slidesPerView: 1, },
                    480: { slidesPerView: 2, },
                    768: { slidesPerView: 2, },
                    992: { slidesPerView: 3, },
                },
            });
            var swiper = new Swiper(".service-item-3-activation", {
                slidesPerView: 1,
                spaceBetween: 0,
                loop: false,
                navigation: { nextEl: ".rbt-arrow-right", prevEl: ".rbt-arrow-left", clickable: true, },
                breakpoints: {
                    480: { slidesPerView: 1, },
                    481: { slidesPerView: 2, },
                    768: { slidesPerView: 3, },
                    992: { slidesPerView: 3, },
                },
            });
            var swiper = new Swiper(".viral-banner-activation", {
                slidesPerView: 1,
                spaceBetween: 0,
                loop: false,
                navigation: { nextEl: ".rbt-arrow-right", prevEl: ".rbt-arrow-left", clickable: true, },
            });
            var swiper = new Swiper(".udemy-affilite-activation", {
                slidesPerView: 1,
                spaceBetween: 0,
                loop: true,
                navigation: { nextEl: ".rbt-arrow-right", prevEl: ".rbt-arrow-left", clickable: true, },
            });
            var swiperThumb = new Swiper(".rbtmySwiperThumb", {
                spaceBetween: 10,
                slidesPerView: 2,
                freeMode: true,
                watchSlidesProgress: true,
            });
            var swiper = new Swiper(".rbt-banner-activation", {
                slidesPerView: 1,
                spaceBetween: 0,
                loop: false,
                autoHeight: true,
                navigation: { nextEl: ".rbt-arrow-right", prevEl: ".rbt-arrow-left", clickable: true, },
                thumbs: { swiper: swiperThumb, },
            });
            var swiper = new Swiper(".rbt-banner-activation-2", {
                slidesPerView: 1,
                spaceBetween: 0,
                loop: true,
                autoHeight: true,
                navigation: { nextEl: ".rbt-arrow-right", prevEl: ".rbt-arrow-left", clickable: true, },
                autoplay: { delay: 5000, disableOnInteraction: false, pauseOnMouseEnter: true, },
            });
            var swiper = new Swiper(".rbt-gif-banner-area", {
                slidesPerView: 1,
                spaceBetween: 0,
                loop: true,
                navigation: { nextEl: ".rbt-arrow-right", prevEl: ".rbt-arrow-left", clickable: true, },
            });
            var swiper = new Swiper(".testimonial-item-3-activation", {
                slidesPerView: 1,
                spaceBetween: 0,
                loop: false,
                navigation: { nextEl: ".rbt-arrow-right", prevEl: ".rbt-arrow-left", clickable: true, },
                pagination: { el: ".rbt-swiper-pagination", clickable: true, },
                breakpoints: {
                    575: { slidesPerView: 1, },
                    768: { slidesPerView: 2, },
                    992: { slidesPerView: 3, },
                },
            });
            var swiper = new Swiper(".testimonial-activation-1", {
                slidesPerView: 1,
                spaceBetween: 0,
                loop: true,
                pagination: { el: ".rbt-swiper-pagination", clickable: true, },
            });
            var swiper = new Swiper(".modern-course-carousel-activation", {
                slidesPerView: 1,
                spaceBetween: 0,
                loop: true,
                navigation: { nextEl: ".rbt-arrow-right", prevEl: ".rbt-arrow-left", clickable: true, },
            });
            var swiper = new Swiper(".category-activation-one", {
                slidesPerView: 1,
                spaceBetween: 0,
                loop: true,
                navigation: { nextEl: ".rbt-arrow-right", prevEl: ".rbt-arrow-left", clickable: true, },
                pagination: { el: ".rbt-swiper-pagination", clickable: true, },
                breakpoints: {
                    481: { slidesPerView: 1, },
                    768: { slidesPerView: 2, },
                    992: { slidesPerView: 3, },
                    1200: { slidesPerView: 4, },
                },
            });
            var swiper = new Swiper(".category-activation-two", {
                slidesPerView: 1,
                spaceBetween: 0,
                loop: false,
                navigation: { nextEl: ".rbt-arrow-right", prevEl: ".rbt-arrow-left", clickable: true, },
                scrollbar: { el: ".swiper-scrollbar", draggable: true, hide: true, snapOnRelease: true, },
                breakpoints: {
                    480: { slidesPerView: 1, },
                    481: { slidesPerView: 2, },
                    768: { slidesPerView: 2, },
                    992: { slidesPerView: 3, },
                    1200: { slidesPerView: 6, },
                },
            });
            var swiper = new Swiper(".category-activation-three", {
                slidesPerView: 1,
                spaceBetween: 0,
                loop: true,
                navigation: { nextEl: ".rbt-arrow-right", prevEl: ".rbt-arrow-left", clickable: true, },
                scrollbar: { el: ".swiper-scrollbar", draggable: true, hide: true, snapOnRelease: true, },
                breakpoints: {
                    480: { slidesPerView: 1, },
                    481: { slidesPerView: 2, },
                    768: { slidesPerView: 2, },
                    992: { slidesPerView: 3, },
                    1200: { slidesPerView: 4, },
                },
            });
            var swiper = new Swiper(".category-activation-four", {
                slidesPerView: 1,
                spaceBetween: 30,
                loop: true,
                navigation: { nextEl: ".rbt-arrow-right", prevEl: ".rbt-arrow-left", clickable: true, },
                scrollbar: { el: ".swiper-scrollbar", draggable: true, hide: true, snapOnRelease: true, },
                breakpoints: {
                    480: { slidesPerView: 1, },
                    481: { slidesPerView: 2, },
                    768: { slidesPerView: 2, },
                    992: { slidesPerView: 3, },
                    1200: { slidesPerView: 4, },
                },
            });
            var swiper = new Swiper(".event-activation-1", {
                slidesPerView: 1,
                slidesPerGroup: 1,
                loop: true,
                spaceBetween: 30,
                navigation: { nextEl: ".rbt-arrow-right", prevEl: ".rbt-arrow-left", clickable: true, },
                scrollbar: { el: ".swiper-scrollbar", draggable: true, hide: true, snapOnRelease: true, },
                pagination: { el: ".rbt-swiper-pagination", clickable: true, },
                breakpoints: {
                    575: { slidesPerView: 1, },
                    768: { slidesPerView: 2, },
                    992: { slidesPerView: 3, },
                    1200: { slidesPerView: 3, slidesPerGroup: 3, },
                },
            });
            var swiper = new Swiper(".banner-splash-inner-layout-active", {
                effect: "cards",
                grabCursor: true,
                clickable: true,
                loop: true,
                pagination: { el: ".rbt-swiper-pagination", clickable: true, type: "fraction", },
                navigation: { nextEl: ".rbt-arrow-right", prevEl: ".rbt-arrow-left", clickable: true, },
            });
        },
        eduBgCardHover: function () {
            $(".rbt-hover-active").mouseenter(function () {
                var self = this;
                setTimeout(function () {
                    $(".rbt-hover-active.active").removeClass("active");
                    $(self).addClass("active");
                }, 0);
            });
        },
        magnigyPopup: function () {
            $(document).on("ready", function () {
                $(".popup-video").magnificPopup({
                    type: "iframe",
                    mainClass: "mfp-fade",
                    removalDelay: 160,
                    preloader: false,
                    fixedContentPos: false,
                });
            });
        },
        counterUp: function () {
            var odo = $(".odometer");
            odo.each(function () {
                $(".odometer").appear(function (e) {
                    var countNumber = $(this).attr("data-count");
                    $(this).html(countNumber);
                });
            });
        },
        pricingPlan: function () {
            var mainPlan = $(".rbt-pricing-area");
            mainPlan.each(function () {
                var yearlySelectBtn = $(".yearly-plan-btn"),
                    monthlySelectBtn = $(".monthly-plan-btn"),
                    monthlyPrice = $(".monthly-pricing"),
                    yearlyPrice = $(".yearly-pricing"),
                    buttonSlide = $(".pricing-checkbox");
                $(monthlySelectBtn).on("click", function () {
                    buttonSlide.prop("checked", true);
                    $(this).addClass("active").parent(".nav-item").siblings().children().removeClass("active");
                    monthlyPrice.css("display", "block");
                    yearlyPrice.css("display", "none");
                });
                $(yearlySelectBtn).on("click", function () {
                    buttonSlide.prop("checked", false);
                    $(this).addClass("active").parent(".nav-item").siblings().children().removeClass("active");
                    monthlyPrice.css("display", "none");
                    yearlyPrice.css("display", "block");
                });
                $(buttonSlide).change(function () {
                    if ($('input[class="pricing-checkbox"]:checked').length > 0) {
                        monthlySelectBtn.addClass("active");
                        yearlySelectBtn.removeClass("active");
                        monthlyPrice.css("display", "block");
                        yearlyPrice.css("display", "none");
                    } else {
                        yearlySelectBtn.addClass("active");
                        monthlySelectBtn.removeClass("active");
                        monthlyPrice.css("display", "none");
                        yearlyPrice.css("display", "block");
                    }
                });
            });
        },
        courseView: function () {
            var gridViewBtn = $(".rbt-grid-view"),
                listViewBTn = $(".rbt-list-view");
            $(gridViewBtn).on("click", function () {
                $(this).addClass("active").parent(".course-switch-item").siblings().children().removeClass("active");
                $(".rbt-course-grid-column").addClass("active-grid-view");
                $(".rbt-course-grid-column").removeClass("active-list-view");
                $(".rbt-card").removeClass("card-list-2");
            });
            $(listViewBTn).on("click", function () {
                $(this).addClass("active").parent(".course-switch-item").siblings().children().removeClass("active");
                $(".rbt-course-grid-column").removeClass("active-grid-view");
                $(".rbt-course-grid-column").addClass("active-list-view");
                $(".rbt-card").addClass("card-list-2");
            });
        },
        stickyHeader: function () {
            if ($("header").hasClass("header-transparent")) { $("body").addClass("active-header-transparent"); } else { $("body").removeClass("active-header-transparent"); }
        },
        masonryActivation: function name(params) {
            $(window).load(function () {
                $(".masonary-wrapper-activation").imagesLoaded(function () {
                    $(".messonry-button").on("click", "button", function () {
                        var filterValue = $(this).attr("data-filter");
                        $(this).siblings(".is-checked").removeClass("is-checked");
                        $(this).addClass("is-checked");
                        $grid.isotope({ filter: filterValue, });
                    });
                    var $grid = $(".mesonry-list").isotope({
                        percentPosition: true,
                        transitionDuration: "0.7s",
                        layoutMode: "masonry",
                        masonry: { columnWidth: ".resizer", },
                    });
                });
            });
            $(window).load(function () {
                $(".splash-masonary-wrapper-activation").imagesLoaded(function () {
                    $(".messonry-button").on("click", "button", function () {
                        var filterValue = $(this).attr("data-filter");
                        $(this).siblings(".is-checked").removeClass("is-checked");
                        $(this).addClass("is-checked");
                        $grid.isotope({ filter: filterValue, });
                    });
                    var $grid = $(".splash-mesonry-list").isotope({
                        percentPosition: true,
                        transitionDuration: "0.7s",
                        layoutMode: "masonry",
                        masonry: { columnWidth: ".resizer", },
                    });
                });
            });
        },
        _clickDoc: function () {
            var inputblur, inputFocus, openSideNav, closeSideNav;
            inputblur = function (e) {
                if (!$(this).val()) { $(this).parent(".form-group").removeClass("focused"); }
            };
            inputFocus = function (e) { $(this).parents(".form-group").addClass("focused"); };
            openSideNav = function (e) {
                e.preventDefault();
                eduJs.sideNav.addClass("active");
                $(".search-trigger-active").addClass("open");
                eduJs._html.addClass("side-nav-opened");
            };
            closeSideNav = function (e) {
                if (!$('.rbt-search-dropdown, .rbt-search-dropdown *:not(".search-trigger-active, .search-trigger-active *")').is(e.target)) {
                    eduJs.sideNav.removeClass("active");
                    $(".search-trigger-active").removeClass("open");
                    eduJs._html.removeClass("side-nav-opened");
                }
            };
            eduJs._document.on("blur", "input,textarea,select", inputblur).on("focus", 'input:not([type="radio"]),input:not([type="checkbox"]),textarea,select', inputFocus).on("click", ".search-trigger-active", openSideNav).on("click", ".side-nav-opened", closeSideNav);
        },
        wowActivation: function () { new WOW().init(); },
        radialProgress: function () {
            $(window).scroll(function () {
                $(".radial-progress").each(function (i) {
                    var bottom_of_object = $(this).offset().top + $(this).outerHeight();
                    var bottom_of_window = $(window).scrollTop() + $(window).height();
                    if (bottom_of_window > bottom_of_object) {
                        $(".radial-progress").easyPieChart({
                            lineWidth: 10,
                            scaleLength: 0,
                            rotate: 0,
                            trackColor: false,
                            lineCap: "round",
                            size: 180,
                            onStep: function (from, to, percent) {
                                $(this.el).find(".percent").text(Math.round(percent));
                            },
                        });
                    }
                });
            });
        },
        marqueImage: function () {
            $(".edumarque").each(function () {
                var t = 0;
                var i = 1;
                var $this = $(this);
                setInterval(function () {
                    t += i;
                    $this.css("background-position-x", -t + "px");
                }, 10);
            });
        },
        popupMobileMenu: function (e) {
            $(".hamberger-button").on("click", function (e) { $(".popup-mobile-menu").addClass("active"); });
            $(".close-button").on("click", function (e) {
                $(".popup-mobile-menu").removeClass("active");
                $(".popup-mobile-menu .mainmenu .has-dropdown > a, .popup-mobile-menu .mainmenu .with-megamenu > a").siblings(".submenu, .rbt-megamenu").removeClass("active").slideUp("400");
                $(".popup-mobile-menu .mainmenu .has-dropdown > a, .popup-mobile-menu .mainmenu .with-megamenu > a").removeClass("open");
            });
            $(".popup-mobile-menu .mainmenu .has-dropdown > a, .popup-mobile-menu .mainmenu .with-megamenu > a").on("click", function (e) {
                e.preventDefault();
                $(this).siblings(".submenu, .rbt-megamenu").toggleClass("active").slideToggle("400");
                $(this).toggleClass("open");
            });
            $(".popup-mobile-menu, .popup-mobile-menu .mainmenu.onepagenav li a").on("click", function (e) {
                e.target === this &&
                    $(".popup-mobile-menu").removeClass("active") &&
                    $(".popup-mobile-menu .mainmenu .has-dropdown > a, .popup-mobile-menu .mainmenu .with-megamenu > a").siblings(".submenu, .rbt-megamenu").removeClass("active").slideUp("400") &&
                    $(".popup-mobile-menu .mainmenu .has-dropdown > a, .popup-mobile-menu .mainmenu .with-megamenu > a").removeClass("open");
            });
        },
        headerSticky: function () {
            $(window).on("scroll", function () {
                if ($("body").hasClass("rbt-header-sticky")) {
                    var stickyPlaceHolder = $(".rbt-sticky-placeholder"),
                        headerConainer = $(".rbt-header-wrapper"),
                        headerConainerH = headerConainer.outerHeight(),
                        topHeaderH = $(".rbt-header-top").outerHeight() || 0,
                        targrtScroll = topHeaderH + 200;
                    if ($(window).scrollTop() > targrtScroll) {
                        headerConainer.addClass("rbt-sticky");
                        stickyPlaceHolder.height(headerConainerH);
                    } else {
                        headerConainer.removeClass("rbt-sticky");
                        stickyPlaceHolder.height(0);
                    }
                }
            });
        },
        qtyBtn: function () {
            $(".pro-qty").prepend('<span class="dec qtybtn">-</span>');
            $(".pro-qty").append('<span class="inc qtybtn">+</span>');
            $(".qtybtn").on("click", function () {
                var $button = $(this);
                var oldValue = $button.parent().find("input").val();
                if ($button.hasClass("inc")) {
                    var newVal = parseFloat(oldValue) + 1;
                } else {
                    if (oldValue > 0) {
                        var newVal = parseFloat(oldValue) - 1;
                    } else {
                        newVal = 0;
                    }
                }
                $button.parent().find("input").val(newVal);
            });
        },
        checkoutPage: function () {
            $("[data-shipping]").on("click", function () {
                if ($("[data-shipping]:checked").length > 0) {
                    $("#shipping-form").slideDown();
                } else {
                    $("#shipping-form").slideUp();
                }
            });
            $('[name="payment-method"]').on("click", function () {
                var $value = $(this).attr("value");
                $(".single-method p").slideUp();
                $('[data-method="' + $value + '"]').slideDown();
            });
        },
        onePageNav: function () {
            $(".onepagenav").onePageNav({
                currentClass: "current",
                changeHash: false,
                scrollSpeed: 500,
                scrollThreshold: 0.2,
                filter: "",
                easing: "swing",
            });
        },
        transparentHeader: function () {
            if ($(".rbt-header").hasClass("rbt-transparent-header")) {
                var mainHeader = $(".rbt-header").outerHeight();
                $("body").addClass("rbt-header-transpernt-active");
                $(".header-transperent-spacer").css("padding-top", mainHeader + "px");
            }
        },
        categoryMenuHover: function () {
            $(".vertical-nav-menu li.vertical-nav-item").mouseover(function () {
                $(".rbt-vertical-inner").hide();
                $(".vertical-nav-menu li.vertical-nav-item").removeClass("active");
                $(this).addClass("active");
                var selected_tab = $(this).find("a").attr("href");
                $(selected_tab).stop().fadeIn();
                return false;
            });
        },
        selectPicker: function () { $("select").selectpicker(); },
        filterClickButton: function () {
            $(".discover-filter-activation").on("click", function () {
                $(this).toggleClass("open");
                $(".default-exp-expand").slideToggle("400");
            });
            $("#slider-range").slider({
                range: true,
                min: 10,
                max: 500,
                values: [100, 300],
                slide: function (event, ui) { $("#amount").val("$" + ui.values[0] + " - $" + ui.values[1]); },
            });
            $("#amount").val("$" + $("#slider-range").slider("values", 0) + " - $" + $("#slider-range").slider("values", 1));
        },
        headerTopActivation: function () { $(".bgsection-activation").on("click", function () { $(this).parents(".rbt-header-campaign").addClass("deactive"); }); },
        magnificPopupActivation: function () {
            $(".parent-gallery-container").magnificPopup({
                delegate: ".child-gallery-single",
                type: "image",
                mainClass: "mfp-with-zoom",
                gallery: { enabled: true, },
                zoom: {
                    enabled: true,
                    duration: 300,
                    easing: "ease-in-out",
                    opener: function (openerElement) {
                        return openerElement.is("img") ? openerElement : openerElement.find("img");
                    },
                },
            });
        },
        showMoreBtn: function () {
            $.fn.hasShowMore = function () {
                return this.each(function () {
                    $(this).toggleClass("active");
                    $(this).text("Show Less");
                    $(this).parent(".has-show-more").toggleClass("active");
                    if ($(this).parent(".has-show-more").hasClass("active")) {
                        $(this).text("Show Less");
                    } else {
                        $(this).text("Show More");
                    }
                });
            };
            $(document).on("click", ".rbt-show-more-btn", function () {
                $(this).hasShowMore();
            });
        },
        sidebarVideoHidden: function () {
            var scrollTop = $(".sidebar-video-hidden");
            $(window).scroll(function () {
                var topPos = $(this).scrollTop();
                if (topPos > 250) {
                    $(scrollTop).css("display", "none");
                } else {
                    $(scrollTop).css("display", "block");
                }
            });
        },
        courseActionBottom: function () {
            var scrollBottom = $(".rbt-course-action-bottom");
            $(window).scroll(function () {
                var topPos = $(this).scrollTop();
                var targetPossition = $(document).height() * 0.66;
                var filled = ($(document).scrollTop() + window.innerHeight) / $(document).height();
                if (topPos > targetPossition && filled != 1) {
                    $(scrollBottom).addClass("rbt-course-action-active");
                } else {
                    $(scrollBottom).removeClass("rbt-course-action-active");
                }
            });
        },
        topbarExpend: function () {
            var windowWidth = $(window).width(); {
                if (windowWidth < 1199) {
                    $(".top-bar-expended").on("click", function () {
                        $(".top-expended-activation").hasClass("active") ?
                        ($(".top-expended-activation").removeClass("active"),
                            $(".top-expended-activation")
                            .find(".top-expended-wrapper")
                            .css({ height: "32px" })) :
                        ($(".top-expended-activation").addClass("active"),
                            $(".top-expended-activation")
                            .find(".top-expended-wrapper")
                            .css({
                                height: $(".top-expended-inner").outerHeight() + "px",
                            }));
                    });
                    $(window).on("hresize", function () {
                        $(".top-expended-activation").hasClass("active") &&
                            $(".top-expended-activation")
                            .find(".top-expended-inner")
                            .css({
                                height: $(".top-expended-inner").outerHeight() + "px",
                            });
                    });
                }
            }
        },
        categoryOffcanvas: function () {
            var windowWidth = $(window).width();
            if (windowWidth < 1200) {
                $(".rbt-side-offcanvas-activation").on("click", function () {
                    $(".rbt-offcanvas-side-menu").addClass("active-offcanvas");
                });
                $(".rbt-close-offcanvas").on("click", function () {
                    $(".rbt-offcanvas-side-menu").removeClass("active-offcanvas");
                });
                $(".rbt-offcanvas-side-menu").on("click", function (e) {
                    e.target === this &&
                        $(".rbt-offcanvas-side-menu").removeClass("active-offcanvas");
                });
                $(".rbt-vertical-nav-list-wrapper .vertical-nav-item a").on("click", function (e) {
                    e.preventDefault();
                    $(this).siblings(".vartical-nav-content-menu-wrapper").toggleClass("active").slideToggle("400");
                    $(this).toggleClass("active");
                });
            }
        },
        moveAnimation: function () {
            $(".scene").each(function () {
                new Parallax($(this)[0]);
            });
        },
        contactForm: function () {
            $(".rainbow-dynamic-form").on("submit", function (e) {
                e.preventDefault();
                var _self = $(this);
                var __selector = _self.closest("input,textarea");
                _self.closest("div").find("input,textarea").removeAttr("style");
                _self.find(".error-msg").remove();
                _self.closest("div").find('button[type="submit"]').attr("disabled", "disabled");
                var data = $(this).serialize();
                $.ajax({
                    url: "mail.php",
                    type: "post",
                    dataType: "json",
                    data: data,
                    success: function (data) {
                        _self.closest("div").find('button[type="submit"]').removeAttr("disabled");
                        if (data.code == false) {
                            _self.closest("div").find('[name="' + data.field + '"]');
                            _self.find(".rainbow-btn").after('<div class="error-msg"><p>*' + data.err + "</p></div>");
                        } else {
                            $(".error-msg").hide();
                            $(".form-group").removeClass("focused");
                            _self.find(".rainbow-btn").after('<div class="success-msg"><p>' + data.success + "</p></div>");
                            _self.closest("div").find("input,textarea").val("");
                            setTimeout(function () {
                                $(".success-msg").fadeOut("slow");
                            }, 5000);
                        }
                    },
                });
            });
        },
        player: function () {
            var player = new Plyr(".rbtplayer", {
                muted: false,
                volume: 1,
                controls: ["play-large", "play", "progress", "current-time", "mute", "volume", "fullscreen"],
            });
        },
        quizAns: function () {
            var currentQuestion = 1;
            showQuestion(currentQuestion);
            $("#next-btn").click(function () {
                if (currentQuestion < $(".question").length) {
                    currentQuestion++;
                    showQuestion(currentQuestion);
                }
            });
            $("#prev-btn").click(function () {
                if (currentQuestion > 1) {
                    currentQuestion--;
                    showQuestion(currentQuestion);
                }
            });
            function showQuestion(questionNumber) {
                $(".question").hide();
                $("#question-" + questionNumber).show();
                if (questionNumber == 1) {
                    $("#prev-btn").prop("disabled", true);
                } else {
                    $("#prev-btn").prop("disabled", false);
                }
                if (questionNumber == $(".question").length) {
                    $("#next-btn").hide();
                    $("#submit-btn").show();
                } else {
                    $("#next-btn").show();
                    $("#submit-btn").hide();
                }
            }
            $("#quiz-form").submit(function (event) {
                event.preventDefault();
            });
        },
        lessonAccor: function () {
            let selectedCollapse = sessionStorage.getItem("selectedCollapse");
            if (selectedCollapse != null) {
                $(".accordion .collapse").removeClass("show");
                $(".accordion-button").addClass("collapsed").attr("aria-expanded", false);
                $(selectedCollapse).addClass("show");
                $(selectedCollapse).siblings().find("button").removeClass("collapsed").attr("aria-expanded", true);
            }
            $(".accordion .accordion-button").on("click", function () {
                let target = $(this).data("bs-target");
                sessionStorage.setItem("selectedCollapse", target);
            });
        },
        unloadImage: function name() {
            $("#createfileImage").click(function (e) {
                $("#createinputfile").click();
            });
            function rbtPreview() {
                const [file2] = createinputfile.files;
                if (file2) {
                    createfileImage.src = URL.createObjectURL(file2);
                }
            }
            $("#createinputfile").change(function () {
                rbtPreview(this);
            });
        },
        searchValue: function () {
            $(document).on("keyup", ".rbt-search-active", function () {
                var value = $(this).val().toLowerCase();
                $(".rbt-search-activation .accordion .accordion-item").filter(function () {
                    $(this).toggle($(this).text().toLowerCase().indexOf(value) > -1);
                });
            });
        },
        lessonToggle: function () {
            $(".lesson-toggle-active").on("click", function () {
                $(this).toggleClass("sidebar-hide");
                $(".rbt-lesson-leftsidebar").toggleClass("sibebar-none");
            });
        },
        categoryMenuHover2: function () {
            $(".dropdown-parent-wrapper li.dropdown-parent-list").mouseover(function () {
                $(".dropdown-child-wrapper").hide();
                $(".dropdown-parent-wrapper li.dropdown-parent-list").removeClass("active");
                $(this).addClass("active");
                var selected_tab = $(this).find("a").attr("href");
                $(selected_tab).stop().fadeIn();
                return false;
            });
        },
    };

    // ===== START LMS FRONTEND LOGIC (UNIFIED) =====
    eduJs.lmsInit = function () {
        const API_BASE_URL = '';
        const token = localStorage.getItem('lmsToken');
        const user = JSON.parse(localStorage.getItem('lmsUser'));

        // In main.js, add this to the top (global scope)
// Helper function to trigger the hidden file input
window.triggerExerciseFileUpload = function() {
    document.getElementById('lesson-exercise-file').click();
}

// Helper function to display the chosen file's name
window.displayExerciseFileName = function(fileInput) {
    const fileNameDisplay = document.getElementById('exercise-file-name');
    if (fileInput.files.length > 0) {
        fileNameDisplay.textContent = `Selected file: ${fileInput.files[0].name}`;
    } else {
        fileNameDisplay.textContent = '';
    }
}
const renderCourseDetailsCurriculum = (episodes) => {
    const courseContentWrapper = document.getElementById('coursecontent')?.querySelector('.accordion');
    if (!courseContentWrapper) return;

    if (!episodes || episodes.length === 0) {
        // If there's no curriculum, you can either show a message or hide the section
        courseContentWrapper.innerHTML = '<p>No curriculum has been added to this course yet.</p>';
        return;
    }

    courseContentWrapper.innerHTML = ''; // Clear static content
    
    episodes.forEach((episode, index) => {
        // Create the HTML for the lessons list (view only)
        const lessonsHtml = episode.lessons.map(lesson => `
            <li>
                <a href="#">
                    <div class="course-content-left">
                        <i class="feather-play-circle"></i> <span class="text">${lesson.title}</span>
                    </div>
                    <div class="course-content-right">
                        <span class="min-lable">${lesson.duration || ''}</span>
                    </div>
                </a>
            </li>
        `).join('');

        // Create the HTML for the topic/episode accordion item
        const episodeHtml = `
            <div class="accordion-item card">
                <h2 class="accordion-header card-header" id="headingTwo${index}">
                    <button class="accordion-button ${index !== 0 ? 'collapsed' : ''}" type="button" data-bs-toggle="collapse" data-bs-target="#collapseTwo${index}" aria-expanded="${index === 0}">
                        ${episode.title} <span class="rbt-badge-5 ml--10">${episode.lessons.length} Lessons</span>
                    </button>
                </h2>
                <div id="collapseTwo${index}" class="accordion-collapse collapse ${index === 0 ? 'show' : ''}">
                    <div class="accordion-body card-body pr--0">
                        <ul class="rbt-course-main-content liststyle">
                            ${lessonsHtml}
                        </ul>
                    </div>
                </div>
            </div>
        `;
        courseContentWrapper.innerHTML += episodeHtml;
    });
};

        const updateUserDataOnPage = () => {
            if (!token) return;
            fetch(`${API_BASE_URL}/api/user/profile`, { headers: { 'x-auth-token': token } })
                .then(res => res.json())
                .then(result => {
                    if (result.success) {
                        const profile = result.data;
                        const fullName = `${profile.firstName} ${profile.lastName}`;
                        const bannerName = document.querySelector('.rbt-tutor-information .title');
                        const bannerAvatar = document.querySelector('.rbt-tutor-information .rbt-avatars img');
                        const bannerCover = document.querySelector('.tutor-bg-photo');
                        const sidebarWelcomeName = document.querySelector('.rbt-default-sidebar-wrapper .rbt-title-style-2');
                        const headerDropdownAvatar = document.querySelector('#header-dropdown-avatar');
                        const settingsAvatarImg = document.querySelector('#settings-avatar-img');
                        const settingsCoverBanner = document.querySelector('#cover-photo-banner');
                        if (bannerName) bannerName.textContent = fullName;
                        if (profile.avatar) {
                            if (bannerAvatar) bannerAvatar.src = `/${profile.avatar}`;
                            if (settingsAvatarImg) settingsAvatarImg.src = `/${profile.avatar}`;
                        }
                        if (profile.coverPhoto) {
                            if (bannerCover) bannerCover.style.backgroundImage = `url(/${profile.coverPhoto})`;
                            if (settingsCoverBanner) settingsCoverBanner.style.backgroundImage = `url(/${profile.coverPhoto})`;
                        }
                        if (sidebarWelcomeName) sidebarWelcomeName.textContent = `Welcome, ${profile.firstName}`;
                        if (headerDropdownAvatar && profile.avatar) headerDropdownAvatar.src = `/${profile.avatar}`;
                    } else {
                        localStorage.clear();
                        window.location.href = '/login';
                    }
                })
                .catch(error => {
                    console.error('Error fetching user data:', error);
                    localStorage.clear();
                    window.location.href = '/login';
                });
        };

        const handlePageLogic = () => {
            const path = window.location.pathname;

            if (path.includes('student-')) {
                if (!token) {
                    window.location.href = '/login';
                    return;
                }
                updateUserDataOnPage();
            }

            if (path.includes('/login') || path.includes('/login-instructor')) {
                const loginForm = document.querySelector('#login-form');
                if (loginForm) {
                    loginForm.addEventListener('submit', async (event) => {
                        event.preventDefault();
                        const username = document.querySelector('#email').value;
                        const password = document.querySelector('#password').value;
                        try {
                            const response = await fetch(`${API_BASE_URL}/api/login`, {
                                method: 'POST',
                                headers: { 'Content-Type': 'application/json' },
                                body: JSON.stringify({ username, password }),
                            });
                            const result = await response.json();
                            if (result.success) {
                                localStorage.setItem('lmsToken', result.token);
                                localStorage.setItem('lmsUser', JSON.stringify(result.user));
                                if (result.user.role === 'instructor') {
                                    window.location.href = '/instructor-dashboard.html';
                                } else {
                                    window.location.href = '/student-dashboard.html';
                                }
                            } else {
                                alert(`Login Failed: ${result.message}`);
                            }
                        } catch (error) { console.error('Login error:', error); }
                    });
                }
                const registerForm = document.querySelector('#register-form');
                if (registerForm) {
                    registerForm.addEventListener('submit', async (event) => {
                        event.preventDefault();
                        const firstName = document.querySelector('#register-firstName').value;
                        const lastName = document.querySelector('#register-lastName').value;
                        const email = document.querySelector('#register-email').value;
                        const password = document.querySelector('#register-password').value;
                        try {
                            const response = await fetch(`${API_BASE_URL}/api/register`, {
                                method: 'POST',
                                headers: { 'Content-Type': 'application/json' },
                                body: JSON.stringify({ firstName, lastName, email, password }),
                            });
                            const result = await response.json();
                            if (result.success) {
                                alert('Registration successful! Please log in.');
                                window.location.reload();
                            } else {
                                alert(`Registration Failed: ${result.message}`);
                            }
                        } catch (error) { console.error('Registration error:', error); }
                    });
                }
                const instructorRegisterForm = document.querySelector('#instructor-register-form');
                if (instructorRegisterForm) {
                    instructorRegisterForm.addEventListener('submit', async (event) => {
                        event.preventDefault();
                        const firstName = document.querySelector('#register-firstName').value;
                        const lastName = document.querySelector('#register-lastName').value;
                        const email = document.querySelector('#register-email').value;
                        const password = document.querySelector('#register-password').value;
                        try {
                            const response = await fetch(`${API_BASE_URL}/api/register-instructor`, {
                                method: 'POST',
                                headers: { 'Content-Type': 'application/json' },
                                body: JSON.stringify({ firstName, lastName, email, password }),
                            });
                            const result = await response.json();
                            if (result.success) {
                                alert('Instructor registration successful! Please log in.');
                                window.location.reload();
                            } else {
                                alert(`Registration Failed: ${result.message}`);
                            }
                        } catch (error) { console.error('Registration error:', error); }
                    });
                }
            }
            if (path.includes('instructor-dashboard.html')) {
                if (!token || user.role !== 'instructor') {
                    alert("Access Denied: You are not an instructor.");
                    window.location.href = '/login';
                    return;
                }
                updateUserDataOnPage();
                fetch(`${API_BASE_URL}/api/instructor/dashboard`, { headers: { 'x-auth-token': token } })
                    .then(res => res.json())
                    .then(result => {
                        if (result.success) {
                            const data = result.data;
                            const enrolledCoursesEl = document.querySelector('.rbt-counterup.bg-primary-opacity .odometer');
                            const activeCoursesEl = document.querySelector('.rbt-counterup.bg-secondary-opacity .odometer');
                            const completedCoursesEl = document.querySelector('.rbt-counterup.bg-violet-opacity .odometer');
                            const totalStudentsEl = document.querySelector('.rbt-counterup.bg-pink-opacity .odometer');
                            const totalCoursesEl = document.querySelector('.rbt-counterup.bg-coral-opacity .odometer');
                            const totalEarningsEl = document.querySelector('.rbt-counterup.bg-warning-opacity .odometer');
                            if (enrolledCoursesEl) enrolledCoursesEl.setAttribute('data-count', data.enrolledCourses);
                            if (activeCoursesEl) activeCoursesEl.setAttribute('data-count', data.activeCourses);
                            if (completedCoursesEl) completedCoursesEl.setAttribute('data-count', data.completedCourses);
                            if (totalStudentsEl) totalStudentsEl.setAttribute('data-count', data.totalStudents);
                            if (totalCoursesEl) totalCoursesEl.setAttribute('data-count', data.totalCourses);
                            if (totalEarningsEl) totalEarningsEl.setAttribute('data-count', data.totalEarnings);
                            if (window.eduJs && window.eduJs.counterUp) { window.eduJs.counterUp(); }
                            const coursesTableBody = document.querySelector('.rbt-dashboard-table tbody');
                            if (coursesTableBody) {
                                coursesTableBody.innerHTML = '';
                                data.courses.forEach(course => {
                                    const starIcons = Array.from({ length: 5 }, (_, i) => `<i class="fas fa-star ${i < Math.floor(course.rating) ? '' : 'off'}"></i>`).join('');
                                    coursesTableBody.innerHTML += `
                                        <tr>
                                            <th><a href="#">${course.title}</a></th>
                                            <td>${course.enrolled}</td>
                                            <td><div class="rating">${starIcons}</div></td>
                                        </tr>
                                    `;
                                });
                            }
                        } else {
                            alert(result.message);
                            window.location.href = '/student-dashboard.html';
                        }
                    })
                    .catch(error => console.error('Error fetching instructor dashboard data:', error));
            }
            if (path.includes('instructor-profile.html')) {
                if (!token || user.role !== 'instructor') {
                    alert("Access Denied: You are not an instructor.");
                    window.location.href = '/login';
                    return;
                }
                updateUserDataOnPage();
                fetch(`${API_BASE_URL}/api/user/profile`, { headers: { 'x-auth-token': token } })
                    .then(res => res.json())
                    .then(result => {
                        if (result.success) {
                            const profile = result.data;
                            const profileMapping = {
                                'Registration Date': profile.registrationDate, 'First Name': profile.firstName, 'Last Name': profile.lastName, 'Username': profile.email, 'Email': profile.email, 'Phone Number': profile.phone || 'Not provided', 'Skill/Occupation': profile.occupation || 'Not provided', 'Biography': profile.bio || 'Not provided'
                            };
                            const profileRows = document.querySelectorAll('.rbt-profile-row');
                            profileRows.forEach(row => {
                                const labelElement = row.querySelector('.rbt-profile-content.b2');
                                const valueElement = row.querySelector('.col-lg-8 .rbt-profile-content.b2');
                                if (labelElement && valueElement) {
                                    const labelText = labelElement.textContent.trim();
                                    if (profileMapping[labelText]) {
                                        valueElement.textContent = profileMapping[labelText];
                                    }
                                }
                            });
                        } else {
                            console.error('Failed to fetch instructor profile data:', result.message);
                        }
                    })
                    .catch(error => console.error('Error fetching profile data:', error));
            }
            if (path.includes('instructor-course.html')) {
                if (!token || user.role !== 'instructor') {
                    alert("Access Denied: You are not an instructor.");
                    window.location.href = '/login';
                    return;
                }
                updateUserDataOnPage();
                const fetchAndDisplayCoursesByStatus = () => {
                    fetch(`${API_BASE_URL}/api/instructor/my-courses-status`, { headers: { 'x-auth-token': token } })
                        .then(res => res.json())
                        .then(result => {
                            if (result.success) {
                                const courses = result.courses;
                                const publishedCourses = courses.filter(c => c.status === 'Published');
                                const pendingCourses = courses.filter(c => c.status === 'Pending');
                                const draftCourses = courses.filter(c => c.status === 'Draft');
// In main.js, inside the logic for instructor-course.html

const renderCourses = (containerSelector, courseList) => {
    const container = document.querySelector(containerSelector);
    if (!container) return;
    container.innerHTML = '';
    
    if (courseList.length === 0) {
        container.innerHTML = '<div class="col-12"><p>No courses found in this category.</p></div>';
        return;
    }

    courseList.forEach(course => {
        const starsHtml = Array.from({ length: 5 }, (_, i) => `<i class="fas fa-star ${i < (course.rating || 0) ? '' : 'off'}"></i>`).join('');
        
        // --- NEW PRICE LOGIC ---
        let priceHtml = `<span class="current-price">₹${course.price}</span>`;
        // Only show the original price if it exists and is greater than the final price
        if (course.originalPrice && course.originalPrice > course.price) {
            priceHtml += `<span class="off-price">₹${course.originalPrice}</span>`;
        }
        // --- END NEW PRICE LOGIC ---

        const courseCardHtml = `
            <div class="col-lg-4 col-md-6 col-12">
                <div class="rbt-card variation-01 rbt-hover">
                    <div class="rbt-card-img">
                        <a href="course-details.html?courseId=${course._id}">
                            <img src="/${course.thumbnail}" alt="Course thumbnail">
                        </a>
                    </div>
                    <div class="rbt-card-body">
                        <div class="rbt-card-top">
                            <div class="rbt-review">
                                <div class="rating">${starsHtml}</div>
                                <span class="rating-count"> (0 Reviews)</span>
                            </div>
                            <div class="rbt-bookmark-btn">
                                <a class="rbt-round-btn" title="Bookmark" href="#"><i class="feather-bookmark"></i></a>
                            </div>
                        </div>
                        <h4 class="rbt-card-title"><a href="course-details.html?courseId=${course._id}">${course.title}</a></h4>
                        <ul class="rbt-meta">
                            <li><i class="feather-book"></i>${course.episodes ? course.episodes.length : 0} Lessons</li>
                            <li><i class="feather-users"></i>0 Students</li>
                        </ul>
                        <div class="rbt-card-bottom">
                            <div class="rbt-price">${priceHtml}</div>
                            <a class="rbt-btn-link left-icon" href="edit-course.html?courseId=${course._id}"><i class="feather-edit"></i> Edit</a>
                        </div>
                    </div>
                </div>
            </div>
        `;
        container.innerHTML += courseCardHtml;
    });
};
                                renderCourses('#publish-4 .row.g-5', publishedCourses);
                                document.querySelector('#publish-tab-4').addEventListener('click', () => renderCourses('#publish-4 .row.g-5', publishedCourses));
                                document.querySelector('#pending-tab-4').addEventListener('click', () => renderCourses('#pending-4 .row.g-5', pendingCourses));
                                document.querySelector('#draft-tab-4').addEventListener('click', () => renderCourses('#draft-4 .row.g-5', draftCourses));
                            } else {
                                console.error('Failed to fetch courses:', result.message);
                            }
                        })
                        .catch(error => console.error('Error fetching courses:', error));
                };
                fetchAndDisplayCoursesByStatus();
            }
if (window.location.pathname.includes('instructor-announcements.html')) {
    document.addEventListener('DOMContentLoaded', () => {
        // Use the correct keys to get data from localStorage
        const token = localStorage.getItem('lmsToken');
        const userString = localStorage.getItem('lmsUser');

        if (!token || !userString) {
            window.location.href = 'login.html';
            return;
        }
// ADD THIS LINE TO FIX THE HEADER
        updateUserDataOnPage(); 

        const user = JSON.parse(userString);

        // This authorization check will now work correctly
        if (user.role !== 'instructor') {
            alert('Access Denied: You must be an instructor to view this page.');
            window.location.href = 'index.html'; // Redirect to homepage
            return;
        }

       function populateInstructorHeader() {
    const token = localStorage.getItem('lmsToken');
    const userString = localStorage.getItem('lmsUser');

    if (!token || !userString) {
        window.location.href = 'login.html';
        return;
    }

    const localUser = JSON.parse(userString);
    
    // --- Find the HTML elements ---
    const bannerImageEl = document.getElementById('dashboard-banner-image');
    const profileAvatarEl = document.getElementById('dashboard-profile-avatar');
    const instructorNameEl = document.getElementById('dashboard-instructor-name');
    
    // 1. Immediately update the name from the basic data we already have
    if (instructorNameEl) {
        instructorNameEl.textContent = localUser.name || 'Instructor';
    }

    // 2. Fetch the full user profile from the server to get the image URLs
    fetch(`${API_BASE_URL}/api/user/profile`, {
        headers: {
            'x-auth-token': token
        }
    })
    .then(res => res.json())
    .then(result => {
        if (result.success && result.data) {
            const fullProfile = result.data;
            
            // 3. Update the images with the data from the API
            if (profileAvatarEl && fullProfile.avatar) {
                profileAvatarEl.src = `/${fullProfile.avatar}`;
            }
            
            if (bannerImageEl && fullProfile.coverPhoto) {
                bannerImageEl.style.backgroundImage = `url('/${fullProfile.coverPhoto}')`;
            }
        }
    })
    .catch(error => console.error('Error fetching full user profile:', error));
}
// This block tells the browser to run the function on the correct pages
if (window.location.pathname.includes('/instructor-')) {
    document.addEventListener('DOMContentLoaded', populateInstructorHeader);
}
        const fetchAnnouncements = () => {
            const tableBody = document.getElementById('announcements-table-body');
            if (!tableBody) return;

            tableBody.innerHTML = '<tr><td colspan="3" class="text-center">Loading announcements...</td></tr>';

            fetch(`${API_BASE_URL}/api/instructor/announcements`, {
                headers: { 'x-auth-token': token }
            })
            .then(res => res.json())
            .then(result => {
                if (result.success) {
                    tableBody.innerHTML = '';
                    if (result.announcements.length === 0) {
                        tableBody.innerHTML = '<tr><td colspan="3" class="text-center">No announcements found.</td></tr>';
                    } else {
                        result.announcements.forEach(announcement => {
                            const announcementDate = new Date(announcement.date);
                            const formattedDate = announcementDate.toLocaleDateString('en-US', { month: 'long', day: 'numeric', year: 'numeric' });
                            const formattedTime = announcementDate.toLocaleTimeString('en-US', { hour: '2-digit', minute: '2-digit', hour12: true });

                            tableBody.innerHTML += `
                                <tr>
                                    <th>
                                        <span class="h6 mb--5">${formattedDate}</span>
                                        <p class="b3">${formattedTime}</p>
                                    </th>
                                    <td>
                                        <span class="h6 mb--5">${announcement.title}</span>
                                        <p class="b3">Course: ${announcement.course}</p>
                                    </td>
                                    <td>
                                        <div class="rbt-button-group justify-content-end">
                                            <a class="rbt-btn-link left-icon" href="#"><i class="feather-edit"></i> Edit</a>
                                            <a class="rbt-btn-link left-icon" href="#"><i class="feather-trash-2"></i> Delete</a>
                                        </div>
                                    </td>
                                </tr>
                            `;
                        });
                    }
                }
            })
            .catch(error => {
                console.error('Error fetching announcements:', error);
                tableBody.innerHTML = '<tr><td colspan="3" class="text-center">Failed to load announcements.</td></tr>';
            });
        };

        fetchAnnouncements();
    });
}
            if (path.includes('instructor-quiz-attempts.html')) {
                if (!token || user.role !== 'instructor') {
                    alert("Access Denied: You are not an instructor.");
                    window.location.href = '/login';
                    return;
                }
                updateUserDataOnPage();
                const fetchQuizAttempts = () => {
                    const attemptsTableBody = document.querySelector('.rbt-dashboard-table tbody');
                    if (!attemptsTableBody) return;
                    attemptsTableBody.innerHTML = '<tr><td colspan="6" class="text-center">Loading quiz attempts...</td></tr>';
                    fetch(`${API_BASE_URL}/api/instructor/quiz-attempts`, { headers: { 'x-auth-token': token } })
                        .then(res => res.json())
                        .then(result => {
                            if (result.success) {
                                attemptsTableBody.innerHTML = '';
                                if (result.attempts.length === 0) {
                                    attemptsTableBody.innerHTML = '<tr><td colspan="6" class="text-center">No student quiz attempts found.</td></tr>';
                                } else {
                                    result.attempts.forEach((attempt) => {
                                        const resultClass = attempt.result === 'Pass' ? 'bg-color-success-opacity color-success' : 'bg-color-danger-opacity color-danger';
                                        attemptsTableBody.innerHTML += `
                                            <tr>
                                                <th><p class="b3 mb--5">${attempt.date}</p><span class="h6 mb--5">${attempt.quizTitle}</span><p class="b3">Student: <a href="#">${attempt.studentName}</a></p></th>
                                                <td><p class="b3">${attempt.totalQuestions}</p></td>
                                                <td><p class="b3">${attempt.totalMarks}</p></td>
                                                <td><p class="b3">${attempt.correctAnswers}</p></td>
                                                <td><span class="rbt-badge-5 ${resultClass}">${attempt.result}</span></td>
                                                <td><div class="rbt-button-group justify-content-end"><a class="rbt-btn btn-xs bg-primary-opacity radius-round" href="#" title="View"><i class="feather-eye pl--0"></i></a></div></td>
                                            </tr>
                                        `;
                                    });
                                }
                            }
                        })
                        .catch(error => {
                            console.error('Error fetching quiz attempts:', error);
                            attemptsTableBody.innerHTML = '<tr><td colspan="6" class="text-center">Failed to load quiz attempts.</td></tr>';
                        });
                };
                fetchQuizAttempts();
            }
            if (path.includes('instructor-assignments.html')) {
                if (!token || user.role !== 'instructor') {
                    alert("Access Denied: You are not an instructor.");
                    window.location.href = '/login';
                    return;
                }
                updateUserDataOnPage();
                const fetchAssignments = () => {
                    const assignmentsTableBody = document.querySelector('.rbt-dashboard-table tbody');
                    if (!assignmentsTableBody) return;
                    assignmentsTableBody.innerHTML = '<tr><td colspan="4" class="text-center">Loading assignments...</td></tr>';
                    fetch(`${API_BASE_URL}/api/instructor/assignments`, { headers: { 'x-auth-token': token } })
                        .then(res => res.json())
                        .then(result => {
                            if (result.success) {
                                assignmentsTableBody.innerHTML = '';
                                if (result.assignments.length === 0) {
                                    assignmentsTableBody.innerHTML = '<tr><td colspan="4" class="text-center">No assignments found.</td></tr>';
                                } else {
                                    result.assignments.forEach((assignment) => {
                                        assignmentsTableBody.innerHTML += `<tr data-assignment-id="${assignment.id}"><th><span class="h6 mb--5">${assignment.title}</span><p class="b3">Course: <a href="#">${assignment.course}</a></p></th><td><p class="b3">${assignment.totalMarks}</p></td><td><p class="b3">${assignment.totalSubmissions}</p></td><td><div class="rbt-button-group justify-content-end"><a class="rbt-btn btn-xs bg-primary-opacity radius-round edit-assignment" href="#" title="Edit"><i class="feather-edit pl--0"></i> Edit</a><a class="rbt-btn btn-xs bg-color-danger-opacity radius-round color-danger delete-assignment" href="#" title="Delete"><i class="feather-trash-2 pl--0"></i></a></div></td></tr>`;
                                    });
                                    document.querySelectorAll('.edit-assignment').forEach(button => {
                                        button.addEventListener('click', (e) => {
                                            e.preventDefault();
                                            const assignmentId = e.target.closest('tr').dataset.assignmentId;
                                            alert(`Editing assignment with ID: ${assignmentId}`);
                                        });
                                    });
                                    document.querySelectorAll('.delete-assignment').forEach(button => {
                                        button.addEventListener('click', async (e) => {
                                            e.preventDefault();
                                            const assignmentRow = e.target.closest('tr');
                                            const assignmentId = assignmentRow.dataset.assignmentId;
                                            if (confirm('Are you sure you want to delete this assignment?')) {
                                                try {
                                                    const response = await fetch(`${API_BASE_URL}/api/instructor/assignments/${assignmentId}`, {
                                                        method: 'DELETE',
                                                        headers: { 'x-auth-token': token }
                                                    });
                                                    const result = await response.json();
                                                    if (result.success) {
                                                        alert(result.message);
                                                        assignmentRow.remove();
                                                    } else {
                                                        alert(`Error: ${result.message}`);
                                                    }
                                                } catch (error) {
                                                    console.error('Error deleting assignment:', error);
                                                    alert('An error occurred during deletion.');
                                                }
                                            }
                                        });
                                    });
                                }
                            }
                        })
                        .catch(error => {
                            console.error('Error fetching assignments:', error);
                            assignmentsTableBody.innerHTML = '<tr><td colspan="4" class="text-center">Failed to load assignments.</td></tr>';
                        });
                };
                fetchAssignments();
            }
            if (path.includes('instructor-settings.html')) {
                if (!token || user.role !== 'instructor') {
                    alert("Access Denied: You are not an instructor.");
                    window.location.href = '/login';
                    return;
                }
                updateUserDataOnPage();
                const populateSettingsForms = () => {
                    fetch(`${API_BASE_URL}/api/user/profile`, { headers: { 'x-auth-token': token } })
                        .then(res => res.json())
                        .then(result => {
                            if (result.success) {
                                const profile = result.data;
                                const firstNameInput = document.querySelector('#firstname');
                                const lastNameInput = document.querySelector('#lastname');
                                const usernameInput = document.querySelector('#username');
                                const phoneNumberInput = document.querySelector('#phonenumber');
                                const skillInput = document.querySelector('#skill');
                                const bioTextarea = document.querySelector('#bio');
                                const displayNameSelect = document.querySelector('#displayname');
                                if (firstNameInput) firstNameInput.value = profile.firstName || '';
                                if (lastNameInput) lastNameInput.value = profile.lastName || '';
                                if (usernameInput) usernameInput.value = profile.email || '';
                                if (phoneNumberInput) phoneNumberInput.value = profile.phone || '';
                                if (skillInput) skillInput.value = profile.occupation || '';
                                if (bioTextarea) bioTextarea.value = profile.bio || '';
                                if (displayNameSelect) {
                                    displayNameSelect.innerHTML = '';
                                    const nameOptions = [`${profile.firstName} ${profile.lastName}`, profile.firstName, profile.lastName, `${profile.lastName} ${profile.firstName}`, profile.email];
                                    nameOptions.forEach(name => {
                                        const option = document.createElement('option');
                                        option.value = name;
                                        option.textContent = name;
                                        displayNameSelect.appendChild(option);
                                    });
                                }
                            }
                        });
                };
                const profileForm = document.querySelector('#profile-tab-form');
                if (profileForm) {
                    profileForm.addEventListener('submit', (e) => {
                        e.preventDefault();
                        const updatedData = {
                            firstName: document.querySelector('#firstname').value,
                            lastName: document.querySelector('#lastname').value,
                            phone: document.querySelector('#phonenumber').value,
                            occupation: document.querySelector('#skill').value,
                            displayName: document.querySelector('#displayname').value,
                            bio: document.querySelector('#bio').value,
                        };
                        fetch(`${API_BASE_URL}/api/user/profile`, {
                            method: 'PUT',
                            headers: { 'Content-Type': 'application/json', 'x-auth-token': token },
                            body: JSON.stringify(updatedData),
                        })
                            .then(res => res.json())
                            .then(result => {
                                if (result.success) {
                                    alert('Profile updated successfully!');
                                    updateUserDataOnPage();
                                } else {
                                    alert('Error updating profile.');
                                }
                            });
                    });
                }
                const passwordForm = document.querySelector('#password-tab-form');
                if (passwordForm) {
                    passwordForm.addEventListener('submit', (e) => {
                        e.preventDefault();
                        const currentPassword = document.querySelector('#currentpassword').value;
                        const newPassword = document.querySelector('#newpassword').value;
                        const retypeNewPassword = document.querySelector('#retypenewpassword').value;
                        if (newPassword !== retypeNewPassword) {
                            alert('New passwords do not match!');
                            return;
                        }
                        fetch(`${API_BASE_URL}/api/user/password`, {
                            method: 'PUT',
                            headers: { 'Content-Type': 'application/json', 'x-auth-token': token },
                            body: JSON.stringify({ currentPassword, newPassword }),
                        })
                            .then(res => res.json())
                            .then(result => {
                                if (result.success) {
                                    alert('Password updated successfully!');
                                    passwordForm.reset();
                                } else {
                                    alert(`Error: ${result.message}`);
                                }
                            });
                    });
                }
                const socialForm = document.querySelector('#social-tab-form');
                if (socialForm) {
                    socialForm.addEventListener('submit', (e) => {
                        e.preventDefault();
                        const socialData = {
                            facebook: document.querySelector('#facebook').value,
                            twitter: document.querySelector('#twitter').value,
                            linkedin: document.querySelector('#linkedin').value,
                            website: document.querySelector('#website').value,
                            github: document.querySelector('#github').value,
                        };
                        fetch(`${API_BASE_URL}/api/user/social`, {
                            method: 'PUT',
                            headers: { 'Content-Type': 'application/json', 'x-auth-token': token },
                            body: JSON.stringify(socialData),
                        })
                            .then(res => res.json())
                            .then(result => {
                                if (result.success) {
                                    alert('Social links updated successfully!');
                                } else {
                                    alert('Error updating social links.');
                                }
                            });
                    });
                }
                const avatarUploadButton = document.querySelector('#avatar-upload-button');
                const coverUploadButton = document.querySelector('#cover-upload-button');
                if (avatarUploadButton) {
                    const fileInput = document.createElement('input');
                    fileInput.type = 'file'; fileInput.style.display = 'none';
                    avatarUploadButton.addEventListener('click', () => fileInput.click());
                    fileInput.addEventListener('change', (e) => {
                        const formData = new FormData(); formData.append('avatar', e.target.files[0]);
                        fetch(`${API_BASE_URL}/api/user/avatar`, { method: 'POST', headers: { 'x-auth-token': token }, body: formData })
                            .then(res => res.json()).then(result => { if (result.success) { alert('Avatar updated!'); updateUserDataOnPage(); } });
                    });
                }
                if (coverUploadButton) {
                    const fileInput = document.createElement('input');
                    fileInput.type = 'file'; fileInput.style.display = 'none';
                    coverUploadButton.addEventListener('click', (e) => { e.preventDefault(); fileInput.click(); });
                    fileInput.addEventListener('change', (e) => {
                        const formData = new FormData(); formData.append('coverPhoto', e.target.files[0]);
                        fetch(`${API_BASE_URL}/api/user/cover`, { method: 'POST', headers: { 'x-auth-token': token }, body: formData })
                            .then(res => res.json()).then(result => { if (result.success) { alert('Cover photo updated!'); updateUserDataOnPage(); } });
                    });
                }
                populateSettingsForms();
            }
if (window.location.pathname.includes('create-course.html')) {
    document.addEventListener('DOMContentLoaded', () => {
        const token = localStorage.getItem('lmsToken');
        const userString = localStorage.getItem('lmsUser');
        const user = JSON.parse(userString || '{}');

        // Security check
        if (!token || user.role !== 'instructor') {
            alert("Access Denied. You must be an instructor.");
            window.location.href = 'login.html';
            return;
        }

        const courseForm = document.getElementById('create-course-form');
        const thumbnailInput = document.getElementById('createinputfile');
        const thumbnailPreview = document.getElementById('createfileImage');

        // Logic for thumbnail preview
        if (thumbnailInput && thumbnailPreview) {
            thumbnailInput.addEventListener('change', function() {
                if (this.files && this.files[0]) {
                    thumbnailPreview.src = URL.createObjectURL(this.files[0]);
                }
            });
        }

        // Form submission logic
        if (courseForm) {
            courseForm.addEventListener('submit', async (e) => {
                e.preventDefault();
                
                // This automatically gathers all fields from your form
                const formData = new FormData(courseForm);
                // --- ADD THESE TWO LINES TO DEBUG ---
        console.log('Title from form:', formData.get('title'));
        console.log('Thumbnail file from form:', formData.get('thumbnail'));

        // This is a more reliable check
        const thumbnailFile = formData.get('thumbnail');
        if (!formData.get('title') || !thumbnailFile || !thumbnailFile.name) {
             alert('Please provide at least a Course Title and a Thumbnail.');
             return;
        }

                try {
                    const response = await fetch(`${API_BASE_URL}/api/instructor/courses`, {
                        method: 'POST',
                        headers: { 'x-auth-token': token },
                        body: formData,
                    });

                    const result = await response.json();
                    if (result.success) {
                        alert('Course created! You will now be taken to the edit page to add content.');
                        // Redirect to the edit page for the newly created course
                        window.location.href = `edit-course.html?courseId=${result.course._id}`;
                    } else {
                        alert(`Failed to create course: ${result.message}`);
                    }
                } catch (error) {
                    console.error('Error creating course:', error);
                    alert('An error occurred. Please check the console.');
                }
            });
        }
    });
}

// --- NEW LOGIC FOR THE EDIT COURSE PAGE ---
// --- NEW LOGIC FOR THE EDIT COURSE PAGE ---
if (window.location.pathname.includes('edit-course.html')) {
// At the top of your script block
let courseData = null; 
let currentEditingEpisodeId = null;
let currentEditingLessonId = null;

$(document).ready(function () {
    $('#language').selectpicker();
});

    window.openUpdateTopicModal = function(episodeId) {
        currentEditingEpisodeId = episodeId;
        if (courseData) {
            const topic = courseData.episodes.find(ep => ep._id == episodeId);
            if (topic) {
                document.getElementById('update-topic-title').value = topic.title;
                document.getElementById('update-topic-summary').value = topic.summary || '';
            }
        }
    }

    window.openUpdateLessonModal = function(episodeId, lessonId) {
        // --- THIS IS THE NEW LINE TO FIX THE ERROR ---
    const courseId = new URLSearchParams(window.location.search).get('courseId');
        currentEditingEpisodeId = episodeId;
        currentEditingLessonId = lessonId;
        if (courseData) {
            const episode = courseData.episodes.find(ep => ep._id == episodeId);
            if (episode) {
                const lesson = episode.lessons.find(les => les._id == lessonId);
                if (lesson) {
                    document.getElementById('lesson-title').value = lesson.title || '';
                    document.getElementById('lesson-summary').value = lesson.summary || '';
                    document.getElementById('lesson-video-source').value = lesson.vimeoUrl ? 'Vimeo' : 'Select Video Source';
                    document.getElementById('lesson-video-url').value = lesson.vimeoUrl || '';
                    const durationMatch = lesson.duration ? lesson.duration.match(/(\d+)\s*hr\s*(\d+)\s*min\s*(\d+)\s*sec/) : null;
                    document.getElementById('lesson-duration-hr').value = durationMatch ? durationMatch[1] : '0';
                    document.getElementById('lesson-duration-min').value = durationMatch ? durationMatch[2] : '0';
                    document.getElementById('lesson-duration-sec').value = durationMatch ? durationMatch[3] : '0';
                    document.getElementById('lesson-is-preview').checked = lesson.isPreview || false;
                    const modal = document.getElementById('Lesson');
                    modal.querySelector('.modal-title').textContent = 'Update Lesson';
                    modal.querySelector('#save-lesson-btn').innerHTML = `
                        <span class="icon-reverse-wrapper">
                            <span class="btn-text">Update Lesson</span>
                            <span class="btn-icon"><i class="feather-arrow-right"></i></span>
                            <span class="btn-icon"><i class="feather-arrow-right"></i></span>
                        </span>
                    `;
                    // START: Add this new code block
const existingFilesContainer = document.getElementById('existing-exercise-files');
const newFilesListContainer = document.getElementById('new-files-list');
const fileInput = document.getElementById('lesson-exercise-files');

// Clear any previous state
existingFilesContainer.innerHTML = '';
newFilesListContainer.innerHTML = '';
fileInput.value = ''; // Reset file input

if (lesson.exerciseFiles && lesson.exerciseFiles.length > 0) {
    let filesHtml = '<p class="b3 mb-2">Attached Files:</p><br><ul class="list-group list-group-flush">';
    lesson.exerciseFiles.forEach(file => {
        // NOTE: The file.path should be the URL to access the file, e.g., 'uploads/courses/file.pdf'
        filesHtml += `
            <li class="list-group-item d-flex justify-content-between align-items-center">
                <a href="/${file.path}" target="_blank">${file.filename}</a>
                <button type="button" class="btn btn-sm btn-outline-danger remove-existing-file-btn"
                        data-course-id="${courseId}"
                        data-episode-id="${episodeId}"
                        data-lesson-id="${lessonId}"
                        data-file-path="${file.path}">
                    Remove
                </button>
            </li>
        `;
    });
    filesHtml += '</ul>';
    existingFilesContainer.innerHTML = filesHtml;
}
// END: New code block
                }
            }
        }
    }

const renderCourseBuilder = (episodes) => {
    console.trace('renderCourseBuilder was called'); // <-- ADD THIS LINE
    const container = document.getElementById('course-builder-topics-container');
    if (!container) return;

    if (!episodes || episodes.length === 0) {
        container.innerHTML = '<p>No topics yet. Click "Add New Topic" to get started.</p>';
        return;
    }

    container.innerHTML = episodes.map((episode) => {
        const items = [
            ...(episode.lessons || []).map(item => ({ ...item, type: 'lesson' })),
            ...(episode.quizzes || []).map(item => ({ ...item, type: 'quiz' })),
            ...(episode.assignments || []).map(item => ({ ...item, type: 'assignment' }))
        ];

        const itemsHtml = items.map(item => {
            let iconClass = '';
            let editTargetModal = '';

            switch (item.type) {
                case 'lesson':
                    iconClass = 'feather-play-circle';
                    editTargetModal = '#Lesson';
                    break;
                case 'quiz':
                    iconClass = 'feather-help-circle';
                    editTargetModal = '#Quiz';
                    break;
                case 'assignment':
                    iconClass = 'feather-clipboard';
                    editTargetModal = '#Assignment';
                    break;
            }

            return `
            <div class="d-flex justify-content-between rbt-course-wrape mb-4">
                <div class="col-10 inner d-flex align-items-center gap-2">
                    <i class="${iconClass}"></i>
                    <h6 class="rbt-title mb-0">${item.title}</h6>
                    ${item.exerciseFiles && item.exerciseFiles.length > 0 ? '<i class="feather-paperclip ms-2"></i>' : ''}
                </div>
                <div class="col-2 inner">
                    <ul class="rbt-list-style-1 rbt-course-list d-flex gap-2">
                        <li>
                            <i class="feather-trash delete-item" 
                               data-episode-id="${episode._id}" 
                               data-item-id="${item._id}" 
                               data-item-type="${item.type}"></i>
                        </li>
                        <li>
                            <i class="feather-edit edit-item" 
                               data-bs-toggle="modal" 
                               data-bs-target="${editTargetModal}"
                               data-episode-id="${episode._id}" 
                               data-item-id="${item._id}" 
                               data-item-type="${item.type}"></i>
                        </li>
                    </ul>
                </div>
            </div>
            `;
        }).join('');

        return `
        <div class="accordion-item card mb--20">
            <h2 class="accordion-header card-header rbt-course">
                <button class="accordion-button collapsed" type="button" data-bs-toggle="collapse" data-bs-target="#episode-collapse-${episode._id}">
                    ${episode.title}
                </button>
                <span class="rbt-course-icon rbt-course-edit" data-bs-toggle="modal" data-bs-target="#UpdateTopic" onclick="openUpdateTopicModal('${episode._id}')"></span>
                <span class="rbt-course-icon rbt-course-del" data-episode-id="${episode._id}"></span>
            </h2>
            <div id="episode-collapse-${episode._id}" class="accordion-collapse collapse">
                <div class="accordion-body card-body">
                    ${itemsHtml || '<p class="mb-4">No content yet. Use the buttons below to add some.</p>'}
                    
                    <div class="d-flex flex-wrap justify-content-between align-items-center mt-4">
                        <div class="gap-3 d-flex flex-wrap">
                            <button class="rbt-btn btn-border hover-icon-reverse rbt-sm-btn-2 add-content-btn" type="button" data-bs-toggle="modal" data-bs-target="#Lesson" data-episode-id="${episode._id}">
                                <span class="icon-reverse-wrapper"><span class="btn-text">Lesson</span><span class="btn-icon"><i class="feather-plus-square"></i></span><span class="btn-icon"><i class="feather-plus-square"></i></span></span>
                            </button>
                            <button class="rbt-btn btn-border hover-icon-reverse rbt-sm-btn-2 add-content-btn" type="button" data-bs-toggle="modal" data-bs-target="#Quiz" data-episode-id="${episode._id}">
                                <span class="icon-reverse-wrapper"><span class="btn-text">Quiz</span><span class="btn-icon"><i class="feather-plus-square"></i></span><span class="btn-icon"><i class="feather-plus-square"></i></span></span>
                            </button>
                            <button class="rbt-btn btn-border hover-icon-reverse rbt-sm-btn-2 add-content-btn" type="button" data-bs-toggle="modal" data-bs-target="#Assignment" data-episode-id="${episode._id}">
                                <span class="icon-reverse-wrapper"><span class="btn-text">Assignments</span><span class="btn-icon"><i class="feather-plus-square"></i></span><span class="btn-icon"><i class="feather-plus-square"></i></span></span>
                            </button>
                        </div>
                    </div>
                </div>
            </div>
        </div>
        `;
    }).join('');
};



    window.onload = function() {
        // --- AUTH & URL CHECK ---
        if (!token || (user && user.role !== 'instructor')) {
            alert("Access Denied.");
            window.location.href = '/login.html';
            return;
        }
        const params = new URLSearchParams(window.location.search);
        const courseId = params.get('courseId');
        if (!courseId) {
            alert('No course ID found.');
            window.location.href = 'instructor-course.html';
            return;
        }
         // --- NEW DEBUGGING LOGS ---
        console.log('--- DEBUGGING DATA LOAD ---');                               // <-- ADD THIS
        console.log('Window Location Search:', window.location.search);          // <-- ADD THIS
        console.log('Parsed courseId from URL:', courseId);                       // <-- ADD THIS
        // --- END DEBUGGING LOGS ---

// --- COMPLETE QUIZ ADD/EDIT/SAVE LOGIC ---
let currentEditingQuizId = null;

window.openUpdateQuizModal = function(episodeId, quizId) {
    currentEditingEpisodeId = episodeId;
    currentEditingQuizId = quizId;
    if (courseData) {
        const episode = courseData.episodes.find(ep => ep._id == episodeId);
        if (episode && episode.quizzes) {
            const quiz = episode.quizzes.find(q => q._id == quizId);
            if (quiz) {
                document.getElementById('quiz-title').value = quiz.title || '';
                document.getElementById('quiz-summary').value = quiz.summary || '';
            }
        }
    }
};

const quizModalEl = document.getElementById('Quiz');
if (quizModalEl) {
    const steps = quizModalEl.querySelectorAll('.question');
    const nextBtn = document.getElementById('quiz-next-btn');
    const backBtn = document.getElementById('quiz-back-btn');
    const finalSaveBtn = document.getElementById('quiz-save-final-btn');
    const progressSteps = quizModalEl.querySelectorAll('.quiz-modal-btn');
    const firstProgressStep = quizModalEl.querySelector('.quiz-modal-btn');

    let currentStep = 1;

    const updateQuizModalView = () => {
        steps.forEach(step => step.style.display = 'none');
        const currentStepEl = quizModalEl.querySelector(`#question-${currentStep}`);
        if(currentStepEl) currentStepEl.style.display = 'block';

        progressSteps.forEach((btn, index) => {
            btn.classList.toggle('quiz-modal__active', index + 1 < currentStep);
        });
        
        backBtn.style.display = (currentStep > 1) ? 'inline-block' : 'none';
        nextBtn.style.display = (currentStep < steps.length) ? 'inline-block' : 'none';
        finalSaveBtn.style.display = (currentStep === steps.length) ? 'inline-block' : 'none';
    };

    if(firstProgressStep) {
        firstProgressStep.addEventListener('reset', () => {
            currentStep = 1;
            updateQuizModalView();
        });
    }

    quizModalEl.addEventListener('show.bs.modal', (e) => {
        const button = e.relatedTarget;
        if (button && button.classList.contains('add-content-btn')) {
            currentEditingEpisodeId = button.dataset.episodeId;
            currentEditingQuizId = null;
            
            document.getElementById('quiz-title').value = '';
            document.getElementById('quiz-summary').value = '';

            currentStep = 1;
            updateQuizModalView();
        }
    });

    finalSaveBtn.addEventListener('click', async () => {
        finalSaveBtn.disabled = true;
        finalSaveBtn.textContent = 'Saving...';

        try {
            const episodeId = currentEditingEpisodeId;
            if (!episodeId) throw new Error('No topic selected.');

            const quizData = {
                title: document.getElementById('quiz-title').value,
                summary: document.getElementById('quiz-summary').value,
            };
            if (!quizData.title) throw new Error('Please enter a quiz title.');

            const courseId = new URLSearchParams(window.location.search).get('courseId');
            
            const isEditing = !!currentEditingQuizId;
            const method = isEditing ? 'PUT' : 'POST';
            const url = isEditing ?
                `${API_BASE_URL}/api/courses/${courseId}/episodes/${episodeId}/quizzes/${currentEditingQuizId}` :
                `${API_BASE_URL}/api/courses/${courseId}/episodes/${episodeId}/quizzes`;

            const response = await fetch(url, {
                method: method,
                headers: { 'Content-Type': 'application/json', 'x-auth-token': token },
                body: JSON.stringify(quizData)
            });

            const result = await response.json();

            if (result.success) {
                courseData = result.course;
                renderCourseBuilder(courseData.episodes);
                bootstrap.Modal.getInstance(quizModalEl).hide();
            } else {
                throw new Error(result.message);
            }
        } catch (error) {
            console.error('Error saving quiz:', error);
            alert(`An error occurred: ${error.message}`);
        } finally {
            finalSaveBtn.disabled = false;
            finalSaveBtn.textContent = 'Save Quiz';
        }
    });
}
// --- Logic for custom file upload button ---
const triggerBtn = document.getElementById('triggerFileUploadBtn');
const fileInput = document.getElementById('lessonExerciseInput');
const fileListContainer = document.getElementById('exerciseFileListContainer');

if (triggerBtn && fileInput) {
    // When the visible button is clicked, trigger the hidden file input
    triggerBtn.addEventListener('click', () => {
        fileInput.click();
    });

    // When files are selected, display their names
    fileInput.addEventListener('change', () => {
        if (fileListContainer) {
            fileListContainer.innerHTML = ''; // Clear previous list
            if (fileInput.files.length > 0) {
                let fileListHtml = '<p class="b3 mb-2">Selected Files:</p><ul class="list-group">';
                Array.from(fileInput.files).forEach(file => {
                    fileListHtml += `<li class="list-group-item list-group-item-sm">${file.name}</li>`;
                });
                fileListHtml += '</ul>';
                fileListContainer.innerHTML = fileListHtml;
            }
        }
    });
}


        // --- DEFINE ALL PAGE ELEMENTS ---
        const editCourseForm = document.getElementById('create-course-form');
        const courseTitleInput = document.getElementById('field-1');
        const slugInput = document.getElementById('field-2');
        const descriptionInput = document.getElementById('aboutCourse');
        const priceInput = document.getElementById('regularPrice-1');
        const discountedPriceInput = document.getElementById('discountedPrice-1');
        const videoUrlInput = document.getElementById('videoUrl');
        const thumbnailInput = document.getElementById('createinputfile');
        const thumbnailPreview = document.getElementById('createfileImage');
        const submitButton = document.getElementById('create-course-btn');
        const courseStatusSelect = document.getElementById('course-status');
        const previewButton = document.getElementById('preview-course-btn');
        const addTopicModal = document.getElementById('exampleModal');
        const updateTopicModal = document.getElementById('UpdateTopic');
        const saveTopicBtn = document.getElementById('save-topic-btn');
        const saveUpdateTopicBtn = document.getElementById('save-update-topic-btn');
        const lessonModal = document.getElementById('Lesson');
        const saveLessonBtn = document.getElementById('save-lesson-btn');
        

        if (submitButton) {
            const buttonText = submitButton.querySelector('.btn-text');
            if (buttonText) buttonText.textContent = 'Update Course';
        }
    // ADD THIS EVENT LISTENER FOR THE REMOVE BUTTON
    document.getElementById('remove-exercise-file-btn')?.addEventListener('click', () => {
        document.getElementById('current-exercise-file-container').style.display = 'none';
        document.getElementById('remove-exercise-file-flag').value = 'true';
        document.getElementById('lesson-exercise-file').value = '';
        document.getElementById('exercise-file-name').textContent = '';
    });
    // --- Display Names of Newly Selected Exercise Files ---
const lessonFileInput = document.getElementById('lesson-exercise-files');
if (lessonFileInput) {
    lessonFileInput.addEventListener('change', function() {
        const newFilesListContainer = document.getElementById('new-files-list');
        newFilesListContainer.innerHTML = ''; // Clear previous selection list

        if (this.files.length > 0) {
            let filesHtml = '<p class="b3 mb-2">Files to be uploaded:</p><ul class="list-group list-group-flush">';
            
            // Loop through the FileList and create a list item for each file
            Array.from(this.files).forEach(file => {
                filesHtml += `<li class="list-group-item list-group-item-action">${file.name}</li>`;
            });

            filesHtml += '</ul>';
            newFilesListContainer.innerHTML = filesHtml;
        }
    });
}
        // --- FETCH AND POPULATE ALL DATA ON PAGE LOAD ---
fetch(`${API_BASE_URL}/api/courses/edit/${courseId}`, { headers: { 'x-auth-token': token } })
    .then(res => res.ok ? res.json() : Promise.reject('Course not found'))
    .then(result => {
        if (result.success) {
            const course = result.course;
            courseData = course;
            
            console.log('Loading course data from server:', {
                whatYoullLearn: course.whatYoullLearn,
                tags: course.tags,
                duration: course.duration,
                requirements: course.requirements
            });

            // Basic fields
            if (courseTitleInput) courseTitleInput.value = course.title || '';
            if (slugInput) slugInput.value = course.slug || '';
            if (descriptionInput) course.description ? descriptionInput.value = course.description : '';
            if (priceInput) course.originalPrice ? priceInput.value = course.originalPrice : '';
            if (discountedPriceInput) course.price ? discountedPriceInput.value = course.price : '';
            if (videoUrlInput) videoUrlInput.value = course.previewVideoUrl || '';
            if (thumbnailPreview && course.thumbnail) thumbnailPreview.src = `/${course.thumbnail}`;
            if (courseStatusSelect) courseStatusSelect.value = course.status || 'Draft';
            
            // Additional Information fields - FIXED
            if (course.startDate) {
                try {
                    const date = new Date(course.startDate);
                    if (!isNaN(date)) {
                        document.getElementById('startDate').value = date.toISOString().split('T')[0];
                    }
                } catch (e) {
                    console.error('Error parsing startDate:', e);
                }
            }
            
            // Language - handle both array and string
            if (course.language && course.language.length > 0) {
                const languageSelect = document.getElementById('language');
                if (languageSelect) {
                    Array.from(languageSelect.options).forEach(option => {
                        option.selected = course.language.includes(option.value);
                    });
                }
            }
            
            // Get all HTML elements
            const whatLearnElement = document.getElementById('whatLearn');
            const descriptionElement = document.getElementById('description');
            const durationHoursElement = document.getElementById('totalDurationHours');
            const durationMinutesElement = document.getElementById('totalDurationMinutes');
            const courseTagElement = document.getElementById('courseTag');
            const targetedElement = document.getElementById('targeted');
            
            console.log('HTML elements status:', {
                whatLearn: !!whatLearnElement,
                description: !!descriptionElement,
                durationHours: !!durationHoursElement,
                durationMinutes: !!durationMinutesElement,
                courseTag: !!courseTagElement,
                targeted: !!targetedElement
            });
            
            // Populate fields - with null checks and fallbacks
            if (whatLearnElement) {
                whatLearnElement.value = course.requirements ? 
                    (Array.isArray(course.requirements) ? course.requirements.join('\n') : course.requirements) : '';
                console.log('Set requirements to:', whatLearnElement.value);
            }
            
            if (descriptionElement) {
                descriptionElement.value = course.whatYoullLearn ? 
                    (Array.isArray(course.whatYoullLearn) ? course.whatYoullLearn.join('\n') : course.whatYoullLearn) : '';
                console.log('Set whatYoullLearn to:', descriptionElement.value);
            }
            
            if (durationHoursElement) {
                durationHoursElement.value = course.duration && course.duration.hours ? course.duration.hours : 0;
                console.log('Set duration hours to:', durationHoursElement.value);
            }
            
            if (durationMinutesElement) {
                durationMinutesElement.value = course.duration && course.duration.minutes ? course.duration.minutes : 0;
                console.log('Set duration minutes to:', durationMinutesElement.value);
            }
            
            if (courseTagElement) {
                courseTagElement.value = course.tags ? 
                    (Array.isArray(course.tags) ? course.tags.join(', ') : course.tags) : '';
                console.log('Set tags to:', courseTagElement.value);
            }
            
            if (targetedElement) {
                targetedElement.value = course.targetedAudience ? 
                    (Array.isArray(course.targetedAudience) ? course.targetedAudience.join('\n') : course.targetedAudience) : '';
                console.log('Set targetedAudience to:', targetedElement.value);
            }
            
            // Certificate template
            if (course.certificateTemplate && course.certificateTemplate !== 'none') {
                const selectedRadio = document.querySelector(`input[value="${course.certificateTemplate}"]`);
                if (selectedRadio) {
                    selectedRadio.checked = true;
                    console.log('Set certificate template to:', course.certificateTemplate);
                }
                
                if (course.certificateOrientation === 'portrait') {
                    const portraitTab = document.getElementById('portrait-tab');
                    if (portraitTab) {
                        portraitTab.click();
                        console.log('Set orientation to portrait');
                    }
                }
                
            }
            
            renderCourseBuilder(course.episodes);
        }
    })
    .catch(error => {
        console.error('Error loading course:', error);
        alert(`Error loading course data.`);
        window.location.href = 'instructor-course.html';
    });

        // --- EVENT LISTENERS ---

        // Preview Button
        if (previewButton) {
            previewButton.addEventListener('click', (e) => {
                e.preventDefault();
                window.open(`course-details.html?courseId=${courseId}`, '_blank');
            });
        }

// Lesson Modal Setup
// --- CORRECTED: Lesson Modal Setup Listener ---
if (lessonModal) {
    lessonModal.addEventListener('show.bs.modal', (e) => {
        const button = e.relatedTarget; // This is the button that triggered the modal

        // Check if the modal was opened by an "Add" button (which has the new class)
        // This condition is true for "Add Lesson" but false for "Edit Lesson"
        if (button && button.classList.contains('add-content-btn')) {

            currentEditingEpisodeId = button.dataset.episodeId;
            currentEditingLessonId = null; // Crucial: ensure we are in "Add" mode

            // 1. Reset the form to its empty state
            document.getElementById('lesson-form').reset();

            // 2. Reset modal title and button text
            lessonModal.querySelector('.modal-title').textContent = 'Add Lesson';
            const saveBtn = lessonModal.querySelector('#save-lesson-btn');
            saveBtn.innerHTML = `
                <span class="icon-reverse-wrapper">
                    <span class="btn-text">Add Lesson</span>
                    <span class="btn-icon"><i class="feather-arrow-right"></i></span>
                    <span class="btn-icon"><i class="feather-arrow-right"></i></span>
                </span>
            `;

            // 3. Clear any file lists from a previous edit session
            document.getElementById('existing-exercise-files').innerHTML = '';
            document.getElementById('new-files-list').innerHTML = '';
        }
    });
}
        // Save Lesson Button
if (saveLessonBtn) {
    saveLessonBtn.addEventListener('click', async () => {
        const title = document.getElementById('lesson-title').value;
        const summary = document.getElementById('lesson-summary').value;
        const videoSource = document.getElementById('lesson-video-source').value;
        const vimeoUrl = videoSource === 'Vimeo' ? document.getElementById('lesson-video-url').value : '';
        const hr = document.getElementById('lesson-duration-hr').value || '0';
        const min = document.getElementById('lesson-duration-min').value || '0';
        const sec = document.getElementById('lesson-duration-sec').value || '0';
        const duration = `${hr} hr ${min} min ${sec} sec`;
        const isPreview = document.getElementById('lesson-is-preview').checked;
        
        // --- THIS IS THE CORRECTED LINE ---
        const exerciseFileInput = document.getElementById('lesson-exercise-files'); 
        
        const episodeId = currentEditingEpisodeId;

        if (!title) return alert('Please enter a lesson title.');
        if (!episodeId) return alert('No episode selected. Please try again.');

        try {
            const formData = new FormData();
            formData.append('title', title);
            formData.append('summary', summary);
            formData.append('vimeoUrl', vimeoUrl);
            formData.append('duration', duration);
            formData.append('isPreview', isPreview);

            if (exerciseFileInput && exerciseFileInput.files.length > 0) {
                for (const file of exerciseFileInput.files) {
                    formData.append('exerciseFiles', file);
                }
            }

            const url = currentEditingLessonId 
                ? `${API_BASE_URL}/api/courses/${courseId}/episodes/${episodeId}/lessons/${currentEditingLessonId}`
                : `${API_BASE_URL}/api/courses/${courseId}/episodes/${episodeId}/lessons`;
            const method = currentEditingLessonId ? 'PUT' : 'POST';

            const response = await fetch(url, {
                method,
                headers: { 'x-auth-token': token },
                body: formData
            });
            const result = await response.json();
            if (result.success) {
                courseData = result.course;
                renderCourseBuilder(courseData.episodes);
                bootstrap.Modal.getInstance(lessonModal).hide();
                lessonModal.querySelector('form')?.reset();
                if (exerciseFileInput) exerciseFileInput.value = '';
                lessonModal.querySelector('.modal-title').textContent = 'Add Lesson';
                lessonModal.querySelector('#save-lesson-btn').innerHTML = `
                    <span class="icon-reverse-wrapper">
                        <span class="btn-text">Add Lesson</span>
                        <span class="btn-icon"><i class="feather-arrow-right"></i></span>
                        <span class="btn-icon"><i class="feather-arrow-right"></i></span>
                    </span>
                `;
                currentEditingLessonId = null;
                currentEditingEpisodeId = null;
            } else {
                alert(`Error: ${result.message}`);
            }
        } catch (error) {
            console.error('Error saving lesson:', error);
            alert('An error occurred while saving the lesson.');
        }
    });
}

        // Delete Lesson Event Listener
        document.addEventListener('click', async (e) => {
            const deleteLessonBtn = e.target.closest('.delete-lesson');
            if (deleteLessonBtn) {
                if (confirm('Are you sure you want to delete this lesson?')) {
                    const episodeId = deleteLessonBtn.dataset.episodeId;
                    const lessonId = deleteLessonBtn.dataset.lessonId;
                    try {
                        const response = await fetch(`${API_BASE_URL}/api/courses/${courseId}/episodes/${episodeId}/lessons/${lessonId}`, {
                            method: 'DELETE',
                            headers: { 'x-auth-token': token }
                        });
                        const result = await response.json();
                        if (result.success) {
                            courseData = result.course;
                            renderCourseBuilder(courseData.episodes);
                        } else {
                            alert(`Error: ${result.message}`);
                        }
                    } catch (error) {
                        console.error('Error deleting lesson:', error);
                        alert('An error occurred while deleting the lesson.');
                    }
                }
            }
        });
        // --- NEW: Remove Exercise File Event Listener ---
document.addEventListener('click', async (e) => {
    const removeBtn = e.target.closest('.remove-existing-file-btn');
    if (removeBtn) {
        e.preventDefault(); // Prevent any default button action

        if (confirm('Are you sure you want to remove this file?')) {
            const { courseId, episodeId, lessonId, filePath } = removeBtn.dataset;
            
            try {
                const response = await fetch(`${API_BASE_URL}/api/courses/${courseId}/episodes/${episodeId}/lessons/${lessonId}/files`, {
                    method: 'DELETE',
                    headers: {
                        'Content-Type': 'application/json',
                        'x-auth-token': token
                    },
                    body: JSON.stringify({ filePath: filePath }) // Send the file path to identify which file to delete
                });

                const result = await response.json();

                if (result.success) {
                    // Update global data and re-render the main list
                    courseData = result.course;
                    renderCourseBuilder(courseData.episodes);
                    
                    // Visually remove the file from the modal list immediately
                    removeBtn.closest('li').remove(); 
                    
                    // Optional: If the list is now empty, remove the "Attached Files" heading
                    const fileList = removeBtn.closest('ul');
                    if (fileList && fileList.children.length === 0) {
                        fileList.previousElementSibling.remove(); // Removes the <p> heading
                        fileList.remove();
                    }
                } else {
                    alert(`Error: ${result.message}`);
                }
            } catch (error) {
                console.error('Error removing exercise file:', error);
                alert('An error occurred while removing the file.');
            }
        }
    }
});
// --- CORRECTED: Generic Edit Item Event Listener ---
document.addEventListener('click', async (e) => {
    const editBtn = e.target.closest('.edit-item'); 
    if (editBtn) {
        const { episodeId, itemId, itemType } = editBtn.dataset; 

        if (itemType === 'lesson') {
            openUpdateLessonModal(episodeId, itemId); 
            const lessonModalInstance = bootstrap.Modal.getOrCreateInstance(document.getElementById('Lesson'));
            lessonModalInstance.show();
        } 
        else if (itemType === 'quiz') {
            openUpdateQuizModal(episodeId, itemId);

            // This resets the quiz modal to step 1 when editing
            const quizNav = document.querySelector('#Quiz .quiz-modal-btn');
            if (quizNav) quizNav.dispatchEvent(new Event('reset'));

            const quizModalInstance = bootstrap.Modal.getOrCreateInstance(document.getElementById('Quiz'));
            quizModalInstance.show();
        }
    }
});
// Add this event listener for lesson clicks
document.addEventListener('click', function(e) {
    const lessonLink = e.target.closest('.lesson-link');
    if (lessonLink) {
        e.preventDefault();
        
        const courseId = new URLSearchParams(window.location.search).get('courseId');
        const episodeId = lessonLink.dataset.episodeId;
        const lessonId = lessonLink.dataset.lessonId;
        const lessonTitle = lessonLink.dataset.title;
        const lessonSummary = lessonLink.dataset.summary;
        const vimeoUrl = lessonLink.dataset.vimeoUrl;
        
        // Store lesson data for lesson.html
        localStorage.setItem('currentLesson', JSON.stringify({
            courseId,
            episodeId,
            lessonId,
            title: lessonTitle,
            summary: lessonSummary,
            vimeoUrl: vimeoUrl
        }));
        
        // Navigate to lesson page
        window.location.href = `lesson.html?courseId=${courseId}&episodeId=${episodeId}&lessonId=${lessonId}`;
    }
});
        // "Add Topic" Modal Save Button
        if (saveTopicBtn) {
            saveTopicBtn.addEventListener('click', async () => {
                const title = document.getElementById('add-topic-title').value;
                const summary = document.getElementById('add-topic-summary').value;
                if (!title) { return alert('Please enter a topic name.'); }

                try {
                    const response = await fetch(`${API_BASE_URL}/api/courses/${courseId}/episodes`, {
                        method: 'POST',
                        headers: { 'Content-Type': 'application/json', 'x-auth-token': token },
                        body: JSON.stringify({ title, summary }),
                    });
                    const result = await response.json();
                    if (result.success) {
                        courseData = result.course;
                        renderCourseBuilder(courseData.episodes);
                        bootstrap.Modal.getInstance(addTopicModal).hide();
                        document.getElementById('add-topic-title').value = '';
                        document.getElementById('add-topic-summary').value = '';
                    } else {
                        alert(`Error: ${result.message}`);
                    }
                } catch (error) {
                    alert('An error occurred while saving the topic.');
                }
            });
        }

        // Delete Topic Event Listener
        document.addEventListener('click', async (e) => {
            const deleteBtn = e.target.closest('.rbt-course-del');
            if (deleteBtn) {
                if (confirm('Are you sure you want to delete this topic?')) {
                    const episodeId = deleteBtn.dataset.episodeId;
                    try {
                        const response = await fetch(`${API_BASE_URL}/api/courses/${courseId}/episodes/${episodeId}`, {
                            method: 'DELETE',
                            headers: { 'x-auth-token': token }
                        });
                        const result = await response.json();
                        if (result.success) {
                            courseData = result.course;
                            renderCourseBuilder(courseData.episodes);
                        } else {
                            alert(`Error: ${result.message}`);
                        }
                    } catch (error) {
                        console.error('Error deleting topic:', error);
                        alert('An error occurred while deleting the topic.');
                    }
                }
            }
        });

        // Update Topic Save Button
        if (saveUpdateTopicBtn) {
            saveUpdateTopicBtn.addEventListener('click', async () => {
                const episodeId = currentEditingEpisodeId;
                if (!episodeId) return alert('No topic selected for editing.');
                const title = document.getElementById('update-topic-title').value;
                const summary = document.getElementById('update-topic-summary').value;
                try {
                    const response = await fetch(`${API_BASE_URL}/api/courses/${courseId}/episodes/${episodeId}`, {
                        method: 'PUT',
                        headers: { 'Content-Type': 'application/json', 'x-auth-token': token },
                        body: JSON.stringify({ title, summary })
                    });
                    const result = await response.json();
                    if (result.success) {
                        courseData = result.course;
                        renderCourseBuilder(courseData.episodes);
                        bootstrap.Modal.getInstance(updateTopicModal).hide();
                    } else {
                        alert(`Error: ${result.message}`);
                    }
                } catch (error) {
                    console.error('Error updating topic:', error);
                    alert('An error occurred while updating the topic.');
                }
            });
        }

        // Main "Update Course" Form
if (editCourseForm) {
    editCourseForm.addEventListener('submit', async (e) => {
        e.preventDefault();
        const formData = new FormData();
        
        // Basic fields
        formData.append('title', document.getElementById('field-1').value);
        formData.append('slug', document.getElementById('field-2').value);
        formData.append('description', document.getElementById('aboutCourse').value);
        formData.append('originalPrice', document.getElementById('regularPrice-1').value);
        formData.append('price', document.getElementById('discountedPrice-1').value);
        formData.append('previewVideoUrl', document.getElementById('videoUrl').value);
        formData.append('status', document.getElementById('course-status').value);
        
        // Additional Information fields - CORRECTED FIELD NAMES
        formData.append('startDate', document.getElementById('startDate')?.value || '');
        
        // Language
        const languageSelect = document.getElementById('language');
        if (languageSelect) {
            const selectedLanguages = Array.from(languageSelect.selectedOptions).map(opt => opt.value);
            formData.append('language', JSON.stringify(selectedLanguages));
        }
        
        // Use the correct field names that match your model:
        formData.append('requirements', document.getElementById('whatLearn')?.value || '');
        formData.append('whatYoullLearn', document.getElementById('description')?.value || ''); // This matches your model
        formData.append('durationHours', document.getElementById('totalDurationHours')?.value || '0');
        formData.append('durationMinutes', document.getElementById('totalDurationMinutes')?.value || '0');
        formData.append('tags', document.getElementById('courseTag')?.value || ''); // This matches your model
        formData.append('targetedAudience', document.getElementById('targeted')?.value || '');
        
        // Certificate fields
        const selectedTemplate = document.querySelector('input[name="radio-group"]:checked') || 
                               document.querySelector('input[name="radio-group-portrait"]:checked');
        if (selectedTemplate) {
            formData.append('certificateTemplate', selectedTemplate.value);
        }
        
        const activeTab = document.querySelector('.advance-tab-button a.active');
        if (activeTab) {
            const orientation = activeTab.id === 'landscape-tab' ? 'landscape' : 'portrait';
            formData.append('certificateOrientation', orientation);
        }
        
        if (thumbnailInput.files.length > 0) {
            formData.append('thumbnail', thumbnailInput.files[0]);
        }

        // Debug log
        console.log('FormData being sent:');
        for (let [key, value] of formData.entries()) {
            console.log(key + ':', value);
        }

        try {
            const response = await fetch(`${API_BASE_URL}/api/courses/${courseId}`, {
                method: 'PUT',
                headers: { 'x-auth-token': token },
                body: formData,
            });
            const result = await response.json();
            console.log('Server response:', result);
            
            if (result.success) {
                alert('Course updated successfully!');
                window.location.href = '/instructor-course.html';
            } else {
                alert(`Error: ${result.message}`);
            }
        } catch (error) {
            console.error('Error updating course:', error);
            alert('An error occurred while updating the course.');
        }
    });
}
    }; // End of window.onload
}

if (window.location.pathname.includes('course-details.html')) {

    // These functions are now defined outside for better structure.
    // They are no longer hidden inside another function.
function renderLessons(lessons, episodeId, courseId) {
    if (!lessons || lessons.length === 0) {
        return '<p class="text-muted">No lessons in this topic yet.</p>';
    }

    return `
        <ul class="rbt-course-main-content liststyle">
            ${lessons.map(lesson => `
                <li>
                    <a href="lesson.html?courseId=${courseId}&episodeId=${episodeId}&lessonId=${lesson._id}" class="lesson-link">
                        <div class="course-content-left">
                            <i class="feather-${lesson.vimeoUrl ? 'play-circle' : 'file-text'}"></i>
                            
                            <div class="title-summary-wrapper">
                                <span class="text">${lesson.title}</span>
                                ${lesson.summary ? `<small class="text-muted">${lesson.summary}</small>` : ''}
                            </div>

                        </div>
                        <div class="course-content-right">
                            ${lesson.duration ? `<span class="min-lable">${lesson.duration}</span>` : ''}
                            ${lesson.isPreview ? '<span class="rbt-badge-5 bg-primary-opacity">Preview</span>' : ''}
                        </div>
                    </a>
                </li>
            `).join('')}
        </ul>
    `;
}

    function renderCourseContent(episodes, courseId) {
        console.log('renderCourseContent received courseId:', courseId);
        const courseContentContainer = document.getElementById('coursecontent');
        if (!courseContentContainer || !episodes || episodes.length === 0) {
            return;
        }

        const accordionContainer = courseContentContainer.querySelector('.rbt-accordion-02.accordion');
        if (!accordionContainer) {
            console.error('Accordion container not found');
            return;
        }

        accordionContainer.innerHTML = ''; // Clear existing content

        episodes.forEach((episode, index) => {
            const episodeElement = document.createElement('div');
            episodeElement.className = 'accordion-item card';
            const lessonCount = episode.lessons ? episode.lessons.length : 0;
            
            episodeElement.innerHTML = `
                <h2 class="accordion-header card-header" id="headingTwo${index}">
                    <button class="accordion-button ${index > 0 ? 'collapsed' : ''}" type="button" 
                            data-bs-toggle="collapse" data-bs-target="#collapseTwo${index}" 
                            aria-expanded="${index === 0 ? 'true' : 'false'}" 
                            aria-controls="collapseTwo${index}">
                        <div class="title-summary-wrapper">
        <span>${episode.title}</span>
        ${episode.summary ? `<small class="text-muted">${episode.summary}</small>` : ''}
    </div>
    <span class="rbt-badge-5 ml--10">${lessonCount} Lesson${lessonCount !== 1 ? 's' : ''}</span>
                    </button>
                </h2>
                <div id="collapseTwo${index}" class="accordion-collapse collapse ${index === 0 ? 'show' : ''}" 
                     aria-labelledby="headingTwo${index}">
                    <div class="accordion-body card-body pr--0">
                        ${renderLessons(episode.lessons, episode._id, courseId)}
                    </div>
                </div>
            `;
            accordionContainer.appendChild(episodeElement);
        });
    }


    // This is the main function that runs when the page loads
    document.addEventListener('DOMContentLoaded', () => {
const populateCourseDetails = async () => {
    const urlParams = new URLSearchParams(window.location.search);
    const courseId = urlParams.get('courseId');
    if (!courseId) {
        document.body.innerHTML = '<h1>Error: Course ID is missing.</h1>';
        return;
    };

    try {
        const response = await fetch(`${API_BASE_URL}/api/courses/${courseId}`);
        const result = await response.json();

        if (result.success) {
            const course = result.course;

            // --- 1. Populate Header Section ---
            document.getElementById('course-title').textContent = course.title;
            document.getElementById('course-subtitle').textContent = course.description.substring(0, 100) + '...';
            // --- 2. Populate Instructor Info & Avatar ---
            if (course.instructor) {
                const instructorName = `${course.instructor.firstName} ${course.instructor.lastName}`;
                document.getElementById('instructor-info').innerHTML = `By <a href="#">${instructorName}</a>`;
                const instructorAvatar = document.getElementById('instructor-avatar');
                if (instructorAvatar && course.instructor.avatar) {
                    instructorAvatar.src = `/${course.instructor.avatar}`;
                    instructorAvatar.alt = instructorName;
                }
            }

            // --- 3. Populate Video/Thumbnail ---
            document.getElementById('course-thumbnail').src = `/${course.thumbnail}`;
// --- DEBUGGING THE SIDEBAR THUMBNAIL ---
try {
    console.log('Attempting to find sidebar thumbnail...');
    
    const sidebarImage = document.getElementById('sidebar-thumbnail');
    console.log('Found the sidebar image element:', sidebarImage); // This will show us if the element was found or if it's null
    
    if (sidebarImage) {
        sidebarImage.src = `/${course.thumbnail}`;
        console.log('Successfully updated sidebar image src.');
    } else {
        console.error('ERROR: Could not find the HTML element with id="sidebar-thumbnail"!');
    }
} catch (error) {
    console.error('CRITICAL ERROR while trying to update sidebar image:', error);
}
if (course.previewVideoUrl) {
    // Update both video links
    document.getElementById('video-preview-link').href = course.previewVideoUrl;
    
    const sidebarVideoLink = document.getElementById('sidebar-video-link');
    if (sidebarVideoLink) {
        sidebarVideoLink.href = course.previewVideoUrl;
    }
}
// --- END OF DEBUGGING BLOCK ---
            // --- 4. Populate Main Content Overview ---
            const overviewContainer = document.querySelector('#overview .rbt-course-feature-inner');
            if (overviewContainer) {
                overviewContainer.innerHTML = `<div class="section-title"><h4 class="rbt-title-style-3">Overview</h4></div><p>${course.description}</p>`;
            }

            // --- 5. Populate Course Content Accordion ---
            renderCourseContent(course.episodes, course._id);

            // --- 6. Display Certificate Information ---
            const certificateSection = document.getElementById('course-certificate-section');
            const certificateImage = document.getElementById('course-certificate');
            const certificateInfo = document.getElementById('certificate-info');
            if (certificateSection && certificateImage && certificateInfo) {
                if (course.certificateTemplate && course.certificateTemplate !== 'none') {
                    certificateSection.style.display = 'block';
                    const templateImages = { 'option1': 'assets/images/icons/certificate-none.svg', 'option2': 'assets/images/others/preview-01.png', 'option3': 'assets/images/others/preview-02.png', 'option4': 'assets/images/others/preview-03.png', 'option5': 'assets/images/others/preview-04.png', 'option6': 'assets/images/others/preview-05.png', 'optionport1': 'assets/images/icons/certificate-none-portrait.svg', 'optionport2': 'assets/images/others/preview-port-01.png', 'optionport3': 'assets/images/others/preview-port-02.png', 'optionport4': 'assets/images/others/preview-port-03.png', 'optionport5': 'assets/images/others/preview-port-05.png', 'optionport6': 'assets/images/others/preview-port-06.png' };
                    const imagePath = templateImages[course.certificateTemplate];
                    if (imagePath) {
                        certificateImage.src = imagePath;
                        certificateImage.alt = 'Course Completion Certificate';
                    }
                    certificateInfo.textContent = `This course includes a ${course.certificateOrientation} certificate upon completion.`;
                } else {
                    certificateSection.style.display = 'none';
                }
            }
            
            // --- 7. Populate Sidebar Price and Button ---
            const priceContainer = document.getElementById('my-custom-price-display');
            const buttonContainer = document.querySelector('.add-to-card-button');
            if (priceContainer) {
                let priceHtml = '';
                if (course.price && course.price > 0) {
                    const originalPriceHtml = (course.originalPrice && course.originalPrice > course.price) ? `<span class="off-price">₹${course.originalPrice.toLocaleString('en-IN')}</span>` : '';
                    priceHtml = `<div class="rbt-price"><span class="current-price">₹${course.price.toLocaleString('en-IN')}</span>${originalPriceHtml}</div>`;
                    if (buttonContainer) {
                        buttonContainer.innerHTML = `<a class="rbt-btn btn-border-gradient radius-round hover-icon-reverse w-100 d-block text-center" href="#"><span class="btn-text">Add to Cart</span><span class="btn-icon"><i class="feather-arrow-right"></i></span></a>`;
                    }
                } else {
                    priceHtml = `<div class="rbt-price"><span class="current-price">Free</span></div>`;
                    if (buttonContainer) {
                        buttonContainer.innerHTML = `<a class="rbt-btn btn-border-gradient hover-icon-reverse w-100 d-block text-center" href="#"><span class="btn-text">Enroll Now</span><span class="btn-icon"><i class="feather-arrow-right"></i></span></a>`;
                    }
                }
                priceContainer.innerHTML = priceHtml;
            }
            // In main.js, inside populateCourseDetails -> if (result.success)

const instructor = course.instructor;
if (instructor) {
    // Populate basic info
    document.getElementById('instructor-avatar').src = `/${instructor.avatar}` || 'assets/images/testimonial/client-03.png';
    document.getElementById('instructor-name').textContent = `${instructor.firstName} ${instructor.lastName}`;
    document.getElementById('instructor-occupation').textContent = instructor.occupation || 'Instructor';
    document.getElementById('instructor-bio').textContent = instructor.bio || 'No biography provided.';

    // Dynamically generate social media icons
    const socialContainer = document.getElementById('instructor-socials');
    socialContainer.innerHTML = ''; // Clear static icons

    if (instructor.social) {
        if (instructor.social.facebook) {
            socialContainer.innerHTML += `<li><a href="${instructor.social.facebook}"><i class="feather-facebook"></i></a></li>`;
        }
        if (instructor.social.twitter) {
            socialContainer.innerHTML += `<li><a href="${instructor.social.twitter}"><i class="feather-twitter"></i></a></li>`;
        }
        if (instructor.social.linkedin) {
            socialContainer.innerHTML += `<li><a href="${instructor.social.linkedin}"><i class="feather-linkedin"></i></a></li>`;
        }
        // Add more for other social links like github, website etc.
    }
}
        }
    } catch (error) {
        console.error('Error fetching course details:', error);
        document.body.innerHTML = `<h1>Error: ${error.message}</h1>`;
    }
};

        populateCourseDetails();
    });
}
// =================================================================
// REFACTORED lesson.html SCRIPT
// =================================================================
if (window.location.pathname.includes('lesson.html')) {
    
    // Use a single global variable to hold the course data.
    // This prevents us from having to pass it between every function.
    let currentCourseData = null;

    document.addEventListener('DOMContentLoaded', () => {
        const params = new URLSearchParams(window.location.search);
        const courseId = params.get('courseId');
        const initialLessonId = params.get('lessonId');
        
        // Removed episodeId check, as we can find it from the course data.
        if (!courseId || !initialLessonId) {
            document.body.innerHTML = '<h1>Error: Missing Course or Lesson ID.</h1>';
            return;
        }

        // Fetch course data ONCE when the page loads.
        fetch(`/api/courses/${courseId}`)
            .then(res => res.json())
            .then(result => {
                if (result.success) {
                    currentCourseData = result.course; // Store the fetched data
                    
                    // Initial setup of the page
                    renderSidebar(initialLessonId);
                    updateLessonContent(initialLessonId);
                    setupSidebarClickHandler(); // Setup the click listener for dynamic updates
                    setupNavigation(initialLessonId);
                    setupSidebarToggle();
                } else {
                    alert('Course not found');
                }
            })
            .catch(error => console.error('Error loading initial course data:', error));
    });

    /**
     * Renders the entire sidebar accordion.
     * @param {string} activeLessonId - The ID of the lesson to highlight as 'active'.
     */
    function renderSidebar(activeLessonId) {
        const sidebar = document.querySelector('.rbt-accordion-02.for-right-content');
        if (!sidebar) return;

        // Find which episode contains the active lesson to ensure it's expanded.
        const activeEpisode = currentCourseData.episodes.find(ep => ep.lessons.some(l => l._id === activeLessonId));

        sidebar.innerHTML = currentCourseData.episodes.map((episode, index) => {
            const isExpanded = activeEpisode && episode._id === activeEpisode._id;
            return `
                <div class="accordion-item card">
                    <h2 class="accordion-header card-header" id="headingTwo${index}">
                        <button class="accordion-button ${isExpanded ? '' : 'collapsed'}" type="button" data-bs-toggle="collapse" data-bs-target="#collapseTwo${index}" aria-expanded="${isExpanded ? 'true' : 'false'}">
                            <span class="title-text">${episode.title}</span>
                            <span class="rbt-badge-5 ml--10">${episode.lessons.length} Lessons</span>
                        </button>
                    </h2>
                    <div id="collapseTwo${index}" class="accordion-collapse collapse ${isExpanded ? 'show' : ''}" aria-labelledby="headingTwo${index}">
                        <div class="accordion-body card-body">
                            <ul class="rbt-course-main-content liststyle">
                                ${episode.lessons.map(lesson => `
                                    <li>
                                        <a href="#" class="lesson-link ${lesson._id === activeLessonId ? 'active' : ''}" data-lesson-id="${lesson._id}">
                                            <div class="course-content-left">
        <i class="feather-${lesson.vimeoUrl ? 'play-circle' : 'file-text'}"></i>
        
        <div class="title-summary-wrapper">
            <span class="text">${lesson.title}</span>
            ${lesson.summary ? `<small class="text-muted">${lesson.summary}</small>` : ''}
        </div>
        </div>
    <div class="course-content-right">
        </div>
                                        </a>
                                    </li>
                                `).join('')}
                            </ul>
                        </div>
                    </div>
                </div>
            `;
        }).join('');
    }

    /**
     * Finds a lesson by its ID from the stored course data and updates the main content area.
     * @param {string} lessonId - The ID of the lesson to display.
     */
    function updateLessonContent(lessonId) {
        let selectedLesson = null;
        // Find the lesson from our stored data
        for (const episode of currentCourseData.episodes) {
            const found = episode.lessons.find(l => l._id === lessonId);
            if (found) {
                selectedLesson = found;
                break;
            }
        }

        if (!selectedLesson) {
            console.error('Lesson not found in course data:', lessonId);
            return;
        }

        // Update title and video player
        document.querySelector('.lesson-top-left h5').textContent = selectedLesson.title;
        document.querySelector('.content .section-title p').textContent = selectedLesson.summary || 'No description available.';
        
        const videoPlayerContainer = document.querySelector('.rbtplayer');
        if (selectedLesson.vimeoUrl) {
             videoPlayerContainer.innerHTML = `<iframe src="${selectedLesson.vimeoUrl}" allow="autoplay; fullscreen; picture-in-picture" allowfullscreen></iframe>`;
        } else {
             videoPlayerContainer.innerHTML = `<div class="no-video-placeholder"><i class="feather-file-text" style="font-size: 48px;"></i><h4>Text-based Lesson</h4></div>`;
        }
    }
    
    /**
     * Sets up a SINGLE event listener on the sidebar to handle clicks on any lesson.
     * This is more efficient than adding a listener to every link.
     */
    function setupSidebarClickHandler() {
        const sidebar = document.querySelector('.rbt-accordion-02.for-right-content');
        sidebar.addEventListener('click', (event) => {
            const lessonLink = event.target.closest('.lesson-link'); // Find the clicked link
            
            if (lessonLink) {
                event.preventDefault(); // Prevent the default link behavior (page reload)
                
                const newLessonId = lessonLink.dataset.lessonId;
                
                // Update the main content with the new lesson
                updateLessonContent(newLessonId);
                
                // Update navigation buttons
                setupNavigation(newLessonId);

                // Update the 'active' state in the sidebar
                sidebar.querySelector('.lesson-link.active')?.classList.remove('active');
                lessonLink.classList.add('active');
            }
        });
    }

    /**
     * Finds the next and previous lessons and updates the navigation buttons.
     * @param {string} currentLessonId - The ID of the currently displayed lesson.
     */
    function setupNavigation(currentLessonId) {
        // Flatten the nested lessons array into a single array for easier navigation
        const allLessons = currentCourseData.episodes.flatMap(episode => 
            episode.lessons.map(lesson => ({...lesson, episodeId: episode._id}))
        );

        const currentIndex = allLessons.findIndex(lesson => lesson._id === currentLessonId);

        const prevButton = document.querySelector('.rbt-button-group a:first-child');
        const nextButton = document.querySelector('.rbt-button-group a:last-child');

        // Previous Button Logic
        if (currentIndex > 0) {
            const prevLesson = allLessons[currentIndex - 1];
            prevButton.style.opacity = '1';
            prevButton.style.pointerEvents = 'auto';
            // We make it a link for context, but clicks are handled dynamically
            prevButton.href = `lesson.html?courseId=${currentCourseData._id}&lessonId=${prevLesson._id}`;
            prevButton.dataset.lessonId = prevLesson._id; // Store ID for click handler
        } else {
            prevButton.style.opacity = '0.5';
            prevButton.style.pointerEvents = 'none';
        }

        // Next Button Logic
        if (currentIndex < allLessons.length - 1) {
            const nextLesson = allLessons[currentIndex + 1];
            nextButton.style.opacity = '1';
            nextButton.style.pointerEvents = 'auto';
            nextButton.href = `lesson.html?courseId=${currentCourseData._id}&lessonId=${nextLesson._id}`;
            nextButton.dataset.lessonId = nextLesson._id; // Store ID for click handler
        } else {
            nextButton.style.opacity = '0.5';
            nextButton.style.pointerEvents = 'none';
        }
    }
    
    /**
     * Sets up the expand/collapse button for the sidebar.
     */
    function setupSidebarToggle() {
        const toggleButton = document.querySelector('.rbt-lesson-toggle button');
        if (toggleButton) {
            toggleButton.addEventListener('click', function() {
                document.querySelector('.rbt-lesson-leftsidebar').classList.toggle('collapsed');
                document.querySelector('.rbt-lesson-rightsidebar').classList.toggle('expanded');
                const icon = this.querySelector('i');
                icon.className = icon.className.includes('left') ? 'feather-arrow-right' : 'feather-arrow-left';
            });
        }
    }
}
        };

if (window.location.pathname.includes('explore-courses.html')) {

    document.addEventListener('DOMContentLoaded', () => {
        // --- Get DOM Elements ---
        const courseListContainer = document.getElementById('course-list-container');
        const courseCountBadge = document.getElementById('course-count-badge');
        const courseResultCount = document.getElementById('course-result-count');
        const searchForm = document.getElementById('course-search-form'); // Assumes your form has this ID
        const searchInput = document.getElementById('course-search-input'); // Assumes your input has this ID
        const sortBySelect = document.getElementById('sort-by-select'); // Assumes your select has this ID
// In main.js, inside the 'explore-courses.html' block and 'DOMContentLoaded'

// --- Initialize Price Range Slider ---
if (typeof $ !== 'undefined' && $.ui) {
    const sliderRange = $("#slider-range");
    const amount = $("#amount");
    const filterBtn = $("#price-range-filter-btn");

    sliderRange.slider({
        range: true,
        min: 0,
        max: 5000, // You can adjust this max value
        values: [0, 5000], // Initial range
        slide: function(event, ui) {
            amount.val("₹" + ui.values[0] + " - ₹" + ui.values[1]);
        }
    });

    // Set the initial value in the input field
    amount.val("₹" + sliderRange.slider("values", 0) + " - ₹" + sliderRange.slider("values", 1));

    // Add click listener to the filter button
    filterBtn.on('click', function(e) {
        e.preventDefault();
        
        // Get the current min and max values from the slider
        const minPrice = sliderRange.slider("values", 0);
        const maxPrice = sliderRange.slider("values", 1);
        
        // Get other existing filter values
        const currentParams = {
            sortBy: document.getElementById('sort-by-select')?.value,
            search: document.getElementById('course-search-input')?.value,
            category: document.getElementById('category-select')?.value,
            price: document.getElementById('offer-select')?.value,
            minPrice: minPrice, // Add min price
            maxPrice: maxPrice  // Add max price
        };

        fetchAndDisplayCourses(currentParams);
    });
}
        // --- Function to Create a Single Course Card (from previous step) ---
        const createCourseCard = (course) => {
            // ... (Your complete createCourseCard function is here) ...
            // (The detailed function from our last step that creates the full card)
            let priceHtml = '';
            if (course.isFree || course.price === 0) {
                priceHtml = `<div class="rbt-price"><span class="current-price">Free</span></div>`;
            } else {
                const currentPrice = `₹${course.price.toLocaleString('en-IN')}`;
                const offPrice = course.originalPrice ? `<span class="off-price">₹${course.originalPrice.toLocaleString('en-IN')}</span>` : '';
                priceHtml = `<div class="rbt-price"><span class="current-price">${currentPrice}</span>${offPrice}</div>`;
            }
            let discountBadgeHtml = '';
            if (course.price > 0 && course.originalPrice && course.originalPrice > course.price) {
                const discount = Math.round(((course.originalPrice - course.price) / course.originalPrice) * 100);
                discountBadgeHtml = `<div class="rbt-badge-3 bg-white"><span>-${discount}%</span><span>Off</span></div>`;
            }
            const instructorName = course.instructor ? `${course.instructor.firstName} ${course.instructor.lastName}` : 'N/A';
            const instructorAvatar = course.instructor && course.instructor.avatar ? `/${course.instructor.avatar}` : 'assets/images/client/avatar-02.png';
            const lessonCount = course.episodes ? course.episodes.reduce((acc, ep) => acc + ep.lessons.length, 0) : 0;
            return `<div class="course-grid-3"><div class="rbt-card variation-01 rbt-hover"><div class="rbt-card-img"><a href="course-details.html?courseId=${course._id}"><img src="/${course.thumbnail}" alt="Course Thumbnail">${discountBadgeHtml}</a></div><div class="rbt-card-body"><div class="rbt-card-top"><div class="rbt-review"><div class="rating"><i class="fas fa-star"></i><i class="fas fa-star"></i><i class="fas fa-star"></i><i class="fas fa-star"></i><i class="fas fa-star"></i></div><span class="rating-count">(15 Reviews)</span></div><div class="rbt-bookmark-btn"><a class="rbt-round-btn" title="Bookmark" href="#"><i class="feather-bookmark"></i></a></div></div><h4 class="rbt-card-title"><a href="course-details.html?courseId=${course._id}">${course.title}</a></h4><ul class="rbt-meta"><li><i class="feather-book"></i>${lessonCount} Lessons</li><li><i class="feather-users"></i>50 Students</li></ul><p class="rbt-card-text">${course.description.substring(0,100)}...</p><div class="rbt-author-meta mb--10"><div class="rbt-avater"><a href="#"><img src="${instructorAvatar}" alt="${instructorName}"></a></div><div class="rbt-author-info">By <a href="#">${instructorName}</a> in <a href="#">${course.category||'General'}</a></div></div><div class="rbt-card-bottom">${priceHtml}<a class="rbt-btn-link" href="course-details.html?courseId=${course._id}">Learn More<i class="feather-arrow-right"></i></a></div></div></div></div>`;
        };

        // --- Main Function to Fetch and Display Courses ---
        const fetchAndDisplayCourses = async (queryParams = {}) => {
            // Remove empty query parameters
            Object.keys(queryParams).forEach(key => {
                if (queryParams[key] === '' || queryParams[key] === null) {
                    delete queryParams[key];
                }
            });
            
            const queryString = new URLSearchParams(queryParams).toString();
            const fetchUrl = `${API_BASE_URL}/api/courses?${queryString}`;

            try {
                const response = await fetch(fetchUrl);
                const data = await response.json();

                if (data.success) {
                    courseListContainer.innerHTML = ''; 
                    if (data.courses.length > 0) {
                        data.courses.forEach(course => courseListContainer.innerHTML += createCourseCard(course));
                    } else {
                        courseListContainer.innerHTML = '<div class="col-12 text-center"><p>No courses found matching your criteria.</p></div>';
                    }
                    // Update counts
                    courseCountBadge.innerHTML = `<div class="image">🎉</div> ${data.pagination.totalCourses} Courses`;
                    courseResultCount.textContent = `Showing ${data.courses.length} of ${data.pagination.totalCourses} results`;
                }
            } catch (error) {
                console.error('Error fetching courses:', error);
                courseListContainer.innerHTML = '<p>There was an error loading the courses.</p>';
            }
        };

        // --- Function to Handle Filter Changes ---
// In main.js, inside the 'explore-courses.html' block

// --- Function to Handle Filter Changes ---
const handleFilterChange = () => {
    // Get the DOM elements again inside the handler
    const sortBySelect = document.getElementById('sort-by-select');
    const searchInput = document.getElementById('course-search-input');
    const categorySelect = document.getElementById('category-select'); // New
    const priceSelect = document.getElementById('offer-select');      // New

    const params = {
        sortBy: sortBySelect ? sortBySelect.value : 'latest',
        search: searchInput ? searchInput.value : '',
        category: categorySelect ? categorySelect.value : '',
        price: priceSelect ? priceSelect.value : ''
    };
    fetchAndDisplayCourses(params);
};

// --- Add Event Listeners ---
document.getElementById('course-search-form')?.addEventListener('submit', (e) => {
    e.preventDefault();
    handleFilterChange();
});

// Attach the handler to all filter dropdowns
document.getElementById('sort-by-select')?.addEventListener('change', handleFilterChange);
document.getElementById('school-select')?.addEventListener('change', handleFilterChange);
document.getElementById('author-select')?.addEventListener('change', handleFilterChange);
document.getElementById('offer-select')?.addEventListener('change', handleFilterChange);
document.getElementById('category-select')?.addEventListener('change', handleFilterChange);


// --- Initial Fetch on Page Load ---
fetchAndDisplayCourses();
        
        // --- Add Event Listeners ---
        if (searchForm) {
            searchForm.addEventListener('submit', (e) => {
                e.preventDefault(); // Prevent page from reloading on form submit
                handleFilterChange();
            });
        }
        if (sortBySelect) {
            sortBySelect.addEventListener('change', handleFilterChange);
        }

        // --- Initial Fetch on Page Load ---
        fetchAndDisplayCourses(); 
    });
}

        handlePageLogic();
    };

    eduJs.i();

    $(document).ready(function () {
        eduJs.lmsInit();
    });

})(window, document, jQuery);