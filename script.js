// Menu responsivo (hambúrguer)
document.addEventListener('DOMContentLoaded', function() {
  const navToggle = document.getElementById('nav-toggle');
  const navMenu = document.getElementById('nav-menu');
  if (navToggle && navMenu) {
    navToggle.addEventListener('click', function() {
      const isOpen = navMenu.classList.toggle('open');
      navToggle.setAttribute('aria-expanded', isOpen);
    });
    // Fecha o menu ao clicar em um link
    navMenu.querySelectorAll('a').forEach(link => {
      link.addEventListener('click', () => {
        if (window.innerWidth <= 700) {
          navMenu.classList.remove('open');
          navToggle.setAttribute('aria-expanded', false);
        }
      });
    });
    // Fecha o menu ao redimensionar para desktop
    window.addEventListener('resize', () => {
      if (window.innerWidth > 700) {
        navMenu.classList.remove('open');
        navToggle.setAttribute('aria-expanded', false);
      }
    });
  }
});
// Tradução dos links do menu mantendo ícones
function atualizarMenuComIcones(links) {
    const menuMap = {
        'nav-inicio': { icon: '<i class="fa-solid fa-house"></i>', pt: 'Início', en: 'Home' },
        'nav-sobre': { icon: '<i class="fa-solid fa-user"></i>', pt: 'Sobre', en: 'About' },
        'nav-projetos': { icon: '<i class="fa-solid fa-code"></i>', pt: 'Projetos', en: 'Projects' },
        'nav-contato': { icon: '<i class="fa-solid fa-envelope"></i>', pt: 'Contato', en: 'Contact' }
    };
    links.forEach(link => {
        const id = link.id;
        if (menuMap[id]) {
            const lang = document.documentElement.lang === 'en' ? 'en' : 'pt';
            link.innerHTML = menuMap[id].icon + ' ' + menuMap[id][lang];
        }
    });
}

