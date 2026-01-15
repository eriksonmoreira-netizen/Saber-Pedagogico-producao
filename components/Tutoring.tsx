
import React, { useState, useEffect } from 'react';
import { 
  Plus, 
  Search, 
  Filter, 
  MessageSquare, 
  Edit, 
  Trash2, 
  MoreVertical, 
  Target, 
  Calendar, 
  Users, 
  FileText, 
  CheckCircle, 
  Clock, 
  XCircle, 
  X, 
  Paperclip,
  ChevronRight,
  ArrowUpRight,
  Check
} from 'lucide-react';
import { store } from '../state/store';
import { Tutoring as TutoringType, TutoringGoal } from '../types';

const TUTORING_TYPES = [
  { value: 'tutoria', label: 'Tutoria', icon: MessageSquare, color: 'bg-blue-100 text-blue-800' },
  { value: 'mentoria', label: 'Mentoria', icon: Users, color: 'bg-purple-100 text-purple-800' },
  { value: 'pdi', label: 'PDI', icon: FileText, color: 'bg-emerald-100 text-emerald-800' },
  { value: 'reuniao_responsavel', label: 'Reunião com Responsável', icon: Users, color: 'bg-amber-100 text-amber-800' },
];

const GOAL_STATUS = {
  pendente: { label: 'Pendente', color: 'bg-slate-100 text-slate-800', icon: Clock },
  em_progresso: { label: 'Em Progresso', color: 'bg-blue-100 text-blue-800', icon: Clock },
  concluida: { label: 'Concluída', color: 'bg-emerald-100 text-emerald-800', icon: CheckCircle },
  nao_atingida: { label: 'Não Atingida', color: 'bg-red-100 text-red-800', icon: XCircle },
};

