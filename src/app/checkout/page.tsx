import { Suspense } from "react";
import CheckoutFlow from "@/components/CheckoutFlow";

export default function CheckoutPage() {
  return (
    <main className="min-h-screen flex flex-col">
      <Suspense fallback={null}>
        <CheckoutFlow />
      </Suspense>
    </main>
  );
}
