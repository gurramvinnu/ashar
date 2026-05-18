import React, { useState, useEffect, useRef } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { Canvas } from '@react-three/fiber';
import { OrbitControls } from '@react-three/drei';
import { Activity, ShieldAlert, RotateCcw, AlertTriangle, Zap, Gauge, Flame, TrendingUp } from 'lucide-react';
import * as THREE from 'three';
import TiltCard from './TiltCard';
import RotaryTurret3D from './RotaryTurret3D';


export default function RevolutionsSection() {
  const [rpm, setRpm] = useState(45);
  const [isStopped, setIsStopped] = useState(false);
  const [tabletsProduced, setTabletsProduced] = useState(128450);
  const [temperature, setTemperature] = useState(24.5);
  const [chartData, setChartData] = useState(Array(30).fill(40));
  const [activeTab, setActiveTab] = useState('telemetry');
  
  // Console logs representing terminal activity
  const [logs, setLogs] = useState([
    { id: 1, time: '18:40:02', text: 'System initialized. Nitrogen barrier active.', type: 'info' },
    { id: 2, time: '18:40:15', text: 'Calibration complete: 16 punch stations nominal.', type: 'info' },
    { id: 3, time: '18:40:42', text: 'Powder flow sensor online. Bulk density: 0.58 g/mL.', type: 'info' }
  ]);

  const tickTimer = useRef(null);
  const logTimer = useRef(null);
  const timeRef = useRef(0);

  // Handle active telemetry and simulation updates
  useEffect(() => {
    tickTimer.current = setInterval(() => {
      timeRef.current += 0.15;
      
      if (!isStopped && rpm > 0) {
        // 1. Digital counter increment (75-station commercial equivalency speed scale)
        // tablets/sec = (rpm * 75 stations * 60 min) / 3600 = rpm * 1.25
        const increment = Math.round((rpm * 1.25 * 0.15) * 10) / 10;
        setTabletsProduced(prev => prev + Math.floor(increment + (Math.random() * 0.4)));

        // 2. Heat simulation based on friction speed
        setTemperature(prev => {
          const targetTemp = 22 + (rpm / 120) * 28; // ranges up to 50C at max speed
          return Math.round(THREE.MathUtils.lerp(prev, targetTemp, 0.05) * 10) / 10;
        });

        // 3. SVG live compression wave generation (force in kN)
        setChartData(prev => {
          const next = [...prev.slice(1)];
          const baseForce = 25 + (rpm / 120) * 55; // 25 to 80 kN
          const noise = (Math.random() - 0.5) * (3 + (rpm / 120) * 6);
          const sineWave = Math.sin(timeRef.current * (rpm / 15)) * (2 + (rpm / 120) * 8);
          next.push(Math.max(5, baseForce + sineWave + noise));
          return next;
        });
      } else {
        // Drop temperature back to ambient and flatline chart on stops
        setTemperature(prev => Math.round(THREE.MathUtils.lerp(prev, 22.0, 0.08) * 10) / 10);
        setChartData(prev => {
          const next = [...prev.slice(1)];
          next.push(Math.max(0, THREE.MathUtils.lerp(prev[prev.length - 1], 0, 0.2)));
          return next;
        });
      }
    }, 150);

    return () => clearInterval(tickTimer.current);
  }, [rpm, isStopped]);

  // Handle periodic diagnostic terminal logs
  useEffect(() => {
    const diagnosticTexts = [
      { text: 'Direct compression powder binder feed: 99.1% nominal.', type: 'info' },
      { text: 'Positive room pressure maintained: 12 Pa.', type: 'info' },
      { text: 'Lubricant oil recirculation loop temperature: 38.2°C.', type: 'info' },
      { text: 'Air filter clean index: 98.4% nominal.', type: 'info' },
      { text: 'Main drive belt friction slip: 0.02% (nominal).', type: 'info' },
      { text: 'Vibration monitoring sensors: all axes stable (<0.8 Hz).', type: 'info' }
    ];

    logTimer.current = setInterval(() => {
      if (!isStopped && rpm > 0) {
        const randomLog = diagnosticTexts[Math.floor(Math.random() * diagnosticTexts.length)];
        const date = new Date();
        const timeStr = `${date.getHours().toString().padStart(2, '0')}:${date.getMinutes().toString().padStart(2, '0')}:${date.getSeconds().toString().padStart(2, '0')}`;
        
        setLogs(prev => [
          ...prev.slice(-9), // cap at 10 items
          { id: Date.now(), time: timeStr, text: randomLog.text, type: 'info' }
        ]);
      }
    }, 8000);

    return () => clearInterval(logTimer.current);
  }, [rpm, isStopped]);

  // E-Stop Action
  const triggerEmergencyStop = () => {
    setIsStopped(true);
    const date = new Date();
    const timeStr = `${date.getHours().toString().padStart(2, '0')}:${date.getMinutes().toString().padStart(2, '0')}:${date.getSeconds().toString().padStart(2, '0')}`;
    
    setLogs(prev => [
      ...prev,
      { 
        id: Date.now(), 
        time: timeStr, 
        text: '⚠️ EMERGENCY STOP TRIGGERED. ROTATION BRAKES ENGAGED. FORCE SHUTDOWN.', 
        type: 'danger' 
      }
    ]);
  };

  // Reset System
  const resetSystem = () => {
    setIsStopped(false);
    setRpm(45);
    const date = new Date();
    const timeStr = `${date.getHours().toString().padStart(2, '0')}:${date.getMinutes().toString().padStart(2, '0')}:${date.getSeconds().toString().padStart(2, '0')}`;
    
    setLogs(prev => [
      ...prev,
      { 
        id: Date.now(), 
        time: timeStr, 
        text: '🔄 System reset successful. Press motor ready for rotation. RPM set to 45.', 
        type: 'success' 
      }
    ]);
  };

  // Calculate high-speed B2B statistics
  const currentOutputRate = isStopped ? 0 : rpm * 75 * 60; // tabs/hr
  const compressionForceVal = isStopped ? 0 : Math.round((25 + (rpm / 120) * 55) * 10) / 10;
  const vibrationIndex = isStopped ? 0 : Math.round((0.5 + (rpm / 120) * 4.2) * 10) / 10;

  // Convert SVG chart data to path string
  const svgPath = chartData
    .map((val, idx) => `${(idx / 29) * 100},${100 - (val / 100) * 90}`)
    .join(' L ');

  return (
    <section id="revolutions" className={`revolutions-dashboard ${isStopped ? 'estop-active' : ''}`}>
      {/* SECTION HEADER */}
      <div className="section-header">
        <div className="hero-tag">
          <Activity size={16} />
          <span>Rotary Press Telemetry</span>
        </div>
        <h2>Production Revolutions</h2>
        <p>
          Ashar sterile pressing units utilize computer-controlled rotary press turrets. Adjust the **Revolutions Per Minute (RPM)** of the compression engine to simulate real-time chemical outputs and diagnostics.
        </p>
      </div>

      {/* DASHBOARD LAYOUT GRID */}
      <div className="dashboard-grid">
        {/* LEFT COLUMN: Physical Dial Controllers & Lockouts */}
        <div className="dashboard-controls glass-panel">
          <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '1.5rem' }}>
            <h3 style={{ fontSize: '1.25rem', color: '#fff' }}>Press Controller</h3>
            <span className={`status-badge ${isStopped ? 'status-stopped' : 'status-running'}`}>
              {isStopped ? 'OFFLINE' : 'OPERATIONAL'}
            </span>
          </div>

          {/* RPM Slider Gauge */}
          <div className="slider-container" style={{ margin: '2rem 0' }}>
            <div style={{ display: 'flex', justifyContent: 'space-between', marginBottom: '0.8rem' }}>
              <span style={{ fontSize: '0.85rem', color: 'var(--text-secondary)' }}>Turret Speed Target</span>
              <span style={{ fontSize: '1.1rem', fontWeight: '800', color: isStopped ? 'var(--text-muted)' : 'var(--primary)' }}>
                {isStopped ? '0' : rpm} RPM
              </span>
            </div>

            <input
              type="range"
              min="0"
              max="120"
              value={isStopped ? 0 : rpm}
              disabled={isStopped}
              onChange={(e) => setRpm(Number(e.target.value))}
              className="rpm-slider"
            />
            
            <div style={{ display: 'flex', justifyContent: 'space-between', fontSize: '0.75rem', color: 'var(--text-muted)', marginTop: '0.4rem' }}>
              <span>0 (Stationary)</span>
              <span>60 (Medium)</span>
              <span>120 (Max Press Speed)</span>
            </div>
          </div>

          {/* Interactive B2B Lockout Buttons */}
          <div style={{ display: 'flex', flexDirection: 'column', gap: '1rem', marginTop: 'auto' }}>
            {!isStopped ? (
              <button 
                onClick={triggerEmergencyStop}
                className="btn-estop"
              >
                <ShieldAlert size={20} />
                <span>EMERGENCY STOP (E-STOP)</span>
              </button>
            ) : (
              <button 
                onClick={resetSystem}
                className="btn-reset"
              >
                <RotateCcw size={18} />
                <span>Reset Compression Motor</span>
              </button>
            )}

            <div className="security-banner">
              <AlertTriangle size={14} style={{ color: isStopped ? '#ef4444' : 'var(--secondary)', flexShrink: 0 }} />
              <p style={{ fontSize: '0.78rem', color: 'var(--text-secondary)', lineHeight: '1.3' }}>
                {isStopped 
                  ? "EMERGENCY SAFETY ENGAGED. Press motor decelerated. Clear safety barriers before resetting system."
                  : "Caution: Operating above 100 RPM increases core turret friction temperature. Keep automatic nitrogen purge activated."
                }
              </p>
            </div>
          </div>
        </div>

        {/* CENTER COLUMN: Real-Time WebGL 3D Rotary Turret */}
        <div className="dashboard-viewport glass-panel" style={{ position: 'relative', overflow: 'hidden' }}>
          <div style={{
            position: 'absolute',
            top: '1.2rem',
            left: '1.2rem',
            zIndex: 10,
            pointerEvents: 'none'
          }}>
            <span style={{ fontSize: '0.72rem', color: 'var(--text-muted)', textTransform: 'uppercase', letterSpacing: '0.05em' }}>
              WebGL 3D Core Viewport
            </span>
            <h4 style={{ fontSize: '1rem', color: '#fff', marginTop: '0.1rem' }}>Active Turret Pressing</h4>
          </div>

          {/* Canvas Viewport */}
          <div style={{ width: '100%', height: '320px', cursor: 'grab' }}>
            <Canvas
              camera={{ position: [0, 1.8, 3.2], fov: 45 }}
              gl={{ antialias: true, alpha: true }}
            >
              <ambientLight intensity={0.5} />
              <pointLight position={[6, 6, 6]} intensity={1.8} color="#06b6d4" />
              <pointLight position={[-6, -6, -6]} intensity={1.0} color="#3b82f6" />
              <directionalLight position={[0, 5, 2]} intensity={1.2} color="#ffffff" />
              
              <RotaryTurret3D rpm={rpm} isStopped={isStopped} />
              
              <OrbitControls enableZoom={false} maxPolarAngle={Math.PI / 2} minPolarAngle={Math.PI / 4} />
            </Canvas>
          </div>

          {/* Interactive instruction tag */}
          <div style={{
            position: 'absolute',
            bottom: '1rem',
            right: '1rem',
            fontSize: '0.72rem',
            color: 'var(--text-muted)',
            display: 'flex',
            alignItems: 'center',
            gap: '0.4rem',
            pointerEvents: 'none'
          }}>
            <Zap size={12} style={{ color: 'var(--primary)' }} />
            <span>Drag to rotate WebGL machinery</span>
          </div>
        </div>

        {/* RIGHT COLUMN: Live Telemetry Gauges */}
        <div className="dashboard-stats">
          {/* Output Count (Big Number) */}
          <TiltCard className="stat-card glass-panel" style={{ gridColumn: 'span 2', display: 'flex', justifyContent: 'space-between', alignItems: 'center', padding: '1.8rem 2.2rem' }}>
            <div style={{ transform: 'translateZ(30px)' }}>
              <span style={{ fontSize: '0.75rem', color: 'var(--text-muted)', textTransform: 'uppercase', letterSpacing: '0.05em' }}>
                Batch Pressed Counter
              </span>
              <h3 style={{ fontSize: '2.5rem', fontWeight: '800', color: '#fff', marginTop: '0.2rem', fontFamily: 'monospace' }}>
                {tabletsProduced.toLocaleString()}
              </h3>
            </div>
            <div 
              className="dept-icon-wrapper" 
              style={{ 
                color: 'var(--accent)', 
                background: 'rgba(20, 184, 166, 0.1)', 
                borderColor: 'rgba(20, 184, 166, 0.2)',
                transform: 'translateZ(45px)'
              }}
            >
              <Gauge size={28} />
            </div>
          </TiltCard>

          {/* Hourly Output Rate */}
          <TiltCard className="stat-card glass-panel" style={{ padding: '1.2rem 1.5rem' }}>
            <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', transform: 'translateZ(30px)' }}>
              <span style={{ fontSize: '0.75rem', color: 'var(--text-secondary)' }}>Hourly Rate</span>
              <TrendingUp size={16} style={{ color: 'var(--primary)' }} />
            </div>
            <h4 style={{ fontSize: '1.5rem', fontWeight: '700', color: '#fff', marginTop: '0.5rem', transform: 'translateZ(40px)' }}>
              {currentOutputRate.toLocaleString()} <span style={{ fontSize: '0.8rem', color: 'var(--text-muted)' }}>T/hr</span>
            </h4>
            <p style={{ fontSize: '0.75rem', color: 'var(--text-muted)', marginTop: '0.2rem', transform: 'translateZ(20px)' }}>
              At current RPM frequency
            </p>
          </TiltCard>

          {/* Compression Force */}
          <TiltCard className="stat-card glass-panel" style={{ padding: '1.2rem 1.5rem' }}>
            <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', transform: 'translateZ(30px)' }}>
              <span style={{ fontSize: '0.75rem', color: 'var(--text-secondary)' }}>Compression Force</span>
              <Zap size={16} style={{ color: 'var(--secondary)' }} />
            </div>
            <h4 style={{ fontSize: '1.5rem', fontWeight: '700', color: '#fff', marginTop: '0.5rem', transform: 'translateZ(40px)' }}>
              {compressionForceVal} <span style={{ fontSize: '0.8rem', color: 'var(--text-muted)' }}>kN</span>
            </h4>
            <p style={{ fontSize: '0.75rem', color: 'var(--text-muted)', marginTop: '0.2rem', transform: 'translateZ(20px)' }}>
              Punch die squeeze load
            </p>
          </TiltCard>

          {/* Core Temperature */}
          <TiltCard className="stat-card glass-panel" style={{ padding: '1.2rem 1.5rem' }}>
            <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', transform: 'translateZ(30px)' }}>
              <span style={{ fontSize: '0.75rem', color: 'var(--text-secondary)' }}>Core Temp</span>
              <Flame size={16} style={{ color: temperature > 40 ? '#ef4444' : 'var(--primary)' }} />
            </div>
            <h4 style={{ 
              fontSize: '1.5rem', 
              fontWeight: '700', 
              color: temperature > 40 ? '#ef4444' : '#fff', 
              marginTop: '0.5rem',
              transform: 'translateZ(40px)'
            }}>
              {temperature} <span style={{ fontSize: '0.8rem', color: 'var(--text-muted)' }}>°C</span>
            </h4>
            <p style={{ fontSize: '0.75rem', color: 'var(--text-muted)', marginTop: '0.2rem', transform: 'translateZ(20px)' }}>
              Friction safety limit: 55°C
            </p>
          </TiltCard>

          {/* Vibration Frequency */}
          <TiltCard className="stat-card glass-panel" style={{ padding: '1.2rem 1.5rem' }}>
            <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', transform: 'translateZ(30px)' }}>
              <span style={{ fontSize: '0.75rem', color: 'var(--text-secondary)' }}>Vibration Index</span>
              <Activity size={16} style={{ color: 'var(--accent)' }} />
            </div>
            <h4 style={{ fontSize: '1.5rem', fontWeight: '700', color: '#fff', marginTop: '0.5rem', transform: 'translateZ(40px)' }}>
              {vibrationIndex} <span style={{ fontSize: '0.8rem', color: 'var(--text-muted)' }}>Hz</span>
            </h4>
            <p style={{ fontSize: '0.75rem', color: 'var(--text-muted)', marginTop: '0.2rem', transform: 'translateZ(20px)' }}>
              Drive structural frequency
            </p>
          </TiltCard>
        </div>
      </div>

      {/* BOTTOM SECTION: Live Diagnostics Force Wave Chart & Terminal logs */}
      <div className="dashboard-charts glass-panel" style={{ marginTop: '2.5rem', padding: '2rem' }}>
        {/* Navigation tabs inside the chart container */}
        <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', borderBottom: '1px solid var(--glass-border)', paddingBottom: '1rem', marginBottom: '1.5rem', flexWrap: 'wrap', gap: '1rem' }}>
          <div style={{ display: 'flex', gap: '1.5rem' }}>
            <button 
              className={`chart-tab ${activeTab === 'telemetry' ? 'active' : ''}`}
              onClick={() => setActiveTab('telemetry')}
            >
              <Activity size={14} />
              <span>Real-Time Force Consistency Wave</span>
            </button>
            <button 
              className={`chart-tab ${activeTab === 'logs' ? 'active' : ''}`}
              onClick={() => setActiveTab('logs')}
            >
              <ShieldAlert size={14} />
              <span>Event Diagnostics Logger</span>
            </button>
          </div>
          <span style={{ fontSize: '0.75rem', color: 'var(--text-muted)', fontFamily: 'monospace' }}>
            REFRESH RATE: 60FPS / 150MS SAMPLING
          </span>
        </div>

        {/* Tab 1: Real-time SVG chart plotting force wave */}
        {activeTab === 'telemetry' && (
          <div style={{ position: 'relative' }}>
            {/* SVG Plot */}
            <svg viewBox="0 0 100 100" preserveAspectRatio="none" style={{ width: '100%', height: '140px', display: 'block', overflow: 'visible' }}>
              {/* Grid lines */}
              <line x1="0" y1="20" x2="100" y2="20" stroke="rgba(255,255,255,0.05)" strokeWidth="0.5" />
              <line x1="0" y1="50" x2="100" y2="50" stroke="rgba(255,255,255,0.05)" strokeWidth="0.5" />
              <line x1="0" y1="80" x2="100" y2="80" stroke="rgba(255,255,255,0.05)" strokeWidth="0.5" />

              {/* Shaded Area under the wave path */}
              {chartData.length > 0 && (
                <path
                  d={`M 0,100 L ${svgPath} L 100,100 Z`}
                  fill="url(#chart-gradient)"
                  opacity="0.15"
                />
              )}

              {/* Glowing Wave Path */}
              {chartData.length > 0 && (
                <path
                  d={`M ${svgPath}`}
                  fill="none"
                  stroke={isStopped ? '#ef4444' : 'var(--primary)'}
                  strokeWidth="1.5"
                  strokeLinecap="round"
                  strokeLinejoin="round"
                  style={{
                    filter: isStopped ? 'none' : 'drop-shadow(0px 0px 8px rgba(6, 182, 212, 0.6))',
                    transition: 'stroke 0.3s ease'
                  }}
                />
              )}

              {/* Gradients declaration */}
              <defs>
                <linearGradient id="chart-gradient" x1="0" y1="0" x2="0" y2="1">
                  <stop offset="0%" stopColor="var(--primary)" />
                  <stop offset="100%" stopColor="var(--primary)" stopOpacity="0" />
                </linearGradient>
              </defs>
            </svg>

            {/* Labels and legends */}
            <div style={{ display: 'flex', justifyContent: 'space-between', fontSize: '0.72rem', color: 'var(--text-muted)', marginTop: '0.8rem' }}>
              <span>-4.5s ago (Historical)</span>
              <span style={{ color: isStopped ? '#ef4444' : 'var(--primary)', fontWeight: '600' }}>
                {isStopped ? 'Flatline (0 kN)' : `Nominal Compression Range: ${Math.round(compressionForceVal - 4)} - ${Math.round(compressionForceVal + 4)} kN`}
              </span>
              <span>Active Telemetry (Live)</span>
            </div>
          </div>
        )}

        {/* Tab 2: Terminal Logs Feed */}
        {activeTab === 'logs' && (
          <div className="terminal-logs">
            <div style={{ display: 'flex', flexDirection: 'column', gap: '0.4rem', maxHeight: '140px', overflowY: 'auto', paddingRight: '0.5rem' }}>
              {logs.map((log) => (
                <div key={log.id} style={{ display: 'flex', gap: '1rem', fontSize: '0.82rem', fontFamily: 'monospace', lineHeight: '1.4' }}>
                  <span style={{ color: 'var(--text-muted)' }}>[{log.time}]</span>
                  <span style={{
                    color: log.type === 'danger' ? '#ef4444' : log.type === 'success' ? '#10b981' : 'var(--text-secondary)'
                  }}>
                    {log.text}
                  </span>
                </div>
              ))}
            </div>
          </div>
        )}
      </div>
    </section>
  );
}
