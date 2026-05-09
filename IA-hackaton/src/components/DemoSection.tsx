import React from 'react';
import { motion } from 'framer-motion';
import { Terminal, ArrowRight, Shield, Zap } from 'lucide-react';

const steps = [
  {
    step: '01',
    title: 'Install & Run',
    code: `pip install -r requirements.txt\nuvicorn app.main:app --reload`,
  },
  {
    step: '02',
    title: 'Register User',
    code: `curl -X POST http://localhost:8000/auth/register \\
  -H "Content-Type: application/json" \\
  -d '{"username":"demo","email":"demo@test.com","password":"Pass123!"}'`,
  },
  {
    step: '03',
    title: 'Login & Get Token',
    code: `curl -X POST http://localhost:8000/auth/login \\
  -d "username=demo&password=Pass123!"`,
  },
  {
    step: '04',
    title: 'Upload Faces',
    code: `curl -X POST http://localhost:8000/upload/faces \\
  -H "Authorization: Bearer <token>" \\
  -F "files=@face1.jpg" \\
  -F "files=@face2.jpg"`,
  },
];

const DemoSection: React.FC = () => {
  return (
    <section id="demo" className="relative py-24 sm:py-32">
      <div className="relative z-10 max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        {/* Header */}
        <div className="text-center mb-16">
          <span className="inline-block px-3 py-1 rounded-full text-xs font-medium tracking-wider uppercase text-primary bg-primary/10 shield-border mb-4">
            Quick Start
          </span>
          <h2 className="text-3xl sm:text-4xl font-bold tracking-tight text-foreground mb-4">
            Up and running in <span className="text-gradient">4 steps</span>
          </h2>
          <p className="max-w-xl mx-auto text-muted-foreground">
            From installation to face enrollment — test everything via Swagger at{' '}
            <code className="text-primary font-mono text-sm">localhost:8000/docs</code>
          </p>
        </div>

        {/* Steps */}
        <div className="space-y-4 max-w-3xl mx-auto">
          {steps.map((s, idx) => (
            <motion.div
              key={s.step}
              initial={{ opacity: 0, x: -20 }}
              whileInView={{ opacity: 1, x: 0 }}
              viewport={{ once: true }}
              transition={{ duration: 0.4, delay: idx * 0.1 }}
              className="group rounded-xl bg-card/60 shield-border overflow-hidden transition-all duration-300 hover:shield-border-hover"
            >
              <div className="flex items-center gap-4 px-5 py-3.5 border-b border-border/50">
                <span className="text-lg font-bold text-gradient font-mono">{s.step}</span>
                <span className="text-sm font-semibold text-foreground">{s.title}</span>
                <Terminal className="w-4 h-4 text-muted-foreground ml-auto" />
              </div>
              <pre className="p-5 text-xs font-mono text-muted-foreground overflow-x-auto leading-relaxed">
                {s.code}
              </pre>
            </motion.div>
          ))}
        </div>

        {/* Next module teaser */}
        <motion.div
          initial={{ opacity: 0, y: 24 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true }}
          transition={{ duration: 0.6, delay: 0.3 }}
          className="mt-16 max-w-3xl mx-auto p-6 rounded-xl bg-gradient-to-r from-primary/5 to-primary/[0.02] shield-border text-center"
        >
          <div className="flex items-center justify-center gap-3 mb-3">
            <Zap className="w-5 h-5 text-primary" />
            <span className="text-sm font-semibold text-foreground">Coming Next: Live Anonymization Module</span>
          </div>
          <p className="text-sm text-muted-foreground max-w-lg mx-auto mb-4">
            The face embeddings stored by this module will power real-time camera feed
            anonymization — detecting known users and pixelating unregistered faces on the fly.
          </p>
          <div className="inline-flex items-center gap-2 text-xs text-primary font-medium">
            <Shield className="w-3.5 h-3.5" />
            Module 2 — Privacy-First Live Stream Processing
            <ArrowRight className="w-3.5 h-3.5" />
          </div>
        </motion.div>
      </div>
    </section>
  );
};

export default DemoSection;
