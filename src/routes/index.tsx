import { createFileRoute } from "@tanstack/react-router";
import { ArrowDown, ArrowRight, Instagram, MapPin, Clock3, MessageCircle, Sparkles } from "lucide-react";

export const Route = createFileRoute("/")({ component: Index });

const instagram = "https://www.instagram.com/bykimconfeitaria/?hl=en";
const whatsapp = "https://wa.me/5511913171186?text=Ol%C3%A1%2C%20vim%20pelo%20site%20da%20By%20Kim%20e%20gostaria%20de%20saber%20mais!";
const menu = "https://bykimconfeitaria.com/";
const ifood = "https://www.ifood.com.br/delivery/sao-paulo-sp/by-kim-confeitaria-santa-cecilia/6623c15d-18c8-4c00-90ab-61aabacf720b";

const products = [
  {
    name: "Cheesecake de matchá",
    detail: "Uma das cheesecakes da casa, com o sabor marcante e delicado do matchá.",
    price: "R$ 35 · fatia",
    image: "https://vejasp.abril.com.br/wp-content/uploads/2024/01/DAN_2535.jpg.jpg?quality=70&strip=info&w=900",
    alt: "Cheesecake de matchá com calda de morango da By Kim",
  },
  {
    name: "Cheesecakes da casa",
    detail: "Clássica, matchá, cookies & cream e cumaru.",
    price: "Consulte o cardápio",
    image: "https://s2-pegn.glbimg.com/M_FKVODFFPrPC9-tGQ5QQqtFwME%3D/0x0%3A1080x719/600x0/smart/filters%3Astrip_icc%28%29/i.s3.glbimg.com/v1/AUTH_ba41d7b1ff5f48b28d3c5f84f30a06af/internal_photos/bs/2023/E/w/OUIereQwihSrAzk5rPVQ/snapinsta.app-328294121-1945922509084405-8420018441598608983-n-1080.jpg",
    alt: "Seleção de cheesecakes da By Kim",
  },
  {
    name: "Bolo de cenoura",
    detail: "Bolo de 15 camadas com especiarias, nozes e ganache de cream cheese.",
    price: "Consulte o cardápio",
    image: "https://vejasp.abril.com.br/wp-content/uploads/2024/01/DAN_2497.jpg.jpg?quality=70&strip=info&w=900",
    alt: "Bolo de cenoura com especiarias, nozes e ganache da By Kim",
  },
  {
    name: "Bolo de brigadeiro",
    detail: "O famoso bolo de chocolate da casa, montado em 15 camadas finas.",
    price: "Consulte o cardápio",
    image: "https://vejasp.abril.com.br/wp-content/uploads/2024/01/DAN_2478.jpg.jpg?quality=70&strip=info&w=900",
    alt: "Bolo de brigadeiro da By Kim",
  },
];

