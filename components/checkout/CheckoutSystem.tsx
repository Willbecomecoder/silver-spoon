"use client";

import { useEffect, useMemo, useRef, useState } from "react";
import { motion, AnimatePresence } from "framer-motion";

import {
  formatCurrency,
  getPaymentMethodLabel,
  saveOrder,
  useCart,
  type CustomerDetails,
  type PaymentMethod,
  type SavedOrder,
} from "./cart-context";

const RESTAURANT_WHATSAPP_NUMBER = "918755597746";

const initialCustomerDetails: CustomerDetails = {
  fullName: "",
  mobileNumber: "",
  orderType: "delivery",
  address: "",
  notes: "",
};

type CheckoutStep = "summary" | "details" | "payment" | "success";

export default function CheckoutSystem() {
  const { items, itemCount, total, clearCart, setItemQuantity } = useCart();

  const [isOpen, setIsOpen] = useState(false);
  const [step, setStep] = useState<CheckoutStep>("summary");
  const [customer, setCustomer] = useState<CustomerDetails>(initialCustomerDetails);
  const [paymentMethod, setPaymentMethod] = useState<PaymentMethod>("upi");
  const [upiConfirmed, setUpiConfirmed] = useState(false);
  const [placedOrder, setPlacedOrder] = useState<SavedOrder | null>(null);
  const [errors, setErrors] = useState<Record<string, string>>({});
  const scrollContainerRef = useRef<HTMLDivElement | null>(null);

  useEffect(() => {
    if (!isOpen) {
      return;
    }

    const bodyOverflow = document.body.style.overflow;
    const bodyOverscrollBehavior = document.body.style.overscrollBehavior;
    const htmlOverflow = document.documentElement.style.overflow;
    const htmlOverscrollBehavior = document.documentElement.style.overscrollBehavior;

    document.body.style.overflow = "hidden";
    document.body.style.overscrollBehavior = "none";
    document.documentElement.style.overflow = "hidden";
    document.documentElement.style.overscrollBehavior = "none";

    return () => {
      document.body.style.overflow = bodyOverflow;
      document.body.style.overscrollBehavior = bodyOverscrollBehavior;
      document.documentElement.style.overflow = htmlOverflow;
      document.documentElement.style.overscrollBehavior = htmlOverscrollBehavior;
    };
  }, [isOpen]);

  useEffect(() => {
    if (!isOpen) {
      return;
    }

    const scrollContainer = scrollContainerRef.current;
    if (!scrollContainer) {
      return;
    }

    const scrollFocusedFieldIntoView = () => {
      const activeElement = document.activeElement;
      if (!(activeElement instanceof HTMLElement) || !scrollContainer.contains(activeElement)) {
        return;
      }

      requestAnimationFrame(() => {
        activeElement.scrollIntoView({ block: "nearest", inline: "nearest", behavior: "smooth" });
      });
    };

    const handleFocusIn = (event: FocusEvent) => {
      if (event.target instanceof HTMLElement) {
        window.setTimeout(scrollFocusedFieldIntoView, 120);
      }
    };

    scrollContainer.addEventListener("focusin", handleFocusIn);

    const viewport = window.visualViewport;
    viewport?.addEventListener("resize", scrollFocusedFieldIntoView);

    return () => {
      scrollContainer.removeEventListener("focusin", handleFocusIn);
      viewport?.removeEventListener("resize", scrollFocusedFieldIntoView);
    };
  }, [isOpen, step]);

  useEffect(() => {
    if (itemCount === 0 && step !== "success") {
      setStep("summary");
    }
  }, [itemCount, step]);

  const canProceedToPayment = useMemo(() => {
    const nextErrors: Record<string, string> = {};

    if (!customer.fullName.trim()) {
      nextErrors.fullName = "Full name is required.";
    }

    if (!customer.mobileNumber.trim()) {
      nextErrors.mobileNumber = "Mobile number is required.";
    } else if (!/^\d{10}$/.test(customer.mobileNumber.trim())) {
      nextErrors.mobileNumber = "Enter a valid 10-digit mobile number.";
    }

    if (customer.orderType === "delivery" && !customer.address.trim()) {
      nextErrors.address = "Address is required for delivery.";
    }

    return nextErrors;
  }, [customer]);

  const handleClose = () => {
    setIsOpen(false);

    if (step === "success") {
      setStep("summary");
      setPlacedOrder(null);
      setPaymentMethod("upi");
      setUpiConfirmed(false);
      setCustomer(initialCustomerDetails);
      setErrors({});
    }
  };

  const handleDetailsContinue = () => {
    setErrors(canProceedToPayment);

    if (Object.keys(canProceedToPayment).length === 0) {
      setStep("payment");
    }
  };

  const handlePlaceOrder = () => {
    if (paymentMethod === "upi" && !upiConfirmed) {
      setErrors({ upiConfirmed: "Please confirm your payment to continue." });
      return;
    }

    const orderId = generateOrderId();
    const order: SavedOrder = {
      id: orderId,
      status: "Pending",
      paymentMethod,
      items,
      customer,
      total,
      createdAt: new Date().toISOString(),
    };

    saveOrder(order);
    setPlacedOrder(order);
    setStep("success");
    clearCart();
  };

  if (itemCount === 0 && !isOpen && step !== "success") {
    return null;
  }

  return (
    <>
      {itemCount > 0 ? (
        <button
          type="button"
          onClick={() => setIsOpen(true)}
          className="fixed bottom-4 left-3 right-3 z-40 inline-flex h-12 items-center justify-between gap-2 rounded-full border border-[#D4AF37]/50 bg-[#0F0F0F]/95 px-4 text-sm font-semibold text-[#F5F1E8] shadow-[0_12px_30px_rgba(0,0,0,0.35)] backdrop-blur-md transition-colors hover:border-[#D4AF37] sm:bottom-6 sm:left-auto sm:right-6 sm:h-auto sm:max-w-none sm:justify-start sm:gap-3 sm:px-5 sm:py-3"
        >
          <span className="shrink-0 text-[#D4AF37]">{itemCount} Items</span>
          <span className="truncate">Checkout</span>
          <span className="shrink-0 text-[#D4AF37]">{formatCurrency(total)}</span>
        </button>
      ) : null}

      <AnimatePresence>
        {isOpen ? (
          <>
            <motion.button
              type="button"
              aria-label="Close checkout"
              onClick={handleClose}
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              exit={{ opacity: 0 }}
              className="fixed inset-0 z-40 bg-black/60 backdrop-blur-sm"
            />

            <motion.aside
              initial={{ x: "100%" }}
              animate={{ x: 0 }}
              exit={{ x: "100%" }}
              transition={{ duration: 0.3, ease: "easeOut" }}
              className="fixed right-0 top-0 z-50 flex h-[100dvh] w-full max-w-none min-w-0 flex-col overflow-hidden rounded-none border border-[#D4AF37]/20 bg-[#0F0F0F] shadow-2xl sm:max-w-[480px] sm:border-l sm:border-r-0 sm:border-t-0 sm:border-b-0 lg:max-w-2xl"
            >
              <div className="flex items-center justify-between border-b border-[#D4AF37]/20 px-4 py-4 pt-[calc(1rem+env(safe-area-inset-top,0px))] sm:px-6 sm:pt-4">
                <div className="min-w-0 pr-3">
                  <h2 className="break-words font-serif text-[28px] font-bold leading-none text-white sm:text-2xl">Checkout</h2>
                  <p className="mt-2 break-words text-base text-white/50 sm:text-sm">{getStepLabel(step)}</p>
                </div>
                <button
                  type="button"
                  onClick={handleClose}
                  aria-label="Close checkout panel"
                  className="flex h-12 w-12 items-center justify-center rounded-full border border-[#D4AF37]/40 text-[#D4AF37] transition-colors hover:border-[#D4AF37] sm:h-10 sm:w-10"
                >
                  <CloseIcon />
                </button>
              </div>

              <div
                ref={scrollContainerRef}
                className="flex-1 min-h-0 overflow-x-hidden overflow-y-auto px-4 py-4 pb-32 sm:px-6 sm:py-5 sm:pb-36"
                style={{
                  WebkitOverflowScrolling: "touch",
                  overscrollBehavior: "contain",
                  scrollBehavior: "smooth",
                  paddingBottom: "calc(9rem + env(safe-area-inset-bottom, 0px))",
                }}
              >
                {step === "summary" ? (
                  <SummaryStep
                    items={items}
                    total={total}
                    onUpdateQuantity={setItemQuantity}
                    onContinue={() => setStep("details")}
                    onBrowseMenu={() => {
                      handleClose();
                      document.getElementById("menu")?.scrollIntoView({ behavior: "smooth", block: "start" });
                    }}
                  />
                ) : null}

                {step === "details" ? (
                  <DetailsStep
                    customer={customer}
                    errors={errors}
                    onBack={() => setStep("summary")}
                    onChange={setCustomer}
                    onContinue={handleDetailsContinue}
                  />
                ) : null}

                {step === "payment" ? (
                  <PaymentStep
                    customer={customer}
                    items={items}
                    total={total}
                    onUpdateQuantity={setItemQuantity}
                    paymentMethod={paymentMethod}
                    upiConfirmed={upiConfirmed}
                    errors={errors}
                    onBack={() => setStep("details")}
                    onSelectPayment={(value) => {
                      setPaymentMethod(value);
                      setErrors({});
                    }}
                    onUpiConfirm={(value) => {
                      setUpiConfirmed(value);
                      setErrors((current) => {
                        const next = { ...current };
                        delete next.upiConfirmed;
                        return next;
                      });
                    }}
                    onPlaceOrder={handlePlaceOrder}
                  />
                ) : null}

                {step === "success" && placedOrder ? (
                  <SuccessStep order={placedOrder} onClose={handleClose} />
                ) : null}
              </div>
            </motion.aside>
          </>
        ) : null}
      </AnimatePresence>
    </>
  );
}

