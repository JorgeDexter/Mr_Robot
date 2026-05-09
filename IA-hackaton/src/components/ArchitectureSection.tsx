import React from 'react';
import { motion } from 'framer-motion';
import { Server, Database, FolderOpen, Shield, ArrowRight } from 'lucide-react';

const layers = [
  {
    icon: Server,
    label: 'FastAPI Routes',
    color: 'text-primary',
    bg: 'bg-primary/10',
    items: ['/auth/register', '/auth/login', '/users/me', '/upload/faces'],
  },
  {
    icon: Shield,
    label: 'Service Layer',
    color: 'text-primary',
    bg: 'bg-primary/10',
    items: ['auth_service', 'face_service', 'storage_service'],
  },
  {
    icon: Database,
    label: 'SQLite + SQLAlchemy',
    color: 'text-primary',
    bg: 'bg-primary/10',
    items: ['User model', 'FaceData model', 'Relationships'],
  },
  {
    icon: FolderOpen,
    label: 'Local Storage',
    color: 'text-primary',
    bg: 'bg-primary/10',
    items: ['uploads/{user_id}/', 'face_encodings', 'image_validation'],
  },
];

const ArchitectureSection: React.FC = () => {
  return (
    <section id="architecture" className="relative py-24 sm:py-32">
      <div className="relative z-10 max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        {/* Section Header */}
        <div className="text-center mb-16">
          <span className="inline-block px-3 py-1 rounded-full text-xs font-medium tracking-wider uppercase text-primary bg-primary/10 shield-border mb-4">
            Architecture
          </span>
          <h2 className="text-3xl sm:text-4xl font-bold tracking-tight text-foreground mb-4">
            Clean, <span className="text-gradient">modular</span> backend
          </h2>
          <p className="max-w-xl mx-auto text-muted-foreground">
            A layered Python architecture with clear separation of concerns — ready for
            the live anonymization module.
          </p>
        </div>

        {/* Architecture Flow */}
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4">
          {layers.map((layer, idx) => (
            <motion.div
              key={layer.label}
              initial={{ opacity: 0, y: 24 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true }}
              transition={{ duration: 0.5, delay: idx * 0.12 }}
              className="relative"
            >
              <div className="p-5 rounded-xl bg-card/60 shield-border h-full">
                {/* Layer header */}
                <div className="flex items-center gap-3 mb-4">
                  <div className={`w-9 h-9 rounded-lg ${layer.bg} flex items-center justify-center`}>
                    <layer.icon className={`w-4.5 h-4.5 ${layer.color}`} />
                  </div>
                  <span className="text-sm font-semibold text-foreground">{layer.label}</span>
                </div>

                {/* Items */}
                <div className="space-y-2">
                  {layer.items.map((it) => (
                    <div
                      key={it}
                      className="flex items-center gap-2 text-xs text-muted-foreground font-mono"
                    >
                      <span className="w-1 h-1 rounded-full bg-primary/50" />
                      {it}
                    </div>
                  ))}
                </div>
              </div>

              {/* Arrow connector (not on last item) */}
              {idx < layers.length - 1 && (
                <div className="hidden lg:flex absolute top-1/2 -right-4 -translate-y-1/2 z-20">
                  <ArrowRight className="w-4 h-4 text-primary/30" />
                </div>
              )}
            </motion.div>
          ))}
        </div>

        {/* File tree */}
        <motion.div
          initial={{ opacity: 0, y: 24 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true }}
          transition={{ duration: 0.6, delay: 0.3 }}
          className="mt-12 max-w-2xl mx-auto p-6 rounded-xl bg-card/60 shield-border"
        >
          <h3 className="text-sm font-semibold text-foreground mb-4">Project Structure</h3>
          <pre className="text-xs leading-relaxed text-muted-foreground font-mono overflow-x-auto">
{`app/
├── main.py              # FastAPI application entry
├── database.py          # SQLAlchemy engine & session
├── config.py            # Environment configuration
├── models/
│   ├── user.py          # User SQLAlchemy model
│   └── face_data.py     # FaceData model + encoding
├── schemas/
│   ├── user.py          # Pydantic request/response
│   └── auth.py          # Auth token schemas
├── routes/
│   ├── auth.py          # /auth/register, /auth/login
│   ├── users.py         # /users/me
│   └── upload.py        # /upload/faces
├── services/
│   ├── auth_service.py  # JWT + password logic
│   ├── face_service.py  # Detection & encoding
│   └── storage_service.py
├── utils/
│   ├── security.py      # Hashing & token helpers
│   └── image_utils.py   # Validation & processing
└── uploads/             # Local image storage`}
          </pre>
        </motion.div>
      </div>
    </section>
  );
};

export default ArchitectureSection;
