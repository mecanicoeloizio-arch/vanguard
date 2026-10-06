import React, { useState } from 'react';
import { useApp } from '../../context/AppContext';
import { AcademicEvent, LibraryItem } from '../../types';
import {
  Calendar,
  BookOpen,
  Download,
  Search,
  Filter,
  FileText,
  Clock,
  Award,
  Sparkles,
  ExternalLink,
  PlusCircle,
  Tag,
  CheckCircle,
} from 'lucide-react';

export const AcademicCalendarAndLibrary: React.FC = () => {
  const { academicEvents, libraryItems, currentUser } = useApp();

  const [activeSubTab, setActiveSubTab] = useState<'calendar' | 'library'>('calendar');
  const [librarySearch, setLibrarySearch] = useState('');
  const [libraryCategory, setLibraryCategory] = useState<string>('Todos');

  const filteredLibrary = libraryItems.filter((item) => {
    const matchesSearch =
      item.title.toLowerCase().includes(librarySearch.toLowerCase()) ||
      item.author.toLowerCase().includes(librarySearch.toLowerCase()) ||
      item.description.toLowerCase().includes(librarySearch.toLowerCase());
    const matchesCategory = libraryCategory === 'Todos' || item.category === libraryCategory;
    return matchesSearch && matchesCategory;
  });

  const getEventBadge = (type: AcademicEvent['type']) => {
    switch (type) {
      case 'prova':
        return { label: 'Semana de Provas', color: 'bg-rose-100 text-rose-800 border-rose-200' };
      case 'trabalho':
        return { label: 'Entrega de Trabalho', color: 'bg-indigo-100 text-indigo-800 border-indigo-200' };
      case 'reuniao':
        return { label: 'Reunião Pedagógica', color: 'bg-amber-100 text-amber-800 border-amber-200' };
      case 'vestibular':
        return { label: 'Vestibular & Matrículas', color: 'bg-emerald-100 text-emerald-800 border-emerald-200' };
      default:
        return { label: 'Evento Letivo', color: 'bg-slate-100 text-slate-800 border-slate-200' };
    }
  };

  return (
    <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8 space-y-8">
      {/* Sub Tabs */}
      <div className="flex items-center gap-3 border-b border-slate-200 pb-4">
        <button
          onClick={() => setActiveSubTab('calendar')}
          className={`flex items-center gap-2 px-5 py-2.5 rounded-xl text-xs sm:text-sm font-black cursor-pointer transition-all ${
            activeSubTab === 'calendar'
              ? 'bg-indigo-600 text-white shadow-md shadow-indigo-500/25'
              : 'bg-white text-slate-600 hover:bg-slate-100 border border-slate-200'
          }`}
        >
          <Calendar className="w-4 h-4" />
          Calendário Acadêmico Oficial
        </button>
        <button
          onClick={() => setActiveSubTab('library')}
          className={`flex items-center gap-2 px-5 py-2.5 rounded-xl text-xs sm:text-sm font-black cursor-pointer transition-all ${
            activeSubTab === 'library'
              ? 'bg-indigo-600 text-white shadow-md shadow-indigo-500/25'
              : 'bg-white text-slate-600 hover:bg-slate-100 border border-slate-200'
          }`}
        >
          <BookOpen className="w-4 h-4" />
          Biblioteca Digital & Acervo
        </button>
      </div>

      {/* CALENDAR VIEW */}
      {activeSubTab === 'calendar' && (
        <div className="space-y-6">
          <div className="bg-white rounded-3xl p-6 sm:p-8 border border-slate-200 shadow-sm space-y-6">
            <div className="flex flex-col sm:flex-row items-start sm:items-center justify-between gap-4 pb-4 border-b border-slate-200">
              <div>
                <h2 className="text-xl font-black text-slate-900">
                  Calendário Letivo & Datas Críticas (2026/2)
                </h2>
                <p className="text-xs text-slate-500 mt-0.5">
                  Acompanhe os prazos de provas, encerramento de bimestres e recessos acadêmicos.
                </p>
              </div>
              <span className="text-xs font-bold px-3 py-1 bg-indigo-50 text-indigo-700 rounded-lg">
                Atualizado pela Secretaria Geral
              </span>
            </div>

            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              {academicEvents.map((evt) => {
                const badge = getEventBadge(evt.type);
                return (
                  <div
                    key={evt.id}
                    className="p-5 rounded-2xl border border-slate-200 bg-slate-50/50 hover:bg-slate-50 transition-all space-y-3"
                  >
                    <div className="flex items-center justify-between">
                      <span className={`px-2.5 py-0.5 rounded-full text-[10px] font-black uppercase border ${badge.color}`}>
                        {badge.label}
                      </span>
                      <div className="flex items-center gap-1.5 text-xs font-mono font-bold text-slate-600">
                        <Clock className="w-3.5 h-3.5 text-slate-400" />
                        <span>{evt.date} {evt.endDate ? `até ${evt.endDate}` : ''}</span>
                      </div>
                    </div>
                    <h3 className="font-extrabold text-slate-900 text-base">{evt.title}</h3>
                    <p className="text-xs text-slate-600 leading-relaxed">{evt.description}</p>
                  </div>
                );
              })}
            </div>
          </div>
        </div>
      )}

      {/* DIGITAL LIBRARY VIEW */}
      {activeSubTab === 'library' && (
        <div className="space-y-6">
          {/* Library Search & Filter */}
          <div className="bg-white rounded-2xl p-4 sm:p-6 border border-slate-200 shadow-xs flex flex-col sm:flex-row gap-3 items-center justify-between">
            <div className="relative flex-1 w-full">
              <Search className="w-4 h-4 text-slate-400 absolute left-3.5 top-1/2 -translate-y-1/2" />
              <input
                type="text"
                value={librarySearch}
                onChange={(e) => setLibrarySearch(e.target.value)}
                placeholder="Pesquisar por livros, autores, apostilas ou artigos científicos..."
                className="w-full pl-10 pr-4 py-2.5 bg-slate-50 border border-slate-200 rounded-xl text-xs font-medium focus:ring-2 focus:ring-indigo-500 focus:outline-hidden"
              />
            </div>
            <div className="flex items-center gap-2 overflow-x-auto w-full sm:w-auto">
              {['Todos', 'Livro', 'Apostila', 'Paper Científico'].map((cat) => (
                <button
                  key={cat}
                  onClick={() => setLibraryCategory(cat)}
                  className={`px-3 py-2 rounded-xl text-xs font-bold whitespace-nowrap cursor-pointer transition-all ${
                    libraryCategory === cat
                      ? 'bg-indigo-600 text-white'
                      : 'bg-slate-100 text-slate-600 hover:bg-slate-200'
                  }`}
                >
                  {cat}
                </button>
              ))}
            </div>
          </div>

          {/* Books and Papers Grid */}
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
            {filteredLibrary.map((item) => (
              <div
                key={item.id}
                className="bg-white rounded-2xl border border-slate-200 shadow-xs overflow-hidden flex flex-col justify-between hover:shadow-lg transition-all group"
              >
                <div className="relative h-44 overflow-hidden bg-slate-100">
                  <img
                    src={item.coverImage}
                    alt={item.title}
                    className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-300"
                  />
                  <span className="absolute top-3 left-3 px-2 py-0.5 rounded-md text-[10px] font-black uppercase bg-slate-900/80 text-white backdrop-blur-xs">
                    {item.category}
                  </span>
                </div>

                <div className="p-4 flex-1 space-y-2">
                  <h4 className="font-extrabold text-slate-900 text-sm line-clamp-2 leading-snug">
                    {item.title}
                  </h4>
                  <p className="text-[11px] text-slate-400 font-semibold">{item.author}</p>
                  <p className="text-xs text-slate-500 line-clamp-2 leading-relaxed">
                    {item.description}
                  </p>
                </div>

                <div className="p-3 bg-slate-50 border-t border-slate-100 flex items-center justify-between text-xs">
                  <span className="text-[10px] font-mono text-slate-500 font-bold">
                    {item.format} • {item.fileSize}
                  </span>
                  <button
                    onClick={() => alert(`Iniciando download do arquivo "${item.title}" em alta resolução.`)}
                    className="flex items-center gap-1.5 px-3 py-1.5 bg-indigo-600 hover:bg-indigo-700 text-white rounded-lg text-xs font-bold shadow-2xs cursor-pointer transition-colors"
                  >
                    <Download className="w-3.5 h-3.5" />
                    Baixar
                  </button>
                </div>
              </div>
            ))}
          </div>
        </div>
      )}
    </div>
  );
};
