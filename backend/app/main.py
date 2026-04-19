from fastapi import FastAPI
from fastapi.middleware.cors import CORSMiddleware
from slowapi.errors import RateLimitExceeded
from slowapi.middleware import SlowAPIMiddleware
from slowapi import _rate_limit_exceeded_handler

from app.api.router import api_router
from app.core.config import get_settings
from app.core.rate_limit import limiter

settings = get_settings()

app = FastAPI(title=settings.app_name, debug=settings.debug)
app.state.limiter = limiter
app.add_exception_handler(RateLimitExceeded, _rate_limit_exceeded_handler)
app.add_middleware(SlowAPIMiddleware)
app.add_middleware(
    CORSMiddleware,
    allow_origins=settings.cors_origins,
    allow_credentials=True,
    allow_methods=["*"],
    allow_headers=["*"],
)
app.include_router(api_router, prefix=settings.api_v1_prefix)


@app.get("/health")
def healthcheck() -> dict[str, str]:
    return {"status": "ok"}
