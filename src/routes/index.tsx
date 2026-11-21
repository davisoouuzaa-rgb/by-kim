import { createFileRoute } from "@tanstack/react-router";
import { ArrowRight, Instagram, MapPin, Clock3, MessageCircle, Sparkles, TrainFront } from "lucide-react";

export const Route = createFileRoute("/")({ component: Index });

const instagram = "https://www.instagram.com/bykimconfeitaria";
const whatsapp = "https://wa.me/5511913171186?text=Ol%C3%A1%2C%20vim%20pelo%20site%20da%20By%20Kim%20e%20gostaria%20de%20saber%20mais!";
const ifood = "https://www.ifood.com.br/delivery/sao-paulo-sp/by-kim-confeitaria-santa-cecilia/6623c15d-18c8-4c00-90ab-61aabacf720b";

const products = [
  {
    name: "Cheesecake de matchá com calda de morango",
    orderUrl: "https://wa.me/5511913171186?text=" + encodeURIComponent("Olá! Vim pelo site da By Kim e quero pedir: Cheesecake de matchá com calda de morango"),
    detail: "Matchá e calda de morango.",
    price: "R$ 35 · fatia",
    image: "https://vejasp.abril.com.br/wp-content/uploads/2024/01/DAN_2535.jpg.jpg?quality=70&strip=info&w=900",
    alt: "Cheesecake de matchá com calda de morango da By Kim",
  },
  {
    name: "Cheesecakes da casa",
    orderUrl: "https://wa.me/5511913171186?text=" + encodeURIComponent("Olá! Vim pelo site da By Kim e quero pedir: Cheesecakes da casa"),
    detail: "Clássica, matchá, cookies & cream e cumaru.",
    price: "Ver no iFood",
    image: "https://s2-pegn.glbimg.com/M_FKVODFFPrPC9-tGQ5QQqtFwME%3D/0x0%3A1080x719/600x0/smart/filters%3Astrip_icc%28%29/i.s3.glbimg.com/v1/AUTH_ba41d7b1ff5f48b28d3c5f84f30a06af/internal_photos/bs/2023/E/w/OUIereQwihSrAzk5rPVQ/snapinsta.app-328294121-1945922509084405-8420018441598608983-n-1080.jpg",
    alt: "Seleção de cheesecakes da By Kim",
  },
  {
    name: "Bolo de cenoura com especiarias",
    orderUrl: "https://wa.me/5511913171186?text=" + encodeURIComponent("Olá! Vim pelo site da By Kim e quero pedir: Bolo de cenoura com especiarias"),
    detail: "Especiarias, nozes e ganache de cream cheese.",
    price: "Consulte o cardápio",
    image: "https://vejasp.abril.com.br/wp-content/uploads/2024/01/DAN_2497.jpg.jpg?quality=70&strip=info&w=900",
    alt: "Bolo de cenoura com especiarias, nozes e ganache da By Kim",
  },
  {
    name: "Bolo de brigadeiro",
    orderUrl: "https://wa.me/5511913171186?text=" + encodeURIComponent("Olá! Vim pelo site da By Kim e quero pedir: Bolo de brigadeiro"),
    detail: "Chocolate em 15 camadas.",
    price: "Consulte o cardápio",
    image: "https://vejasp.abril.com.br/wp-content/uploads/2024/01/DAN_2478.jpg.jpg?quality=70&strip=info&w=900",
    alt: "Bolo de brigadeiro da By Kim",
  },
];

