#!/usr/bin/env bash
# ==============================================================================
# GRUPO ELOIZIO - SUÍTE COMPLETA DE COMANDOS cURL PARA TESTES E INTEGRAÇÕES
# Tecnologias: PHP 8.1+, HTML5, CSS3, JavaScript Vanilla, cURL & REST API
# Site: grupoeloizio.com.br | WhatsApp Oficial: 21 996134073
# ==============================================================================

set -e

# Configuração da URL Base (Local ou Produção)
BASE_URL="http://localhost:3000/php-dist"
# Em produção (Hostinger / Apache / Nginx / cPanel) use:
# BASE_URL="https://grupoeloizio.com.br/php-dist"

GREEN='\033[0;32m'
BLUE='\033[0;34m'
YELLOW='\033[1;33m'
CYAN='\033[0;36m'
NC='\033[0m'

echo -e "${CYAN}==================================================================${NC}"
echo -e "${CYAN}   GRUPO ELOIZIO - TESTE COMPLETO DOS SCRIPTS PHP 8 & cURL       ${NC}"
echo -e "${CYAN}==================================================================${NC}"

# 1. Autenticação e Login com Proteção contra Força Bruta
echo -e "\n${BLUE}1. TESTE DE LOGIN SEGURO & RBAC (auth.php)${NC}"
curl -s -X POST "${BASE_URL}/auth.php?action=login" \
  -H "Content-Type: application/json" \
  -d '{
    "email": "eloizio@grupoeloizio.com.br",
    "password": "vanguard123"
  }'

# 2. Validação 2FA (Segundo Fator)
echo -e "\n\n${BLUE}2. TESTE DE VALIDAÇÃO 2FA (auth.php)${NC}"
curl -s -X POST "${BASE_URL}/auth.php?action=verify_2fa" \
  -H "Content-Type: application/json" \
  -d '{"pin": "123456"}'

# 3. Teste de Conexão com Mercado Pago
echo -e "\n\n${BLUE}3. TESTE DE CONEXÃO COM MERCADO PAGO VIA cURL (mercadopago.php)${NC}"
curl -s -X POST "${BASE_URL}/mercadopago.php?action=test_connection" \
  -H "Content-Type: application/json" \
  -d '{
    "accessToken": "TEST-7281928374659102-092916-d8f92a1b3c4e5f6a7b8c9d0e1f2a3b4c-192837465",
    "environment": "sandbox"
  }'

# 4. Criar Preferência de Checkout
echo -e "\n\n${BLUE}4. CRIAR PREFERÊNCIA DE CHECKOUT NO MERCADO PAGO${NC}"
curl -s -X POST "${BASE_URL}/mercadopago.php?action=create_preference" \
  -H "Content-Type: application/json" \
  -d '{
    "title": "Curso Engenharia de Software Moderna (Cupom SOFIA15)",
    "amount": 1606.50,
    "payerEmail": "aluno@grupoeloizio.com.br",
    "payerName": "Lucas Silva Prado",
    "installments": 12
  }'

# 5. Processar Pagamento Direto via PIX Instantâneo
echo -e "\n\n${BLUE}5. PROCESSAR PAGAMENTO VIA PIX INSTANTÂNEO COM QR CODE${NC}"
curl -s -X POST "${BASE_URL}/mercadopago.php?action=process_payment" \
  -H "Content-Type: application/json" \
  -d '{
    "title": "Manutenção & Revisão de Máquina de Costura Overloque",
    "amount": 250.00,
    "paymentMethod": "pix",
    "payerEmail": "cliente@grupoeloizio.com.br",
    "payerName": "Oficina Confecções São Gonçalo",
    "orderId": "ORD-PIX-2026-001"
  }'

# 6. Processar Pagamento em 12x no Cartão de Crédito
echo -e "\n\n${BLUE}6. PROCESSAR PAGAMENTO EM 12X NO CARTÃO DE CRÉDITO${NC}"
curl -s -X POST "${BASE_URL}/mercadopago.php?action=process_payment" \
  -H "Content-Type: application/json" \
  -d '{
    "title": "Assessoria Contábil Anual & Regularização MEI",
    "amount": 1200.00,
    "paymentMethod": "credit_card",
    "payerEmail": "empresa@grupoeloizio.com.br",
    "payerName": "Mariana Santos ME",
    "installments": 12,
    "orderId": "ORD-CC-2026-002"
  }'

