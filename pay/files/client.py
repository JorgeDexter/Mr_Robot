"""
x402 Demo Client — simula el flujo completo de pago.
Requiere: pip install httpx solana solders spl-token

Uso:
    python client.py --key <private_key_hex>
"""

import asyncio
import argparse
import base64
import json
import httpx
from solders.keypair import Keypair
from solders.pubkey import Pubkey
from solana.rpc.async_api import AsyncClient
from solana.rpc.types import TxOpts
from solders.transaction import Transaction
from solders.system_program import transfer, TransferParams


SERVER_URL    = "http://localhost:8000"
ENDPOINT      = f"{SERVER_URL}/api/recurso"
DEVNET_RPC    = "https://api.devnet.solana.com"


def encode_header(data: dict) -> str:
    return base64.b64encode(json.dumps(data).encode()).decode()


def decode_header(value: str) -> dict:
    return json.loads(base64.b64decode(value).decode())


async def create_payment_signature(keypair: Keypair, requirements: dict) -> str:
    """
    Crea y firma una transacción SPL token transfer parcial.
    En la demo simplificada enviamos el payload con la pubkey y el monto.
    En producción usarías x402-solana para crear la tx parcialmente firmada.
    """
    payload = {
        "x402Version": 2,
        "scheme": requirements["scheme"],
        "network": requirements["network"],
        "payload": {
            # En producción: base64 de la tx Solana parcialmente firmada
            # Aquí simulamos la estructura que espera el facilitador
            "signature": str(keypair.pubkey()),
            "amount": requirements["amount"],
            "asset": requirements["asset"],
            "payTo": requirements["payTo"],
            "from": str(keypair.pubkey()),
        },
    }
    return encode_header(payload)


async def main(private_key_hex: str):
    keypair = Keypair.from_bytes(bytes.fromhex(private_key_hex))
    print(f"[cliente] Wallet: {keypair.pubkey()}")

    async with httpx.AsyncClient() as client:

        # ── Paso 1: Llamar al endpoint sin pago ──────────────────────────────
        print(f"\n[1] GET {ENDPOINT} (sin pago)...")
        resp = await client.get(ENDPOINT)
        print(f"    Status: {resp.status_code}")

        if resp.status_code != 402:
            print("    No era 402, algo falló.")
            return

        # ── Paso 2: Leer los requisitos de pago del header ───────────────────
        payment_required_b64 = resp.headers.get("PAYMENT-REQUIRED")
        if not payment_required_b64:
            print("    No se encontró header PAYMENT-REQUIRED")
            return

        payment_required = decode_header(payment_required_b64)
        requirements = payment_required["accepts"][0]

        print(f"\n[2] Requisitos de pago recibidos:")
        print(f"    Red:    {requirements['network']}")
        print(f"    Monto:  {int(requirements['amount']) / 1_000_000:.6f} USDC")
        print(f"    PayTo:  {requirements['payTo']}")

        # ── Paso 3: Firmar la transacción de pago ────────────────────────────
        print(f"\n[3] Firmando transacción...")
        payment_sig = await create_payment_signature(keypair, requirements)
        print(f"    Payload generado ✓")

        # ── Paso 4: Reintentar con el pago adjunto ───────────────────────────
        print(f"\n[4] GET {ENDPOINT} (con pago)...")
        resp2 = await client.get(
            ENDPOINT,
            headers={"PAYMENT-SIGNATURE": payment_sig},
        )
        print(f"    Status: {resp2.status_code}")

        if resp2.status_code == 200:
            data = resp2.json()
            print(f"\n✅ Acceso concedido:")
            print(json.dumps(data, indent=2, ensure_ascii=False))
        else:
            print(f"\n❌ Pago rechazado:")
            print(resp2.text)


if __name__ == "__main__":
    parser = argparse.ArgumentParser(description="x402 demo client")
    parser.add_argument(
        "--key",
        required=True,
        help="Private key en hex (64 bytes = 128 chars)",
    )
    args = parser.parse_args()
    asyncio.run(main(args.key))
