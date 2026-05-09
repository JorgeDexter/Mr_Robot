import React from 'react';
import { Shield, UserPlus, Upload, ScanFace, Database, Lock } from 'lucide-react';
import { motion } from 'framer-motion';

const features = [
  {
    icon: UserPlus,
    title: 'Secure Registration',
    description: 'Create accounts with bcrypt-hashed passwords and JWT authentication. No data leaves your machine.',
  },
  {
    icon: ScanFace,
    title: 'Face Detection',
    description: 'Automatic face detection on upload. Images without detectable faces are rejected instantly.',
  },
  {
    icon: Upload,
    title: 'Multi-Photo Upload',
    description: 'Upload multiple reference photos per user. Each image is validated, processed, and stored locally.',
  },
  {
    icon: Database,
    title: 'Local Embeddings',
    description: '128-dimensional face encodings generated locally via face_recognition and stored in SQLite.',
  },
  {
    icon: Lock,
    title: 'JWT Auth',
    description: 'Every API call is authenticated. Tokens expire automatically. Full OpenAPI/Swagger docs included.',
  },
  {
    icon: Shield,
    title: 'Future-Ready',
    description: 'Modular architecture designed for live camera feed anonymization in the next sprint.',
  },
];

const container = {
  hidden: {},
  visible: {
    transition: { staggerChildren: 0.1 },
  },
};

const item = {
  hidden: { opacity: 0, y: 24 },
  visible: { opacity: 1, y: 0, transition: { duration: 0.5 } },
};

const FeaturesSection: React.FC = () => {
  return (
    <section id="features" className="relative py-24 sm:py-32">
      <div className="absolute inset-0 bg-dots opacity-20" />

      <div className="relative z-10 max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        {/* Section Header */}
        <div className="text-center mb-16">
          <span className="inline-block px-3 py-1 rounded-full text-xs font-medium tracking-wider uppercase text-primary bg-primary/10 shield-border mb-4">
            Core Features
          </span>
          <h2 className="text-3xl sm:text-4xl font-bold tracking-tight text-foreground mb-4">
            Everything runs <span className="text-gradient">locally</span>
          </h2>
          <p className="max-w-xl mx-auto text-muted-foreground">
            A complete face enrollment pipeline — authentication, upload, detection,
            encoding — with zero cloud dependency.
          </p>
        </div>

        {/* Feature Grid */}
        <motion.div
          variants={container}
          initial="hidden"
          whileInView="visible"
          viewport={{ once: true, margin: '-80px' }}
          className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-5"
        >
          {features.map((feature) => (
            <motion.div
              key={feature.title}
              variants={item}
              className="group relative p-6 rounded-xl bg-card/60 shield-border transition-all duration-300 hover:shield-border-hover hover:bg-card"
            >
              {/* Hover glow */}
              <div className="absolute inset-0 rounded-xl bg-primary/[0.02] opacity-0 group-hover:opacity-100 transition-opacity duration-300" />

              <div className="relative z-10">
                <div className="w-10 h-10 rounded-lg bg-primary/10 flex items-center justify-center mb-4 group-hover:bg-primary/15 transition-colors duration-300">
                  <feature.icon className="w-5 h-5 text-primary" />
                </div>
                <h3 className="text-base font-semibold text-foreground mb-2">
                  {feature.title}
                </h3>
                <p className="text-sm text-muted-foreground leading-relaxed">
                  {feature.description}
                </p>
              </div>
            </motion.div>
          ))}
        </motion.div>
      </div>
    </section>
  );
};

export default FeaturesSection;
