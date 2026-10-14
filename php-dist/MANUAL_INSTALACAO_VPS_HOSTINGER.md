# 🚀 Manual Completo de Instalação e Deploy no Hostinger VPS KVM2
## Projeto: EduVanguard dentro do Contêiner "Vanguard"

Este guia detalha o passo a passo completo para você baixar o arquivo `.zip` deste projeto, transferir para o seu **VPS Hostinger KVM2**, descompactar dentro do contêiner Docker de nome **`Vanguard`**, executar o instalador em **PHP** criado especificamente para a criação do banco de dados e iniciar a aplicação em produção.

---

## 📋 Sumário
1. [Especificações do VPS Hostinger KVM2](#1-especificações-do-vps-hostinger-kvm2)
2. [Arquivos Inclusos no Projeto](#2-arquivos-inclusos-no-projeto)
3. [Opção A: Instalação via Docker (Recomendado para o Contêiner "Vanguard")](#3-opção-a-instalação-via-docker-recomendado-para-o-contêiner-vanguard)
4. [Opção B: Instalação Direta no Sistema Operacional da VPS](#4-opção-b-instalação-direta-no-sistema-operacional-da-vps)
5. [Como Rodar o Instalador PHP](#5-como-rodar-o-instalador-php)
   - [5.1 Instalador Web Visual](#51-instalador-web-visual)
   - [5.2 Instalador via Linha de Comando (CLI SSH)](#52-instalador-via-linha-de-comando-cli-ssh)
6. [Estrutura do Banco de Dados Criado (`database.sql`)](#6-estrutura-do-banco-de-dados-criado-databasesql)
7. [Iniciando a Aplicação e Gerenciando com PM2](#7-iniciando-a-aplicação-e-gerenciando-com-pm2)
8. [Configuração do Nginx com SSL Gratuito (Let's Encrypt Certbot)](#8-configuração-do-nginx-com-ssl-gratuito-lets-encrypt-certbot)
9. [Credenciais de Acesso e Teste dos Portais](#9-credenciais-de-acesso-e-teste-dos-portais)

---

## 1. Especificações do VPS Hostinger KVM2
- **Processador:** 2 vCPU Cores
- **Memória RAM:** 8 GB
- **Armazenamento:** 100 GB NVMe
- **Largura de Banda:** 2 TB
- **Sistema Operacional Recomendado:** Ubuntu 22.04 LTS ou Ubuntu 24.04 LTS

---

## 2. Arquivos Inclusos no Projeto

Após descompactar o arquivo `.zip`, você encontrará os novos arquivos preparados para o seu ambiente:
- **`installer/index.php`**: Instalador web com assistente passo a passo (validação de requisitos, criação do banco MySQL, configuração de variáveis e administrador).
- **`installer/install-cli.php`**: Instalador via terminal interativo (caso prefira rodar diretamente pelo terminal SSH).
- **`database.sql`**: Script completo com 15 tabelas relacionais em InnoDB/UTF-8 e carga inicial de dados (seed com cursos, alunos, professores, diretores e leads da Sofia IA).
- **`docker-compose.yml`**: Orquestrador com contêiner `Vanguard` e contêiner `vanguard-db` (MySQL 8.0).
- **`Dockerfile`**: Imagem com Node.js + PHP CLI e runtime de alta performance.
- **`server.ts`**: Servidor Express com Vite SSR/SPA e integração server-side com a API Gemini para a Especialista Virtual Sofia.

---

## 3. Opção A: Instalação via Docker (Recomendado para o Contêiner "Vanguard")

Se você já utiliza Docker no seu VPS Hostinger, esta é a forma mais limpa e isolada:

### Passo 1: Enviar o arquivo ZIP para o seu VPS
Pelo seu computador (Terminal ou via FileZilla / WinSCP SFTP):
```bash
scp eduvanguard.zip root@SEU_IP_VPS:/home/
```

### Passo 2: Acessar seu VPS via SSH e descompactar
```bash
ssh root@SEU_IP_VPS
cd /home
unzip eduvanguard.zip -d /home/vanguard-app
cd /home/vanguard-app
```

### Passo 3: Iniciar o contêiner com Docker Compose
O arquivo `docker-compose.yml` já está configurado com o contêiner nomeado **`Vanguard`**:
```bash
docker compose up -d --build
```

### Passo 4: Executar o instalador dentro do contêiner Vanguard
```bash
# Entrar no contêiner Vanguard
docker exec -it Vanguard bash

# Executar o instalador CLI em PHP para criar as tabelas e dados:
php installer/install-cli.php
```
*(Basta seguir os passos no terminal digitando os dados de conexão do banco `vanguard-db` ou `localhost`)*.

---

## 4. Opção B: Instalação Direta no Sistema Operacional da VPS

Se você prefere instalar os pacotes diretamente no Ubuntu da VPS Hostinger:

### Passo 1: Atualizar pacotes e instalar Node.js 20 LTS, PHP 8 e MySQL
```bash
apt update && apt upgrade -y
apt install -y curl wget unzip git nginx mysql-server php-cli php-mysql php-curl php-json php-mbstring
```

### Passo 2: Instalar o Node.js v20 LTS
```bash
curl -fsSL https://deb.nodesource.com/setup_20.x | bash -
apt install -y nodejs
```

### Passo 3: Configurar o MySQL Server na VPS
```bash
mysql -e "CREATE DATABASE IF NOT EXISTS eduvanguard_db CHARACTER SET utf8mb4 COLLATE utf8mb4_unicode_ci;"
mysql -e "CREATE USER IF NOT EXISTS 'vanguard_user'@'localhost' IDENTIFIED BY 'SuaSenhaForte123!';"
mysql -e "GRANT ALL PRIVILEGES ON eduvanguard_db.* TO 'vanguard_user'@'localhost';"
mysql -e "FLUSH PRIVILEGES;"
```

### Passo 4: Descompactar os arquivos do projeto
```bash
mkdir -p /var/www/vanguard
cd /home
unzip eduvanguard.zip -d /var/www/vanguard
cd /var/www/vanguard
chown -R www-data:www-data /var/www/vanguard
chmod -R 775 /var/www/vanguard
```

---

## 5. Como Rodar o Instalador PHP

Você tem duas formas muito fáceis de rodar o instalador:

### 5.1 Instalador Web Visual
1. Se você tiver um servidor PHP/Apache/Nginx apontando para a pasta ou desejar usar o servidor embutido do PHP:
   ```bash
   cd /var/www/vanguard
   php -S 0.0.0.0:8080 -t .
   ```
2. Acesse no navegador:
   `http://SEU_IP_VPS:8080/installer/index.php`
3. O assistente visual irá guiá-lo por 4 etapas simples:
   - **Etapa 1:** Diagnóstico e checagem de permissões.
   - **Etapa 2:** Conexão com o MySQL e criação automática das tabelas a partir de `database.sql`.
   - **Etapa 3:** Definição da URL da aplicação, chave do Google Gemini (para a Sofia IA) e senha do Admin.
   - **Etapa 4:** Conclusão e orientações finais.

### 5.2 Instalador via Linha de Comando (CLI SSH)
Basta rodar no seu terminal SSH:
```bash
cd /var/www/vanguard
php installer/install-cli.php
```
O script interativo solicitará os dados de conexão com o banco e preencherá automaticamente o seu arquivo `.env` com todas as chaves geradas e seguras!

---

## 6. Estrutura do Banco de Dados Criado (`database.sql`)

O instalador cria e popula as seguintes 15 tabelas relacionais com integridade referencial:

1. **`users`**: Usuários com controle de permissão por perfil (RBAC: `student`, `teacher`, `admin`), senhas criptografadas e hashes LGPD.
2. **`courses`**: Catálogo de cursos da vitrine 100% online, professores, valores e avaliações.
3. **`course_modules`**: Organização modular de cada curso.
4. **`lessons`**: Videoaulas, durações, URLs de reprodução e transcrições sincronizadas.
5. **`lesson_completions`**: Rastreamento de progresso de cada aluno por aula.
6. **`grades`**: Boletim acadêmico (P1, P2, Trabalho, Média Final e situação de aprovação).
7. **`attendance`**: Controle de presença em tempo real com código validador.
8. **`exams`**: Provas online, quizzes cronometrados e trabalhos práticos.
9. **`student_submissions`**: Respostas dos alunos, notas atribuídas e parecer pedagógico.
10. **`document_requests`**: Emissão de Carteirinhas DNE e Certificados ICP-Edu com QR Code.
11. **`financial_transactions`**: Gestão financeira e pagamentos via Mercado Pago (PIX, Cartão, Boleto).
12. **`marketing_leads`**: Leads capturados pela Especialista Virtual Sofia (WhatsApp, status no funil, cupons).
13. **`chat_messages`**: Chat em tempo real entre alunos, professores e coordenação.
14. **`support_tickets`**: Central de atendimento e Help Desk institucional.
15. **`erp_logs`**: Logs imutáveis de sincronização e auditoria com TOTVS, SAP e Senior.

---

## 7. Iniciando a Aplicação e Gerenciando com PM2

Para manter o EduVanguard rodando 24 horas por dia e reiniciando automaticamente após reinicializações do servidor:

```bash
cd /var/www/vanguard

# 1. Instalar dependências Node
npm install

# 2. Gerar build de produção
npm run build

# 3. Instalar o gerenciador de processos PM2 globalmente
npm install -g pm2

# 4. Iniciar a aplicação nomeando o processo como "Vanguard"
pm2 start server.ts --name "Vanguard" --interpreter tsx

# 5. Salvar para reiniciar com o boot do servidor Linux
pm2 save
pm2 startup
```

Para verificar o status a qualquer momento:
```bash
pm2 status
pm2 logs Vanguard
```

---

## 8. Configuração do Nginx com SSL Gratuito (Let's Encrypt Certbot)

Para publicar o sistema com seu domínio e certificado HTTPS de segurança:

### 1. Criar o arquivo de configuração no Nginx
```bash
nano /etc/nginx/sites-available/eduvanguard.conf
```

Cole a seguinte configuração (substitua `seuescola.com.br` pelo seu domínio):
```nginx
server {
    listen 80;
    server_name seuescola.com.br www.seuescola.com.br;

    client_max_body_size 50M;

    location / {
        proxy_pass http://127.0.0.1:3000;
        proxy_http_version 1.1;
        proxy_set_header Upgrade $http_upgrade;
        proxy_set_header Connection 'upgrade';
        proxy_set_header Host $host;
        proxy_set_header X-Real-IP $remote_addr;
        proxy_set_header X-Forwarded-For $proxy_add_x_forwarded_for;
        proxy_set_header X-Forwarded-Proto $scheme;
        proxy_cache_bypass $http_upgrade;
    }
}
```

### 2. Ativar o site e reiniciar o Nginx
```bash
ln -s /etc/nginx/sites-available/eduvanguard.conf /etc/nginx/sites-enabled/
nginx -t
systemctl restart nginx
```

### 3. Instalar o Certificado SSL Gratuito (HTTPS)
```bash
apt install -y certbot python3-certbot-nginx
certbot --nginx -d seuescola.com.br -d www.seuescola.com.br
```

---

## 9. Credenciais de Acesso e Teste dos Portais

Após a instalação, as seguintes credenciais padrão estão disponíveis para demonstração e homologação:

| Perfil | E-mail de Acesso | Senha Padrão | Funcionalidades |
| :--- | :--- | :--- | :--- |
| **Direção & Gestão (Admin)** | `carlos.mendes@direcao.eduvanguard.com.br` | `vanguard123` | Gestão de Cursos, Matrículas, Leads da Sofia IA, Financeiro e ERP |
| **Portal do Professor** | `mariana.fernandes@professor.eduvanguard.com.br` | `vanguard123` | Publicação de Aulas, Lançamento de Notas, Diário de Classe e Quizzes |
| **Portal do Aluno** | `lucas.silva@aluno.eduvanguard.com.br` | `vanguard123` | Assistir Aulas, Boletim de Notas, Presença, Carteirinha DNE e Certificados |
| **Visitante / Público Geral** | *Sem login necessário* | - | Navegar pela Vitrine de Cursos, tirar dúvidas com a Sofia IA e se inscrever |

---

## 10. Configuração da API do Mercado Pago no VPS Hostinger

Para receber pagamentos reais via **PIX (instantâneo)**, **Cartão de Crédito (até 12x)** e **Boleto Bancário**:

### 1. Obter Credenciais no Painel de Desenvolvedores do Mercado Pago
1. Acesse o [Painel do Desenvolvedor do Mercado Pago](https://www.mercadopago.com.br/developers/panel/app).
2. Crie uma aplicação (ex: *EduVanguard Cursos Online*).
3. Em **Credenciais de Produção** (ou Testes/Sandbox), copie:
   - **Public Key** (`APP_USR-xxxx...`)
   - **Access Token** (`APP_USR-xxxx...`)

### 2. Configurar no arquivo `.env` do VPS
Dentro do contêiner `Vanguard` ou na raiz da sua aplicação:
```env
MERCADOPAGO_ACCESS_TOKEN="APP_USR-seu_access_token_aqui"
MERCADOPAGO_PUBLIC_KEY="APP_USR-sua_public_key_aqui"
MERCADOPAGO_WEBHOOK_SECRET="whsec_seu_segredo_webhook"
MERCADOPAGO_SANDBOX="false" # ou "true" para homologação
```

### 3. Configurar a URL de Webhooks (IPN) no Mercado Pago
No painel de desenvolvedores do Mercado Pago, configure o Webhook para apontar para o seu domínio no VPS Hostinger:
- **URL do Webhook:** `https://seuescola.com.br/api/mercadopago/webhook`
- **Eventos:** `Pagamentos (payment.created, payment.updated)`

---

## 11. Validador Público de Certificados Digitais (MEC / ICP-Edu)

Para garantir a validade jurídica de cursos 100% online conforme a **Lei de Diretrizes e Bases da Educação (Lei nº 9.394/1996, Art. 42)** e **Decreto Presidencial nº 5.154/2004**:
1. O validador público está acessível na aba **"Validar Certificado"** no topo da página.
2. Qualquer empresa ou empregador pode inserir o Hash criptográfico (ex: `DNE-2026-VAL-OK` ou o hash do aluno) ou escanear o QR Code impresso no certificado.
3. O sistema atesta:
   - Status de autenticidade (Selo Verde)
   - Carga horária e ementa curricular cumprida
   - Registro no Livro Acadêmico, Folha e Número de Matrícula
   - Assinatura digital do Diretor Geral e Coordenador Pedagógico.

---

## 12. Execução da Bateria de Simulações e Auditoria de Qualidade

Para testar o fluxo de ponta a ponta sem riscos e calibrar o sistema:
1. Acesse a **Direção & Gestão (Admin)** com a senha `vanguard123`.
2. Clique na aba **"Simulador & Auditoria (Testes)"**.
3. Selecione o número de iterações (1x unitário, 5x lote ou 10x estresse) e o curso desejado.
4. Clique em **"Rodar Simulações em Lote"**.
5. O sistema executará o ciclo completo:
   - Simulação de Compra & Matrícula no Mercado Pago (PIX/Cartão 12x)
   - Disparo e recebimento do Webhook IPN
   - Cômputo de 100% das videoaulas assistidas
   - Realização de Prova Final com nota >= 7.0
   - Emissão do Certificado Digital Oficial com Frente e Verso Acadêmico
   - Validação anti-fraude no banco de dados.

---
## 13. Pacote Autônomo em PHP 8 (`php-dist`) & Testes cURL

Caso você deseje rodar a aplicação em um ambiente PHP 8 tradicional (Apache / Nginx / cPanel / Hospedagem Compartilhada Hostinger) sem depender do Node.js:

1. Os arquivos nativos estão na pasta **`/php-dist`**:
   - `index.html`: Portal principal dos 3 Pilares com chat de Camilla Faria e checkout.
   - `admin.html`: Painel administrativo com gerenciador de módulos, terminal CLI e auditoria.
   - `config.php`: Configurações centrais e credenciais do Mercado Pago / Gemini.
   - `database.php`: Gerenciador PDO com suporte a MySQL e SQLite embutido.
   - `auth.php`: Login seguro com lockout de 30s após 5 falhas, hash Bcrypt e 2FA.
   - `camilla_ia.php`: IA com Gemini via cURL e diagnóstico de fotos de máquinas e peças.
   - `mercadopago.php`: Gateway de pagamentos (PIX QR Code, Cartão 12x e Webhooks HMAC).
   - `admin_cli.php`: Terminal de comandos executável via terminal ou HTTP.
   - `security_audit.php`: Auditoria total de segurança em tempo real.
   - `curl_commands.sh`: 15 testes de integração cURL automatizados.

2. Executar suíte de testes cURL no servidor:
```bash
cd /caminho/do/projeto/php-dist
chmod +x curl_commands.sh
./curl_commands.sh
```

---
**Suporte e Documentação Técnica:**
Qualquer dúvida adicional pode ser consultada no arquivo `DOCUMENTATION.md` ou na aba de Manuais no Portal do Administrador.