function SummaryStep({
  items,
  total,
  onUpdateQuantity,
  onContinue,
  onBrowseMenu,
}: {
  items: ReturnType<typeof useCart>["items"];
  total: number;
  onUpdateQuantity: ReturnType<typeof useCart>["setItemQuantity"];
  onContinue: () => void;
  onBrowseMenu: () => void;
}) {
  if (items.length === 0) {
    return <EmptyCartState onBrowseMenu={onBrowseMenu} />;
  }

  return (
    <div className="flex min-h-full flex-col gap-5">
      <div
        className="flex-1 min-h-0 overflow-x-hidden overflow-y-auto sm:overflow-visible"
        style={{
          WebkitOverflowScrolling: "touch",
          overscrollBehavior: "contain",
          scrollBehavior: "smooth",
          paddingBottom: "8px",
        }}
      >
        <OrderSummary items={items} total={total} onUpdateQuantity={onUpdateQuantity} showTotalsOnMobile={false} />
        <div className="mt-4 sm:hidden">
          <OrderSummaryTotals total={total} />
        </div>
      </div>

      <div className="mt-4 pb-[calc(1rem+env(safe-area-inset-bottom,0px))] sm:sticky sm:bottom-0 sm:z-10 sm:-mx-4 sm:mt-auto sm:border-t sm:border-[#D4AF37]/10 sm:bg-[#0F0F0F]/95 sm:px-4 sm:py-4 sm:backdrop-blur-md">
        <button
          type="button"
          onClick={onContinue}
          className="inline-flex h-12 w-full items-center justify-center rounded-full border border-[#D4AF37]/50 bg-[#D4AF37]/10 px-6 text-sm font-medium whitespace-nowrap text-[#F5F1E8] transition-colors hover:border-[#D4AF37] hover:bg-[#D4AF37]/15 sm:h-11 sm:w-auto"
        >
          Continue to Customer Details
        </button>
      </div>
    </div>
  );
}

