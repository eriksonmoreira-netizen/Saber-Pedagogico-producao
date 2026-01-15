
import React, { useState, useEffect, useRef } from 'react';
import { 
  Plus, 
  Search, 
  Filter, 
  Upload, 
  Download, 
  MoreVertical, 
  Edit, 
  Trash2, 
  Eye, 
  FileSpreadsheet,
  X,
  Check,
  AlertCircle,
  ChevronRight,
  User
} from 'lucide-react';
import { store } from '../state/store';
import { Student, SchoolClass } from '../types';
import { extractStudentsFromText } from '../services/gemini';

export const Students: React.FC<{ onSelectStudent: (id: string) => void }> = ({ onSelectStudent }) => {
  const [searchTerm, setSearchTerm] = useState('');
  const [selectedClass, setSelectedClass] = useState('all');
  const [selectedStatus, setSelectedStatus] = useState('all');
  const [isDialogOpen, setIsDialogOpen] = useState(false);
  const [isImportDialogOpen, setIsImportDialogOpen] = useState(false);
  const [isExtracting, setIsExtracting] = useState(false);
  const [importText, setImportText] = useState('');
  const [extractedData, setExtractedData] = useState<Partial<Student>[]>([]);

  const [students, setStudents] = useState(store.students);
  const [classes, setClasses] = useState(store.classes);

  useEffect(() => {
    return store.subscribe(() => {
      setStudents(store.students);
      setClasses(store.classes);
    });
  }, []);

  const filteredStudents = students.filter(s => {
    const matchesSearch = s.name.toLowerCase().includes(searchTerm.toLowerCase()) || 
                          s.registration_number.includes(searchTerm);
    const matchesClass = selectedClass === 'all' || s.class_id === selectedClass;
    const matchesStatus = selectedStatus === 'all' || s.status === selectedStatus;
    return matchesSearch && matchesClass && matchesStatus;
  });

  const handleExport = () => {
    const headers = ['Nome', 'RA', 'Turma', 'Status', 'Responsável'];
    const rows = filteredStudents.map(s => [
      s.name,
      s.registration_number,
      classes.find(c => c.id === s.class_id)?.name || '-',
      s.status,
      s.guardian_name
    ].join(','));
    
    const csvContent = "data:text/csv;charset=utf-8," + [headers.join(','), ...rows].join('\n');
    const encodedUri = encodeURI(csvContent);
    const link = document.createElement("a");
    link.setAttribute("href", encodedUri);
    link.setAttribute("download", `alunos_${selectedClass}.csv`);
    document.body.appendChild(link);
    link.click();
    document.body.removeChild(link);
  };

  const handleIAExtract = async () => {
    if (!importText.trim()) return;
    setIsExtracting(true);
    try {
      const result = await extractStudentsFromText(importText);
      setExtractedData(result);
      setIsImportDialogOpen(true);
    } catch (err) {
      alert("Erro ao extrair dados. Tente colar um texto mais claro.");
    } finally {
      setIsExtracting(false);
    }
  };

  const confirmImport = () => {
    // No mundo real, aqui chamaríamos um bulkCreate no store
    alert(`${extractedData.length} alunos seriam importados para a turma selecionada.`);
    setIsImportDialogOpen(false);
    setExtractedData([]);
    setImportText('');
  };

  return (
    <div className="space-y-6 animate-in fade-in duration-500">
      {/* Header Profissional */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
        <div>
          <h1 className="text-3xl font-black text-slate-900 tracking-tight">Alunos</h1>
          <p className="text-slate-500 font-medium">Gerencie o corpo discente e dados de contato.</p>
        </div>
        <div className="flex flex-wrap gap-2">
          <button 
            onClick={handleExport}
            className="flex items-center gap-2 bg-white border border-slate-200 text-slate-700 px-4 py-2.5 rounded-xl font-bold hover:bg-slate-50 transition-all shadow-sm"
          >
            <Download className="w-4 h-4" />
            Exportar CSV
          </button>
          <button 
            onClick={() => setIsDialogOpen(true)}
            className="flex items-center gap-2 bg-indigo-600 text-white px-5 py-2.5 rounded-xl font-bold hover:bg-indigo-700 transition-all shadow-lg shadow-indigo-100"
          >
            <Plus className="w-4 h-4" />
            Novo Aluno
          </button>
        </div>
      </div>

      {/* Filtros e Busca */}
      <div className="grid grid-cols-1 md:grid-cols-4 gap-4 bg-white p-4 rounded-2xl border border-slate-200 shadow-sm">
        <div className="md:col-span-2 relative">
          <Search className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-slate-400" />
          <input 
            type="text" 
            placeholder="Buscar por nome ou RA..." 
            value={searchTerm}
            onChange={(e) => setSearchTerm(e.target.value)}
            className="w-full pl-10 pr-4 py-2.5 bg-slate-50 border-none rounded-xl text-sm outline-none ring-1 ring-slate-200 focus:ring-2 focus:ring-indigo-600 transition-all"
          />
        </div>
        <select 
          value={selectedClass}
          onChange={(e) => setSelectedClass(e.target.value)}
          className="bg-slate-50 border-none rounded-xl text-sm px-4 py-2.5 outline-none ring-1 ring-slate-200 focus:ring-2 focus:ring-indigo-600"
        >
          <option value="all">Todas as Turmas</option>
          {classes.map(c => <option key={c.id} value={c.id}>{c.name}</option>)}
        </select>
        <select 
          value={selectedStatus}
          onChange={(e) => setSelectedStatus(e.target.value)}
          className="bg-slate-50 border-none rounded-xl text-sm px-4 py-2.5 outline-none ring-1 ring-slate-200 focus:ring-2 focus:ring-indigo-600"
        >
          <option value="all">Todos os Status</option>
          <option value="ACTIVE">Ativo</option>
          <option value="INACTIVE">Inativo</option>
        </select>
      </div>

      {/* Importação IA - Card de Ação */}
      <div className="bg-gradient-to-r from-indigo-50 to-purple-50 p-6 rounded-3xl border border-indigo-100 flex flex-col md:flex-row items-center gap-6">
        <div className="p-4 bg-white rounded-2xl shadow-sm">
          <FileSpreadsheet className="w-8 h-8 text-indigo-600" />
        </div>
        <div className="flex-1 space-y-1">
          <h4 className="font-bold text-indigo-900">Importação Inteligente com IA</h4>
          <p className="text-sm text-indigo-700/70">Cole uma lista de nomes, RAs ou textos de diários antigos para extrair alunos automaticamente.</p>
        </div>
        <div className="flex gap-2 w-full md:w-auto">
          <textarea 
            value={importText}
            onChange={(e) => setImportText(e.target.value)}
            placeholder="Cole o texto aqui..."
            className="flex-1 md:w-64 p-2 text-xs border border-indigo-200 rounded-xl outline-none focus:ring-2 focus:ring-indigo-600 bg-white"
          />
          <button 
            onClick={handleIAExtract}
            disabled={isExtracting || !importText.trim()}
            className="bg-indigo-600 text-white px-4 py-2 rounded-xl font-bold text-xs hover:bg-indigo-700 transition-all disabled:opacity-50 shrink-0"
          >
            {isExtracting ? 'Processando...' : 'Extrair com IA'}
          </button>
        </div>
      </div>

      {/* Tabela de Alunos */}
      <div className="bg-white rounded-[2rem] border border-slate-200 shadow-sm overflow-hidden">
        <div className="overflow-x-auto">
          <table className="w-full text-left border-collapse">
            <thead className="bg-slate-50 border-b border-slate-200">
              <tr>
                <th className="px-8 py-4 text-[10px] font-black text-slate-400 uppercase tracking-widest">Aluno</th>
                <th className="px-8 py-4 text-[10px] font-black text-slate-400 uppercase tracking-widest">Turma</th>
                <th className="px-8 py-4 text-[10px] font-black text-slate-400 uppercase tracking-widest">RA</th>
                <th className="px-8 py-4 text-[10px] font-black text-slate-400 uppercase tracking-widest">Responsável</th>
                <th className="px-8 py-4 text-[10px] font-black text-slate-400 uppercase tracking-widest text-right">Ações</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-slate-100">
              {filteredStudents.length > 0 ? filteredStudents.map((student) => {
                const sClass = classes.find(c => c.id === student.class_id);
                return (
                  <tr key={student.id} className="hover:bg-slate-50/50 transition-colors group">
                    <td className="px-8 py-5">
                      <div className="flex items-center gap-4">
                        <div className={`w-10 h-10 rounded-full bg-slate-100 flex items-center justify-center font-bold text-slate-500`}>
                          {student.name.substring(0, 2)}
                        </div>
                        <div>
                          <p 
                            className="text-sm font-bold text-slate-800 hover:text-indigo-600 cursor-pointer transition-colors"
                            onClick={() => onSelectStudent(student.id)}
                          >
                            {student.name}
                          </p>
                          <div className="flex gap-1 mt-1">
                            {student.tags.map(tag => (
                              <span key={tag} className="text-[9px] font-black uppercase px-1.5 py-0.5 bg-slate-100 text-slate-500 rounded">{tag}</span>
                            ))}
                          </div>
                        </div>
                      </div>
                    </td>
                    <td className="px-8 py-5">
                      <span className={`px-2.5 py-1 rounded-lg text-[10px] font-black uppercase bg-indigo-50 text-indigo-600`}>
                        {sClass?.name || '-'}
                      </span>
                    </td>
                    <td className="px-8 py-5 text-sm text-slate-500 font-medium">{student.registration_number}</td>
                    <td className="px-8 py-5">
                      <p className="text-xs font-bold text-slate-700">{student.guardian_name}</p>
                      <p className="text-[10px] text-slate-400">{student.guardian_phone}</p>
                    </td>
                    <td className="px-8 py-5 text-right">
                      <div className="flex justify-end gap-2">
                        <button 
                          onClick={() => onSelectStudent(student.id)}
                          className="p-2 text-slate-400 hover:text-indigo-600 hover:bg-indigo-50 rounded-lg transition-all"
                        >
                          <Eye className="w-4 h-4" />
                        </button>
                        <button className="p-2 text-slate-400 hover:text-amber-600 hover:bg-amber-50 rounded-lg transition-all">
                          <Edit className="w-4 h-4" />
                        </button>
                        <button className="p-2 text-slate-400 hover:text-red-600 hover:bg-red-50 rounded-lg transition-all">
                          <Trash2 className="w-4 h-4" />
                        </button>
                      </div>
                    </td>
                  </tr>
                );
              }) : (
                <tr>
                  <td colSpan={5} className="px-8 py-20 text-center">
                    <div className="max-w-xs mx-auto space-y-4">
                      <div className="w-16 h-16 bg-slate-50 rounded-full flex items-center justify-center mx-auto">
                        <User className="w-8 h-8 text-slate-300" />
                      </div>
                      <h3 className="text-lg font-bold text-slate-800">Nenhum aluno encontrado</h3>
                      <p className="text-sm text-slate-500">Tente ajustar seus filtros ou adicione um novo aluno manualmente.</p>
                    </div>
                  </td>
                </tr>
              )}
            </tbody>
          </table>
        </div>
      </div>

      {/* Modal de Importação Assistida (Simplificado) */}
      {isImportDialogOpen && (
        <div className="fixed inset-0 bg-slate-900/60 backdrop-blur-sm z-[100] flex items-center justify-center p-4">
          <div className="bg-white w-full max-w-2xl rounded-[2.5rem] shadow-2xl overflow-hidden animate-in zoom-in-95 duration-300">
            <div className="p-8 border-b border-slate-100 flex justify-between items-center">
              <h3 className="text-2xl font-black text-slate-900">Revisar Importação IA</h3>
              <button onClick={() => setIsImportDialogOpen(false)} className="p-2 hover:bg-slate-100 rounded-full transition-colors">
                <X className="w-6 h-6 text-slate-400" />
              </button>
            </div>
            <div className="p-8 max-h-[50vh] overflow-y-auto space-y-4">
              <p className="text-sm text-slate-500">A IA identificou <strong>{extractedData.length}</strong> alunos. Verifique se os dados estão corretos antes de salvar.</p>
              <div className="border rounded-2xl overflow-hidden">
                <table className="w-full text-left text-sm">
                  <thead className="bg-slate-50">
                    <tr>
                      <th className="p-4 font-bold text-slate-700">Nome</th>
                      <th className="p-4 font-bold text-slate-700">RA</th>
                    </tr>
                  </thead>
                  <tbody className="divide-y divide-slate-100">
                    {extractedData.map((d, i) => (
                      <tr key={i}>
                        <td className="p-4 text-slate-800">{d.name}</td>
                        <td className="p-4 text-slate-500">{d.registration_number || '-'}</td>
                      </tr>
                    ))}
                  </tbody>
                </table>
              </div>
            </div>
            <div className="p-8 bg-slate-50 flex justify-end gap-3">
              <button 
                onClick={() => setIsImportDialogOpen(false)}
                className="px-6 py-3 rounded-xl font-bold text-slate-500 hover:bg-slate-200 transition-all"
              >
                Cancelar
              </button>
              <button 
                onClick={confirmImport}
                className="px-8 py-3 bg-indigo-600 text-white rounded-xl font-bold hover:bg-indigo-700 shadow-lg shadow-indigo-100 transition-all flex items-center gap-2"
              >
                <Check className="w-5 h-5" /> Importar Tudo
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
};
