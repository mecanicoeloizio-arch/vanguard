# Servidor de E-mail & Webmail Oficial • Grupo Eloizio

**Subdomínio Oficial:** `webmail.grupoeloizio.com.br`  
**Pasta Raiz do Projeto:** `/mail`  
**Motor de Envio:** PHPMailer 6.9+ com suporte a SMTP, anexos MIME, HTML e UTF-8.  
**Domínios Suportados:** `@grupoeloizio.com.br`, `@eduvanguard.com.br`, `@aluno.eduvanguard.com.br`

---

## 1. Visão Geral e Regras de Negócio
- **Alunos Vanguard:** Acesso **100% Gratuito** e vitalício enquanto matriculado em cursos livres do Grupo Eloizio. Cota de 1 GB de armazenamento por aluno.
- **Assinantes Corporativos / Oficinas Externas:** Planos pagos processados exclusivamente via **Mercado Pago** (PIX ou Cartão em até 12x):
  - *Plano Pro:* R$ 19,90/mês (5 GB de cota).
  - *Plano Enterprise:* R$ 39,90/mês (15 GB de cota para até 5 caixas postais).
- **Diretoria & Gerência:** Caixas de alta capacidade para **Eloizio Assunção (CEO)** e **Camilla Faria (Gerente Geral)**.

---

## 2. Estrutura da Pasta `/mail`
- `index.php`: Interface completa de Webmail responsiva (Caixa de Entrada, Enviados, Rascunhos, Lixeira, Leitor, Compositor e Download de Anexos).
- `admin.php`: Painel Administrativo para criação de contas, gestão de cotas, controle de assinaturas e auditoria de tráfego.
- `api.php`: API RESTful JSON para envio, recebimento, encaminhamento e gestão de mensagens e anexos.
- `config.php`: Definições globais de servidor SMTP, cotas, caminhos de storage e planos.
- `PHPMailer/`: Biblioteca completa autônoma (PHPMailer.php, SMTP.php, Exception.php).
- `storage/`: Armazenamento persistente local de caixas postais (`mailboxes.json`), e-mails (`emails.json`) e anexos (`attachments/`).
- `.htaccess`: Roteamento e regras de segurança para Apache/LiteSpeed.

---

## 3. Apontamento de DNS para `webmail.grupoeloizio.com.br`
No painel do seu registrador de domínio ou hospedagem (Hostinger, cPanel, Cloudflare), adicione:

1. **Subdomínio Webmail:**
   - Tipo: `A` | Nome: `webmail` | Valor: `[IP_DO_SEU_SERVIDOR]`
   - Ou Tipo: `CNAME` | Nome: `webmail` | Valor: `grupoeloizio.com.br`
   - Diretório apontado: `/mail` ou `public_html/mail`

2. **Registro de E-mail (MX):**
   - Tipo: `MX` | Nome: `@` | Valor: `mail.grupoeloizio.com.br` | Prioridade: `10`

3. **Autenticação SPF (TXT):**
   - Tipo: `TXT` | Nome: `@` | Valor: `v=spf1 mx a include:_spf.grupoeloizio.com.br ~all`

4. **Política DMARC (TXT):**
   - Tipo: `TXT` | Nome: `_dmarc` | Valor: `v=DMARC1; p=quarantine; pct=100; rua=mailto:dmarc@grupoeloizio.com.br`

---

## 4. Endpoints da API (`/mail/api.php`)
- `?action=status`: Retorna status do daemon, subdomínio e contadores.
- `?action=list_mailboxes`: Lista todas as contas de e-mail cadastradas.
- `?action=create_mailbox`: Cria novo endereço de e-mail com senha, cota e plano.
- `?action=get_messages`: Obtém mensagens de uma caixa e pasta específica.
- `?action=get_message_detail`: Abre e-mail completo com anexos e marca como lida.
- `?action=send_message`: Envia e-mail via PHPMailer com suporte a anexos em Base64.
- `?action=forward_message`: Encaminha e-mail preservando histórico e anexos.
- `?action=delete_message`: Move para a lixeira ou exclui definitivamente.
- `?action=update_subscription`: Altera status de assinante (Mercado Pago).
