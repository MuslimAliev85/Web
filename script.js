document.addEventListener('DOMContentLoaded', () => {

    document.body.classList.add('loading');

    // === СИСТЕМА САЛЮТА НА CANVAS ===
    const canvas = document.getElementById('fireworks-canvas');
    let animationActive = true;

    if (canvas) {
        const ctx = canvas.getContext('2d');

        function resizeCanvas() {
            canvas.width = window.innerWidth;
            canvas.height = window.innerHeight;
        }
        resizeCanvas();
        window.addEventListener('resize', resizeCanvas);

        let particles = [];

        class Particle {
            constructor(x, y, color, speedX, speedY, size) {
                this.x = x;
                this.y = y;
                this.color = color;
                this.speedX = speedX;
                this.speedY = speedY;
                this.gravity = 0.04;
                this.alpha = 1;
                this.decay = 0.015;
                this.size = size;
            }

            update() {
                this.speedY += this.gravity;
                this.x += this.speedX;
                this.y += this.speedY;
                this.alpha -= this.decay;

                // ЗАЩИТНАЯ ЗОНА: Проверяем расстояние от частицы до центра экрана
                const centerX = canvas.width / 2;
                const centerY = canvas.height / 2;
                const distX = this.x - centerX;
                const distY = this.y - centerY;
                const distance = Math.sqrt(distX * distX + distY * distY);

                // Если искра подлетает к надписи ближе чем на 180 пикселей,
                // она начинает стремительно растворяться, не долетая до букв
                if (distance < 180) {
                    this.alpha -= 0.1;
                }
            }

            draw() {
                ctx.save();
                ctx.globalAlpha = Math.max(0, this.alpha); // Исключаем отрицательную прозрачность
                ctx.beginPath();
                ctx.arc(this.x, this.y, this.size, 0, Math.PI * 2);
                ctx.fillStyle = this.color;
                ctx.shadowBlur = 6;
                ctx.shadowColor = this.color;
                ctx.fill();
                ctx.restore();
            }
        }

        function createExplosion(x, y) {
            const particleCount = 35;
            const colors = ['#007AFF', '#5AC8FA', '#0051FF', '#E5E5EA', '#3498db'];

            // Проверяем, чтобы сам центр взрыва не генерировался прямо на надписи
            const centerX = canvas.width / 2;
            const centerY = canvas.height / 2;
            const distX = x - centerX;
            const distY = y - centerY;
            if (Math.sqrt(distX * distX + distY * distY) < 150) return;

            for (let i = 0; i < particleCount; i++) {
                const angle = Math.random() * Math.PI * 2;
                const speed = Math.random() * 4 + 1;
                const speedX = Math.cos(angle) * speed;
                const speedY = Math.sin(angle) * speed;
                const color = colors[Math.floor(Math.random() * colors.length)];
                const size = Math.random() * 2 + 1.5;

                particles.push(new Particle(x, y, color, speedX, speedY, size));
            }
        }

        let lastLaunch = 0;
        function animateFireworks(timestamp) {
            if (!animationActive) return;

            ctx.clearRect(0, 0, canvas.width, canvas.height);

            if (timestamp - lastLaunch > 350) {
                // Генерируем залпы в стороне от центра: либо левее, либо правее, либо выше/ниже надписи
                const startX = Math.random() * canvas.width;
                const startY = Math.random() * (canvas.height * 0.7);
                createExplosion(startX, startY);
                lastLaunch = timestamp;
            }

            for (let i = particles.length - 1; i >= 0; i--) {
                particles[i].update();
                particles[i].draw();

                if (particles[i].alpha <= 0) {
                    particles.splice(i, 1);
                }
            }

            requestAnimationFrame(animateFireworks);
        }

        requestAnimationFrame(animateFireworks);
    }

    // === ТАЙМЕР ДЛЯ ВЫКЛЮЧЕНИЯ ИНТРО (ОБНОВЛЕНО) ===
    const introLoader = document.getElementById('intro-loader');
    if (introLoader) {
        setTimeout(() => {
            // Запускаем полет экрана вверх
            introLoader.classList.add('fade-out');
            // Возвращаем скролл сайту
            document.body.classList.remove('loading');

            // Выключаем движок салюта чуть позже (через 1 секунду),
            // когда экран уже полностью улетит за пределы видимости.
            // Благодаря этому искры будут красиво падать прямо во время полета экрана!
            setTimeout(() => {
                animationActive = false;
            }, 2000);

        }, 2000); // Ровно 3 секунды на показ логотипа и салюта
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