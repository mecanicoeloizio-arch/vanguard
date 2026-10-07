# 🚀 Grupo Eloizio — Pacote Completo PHP 8, HTML5, CSS3, JavaScript Vanilla & cURL

Este pacote contém o sistema completo e 100% autônomo do **Grupo Eloizio** construído em **PHP 8.1+**, **HTML5**, **Tailwind CSS**, **JavaScript** e **cURL**.

### 🌟 Destaque de Transporte
> **NÃO PRECISA DE NENHUMA INSTALAÇÃO!**  
> Basta transportar e colocar todo o conteúdo desta pasta (`php-dist/`) diretamente dentro da pasta **`public_html`** do seu servidor cPanel, Apache, HostGator, Hostinger, Locaweb ou Nginx.  
> Não precisa rodar `npm install`, não precisa de `composer install`, não precisa de Node.js no servidor de produção.

---

## 🔑 Credenciais Master de Acesso
- **Senha Master Oficial:** `ELOIZIO@MASTER2026`
- **E-mail do Administrador / CEO:** `mecanicoeloizio@gmail.com` ou `eloizio@grupoeloizio.com.br`
- **Expert Vanguard & Marketing:** `sofia@grupoeloizio.com.br` (Cupom ativo: `SOFIA15` com -15% OFF)
- **Aluno Padrão:** `aluno@grupoeloizio.com.br`
- **Professor / Docente:** `mariana.fernandes@grupoeloizio.com.br`

---

## 📂 Catálogo Completo de Páginas & Recursos (`public_html`)

| Arquivo | Descrição & Recursos |
| :--- | :--- |
| **`index.php`** | **Vitrine de Cursos Oficiais & Portal Principal:** Catálogo com filtros por categoria (Tecnologia, Engenharia, Negócios, Design), modal com ementa completa de aulas, cálculo de parcelamento em até 12x e checkout de matrícula via PIX Mercado Pago. |
| **`aluno.php`** | **Portal Acadêmico do Aluno:** Videoaulas com player LMS, anotações, transcrição, materiais para download, **Simulador Técnico Interativo** (com teste de componentes de máquinas de costura e injeção, ajuste de RPM, tensão e osciloscópio), Boletim Escolar com notas e faltas, avaliações online, emissão de Certificado Oficial com QR Code e histórico financeiro. |
| **`professor.php`** | **Portal do Professor:** Lançamento de notas bimestrais (N1, N2, Trabalhos), registro de presença/frequência dos alunos com cálculo automático de porcentagem, gerenciamento de módulos e aulas. |
| **`admin.php`** | **Painel Executivo da Direção (CEO Eloizio & Sofia Vanguard):** Catálogo de cursos com exclusão e edição, **Preenchimento de Cursos via Texto (Rápido)** com formulário e modelos pré-formatados, Gestão completa de Matrículas e Alunos, CRM de Propostas Comerciais de Cursos e Alunos com cupom `SOFIA15`, Conciliação financeira Mercado Pago e Auditoria com logs da Senha Master `ELOIZIO@MASTER2026`. |
| **`propostas.php`** | **Central de Propostas de Cursos & Alunos:** Simulador e gerador de Proposta Comercial Personalizada com desconto de 15% (Cupom `SOFIA15`), cálculo de 12x sem juros, link direto para conversa no WhatsApp oficial do aluno, histórico de propostas ativas (CRM) e Propostas de Novos Cursos submetidas pela comunidade. |
| **`validar_certificado.php`** | **Validador Oficial de Certificados:** Consulta pública por código de registro (ex: `CERT-2026-BR-8912`) ou hash SHA-256, exibição do certificado oficial autêntico com QR Code, dados do formando, carga horária, assinaturas e botão de impressão em papel timbrado ou PDF. |
| **`calendario.php`** | **Calendário Acadêmico & Biblioteca Digital:** Cronograma com aulas inaugurais, plantões de dúvidas ao vivo com o CEO Eloizio, datas de avaliações e acervo de apostilas em PDF para download gratuito. |
| **`chat.php`** | **Chat Acadêmico & Central de Mensagens:** Canais de atendimento (Mural Geral de Avisos, Atendimento com a Expert Sofia Vanguard, Oficina & Máquinas com Eloizio Silva, Tira-Dúvidas dos Alunos) com envio de mensagens em tempo real. |
| **`manuais.php`** | **Manuais do Sistema & Procedimentos:** Manual do Aluno, Manual do Administrador, Manual do Professor e Guia Operacional de Deploy. |
| **`auth.php`** | **Autenticação Segura & Senha Master:** Login unificado para Aluno, Professor e Administrador, bloqueio de força bruta e bypass imediato com a Senha Master `ELOIZIO@MASTER2026`. |
| **`dados.php`** | **Repositório Central de Dados:** Base portátil de cursos, ementas, alunos, propostas comerciais, notas, avaliações, certificados e mensagens com cache JSON automático. |
| **`mercadopago.php`** | **Gateway Mercado Pago Nativo:** Checkout Pro, PIX com QR Code dinâmico e validação HMAC SHA-256 de webhooks via cURL. |
| **`sofia_ia.php`** | **Sofia Vanguard — Expert em Cursos & Marketing:** Diagnóstico técnico multimodal de máquinas e motor cognitivo especialista com psicologia de marketing educacional. |
| **`admin_cli.php`** | **Terminal CLI Administrativo:** Comandos de auditoria, diagnóstico de sistema e conciliação financeira. |
| **`header.php` / `footer.php`** | **Cabeçalho e Rodapé Universais:** Navbar responsiva com menu desktop e drawer mobile, modal universal de login com a Senha Master e links integrados. |

---

## 🚀 Como Fazer o Deploy na Hospedagem (cPanel / Apache)

1. Conecte-se ao seu cPanel ou FTP (FileZilla);
2. Navegue até a pasta raiz do seu domínio (geralmente **`public_html/`**);
3. Envie todos os arquivos da pasta **`php-dist/`** diretamente para dentro de **`public_html/`**;
4. Pronto! Acesse seu domínio:  
   - `https://seudominio.com.br/` (abre automaticamente `index.php`)
   - `https://seudominio.com.br/admin.php` (painel da Direção)
   - `https://seudominio.com.br/propostas.php` (central de propostas)
   - `https://seudominio.com.br/aluno.php` (portal do aluno)

---

## 🧪 Testando Localmente com Servidor Embutido do PHP

Caso queira testar na sua máquina antes de enviar para o servidor:

```bash
cd php-dist
php -S 0.0.0.0:8000
```

Abra no navegador:
- Vitrine: `http://localhost:8000/index.php`
- Propostas de Cursos e Alunos: `http://localhost:8000/propostas.php`
- Painel Administrativo: `http://localhost:8000/admin.php`
- Portal do Aluno: `http://localhost:8000/aluno.php`
- Validador de Certificados: `http://localhost:8000/validar_certificado.php`
