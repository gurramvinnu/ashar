import React from 'react';
import { motion } from 'framer-motion';
import { Cpu, ShieldCheck, Sparkles, Activity, Eye, Layers } from 'lucide-react';

const INNOVATIONS = [
  {
    id: 'coating',
    title: 'Enteric Micro-Coating',
    desc: 'Advanced sub-micron fluid-bed polymer coating. Eliminates bitter API tastes and prevents early stomach acid dissolution, optimizing clinical absorption.',
    icon: Layers,
  },
  {
    id: 'packaging',
    title: 'Hermetic Alu-Alu Blister Sheets',
    desc: 'Cold-formed pure aluminum foil base and top sheets. 100% barrier protection against light, atmospheric humidity, and gas transfer in tropical sectors.',
    icon: ShieldCheck,
  },
  {
    id: 'pressing',
    title: 'High-Density Rotary Presses',
    desc: 'Computerized tablet press control loops with direct-compression binders. Prevents edge chipping and tablet dusting during B2B bulk distribution.',
    icon: Cpu,
  }
];

export default function AboutSection() {
  const containerVariants = {
    hidden: { opacity: 0 },
    visible: {
      opacity: 1,
      transition: { staggerChildren: 0.2 },
    },
  };

  const cardVariants = {
    hidden: { opacity: 0, x: 50 },
    visible: {
      opacity: 1,
      x: 0,
      transition: {
        duration: 0.7,
        ease: [0.16, 1, 0.3, 1],
      },
    },
  };

  return (
    <section id="science" className="about">
      {/* Left Column: Scientific Overview */}
      <motion.div 
        className="about-mission"
        initial={{ opacity: 0, x: -50 }}
        whileInView={{ opacity: 1, x: 0 }}
        viewport={{ once: true }}
        transition={{ duration: 0.8 }}
        style={{ display: 'flex', flexDirection: 'column', gap: '1.5rem' }}
      >
        <div className="hero-tag">
          <Activity size={16} />
          <span>Biochemical Precision</span>
        </div>
        <h2 style={{ fontSize: '3rem', lineHeight: '1.1', background: 'linear-gradient(135deg, #ffffff 40%, #cffafe 100%)', WebkitBackgroundClip: 'text', WebkitTextFillColor: 'transparent' }}>
          Tablet Pressing & Blister Science
        </h2>
        <p style={{ color: 'var(--text-secondary)', fontSize: '1.05rem' }}>
          Our manufacturing plants operate at ISO-Class 7 sterile requirements. Every batch of tablet sheets passes through active electronic cameras checking weight, width, and seal integrity before B2B dispatch.
        </p>
        <p style={{ color: 'var(--text-secondary)', fontSize: '1.05rem' }}>
          We help distributors win clinican trust. By engineering flawless tablet sheets, we ensure your reps can pitch a premium medical brand with high physical durability and clear pharmaceutical labeling.
        </p>

        {/* Quality quote */}
        <div className="glass-panel" style={{ padding: '1.5rem 2rem', marginTop: '1rem', borderLeft: '4px solid var(--primary)', borderRadius: '0 20px 20px 0' }}>
          <p style={{ fontStyle: 'italic', color: 'var(--text-primary)', fontWeight: '500' }}>
            "We invest millions in direct-compression binding technology so that your marketing reps can showcase dust-free, perfectly polished tablets to clinical clients."
          </p>
          <p style={{ color: 'var(--primary)', fontWeight: '600', fontSize: '0.85rem', marginTop: '0.5rem', textTransform: 'uppercase', letterSpacing: '0.05em' }}>
            — Ashar Pharma Operations Director
          </p>
        </div>
      </motion.div>

      {/* Right Column: Dynamic tech cards */}
      <motion.div 
        className="about-features"
        variants={containerVariants}
        initial="hidden"
        whileInView="visible"
        viewport={{ once: true, margin: '-100px' }}
      >
        {INNOVATIONS.map((inn) => {
          const Icon = inn.icon;
          return (
            <motion.div 
              key={inn.id}
              className="about-card glass-panel"
              variants={cardVariants}
            >
              <div className="about-card-icon" style={{ color: 'var(--primary)', borderColor: 'rgba(6, 182, 212, 0.2)', background: 'rgba(6, 182, 212, 0.05)' }}>
                <Icon size={24} />
              </div>
              <div className="about-card-info">
                <h4>{inn.title}</h4>
                <p>{inn.desc}</p>
              </div>
            </motion.div>
          );
        })}
      </motion.div>
    </section>
  );
}
