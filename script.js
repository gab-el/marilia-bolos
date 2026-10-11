
const whatsappLinks = document.querySelectorAll(".whatsapp-link, #whatsapp-link");

// TROQUE PELO NÚMERO REAL DA SUA SOGRA
// Formato: 55 + DDD + número, somente dígitos.
const telefone = "5516993641352";

const mensagem = encodeURIComponent(
    "Olá! Vi o site do Festival de Bolos e gostaria de saber mais informações."
);

if (telefone && whatsappLinks.length) {
    whatsappLinks.forEach((whatsappLink) => {
        whatsappLink.href = `https://wa.me/${telefone}?text=${mensagem}`;
        whatsappLink.target = "_blank";
        whatsappLink.rel = "noopener noreferrer";
    });
} else {
    whatsappLinks.forEach((whatsappLink) => {
        whatsappLink.addEventListener("click", (event) => {
            event.preventDefault();
            alert("O WhatsApp será ativado assim que cadastrarmos o número de contato.");
        });
    });
}

// Atualiza o ano do rodapé automaticamente.
const copyright = document.querySelector(".footer small");

if (copyright) {
    copyright.textContent =
        `© ${new Date().getFullYear()} Marília Bolos. Todos os direitos reservados.`;
}

const tabButtons = document.querySelectorAll(".tab-button");
const tabPanels = document.querySelectorAll(".tab-panel");

if (tabButtons.length && tabPanels.length) {
    tabButtons.forEach((button) => {
        button.addEventListener("click", () => {
            const targetId = button.dataset.tab;

            tabButtons.forEach((item) => {
                const isActive = item === button;
                item.classList.toggle("is-active", isActive);
                item.setAttribute("aria-selected", String(isActive));
            });

            tabPanels.forEach((panel) => {
                const isActive = panel.id === targetId;
                panel.classList.toggle("is-active", isActive);
            });
        });
    });
}

const setupCarousel = (trackSelector, dotsSelector, prevSelector, nextSelector, totalItems = 4, autoPlayDelay = 3500) => {
    const track = document.querySelector(trackSelector);
    const dots = document.querySelectorAll(dotsSelector);
    const prevButton = document.querySelector(prevSelector);
    const nextButton = document.querySelector(nextSelector);

    if (!track || !dots.length || !prevButton || !nextButton) return;

    let index = 0;
    let autoplayId = null;

    const updateCarousel = () => {
        track.style.transform = `translateX(-${index * 100}%)`;
        dots.forEach((dot, dotIndex) => {
            dot.classList.toggle("active", dotIndex === index);
        });
    };

    const goTo = (nextIndex) => {
        index = (nextIndex + totalItems) % totalItems;
        updateCarousel();
    };

    const startAutoPlay = () => {
        if (autoplayId) clearInterval(autoplayId);

        if (autoPlayDelay <= 0) return;

        autoplayId = window.setInterval(() => {
            goTo(index + 1);
        }, autoPlayDelay);
    };

    prevButton.addEventListener("click", () => {
        goTo(index - 1);
        startAutoPlay();
    });

    nextButton.addEventListener("click", () => {
        goTo(index + 1);
        startAutoPlay();
    });

    updateCarousel();
    startAutoPlay();
};

setupCarousel(".history-carousel-track", ".carousel-dots .dot", ".carousel-btn.prev", ".carousel-btn.next", 4, 3200);
setupCarousel(".media-carousel-track", ".media-dots .dot", ".media-carousel-btn.prev", ".media-carousel-btn.next", 4, 0);

const janelaVideo = document.getElementById("videoFlutuante");
const video = document.getElementById("videoMarilia");
const botaoFechar = document.getElementById("fecharVideo");
const botaoSom = document.getElementById("alternarSom");
const chuva = document.getElementById("chuvaCoracoes");

if (janelaVideo && video && botaoFechar && botaoSom && chuva) {
    janelaVideo.hidden = true;
    video.muted = true;
    video.pause();

    const criarCoracao = () => {
        if (!document.body.contains(chuva) || janelaVideo.hidden) return;

        const coracao = document.createElement("span");
        const coracoes = ["❤️", "💕", "💗", "💖"];
        coracao.className = "coracao-flutuante";
        coracao.textContent = coracoes[Math.floor(Math.random() * coracoes.length)];
        coracao.style.left = `${8 + Math.random() * 78}%`;
        chuva.appendChild(coracao);
        coracao.addEventListener("animationend", () => coracao.remove(), { once: true });
    };

    let intervaloCoracoes = null;

    const iniciarAnimacao = () => {
        janelaVideo.hidden = false;
        criarCoracao();
        intervaloCoracoes = window.setInterval(criarCoracao, 650);
    };

    botaoFechar.addEventListener("click", () => {
        video.pause();
        if (intervaloCoracoes) {
            window.clearInterval(intervaloCoracoes);
            intervaloCoracoes = null;
        }
        janelaVideo.hidden = true;
    });

    botaoSom.addEventListener("click", async () => {
        if (video.muted) {
            video.muted = false;
            botaoSom.textContent = "🔊 Desativar som";

            try {
                if (janelaVideo.hidden) {
                    iniciarAnimacao();
                }
                await video.play();
            } catch {
                video.muted = true;
                botaoSom.textContent = "🔇 Ativar som";
            }
        } else {
            video.muted = true;
            botaoSom.textContent = "🔇 Ativar som";
        }

        botaoSom.setAttribute("aria-pressed", String(!video.muted));
    });
}