function DetailsStep({
  customer,
  errors,
  onBack,
  onChange,
  onContinue,
}: {
  customer: CustomerDetails;
  errors: Record<string, string>;
  onBack: () => void;
  onChange: (value: CustomerDetails) => void;
  onContinue: () => void;
}) {
  return (
    <div className="flex min-h-full flex-col gap-5">
      <div className="rounded-2xl border border-[#D4AF37]/20 bg-white/5 p-4 sm:p-6">
        <h3 className="font-serif text-2xl font-bold text-[#D4AF37]">Customer Details</h3>

        <div className="mt-5 grid gap-4">
          <Field
            label="Full Name *"
            value={customer.fullName}
            onChange={(value) => onChange({ ...customer, fullName: value })}
            error={errors.fullName}
            placeholder="Enter your full name"
          />

          <Field
            label="Mobile Number *"
            value={customer.mobileNumber}
            onChange={(value) => onChange({ ...customer, mobileNumber: value })}
            error={errors.mobileNumber}
            placeholder="Enter 10-digit mobile number"
            inputMode="numeric"
          />

          <div>
            <p className="text-sm font-medium text-[#F5F1E8]">Delivery / Pickup</p>
            <div className="mt-3 grid grid-cols-2 gap-3 sm:flex sm:flex-wrap">
              <ChoiceButton
                label="Delivery"
                isActive={customer.orderType === "delivery"}
                onClick={() => onChange({ ...customer, orderType: "delivery" })}
              />
              <ChoiceButton
                label="Pickup"
                isActive={customer.orderType === "pickup"}
                onClick={() => onChange({ ...customer, orderType: "pickup", address: "" })}
              />
            </div>
          </div>

          {customer.orderType === "delivery" ? (
            <Field
              label="Address *"
              value={customer.address}
              onChange={(value) => onChange({ ...customer, address: value })}
              error={errors.address}
              placeholder="Enter delivery address"
              isTextarea
            />
          ) : null}

          <Field
            label="Order Notes"
            value={customer.notes}
            onChange={(value) => onChange({ ...customer, notes: value })}
            placeholder="Any extra instructions"
            isTextarea
          />
        </div>
      </div>

      <div className="sticky bottom-0 z-10 -mx-4 mt-auto flex flex-col gap-3 border-t border-[#D4AF37]/10 bg-[#0F0F0F]/95 px-4 py-4 pb-[calc(1rem+env(safe-area-inset-bottom,0px))] backdrop-blur-md sm:static sm:mx-0 sm:flex-row sm:flex-wrap sm:border-0 sm:bg-transparent sm:px-0 sm:py-0">
        <SecondaryButton onClick={onBack}>Back</SecondaryButton>
        <PrimaryButton onClick={onContinue}>Continue to Payment</PrimaryButton>
      </div>
    </div>
  );
}

