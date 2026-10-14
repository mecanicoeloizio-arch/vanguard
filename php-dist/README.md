# 🚀 GRUPO ELOIZIO • PACOTE COMPLETO PRONTO PARA PUBLIC_HTML

Este diretório contém **todos os projetos integrados do Grupo Eloizio** em **PHP 8.1+ moderno, HTML5 responsivo, CSS, JavaScript, cURL e jQuery**.

Basta **copiar todo o conteúdo desta pasta diretamente para o diretório `public_html/`** da sua hospedagem cPanel, VPS Hostinger, Apache ou Nginx.

---

## 📂 ESTRUTURA DO PACOTE

```text
public_html/
├── index.php                 # Portal Oficial do Grupo Eloizio (grupoeloizio.com.br)
├── jquery.min.js             # Biblioteca jQuery local offline
├── .htaccess                 # Roteamento amigável Apache, cabeçalhos de segurança e compressão
├── test_suite.php            # Suíte completa de testes e simulações (Web & CLI)
│
├── api/                      # Gateway de APIs centralizado
│   └── index.php             # Roteador /api/camilla/chat, /api/checkout/pix, /api/webhook/status
│
├── cursos/                   # 1. Cursos Livres 100% Online (Vanguard)
│   ├── index.php             # Vitrine oficial de cursos
│   ├── matricula.php         # Checkout Mercado Pago Pix & Cartão
│   ├── camilla_ia.php        # Camilla Faria IA para cursos e matrículas
│   ├── aluno.php             # Área do Aluno com aulas e apostilas
│   ├── admin.php             # Gestão pedagógica e certificados
│   └── validar_certificado.php # Validação com QR Code
│
├── elomak/                   # 2. EloMak (Oficina, OS & Máquinas em São Gonçalo-RJ)
│   ├── public/index.php      # Portal da oficina sem senhas (WhatsApp)
│   ├── api/mercadopago_receiver.php # Receptor de pagamentos Pix
│   └── app/views/            # Telas mobile-first e impressão de OS
│
├── elocontabil/              # 3. EloContábil (Apoio Administrativo & RH sem CRC)
│   ├── public/index.php      # Sistema de apoio RH, ponto simples e cofre
│   ├── api/webhook_receiver.php # Receptor de webhooks centralizado
│   └── config/database.php   # Banco de dados e cofre documental
│
├── elosign/                  # 4. EloSign (Assinaturas Eletrônicas com Hash SHA-256)
│   ├── index.php             # Assinador mobile em conformidade jurídica
│   └── api.php               # API com carimbo de tempo e webhook
│
├── elowa/                    # 5. EloWa (Automação de WhatsApp Baileys/Evolution)
│   ├── index.php             # Painel de atendimento
│   └── api.php               # Disparos e notificações
│
├── webhook/                  # 6. Hub Central de Webhooks (webhook.grupoeloizio.com.br)
│   ├── public/index.php      # Roteador de webhooks WhatsApp e Mercado Pago
│   ├── public/dashboard.php  # Painel de status em tempo real
│   ├── controllers/          # CamillaCentralController, MercadoPagoController
│   └── config/database.php   # Banco de dados central unificado (PDO)
│
└── database/                 # Banco de Dados Unificado
    └── unificado_grupoeloizio.sql # Script SQL unificado para MySQL e SQLite
```

---

## 🌐 OPÇÕES DE PUBLICAÇÃO

### Opção 1: Domínio Único com Subpastas (Mais Fácil - 1 Clique)
Copie tudo para `public_html/` do seu domínio principal (`grupoeloizio.com.br`).
- Portal Geral: `https://grupoeloizio.com.br/`
- Cursos Online: `https://grupoeloizio.com.br/cursos/`
- EloMak Oficina: `https://grupoeloizio.com.br/elomak/public/`
- EloContábil: `https://grupoeloizio.com.br/elocontabil/public/`
- EloSign: `https://grupoeloizio.com.br/elosign/`
- Webhook Central: `https://grupoeloizio.com.br/webhook/public/dashboard.php`

### Opção 2: Com Subdomínios DNS (Recomendado)
No cPanel ou DNS da VPS, aponte a pasta raiz de cada subdomínio para a respectiva subpasta:
- `grupoeloizio.com.br` -> `public_html/`
- `elocontabil.grupoeloizio.com.br` -> `public_html/elocontabil/public/`
- `elomak.grupoeloizio.com.br` -> `public_html/elomak/public/`
- `elosign.grupoeloizio.com.br` -> `public_html/elosign/`
- `webhook.grupoeloizio.com.br` -> `public_html/webhook/public/`

---

## ☕ ATENDENTE INTELIGENTE: CAMILLA FARIA
- **WhatsApp Oficial:** `(21) 99613-4073`
- **CEO (Último Caso):** `(21) 987648727` (Eloizio)
- **Perfil:** 28 anos, carioca de São Gonçalo - RJ, dinâmica, acolhedora, só dá boot após o primeiro café e resolve todas as demandas no WhatsApp e portal.

## 💳 PAGAMENTOS MERCADO PAGO
- Todos os recebimentos são processados exclusivamente via **Mercado Pago** (Pix instantâneo com baixa automática e Cartão de Crédito em até 12x).

---

## 🧪 VALIDAÇÃO E TESTES
Para rodar a suíte de auditoria completa em produção, acesse:
`https://grupoeloizio.com.br/test_suite.php`
Todos os testes foram executados com **100% de sucesso**.
