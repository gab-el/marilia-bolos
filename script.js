
const ORDER_CONFIG = {
    whatsappNumber: "5516993641352"
};

const ORDER_PRODUCTS = [
    {
        id: "fatia-matilda",
        name: "Fatia de Bolo Matilda",
        featuredName: "Bolo Matilda",
        description: "Massa fofinha de chocolate intenso com recheio e cobertura ultra cremosos. O verdadeiro sonho de qualquer amante de chocolate!",
        image: "imagens/Bolo_matilda.png",
        category: "Fatia",
        priceCents: 2500,
        availability: "confirm",
        options: []
    },
    {
        id: "fatia-ninho-morango",
        name: "Fatia de Ninho com Morango",
        featuredName: "Bolo Ninho c/ Morango",
        description: "Creme aveludado de Leite Ninho combinado com morangos frescos e selecionados. Uma opção leve, equilibrada e irresistível.",
        image: "imagens/ninho_morango.png",
        category: "Fatia",
        priceCents: 2500,
        availability: "confirm",
        options: []
    },
    {
        id: "fatia-bolo-pudim",
        name: "Fatia de Bolo Pudim",
        featuredName: "Bolo Pudim",
        description: "A união perfeita entre a massa molhadinha de bolo e a doçura cremosa do pudim artesanal. O melhor de dois mundos numa só fatia!",
        image: "imagens/bolo_pudim.png",
        category: "Fatia",
        priceCents: 2500,
        availability: "confirm",
        options: []
    },
    {
        id: "fatia-abacaxi-cocada",
        name: "Fatia de Bolo de Abacaxi com Cocada",
        featuredName: "Abacaxi com Cocada",
        description: "Bolo macio com abacaxi e cobertura de cocada.",
        image: "imagens/abaxaxi_com_cocada.png",
        category: "Fatia",
        priceCents: 2500,
        availability: "confirm",
        options: []
    },
    {
        id: "fatia-kinder-bueno",
        name: "Fatia de Bolo Kinder Bueno",
        featuredName: "Kinder Bueno",
        description: "Bolo cremoso inspirado no sabor de Kinder Bueno.",
        image: "imagens/kinder_bueno.png",
        category: "Fatia",
        priceCents: 2500,
        availability: "confirm",
        options: []
    },
    {
        id: "fatia-maracuja-chocolate",
        name: "Fatia de Bolo de Maracujá com Chocolate",
        featuredName: "Maracujá com Chocolate",
        description: "A combinação do azedinho do maracujá com chocolate.",
        image: "imagens/maracuja_chocolate.png",
        category: "Fatia",
        priceCents: 2500,
        availability: "confirm",
        options: []
    }
];

// Atualiza o ano do rodapé automaticamente.
const copyright = document.querySelector(".footer small");

if (copyright) {
    copyright.textContent =
        `© ${new Date().getFullYear()} Marília Bolos. Todos os direitos reservados.`;
}

const orderCatalog = document.getElementById("order-catalog");
const cartItemsContainer = document.getElementById("cart-items");
const cartCount = document.getElementById("cart-count");
const cartLink = document.querySelector(".cart-link");
const cartTotal = document.getElementById("cart-total");
const cartNote = document.getElementById("cart-note");
const cartFeedback = document.getElementById("cart-feedback");
const finalizeReservationButton = document.getElementById("finalize-reservation");
const confirmationDialog = document.getElementById("reservation-confirmation");
const confirmationItems = document.getElementById("confirmation-items");
const confirmationTotal = document.getElementById("confirmation-total");
const confirmWhatsAppButton = document.getElementById("confirm-whatsapp");
const cartStorageKey = "marilia-bolos-cart";
let cart = [];
const selectedQuantities = new Map();

const updateCartBadge = () => {
    const unitCount = cart.reduce((total, item) => total + item.quantity, 0);
    if (cartCount) cartCount.textContent = String(unitCount);
    if (cartLink) cartLink.setAttribute("aria-label", `Reserva: ${unitCount} ${unitCount === 1 ? "item" : "itens"}`);
};

const escapeHTML = (value) => String(value).replace(/[&<>"']/g, (character) => ({
    "&": "&amp;",
    "<": "&lt;",
    ">": "&gt;",
    '"': "&quot;",
    "'": "&#39;"
}[character]));

