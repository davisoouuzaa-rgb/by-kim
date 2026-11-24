export type CatalogProduct = {
  name: string;
  description: string;
  price: string;
  slice?: boolean;
};
export type CatalogCategory = { name: string; items: CatalogProduct[] };

export const categories: CatalogCategory[] = [
  { name: "Memoráveis", items: [
    { name: "Bolo de Brigadeiro 15 Camadas", description: "Bolo de chocolate com 15 camadas intercaladas de massa e brigadeiro.", price: "R$ 49,40", slice: true },
    { name: "Cheesecake Original", description: "Base amanteigada, 2 texturas de cheesecake (assada e fria), coberto por crumble de chocolate branco", price: "R$ 39,00", slice: true },
    { name: "Cheesecake Cookies n Cream", description: "Base amanteigada de cacau, cheesecake dupla de baunilha e crumble de cacau salgado, coberta com crumble de cacau", price: "R$ 39,00", slice: true },
    { name: "Bolo de Cenoura 15 Camadas", description: "Bolo de cenoura com brigadeiro, 15 camadas, irmãozinho do 15 camadas de chocolate", price: "R$ 49,40", slice: true },
    { name: "Mil Folhas Palmier", description: "Massa de palmier formando um mil folhas, com creme de confeiteiro clássico", price: "R$ 40,04" },
  ]},
  { name: "Inovadores", items: [
    { name: "Cheesecake de Trufas", description: "Base amanteigada, cheesecake assada com adição de trufas negras em conserva", price: "R$ 42,00" },
    { name: "Cheesecake Cumaru", description: "Base amanteigada, 2 texturas de cheesecake de cumaru (assada e fria), coberto por crumble de nozes e especiarias", price: "R$ 39,00", slice: true },
  ]},
  { name: "Carré Palmier", items: [
    { name: "Carré Palmier com Chocolate Meio Amargo", description: "Palmier em formato de carreira, coberto com chocolate meio amargo", price: "R$ 25,50" },
    { name: "Carré Palmier com Chocolate Branco", description: "Palmier em formato de carreira, coberto com chocolate branco", price: "R$ 25,50" },
    { name: "Carré Palmier com Matchá e Flocos de Sal", description: "Palmier em formato de carreira, com matchá e flocos de sal", price: "R$ 25,50" },
    { name: "Carré Palmier", description: "Palmier em formato de carreira", price: "R$ 20,00" },
  ]},
  { name: "Tradicionais", items: [
    { name: "Entremet Espresso", description: "Bolo de chocolate regado com café, cremoso de chocolate, mousse de chocolate caramelizado com café", price: "R$ 45,50", slice: true },
    { name: "Torta Caramelo e Nozes", description: "Torta com caramelo, nozes e um toque de especiarias", price: "R$ 45,50" },
    { name: "Torta de Banana", description: "Base de sablé, bolo de amêndoas e laranja, doce de leite, purê de banana, banana fresca e creme de doce de leite", price: "R$ 45,50" },
  ]},
  { name: "Coffee Sides", items: [
    { name: "Ugly Bites", description: "Aparas das massas folhadas, a versão crocante do desperdício", price: "R$ 18,00" },
    { name: "Sable com Chocolate Meio Amargo", description: "Biscoito amanteigado banhado com chocolate meio amargo, pacote com 10 unidades", price: "R$ 36,00" },
    { name: "Sablee com Chocolate de Matchá", description: "Biscoitos amanteigados banhados no chocolate de matchá", price: "R$ 36,00" },
    { name: "Sable da Debora com Chocolate Branco", description: "Biscoitinhos amanteigados banhados no chocolate branco", price: "R$ 36,00" },
    { name: "Chocolate de Matchá com Crispy de Arroz", description: "Pacotinho de crispy de arroz matchá, 90g", price: "R$ 43,50" },
    { name: "Chocolate Meio Amargo com Crispy de Arroz", description: "Pacotinho de crispy de arroz meio amargo, 90g", price: "R$ 43,50" },
    { name: "Chocolate Branco com Crispy de Arroz", description: "Pacotinho de crispy de arroz chocolate branco, 90g", price: "R$ 43,50" },
    { name: "Nozes Crocantes", description: "Nozes temperadinhas com especiarias, perfeito para um lanchinho com café, 90g", price: "R$ 52,00" },
  ]},
  { name: "Presentes", items: [
    { name: "Caixa Presenteável Carré", description: "1 carré palmier de cada sabor: tradicional, chocolate branco, chocolate meio amargo e chocolate matchá, em caixa", price: "R$ 130,00" },
    { name: "Presente Sable", description: "Sable banhado no chocolate, em caixa, escolha 1 entre 3 chocolates", price: "R$ 60,00" },
  ]},
];

export const productImages: Record<string, string> = {
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

const priceNumber = (price: string) => Number(price.replace("R$", "").trim().replace(".", "").replace(",", "."));
const productId = (name: string) => name.toLowerCase().normalize("NFD").replace(/[\u0300-\u036f]/g, "").replace(/[^a-z0-9]+/g, "-");

export type ProductRecord = {
  id: string;
  name: string;
  price: number;
  priceText: string;
  unit: string;
  description: string;
  image: string;
  category: string;
  slice: boolean;
};

export const catalogProducts: ProductRecord[] = categories.flatMap((category) =>
  category.items.map((item) => ({
    id: productId(item.name),
    name: item.name,
    price: priceNumber(item.price),
    priceText: item.price,
    unit: item.slice ? "fatia" : "unidade",
    description: item.description,
    image: productImages[item.name] ?? "",
    category: category.name,
    slice: Boolean(item.slice),
  }))
);

const catalogProduct = (name: string) => catalogProducts.find((item) => item.name === name)!;

type ShowcaseProduct = { id: string; name: string; price: number; unit: string; displayPrice: string; image: string; alt: string; optionGroup?: "cheesecake" };
const makeShowcaseProduct = (
  name: string,
  catalogName: string,
  alt: string,
  optionGroup?: "cheesecake",
): ShowcaseProduct => {
  const product = catalogProduct(catalogName);
  return {
    id: product.id,
    name,
    price: product.price,
    unit: product.unit,
    displayPrice: `${product.priceText}${product.slice ? " · fatia" : ""}`,
    image: product.image,
    alt,
    ...(optionGroup ? { optionGroup } : {}),
  };
};

export const showcaseProducts: ShowcaseProduct[] = [
  makeShowcaseProduct("Cheesecake Cookies n Cream", "Cheesecake Cookies n Cream", "Cheesecake Cookies n Cream", "cheesecake"),
  makeShowcaseProduct("Mil Folhas Palmier Baunilha", "Mil Folhas Palmier", "Mil Folhas Palmier Baunilha"),
  makeShowcaseProduct("Entremet Espresso", "Entremet Espresso", "Entremet Espresso"),
  makeShowcaseProduct("Torta de Banana", "Torta de Banana", "Torta de Banana"),
  makeShowcaseProduct("Sablee com Chocolate de Matchá", "Sablee com Chocolate de Matchá", "Sablee com Chocolate de Matchá"),
  makeShowcaseProduct("Cheesecake Cumaru", "Cheesecake Cumaru", "Cheesecake Cumaru", "cheesecake"),
];
