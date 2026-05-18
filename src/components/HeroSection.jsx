import React from 'react';
import { motion } from 'framer-motion';
import { ShieldCheck, ArrowRight, Pill, Factory, Globe2, Network } from 'lucide-react';

export default function HeroSection() {
  const containerVariants = {
    hidden: { opacity: 0 },
    visible: {
      opacity: 1,
      transition: {
        staggerChildren: 0.2,
      },
    },
  };

  const itemVariants = {
    hidden: { opacity: 0, y: 30 },
    visible: {
      opacity: 1,
      y: 0,
      transition: {
        duration: 0.8,
        ease: [0.16, 1, 0.3, 1],
      },
    },
  };

  const handleScrollTo = (id) => {
    const element = document.getElementById(id);
    if (element) {
      element.scrollIntoView({ behavior: 'smooth' });
    }
  };

  return (
    <section id="home" className="hero">
      <motion.div
        className="hero-content"
        variants={containerVariants}
        initial="hidden"
        whileInView="visible"
        viewport={{ once: true, margin: '-100px' }}
      >
        <motion.div className="hero-tag" variants={itemVariants}>
          <ShieldCheck size={16} />
          <span>GMP Certified Tablet sheets & blister packs</span>
        </motion.div>
        
        <motion.h1 variants={itemVariants}>
          Ashar <br />
          <span style={{ 
            background: 'linear-gradient(135deg, var(--primary) 0%, var(--accent) 100%)',
            WebkitBackgroundClip: 'text',
            WebkitTextFillColor: 'transparent'
          }}>Tablet Sheets</span>
        </motion.h1>
        
        <motion.p className="hero-desc" variants={itemVariants}>
          We manufacture high-yield, bio-available medical tablet sheets and circular pressed capsules. Optimized for medical reps, clinical marketers, and retail pharmacies seeking consistent chemical purity and premium wholesale packaging.
        </motion.p>
        
        <motion.div className="hero-btns" variants={itemVariants}>
          <button 
            className="btn-primary" 
            onClick={() => handleScrollTo('distributor')}
            style={{ display: 'flex', alignItems: 'center', gap: '0.5rem' }}
          >
            <span>Request Sales Sample Kit</span>
            <ArrowRight size={18} />
          </button>
          <button className="btn-secondary" onClick={() => handleScrollTo('products')}>
            View Product Sheets
          </button>
        </motion.div>

        {/* B2B Stats Grid */}
        <motion.div className="stats-bar" variants={itemVariants}>
          <div className="stat-card glass-panel">
            <div style={{ display: 'flex', justifyContent: 'center', marginBottom: '0.5rem', color: 'var(--primary)' }}>
              <Pill size={24} />
            </div>
            <div className="stat-number">12B+</div>
            <div className="stat-label">Tablets pressed annually</div>
          </div>
          
          <div className="stat-card glass-panel">
            <div style={{ display: 'flex', justifyContent: 'center', marginBottom: '0.5rem', color: 'var(--accent)' }}>
              <Factory size={24} />
            </div>
            <div className="stat-number">100%</div>
            <div className="stat-label">WHO-GMP Compliant</div>
          </div>
          
          <div className="stat-card glass-panel">
            <div style={{ display: 'flex', justifyContent: 'center', marginBottom: '0.5rem', color: 'var(--secondary)' }}>
              <Globe2 size={24} />
            </div>
            <div className="stat-number">48+</div>
            <div className="stat-label">Global Ports Supplied</div>
          </div>

          <div className="stat-card glass-panel">
            <div style={{ display: 'flex', justifyContent: 'center', marginBottom: '0.5rem', color: 'var(--primary)' }}>
              <Network size={24} />
            </div>
            <div className="stat-number">950+</div>
            <div className="stat-label">Active B2B Marketers</div>
          </div>
        </motion.div>
      </motion.div>

      <div className="hero-model-spacer" />
    </section>
  );
}