const isValidPrice = (cents) => Number.isInteger(cents) && cents >= 0;

const formatMoney = (cents) => !isValidPrice(cents)
    ? "A confirmar"
    : new Intl.NumberFormat("pt-BR", { style: "currency", currency: "BRL" }).format(cents / 100);

const getProduct = (productId) => ORDER_PRODUCTS.find((product) => product.id === productId);

const getUnitPrice = (product, selections) => {
    let price = isValidPrice(product.priceCents) ? product.priceCents : null;

    product.options.forEach((option) => {
        const selected = selections[option.id];
        const choice = option.choices?.find((item) => item.value === selected);
        if (choice && isValidPrice(choice.priceCents)) {
            price = choice.priceCents;
        }
    });

    return price;
};

const getCartTotal = () => {
    if (!cart.length) return 0;

    const lines = cart.map((item) => {
        const product = getProduct(item.productId);
        return product ? getUnitPrice(product, item.selections) : null;
    });

    if (lines.some((price) => price === null)) return null;

    return cart.reduce((total, item, index) => total + lines[index] * item.quantity, 0);
};

const describeSelections = (product, selections) => product.options
    .filter((option) => selections[option.id])
    .map((option) => {
        const value = selections[option.id];
        const choice = option.choices?.find((item) => item.value === value);
        return `${option.label}: ${choice ? choice.label : value}`;
    });

const cartItemKey = (productId, selections) =>
    `${productId}:${JSON.stringify(Object.entries(selections).sort(([first], [second]) => first.localeCompare(second)))}`;

const showCartFeedback = (message) => {
    if (cartFeedback) cartFeedback.textContent = message;
};

const persistCart = () => {
    try {
        localStorage.setItem(cartStorageKey, JSON.stringify(cart));
        return true;
    } catch (error) {
        console.error("Não foi possível salvar a reserva neste navegador.", error);
        showCartFeedback("Não foi possível salvar a reserva neste navegador. Seus itens podem não permanecer após sair da página.");
        return false;
    }
};

const restoreCart = () => {
    try {
        const savedCart = localStorage.getItem(cartStorageKey);
        if (!savedCart) return [];

        const parsedCart = JSON.parse(savedCart);
        if (!Array.isArray(parsedCart)) throw new Error("O conteúdo salvo não é uma lista.");

        let discardedItems = 0;
        const restoredItems = parsedCart.flatMap((item) => {
            if (!item || !getProduct(item.productId)) {
                discardedItems += 1;
                return [];
            }
            const quantity = Number(item.quantity);
            if (!Number.isInteger(quantity) || quantity < 1 || quantity > 99) {
                discardedItems += 1;
                return [];
            }
            const selections = item.selections && typeof item.selections === "object" && !Array.isArray(item.selections)
                ? item.selections
                : {};
            return [{ productId: item.productId, quantity, selections }];
        });
        if (discardedItems) {
            showCartFeedback("Alguns itens salvos não estão mais no cardápio e foram removidos da reserva.");
        }
        return restoredItems;
    } catch (error) {
        console.error("Não foi possível restaurar a reserva salva.", error);
        showCartFeedback("Não foi possível restaurar os itens salvos. Você pode continuar montando uma nova reserva.");
        return [];
    }
};

cart = restoreCart();
updateCartBadge();

const renderOptionFields = (product) => product.options.map((option) => {
    const required = option.required ? " required" : "";
    if (option.type === "select") {
        const choices = (option.choices || []).map((choice) =>
            `<option value="${escapeHTML(choice.value)}">${escapeHTML(choice.label)}${isValidPrice(choice.priceCents) ? ` — ${formatMoney(choice.priceCents)}` : ""}</option>`
        ).join("");
        return `<label>${escapeHTML(option.label)}<select data-option-id="${escapeHTML(option.id)}"${required}><option value="">Selecione</option>${choices}</select></label>`;
    }

    return `<label>${escapeHTML(option.label)}<input type="text" data-option-id="${escapeHTML(option.id)}" maxlength="160"${required}></label>`;
}).join("");

