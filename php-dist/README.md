# 🚀 Grupo Eloizio — Pacote de Scripts Nativos em PHP 8, HTML5, CSS3, JavaScript & cURL

Este pacote contém a conversão completa e modular do sistema do **Grupo Eloizio** para **PHP 8.1+**, **HTML5**, **Tailwind CSS**, **JavaScript Vanilla** e **cURL**.

Pronto para deploy imediato em **Hostinger**, **cPanel**, **Apache**, **Nginx**, **VPS Linux**, ou **Docker**.

---

## 📂 Estrutura dos Arquivos (`/php-dist`)

| Arquivo | Descrição & Função |
| :--- | :--- |
| `index.html` | Portal público responsivo (HTML5 + Tailwind + JS) com os 3 Pilares: Cursos Livres MEC, Contabilidade 100% Online e Oficina de Máquinas de Costura em São Gonçalo - RJ. Inclui chat da **Camilla Faria** com suporte a fotos e checkout Mercado Pago. |
| `admin.html` | Painel Administrativo moderno (HTML5 + Tailwind + JS) com Gerenciador de Módulos dinâmico, Terminal CLI interativo e Painel de Auditoria Total de Segurança. |
| `config.php` | Configurações centrais do sistema, constantes do Grupo Eloizio, credenciais do Mercado Pago, Google Gemini, headers de segurança e funções auxiliares. |
| `database.php` | Gerenciador de Banco de Dados PDO com suporte automático a **MySQL 8 / MariaDB** e fallback portátil para **SQLite**. |
| `auth.php` | Módulo de autenticação segura, verificação de hash (Bcrypt / Argon2id), proteção contra força bruta (lockout de 30s após 5 falhas), sessões seguras e validação 2FA. |
| `camilla_ia.php` | Atendente Inteligente **Camilla Faria** com integração ao Google Gemini 3.1 Pro via cURL, diagnóstico multimídia de fotos de máquinas e peças, saudação dinâmica de horário ("café"), cupom `CAMILLA15` (-15%) e fallback cognitivo local em PHP 8. |
| `mercadopago.php` | Gateway oficial do **Mercado Pago** via cURL: Checkout Pro (Preferências), PIX instantâneo com geração de QR Code e código Copia e Cola, Cartão em até 12x, validação HMAC SHA-256 de webhooks e limites financeiros. |
| `admin_cli.php` | Console e Terminal Administrativo executável via **Linha de Comando (CLI)** (`php admin_cli.php <comando>`) ou via **Requisição HTTP POST** (usado pelo `admin.html` e cURL). |
| `security_audit.php` | Scanner e auditoria dos pontos sensíveis de segurança (Login, Financeiro, IA e Proteção de Dados com certificados MEC). Retorna score 0-100% e conformidade LGPD. |
| `curl_commands.sh` | Script bash executável com 15+ comandos cURL pré-configurados para testar todas as rotas e funções do sistema. |
| `database.sql` | Esquema relacional completo (19 tabelas) com RBAC, vitrine, módulos, tickets de conserto mecânico, transações Mercado Pago e certificados ICP-Edu. |

---

## ⚡ Como Rodar Localmente com PHP 8

1. Inicie o servidor embutido do PHP 8 na pasta `php-dist`:
```bash
cd php-dist
php -S 0.0.0.0:8000
```

2. Abra no navegador:
- **Portal Principal:** `http://localhost:8000/index.html`
- **Painel Administrativo & Terminal:** `http://localhost:8000/admin.html`

3. Teste via cURL:
```bash
chmod +x curl_commands.sh
./curl_commands.sh
```

---

## 🛠️ Execução de Comandos via Linha de Comando (CLI)

O script `admin_cli.php` pode ser executado diretamente no terminal do servidor:

