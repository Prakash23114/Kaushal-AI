import { useState } from 'react';
import { motion } from 'framer-motion';
import './LandingPage.scss';

import LandingNavbar from '../components/landing/LandingNavbar';
import HeroSection from '../components/landing/HeroSection';
import FeaturesSection from '../components/landing/FeaturesSection';
import HowItWorks from '../components/landing/HowItWorks';
import WhyKaushal from '../components/landing/WhyKaushal';
import FaqSection from '../components/landing/FaqSection';
import FinalCTA from '../components/landing/FinalCTA';
import Footer from '../components/landing/Footer';
import DemoModal from '../components/landing/DemoModal';

export const LandingPage = () => {
  const [demoModalOpen, setDemoModalOpen] = useState(false);

  const fadeInVariants = {
    hidden: { opacity: 0, y: 18 },
    visible: {
      opacity: 1,
      y: 0,
      transition: { duration: 0.45, ease: [0.16, 1, 0.3, 1] },
    },
  };

  return (
    <div className="kaushal-landing">
      {/* 1. Sticky Navigation */}
      <LandingNavbar onOpenDemo={() => setDemoModalOpen(true)} />

      {/* 2. Hero Section */}
      <motion.div initial="hidden" animate="visible" variants={fadeInVariants}>
        <HeroSection onOpenDemo={() => setDemoModalOpen(true)} />
      </motion.div>

      {/* 3. Features Section ("What You Can Do" - 7 cards strip) */}
      <motion.div
        initial="hidden"
        whileInView="visible"
        viewport={{ once: true, margin: '-50px' }}
        variants={fadeInVariants}
      >
        <FeaturesSection />
      </motion.div>

      {/* 4. How It Works (01 -> 02 -> 03) */}
      <motion.div
        initial="hidden"
        whileInView="visible"
        viewport={{ once: true, margin: '-50px' }}
        variants={fadeInVariants}
      >
        <HowItWorks />
      </motion.div>

      {/* 5. Why Kaushal (100% Technical Engineering & CS focus) */}
      <motion.div
        initial="hidden"
        whileInView="visible"
        viewport={{ once: true, margin: '-50px' }}
        variants={fadeInVariants}
      >
        <WhyKaushal />
      </motion.div>

      {/* 6. Technical Interview FAQs */}
      <motion.div
        initial="hidden"
        whileInView="visible"
        viewport={{ once: true, margin: '-50px' }}
        variants={fadeInVariants}
      >
        <FaqSection />
      </motion.div>

      {/* 7. Bottom CTA Banner */}
      <motion.div
        initial="hidden"
        whileInView="visible"
        viewport={{ once: true, margin: '-50px' }}
        variants={fadeInVariants}
      >
        <FinalCTA />
      </motion.div>

      {/* 8. Clean Human Footer */}
      <Footer />

      {/* 9. Interactive Demo Modal */}
      <DemoModal isOpen={demoModalOpen} onClose={() => setDemoModalOpen(false)} />
    </div>
  );
};

export default LandingPage;