const renderCatalog = () => {
    if (!orderCatalog) return;

    orderCatalog.innerHTML = ORDER_PRODUCTS.map((product) => {
        const quantity = cart
            .filter((item) => item.productId === product.id)
            .reduce((total, item) => total + item.quantity, 0);
        const selectedQuantity = selectedQuantities.get(product.id) || 1;
        const availability = product.availability === false
            ? "Indisponível no momento"
            : product.availability === true
                ? "Disponível no festival"
                : "Disponibilidade a confirmar";
        const disabled = product.availability === false ? " disabled" : "";
        return `
            <article class="order-card">
                <img src="${escapeHTML(product.image)}" alt="${escapeHTML(product.name)}" loading="lazy">
                <div class="order-card-content">
                    <span class="order-card-category">${escapeHTML(product.category)}</span>
                    <h3>${escapeHTML(product.name)}</h3>
                    <p class="order-card-description">${escapeHTML(product.description)}</p>
                    <p class="order-card-price">${isValidPrice(product.priceCents) ? formatMoney(product.priceCents) : "Preço sob consulta"}</p>
                    <p class="order-card-availability">${availability}</p>
                    <p class="order-card-quantity" aria-live="polite">Na reserva: <strong>${quantity}</strong></p>
                    <form class="product-order-form" data-product-id="${escapeHTML(product.id)}">
                        ${product.options.length ? `<div class="order-options">${renderOptionFields(product)}</div>` : ""}
                        <div class="product-quantity-control" role="group" aria-label="Quantidade de ${escapeHTML(product.name)}">
                            <button class="quantity-button" type="button" data-quantity-action="-1" aria-label="Diminuir quantidade">−</button>
                            <output data-product-quantity aria-live="polite">${selectedQuantity}</output>
                            <button class="quantity-button" type="button" data-quantity-action="1" aria-label="Aumentar quantidade">+</button>
                        </div>
                        <button class="btn add-to-cart" type="button"${disabled}>Adicionar</button>
                    </form>
                </div>
            </article>
        `;
    }).join("");
};

const renderCart = () => {
    if (!cartItemsContainer) return;

    cartItemsContainer.innerHTML = cart.map((item, index) => {
        const product = getProduct(item.productId);
        if (!product) return "";
        const price = getUnitPrice(product, item.selections);
        const selections = describeSelections(product, item.selections);
        return `
            <article class="cart-item">
                <div class="cart-item-main">
                    <img src="${escapeHTML(product.image)}" alt="" loading="lazy">
                    <div>
                        <h4 class="cart-item-name">${escapeHTML(product.name)}</h4>
                        ${selections.length ? `<p class="cart-item-details">${selections.map(escapeHTML).join(" · ")}</p>` : ""}
                        <p class="cart-item-price">Unitário: ${formatMoney(price)} · Subtotal: ${price === null ? "A confirmar" : formatMoney(price * item.quantity)}</p>
                    </div>
                </div>
                <div class="cart-item-controls" aria-label="Quantidade de ${escapeHTML(product.name)}">
                    <button class="quantity-button" type="button" data-cart-action="decrease" data-cart-index="${index}" aria-label="Diminuir quantidade">−</button>
                    <span aria-live="polite">${item.quantity}</span>
                    <button class="quantity-button" type="button" data-cart-action="increase" data-cart-index="${index}" aria-label="Aumentar quantidade">+</button>
                    <button class="remove-item" type="button" data-cart-action="remove" data-cart-index="${index}" aria-label="Remover ${escapeHTML(product.name)}">Remover</button>
                </div>
            </article>
        `;
    }).join("");

    if (!cart.length) {
        cartItemsContainer.innerHTML = '<p class="cart-empty">Sua reserva está vazia. Escolha uma fatia para começar.</p>';
    }

    updateCartBadge();
    if (cartTotal) cartTotal.textContent = formatMoney(getCartTotal());
    if (cartNote) {
        const unavailableProduct = cart.some((item) => getProduct(item.productId)?.availability === false);
        cartNote.textContent = unavailableProduct
            ? "Há um item indisponível na reserva. Remova-o para continuar."
            : cart.length && getCartTotal() === null
                ? "Os preços ainda não estão cadastrados. Valores e disponibilidade serão confirmados pela Marília no WhatsApp."
                : "";
    }
    if (finalizeReservationButton) {
        finalizeReservationButton.disabled = cart.length === 0 || cart.some((item) => getProduct(item.productId)?.availability === false);
    }
    const clearCartButton = document.getElementById("clear-cart");
    if (clearCartButton) clearCartButton.disabled = cart.length === 0;
    renderCatalog();
};

