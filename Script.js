document.addEventListener('DOMContentLoaded', () => {

    // 1. Анимация появления заголовка Hero
    const heroH1 = document.querySelector('.hero h1');
    if (heroH1) {
        setTimeout(() => {
            heroH1.style.transition = 'all 1s ease-out';
            heroH1.style.opacity = '1';
            heroH1.style.transform = 'translateY(0)';
        }, 300);
    }

    // 2. Эффект шапки при скролле
    const header = document.querySelector('header');
    window.addEventListener('scroll', () => {
        if (window.scrollY > 50) {
            header.style.padding = '12px 5%';
            header.style.background = 'rgba(255, 255, 255, 0.95)';
            header.style.boxShadow = '0 10px 30px rgba(0,0,0,0.05)';
        } else {
            header.style.padding = '20px 5%';
            header.style.background = 'rgba(255, 255, 255, 0.8)';
            header.style.boxShadow = 'none';
        }
    });

    // 3. Анимация элементов при прокрутке (Reveal)
    const revealOptions = { threshold: 0.15 };
    const observer = new IntersectionObserver((entries) => {
        entries.forEach(entry => {
            if (entry.isIntersecting) {
                entry.target.classList.add('reveal');
            }
        });
    }, revealOptions);

    document.querySelectorAll('.card, .about-text, .about-image').forEach(el => {
        observer.observe(el);
    });

    // 4. Плавный скролл по якорям
    document.querySelectorAll('a[href^="#"]').forEach(anchor => {
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

    // 5. Обработка формы
    const form = document.getElementById('orderForm');
    if (form) {
        form.addEventListener('submit', (e) => {
            e.preventDefault();
            const btn = form.querySelector('button');
            const originalText = btn.innerText;

            btn.innerText = 'Отправка...';
            btn.disabled = true;

            setTimeout(() => {
                btn.innerText = 'Заявка принята!';
                btn.style.background = '#34c759';
                form.reset();

                setTimeout(() => {
                    btn.innerText = originalText;
                    btn.style.background = 'var(--accent-blue)';
                    btn.disabled = false;
                }, 3000);
            }, 1500);
        });
    }
});