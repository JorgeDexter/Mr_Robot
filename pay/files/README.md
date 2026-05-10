# x402 Demo — Python + Solana

Demo funcional del protocolo x402 sobre Solana Devnet.

## Instalación

```bash
pip install fastapi uvicorn httpx solana solders pydantic
```

## Configuración

Edita las variables en `server.py` o exportalas como variables de entorno:

```bash
export RECIPIENT_PUBKEY="tu_wallet_publica_solana"
export FEE_PAYER_PUBKEY="pubkey_del_facilitador_kora"
```

> **Facilitador usado:** [Kora](https://kora.io) — facilitador público para Solana Devnet.
> No necesitás correr uno propio para la demo.

## Levantar el server

```bash
uvicorn server:app --reload
```

El servidor corre en `http://localhost:8000`.

## Probar el flujo

**Opción A — curl manual:**

```bash
# 1. Llamar sin pago → devuelve 402
curl -i http://localhost:8000/api/recurso

# 2. Ver los requisitos de pago en claro
curl http://localhost:8000/api/recurso/info | python3 -m json.tool
```

**Opción B — cliente Python:**

```bash
# Genera una keypair de prueba en devnet (necesitás solana CLI)
solana-keygen new --outfile demo-wallet.json
solana airdrop 1 $(solana-keygen pubkey demo-wallet.json) --url devnet

# Convertir a hex y correr el cliente
python client.py --key <private_key_hex>
```

## Flujo del protocolo

```
Cliente                    Server                  Facilitador (Kora)
  │                          │                           │
  │── GET /api/recurso ──────>│                           │
  │<── 402 + PAYMENT-REQUIRED │                           │
  │                          │                           │
  │  [firma la tx Solana]    │                           │
  │                          │                           │
  │── GET /api/recurso ──────>│                           │
  │   + PAYMENT-SIGNATURE    │── POST /verify ──────────>│
  │                          │<── {isValid: true} ───────│
  │<── 200 + recurso ─────────│                           │
```

## Endpoints

| Método | Ruta | Descripción |
|--------|------|-------------|
| GET | `/` | Info del servidor |
| GET | `/api/recurso` | **Recurso protegido** — requiere pago |
| GET | `/api/recurso/info` | Devuelve los requisitos de pago sin cobrar |

## Notas para producción

- Reemplazar `create_payment_signature` en `client.py` con la tx SPL token real usando `x402-solana`
- Cambiar `USDC_MINT_DEVNET` y `NETWORK` a mainnet
- Agregar manejo de errores del facilitador (timeout, fondos insuficientes, etc.)
- El facilitador de Kora cubre las fees de red (el cliente no necesita SOL)