function PaymentStep({
  customer,
  items,
  total,
  onUpdateQuantity,
  paymentMethod,
  upiConfirmed,
  errors,
  onBack,
  onSelectPayment,
  onUpiConfirm,
  onPlaceOrder,
}: {
  customer: CustomerDetails;
  items: ReturnType<typeof useCart>["items"];
  total: number;
  onUpdateQuantity: ReturnType<typeof useCart>["setItemQuantity"];
  paymentMethod: PaymentMethod;
  upiConfirmed: boolean;
  errors: Record<string, string>;
  onBack: () => void;
  onSelectPayment: (value: PaymentMethod) => void;
  onUpiConfirm: (value: boolean) => void;
  onPlaceOrder: () => void;
}) {
  const whatsappUrl = buildWhatsAppUrl({
    items,
    customer,
    total,
    paymentMethod,
  });

  return (
    <div className="flex min-h-full flex-col gap-5">
      <div className="rounded-2xl border border-[#D4AF37]/20 bg-white/5 p-4 sm:p-6">
        <h3 className="font-serif text-2xl font-bold text-[#D4AF37]">Payment Method</h3>

        <div className="mt-5 space-y-3">
          <PaymentOption
            label="QR Code Payment (UPI)"
            checked={paymentMethod === "upi"}
            onChange={() => onSelectPayment("upi")}
          />
          <PaymentOption
            label="Cash on Delivery"
            checked={paymentMethod === "cod"}
            onChange={() => onSelectPayment("cod")}
          />
          <PaymentOption
            label="Pay at Restaurant"
            checked={paymentMethod === "restaurant"}
            onChange={() => onSelectPayment("restaurant")}
          />
        </div>

        <div className="mt-5 rounded-2xl border border-[#D4AF37]/15 bg-black/20 p-3 sm:p-4">
          {paymentMethod === "upi" ? (
            <div className="rounded-2xl border border-[#D4AF37]/20 bg-white/5 p-4 sm:p-5">
              <div className="text-center">
                <h4 className="font-serif text-[28px] font-bold leading-tight text-[#F5F1E8] sm:text-xl">Scan QR Code to Pay</h4>
                <p className="mx-auto mt-3 max-w-md text-sm leading-6 text-white/60 sm:text-sm">
                  After completing the payment, share your payment screenshot on WhatsApp to verify
                  your order.
                </p>
              </div>

              <div className="mt-5 flex justify-center rounded-2xl border border-[#D4AF37]/20 bg-white p-3 sm:p-4">
                <UpiQrPreview />
              </div>

              <div className="mt-5 space-y-4">
                <a
                  href={whatsappUrl}
                  target="_blank"
                  rel="noopener noreferrer"
                  onClick={() => onUpiConfirm(true)}
                  className="inline-flex h-12 w-full items-center justify-center rounded-full border border-[#D4AF37]/50 bg-[#D4AF37]/10 px-4 text-sm font-medium whitespace-nowrap text-[#F5F1E8] transition-colors hover:border-[#D4AF37] hover:bg-[#D4AF37]/15 sm:h-11 sm:px-5"
                >
                  {"\u{1F4AC}"} Share Payment on WhatsApp
                </a>
              </div>

              {errors.upiConfirmed ? (
                <p className="mt-3 text-center text-sm text-[#D4AF37]">{errors.upiConfirmed}</p>
              ) : null}
            </div>
          ) : null}

          {paymentMethod === "cod" ? (
            <p className="text-sm text-white/70">Payment will be collected during delivery.</p>
          ) : null}

          {paymentMethod === "restaurant" ? (
            <p className="text-sm text-white/70">Please pay when you arrive at the restaurant.</p>
          ) : null}
        </div>
      </div>

      <OrderSummary
        items={items}
        total={total}
        orderType={customer.orderType}
        onUpdateQuantity={onUpdateQuantity}
      />

      <div className="rounded-2xl border border-[#D4AF37]/20 bg-white/5 p-4 sm:p-5">
        <h4 className="text-base font-semibold text-[#F5F1E8]">Delivery Details</h4>
        <div className="mt-4 grid gap-2 break-words text-sm text-white/60">
          <p>
            <span className="text-[#F5F1E8]">Name:</span> {customer.fullName}
          </p>
          <p>
            <span className="text-[#F5F1E8]">Phone:</span> {customer.mobileNumber}
          </p>
          <p>
            <span className="text-[#F5F1E8]">Order Type:</span>{" "}
            {customer.orderType === "delivery" ? "Delivery" : "Pickup"}
          </p>
          {customer.orderType === "delivery" ? (
            <p>
              <span className="text-[#F5F1E8]">Address:</span> {customer.address}
            </p>
          ) : null}
          {customer.notes ? (
            <p>
              <span className="text-[#F5F1E8]">Notes:</span> {customer.notes}
            </p>
          ) : null}
        </div>
      </div>

      <div className="sticky bottom-0 z-10 -mx-4 mt-auto flex flex-col gap-3 border-t border-[#D4AF37]/10 bg-[#0F0F0F]/95 px-4 py-4 pb-[calc(1rem+env(safe-area-inset-bottom,0px))] backdrop-blur-md sm:static sm:mx-0 sm:flex-row sm:flex-wrap sm:border-0 sm:bg-transparent sm:px-0 sm:py-0">
        <SecondaryButton onClick={onBack}>Back</SecondaryButton>
        <PrimaryButton onClick={onPlaceOrder}>Place Order</PrimaryButton>
      </div>
    </div>
  );
}

