import { createFileRoute } from "@tanstack/react-router";
import { ArrowRight, Instagram, MessageCircle } from "lucide-react";

export const Route = createFileRoute("/cardapio")({ component: Cardapio });

const instagram = "https://www.instagram.com/bykimconfeitaria";
const ifood = "https://www.ifood.com.br/delivery/sao-paulo-sp/by-kim-confeitaria-santa-cecilia/6623c15d-18c8-4c00-90ab-61aabacf720b";
const whatsappBase = "https://wa.me/5511913171186?text=";

const categories = [
  {
    name: "Memoráveis",
    items: [
      { name: "Bolo de Brigadeiro 15 Camadas", price: "R$ 49,40", slice: true },
      { name: "Cheesecake Original", description: "Base amanteigada, 2 texturas de cheesecake (assada e fria), coberto por crumble de chocolate branco", price: "R$ 39,00", slice: true },
      { name: "Cheesecake Cookies n Cream", description: "Base amanteigada de cacau, cheesecake dupla de baunilha e crumble de cacau salgado, coberta com crumble de cacau", price: "R$ 39,00", slice: true },
      { name: "Bolo de Cenoura 15 Camadas", description: "Bolo de cenoura com brigadeiro, 15 camadas, irmãozinho do 15 camadas de chocolate", price: "R$ 49,40", slice: true },
      { name: "Mil Folhas Palmier Tiramissù", description: "Massa de palmier formando um mil folhas, com creme de confeiteiro clássico de baunilha e creme de tiramissù", price: "R$ 40,04" },
      { name: "Mil Folhas Palmier Baunilha", description: "Massa de palmier formando um mil folhas, com creme de confeiteiro clássico de baunilha", price: "R$ 40,04" },
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

function Cardapio() {
  return (
    <main className="bk-page bk-menu-page">
      <div className="bk-topline">DOCES FORA DA CAIXA</div>
      <header className="bk-header bk-menu-header">
        <a className="bk-wordmark" href="/" aria-label="By Kim início">
          <span className="bk-mark">By Kim</span>
          <span className="bk-submark">CONFEITARIA</span>
        </a>
        <a className="bk-menu-back" href="/">← VOLTAR AO SITE</a>
        <a className="bk-header-cta" href={whatsappBase + encodeURIComponent("Olá, vim pelo site da By Kim e gostaria de saber mais!")} target="_blank" rel="noopener noreferrer">PEDIR <ArrowRight size={14} /></a>
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
              {category.items.map((item) => (
                <article className="bk-menu-item" key={item.name}>
                  <div className="bk-menu-item-copy">
                    <h3>{item.name}</h3>
                    {item.description && <p>{item.description}</p>}
                  </div>
                  <div className="bk-menu-item-bottom">
                    <div className="bk-menu-price">
                      <strong>{item.price}</strong>
                      {item.slice && <small>fatia</small>}
                    </div>
                    <a href={whatsappBase + encodeURIComponent("Olá! Vim pelo site da By Kim e quero pedir: " + item.name)} target="_blank" rel="noopener noreferrer" className="bk-menu-order">PEDIR <ArrowRight size={14} /></a>
                  </div>
                </article>
              ))}
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
    </main>
  );
}