function Index() {
  return (
    <main className="bk-page">
      <div className="bk-topline">CONFEITARIA ARTESANAL · SANTA CECÍLIA, SP</div>
      <header className="bk-header">
        <a className="bk-wordmark" href="#inicio" aria-label="By Kim início">
          <span className="bk-mark">BY KIM</span>
          <span className="bk-submark">ㄱ ㅣ ㅁ · CONFEITARIA</span>
        </a>
        <nav className="bk-nav" aria-label="Navegação principal">
          <a href="#sobre">A casa</a>
          <a href="#vitrine">Vitrine</a>
          <a href="#visite">Visite-nos</a>
        </nav>
        <a className="bk-header-cta" href={whatsapp} target="_blank" rel="noreferrer">FAÇA SEU PEDIDO <ArrowRight size={14} /></a>
      </header>

      <section className="bk-hero" id="inicio">
        <div className="bk-hero-copy">
          <p className="bk-eyebrow"><span /> DOCES FORA DA CAIXA</p>
          <h1>Um jeito novo<br />de sentir <em>o doce.</em></h1>
          <p className="bk-intro">Confeitaria artesanal, técnica e criatividade em cada detalhe. Sabores que surpreendem, feitos para despertar os sentidos.</p>
          <div className="bk-hero-actions">
            <a className="bk-button bk-button-dark" href="#vitrine">EXPLORE A VITRINE <ArrowRight size={15} /></a>
            <a className="bk-text-link" href={instagram} target="_blank" rel="noreferrer"><Instagram size={16} /> @BYKIMCONFEITARIA</a>
          </div>
          <div className="bk-hero-note"><span>01 / 03</span><span>FEITO COM INTENÇÃO. SERVIDO COM AFETO.</span></div>
        </div>
        <div className="bk-hero-image-wrap">
          <img className="bk-hero-image" src="https://cloudfront-us-east-1.images.arcpublishing.com/estadao/MEVLYPTJWRCCNMINS2H6FSI7WY.jpg" alt="Chef confeiteira finalizando uma criação artesanal" />
          <div className="bk-image-stamp"><span>BY</span><strong>KIM</strong><small>CONFEITARIA</small></div>
          <span className="bk-image-caption">ARTE, TÉCNICA E SABOR.</span>
        </div>
      </section>

      <section className="bk-marquee" aria-label="Especialidades">
        <span>CHEESECAKES</span><i>✳</i><span>BOLOS AUTORAIS</span><i>✳</i><span>MIL-FOLHAS</span><i>✳</i><span>DOCES FORA DA CAIXA</span><i>✳</i>
      </section>

      <section className="bk-about" id="sobre">
        <div className="bk-section-index">01 — NOSSA ESSÊNCIA</div>
        <div className="bk-about-main">
          <p className="bk-eyebrow">MAIS DO QUE CONFEITARIA</p>
          <h2>O extraordinário<br />mora nos <em>detalhes.</em></h2>
          <p className="bk-about-text">A By Kim é um ateliê de confeitaria que combina referências, técnicas e ingredientes para criar doces com personalidade. Uma mistura de precisão, curiosidade e liberdade para sair do óbvio.</p>
          <a className="bk-underlined" href={instagram} target="_blank" rel="noreferrer">ACOMPANHE NOSSA HISTÓRIA <ArrowRight size={15} /></a>
        </div>
        <div className="bk-about-aside">
          <div className="bk-aside-rule" />
          <Sparkles size={22} strokeWidth={1.2} />
          <p>“Vendemos o que gostamos e acreditamos.”</p>
          <span>BY KIM</span>
        </div>
      </section>

      <section className="bk-showcase" id="vitrine">
        <div className="bk-showcase-head">
          <div><p className="bk-eyebrow">ESCOLHAS DA CASA</p><h2>Pequenas obras<br />de <em>confeitaria.</em></h2></div>
          <div className="bk-showcase-side"><p>Conheça algumas das criações que fazem parte do universo By Kim. O cardápio pode variar conforme a produção.</p><a className="bk-underlined" href={ifood} target="_blank" rel="noreferrer">VER CARDÁPIO NO IFOOD <ArrowRight size={15} /></a></div>
        </div>
        <div className="bk-product-grid">
          {products.map((product, index) => (
            <article className="bk-product" key={product.name}>
              <a className="bk-product-image" href={ifood} target="_blank" rel="noreferrer">
                <img src={product.image} alt={product.alt} loading="lazy" />
                <span className="bk-product-number">0{index + 1}</span>
                <span className="bk-product-arrow"><ArrowRight size={18} /></span>
              </a>
              <div className="bk-product-info"><div><h3>{product.name}</h3><p>{product.detail}</p></div><span>{product.price}</span></div>
            </article>
          ))}

        </div>
      </section>

      <section className="bk-visit" id="visite">
        <div className="bk-visit-copy">
          <p className="bk-eyebrow">VENHA CONHECER</p>
          <h2>Uma pausa<br />com <em>sabor.</em></h2>
          <p>Estamos em Santa Cecília, com doces autorais, cheesecakes e bolos feitos com técnica e criatividade.</p>
          <div className="bk-details"><div><MapPin size={17} /><span>Rua Tupi, 114<br />Santa Cecília · São Paulo</span></div><div><Clock3 size={17} /><span>Terça a domingo<br />10h às 17h30</span></div></div>
          <a className="bk-button bk-button-dark" href="https://www.google.com/maps/search/?api=1&query=Rua+Tupi+114+Santa+Cecilia+Sao+Paulo" target="_blank" rel="noreferrer">COMO CHEGAR <ArrowRight size={15} /></a>
          <a className="bk-underlined" href={ifood} target="_blank" rel="noreferrer">PEDIR PELO IFOOD <ArrowRight size={15} /></a>
        </div>
      </section>

      <footer className="bk-footer">
        <a className="bk-footer-brand" href="#inicio">BY KIM <span>ㄱ ㅣ ㅁ</span></a>
        <p>DOCES FORA DA CAIXA. FEITOS COM INTENÇÃO.</p>
        <div className="bk-footer-links"><a href={instagram} target="_blank" rel="noreferrer"><Instagram size={16} /> INSTAGRAM</a><a href={whatsapp} target="_blank" rel="noreferrer"><MessageCircle size={16} /> WHATSAPP</a></div>
        <small>© {new Date().getFullYear()} BY KIM CONFEITARIA</small>
      </footer>
    </main>
  );
}
