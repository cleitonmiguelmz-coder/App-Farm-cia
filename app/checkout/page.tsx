
"use client";

import { useState } from "react";
import Link from "next/link";
import { useCart } from "../CartContext";
import Image from "next/image";
import { openExternal } from "../lib/external";
import { BRAND } from "../brand";
import { Logo } from "../Logo";

const WHATSAPP_NUMBER = "258879093427";

type DeliveryMethod = "delivery" | "pickup";

function normalizeMozambicanPhone(value: string) {
  let digits = value.replace(/\D/g, "");

  if (digits.startsWith("258") && digits.length === 12) {
    digits = digits.slice(3);
  }

  if (!/^8[2-7]\d{7}$/.test(digits)) {
    return null;
  }

  return digits;
}

export default function CheckoutPage() {
  const {
    items,
    cartCount,
    cartTotal,
    updateQuantity,
    removeFromCart,
    ready,
  } = useCart();

  const [name, setName] = useState("");
  const [phone, setPhone] = useState("");
  const [deliveryMethod, setDeliveryMethod] =
    useState<DeliveryMethod>("delivery");
  const [address, setAddress] = useState("");
  const [location, setLocation] = useState("");
  const [notes, setNotes] = useState("");
  const [error, setError] = useState("");
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [orderReference, setOrderReference] = useState("");
  const [whatsappUrl, setWhatsappUrl] = useState("");

  function submitOrder(event: React.FormEvent<HTMLFormElement>) {
    event.preventDefault();

    if (isSubmitting) return;

    setError("");

    if (!items.length) {
      setError("O carrinho está vazio. Adicione produtos antes de continuar.");
      return;
    }

    if (!name.trim() || !phone.trim()) {
      setError("Preencha o seu nome e número de telefone.");
      return;
    }

    const normalizedPhone = normalizeMozambicanPhone(phone);

    if (!normalizedPhone) {
      setError(
        "Número inválido. Introduza um número moçambicano válido das operadoras 82, 83, 84, 85, 86 ou 87."
      );
      return;
    }

    if (deliveryMethod === "delivery" && !address.trim()) {
      setError("Indique a morada para a entrega.");
      return;
    }

    if (!WHATSAPP_NUMBER) {
      setError(
        "O checkout está pronto, mas falta configurar o número de WhatsApp da farmácia no código."
      );
      return;
    }

    const reference = `ANC-${Date.now().toString().slice(-8)}`;

    const orderLines = items.map(
      ({ product, quantity }) =>
        `• ${product.name} x${quantity} — ${(product.price * quantity).toLocaleString("pt-MZ")} MT`
    );

    const message = [
      `🏥 *NOVO PEDIDO — ${BRAND.name.toUpperCase()}*`,
      "",
      `📋 Referência: ${reference}`,
      `👤 Cliente: ${name.trim()}`,
      `📞 Telefone: +258${normalizedPhone}`,
      "",
      "*PRODUTOS:*",
      ...orderLines,
      "",
      `🛒 Quantidade total: ${cartCount}`,
      `💰 Subtotal dos produtos: ${cartTotal.toLocaleString("pt-MZ")} MT`,
      "",
      `🚚 Modalidade: ${
        deliveryMethod === "delivery"
          ? "Entrega ao domicílio"
          : "Levantamento na farmácia"
      }`,
      ...(deliveryMethod === "delivery"
        ? [
            `📍 Morada: ${address.trim()}`,
            ...(location.trim()
              ? [`📌 Referência: ${location.trim()}`]
              : []),
          ]
        : []),
      ...(notes.trim() ? [`📝 Observações: ${notes.trim()}`] : []),
      "",
      "Solicito a confirmação da disponibilidade dos produtos, do valor final e dos detalhes do pedido.",
    ].join("\n");

    const url = `https://wa.me/${WHATSAPP_NUMBER}?text=${encodeURIComponent(message)}`;

    setWhatsappUrl(url);

    void openExternal(url).then((opened) => {
      if (!opened) {
        setError(
          "Não foi possível abrir o WhatsApp automaticamente. Utilize o botão abaixo para abrir manualmente."
        );
        return;
      }

      setOrderReference(reference);
      setIsSubmitting(false);
    });
  }

  if (!ready) {
    return (
      <main className="flex min-h-screen items-center justify-center bg-[#F7F9F7]">
        <p className="text-sm font-medium text-[#657169]">
          A carregar o seu carrinho...
        </p>
      </main>
    );
  }

  return (
    <main className="min-h-screen bg-[#F7F9F7] text-[#17251D]">
      <header className="border-b border-[#E3EAE4] bg-white">
        <div className="mx-auto flex max-w-6xl items-center justify-between px-5 py-5">
          <Link href="/" className="flex items-center gap-3">
            <Logo />
          </Link>

          <Link
            href="/"
            className="text-sm font-semibold text-[#087F5B] hover:underline"
          >
            ← Continuar a comprar
          </Link>
        </div>
      </header>

      <div className="mx-auto max-w-6xl px-5 py-10 md:py-14">
        <div className="mb-9">
          <h1 className="mt-3 text-3xl font-extrabold tracking-tight sm:text-4xl">
            Quase tudo pronto.
          </h1>
          <p className="mt-3 text-sm leading-6 text-[#738078]">
            Confirme os produtos e preencha os seus dados para continuar pelo
            WhatsApp.
          </p>
        </div>

        {orderReference && (
          <section
            role="status"
            className="mb-7 rounded-3xl border border-[#B9DFC5] bg-[#EDF8F0] p-5 sm:p-7"
          >
            <div className="flex items-start gap-4">
              <span className="flex h-11 w-11 shrink-0 items-center justify-center rounded-full bg-[#087F5B] text-xl font-bold text-white">
                ✓
              </span>

              <div className="min-w-0">
                <h2 className="text-lg font-extrabold text-[#145C3C]">
                  WhatsApp aberto com o seu pedido
                </h2>

                <p className="mt-2 text-sm leading-6 text-[#426B51]">
                  A mensagem foi preparada com os dados do seu pedido. Volte
                  ao WhatsApp e clique em enviar para concluir o envio à
                  farmácia.
                </p>

                <p className="mt-3 text-sm font-bold text-[#145C3C]">
                  Referência: {orderReference}
                </p>

                <p className="mt-2 text-xs leading-5 text-[#587461]">
                  Atenção: abrir o WhatsApp não significa que o pedido já foi
                  recebido ou confirmado. Aguarde a resposta da farmácia.
                </p>

                <a
                  href={whatsappUrl}
                  target="_blank"
                  rel="noopener noreferrer"
                  className="mt-4 inline-flex rounded-xl bg-[#087F5B] px-5 py-3 text-sm font-bold text-white transition hover:bg-[#066849]"
                >
                  Abrir WhatsApp novamente →
                </a>
              </div>
            </div>
          </section>
        )}

        {items.length === 0 ? (
          <section className="rounded-3xl border border-[#E2EAE3] bg-white p-8 text-center sm:p-12">
            <div className="text-5xl">🛒</div>
            <h2 className="mt-5 text-xl font-extrabold">
              O seu carrinho está vazio
            </h2>
            <p className="mt-3 text-sm text-[#738078]">
              Explore os produtos da farmácia e adicione os que pretende pedir.
            </p>
            <Link
              href="/#produtos"
              className="mt-6 inline-flex rounded-xl bg-[#087F5B] px-6 py-3.5 text-sm font-bold text-white hover:bg-[#066849]"
            >
              Explorar produtos
            </Link>
          </section>
        ) : (
          <form
            onSubmit={submitOrder}
            className="grid items-start gap-7 lg:grid-cols-[1fr_370px]"
          >
            <div className="space-y-7">
              <section className="rounded-3xl border border-[#E2EAE3] bg-white p-5 sm:p-7">
                <div className="mb-6 flex items-center gap-3">
                  <span className="flex h-10 w-10 items-center justify-center rounded-xl bg-[#E7F5EB] font-bold text-[#087F5B]">
                    1
                  </span>
                  <div>
                    <h2 className="font-extrabold">Os seus produtos</h2>
                    <p className="mt-1 text-xs text-[#738078]">
                      Reveja quantidades e valores.
                    </p>
                  </div>
                </div>

                <div className="space-y-5">
                  {items.map(({ product, quantity }) => (
                    <div
                      key={product.id}
                      className="flex gap-4 border-b border-[#EDF1ED] pb-5 last:border-0 last:pb-0"
                    >
                      <div
                        className="relative flex h-16 w-16 shrink-0 items-center justify-center overflow-hidden rounded-2xl"
                        style={{ backgroundColor: product.color }}
                      >
                        {product.image ? (
                          <Image
                            src={product.image}
                            alt={product.name}
                            fill
                            sizes="64px"
                            className="object-contain p-1"
                          />
                        ) : (
                          <span className="text-3xl">{product.icon}</span>
                        )}
                      </div>

                      <div className="min-w-0 flex-1">
                        <h3 className="font-bold">{product.name}</h3>
                        <p className="mt-1 text-xs text-[#738078]">
                          {product.price.toLocaleString("pt-MZ")} MT /{" "}
                          {product.unit}
                        </p>
                        <p className="mt-2 font-extrabold text-[#087F5B]">
                          {(product.price * quantity).toLocaleString("pt-MZ")} MT
                        </p>

                        <div className="mt-3 flex flex-wrap items-center gap-3">
                          <div className="flex items-center overflow-hidden rounded-lg border border-[#DFE7E0]">
                            <button
                              type="button"
                              onClick={() =>
                                updateQuantity(product.id, quantity - 1)
                              }
                              className="h-9 w-9 font-bold hover:bg-[#F0F5F1]"
                              aria-label={`Diminuir ${product.name}`}
                            >
                              −
                            </button>
                            <span className="min-w-8 text-center text-sm font-bold">
                              {quantity}
                            </span>
                            <button
                              type="button"
                              onClick={() =>
                                updateQuantity(product.id, quantity + 1)
                              }
                              className="h-9 w-9 font-bold hover:bg-[#F0F5F1]"
                              aria-label={`Aumentar ${product.name}`}
                            >
                              +
                            </button>
                          </div>

                          <button
                            type="button"
                            onClick={() => removeFromCart(product.id)}
                            className="text-xs font-semibold text-red-600 hover:underline"
                          >
                            Remover
                          </button>
                        </div>
                      </div>
                    </div>
                  ))}
                </div>
              </section>

              <section className="rounded-3xl border border-[#E2EAE3] bg-white p-5 sm:p-7">
                <div className="mb-6 flex items-center gap-3">
                  <span className="flex h-10 w-10 items-center justify-center rounded-xl bg-[#E7F5EB] font-bold text-[#087F5B]">
                    2
                  </span>
                  <div>
                    <h2 className="font-extrabold">Dados do cliente</h2>
                    <p className="mt-1 text-xs text-[#738078]">
                      Para a farmácia entrar em contacto consigo.
                    </p>
                  </div>
                </div>

                <div className="space-y-5">
                  <div>
                    <label
                      htmlFor="name"
                      className="mb-2 block text-sm font-semibold"
                    >
                      Nome completo *
                    </label>
                    <input
                      id="name"
                      required
                      autoComplete="name"
                      value={name}
                      onChange={(event) => setName(event.target.value)}
                      placeholder="O seu nome"
                      className="w-full rounded-xl border border-[#DDE6DF] bg-white px-4 py-3.5 text-sm outline-none focus:border-[#087F5B]"
                    />
                  </div>

                  <div>
                    <label
                      htmlFor="phone"
                      className="mb-2 block text-sm font-semibold"
                    >
                      Número de telefone *
                    </label>
                    <input
                      id="phone"
                      required
                      type="tel"
                      autoComplete="tel"
                      value={phone}
                      onChange={(event) => {
                        setPhone(event.target.value);
                        setError("");
                        setIsSubmitting(false);
                      }}
                      placeholder="Ex.: 84 123 4567"
                      className="w-full rounded-xl border border-[#DDE6DF] bg-white px-4 py-3.5 text-sm outline-none focus:border-[#087F5B]"
                    />
                    <p className="mt-2 text-xs text-[#89938C]">
                      Aceitamos números das operadoras 82, 83, 84, 85, 86 e 87.
                    </p>
                  </div>
                </div>
              </section>

              <section className="rounded-3xl border border-[#E2EAE3] bg-white p-5 sm:p-7">
                <div className="mb-6 flex items-center gap-3">
                  <span className="flex h-10 w-10 items-center justify-center rounded-xl bg-[#E7F5EB] font-bold text-[#087F5B]">
                    3
                  </span>
                  <div>
                    <h2 className="font-extrabold">Como deseja receber?</h2>
                    <p className="mt-1 text-xs text-[#738078]">
                      Escolha a opção mais conveniente.
                    </p>
                  </div>
                </div>

                <div className="grid gap-3 sm:grid-cols-2">
                  <button
                    type="button"
                    onClick={() => {
                      setDeliveryMethod("delivery");
                      setIsSubmitting(false);
                    }}
                    className={`rounded-2xl border p-4 text-left transition ${
                      deliveryMethod === "delivery"
                        ? "border-[#087F5B] bg-[#F0F8F2] ring-1 ring-[#087F5B]"
                        : "border-[#DFE7E0] hover:border-[#A9CBB4]"
                    }`}
                  >
                    <span className="text-2xl">🚚</span>
                    <span className="mt-3 block text-sm font-bold">
                      Entrega ao domicílio
                    </span>
                    <span className="mt-1 block text-xs text-[#738078]">
                      Receba na morada indicada.
                    </span>
                  </button>

                  <button
                    type="button"
                    onClick={() => {
                      setDeliveryMethod("pickup");
                      setIsSubmitting(false);
                    }}
                    className={`rounded-2xl border p-4 text-left transition ${
                      deliveryMethod === "pickup"
                        ? "border-[#087F5B] bg-[#F0F8F2] ring-1 ring-[#087F5B]"
                        : "border-[#DFE7E0] hover:border-[#A9CBB4]"
                    }`}
                  >
                    <span className="text-2xl">🏥</span>
                    <span className="mt-3 block text-sm font-bold">
                      Levantar na farmácia
                    </span>
                    <span className="mt-1 block text-xs text-[#738078]">
                      Levante após confirmação.
                    </span>
                  </button>
                </div>

                {deliveryMethod === "delivery" && (
                  <div className="mt-5 space-y-5">
                    <div>
                      <label
                        htmlFor="address"
                        className="mb-2 block text-sm font-semibold"
                      >
                        Morada de entrega *
                      </label>
                      <textarea
                        id="address"
                        required
                        rows={3}
                        value={address}
                        onChange={(event) => {
                          setAddress(event.target.value);
                          setIsSubmitting(false);
                        }}
                        placeholder="Bairro, rua, número da casa..."
                        className="w-full resize-y rounded-xl border border-[#DDE6DF] px-4 py-3.5 text-sm outline-none focus:border-[#087F5B]"
                      />
                    </div>

                    <div>
                      <label
                        htmlFor="location"
                        className="mb-2 block text-sm font-semibold"
                      >
                        Ponto de referência
                      </label>
                      <input
                        id="location"
                        value={location}
                        onChange={(event) => setLocation(event.target.value)}
                        placeholder="Ex.: perto da escola..."
                        className="w-full rounded-xl border border-[#DDE6DF] px-4 py-3.5 text-sm outline-none focus:border-[#087F5B]"
                      />
                    </div>
                  </div>
                )}

                <div className="mt-5">
                  <label
                    htmlFor="notes"
                    className="mb-2 block text-sm font-semibold"
                  >
                    Observações (opcional)
                  </label>
                  <textarea
                    id="notes"
                    rows={2}
                    value={notes}
                    onChange={(event) => setNotes(event.target.value)}
                    placeholder="Informações adicionais sobre o pedido..."
                    className="w-full resize-y rounded-xl border border-[#DDE6DF] px-4 py-3.5 text-sm outline-none focus:border-[#087F5B]"
                  />
                </div>
              </section>
            </div>

            <aside className="lg:sticky lg:top-6">
              <section className="rounded-3xl border border-[#E2EAE3] bg-white p-6">
                <h2 className="text-lg font-extrabold">Resumo do pedido</h2>

                <div className="mt-6 space-y-4 text-sm">
                  <div className="flex justify-between gap-3 text-[#657169]">
                    <span>Produtos ({cartCount} unidades)</span>
                    <span className="font-semibold text-[#17251D]">
                      {cartTotal.toLocaleString("pt-MZ")} MT
                    </span>
                  </div>

                  <div className="flex justify-between gap-3 text-[#657169]">
                    <span>Entrega</span>
                    <span className="text-right font-semibold text-[#17251D]">
                      {deliveryMethod === "delivery"
                        ? "A confirmar"
                        : "Levantamento"}
                    </span>
                  </div>

                  <div className="border-t border-[#E5EBE5] pt-4">
                    <p className="text-xs leading-5 text-[#738078]">
                      O custo da entrega e o valor final serão confirmados
                      pela farmácia antes da conclusão do pedido.
                    </p>
                  </div>

                  <div className="flex items-center justify-between gap-3">
                    <span className="font-bold">Subtotal</span>
                    <span className="text-2xl font-extrabold text-[#087F5B]">
                      {cartTotal.toLocaleString("pt-MZ")} MT
                    </span>
                  </div>
                </div>

                {error && (
                  <div
                    role="alert"
                    className="mt-5 rounded-xl border border-red-200 bg-red-50 p-3 text-sm leading-5 text-red-700"
                  >
                    <p>{error}</p>

                    {whatsappUrl && (
                      <a
                        href={whatsappUrl}
                        target="_blank"
                        rel="noopener noreferrer"
                        className="mt-3 inline-block font-bold underline"
                      >
                        Abrir WhatsApp manualmente →
                      </a>
                    )}
                  </div>
                )}

                <button
                  type="submit"
                  disabled={isSubmitting}
                  className="mt-6 flex w-full items-center justify-center gap-2 rounded-xl bg-[#087F5B] px-5 py-4 text-sm font-bold text-white transition hover:bg-[#066849] disabled:cursor-not-allowed disabled:opacity-60"
                >
                  <span>
                    {isSubmitting
                      ? "A preparar pedido..."
                      : orderReference
                        ? "Enviar novamente pelo WhatsApp"
                        : "Enviar pelo WhatsApp"}
                  </span>
                  <span>→</span>
                </button>

                <p className="mt-4 text-center text-xs leading-5 text-[#89938C]">
                  O pedido só será confirmado após a farmácia receber a
                  mensagem e responder.
                </p>
              </section>
            </aside>
          </form>
        )}
      </div>
    </main>
  );
}
