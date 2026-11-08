"use client";

import { useMemo, useState } from "react";
import { useCart, type Product } from "./CartContext";
import Link from "next/link";
import { openExternal } from "./lib/external";
import { BRAND } from "./brand";
import { Logo, LogoMark } from "./Logo";

const WHATSAPP_NUMBER = "258879093427";


const products: Product[] = [
  { id: 1, name: "Paracetamol 500 mg", category: "Medicamentos", price: 120, unit: "Embalagem", icon: "💊", color: "#E8F5EC", prescription: false, image: "/products/paracetamol-500.jpg" },
  { id: 2, name: "Ibuprofeno", category: "Medicamentos", price: 180, unit: "Embalagem", icon: "💊", color: "#E8F5EC", prescription: false, image: "/products/ibuprofeno.jpg" },
  { id: 3, name: "Comprimidos para dor de cabeça", category: "Medicamentos", price: 150, unit: "Embalagem", icon: "💊", color: "#E8F5EC", prescription: false, image: "/products/comprimidos-dor-cabeca.jpg" },
  { id: 4, name: "Antiácido", category: "Medicamentos", price: 220, unit: "Embalagem", icon: "🧪", color: "#E8F5EC", prescription: false, image: "/products/antiacido.jpg" },
  { id: 5, name: "Sais de reidratação oral", category: "Medicamentos", price: 80, unit: "Saqueta", icon: "🥤", color: "#E8F5EC", prescription: false, image: "/products/sais-reidratacao.jpg" },
  { id: 6, name: "Produto para gases intestinais", category: "Medicamentos", price: 250, unit: "Embalagem", icon: "💊", color: "#E8F5EC", prescription: false, image: "/products/gases-intestinais.jpg" },
  { id: 7, name: "Pastilhas para a garganta", category: "Medicamentos", price: 160, unit: "Embalagem", icon: "🍬", color: "#E8F5EC", prescription: false, image: "/products/pastilhas-garganta.jpg" },
  { id: 8, name: "Solução salina nasal", category: "Medicamentos", price: 200, unit: "Frasco", icon: "💧", color: "#E8F5EC", prescription: false, image: "/products/solucao-salina-nasal.jpg" },
  { id: 9, name: "Cetirizina", category: "Medicamentos", price: 180, unit: "Embalagem", icon: "💊", color: "#E8F5EC", prescription: false, image: "/products/cetirizina.jpg" },
  { id: 10, name: "Creme para dores musculares", category: "Medicamentos", price: 320, unit: "Bisnaga", icon: "🧴", color: "#E8F5EC", prescription: false, image: "/products/creme-dores-musculares.jpg" },
  { id: 11, name: "Medicamento para infeção urinária", category: "Medicamentos", price: 450, unit: "Sob consulta", icon: "💊", color: "#FFF1DE", prescription: true, image: "/products/medicamento-infecao-urinaria.jpg" },
  { id: 12, name: "Antibiótico", category: "Medicamentos", price: 500, unit: "Sob consulta", icon: "💊", color: "#FFF1DE", prescription: true, image: "/products/antibiotico.jpg" },
  { id: 13, name: "Tratamento de dose única", category: "Medicamentos", price: 350, unit: "Sob consulta", icon: "💊", color: "#FFF1DE", prescription: true, image: "/products/tratamento-dose-unica.jpg" },
  { id: 14, name: "Medicamento para dor abdominal", category: "Medicamentos", price: 250, unit: "Sob consulta", icon: "💊", color: "#FFF1DE", prescription: true, image: "/products/medicamento-dor-abdominal.jpg" },
  { id: 15, name: "Medicamento para dores nas costas", category: "Medicamentos", price: 300, unit: "Sob consulta", icon: "💊", color: "#FFF1DE", prescription: true, image: "/products/medicamento-dores-costas.jpg" },

  { id: 16, name: "Vitamina C", category: "Vitaminas e suplementos", price: 350, unit: "Embalagem", icon: "🍊", color: "#FFF1DE", prescription: false, image: "/products/vitamina-c.jpg" },
  { id: 17, name: "Multivitamínico", category: "Vitaminas e suplementos", price: 450, unit: "Embalagem", icon: "🌿", color: "#FFF1DE", prescription: false, image: "/products/multivitaminico.jpg" },
  { id: 18, name: "Vitamina D", category: "Vitaminas e suplementos", price: 400, unit: "Embalagem", icon: "☀️", color: "#FFF1DE", prescription: false, image: "/products/vitamina-d.jpg" },
  { id: 19, name: "Suplemento de zinco", category: "Vitaminas e suplementos", price: 300, unit: "Embalagem", icon: "🌿", color: "#FFF1DE", prescription: false, image: "/products/suplemento-zinco.jpg" },
  { id: 20, name: "Sais minerais", category: "Vitaminas e suplementos", price: 280, unit: "Embalagem", icon: "💧", color: "#FFF1DE", prescription: false, image: "/products/sais-minerais.jpg" },

  { id: 21, name: "Álcool etílico 70%", category: "Higiene e cuidados pessoais", price: 180, unit: "Frasco", icon: "🧴", color: "#E7F0FF", prescription: false, image: "/products/alcool-70.jpg" },
  { id: 22, name: "Sabonete antibacteriano", category: "Higiene e cuidados pessoais", price: 120, unit: "Unidade", icon: "🧼", color: "#E7F0FF", prescription: false, image: "/products/sabonete-antibacteriano.jpg" },
  { id: 23, name: "Gel desinfetante para mãos", category: "Higiene e cuidados pessoais", price: 150, unit: "Frasco", icon: "🧴", color: "#E7F0FF", prescription: false, image: "/products/gel-desinfetante.jpg" },
  { id: 24, name: "Pasta dentífrica", category: "Higiene e cuidados pessoais", price: 170, unit: "Unidade", icon: "🪥", color: "#E7F0FF", prescription: false, image: "/products/pasta-dentifrica.jpg" },
  { id: 25, name: "Escova de dentes", category: "Higiene e cuidados pessoais", price: 100, unit: "Unidade", icon: "🪥", color: "#E7F0FF", prescription: false, image: "/products/escova-dentes.jpg" },
  { id: 26, name: "Pensos higiénicos", category: "Higiene e cuidados pessoais", price: 130, unit: "Embalagem", icon: "🧻", color: "#E7F0FF", prescription: false, image: "/products/pensos-higienicos.jpg" },
  { id: 27, name: "Preservativos", category: "Higiene e cuidados pessoais", price: 100, unit: "Embalagem", icon: "🛡️", color: "#E7F0FF", prescription: false, image: "/products/preservativos.jpg" },
  { id: 28, name: "Lubrificante íntimo", category: "Higiene e cuidados pessoais", price: 350, unit: "Unidade", icon: "💧", color: "#E7F0FF", prescription: false, image: "/products/lubrificante-intimo.jpg" },

  { id: 29, name: "Soro fisiológico", category: "Primeiros socorros", price: 150, unit: "Unidade", icon: "🩹", color: "#F1EAFE", prescription: false, image: "/products/soro-fisiologico.jpg" },
  { id: 30, name: "Pensos rápidos", category: "Primeiros socorros", price: 100, unit: "Embalagem", icon: "🩹", color: "#F1EAFE", prescription: false, image: "/products/pensos-rapidos.jpg" },
  { id: 31, name: "Gaze esterilizada", category: "Primeiros socorros", price: 90, unit: "Embalagem", icon: "🩹", color: "#F1EAFE", prescription: false, image: "/products/gaze-esterilizada.jpg" },
  { id: 32, name: "Ligadura elástica", category: "Primeiros socorros", price: 180, unit: "Unidade", icon: "🩹", color: "#F1EAFE", prescription: false, image: "/products/ligadura-elastica.jpg" },
  { id: 33, name: "Antisséptico para feridas", category: "Primeiros socorros", price: 220, unit: "Frasco", icon: "🧴", color: "#F1EAFE", prescription: false, image: "/products/antisseptico-feridas.jpg" },
  { id: 34, name: "Compressa fria instantânea", category: "Primeiros socorros", price: 250, unit: "Unidade", icon: "❄️", color: "#F1EAFE", prescription: false, image: "/products/compressa-fria.jpg" },

  { id: 35, name: "Fraldas para bebé", category: "Bebé e maternidade", price: 450, unit: "Embalagem", icon: "👶", color: "#FCEAF1", prescription: false, image: "/products/fraldas-bebe.jpg" },
  { id: 36, name: "Toalhitas para bebé", category: "Bebé e maternidade", price: 180, unit: "Embalagem", icon: "🧻", color: "#FCEAF1", prescription: false, image: "/products/toalhitas-bebe.jpg" },
  { id: 37, name: "Creme protetor para bebé", category: "Bebé e maternidade", price: 280, unit: "Unidade", icon: "🧴", color: "#FCEAF1", prescription: false, image: "/products/creme-protetor-bebe.jpg" },
  { id: 38, name: "Champô para bebé", category: "Bebé e maternidade", price: 250, unit: "Frasco", icon: "🧴", color: "#FCEAF1", prescription: false, image: "/products/champo-bebe.jpg" },
  { id: 39, name: "Biberão", category: "Bebé e maternidade", price: 300, unit: "Unidade", icon: "🍼", color: "#FCEAF1", prescription: false, image: "/products/biberão.jpg" },
  { id: 40, name: "Teste de gravidez", category: "Bebé e maternidade", price: 200, unit: "Unidade", icon: "🧪", color: "#FCEAF1", prescription: false, image: "/products/teste-gravidez.jpg" },

  { id: 41, name: "Termómetro digital", category: "Equipamentos médicos", price: 350, unit: "Unidade", icon: "🌡️", color: "#E7F0FF", prescription: false, image: "/products/termometro-digital.jpg" },
  { id: 42, name: "Medidor de tensão arterial", category: "Equipamentos médicos", price: 1800, unit: "Unidade", icon: "🩺", color: "#E7F0FF", prescription: false, image: "/products/medidor-tensao.jpg" },
  { id: 43, name: "Oxímetro de dedo", category: "Equipamentos médicos", price: 1200, unit: "Unidade", icon: "🩺", color: "#E7F0FF", prescription: false, image: "/products/oximetro.jpg" },
  { id: 44, name: "Máscaras descartáveis", category: "Equipamentos médicos", price: 150, unit: "Embalagem", icon: "😷", color: "#E7F0FF", prescription: false, image: "/products/mascaras-descartaveis.jpg" },
  { id: 45, name: "Luvas descartáveis", category: "Equipamentos médicos", price: 180, unit: "Embalagem", icon: "🧤", color: "#E7F0FF", prescription: false, image: "/products/luvas-descartaveis.jpg" },

  { id: 46, name: "Repelente de mosquitos", category: "Higiene e cuidados pessoais", price: 250, unit: "Frasco", icon: "🦟", color: "#E7F0FF", prescription: false, image: "/products/repelente-mosquitos.jpg" },
  { id: 47, name: "Protetor solar", category: "Higiene e cuidados pessoais", price: 550, unit: "Unidade", icon: "☀️", color: "#E7F0FF", prescription: false, image: "/products/protetor-solar.jpg" },
  { id: 48, name: "Creme hidratante", category: "Higiene e cuidados pessoais", price: 300, unit: "Unidade", icon: "🧴", color: "#E7F0FF", prescription: false, image: "/products/creme-hidratante.jpg" },
  { id: 49, name: "Termómetro para bebé", category: "Equipamentos médicos", price: 400, unit: "Unidade", icon: "🌡️", color: "#E7F0FF", prescription: false, image: "/products/termometro-bebe.jpg" },
  { id: 50, name: "Bolsa de água quente", category: "Equipamentos médicos", price: 350, unit: "Unidade", icon: "♨️", color: "#E7F0FF", prescription: false, image: "/products/bolsa-agua-quente.jpg" },
];


