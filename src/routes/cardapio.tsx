import { createFileRoute } from "@tanstack/react-router";
import { useCallback, useEffect, useLayoutEffect, useMemo, useRef, useState } from "react";
import { ArrowRight, Instagram, MessageCircle, ShoppingBag, X, Plus, Minus, Trash2 } from "lucide-react";

export const Route = createFileRoute("/cardapio")({ component: Cardapio });

const instagram = "https://www.instagram.com/bykimconfeitaria";
const ifood = "https://www.ifood.com.br/delivery/sao-paulo-sp/by-kim-confeitaria-santa-cecilia/6623c15d-18c8-4c00-90ab-61aabacf720b";
const phone = "5511913171186";
const whatsappBase = `https://wa.me/${phone}?text=`;

const categories = [
  {
    name: "Memoráveis",
    items: [
      { name: "Bolo de Brigadeiro 15 Camadas", description: "Bolo de chocolate com 15 camadas intercaladas de massa e brigadeiro.", price: "R$ 49,40", slice: true },
      { name: "Cheesecake Original", description: "Base amanteigada, 2 texturas de cheesecake (assada e fria), coberto por crumble de chocolate branco", price: "R$ 39,00", slice: true },
      { name: "Cheesecake Cookies n Cream", description: "Base amanteigada de cacau, cheesecake dupla de baunilha e crumble de cacau salgado, coberta com crumble de cacau", price: "R$ 39,00", slice: true },
      { name: "Bolo de Cenoura 15 Camadas", description: "Bolo de cenoura com brigadeiro, 15 camadas, irmãozinho do 15 camadas de chocolate", price: "R$ 49,40", slice: true },
      { name: "Mil Folhas Palmier", description: "Massa de palmier formando um mil folhas, com creme de confeiteiro clássico", price: "R$ 40,04" },
    ],
  },
  {
    name: "Inovadores",
    items: [
      { name: "Cheesecake de Trufas", description: "Base amanteigada, cheesecake assada com adição de trufas negras em conserva", price: "R$ 42,00" },
      { name: "Cheesecake Cumaru", description: "Base amanteigada, 2 texturas de cheesecake de cumaru (assada e fria), coberto por crumble de nozes e especiarias", price: "R$ 39,00", slice: true },
    ],
  },
  {
    name: "Carré Palmier",
    items: [
      { name: "Carré Palmier com Chocolate Meio Amargo", description: "Palmier em formato de carreira, coberto com chocolate meio amargo", price: "R$ 25,50" },
      { name: "Carré Palmier com Chocolate Branco", description: "Palmier em formato de carreira, coberto com chocolate branco", price: "R$ 25,50" },
      { name: "Carré Palmier com Matchá e Flocos de Sal", description: "Palmier em formato de carreira, com matchá e flocos de sal", price: "R$ 25,50" },
      { name: "Carré Palmier", description: "Palmier em formato de carreira", price: "R$ 20,00" },
    ],
  },
  {
    name: "Tradicionais",
    items: [
      { name: "Entremet Espresso", description: "Bolo de chocolate regado com café, cremoso de chocolate, mousse de chocolate caramelizado com café", price: "R$ 45,50", slice: true },
      { name: "Torta Caramelo e Nozes", description: "Torta com caramelo, nozes e um toque de especiarias", price: "R$ 45,50" },
      { name: "Torta de Banana", description: "Base de sablé, bolo de amêndoas e laranja, doce de leite, purê de banana, banana fresca e creme de doce de leite", price: "R$ 45,50" },
    ],
  },
  {
    name: "Coffee Sides",
    items: [
      { name: "Ugly Bites", description: "Aparas das massas folhadas, a versão crocante do desperdício", price: "R$ 18,00" },
      { name: "Sable com Chocolate Meio Amargo", description: "Biscoito amanteigado banhado com chocolate meio amargo, pacote com 10 unidades", price: "R$ 36,00" },
      { name: "Sablee com Chocolate de Matchá", description: "Biscoitos amanteigados banhados no chocolate de matchá", price: "R$ 36,00" },
      { name: "Sable da Debora com Chocolate Branco", description: "Biscoitinhos amanteigados banhados no chocolate branco", price: "R$ 36,00" },
      { name: "Chocolate de Matchá com Crispy de Arroz", description: "Pacotinho de crispy de arroz matchá, 90g", price: "R$ 43,50" },
      { name: "Chocolate Meio Amargo com Crispy de Arroz", description: "Pacotinho de crispy de arroz meio amargo, 90g", price: "R$ 43,50" },
      { name: "Chocolate Branco com Crispy de Arroz", description: "Pacotinho de crispy de arroz chocolate branco, 90g", price: "R$ 43,50" },
      { name: "Nozes Crocantes", description: "Nozes temperadinhas com especiarias, perfeito para um lanchinho com café, 90g", price: "R$ 52,00" },
    ],
  },
  {
    name: "Presentes",
    items: [
      { name: "Caixa Presenteável Carré", description: "1 carré palmier de cada sabor: tradicional, chocolate branco, chocolate meio amargo e chocolate matchá, em caixa", price: "R$ 130,00" },
      { name: "Presente Sable", description: "Sable banhado no chocolate, em caixa, escolha 1 entre 3 chocolates", price: "R$ 60,00" },
    ],
  },
];

