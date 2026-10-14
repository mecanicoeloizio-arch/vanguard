# EloMak • Sistema de Gestão Inteligente para Oficinas Mecânicas

**Subdomínio Oficial:** `https://elomak.grupoeloizio.com.br`  
**Document Root:** `/var/www/grupoeloizio.com.br/elomak/public`  
**Hub Central de Webhook:** `https://webhook.grupoeloizio.com.br`  
**Tecnologia:** PHP 8.3 Puro MVC, MySQL 8.0 PDO, HTML5, CSS3 Tailwind, jQuery 3.7, JavaScript, cURL. 100% Responsivo Mobile First (320px a 4K). Tabelas viram cards no celular.

---

## 1. Onde Configurar suas Chaves WhatsApp

No arquivo `/elomak/config/whatsapp.php`, configure suas credenciais da Evolution API / Z-API e do Hub:

```php
// /elomak/config/whatsapp.php
define('WHATSAPP_API_URL', 'https://webhook.grupoeloizio.com.br/send');
define('WHATSAPP_API_KEY', 'SUA_EVOLUTION_API_KEY_AQUI'); // Cole aqui sua API Key
define('WHATSAPP_INSTANCE_ID', 'oficina_eloizio_01');      // Cole aqui o ID da sua instância
define('CENTRAL_HUB_URL', 'https://webhook.grupoeloizio.com.br');
```

E no `/elomak/config/config.php`:
```php
define('CENTRAL_WEBHOOK_URL', 'https://webhook.grupoeloizio.com.br');
define('WEBHOOK_SECRET', 'eloizio_secret_123'); // Mesma chave secreta em ambos os servidores
```

---

## 2. Arquitetura do Webhook Centralizado

1. **Evolution API / Z-API** envia POST para:
   `https://webhook.grupoeloizio.com.br/webhook/evolution`
2. O **Hub Central** (`/webhook-central/public/index.php`) recebe a mensagem, analisa o número da instância e faz cURL POST interno para:
   `https://elomak.grupoeloizio.com.br/api/webhook_receiver.php`
   com o cabeçalho de autenticação:
   `X-Webhook-Secret: eloizio_secret_123`
3. O **EloMak** (`/elomak/api/webhook_receiver.php`) processa a triagem da Camilla e responde ao cliente enviando POST de volta para o Hub Central (`/send`).

---

## 3. Fluxo Exclusivo de Acesso via WhatsApp com a Camilla (Sem Senha)

1. **Tela Inicial:** Campo único para o WhatsApp do usuário (Dono, Mecânico ou Cliente).
2. **Verificação (`CamillaController::verificarNumero`):**
   * **Se Cadastrado:** Gera token temporário de 32 caracteres (válido por 15 minutos em `leads_whatsapp`) e despacha:
     > *"Olá {nome}! Vi que seu número é da {nome_oficina} de {cidade}. Quer continuar seu atendimento ou acessar o sistema EloMak? 1- Continuar 2- Acessar EloMak - Link rápido: https://elomak.grupoeloizio.com.br/acesso/{token}"*
   * **Se Novo Número:** Salva como lead 'novo' e despacha:
     > *"Olá! Sou a Camilla do Grupo Eloizio. Número novo por aqui. Qual serviço deseja? 1-Mecânica 2-Sistema para minha oficina 3-Orçamento"*
3. **Triagem Automática pelo WhatsApp:**
   * Usuário responde **1**: Se novo, pede placa e defeito e cria pré-OS no status "Pré-Atendimento". Se existente, pede placa.
   * Usuário responde **2**: Gera novo token e link de acesso direto.
   * Usuário responde **3**: Pede placa e serviço para orçamento.
   * Detecção de Placa via Regex `[A-Z]{3}[0-9][A-Z0-9][0-9]{2}`: Anota e solicita relato do defeito.
4. **Login (`/acesso/{token}`):**
   * Valida se `expira_em > NOW()` e `usado = 0`.
   * Cria sessão autenticada, marca `usado = 1` e redireciona para o `/dashboard`.

---

## 4. Módulos do Sistema EloMak

* **Dashboard:** Faturamento do mês, ordens abertas, finalizadas, contas a receber, ticket médio e atalhos rápidos.
* **Ordens de Serviço:** Controle com status (Aberta, Em Andamento, Aguardando Peça, Finalizada, Entregue), upload de fotos, laudo técnico, garantia de 90 dias, impressão de termo e integração direta para assinatura eletrônica no **EloSign**.
* **Orçamentos:** Criação de propostas que viram Ordem de Serviço em **1 clique**.
* **Clientes & Veículos:** Base cadastral unificada com busca de placas via API cURL (Mercosul/Sinesp/Fipe).
* **Produtos & Estoque:** Peças mecânicas com estoque mínimo, controle de fornecedores e **baixa automática** ao lançar na OS.
* **Financeiro:** Contas a pagar e receber, extrato de fluxo de caixa e geração de cobrança PIX com QR Code.
* **Equipe & Comissões:** Gestão de mecânicos com comissão configurável por serviço.

---

## 5. Instalação e Deploy no Nginx / Apache

Copie as configurações de `/elomak/nginx/` para `/etc/nginx/sites-available/` e crie os links simbólicos:
```bash
sudo ln -s /var/www/grupoeloizio.com.br/elomak/nginx/elomak.grupoeloizio.com.br.conf /etc/nginx/sites-enabled/
sudo ln -s /var/www/grupoeloizio.com.br/elomak/nginx/webhook.grupoeloizio.com.br.conf /etc/nginx/sites-enabled/
sudo nginx -t && sudo systemctl reload nginx
```
Importe o banco de dados MySQL 8.0:
```bash
mysql -u root -p elomak_db < /elomak/sql/elomak_database.sql
```
