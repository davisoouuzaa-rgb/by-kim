import { createFileRoute } from "@tanstack/react-router";
import { useEffect, useMemo, useState } from "react";
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
      { name: "Bolo de Brigadeiro 15 Camadas", price: "R$ 49,40", slice: true },
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
  "Bolo de Brigadeiro 15 Camadas": "/bolo%20brigadeiro.jpg",
  "Bolo de Cenoura 15 Camadas": "/bolo%20de%20cenoura.jpg",
  "Cheesecake Original": "/cheese-cake.jpg",
  "Cheesecake Cookies n Cream": "/cheese%20cake%20cookie.jpg",
  "Cheesecake Cumaru": "/cheese%20cake%20cumaru.jpg",
  "Mil Folhas Palmier": "/mil%20folhas.jpg",
  "Carré Palmier com Chocolate Meio Amargo": "/carre%20chocolate%20meio%20amargp.jpg",
  "Carré Palmier com Chocolate Branco": "/carre%20chocolate%20branco.jpg",
  "Carré Palmier com Matchá e Flocos de Sal": "/carre%20matcha.jpg",
  "Carré Palmier": "/carre.jpg",
  "Entremet Espresso": "/entremet.jpg",
  "Torta Caramelo e Nozes": "/torta%20caramelo%20nozes.jpg",
  "Torta de Banana": "/torta%20banana.jpg",
  "Ugly Bites": "/uggly%20bites.jpg",
  "Sable com Chocolate Meio Amargo": "/sable%20chocolaye.jpg",
  "Sablee com Chocolate de Matchá": "/sable%20matcha.jpg",
  "Chocolate de Matchá com Crispy de Arroz": "/chocolate%20matcha.jpg",
  "Chocolate Meio Amargo com Crispy de Arroz": "/chocolate%20meio%20amargo.jpg",
  "Chocolate Branco com Crispy de Arroz": "/chocolte%20branco.jpg",
  "Nozes Crocantes": "/nozes.jpg",
  "Caixa Presenteável Carré": "/caixa%20presente.jpg",
  "Presente Sable": "/presente%20sable.jpg",
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
  const [productQty, setProductQty] = useState(1);
  const [flavorSelections, setFlavorSelections] = useState<Record<string, string>>({});
  const [selectedFlavor, setSelectedFlavor] = useState("Composta");
  const [cart, setCart] = useState<CartItem[]>([]);
  const [cartLoaded, setCartLoaded] = useState(false);
  const [cartOpen, setCartOpen] = useState(false);
  const [customerName, setCustomerName] = useState("");
  const [notes, setNotes] = useState("");
  const [fulfillment, setFulfillment] = useState<Fulfillment>("pickup");

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
    const open = Boolean(selected || cartOpen);
    if (!open) return;
    const onKeyDown = (event: KeyboardEvent) => {
      if (event.key === "Escape") { setSelected(null); setCartOpen(false); }
    };
    window.addEventListener("keydown", onKeyDown);
    document.body.style.overflow = "hidden";
    return () => { window.removeEventListener("keydown", onKeyDown); document.body.style.overflow = ""; };
  }, [selected, cartOpen]);

  const itemCount = cart.reduce((sum, entry) => sum + entry.quantity, 0);
  const totalCents = cart.reduce((sum, entry) => sum + cents(entry.product.price) * entry.quantity, 0);
  const selectedSubtotal = selected ? cents(selected.price) * productQty : 0;

  const addToCart = (product: Product, quantity: number) => {
    setCart((current) => {
      const key = cartKey(product);
      const existing = current.find((entry) => cartKey(entry.product) === key);
      return existing
        ? current.map((entry) => cartKey(entry.product) === key ? { ...entry, quantity: entry.quantity + quantity } : entry)
        : [...current, { product, quantity }];
    });
    setSelected(null);
    setProductQty(1);
    setCartOpen(true);
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
        {categories.map((category, index) => (
          <section className="bk-menu-category" key={category.name}>
            <div className="bk-menu-category-heading">
              <span>0{index + 1}</span>
              <h2>{category.name}</h2>
            </div>
            <div className="bk-menu-grid">
              {category.items.map((item) => {
                const product = allProducts.find((entry) => entry.name === item.name)!;
                const flavored = hasFlavor(product);
                const flavor = flavored ? (flavorSelections[item.name] ?? "Composta") : undefined;
                const listingProduct = flavored ? { ...product, flavor } : product;
                return (
                  <article className="bk-menu-item bk-menu-item-button" key={item.name}>
                    <button className="bk-menu-item-copy bk-menu-item-open" type="button" onClick={() => { setSelected(listingProduct); setSelectedFlavor(flavor ?? "Composta"); setProductQty(1); }}>
                      {product.image && <img className="bk-menu-product-image" src={product.image} alt={item.name} loading="lazy" />}
                      <span className="bk-menu-item-title">{item.name}</span>
                      {item.description && <span className="bk-menu-item-description">{item.description}</span>}
                    </button>
                    {flavored && <div className="bk-flavor-picker bk-flavor-picker-list" aria-label="Sabor">
                      {flavors.map((option) => <button type="button" key={option} className={flavor === option ? "active" : ""} onClick={() => setFlavorSelections((current) => ({ ...current, [item.name]: option }))}>{option}</button>)}
                    </div>}
                    <span className="bk-menu-item-bottom">
                      <span className="bk-menu-price"><strong>{item.price}</strong>{item.slice && <small>fatia</small>}</span>
                      <button type="button" className="bk-menu-add" onClick={() => addToCart(listingProduct, 1)}>ADICIONAR</button>
                      <a className="bk-menu-order" href={whatsappBase + encodeURIComponent(productMessage(listingProduct, 1))} target="_blank" rel="noopener noreferrer">WHATSAPP <ArrowRight size={14} /></a>
                    </span>
                  </article>
                );
              })}
            </div>
          </section>
        ))}
      </div>

      <p className="bk-menu-allergens">Alérgenos: consulte a loja antes de pedir.</p>

      <section className="bk-menu-events">
        <div>
          <p className="bk-eyebrow">MOMENTOS ESPECIAIS</p>
          <h2>Encomendas para festas</h2>
          <p>Peça com [X] dias de antecedência pelo WhatsApp.</p>
        </div>
        <a className="bk-button bk-button-dark" href={ifood} target="_blank" rel="noopener noreferrer">PEDIR PELO IFOOD <ArrowRight size={15} /></a>
      </section>

      <footer className="bk-footer bk-menu-footer">
        <a className="bk-footer-brand" href="/">By Kim <span>CONFEITARIA</span></a>
        <div className="bk-footer-links">
          <a href={instagram} target="_blank" rel="noopener noreferrer"><Instagram size={16} /> INSTAGRAM</a>
          <a href={whatsappBase + encodeURIComponent("Olá, vim pelo site da By Kim e gostaria de saber mais!")} target="_blank" rel="noopener noreferrer"><MessageCircle size={16} /> WHATSAPP</a>
        </div>
        <small>© {new Date().getFullYear()} BY KIM CONFEITARIA</small>
      </footer>

      {selected && (
        <div className="bk-overlay bk-product-overlay" onMouseDown={(event) => { if (event.target === event.currentTarget) setSelected(null); }}>
          <section className="bk-product-modal" role="dialog" aria-modal="true" aria-label={selected.name}>
            <button className="bk-panel-close" type="button" aria-label="Fechar" onClick={() => setSelected(null)}><X size={20} /></button>
            <div className="bk-product-placeholder">{selected.image ? <img src={selected.image} alt={selected.name} /> : <><span>BY KIM</span><strong>{selected.name}</strong><small>{selected.category}</small></>}</div>
            <div className="bk-product-modal-content">
              <p className="bk-eyebrow"><span /> {selected.category.toUpperCase()}</p>
              <h2>{selected.name}</h2>
              {hasFlavor(selected) && <div className="bk-flavor-picker bk-flavor-picker-detail" aria-label="Escolha o sabor">{flavors.map((option) => <button type="button" key={option} className={selectedFlavor === option ? "active" : ""} onClick={() => { setSelectedFlavor(option); setSelected({ ...selected, flavor: option }); }}>{option}</button>)}</div>}
              {selected.slice && <p className="bk-product-serving">Serve 1 pessoa</p>}
              {selected.description && <p className="bk-product-description">{selected.description}</p>}
              <div className="bk-product-modal-price">{selected.price}{selected.slice && <span> · fatia</span>}</div>
              <div className="bk-quantity-row">
                <span>Quantidade</span>
                <div className="bk-quantity-control">
                  <button type="button" aria-label="Diminuir quantidade" onClick={() => setProductQty((q) => Math.max(1, q - 1))}><Minus size={15} /></button>
                  <strong>{productQty}</strong>
                  <button type="button" aria-label="Aumentar quantidade" onClick={() => setProductQty((q) => q + 1)}><Plus size={15} /></button>
                </div>
              </div>
              <button className="bk-modal-primary" type="button" onClick={() => addToCart(hasFlavor(selected) ? { ...selected, flavor: selectedFlavor } : selected, productQty)}>ADICIONAR · {money(selectedSubtotal / 100)}</button>
              <a className="bk-modal-secondary" href={whatsappBase + encodeURIComponent(productMessage(hasFlavor(selected) ? { ...selected, flavor: selectedFlavor } : selected, productQty))} target="_blank" rel="noopener noreferrer">PEDIR PELO WHATSAPP <ArrowRight size={15} /></a>
              <a className="bk-modal-ifood" href={ifood} target="_blank" rel="noopener noreferrer">PEDIR PELO IFOOD <ArrowRight size={14} /></a>
            </div>
          </section>
        </div>
      )}

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
