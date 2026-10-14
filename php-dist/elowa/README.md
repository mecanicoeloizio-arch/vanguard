# EloWa • Servidor de WhatsApp Multi-Instância Oficial

**Subdomínio Oficial:** `elowa.grupoeloizio.com.br`  
**Pasta Raiz do Projeto:** `/elowa`  
**Motor Socket:** Biblioteca Baileys (`@whiskeysockets/baileys`) com Git integrado  
**WhatsApp Oficial Conectado:** `(21) 99613-4073` (Camilla Faria & Grupo Eloizio)  
**Tecnologias:** PHP 8.1+, HTML5, cURL, Tailwind CSS, JavaScript moderno, jQuery 3.7.1, Node.js Daemon  

---

## 1. Visão Geral e Regras de Negócio

1. **Gestão e Autonomia da Camilla Faria:**
   - Camilla Faria (Gerente Geral e Atendente Inteligente) possui acesso e permissão total para controlar todas as instâncias, disparos em massa, atendimentos e roteamento de mensagens.
   - O WhatsApp oficial do Grupo Eloizio e EduVanguard **(21) 99613-4073** está diretamente conectado a este servidor como Instância Master.

2. **Roteamento de Mensagens da EduVanguard:**
   - Todos os avisos da plataforma educacional (confirmação de matrículas, envio de boletos/PIX do Mercado Pago, liberação de certificados digitais e dúvidas com tutores) passam obrigatoriamente por esta infraestrutura.

3. **Alunos Vanguard vs. Assinantes Externos:**
   - **Alunos Vanguard:** Acesso **100% gratuito** ao dashboard e a 1 instância conectada para estudos, suporte e envio de dúvidas práticas de bancada.
   - **Assinantes (Oficinas e Mecânicos):** Pagamento recorrente via **Mercado Pago** (PIX ou Cartão em até 12x):
     - *Plano Oficina Pro:* R$ 49,90/mês (até 2 instâncias, envio ilimitado de áudio, vídeo, PDF e texto).
     - *Plano Corporativo Enterprise:* R$ 89,90/mês (até 5 instâncias com alta prioridade e suporte 24/7).

---

## 2. Tipos de Mídia Suportados

- **Texto:** Mensagens ricas com formatação, emojis e encaminhamento.
- **Áudio:** Mensagens de voz em formato PTT (Push-To-Talk) com codec Opus/OGG.
- **Vídeo:** Demonstrações técnicas e videoaulas em formato MP4 com reprodutor embutido.
- **Documentos (PDF):** Manuais técnicos, apostilas, carteirinhas e certificados com botão de download direto.
- **Imagens:** Fotos de maquinários, ordens de serviço e diagnósticos.

---

## 3. Apontamento de DNS para `elowa.grupoeloizio.com.br`

No seu provedor de DNS (Hostinger, Cloudflare ou cPanel):

1. **Subdomínio EloWa:**
   - Tipo: `A` | Nome: `elowa` | Valor: `[IP_DO_SEU_SERVIDOR]`
   - Ou Tipo: `CNAME` | Nome: `elowa` | Valor: `grupoeloizio.com.br`
   - Diretório raiz apontado: `/elowa` ou `public_html/elowa`

---

## 4. Endpoints da API RESTful (`/elowa/api.php`)

| Ação | Método | Descrição |
|---|---|---|
| `?action=status` | GET | Retorna status do daemon Baileys, instâncias e número oficial |
| `?action=list_instances` | GET | Lista todas as instâncias conectadas e pendentes |
| `?action=create_instance` | POST | Cria nova instância com código de pareamento de 8 dígitos ou QR Code |
| `?action=connect_instance` | POST | Conecta a instância ao socket Baileys |
| `?action=disconnect_instance` | POST | Desconecta a sessão do WhatsApp |
| `?action=get_chats` | GET | Retorna lista de conversas ativas da instância |
| `?action=get_messages` | GET | Retorna histórico de mensagens com mídias |
| `?action=send_message` | POST | Envia mensagem (Texto, Áudio, Vídeo, PDF) |
| `?action=forward_message` | POST | Encaminha mensagem para uma lista de destinatários |
| `?action=update_subscription` | POST | Ativa/renova plano de assinante via Mercado Pago |

### Exemplo cURL de Envio de PDF:
```bash
curl -X POST https://elowa.grupoeloizio.com.br/api.php?action=send_message \
  -H "Content-Type: application/json" \
  -d '{
    "instanceId": "inst_camilla_oficial",
    "chatPhone": "5521987648727",
    "chatName": "Eloizio Assunção",
    "type": "pdf",
    "text": "Segue o manual técnico solicitado!",
    "media": {
      "type": "pdf",
      "fileName": "Manual_Regulagem_Mecanica.pdf",
      "url": "https://grupoeloizio.com.br/elowa/storage/attachments/manual.pdf",
      "size": "2.1 MB"
    }
  }'
```
