# Handoff técnico — x402 Demo Python + Solana

## Contexto general

Se está construyendo una demo funcional del protocolo de pagos x402 sobre Solana Devnet.
El objetivo es tener un servidor FastAPI en Python que cobre por endpoint usando USDC,
verificando los pagos directamente en la blockchain de Solana.

---

## Estado actual

### Lo que funciona ✅
- El servidor FastAPI (`server.py`) corre correctamente en `http://localhost:8000`
- El endpoint `GET /api/recurso` responde con HTTP 402 + header `PAYMENT-REQUIRED` en base64
- El endpoint `GET /api/recurso/info` devuelve los requisitos de pago en JSON legible
- La wallet del servidor está configurada correctamente: `Hxj6gac2w4SvCx2mvDUf3ugykygynbkKmfcveL6rXJkt`
- El script `pagar.py` genera transacciones SPL token reales en Solana Devnet
- La transacción llega a Solana (se obtiene firma válida)
- La wallet tiene 20 USDC de devnet disponibles

### Lo que NO funciona ❌
- El script `pagar.py` falla al cargar el keypair desde la clave privada en formato base58 de Phantom
- El servidor responde 402 incluso cuando se presenta un pago válido
- La verificación on-chain a veces dice "Transaction not found" por timing

---

## Archivos del proyecto

Ubicación: `/home/luis/Descargas/pay/files/`

### `server.py`
Servidor FastAPI con el flujo x402 completo:
- Responde 402 sin pago
- Verifica transacciones directamente en Solana Devnet vía RPC
- Busca la tx por firma y comprueba que el monto transferido sea >= al requerido

### `pagar.py`
Script cliente que:
1. Llama al endpoint sin pago → recibe 402
2. Lee los requisitos del header
3. Obtiene los token accounts (ATA) del pagador y receptor
4. Construye una instrucción SPL Token Transfer
5. Firma y envía la transacción a Solana Devnet
6. Espera 20 segundos para confirmación
7. Presenta la firma al servidor via header `PAYMENT-SIGNATURE`

---

## Problema principal a resolver

### Error 1 — Keypair desde base58
El script `pagar.py` tiene un bloque try/except que intenta cargar el keypair en 3 formatos.
El formato correcto es base58 (que es lo que exporta Phantom), pero el bloque falla porque
los otros dos intentos (json y hex) generan excepciones que tapan el error real.

**Solución:** Reemplazar todo el bloque try/except de carga del keypair con una sola línea:

```python
keypair = Keypair.from_base58_string(private_key)
```

El bloque a reemplazar está en la función `main()`, alrededor de la línea 28-35:

```python
# ESTO (bloque actual con try/except) → REEMPLAZAR CON:
keypair = Keypair.from_base58_string(private_key)
```

### Error 2 — Timing de verificación
La transacción se envía a Solana pero el servidor la busca antes de que esté confirmada.
El script ya tiene `asyncio.sleep(20)` pero a veces no es suficiente en devnet.

**Solución:** Agregar confirmación explícita antes de presentar el pago. Después de
`send_transaction`, agregar:

```python
# Esperar confirmación real
await rpc.confirm_transaction(tx_sig, commitment="confirmed")
print("    Transacción confirmada en blockchain")
```

Esto bloquea hasta que Solana confirme la tx, en lugar de esperar un tiempo fijo.

### Error 3 — Verificación del monto en server.py
La función `verify_payment` busca el balance diff en `preTokenBalances` y `postTokenBalances`.
En el caso de esta demo, el pagador y el receptor son la misma wallet, entonces el diff
puede ser 0 (se cancela). Necesita manejar este caso especial de demo donde sender == recipient.

**Solución:** En `server.py`, en la función `verify_payment`, después de verificar que
la transacción existe y no tiene error, agregar una condición especial:

```python
# Si sender == recipient (caso demo), verificar solo que la tx existe y no falló
sender = payload.get("payload", {}).get("from")
recipient = payload.get("payload", {}).get("payTo")
if sender == recipient:
    return True, None  # mismo wallet, tx válida es suficiente
```

---

## Datos importantes