function SuccessStep({ order, onClose }: { order: SavedOrder; onClose: () => void }) {
  return (
    <div className="rounded-2xl border border-[#D4AF37]/20 bg-white/5 p-4 text-center sm:p-8">
      <h3 className="break-words font-serif text-[28px] font-bold text-white sm:text-3xl">Order Placed Successfully</h3>
      <div className="mx-auto mt-4 h-px w-28 bg-gradient-to-r from-transparent via-[#D4AF37] to-transparent" />

      <div className="mt-8 grid gap-3 break-words text-left text-sm text-white/60">
        <p>
          <span className="text-[#F5F1E8]">Order ID:</span> {order.id}
        </p>
        <p>
          <span className="text-[#F5F1E8]">Payment Method:</span>{" "}
          {getPaymentMethodLabel(order.paymentMethod)}
        </p>
        <p>
          <span className="text-[#F5F1E8]">Order Status:</span> {order.status}
        </p>
        <p>
          <span className="text-[#F5F1E8]">Total Amount:</span> {formatCurrency(order.total)}
        </p>
      </div>

      <p className="mt-6 text-sm text-white/50">
        Your order has been confirmed successfully.
      </p>

      <div className="mt-8 flex justify-center">
        <PrimaryButton onClick={onClose}>Close</PrimaryButton>
      </div>
    </div>
  );
}

