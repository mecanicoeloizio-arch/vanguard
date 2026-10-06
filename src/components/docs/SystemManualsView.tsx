import React, { useState } from 'react';
import {
  BookOpen,
  Terminal,
  GraduationCap,
  UserCheck,
  Building2,
  Printer,
  Copy,
  Check,
  ShieldCheck,
  CreditCard,
  Layers,
  FileText,
  Search,
  ChevronRight,
  ExternalLink,
  Download,
  Code,
  Smartphone,
  Cpu,
  RefreshCw,
  Bell,
  CheckCircle2,
} from 'lucide-react';

export const SystemManualsView: React.FC = () => {
  const [activeManual, setActiveManual] = useState<'vps' | 'install' | 'student' | 'teacher' | 'admin' | 'api'>('vps');
  const [copiedCode, setCopiedCode] = useState<string | null>(null);
  const [searchDoc, setSearchDoc] = useState('');

  const copyToClipboard = (text: string, id: string) => {
    navigator.clipboard.writeText(text);
    setCopiedCode(id);
    setTimeout(() => setCopiedCode(null), 2500);
  };

  const handlePrint = () => {
    window.print();
  };

  return (
    <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8 space-y-8">
      {/* Documentation Banner */}
      <div className="bg-linear-to-r from-slate-900 via-indigo-950 to-indigo-900 text-white rounded-3xl p-6 sm:p-8 shadow-xl border border-indigo-500/20 flex flex-col md:flex-row items-start md:items-center justify-between gap-6 no-print">
        <div className="space-y-2">
          <div className="inline-flex items-center gap-2 px-3 py-1 rounded-full bg-indigo-500/20 text-indigo-300 text-xs font-semibold uppercase tracking-wider border border-indigo-400/30">
            <BookOpen className="w-3.5 h-3.5 text-amber-400" />
            Central Oficial de Documentação & Manuais Operacionais
          </div>
          <h1 className="text-2xl sm:text-3xl font-black tracking-tight">
            Manuais de Instalação, Aluno, Professor & Gestão Geral
          </h1>
          <p className="text-xs sm:text-sm text-indigo-200 max-w-2xl leading-relaxed">
            Guias completos e detalhados para implantação técnica, governança institucional, uso cotidiano por docentes e alunos, e integração com Mercado Pago e ERPs.
          </p>
        </div>

        <button
          onClick={handlePrint}
          className="px-5 py-3 bg-white text-indigo-900 hover:bg-indigo-50 rounded-2xl text-xs font-black flex items-center gap-2 shadow-lg shadow-black/20 cursor-pointer transition-all shrink-0"
        >
          <Printer className="w-4 h-4 text-indigo-600" />
          Imprimir / Salvar Manual em PDF
        </button>
      </div>

      {/* Manual Selection Tabs */}
      <div className="flex items-center gap-2 overflow-x-auto pb-2 border-b border-slate-200 no-print">
        {[
          { id: 'vps', label: '🚀 VPS Hostinger KVM2 & Contêiner Vanguard', icon: Cpu },
          { id: 'install', label: '1. Manual de Instalação & DevOps', icon: Terminal },
          { id: 'student', label: '2. Manual do Aluno', icon: GraduationCap },
          { id: 'teacher', label: '3. Manual do Professor', icon: UserCheck },
          { id: 'admin', label: '4. Manual da Gestão & Direção', icon: Building2 },
          { id: 'api', label: '5. Arquitetura, ERP & APIs', icon: Code },
        ].map((tab) => {
          const Icon = tab.icon;
          const isActive = activeManual === tab.id;
          return (
            <button
              key={tab.id}
              onClick={() => setActiveManual(tab.id as any)}
              className={`flex items-center gap-2 px-4 py-2.5 rounded-xl text-xs sm:text-sm font-bold whitespace-nowrap cursor-pointer transition-all ${
                isActive
                  ? 'bg-indigo-600 text-white shadow-md shadow-indigo-500/25'
                  : 'bg-white text-slate-600 hover:bg-slate-100 border border-slate-200'
              }`}
            >
              <Icon className="w-4 h-4" />
              {tab.label}
            </button>
          );
        })}
      </div>

      {/* Printable Manual Content Area */}
      <div className="bg-white rounded-3xl p-6 sm:p-10 border border-slate-200 shadow-sm print-container space-y-8">
        {/* ========================================================================= */}
        {/* 0. GUIA HOSTINGER VPS KVM2 & CONTÊINER VANGUARD */}
        {/* ========================================================================= */}
        {activeManual === 'vps' && (
          <div className="space-y-8">
            <div className="flex flex-col md:flex-row md:items-center justify-between gap-4 border-b border-slate-100 pb-6">
              <div>
                <div className="flex items-center gap-2 text-indigo-600 font-extrabold text-xs uppercase tracking-wider mb-1">
                  <Cpu className="w-4 h-4" /> Hostinger KVM2 VPS & Docker Container
                </div>
                <h2 className="text-2xl sm:text-3xl font-black text-slate-900">
                  Manual de Instalação no Hostinger VPS KVM2 (Contêiner Vanguard)
                </h2>
                <p className="text-sm text-slate-600 mt-1 leading-relaxed max-w-3xl">
                  Roteiro de implantação em produção: descompactação do arquivo ZIP, inicialização do contêiner <strong>Vanguard</strong>, execução do instalador PHP integrado e criação automática do banco de dados relacional.
                </p>
              </div>

              <div className="px-4 py-2 bg-indigo-50 border border-indigo-200 rounded-xl text-xs font-mono text-indigo-900 shrink-0">
                Instalador Web: <strong>/installer/index.php</strong><br />
                Instalador CLI: <strong>php installer/install-cli.php</strong>
              </div>
            </div>

            {/* Quick Flow Cards */}
            <div className="grid grid-cols-1 sm:grid-cols-4 gap-4">
              <div className="p-4 rounded-2xl bg-slate-50 border border-slate-200">
                <div className="w-7 h-7 rounded-lg bg-indigo-600 text-white font-bold text-xs flex items-center justify-center mb-2">1</div>
                <div className="font-bold text-xs text-slate-900 mb-1">Upload & Descompactar</div>
                <div className="text-[11px] text-slate-600">Baixe o .zip e descompacte no VPS ou contêiner com <code>unzip eduvanguard.zip</code></div>
              </div>
              <div className="p-4 rounded-2xl bg-slate-50 border border-slate-200">
                <div className="w-7 h-7 rounded-lg bg-amber-600 text-white font-bold text-xs flex items-center justify-center mb-2">2</div>
                <div className="font-bold text-xs text-slate-900 mb-1">Rodar Instalador PHP</div>
                <div className="text-[11px] text-slate-600">Acesse via web ou rode <code>php installer/install-cli.php</code> para provisionar o banco.</div>
              </div>
              <div className="p-4 rounded-2xl bg-slate-50 border border-slate-200">
                <div className="w-7 h-7 rounded-lg bg-emerald-600 text-white font-bold text-xs flex items-center justify-center mb-2">3</div>
                <div className="font-bold text-xs text-slate-900 mb-1">Criar Banco de Dados</div>
                <div className="text-[11px] text-slate-600">O <code>database.sql</code> é importado com 15 tabelas e dados seed iniciais.</div>
              </div>
              <div className="p-4 rounded-2xl bg-slate-50 border border-slate-200">
                <div className="w-7 h-7 rounded-lg bg-indigo-900 text-white font-bold text-xs flex items-center justify-center mb-2">4</div>
                <div className="font-bold text-xs text-slate-900 mb-1">Subir o Contêiner</div>
                <div className="text-[11px] text-slate-600">Inicie via <code>docker compose up -d</code> ou <code>pm2 start server.ts</code>.</div>
              </div>
            </div>

            {/* Docker Deployment Steps */}
            <div className="space-y-4">
              <h3 className="font-extrabold text-slate-900 text-base flex items-center gap-2">
                <Terminal className="w-4 h-4 text-indigo-600" />
                Passo a Passo via SSH (Contêiner Docker "Vanguard")
              </h3>

              <div className="space-y-3">
                <div className="text-xs font-bold text-slate-700">1. Transferir o arquivo ZIP para o seu VPS Hostinger KVM2</div>
                <div className="relative">
                  <pre className="p-3.5 bg-slate-950 text-slate-100 rounded-xl text-xs font-mono overflow-x-auto">
{`# No seu computador, envie o arquivo baixado via SCP (ou use FileZilla via SFTP):
scp eduvanguard.zip root@SEU_IP_HOSTINGER:/home/`}
                  </pre>
                  <button
                    onClick={() => copyToClipboard('scp eduvanguard.zip root@SEU_IP_HOSTINGER:/home/', 'vps_c1')}
                    className="absolute top-2.5 right-2.5 p-1.5 bg-white/10 hover:bg-white/20 text-white rounded-lg text-xs"
                  >
                    {copiedCode === 'vps_c1' ? <Check className="w-3.5 h-3.5 text-emerald-400" /> : <Copy className="w-3.5 h-3.5" />}
                  </button>
                </div>

                <div className="text-xs font-bold text-slate-700">2. Acessar o servidor via SSH, descompactar e entrar na pasta</div>
                <div className="relative">
                  <pre className="p-3.5 bg-slate-950 text-slate-100 rounded-xl text-xs font-mono overflow-x-auto">
{`# Conectar no VPS
ssh root@SEU_IP_HOSTINGER

# Descompactar na pasta da aplicação
mkdir -p /home/vanguard-app
unzip /home/eduvanguard.zip -d /home/vanguard-app
cd /home/vanguard-app`}
                  </pre>
                  <button
                    onClick={() => copyToClipboard('ssh root@SEU_IP_HOSTINGER\nmkdir -p /home/vanguard-app\nunzip /home/eduvanguard.zip -d /home/vanguard-app\ncd /home/vanguard-app', 'vps_c2')}
                    className="absolute top-2.5 right-2.5 p-1.5 bg-white/10 hover:bg-white/20 text-white rounded-lg text-xs"
                  >
                    {copiedCode === 'vps_c2' ? <Check className="w-3.5 h-3.5 text-emerald-400" /> : <Copy className="w-3.5 h-3.5" />}
                  </button>
                </div>

                <div className="text-xs font-bold text-slate-700">3. Iniciar os contêineres Vanguard e vanguard-db (MySQL 8.0)</div>
                <div className="relative">
                  <pre className="p-3.5 bg-slate-950 text-slate-100 rounded-xl text-xs font-mono overflow-x-auto">
{`# Construir e inicializar contêineres em segundo plano
docker compose up -d --build

# Conferir se os contêineres estão rodando
docker ps`}
                  </pre>
                  <button
                    onClick={() => copyToClipboard('docker compose up -d --build\ndocker ps', 'vps_c3')}
                    className="absolute top-2.5 right-2.5 p-1.5 bg-white/10 hover:bg-white/20 text-white rounded-lg text-xs"
                  >
                    {copiedCode === 'vps_c3' ? <Check className="w-3.5 h-3.5 text-emerald-400" /> : <Copy className="w-3.5 h-3.5" />}
                  </button>
                </div>

                <div className="text-xs font-bold text-slate-700">4. Executar o instalador PHP dentro do contêiner Vanguard</div>
                <div className="relative">
                  <pre className="p-3.5 bg-slate-950 text-slate-100 rounded-xl text-xs font-mono overflow-x-auto">
{`# Acessar o terminal do contêiner Vanguard
docker exec -it Vanguard bash

# Executar o instalador CLI interativo em PHP
php installer/install-cli.php

# OU se preferir via navegador Web, abra:
# http://SEU_IP_HOSTINGER:3000/installer/index.php`}
                  </pre>
                  <button
                    onClick={() => copyToClipboard('docker exec -it Vanguard bash\nphp installer/install-cli.php', 'vps_c4')}
                    className="absolute top-2.5 right-2.5 p-1.5 bg-white/10 hover:bg-white/20 text-white rounded-lg text-xs"
                  >
                    {copiedCode === 'vps_c4' ? <Check className="w-3.5 h-3.5 text-emerald-400" /> : <Copy className="w-3.5 h-3.5" />}
                  </button>
                </div>
              </div>
            </div>

            {/* Alternative Direct Hostinger PM2 */}
            <div className="p-5 rounded-2xl bg-amber-50/50 border border-amber-200 space-y-3">
              <h4 className="font-extrabold text-amber-950 text-sm flex items-center gap-2">
                <CheckCircle2 className="w-4 h-4 text-amber-600" />
                Opção Direta (Sem Docker): Rodar com PM2 no Ubuntu do VPS
              </h4>
              <p className="text-xs text-amber-900 leading-relaxed">
                Se você já possui Node.js e MySQL instalados diretamente no Ubuntu do Hostinger KVM2, pode iniciar com:
              </p>
              <pre className="p-3 bg-slate-900 text-amber-300 rounded-lg font-mono text-[11px] overflow-x-auto">
{`# 1. Executar o instalador PHP para criar o banco de dados:
php installer/install-cli.php

# 2. Instalar dependências e compilar frontend:
npm install && npm run build

# 3. Iniciar processo de segundo plano com nome Vanguard:
npm install -g pm2
pm2 start server.ts --name "Vanguard" --interpreter tsx
pm2 save && pm2 startup`}
              </pre>
            </div>

            {/* Database Tables Summary */}
            <div className="p-5 rounded-2xl bg-slate-50 border border-slate-200 space-y-3">
              <h4 className="font-extrabold text-slate-900 text-sm">
                Tabelas Relacionais Criadas no Banco (database.sql):
              </h4>
              <div className="grid grid-cols-2 sm:grid-cols-3 gap-2 text-xs font-mono text-slate-700">
                <div className="p-2 bg-white rounded border border-slate-200">• users (Alunos, Professores, Admins)</div>
                <div className="p-2 bg-white rounded border border-slate-200">• courses (Vitrine de Cursos)</div>
                <div className="p-2 bg-white rounded border border-slate-200">• course_modules (Ementas)</div>
                <div className="p-2 bg-white rounded border border-slate-200">• lessons (Aulas & Transcrições)</div>
                <div className="p-2 bg-white rounded border border-slate-200">• lesson_completions (Progresso)</div>
                <div className="p-2 bg-white rounded border border-slate-200">• grades (Boletim Escolar)</div>
                <div className="p-2 bg-white rounded border border-slate-200">• attendance (Presença)</div>
                <div className="p-2 bg-white rounded border border-slate-200">• exams (Provas & Quizzes)</div>
                <div className="p-2 bg-white rounded border border-slate-200">• student_submissions (Entregas)</div>
                <div className="p-2 bg-white rounded border border-slate-200">• document_requests (Carteirinhas/Certificados)</div>
                <div className="p-2 bg-white rounded border border-slate-200">• financial_transactions (Mercado Pago)</div>
                <div className="p-2 bg-white rounded border border-slate-200">• marketing_leads (Sofia IA Leads)</div>
                <div className="p-2 bg-white rounded border border-slate-200">• chat_messages (Comunicação)</div>
                <div className="p-2 bg-white rounded border border-slate-200">• support_tickets (Help Desk)</div>
                <div className="p-2 bg-white rounded border border-slate-200">• erp_logs (Auditoria TOTVS/SAP)</div>
              </div>
            </div>
          </div>
        )}

        {/* ========================================================================= */}
        {/* 1. MANUAL DE INSTALAÇÃO & DEVOPS */}
        {/* ========================================================================= */}
        {activeManual === 'install' && (
          <div className="space-y-8">
            <div>
              <div className="flex items-center gap-2 text-indigo-600 font-extrabold text-xs uppercase tracking-wider mb-1">
                <Terminal className="w-4 h-4" /> Engenharia & Infraestrutura
              </div>
              <h2 className="text-2xl sm:text-3xl font-black text-slate-900">
                Manual de Instalação, Deploy & Configuração Técnica
              </h2>
              <p className="text-sm text-slate-600 mt-1 leading-relaxed">
                Este guia orienta engenheiros de software, administradores de sistemas (SysAdmins) e equipes de DevOps na instalação local, configuração em contêineres Docker e deploy de alta disponibilidade na nuvem (GCP / AWS / On-Premise).
              </p>
            </div>

            {/* Prerequisites */}
            <div className="p-5 rounded-2xl bg-slate-50 border border-slate-200 space-y-3">
              <h3 className="font-extrabold text-slate-900 text-sm">1.1 Pré-requisitos de Sistema</h3>
              <ul className="grid grid-cols-1 sm:grid-cols-2 gap-2 text-xs text-slate-700">
                <li className="flex items-center gap-2">
                  <CheckCircle2 className="w-4 h-4 text-emerald-600 shrink-0" />
                  <strong>Node.js:</strong> Versão 20.x ou 22.x LTS instalada
                </li>
                <li className="flex items-center gap-2">
                  <CheckCircle2 className="w-4 h-4 text-emerald-600 shrink-0" />
                  <strong>Gerenciador de Pacotes:</strong> npm v10+ ou yarn v1.22+
                </li>
                <li className="flex items-center gap-2">
                  <CheckCircle2 className="w-4 h-4 text-emerald-600 shrink-0" />
                  <strong>Memória RAM Recomendada:</strong> Mínimo 2 GB (4 GB para produção)
                </li>
                <li className="flex items-center gap-2">
                  <CheckCircle2 className="w-4 h-4 text-emerald-600 shrink-0" />
                  <strong>Porta de Rede Padrão:</strong> 3000 (HTTP / HTTPS via Reverse Proxy)
                </li>
              </ul>
            </div>

            {/* Step by step installation */}
            <div className="space-y-4">
              <h3 className="font-extrabold text-slate-900 text-base">
                1.2 Passo a Passo de Instalação e Execução Local
              </h3>

              <div className="space-y-3">
                <div className="text-xs font-bold text-slate-700">Passo 1: Clonar o repositório ou descompactar o código fonte</div>
                <div className="relative">
                  <pre className="p-3.5 bg-slate-950 text-slate-100 rounded-xl text-xs font-mono overflow-x-auto">
                    {`# Clonar o repositório oficial
git clone https://github.com/instituicao/eduvanguard-plataforma.git
cd eduvanguard-plataforma`}
                  </pre>
                  <button
                    onClick={() => copyToClipboard('git clone https://github.com/instituicao/eduvanguard-plataforma.git\ncd eduvanguard-plataforma', 'c1')}
                    className="absolute top-2.5 right-2.5 p-1.5 bg-white/10 hover:bg-white/20 text-white rounded-lg text-xs"
                  >
                    {copiedCode === 'c1' ? <Check className="w-3.5 h-3.5 text-emerald-400" /> : <Copy className="w-3.5 h-3.5" />}
                  </button>
                </div>

                <div className="text-xs font-bold text-slate-700">Passo 2: Instalar as dependências do ecossistema React & Vite</div>
                <div className="relative">
                  <pre className="p-3.5 bg-slate-950 text-slate-100 rounded-xl text-xs font-mono overflow-x-auto">
                    {`# Instalar todas as dependências do package.json
npm install`}
                  </pre>
                  <button
                    onClick={() => copyToClipboard('npm install', 'c2')}
                    className="absolute top-2.5 right-2.5 p-1.5 bg-white/10 hover:bg-white/20 text-white rounded-lg text-xs"
                  >
                    {copiedCode === 'c2' ? <Check className="w-3.5 h-3.5 text-emerald-400" /> : <Copy className="w-3.5 h-3.5" />}
                  </button>
                </div>

                <div className="text-xs font-bold text-slate-700">Passo 3: Configurar as Variáveis de Ambiente (.env)</div>
                <div className="p-4 bg-slate-50 rounded-xl border border-slate-200 text-xs space-y-2">
                  <p className="text-slate-600">
                    Crie um arquivo <code className="bg-slate-200 px-1 py-0.5 rounded font-mono text-slate-900">.env</code> na raiz do projeto com base nas seguintes chaves:
                  </p>
                  <pre className="p-3 bg-slate-900 text-emerald-300 rounded-lg font-mono text-[11px] overflow-x-auto">
{`# PORTA DO SERVIDOR
PORT=3000

# URL DA APLICAÇÃO
APP_URL="https://sua-escola.eduvanguard.com.br"

# MERCADO PAGO GATEWAY DE PAGAMENTOS (TAXAS & MATRÍCULAS)
MERCADO_PAGO_PUBLIC_KEY="APP_USR-xxxxxx-xxxxxx"
MERCADO_PAGO_ACCESS_TOKEN="APP_USR-xxxxxx-xxxxxx"
MERCADO_PAGO_WEBHOOK_SECRET="whsec_xxxxxx"

# ERP ACADÊMICO (TOTVS / SAP / SENIOR SPONTE)
ERP_SYSTEM_TARGET="TOTVS" # ou "SAP" ou "SENIOR"
ERP_API_ENDPOINT="https://api.totvs.edu.br/v2"
ERP_AUTH_TOKEN="Bearer eyJhbGciOi..."

# CHAVE DE CRIPTOGRAFIA LGPD (SHA-256 SALT)
DATA_ENCRYPTION_SALT="eduvanguard_secret_salt_2026"`}
                  </pre>
                </div>

                <div className="text-xs font-bold text-slate-700">Passo 4: Iniciar o Servidor de Desenvolvimento</div>
                <div className="relative">
                  <pre className="p-3.5 bg-slate-950 text-slate-100 rounded-xl text-xs font-mono overflow-x-auto">
                    {`# Rodar o servidor de desenvolvimento
npm run dev

# Acesse http://localhost:3000 em seu navegador`}
                  </pre>
                  <button
                    onClick={() => copyToClipboard('npm run dev', 'c3')}
                    className="absolute top-2.5 right-2.5 p-1.5 bg-white/10 hover:bg-white/20 text-white rounded-lg text-xs"
                  >
                    {copiedCode === 'c3' ? <Check className="w-3.5 h-3.5 text-emerald-400" /> : <Copy className="w-3.5 h-3.5" />}
                  </button>
                </div>

                <div className="text-xs font-bold text-slate-700">Passo 5: Build de Produção e Otimização</div>
                <div className="relative">
                  <pre className="p-3.5 bg-slate-950 text-slate-100 rounded-xl text-xs font-mono overflow-x-auto">
                    {`# Compilar a aplicação para produção
npm run build

# Testar o bundle gerado
npm run preview`}
                  </pre>
                </div>
              </div>
            </div>

            {/* Docker & Production deployment */}
            <div className="p-5 rounded-2xl bg-indigo-50/50 border border-indigo-200 space-y-3">
              <h3 className="font-extrabold text-indigo-950 text-sm flex items-center gap-2">
                <Cpu className="w-4 h-4 text-indigo-600" /> 1.3 Deploy em Produção com Docker
              </h3>
              <p className="text-xs text-indigo-900 leading-relaxed">
                Para conteinerizar a aplicação com Nginx e Node.js em servidores Linux (Ubuntu, Debian, Alpine):
              </p>
              <pre className="p-3 bg-slate-900 text-slate-100 rounded-lg font-mono text-[11px] overflow-x-auto">
{`# Dockerfile de Produção Multi-Stage
FROM node:20-alpine AS builder
WORKDIR /app
COPY package*.json ./
RUN npm ci
COPY . .
RUN npm run build

FROM nginx:alpine
COPY --from=builder /app/dist /usr/share/nginx/html
EXPOSE 80
CMD ["nginx", "-g", "daemon off;"]`}
              </pre>
            </div>
          </div>
        )}

        {/* ========================================================================= */}
        {/* 2. MANUAL DO ALUNO */}
        {/* ========================================================================= */}
        {activeManual === 'student' && (
          <div className="space-y-8">
            <div>
              <div className="flex items-center gap-2 text-emerald-600 font-extrabold text-xs uppercase tracking-wider mb-1">
                <GraduationCap className="w-4 h-4" /> Guia do Estudante
              </div>
              <h2 className="text-2xl sm:text-3xl font-black text-slate-900">
                Manual do Aluno: Aulas, Boletim, Provas & Documentos
              </h2>
              <p className="text-sm text-slate-600 mt-1 leading-relaxed">
                Bem-vindo(a) à plataforma EduVanguard! Este manual orienta passo a passo como você navega pelos seus cursos, assiste às videoaulas, confere suas notas, faz provas e solicita documentos com desconto de meia-entrada e certificado oficial.
              </p>
            </div>

            <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
              {/* Step 1: Courses & Video Lessons */}
              <div className="p-5 rounded-2xl border border-slate-200 bg-slate-50/50 space-y-2">
                <div className="flex items-center gap-2">
                  <span className="w-6 h-6 rounded-full bg-indigo-600 text-white font-bold text-xs flex items-center justify-center">1</span>
                  <h3 className="font-extrabold text-slate-900 text-sm">Acessando Aulas & Vídeos</h3>
                </div>
                <p className="text-xs text-slate-600 leading-relaxed">
                  No menu superior, clique em <strong>"Área do Aluno"</strong>. Na aba <em>"Minhas Aulas & Vídeos"</em>, selecione a aula desejada na trilha de aprendizagem. Você pode:
                </p>
                <ul className="list-disc pl-5 text-xs text-slate-600 space-y-1">
                  <li>Controlar velocidade de reprodução e pausar o vídeo a qualquer momento.</li>
                  <li>Ler a <strong>transcrição integral da aula</strong> sincronizada.</li>
                  <li>Fazer anotações no seu <strong>caderno digital</strong> (salvo automaticamente).</li>
                  <li>Baixar materiais em PDF e clicar em <strong>"Marcar como Concluída"</strong> para contabilizar sua barra de progresso.</li>
                </ul>
              </div>

              {/* Step 2: Grades & Report Card */}
              <div className="p-5 rounded-2xl border border-slate-200 bg-slate-50/50 space-y-2">
                <div className="flex items-center gap-2">
                  <span className="w-6 h-6 rounded-full bg-indigo-600 text-white font-bold text-xs flex items-center justify-center">2</span>
                  <h3 className="font-extrabold text-slate-900 text-sm">Boletim Escolar & Notas</h3>
                </div>
                <p className="text-xs text-slate-600 leading-relaxed">
                  Na aba <em>"Boletim & Notas"</em>, acompanhe todas as suas notas lançadas pelos professores:
                </p>
                <ul className="list-disc pl-5 text-xs text-slate-600 space-y-1">
                  <li><strong>P1 (Prova 1):</strong> Peso 35% na média final.</li>
                  <li><strong>P2 (Prova 2):</strong> Peso 45% na média final.</li>
                  <li><strong>Trabalhos & Quizzes:</strong> Peso 20% na média final.</li>
                  <li><strong>Critério de Aprovação:</strong> Média igual ou superior a 7,0. Caso fique entre 5,0 e 6,9, você terá direito à prova de recuperação.</li>
                  <li>Clique em <strong>"Imprimir / Exportar Boletim em PDF"</strong> para gerar o histórico oficial timbrado.</li>
                </ul>
              </div>

              {/* Step 3: Real-Time Attendance */}
              <div className="p-5 rounded-2xl border border-slate-200 bg-slate-50/50 space-y-2">
                <div className="flex items-center gap-2">
                  <span className="w-6 h-6 rounded-full bg-indigo-600 text-white font-bold text-xs flex items-center justify-center">3</span>
                  <h3 className="font-extrabold text-slate-900 text-sm">Marcação de Presença Diária</h3>
                </div>
                <p className="text-xs text-slate-600 leading-relaxed">
                  Para registrar sua frequência obrigatória (mínimo de 75% exigido pelo MEC):
                </p>
                <ul className="list-disc pl-5 text-xs text-slate-600 space-y-1">
                  <li>Acesse a aba <em>"Presença em Tempo Real"</em> no dia da sua aula.</li>
                  <li>Clique no botão azul <strong>"Registrar Presença na Aula de Hoje"</strong>.</li>
                  <li>O sistema gerará instantaneamente um <strong>código autenticador (ex: PRES-9912)</strong> e atualizará seu percentual geral de assiduidade.</li>
                </ul>
              </div>

              {/* Step 4: Exams & Quizzes */}
              <div className="p-5 rounded-2xl border border-slate-200 bg-slate-50/50 space-y-2">
                <div className="flex items-center gap-2">
                  <span className="w-6 h-6 rounded-full bg-indigo-600 text-white font-bold text-xs flex items-center justify-center">4</span>
                  <h3 className="font-extrabold text-slate-900 text-sm">Provas Online & Quizzes</h3>
                </div>
                <p className="text-xs text-slate-600 leading-relaxed">
                  Na aba <em>"Provas, Quizzes & Trabalhos"</em>:
                </p>
                <ul className="list-disc pl-5 text-xs text-slate-600 space-y-1">
                  <li>Selecione o Quiz ou Trabalho desejado e clique em <strong>"Iniciar Avaliação"</strong>.</li>
                  <li>Em <strong>Quizzes</strong>, responda às questões com alternativas A, B, C, D dentro do tempo regressivo. A nota é corrigida e somada ao boletim automaticamente!</li>
                  <li>Em <strong>Trabalhos Práticos</strong>, digite suas considerações, anexe seu arquivo PDF/ZIP e envie direto para o professor avaliar.</li>
                </ul>
              </div>

              {/* Step 5: Official Documents & Mercado Pago */}
              <div className="p-5 rounded-2xl border border-slate-200 bg-slate-50/50 space-y-2 md:col-span-2">
                <div className="flex items-center gap-2">
                  <span className="w-6 h-6 rounded-full bg-[#009EE3] text-white font-bold text-xs flex items-center justify-center">5</span>
                  <h3 className="font-extrabold text-slate-900 text-sm">
                    Solicitação de Carteirinha & Certificado via Mercado Pago
                  </h3>
                </div>
                <p className="text-xs text-slate-600 leading-relaxed">
                  Na aba <em>"Secretaria & Documentos"</em>, você pode solicitar os seguintes documentos com liberação instantânea:
                </p>
                <div className="grid grid-cols-1 sm:grid-cols-2 gap-3 pt-2 text-xs">
                  <div className="p-3 bg-white rounded-xl border border-slate-200">
                    <strong className="text-slate-900 block">Carteirinha Estudantil DNE (R$ 25,00)</strong>
                    <span className="text-slate-500">Documento oficial com foto, QR Code e validade nacional para meia-entrada em cinemas, teatros e eventos.</span>
                  </div>
                  <div className="p-3 bg-white rounded-xl border border-slate-200">
                    <strong className="text-slate-900 block">Certificado Oficial de Conclusão (R$ 45,00)</strong>
                    <span className="text-slate-500">Certificado timbrado com selo dourado, carga horária e hash criptográfico ICP-Edu de conformidade com o MEC.</span>
                  </div>
                </div>
                <div className="pt-2 text-xs text-slate-600">
                  <strong>Formas de Pagamento:</strong> Clique em <em>"Pagar com Mercado Pago"</em>. O checkout seguro aceita <strong>PIX Instantâneo</strong> (código copia e cola + QR Code), <strong>Cartão de Crédito em até 12x</strong> ou <strong>Boleto Bancário</strong>. Assim que aprovado, o documento é gerado na hora e você pode imprimir ou salvar em PDF!
                </div>
              </div>
            </div>
          </div>
        )}

        {/* ========================================================================= */}
        {/* 3. MANUAL DO PROFESSOR */}
        {/* ========================================================================= */}
        {activeManual === 'teacher' && (
          <div className="space-y-8">
            <div>
              <div className="flex items-center gap-2 text-indigo-600 font-extrabold text-xs uppercase tracking-wider mb-1">
                <UserCheck className="w-4 h-4" /> Guia Docente
              </div>
              <h2 className="text-2xl sm:text-3xl font-black text-slate-900">
                Manual do Professor: Gestão Pedagógica, Provas & Notas
              </h2>
              <p className="text-sm text-slate-600 mt-1 leading-relaxed">
                Guia prático para os docentes da instituição incluírem novos módulos, videoaulas gravadas, criarem questionários com correção instantânea e acompanharem o rendimento dos estudantes em tempo real.
              </p>
            </div>

            <div className="space-y-4">
              <div className="p-5 rounded-2xl bg-slate-50 border border-slate-200 space-y-2">
                <h3 className="font-extrabold text-slate-900 text-sm">3.1 Como Publicar Novas Aulas e Materiais</h3>
                <p className="text-xs text-slate-600 leading-relaxed">
                  Acesse <strong>"Área do Professor"</strong> &rarr; aba <em>"Gestão de Aulas & Conteúdo"</em>:
                </p>
                <ol className="list-decimal pl-5 text-xs text-slate-600 space-y-1">
                  <li>Clique no botão <strong>"+ Publicar Nova Aula"</strong> no canto superior direito.</li>
                  <li>Preencha o título da aula, módulo de destino (ex: Módulo 1 ou Módulo 2) e duração em minutos.</li>
                  <li>Insira a URL do vídeo (suporta arquivos MP4 diretos, YouTube corporativo ou Vimeo).</li>
                  <li>Adicione a <strong>transcrição e explicações teóricas</strong> que serão disponibilizadas aos alunos.</li>
                  <li>Ao salvar, uma notificação push é enviada automaticamente aos smartphones dos alunos matriculados!</li>
                </ol>
              </div>

              <div className="p-5 rounded-2xl bg-slate-50 border border-slate-200 space-y-2">
                <h3 className="font-extrabold text-slate-900 text-sm">3.2 Diário Eletrônico de Notas & Lançamento Rápido</h3>
                <p className="text-xs text-slate-600 leading-relaxed">
                  Na aba <em>"Diário de Notas & Frequência"</em>:
                </p>
                <ul className="list-disc pl-5 text-xs text-slate-600 space-y-1">
                  <li>Edite diretamente nos campos de P1, P2 e Trabalhos para cada estudante da turma.</li>
                  <li>O sistema recalcula na hora a <strong>Média Final Ponderada</strong> e altera o status para <em>Aprovado</em>, <em>Recuperação</em> ou <em>Reprovado</em>.</li>
                  <li>Clique em <strong>"Salvar Alterações"</strong> para sincronizar os dados na nuvem e com o ERP acadêmico.</li>
                </ul>
              </div>

              <div className="p-5 rounded-2xl bg-slate-50 border border-slate-200 space-y-2">
                <h3 className="font-extrabold text-slate-900 text-sm">3.3 Criando Quizzes com Correção Automática & Trabalhos</h3>
                <p className="text-xs text-slate-600 leading-relaxed">
                  Na aba <em>"Criar Provas & Quizzes"</em>:
                </p>
                <ul className="list-disc pl-5 text-xs text-slate-600 space-y-1">
                  <li>Escolha o tipo: <strong>Quiz Objetivo</strong> ou <strong>Trabalho Prático</strong>.</li>
                  <li>Defina o prazo de entrega e pontuação total (ex: 10 pontos).</li>
                  <li>Para Quizzes, cadastre o enunciado, 4 alternativas e marque a opção correta.</li>
                  <li>Quando os alunos enviam trabalhos com arquivos PDF anexos, você pode visualizá-los e atribuir notas e comentários na seção <em>"Entregas Recebidas"</em>.</li>
                </ul>
              </div>

              <div className="p-5 rounded-2xl bg-slate-50 border border-slate-200 space-y-2">
                <h3 className="font-extrabold text-slate-900 text-sm">3.4 Relatórios Pedagógicos & Exportação para Excel e PDF</h3>
                <p className="text-xs text-slate-600 leading-relaxed">
                  Na aba <em>"Relatórios de Desempenho em Tempo Real"</em>:
                </p>
                <ul className="list-disc pl-5 text-xs text-slate-600 space-y-1">
                  <li>Visualize gráficos de aproveitamento médio por disciplina e taxa geral de aprovação da turma.</li>
                  <li>Clique em <strong>"Exportar para Excel / CSV"</strong> para baixar a planilha estruturada de notas e frequências.</li>
                  <li>Clique em <strong>"Imprimir Relatório em PDF"</strong> para gerar o documento formatado para o Conselho de Classe e NDE.</li>
                </ul>
              </div>
            </div>
          </div>
        )}

        {/* ========================================================================= */}
        {/* 4. MANUAL DA GESTÃO & DIREÇÃO GERAL */}
        {/* ========================================================================= */}
        {activeManual === 'admin' && (
          <div className="space-y-8">
            <div>
              <div className="flex items-center gap-2 text-amber-600 font-extrabold text-xs uppercase tracking-wider mb-1">
                <Building2 className="w-4 h-4" /> Governança & Administração Escolar
              </div>
              <h2 className="text-2xl sm:text-3xl font-black text-slate-900">
                Manual da Direção: Cursos, Matrículas, Finanças & ERP
              </h2>
              <p className="text-sm text-slate-600 mt-1 leading-relaxed">
                Este manual cobre todas as atribuições da Diretoria Executiva, Coordenadoria Financeira e Secretaria Geral: gestão do catálogo de cursos na vitrine, matrículas, faturamento de mensalidades, integração ERP e conformidade LGPD.
              </p>
            </div>

            <div className="space-y-4">
              <div className="p-5 rounded-2xl bg-slate-50 border border-slate-200 space-y-2">
                <h3 className="font-extrabold text-slate-900 text-sm">4.1 Inserção & Gestão de Cursos na Vitrine Online</h3>
                <p className="text-xs text-slate-600 leading-relaxed">
                  A página inicial da instituição é uma vitrine de cursos 100% online alimentada pela Direção.
                </p>
                <ul className="list-disc pl-5 text-xs text-slate-600 space-y-1">
                  <li>Acesse <strong>"Direção & Gestão"</strong> &rarr; aba <em>"Gestão de Cursos (Vitrine)"</em>.</li>
                  <li>Clique em <strong>"+ Cadastrar Novo Curso na Vitrine"</strong>.</li>
                  <li>Informe título, categoria (Tecnologia, Negócios, Design, etc.), nível, carga horária e preço à vista.</li>
                  <li>O valor parcelado em 12x é calculado automaticamente para o checkout Mercado Pago.</li>
                  <li>O curso passa a ser exibido imediatamente na vitrine pública com botão de matrícula habilitado.</li>
                </ul>
              </div>

              <div className="p-5 rounded-2xl bg-slate-50 border border-slate-200 space-y-2">
                <h3 className="font-extrabold text-slate-900 text-sm">4.2 Módulo Financeiro & Gestão de Mensalidades</h3>
                <p className="text-xs text-slate-600 leading-relaxed">
                  Na aba <em>"Módulo Financeiro & Mensalidades"</em>:
                </p>
                <ul className="list-disc pl-5 text-xs text-slate-600 space-y-1">
                  <li><strong>KPIs em Tempo Real:</strong> Faturamento total realizado, mensalidades pendentes e inadimplência.</li>
                  <li><strong>Lembretes Automáticos:</strong> Clique em <em>"🔔 Disparar Lembretes de Cobrança"</em> para enviar alertas automáticos por push e email para alunos com parcelas a vencer ou em atraso.</li>
                  <li><strong>Exportação Contábil:</strong> Baixe a planilha financeira em formato CSV compatível com Excel para integração contábil.</li>
                </ul>
              </div>

              <div className="p-5 rounded-2xl bg-slate-50 border border-slate-200 space-y-2">
                <h3 className="font-extrabold text-slate-900 text-sm">4.3 Conector de Integração ERP Educacional (TOTVS, SAP, Senior)</h3>
                <p className="text-xs text-slate-600 leading-relaxed">
                  Na aba <em>"Relatórios Acadêmicos & ERP"</em>:
                </p>
                <ul className="list-disc pl-5 text-xs text-slate-600 space-y-1">
                  <li>A plataforma possui conectores nativos para sincronização bidirecional de dados com <strong>TOTVS Linha Edu</strong>, <strong>SAP Education</strong> e <strong>Senior Sponte</strong>.</li>
                  <li>Clique em <strong>"Sincronizar TOTVS Edu"</strong> ou <strong>"Sincronizar Senior"</strong> para enviar dados de matrículas e fechamentos contábeis.</li>
                  <li>Cada sincronização gera um <strong>Hash de Auditoria SHA-256</strong> que garante a integridade da transmissão sem perdas.</li>
                </ul>
              </div>

              <div className="p-5 rounded-2xl bg-slate-50 border border-slate-200 space-y-2">
                <h3 className="font-extrabold text-slate-900 text-sm">4.4 Segurança Avançada, Criptografia & LGPD</h3>
                <p className="text-xs text-slate-600 leading-relaxed">
                  Na aba <em>"Segurança & Criptografia LGPD"</em>:
                </p>
                <ul className="list-disc pl-5 text-xs text-slate-600 space-y-1">
                  <li>Todos os registros de alunos, dados bancários e notas acadêmicas são protegidos com hash criptográfico SHA-256.</li>
                  <li>Qualquer tentativa de adulteração de nota é imediatamente detectada pela quebra da assinatura digital ICP-Edu.</li>
                </ul>
              </div>

              <div className="p-5 rounded-2xl bg-slate-50 border border-slate-200 space-y-2">
                <h3 className="font-extrabold text-slate-900 text-sm">4.5 Disparo de Notificações Push em Massa</h3>
                <p className="text-xs text-slate-600 leading-relaxed">
                  Na aba <em>"Disparo de Notificações Push"</em>:
                </p>
                <ul className="list-disc pl-5 text-xs text-slate-600 space-y-1">
                  <li>Selecione o público alvo: <em>Todos os Usuários</em>, <em>Somente Alunos</em> ou <em>Somente Professores</em>.</li>
                  <li>Envie comunicados de cancelamento/reposição de aula, avisos de vestibular ou eventos institucionais que chegam direto aos navegadores e smartphones.</li>
                </ul>
              </div>
            </div>
          </div>
        )}

        {/* ========================================================================= */}
        {/* 5. ARQUITETURA, ERP & APIS */}
        {/* ========================================================================= */}
        {activeManual === 'api' && (
          <div className="space-y-8">
            <div>
              <div className="flex items-center gap-2 text-indigo-600 font-extrabold text-xs uppercase tracking-wider mb-1">
                <Code className="w-4 h-4" /> Especificação Técnica & Webhooks
              </div>
              <h2 className="text-2xl sm:text-3xl font-black text-slate-900">
                Arquitetura de Integração, ERP & Webhooks Mercado Pago
              </h2>
              <p className="text-sm text-slate-600 mt-1 leading-relaxed">
                Documentação técnica da camada de dados, webhooks de notificação de pagamento IPN (Instant Payment Notification) e esquemas de integração com ERPs.
              </p>
            </div>

            <div className="space-y-4">
              <div className="p-5 rounded-2xl bg-slate-50 border border-slate-200 space-y-3">
                <h3 className="font-extrabold text-slate-900 text-sm flex items-center gap-2">
                  <CreditCard className="w-4 h-4 text-[#009EE3]" />
                  5.1 Webhook Mercado Pago (Fluxo de Aprovação Instantânea)
                </h3>
                <p className="text-xs text-slate-600 leading-relaxed">
                  O endpoint do webhook escuta os eventos <code className="font-mono bg-slate-200 px-1 py-0.5 rounded text-slate-900">payment.created</code> e <code className="font-mono bg-slate-200 px-1 py-0.5 rounded text-slate-900">payment.updated</code>. Quando um pagamento via PIX, Cartão ou Boleto é confirmado, o status do documento ou matrícula é atualizado automaticamente:
                </p>
                <pre className="p-3 bg-slate-900 text-sky-300 rounded-lg font-mono text-[11px] overflow-x-auto">
{`POST /api/webhooks/mercadopago
Content-Type: application/json
X-Signature: ts=1727618400,v1=7f91a2...

{
  "action": "payment.updated",
  "data": {
    "id": "MP-981249120"
  },
  "type": "payment"
}

// Resposta do Servidor EduVanguard:
// 1. Valida a assinatura HMAC-SHA256
// 2. Consulta o status "approved" na API do Mercado Pago
// 3. Emite o hash criptográfico ICP-Edu do documento
// 4. Dispara notificação push para o aluno com liberação do PDF`}
                </pre>
              </div>

              <div className="p-5 rounded-2xl bg-slate-50 border border-slate-200 space-y-3">
                <h3 className="font-extrabold text-slate-900 text-sm flex items-center gap-2">
                  <Layers className="w-4 h-4 text-indigo-600" />
                  5.2 Payload de Sincronização ERP Acadêmico
                </h3>
                <p className="text-xs text-slate-600 leading-relaxed">
                  Formato de carga transmitido para os sistemas TOTVS, SAP e Senior Sponte:
                </p>
                <pre className="p-3 bg-slate-900 text-emerald-300 rounded-lg font-mono text-[11px] overflow-x-auto">
{`{
  "institution_code": "EDUVANGUARD-001",
  "semester": "2026/2",
  "student": {
    "registration_number": "MAT-2026-9812",
    "cpf_hash": "e3b0c44298fc1c149afbf4c8996fb...",
    "full_name": "Lucas Silva Prado",
    "course_id": "course_1",
    "academic_status": "regular"
  },
  "grades": [
    { "subject": "Arquitetura de Microsserviços", "p1": 9.5, "p2": 8.8, "t1": 10.0, "average": 9.4, "status": "Aprovado" }
  ],
  "financial": {
    "tuitions_paid": 6,
    "tuitions_pending": 6,
    "total_paid_brl": 945.00,
    "payment_gateway": "Mercado Pago"
  }
}`}
                </pre>
              </div>
            </div>
          </div>
        )}
      </div>
    </div>
  );
};
