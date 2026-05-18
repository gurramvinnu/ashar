import React, { useState } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { Phone, Mail, MapPin, Building, CheckCircle, Package2, ShieldCheck } from 'lucide-react';

export default function ContactSection({ sampleCart = [], setSampleCart }) {
  const [formSubmitted, setFormSubmitted] = useState(false);
  const [formData, setFormData] = useState({
    name: '',
    email: '',
    company: '',
    licenseNumber: '',
    volume: 'medium',
    message: ''
  });

  const handleChange = (e) => {
    setFormData({
      ...formData,
      [e.target.name]: e.target.value
    });
  };

  const handleSubmit = (e) => {
    e.preventDefault();
    setTimeout(() => {
      setFormSubmitted(true);
    }, 800);
  };

  return (
    <section id="distributor" className="contact">
      {/* Left Column: B2B Support Desk */}
      <motion.div 
        className="contact-info"
        initial={{ opacity: 0, y: 30 }}
        whileInView={{ opacity: 1, y: 0 }}
        viewport={{ once: true }}
        transition={{ duration: 0.6 }}
      >
        <div className="hero-tag">
          <Package2 size={16} />
          <span>Distributor Registration</span>
        </div>
        <h2 style={{ fontSize: '3rem', lineHeight: '1.1', background: 'linear-gradient(135deg, #ffffff 40%, #e0f2fe 100%)', WebkitBackgroundClip: 'text', WebkitTextFillColor: 'transparent' }}>
          Partner With Ashar Pharma
        </h2>
        <p style={{ color: 'var(--text-secondary)' }}>
          We provide medical reps, export partners, and pharmacy chains with custom-branded blister sheets, custom tablet press sizes, and direct shipping logistics.
        </p>

        <div className="contact-card glass-panel">
          <div className="contact-item">
            <div className="contact-item-icon">
              <Building size={20} />
            </div>
            <div className="contact-item-text">
              <p>B2B Wholesale Enquiries</p>
              <p>wholesale@asharpharma.com</p>
            </div>
          </div>

          <div className="contact-item">
            <div className="contact-item-icon">
              <Mail size={20} />
            </div>
            <div className="contact-item-text">
              <p>Regulatory Compliance Desk</p>
              <p>regulatory@asharpharma.com</p>
            </div>
          </div>

          <div className="contact-item">
            <div className="contact-item-icon">
              <Phone size={20} />
            </div>
            <div className="contact-item-text">
              <p>Direct Distribution Support</p>
              <p>+1 (800) PHARMA-ASHAR</p>
            </div>
          </div>
        </div>
      </motion.div>

      {/* Right Column: Distributor Registration and Sample Request Form */}
      <motion.div
        initial={{ opacity: 0, scale: 0.95 }}
        whileInView={{ opacity: 1, scale: 1 }}
        viewport={{ once: true }}
        transition={{ duration: 0.7 }}
      >
        <AnimatePresence mode="wait">
          {!formSubmitted ? (
            <motion.form 
              key="dist-form"
              className="contact-form glass-panel"
              onSubmit={handleSubmit}
              initial={{ opacity: 1 }}
              exit={{ opacity: 0, scale: 0.95 }}
              transition={{ duration: 0.4 }}
            >
              <h3>Request Distributor Sample Kit</h3>
              
              {/* Intelligent Dynamic Sample Kit Summary */}
              <div style={{ gridColumn: 'span 2', marginBottom: '0.5rem' }}>
                <span style={{ fontSize: '0.82rem', fontWeight: '700', color: 'var(--text-secondary)', display: 'block', marginBottom: '0.4rem' }}>
                  Target Tablet Sheets in Sample Kit:
                </span>
                {sampleCart.length === 0 ? (
                  <div style={{ fontSize: '0.85rem', color: 'var(--text-muted)', border: '1px dashed var(--glass-border)', padding: '0.6rem 1rem', borderRadius: '10px' }}>
                    No specific tablet sheets selected. Click "Get Sample" in the product catalog above, or we will dispatch our general B2B best-sellers kit.
                  </div>
                ) : (
                  <div style={{ display: 'flex', gap: '0.5rem', flexWrap: 'wrap' }}>
                    {sampleCart.map((item, idx) => (
                      <span 
                        key={idx}
                        style={{
                          fontSize: '0.75rem',
                          fontWeight: '600',
                          padding: '0.3rem 0.8rem',
                          borderRadius: '50px',
                          background: 'rgba(6, 182, 212, 0.1)',
                          color: 'var(--primary)',
                          border: '1px solid rgba(6, 182, 212, 0.3)',
                          display: 'flex',
                          alignItems: 'center',
                          gap: '0.4rem'
                        }}
                      >
                        <span>{item} Sheet</span>
                        <button 
                          type="button"
                          onClick={() => setSampleCart(sampleCart.filter(c => c !== item))}
                          style={{ background: 'none', border: 'none', color: 'var(--primary)', cursor: 'pointer', fontSize: '0.8rem', fontWeight: '800' }}
                        >
                          &times;
                        </button>
                      </span>
                    ))}
                  </div>
                )}
              </div>

              <div className="form-group">
                <label htmlFor="name">Your Name *</label>
                <input 
                  type="text" 
                  id="name" 
                  name="name" 
                  required 
                  placeholder="John Doe"
                  value={formData.name}
                  onChange={handleChange}
                />
              </div>

              <div className="form-group">
                <label htmlFor="email">Work Email *</label>
                <input 
                  type="email" 
                  id="email" 
                  name="email" 
                  required 
                  placeholder="distributor@company.com"
                  value={formData.email}
                  onChange={handleChange}
                />
              </div>

              <div className="form-group">
                <label htmlFor="company">Company / Organization *</label>
                <input 
                  type="text" 
                  id="company" 
                  name="company" 
                  required 
                  placeholder="e.g. Apex Pharma Ltd"
                  value={formData.company}
                  onChange={handleChange}
                />
              </div>

              <div className="form-group">
                <label htmlFor="licenseNumber">Drug License Number *</label>
                <input 
                  type="text" 
                  id="licenseNumber" 
                  name="licenseNumber" 
                  required 
                  placeholder="FDA-DL-XXXXXX"
                  value={formData.licenseNumber}
                  onChange={handleChange}
                />
              </div>

              <div className="form-group full-width">
                <label htmlFor="volume">Target Monthly Volume *</label>
                <select 
                  id="volume" 
                  name="volume"
                  value={formData.volume}
                  onChange={handleChange}
                >
                  <option value="small">Introductory Trial (&lt; 20,000 sheets/month)</option>
                  <option value="medium">Standard Pharmacy Supply (20,000 - 100,000 sheets/month)</option>
                  <option value="large">Regional Distributor (100,000 - 500,000 sheets/month)</option>
                  <option value="enterprise">National Pharmacy Chain (500,000+ sheets/month)</option>
                </select>
              </div>

              <div className="form-group full-width">
                <label htmlFor="message">Custom Formulations / Special Requests</label>
                <textarea 
                  id="message" 
                  name="message" 
                  rows="3" 
                  placeholder="Describe your market requirements, customized pressing size, or pill branding needs..."
                  value={formData.message}
                  onChange={handleChange}
                />
              </div>

              <button type="submit" className="btn-primary">
                Submit Sample & Quote Request
              </button>
            </motion.form>
          ) : (
            <motion.div 
              key="form-success"
              className="glass-panel"
              initial={{ opacity: 0, scale: 0.95 }}
              animate={{ opacity: 1, scale: 1 }}
              transition={{ duration: 0.5, ease: 'easeOut' }}
              style={{
                padding: '4rem 3rem',
                display: 'flex',
                flexDirection: 'column',
                alignItems: 'center',
                textAlign: 'center',
                gap: '1.5rem',
                border: '1px solid var(--accent)',
                boxShadow: '0 0 40px rgba(20, 184, 166, 0.2)'
              }}
            >
              <div style={{ color: 'var(--accent)' }}>
                <CheckCircle size={72} className="animate-bounce" />
              </div>
              <h3 style={{ fontSize: '2rem', color: 'var(--text-primary)' }}>Lead Successfully Registered!</h3>
              
              <div style={{ background: 'rgba(255,255,255,0.02)', border: '1px dashed var(--glass-border)', padding: '1rem', borderRadius: '12px', width: '100%' }}>
                <span style={{ fontSize: '0.85rem', color: 'var(--text-muted)', display: 'block', marginBottom: '0.2rem' }}>
                  Distributor Profile Lodged
                </span>
                <strong style={{ display: 'block', fontSize: '1.1rem' }}>{formData.company}</strong>
                <span style={{ fontSize: '0.82rem', color: 'var(--primary)' }}>License Ref: {formData.licenseNumber}</span>
              </div>

              <p style={{ color: 'var(--text-secondary)', maxWidth: '450px', fontSize: '1.02rem', lineHeight: '1.6' }}>
                Thank you, <strong>{formData.name}</strong>. Your sample inquiry for <strong>{sampleCart.length > 0 ? sampleCart.join(', ') : 'our general distributor catalog'}</strong> has been registered. 
              </p>
              
              <div style={{ display: 'flex', alignItems: 'center', gap: '0.6rem', background: 'rgba(20, 184, 166, 0.05)', padding: '0.8rem 1.2rem', borderRadius: '8px', border: '1px solid rgba(20, 184, 166, 0.15)' }}>
                <ShieldCheck size={18} style={{ color: 'var(--accent)' }} />
                <span style={{ fontSize: '0.82rem', color: 'var(--text-secondary)' }}>
                  Wholesale GMP sample verification ticket dispatched to <strong>{formData.email}</strong>.
                </span>
              </div>

              <button 
                className="btn-secondary" 
                onClick={() => {
                  setFormSubmitted(false);
                  setSampleCart([]);
                  setFormData({ name: '', email: '', company: '', licenseNumber: '', volume: 'medium', message: '' });
                }}
                style={{ marginTop: '1rem' }}
              >
                Log New distributor Lead
              </button>
            </motion.div>
          )}
        </AnimatePresence>
      </motion.div>
    </section>
  );
}