function OrderSummary({
  items,
  total,
  onUpdateQuantity,
  orderType,
  showTotalsOnMobile = true,
}: {
  items: ReturnType<typeof useCart>["items"];
  total: number;
  onUpdateQuantity: ReturnType<typeof useCart>["setItemQuantity"];
  orderType?: CustomerDetails["orderType"];
  showTotalsOnMobile?: boolean;
}) {
  return (
    <div className="rounded-2xl border border-[#D4AF37]/20 bg-white/5 p-4 sm:p-6">
      <h3 className="font-serif text-2xl font-bold text-[#D4AF37]">Order Summary</h3>

      <div className="mt-5 divide-y divide-[#D4AF37]/10">
        {items.map((item) => (
          <div
            key={item.id}
            className="grid gap-3 py-4 text-sm sm:grid-cols-[minmax(0,1fr)_auto_auto_auto_auto] sm:items-center sm:gap-4"
          >
            <div className="min-w-0">
              <p className="font-semibold text-[#F5F1E8]">{item.name}</p>
              {item.description ? <p className="mt-1 text-white/50 line-clamp-2">{item.description}</p> : null}
            </div>
            <div className="flex min-w-0 flex-wrap items-center justify-between gap-3 sm:contents">
              <p className="min-w-0 text-[#D4AF37] sm:text-right">{formatCurrency(item.price)}</p>
              <CartItemQuantityControl
                item={item}
                onUpdateQuantity={onUpdateQuantity}
              />
              <p className="min-w-0 text-right text-[#D4AF37] sm:text-right">{formatCurrency(item.subtotal)}</p>
              <button
                type="button"
                onClick={() => onUpdateQuantity(item, 0)}
                aria-label={`Remove ${item.name} from cart`}
                className="inline-flex h-11 w-11 items-center justify-center justify-self-end rounded-full border border-[#D4AF37]/30 text-lg text-white/70 transition-colors hover:border-[#D4AF37]/50 hover:text-[#F5F1E8]"
              >
                {"\u00D7"}
              </button>
            </div>
          </div>
        ))}
      </div>

      {showTotalsOnMobile ? (
        <div className="mt-5 border-t border-[#D4AF37]/10 pt-4">
          <OrderSummaryTotals total={total} orderType={orderType} />
        </div>
      ) : (
        <div className="mt-5 hidden border-t border-[#D4AF37]/10 pt-4 sm:block">
          <OrderSummaryTotals total={total} orderType={orderType} />
        </div>
      )}
    </div>
  );
}

function OrderSummaryTotals({
  total,
  orderType,
}: {
  total: number;
  orderType?: CustomerDetails["orderType"];
}) {
  const deliveryCharge = orderType === "delivery" ? 0 : 0;
  const grandTotal = total + deliveryCharge;

  return (
    <div className="space-y-3 text-sm">
      <div className="flex items-center justify-between gap-4">
        <span className="text-white/60">Subtotal</span>
        <span className="text-[#D4AF37]">{formatCurrency(total)}</span>
      </div>
      {orderType === "delivery" ? (
        <div className="flex items-center justify-between gap-4">
          <span className="text-white/60">Delivery Charge</span>
          <span className="text-[#D4AF37]">{formatCurrency(deliveryCharge)}</span>
        </div>
      ) : null}
      <div className="flex items-center justify-between gap-4 text-base font-semibold">
        <span className="text-[#F5F1E8]">Grand Total</span>
        <span className="text-[#D4AF37]">{formatCurrency(grandTotal)}</span>
      </div>
    </div>
  );
}

function CartItemQuantityControl({
  item,
  onUpdateQuantity,
}: {
  item: ReturnType<typeof useCart>["items"][number];
  onUpdateQuantity: ReturnType<typeof useCart>["setItemQuantity"];
}) {
  return (
    <div className="inline-flex shrink-0 items-center rounded-full border border-[#D4AF37]/40 bg-[#D4AF37]/10">
      <button
        type="button"
        onClick={() => onUpdateQuantity(item, item.quantity - 1)}
        aria-label={`Decrease quantity of ${item.name}`}
        className="flex h-10 w-10 items-center justify-center text-lg font-semibold text-[#F5F1E8] transition-colors hover:text-[#D4AF37] sm:h-11 sm:w-11"
      >
        -
      </button>
      <span className="w-8 text-center text-sm font-semibold text-[#F5F1E8]">{item.quantity}</span>
      <button
        type="button"
        onClick={() => onUpdateQuantity(item, item.quantity + 1)}
        aria-label={`Increase quantity of ${item.name}`}
        className="flex h-10 w-10 items-center justify-center text-lg font-semibold text-[#F5F1E8] transition-colors hover:text-[#D4AF37] sm:h-11 sm:w-11"
      >
        +
      </button>
    </div>
  );
}

