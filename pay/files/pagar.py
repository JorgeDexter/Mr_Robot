import asyncio
import base64
import json
import getpass
import struct
import httpx
from solders.keypair import Keypair
from solders.pubkey import Pubkey
from solders.instruction import Instruction, AccountMeta
from solders.message import Message
from solders.transaction import Transaction
from solana.rpc.async_api import AsyncClient
from solana.rpc.types import TokenAccountOpts

SERVER_URL = "http://localhost:8000/api/recurso"
DEVNET_RPC = "https://api.devnet.solana.com"
USDC_MINT  = Pubkey.from_string("4zMMC9srt5Ri5X14GAgXhaHii3GnPAEERYPJgZJDncDU")
TOKEN_PROGRAM = Pubkey.from_string("TokenkegQfeZyiNwAJbNbGKPFXCWuBvf9Ss623VQ5DA")

def encode_header(data: dict) -> str:
    return base64.b64encode(json.dumps(data).encode()).decode()

def decode_header(value: str) -> dict:
    return json.loads(base64.b64decode(value).decode())

async def main(private_key: str):
    # Cargar keypair
    try:
        keypair = Keypair.from_base58_string(private_key)
    except Exception:
        try:
            keypair = Keypair.from_bytes(bytes(json.loads(private_key)))
        except Exception:
            keypair = Keypair.from_bytes(bytes.fromhex(private_key))

    print(f"[pago] Wallet: {keypair.pubkey()}")

    async with httpx.AsyncClient() as http:
        # Paso 1: pedir el recurso sin pago
        print("\n[1] Solicitando recurso sin pago...")
        resp = await http.get(SERVER_URL)
        print(f"    Status: {resp.status_code}")
        assert resp.status_code == 402

        requirements = decode_header(resp.headers["payment-required"])["accepts"][0]
        recipient = Pubkey.from_string(requirements["payTo"])
        amount    = int(requirements["amount"])
        print(f"    Pagar {amount} microUSDC a {recipient}")

        # Paso 2: obtener token accounts
        print("\n[2] Construyendo transacción USDC...")
        async with AsyncClient(DEVNET_RPC) as rpc:
            # Token account del pagador
            sender_resp = await rpc.get_token_accounts_by_owner(
                keypair.pubkey(),
                TokenAccountOpts(mint=USDC_MINT),
            )
            sender_ata = Pubkey.from_string(str(sender_resp.value[0].pubkey))

            # Token account del receptor
            recipient_resp = await rpc.get_token_accounts_by_owner(
                recipient,
                TokenAccountOpts(mint=USDC_MINT),
            )
            recipient_ata = Pubkey.from_string(str(recipient_resp.value[0].pubkey))

            print(f"    Sender ATA:    {sender_ata}")
            print(f"    Recipient ATA: {recipient_ata}")

            # Instrucción SPL Token Transfer (opcode 3)
            data = struct.pack("<BQ", 3, amount)
            keys = [
                AccountMeta(pubkey=sender_ata,       is_signer=False, is_writable=True),
                AccountMeta(pubkey=recipient_ata,    is_signer=False, is_writable=True),
                AccountMeta(pubkey=keypair.pubkey(), is_signer=True,  is_writable=False),
            ]
            ix = Instruction(TOKEN_PROGRAM, data, keys)

            # Obtener blockhash y firmar
            bh_resp  = await rpc.get_latest_blockhash()
            blockhash = bh_resp.value.blockhash
            msg = Message.new_with_blockhash([ix], keypair.pubkey(), blockhash)
            tx  = Transaction.new_unsigned(msg)
            tx.sign([keypair], blockhash)

            # Enviar a devnet
            print("\n[3] Enviando transacción a Solana devnet...")
            tx_resp = await rpc.send_transaction(tx)
            tx_sig  = str(tx_resp.value)
            print(f"    Firma: {tx_sig}")

        # Paso 3: presentar el pago al servidor
        print("\n[espera] Esperando confirmación en Solana (5 segundos)...")
        await asyncio.sleep(5)
        print("\n[4] Presentando pago al servidor...")
        payload = {
            "x402Version": 2,
            "scheme": "exact",
            "network": requirements["network"],
            "payload": {
                "signature": tx_sig,
                "amount": str(amount),
                "asset": str(USDC_MINT),
                "payTo": str(recipient),
                "from": str(keypair.pubkey()),
            },
        }
        resp2 = await http.get(SERVER_URL, headers={"PAYMENT-SIGNATURE": encode_header(payload)})
        print(f"    Status: {resp2.status_code}")
        print(json.dumps(resp2.json(), indent=2, ensure_ascii=False))

if __name__ == "__main__":
    pk = getpass.getpass("Pegá tu clave privada de Phantom (no se muestra): ")
    asyncio.run(main(pk.strip()))
