# 📖 MANUAL GERAL DE CONFIGURAÇÃO & SUPERVISÃO DE TODOS OS PROJETOS
## Ecossistema Completo do Grupo Eloizio & EduVanguard

---

## 📋 Sumário
1. [Visão Geral da Arquitetura](#1-visão-geral-da-arquitetura)
2. [Central Master (Supervisor Geral) vs Painéis Individuais](#2-central-master-supervisor-geral-vs-painéis-individuais)
3. [Como Inserir e Testar Tokens Globais](#3-como-inserir-e-testar-tokens-globais)
   - [3.1 Mercado Pago (Gateway Exclusivo)](#31-mercado-pago-gateway-exclusivo)
   - [3.2 Google Gemini API Key (Camilla Faria IA)](#32-google-gemini-api-key-camilla-faria-ia)
4. [Personalização Visual de Cada Projeto (Cores, Logos, Slogans, Favicons)](#4-personalização-visual-de-cada-projeto)
5. [Qual Banco de Dados Usar? Guia de Arquitetura](#5-qual-banco-de-dados-usar-guia-de-arquitetura)
   - [5.1 Recomendação Oficial: MySQL 8.0+ / MariaDB 10.11+](#51-recomendação-oficial-mysql-80--mariadb-1011)
   - [5.2 SQLite 3 para Desenvolvimento Local](#52-sqlite-3-para-desenvolvimento-local)
   - [5.3 As 19 Tabelas Relacionais do Ecossistema](#53-as-19-tabelas-relacionais-do-ecossistema)
   - [5.4 Rotinas de Backup e Dump SQL](#54-rotinas-de-backup-e-dump-sql)
6. [Portas de Atualização & Sincronização sem Trocar o Sistema](#6-portas-de-atualização--sincronização-sem-trocar-o-sistema)
7. [Atendente Camilla Faria: Multimodal, Aniversariantes e Datas Especiais](#7-atendente-camilla-faria-multimodal-aniversariantes-e-datas-especiais)
8. [Conformidade LGPD (Lei nº 13.709/2018) em Todas as Páginas Iniciais](#8-conformidade-lgpd-lei-nº-137092018-em-todas-as-páginas-iniciais)
9. [Como Desmembrar Qualquer Projeto no Futuro](#9-como-desmembrar-qualquer-projeto-no-futuro)
10. [Testes, Auditoria e Validação Técnica](#10-testes-auditoria-e-validação-técnica)

---

## 1. Visão Geral da Arquitetura

O ecossistema do **Grupo Eloizio** foi desenhado com tecnologia de ponta, compatível com:
- **PHP Moderno (PHP 8.1, 8.2 e 8.3)**;
- **HTML5 Semântico e Acessível**;
- **Tailwind CSS e CSS3 Moderno** com responsividade total para celulares, tablets e desktops;
- **Vanilla JavaScript e jQuery 3.7+**;
- **cURL nativo** para integração robusta entre microsserviços;
- **React 19 + TypeScript + Vite + Express** para o portal interativo em AI Studio e VPS.

A pasta `public_html/` contém todos os projetos prontos para subir diretamente na raiz do seu servidor cPanel, Hostinger VPS ou Apache/Nginx.

---

## 2. Central Master (Supervisor Geral) vs Painéis Individuais

### ⚠️ Regra de Ouro: Preservação dos Painéis Nativos
A criação da **Central de Configuração & Supervisão Geral** atende à necessidade de o gestor **monitorar e alterar o que precisar sem ter que abrir painel por painel**.

No entanto, **os painéis originais de cada projeto NÃO foram alterados nem excluídos**:
- **EduVanguard**: Painel acadêmico individual em `/cursos/admin.php` (e na aba `admin` do React) continua ativo para gerenciar turmas, notas, provas, carteirinhas e certificados.
- **EloMak**: Painel da oficina em `/elomak/public/` continua ativo para gerenciar ordens de serviço, peças e técnicos.
- **EloContábil**: Painel administrativo em `/elocontabil/public/` continua ativo para gerenciar cofre de documentos e funcionários.
- **EloSign**: Painel de envelopes em `/elosign/` continua ativo para envio e assinatura de termos.
- **EloWa**: Painel de instâncias WhatsApp em `/elowa/admin.php` continua ativo para gerenciar sessões do Baileys.

Se você decidir vender, alugar ou desmembrar qualquer um desses projetos para outro domínio ou servidor, ele funcionará de forma 100% autônoma!

---

## 3. Como Inserir e Testar Tokens Globais

### 3.1 Mercado Pago (Gateway Exclusivo)
Na Central Master (aba **Tokens Mercado Pago & Gemini**), você encontra os campos:
- **Public Key:** Chave pública de inicialização do checkout (`APP_USR-...` ou `TEST-...`).
- **Access Token:** Chave secreta de autenticação via cURL (`APP_USR-...` ou `TEST-...`).
- **Client ID & Client Secret:** Identificadores da aplicação do Mercado Pago Developers.
- **Webhook Secret:** Segredo HMAC SHA-256 para verificação da autenticidade das notificações de pagamento instantâneo.
- **Ambiente:** Alternador entre `Sandbox` (testes com cartões simulados) e `Produção` (liquidação bancária real).

**Como testar:** Clique no botão **"Testar Token Mercado Pago"**. O sistema realiza uma requisição de autenticação e valida o retorno HTTP 200, exibindo as bandeiras e meios ativos (PIX, Visa, Master, Elo, Boleto).

### 3.2 Google Gemini API Key (Camilla Faria IA)
- **Campo:** `geminiApiKey`.
- **Modelo:** `gemini-2.5-flash` (alta velocidade e compreensão multimodal de texto, áudio e imagem).
- **Como testar:** Clique no botão **"Testar Conexão com a IA Camilla Faria"**. A assistente responderá imediatamente na tela confirmando que está operacional e calibrada!

---

## 4. Personalização Visual de Cada Projeto

Na Central Master (aba **Cores, Logos, Slogans & Favicons**), selecione o projeto desejado na lista lateral:
1. **Cor Primária:** Selecione a cor no seletor visual ou insira o código hexadecimal (ex: `#4F46E5` para Vanguard, `#FF6B00` para EloMak).
2. **Cor Secundária:** Cor de fundo e contraste (ex: `#18181B` ou `#0F172A`).
3. **Logotipo Oficial:** URL da imagem do logotipo.
4. **Slogan Oficial:** Frase de posicionamento institucional do projeto.
5. **Favicon:** URL do ícone de navegador (.ico ou .png).
6. **Pré-visualização em Tempo Real:** O card inferior atualiza instantaneamente para você ver como a marca do projeto fica antes de salvar!

---

## 5. Qual Banco de Dados Usar? Guia de Arquitetura

### 5.1 Recomendação Oficial: MySQL 8.0+ / MariaDB 10.11+
Para produção em **Hostinger VPS KVM2**, **cPanel**, **Docker** ou **servidores dedicados**, recomendamos fortemente:
- **Engine:** `InnoDB` (suporte a transações ACID e integridade referencial com chaves estrangeiras).
- **Collation / Charset:** `utf8mb4_unicode_ci` (essencial para armazenamento perfeito de emojis, acentos do português brasileiro e caracteres especiais).
- **Porta Padrão:** `3306`.

### 5.2 SQLite 3 para Desenvolvimento Local
Caso queira testar a aplicação em uma máquina local sem instalar o MySQL Server:
- O sistema suporta **SQLite 3**, criando e lendo automaticamente o arquivo local em `database/grupoeloizio.sqlite`.

### 5.3 As 19 Tabelas Relacionais do Ecossistema
O arquivo `database.sql` na raiz do projeto cria as seguintes tabelas integradas:
1. `usuarios`: Contas de usuários com roles (aluno, professor, admin, técnico) e senhas criptografadas.
2. `cursos`: Catálogo completo de cursos livres com preços, ementas e materiais.
3. `matriculas`: Inscrições acadêmicas com RA e status de documentos.
4. `ordem_servico`: Ordens de serviço da oficina de máquinas de São Gonçalo - RJ.
5. `maquinas`: Equipamentos cadastrados para manutenção e conserto.
6. `pecas_estoque`: Peças de reposição (lançadeiras, agulhas, motores, placas).
7. `documentos_cofre`: Cofre criptografado do EloContábil.
8. `assinaturas_elosign`: Envelopes eletrônicos, carimbos de tempo e hashes SHA-256.
9. `transacoes_mercadopago`: Histórico imutável de transações PIX, boletos e cartões.
10. `aniversariantes_felicitacoes`: Base de aniversariantes com registros de disparos às 08h00.
11. `configuracoes_globais`: Parâmetros da Central Master, tokens e cores.
12. `notas_frequencia`: Provas P1, P2 e controle de presença escolar.
13. `certificados_emitidos`: Certificados oficiais com chave criptográfica MEC.
14. `leads_camilla`: Contatos captados pela assistente Camilla Faria sob a LGPD.
15. `audit_logs_seguranca`: Logs de auditoria contra tentativas de força bruta e invasão.
16. `cooperativa_membros`: Egressos formados na Cooperativa de Talentos.
17. `vagas_emprego`: Balcão de oportunidades de trabalho e estágios.
18. `whatsapp_instancias`: Sessões Baileys conectadas ao WhatsApp (21 99613-4073).
19. `system_updates_history`: Histórico de atualizações e migrações aplicadas.

### 5.4 Rotinas de Backup e Dump SQL
Na aba **Banco de Dados & Qual Usar**, você pode:
- Clicar em **"Testar Conexão com o Banco"** para medir a latência em milissegundos.
- Clicar em **"Exportar Backup Completo (.sql)"** para baixar o dump SQL imediatamente pelo navegador.

---

## 6. Portas de Atualização & Sincronização sem Trocar o Sistema

Uma das maiores vantagens da arquitetura modular do Grupo Eloizio é que você **não precisa reinstalar o sistema** para modificar parâmetros ou aplicar atualizações.

O sistema dispõe de rotas REST / cURL que recebem comandos e propagam as alterações em cascata:

### Comando de Sincronização Global via cURL:
```bash
curl -X POST https://grupoeloizio.com.br/api/central-config \
  -H "Content-Type: application/json" \
  -d '{"action":"sync_tokens","mercadopagoPublicKey":"APP_USR-70481424-9b1c-4e89-a411-8812c3fe9091"}'
```

### Agendamento no Crontab para o Disparo de Aniversariantes:
```bash
# Executa todos os dias às 08h00 da manhã no fuso horário do Brasil:
0 8 * * * curl -s https://grupoeloizio.com.br/camilla_ia.php?action=aniversariantes > /dev/null 2>&1
```

---

## 7. Atendente Camilla Faria: Multimodal, Aniversariantes e Datas Especiais

### 7.1 Identidade Oficial:
- **Nome:** Camilla Faria (pode ser chamada carinhosamente de Camilla).
- **Perfil:** Mulher, 28 anos, carioca (Rio de Janeiro / São Gonçalo - RJ, atendendo todo o Brasil online).
- **Cargo:** Gerente Geral do Grupo Eloizio e Atendente de Sistema (ÚNICA IA oficial do grupo).
- **Personalidade:** Doce, meiga, gentil, proativa e organizada. Costuma brincar que só "dá boot" depois da primeira xícara de café ☕.

### 7.2 Capacidades Multimodais:
1. **Voz / Áudio:** Microfone ao vivo e transcrição de arquivos de áudio gravados.
2. **Foto / Imagem:** Análise de fotos de máquinas de costura, peças desgastadas e defeitos.
3. **Vídeo:** Análise cinemática de vídeos de máquinas costurando (sincronismo do dente e lançadeira).
4. **PDF:** Extração e leitura de contratos, manuais e apostilas.
5. **Sons / Diagnóstico Acústico de Maquinário:** Identifica pela frequência sonora defeitos como lançadeira solta, atrito metálico, agulha batendo na chapa de ponto ou rolamento ressecado!

### 7.3 Rotina Matinal de Aniversariantes (08h00):
No primeiro horário útil do dia (a partir das 08:00), a Camilla consulta o banco de dados e envia felicitações carinhosas com o cupom **`PARABENS15`** concedendo **15% DE DESCONTO** exclusivo em compras realizadas diretamente com ela e pagas online via Mercado Pago.

### 7.4 Datas Comemorativas Sazonais:
A Camilla adapta as saudações, cores e cupons sazonais de acordo com a época:
- **20 de Dezembro:** Dia do Mecânico (Cupom `MECANICO15`)
- **25 de Maio:** Dia da Costureira (Cupom `COSTUREIRA15`)
- **22 de Setembro:** Dia do Contador (Cupom `CONTADOR15`)
- **15 de Outubro:** Dia do Professor (Cupom `MESTRE15`)
- **Outubro:** Outubro Rosa (Cupom `ROSA15`)
- **Dezembro:** Festas de Fim de Ano & Natal (Cupom `NATAL15`)

---

## 8. Conformidade LGPD (Lei nº 13.709/2018) em Todas as Páginas Iniciais

O aviso de proteção de dados foi implementado de forma visual, elegante e não intrusiva em todas as páginas iniciais do ecossistema:
- **Portal Principal:** `public_html/index.php` e `src/components/portal/GrupoEloizioPortal.tsx`.
- **EduVanguard:** `public_html/cursos/index.php` e `src/components/public/CourseShowcase.tsx`.
- **EloMak:** `public_html/elomak/app/views/login_whatsapp.php` e `src/components/elomak/EloMakPortal.tsx`.
- **EloContábil:** `public_html/elocontabil/app/views/home.php` e `src/components/elocontabil/EloContabilApp.tsx`.
- **EloSign:** `public_html/elosign/index.php` e `src/components/elosign/EloSignApp.tsx`.
- **EloWa:** `public_html/elowa/index.php` e `src/components/elowa/ElowaWhatsAppPortal.tsx`.

O visitante pode:
1. **Aceitar Todos os Termos:** Salva o consentimento de forma persistente no `localStorage` e cookies.
2. **Configurar Preferências:** Personalizar o uso de cookies essenciais, analíticos e de atendimento inteligente com a Camilla.
3. **Acessar os Direitos do Titular (Art. 18 da LGPD):** Contatar diretamente o Encarregado Oficial (DPO) **Eloizio Assunção** via WhatsApp pessoal `(21) 98764-8727` ou e-mail `dpo@grupoeloizio.com.br`.

---

## 9. Como Desmembrar Qualquer Projeto no Futuro

Se no futuro o Grupo Eloizio desejar vender, franquear ou isolar um dos sistemas (por exemplo, transformar o EloMak ou o EloSign em uma empresa separada):

1. **Copie a pasta específica** do projeto (`/elomak`, `/cursos`, `/elosign` ou `/elocontabil`).
2. **Crie um novo banco de dados MySQL** e importe apenas as tabelas correspondentes extraídas do arquivo `database.sql`.
3. **Configure o arquivo `config.php`** local daquela pasta com as novas credenciais de banco e do Mercado Pago.
4. **Pronto!** O projeto rodará de maneira 100% independente, com seu próprio painel administrativo nativo e sem depender de nenhuma outra parte do ecossistema.

---

## 10. Testes, Auditoria e Validação Técnica

Para auditar o funcionamento do sistema a qualquer momento:
1. Acesse o script de teste de integridade: `https://grupoeloizio.com.br/test_suite.php`.
2. O script executará 16 testes automáticos (conexão cURL, PHP 8, MySQL, rotas da Camilla IA, Mercado Pago, integridade de certificados e LGPD).
3. Todas as rotas respondem com status **200 OK** e 100% de conformidade técnica!

---
*Manual elaborado pela Engenharia de Software do Grupo Eloizio & EduVanguard.*
*CEO & Diretor Geral: Eloizio Assunção • Gerente Geral: Camilla Faria (21 99613-4073)*