function EmptyCartState({ onBrowseMenu }: { onBrowseMenu: () => void }) {
  return (
    <div className="rounded-2xl border border-[#D4AF37]/20 bg-white/5 p-5 text-center sm:p-8">
      <h3 className="font-serif text-2xl font-bold text-white">Your cart is empty.</h3>
      <p className="mt-3 text-sm text-white/50">Add something delicious to continue your order.</p>
      <div className="mt-6 flex justify-center">
        <PrimaryButton onClick={onBrowseMenu}>Browse Menu</PrimaryButton>
      </div>
    </div>
  );
}

function Field({
  label,
  value,
  onChange,
  error,
  placeholder,
  inputMode,
  isTextarea = false,
}: {
  label: string;
  value: string;
  onChange: (value: string) => void;
  error?: string;
  placeholder: string;
  inputMode?: "text" | "numeric";
  isTextarea?: boolean;
}) {
  const className =
    "mt-2 w-full min-w-0 rounded-2xl border border-white/10 bg-white/5 px-4 py-3 text-sm text-white placeholder:text-white/30 focus:border-[#D4AF37] focus:outline-none";

  return (
    <label className="block">
      <span className="text-sm font-medium text-[#F5F1E8]">{label}</span>
      {isTextarea ? (
        <textarea
          value={value}
          onChange={(event) => onChange(event.target.value)}
          placeholder={placeholder}
          rows={4}
          className={`${className} min-h-28 resize-none`}
        />
      ) : (
        <input
          type="text"
          value={value}
          onChange={(event) => onChange(event.target.value)}
          placeholder={placeholder}
          inputMode={inputMode}
          className={className}
        />
      )}
      {error ? <span className="mt-2 block text-sm text-[#D4AF37]">{error}</span> : null}
    </label>
  );
}

function PaymentOption({
  label,
  checked,
  onChange,
}: {
  label: string;
  checked: boolean;
  onChange: () => void;
}) {
  return (
    <label className="flex min-h-12 cursor-pointer items-center gap-3 rounded-2xl border border-[#D4AF37]/20 px-4 py-3 text-sm text-white/70 transition-colors hover:border-[#D4AF37]/40">
      <input
        type="radio"
        name="payment-method"
        checked={checked}
        onChange={onChange}
        className="h-4 w-4 accent-[#D4AF37]"
      />
      <span className="min-w-0 break-words text-[#F5F1E8]">{label}</span>
    </label>
  );
}

function ChoiceButton({
  label,
  isActive,
  onClick,
}: {
  label: string;
  isActive: boolean;
  onClick: () => void;
}) {
  return (
    <button
      type="button"
      onClick={onClick}
      className={`inline-flex h-12 w-full items-center justify-center rounded-full border px-4 text-sm transition-colors sm:h-11 sm:min-w-[120px] sm:w-auto ${
        isActive
          ? "border-[#D4AF37] bg-[#D4AF37]/10 text-[#F5F1E8]"
          : "border-[#D4AF37]/30 bg-transparent text-white/70 hover:border-[#D4AF37]/50 hover:text-[#F5F1E8]"
      }`}
    >
      {label}
    </button>
  );
}

function PrimaryButton({
  children,
  onClick,
}: {
  children: string;
  onClick: () => void;
}) {
  return (
    <button
      type="button"
      onClick={onClick}
      className="inline-flex h-12 w-full items-center justify-center rounded-full border border-[#D4AF37]/50 bg-[#D4AF37]/10 px-6 text-sm font-medium whitespace-nowrap text-[#F5F1E8] transition-colors hover:border-[#D4AF37] hover:bg-[#D4AF37]/15 sm:h-11 sm:w-auto"
    >
      {children}
    </button>
  );
}

function SecondaryButton({
  children,
  onClick,
}: {
  children: string;
  onClick: () => void;
}) {
  return (
    <button
      type="button"
      onClick={onClick}
      className="inline-flex h-12 w-full items-center justify-center rounded-full border border-[#D4AF37]/30 px-6 text-sm font-medium whitespace-nowrap text-white/70 transition-colors hover:border-[#D4AF37]/50 hover:text-[#F5F1E8] sm:h-11 sm:w-auto"
    >
      {children}
    </button>
  );
}

