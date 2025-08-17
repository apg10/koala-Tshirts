import os, json

# Orígenes por defecto para dev
DEFAULT_ALLOWED = [
    "http://localhost:5173",
    "http://127.0.0.1:5173",
    "http://localhost:3000",
    "http://127.0.0.1:3000",
]

def _parse_allowed(val):
    """Acepta JSON (lista) o lista separada por comas."""
    if not val:
        return []
    try:
        parsed = json.loads(val)
        if isinstance(parsed, list):
            return [str(x).strip() for x in parsed if str(x).strip()]
    except json.JSONDecodeError:
        pass
    return [x.strip() for x in val.split(",") if x.strip()]

# Lee ALLOWED_ORIGINS del .env (en cualquiera de los dos formatos)
ALLOWED_ORIGINS = _parse_allowed(os.getenv("ALLOWED_ORIGINS", ""))

# (Opcional) añade tu IP LAN automáticamente si defines DEV_LAN_IP
# Ej: DEV_LAN_IP=192.168.1.34  -> añade http://192.168.1.34:5173 y :3000
DEV_LAN_IP = os.getenv("DEV_LAN_IP", "").strip()
if DEV_LAN_IP:
    ALLOWED_ORIGINS.extend([
        f"http://{DEV_LAN_IP}:5173",
        f"http://{DEV_LAN_IP}:3000",
    ])

# Dedupe preservando orden (primero defaults, luego .env)
seen = set()
ALLOWED_ORIGINS = [
    o for o in [*DEFAULT_ALLOWED, *ALLOWED_ORIGINS]
    if not (o in seen or seen.add(o))
]

# Regex opcional para permitir rangos de IP en dev (localhost, 192.168.*, 10.*)
ALLOW_ORIGIN_REGEX = os.getenv(
    "ALLOW_ORIGIN_REGEX",
    r"http://(localhost|127\.0\.0\.1|192\.168\.\d{1,3}\.\d{1,3}|10\.\d{1,3}\.\d{1,3}\.\d{1,3}):\d+"
)

# ---- Stripe / impuestos ----
STRIPE_SECRET_KEY      = os.getenv("STRIPE_SECRET_KEY")
STRIPE_PUBLISHABLE_KEY = os.getenv("STRIPE_PUBLISHABLE_KEY")
STRIPE_WEBHOOK_SECRET  = os.getenv("STRIPE_WEBHOOK_SECRET")
STRIPE_CURRENCY        = os.getenv("STRIPE_CURRENCY", "usd")
TAX_RATE               = float(os.getenv("TAX_RATE", "0.10"))
