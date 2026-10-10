
const whatsappLink = document.querySelector("#whatsapp-link");

// TROQUE PELO NÚMERO REAL DA SUA SOGRA
// Formato: 55 + DDD + número, somente dígitos.
const telefone = "5516993641352";

const mensagem = encodeURIComponent(
    "Olá! Vi o site do Festival de Bolos e gostaria de saber mais informações."
);

if (telefone && whatsappLink) {
    whatsappLink.href = `https://wa.me/${telefone}?text=${mensagem}`;
    whatsappLink.target = "_blank";
    whatsappLink.rel = "noopener noreferrer";
} else if (whatsappLink) {
    whatsappLink.addEventListener("click", (event) => {
        event.preventDefault();
        alert("O WhatsApp será ativado assim que cadastrarmos o número de contato.");
    });
}

// Atualiza o ano do rodapé automaticamente.
const copyright = document.querySelector(".footer small");

if (copyright) {
    copyright.textContent =
        `© ${new Date().getFullYear()} Marília Bolos. Todos os direitos reservados.`;
}

const janelaVideo = document.getElementById("videoFlutuante");
const video = document.getElementById("videoMarilia");
const botaoFechar = document.getElementById("fecharVideo");
const botaoSom = document.getElementById("alternarSom");
const chuva = document.getElementById("chuvaCoracoes");

if (janelaVideo && video && botaoFechar && botaoSom && chuva) {
    video.muted = true;
    video.play().catch(() => {});

    const criarCoracao = () => {
        if (!document.body.contains(chuva)) return;

        const coracao = document.createElement("span");
        const coracoes = ["❤️", "💕", "💗", "💖"];
        coracao.className = "coracao-flutuante";
        coracao.textContent = coracoes[Math.floor(Math.random() * coracoes.length)];
        coracao.style.left = `${8 + Math.random() * 78}%`;
        chuva.appendChild(coracao);
        coracao.addEventListener("animationend", () => coracao.remove(), { once: true });
    };

    criarCoracao();
    const intervaloCoracoes = window.setInterval(criarCoracao, 650);

    botaoFechar.addEventListener("click", () => {
        video.pause();
        window.clearInterval(intervaloCoracoes);
        janelaVideo.remove();
    });

    botaoSom.addEventListener("click", async () => {
        if (video.muted) {
            video.muted = false;
            botaoSom.textContent = "🔊 Desativar som";

            try {
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