// Exemplo de integração com troca de idioma
document.addEventListener('DOMContentLoaded', function() {
    const menuLinks = [
        document.getElementById('nav-inicio'),
        document.getElementById('nav-sobre'),
        document.getElementById('nav-projetos'),
        document.getElementById('nav-contato')
    ];
    atualizarMenuComIcones(menuLinks);

    // Se já existe um sistema de troca de idioma, chame atualizarMenuComIcones(menuLinks) após a troca
    // Exemplo:
    // document.getElementById('lang-btn').addEventListener('click', function() {
    //     ... // lógica de troca de idioma
    //     atualizarMenuComIcones(menuLinks);
    // });
});
// Scroll suave para os links do header
document.addEventListener('DOMContentLoaded', function() {
    document.querySelectorAll('nav a[href^="#"]').forEach(link => {
        link.addEventListener('click', function(e) {
            const targetId = this.getAttribute('href').replace('#','');
            const target = document.getElementById(targetId);
            if(target) {
                e.preventDefault();
                window.scrollTo({
                    top: target.offsetTop - 70, // compensa header fixo
                    behavior: 'smooth'
                });
            }
        });
    });
});
// Modal formulário de email
document.addEventListener('DOMContentLoaded', function() {
    const abrirForm = document.getElementById('abrir-form-email');
    const modal = document.getElementById('form-email-modal');
    const fecharForm = document.getElementById('close-form-email');
    if (abrirForm && modal && fecharForm) {
        abrirForm.addEventListener('click', function() {
            modal.style.display = 'flex';
        });
        fecharForm.addEventListener('click', function() {
            modal.style.display = 'none';
        });
        window.addEventListener('click', function(e) {
            if (e.target === modal) {
                modal.style.display = 'none';
            }
        });
    }
});
// Carrossel de projetos infinito (loop) com autoplay
document.addEventListener('DOMContentLoaded', function() {
    const track = document.querySelector('.projetos-track');
    const cards = Array.from(document.querySelectorAll('.projeto-card'));
    const arrowLeft = document.querySelector('.carousel-arrow.left');
    const arrowRight = document.querySelector('.carousel-arrow.right');
    const carousel = document.querySelector('.projetos-carousel');
    let current = 0;
    const cardsToShow = 3;
    let autoplayInterval = null;
    const AUTOPLAY_DELAY = 3500;

    // Cria clones para efeito infinito
    function setupInfinite() {
        // Remove clones antigos se houver
        track.querySelectorAll('.clone').forEach(el => el.remove());
        // Clona últimos para o início
        for (let i = cards.length - cardsToShow; i < cards.length; i++) {
            const clone = cards[i].cloneNode(true);
            clone.classList.add('clone');
            track.insertBefore(clone, track.firstChild);
        }
        // Clona primeiros para o final
        for (let i = 0; i < cardsToShow; i++) {
            const clone = cards[i].cloneNode(true);
            clone.classList.add('clone');
            track.appendChild(clone);
        }
    }

    function getCardWidth() {
        return cards[0].offsetWidth + 24; // 24 = margin (0 12px)
    }

    function setTrackPosition(instant = false) {
        const cardWidth = getCardWidth();
        track.style.transition = instant ? 'none' : 'transform 0.5s cubic-bezier(.77,0,.18,1)';
        track.style.transform = `translateX(-${(current + cardsToShow) * cardWidth}px)`;
    }

    function nextSlide() {
        current++;
        setTrackPosition();
        // Se chegou no fim real, reseta para o início real instantaneamente
        setTimeout(() => {
            if (current >= cards.length) {
                current = 0;
                setTrackPosition(true);
            }
            updateDots();
        }, 510);
    }
    function prevSlide() {
        current--;
        setTrackPosition();
        setTimeout(() => {
            if (current < 0) {
                current = cards.length - 1;
                setTrackPosition(true);
            }
            updateDots();
        }, 510);
    }
    function startAutoplay() {
        if (autoplayInterval) clearInterval(autoplayInterval);
        autoplayInterval = setInterval(nextSlide, AUTOPLAY_DELAY);
    }
    function stopAutoplay() {
        if (autoplayInterval) clearInterval(autoplayInterval);
        autoplayInterval = null;
    }
    // Destaque visual para o card central
    function highlightCenter() {
        // Remove todas as classes center
        track.querySelectorAll('.projeto-card').forEach(card => card.classList.remove('center'));
        // O card central é sempre o do meio visível na tela
        // Descobre qual card está mais centralizado na tela do carrossel
        const cardWidth = getCardWidth();
        const trackRect = track.getBoundingClientRect();
        const allCards = Array.from(track.querySelectorAll('.projeto-card'));
        let minDist = Infinity;
        let centerIdx = -1;
        allCards.forEach((card, idx) => {
            const cardRect = card.getBoundingClientRect();
            // Centro do card
            const cardCenter = cardRect.left + cardRect.width / 2;
            // Centro do carrossel
            const carouselCenter = trackRect.left + trackRect.width / 2;
            const dist = Math.abs(cardCenter - carouselCenter);
            if (dist < minDist) {
                minDist = dist;
                centerIdx = idx;
            }
        });
        if (centerIdx !== -1) {
            allCards[centerIdx].classList.add('center');
        }
    }

    function updateDots() {
        const dots = document.querySelectorAll('.carousel-dots .dot');
        dots.forEach((dot, idx) => {
            dot.classList.toggle('active', idx === (current % dots.length));
        });
    }

    // Inicialização
    setupInfinite();
    setTrackPosition(true);
    highlightCenter();
    updateDots();

    // Setas
    arrowLeft.addEventListener('click', function() {
        prevSlide();
        highlightCenter();
        startAutoplay();
    });
    arrowRight.addEventListener('click', function() {
        nextSlide();
        highlightCenter();
        startAutoplay();
    });
    // Autoplay
    if (carousel) {
        carousel.addEventListener('mouseenter', stopAutoplay);
        carousel.addEventListener('mouseleave', startAutoplay);
    }
    window.addEventListener('resize', function() {
        setTrackPosition(true);
    });
    setTimeout(() => {
        setTrackPosition(true);
    }, 100);
    startAutoplay();
    // Atualiza destaque ao mover
    track.addEventListener('transitionend', highlightCenter);

    // Adiciona eventos de clique nos dots
    document.querySelectorAll('.carousel-dots .dot').forEach((dot, idx) => {
        dot.addEventListener('click', () => {
            current = idx;
            setTrackPosition();
            highlightCenter();
            updateDots();
            startAutoplay();
        });
    });
});
// Troca de idioma do menu com dropdown customizado
let idioma = 'pt-br';
async function carregarIdioma(idioma) {
    const response = await fetch(idioma + '.json');
    const textos = await response.json();
    // Atualiza logo mantendo tags especiais e fonte pixel
    document.getElementById('brand').innerHTML = textos.brand;
    document.getElementById('brand').style.fontFamily = "'Press Start 2P', monospace, cursive";
    // Atualiza links do menu mantendo ícones
    const menuMap = {
        'nav-inicio': { icon: '<i class="fa-solid fa-house"></i>', key: 'inicio' },
        'nav-sobre': { icon: '<i class="fa-solid fa-user"></i>', key: 'sobre' },
        'nav-projetos': { icon: '<i class="fa-solid fa-code"></i>', key: 'projetos' },
        'nav-contato': { icon: '<i class="fa-solid fa-envelope"></i>', key: 'contato' }
    };
    Object.keys(menuMap).forEach(id => {
        const el = document.getElementById(id);
        if (el) {
            el.innerHTML = menuMap[id].icon + ' ' + textos[menuMap[id].key];
        }
    });
    // Atualiza o botão principal
    if (idioma === 'pt-br') {
        document.querySelector('.lang-flag img').src = "https://hatscripts.github.io/circle-flags/flags/br.svg";
        document.querySelector('.lang-flag img').alt = "BR";
        document.querySelector('.lang-label').textContent = "POR";
    } else {
        document.querySelector('.lang-flag img').src = "https://hatscripts.github.io/circle-flags/flags/us.svg";
        document.querySelector('.lang-flag img').alt = "EN";
        document.querySelector('.lang-label').textContent = "ENG";
    }

    // Atualiza todos os textos com data-i18n
    document.querySelectorAll('[data-i18n]').forEach(el => {
        const key = el.getAttribute('data-i18n');
        if (textos[key]) {
            el.innerHTML = textos[key];
        }
    });
}

function setupLangDropdown() {
    const dropdown = document.querySelector('.lang-dropdown');
    dropdown.querySelectorAll('.lang-option').forEach(opt => {
        opt.addEventListener('click', function() {
            const lang = this.getAttribute('data-lang');
            idioma = lang;
            carregarIdioma(idioma);
            dropdown.style.display = 'none';
        });
    });
    // Fecha dropdown ao clicar fora
    document.addEventListener('click', function(e) {
        if (!document.getElementById('lang-switcher').contains(e.target)) {
            dropdown.style.display = 'none';
        }
    });
    // Mostra dropdown ao clicar no botão
    document.getElementById('lang-btn').addEventListener('click', function(e) {
        e.preventDefault();
        dropdown.style.display = dropdown.style.display === 'flex' ? 'none' : 'flex';
    });
}

if (document.getElementById('lang-btn')) {
    setupLangDropdown();
    carregarIdioma(idioma);
}
document.addEventListener('DOMContentLoaded', function() {
    const chk = document.getElementById('chk');
    // Sempre inicia em dark mode
    document.body.classList.add('dark');
    if (chk) {
        chk.checked = true; // switch já começa ativado
        chk.addEventListener('change', () => {
            document.body.classList.toggle('dark');
        });
    }
});