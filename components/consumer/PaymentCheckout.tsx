"use client";

import { useEffect, useRef } from "react";

interface PaymentCheckoutProps {
  checkoutFormContent: string; // HTML snippet returned by iyzico
  onCancel: () => void;
}

export default function PaymentCheckout({ checkoutFormContent, onCancel }: PaymentCheckoutProps) {
  const containerRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    const container = containerRef.current;
    if (!container || !checkoutFormContent) return;

    container.innerHTML = checkoutFormContent;

    // iyzico returns an HTML snippet containing a <script> tag.
    // innerHTML does NOT execute scripts, so we re-create and append them manually.
    const scripts = container.querySelectorAll("script");
    scripts.forEach((original) => {
      const clone = document.createElement("script");
      if (original.src) {
        clone.src = original.src;
        clone.async = true;
      } else {
        clone.textContent = original.textContent;
      }
      document.body.appendChild(clone);
    });
  }, [checkoutFormContent]);

  return (
    <div className="fixed inset-0 z-50 flex flex-col bg-white overflow-y-auto">
      <div className="flex items-center justify-between px-4 py-3 border-b border-stone-100">
        <h2 className="text-base font-bold text-stone-900">Güvenli Ödeme</h2>
        <button
          onClick={onCancel}
          className="text-sm text-stone-500 hover:text-stone-700"
        >
          İptal
        </button>
      </div>

      <div className="flex-1 px-4 py-4">
        <div ref={containerRef} />
      </div>

      <p className="px-4 pb-6 text-center text-xs text-stone-400">
        Ödemeniz iyzico güvencesiyle işlenmektedir.
      </p>
    </div>
  );
}