export const TutoringModule: React.FC = () => {
  const [isDialogOpen, setIsDialogOpen] = useState(false);
  const [editingTutoring, setEditingTutoring] = useState<TutoringType | null>(null);
  const [searchTerm, setSearchTerm] = useState('');
  const [selectedClassId, setSelectedClassId] = useState('all');
  const [selectedType, setSelectedType] = useState('all');
  const [activeTab, setActiveTab] = useState<'details' | 'goals' | 'pdi'>('details');

  const [classes, setClasses] = useState(store.classes);
  const [students, setStudents] = useState(store.students);
  const [tutorings, setTutorings] = useState(store.tutorings);

  const [formData, setFormData] = useState<Omit<TutoringType, 'id'>>({
    student_id: '',
    class_id: '',
    date: new Date().toISOString().split('T')[0],
    type: 'tutoria',
    summary: '',
    goals: [],
    next_steps: '',
    pdi_content: {
      objectives: '',
      strategies: '',
      resources: '',
      evaluation_criteria: '',
      timeline: '',
    },
    follow_up_date: '',
    attachments: [],
  });

  useEffect(() => {
    return store.subscribe(() => {
      setClasses(store.classes);
      setStudents(store.students);
      setTutorings(store.tutorings);
    });
  }, []);

  const handleOpenDialog = (tutoring: TutoringType | null = null) => {
    if (tutoring) {
      setEditingTutoring(tutoring);
      setFormData({
        student_id: tutoring.student_id,
        class_id: tutoring.class_id,
        date: tutoring.date,
        type: tutoring.type,
        summary: tutoring.summary,
        goals: tutoring.goals || [],
        next_steps: tutoring.next_steps,
        pdi_content: tutoring.pdi_content || {
          objectives: '',
          strategies: '',
          resources: '',
          evaluation_criteria: '',
          timeline: '',
        },
        follow_up_date: tutoring.follow_up_date || '',
        attachments: tutoring.attachments || [],
      });
    } else {
      setEditingTutoring(null);
      setFormData({
        student_id: '',
        class_id: selectedClassId !== 'all' ? selectedClassId : '',
        date: new Date().toISOString().split('T')[0],
        type: 'tutoria',
        summary: '',
        goals: [],
        next_steps: '',
        pdi_content: {
          objectives: '',
          strategies: '',
          resources: '',
          evaluation_criteria: '',
          timeline: '',
        },
        follow_up_date: '',
        attachments: [],
      });
    }
    setActiveTab('details');
    setIsDialogOpen(true);
  };

  const handleCloseDialog = () => {
    setIsDialogOpen(false);
    setEditingTutoring(null);
  };

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    const dataToSave: TutoringType = {
      ...formData,
      id: editingTutoring ? editingTutoring.id : `tut-${Date.now()}`
    };

    store.saveTutoring(dataToSave);
    handleCloseDialog();
  };

  const addGoal = () => {
    setFormData({
      ...formData,
      goals: [
        ...formData.goals,
        { description: '', deadline: '', status: 'pendente' }
      ]
    });
  };

  const updateGoal = (index: number, field: keyof TutoringGoal, value: any) => {
    const newGoals = [...formData.goals];
    newGoals[index] = { ...newGoals[index], [field]: value };
    setFormData({ ...formData, goals: newGoals });
  };

  const removeGoal = (index: number) => {
    setFormData({
      ...formData,
      goals: formData.goals.filter((_, i) => i !== index)
    });
  };

  const filteredTutorings = tutorings.filter(t => {
    const student = students.find(s => s.id === t.student_id);
    const matchesSearch = student?.name?.toLowerCase().includes(searchTerm.toLowerCase()) ||
      t.summary?.toLowerCase().includes(searchTerm.toLowerCase());
    const matchesClass = selectedClassId === 'all' || t.class_id === selectedClassId;
    const matchesType = selectedType === 'all' || t.type === selectedType;
    return matchesSearch && matchesClass && matchesType;
  });

  const getStudentName = (id: string) => students.find(s => s.id === id)?.name || 'Aluno';
  const getClassName = (id: string) => classes.find(c => c.id === id)?.name || 'Turma';
  const getTypeConfig = (type: string) => TUTORING_TYPES.find(t => t.value === type) || TUTORING_TYPES[0];

  return (
    <div className="space-y-6 animate-in fade-in duration-500 pb-20">
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
        <div>
          <h1 className="text-3xl font-black text-slate-900 tracking-tight">Tutorias e Mentorias</h1>
          <p className="text-slate-500 font-medium">Acompanhe conversas individuais e PDIs estruturados.</p>
        </div>
        <button 
          onClick={() => handleOpenDialog()}
          className="bg-indigo-600 text-white px-6 py-2.5 rounded-xl font-bold hover:bg-indigo-700 shadow-lg shadow-indigo-100 flex items-center gap-2 active:scale-95"
        >
          <Plus className="w-5 h-5" /> Nova Sessão
        </button>
      </div>

      <div className="flex flex-col sm:flex-row gap-4 bg-white p-4 rounded-2xl border border-slate-200 shadow-sm">
        <div className="relative flex-1">
          <Search className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-slate-400" />
          <input
            placeholder="Buscar por aluno..."
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
          <option value="all">Todas as turmas</option>
          {classes.map((c) => (
            <option key={c.id} value={c.id}>{c.name}</option>
          ))}
        </select>
        <select 
          value={selectedType} 
          onChange={(e) => setSelectedType(e.target.value)}
          className="bg-slate-50 border-none rounded-xl text-sm px-4 py-2.5 outline-none ring-1 ring-slate-200 focus:ring-2 focus:ring-indigo-600"
        >
          <option value="all">Todos os tipos</option>
          {TUTORING_TYPES.map((t) => (
            <option key={t.value} value={t.value}>{t.label}</option>
          ))}
        </select>
      </div>

      {filteredTutorings.length === 0 ? (
        <div className="bg-white p-20 rounded-[2.5rem] border border-dashed border-slate-200 text-center">
          <MessageSquare className="w-16 h-16 mx-auto text-slate-200 mb-4" />
          <h3 className="text-lg font-bold text-slate-800">Nenhuma sessão registrada</h3>
          <p className="text-slate-500 mb-6">Registre tutorias, mentorias e PDIs para acompanhar o desenvolvimento.</p>
          <button onClick={() => handleOpenDialog()} className="text-indigo-600 font-bold hover:underline">Registrar Agora</button>
        </div>
      ) : (
        <div className="grid grid-cols-1 gap-4">
          {filteredTutorings.map((tutoring) => {
            const typeConfig = getTypeConfig(tutoring.type);
            const TypeIcon = typeConfig.icon;
            const goalsCompleted = tutoring.goals?.filter(g => g.status === 'concluida').length || 0;
            const totalGoals = tutoring.goals?.length || 0;

            return (
              <div key={tutoring.id} className="bg-white p-6 rounded-[2rem] border border-slate-200 hover:shadow-xl hover:border-indigo-200 transition-all group flex flex-col md:flex-row md:items-center justify-between gap-6">
                <div className="flex items-start gap-5 flex-1 min-w-0">
                  <div className={`p-4 rounded-2xl ${typeConfig.color} shrink-0`}>
                    <TypeIcon className="w-6 h-6" />
                  </div>
                  <div className="min-w-0 flex-1">
                    <div className="flex items-center gap-3 mb-2 flex-wrap">
                      <h4 className="font-bold text-slate-900 text-lg truncate">{getStudentName(tutoring.student_id)}</h4>
                      <span className="px-2.5 py-1 bg-slate-100 text-slate-500 rounded-lg text-[10px] font-black uppercase tracking-widest">{getClassName(tutoring.class_id)}</span>
                      <span className={`px-2.5 py-1 rounded-lg text-[10px] font-black uppercase tracking-widest ${typeConfig.color}`}>{typeConfig.label}</span>
                    </div>
                    
                    <p className="text-slate-500 text-sm line-clamp-2 mb-4 font-medium leading-relaxed">{tutoring.summary}</p>
                    
                    <div className="flex items-center gap-6 text-[10px] font-black uppercase text-slate-400">
                      <span className="flex items-center gap-1.5"><Calendar className="w-3.5 h-3.5" /> {tutoring.date}</span>
                      {totalGoals > 0 && (
                        <span className="flex items-center gap-2">
                          <Target className="w-3.5 h-3.5" /> {goalsCompleted}/{totalGoals} Metas
                          <div className="w-20 bg-slate-100 h-1.5 rounded-full overflow-hidden">
                            <div className="bg-emerald-500 h-full" style={{ width: `${(goalsCompleted / totalGoals) * 100}%` }}></div>
                          </div>
                        </span>
                      )}
                    </div>
                  </div>
                </div>

                <div className="flex items-center gap-2">
                  <button onClick={() => handleOpenDialog(tutoring)} className="p-2.5 text-slate-400 hover:text-indigo-600 hover:bg-indigo-50 rounded-xl transition-all">
                    <Edit className="w-5 h-5" />
                  </button>
                  <button onClick={() => store.setAllData({...store, tutorings: store.tutorings.filter(t => t.id !== tutoring.id)})} className="p-2.5 text-slate-400 hover:text-red-500 hover:bg-red-50 rounded-xl transition-all">
                    <Trash2 className="w-5 h-5" />
                  </button>
                </div>
              </div>
            );
          })}
        </div>
      )}

      {isDialogOpen && (
        <div className="fixed inset-0 bg-slate-900/60 backdrop-blur-sm z-[100] flex items-center justify-center p-4">
          <div className="bg-white w-full max-w-3xl max-h-[90vh] rounded-[2.5rem] shadow-2xl overflow-hidden animate-in zoom-in-95 duration-300 flex flex-col">
            <div className="p-8 border-b border-slate-100 flex justify-between items-center shrink-0">
              <h3 className="text-2xl font-black text-slate-900">{editingTutoring ? 'Editar Sessão' : 'Nova Sessão'}</h3>
              <button onClick={handleCloseDialog} className="p-2 hover:bg-slate-100 rounded-full transition-colors"><X className="w-6 h-6 text-slate-400" /></button>
            </div>

            <div className="p-8 overflow-y-auto custom-scrollbar flex-1">
              <div className="flex gap-2 mb-8 bg-slate-50 p-1 rounded-2xl border border-slate-100">
                <button onClick={() => setActiveTab('details')} className={`flex-1 py-3 px-4 rounded-xl text-xs font-black uppercase transition-all ${activeTab === 'details' ? 'bg-white text-indigo-600 shadow-sm ring-1 ring-slate-200' : 'text-slate-400 hover:text-slate-600'}`}>Detalhes</button>
                <button onClick={() => setActiveTab('goals')} className={`flex-1 py-3 px-4 rounded-xl text-xs font-black uppercase transition-all ${activeTab === 'goals' ? 'bg-white text-indigo-600 shadow-sm ring-1 ring-slate-200' : 'text-slate-400 hover:text-slate-600'}`}>Metas</button>
                {formData.type === 'pdi' && (
                  <button onClick={() => setActiveTab('pdi')} className={`flex-1 py-3 px-4 rounded-xl text-xs font-black uppercase transition-all ${activeTab === 'pdi' ? 'bg-white text-indigo-600 shadow-sm ring-1 ring-slate-200' : 'text-slate-400 hover:text-slate-600'}`}>PDI</button>
                )}
              </div>

              {activeTab === 'details' && (
                <div className="space-y-6">
                  <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                    <div className="space-y-1.5">
                      <label className="text-[10px] font-black text-slate-400 uppercase tracking-widest">Aluno Alvo *</label>
                      <select 
                        value={formData.student_id} 
                        onChange={(e) => {
                          const s = students.find(x => x.id === e.target.value);
                          setFormData({...formData, student_id: e.target.value, class_id: s?.class_id || ''});
                        }}
                        className="w-full bg-slate-50 border-none rounded-xl p-3.5 text-sm ring-1 ring-slate-200 focus:ring-2 focus:ring-indigo-600 outline-none"
                      >
                        <option value="">Selecione...</option>
                        {students.map(s => <option key={s.id} value={s.id}>{s.name} ({getClassName(s.class_id)})</option>)}
                      </select>
                    </div>
                    <div className="space-y-1.5">
                      <label className="text-[10px] font-black text-slate-400 uppercase tracking-widest">Tipo de Sessão *</label>
                      <select 
                        value={formData.type} 
                        onChange={(e) => setFormData({...formData, type: e.target.value as any})}
                        className="w-full bg-slate-50 border-none rounded-xl p-3.5 text-sm ring-1 ring-slate-200 focus:ring-2 focus:ring-indigo-600 outline-none"
                      >
                        {TUTORING_TYPES.map(t => <option key={t.value} value={t.value}>{t.label}</option>)}
                      </select>
                    </div>
                  </div>

                  <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                    <div className="space-y-1.5">
                      <label className="text-[10px] font-black text-slate-400 uppercase tracking-widest">Data da Sessão *</label>
                      <input type="date" value={formData.date} onChange={(e) => setFormData({...formData, date: e.target.value})} className="w-full bg-slate-50 border-none rounded-xl p-3.5 text-sm ring-1 ring-slate-200 focus:ring-2 focus:ring-indigo-600" />
                    </div>
                    <div className="space-y-1.5">
                      <label className="text-[10px] font-black text-slate-400 uppercase tracking-widest">Próximo Contato</label>
                      <input type="date" value={formData.follow_up_date} onChange={(e) => setFormData({...formData, follow_up_date: e.target.value})} className="w-full bg-slate-50 border-none rounded-xl p-3.5 text-sm ring-1 ring-slate-200 focus:ring-2 focus:ring-indigo-600" />
                    </div>
                  </div>

                  <div className="space-y-1.5">
                    <label className="text-[10px] font-black text-slate-400 uppercase tracking-widest">Resumo da Conversa *</label>
                    <textarea rows={4} value={formData.summary} onChange={(e) => setFormData({...formData, summary: e.target.value})} placeholder="O que foi discutido?" className="w-full bg-slate-50 border-none rounded-xl p-3.5 text-sm ring-1 ring-slate-200 focus:ring-2 focus:ring-indigo-600" />
                  </div>
                </div>
              )}

              {activeTab === 'goals' && (
                <div className="space-y-6">
                  <div className="flex justify-between items-center">
                    <h4 className="font-bold text-slate-800">Metas Acordadas</h4>
                    <button type="button" onClick={addGoal} className="text-[10px] font-black text-indigo-600 uppercase flex items-center gap-1.5 hover:underline"><Plus className="w-3.5 h-3.5" /> Adicionar Meta</button>
                  </div>
                  
                  {formData.goals.length === 0 ? (
                    <div className="text-center py-10 bg-slate-50 rounded-3xl border border-dashed border-slate-200">
                      <p className="text-xs text-slate-400 font-medium">Nenhuma meta definida para esta sessão.</p>
                    </div>
                  ) : (
                    <div className="space-y-3">
                      {formData.goals.map((goal, idx) => (
                        <div key={idx} className="p-4 bg-white border border-slate-200 rounded-2xl space-y-3 shadow-sm">
                          <div className="flex gap-3">
                            <input value={goal.description} onChange={(e) => updateGoal(idx, 'description', e.target.value)} placeholder="Descrição da meta..." className="flex-1 bg-slate-50 border-none rounded-xl p-2.5 text-sm ring-1 ring-slate-100 focus:ring-1 focus:ring-indigo-600 outline-none" />
                            <button onClick={() => removeGoal(idx)} className="p-2.5 text-red-400 hover:bg-red-50 rounded-xl transition-all"><Trash2 className="w-4 h-4" /></button>
                          </div>
                          <div className="grid grid-cols-2 gap-3">
                            <input type="date" value={goal.deadline} onChange={(e) => updateGoal(idx, 'deadline', e.target.value)} className="bg-slate-50 border-none rounded-xl p-2.5 text-xs ring-1 ring-slate-100" />
                            <select value={goal.status} onChange={(e) => updateGoal(idx, 'status', e.target.value)} className="bg-slate-50 border-none rounded-xl p-2.5 text-xs ring-1 ring-slate-100">
                              {Object.entries(GOAL_STATUS).map(([key, config]) => <option key={key} value={key}>{config.label}</option>)}
                            </select>
                          </div>
                        </div>
                      ))}
                    </div>
                  )}
                </div>
              )}

              {activeTab === 'pdi' && (
                <div className="space-y-6">
                  <div className="space-y-1.5">
                    <label className="text-[10px] font-black text-slate-400 uppercase tracking-widest">Objetivos do PDI</label>
                    <textarea rows={3} value={formData.pdi_content?.objectives} onChange={(e) => setFormData({...formData, pdi_content: {...formData.pdi_content!, objectives: e.target.value}})} className="w-full bg-slate-50 border-none rounded-xl p-3 text-sm ring-1 ring-slate-200" />
                  </div>
                  <div className="space-y-1.5">
                    <label className="text-[10px] font-black text-slate-400 uppercase tracking-widest">Estratégias Pedagógicas</label>
                    <textarea rows={3} value={formData.pdi_content?.strategies} onChange={(e) => setFormData({...formData, pdi_content: {...formData.pdi_content!, strategies: e.target.value}})} className="w-full bg-slate-50 border-none rounded-xl p-3 text-sm ring-1 ring-slate-200" />
                  </div>
                  <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                    <div className="space-y-1.5">
                      <label className="text-[10px] font-black text-slate-400 uppercase tracking-widest">Recursos Necessários</label>
                      <input type="text" value={formData.pdi_content?.resources} onChange={(e) => setFormData({...formData, pdi_content: {...formData.pdi_content!, resources: e.target.value}})} className="w-full bg-slate-50 border-none rounded-xl p-3 text-sm ring-1 ring-slate-200" />
                    </div>
                    <div className="space-y-1.5">
                      <label className="text-[10px] font-black text-slate-400 uppercase tracking-widest">Critérios de Avaliação</label>
                      <input type="text" value={formData.pdi_content?.evaluation_criteria} onChange={(e) => setFormData({...formData, pdi_content: {...formData.pdi_content!, evaluation_criteria: e.target.value}})} className="w-full bg-slate-50 border-none rounded-xl p-3 text-sm ring-1 ring-slate-200" />
                    </div>
                  </div>
                </div>
              )}
            </div>

            <div className="p-8 border-t border-slate-100 flex justify-end gap-3 shrink-0">
              <button onClick={handleCloseDialog} className="px-6 py-3 rounded-xl font-bold text-slate-500 hover:bg-slate-100 transition-all">Cancelar</button>
              <button onClick={handleSubmit} className="px-8 py-3 bg-indigo-600 text-white rounded-xl font-bold hover:bg-indigo-700 shadow-lg shadow-indigo-100 transition-all flex items-center gap-2">
                <Check className="w-5 h-5" /> {editingTutoring ? 'Salvar Alterações' : 'Registrar Sessão'}
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
};
