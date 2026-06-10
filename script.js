document.addEventListener('DOMContentLoaded', () => {

    // Блокируем скролл основного сайта
    document.body.classList.add('loading');

    const introLoader = document.getElementById('intro-loader');
    if (introLoader) {
        setTimeout(() => {
            // Команда на взлет экрана (срабатывает на отметке 2.15 сек)
            introLoader.classList.add('fade-out');
            document.body.classList.remove('loading');
        }, 2150); // Экран начнет улетать ровно тогда, когда буквы полностью станут белыми
    }

    // 1. Анимация шапки при скролле
    const header = document.getElementById('header');
    window.addEventListener('scroll', () => {
        if (window.scrollY > 50) {
            header.style.padding = '12px 5%';
            header.style.background = 'rgba(255, 255, 255, 0.95)';
            header.style.boxShadow = '0 10px 30px rgba(0,0,0,0.05)';
        } else {
            header.style.padding = '20px 5%';
            header.style.background = 'rgba(255, 255, 255, 0.85)';
            header.style.boxShadow = 'none';
        }
    });

    // 2. Логика интерактивной шторки "До / После"
    const sliders = document.querySelectorAll('.ba-slider');

    function syncSliderImages() {
        sliders.forEach(slider => {
            const width = slider.offsetWidth;
            const beforeImg = slider.querySelector('.before-side img');
            const afterImg = slider.querySelector('.after-side img');

            if (beforeImg && afterImg) {
                beforeImg.style.width = width + 'px';
                afterImg.style.width = width + 'px';
            }
        });
    }

    syncSliderImages();
    window.addEventListener('resize', syncSliderImages);

    sliders.forEach(slider => {
        const beforeSide = slider.querySelector('.before-side');
        const dragLine = slider.querySelector('.drag-line');

        function processMove(clientX) {
            const rect = slider.getBoundingClientRect();
            let x = clientX - rect.left;

            if (x < 0) x = 0;
            if (x > rect.width) x = rect.width;

            const percentage = (x / rect.width) * 100;
            dragLine.style.left = percentage + '%';
            beforeSide.style.width = percentage + '%';
        }

        slider.addEventListener('mousemove', (e) => {
            if (e.buttons === 1) {
                processMove(e.clientX);
                stopAutoPlay();
            }
        });
        slider.addEventListener('mousedown', (e) => {
            processMove(e.clientX);
            stopAutoPlay();
        });

        slider.addEventListener('touchmove', (e) => {
            if (e.touches.length > 0) {
                processMove(e.touches[0].clientX);
                stopAutoPlay();
            }
        }, { passive: true });
    });


    // 3. Логика переключения карточек работ (Карусель)
    let currentSlide = 0;
    const totalSlides = 5;
    const casesTrack = document.getElementById('casesTrack');
    const caseCounter = document.getElementById('caseCounter');
    const prevBtn = document.getElementById('prevCase');
    const nextBtn = document.getElementById('nextCase');

    function showTargetSlide(index) {
        currentSlide = index;
        if (currentSlide >= totalSlides) currentSlide = 0;
        if (currentSlide < 0) currentSlide = totalSlides - 1;

        casesTrack.style.transform = `translateX(-${currentSlide * 20}%)`;
        caseCounter.textContent = `${currentSlide + 1} из ${totalSlides}`;

        setTimeout(syncSliderImages, 50);
    }

    if (prevBtn && nextBtn) {
        prevBtn.addEventListener('click', (e) => {
            e.preventDefault();
            stopAutoPlay();
            showTargetSlide(currentSlide - 1);
        });

        nextBtn.addEventListener('click', (e) => {
            e.preventDefault();
            stopAutoPlay();
            showTargetSlide(currentSlide + 1);
        });
    }

    let sliderInterval = setInterval(() => {
        showTargetSlide(currentSlide + 1);
    }, 5000);

    function stopAutoPlay() {
        if (sliderInterval) {
            clearInterval(sliderInterval);
            sliderInterval = null;
        }
    }


    // 4. Логика слайдера отзывов (Карусель отзывов)
    let currentReview = 0;
    const totalReviews = 3;
    const reviewsTrack = document.getElementById('reviewsTrack');
    const reviewCounter = document.getElementById('reviewCounter');
    const prevReviewBtn = document.getElementById('prevReview');
    const nextReviewBtn = document.getElementById('nextReview');

    function showTargetReview(index) {
        currentReview = index;
        if (currentReview >= totalReviews) currentReview = 0;
        if (currentReview < 0) currentReview = totalReviews - 1;

        reviewsTrack.style.transform = `translateX(-${currentReview * (100 / totalReviews)}%)`;
        reviewCounter.textContent = `${currentReview + 1} из ${totalReviews}`;
    }

    if (prevReviewBtn && nextReviewBtn) {
        prevReviewBtn.addEventListener('click', (e) => {
            e.preventDefault();
            showTargetReview(currentReview - 1);
        });

        nextReviewBtn.addEventListener('click', (e) => {
            e.preventDefault();
            showTargetReview(currentReview + 1);
        });
    }


    // 5. Навигация по якорям (Обновлено)
    document.querySelectorAll('.nav-links a[href^="#"]').forEach(anchor => {
        anchor.addEventListener('click', function(e) {
            e.preventDefault();
            const target = document.querySelector(this.getAttribute('href'));
            if (target) {
                window.scrollTo({
                    top: target.offsetTop - 80,
                    behavior: 'smooth'
                });
            }
        });
    });


    // 6. Интеграция Яндекс Карт (Ваши точные координаты)
    if (typeof ymaps !== 'undefined') {
        ymaps.ready(initMap);
    }

    function initMap() {
        const mapElement = document.getElementById("map");
        if (!mapElement) return;

        const exactClinicCoordinates = [66.117996, 76.679430];

        const myMap = new ymaps.Map("map", {
            center: exactClinicCoordinates,
            zoom: 17,
            controls: ['zoomControl', 'fullscreenControl']
        });

        myMap.behaviors.disable('scrollZoom');

        const myPlacemark = new ymaps.Placemark(exactClinicCoordinates, {
            hintContent: 'Стоматология Dental',
            balloonContentHeader: '<strong>Dental</strong>',
            balloonContentBody: 'Премиальная стоматология<br>микрорайон Советский, 2к2',
            balloonContentFooter: '<a href="https://yandex.ru/maps/?rtext=~66.117996,76.679430" target="_blank" style="color:#007AFF; text-decoration:none; font-weight:600;">Построить маршрут</a>'
        }, {
            preset: 'islands#blueMedicalIcon'
        });

        myMap.geoObjects.add(myPlacemark);
    }
});