| Item | Valor |
|------|-------|
| Wallet pública | `Hxj6gac2w4SvCx2mvDUf3ugykygynbkKmfcveL6rXJkt` |
| Token account (ATA) | `wYmG9tMkRMWy3W7PAgs6JVGadAU2KR3kRAyTEpSDpA7` |
| USDC Mint Devnet | `4zMMC9srt5Ri5X14GAgXhaHii3GnPAEERYPJgZJDncDU` |
| Red | `solana:EtWTRABZaYq6iMfeYKouRu166VU2xqa1` (Devnet) |
| Precio configurado | `10000` microUSDC = 0.01 USDC |
| RPC Devnet | `https://api.devnet.solana.com` |
| Balance USDC | 20 USDC disponibles |
| Balance SOL | Pendiente — necesita SOL para fees |

---

## Dependencias instaladas

```bash
pip install fastapi uvicorn httpx solana solders pydantic
```

---

## SOL pendiente

La wallet no tiene SOL para pagar fees de transacción. Los faucets públicos están
bloqueando por cuenta de GitHub nueva. Opciones:

1. **https://faucet.quicknode.com/solana/devnet** — sin requisitos de GitHub
2. **Airdrop por RPC** (a veces funciona):
   ```bash
   curl -X POST "https://api.devnet.solana.com" \
     -H "Content-Type: application/json" \
     -d '{"jsonrpc":"2.0","id":1,"method":"requestAirdrop","params":["Hxj6gac2w4SvCx2mvDUf3ugykygynbkKmfcveL6rXJkt",500000000]}'
   ```
3. Que alguien con SOL de devnet mande 0.05 SOL a la wallet

---

## Cómo levantar el entorno

### Terminal 1 — Servidor
```bash
cd /home/luis/Descargas/pay/files
uvicorn server:app --reload
```

### Terminal 2 — Cliente
```bash
cd /home/luis/Descargas/pay/files
python3 pagar.py
# Pegar clave privada de Phantom cuando la pida (formato base58, ~88 chars)
```

### Verificar que el servidor responde
```bash
curl -i http://localhost:8000/api/recurso
# Debe retornar 402 con header PAYMENT-REQUIRED

curl -s http://localhost:8000/api/recurso/info | python3 -m json.tool
# Debe mostrar JSON con payTo = Hxj6gac2w4SvCx2mvDUf3ugykygynbkKmfcveL6rXJkt
```

### Verificar balance USDC
```bash
curl -s -X POST "https://api.devnet.solana.com" \
  -H "Content-Type: application/json" \
  -d '{
    "jsonrpc": "2.0",
    "id": 1,
    "method": "getTokenAccountsByOwner",
    "params": [
      "Hxj6gac2w4SvCx2mvDUf3ugykygynbkKmfcveL6rXJkt",
      {"mint": "4zMMC9srt5Ri5X14GAgXhaHii3GnPAEERYPJgZJDncDU"},
      {"encoding": "jsonParsed"}
    ]
  }' | python3 -m json.tool
```

---

## Resultado esperado cuando todo funcione

```
[pago] Wallet: Hxj6gac2w4SvCx2mvDUf3ugykygynbkKmfcveL6rXJkt

[1] Solicitando recurso sin pago...
    Status: 402
    Pagar 10000 microUSDC a Hxj6gac2w4SvCx2mvDUf3ugykygynbkKmfcveL6rXJkt

[2] Construyendo transacción USDC...
    Sender ATA:    wYmG9tMkRMWy3W7PAgs6JVGadAU2KR3kRAyTEpSDpA7
    Recipient ATA: wYmG9tMkRMWy3W7PAgs6JVGadAU2KR3kRAyTEpSDpA7

[3] Enviando transacción a Solana devnet...
    Firma: <tx_signature>
    Transacción confirmada en blockchain

[4] Presentando pago al servidor...
    Status: 200
{
  "mensaje": "✅ Pago verificado. Acceso concedido.",
  "data": {"resultado": "Contenido protegido de la demo"}
}
```

---

## Notas adicionales

- El proyecto usa Solana Devnet — no hay dinero real involucrado
- La clave privada de Phantom tiene ~88 caracteres en formato base58
- El sender y recipient son la misma wallet (caso demo) — el servidor debe manejar este caso
- Una vez resueltos los 3 errores descritos arriba, el flujo completo debería funcionar
- El siguiente paso después de la demo es agregar un frontend Next.js con Phantom wallet adapter
  para que usuarios reales puedan pagar desde el navegador sin exponer su clave privada
