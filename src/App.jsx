import React, { Suspense, lazy } from 'react';
import { Routes, Route, Outlet, useLocation } from 'react-router-dom';
import { Elements } from '@stripe/react-stripe-js';
import { stripePromise } from '@/lib/stripeClient'; // Import your stripe promise
import { Toaster } from '@/components/ui/toaster';
import { AnimatePresence } from 'framer-motion';
import { useCart } from '@/context/CartContext';
import Header from '@/components/Header';
import Footer from '@/components/Footer';
import CartSidebar from '@/components/CartSidebar';
import Loader from '@/components/Loader';

const HomePage = lazy(() => import('@/pages/HomePage'));
const FloatingWhatsapp = lazy(() => import('@/components/FloatingWhatsapp'));
const DtfPage = lazy(() => import('@/pages/DtfPage'));
const ContactPage = lazy(() => import('@/pages/ContactPage'));
const CartPage = lazy(() => import('@/pages/CartPage'));
const NewShippingPage = lazy(() => import('@/pages/NewShippingPage'));
const PaymentSuccessPage = lazy(() => import('@/pages/PaymentSuccessPage'));
const PaymentCancelPage = lazy(() => import('@/pages/PaymentCancelPage'));
const DesignerPage = lazy(() => import('@/pages/DesignerPage'));
const DtfDesignerPage = lazy(() => import('@/pages/DtfDesignerPage'));
const PrivacyPolicyPage = lazy(() => import('@/pages/PrivacyPolicyPage'));
const TermsPage = lazy(() => import('@/pages/TermsPage'));
const BannerPage = lazy(() => import('@/pages/BannerPage'));
const BannerPageLocal = lazy(() => import('@/pages/BannerPageLocal'));
const BannerDev1Page = lazy(() => import('@/pages/BannerDev1Page'));
const BannerDev2Page = lazy(() => import('@/pages/BannerDev2Page'));
const BannerDev3Page = lazy(() => import('@/pages/BannerDev3Page'));
const RollupPage = lazy(() => import('@/pages/RollupPage'));
const RollupDev1Page = lazy(() => import('@/pages/RollupDev1Page'));
const RollupDev2Page = lazy(() => import('@/pages/RollupDev2Page'));
const RollupDev3Page = lazy(() => import('@/pages/RollupDev3Page'));
const RigidMediaPageV3 = lazy(() => import('@/pages/RigidMediaPageV3'));
const VinylPage = lazy(() => import('@/pages/VinylPage'));
const ForexPage = lazy(() => import('@/pages/ForexPage'));
const ReviewsGalleryPage = lazy(() => import('@/pages/ReviewsGalleryPage'));
const OrderConfirmationPage = lazy(() => import('@/pages/OrderConfirmationPage'));
const StripeRedirectPage = lazy(() => import('@/pages/StripeRedirectPage'));

const AppLayout = () => {
    const location = useLocation();
    const cartHook = useCart();
    const isDesignerPage = location.pathname.startsWith('/designer/');
    const noHeaderFooterRoutes = ['/checkout', '/payment-success', '/payment-cancel', '/conferma-ordine', '/stripe-redirect'];
    const hideHeaderFooter = noHeaderFooterRoutes.includes(location.pathname) || isDesignerPage;

    return (
        <div className="flex flex-col min-h-screen">
            {!hideHeaderFooter && <Header />}
            <main className="flex-grow">
                <Outlet context={{ cartHook }} />
            </main>
            {!hideHeaderFooter && <Footer />}
            <CartSidebar />
        </div>
    );
};

const DtfLayout = () => {
    const cartHook = useCart();
    return (
        <div className="flex flex-col min-h-screen">
            <Header />
            <main className="flex-grow">
                <Outlet context={{ cartHook }} />
            </main>
            <Footer />
            <CartSidebar />
        </div>
    );
}

const MainSite = () => {
    const location = useLocation();
    return (
        <AnimatePresence mode="wait">
            <Routes location={location} key={location.pathname}>
                <Route element={<AppLayout />}>
                    <Route index element={<HomePage />} />
                    <Route path="/banner" element={<BannerPage />} />
                    <Route path="/banner-dev" element={<BannerPageLocal />} />
                    <Route path="/banner-dev1" element={<BannerDev1Page />} />
                    <Route path="/banner-dev2" element={<BannerDev2Page />} />
                    <Route path="/banner-dev3" element={<BannerDev3Page />} />
                    <Route path="/rollup" element={<RollupPage />} />
                    <Route path="/rollup-dev1" element={<RollupDev1Page />} />
                    <Route path="/rollup-dev2" element={<RollupDev2Page />} />
                    <Route path="/rollup-dev3" element={<RollupDev3Page />} />
                    <Route path="/supporti-rigidi" element={<RigidMediaPageV3 />} />
                    <Route path="/vinile-adesivo" element={<VinylPage />} />
                    <Route path="/forex-pvc" element={<ForexPage />} />
                    <Route path="/dtf" element={<DtfPage />} />
                    <Route path="/contatti" element={<ContactPage />} />
                    <Route path="/recensioni-lavori" element={<ReviewsGalleryPage />} />
                    <Route path="/carrello" element={<CartPage />} />
                    <Route path="/checkout" element={<NewShippingPage />} />
                    <Route path="/stripe-redirect" element={<StripeRedirectPage />} />
                    <Route path="/payment-success" element={<PaymentSuccessPage />} />
                    <Route path="/payment-cancel" element={<PaymentCancelPage />} />
                    <Route path="/privacy-policy" element={<PrivacyPolicyPage />} />
                    <Route path="/termini-e-condizioni" element={<TermsPage />} />
                    <Route path="/conferma-ordine" element={<OrderConfirmationPage />} />
                </Route>
                <Route path="/designer/:productType" element={<DesignerPage />} />
                <Route path="/dtf-designer" element={<DtfDesignerPage />} />
            </Routes>
        </AnimatePresence>
    );
};

const DtfSite = () => {
    const location = useLocation();
    return (
        <AnimatePresence mode="wait">
            <Routes location={location} key={location.pathname}>
                 <Route element={<DtfLayout />}>
                    <Route index element={<DtfPage />} />
                </Route>
                <Route path="/dtf-designer" element={<DtfDesignerPage />} />
            </Routes>
        </AnimatePresence>
    );
};

function App() {
  const hostname = window.location.hostname;
  const isDtfSite = hostname === 'dtf.printora.it';

  return (
    <Elements stripe={stripePromise}>
      <div className="min-h-screen bg-slate-900 text-white font-sans">
        <Suspense fallback={<Loader />}>
          {isDtfSite ? <DtfSite /> : <MainSite />}
          <FloatingWhatsapp />
        </Suspense>
        <Toaster />
      </div>
    </Elements>
  );
}

export default App;