import React, { useState } from 'react';
import { motion } from 'framer-motion';
import { Copy, Check } from 'lucide-react';

interface Endpoint {
  method: 'POST' | 'GET';
  path: string;
  description: string;
  auth: boolean;
  requestBody?: string;
  response: string;
}

const endpoints: Endpoint[] = [
  {
    method: 'POST',
    path: '/auth/register',
    description: 'Create a new user account',
    auth: false,
    requestBody: `{
  "username": "john_doe",
  "email": "john@example.com",
  "password": "SecureP@ss123"
}`,
    response: `{
  "id": 1,
  "username": "john_doe",
  "email": "john@example.com",
  "created_at": "2026-05-09T12:00:00"
}`,
  },
  {
    method: 'POST',
    path: '/auth/login',
    description: 'Authenticate and receive JWT token',
    auth: false,
    requestBody: `// Form data (OAuth2 spec)
username: john_doe
password: SecureP@ss123`,
    response: `{
  "access_token": "eyJhbGci...",
  "token_type": "bearer"
}`,
  },
  {
    method: 'GET',
    path: '/users/me',
    description: 'Get current authenticated user profile',
    auth: true,
    response: `{
  "id": 1,
  "username": "john_doe",
  "email": "john@example.com",
  "created_at": "2026-05-09T12:00:00",
  "face_count": 3
}`,
  },
  {
    method: 'POST',
    path: '/upload/faces',
    description: 'Upload face images for enrollment',
    auth: true,
    requestBody: `// multipart/form-data
files: [face1.jpg, face2.png]`,
    response: `{
  "uploaded": 2,
  "results": [
    {
      "filename": "face1.jpg",
      "status": "success",
      "face_detected": true
    },
    {
      "filename": "face2.png",
      "status": "success",
      "face_detected": true
    }
  ]
}`,
  },
];

const methodColors: Record<string, string> = {
  POST: 'bg-primary/15 text-primary',
  GET: 'bg-blue-500/15 text-blue-400',
};

const ApiSection: React.FC = () => {
  const [activeIdx, setActiveIdx] = useState(0);
  const [copied, setCopied] = useState(false);
  const active = endpoints[activeIdx];

  const copyToClipboard = (text: string) => {
    navigator.clipboard.writeText(text);
    setCopied(true);
    setTimeout(() => setCopied(false), 2000);
  };

  return (
    <section id="api" className="relative py-24 sm:py-32">
      <div className="absolute inset-0 bg-dots opacity-20" />

      <div className="relative z-10 max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        {/* Header */}
        <div className="text-center mb-16">
          <span className="inline-block px-3 py-1 rounded-full text-xs font-medium tracking-wider uppercase text-primary bg-primary/10 shield-border mb-4">
            API Reference
          </span>
          <h2 className="text-3xl sm:text-4xl font-bold tracking-tight text-foreground mb-4">
            REST <span className="text-gradient">Endpoints</span>
          </h2>
          <p className="max-w-xl mx-auto text-muted-foreground">
            All endpoints are documented via Swagger UI at <code className="text-primary font-mono text-sm">/docs</code>
          </p>
        </div>

        <div className="grid grid-cols-1 lg:grid-cols-12 gap-5">
          {/* Endpoint List */}
          <div className="lg:col-span-4 space-y-2">
            {endpoints.map((ep, idx) => (
              <button
                key={ep.path}
                onClick={() => setActiveIdx(idx)}
                className={`w-full text-left p-4 rounded-xl transition-all duration-200 shield-border ${
                  idx === activeIdx
                    ? 'bg-card shield-border-hover shield-glow'
                    : 'bg-card/40 hover:bg-card/60'
                }`}
              >
                <div className="flex items-center gap-3 mb-1.5">
                  <span className={`px-2 py-0.5 rounded text-[10px] font-bold tracking-wider ${methodColors[ep.method]}`}>
                    {ep.method}
                  </span>
                  <code className="text-sm font-mono text-foreground">{ep.path}</code>
                </div>
                <p className="text-xs text-muted-foreground">{ep.description}</p>
                {ep.auth && (
                  <span className="inline-block mt-2 px-2 py-0.5 rounded text-[10px] font-medium bg-yellow-500/10 text-yellow-500">
                    JWT Required
                  </span>
                )}
              </button>
            ))}
          </div>

          {/* Code Preview */}
          <motion.div
            key={activeIdx}
            initial={{ opacity: 0, x: 10 }}
            animate={{ opacity: 1, x: 0 }}
            transition={{ duration: 0.3 }}
            className="lg:col-span-8 space-y-4"
          >
            {/* Request */}
            {active.requestBody && (
              <div className="rounded-xl bg-card/60 shield-border overflow-hidden">
                <div className="flex items-center justify-between px-4 py-2.5 border-b border-border">
                  <span className="text-xs font-medium text-muted-foreground">Request</span>
                  <button
                    onClick={() => copyToClipboard(active.requestBody!)}
                    className="p-1 rounded hover:bg-secondary transition-colors"
                  >
                    {copied ? (
                      <Check className="w-3.5 h-3.5 text-primary" />
                    ) : (
                      <Copy className="w-3.5 h-3.5 text-muted-foreground" />
                    )}
                  </button>
                </div>
                <pre className="p-4 text-xs font-mono text-muted-foreground overflow-x-auto leading-relaxed">
                  {active.requestBody}
                </pre>
              </div>
            )}

            {/* Response */}
            <div className="rounded-xl bg-card/60 shield-border overflow-hidden">
              <div className="flex items-center justify-between px-4 py-2.5 border-b border-border">
                <span className="text-xs font-medium text-muted-foreground">Response</span>
                <span className="text-[10px] font-mono px-2 py-0.5 rounded bg-primary/10 text-primary">
                  200 OK
                </span>
              </div>
              <pre className="p-4 text-xs font-mono text-muted-foreground overflow-x-auto leading-relaxed">
                {active.response}
              </pre>
            </div>
          </motion.div>
        </div>
      </div>
    </section>
  );
};

export default ApiSection;