function UpiQrPreview() {
  return (
    <svg
      width="220"
      height="220"
      viewBox="0 0 220 220"
      role="img"
      aria-label="UPI QR code"
      className="h-auto w-full max-w-[250px] sm:max-w-[220px]"
    >
      <rect width="220" height="220" rx="18" fill="#fff" />
      <rect x="18" y="18" width="52" height="52" fill="#000" />
      <rect x="28" y="28" width="32" height="32" fill="#fff" />
      <rect x="36" y="36" width="16" height="16" fill="#000" />
      <rect x="150" y="18" width="52" height="52" fill="#000" />
      <rect x="160" y="28" width="32" height="32" fill="#fff" />
      <rect x="168" y="36" width="16" height="16" fill="#000" />
      <rect x="18" y="150" width="52" height="52" fill="#000" />
      <rect x="28" y="160" width="32" height="32" fill="#fff" />
      <rect x="36" y="168" width="16" height="16" fill="#000" />
      <rect x="88" y="24" width="12" height="12" fill="#000" />
      <rect x="112" y="24" width="12" height="12" fill="#000" />
      <rect x="88" y="48" width="12" height="12" fill="#000" />
      <rect x="112" y="48" width="12" height="12" fill="#000" />
      <rect x="88" y="84" width="12" height="12" fill="#000" />
      <rect x="100" y="96" width="12" height="12" fill="#000" />
      <rect x="124" y="84" width="12" height="12" fill="#000" />
      <rect x="148" y="96" width="12" height="12" fill="#000" />
      <rect x="88" y="120" width="12" height="12" fill="#000" />
      <rect x="112" y="120" width="12" height="12" fill="#000" />
      <rect x="136" y="120" width="12" height="12" fill="#000" />
      <rect x="100" y="144" width="12" height="12" fill="#000" />
      <rect x="124" y="144" width="12" height="12" fill="#000" />
      <rect x="148" y="144" width="12" height="12" fill="#000" />
      <rect x="88" y="168" width="12" height="12" fill="#000" />
      <rect x="112" y="180" width="12" height="12" fill="#000" />
      <rect x="136" y="168" width="12" height="12" fill="#000" />
      <rect x="160" y="180" width="12" height="12" fill="#000" />
      <rect x="180" y="104" width="12" height="12" fill="#000" />
      <rect x="180" y="128" width="12" height="12" fill="#000" />
      <text
        x="110"
        y="210"
        textAnchor="middle"
        fontSize="10"
        fill="#111"
        style={{ fontFamily: "Arial, sans-serif" }}
      >
        Silver Spoon UPI
      </text>
    </svg>
  );
}

function CloseIcon() {
  return (
    <svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
      <path d="M18 6 6 18" />
      <path d="m6 6 12 12" />
    </svg>
  );
}

function generateOrderId() {
  const date = new Date();
  const stamp = `${date.getFullYear()}${String(date.getMonth() + 1).padStart(2, "0")}${String(
    date.getDate(),
  ).padStart(2, "0")}`;
  const random = Math.floor(1000 + Math.random() * 9000);
  return `SS-${stamp}-${random}`;
}

function getStepLabel(step: CheckoutStep) {
  if (step === "summary") {
    return "Review your order";
  }

  if (step === "details") {
    return "Enter customer details";
  }

  if (step === "payment") {
    return "Select payment method";
  }

  return "Order confirmation";
}

function buildWhatsAppUrl({
  items,
  customer,
  total,
  paymentMethod,
}: {
  items: ReturnType<typeof useCart>["items"];
  customer: CustomerDetails;
  total: number;
  paymentMethod: PaymentMethod;
}) {
  const paymentLabel =
    paymentMethod === "upi" ? "Online" : paymentMethod === "cod" ? "COD" : "Pay at Restaurant";

  const lines = [
    "\u{1F37D}\uFE0F NEW ORDER",
    "",
    `\u{1F464} Customer Name: ${customer.fullName}`,
    `\u{1F4DE} Phone: ${customer.mobileNumber}`,
    "",
    "\u{1F6D2} Order Items:",
    ...items.map((item) => `${item.name} \u00D7 ${item.quantity}`),
    "",
    `\u{1F4B0} Total Amount: ${formatCurrency(total)}`,
    `\u{1F4B3} Payment Method: ${paymentLabel}`,
    "",
    "\u{1F4CD} Delivery Address:",
    customer.orderType === "delivery" ? customer.address || "N/A" : "Pickup Order",
    "",
    "\u{1F4DD} Special Instructions:",
    customer.notes || "N/A",
    "",
    "I will attach the payment screenshot manually before sending this message.",
  ];

  const message = encodeURIComponent(lines.join("\n"));
  return `https://wa.me/${RESTAURANT_WHATSAPP_NUMBER}?text=${message}`;
}
