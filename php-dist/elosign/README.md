# EloSign • Assinatura Eletrônica Inteligente para Oficinas Mecânicas e Cursos

**Subdomínio Oficial:** `elosign.grupoeloizio.com.br`  
**Pasta Raiz do Projeto:** `/elosign`  
**Motor de PDF & Criptografia:** `pdf-lib` + SHA-256 + Página de Auditoria Jurídica  
**Base Legal:** Assinatura Eletrônica Avançada conforme **Lei nº 14.063/2020** e **Medida Provisória nº 2.200-2/2001**  

---

## 1. Proposta de Valor e Planos Comerciais

> **Headline:** "O cliente da sua oficina assina pelo WhatsApp em 30 segundos"  
> **Sub:** "Chega de papel. Validade jurídica, prova por selfie e integrado ao seu sistema EloMak"

### Planos do SaaS:
1. **Plano Start (R$ 39/mês):** 30 documentos/mês, prova por selfie, carimbo de tempo.
2. **Plano Pro (R$ 69/mês):** 100 documentos/mês, envio direto pelo WhatsApp via EloWa, logo da sua oficina.
3. **Plano Enterprise (R$ 129/mês):** 300 documentos/mês, White Label total, acesso à API REST e Widget para EloMak.

---

## 2. Funções de Inteligência Artificial (Google AI Studio - Gemini)

Implementadas com prompts certificados:

### Função A - `gerarTituloMensagem`
```text
Prompt: "Você é o Click.AI do EloSign. Analise o texto deste contrato: {texto_pdf}. Gere um JSON com: titulo (max 8 palavras, profissional) e mensagem_whatsapp (curta, amigável, explicando o que é o documento e urgência para assinar). Retorne só JSON."
```

### Função B - `resumirParaSignatario`
```text
Prompt: "Você é um advogado que simplifica contratos para clientes leigos de oficina mecânica. Resuma este contrato em 3 bullets simples, sem juridiquês, destacando valor, o que está sendo autorizado e garantia. Texto: {texto_pdf}. Retorne em markdown."
```

### Função C - `extrairDados`
```text
Prompt: "Extraia deste texto de OS/Orçamento as chaves: nome_cliente, cpf, telefone, placa, veiculo, valor_total, forma_pagamento. Retorne JSON. Se não achar, retorne null na chave. Texto: {texto_pdf}"
```

---

## 3. Fluxo de Assinatura Mobile-First (`/s/:id`)

1. O cliente clica no link enviado pelo WhatsApp em menos de 30 segundos.
2. Visualiza a Logo da oficina, o Título amigável e o Resumo em 3 bullets gerados por IA.
3. Visualiza o PDF na tela do celular.
4. Marca "Li e concordo com o documento".
5. Passa pela etapa de autenticação (Selfie Dinâmica com câmera, CNH frente/verso ou E-mail/SMS).
6. Assina com o dedo na tela em canvas de alta precisão.
7. O sistema gera automaticamente o carimbo de auditoria jurídica SHA-256 e acopla a página de evidências ao PDF via `pdf-lib`.

---

## 4. Integração EloSign x EloMak e Vanguard

### Documentação da API REST:
`POST /api/v1/envelopes/create`  
Headers: `X-Api-Key: SEU_KEY`

```json
{
  "title": "Ordem de Serviço #2026-90",
  "templateId": "tpl_os_autorizacao",
  "authMethod": "selfie_dynamic",
  "signers": [
    {
      "name": "João da Silva",
      "email": "joao@email.com",
      "phone": "21996134073",
      "cpf": "123.456.789-00"
    }
  ],
  "variables": {
    "nome_cliente": "João da Silva",
    "cpf": "123.456.789-00",
    "placa": "RIO-2026",
    "valor_servico": "1.450,00",
    "prazo_garantia": "90 dias"
  }
}
```

### Componente Widget Embutido no EloMak:
```html
<iframe 
  src="https://elosign.grupoeloizio.com.br/embed?apiKey=SUA_CHAVE_ELOMAK" 
  width="100%" 
  height="600" 
  style="border: none; border-radius: 16px;"
></iframe>
```
O EloMak pode disparar `window.postMessage({ type: 'ELOMAK_OS_DATA', payload: {...} })` e o EloSign preenche automaticamente todos os dados.

---

## 5. Validação Pública Anti-Fraude (`/validar/:hash`)
Qualquer perito, cliente ou mecânico pode verificar a integridade do PDF assinado inserindo o hash SHA-256 ou escaneando o QR Code da página de auditoria.
