import { Suspense } from "react";
import CheckoutFlow from "@/components/CheckoutFlow";
import { createPageMetadata } from "@/lib/site";

export const metadata = createPageMetadata({
  title: "Checkout",
  description: "Complete your Tech Forge 2026 ticket registration.",
  path: "/checkout",
  noIndex: true,
});

export default function CheckoutPage() {
  return (
    <main className="min-h-screen flex flex-col">
      <Suspense fallback={null}>
        <CheckoutFlow />
      </Suspense>
    </main>
  );
}
