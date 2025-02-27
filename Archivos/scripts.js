// Espera a que el DOM esté completamente cargado antes de ejecutar el código
document.addEventListener('DOMContentLoaded', () => {
    // Configuración global para IntersectionObserver
    const observerConfig = {
        root: null, 
        threshold: 0.1,
        rootMargin: "0px 0px -200px 0px"
    };

    // Función para animar elementos desde los lados
    const animateFromSide = (entries, observer) => {
        entries.forEach(entry => {
            if (entry.isIntersecting && !entry.target.classList.contains('animated')) {
                const isMobile = window.innerWidth <= 425;
                if (isMobile) {
                    entry.target.style.transform = 'translateY(0)';
                    entry.target.style.opacity = '1';
                } else {
                    entry.target.style.transform = 'translateX(0)';
                    entry.target.style.opacity = '1';
                }
                entry.target.classList.add('animated');
                observer.unobserve(entry.target);
            }
        });
    };

    // Observador para animaciones laterales
    const sideAnimationObserver = new IntersectionObserver(animateFromSide, {
        root: null,
        rootMargin: '0px',
        threshold: 0.2 // 20% de visibilidad para disparar
    });

    // Observador para sección de contacto
    const contactObserver = new IntersectionObserver((entries) => {
        entries.forEach(entry => {
            entry.target.classList.toggle('in-view', entry.isIntersecting);
        });
    }, observerConfig);

    // Observador para sección de servicios con animación de logos y botón
    const serviciosObserver = new IntersectionObserver((entries) => {
        entries.forEach(entry => {
            const logoItems = entry.target.querySelectorAll('.logo-item');
            const button = entry.target.querySelector('.boton2');

            // Animación secuencial de logos
            logoItems.forEach((item, index) => {
                setTimeout(() => {
                    item.style.opacity = entry.isIntersecting ? '1' : '0';
                    item.style.transform = entry.isIntersecting ? 'scale(1)' : 'scale(0.9)';
                }, index * 200);
            });

            // Animación del botón
            if (button) {
                button.style.opacity = entry.isIntersecting ? '1' : '0';
                button.style.transform = entry.isIntersecting ? 'translateY(0)' : 'translateY(20px)';
            }
        });
    }, observerConfig);

    // Observador para sección "elegirnos" con animaciones específicas
    const elegirnosObserver = new IntersectionObserver((entries) => {
        entries.forEach(entry => {
            const textContent = entry.target.querySelector('.text-content');
            const image = entry.target.querySelector('.imagen');
    
            if (textContent && image) {
                const isVisible = entry.isIntersecting;
    
                if (isVisible && !image.classList.contains('animated')) {
                    // Animación del texto
                    textContent.style.transition = 'opacity 1s ease-out 0.5s, transform 1s ease-out 0.5s';
                    textContent.style.opacity = '1';
                    textContent.style.transform = 'translateY(0)';
    
                    // Animación de la imagen
                    image.classList.add('animated');
                    observer.unobserve(entry.target);
                }
            }
        });
    }, {
        root: null,
        threshold: 0.1,
        rootMargin: "0px 0px -300px 0px"
    });

    // Función principal para configurar todas las animaciones
    const setupAnimations = () => {
        // Animación de info-boxes
        const infoBoxes = document.querySelectorAll('.info-box');
        infoBoxes.forEach(box => {
            const isMobile = window.innerWidth <= 425;
            if (isMobile) {
                box.style.transform = 'translateY(50px)'; // Estado inicial para móviles
                box.style.opacity = '0';
            } else {
                box.style.transform = box.classList.contains('left-aligned') ? 'translateX(100%)' : 'translateX(-100%)';
                box.style.opacity = '0';
            }
            box.style.transition = 'transform 0.5s ease-out, opacity 0.5s ease-out';
            sideAnimationObserver.observe(box);
        });

        // Observar elementos de contacto
        document.querySelectorAll('.contenido_contacto').forEach(item => contactObserver.observe(item));

        // Configuración de la sección servicios
        const serviciosSection = document.querySelector('.servicios');
        if (serviciosSection) {
            serviciosObserver.observe(serviciosSection);

            // Efectos hover para el botón
            const button = serviciosSection.querySelector('.boton2');
            if (button) {
                button.addEventListener('mouseenter', () => button.style.boxShadow = '0 0 10px rgba(255, 255, 255, 0.5)');
                button.addEventListener('mouseleave', () => button.style.boxShadow = 'none');
            }

            // Efectos hover para logos
            document.querySelectorAll('.circle-logo').forEach(logo => {
                logo.style.transition = 'transform 0.3s ease';
                logo.addEventListener('mouseenter', () => logo.style.transform = 'scale(1.05)');
                logo.addEventListener('mouseleave', () => logo.style.transform = 'scale(1)');
            });
        }

        // Configuración de la sección elegirnos
        const elegirnosSection = document.querySelector('.elegirnos');
        if (elegirnosSection) {
            elegirnosObserver.observe(elegirnosSection);

            // Efectos hover para el botón
            const button = elegirnosSection.querySelector('.boton2');
            if (button) {
                button.style.transition = 'background-color 0.3s, box-shadow 0.3s';
                button.addEventListener('mouseenter', () => {
                    button.style.backgroundColor = 'rgba(255, 255, 255, 0.1)';
                    button.style.boxShadow = '0 0 10px rgba(255, 255, 255, 0.5)';
                });
                button.addEventListener('mouseleave', () => {
                    button.style.backgroundColor = 'black';
                    button.style.boxShadow = 'none';
                });
            }

            // Efecto parallax en la imagen
            let lastScrollPos = 0;
            const handleScroll = () => {
                const image = elegirnosSection.querySelector('.imagen');
                if (image) {
                    const scrollPos = window.scrollY;
                    const move = (scrollPos - lastScrollPos) * 0.2;
                    image.style.transform = `translateX(${move}px)`;
                    lastScrollPos = scrollPos;
                }
            };

            // Optimización del scroll con requestAnimationFrame
            let ticking = false;
            window.addEventListener('scroll', () => {
                if (!ticking) {
                    requestAnimationFrame(() => {
                        handleScroll();
                        ticking = false;
                    });
                    ticking = true;
                }
            });

            // Configuración dinámica de clases en el hero
            const hero = document.querySelector('.hero');
            if (hero) {
                const url = window.location.href;
                const heroClasses = {
                    'contacto': 'contacto-hero',
                    'sobre-nosotros': 'sobre-nosotros-hero',
                    'servicios': 'servicios-hero'
                };
                const activeClass = Object.entries(heroClasses).find(([page]) => url.includes(page))?.[1];
                if (activeClass) {
                    hero.classList.add(activeClass);
                    Object.values(heroClasses).filter(c => c !== activeClass).forEach(c => hero.classList.remove(c));
                } else {
                    hero.classList.remove(...Object.values(heroClasses));
                }
            }
        }

        // Configuración del menú móvil
        const menuToggle = document.querySelector('.menu-toggle');
        const menu = document.querySelector('nav ul');
        if (menuToggle && menu) {
            menuToggle.addEventListener('click', () => menu.classList.toggle('menu-open'));
            document.addEventListener('click', (event) => {
                if (!menu.contains(event.target) && !menuToggle.contains(event.target)) {
                    menu.classList.remove('menu-open');
                }
            });
            document.querySelectorAll('nav ul a').forEach(link => {
                link.addEventListener('click', () => menu.classList.remove('menu-open'));
            });
        }
    };

    // Ejecutar configuración inicial
    setupAnimations();

    // Configuración del carrusel de reseñas
    const resenasContainer = document.getElementById("resenas-container");
    const prevBtn = document.getElementById("prev");
    const nextBtn = document.getElementById("next");
    let resenas = [];
    let index = 0;
    let isTransitioning = false;

    const cargarResenas = async () => {
        try {
            const response = await fetch("resenas.json");
            resenas = (await response.json()).filter(resena => resena.estrellas === 5);
            actualizarResenas(1); // Dirección inicial positiva
        } catch (error) {
            console.error("Error cargando las reseñas:", error);
        }
    };

    const actualizarResenas = (direction) => {
        if (!resenasContainer) return;
        resenasContainer.innerHTML = "";
        const itemsToShow = window.innerWidth <= 425 ? 1 : window.innerWidth <= 768 ? 2 : 3;

        for (let i = 0; i < itemsToShow; i++) {
            const resenaIndex = (index + i) % resenas.length;
            const resena = resenas[resenaIndex];
            const resenaDiv = document.createElement("div");
            resenaDiv.classList.add("resena");
            resenaDiv.style.opacity = "0";

            // Animación de entrada según tamaño de pantalla
            if (window.innerWidth <= 425) {
                resenaDiv.style.transform = direction > 0 ? "translateX(100%)" : "translateX(-100%)"; // Móviles pequeños
            } else if (window.innerWidth <= 768) {
                resenaDiv.style.transform = i === 0 ? "translateX(-100%)" : "translateX(100%)"; // Restaurado para 425-768px
            } else {
                resenaDiv.style.transform = direction > 0 ? "translateX(100%)" : "translateX(-100%)"; // Pantallas grandes
            }

            resenaDiv.innerHTML = `
                <p class="estrellas">5.0 ★★★★★</p>
                <div class="comentario">${resena.comentario}</div>
                <div class="autor">
                    <img src="img/perfil.png" alt="Perfil" class="imagen-perfil">
                    <div class="nombre">${resena.nombre}</div>
                </div>
            `;
            resenasContainer.appendChild(resenaDiv);
        }

        // Animación de entrada
        setTimeout(() => {
            document.querySelectorAll(".resena").forEach((resena) => {
                resena.style.transition = "transform 0.7s ease-in-out, opacity 0.7s ease-in-out";
                resena.style.transform = "translateX(0)";
                resena.style.opacity = "1";
            });
        }, 50);
    };

    const transitionResenas = (direction) => {
        if (isTransitioning) return;
        isTransitioning = true;

        const itemsToShow = window.innerWidth <= 425 ? 1 : window.innerWidth <= 768 ? 2 : 3;
        document.querySelectorAll(".resena").forEach((resena, i) => {
            resena.style.transition = "transform 0.7s ease-in-out, opacity 0.7s ease-in-out";
            
            // Animación de salida según tamaño de pantalla
            if (window.innerWidth <= 425) {
                resena.style.transform = direction > 0 ? "translateX(-100%)" : "translateX(100%)"; // Móviles pequeños
            } else if (window.innerWidth <= 768) {
                resena.style.transform = i === 0 ? "translateX(-100%)" : "translateX(100%)"; // Restaurado para 425-768px
            } else {
                resena.style.transform = direction > 0 ? `translateX(-${100 * itemsToShow}%)` : `translateX(${100 * itemsToShow}%)`; // Pantallas grandes
            }
            
            resena.style.opacity = "0";
        });

        setTimeout(() => {
            index = (index + direction + resenas.length) % resenas.length;
            actualizarResenas(direction);
            isTransitioning = false;
        }, 700);
    };

    // Event listeners para controles del carrusel
    prevBtn?.addEventListener("click", () => transitionResenas(-1));
    nextBtn?.addEventListener("click", () => transitionResenas(1));
    window.addEventListener("resize", debounce(() => actualizarResenas(1), 200));
    let autoSlide = setInterval(() => transitionResenas(1), 5000);

    // Función debounce para limitar ejecuciones en resize
    function debounce(func, wait) {
        let timeout;
        return (...args) => {
            clearTimeout(timeout);
            timeout = setTimeout(() => func(...args), wait);
        };
    }

    // Pausar auto-slide al interactuar con botones
    [prevBtn, nextBtn].forEach(btn => {
        btn?.addEventListener('mouseenter', () => clearInterval(autoSlide));
        btn?.addEventListener('mouseleave', () => autoSlide = setInterval(() => transitionResenas(1), 5000));
    });

    // Iniciar carga de reseñas
    cargarResenas();
});