function Index() {
  return (
    <main className="bk-page">
      <div className="bk-topline">DOCES FORA DA CAIXA</div>
      <header className="bk-header">
        <a className="bk-wordmark" href="#inicio" aria-label="By Kim início">
          <span className="bk-mark">BY KIM</span>
          <span className="bk-submark">CONFEITARIA</span>
        </a>
        <nav className="bk-nav" aria-label="Navegação principal">
          <a href="#sobre">Sobre</a>
          <a href="#vitrine">Vitrine</a>
          <a href="#visite">Visite-nos</a>
        </nav>
        <a className="bk-header-cta" href={whatsapp} target="_blank" rel="noreferrer">PEDIR <ArrowRight size={14} /></a>
      </header>

      <section className="bk-hero" id="inicio">
        <div className="bk-hero-copy">
          <p className="bk-eyebrow"><span /> BY KIM</p>
          <h1>Doce, com<br /><em>personalidade.</em></h1>
          
          <div className="bk-hero-actions">
            <a className="bk-button bk-button-dark" href="#vitrine">VER DOCES <ArrowRight size={15} /></a>
            <a className="bk-text-link" href={instagram} target="_blank" rel="noreferrer"><Instagram size={16} /> INSTAGRAM</a>
          </div>
          
        </div>
        <div className="bk-hero-image-wrap">
          <img className="bk-hero-image" src="https://cloudfront-us-east-1.images.arcpublishing.com/estadao/MEVLYPTJWRCCNMINS2H6FSI7WY.jpg" alt="Chef confeiteira finalizando uma criação artesanal" />
          <div className="bk-image-stamp"><span>BY</span><strong>KIM</strong><small>CONFEITARIA</small></div>
          
        </div>
      </section>

      <section className="bk-marquee" aria-label="Especialidades">
        <span>CHEESECAKES</span><Sparkles className="bk-marquee-sparkle" size={16} strokeWidth={1.5} aria-hidden="true" /><span>BOLOS</span><Sparkles className="bk-marquee-sparkle" size={16} strokeWidth={1.5} aria-hidden="true" /><span>MIL-FOLHAS</span>
      </section>

      <section className="bk-about" id="sobre">
        
        <div className="bk-about-main">
          
          <h2>A casa<br /><em>By Kim.</em></h2>
          <p className="bk-about-text">Confeitaria autoral em Santa Cecília.</p>
          <a className="bk-underlined" href={instagram} target="_blank" rel="noreferrer">CONHEÇA NO INSTAGRAM <ArrowRight size={15} /></a>
        </div>
      </section>

      <section className="bk-showcase" id="vitrine">
        <div className="bk-showcase-head">
          <div><p className="bk-eyebrow">A VITRINE</p><h2>Nossos <em>doces.</em></h2></div>
          <div className="bk-showcase-side"><a className="bk-underlined" href={ifood} target="_blank" rel="noreferrer">CARDÁPIO COMPLETO <ArrowRight size={15} /></a></div>
        </div>
        <div className="bk-product-grid">
          {products.map((product, index) => (
            <article className="bk-product" key={product.name}>
              <a className="bk-product-image" href={product.orderUrl} target="_blank" rel="noreferrer" aria-label={`Pedir ${product.name} pelo WhatsApp`}>
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
          <p className="bk-eyebrow">ONDE ESTAMOS</p>
          <h2>Visite a<br /><em>By Kim.</em></h2>
          
          <div className="bk-details"><div><MapPin size={17} /><span>Rua Tupi, 114<br />Santa Cecília · São Paulo</span></div><div><Clock3 size={17} /><span>Terça a domingo<br />10h às 17h30<br />Segunda-feira: fechado</span></div><div><TrainFront size={17} /><span>Metrô: Santa Cecília ou<br />Marechal Deodoro · Linha 3-Vermelha</span></div></div>
          <a className="bk-button bk-button-dark" href="https://www.google.com/maps/search/?api=1&query=Rua+Tupi+114+Santa+Cecilia+Sao+Paulo" target="_blank" rel="noreferrer">COMO CHEGAR <ArrowRight size={15} /></a>
          <a className="bk-underlined" href={ifood} target="_blank" rel="noreferrer">IFOOD <ArrowRight size={15} /></a>
        </div>
      </section>

      <footer className="bk-footer">
        <a className="bk-footer-brand" href="#inicio">BY KIM <span>ㄱ ㅣ ㅁ</span></a>
        
        <div className="bk-footer-links"><a href={instagram} target="_blank" rel="noreferrer"><Instagram size={16} /> INSTAGRAM</a><a href={whatsapp} target="_blank" rel="noreferrer"><MessageCircle size={16} /> WHATSAPP</a></div>
        <small>© {new Date().getFullYear()} BY KIM CONFEITARIA</small>
      </footer>
    </main>
  );
}