```bash
# Ver ajuda e lista de comandos
php admin_cli.php help

# Diagnóstico geral de saúde e telemetria
php admin_cli.php system:status

# Auditoria profunda de segurança
php admin_cli.php security:audit

# Listar todos os módulos do sistema
php admin_cli.php module:list

# Ativar um módulo específico
php admin_cli.php module:enable contabilidade_assessoria_online

# Desativar um módulo não-essencial
php admin_cli.php module:disable maquinas_costura_mecanica

# Recarregar e verificar dependências de um módulo
php admin_cli.php module:update mercadopago_gateway

# Conciliação financeira do Mercado Pago
php admin_cli.php finance:reconcile

# Testar o motor cognitivo da Camilla Faria
php admin_cli.php ai:test

# Gerar snapshot de backup do sistema
php admin_cli.php backup:create
```

---

## 🌐 Deploy em Servidores Web (Apache / Nginx / Hostinger / cPanel)

### 1. Servidor Apache (`.htaccess`)
Crie um arquivo `.htaccess` na raiz do diretório web:
```apache
<IfModule mod_rewrite.c>
    RewriteEngine On
    RewriteCond %{REQUEST_FILENAME} !-f
    RewriteCond %{REQUEST_FILENAME} !-d
</IfModule>

# Headers de Segurança
<IfModule mod_headers.c>
    Header set X-Content-Type-Options "nosniff"
    Header set X-Frame-Options "SAMEORIGIN"
    Header set X-XSS-Protection "1; mode=block"
    Header set Referrer-Policy "strict-origin-when-cross-origin"
</IfModule>
```

### 2. Servidor Nginx (`nginx.conf`)
```nginx
location / {
    try_files $uri $uri/ /index.html;
}

location ~ \.php$ {
    include fastcgi_params;
    fastcgi_pass unix:/var/run/php/php8.2-fpm.sock;
    fastcgi_index index.php;
    fastcgi_param SCRIPT_FILENAME $document_root$fastcgi_script_name;
}
```

---

## 🔑 Variáveis de Ambiente Suportadas

Você pode definir as seguintes variáveis no seu servidor (`.env`, `php.ini` ou variáveis do sistema operacional):

| Variável | Padrão | Descrição |
| :--- | :--- | :--- |
| `MERCADOPAGO_ACCESS_TOKEN` | Token Sandbox | Access Token da API do Mercado Pago |
| `MERCADOPAGO_PUBLIC_KEY` | Public Key | Chave Pública do Mercado Pago |
| `MERCADOPAGO_WEBHOOK_SECRET`| whsec_... | Segredo HMAC para validar IPN / Webhooks |
| `MERCADOPAGO_SANDBOX` | `true` | `false` para ambiente de produção |
| `GEMINI_API_KEY` | - | Chave de API Google AI Gemini para IA Camilla |
| `DB_DRIVER` | `sqlite` | `sqlite` ou `mysql` |
| `DB_HOST` | `localhost` | Host do banco de dados MySQL |
| `DB_DATABASE` | `grupo_eloizio` | Nome da base de dados |
| `DB_USERNAME` | `root` | Usuário do MySQL |
| `DB_PASSWORD` | - | Senha do MySQL |

---

## 🔒 Pontos Sensíveis de Segurança Verificados

1. **Login & RBAC (`auth.php`):**
   - Bloqueio automático de 30 segundos após 5 tentativas incorretas consecutivas.
   - Hash seguro com `password_hash()` (Bcrypt / Argon2id).
   - Regeneração de ID de sessão após login (`session_regenerate_id(true)`).
   - Cookies HttpOnly, SameSite=Lax e Secure.

2. **Financeiro & Mercado Pago (`mercadopago.php`):**
   - Assinatura criptográfica HMAC SHA-256 em webhooks.
   - Chaves de idempotência anti-duplicação por pedido.
   - Teto e piso de segurança (rejeição de valores negativos ou acima de R$ 50.000,00).

3. **IA Camilla Faria (`camilla_ia.php`):**
   - Guardrails estritos anti-jailbreak e sanitização de prompts.
   - Bloqueio absoluto contra vazamento de tokens, senhas ou chaves.
   - Mascaramento e conformidade LGPD.
