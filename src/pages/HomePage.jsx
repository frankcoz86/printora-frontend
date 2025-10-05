import React, { lazy } from 'react';
import { Helmet } from 'react-helmet-async';
import Hero from '@/components/Hero';
const Features = lazy(() => import('@/components/Features'));
const ProductList = lazy(() => import('@/components/ProductList'));
const WhyChooseUs = lazy(() => import('@/components/WhyChooseUs'));
const Testimonials = lazy(() => import('@/components/Testimonials'));
const CallToActionSection = lazy(() => import('@/components/CallToActionSection'));
const Faq = lazy(() => import('@/components/Faq'));

const HomePage = () => {
  return (
    <>
      <Helmet>
        <title>Stampa Digitale Online | Tipografia N.1 in Italia | Printora</title>
        <meta name="description" content="Stampa digitale online di alta qualità a prezzi imbattibili. Banner, rollup, supporti rigidi e molto altro. Preventivi immediati e consegna rapida. La tua tipografia online di fiducia." />
        <meta name="keywords" content="stampa digitale, tipografia online, stampa banner, rollup, supporti rigidi, preventivi stampa, stampa online" />
        <meta property="og:title" content="Stampa Digitale Online | Tipografia N.1 in Italia | Printora" />
        <meta property="og:description" content="Stampa digitale online di alta qualità a prezzi imbattibili. Banner, rollup, supporti rigidi e molto altro. Preventivi immediati e consegna rapida." />
        <meta property="og:type" content="website" />
        <meta property="og:url" content="https://www.printora.it" />
      </Helmet>
      <div className="space-y-16 md:space-y-24">
        <Hero />
        <Features />
        <ProductList />
        <WhyChooseUs />
        <Testimonials />
        <Faq />
        <CallToActionSection />
      </div>
    </>
  );
};

export default HomePage;