const addToCart = (product, selections, quantity) => {
    if (product.availability === false) {
        showCartFeedback(`${product.name} está indisponível no momento.`);
        return;
    }

    const invalidRequiredOption = product.options.some((option) =>
        option.required && !String(selections[option.id] || "").trim()
    );
    if (invalidRequiredOption) {
        showCartFeedback("Preencha as opções obrigatórias antes de adicionar à reserva.");
        return;
    }

    const key = cartItemKey(product.id, selections);
    const existing = cart.find((item) => cartItemKey(item.productId, item.selections) === key);
    if (existing) {
        if (existing.quantity + quantity > 99) {
            showCartFeedback("O limite de 99 unidades por combinação foi atingido.");
            return;
        }
        existing.quantity += quantity;
    } else {
        cart.push({ productId: product.id, quantity, selections });
    }

    const saved = persistCart();
    renderCart();
    if (saved) showCartFeedback(`${product.name} adicionada à reserva.`);
};

const buildReservationMessage = () => {
    const items = cart.map((item) => {
        const product = getProduct(item.productId);
        return product ? `${product.name} (${item.quantity} ${item.quantity === 1 ? "fatia" : "fatias"})` : "";
    }).filter(Boolean);

    return `Olá! Gostaria de confirmar a reserva das seguintes fatias para retirar no festival:\n${items.join("\n")}`;
};

const openReservationConfirmation = () => {
    if (!cart.length) {
        showCartFeedback("Adicione ao menos uma fatia antes de finalizar a reserva.");
        return;
    }

    if (cart.some((item) => getProduct(item.productId)?.availability === false)) {
        showCartFeedback("Remova os itens indisponíveis antes de finalizar a reserva.");
        return;
    }

    if (!confirmationDialog || !confirmationItems || !confirmationTotal) {
        showCartFeedback("Não foi possível abrir a confirmação da reserva. Atualize a página e tente novamente.");
        return;
    }

    confirmationItems.innerHTML = cart.map((item) => {
        const product = getProduct(item.productId);
        if (!product) return "";
        const selections = describeSelections(product, item.selections);
        const details = selections.length
            ? `<small>${selections.map(escapeHTML).join(" · ")}</small>`
            : "";
        return `<li><span><strong>${escapeHTML(product.name)}</strong>${details}</span><span>${item.quantity} ${item.quantity === 1 ? "fatia" : "fatias"}</span></li>`;
    }).join("");
    confirmationTotal.textContent = formatMoney(getCartTotal());
    confirmationDialog.showModal();
};

const finalizeReservation = () => {
    if (!cart.length) {
        showCartFeedback("Adicione ao menos uma fatia antes de finalizar a reserva.");
        return;
    }

    if (/^\d{12,13}$/.test(ORDER_CONFIG.whatsappNumber)) {
        const whatsappUrl = `https://wa.me/${ORDER_CONFIG.whatsappNumber}?text=${encodeURIComponent(buildReservationMessage())}`;
        window.location.assign(whatsappUrl);
    } else {
        showCartFeedback("Configure o número comercial do WhatsApp antes de finalizar a reserva.");
    }
};

