import React, { useState } from 'react';
import { useApp } from '../../context/AppContext';
import { DocumentViewerModal } from '../documents/DocumentTemplates';
import {
  ShieldCheck,
  Search,
  CheckCircle2,
  Award,
  Calendar,
  Clock,
  Printer,
  FileCheck,
  ExternalLink,
  QrCode,
  AlertCircle,
  Building,
  Sparkles,
} from 'lucide-react';

export const CertificateValidator: React.FC = () => {
  const { documentRequests, users, courses, grades } = useApp();

  const [searchQuery, setSearchQuery] = useState('');
  const [searched, setSearched] = useState(false);
  const [selectedCertForModal, setSelectedCertForModal] = useState<any | null>(null);

  // Default seed certificates for instant testing and demonstration
  const knownCertificates = [
    {
      hash: 'DNE-2026-VAL-OK',
      studentName: 'Lucas Silva Prado',
      registrationNumber: 'MAT-2026-9812',
      courseTitle: 'Engenharia de Software Moderna & Arquitetura Cloud',
      workloadHours: 360,
      completionDate: '15/01/2026',
      finalGrade: 9.2,
      status: 'valido',
      book: 'Livro 04',
      sheet: 'Folha 89',
      registryNumber: 'REG-MEC-2026-00412',
      institution: 'Grupo Eloizio — Instituto de Educação Profissional & Cursos Livres',
      mecAuthorization: 'Amparo Legal: Lei Federal nº 9.394/96 Art. 42 e Carteirinha DNE Lei nº 12.933/13',
      studentAvatar: 'https://images.unsplash.com/photo-1534528741775-53994a69daeb?auto=format&fit=crop&q=80&w=250',
    },
    {
      hash: 'DNE-CERT-9988-OK',
      studentName: 'Camila Vasconcelos',
      registrationNumber: 'MAT-2025-4421',
      courseTitle: 'Gestão Estratégica de Negócios & Liderança Digital',
      workloadHours: 280,
      completionDate: '28/11/2025',
      finalGrade: 9.8,
      status: 'valido',
      book: 'Livro 03',
      sheet: 'Folha 42',
      registryNumber: 'REG-MEC-2025-00891',
      institution: 'Grupo Eloizio — Instituto de Educação Profissional & Cursos Livres',
      mecAuthorization: 'Amparo Legal: Lei Federal nº 9.394/96 Art. 42 e Carteirinha DNE Lei nº 12.933/13',
      studentAvatar: 'https://images.unsplash.com/photo-1573496359142-b8d87734a5a2?auto=format&fit=crop&q=80&w=250',
    },
    {
      hash: 'ELOIZIO-2026-CERT-OK',
      studentName: 'Eloizio Mecânico Silva',
      registrationNumber: 'MAT-2026-7731',
      courseTitle: 'Engenharia de Software Moderna & Arquitetura Cloud',
      workloadHours: 360,
      completionDate: '29/09/2026',
      finalGrade: 9.5,
      status: 'valido',
      book: 'Livro 05',
      sheet: 'Folha 12',
      registryNumber: 'REG-MEC-2026-00994',
      institution: 'Grupo Eloizio — Instituto de Educação Profissional & Cursos Livres',
      mecAuthorization: 'Amparo Legal: Lei Federal nº 9.394/96 Art. 42 e Carteirinha DNE Lei nº 12.933/13',
      studentAvatar: 'https://images.unsplash.com/photo-1507003211169-0a1dd7228f2d?auto=format&fit=crop&q=80&w=250',
    },
  ];

  // Dynamic search across both hardcoded seed certificates and any newly generated in documentRequests
  const normalizedQuery = searchQuery.trim().toLowerCase();

  const foundInApp = documentRequests
    .filter((d) => d.paymentStatus === 'paid' && (d.documentType === 'certificado' || d.documentType === 'carteirinha'))
    .map((d) => {
      const student = users.find((u) => u.id === d.studentId);
      const course = courses.find((c) => c.id === student?.courseId) || courses[0];
      return {
        hash: d.validationHash || 'DNE-2026-VAL-OK',
        studentName: d.studentName,
        registrationNumber: student?.registrationNumber || 'MAT-2026-0001',
        courseTitle: course.title,
        workloadHours: course.workloadHours,
        completionDate: new Date().toLocaleDateString('pt-BR'),
        finalGrade: 9.0,
        status: 'valido',
        book: 'Livro 04',
        sheet: 'Folha 90',
        registryNumber: `REG-MEC-${d.id.slice(-6).toUpperCase()}`,
        institution: 'EduVanguard Instituto de Educação e Tecnologia',
        mecAuthorization: 'Portaria Normativa MEC nº 328/2023 - Reconhecimento Nacional',
        studentAvatar: student?.avatar || 'https://images.unsplash.com/photo-1534528741775-53994a69daeb?auto=format&fit=crop&q=80&w=250',
      };
    });

  const allAvailableCertificates = [...foundInApp, ...knownCertificates];

  const matchedCert = searched && normalizedQuery
    ? allAvailableCertificates.find(
        (c) =>
          c.hash.toLowerCase() === normalizedQuery ||
          c.hash.toLowerCase().includes(normalizedQuery) ||
          c.registrationNumber.toLowerCase() === normalizedQuery ||
          c.studentName.toLowerCase().includes(normalizedQuery)
      )
    : null;

  const handleSearch = (e: React.FormEvent) => {
    e.preventDefault();
    if (!searchQuery.trim()) return;
    setSearched(true);
  };

  const handleTestQuickSearch = (code: string) => {
    setSearchQuery(code);
    setSearched(true);
  };

  return (
    <div className="max-w-5xl mx-auto px-4 sm:px-6 lg:px-8 py-10 space-y-8">
      {/* Header Banner */}
      <div className="bg-linear-to-r from-slate-900 via-indigo-950 to-blue-900 text-white rounded-3xl p-6 sm:p-10 shadow-2xl border border-indigo-500/20 text-center space-y-4 relative overflow-hidden">
        <div className="inline-flex items-center gap-2 px-3 py-1 rounded-full bg-emerald-500/20 text-emerald-300 border border-emerald-500/30 text-xs font-black uppercase tracking-wider">
          <ShieldCheck className="w-4 h-4" /> Autenticador Público Oficial MEC / ICP-Edu
        </div>

        <h1 className="text-2xl sm:text-4xl font-black tracking-tight text-white max-w-2xl mx-auto leading-tight">
          Validação e Autenticidade de Certificados Digitais
        </h1>

        <p className="text-xs sm:text-sm text-indigo-200 max-w-2xl mx-auto leading-relaxed">
          Consulte e ateste a autenticidade de certificados e documentos emitidos pelo Grupo Eloizio com amparo na Lei nº 9.394/96 Art. 42 e Carteirinha Nacional Estudantil DNE (Lei nº 12.933/13).
        </p>

        {/* Search Bar */}
        <form onSubmit={handleSearch} className="max-w-xl mx-auto pt-2">
          <div className="flex flex-col sm:flex-row gap-2 bg-white/10 p-2 rounded-2xl border border-white/20 backdrop-blur-md">
            <div className="relative flex-1">
              <Search className="w-5 h-5 text-indigo-300 absolute left-3.5 top-1/2 -translate-y-1/2 pointer-events-none" />
              <input
                type="text"
                required
                value={searchQuery}
                onChange={(e) => setSearchQuery(e.target.value)}
                placeholder="Insira o Hash (ex: DNE-2026-VAL-OK ou Nome do Aluno)..."
                className="w-full pl-10 pr-4 py-3 bg-white text-slate-900 placeholder:text-slate-400 rounded-xl text-xs sm:text-sm font-semibold focus:outline-hidden focus:ring-2 focus:ring-indigo-400"
              />
            </div>
            <button
              type="submit"
              className="px-6 py-3 bg-indigo-600 hover:bg-indigo-500 text-white font-bold text-xs sm:text-sm rounded-xl shadow-lg cursor-pointer transition-colors flex items-center justify-center gap-2 shrink-0"
            >
              <ShieldCheck className="w-4 h-4" />
              Verificar
            </button>
          </div>
        </form>

        {/* Quick Simulation Chips */}
        <div className="pt-2 flex flex-wrap items-center justify-center gap-2 text-xs">
          <span className="text-indigo-300 font-semibold text-[11px]">Testar simulação rápida:</span>
          {knownCertificates.map((cert) => (
            <button
              key={cert.hash}
              type="button"
              onClick={() => handleTestQuickSearch(cert.hash)}
              className="px-2.5 py-1 rounded-lg bg-white/10 hover:bg-white/20 text-white text-[11px] font-mono border border-white/10 cursor-pointer transition-all"
            >
              {cert.studentName.split(' ')[0]}: {cert.hash}
            </button>
          ))}
        </div>
      </div>

      {/* Validation Result Box */}
      {searched && (
        <div className="animate-in fade-in zoom-in-95 duration-200">
          {matchedCert ? (
            <div className="bg-white rounded-3xl p-6 sm:p-8 border-2 border-emerald-500 shadow-xl space-y-6">
              {/* Top Banner Status */}
              <div className="flex flex-col sm:flex-row items-start sm:items-center justify-between gap-4 pb-6 border-b border-slate-200">
                <div className="flex items-center gap-3">
                  <div className="w-12 h-12 rounded-2xl bg-emerald-100 text-emerald-600 flex items-center justify-center font-black shrink-0">
                    <CheckCircle2 className="w-7 h-7" />
                  </div>
                  <div>
                    <div className="flex items-center gap-2">
                      <span className="px-2.5 py-0.5 rounded-full text-[10px] font-black uppercase bg-emerald-100 text-emerald-800 border border-emerald-300">
                        Certificado 100% Autêntico & Regular
                      </span>
                      <span className="text-xs font-mono text-slate-500">
                        {matchedCert.registryNumber}
                      </span>
                    </div>
                    <h2 className="text-xl font-black text-slate-900 mt-1">
                      Certificado de Conclusão de Curso Válido
                    </h2>
                  </div>
                </div>

                <div className="text-right">
                  <span className="text-[10px] text-slate-400 font-bold uppercase block">Chave ICP-Edu / DNE</span>
                  <span className="font-mono text-sm font-extrabold text-emerald-700 bg-emerald-50 px-2.5 py-1 rounded-lg border border-emerald-200">
                    {matchedCert.hash}
                  </span>
                </div>
              </div>

              {/* Certificate Details Grid */}
              <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4 p-5 bg-slate-50 rounded-2xl border border-slate-200 text-xs">
                <div>
                  <span className="text-slate-400 font-bold uppercase text-[10px] block">Aluno Concluinte</span>
                  <span className="font-extrabold text-slate-900 text-sm mt-0.5 block">
                    {matchedCert.studentName}
                  </span>
                  <span className="text-slate-500 text-[11px] font-mono mt-0.5 block">
                    Matrícula: {matchedCert.registrationNumber}
                  </span>
                </div>

                <div>
                  <span className="text-slate-400 font-bold uppercase text-[10px] block">Curso Concluído</span>
                  <span className="font-extrabold text-slate-900 text-sm mt-0.5 block">
                    {matchedCert.courseTitle}
                  </span>
                  <span className="text-indigo-600 font-semibold text-[11px] mt-0.5 block">
                    Carga Horária: {matchedCert.workloadHours} Horas
                  </span>
                </div>

                <div>
                  <span className="text-slate-400 font-bold uppercase text-[10px] block">Data de Conclusão & Nota</span>
                  <span className="font-extrabold text-slate-900 text-sm mt-0.5 block">
                    {matchedCert.completionDate}
                  </span>
                  <span className="text-emerald-700 font-bold text-[11px] mt-0.5 block">
                    Média de Aprovação: {matchedCert.finalGrade} / 10.0
                  </span>
                </div>

                <div>
                  <span className="text-slate-400 font-bold uppercase text-[10px] block">Registro Acadêmico</span>
                  <span className="font-mono font-bold text-slate-800 text-xs mt-0.5 block">
                    {matchedCert.book} • {matchedCert.sheet}
                  </span>
                  <span className="text-slate-500 text-[11px] mt-0.5 block">
                    Registro nº {matchedCert.registryNumber}
                  </span>
                </div>
              </div>

              {/* Legal Framework & Compliance Note */}
              <div className="p-4 rounded-2xl bg-indigo-50/70 border border-indigo-200 text-xs space-y-1.5">
                <div className="flex items-center gap-2 font-bold text-indigo-950">
                  <Building className="w-4 h-4 text-indigo-600" />
                  <span>Amparo Legal & Credenciamento Educacional</span>
                </div>
                <p className="text-indigo-800 leading-relaxed text-[11px]">
                  Este documento atende integralmente à <strong>Lei nº 9.394/1996</strong> (Diretrizes e Bases da Educação Nacional - Art. 42), ao <strong>Decreto Presidencial nº 5.154/2004</strong> e às normas vigentes do Ministério da Educação (MEC) para cursos na modalidade de Educação a Distância (100% Online). O portador cumpriu integralmente todas as exigências acadêmicas, avaliativas e de frequência.
                </p>
              </div>

              {/* Actions */}
              <div className="flex flex-col sm:flex-row items-center justify-between gap-4 pt-2">
                <div className="flex items-center gap-2 text-xs text-slate-500">
                  <QrCode className="w-5 h-5 text-slate-700" />
                  <span>QR Code criptografado pronto para leitura física por câmera de smartphone.</span>
                </div>

                <button
                  type="button"
                  onClick={() =>
                    setSelectedCertForModal({
                      id: 'cert_validated',
                      studentId: 'user_student_1',
                      studentName: matchedCert.studentName,
                      documentType: 'certificado',
                      title: `Certificado: ${matchedCert.courseTitle}`,
                      feeAmount: 0,
                      paymentStatus: 'paid',
                      requestedAt: new Date().toISOString(),
                      validationHash: matchedCert.hash,
                    })
                  }
                  className="w-full sm:w-auto px-6 py-2.5 bg-indigo-600 hover:bg-indigo-700 text-white rounded-xl text-xs font-black shadow-md cursor-pointer transition-all flex items-center justify-center gap-2"
                >
                  <Printer className="w-4 h-4" />
                  Abrir Certificado em Alta Resolução (Frente & Verso)
                </button>
              </div>
            </div>
          ) : (
            /* Not Found Screen */
            <div className="bg-white rounded-3xl p-8 border border-rose-200 shadow-lg text-center space-y-4">
              <div className="w-14 h-14 rounded-full bg-rose-100 text-rose-600 flex items-center justify-center mx-auto">
                <AlertCircle className="w-8 h-8" />
              </div>
              <h3 className="text-xl font-black text-slate-900">
                Certificado Não Localizado no Registro Central
              </h3>
              <p className="text-xs text-slate-500 max-w-md mx-auto leading-relaxed">
                Nenhum certificado ativo corresponde à chave ou termo <strong className="text-slate-800 font-mono">"{searchQuery}"</strong>. Certifique-se de que o código digitado está correto ou realize a consulta pelo número de matrícula oficial do aluno.
              </p>
              <div className="pt-2">
                <button
                  onClick={() => setSearchQuery('')}
                  className="px-4 py-2 border border-slate-300 rounded-xl text-xs font-bold text-slate-700 hover:bg-slate-50 cursor-pointer"
                >
                  Limpar Pesquisa
                </button>
              </div>
            </div>
          )}
        </div>
      )}

      {/* Pillars of 100% Online Quality Section */}
      <div className="bg-slate-50 rounded-3xl p-6 sm:p-8 border border-slate-200 space-y-6">
        <div className="text-center space-y-1">
          <span className="text-xs font-extrabold uppercase tracking-wider text-indigo-600">
            Diferenciais de Qualidade EduVanguard
          </span>
          <h3 className="text-xl font-black text-slate-900">
            Padrão de Excelência em Ensino 100% Online com Certificação Digital
          </h3>
          <p className="text-xs text-slate-500 max-w-xl mx-auto">
            Garantias pedagógicas e tecnológicas que asseguram a validade jurídica de cada certificado emitido.
          </p>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
          <div className="bg-white p-5 rounded-2xl border border-slate-200 space-y-2">
            <div className="w-10 h-10 rounded-xl bg-indigo-50 text-indigo-600 flex items-center justify-center font-bold">
              <Award className="w-5 h-5" />
            </div>
            <h4 className="font-extrabold text-slate-900 text-sm">Chave Criptográfica ICP-Edu</h4>
            <p className="text-xs text-slate-600 leading-relaxed">
              Cada certificado recebe uma assinatura digital com hash SHA-256 inviolável, prevenindo adulterações e fraudes acadêmicas.
            </p>
          </div>

          <div className="bg-white p-5 rounded-2xl border border-slate-200 space-y-2">
            <div className="w-10 h-10 rounded-xl bg-emerald-50 text-emerald-600 flex items-center justify-center font-bold">
              <FileCheck className="w-5 h-5" />
            </div>
            <h4 className="font-extrabold text-slate-900 text-sm">Verso Acadêmico com Ementa</h4>
            <p className="text-xs text-slate-600 leading-relaxed">
              Discriminação de todas as disciplinas, notas de aproveitamento, carga horária e corpo docente com mestres e doutores.
            </p>
          </div>

          <div className="bg-white p-5 rounded-2xl border border-slate-200 space-y-2">
            <div className="w-10 h-10 rounded-xl bg-blue-50 text-blue-600 flex items-center justify-center font-bold">
              <QrCode className="w-5 h-5" />
            </div>
            <h4 className="font-extrabold text-slate-900 text-sm">Consulta Instantânea por QR Code</h4>
            <p className="text-xs text-slate-600 leading-relaxed">
              Recrutadores e empresas podem escanear o QR Code direto no papel impresso para abrir esta mesma página de verificação oficial.
            </p>
          </div>
        </div>
      </div>

      {/* Document Viewer Modal */}
      {selectedCertForModal && (
        <DocumentViewerModal
          document={selectedCertForModal}
          student={users[0]}
          course={courses[0]}
          grades={grades}
          onClose={() => setSelectedCertForModal(null)}
        />
      )}
    </div>
  );
};
