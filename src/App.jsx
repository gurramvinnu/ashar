import React, { useState } from 'react';
import Background3D from './components/Background3D';
import Navbar from './components/Navbar';
import HeroSection from './components/HeroSection';
import ProductsSection from './components/ProductsSection';
import RevolutionsSection from './components/RevolutionsSection';
import AboutSection from './components/AboutSection';
import ContactSection from './components/ContactSection';
import { Pill } from 'lucide-react';

export default function App() {
  // Global lifted state to share selected tablet products between catalog and the B2B distributor form
  const [sampleCart, setSampleCart] = useState([]);

  return (
    <>
      {/* Immersive Background 3D Canvas showing DNA and floating pills/capsules */}
      <Background3D />

      {/* Primary Page Content Overlay */}
      <div className="page-overlay">
        <Navbar />
        
        <main>
          <HeroSection />
          
          <ProductsSection 
            sampleCart={sampleCart} 
            setSampleCart={setSampleCart} 
          />

          <RevolutionsSection />
          
          <AboutSection />
          
          <ContactSection 
            sampleCart={sampleCart} 
            setSampleCart={setSampleCart} 
          />
        </main>

        <footer>
          <div style={{ display: 'flex', alignItems: 'center', gap: '0.5rem', color: '#fff', fontWeight: '700' }}>
            <Pill size={18} style={{ color: 'var(--primary)' }} />
            <span>ASHAR PHARMA INTERNATIONAL</span>
          </div>
          <p>© 2026 Ashar Health Care (Pharma Div). WHO-GMP Sterile Pressed Tablets and Smart Blister Sheets.</p>
          <p style={{ color: 'var(--text-muted)' }}>Precision pharmaceutical export & logistics portal.</p>
        </footer>
      </div>
    </>
  );
}
