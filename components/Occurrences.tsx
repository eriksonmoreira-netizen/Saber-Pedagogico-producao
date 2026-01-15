
import React, { useState, useEffect } from 'react';
import { AlertCircle, Plus, Filter, Search, X, Check, Bell } from 'lucide-react';
import { store } from '../state/store';
import { Occurrence } from '../types';

export const Occurrences: React.FC<{ onSelectStudent: (id: string) => void }> = ({ onSelectStudent }) => {
  const [occurrences, setOccurrences] = useState(store.occurrences);
  const [students, setStudents] = useState(store.students);
  const [classes, setClasses] = useState(store.classes);
  const [isDialogOpen, setIsDialogOpen] = useState(false);

  // Form State
  const [studentId, setStudentId] = useState('');
  const [title, setTitle] = useState('');
  const [description, setDescription] = useState('');
  const [type, setType] = useState<'DISCIPLINARY' | 'PEDAGOGICAL' | 'PRAISE' | 'NOTICE'>('PEDAGOGICAL');
  const [severity, setSeverity] = useState<'LOW' | 'MEDIUM' | 'HIGH'>('LOW');

  useEffect(() => {
    return store.subscribe(() => {
      setOccurrences(store.occurrences);
      setStudents(store.students);
      setClasses(store.classes);
    });
  }, []);

  const handleSave = (e: React.FormEvent) => {
    e.preventDefault();
    if (!studentId || !title || !description) return;

    const student = students.find(s => s.id === studentId);
    
    const newOcc: Occurrence = {
      id: `occ-${Date.now()}`,
      student_id: studentId,
      class_id: student?.class_id || '',
      date: new Date().toISOString().split('T')[0],
      type,
      severity,
      title,
      description,
      action_taken: 'Registrado no sistema.',
      guardian_notified: false
    };

    store.saveOccurrence(newOcc);
    setIsDialogOpen(false);
    resetForm();
  };

  const resetForm = () => {
    setStudentId('');
    setTitle('');
    setDescription('');
    setType('PEDAGOGICAL');
    setSeverity('LOW');
  };

  return (
    <div className="space-y-6 animate-in fade-in duration-500 pb-20">
      <div className="flex justify-between items-center">
        <div>
          <h2 className="text-3xl font-black text-slate-900 tracking-tight">Mural de Ocorrências</h2>
          <p className="text-slate-500 font-medium">Histórico disciplinar e pedagógico centralizado.</p>
        </div>
        <button 
          onClick={() => setIsDialogOpen(true)}
          className="flex items-center gap-2 bg-indigo-600 text-white px-6 py-2.5 rounded-xl font-bold hover:bg-indigo-700 shadow-lg shadow-indigo-100 transition-all active:scale-95"
        >
          <Plus className="w-4 h-4" />
          Novo Registro
        </button>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-4 gap-8">
        <div className="lg:col-span-1 space-y-6">
          <div className="bg-white p-6 rounded-3xl border border-slate-200 shadow-sm space-y-4">
             <h4 className="font-bold text-slate-800 text-sm flex items-center gap-2"><Filter className="w-4 h-4 text-indigo-600" /> Filtros Rápidos</h4>
             <div className="space-y-2">
               {['Disciplinar', 'Pedagógica', 'Elogio', 'Aviso'].map(t => (
                 <label key={t} className="flex items-center gap-2 cursor-pointer group">
                   <input type="checkbox" className="rounded text-indigo-600 focus:ring-indigo-500" />
                   <span className="text-sm text-slate-600 group-hover:text-indigo-600 font-medium">{t}</span>
                 </label>
               ))}
             </div>
             <div className="h-px bg-slate-100"></div>
             <div className="space-y-2">
               {['Alta', 'Média', 'Baixa'].map(s => (
                 <label key={s} className="flex items-center gap-2 cursor-pointer group">
                   <input type="checkbox" className="rounded text-indigo-600" />
                   <span className="text-sm text-slate-600 group-hover:text-indigo-600 font-medium">Severidade {s}</span>
                 </label>
               ))}
             </div>
          </div>
        </div>

        <div className="lg:col-span-3 space-y-4">
          {occurrences.length > 0 ? occurrences.map((occ) => {
            const student = students.find(s => s.id === occ.student_id);
            return (
              <div key={occ.id} className="bg-white p-6 rounded-[2rem] border border-slate-200 shadow-sm hover:border-indigo-200 transition-all group animate-in slide-in-from-bottom-2">
                <div className="flex justify-between items-start mb-4">
                  <div className="flex gap-4">
                    <div className={`p-3 rounded-2xl ${occ.severity === 'HIGH' ? 'bg-red-50 text-red-500' : 'bg-slate-50 text-indigo-500'}`}>
                       <AlertCircle className="w-6 h-6" />
                    </div>
                    <div>
                      <h4 className="font-bold text-slate-800 text-lg">{occ.title}</h4>
                      <p className="text-sm text-indigo-600 font-bold hover:underline cursor-pointer flex items-center gap-1" onClick={() => student && onSelectStudent(student.id)}>
                         {student?.name || 'Aluno Desconhecido'}
                      </p>
                    </div>
                  </div>
                  <span className="text-[10px] font-black text-slate-400 uppercase tracking-widest">{occ.date}</span>
                </div>
                <div className="bg-slate-50/50 p-4 rounded-2xl border border-slate-100 mb-4">
                  <p className="text-sm text-slate-600 leading-relaxed italic">"{occ.description}"</p>
                </div>
                <div className="flex justify-between items-center">
                  <div className="flex gap-2">
                    <span className="text-[9px] font-black uppercase px-2 py-1 bg-indigo-50 text-indigo-600 rounded-lg">{occ.type}</span>
                    <span className={`text-[9px] font-black uppercase px-2 py-1 rounded-lg ${occ.severity === 'HIGH' ? 'bg-red-50 text-red-600' : 'bg-slate-100 text-slate-500'}`}>
                      Prioridade {occ.severity}
                    </span>
                  </div>
                  <div className="flex gap-2">
                    {occ.guardian_notified && (
                      <span className="flex items-center gap-1 text-[9px] font-black text-emerald-600 bg-emerald-50 px-2.5 py-1 rounded-lg">
                        <Bell className="w-3 h-3" /> FAMÍLIA NOTIFICADA
                      </span>
                    )}
                    <button className="text-xs font-black text-indigo-600 hover:underline uppercase tracking-tighter">Detalhes</button>
                  </div>
                </div>
              </div>
            );
          }) : (
            <div className="p-20 text-center bg-white rounded-[2.5rem] border border-dashed border-slate-200">
              <p className="text-slate-400 font-medium italic">Nenhuma ocorrência registrada até o momento.</p>
            </div>
          )}
        </div>
      </div>

      {/* Modal Novo Registro */}
      {isDialogOpen && (
        <div className="fixed inset-0 bg-slate-900/60 backdrop-blur-sm z-[100] flex items-center justify-center p-4">
          <div className="bg-white w-full max-w-lg rounded-[2.5rem] shadow-2xl overflow-hidden animate-in zoom-in-95 duration-300">
            <form onSubmit={handleSave}>
              <div className="p-8 border-b border-slate-100 flex justify-between items-center">
                <h3 className="text-2xl font-black text-slate-900">Novo Registro</h3>
                <button type="button" onClick={() => setIsDialogOpen(false)} className="p-2 hover:bg-slate-100 rounded-full transition-colors">
                  <X className="w-6 h-6 text-slate-400" />
                </button>
              </div>
              <div className="p-8 space-y-5">
                <div className="space-y-2">
                  <label className="text-[10px] font-black text-slate-400 uppercase tracking-widest">Aluno</label>
                  <select 
                    value={studentId}
                    onChange={(e) => setStudentId(e.target.value)}
                    required
                    className="w-full bg-slate-50 border-none rounded-xl p-3 text-sm ring-1 ring-slate-200 focus:ring-2 focus:ring-indigo-600 outline-none"
                  >
                    <option value="">Selecione o aluno...</option>
                    {students.map(s => <option key={s.id} value={s.id}>{s.name} ({classes.find(c => c.id === s.class_id)?.name})</option>)}
                  </select>
                </div>
                <div className="space-y-2">
                  <label className="text-[10px] font-black text-slate-400 uppercase tracking-widest">Título da Ocorrência</label>
                  <input 
                    type="text" 
                    value={title}
                    onChange={(e) => setTitle(e.target.value)}
                    required
                    placeholder="Ex: Falta de material, Conflito, Destaque..." 
                    className="w-full bg-slate-50 border-none rounded-xl p-3 text-sm ring-1 ring-slate-200 focus:ring-2 focus:ring-indigo-600 outline-none" 
                  />
                </div>
                <div className="grid grid-cols-2 gap-4">
                  <div className="space-y-2">
                    <label className="text-[10px] font-black text-slate-400 uppercase tracking-widest">Tipo</label>
                    <select 
                      value={type}
                      onChange={(e) => setType(e.target.value as any)}
                      className="w-full bg-slate-50 border-none rounded-xl p-3 text-sm ring-1 ring-slate-200 focus:ring-2 focus:ring-indigo-600 outline-none"
                    >
                      <option value="PEDAGOGICAL">Pedagógica</option>
                      <option value="DISCIPLINARY">Disciplinar</option>
                      <option value="PRAISE">Elogio</option>
                      <option value="NOTICE">Aviso</option>
                    </select>
                  </div>
                  <div className="space-y-2">
                    <label className="text-[10px] font-black text-slate-400 uppercase tracking-widest">Gravidade</label>
                    <select 
                      value={severity}
                      onChange={(e) => setSeverity(e.target.value as any)}
                      className="w-full bg-slate-50 border-none rounded-xl p-3 text-sm ring-1 ring-slate-200 focus:ring-2 focus:ring-indigo-600 outline-none"
                    >
                      <option value="LOW">Baixa</option>
                      <option value="MEDIUM">Média</option>
                      <option value="HIGH">Alta</option>
                    </select>
                  </div>
                </div>
                <div className="space-y-2">
                  <label className="text-[10px] font-black text-slate-400 uppercase tracking-widest">Descrição dos Fatos</label>
                  <textarea 
                    value={description}
                    onChange={(e) => setDescription(e.target.value)}
                    required
                    rows={4} 
                    className="w-full bg-slate-50 border-none rounded-xl p-3 text-sm ring-1 ring-slate-200 focus:ring-2 focus:ring-indigo-600 outline-none" 
                  />
                </div>
              </div>
              <div className="p-8 bg-slate-50 flex justify-end gap-3">
                <button type="button" onClick={() => setIsDialogOpen(false)} className="px-6 py-3 rounded-xl font-bold text-slate-500 hover:bg-slate-200 transition-all">Cancelar</button>
                <button type="submit" className="px-8 py-3 bg-indigo-600 text-white rounded-xl font-bold hover:bg-indigo-700 shadow-lg shadow-indigo-100 transition-all flex items-center gap-2">
                  <Check className="w-5 h-5" /> Registrar Ocorrência
                </button>
              </div>
            </form>
          </div>
        </div>
      )}
    </div>
  );
};