const categories = [
  { name: "Todos", icon: "▦" },
  { name: "Medicamentos", icon: "✚" },
  { name: "Vitaminas e suplementos", icon: "♧" },
  { name: "Higiene e cuidados pessoais", icon: "◉" },
  { name: "Primeiros socorros", icon: "✚" },
  { name: "Bebé e maternidade", icon: "♡" },
  { name: "Equipamentos médicos", icon: "⌁" },
];

const money = (value: number) =>
  `${value.toLocaleString("pt-MZ")} MT`;

export default function Home() {
  const [search, setSearch] = useState("");
  const [category, setCategory] = useState("Todos");
  const [supportOpen, setSupportOpen] = useState(false);
  const [failedImages, setFailedImages] = useState<string[]>([]);
  const { addToCart, cartCount, cartTotal, items, ready } = useCart();

  const filteredProducts = useMemo(() => {
    const term = search.trim().toLocaleLowerCase("pt");

    return products.filter((product) => {
      const matchesSearch =
        product.name.toLocaleLowerCase("pt").includes(term) ||
        product.category.toLocaleLowerCase("pt").includes(term);

      return (
        matchesSearch &&
        (category === "Todos" || product.category === category)
      );
    });
  }, [search, category]);

  const featuredProducts = products.filter((product) =>
    [1, 16, 21, 29, 41, 42, 47, 35].includes(product.id)
  );

  function contactWhatsApp(message: string) {
    void openExternal(
      `https://wa.me/${WHATSAPP_NUMBER}?text=${encodeURIComponent(message)}`
    );
  }

  function chooseCategory(name: string) {
    setCategory(name);
    document.getElementById("produtos")?.scrollIntoView({
      behavior: "smooth",
      block: "start",
    });
  }

  function renderProduct(product: Product) {
    const quantity =
      items.find((item) => item.product.id === product.id)?.quantity ?? 0;

    const showImage =
      Boolean(product.image) && !failedImages.includes(product.image!);

    return (
      <article
        key={product.id}
        className="group flex h-full flex-col border border-[#E7EAE7] bg-white transition-colors duration-200 hover:border-[#087F5B]"
      >
        <button
          type="button"
          onClick={() => {
            if (product.prescription) {
              contactWhatsApp(
                `Olá, ${BRAND.name}. Gostaria de consultar ${product.name}. Podem confirmar a disponibilidade e os requisitos de receita?`
              );
            } else {
              addToCart(product);
            }
          }}
          aria-label={
            product.prescription
              ? `Consultar ${product.name}`
              : `Adicionar ${product.name} ao carrinho`
          }
          className="relative flex h-48 w-full items-center justify-center overflow-hidden bg-white p-5 sm:h-52"
        >
          {showImage ? (
            <img
              src={product.image}
              alt={`Embalagem de ${product.name}`}
              loading="lazy"
              className="h-full w-full object-contain transition-transform duration-300 group-hover:scale-105"
              onError={() =>
                setFailedImages((previous) =>
                  previous.includes(product.image!)
                    ? previous
                    : [...previous, product.image!]
                )
              }
            />
          ) : (
            <div
              className="flex h-full w-full items-center justify-center"
              style={{ backgroundColor: product.color }}
            >
              <span className="text-6xl" aria-hidden="true">
                {product.icon}
              </span>
            </div>
          )}
          {product.prescription && (
            <span className="absolute left-3 top-3 bg-[#FFF3DF] px-2 py-1 text-[10px] font-bold text-[#875310]">
              SOB CONSULTA
            </span>
          )}
        </button>

        <div className="flex flex-1 flex-col border-t border-[#F0F2F0] p-4">
          <p className="text-[11px] font-semibold text-[#087F5B]">
            {product.category}
          </p>

          <h3 className="mt-2 min-h-[40px] text-sm font-semibold leading-5 text-[#26352B]">
            {product.name}
          </h3>

          <p className="mt-1 text-xs text-[#858D87]">{product.unit}</p>

          <div className="mt-auto flex items-end justify-between gap-2 pt-5">
            <div>
              <p className="text-[10px] text-[#858D87]">
                {product.prescription ? "Preço indicativo" : "Preço demonstrativo"}
              </p>
              <p className="mt-1 text-base font-extrabold text-[#17251D]">
                {money(product.price)}
              </p>
            </div>

            {product.prescription ? (
              <button
                type="button"
                onClick={() =>
                  contactWhatsApp(
                    `Olá, ${BRAND.name}. Gostaria de consultar ${product.name}. Podem confirmar a disponibilidade e os requisitos de receita?`
                  )
                }
                className="shrink-0 border border-[#087F5B] px-3 py-2 text-xs font-bold text-[#087F5B] transition hover:bg-[#087F5B] hover:text-white"
              >
                Consultar
              </button>
            ) : (
              <button
                type="button"
                onClick={() => addToCart(product)}
                aria-label={`Adicionar ${product.name} ao carrinho`}
                className="flex h-10 w-10 shrink-0 items-center justify-center bg-[#087F5B] text-xl font-medium text-white transition hover:bg-[#066849]"
              >
                +
              </button>
            )}
          </div>

          {quantity > 0 && (
            <p className="mt-3 text-xs font-semibold text-[#087F5B]">
              {quantity} unidade(s) no carrinho
            </p>
          )}
        </div>
      </article>
    );
  }

  return (
    <main className="min-h-screen bg-white pb-24 text-[#202820]">
      {/* Barra superior */}
      <div className="bg-[#075C3D] px-4 py-2 text-center text-xs font-medium text-white">
        Faça o seu pedido online e confirme a disponibilidade pelo WhatsApp.
      </div>

      {/* Cabeçalho da loja */}
      <header className="sticky top-0 z-30 border-b border-[#E7EBE7] bg-white">
        <div className="mx-auto flex max-w-[1440px] flex-wrap items-center gap-4 px-4 py-4 sm:px-6 lg:flex-nowrap lg:px-10">
          <Link
            href="/"
            className="flex shrink-0 items-center gap-2.5"
            aria-label={`${BRAND.name} - página inicial`}
          >
            <Logo />
          </Link>

          <form
            className="order-3 flex w-full lg:order-none lg:mx-8 lg:flex-1"
            onSubmit={(event) => {
              event.preventDefault();
              document.getElementById("produtos")?.scrollIntoView({
                behavior: "smooth",
              });
            }}
          >
            <label htmlFor="store-search" className="sr-only">
              Pesquisar produtos
            </label>
            <div className="flex w-full border border-[#DDE4DE] bg-[#F8FAF8] focus-within:border-[#087F5B]">
              <input
                id="store-search"
                type="search"
                value={search}
                onChange={(event) => setSearch(event.target.value)}
                placeholder="O que procura hoje?"
                className="min-w-0 flex-1 bg-transparent px-4 py-3 text-sm outline-none placeholder:text-[#89938C]"
              />
              <button
                type="submit"
                aria-label="Pesquisar"
                className="flex w-12 shrink-0 items-center justify-center bg-[#087F5B] text-white transition hover:bg-[#066849]"
              >
                <svg
                  width="19"
                  height="19"
                  viewBox="0 0 24 24"
                  fill="none"
                  stroke="currentColor"
                  strokeWidth="2"
                  aria-hidden="true"
                >
                  <circle cx="10.8" cy="10.8" r="6.8" />
                  <path d="m16 16 4.5 4.5" />
                </svg>
              </button>
            </div>
          </form>

          <div className="ml-auto flex shrink-0 items-center gap-3">
            <button
              type="button"
              onClick={() =>
                contactWhatsApp(
                  `Olá, ${BRAND.name}. Gostaria de ajuda para encontrar um produto.`
                )
              }
              className="hidden items-center gap-2 text-left sm:flex"
            >
              <span className="flex h-10 w-10 items-center justify-center border border-[#E3E9E3] text-[#087F5B]">
                <svg
                  width="20"
                  height="20"
                  viewBox="0 0 24 24"
                  fill="none"
                  stroke="currentColor"
                  strokeWidth="1.7"
                  aria-hidden="true"
                >
                  <path d="M20 11.5a8 8 0 0 1-11.8 7L4 20l1.5-4.2A8 8 0 1 1 20 11.5Z" />
                  <path d="M9 9c.5 2 2 3.5 4 4l1.2-1.2 2 1c-.2 1.4-1 2-2.2 2-3.2-.4-6.4-3.6-6.8-6.8 0-1.2.6-2 2-2.2l1 2L9 9Z" />
                </svg>
              </span>
              <span>
                <span className="block text-xs font-bold text-[#25372B]">
                  Precisa de ajuda?
                </span>
                <span className="mt-1 block text-[11px] text-[#778179]">
                  Fale connosco
                </span>
              </span>
            </button>

            <Link
              href="/checkout"
              className="relative flex h-11 items-center gap-2 bg-[#087F5B] px-4 text-sm font-bold text-white transition hover:bg-[#066849]"
            >
              <svg
                width="19"
                height="19"
                viewBox="0 0 24 24"
                fill="none"
                stroke="currentColor"
                strokeWidth="1.8"
                aria-hidden="true"
              >
                <path d="M3 4h2l2.2 11.1a2 2 0 0 0 2 1.6h7.9a2 2 0 0 0 2-1.6L21 8H6" />
                <circle cx="10" cy="20" r="1" />
                <circle cx="18" cy="20" r="1" />
              </svg>
              <span className="hidden sm:inline">Carrinho</span>
              <span className="flex h-6 min-w-6 items-center justify-center bg-white px-1 text-xs font-extrabold text-[#087F5B]">
                {ready ? cartCount : 0}
              </span>
            </Link>
          </div>
        </div>

        {/* Navegação por categorias */}
        <nav className="border-t border-[#F0F2F0]">
          <div className="mx-auto flex max-w-[1440px] gap-7 overflow-x-auto px-4 sm:px-6 lg:px-10">
            {categories.map((item) => (
              <button
                key={item.name}
                type="button"
                onClick={() => chooseCategory(item.name)}
                className={`shrink-0 border-b-2 py-3.5 text-xs font-semibold transition ${
                  category === item.name
                    ? "border-[#087F5B] text-[#087F5B]"
                    : "border-transparent text-[#58645B] hover:text-[#087F5B]"
                }`}
              >
                {item.name}
              </button>
            ))}
          </div>
        </nav>
      </header>

      
      {/* Banner principal com vídeo de fundo */}
      <section className="relative isolate overflow-hidden bg-[#123525]">
        <video
          className="absolute inset-0 -z-20 h-full w-full object-cover"
          autoPlay
          muted
          loop
          playsInline
          preload="metadata"
          aria-hidden="true"
        >
          <source src="/videos/hero.mp4" type="video/mp4" />
        </video>

        {/* Camada escura para manter o texto legível */}
        <div
          className="absolute inset-0 -z-10 bg-[#10281C]/75"
          aria-hidden="true"
        />

        <div className="mx-auto grid max-w-[1440px] items-center gap-10 px-5 py-12 sm:px-8 sm:py-16 lg:grid-cols-[1.05fr_0.95fr] lg:px-12 lg:py-20">
          <div className="max-w-2xl">
            
          

            <h1 className="max-w-xl text-4xl font-extrabold leading-[1.12] tracking-tight text-white sm:text-5xl lg:text-[58px]">
              Cuidar da sua saúde começa aqui.
            </h1>

            <p className="mt-5 max-w-lg text-base leading-7 text-white/85">
              Encontre produtos de saúde, higiene e bem-estar. Faça o seu
              pedido online e confirme os detalhes diretamente com a nossa
              equipa.
            </p>

            <div className="mt-8 flex flex-wrap gap-3">
              <button
                type="button"
                onClick={() => chooseCategory("Todos")}
                className="bg-[#087F5B] px-6 py-4 text-sm font-bold text-white transition hover:bg-[#066849]"
              >
                Explorar produtos <span className="ml-2">→</span>
              </button>

              <button
                type="button"
                onClick={() =>
                  contactWhatsApp(
                    `Olá, ${BRAND.name}. Gostaria de ajuda para escolher um produto.`
                  )
                }
                className="border border-white/50 bg-white/10 px-6 py-4 text-sm font-bold text-white backdrop-blur-sm transition hover:bg-white/20"
              >
                Falar com a farmácia
              </button>
            </div>

            <div className="mt-8 flex flex-wrap gap-x-6 gap-y-3 text-xs font-medium text-white/90">
              <span>✓ Pedido simples</span>
              <span>✓ Entrega ou levantamento</span>
              <span>✓ Confirmação pelo WhatsApp</span>
            </div>
          </div>
        </div>
      </section>


      {/* Benefícios rápidos */}
      <section className="border-b border-[#E9EDE9] bg-white">
        <div className="mx-auto grid max-w-[1440px] gap-5 px-5 py-6 sm:grid-cols-3 sm:px-8 lg:px-12">
          <div className="flex items-center gap-3">
            <span className="flex h-10 w-10 shrink-0 items-center justify-center bg-[#E8F4EA] text-lg text-[#087F5B]">
              ✓
            </span>
            <div>
              <p className="text-sm font-bold text-[#293A2E]">
                Pedido simplificado
              </p>
              <p className="mt-1 text-xs text-[#7B857D]">
                Escolha os produtos online
              </p>
            </div>
          </div>

          <div className="flex items-center gap-3">
            <span className="flex h-10 w-10 shrink-0 items-center justify-center bg-[#E8F4EA] text-lg text-[#087F5B]">
              ⌂
            </span>
            <div>
              <p className="text-sm font-bold text-[#293A2E]">
                Entrega ou levantamento
              </p>
              <p className="mt-1 text-xs text-[#7B857D]">
                Escolha durante o checkout
              </p>
            </div>
          </div>

          <div className="flex items-center gap-3">
            <span className="flex h-10 w-10 shrink-0 items-center justify-center bg-[#E8F4EA] text-lg text-[#087F5B]">
              ☏
            </span>
            <div>
              <p className="text-sm font-bold text-[#293A2E]">
                Atendimento pelo WhatsApp
              </p>
              <p className="mt-1 text-xs text-[#7B857D]">
                Confirme o seu pedido com a equipa
              </p>
            </div>
          </div>
        </div>
      </section>

      {/* Seleção em destaque */}
      <section className="mx-auto max-w-[1440px] px-5 py-12 sm:px-8 lg:px-12 lg:py-16">
        <div className="mb-7 flex items-end justify-between gap-4">
          <div>
            <p className="text-[11px] font-bold uppercase tracking-[0.16em] text-[#087F5B]">
              Para o seu dia a dia
            </p>
            <h2 className="mt-2 text-2xl font-extrabold tracking-tight text-[#20372A] sm:text-3xl">
              Produtos em destaque
            </h2>
            <p className="mt-2 text-sm text-[#7B857D]">
              Explore alguns dos produtos do nosso catálogo.
            </p>
          </div>
          <button
            type="button"
            onClick={() => chooseCategory("Todos")}
            className="hidden shrink-0 border-b border-[#087F5B] pb-1 text-sm font-bold text-[#087F5B] sm:block"
          >
            Ver todos os produtos →
          </button>
        </div>

        <div className="grid grid-cols-2 gap-3 sm:grid-cols-3 sm:gap-4 lg:grid-cols-4">
          {featuredProducts.map((product) => renderProduct(product))}
        </div>

        <div className="mt-7 text-center sm:hidden">
          <button
            type="button"
            onClick={() => chooseCategory("Todos")}
            className="border border-[#DCE5DD] px-6 py-3 text-sm font-bold text-[#087F5B]"
          >
            Ver todos os produtos
          </button>
        </div>
      </section>

      {/* Catálogo completo */}
      <section
        id="produtos"
        className="scroll-mt-40 border-y border-[#E8EDE8] bg-[#F8FAF8] py-12 sm:py-16"
      >
        <div className="mx-auto max-w-[1440px] px-5 sm:px-8 lg:px-12">
          <div className="flex flex-col gap-4 sm:flex-row sm:items-end sm:justify-between">
            <div>
              <p className="text-[11px] font-bold uppercase tracking-[0.16em] text-[#087F5B]">
                Catálogo da farmácia
              </p>
              <h2 className="mt-2 text-2xl font-extrabold tracking-tight text-[#20372A] sm:text-3xl">
                Encontre o que procura
              </h2>
              <p className="mt-2 text-sm text-[#7B857D]">
                Pesquise ou escolha uma categoria para ver os produtos.
              </p>
            </div>
            <span className="text-xs font-semibold text-[#68756B]">
              {filteredProducts.length} produto(s)
            </span>
          </div>

          <div className="mt-7 flex flex-col gap-3 md:flex-row">
            <div className="relative flex-1">
              <label htmlFor="catalog-search" className="sr-only">
                Pesquisar no catálogo
              </label>
              <input
                id="catalog-search"
                type="search"
                value={search}
                onChange={(event) => setSearch(event.target.value)}
                placeholder="Pesquisar por nome ou categoria..."
                className="w-full border border-[#DDE5DE] bg-white px-4 py-3.5 text-sm outline-none transition placeholder:text-[#939B94] focus:border-[#087F5B]"
              />
            </div>

            <label className="flex items-center gap-3 border border-[#DDE5DE] bg-white px-4">
              <span className="shrink-0 text-xs font-semibold text-[#68756B]">
                Categoria
              </span>
              <select
                value={category}
                onChange={(event) => setCategory(event.target.value)}
                className="min-w-0 flex-1 bg-transparent py-3.5 text-sm font-semibold text-[#26372B] outline-none md:min-w-[210px]"
              >
                {categories.map((item) => (
                  <option key={item.name} value={item.name}>
                    {item.name}
                  </option>
                ))}
              </select>
            </label>
          </div>

          <div className="mt-5 flex gap-2 overflow-x-auto pb-2">
            {categories.map((item) => (
              <button
                key={item.name}
                type="button"
                onClick={() => setCategory(item.name)}
                className={`shrink-0 border px-4 py-2.5 text-xs font-semibold transition ${
                  category === item.name
                    ? "border-[#087F5B] bg-[#087F5B] text-white"
                    : "border-[#DCE5DD] bg-white text-[#536057] hover:border-[#087F5B] hover:text-[#087F5B]"
                }`}
              >
                {item.name}
              </button>
            ))}
          </div>

          {filteredProducts.length > 0 ? (
            <div className="mt-5 grid grid-cols-2 gap-3 sm:grid-cols-3 sm:gap-4 lg:grid-cols-4 xl:grid-cols-5">
              {filteredProducts.map((product) => renderProduct(product))}
            </div>
          ) : (
            <div className="mt-5 border border-[#E1E8E1] bg-white px-5 py-16 text-center">
              <span className="text-3xl text-[#087F5B]">⌕</span>
              <h3 className="mt-4 font-bold text-[#293A2E]">
                Não encontrámos esse produto
              </h3>
              <p className="mt-2 text-sm text-[#7B857D]">
                Tente outro nome ou selecione uma categoria diferente.
              </p>
              <button
                type="button"
                onClick={() => {
                  setSearch("");
                  setCategory("Todos");
                }}
                className="mt-5 bg-[#087F5B] px-5 py-3 text-sm font-bold text-white hover:bg-[#066849]"
              >
                Limpar pesquisa
              </button>
            </div>
          )}

          <p className="mt-7 border-l-2 border-[#D7E5D8] pl-3 text-xs leading-5 text-[#7B857D]">
            Catálogo demonstrativo. Os preços, produtos e a disponibilidade
            devem ser confirmados pela farmácia antes da publicação comercial.
            Medicamentos sujeitos a receita dependem da validação farmacêutica
            e dos requisitos legais aplicáveis.
          </p>
        </div>
      </section>

      {/* Como funciona */}
      <section id="vantagens" className="bg-white py-14 sm:py-16">
        <div className="mx-auto max-w-[1440px] px-5 sm:px-8 lg:px-12">
          <div className="max-w-2xl">
            <p className="text-[11px] font-bold uppercase tracking-[0.16em] text-[#087F5B]">
              Como funciona
            </p>
            <h2 className="mt-2 text-2xl font-extrabold tracking-tight text-[#20372A] sm:text-3xl">
              Comprar é simples.
            </h2>
          </div>

          <div className="mt-8 grid gap-px border border-[#E5EAE5] bg-[#E5EAE5] md:grid-cols-3">
            {[
              {
                number: "01",
                title: "Escolha os produtos",
                text: "Pesquise no catálogo e adicione ao carrinho os produtos disponíveis para compra.",
              },
              {
                number: "02",
                title: "Envie o seu pedido",
                text: "Preencha os dados no checkout e escolha entrega ou levantamento.",
              },
              {
                number: "03",
                title: "Confirme com a equipa",
                text: "O pedido segue pelo WhatsApp para confirmação de disponibilidade e dos detalhes.",
              },
            ].map((item) => (
              <div key={item.number} className="bg-white p-6 sm:p-8">
                <p className="text-sm font-extrabold text-[#087F5B]">
                  {item.number}
                </p>
                <h3 className="mt-5 text-lg font-extrabold text-[#24392B]">
                  {item.title}
                </h3>
                <p className="mt-3 text-sm leading-6 text-[#748076]">
                  {item.text}
                </p>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* Contacto */}
      <section id="contacto" className="bg-[#EAF3EB]">
        <div className="mx-auto flex max-w-[1440px] flex-col gap-6 px-5 py-10 sm:px-8 md:flex-row md:items-center md:justify-between lg:px-12">
          <div>
            <h2 className="text-2xl font-extrabold tracking-tight text-[#193B2A]">
              Precisa de ajuda com um produto?
            </h2>
            <p className="mt-2 max-w-xl text-sm leading-6 text-[#5E7162]">
              Entre em contacto com a nossa equipa para consultar produtos,
              preços e disponibilidade.
            </p>
          </div>
          <button
            type="button"
            onClick={() =>
              contactWhatsApp(
                `Olá, ${BRAND.name}. Gostaria de consultar um produto.`
              )
            }
            className="shrink-0 bg-[#087F5B] px-6 py-4 text-sm font-bold text-white transition hover:bg-[#066849]"
          >
            Contactar pelo WhatsApp →
          </button>
        </div>
      </section>

      {/* Rodapé */}
      <footer className="bg-[#123525] text-white">
        <div className="mx-auto flex max-w-[1440px] flex-col gap-6 px-5 py-9 sm:px-8 md:flex-row md:items-center md:justify-between lg:px-12">
          <div className="flex items-center gap-3">
            <LogoMark className="h-10 w-10" />
            <div>
              <p className="text-lg font-extrabold">{BRAND.name}</p>
              <p className="mt-1 text-xs text-[#C1D5C6]">
                Cuidamos de si e da sua família.
              </p>
            </div>
          </div>

          <div className="flex flex-wrap gap-x-5 gap-y-3 text-xs text-[#D1E0D4]">
            <a href="#produtos" className="hover:text-white">
              Produtos
            </a>
            <a href="#vantagens" className="hover:text-white">
              Como funciona
            </a>
            <a href="#contacto" className="hover:text-white">
              Contacto
            </a>
          </div>

          <p className="text-xs text-[#B6CDBB]">
            © 2026 {BRAND.name}
          </p>
        </div>
      </footer>

      {/* Atendimento WhatsApp */}
      <div className="fixed bottom-20 right-4 z-40 sm:bottom-24 sm:right-6">
        {supportOpen && (
          <div className="mb-3 w-[min(330px,calc(100vw-32px))] border border-[#DCE5DD] bg-white shadow-xl">
            <div className="bg-[#087F5B] p-4 text-white">
              <p className="font-extrabold">Como podemos ajudar?</p>
              <p className="mt-1 text-xs text-white/85">
                Escolha o motivo do seu contacto.
              </p>
            </div>

            <div className="space-y-1 p-2">
              <button
                type="button"
                onClick={() =>
                  contactWhatsApp(
                    `Olá, ${BRAND.name}. Gostaria de falar com um profissional de saúde sobre o que estou a sentir.`
                  )
                }
                className="w-full border-b border-[#EDF0ED] p-3 text-left text-sm font-semibold text-[#2B3B30] hover:bg-[#F4F8F4]"
              >
                Estou a sentir algo
                <span className="mt-1 block text-xs font-normal text-[#7B857D]">
                  Pedir orientação profissional
                </span>
              </button>

              <button
                type="button"
                onClick={() =>
                  contactWhatsApp(
                    `Olá, ${BRAND.name}. Procuro um produto. Podem confirmar a disponibilidade e o preço?`
                  )
                }
                className="w-full border-b border-[#EDF0ED] p-3 text-left text-sm font-semibold text-[#2B3B30] hover:bg-[#F4F8F4]"
              >
                Procuro um produto
                <span className="mt-1 block text-xs font-normal text-[#7B857D]">
                  Consultar preço e disponibilidade
                </span>
              </button>

              <button
                type="button"
                onClick={() =>
                  contactWhatsApp(
                    `Olá, ${BRAND.name}. Tenho uma dúvida sobre um pedido.`
                  )
                }
                className="w-full p-3 text-left text-sm font-semibold text-[#2B3B30] hover:bg-[#F4F8F4]"
              >
                Tenho dúvidas sobre um pedido
              </button>
            </div>
          </div>
        )}

        <button
          type="button"
          onClick={() => setSupportOpen((open) => !open)}
          aria-label={supportOpen ? "Fechar atendimento" : "Abrir atendimento"}
          className="ml-auto flex h-14 w-14 items-center justify-center rounded-full bg-[#087F5B] text-2xl text-white shadow-lg transition hover:bg-[#066849]"
        >
          {supportOpen ? "×" : "☏"}
        </button>
      </div>

      {/* Barra fixa do carrinho */}
      {ready && cartCount > 0 && (
        <div className="fixed inset-x-0 bottom-0 z-50 border-t border-[#DCE5DD] bg-white shadow-[0_-4px_20px_rgba(20,50,30,0.08)]">
          <div className="mx-auto flex max-w-[1440px] items-center justify-between gap-4 px-4 py-3 sm:px-8 lg:px-12">
            <div className="min-w-0">
              <p className="text-xs text-[#68756B]">
                {cartCount} produto(s) no carrinho
              </p>
              <p className="mt-0.5 text-lg font-extrabold text-[#193B2A]">
                {money(cartTotal)}
              </p>
            </div>

            <Link
              href="/checkout"
              className="shrink-0 bg-[#087F5B] px-5 py-3.5 text-sm font-bold text-white transition hover:bg-[#066849]"
            >
              Finalizar pedido →
            </Link>
          </div>
        </div>
      )}
    </main>
  );
}