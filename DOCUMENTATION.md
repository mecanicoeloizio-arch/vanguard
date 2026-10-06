# EduVanguard - Documentação Completa & Manuais Operacionais

Bem-vindo à documentação oficial do ecossistema **EduVanguard**, uma plataforma de gestão escolar e oferta de cursos 100% online integrada para Alunos, Professores e Direção Geral, com gateway Mercado Pago e conectores ERP acadêmicos (TOTVS, SAP e Senior).

---

## 📑 Índice
1. [Manual de Instalação, Deploy & Configuração Técnica](#1-manual-de-instalação--devops)
2. [Manual do Aluno](#2-manual-do-aluno)
3. [Manual do Professor](#3-manual-do-professor)
4. [Manual da Gestão & Direção Geral](#4-manual-da-gestão--direção-geral)
5. [Arquitetura Técnica, Webhooks & ERPs](#5-arquitetura-técnica-webhooks--erps)

---

## 1. Manual de Instalação & DevOps

### 1.1 Pré-requisitos
- **Node.js:** Versão 20.x ou 22.x LTS instalada no servidor.
- **npm** (v10+) ou **yarn** (v1.22+).
- **Memória RAM:** Mínimo de 2 GB (4 GB recomendado para produção com concorrência).
- **Nginx ou Caddy:** Como Reverse Proxy HTTPS com terminação TLS 1.3.

### 1.2 Instalação Passo a Passo

```bash
# 1. Obter o código-fonte
git clone https://github.com/instituicao/eduvanguard-plataforma.git
cd eduvanguard-plataforma

# 2. Instalar dependências
npm install

# 3. Configurar variáveis de ambiente
cp .env.example .env
```

### 1.3 Variáveis de Ambiente (`.env`)

Configure as seguintes chaves no seu arquivo `.env`:

```env
# Porta de execução
PORT=3000

# URL canônica da aplicação
APP_URL="https://sua-escola.eduvanguard.com.br"

# Gateway de Pagamentos Mercado Pago
MERCADO_PAGO_PUBLIC_KEY="APP_USR-xxxxxx-xxxxxx"
MERCADO_PAGO_ACCESS_TOKEN="APP_USR-xxxxxx-xxxxxx"
MERCADO_PAGO_WEBHOOK_SECRET="whsec_xxxxxx"

# Conector ERP Acadêmico
ERP_SYSTEM_TARGET="TOTVS" # "TOTVS" | "SAP" | "SENIOR"
ERP_API_ENDPOINT="https://api.totvs.edu.br/v2"
ERP_AUTH_TOKEN="Bearer eyJhbGciOi..."

# Criptografia LGPD
DATA_ENCRYPTION_SALT="eduvanguard_secret_salt_2026"
```

### 1.4 Comandos de Execução

```bash
# Ambiente de Desenvolvimento local
npm run dev

# Compilação de Produção
npm run build

# Pré-visualização do build
npm run preview
```

### 1.5 Dockerfile Multi-Stage de Produção

```dockerfile
FROM node:20-alpine AS builder
WORKDIR /app
COPY package*.json ./
RUN npm ci
COPY . .
RUN npm run build

FROM nginx:alpine
COPY --from=builder /app/dist /usr/share/nginx/html
EXPOSE 80
CMD ["nginx", "-g", "daemon off;"]
```

---

## 2. Manual do Aluno

### 2.1 Acessando as Aulas
1. Acesse o menu **"Área do Aluno"** > aba **"Minhas Aulas & Vídeos"**.
2. Selecione a aula desejada na trilha de aprendizagem à direita.
3. Você pode pausar, ajustar a velocidade e ler a **transcrição sincronizada** da aula.
4. Utilize o **caderno de anotações digital** para salvar seus resumos de estudo.
5. Baixe materiais complementares em PDF e clique no botão **"Marcar como Concluída"** para computar o progresso na barra de conclusão.

### 2.2 Boletim Escolar & Critérios de Aprovação
1. Na aba **"Boletim & Notas"**, visualize as disciplinas matriculadas.
2. Cada disciplina é avaliada por:
   - **P1 (Prova 1):** Peso de 35%.
   - **P2 (Prova 2):** Peso de 45%.
   - **Trabalhos (T1):** Peso de 20%.
3. **Média Final:** Mínimo de 7,0 para aprovação direta. Notas entre 5,0 e 6,9 dão direito a prova de recuperação.
4. Clique em **"Imprimir / Exportar Boletim em PDF"** para gerar a versão oficial para download.

### 2.3 Registro de Presença em Tempo Real
1. Na aba **"Presença em Tempo Real"**, clique no botão **"Registrar Presença na Aula de Hoje"**.
2. O sistema emite um código de autenticação (ex: `PRES-9912`) e atualiza sua taxa de assiduidade (mínimo obrigatório de 75%).

### 2.4 Provas e Quizzes Online
1. Na aba **"Provas, Quizzes & Trabalhos"**, selecione a avaliação disponível.
2. Em **Quizzes**, responda às questões de múltipla escolha dentro do cronômetro. A pontuação é corrigida automaticamente e lançada no boletim.
3. Em **Trabalhos**, digite suas considerações e anexe o arquivo PDF para o professor corrigir.

### 2.5 Emissão de Documentos Escolares (Carteirinha & Certificado)
1. Na aba **"Secretaria & Documentos"**, selecione o documento:
   - **Carteirinha Estudantil Digital Oficial (Padrão DNE):** R$ 25,00.
   - **Certificado de Conclusão com Chave ICP-Edu:** R$ 45,00.
   - **Histórico Escolar Oficial com Carimbo Digital:** R$ 15,00.
   - **Declaração de Matrícula para Estágio:** R$ 10,00.
2. Clique em **"Pagar com Mercado Pago"**.
3. Escolha **PIX Instantâneo** (QR Code ou chave Copia e Cola), **Cartão de Crédito em até 12x** ou **Boleto Bancário**.
4. Após a confirmação, o documento é liberado imediatamente com QR Code autenticador e botão para impressão ou download em PDF.

---

## 3. Manual do Professor

### 3.1 Publicação de Videoaulas e Conteúdo
1. Acesse **"Área do Professor"** > aba **"Gestão de Aulas & Conteúdo"**.
2. Clique em **"+ Publicar Nova Aula"**.
3. Defina título, módulo pertencente, duração e link do vídeo (YouTube, Vimeo ou arquivo MP4).
4. Insira a explicação teórica e transcrição de apoio.
5. Os alunos matriculados recebem uma notificação push informando sobre a nova aula.

### 3.2 Diário de Classe & Notas
1. Na aba **"Diário de Notas & Frequência"**, localize a planilha com os estudantes da turma.
2. Digite as notas obtidas em P1, P2 e Trabalhos. A média final e a situação do aluno são calculadas no mesmo instante.
3. Clique em **"Salvar Alterações"** para gravar no banco e emitir alerta para os boletins dos estudantes.

### 3.3 Elaboração de Avaliações
1. Na aba **"Criar Provas & Quizzes"**, clique em **"+ Criar Nova Avaliação / Quiz"**.
2. Defina enunciado, alternativas, gabarito e prazo de entrega.
3. Na seção de entregas recebidas, visualize os trabalhos enviados pelos alunos e atribua nota e parecer pedagógico.

### 3.4 Relatórios Pedagógicos & Exportação
1. Na aba **"Relatórios de Desempenho em Tempo Real"**, acompanhe a taxa de aprovação da turma e o gráfico de aproveitamento por disciplina.
2. Clique em **"Exportar para Excel / CSV"** para gerar a planilha de acompanhamento.
3. Clique em **"Imprimir Relatório em PDF"** para a ata do conselho de classe.

---

## 4. Manual da Gestão & Direção Geral

### 4.1 Inclusão de Cursos na Vitrine Pública
1. Acesse **"Direção & Gestão"** > aba **"Gestão de Cursos (Vitrine)"**.
2. Clique em **"+ Cadastrar Novo Curso na Vitrine"**.
3. Informe título, ementa, categoria, carga horária, professor responsável e preço à vista.
4. O parcelamento em até 12x é gerado automaticamente para os pagamentos do Mercado Pago.
5. O curso passa a ficar visível imediatamente na página inicial para visitantes realizarem matrícula.

### 4.2 Gestão de Matrículas e Alunos
1. Na aba **"Matrículas & Alunos"**, visualize a listagem com nome completo, número de registro acadêmico, e-mail e status regular.
2. Emita o contrato de prestação de serviços educacionais timbrado com assinatura ICP.

### 4.3 Gestão Financeira & Cobrança de Mensalidades
1. Na aba **"Módulo Financeiro & Mensalidades"**, analise a receita bruta realizada, valores a vencer e taxa de inadimplência.
2. Clique em **"🔔 Disparar Lembretes de Cobrança"** para enviar alertas automáticos aos alunos com mensalidades pendentes.
3. Exporte a conciliação contábil via arquivo CSV compatível com softwares de contabilidade.

### 4.4 Sincronização com ERPs (TOTVS, SAP, Senior Sponte)
1. Na aba **"Relatórios Acadêmicos & ERP"**, verifique o status dos conectores online.
2. Clique em **"Sincronizar TOTVS Edu"** ou **"Sincronizar Senior"** para transmitir dados acadêmicos e contábeis.
3. Cada operação gera um hash de integridade imutável registrado nos logs de auditoria.

### 4.5 Central de Notificações Push
1. Na aba **"Disparo de Notificações Push"**, redija avisos urgentes ou acadêmicos e envie diretamente para os dispositivos dos estudantes e professores.

---

## 5. Arquitetura Técnica, Webhooks & ERPs

### 5.1 Diagrama de Camadas
```
[Navegadores & Dispositivos Móveis (PWA / Offline Support)]
                       │
             (HTTPS / TLS 1.3)
                       │
       ┌───────────────▼───────────────┐
       │     EduVanguard Core App      │
       │   React 19 + TypeScript + CSS │
       └───────┬───────────────┬───────┘
               │               │
  ┌────────────▼────┐    ┌─────▼──────────┐
  │  Mercado Pago   │    │ Conectores ERP │
  │  PIX / Cartão   │    │  TOTVS / SAP   │
  │  Boleto (IPN)   │    │ Senior Sponte  │
  └─────────────────┘    └────────────────┘
```

### 5.2 Endpoint de Webhook Mercado Pago
- **Rota:** `POST /api/webhooks/mercadopago`
- **Cabeçalho:** `X-Signature: ts=...,v1=...`
- **Ação:** Confirmação instantânea de transações PIX, alterando o status do documento para liberado e gerando o hash criptográfico ICP-Edu.

### 5.3 Conformidade com LGPD
- **Hash de Integridade:** `SHA-256` aplicado a dados cadastrais e registros de notas escolares.
- **Auditoria Imutável:** Rastreabilidade de cada emissão de diploma e lançamento de frequência.
