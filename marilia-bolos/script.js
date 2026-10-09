
const whatsappLink = document.querySelector("#whatsapp-link");

// TROQUE PELO NÚMERO REAL DA SUA SOGRA
// Formato: 55 + DDD + número, somente dígitos.
const telefone = "5516993641352";

const mensagem = encodeURIComponent(
    "Olá! Vi o site do Festival de Bolos e gostaria de saber mais informações."
);

if (telefone) {
    whatsappLink.href = `https://wa.me/${telefone}?text=${mensagem}`;
    whatsappLink.target = "_blank";
    whatsappLink.rel = "noopener noreferrer";
} else {
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