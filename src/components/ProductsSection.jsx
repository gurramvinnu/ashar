import React, { useState } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { Shield, Sparkles, Filter, ShoppingBag, Eye, Layers, Calendar, Pill } from 'lucide-react';

const PRODUCTS = [
  {
    id: 'amlodipine',
    name: 'Amlodipine Besylate',
    class: 'cardio',
    classLabel: 'Cardiovascular',
    api: 'Amlodipine 5mg / 10mg',
    sheetStyle: '10x10 Alu-Alu Blister Sheet',
    disintegration: '< 45 Seconds',
    shelfLife: '36 Months',
    desc: 'High-precision pressed calcium channel blocker, packed in moisture-impermeable cold-formed aluminum blister sheets. Guaranteed uniform bioavailability.',
    color: '#06b6d4'
  },
  {
    id: 'amoxicillin',
    name: 'Amoxicillin Trihydrate',
    class: 'antibiotic',
    classLabel: 'Anti-infective',
    api: 'Amoxicillin USP 500mg',
    sheetStyle: '10x6 PVDC-coated PVC Blister',
    disintegration: '< 15 Minutes',
    shelfLife: '24 Months',
    desc: 'Broad-spectrum antibacterial formulation pressed with high-durability binders to prevent powdering during distributor transit.',
    color: '#10b981'
  },
  {
    id: 'metformin',
    name: 'Metformin HCl XR',
    class: 'diabetic',
    classLabel: 'Metabolic Care',
    api: 'Metformin HCl 500mg / 1000mg',
    sheetStyle: '10x15 PVC-Alu Blister Sheet',
    disintegration: 'Extended Release (8-12 hours)',
    shelfLife: '36 Months',
    desc: 'Controlled-release hydrophilic polymer matrix tablets. Features split grooves for optional micro-dosing.',
    color: '#3b82f6'
  },
  {
    id: 'atorvastatin',
    name: 'Atorvastatin Calcium',
    class: 'cardio',
    classLabel: 'Cardiovascular',
    api: 'Atorvastatin 10mg / 20mg / 40mg',
    sheetStyle: '10x10 Cold-Formed Alu-Alu',
    disintegration: '< 30 Seconds',
    shelfLife: '36 Months',
    desc: 'Premium lipid-regulating HMG-CoA reductase inhibitor with high hepatic solubility. Packed in opaque light-shielded blister cavities.',
    color: '#a855f7'
  },
  {
    id: 'methylcobalamin',
    name: 'Methylcobalamin Neuro',
    class: 'neuro',
    classLabel: 'Neuro & Vitamins',
    api: 'Methylcobalamin 1500 mcg',
    sheetStyle: '10x10 Tropical Alu-Alu Blister',
    disintegration: '< 15 Seconds (Sublingual)',
    shelfLife: '24 Months',
    desc: 'Fast-dissolving vitamin B12 supplement sheet utilizing micro-crystalline cellulose for high neurological absorption rates.',
    color: '#ef4444'
  },
  {
    id: 'paracetamol',
    name: 'Paracetamol Rapid',
    class: 'general',
    classLabel: 'Analgesics',
    api: 'Acetaminophen 500mg / 650mg',
    sheetStyle: '10x10 Strip Paper-Poly Pack',
    disintegration: '< 3 Minutes',
    shelfLife: '48 Months',
    desc: 'High-volume pressed antipyretic tablets utilizing direct compression corn starch binders for optimal gastric dissolution.',
    color: '#f59e0b'
  }
];

