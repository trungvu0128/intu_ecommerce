import Navbar from "@/components/layout/Navbar";
import Footer from "@/components/layout/Footer";
import CheckoutForm from "@/components/checkout/CheckoutForm";
import PaymentMethods from "@/components/checkout/PaymentMethods";
import OrderSummary from "@/components/checkout/OrderSummary";
import logoBlack from "@/assets/LOGO_black.png";

const Checkout = () => {
  return (
    <div className="min-h-screen bg-white flex flex-col">
      <Navbar />

      <main className="flex-1 w-full pt-32 pb-20 px-6 md:px-10 lg:px-16">
        <div className="max-w-[960px] mx-auto w-full">

          {/* Content columns */}
          <div className="grid grid-cols-1 lg:grid-cols-[55%_45%] gap-8 lg:gap-12 items-start">
            {/* Left Column: Delivery & Payment */}
            <div className="flex flex-col gap-6">
              <div className="flex items-center justify-between">
                <span className="text-[11px] tracking-[0.08em] font-bold text-black">
                  Delivery information
                </span>
                <img src={logoBlack} alt="INTU" className="h-4 opacity-40" />
              </div>
              <CheckoutForm />
              <PaymentMethods />
            </div>

            {/* Right Column: Order Summary — sticky */}
            <div className="flex flex-col gap-6 lg:top-20">
              <span className="text-[11px] tracking-[0.08em] font-bold text-black">
                Order information
              </span>
              <OrderSummary />
            </div>
          </div>

        </div>
      </main>

      <Footer />
    </div>
  );
};

export default Checkout;

