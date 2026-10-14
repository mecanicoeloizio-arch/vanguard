# EloContábil • Apoio Administrativo & RH Sem Necessidade de CRC

**Subdomínio Oficial:** `https://elocontabil.grupoeloizio.com.br`  
**Pasta Raiz:** `/elocontabil/`  
**Document Root Web:** `/elocontabil/public/`  
**Atendente Oficial:** Camilla Faria (WhatsApp: `21 99613-4073`)  
**Conexão Webhook:** `https://webhook.grupoeloizio.com.br`  

---

## 📌 O que é o EloContábil
Um sistema de apoio administrativo, RH e organização pré-contábil que **NÃO precisa de CRC**.  
Ele **não** faz contabilidade privativa, **não** assina balanço e **não** calcula imposto complexo.  
Ele apenas **ORGANIZA e INFORMA** para que o cliente envie tudo mastigado e sem erros para o seu contador responsável.

> **Regra de Ouro (Aviso Obrigatório no Rodapé e Telas):**  
> *"EloContábil é apoio administrativo, não substitui seu contador responsável."*

---

## 🚀 Como Funciona o Acesso (Zero Senhas)
1. **Tela Inicial:** Apenas campo de WhatsApp e E-mail com o botão **"Falar com a Camilla"**.
2. **Triagem Automática:** A Camilla Faria verifica se o contato já existe:
   - Se já existe: continua o atendimento amigável e gera o link seguro.
   - Se é novo: pergunta qual serviço busca (1- RH, 2- Cofre/Administrativo, 3- Atendimento direto) e faz a triagem.
3. **Link Temporário:** A Camilla gera e envia o link `/acesso/{token}` válido por **30 minutos**.
4. **Validação:** Ao clicar no link, o sistema valida a data de expiração, cria sessão temporária e abre o Dashboard.

---

## 🗂️ Os 3 Módulos do Sistema

### 1. RH de Apoio
- Controle de ponto simples dos colaboradores.
- Controle e alertas de vencimento de ASO (Atestado de Saúde Ocupacional).
- Controle de tamanhos de uniforme e entrega de EPIs (com termo de responsabilidade NR-06).
- Checklist de admissão e demissão para envio via WhatsApp pela Camilla.
- Gerador de modelos prontos de advertência disciplinar escrita (Art. 482 CLT) e termos de entrega.
- Organização prévia de holerites para envio aos colaboradores.

### 2. Administrativo & Cofre
- Cofre de documentos da empresa com alerta de vencimento de alvarás e contratos de locação.
- Agenda de lembretes automáticos com destaque para a regra: *"Enviar documentos para o contador até dia 28"*.
- Controle básico de contas a pagar e receber para conciliação antes do fechamento.
- Gestão central de colaboradores e dados corporativos.

### 3. Central da Camilla
- Conexão 100% obrigatória com o **Webhook Central** (`webhook.grupoeloizio.com.br`).
- A Camilla recebe documentos e comprovantes por link temporário seguro.
- Envia checklists de admissão e 2ª via de holerite por WhatsApp.
- Encaminha pacotes de documentos e relatórios organizados diretamente por e-mail para o contador responsável cadastrado (`contabilidade@grupoeloizio.com.br`).

---

## ⚙️ Configuração Apache / Hostinger
O arquivo `.htaccess` na raiz redireciona para `/public/` mantendo as rotas amigáveis:
- `/` -> Tela de Entrada com a Camilla
- `/acesso/{token}` -> Validação de acesso sem senha
- `/dashboard` -> Painel dos 3 módulos
- `/api/webhook_receiver.php` -> Receptor interno de mensagens do Hub Central
