
import React, { useState, useEffect } from 'react';
import { GraduationCap, Save, Search, Download, CheckCircle2, AlertCircle } from 'lucide-react';
import { store } from '../state/store';
import { Grade } from '../types';

export const Grades: React.FC = () => {
  const [selectedClassId, setSelectedClassId] = useState(store.classes[0]?.id || '');
  const [selectedBimester, setSelectedBimester] = useState(1);
  const [classes, setClasses] = useState(store.classes);
  const [students, setStudents] = useState(store.students);
  const [grades, setGrades] = useState(store.grades);
  const [searchTerm, setSearchTerm] = useState('');
  const [isSaving, setIsSaving] = useState(false);
  
  // Estado para capturar as notas digitadas antes de salvar no store
  const [localGrades, setLocalGrades] = useState<Record<string, number>>({});

  useEffect(() => {
    return store.subscribe(() => {
      setClasses(store.classes);
      setStudents(store.students);
      setGrades(store.grades);
    });
  }, []);

  const filteredStudents = students.filter(s => 
    s.class_id === selectedClassId && 
    s.name.toLowerCase().includes(searchTerm.toLowerCase())
  );

  const handleGradeChange = (studentId: string, value: string) => {
    const val = parseFloat(value);
    setLocalGrades(prev => ({
      ...prev,
      [studentId]: isNaN(val) ? 0 : val
    }));
  };

  const handleSave = () => {
    setIsSaving(true);
    
    const gradesToSave: Grade[] = filteredStudents.map(student => {
      const score = localGrades[student.id] !== undefined 
        ? localGrades[student.id] 
        : (grades.find(g => g.student_id === student.id && g.bimester === selectedBimester)?.score || 0);

      return {
        id: `grade-${student.id}-${selectedBimester}-${Date.now()}`,
        student_id: student.id,
        class_id: selectedClassId,
        evaluation_name: 'Média Bimestral',
        evaluation_type: 'EXAM',
        score: score,
        max_score: 10,
        weight: 1,
        bimester: selectedBimester as any,
        date: new Date().toISOString().split('T')[0]
      };
    });

    setTimeout(() => {
      store.saveGrades(gradesToSave);
      setIsSaving(false);
      setLocalGrades({});
      alert('Notas salvas com sucesso no banco de dados!');
    }, 800);
  };

  return (
    <div className="space-y-6 animate-in fade-in duration-500 pb-20">
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
        <div>
          <h1 className="text-3xl font-black text-slate-900 tracking-tight">Lançamento de Notas</h1>
          <p className="text-slate-500 font-medium">Controle de avaliações do {selectedBimester}º Bimestre.</p>
        </div>
        <div className="flex gap-2">
           <button className="flex items-center gap-2 bg-white border border-slate-200 text-slate-700 px-4 py-2.5 rounded-xl font-bold hover:bg-slate-50 transition-all">
             <Download className="w-4 h-4" />
             Exportar Pauta
           </button>
           <button 
             onClick={handleSave}
             disabled={isSaving}
             className="flex items-center gap-2 bg-indigo-600 text-white px-6 py-2.5 rounded-xl font-bold hover:bg-indigo-700 transition-all shadow-lg shadow-indigo-100 disabled:opacity-70"
           >
             {isSaving ? 'Salvando...' : <><Save className="w-4 h-4" /> Salvar Tudo</>}
           </button>
        </div>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-4 gap-4 bg-white p-4 rounded-2xl border border-slate-200 shadow-sm">
        <div className="md:col-span-2 relative">
          <Search className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-slate-400" />
          <input 
            type="text" 
            placeholder="Filtrar aluno..." 
            value={searchTerm}
            onChange={(e) => setSearchTerm(e.target.value)}
            className="w-full pl-10 pr-4 py-2.5 bg-slate-50 border-none rounded-xl text-sm outline-none ring-1 ring-slate-200 focus:ring-2 focus:ring-indigo-600 transition-all"
          />
        </div>
        <select 
          value={selectedClassId}
          onChange={(e) => setSelectedClassId(e.target.value)}
          className="bg-slate-50 border-none rounded-xl text-sm px-4 py-2.5 outline-none ring-1 ring-slate-200 focus:ring-2 focus:ring-indigo-600"
        >
          {classes.map(c => <option key={c.id} value={c.id}>{c.name}</option>)}
        </select>
        <select 
          value={selectedBimester}
          onChange={(e) => setSelectedBimester(Number(e.target.value))}
          className="bg-slate-50 border-none rounded-xl text-sm px-4 py-2.5 outline-none ring-1 ring-slate-200 focus:ring-2 focus:ring-indigo-600"
        >
          <option value={1}>1º Bimestre</option>
          <option value={2}>2º Bimestre</option>
          <option value={3}>3º Bimestre</option>
          <option value={4}>4º Bimestre</option>
        </select>
      </div>

      <div className="bg-white rounded-[2rem] border border-slate-200 shadow-sm overflow-hidden">
        <div className="overflow-x-auto">
          <table className="w-full text-left border-collapse">
            <thead className="bg-slate-50 border-b border-slate-200">
              <tr>
                <th className="px-8 py-4 text-[10px] font-black text-slate-400 uppercase tracking-widest">Aluno</th>
                <th className="px-8 py-4 text-[10px] font-black text-slate-400 uppercase tracking-widest text-center">Nota Final (0-10)</th>
                <th className="px-8 py-4 text-[10px] font-black text-slate-400 uppercase tracking-widest">Status</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-slate-100">
              {filteredStudents.map((student) => {
                const grade = grades.find(g => g.student_id === student.id && g.bimester === selectedBimester);
                const currentScore = localGrades[student.id] !== undefined ? localGrades[student.id] : (grade?.score || '');
                
                return (
                  <tr key={student.id} className="hover:bg-slate-50 transition-colors">
                    <td className="px-8 py-5">
                      <p className="text-sm font-bold text-slate-800">{student.name}</p>
                      <p className="text-[10px] text-slate-400 font-bold uppercase tracking-widest">RA: {student.registration_number}</p>
                    </td>
                    <td className="px-8 py-5">
                      <input 
                        type="number" 
                        max="10" 
                        min="0"
                        step="0.1" 
                        value={currentScore}
                        onChange={(e) => handleGradeChange(student.id, e.target.value)}
                        placeholder="0.0"
                        className="w-24 mx-auto block text-center bg-slate-50 border-none rounded-xl py-2 text-sm font-black text-slate-700 ring-1 ring-slate-200 focus:ring-2 focus:ring-indigo-600 outline-none" 
                      />
                    </td>
                    <td className="px-8 py-5">
                      <div className={`flex items-center gap-2 text-[10px] font-bold uppercase tracking-tighter ${grade ? 'text-emerald-600' : 'text-slate-400'}`}>
                        {grade ? <><CheckCircle2 className="w-3.5 h-3.5" /> Lançado</> : <><AlertCircle className="w-3.5 h-3.5" /> Pendente</>}
                      </div>
                    </td>
                  </tr>
                );
              })}
            </tbody>
          </table>
        </div>
      </div>
    </div>
  );
};
