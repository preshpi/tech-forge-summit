"use client";

import { useState } from "react";
import { Plus } from "lucide-react";

const faqs = [
  {
    q: "When and where is NOVA 2027?",
    a: "March 12, 2027, at a downtown venue in Austin, Texas. Doors open at 8:30am.",
  },
  {
    q: "What's included with my ticket?",
    a: "Full access to every keynote, workshop, and networking session, plus lunch, refreshments, and the closing after-party.",
  },
  {
    q: "Are talks recorded?",
    a: "Yes — every main-stage talk is recorded and shared with ticket holders within two weeks of the event.",
  },
  {
    q: "Can I get a refund?",
    a: "Tickets are fully refundable up to 30 days before the event. After that, they're transferable to another attendee.",
  },
  {
    q: "Is there a student or non-profit discount?",
    a: "We offer 40% off for students and registered non-profits. Email us with proof of status for a code.",
  },
  {
    q: "Will there be a virtual option?",
    a: "A live stream of the main stage is included with every ticket, so you can join remotely if you can't make it in person.",
  },
];

export default function FAQ() {
  const [open, setOpen] = useState<number | null>(0);

  return (
    <section id="faq" className="mx-auto max-w-4xl px-4 sm:px-6 py-24 md:py-32">
      <p className="font-mono text-xs uppercase tracking-widest text-signal mb-6 text-center">
        FAQs
      </p>
      <h2 className="font-display text-3xl sm:text-4xl md:text-5xl font-bold tracking-tight text-center">
        Frequently asked questions
      </h2>

      <div className="mt-14 divide-y divide-line border-t border-b border-line">
        {faqs.map((f, i) => {
          const isOpen = open === i;
          return (
            <div key={f.q}>
              <button
                onClick={() => setOpen(isOpen ? null : i)}
                className="w-full flex items-center justify-between gap-4 py-6 text-left"
              >
                <span className="font-display font-semibold text-base sm:text-lg">
                  {f.q}
                </span>
                <Plus
                  className={`h-5 w-5 shrink-0 text-signal transition-transform ${
                    isOpen ? "rotate-45" : ""
                  }`}
                />
              </button>
              <div
                className={`grid transition-all duration-300 ${
                  isOpen ? "grid-rows-[1fr] pb-6" : "grid-rows-[0fr]"
                }`}
                style={{ display: "grid" }}
              >
                <div className="overflow-hidden">
                  <p className="text-paper/60 leading-relaxed pr-8">{f.a}</p>
                </div>
              </div>
            </div>
          );
        })}
      </div>
    </section>
  );
}
