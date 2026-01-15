
import React, { useState, useEffect, useMemo } from 'react';
import { 
  Plus, 
  Search, 
  BookOpen, 
  Users, 
  Clock, 
  ChevronRight,
  School,
  X,
  Check,
  ChevronLeft,
  ArrowUpRight,
  Trophy,
  Zap,
  TrendingUp,
  Star,
  Pencil,
  Loader2,
  Trash2
} from 'lucide-react';
import { store } from '../state/store';
import { SchoolClass, Student, StudentStatus, GradeCriterion } from '../types';

interface ClassesProps {
  onSelectStudent?: (id: string) => void;
}

export const Classes: React.FC<ClassesProps> = ({ onSelectStudent }) => {
  const [searchTerm, setSearchTerm] = useState('');
  
  // Data States
  const [classes, setClasses] = useState(store.classes);
  const [students, setStudents] = useState(store.students);
  const [grades, setGrades] = useState(store.grades);
  const [attendances, setAttendances] = useState(store.attendances);
  
  // UI States
  const [selectedClassId, setSelectedClassId] = useState<string | null>(null);
  const [isEditModalOpen, setIsEditModalOpen] = useState(false);
  const [isSaving, setIsSaving] = useState(false);
  const [isEditMode, setIsEditMode] = useState(false);
  const [editingClassId, setEditingClassId] = useState<string | null>(null);

  // Form States
  const [newClassName, setNewClassName] = useState('');
  const [newGrade, setNewGrade] = useState(''); 
  const [newSubject, setNewSubject] = useState('');
  const [newSchoolYear, setNewSchoolYear] = useState('2025');
  const [newPeriod, setNewPeriod] = useState<SchoolClass['period']>('matutino');
  const [newSchoolName, setNewSchoolName] = useState('');
  const [newColor, setNewColor] = useState('indigo');
  const [newGradeCriteria, setNewGradeCriteria] = useState<GradeCriterion[]>([]);

  useEffect(() => {
    return store.subscribe(() => {
      setClasses(store.classes);
      setStudents(store.students);
      setGrades(store.grades);
      setAttendances(store.attendances);
    });
  }, []);

  const selectedClass = classes.find(c => c.id === selectedClassId);
  const filteredClasses = classes.filter(c => 
    c.name.toLowerCase().includes(searchTerm.toLowerCase()) || 
    c.subject.toLowerCase().includes(searchTerm.toLowerCase())
  );

  // --- Lógica de Estatísticas e Gamificação ---
  const getStudentCount = (classId: string) => students.filter(s => s.class_id === classId).length;

  const calculateStudentStats = (studentId: string) => {
    const studentGrades = grades.filter(g => g.student_id === studentId);
    const avgGrade = studentGrades.length > 0 
      ? studentGrades.reduce((acc, g) => acc + g.score, 0) / studentGrades.length 
      : 0;

    const studentAttendances = attendances.filter(a => a.student_id === studentId);
    const presenceCount = studentAttendances.filter(a => a.status === 'presente').length;
    const attendanceRate = studentAttendances.length > 0 
      ? (presenceCount / studentAttendances.length) * 100 
      : 100;

    return { avgGrade, attendanceRate, studentGrades };
  };

  const specialStudents = useMemo(() => {
    if (!selectedClassId) return { spotlight: null, improvement: null };
    
    const classStudents = students.filter(s => s.class_id === selectedClassId);
    if (classStudents.length === 0) return { spotlight: null, improvement: null };

    let bestScore = -1;
    let bestSpotlight: Student | null = null;
    let bestImprValue = -100;
    let bestImprStudent: Student | null = null;

    classStudents.forEach(s => {
      const stats = calculateStudentStats(s.id);
      const spotlightScore = (stats.avgGrade * 0.7) + ((stats.attendanceRate / 10) * 0.3);
      
      if (spotlightScore > bestScore) {
        bestScore = spotlightScore;
        bestSpotlight = s;
      }

      const sortedGrades = [...stats.studentGrades].sort((a, b) => a.bimester - b.bimester);
      if (sortedGrades.length >= 2) {
        const last = sortedGrades[sortedGrades.length - 1].score;
        const prev = sortedGrades[sortedGrades.length - 2].score;
        const impr = last - prev;
        if (impr > bestImprValue) {
          bestImprValue = impr;
          bestImprStudent = s;
        }
      }
    });

    return { 
      spotlight: bestSpotlight ? { student: bestSpotlight, stats: calculateStudentStats(bestSpotlight.id) } : null,
      improvement: (bestImprStudent && bestImprValue > 0) ? { student: bestImprStudent, value: bestImprValue } : null
    };
  }, [selectedClassId, students, grades, attendances]);

  // --- Handlers de Ação ---

  const handleOpenEdit = (cls: SchoolClass) => {
    setIsEditMode(true);
    setEditingClassId(cls.id);
    setNewClassName(cls.name);
    setNewGrade(cls.grade || '');
    setNewSubject(cls.subject);
    setNewSchoolYear(cls.school_year);
    setNewPeriod(cls.period);
    setNewSchoolName(cls.school_name);
    setNewColor(cls.color);
    setNewGradeCriteria(cls.grade_criteria || []);
    setIsEditModalOpen(true);
  };

  const handleDeleteClass = async (classId: string) => {
    if (confirm('Tem certeza que deseja excluir esta turma? Todos os dados locais serão removidos.')) {
        // MODO ESTÁTICO: Apenas remove do store (LocalStorage)
        const updatedClasses = store.classes.filter(c => c.id !== classId);
        store.setAllData({
          ...store,
          classes: updatedClasses,
          students: store.students,
          grades: store.grades,
          occurrences: store.occurrences,
          tutorings: store.tutorings,
          attendances: store.attendances
        });
    }
  };

  const handleSaveClass = async () => {
    if (!newClassName || !newSchoolYear) {
      alert("Por favor, preencha Nome e Ano Letivo.");
      return;
    }

    setIsSaving(true);

    if (isEditMode && editingClassId) {
      const existingClass = classes.find(c => c.id === editingClassId);
      if (existingClass) {
        const updatedClass: SchoolClass = {
          ...existingClass,
          name: newClassName,
          grade: newGrade,
          subject: newSubject,
          school_year: newSchoolYear,
          period: newPeriod,
          school_name: newSchoolName,
          color: newColor,
          grade_criteria: newGradeCriteria
        };
        store.updateClass(updatedClass);
      }
    } else {
      const newClass: SchoolClass = {
        id: `class-${Math.random().toString(36).substr(2, 9)}`,
        name: newClassName,
        grade: newGrade,
        subject: newSubject,
        school_year: newSchoolYear,
        period: newPeriod,
        school_name: newSchoolName || 'Colégio Saber',
        color: newColor,
        status: 'ativa',
        grade_criteria: newGradeCriteria,
        created_by: store.user?.email
      };

      store.setAllData({
        ...store,
        classes: [...store.classes, newClass],
        students: store.students,
        grades: store.grades,
        occurrences: store.occurrences,
        tutorings: store.tutorings,
        attendances: store.attendances
      });
    }

    setIsSaving(false);
    setIsEditModalOpen(false);
    resetForm();
  };

  const resetForm = () => {
    setIsEditMode(false);
    setEditingClassId(null);
    setNewClassName('');
    setNewGrade('');
    setNewSubject('');
    setNewSchoolYear('2025');
    setNewPeriod('matutino');
    setNewSchoolName('');
    setNewColor('indigo');
    setNewGradeCriteria([]);
  };

  const getStatusBadge = (status: StudentStatus) => {
    switch (status) {
      case 'ACTIVE': return <span className="bg-emerald-50 text-emerald-600 px-2 py-1 rounded text-[10px] font-black uppercase">Ativo</span>;
      case 'TRANSFERRED': return <span className="bg-blue-50 text-blue-600 px-2 py-1 rounded text-[10px] font-black uppercase">Transferido</span>;
      default: return <span className="bg-slate-50 text-slate-600 px-2 py-1 rounded text-[10px] font-black uppercase">{status}</span>;
    }
  };

  // --- Renderização Condicional: Detalhes ou Lista ---

  const renderClassDetails = () => {
    if (!selectedClassId || !selectedClass) return null;

    const classStudents = students
      .filter(s => s.class_id === selectedClassId)
      .sort((a, b) => a.name.localeCompare(b.name));

    return (
      <div className="space-y-6 animate-in slide-in-from-right-4 duration-500 pb-12">
        <button 
          onClick={() => setSelectedClassId(null)}
          className="flex items-center gap-2 text-slate-500 hover:text-indigo-600 transition-colors font-bold text-sm"
        >
          <ChevronLeft className="w-4 h-4" /> Voltar para Turmas
        </button>

        {/* Header da Turma Detalhada */}
        <div className="bg-white p-8 rounded-[2.5rem] border border-slate-200 shadow-sm flex flex-col md:flex-row md:items-center justify-between gap-6 relative group/header">
          <div className="flex items-center gap-6">
            <div className={`w-16 h-16 rounded-3xl bg-${selectedClass.color}-600 flex items-center justify-center text-white shadow-lg`}>
              <BookOpen className="w-8 h-8" />
            </div>
            <div>
              <div className="flex items-center gap-3">
                <h2 className="text-3xl font-black text-slate-900 tracking-tight">{selectedClass.name}</h2>
                {/* Botão Editar no Header de Detalhes */}
                <button 
                  onClick={(e) => { e.stopPropagation(); handleOpenEdit(selectedClass); }}
                  className="p-2 bg-slate-100 hover:bg-indigo-50 text-slate-400 hover:text-indigo-600 rounded-xl transition-all"
                  title="Editar Turma"
                >
                  <Pencil className="w-4 h-4" />
                </button>
              </div>
              <p className="text-slate-500 font-bold uppercase text-xs tracking-widest">
                {selectedClass.grade} • {selectedClass.subject} • {selectedClass.period}
              </p>
            </div>
          </div>
          <div className="flex gap-4">
            <div className="text-center bg-slate-50 px-6 py-3 rounded-2xl border border-slate-100">
              <p className="text-[10px] font-black text-slate-400 uppercase tracking-widest mb-1">Alunos</p>
              <p className="text-2xl font-black text-slate-900">{classStudents.length}</p>
            </div>
            <div className="text-center bg-indigo-50 px-6 py-3 rounded-2xl border border-indigo-100">
              <p className="text-[10px] font-black text-indigo-400 uppercase tracking-widest mb-1">Média</p>
              <p className="text-2xl font-black text-indigo-600">
                {(classStudents.reduce((acc, s) => acc + calculateStudentStats(s.id).avgGrade, 0) / (classStudents.length || 1)).toFixed(1)}
              </p>
            </div>
          </div>
        </div>

        {/* Gamification Cards (Automatic) */}
        <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
          {specialStudents.spotlight && (
            <div 
              onClick={() => onSelectStudent?.(specialStudents.spotlight!.student.id)}
              className="bg-gradient-to-br from-amber-50 to-amber-100 border border-amber-200 p-6 rounded-[2rem] shadow-sm flex items-center gap-6 cursor-pointer hover:shadow-md transition-all group"
            >
              <div className="w-16 h-16 bg-amber-500 rounded-2xl flex items-center justify-center text-white shadow-lg shrink-0">
                <Trophy className="w-8 h-8" />
              </div>
              <div className="min-w-0">
                <p className="text-[10px] font-black text-amber-600 uppercase tracking-[0.2em] mb-1">Aluno Destaque</p>
                <h4 className="text-lg font-black text-amber-900 truncate">{specialStudents.spotlight.student.name}</h4>
                <div className="flex gap-4 mt-2">
                  <span className="text-xs font-bold text-amber-700 flex items-center gap-1"><Star className="w-3 h-3" /> Média {specialStudents.spotlight.stats.avgGrade.toFixed(1)}</span>
                  <span className="text-xs font-bold text-amber-700 flex items-center gap-1"><Check className="w-3 h-3" /> {specialStudents.spotlight.stats.attendanceRate.toFixed(0)}% Freq.</span>
                </div>
              </div>
            </div>
          )}

          {specialStudents.improvement && (
            <div 
              onClick={() => onSelectStudent?.(specialStudents.improvement!.student.id)}
              className="bg-gradient-to-br from-emerald-50 to-emerald-100 border border-emerald-200 p-6 rounded-[2rem] shadow-sm flex items-center gap-6 cursor-pointer hover:shadow-md transition-all group"
            >
              <div className="w-16 h-16 bg-emerald-500 rounded-2xl flex items-center justify-center text-white shadow-lg shrink-0">
                <TrendingUp className="w-8 h-8" />
              </div>
              <div className="min-w-0">
                <p className="text-[10px] font-black text-emerald-600 uppercase tracking-[0.2em] mb-1">Aluno Superação</p>
                <h4 className="text-lg font-black text-emerald-900 truncate">{specialStudents.improvement.student.name}</h4>
                <p className="text-xs font-bold text-emerald-700 mt-2 flex items-center gap-1">
                  <Zap className="w-3 h-3 fill-current" /> Crescimento de +{specialStudents.improvement.value.toFixed(1)} pts
                </p>
              </div>
            </div>
          )}
        </div>

        {/* Tabela de Alunos */}
        <div className="bg-white rounded-[2rem] border border-slate-200 shadow-sm overflow-hidden">
          <div className="overflow-x-auto">
            <table className="w-full text-left border-collapse">
              <thead className="bg-slate-50 border-b border-slate-200">
                <tr>
                  <th className="px-8 py-4 text-[10px] font-black text-slate-400 uppercase tracking-widest w-16">Nº</th>
                  <th className="px-8 py-4 text-[10px] font-black text-slate-400 uppercase tracking-widest">Aluno</th>
                  <th className="px-8 py-4 text-[10px] font-black text-slate-400 uppercase tracking-widest">Status</th>
                  <th className="px-8 py-4 text-[10px] font-black text-slate-400 uppercase tracking-widest text-center">Frequência</th>
                  <th className="px-8 py-4 text-[10px] font-black text-slate-400 uppercase tracking-widest text-center">Média</th>
                  <th className="px-8 py-4 text-[10px] font-black text-slate-400 uppercase tracking-widest text-right">Ações</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-slate-100">
                {classStudents.map((student, index) => {
                  const { avgGrade, attendanceRate } = calculateStudentStats(student.id);
                  const isSpotlight = specialStudents.spotlight?.student.id === student.id;
                  const isImprovement = specialStudents.improvement?.student.id === student.id;

                  return (
                    <tr key={student.id} className="hover:bg-slate-50/50 transition-colors group">
                      <td className="px-8 py-5 text-sm font-black text-slate-300">{index + 1}</td>
                      <td className="px-8 py-5">
                        <div className="flex items-center gap-3">
                          <div 
                            className="w-9 h-9 rounded-full bg-slate-100 flex items-center justify-center font-bold text-slate-500 text-xs cursor-pointer hover:bg-indigo-100 transition-all"
                            onClick={() => onSelectStudent?.(student.id)}
                          >
                            {student.photo_url ? (
                               <img src={student.photo_url} className="w-full h-full object-cover rounded-full" />
                            ) : student.name.substring(0, 2)}
                          </div>
                          <div className="min-w-0">
                            <p 
                              className="text-sm font-bold text-slate-800 hover:text-indigo-600 cursor-pointer transition-colors flex items-center gap-2"
                              onClick={() => onSelectStudent?.(student.id)}
                            >
                              {student.name}
                              {isSpotlight && <Trophy className="w-3.5 h-3.5 text-amber-500" />}
                              {isImprovement && <Zap className="w-3.5 h-3.5 text-emerald-500 fill-current" />}
                            </p>
                            <p className="text-xs text-slate-400 font-bold">RA: {student.registration_number}</p>
                          </div>
                        </div>
                      </td>
                      <td className="px-8 py-5">{getStatusBadge(student.status)}</td>
                      <td className="px-8 py-5">
                        <div className="flex flex-col items-center gap-1">
                          <span className={`text-xs font-black ${attendanceRate < 75 ? 'text-red-500' : 'text-slate-700'}`}>
                            {attendanceRate.toFixed(0)}%
                          </span>
                          <div className="w-16 bg-slate-100 h-1.5 rounded-full overflow-hidden">
                            <div className={`h-full ${attendanceRate < 75 ? 'bg-red-500' : 'bg-emerald-500'}`} style={{ width: `${attendanceRate}%` }}></div>
                          </div>
                        </div>
                      </td>
                      <td className="px-8 py-5 text-center">
                        <span className={`text-sm font-black ${avgGrade < 6 ? 'text-red-500' : 'text-emerald-600'}`}>
                          {avgGrade > 0 ? avgGrade.toFixed(1) : '--'}
                        </span>
                      </td>
                      <td className="px-8 py-5 text-right">
                         <button 
                           onClick={() => onSelectStudent?.(student.id)}
                           className="text-indigo-600 hover:bg-indigo-600 hover:text-white p-2 rounded-xl transition-all border border-transparent hover:shadow-lg"
                         >
                           <ArrowUpRight className="w-4 h-4" />
                         </button>
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

  const renderClassList = () => (
    <>
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
        <div>
          <h1 className="text-3xl font-black text-slate-900 tracking-tight">Turmas</h1>
          <p className="text-slate-500 font-medium">Gerencie suas salas de aula e horários conforme sua organização.</p>
        </div>
        <div className="flex gap-2">
          <button 
            onClick={() => {
              resetForm();
              setIsEditModalOpen(true);
            }}
            className="flex items-center gap-2 bg-indigo-600 text-white px-5 py-2.5 rounded-xl font-bold hover:bg-indigo-700 transition-all shadow-lg shadow-indigo-100"
          >
            <Plus className="w-4 h-4" />
            Nova Turma
          </button>
        </div>
      </div>

      <div className="relative bg-white p-4 rounded-2xl border border-slate-200 shadow-sm max-w-md">
        <Search className="absolute left-7 top-1/2 -translate-y-1/2 w-4 h-4 text-slate-400" />
        <input 
          type="text" 
          placeholder="Buscar turma por nome..." 
          value={searchTerm}
          onChange={(e) => setSearchTerm(e.target.value)}
          className="w-full pl-10 pr-4 py-2 bg-slate-50 border-none rounded-xl text-sm outline-none ring-1 ring-slate-200 focus:ring-2 focus:ring-indigo-600 transition-all"
        />
      </div>

      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-6">
        {filteredClasses.length > 0 ? filteredClasses.map((c) => {
          const studentCount = getStudentCount(c.id);
          const colorMap: Record<string, string> = {
            indigo: 'bg-indigo-600',
            blue: 'bg-blue-600',
            cyan: 'bg-cyan-600',
            emerald: 'bg-emerald-600',
            amber: 'bg-amber-600',
            orange: 'bg-orange-600',
            rose: 'bg-rose-600',
          };

          return (
            <div 
              key={c.id} 
              onClick={() => setSelectedClassId(c.id)}
              className="bg-white rounded-[2rem] border border-slate-200 overflow-hidden shadow-sm hover:shadow-xl hover:-translate-y-1 transition-all group cursor-pointer relative"
            >
              <div className={`${colorMap[c.color] || 'bg-slate-600'} h-24 p-6 relative`}>
                {/* BOTÕES DE AÇÃO FORÇADOS - Z-INDEX ALTO E STOP PROPAGATION */}
                <div className="absolute top-4 right-4 flex gap-2 z-10">
                  <button 
                    onClick={(e) => { e.stopPropagation(); handleOpenEdit(c); }}
                    className="p-2 bg-white/20 hover:bg-white/40 rounded-lg text-white transition-all backdrop-blur-sm"
                    title="Editar Turma"
                  >
                    <Pencil className="w-4 h-4" />
                  </button>
                  <button 
                    onClick={(e) => { e.stopPropagation(); handleDeleteClass(c.id); }}
                    className="p-2 bg-white/20 hover:bg-red-500/80 rounded-lg text-white transition-all backdrop-blur-sm"
                    title="Excluir Turma"
                  >
                    <Trash2 className="w-4 h-4" />
                  </button>
                </div>
                
                <BookOpen className="w-8 h-8 text-white/50 absolute bottom-4 right-4" />
                <h3 className="text-xl font-bold text-white truncate pr-8">{c.name}</h3>
                <p className="text-white/80 text-xs font-bold uppercase tracking-widest">{c.grade || c.subject}</p>
              </div>
              <div className="p-6 space-y-4">
                <div className="flex justify-between items-center text-sm">
                  <div className="flex items-center gap-2 text-slate-500 font-medium">
                    <Users className="w-4 h-4" />
                    {studentCount} Alunos
                  </div>
                  <div className="flex items-center gap-2 text-slate-500 font-medium capitalize">
                    <Clock className="w-4 h-4" />
                    {c.period}
                  </div>
                </div>
                
                <div className="h-px bg-slate-100"></div>
                
                <div className="flex items-center justify-between">
                  <span className="text-[10px] font-black uppercase text-slate-400">{c.school_year} • {c.school_name}</span>
                  <div className="text-indigo-600 font-black text-xs flex items-center gap-1 group-hover:gap-2 transition-all">
                    Ver Detalhes <ChevronRight className="w-3 h-3" />
                  </div>
                </div>
              </div>
            </div>
          );
        }) : (
          <div className="col-span-full py-20 text-center bg-white rounded-[2rem] border border-dashed border-slate-200">
            <div className="max-w-xs mx-auto space-y-4">
              <div className="w-16 h-16 bg-slate-50 rounded-full flex items-center justify-center mx-auto">
                <School className="w-8 h-8 text-slate-300" />
              </div>
              <h3 className="text-lg font-bold text-slate-800">Nenhuma turma encontrada</h3>
              <button 
                onClick={() => {
                  resetForm();
                  setIsEditModalOpen(true);
                }}
                className="bg-indigo-50 text-indigo-600 px-6 py-2 rounded-xl font-bold hover:bg-indigo-100 transition-all text-sm"
              >
                Criar Primeira Turma
              </button>
            </div>
          </div>
        )}
      </div>
    </>
  );

  return (
    <div className="space-y-6 animate-in fade-in duration-500 pb-20">
      {selectedClassId ? renderClassDetails() : renderClassList()}

      {/* MODAL DE EDIÇÃO E CRIAÇÃO */}
      {isEditModalOpen && (
        <div className="fixed inset-0 bg-slate-900/60 backdrop-blur-sm z-[100] flex items-center justify-center p-4">
          <div className="bg-white w-full max-w-2xl max-h-[90vh] rounded-[2.5rem] shadow-2xl overflow-hidden animate-in zoom-in-95 duration-300 flex flex-col">
            <div className="p-8 border-b border-slate-100 flex justify-between items-center shrink-0">
              <h3 className="text-2xl font-black text-slate-900">{isEditMode ? 'Editar Turma' : 'Configurar Nova Turma'}</h3>
              <button onClick={() => setIsEditModalOpen(false)} className="p-2 hover:bg-slate-100 rounded-full transition-colors">
                <X className="w-6 h-6 text-slate-400" />
              </button>
            </div>
            
            <div className="p-8 space-y-6 overflow-y-auto custom-scrollbar flex-1">
              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                <div className="space-y-2">
                  <label className="text-xs font-black text-slate-400 uppercase tracking-widest">Nome da Turma *</label>
                  <input 
                    type="text" 
                    value={newClassName}
                    onChange={(e) => setNewClassName(e.target.value)}
                    placeholder="Ex: 9º Ano A" 
                    className="w-full bg-slate-50 border-none rounded-xl p-3 text-sm ring-1 ring-slate-200 focus:ring-2 focus:ring-indigo-600 outline-none" 
                  />
                </div>
                <div className="space-y-2">
                  <label className="text-xs font-black text-slate-400 uppercase tracking-widest">Série/Ano *</label>
                  <input 
                    type="text" 
                    value={newGrade}
                    onChange={(e) => setNewGrade(e.target.value)}
                    placeholder="Ex: 9º Ano" 
                    className="w-full bg-slate-50 border-none rounded-xl p-3 text-sm ring-1 ring-slate-200 focus:ring-2 focus:ring-indigo-600 outline-none" 
                  />
                </div>
              </div>

              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                <div className="space-y-2">
                  <label className="text-xs font-black text-slate-400 uppercase tracking-widest">Disciplina *</label>
                  <input 
                    type="text" 
                    value={newSubject}
                    onChange={(e) => setNewSubject(e.target.value)}
                    placeholder="Ex: Matemática" 
                    className="w-full bg-slate-50 border-none rounded-xl p-3 text-sm ring-1 ring-slate-200 focus:ring-2 focus:ring-indigo-600 outline-none" 
                  />
                </div>
                <div className="space-y-2">
                  <label className="text-xs font-black text-slate-400 uppercase tracking-widest">Período/Turno</label>
                  <select 
                    value={newPeriod}
                    onChange={(e) => setNewPeriod(e.target.value as any)}
                    className="w-full bg-slate-50 border-none rounded-xl p-3 text-sm ring-1 ring-slate-200 focus:ring-2 focus:ring-indigo-600 outline-none" 
                  >
                    <option value="matutino">Matutino</option>
                    <option value="vespertino">Vespertino</option>
                    <option value="noturno">Noturno</option>
                    <option value="integral">Integral</option>
                  </select>
                </div>
              </div>
            </div>

            <div className="p-8 bg-slate-50 flex justify-end gap-3 shrink-0">
              <button 
                onClick={() => setIsEditModalOpen(false)}
                className="px-6 py-3 rounded-xl font-bold text-slate-500 hover:bg-slate-200 transition-all"
              >
                Cancelar
              </button>
              <button 
                onClick={handleSaveClass}
                disabled={isSaving}
                className="px-8 py-3 bg-indigo-600 text-white rounded-xl font-bold hover:bg-indigo-700 shadow-lg transition-all flex items-center gap-2 disabled:opacity-70"
              >
                {isSaving ? (
                  <Loader2 className="w-5 h-5 animate-spin" />
                ) : (
                  <Check className="w-5 h-5" />
                )}
                {isEditMode ? 'Atualizar Turma' : 'Salvar Turma'}
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
};