type Product = { name: string; description?: string; price: string; slice?: boolean; category: string; flavor?: string | undefined; image?: string | undefined };
const productImages: Record<string, string> = {
  "Bolo de Brigadeiro 15 Camadas": "/bolo%20brigadeiro.jpg?v=20261122",
  "Bolo de Cenoura 15 Camadas": "/bolo%20de%20cenoura.jpg?v=20261122",
  "Cheesecake Original": "/cheese-cake.jpg?v=20261122",
  "Cheesecake Cookies n Cream": "/cheese%20cake%20cookie.jpg?v=20261122",
  "Cheesecake Cumaru": "/cheese%20cake%20cumaru.jpg?v=20261122",
  "Mil Folhas Palmier": "/mil%20folhas.jpg?v=20261122",
  "Carré Palmier com Chocolate Meio Amargo": "/carre%20chocolate%20meio%20amargp.jpg?v=20261122",
  "Carré Palmier com Chocolate Branco": "/carre%20chocolate%20branco.jpg?v=20261122",
  "Carré Palmier com Matchá e Flocos de Sal": "/carre%20matcha.jpg?v=20261122",
  "Carré Palmier": "/carre.jpg?v=20261122",
  "Entremet Espresso": "/entremet.jpg?v=20261122",
  "Torta Caramelo e Nozes": "/torta%20caramelo%20nozes.jpg?v=20261122",
  "Torta de Banana": "/torta%20banana.jpg?v=20261122",
  "Ugly Bites": "/uggly%20bites.jpg?v=20261122",
  "Sable com Chocolate Meio Amargo": "/sable%20chocolaye.jpg?v=20261122",
  "Sable da Debora com Chocolate Branco": "/sable-chocolate-branco.jpg?v=20261122",
  "Sablee com Chocolate de Matchá": "/sable%20matcha.jpg?v=20261122",
  "Chocolate de Matchá com Crispy de Arroz": "/chocolate%20matcha.jpg?v=20261122",
  "Chocolate Meio Amargo com Crispy de Arroz": "/chocolate%20meio%20amargo.jpg?v=20261122",
  "Chocolate Branco com Crispy de Arroz": "/chocolte%20branco.jpg?v=20261122",
  "Nozes Crocantes": "/nozes.jpg?v=20261122",
  "Caixa Presenteável Carré": "/caixa%20presente.jpg?v=20261122",
  "Presente Sable": "/presente%20sable.jpg?v=20261122",
};
type CartItem = { product: Product; quantity: number };
const cartKey = (product: Product) => `${product.name}::${product.flavor ?? ""}`;
const flavors = ["Composta", "Goiabada", "Morango"];
const cheesecakeNames = ["Cheesecake Original", "Cheesecake Cookies n Cream", "Cheesecake Cumaru", "Cheesecake de Trufas"];
const hasFlavor = (product: Product) => cheesecakeNames.some((name) => product.name === name);
type Fulfillment = "pickup" | "delivery";
const allProducts: Product[] = categories.flatMap((category) => category.items.map((item) => ({ ...item, category: category.name, image: productImages[item.name] })));
const money = (value: number) => value.toLocaleString("pt-BR", { style: "currency", currency: "BRL" });
const cents = (price: string) => Math.round(Number(price.replace("R$", "").trim().replace(".", "").replace(",", ".")) * 100);
const productMessage = (product: Product, quantity: number) => {
  const total = money(cents(product.price) * quantity / 100);
  return `Olá! Vim pelo site da By Kim e quero pedir: ${quantity}x ${product.name}${product.slice ? " (fatia)" : ""}${product.flavor ? ` - ${product.flavor}` : ""}. Total: ${total}`;
};

