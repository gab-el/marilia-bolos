# 🎂 Festival de Bolos — Marília Bolos

Site da **Marília Bolos** dividido em três páginas para apresentar o Festival de Bolos, a galeria de fotos e a equipe.

---

## 🚀 Funcionalidades

- **Apresentação Atraente:** Secção inicial (*Hero*) com destaque para a confeiteira e efeitos visuais interativos de *hover*.
- **Cardápio e carrinho:** Ajuste quantidades, remova sabores e confira o valor estimado da reserva, salva neste navegador.
- **Reservas pelo WhatsApp:** Revise os itens e o total antes de abrir o WhatsApp com a mensagem pronta.
- **Fotos e equipe:** Galeria com fotos ampliáveis e navegação por teclado, além da apresentação da Marília e da equipe.
- **Informações do Evento:** Endereço do festival e mapa interativo do Google Maps.
- **Acessibilidade e responsividade:** Atalho para o conteúdo, foco visível, movimento reduzido e acesso rápido à reserva em celulares.

---

## 🛠️ Tecnologias Utilizadas

- **HTML5:** Estruturação semântica e acessível.
- **CSS3:** Estilização personalizada, Flexbox, CSS Grid e animações/efeitos de transição.
- **JavaScript (Vanilla):** Comportamentos interativos da página.
- **Google Fonts:** Tipografias *DM Sans* e *Playfair Display*.

---

## 📁 Estrutura de Ficheiros

```text
├── index.html       # Página principal do site
├── galeria.html     # Fotos dos festivais
├── equipe.html      # Apresentação da equipe
├── style.css        # Estilos, cores e animações
├── script.js        # Scripts de interatividade
├── imagens/         # Imagens e ícones
├── festival/        # Fotos para a galeria
└── equipe/          # Fotos da equipe
```

## Configuração do cardápio e das reservas

Os produtos e o telefone comercial ficam no início de `script.js`, nos objetos `ORDER_PRODUCTS` e `ORDER_CONFIG`. O catálogo atual tem seis sabores de fatias, todos por R$ 25,00 (`priceCents: 2500`).

Antes de publicar o cardápio:

- Atualize `priceCents` em centavos se o preço de algum produto mudar (por exemplo, `4500` representa R$ 45,00).
- Atualize `availability` para `true`, `false` ou mantenha `"confirm"` para pedir confirmação da disponibilidade.
- O número fica em `ORDER_CONFIG.whatsappNumber`, no formato internacional somente com dígitos. Ele foi reaproveitado dos links existentes; confirme se continua sendo o contato comercial correto.
- As fotos da galeria ficam na pasta `festival/` e são listadas em `galeria.html`.
- Atualize os nomes, funções e fotos individuais dos integrantes em `equipe.html`. Os arquivos atuais da pasta `equipe/` são fotos coletivas e não identificam cada pessoa.

A reserva é armazenada em `localStorage` neste navegador. Ao finalizar, o site abre o WhatsApp com os sabores e quantidades escolhidos; o cliente ainda precisa revisar e enviar a mensagem para confirmar a solicitação.
