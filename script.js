document.addEventListener('DOMContentLoaded', () => {

    // 1. Фиксация и анимация прозрачности шапки
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

    // 2. Инициализация и логика шторки сравнения
    const sliders = document.querySelectorAll('.ba-slider');

    function initSliders() {
        sliders.forEach(slider => {
            const containerWidth = slider.offsetWidth;
            const beforeSide = slider.querySelector('.before-side');
            const afterSide = slider.querySelector('.after-side');
            const beforeImg = beforeSide.querySelector('img');
            const afterImg = afterSide.querySelector('img');
            const dragLine = slider.querySelector('.drag-line');

            // Устанавливаем точную ширину картинок равную ширине родительского окна
            beforeImg.style.width = containerWidth + 'px';
            afterImg.style.width = containerWidth + 'px';

            function updateSplit(clientX) {
                const rect = slider.getBoundingClientRect();
                let offsetX = clientX - rect.left;

                if (offsetX < 0) offsetX = 0;
                if (offsetX > rect.width) offsetX = rect.width;

                const pct = (offsetX / rect.width) * 100;
                dragLine.style.left = pct + '%';
                beforeSide.style.width = pct + '%';
            }

            // Слушатели для мыши внутри конкретного слайда
            slider.addEventListener('mousemove', (e) => {
                if (e.buttons === 1) {
                    updateSplit(e.clientX);
                    stopAutoPlay();
                }
            });

            slider.addEventListener('mousedown', (e) => {
                updateSplit(e.clientX);
                stopAutoPlay();
            });

            // Поддержка мобильных тач-событий
            slider.addEventListener('touchmove', (e) => {
                updateSplit(e.touches[0].clientX);
                stopAutoPlay();
            }, { passive: true });
        });
    }

    // Запуск подгонки изображений
    initSliders();
    window.addEventListener('resize', initSliders);


    // 3. Карусель кейсов (Стрелки навигации)
    let currentSlide = 0;
    const totalSlides = 5;
    const casesTrack = document.getElementById('casesTrack');
    const caseCounter = document.getElementById('caseCounter');
    const prevBtn = document.getElementById('prevCase');
    const nextBtn = document.getElementById('nextCase');

    function renderSlide(index) {
        currentSlide = index;
        if (currentSlide >= totalSlides) currentSlide = 0;
        if (currentSlide < 0) currentSlide = totalSlides - 1;

        casesTrack.style.transform = `translateX(-${currentSlide * 20}%)`;
        caseCounter.textContent = `${currentSlide + 1} из ${totalSlides}`;

        // Переинициализируем размеры шторки для нового открывшегося слайда
        initSliders();
    }

    // Изолированные клики на кнопки управления
    prevBtn.addEventListener('click', (e) => {
        e.stopPropagation();
        stopAutoPlay();
        renderSlide(currentSlide - 1);
    });

    nextBtn.addEventListener('click', (e) => {
        e.stopPropagation();
        stopAutoPlay();
        renderSlide(currentSlide + 1);
    });


    // 4. Безопасный таймер автоматического переключения кейсов
    let autoPlayInterval = setInterval(() => {
        renderSlide(currentSlide + 1);
    }, 6000);

    function stopAutoPlay() {
        if (autoPlayInterval) {
            clearInterval(autoPlayInterval);
            autoPlayInterval = null;
        }
    }


    // 5. Навигационные якорные ссылки
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

    // 6. Интеграция Яндекс Карт
    if (typeof ymaps !== 'undefined') {
        ymaps.ready(initMap);
    }

    function initMap() {
        const mapElement = document.getElementById("map");
        if (!mapElement) return;

        // Ваши точные координаты для клиники Dental
        const exactClinicCoordinates = [66.117996, 76.679430];

        const myMap = new ymaps.Map("map", {
            center: exactClinicCoordinates,
            zoom: 17, // Оптимальный крупный масштаб, чтобы четко видеть вход в здание
            controls: ['zoomControl', 'fullscreenControl']
        });

        // Отключаем зум колесиком мыши, чтобы страница не залипала при скролле
        myMap.behaviors.disable('scrollZoom');

        // Создаем метку строго по вашим координатам
        const myPlacemark = new ymaps.Placemark(exactClinicCoordinates, {
            hintContent: 'Стоматология Dental',
            balloonContentHeader: '<strong>Dental</strong>',
            balloonContentBody: 'Премиальная стоматология<br>микрорайон Советский, 2к2',
            balloonContentFooter: '<a href="https://yandex.ru/maps/?rtext=~66.117996,76.679430" target="_blank" style="color:#007AFF; text-decoration:none; font-weight:600;">Построить маршрут</a>'
        }, {
            preset: 'islands#blueMedicalIcon' // Наша аккуратная синяя медицинская иконка
        });

        // Добавляем метку на карту
        myMap.geoObjects.add(myPlacemark);
    }
});