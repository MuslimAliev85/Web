document.addEventListener('DOMContentLoaded', () => {

    //region 1. Загрузка и Интро-экран (Loader & Intro)
    document.body.classList.add('loading');

    const introLoader = document.getElementById('intro-loader');
    if (introLoader) {
        // Ждем закрашивания текста, затем запускаем эффект "распада"
        setTimeout(() => {
            introLoader.classList.add('disintegrate');

            // Ждем исчезновения букв и сворачиваем окно вверх
            setTimeout(() => {
                introLoader.classList.add('fade-out');
                document.body.classList.remove('loading');
            }, 1500);
        }, 2800);
    }
    //endregion

    //region 2. Шапка и Навигация (Header & Navigation)
    const header = document.getElementById('header');
    if (header) {
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
    }

    // Плавная навигация по якорным ссылкам с отступом под шапку
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
    //endregion

    //region 3. Слайдер "До / После" (Before / After Slider)
    const sliders = document.querySelectorAll('.ba-slider');

    function syncSliderImages() {
        sliders.forEach(slider => {
            const width = slider.offsetWidth;
            const beforeImg = slider.querySelector('.before-side img');
            const afterImg = slider.querySelector('.after-side img');

            if (beforeImg && afterImg) {
                beforeImg.style.width = `${width}px`;
                afterImg.style.width = `${width}px`;
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
            dragLine.style.left = `${percentage}%`;
            beforeSide.style.width = `${percentage}%`;
        }

        // Единый обработчик для перетаскивания (мышь и тач)
        const handleMove = (e) => {
            const clientX = e.touches ? e.touches[0].clientX : e.clientX;
            processMove(clientX);
            stopAutoPlay();
        };

        slider.addEventListener('mousemove', (e) => {
            if (e.buttons === 1) handleMove(e);
        });
        slider.addEventListener('mousedown', handleMove);
        slider.addEventListener('touchmove', handleMove, { passive: true });
    });
    //endregion

    //region 4. Карусель работ (Cases Carousel)
    let currentSlide = 0;
    const totalSlides = 5;
    const casesTrack = document.getElementById('casesTrack');
    const caseCounter = document.getElementById('caseCounter');
    const prevBtn = document.getElementById('prevCase');
    const nextBtn = document.getElementById('nextCase');

    function showTargetSlide(index) {
        // Элегантный перенос индекса по кругу без кучи условий if
        currentSlide = (index + totalSlides) % totalSlides;

        if (casesTrack) casesTrack.style.transform = `translateX(-${currentSlide * 20}%)`;
        if (caseCounter) caseCounter.textContent = `${currentSlide + 1} из ${totalSlides}`;

        setTimeout(syncSliderImages, 50);
    }

    // Запуск автопроигрывания карусели работ
    let sliderInterval = setInterval(() => {
        showTargetSlide(currentSlide + 1);
    }, 5000);

    function stopAutoPlay() {
        if (sliderInterval) {
            clearInterval(sliderInterval);
            sliderInterval = null;
        }
    }
    //endregion

    //region 5. Отзывы (Reviews)
    let currentReview = 0;
    const totalReviews = 3;
    const reviewsTrack = document.getElementById('reviewsTrack');
    const reviewCounter = document.getElementById('reviewCounter');
    const prevReviewBtn = document.getElementById('prevReview');
    const nextReviewBtn = document.getElementById('nextReview');
    const reviewWrappers = document.querySelectorAll('.review-text-wrap');

    function showTargetReview(index) {
        currentReview = (index + totalReviews) % totalReviews;

        if (reviewsTrack) {
            reviewsTrack.style.transform = `translateX(-${currentReview * (100 / totalReviews)}%)`;
        }
        if (reviewCounter) {
            reviewCounter.textContent = `${currentReview + 1} из ${totalReviews}`;
        }
    }

    // Управление кнопками раскрытия длинного текста ("Читать дальше")
    reviewWrappers.forEach(wrapper => {
        const btn = wrapper.nextElementSibling;
        if (!btn || !btn.classList.contains('read-more-btn')) return;

        if (wrapper.scrollHeight > wrapper.clientHeight) {
            btn.style.display = 'inline-block';
        }

        btn.addEventListener('click', () => {
            const isExpanded = wrapper.classList.toggle('expanded');
            btn.textContent = isExpanded ? 'Свернуть' : 'Читать дальше';

            if (!isExpanded) {
                const item = wrapper.closest('.review-item');
                if (item) item.scrollIntoView({ behavior: 'smooth', block: 'nearest' });
            }
        });
    });

    // Показ и скрытие дополнительных карточек отзывов в списке
    const loadMoreBtn = document.getElementById('loadMoreReviews');
    const hideBtn = document.getElementById('hideReviews');
    const controlsContainer = document.getElementById('reviewsControls');
    const hiddenReviews = document.querySelectorAll('.review-item.hidden-review');
    const reviewsSection = document.getElementById('reviews');

    if (loadMoreBtn && hideBtn && controlsContainer) {
        loadMoreBtn.addEventListener('click', () => {
            hiddenReviews.forEach((review, index) => {
                setTimeout(() => review.classList.add('show-animated'), index * 120);
            });
            controlsContainer.classList.add('expanded');
        });

        hideBtn.addEventListener('click', () => {
            hiddenReviews.forEach(review => review.classList.remove('show-animated'));
            controlsContainer.classList.remove('expanded');
            if (reviewsSection) {
                reviewsSection.scrollIntoView({ behavior: 'smooth', block: 'start' });
            }
        });
    }
    //endregion

    //region 6. Интерактивная карта (Yandex Map)
    let myMap;

    if (typeof ymaps !== 'undefined') {
        ymaps.ready(initMap);
    }

    function initMap() {
        const mapElement = document.getElementById("map");
        if (!mapElement) return;

        const exactClinicCoordinates = [66.117996, 76.679430];
        const moscowClinicCoordinates = [66.083964, 76.685328];

        myMap = new ymaps.Map("map", {
            center: exactClinicCoordinates,
            zoom: 17,
            controls: ['zoomControl', 'fullscreenControl']
        });

        myMap.behaviors.disable('scrollZoom');

        const placemarkNUR = new ymaps.Placemark(exactClinicCoordinates, {
            hintContent: 'Стоматология Dental — Новый Уренгой',
            balloonContentHeader: '<strong>Dental (Новый Уренгой)</strong>',
            balloonContentBody: 'Премиальная стоматология<br>микрорайон Советский, 2к2',
            // Координаты для маршрута теперь подставляются автоматически
            balloonContentFooter: `<a href="https://yandex.ru/maps/?rtext=~${exactClinicCoordinates.join(',')}" target="_blank" style="color:#007AFF; text-decoration:none; font-weight:600;">Построить маршрут</a>`
        }, {
            preset: 'islands#blackDarkGlyphIcon'
        });

        const placemarkMSK = new ymaps.Placemark(moscowClinicCoordinates, {
            hintContent: 'Стоматология Dental — Москва',
            balloonContentHeader: '<strong>Dental (Москва)</strong>',
            balloonContentBody: 'Премиальная стоматология<br>Ленинградский проспект, 10',
            balloonContentFooter: `<a href="https://yandex.ru/maps/?rtext=~${moscowClinicCoordinates.join(',')}" target="_blank" style="color:#007AFF; text-decoration:none; font-weight:600;">Построить маршрут</a>`
        }, {
            preset: 'islands#blackDarkGlyphIcon'
        });

        myMap.geoObjects.add(placemarkNUR).add(placemarkMSK);
    }

    // Переключение центрирования карты по кнопкам филиалов
    document.querySelectorAll('.map-target-btn').forEach(button => {
        button.addEventListener('click', function() {
            if (!myMap) return;

            document.querySelectorAll('.map-target-btn').forEach(btn => btn.classList.remove('active'));
            this.classList.add('active');

            const targetCoords = JSON.parse(this.getAttribute('data-coord'));
            myMap.setCenter(targetCoords, 17, {
                checkZoomRange: true,
                duration: 1000
            });
        });
    });
    //endregion

    //region 7. Вспомогательные функции (Helpers)
    // Универсальный обработчик событий клика по кнопкам каруселей ("Вперед" / "Назад")
    function setupCarouselNav(prevBtn, nextBtn, showCallback) {
        if (prevBtn && nextBtn) {
            prevBtn.addEventListener('click', (e) => {
                e.preventDefault();
                stopAutoPlay();
                showCallback(-1);
            });

            nextBtn.addEventListener('click', (e) => {
                e.preventDefault();
                stopAutoPlay();
                showCallback(1);
            });
        }
    }

    // Инициализация кнопок управления каруселями
    setupCarouselNav(prevBtn, nextBtn, (direction) => showTargetSlide(currentSlide + direction));
    setupCarouselNav(prevReviewBtn, nextReviewBtn, (direction) => showTargetReview(currentReview + direction));
    //endregion

});