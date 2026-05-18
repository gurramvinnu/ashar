import React from 'react';
import { motion } from 'framer-motion';
import { Heart, Brain, Eye, ShieldAlert, Activity, Wifi, ArrowUpRight } from 'lucide-react';

const DEPARTMENTS = [
  {
    id: 'cardiology',
    title: 'Cardiology',
    desc: 'Advanced coronary diagnostics, bypass procedures, and non-invasive cardiovascular scans designed for ultimate heart health.',
    icon: Heart,
    color: '#ef4444' // red accent for heart
  },
  {
    id: 'neurology',
    title: 'Neurology',
    desc: 'Cutting-edge neuro-imaging, spinal therapy, and cognitive brain care designed by global neurology research teams.',
    icon: Brain,
    color: '#a855f7' // purple accent for brain
  },
  {
    id: 'radiology',
    title: 'Precision Radiology',
    desc: 'Ultra high-definition MRI, CT scans, and nuclear diagnostics providing instant, crystal-clear anatomical imaging.',
    icon: Eye,
    color: '#06b6d4' // cyan accent
  },
  {
    id: 'oncology',
    title: 'Advanced Oncology',
    desc: 'Targeted immunotherapy, early detection screenings, and advanced genetics-driven oncology treatment programs.',
    icon: Activity,
    color: '#10b981' // emerald/green accent
  },
  {
    id: 'orthopedics',
    title: 'Orthopedic Surgery',
    desc: 'Robot-assisted joint replacements, arthroscopic sports medicine, and custom physical rehabilitation systems.',
    icon: ShieldAlert,
    color: '#f59e0b' // amber accent
  },
  {
    id: 'telehealth',
    title: 'Digital Telehealth',
    desc: 'Seamless, instant 24/7 online video consultations and AI-driven home medical diagnostics at your fingertips.',
    icon: Wifi,
    color: '#3b82f6' // blue accent
  }
];

export default function DepartmentsSection() {
  const containerVariants = {
    hidden: { opacity: 0 },
    visible: {
      opacity: 1,
      transition: {
        staggerChildren: 0.15,
      },
    },
  };

  const cardVariants = {
    hidden: { opacity: 0, scale: 0.95, y: 30 },
    visible: {
      opacity: 1,
      scale: 1,
      y: 0,
      transition: {
        duration: 0.6,
        ease: 'easeOut',
      },
    },
  };

  return (
    <section id="departments">
      <div className="section-header">
        <motion.div 
          className="hero-tag"
          initial={{ opacity: 0, scale: 0.9 }}
          whileInView={{ opacity: 1, scale: 1 }}
          viewport={{ once: true }}
        >
          <Activity size={16} />
          <span>Our Departments</span>
        </motion.div>
        <motion.h2
          initial={{ opacity: 0, y: 20 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true }}
          transition={{ duration: 0.6 }}
        >
          Specialized Clinical Departments
        </motion.h2>
        <motion.p
          initial={{ opacity: 0, y: 20 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true }}
          transition={{ duration: 0.6, delay: 0.15 }}
        >
          Ashar Health Care houses world-class medical laboratories and specialized wings powered by premium scientific equipment and expert physicians.
        </motion.p>
      </div>

      <motion.div 
        className="dept-grid"
        variants={containerVariants}
        initial="hidden"
        whileInView="visible"
        viewport={{ once: true, margin: '-50px' }}
      >
        {DEPARTMENTS.map((dept, index) => {
          const Icon = dept.icon;
          return (
            <motion.div 
              key={dept.id}
              className="dept-card glass-panel"
              variants={cardVariants}
              whileHover={{ 
                y: -10,
                borderColor: dept.color,
                boxShadow: `0 10px 30px rgba(${parseInt(dept.color.slice(1,3),16)}, ${parseInt(dept.color.slice(3,5),16)}, ${parseInt(dept.color.slice(5,7),16)}, 0.15)`
              }}
            >
              <div 
                className="dept-icon-wrapper"
                style={{
                  '--hover-bg': dept.color
                }}
              >
                <Icon size={28} />
              </div>
              
              <h3>{dept.title}</h3>
              <p>{dept.desc}</p>
              
              <div className="dept-link" style={{ color: dept.color }}>
                <span>Learn More</span>
                <ArrowUpRight size={16} />
              </div>
            </motion.div>
          );
        })}
      </motion.div>

      {/* Styled custom CSS to support custom variable hover color for icon borders */}
      <style>{`
        .dept-card:hover .dept-icon-wrapper {
          background-color: var(--hover-bg) !important;
          border-color: var(--hover-bg) !important;
          color: #fff !important;
        }
      `}</style>
    </section>
  );
}