function Cardapio() {
  const [selected, setSelected] = useState<Product | null>(null);
  const [closingSelected, setClosingSelected] = useState(false);
  const [panelSide, setPanelSide] = useState<"right" | "left">("right");
  const [coveredIndex, setCoveredIndex] = useState<number | null>(null);
  const [pendingSelection, setPendingSelection] = useState<{ product: Product; flavor: string; trigger: HTMLButtonElement } | null>(null);
  const [addedFeedback, setAddedFeedback] = useState(false);
  const [productQty, setProductQty] = useState(1);
  const [flavorSelections, setFlavorSelections] = useState<Record<string, string>>({});
  const [selectedFlavor, setSelectedFlavor] = useState("Composta");
  const [cart, setCart] = useState<CartItem[]>([]);
  const [cartLoaded, setCartLoaded] = useState(false);
  const [cartOpen, setCartOpen] = useState(false);
  const [customerName, setCustomerName] = useState("");
  const [notes, setNotes] = useState("");
  const [fulfillment, setFulfillment] = useState<Fulfillment>("pickup");
  const gridPositionsRef = useRef<Map<HTMLElement, Map<HTMLElement, DOMRect>>>(new Map());
  const animateGridRef = useRef(false);

  const openProduct = useCallback((product: Product, flavor: string, trigger: HTMLButtonElement) => {
    const grid = trigger.closest(".bk-menu-grid");
    const cards = grid ? Array.from(grid.querySelectorAll<HTMLElement>(":scope > .bk-menu-item")) : [];
    const current = trigger.closest<HTMLElement>(".bk-menu-item");
    const index = current ? cards.indexOf(current) : -1;
    const rect = current?.getBoundingClientRect();
    const sameRow = rect ? cards.map((card, i) => ({ card, i, rect: card.getBoundingClientRect() })).filter((entry) => Math.abs(entry.rect.top - rect.top) < 2) : [];
    const position = sameRow.findIndex((entry) => entry.i === index);
    const next = sameRow[position + 1];
    const previous = sameRow[position - 1];
    if (next) {
      setPanelSide("right");
      setCoveredIndex(next.i);
    } else if (previous) {
      setPanelSide("left");
      setCoveredIndex(previous.i);
    } else {
      setPanelSide("right");
      setCoveredIndex(null);
    }
    animateGridRef.current = true;
    setSelected(product);
    setSelectedFlavor(flavor);
    setProductQty(1);
    setAddedFeedback(false);
    setClosingSelected(false);
  }, []);

  const closeProduct = useCallback(() => {
    if (selected && !closingSelected) setClosingSelected(true);
  }, [selected, closingSelected]);

  useEffect(() => {
    try {
      const saved = window.localStorage.getItem("bykim-cardapio-cart-v1");
      if (saved) {
        const parsed = JSON.parse(saved) as CartItem[];
        if (Array.isArray(parsed)) setCart(parsed.filter((entry) => allProducts.some((p) => p.name === entry.product?.name) && Number.isFinite(entry.quantity) && entry.quantity > 0));
      }
    } catch { /* armazenamento local indisponível: o carrinho segue em memória */ }
    finally { setCartLoaded(true); }
  }, []);

  useEffect(() => {
    if (!cartLoaded) return;
    try { window.localStorage.setItem("bykim-cardapio-cart-v1", JSON.stringify(cart)); }
    catch { /* armazenamento local indisponível: o carrinho segue em memória */ }
  }, [cart]);

  useEffect(() => {
    if (!closingSelected) return;
    const timeout = window.setTimeout(() => {
      const nextSelection = pendingSelection;
      animateGridRef.current = true;
      setSelected(null);
      setPendingSelection(null);
      setCoveredIndex(null);
      setProductQty(1);
      setAddedFeedback(false);
      setClosingSelected(false);
      if (nextSelection) openProduct(nextSelection.product, nextSelection.flavor, nextSelection.trigger);
    }, 240);
    return () => window.clearTimeout(timeout);
  }, [closingSelected, pendingSelection, openProduct]);

  useLayoutEffect(() => {
    const grids = Array.from(document.querySelectorAll<HTMLElement>(".bk-menu-grid"));
    const nextPositions = new Map<HTMLElement, Map<HTMLElement, DOMRect>>();

    grids.forEach((grid) => {
      const cards = Array.from(grid.querySelectorAll<HTMLElement>(":scope > .bk-menu-item"));
      const previous = gridPositionsRef.current.get(grid);
      const current = new Map<HTMLElement, DOMRect>();

      cards.forEach((card) => current.set(card, card.getBoundingClientRect()));

      if (animateGridRef.current && previous) {
        cards.forEach((card) => {
          const before = previous.get(card);
          const after = current.get(card);
          if (!before || !after) return;
          const dx = before.left - after.left;
          const dy = before.top - after.top;
          if (Math.abs(dx) < 1 && Math.abs(dy) < 1) return;

          card.style.transition = "none";
          card.style.transform = `translate(${dx}px, ${dy}px)`;
          requestAnimationFrame(() => {
            card.style.transition = "transform 350ms cubic-bezier(.22,1,.36,1)";
            card.style.transform = "translate(0, 0)";
            window.setTimeout(() => {
              card.style.transition = "";
              card.style.transform = "";
            }, 370);
          });
        });
      }

      nextPositions.set(grid, current);
    });

    gridPositionsRef.current = nextPositions;
    animateGridRef.current = false;
  }, [selected, closingSelected]);

  useEffect(() => {
    if (!selected) return;
    const onPointerDown = (event: PointerEvent) => {
      const target = event.target as HTMLElement | null;
      if (target?.closest(".bk-menu-purchase-panel") || target?.closest(".bk-menu-item-open")) return;
      closeProduct();
    };
    const onKeyDown = (event: KeyboardEvent) => { if (event.key === "Escape") closeProduct(); };
    document.addEventListener("pointerdown", onPointerDown);
    window.addEventListener("keydown", onKeyDown);
    return () => {
      document.removeEventListener("pointerdown", onPointerDown);
      window.removeEventListener("keydown", onKeyDown);
    };
  }, [selected, closeProduct]);

  useEffect(() => {
    if (!addedFeedback) return;
    const timeout = window.setTimeout(() => setAddedFeedback(false), 1500);
    return () => window.clearTimeout(timeout);
  }, [addedFeedback]);

  useEffect(() => {
    if (!cartOpen) return;
    const onKeyDown = (event: KeyboardEvent) => { if (event.key === "Escape") setCartOpen(false); };
    window.addEventListener("keydown", onKeyDown);
    document.body.style.overflow = "hidden";
    return () => { window.removeEventListener("keydown", onKeyDown); document.body.style.overflow = ""; };
  }, [cartOpen]);

  const itemCount = cart.reduce((sum, entry) => sum + entry.quantity, 0);
  const totalCents = cart.reduce((sum, entry) => sum + cents(entry.product.price) * entry.quantity, 0);

  const addToCart = (product: Product, quantity: number, openCart = true) => {
    setCart((current) => {
      const key = cartKey(product);
      const existing = current.find((entry) => cartKey(entry.product) === key);
      return existing
        ? current.map((entry) => cartKey(entry.product) === key ? { ...entry, quantity: entry.quantity + quantity } : entry)
        : [...current, { product, quantity }];
    });
    if (openCart) {
      setSelected(null);
      setClosingSelected(false);
      setCoveredIndex(null);
      setProductQty(1);
      setCartOpen(true);
    }
  };

  const updateQuantity = (key: string, quantity: number) => {
    setCart((current) => quantity < 1 ? current.filter((entry) => cartKey(entry.product) !== key) : current.map((entry) => cartKey(entry.product) === key ? { ...entry, quantity } : entry));
  };

  const cartMessage = useMemo(() => {
    const lines = cart.map(({ product, quantity }) => `- ${quantity}x ${product.name}${product.slice ? " (fatia)" : ""}${product.flavor ? ` - ${product.flavor}` : ""} · ${money(cents(product.price) * quantity / 100)}`);
    const deliveryText = fulfillment === "pickup" ? "Retirada em Santa Cecília" : "Entrega pelo iFood";
    return [
      "Olá! Vim pelo site da By Kim e quero fazer este pedido:",
      ...lines,
      `Total: ${money(totalCents / 100)}`,
      ...(customerName.trim() ? [`Nome: ${customerName.trim()}`] : []),
      deliveryText,
      ...(notes.trim() ? [`Observações: ${notes.trim()}`] : []),
    ].join("\n");
  }, [cart, totalCents, customerName, notes, fulfillment]);

  return (
    <main className="bk-page bk-menu-page">
      <div className="bk-topline">DOCES FORA DA CAIXA</div>
      <header className="bk-header bk-menu-header">
        <a className="bk-wordmark" href="/" aria-label="By Kim início">
          <span className="bk-mark">By Kim</span>
          <span className="bk-submark">CONFEITARIA</span>
        </a>
        <a className="bk-menu-back" href="/">← VOLTAR AO SITE</a>
        <div className="bk-menu-header-actions">
          <button className="bk-cart-trigger" type="button" onClick={() => setCartOpen(true)} aria-label={`Abrir carrinho, ${itemCount} itens`}>
            <ShoppingBag size={17} /><span>CARRINHO</span><b>{itemCount}</b>
          </button>
          <a className="bk-header-cta" href={whatsappBase + encodeURIComponent("Olá, vim pelo site da By Kim e gostaria de saber mais!")} target="_blank" rel="noopener noreferrer">PEDIR <ArrowRight size={14} /></a>
        </div>
      </header>

      <section className="bk-menu-intro">
        <p className="bk-eyebrow"><span /> BY KIM</p>
        <h1>Cardápio</h1>
        <p>Doce, com personalidade.</p>
      </section>

      <div className="bk-menu-categories">
        {categories.map((category) => (
          <section className="bk-menu-category" key={category.name}>
            <div className="bk-menu-category-heading">
              <h2>{category.name}</h2>
            </div>
            <div className="bk-menu-grid">
              {category.items.map((item, itemIndex) => {
                const product = allProducts.find((entry) => entry.name === item.name)!;
                const flavored = hasFlavor(product);
                const flavor = flavored ? (flavorSelections[item.name] ?? "Composta") : undefined;
                const listingProduct = flavored ? { ...product, flavor } : product;
                const expanded = selected?.name === product.name;
                const isCovered = false;
                const activeProduct = flavored ? { ...product, flavor: selectedFlavor } : product;
                return (
                  <article
                    className={`bk-menu-item bk-menu-item-button${expanded ? " bk-menu-item-expanded" : ""}${expanded && closingSelected ? " bk-menu-item-closing" : ""}${isCovered ? " bk-menu-item-covered" : ""}${isCovered && closingSelected ? " bk-menu-item-covered-closing" : ""}`}
                    key={item.name}
                    aria-hidden={isCovered ? true : undefined}
                  >
                    <button
                      className="bk-menu-item-copy bk-menu-item-open"
                      type="button"
                      aria-expanded={expanded && !closingSelected}
                      disabled={isCovered}
                      onClick={(event) => {
                        if (expanded) { closeProduct(); return; }
                        if (selected) {
                          setPendingSelection({ product: listingProduct, flavor: flavor ?? "Composta", trigger: event.currentTarget });
                          setClosingSelected(true);
                          return;
                        }
                        openProduct(listingProduct, flavor ?? "Composta", event.currentTarget);
                      }}
                    >
                      {product.image && <img className="bk-menu-product-image" src={product.image} alt={item.name} loading="lazy" />}
                      <span className="bk-menu-item-title">{item.name}</span>
                      {item.description && <span className="bk-menu-item-description">{item.description}</span>}
                    </button>
                    {expanded && (
                      <div className={`bk-menu-purchase-panel bk-menu-purchase-panel-${panelSide}${closingSelected ? " bk-menu-purchase-panel-closing" : ""}`} role="dialog" aria-label={`Comprar ${product.name}`}>
                        <button className="bk-menu-inline-close" type="button" aria-label="Fechar detalhes" onClick={closeProduct}><X size={20} /></button>
                        <div className="bk-menu-purchase-scroll">
                          <p className="bk-eyebrow"><span /> {product.category.toUpperCase()}</p>
                          <h3>{product.name}</h3>
                          {product.slice && <p className="bk-product-serving">Serve 1 pessoa</p>}
                          {product.description && <p className="bk-product-description">{product.description}</p>}
                          {flavored && <div className="bk-flavor-picker bk-flavor-picker-detail" aria-label="Escolha o sabor">{flavors.map((option) => <button type="button" key={option} className={selectedFlavor === option ? "active" : ""} onClick={() => { setSelectedFlavor(option); setFlavorSelections((current) => ({ ...current, [item.name]: option })); }}>{option}</button>)}</div>}
                          <div className="bk-product-modal-price">{product.price}{product.slice && <span> · fatia</span>}</div>
                          <div className="bk-quantity-row">
                            <span>Quantidade</span>
                            <div className="bk-quantity-control bk-menu-quantity-control">
                              <button type="button" aria-label="Diminuir quantidade" onClick={() => setProductQty((q) => Math.max(1, q - 1))}><Minus size={17} /></button>
                              <strong>{productQty}</strong>
                              <button type="button" aria-label="Aumentar quantidade" onClick={() => setProductQty((q) => q + 1)}><Plus size={17} /></button>
                            </div>
                          </div>
                          <button className="bk-modal-primary bk-menu-add-primary" type="button" onClick={() => { addToCart(flavored ? activeProduct : product, productQty, false); setAddedFeedback(true); }}>{addedFeedback ? "ADICIONADO ✓" : `ADICIONAR · ${money(cents(product.price) * productQty / 100)}`}</button>
                          <div className="bk-menu-purchase-separator" />
                          <a className="bk-modal-secondary bk-menu-purchase-link" href={whatsappBase + encodeURIComponent(productMessage(flavored ? activeProduct : product, productQty))} target="_blank" rel="noopener noreferrer">PEDIR PELO WHATSAPP <ArrowRight size={15} /></a>
                          <a className="bk-modal-ifood bk-menu-purchase-link" href={ifood} target="_blank" rel="noopener noreferrer">PEDIR PELO IFOOD <ArrowRight size={14} /></a>
                        </div>
                      </div>
                    )}
                    <>
                      {flavored && <div className="bk-flavor-picker bk-flavor-picker-list" aria-label="Sabor">
                        {flavors.map((option) => <button type="button" key={option} className={flavor === option ? "active" : ""} onClick={() => setFlavorSelections((current) => ({ ...current, [item.name]: option }))}>{option}</button>)}
                      </div>}
                      <span className="bk-menu-item-bottom">
                        <span className="bk-menu-price"><strong>{item.price}</strong>{item.slice && <small>fatia</small>}</span>
                        <button type="button" className="bk-menu-add" onClick={() => addToCart(listingProduct, 1)}>ADICIONAR</button>
                        <a className="bk-menu-order" href={whatsappBase + encodeURIComponent(productMessage(listingProduct, 1))} target="_blank" rel="noopener noreferrer">WHATSAPP <ArrowRight size={14} /></a>
                      </span>
                    </>
                  </article>
                );
              })}
            </div>
          </section>
        ))}
      </div>

      <p className="bk-menu-allergens">Alérgenos: consulte a loja antes de pedir.</p>

      <footer className="bk-footer bk-menu-footer">
        <a className="bk-footer-brand" href="/">By Kim <span>CONFEITARIA</span></a>
        <div className="bk-footer-links">
          <a href={instagram} target="_blank" rel="noopener noreferrer"><Instagram size={16} /> INSTAGRAM</a>
          <a href={whatsappBase + encodeURIComponent("Olá, vim pelo site da By Kim e gostaria de saber mais!")} target="_blank" rel="noopener noreferrer"><MessageCircle size={16} /> WHATSAPP</a>
        </div>
        <small>© {new Date().getFullYear()} BY KIM CONFEITARIA</small>
      </footer>


      {cartOpen && (
        <div className="bk-overlay bk-cart-overlay" onMouseDown={(event) => { if (event.target === event.currentTarget) setCartOpen(false); }}>
          <aside className="bk-cart-drawer" role="dialog" aria-modal="true" aria-label="Carrinho de compras">
            <header className="bk-cart-heading"><div><p className="bk-eyebrow">BY KIM</p><h2>Sua sacola <span>({itemCount})</span></h2></div><button className="bk-panel-close" type="button" aria-label="Fechar carrinho" onClick={() => setCartOpen(false)}><X size={20} /></button></header>
            {cart.length === 0 ? (
              <div className="bk-cart-empty"><ShoppingBag size={32} strokeWidth={1.2} /><h3>Seu carrinho está vazio</h3><button type="button" className="bk-modal-primary" onClick={() => setCartOpen(false)}>VOLTAR AO CARDÁPIO</button></div>
            ) : (
              <>
                <div className="bk-cart-content">
                  <div className="bk-cart-items">
                    {cart.map(({ product, quantity }) => (
                      <article className="bk-cart-item" key={cartKey(product)}>
                        <div className="bk-cart-item-info"><h3>{product.name}{product.flavor ? ` - ${product.flavor}` : ""}</h3><p>{product.price}{product.slice ? " · fatia" : ""}</p><strong>{money(cents(product.price) * quantity / 100)}</strong></div>
                        <div className="bk-cart-item-actions">
                          <div className="bk-quantity-control">
                            <button type="button" aria-label={`Diminuir ${product.name}`} onClick={() => updateQuantity(cartKey(product), quantity - 1)}><Minus size={13} /></button>
                            <strong>{quantity}</strong>
                            <button type="button" aria-label={`Aumentar ${product.name}`} onClick={() => updateQuantity(cartKey(product), quantity + 1)}><Plus size={13} /></button>
                          </div>
                          <button type="button" className="bk-remove-item" onClick={() => updateQuantity(cartKey(product), 0)} aria-label={`Remover ${product.name}`}><Trash2 size={15} /></button>
                        </div>
                      </article>
                    ))}
                  </div>
                  <div className="bk-cart-fields">
                    <label>Seu nome <input value={customerName} onChange={(event) => setCustomerName(event.target.value)} placeholder="Opcional" /></label>
                    <label>Observações <textarea value={notes} onChange={(event) => setNotes(event.target.value)} placeholder="Ex.: sabor sem nozes, horário de retirada" rows={2} /></label>
                    <div className="bk-fulfillment"><span>Como deseja receber?</span><div><button type="button" className={fulfillment === "pickup" ? "active" : ""} onClick={() => setFulfillment("pickup")}>Retirada em Santa Cecília</button><button type="button" className={fulfillment === "delivery" ? "active" : ""} onClick={() => setFulfillment("delivery")}>Entrega pelo iFood</button></div></div>
                  </div>
                </div>
                <div className="bk-cart-footer">
                  <div className="bk-cart-total"><span>Subtotal</span><strong>{money(totalCents / 100)}</strong></div>
                  <a className="bk-modal-primary bk-cart-checkout" href={whatsappBase + encodeURIComponent(cartMessage)} target="_blank" rel="noopener noreferrer">FINALIZAR PELO WHATSAPP <ArrowRight size={16} /></a>
                  <p className="bk-cart-notice">Para entrega, o pagamento é combinado no WhatsApp. Pedidos pelo iFood são feitos direto no app.</p>
                  <a className="bk-cart-ifood" href={ifood} target="_blank" rel="noopener noreferrer">PEDIR PELO IFOOD</a>
                  <button className="bk-cart-clear" type="button" onClick={() => { if (window.confirm("Deseja esvaziar o carrinho?")) setCart([]); }}>ESVAZIAR CARRINHO</button>
                </div>
              </>
            )}
          </aside>
        </div>
      )}
    </main>
  );
}