export default function ProductsSection() {
  const [filter, setFilter] = useState('all');
  const [sampleCart, setSampleCart] = useState([]);
  const [activeModalProduct, setActiveModalProduct] = useState(null);

  const filteredProducts = filter === 'all' 
    ? PRODUCTS 
    : PRODUCTS.filter(p => p.class === filter);

  const handleAddSample = (productName) => {
    if (sampleCart.includes(productName)) {
      setSampleCart(sampleCart.filter(item => item !== productName));
    } else {
      if (sampleCart.length >= 3) {
        alert("Maximum of 3 free B2B sample sheets can be requested per session.");
        return;
      }
      setSampleCart([...sampleCart, productName]);
    }
  };

  const containerVariants = {
    hidden: { opacity: 0 },
    visible: {
      opacity: 1,
      transition: { staggerChildren: 0.1 }
    }
  };

  const productVariants = {
    hidden: { opacity: 0, scale: 0.9, y: 20 },
    visible: {
      opacity: 1,
      scale: 1,
      y: 0,
      transition: { duration: 0.5, ease: 'easeOut' }
    }
  };

  return (
    <section id="products">
      <div className="section-header">
        <div className="hero-tag">
          <Pill size={16} />
          <span>Product Catalog</span>
        </div>
        <h2>Wholesale Tablet Sheets</h2>
        <p>
          Browse our certified pharmaceutical products, pressed with clinical accuracy and sealed in top-tier blister sheets. Select up to 3 products to receive **Free Sample Sheets** in your distributor kit.
        </p>
      </div>

      {/* Catalog Control Bar (Filters + Sample Cart Counter) */}
      <div className="glass-panel" style={{
        display: 'flex',
        flexWrap: 'wrap',
        justifyContent: 'space-between',
        alignItems: 'center',
        padding: '1rem 2rem',
        marginBottom: '3rem',
        gap: '1.5rem',
        borderRadius: '15px'
      }}>
        {/* Category Filters */}
        <div style={{ display: 'flex', gap: '0.8rem', flexWrap: 'wrap' }}>
          <button 
            className={`btn-secondary ${filter === 'all' ? 'active-filter' : ''}`}
            onClick={() => setFilter('all')}
            style={{ padding: '0.5rem 1.2rem', borderRadius: '8px', fontSize: '0.88rem' }}
          >
            All Products
          </button>
          <button 
            className={`btn-secondary ${filter === 'cardio' ? 'active-filter' : ''}`}
            onClick={() => setFilter('cardio')}
            style={{ padding: '0.5rem 1.2rem', borderRadius: '8px', fontSize: '0.88rem' }}
          >
            Cardiology
          </button>
          <button 
            className={`btn-secondary ${filter === 'antibiotic' ? 'active-filter' : ''}`}
            onClick={() => setFilter('antibiotic')}
            style={{ padding: '0.5rem 1.2rem', borderRadius: '8px', fontSize: '0.88rem' }}
          >
            Antibiotics
          </button>
          <button 
            className={`btn-secondary ${filter === 'neuro' ? 'active-filter' : ''}`}
            onClick={() => setFilter('neuro')}
            style={{ padding: '0.5rem 1.2rem', borderRadius: '8px', fontSize: '0.88rem' }}
          >
            Neurological
          </button>
          <button 
            className={`btn-secondary ${filter === 'general' ? 'active-filter' : ''}`}
            onClick={() => setFilter('general')}
            style={{ padding: '0.5rem 1.2rem', borderRadius: '8px', fontSize: '0.88rem' }}
          >
            Analgesics
          </button>
        </div>

        {/* B2B Sample Cart Indicator */}
        <div style={{ display: 'flex', alignItems: 'center', gap: '1rem' }}>
          <div className="glass-panel" style={{
            display: 'flex',
            alignItems: 'center',
            gap: '0.6rem',
            padding: '0.5rem 1.2rem',
            borderRadius: '10px',
            background: 'rgba(6, 182, 212, 0.1)',
            borderColor: 'var(--primary)'
          }}>
            <ShoppingBag size={18} style={{ color: 'var(--primary)' }} />
            <span style={{ fontSize: '0.9rem', fontWeight: '600' }}>
              Sample Sheets Selected: {sampleCart.length}/3
            </span>
          </div>
          {sampleCart.length > 0 && (
            <button 
              className="btn-primary"
              onClick={() => {
                const element = document.getElementById('distributor');
                if (element) element.scrollIntoView({ behavior: 'smooth' });
              }}
              style={{ padding: '0.5rem 1.2rem', borderRadius: '8px', fontSize: '0.88rem' }}
            >
              Order Sample Sheets Now
            </button>
          )}
        </div>
      </div>

      {/* Grid of Medical Tablets & Blister Sheets */}
      <motion.div 
        className="dept-grid"
        variants={containerVariants}
        initial="hidden"
        whileInView="visible"
        viewport={{ once: true }}
      >
        <AnimatePresence mode="popLayout">
          {filteredProducts.map((product) => {
            const isSelected = sampleCart.includes(product.name);
            return (
              <motion.div
                key={product.id}
                layout
                variants={productVariants}
                className="dept-card glass-panel"
                whileHover={{ y: -8 }}
                style={{ position: 'relative' }}
              >
                {/* Tech Badge */}
                <div style={{
                  position: 'absolute',
                  top: '1.2rem',
                  right: '1.2rem',
                  padding: '0.2rem 0.6rem',
                  borderRadius: '5px',
                  background: 'rgba(255,255,255,0.05)',
                  fontSize: '0.75rem',
                  fontWeight: '600',
                  color: product.color,
                  border: `1px solid ${product.color}33`
                }}>
                  {product.classLabel}
                </div>

                <div 
                  className="dept-icon-wrapper" 
                  style={{ color: product.color, background: `${product.color}11`, borderColor: `${product.color}33` }}
                >
                  <Pill size={28} />
                </div>

                <h3 style={{ marginTop: '0.5rem' }}>{product.name}</h3>
                
                <div style={{ display: 'flex', flexDirection: 'column', gap: '0.4rem', fontSize: '0.85rem', color: 'var(--text-secondary)' }}>
                  <div style={{ display: 'flex', alignItems: 'center', gap: '0.5rem' }}>
                    <Layers size={14} style={{ color: 'var(--primary)' }} />
                    <span><strong>API Form:</strong> {product.api}</span>
                  </div>
                  <div style={{ display: 'flex', alignItems: 'center', gap: '0.5rem' }}>
                    <Shield size={14} style={{ color: 'var(--accent)' }} />
                    <span><strong>Packaging:</strong> {product.sheetStyle}</span>
                  </div>
                  <div style={{ display: 'flex', alignItems: 'center', gap: '0.5rem' }}>
                    <Calendar size={14} style={{ color: 'var(--secondary)' }} />
                    <span><strong>Shelf Life:</strong> {product.shelfLife}</span>
                  </div>
                </div>

                <p style={{ marginTop: '0.5rem', fontSize: '0.9rem', color: 'var(--text-muted)' }}>
                  {product.desc}
                </p>

                {/* B2B Action Buttons */}
                <div style={{ display: 'flex', gap: '1rem', marginTop: '1.5rem' }}>
                  <button 
                    onClick={() => setActiveModalProduct(product)}
                    className="btn-secondary" 
                    style={{ flex: 1, padding: '0.5rem', borderRadius: '8px', fontSize: '0.85rem', display: 'flex', justifyContent: 'center', alignItems: 'center', gap: '0.4rem' }}
                  >
                    <Eye size={16} />
                    <span>Tech Sheet</span>
                  </button>
                  <button 
                    onClick={() => handleAddSample(product.name)}
                    className="btn-primary" 
                    style={{ 
                      flex: 1, 
                      padding: '0.5rem', 
                      borderRadius: '8px', 
                      fontSize: '0.85rem',
                      background: isSelected ? 'var(--accent)' : 'linear-gradient(135deg, var(--primary) 0%, var(--secondary) 100%)',
                      boxShadow: isSelected ? '0 0 15px rgba(20, 184, 166, 0.4)' : 'none'
                    }}
                  >
                    {isSelected ? 'Selected' : 'Get Sample'}
                  </button>
                </div>
              </motion.div>
            );
          })}
        </AnimatePresence>
      </motion.div>

      {/* Tech Specifications Modal Overlay (Highly premium interactive feature) */}
      <AnimatePresence>
        {activeModalProduct && (
          <motion.div 
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            style={{
              position: 'fixed',
              top: 0,
              left: 0,
              width: '100vw',
              height: '100vh',
              zIndex: 1000,
              background: 'rgba(3, 7, 18, 0.85)',
              backdropFilter: 'blur(10px)',
              display: 'flex',
              justifyContent: 'center',
              alignItems: 'center',
              padding: '2rem'
            }}
            onClick={() => setActiveModalProduct(null)}
          >
            <motion.div 
              initial={{ scale: 0.9, y: 30 }}
              animate={{ scale: 1, y: 0 }}
              exit={{ scale: 0.9, y: 30 }}
              className="glass-panel"
              style={{
                width: '100%',
                maxWidth: '600px',
                padding: '2.5rem',
                borderRadius: '24px',
                border: `1px solid ${activeModalProduct.color}`,
                boxShadow: `0 0 40px ${activeModalProduct.color}22`
              }}
              onClick={(e) => e.stopPropagation()}
            >
              <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'flex-start', marginBottom: '1.5rem' }}>
                <div>
                  <span style={{ fontSize: '0.8rem', fontWeight: '700', textTransform: 'uppercase', color: activeModalProduct.color }}>
                    {activeModalProduct.classLabel} Division
                  </span>
                  <h3 style={{ fontSize: '2rem', marginTop: '0.2rem' }}>{activeModalProduct.name}</h3>
                </div>
                <button 
                  onClick={() => setActiveModalProduct(null)}
                  style={{ background: 'none', border: 'none', color: '#fff', fontSize: '1.5rem', cursor: 'pointer' }}
                >
                  &times;
                </button>
              </div>

              {/* Technical Spec Table */}
              <div style={{ display: 'flex', flexDirection: 'column', gap: '0.8rem', background: 'rgba(255,255,255,0.02)', padding: '1.2rem', borderRadius: '14px', border: '1px solid var(--glass-border)' }}>
                <div style={{ display: 'flex', justifyContent: 'space-between', borderBottom: '1px solid rgba(255,255,255,0.05)', paddingBottom: '0.5rem' }}>
                  <span style={{ color: 'var(--text-secondary)', fontSize: '0.9rem' }}>Active Pharmaceutical Ingredient</span>
                  <span style={{ fontWeight: '600', fontSize: '0.9rem' }}>{activeModalProduct.api}</span>
                </div>
                <div style={{ display: 'flex', justifyContent: 'space-between', borderBottom: '1px solid rgba(255,255,255,0.05)', paddingBottom: '0.5rem' }}>
                  <span style={{ color: 'var(--text-secondary)', fontSize: '0.9rem' }}>Blister Pack Style</span>
                  <span style={{ fontWeight: '600', fontSize: '0.9rem' }}>{activeModalProduct.sheetStyle}</span>
                </div>
                <div style={{ display: 'flex', justifyContent: 'space-between', borderBottom: '1px solid rgba(255,255,255,0.05)', paddingBottom: '0.5rem' }}>
                  <span style={{ color: 'var(--text-secondary)', fontSize: '0.9rem' }}>Average Disintegration Time</span>
                  <span style={{ fontWeight: '600', fontSize: '0.9rem', color: 'var(--primary)' }}>{activeModalProduct.disintegration}</span>
                </div>
                <div style={{ display: 'flex', justifyContent: 'space-between', borderBottom: '1px solid rgba(255,255,255,0.05)', paddingBottom: '0.5rem' }}>
                  <span style={{ color: 'var(--text-secondary)', fontSize: '0.9rem' }}>Tablet Thickness Tolerance</span>
                  <span style={{ fontWeight: '600', fontSize: '0.9rem' }}>&plusmn; 0.05 mm</span>
                </div>
                <div style={{ display: 'flex', justifyContent: 'space-between' }}>
                  <span style={{ color: 'var(--text-secondary)', fontSize: '0.9rem' }}>Official Shelf Life</span>
                  <span style={{ fontWeight: '600', fontSize: '0.9rem' }}>{activeModalProduct.shelfLife}</span>
                </div>
              </div>

              <div style={{ display: 'flex', alignItems: 'center', gap: '0.8rem', background: 'rgba(6, 182, 212, 0.05)', padding: '1rem', borderRadius: '12px', marginTop: '1.5rem', border: '1px solid rgba(6, 182, 212, 0.1)' }}>
                <Sparkles size={18} style={{ color: 'var(--primary)' }} />
                <span style={{ fontSize: '0.82rem', color: 'var(--text-secondary)', lineHeight: '1.4' }}>
                  <strong>Marketer Tip:</strong> This blister packaging includes gas-purged nitrogen pockets ensuring chemical stability in hot and humid tropical clinical markets.
                </span>
              </div>

              <button 
                onClick={() => {
                  handleAddSample(activeModalProduct.name);
                  setActiveModalProduct(null);
                }}
                className="btn-primary" 
                style={{ width: '100%', marginTop: '1.5rem', background: sampleCart.includes(activeModalProduct.name) ? 'var(--accent)' : 'linear-gradient(135deg, var(--primary) 0%, var(--secondary) 100%)' }}
              >
                {sampleCart.includes(activeModalProduct.name) ? 'Remove Sample Sheet' : 'Add to Free Sample Request'}
              </button>
            </motion.div>
          </motion.div>
        )}
      </AnimatePresence>

      <style>{`
        .active-filter {
          background: linear-gradient(135deg, var(--primary) 0%, var(--secondary) 100%) !important;
          color: #fff !important;
          border-color: transparent !important;
        }
      `}</style>
    </section>
  );
}
