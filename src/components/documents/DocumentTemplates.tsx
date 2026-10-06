import React from 'react';
import { User, DocumentRequest, Course, GradeItem } from '../../types';
import {
  Printer,
  ShieldCheck,
  Award,
  GraduationCap,
  Calendar,
  X,
  CheckCircle,
} from 'lucide-react';

interface DocumentViewerModalProps {
  document: DocumentRequest;
  student: User;
  course?: Course;
  grades?: GradeItem[];
  onClose: () => void;
}

export const DocumentViewerModal: React.FC<DocumentViewerModalProps> = ({
  document,
  student,
  course,
  grades = [],
  onClose,
}) => {
  const [certSide, setCertSide] = React.useState<'front' | 'back'>('front');

  const handlePrint = () => {
    window.print();
  };

  const validationHash = document.validationHash || 'DNE-2026-VAL-OK';
  const qrValidationUrl = `${window.location.origin}/#validar?hash=${validationHash}`;

  return (
    <div className="fixed inset-0 z-50 bg-black/75 backdrop-blur-xs flex items-center justify-center p-2 sm:p-4 overflow-y-auto">
      <div className="bg-white rounded-3xl shadow-2xl w-full max-w-4xl max-h-[92vh] flex flex-col overflow-hidden animate-in zoom-in-95 border border-slate-200">
        {/* Top Control Bar (Hidden on print) */}
        <div className="no-print p-4 bg-slate-900 text-white flex flex-col sm:flex-row sm:items-center justify-between gap-3">
          <div className="flex items-center gap-2">
            <ShieldCheck className="w-5 h-5 text-emerald-400" />
            <div>
              <h3 className="font-bold text-sm sm:text-base leading-tight">
                {document.title}
              </h3>
              <p className="text-xs text-slate-400">
                Autenticação Digital ICP / DNE: <span className="font-mono text-emerald-400">{validationHash}</span>
              </p>
            </div>
          </div>

          <div className="flex items-center gap-2">
            {document.documentType === 'certificado' && (
              <div className="flex items-center bg-slate-800 p-1 rounded-xl border border-slate-700 text-xs">
                <button
                  type="button"
                  onClick={() => setCertSide('front')}
                  className={`px-3 py-1.5 rounded-lg font-bold transition-all cursor-pointer ${
                    certSide === 'front'
                      ? 'bg-indigo-600 text-white shadow-xs'
                      : 'text-slate-300 hover:text-white'
                  }`}
                >
                  Frente do Certificado
                </button>
                <button
                  type="button"
                  onClick={() => setCertSide('back')}
                  className={`px-3 py-1.5 rounded-lg font-bold transition-all cursor-pointer ${
                    certSide === 'back'
                      ? 'bg-indigo-600 text-white shadow-xs'
                      : 'text-slate-300 hover:text-white'
                  }`}
                >
                  Verso (Ementa & Registro MEC)
                </button>
              </div>
            )}

            <button
              onClick={handlePrint}
              className="px-4 py-2 bg-indigo-600 hover:bg-indigo-700 text-white rounded-xl text-xs sm:text-sm font-bold flex items-center gap-2 shadow-md cursor-pointer transition-colors"
            >
              <Printer className="w-4 h-4" />
              Imprimir / PDF
            </button>
            <button
              onClick={onClose}
              className="p-2 text-slate-400 hover:text-white rounded-lg hover:bg-slate-800 cursor-pointer"
            >
              <X className="w-5 h-5" />
            </button>
          </div>
        </div>


        {/* Printable Document Area */}
        <div className="flex-1 overflow-y-auto p-4 sm:p-8 bg-slate-100 flex items-center justify-center">
          {document.documentType === 'carteirinha' && (
            /* Carteirinha Digital Oficial (Padrão DNE Nacional) */
            <div className="w-full max-w-md bg-linear-to-br from-indigo-900 via-slate-900 to-indigo-950 text-white rounded-2xl p-6 shadow-2xl border border-indigo-500/30 relative overflow-hidden print-container">
              {/* Background watermark */}
              <div className="absolute -right-12 -bottom-12 w-48 h-48 rounded-full bg-indigo-500/10 blur-xl pointer-events-none"></div>

              {/* Header */}
              <div className="flex items-center justify-between border-b border-indigo-700/50 pb-4">
                <div className="flex items-center gap-2">
                  <div className="w-8 h-8 rounded-lg bg-indigo-500 flex items-center justify-center font-black text-white text-sm">
                    EV
                  </div>
                  <div>
                    <h4 className="font-black text-xs sm:text-sm tracking-wider uppercase text-indigo-200">
                      Documento Nacional do Estudante (DNE)
                    </h4>
                    <p className="text-[10px] text-indigo-300">
                      EduVanguard Instituto de Educação Superior
                    </p>
                  </div>
                </div>
                <div className="text-right">
                  <span className="text-[9px] uppercase font-bold tracking-widest px-2 py-0.5 rounded-full bg-emerald-500/20 text-emerald-300 border border-emerald-500/40">
                    Válida 2027
                  </span>
                </div>
              </div>

              {/* Body */}
              <div className="flex gap-4 mt-5">
                {/* Photo & Hologram */}
                <div className="relative shrink-0">
                  <img
                    src={student.avatar}
                    alt={student.name}
                    className="w-24 h-32 rounded-xl object-cover border-2 border-indigo-400/80 shadow-md"
                  />
                  <div className="absolute bottom-1 right-1 w-6 h-6 rounded-full bg-amber-400 text-slate-900 font-extrabold text-[9px] flex items-center justify-center border border-white shadow-xs">
                    ★
                  </div>
                </div>

                {/* Details */}
                <div className="flex-1 space-y-2 text-xs">
                  <div>
                    <span className="text-[10px] text-indigo-300 uppercase block font-semibold">
                      Nome do Estudante
                    </span>
                    <span className="font-extrabold text-sm text-white tracking-wide">
                      {student.name}
                    </span>
                  </div>

                  <div>
                    <span className="text-[10px] text-indigo-300 uppercase block font-semibold">
                      Curso
                    </span>
                    <span className="font-semibold text-slate-200 text-xs">
                      {course?.title || 'Engenharia de Software Moderna & Cloud'}
                    </span>
                  </div>

                  <div className="grid grid-cols-2 gap-2 pt-1 border-t border-indigo-800/40">
                    <div>
                      <span className="text-[9px] text-indigo-300 uppercase block font-medium">
                        Matrícula
                      </span>
                      <span className="font-mono font-bold text-xs text-indigo-200">
                        {student.registrationNumber}
                      </span>
                    </div>
                    <div>
                      <span className="text-[9px] text-indigo-300 uppercase block font-medium">
                        Validade
                      </span>
                      <span className="font-bold text-xs text-white">31/03/2027</span>
                    </div>
                  </div>
                </div>
              </div>

              {/* Footer with QR Code and Barcode */}
              <div className="mt-5 pt-3 border-t border-indigo-700/50 flex items-center justify-between">
                <div>
                  <div className="font-mono text-[9px] text-indigo-300">
                    Chave: {document.validationHash || 'DNE-2026-BR-998812'}
                  </div>
                  <div className="font-mono text-[8px] text-slate-400 tracking-wider">
                    ||||| ||| |||| || |||||| |||| |||
                  </div>
                </div>
                <div className="w-12 h-12 bg-white rounded-lg p-1">
                  {/* Miniature SVG QR code */}
                  <svg viewBox="0 0 100 100" className="w-full h-full text-slate-900">
                    <rect x="0" y="0" width="35" height="35" fill="currentColor" />
                    <rect x="5" y="5" width="25" height="25" fill="white" />
                    <rect x="10" y="10" width="15" height="15" fill="currentColor" />
                    <rect x="65" y="0" width="35" height="35" fill="currentColor" />
                    <rect x="70" y="5" width="25" height="25" fill="white" />
                    <rect x="75" y="10" width="15" height="15" fill="currentColor" />
                    <rect x="0" y="65" width="35" height="35" fill="currentColor" />
                    <rect x="5" y="70" width="25" height="25" fill="white" />
                    <rect x="10" y="75" width="15" height="15" fill="currentColor" />
                    <rect x="45" y="45" width="20" height="20" fill="currentColor" />
                  </svg>
                </div>
              </div>
            </div>
          )}

          {document.documentType === 'certificado' && (
            certSide === 'front' ? (
              /* Certificado de Conclusão - FRENTE */
              <div className="w-full max-w-2xl bg-amber-50/40 border-8 border-double border-amber-600/70 p-8 sm:p-12 text-center rounded-2xl shadow-xl relative print-container">
                {/* Decorative Corner Ornaments */}
                <div className="absolute top-2 left-2 text-amber-700 font-serif text-2xl">❧</div>
                <div className="absolute top-2 right-2 text-amber-700 font-serif text-2xl">☙</div>
                <div className="absolute bottom-2 left-2 text-amber-700 font-serif text-2xl">❧</div>
                <div className="absolute bottom-2 right-2 text-amber-700 font-serif text-2xl">☙</div>

                {/* Seal */}
                <div className="w-16 h-16 mx-auto rounded-full bg-linear-to-tr from-amber-600 to-yellow-500 text-white flex items-center justify-center shadow-lg mb-3">
                  <Award className="w-8 h-8" />
                </div>

                <h2 className="text-xs uppercase tracking-widest font-extrabold text-amber-900 mb-1">
                  EduVanguard Instituto de Educação e Tecnologia
                </h2>
                <h1 className="text-2xl sm:text-4xl font-serif font-black text-slate-900 tracking-tight mb-4">
                  CERTIFICADO DE CONCLUSÃO
                </h1>

                <p className="text-xs sm:text-sm text-slate-600 max-w-lg mx-auto leading-relaxed">
                  Certificamos para os devidos fins que o(a) aluno(a)
                </p>

                <div className="text-xl sm:text-3xl font-serif font-extrabold text-indigo-900 my-3 border-b-2 border-amber-400 inline-block px-8 pb-1">
                  {student.name}
                </div>

                <p className="text-xs sm:text-sm text-slate-600 max-w-lg mx-auto leading-relaxed mt-2">
                  concluiu com êxito o curso de{' '}
                  <strong className="text-slate-900 font-bold">
                    {course?.title || 'Engenharia de Software Moderna & Arquitetura Cloud'}
                  </strong>
                  , com carga horária total de{' '}
                  <span className="font-bold text-slate-900">{course?.workloadHours || 360} horas</span>,
                  tendo cumprido integralmente as exigências pedagógicas e regimentais.
                </p>

                <div className="text-xs text-slate-500 mt-6 font-medium">
                  São Paulo, {new Date().toLocaleDateString('pt-BR', { year: 'numeric', month: 'long', day: 'numeric' })}
                </div>

                {/* Signatures */}
                <div className="grid grid-cols-2 gap-8 mt-8 pt-4 border-t border-slate-300">
                  <div>
                    <div className="font-serif italic text-base text-slate-800">Carlos Alberto Mendes</div>
                    <div className="border-t border-slate-400 mt-1 pt-1 text-[11px] font-semibold text-slate-500">
                      Diretoria Geral Acadêmica
                    </div>
                  </div>
                  <div>
                    <div className="font-serif italic text-base text-slate-800">Mariana Fernandes</div>
                    <div className="border-t border-slate-400 mt-1 pt-1 text-[11px] font-semibold text-slate-500">
                      Coordenação Pedagógica
                    </div>
                  </div>
                </div>

                {/* Security Hash Footnote */}
                <div className="mt-6 flex flex-col sm:flex-row items-center justify-between text-[10px] text-slate-400 font-mono gap-2 border-t border-amber-200/50 pt-3">
                  <span>Autenticidade ICP-Edu: {validationHash}</span>
                  <span className="text-amber-800 font-semibold">Consulte no Validador Oficial</span>
                </div>
              </div>
            ) : (
              /* Certificado de Conclusão - VERSO ACADÊMICO (Ementa, Notas e Registro MEC) */
              <div className="w-full max-w-2xl bg-white border-4 border-slate-300 p-6 sm:p-10 rounded-2xl shadow-xl text-left text-slate-900 print-container space-y-4">
                {/* Header Verso */}
                <div className="flex items-center justify-between border-b-2 border-slate-900 pb-3">
                  <div>
                    <h3 className="font-black text-sm uppercase tracking-wider text-slate-900">
                      Histórico Acadêmico & Conteúdo Programático
                    </h3>
                    <p className="text-[11px] text-slate-500">
                      Registro de Disciplinas, Aproveitamento e Amparo Legal MEC
                    </p>
                  </div>
                  <div className="text-right">
                    <span className="text-[10px] font-mono font-bold bg-slate-100 px-2 py-1 rounded-md border border-slate-200">
                      REGISTRO Nº 2026-00412
                    </span>
                  </div>
                </div>

                {/* Student identification summary */}
                <div className="grid grid-cols-2 sm:grid-cols-4 gap-2 p-3 bg-slate-50 rounded-xl text-xs border border-slate-200">
                  <div>
                    <span className="text-slate-400 text-[10px] block uppercase font-bold">Aluno</span>
                    <span className="font-bold text-slate-900">{student.name}</span>
                  </div>
                  <div>
                    <span className="text-slate-400 text-[10px] block uppercase font-bold">Matrícula</span>
                    <span className="font-mono font-bold text-slate-900">{student.registrationNumber}</span>
                  </div>
                  <div>
                    <span className="text-slate-400 text-[10px] block uppercase font-bold">Carga Total</span>
                    <span className="font-bold text-slate-900">{course?.workloadHours || 360} Horas</span>
                  </div>
                  <div>
                    <span className="text-slate-400 text-[10px] block uppercase font-bold">Média Final</span>
                    <span className="font-bold text-emerald-700">9.4 (Aprovado)</span>
                  </div>
                </div>

                {/* Modules table */}
                <div className="space-y-1">
                  <span className="text-[11px] font-black uppercase text-slate-700">
                    Ementa Curricular Ministrada
                  </span>
                  <table className="w-full text-left text-xs border border-slate-200 rounded-lg overflow-hidden">
                    <thead className="bg-slate-100 text-slate-600 uppercase text-[10px] font-bold">
                      <tr>
                        <th className="p-2 border-b border-slate-200">Módulo / Disciplina</th>
                        <th className="p-2 border-b border-slate-200 text-center">Carga</th>
                        <th className="p-2 border-b border-slate-200 text-center">Nota</th>
                        <th className="p-2 border-b border-slate-200 text-center">Situação</th>
                      </tr>
                    </thead>
                    <tbody className="divide-y divide-slate-100 text-[11px]">
                      {course?.syllabus && course.syllabus.length > 0 ? (
                        course.syllabus.map((mod, idx) => (
                          <tr key={mod.id}>
                            <td className="p-2 font-medium text-slate-800">{mod.title}</td>
                            <td className="p-2 text-center text-slate-600 font-mono">
                              {Math.round((course.workloadHours || 360) / course.syllabus.length)}h
                            </td>
                            <td className="p-2 text-center font-bold text-slate-800">
                              {(9.0 + (idx % 3) * 0.4).toFixed(1)}
                            </td>
                            <td className="p-2 text-center text-emerald-700 font-bold">Aprovado</td>
                          </tr>
                        ))
                      ) : (
                        <tr>
                          <td className="p-2">Fundamentos Teóricos & Aplicação Prática</td>
                          <td className="p-2 text-center font-mono">180h</td>
                          <td className="p-2 text-center font-bold">9.5</td>
                          <td className="p-2 text-center text-emerald-700 font-bold">Aprovado</td>
                        </tr>
                      )}
                    </tbody>
                  </table>
                </div>

                {/* Legal and Registry Stamps */}
                <div className="p-3 bg-amber-50/50 rounded-xl border border-amber-200 text-[10px] text-slate-700 space-y-1">
                  <div className="font-bold text-amber-950 uppercase">Base Legal & Credenciamento MEC:</div>
                  <p className="leading-relaxed">
                    Curso oferecido em conformidade com a <strong>Lei Federal nº 9.394/1996 (LDB - Art. 42)</strong>, <strong>Decreto Presidencial nº 5.154/2004</strong> e Deliberação CEE/MEC para cursos livres de qualificação e aperfeiçoamento profissional com certificação digital de validade nacional.
                  </p>
                </div>

                {/* Registry seal & QR Code */}
                <div className="grid grid-cols-2 gap-4 pt-2 border-t border-slate-200 text-xs">
                  <div className="border border-slate-300 p-2.5 rounded-lg font-mono text-[10px] text-slate-600 space-y-0.5">
                    <div className="font-bold text-slate-900">REGISTRO DA SECRETARIA ACADÊMICA:</div>
                    <div>Livro nº 04 • Folha nº 89 • Reg. 1029</div>
                    <div>Data do Registro: {new Date().toLocaleDateString('pt-BR')}</div>
                    <div>Responsável: Roseli S. Castro (Sec. Geral)</div>
                  </div>

                  <div className="border border-slate-300 p-2.5 rounded-lg flex items-center justify-between text-[10px] text-slate-600">
                    <div className="space-y-1">
                      <div className="font-bold text-slate-900">VERIFICAÇÃO PÚBLICA:</div>
                      <div className="font-mono text-[9px] break-all">{validationHash}</div>
                      <div className="text-[9px] text-indigo-600 font-semibold">Autentique com a câmera</div>
                    </div>
                    <div className="w-12 h-12 bg-white border border-slate-200 rounded p-1 shrink-0 ml-2">
                      <svg viewBox="0 0 100 100" className="w-full h-full text-slate-900">
                        <rect x="0" y="0" width="35" height="35" fill="currentColor" />
                        <rect x="5" y="5" width="25" height="25" fill="white" />
                        <rect x="10" y="10" width="15" height="15" fill="currentColor" />
                        <rect x="65" y="0" width="35" height="35" fill="currentColor" />
                        <rect x="70" y="5" width="25" height="25" fill="white" />
                        <rect x="75" y="10" width="15" height="15" fill="currentColor" />
                        <rect x="0" y="65" width="35" height="35" fill="currentColor" />
                        <rect x="5" y="70" width="25" height="25" fill="white" />
                        <rect x="10" y="75" width="15" height="15" fill="currentColor" />
                        <rect x="45" y="45" width="20" height="20" fill="currentColor" />
                      </svg>
                    </div>
                  </div>
                </div>
              </div>
            )
          )}


          {document.documentType === 'historico' && (
            /* Histórico Escolar Oficial */
            <div className="w-full max-w-3xl bg-white p-6 sm:p-10 rounded-xl shadow-lg border border-slate-300 text-slate-900 print-container">
              {/* Header */}
              <div className="flex items-center justify-between border-b-2 border-slate-900 pb-4 mb-6">
                <div>
                  <h2 className="text-base font-black tracking-tight uppercase">
                    EduVanguard - Instituição de Ensino Superior
                  </h2>
                  <p className="text-xs text-slate-500">
                    Credenciada pelo Ministério da Educação • CNPJ 12.345.678/0001-90
                  </p>
                </div>
                <div className="text-right">
                  <span className="text-xs font-black uppercase px-2.5 py-1 bg-slate-900 text-white rounded-md">
                    Histórico Oficial
                  </span>
                </div>
              </div>

              {/* Student Header */}
              <div className="grid grid-cols-2 sm:grid-cols-4 gap-4 p-4 bg-slate-50 rounded-lg text-xs mb-6 border border-slate-200">
                <div>
                  <span className="text-slate-400 block uppercase text-[10px]">Aluno</span>
                  <span className="font-bold text-slate-800">{student.name}</span>
                </div>
                <div>
                  <span className="text-slate-400 block uppercase text-[10px]">Matrícula</span>
                  <span className="font-mono font-bold text-slate-800">{student.registrationNumber}</span>
                </div>
                <div>
                  <span className="text-slate-400 block uppercase text-[10px]">Curso</span>
                  <span className="font-bold text-slate-800">{course?.title || 'Eng. Software'}</span>
                </div>
                <div>
                  <span className="text-slate-400 block uppercase text-[10px]">Emissão</span>
                  <span className="font-bold text-slate-800">
                    {new Date().toLocaleDateString('pt-BR')}
                  </span>
                </div>
              </div>

              {/* Grades Table */}
              <div className="border border-slate-300 rounded-lg overflow-hidden mb-6">
                <table className="w-full text-xs text-left">
                  <thead className="bg-slate-800 text-white font-bold">
                    <tr>
                      <th className="p-2.5">Disciplina / Conteúdo</th>
                      <th className="p-2.5 text-center">P1</th>
                      <th className="p-2.5 text-center">P2</th>
                      <th className="p-2.5 text-center">Trabalho</th>
                      <th className="p-2.5 text-center">Média Final</th>
                      <th className="p-2.5 text-center">Situação</th>
                    </tr>
                  </thead>
                  <tbody className="divide-y divide-slate-200">
                    {grades.map((grd) => (
                      <tr key={grd.id} className="hover:bg-slate-50">
                        <td className="p-2.5 font-semibold text-slate-800">{grd.subject}</td>
                        <td className="p-2.5 text-center font-mono">{grd.p1.toFixed(1)}</td>
                        <td className="p-2.5 text-center font-mono">{grd.p2.toFixed(1)}</td>
                        <td className="p-2.5 text-center font-mono">{grd.assignment.toFixed(1)}</td>
                        <td className="p-2.5 text-center font-mono font-bold text-indigo-700">
                          {grd.average.toFixed(1)}
                        </td>
                        <td className="p-2.5 text-center">
                          <span className={`px-2 py-0.5 rounded-full font-bold text-[10px] ${
                            grd.status === 'Aprovado' ? 'bg-emerald-100 text-emerald-800' : 'bg-amber-100 text-amber-800'
                          }`}>
                            {grd.status}
                          </span>
                        </td>
                      </tr>
                    ))}
                  </tbody>
                </table>
              </div>

              {/* Institutional verification stamp */}
              <div className="flex items-center justify-between text-xs pt-4 border-t border-slate-300">
                <div className="text-[11px] text-slate-500">
                  <p>Documento assinado digitalmente com certificado ICP-Edu nº {document.validationHash || 'VAL-8819'}.</p>
                  <p>Validação disponível em: https://eduvanguard.edu.br/validar</p>
                </div>
                <div className="text-right">
                  <div className="w-20 h-20 rounded-full border-4 border-dashed border-indigo-700/40 flex items-center justify-center text-center p-1 text-[9px] font-black uppercase text-indigo-900 rotate-6">
                    Secretaria Geral Registrado
                  </div>
                </div>
              </div>
            </div>
          )}

          {document.documentType === 'declaracao' && (
            /* Declaração de Matrícula Regular */
            <div className="w-full max-w-2xl bg-white p-8 sm:p-12 rounded-xl shadow-lg border border-slate-300 text-slate-900 print-container">
              <h2 className="text-center font-black text-lg tracking-wider uppercase mb-8">
                DECLARAÇÃO DE MATRÍCULA REGULAR
              </h2>
              <p className="text-sm leading-relaxed text-slate-700 mb-6 text-justify">
                Declaramos para os devidos fins a quem possa interessar, especialmente para fins de concessão de estágio, transporte estudantil e benefícios fiscais, que o(a) aluno(a) <strong className="text-slate-900">{student.name}</strong>, portador(a) da matrícula <strong className="font-mono">{student.registrationNumber}</strong>, encontra-se regularmente matriculado(a) e frequentando as aulas do curso de <strong className="text-slate-900">{course?.title || 'Engenharia de Software Moderna & Cloud'}</strong> nesta instituição no ano letivo de 2026.
              </p>
              <div className="text-right text-xs text-slate-500 mt-10">
                São Paulo, {new Date().toLocaleDateString('pt-BR', { dateStyle: 'long' })}
              </div>
              <div className="text-center mt-12 pt-6 border-t border-slate-300 max-w-xs mx-auto">
                <p className="font-bold text-xs text-slate-800">Departamento de Registros Acadêmicos</p>
                <p className="text-[10px] text-slate-400 font-mono mt-1">Hash: {document.validationHash || 'DEC-OK-2026'}</p>
              </div>
            </div>
          )}
        </div>
      </div>
    </div>
  );
};