if (orderCatalog && cartItemsContainer && finalizeReservationButton) {
    renderCatalog();
    renderCart();

    orderCatalog.addEventListener("click", (event) => {
        const button = event.target.closest(".add-to-cart, [data-quantity-action]");
        if (!button) return;
        const form = button.closest(".product-order-form");
        if (!form) return;
        const product = getProduct(form.dataset.productId);
        if (!product) return;

        const quantityOutput = form.querySelector("[data-product-quantity]");
        const currentQuantity = Number(quantityOutput.textContent);
        if (button.hasAttribute("data-quantity-action")) {
            const change = Number(button.dataset.quantityAction);
            const quantity = Math.min(99, Math.max(1, currentQuantity + change));
            selectedQuantities.set(product.id, quantity);
            quantityOutput.textContent = String(quantity);
            return;
        }

        const selections = {};
        form.querySelectorAll("[data-option-id]").forEach((input) => {
            if (input.value.trim()) selections[input.dataset.optionId] = input.value.trim();
        });
        addToCart(product, selections, currentQuantity);
    });

    cartItemsContainer.addEventListener("click", (event) => {
        const button = event.target.closest("[data-cart-action]");
        if (!button) return;
        const index = Number(button.dataset.cartIndex);
        if (!Number.isInteger(index) || !cart[index]) return;

        if (button.dataset.cartAction === "increase") {
            if (cart[index].quantity < 99) cart[index].quantity += 1;
            else showCartFeedback("O limite de 99 unidades por combinação foi atingido.");
        } else if (button.dataset.cartAction === "decrease") {
            cart[index].quantity -= 1;
            if (cart[index].quantity < 1) cart.splice(index, 1);
        } else if (button.dataset.cartAction === "remove") {
            cart.splice(index, 1);
        }

        persistCart();
        renderCart();
    });

    document.getElementById("clear-cart").addEventListener("click", () => {
        cart = [];
        const saved = persistCart();
        renderCart();
        if (saved) showCartFeedback("Reserva limpa.");
    });

    finalizeReservationButton.addEventListener("click", openReservationConfirmation);

    if (confirmationDialog) {
        confirmationDialog.querySelectorAll("[data-close-confirmation]").forEach((button) => {
            button.addEventListener("click", () => confirmationDialog.close());
        });
        confirmationDialog.addEventListener("click", (event) => {
            if (event.target === confirmationDialog) confirmationDialog.close();
        });
        confirmationDialog.addEventListener("keydown", (event) => {
            if (event.key !== "Escape") return;
            event.preventDefault();
            confirmationDialog.close();
        });
        confirmationDialog.addEventListener("close", () => finalizeReservationButton.focus());
    }

    if (confirmWhatsAppButton) {
        confirmWhatsAppButton.addEventListener("click", finalizeReservation);
    }
}

const galleryGrid = document.querySelector(".gallery-grid");
const galleryLightbox = document.getElementById("gallery-lightbox");
const lightboxImage = document.getElementById("lightbox-image");
const lightboxCaption = document.getElementById("lightbox-caption");

if (galleryGrid && galleryLightbox && lightboxImage && lightboxCaption) {
    const images = Array.from(galleryGrid.querySelectorAll("img"));
    let activeImageIndex = 0;

    images.forEach((image, index) => {
        const caption = image.closest("figure")?.querySelector("figcaption")?.textContent.trim();
        image.tabIndex = 0;
        image.setAttribute("role", "button");
        image.setAttribute("aria-haspopup", "dialog");
        image.setAttribute("aria-label", `Ampliar ${caption || image.alt || `foto ${index + 1}`}`);
    });

    const showImage = (index) => {
        activeImageIndex = (index + images.length) % images.length;
        const image = images[activeImageIndex];
        lightboxImage.src = image.currentSrc || image.src;
        lightboxImage.alt = image.alt;
        lightboxCaption.textContent =
            image.closest("figure")?.querySelector("figcaption")?.textContent.trim() || image.alt;
    };

    const openImage = (image) => {
        const index = images.indexOf(image);
        if (index < 0) return;
        showImage(index);
        galleryLightbox.showModal();
    };

    galleryGrid.addEventListener("click", (event) => {
        const image = event.target.closest("img");
        if (image) openImage(image);
    });

    galleryGrid.addEventListener("keydown", (event) => {
        if (event.target.tagName !== "IMG" || !["Enter", " "].includes(event.key)) return;
        event.preventDefault();
        openImage(event.target);
    });

    galleryLightbox.querySelector("[data-lightbox-close]").addEventListener("click", () => galleryLightbox.close());
    galleryLightbox.querySelector("[data-lightbox-previous]").addEventListener("click", () => showImage(activeImageIndex - 1));
    galleryLightbox.querySelector("[data-lightbox-next]").addEventListener("click", () => showImage(activeImageIndex + 1));
    galleryLightbox.addEventListener("click", (event) => {
        if (event.target === galleryLightbox) galleryLightbox.close();
    });
    galleryLightbox.addEventListener("keydown", (event) => {
        if (event.key === "Escape") {
            event.preventDefault();
            galleryLightbox.close();
            return;
        }
        if (event.key === "ArrowLeft") showImage(activeImageIndex - 1);
        if (event.key === "ArrowRight") showImage(activeImageIndex + 1);
    });
}
