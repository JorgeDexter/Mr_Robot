"""
FaceShield — Main FastAPI Application
Privacy-first face enrollment system.
"""

from fastapi import FastAPI
from fastapi.middleware.cors import CORSMiddleware

from app.config import settings
from app.database import init_db
from app.routes import auth, users, upload

# Create application
app = FastAPI(
    title=settings.APP_NAME,
    version=settings.APP_VERSION,
    description=(
        "Privacy-first face enrollment API. "
        "Register users, upload face images, generate facial embeddings — "
        "all processed and stored locally."
    ),
    docs_url="/docs",
    redoc_url="/redoc",
)

# CORS (permissive for local dev/demo)
app.add_middleware(
    CORSMiddleware,
    allow_origins=["*"],
    allow_credentials=True,
    allow_methods=["*"],
    allow_headers=["*"],
)

# Include routers
app.include_router(auth.router)
app.include_router(users.router)
app.include_router(upload.router)


@app.on_event("startup")
def on_startup():
    """Initialize database tables on app startup."""
    init_db()


@app.get("/", tags=["Health"])
def root():
    """Health check endpoint."""
    return {
        "app": settings.APP_NAME,
        "version": settings.APP_VERSION,
        "status": "running",
        "docs": "/docs",
    }


@app.get("/health", tags=["Health"])
def health_check():
    return {"status": "healthy"}