# 7. Simular Notificação de Webhook (IPN) do Mercado Pago com HMAC
echo -e "\n\n${BLUE}7. SIMULAR NOTIFICAÇÃO DE WEBHOOK (IPN) COM ASSINATURA HMAC${NC}"
curl -s -X POST "${BASE_URL}/mercadopago.php?action=webhook" \
  -H "Content-Type: application/json" \
  -H "X-Signature: ts=1728144000,v1=9a8b7c6d5e4f3a2b1c0d9e8f7a6b5c4d3e2f1a0b" \
  -d '{
    "action": "payment.created",
    "type": "payment",
    "data": {
      "id": "19283746501",
      "status": "approved",
      "amount": 1606.50
    }
  }'

# 8. Conversa com Sofia Vanguard (Expert em Cursos & Marketing)
echo -e "\n\n${BLUE}8. CONVERSA COM SOFIA VANGUARD (PAPEL: CLIENTE)${NC}"
curl -s -X POST "${BASE_URL}/sofia_ia.php" \
  -H "Content-Type: application/json" \
  -d '{
    "message": "Olá! Gostaria de saber os cursos de máquinas de costura e como parcelar no Mercado Pago.",
    "interlocutorRole": "client"
  }'

# 9. Conversa com Sofia Vanguard (Técnico / Colaborador)
echo -e "\n\n${BLUE}9. CONVERSA COM SOFIA VANGUARD (PAPEL: TÉCNICO MECÂNICO)${NC}"
curl -s -X POST "${BASE_URL}/sofia_ia.php" \
  -H "Content-Type: application/json" \
  -d '{
    "message": "Sofia, gostaria de entender a ementa do curso de mecânica de máquinas com o CEO Eloizio e regulagem de lançadeiras.",
    "interlocutorRole": "technician"
  }'

# 10. Diagnóstico Multimídia de Foto de Máquina de Costura
echo -e "\n\n${BLUE}10. DIAGNÓSTICO MULTIMÍDIA DE FOTO DE MÁQUINA DE COSTURA COM SOFIA${NC}"
curl -s -X POST "${BASE_URL}/sofia_ia.php?action=multimedia" \
  -H "Content-Type: application/json" \
  -d '{
    "imageBase64": "iVBORw0KGgoAAAANSUhEUgAAAAEAAAABCAQAAAC1HAwCAAAAC0lEQVR42mNk+A8AAQUBAScY42YAAAAASUVORK5CYII=",
    "description": "Foto do cabeçote da máquina overloque com linha quebrando na lançadeira",
    "interlocutorRole": "client"
  }'

# 11. Terminal CLI: Diagnóstico Geral do Sistema
echo -e "\n\n${BLUE}11. EXECUTAR COMANDO CLI: TELEMETRIA DO SISTEMA (admin_cli.php)${NC}"
curl -s -X POST "${BASE_URL}/admin_cli.php" \
  -H "Content-Type: application/json" \
  -d '{"command": "system:status"}'

# 12. Terminal CLI: Listar Módulos Registrados
echo -e "\n\n${BLUE}12. EXECUTAR COMANDO CLI: LISTAR MÓDULOS REGISTRADOS${NC}"
curl -s -X POST "${BASE_URL}/admin_cli.php" \
  -H "Content-Type: application/json" \
  -d '{"command": "module:list"}'

# 13. Terminal CLI: Conciliação Financeira Mercado Pago
echo -e "\n\n${BLUE}13. EXECUTAR COMANDO CLI: CONCILIAÇÃO FINANCEIRA MERCADO PAGO${NC}"
curl -s -X POST "${BASE_URL}/admin_cli.php" \
  -H "Content-Type: application/json" \
  -d '{"command": "finance:reconcile"}'

# 14. Terminal CLI: Testar Motor Cognitivo e Guardrails da IA
echo -e "\n\n${BLUE}14. EXECUTAR COMANDO CLI: TESTAR IA SOFIA VANGUARD${NC}"
curl -s -X POST "${BASE_URL}/admin_cli.php" \
  -H "Content-Type: application/json" \
  -d '{"command": "ai:test"}'

# 15. Auditoria Total de Segurança
echo -e "\n\n${BLUE}15. AUDITORIA TOTAL DE SEGURANÇA (LOGIN, FINANCEIRO, IA, DADOS)${NC}"
curl -s -X GET "${BASE_URL}/security_audit.php"

echo -e "\n\n${GREEN}==================================================================${NC}"
echo -e "${GREEN}   TODOS OS TESTES cURL FORAM EXECUTADOS COM SUCESSO!            ${NC}"
echo -e "${GREEN}==================================================================${NC}"
