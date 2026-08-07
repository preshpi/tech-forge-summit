"use client";

import { useMemo, useState } from "react";
import Link from "next/link";
import { useSearchParams } from "next/navigation";
import { Check, ChevronLeft, CreditCard, Loader2 } from "lucide-react";
import { tiers, type TierId } from "@/lib/tickets";

type Step = "review" | "details" | "payment" | "success";

export default function CheckoutFlow() {
  const params = useSearchParams();
  const initialTier = (params.get("tier") as TierId) || "general";

  const [tierId, setTierId] = useState<TierId>(
    initialTier in tiers ? initialTier : "general"
  );
  const [qty, setQty] = useState(1);
  const [step, setStep] = useState<Step>("review");
  const [submitting, setSubmitting] = useState(false);
  const [name, setName] = useState("");
  const [email, setEmail] = useState("");
  const [company, setCompany] = useState("");

  const tier = tiers[tierId];
  const total = useMemo(() => tier.price * qty, [tier, qty]);

  const steps: Step[] = ["review", "details", "payment", "success"];
  const stepIndex = steps.indexOf(step);

  function next() {
    if (step === "payment") {
      setSubmitting(true);
      setTimeout(() => {
        setSubmitting(false);
        setStep("success");
      }, 1200);
      return;
    }
    const order: Step[] = ["review", "details", "payment", "success"];
    setStep(order[order.indexOf(step) + 1]);
  }

  function back() {
    const order: Step[] = ["review", "details", "payment", "success"];
    setStep(order[order.indexOf(step) - 1]);
  }

  return (
    <div className="flex-1 flex flex-col">
      <div className="border-b border-line">
        <div className="mx-auto max-w-2xl px-4 sm:px-6 py-5 flex items-center justify-between">
          <Link href="/" className="flex items-center gap-2 font-display font-bold">
            <span className="inline-block h-2.5 w-2.5 rounded-full bg-signal" />
            The TechForge
          </Link>
          <div className="flex items-center gap-1.5">
            {steps.slice(0, 3).map((s, i) => (
              <div
                key={s}
                className={`h-1.5 w-8 rounded-full transition-colors ${
                  i <= stepIndex && step !== "success"
                    ? "bg-signal"
                    : step === "success"
                    ? "bg-signal"
                    : "bg-line"
                }`}
              />
            ))}
          </div>
        </div>
      </div>

      <div className="flex-1 mx-auto max-w-2xl w-full px-4 sm:px-6 py-14">
        {step !== "review" && step !== "success" && (
          <button
            onClick={back}
            className="mb-8 inline-flex items-center gap-1.5 text-xs text-paper/50 transition-colors hover:text-paper md:text-sm"
          >
            <ChevronLeft className="h-4 w-4" />
            Back
          </button>
        )}

        {step === "review" && (
          <div>
            <h1 className="font-display text-3xl font-bold tracking-tight mb-8">
              Choose your pass
            </h1>
            <div className="space-y-3">
              {(Object.keys(tiers) as TierId[]).map((id) => {
                const t = tiers[id];
                const selected = id === tierId;
                return (
                  <button
                    key={id}
                    onClick={() => setTierId(id)}
                    className={`flex w-full items-start justify-between gap-3 rounded-xl border p-4 text-left transition-colors md:gap-4 md:rounded-2xl md:p-5 ${
                      selected
                        ? "border-signal bg-ink-soft"
                        : "border-line hover:border-paper/20"
                    }`}
                  >
                    <div>
                      <div className="font-display font-bold">{t.name}</div>
                      <p className="text-sm text-paper/50 mt-1 max-w-sm">{t.desc}</p>
                    </div>
                    <div className="text-right shrink-0">
                      <div className="font-display font-bold text-lg">${t.price}</div>
                      <div className="text-xs text-paper/40 font-mono">{t.unit}</div>
                    </div>
                  </button>
                );
              })}
            </div>

            {tierId !== "team" && (
              <div className="mt-8 flex items-center justify-between rounded-xl border border-line p-4 md:rounded-2xl md:p-5">
                <span className="text-sm font-semibold">Quantity</span>
                <div className="flex items-center gap-4">
                  <button
                    onClick={() => setQty((q) => Math.max(1, q - 1))}
                    className="flex h-7 w-7 items-center justify-center rounded-full border border-line hover:border-signal/50 md:h-8 md:w-8"
                  >
                    −
                  </button>
                  <span className="font-mono w-4 text-center">{qty}</span>
                  <button
                    onClick={() => setQty((q) => Math.min(10, q + 1))}
                    className="flex h-7 w-7 items-center justify-center rounded-full border border-line hover:border-signal/50 md:h-8 md:w-8"
                  >
                    +
                  </button>
                </div>
              </div>
            )}

            <button
              onClick={next}
              className="mt-10 w-full rounded-full bg-signal py-3 text-xs font-semibold text-ink transition-colors hover:bg-signal-dim md:py-3.5 md:text-sm"
            >
              Continue — ${total.toLocaleString()}
            </button>
          </div>
        )}

        {step === "details" && (
          <div>
            <h1 className="font-display text-3xl font-bold tracking-tight mb-8">
              Attendee details
            </h1>
            <div className="space-y-4">
              <Field label="Full name" value={name} onChange={setName} placeholder="Jordan Rivera" />
              <Field label="Email" value={email} onChange={setEmail} placeholder="jordan@company.com" type="email" />
              <Field label="Company" value={company} onChange={setCompany} placeholder="Optional" />
            </div>
            <button
              onClick={next}
              disabled={!name || !email}
              className="mt-10 w-full rounded-full bg-signal py-3 text-xs font-semibold text-ink transition-colors hover:bg-signal-dim disabled:cursor-not-allowed disabled:opacity-30 md:py-3.5 md:text-sm"
            >
              Continue to payment
            </button>
          </div>
        )}

        {step === "payment" && (
          <div>
            <h1 className="font-display text-3xl font-bold tracking-tight mb-8">
              Payment
            </h1>
            <div className="rounded-2xl border border-line p-6 space-y-4">
              <Field label="Card number" value="" onChange={() => {}} placeholder="4242 4242 4242 4242" icon={<CreditCard className="h-4 w-4" />} />
              <div className="grid grid-cols-2 gap-4">
                <Field label="Expiry" value="" onChange={() => {}} placeholder="MM / YY" />
                <Field label="CVC" value="" onChange={() => {}} placeholder="123" />
              </div>
            </div>

            <div className="mt-6 rounded-2xl bg-ink-soft border border-line p-5 flex items-center justify-between text-sm">
              <span className="text-paper/60">
                {qty} × {tier.name}
              </span>
              <span className="font-display font-bold">${total.toLocaleString()}</span>
            </div>

            <button
              onClick={next}
              disabled={submitting}
              className="mt-8 flex w-full items-center justify-center gap-2 rounded-full bg-signal py-3 text-xs font-semibold text-ink transition-colors hover:bg-signal-dim disabled:opacity-70 md:py-3.5 md:text-sm"
            >
              {submitting ? (
                <>
                  <Loader2 className="h-4 w-4 animate-spin" /> Processing
                </>
              ) : (
                `Pay $${total.toLocaleString()}`
              )}
            </button>
            <p className="mt-4 text-xs text-paper/30 text-center font-mono">
              Demo checkout — no real payment is processed.
            </p>
          </div>
        )}

        {step === "success" && (
          <div className="text-center py-10">
            <div className="mx-auto h-16 w-16 rounded-full bg-signal flex items-center justify-center mb-8">
              <Check className="h-8 w-8 text-ink" strokeWidth={3} />
            </div>
            <h1 className="font-display text-3xl font-bold tracking-tight">
              You&apos;re in, {name.split(" ")[0] || "friend"}
            </h1>
            <p className="mt-4 text-paper/60 max-w-sm mx-auto">
              A confirmation for {qty} × {tier.name} is on its way to {email || "your inbox"}.
              See you in Austin on March 12, 2027.
            </p>
            <Link
              href="/"
              className="mt-10 inline-block rounded-full border border-line px-5 py-2.5 text-xs font-semibold transition-colors hover:border-signal/50 md:px-6 md:py-3 md:text-sm"
            >
              Back to homepage
            </Link>
          </div>
        )}
      </div>
    </div>
  );
}

function Field({
  label,
  value,
  onChange,
  placeholder,
  type = "text",
  icon,
}: {
  label: string;
  value: string;
  onChange: (v: string) => void;
  placeholder?: string;
  type?: string;
  icon?: React.ReactNode;
}) {
  return (
    <label className="block">
      <span className="text-xs font-mono uppercase tracking-wide text-paper/40">
        {label}
      </span>
      <div className="mt-1.5 relative">
        {icon && (
          <span className="absolute left-3.5 top-1/2 -translate-y-1/2 text-paper/30">
            {icon}
          </span>
        )}
        <input
          type={type}
          value={value}
          onChange={(e) => onChange(e.target.value)}
          placeholder={placeholder}
          className={`w-full rounded-xl bg-ink-soft border border-line px-3.5 py-3 text-sm placeholder:text-paper/25 focus:outline-none focus:border-signal/50 ${
            icon ? "pl-10" : ""
          }`}
        />
      </div>
    </label>
  );
}
