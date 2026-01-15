
import React, { useState, useEffect, useRef, useMemo } from 'react';
import { 
  ChevronLeft, 
  Mail, 
  Phone, 
  Calendar, 
  TrendingUp, 
  AlertCircle, 
  Sparkles,
  FileText,
  UserCheck,
  Brain,
  Camera,
  Printer,
  Download,
  Save,
  Check,
  X,
  History,
  MessageSquare,
  Activity,
  Award,
  Trophy,
  Zap,
  BarChart,
  ArrowRight,
  Target
} from 'lucide-react';
import { ResponsiveContainer, LineChart, Line, XAxis, YAxis, CartesianGrid, Tooltip } from 'recharts';
import { store } from '../state/store';
import { analyzeStudentRisk } from '../services/gemini';
import { AIInsight, Grade, Attendance, Occurrence, Tutoring, Student } from '../types';

type ProfileTab = 'overview' | 'grades' | 'attendance' | 'behavior' | 'tutoring';

export const StudentProfile: React.FC<{ studentId: string; onBack: () => void }> = ({ studentId, onBack }) => {
  const [activeTab, setActiveTab] = useState<ProfileTab>('overview');
  const [student, setStudent] = useState(store.students.find(s => s.id === studentId));
  const [studentClass, setStudentClass] = useState(store.classes.find(c => c.id === student?.class_id));
  const [studentGrades, setStudentGrades] = useState(store.grades.filter(g => g.student_id === studentId));
  const [studentAttendances, setStudentAttendances] = useState(store.attendances.filter(a => a.student_id === studentId));
  const [studentTutorings, setStudentTutorings] = useState(store.tutorings.filter(t => t.student_id === studentId));
  const [studentOccurrences, setStudentOccurrences] = useState(store.occurrences.filter(o => o.student_id === studentId));
  
  // Estados para visualização de relatórios detalhados
  const [selectedOccurrence, setSelectedOccurrence] = useState<Occurrence | null>(null);
  const [selectedTutoring, setSelectedTutoring] = useState<Tutoring | null>(null);

  const [insight, setInsight] = useState<AIInsight | null>(null);
  const [loadingAI, setLoadingAI] = useState(false);
  const fileInputRef = useRef<HTMLInputElement>(null);

  useEffect(() => {
    const unsub = store.subscribe(() => {
      const s = store.students.find(x => x.id === studentId);
      setStudent(s);
      setStudentGrades(store.grades.filter(g => g.student_id === studentId));
      setStudentAttendances(store.attendances.filter(a => a.student_id === studentId));
      setStudentTutorings(store.tutorings.filter(t => t.student_id === studentId));
      setStudentOccurrences(store.occurrences.filter(o => o.student_id === studentId));
    });

    if (student) {
      setLoadingAI(true);
      analyzeStudentRisk(student, studentGrades, studentAttendances).then(res => {
        setInsight(res);
        setLoadingAI(false);
      });
    }

    return unsub;
  }, [studentId]);

  const merit = useMemo(() => {
    if (!student || !studentClass) return { isSpotlight: false, isImprovement: false };
    const classStudents = store.students.filter(s => s.class_id === studentClass.id);
    let bestScore = -1;
    let bestStudentId = '';
    classStudents.forEach(s => {
      const sGrades = store.grades.filter(g => g.student_id === s.id);
      const avg = sGrades.length > 0 ? sGrades.reduce((a, b) => a + b.score, 0) / sGrades.length : 0;
      const sAtts = store.attendances.filter(a => a.student_id === s.id);
      const attRate = sAtts.length > 0 ? sAtts.filter(a => a.status === 'presente').length / sAtts.length : 1;
      const score = (avg * 10) + (attRate * 100);
      if (score > bestScore) {
        bestScore = score;
        bestStudentId = s.id;
      }
    });
    let bestImpr = 0;
    let bestImprId = '';
    classStudents.forEach(s => {
      const sGrades = store.grades.filter(g => g.student_id === s.id).sort((a,b) => a.bimester - b.bimester);
      if (sGrades.length >= 2) {
        const impr = sGrades[sGrades.length-1].score - sGrades[sGrades.length-2].score;
        if (impr > bestImpr) {
          bestImpr = impr;
          bestImprId = s.id;
        }
      }
    });
    return { isSpotlight: bestStudentId === student.id, isImprovement: bestImprId === student.id && bestImpr > 0 };
  }, [student, studentClass]);

  if (!student) return null;

  const evolutionData = studentGrades.sort((a, b) => a.bimester - b.bimester).map(g => ({ bimestre: `${g.bimester}º Bim`, nota: g.score }));
  const attendanceRate = studentAttendances.length > 0 ? (studentAttendances.filter(a => a.status === 'presente').length / studentAttendances.length) * 100 : 100;
  const avgGrade = studentGrades.length > 0 ? studentGrades.reduce((acc, g) => acc + g.score, 0) / studentGrades.length : 0;

  const handlePhotoUpload = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (file) {
      const reader = new FileReader();
      reader.onloadend = () => store.updateStudent(student.id, { photo_url: reader.result as string });
      reader.readAsDataURL(file);
    }
  };

  const handleSaveGrade = (bim: number, score: string) => {
    const val = parseFloat(score);
    if (isNaN(val) || val < 0 || val > 10) return;
    store.saveGrades([{
      id: `grade-${student.id}-${bim}-${Date.now()}`,
      student_id: student.id,
      class_id: student.class_id,
      evaluation_name: 'Média Bimestral',
      evaluation_type: 'EXAM',
      score: val,
      max_score: 10,
      weight: 1,
      bimester: bim as any,
      date: new Date().toISOString().split('T')[0]
    }]);
  };

  const handleStatusChange = (attId: string, status: Attendance['status']) => {
    const att = studentAttendances.find(a => a.id === attId);
    if (att) store.saveAttendances([{ ...att, status }]);
  };

  return (
    <div className="space-y-6 animate-in slide-in-from-right-4 duration-500 pb-20 print:p-0">
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 print:hidden">
        <button onClick={onBack} className="flex items-center gap-2 text-slate-500 hover:text-indigo-600 transition-colors font-bold text-sm">
          <ChevronLeft className="w-5 h-5" /> Voltar para Alunos
        </button>
        <div className="flex gap-2">
          <button onClick={() => window.print()} className="flex items-center gap-2 bg-white border border-slate-200 text-slate-700 px-4 py-2.5 rounded-xl font-bold hover:bg-slate-50 transition-all shadow-sm">
            <Printer className="w-4 h-4" /> Imprimir Boletim
          </button>
          <button className="flex items-center gap-2 bg-indigo-600 text-white px-5 py-2.5 rounded-xl font-bold hover:bg-indigo-700 transition-all shadow-lg shadow-indigo-100">
            <Download className="w-4 h-4" /> Relatório Completo
          </button>
        </div>
      </div>

      {/* Profile Header */}
      <div className="bg-white rounded-[2.5rem] border border-slate-200 shadow-sm p-8 relative overflow-hidden print:border-none print:shadow-none print:p-4">
        <div className="flex flex-col md:flex-row gap-8 items-center md:items-start relative z-10">
          <div className="relative group shrink-0">
            <div className="w-32 h-32 rounded-[2rem] overflow-hidden ring-4 ring-slate-50 bg-indigo-50 flex items-center justify-center text-indigo-600 text-4xl font-black shadow-inner">
              {student.photo_url ? <img src={student.photo_url} alt={student.name} className="w-full h-full object-cover" /> : student.name.substring(0, 2)}
            </div>
            <button onClick={() => fileInputRef.current?.click()} className="absolute -bottom-2 -right-2 p-2.5 bg-indigo-600 text-white rounded-xl shadow-lg hover:scale-110 transition-transform print:hidden">
              <Camera className="w-4 h-4" />
            </button>
            <input type="file" ref={fileInputRef} onChange={handlePhotoUpload} className="hidden" accept="image/*" />
          </div>
          <div className="flex-1 space-y-4 text-center md:text-left min-w-0">
            <div>
              <div className="flex items-center justify-center md:justify-start gap-3 mb-1">
                <h2 className="text-3xl font-black text-slate-900 truncate tracking-tight">{student.name}</h2>
                <Award className={`w-6 h-6 ${avgGrade >= 8 ? 'text-amber-400' : 'text-slate-200'}`} />
              </div>
              <p className="text-slate-500 font-bold uppercase text-xs tracking-widest">
                RA: {student.registration_number} • {studentClass?.name || 'Sem Turma'} • {student.status === 'ACTIVE' ? 'Ativo' : 'Inativo'}
              </p>
            </div>
            <div className="flex flex-wrap justify-center md:justify-start gap-2">
              {merit.isSpotlight && <span className="px-3 py-1.5 bg-amber-50 text-amber-600 text-[10px] font-black uppercase rounded-xl flex items-center gap-1.5 border border-amber-100 shadow-sm"><Trophy className="w-3.5 h-3.5" /> Aluno Destaque</span>}
              {merit.isImprovement && <span className="px-3 py-1.5 bg-emerald-50 text-emerald-600 text-[10px] font-black uppercase rounded-xl flex items-center gap-1.5 border border-emerald-100 shadow-sm"><Zap className="w-3.5 h-3.5 fill-current" /> Aluno Superação</span>}
              {student.tags.map(tag => <span key={tag} className="px-2.5 py-1.5 bg-slate-50 text-slate-500 text-[10px] font-black uppercase rounded-xl border border-slate-100">{tag}</span>)}
            </div>
            <div className="flex flex-wrap justify-center md:justify-start gap-4 text-sm font-medium text-slate-600">
               <div className="flex items-center gap-2 bg-slate-50 px-3 py-1.5 rounded-xl"><UserCheck className="w-4 h-4 text-indigo-500" /> {student.guardian_name}</div>
               <div className="flex items-center gap-2 bg-slate-50 px-3 py-1.5 rounded-xl"><Mail className="w-4 h-4 text-indigo-500" /> {student.guardian_email}</div>
               <div className="flex items-center gap-2 bg-slate-50 px-3 py-1.5 rounded-xl"><Phone className="w-4 h-4 text-indigo-500" /> {student.guardian_phone}</div>
            </div>
          </div>
          <div className="flex gap-4 print:hidden">
            <div className="text-center p-4 bg-emerald-50 rounded-2xl border border-emerald-100 min-w-[100px]">
              <p className="text-[9px] font-black text-emerald-600 uppercase mb-1">Frequência</p>
              <p className="text-2xl font-black text-emerald-700">{attendanceRate.toFixed(0)}%</p>
            </div>
            <div className="text-center p-4 bg-indigo-50 rounded-2xl border border-indigo-100 min-w-[100px]">
              <p className="text-[9px] font-black text-indigo-600 uppercase mb-1">Média</p>
              <p className="text-2xl font-black text-indigo-700">{avgGrade.toFixed(1)}</p>
            </div>
          </div>
        </div>
      </div>

      <div className="flex gap-2 p-1 bg-white border border-slate-200 rounded-2xl shadow-sm print:hidden overflow-x-auto">
        {[
          { id: 'overview', label: 'Visão Geral', icon: <Activity className="w-4 h-4" /> },
          { id: 'grades', label: 'Boletim', icon: <BarChart className="w-4 h-4" /> },
          { id: 'attendance', label: 'Frequência', icon: <History className="w-4 h-4" /> },
          { id: 'behavior', label: 'Ocorrências', icon: <AlertCircle className="w-4 h-4" /> },
          { id: 'tutoring', label: 'Tutorias', icon: <MessageSquare className="w-4 h-4" /> },
        ].map(tab => (
          <button key={tab.id} onClick={() => setActiveTab(tab.id as ProfileTab)} className={`flex items-center gap-2 px-6 py-3 rounded-xl text-xs font-black uppercase transition-all shrink-0 ${activeTab === tab.id ? 'bg-indigo-600 text-white shadow-lg' : 'text-slate-400 hover:bg-slate-50'}`}>
            {tab.icon} {tab.label}
          </button>
        ))}
      </div>

      <div className="space-y-6">
        {activeTab === 'overview' && (
          <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
            <div className="lg:col-span-2 space-y-6">
              <div className="bg-white p-8 rounded-[2rem] border border-slate-200 shadow-sm">
                <h4 className="font-bold text-slate-800 mb-8 flex items-center gap-2">
                  <TrendingUp className="w-5 h-5 text-indigo-600" /> Evolução Acadêmica
                </h4>
                <div className="h-64">
                  <ResponsiveContainer width="100%" height="100%">
                    <LineChart data={evolutionData}>
                      <CartesianGrid strokeDasharray="3 3" vertical={false} stroke="#f1f5f9" />
                      <XAxis dataKey="bimestre" axisLine={false} tickLine={false} tick={{fill: '#94a3b8', fontSize: 10, fontWeight: 'bold'}} />
                      <YAxis axisLine={false} tickLine={false} tick={{fill: '#94a3b8', fontSize: 10, fontWeight: 'bold'}} domain={[0, 10]} />
                      <Tooltip contentStyle={{borderRadius: '16px', border: 'none', boxShadow: '0 10px 15px -3px rgb(0 0 0 / 0.1)'}} />
                      <Line type="monotone" dataKey="nota" stroke="#6366f1" strokeWidth={4} dot={{fill: '#6366f1', r: 6, strokeWidth: 3, stroke: '#fff'}} />
                    </LineChart>
                  </ResponsiveContainer>
                </div>
              </div>
              <div className="bg-white p-8 rounded-[2rem] border border-slate-200 shadow-sm">
                <h4 className="font-bold text-slate-800 mb-6 flex items-center gap-2">
                  <FileText className="w-5 h-5 text-indigo-600" /> Resumo do Boletim
                </h4>
                <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
                  {[1, 2, 3, 4].map(bim => {
                    const grade = studentGrades.find(g => g.bimester === bim);
                    return (
                      <div key={bim} className="p-4 bg-slate-50 rounded-2xl border border-slate-100 text-center">
                        <p className="text-[10px] font-black text-slate-400 uppercase mb-1">{bim}º BIM</p>
                        <p className={`text-xl font-black ${!grade ? 'text-slate-300' : grade.score >= 6 ? 'text-emerald-600' : 'text-red-500'}`}>
                          {grade?.score.toFixed(1) || '--'}
                        </p>
                      </div>
                    );
                  })}
                </div>
              </div>
            </div>
            <div className="space-y-6">
              <div className="bg-indigo-600 rounded-[2.5rem] p-8 text-white shadow-xl relative overflow-hidden">
                 <Sparkles className="absolute top-0 right-0 w-32 h-32 text-white/5 -mr-8 -mt-8" />
                 <div className="relative z-10">
                   <div className="flex items-center gap-2 mb-6">
                     <Brain className="w-6 h-6" />
                     <h4 className="font-bold text-xl">Análise Gemini</h4>
                   </div>
                   {loadingAI ? (
                     <div className="space-y-4 animate-pulse">
                       <div className="h-4 bg-white/20 rounded w-full"></div>
                       <div className="h-4 bg-white/20 rounded w-3/4"></div>
                     </div>
                   ) : insight ? (
                     <div className="space-y-6">
                       <span className={`px-3 py-1 rounded-full text-[10px] font-black uppercase tracking-widest ${insight.risk_level === 'HIGH' ? 'bg-red-500' : insight.risk_level === 'MEDIUM' ? 'bg-amber-400 text-slate-900' : 'bg-emerald-400 text-slate-900'}`}>
                         Risco: {insight.risk_level}
                       </span>
                       <ul className="space-y-3">
                         {insight.suggestions.map((s, i) => (
                           <li key={i} className="flex gap-2 text-sm text-indigo-50 font-medium">
                             <div className="w-1.5 h-1.5 rounded-full bg-indigo-300 shrink-0 mt-1.5"></div>
                             {s}
                           </li>
                         ))}
                       </ul>
                       <button className="w-full py-3 bg-white/10 hover:bg-white/20 rounded-xl text-xs font-black uppercase tracking-widest border border-white/10 transition-all flex items-center justify-center gap-2">
                         <Download className="w-4 h-4" /> Salvar e Imprimir
                       </button>
                     </div>
                   ) : <p className="text-sm italic">Dados insuficientes para análise.</p>}
                 </div>
              </div>
            </div>
          </div>
        )}

        {activeTab === 'grades' && (
          <div className="bg-white rounded-[2.5rem] border border-slate-200 shadow-sm overflow-hidden">
            <div className="p-8 border-b border-slate-100 flex justify-between items-center">
               <h4 className="font-bold text-slate-800">Notas Bimestrais</h4>
               <span className="text-[10px] font-black text-slate-400 uppercase tracking-widest">Ano Letivo {studentClass?.school_year}</span>
            </div>
            <table className="w-full text-left">
              <thead className="bg-slate-50 border-b border-slate-200">
                <tr>
                  <th className="px-8 py-4 text-[10px] font-black text-slate-400 uppercase tracking-widest">Bimestre</th>
                  <th className="px-8 py-4 text-[10px] font-black text-slate-400 uppercase tracking-widest text-center">Nota (0-10)</th>
                  <th className="px-8 py-4 text-[10px] font-black text-slate-400 uppercase tracking-widest">Data</th>
                  <th className="px-8 py-4 text-[10px] font-black text-slate-400 uppercase tracking-widest text-right">Salvar</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-slate-100">
                {[1, 2, 3, 4].map(bim => {
                  const grade = studentGrades.find(g => g.bimester === bim);
                  return (
                    <tr key={bim} className="hover:bg-slate-50 transition-colors">
                      <td className="px-8 py-5 text-sm font-bold text-slate-700">{bim}º Bimestre</td>
                      <td className="px-8 py-5">
                        <input type="number" defaultValue={grade?.score || ''} onBlur={(e) => handleSaveGrade(bim, e.target.value)} className="w-20 mx-auto block text-center bg-slate-50 border border-slate-200 rounded-xl py-2 text-sm font-black text-slate-800 focus:ring-2 focus:ring-indigo-600 outline-none transition-all" />
                      </td>
                      <td className="px-8 py-5 text-xs text-slate-400 font-bold">{grade?.date || '--/--/----'}</td>
                      <td className="px-8 py-5 text-right">
                        <button className="p-2 text-slate-400 hover:text-indigo-600 transition-colors"><Save className="w-4 h-4" /></button>
                      </td>
                    </tr>
                  );
                })}
              </tbody>
            </table>
          </div>
        )}
        
        {activeTab === 'attendance' && (
          <div className="bg-white rounded-[2.5rem] border border-slate-200 shadow-sm overflow-hidden">
             <div className="p-8 border-b border-slate-100 flex justify-between items-center">
               <h4 className="font-bold text-slate-800">Registro de Presenças</h4>
            </div>
            <div className="overflow-x-auto">
              <table className="w-full text-left">
                <thead className="bg-slate-50 border-b border-slate-200">
                  <tr>
                    <th className="px-8 py-4 text-[10px] font-black text-slate-400 uppercase tracking-widest">Data</th>
                    <th className="px-8 py-4 text-[10px] font-black text-slate-400 uppercase tracking-widest text-center">Status</th>
                    <th className="px-8 py-4 text-[10px] font-black text-slate-400 uppercase tracking-widest text-right">Ação</th>
                  </tr>
                </thead>
                <tbody className="divide-y divide-slate-100">
                  {studentAttendances.map(att => (
                    <tr key={att.id} className="hover:bg-slate-50 transition-colors">
                      <td className="px-8 py-4 text-sm font-bold text-slate-700">{att.date}</td>
                      <td className="px-8 py-4 text-center">
                        <span className={`px-2.5 py-1 rounded-lg text-[9px] font-black uppercase tracking-widest ${att.status === 'presente' ? 'bg-emerald-50 text-emerald-600' : 'bg-red-50 text-red-600'}`}>
                          {att.status}
                        </span>
                      </td>
                      <td className="px-8 py-4 text-right">
                        <div className="flex justify-end gap-1">
                          <button onClick={() => handleStatusChange(att.id, 'presente')} className="p-1.5 text-emerald-600 hover:bg-emerald-50 rounded-lg"><Check className="w-4 h-4" /></button>
                          <button onClick={() => handleStatusChange(att.id, 'falta')} className="p-1.5 text-red-600 hover:bg-red-50 rounded-lg"><X className="w-4 h-4" /></button>
                        </div>
                      </td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
          </div>
        )}

        {activeTab === 'behavior' && (
          <div className="space-y-4 animate-in fade-in duration-500">
            {studentOccurrences.map(occ => (
              <div 
                key={occ.id} 
                onClick={() => setSelectedOccurrence(occ)}
                className="bg-white p-6 rounded-[2rem] border border-slate-200 shadow-sm flex flex-col md:flex-row gap-6 cursor-pointer hover:border-indigo-300 hover:shadow-md transition-all group"
              >
                <div className={`w-12 h-12 rounded-2xl flex items-center justify-center shrink-0 ${occ.severity === 'HIGH' ? 'bg-red-50 text-red-500' : 'bg-amber-50 text-amber-500'}`}>
                  <AlertCircle className="w-6 h-6" />
                </div>
                <div className="flex-1 space-y-2 min-w-0">
                  <div className="flex justify-between items-center">
                    <h5 className="text-lg font-bold text-slate-900 truncate group-hover:text-indigo-600 transition-colors">{occ.title}</h5>
                    <span className="text-[10px] font-black text-slate-400 uppercase tracking-widest shrink-0">{occ.date}</span>
                  </div>
                  <p className="text-sm text-slate-600 leading-relaxed font-medium line-clamp-2 italic">"{occ.description}"</p>
                  <div className="flex gap-2 pt-2 items-center">
                    <span className="px-2 py-1 bg-slate-100 text-slate-500 text-[9px] font-black uppercase rounded-lg">{occ.type}</span>
                    <span className={`px-2 py-1 text-[9px] font-black uppercase rounded-lg ${occ.severity === 'HIGH' ? 'bg-red-50 text-red-600' : 'bg-amber-50 text-amber-600'}`}>Prioridade {occ.severity}</span>
                    <ArrowRight className="w-3 h-3 text-slate-300 ml-auto group-hover:translate-x-1 group-hover:text-indigo-500 transition-all" />
                  </div>
                </div>
              </div>
            ))}
            {studentOccurrences.length === 0 && (
              <div className="p-20 text-center bg-white rounded-[2rem] border border-dashed border-slate-200">
                 <p className="text-slate-400 font-medium italic">O aluno não possui ocorrências registradas.</p>
              </div>
            )}
          </div>
        )}

        {activeTab === 'tutoring' && (
          <div className="space-y-4 animate-in fade-in duration-500">
            {studentTutorings.map(tut => (
              <div 
                key={tut.id} 
                onClick={() => setSelectedTutoring(tut)}
                className="bg-white p-6 rounded-[2rem] border border-slate-200 shadow-sm flex flex-col gap-6 cursor-pointer hover:border-indigo-300 hover:shadow-md transition-all group"
              >
                <div className="flex justify-between items-start">
                  <div className="flex gap-4 min-w-0">
                    <div className="w-12 h-12 rounded-2xl bg-indigo-50 text-indigo-600 flex items-center justify-center shrink-0">
                      <MessageSquare className="w-6 h-6" />
                    </div>
                    <div className="min-w-0">
                      <h5 className="text-lg font-bold text-slate-900 capitalize truncate group-hover:text-indigo-600 transition-colors">{tut.type}</h5>
                      <p className="text-xs font-bold text-indigo-400 uppercase tracking-widest">{tut.date}</p>
                    </div>
                  </div>
                  <div className="flex items-center gap-3">
                    {tut.follow_up_date && (
                      <span className="px-3 py-1 bg-amber-50 text-amber-600 text-[10px] font-black uppercase rounded-lg flex items-center gap-1.5">
                        <Calendar className="w-3 h-3" /> {tut.follow_up_date}
                      </span>
                    )}
                    <ArrowRight className="w-4 h-4 text-slate-300 group-hover:translate-x-1 group-hover:text-indigo-500 transition-all" />
                  </div>
                </div>
                <div className="p-4 bg-slate-50 rounded-2xl border border-slate-100">
                  <p className="text-sm text-slate-700 font-medium leading-relaxed italic line-clamp-2">"{tut.summary}"</p>
                </div>
                {tut.goals.length > 0 && (
                  <div className="flex items-center gap-4">
                    <div className="flex -space-x-2">
                       {tut.goals.slice(0,3).map((_, i) => (
                         <div key={i} className="w-6 h-6 rounded-full bg-emerald-100 border-2 border-white flex items-center justify-center">
                           <Check className="w-3 h-3 text-emerald-600" />
                         </div>
                       ))}
                    </div>
                    <span className="text-[10px] font-black text-slate-400 uppercase tracking-widest">{tut.goals.length} metas definidas</span>
                  </div>
                )}
              </div>
            ))}
            {studentTutorings.length === 0 && (
              <div className="p-20 text-center bg-white rounded-[2rem] border border-dashed border-slate-200">
                 <p className="text-slate-400 font-medium italic">Nenhuma sessão de tutoria ou PDI registrada.</p>
              </div>
            )}
          </div>
        )}
      </div>

      {/* Modais de Relatórios Detalhados */}
      {selectedOccurrence && (
        <div className="fixed inset-0 bg-slate-900/60 backdrop-blur-sm z-[110] flex items-center justify-center p-4">
          <div className="bg-white w-full max-w-2xl rounded-[2.5rem] shadow-2xl overflow-hidden animate-in zoom-in-95 duration-300 flex flex-col">
            <div className="p-8 border-b border-slate-100 flex justify-between items-center shrink-0">
               <div className="flex items-center gap-4">
                 <div className={`p-3 rounded-2xl ${selectedOccurrence.severity === 'HIGH' ? 'bg-red-50 text-red-500' : 'bg-amber-50 text-amber-500'}`}>
                   <AlertCircle className="w-6 h-6" />
                 </div>
                 <div>
                   <h3 className="text-xl font-black text-slate-900">Relatório de Ocorrência</h3>
                   <p className="text-xs font-bold text-slate-400 uppercase tracking-widest">{selectedOccurrence.date} • {selectedOccurrence.type}</p>
                 </div>
               </div>
               <button onClick={() => setSelectedOccurrence(null)} className="p-2 hover:bg-slate-100 rounded-full transition-colors"><X className="w-6 h-6 text-slate-400" /></button>
            </div>
            <div className="p-8 space-y-8 overflow-y-auto max-h-[70vh] custom-scrollbar">
              <div className="space-y-2">
                <p className="text-[10px] font-black text-slate-400 uppercase tracking-widest">Título do Registro</p>
                <p className="text-lg font-bold text-slate-800">{selectedOccurrence.title}</p>
              </div>
              <div className="space-y-2">
                <p className="text-[10px] font-black text-slate-400 uppercase tracking-widest">Descrição Detalhada</p>
                <div className="p-6 bg-slate-50 rounded-3xl border border-slate-100">
                  <p className="text-slate-700 leading-relaxed font-medium italic">"{selectedOccurrence.description}"</p>
                </div>
              </div>
              <div className="grid grid-cols-2 gap-6">
                <div className="space-y-2">
                  <p className="text-[10px] font-black text-slate-400 uppercase tracking-widest">Ações Tomadas</p>
                  <p className="text-sm font-bold text-slate-700">{selectedOccurrence.action_taken}</p>
                </div>
                <div className="space-y-2">
                  <p className="text-[10px] font-black text-slate-400 uppercase tracking-widest">Família Notificada?</p>
                  <p className={`text-sm font-bold ${selectedOccurrence.guardian_notified ? 'text-emerald-600' : 'text-slate-400'}`}>
                    {selectedOccurrence.guardian_notified ? 'Sim, via portal' : 'Não notificado'}
                  </p>
                </div>
              </div>
            </div>
            <div className="p-8 bg-slate-50 border-t border-slate-100 flex justify-end gap-3 shrink-0">
               <button onClick={() => window.print()} className="px-6 py-3 bg-white border border-slate-200 rounded-xl font-bold text-slate-600 flex items-center gap-2 hover:bg-slate-50 transition-all"><Printer className="w-4 h-4" /> Imprimir Relatório</button>
               <button onClick={() => setSelectedOccurrence(null)} className="px-8 py-3 bg-indigo-600 text-white rounded-xl font-bold hover:bg-indigo-700 transition-all">Fechar</button>
            </div>
          </div>
        </div>
      )}

      {selectedTutoring && (
        <div className="fixed inset-0 bg-slate-900/60 backdrop-blur-sm z-[110] flex items-center justify-center p-4">
          <div className="bg-white w-full max-w-3xl rounded-[2.5rem] shadow-2xl overflow-hidden animate-in zoom-in-95 duration-300 flex flex-col">
            <div className="p-8 border-b border-slate-100 flex justify-between items-center shrink-0">
               <div className="flex items-center gap-4">
                 <div className="p-3 rounded-2xl bg-indigo-50 text-indigo-600">
                   <MessageSquare className="w-6 h-6" />
                 </div>
                 <div>
                   <h3 className="text-xl font-black text-slate-900">Relatório de Tutoria / PDI</h3>
                   <p className="text-xs font-bold text-indigo-400 uppercase tracking-widest">{selectedTutoring.date} • {selectedTutoring.type.toUpperCase()}</p>
                 </div>
               </div>
               <button onClick={() => setSelectedTutoring(null)} className="p-2 hover:bg-slate-100 rounded-full transition-colors"><X className="w-6 h-6 text-slate-400" /></button>
            </div>
            <div className="p-8 space-y-8 overflow-y-auto max-h-[70vh] custom-scrollbar">
              <div className="space-y-3">
                <p className="text-[10px] font-black text-slate-400 uppercase tracking-widest">Resumo da Sessão</p>
                <div className="p-6 bg-slate-50 rounded-3xl border border-slate-100">
                  <p className="text-slate-700 leading-relaxed font-medium italic">"{selectedTutoring.summary}"</p>
                </div>
              </div>
              
              {selectedTutoring.goals.length > 0 && (
                <div className="space-y-4">
                  <p className="text-[10px] font-black text-slate-400 uppercase tracking-widest flex items-center gap-2"><Target className="w-4 h-4" /> Metas de Desenvolvimento</p>
                  <div className="grid grid-cols-1 md:grid-cols-2 gap-3">
                    {selectedTutoring.goals.map((goal, i) => (
                      <div key={i} className="p-4 bg-white border border-slate-200 rounded-2xl flex items-start gap-3 shadow-sm">
                        <div className={`mt-1 p-1 rounded-full ${goal.status === 'concluida' ? 'bg-emerald-100 text-emerald-600' : 'bg-slate-100 text-slate-400'}`}>
                          <Check className="w-3 h-3" />
                        </div>
                        <div>
                          <p className="text-sm font-bold text-slate-700">{goal.description}</p>
                          <p className="text-[10px] text-slate-400 font-bold uppercase mt-1">Prazo: {goal.deadline}</p>
                        </div>
                      </div>
                    ))}
                  </div>
                </div>
              )}

              {selectedTutoring.pdi_content && (
                <div className="space-y-4 pt-4 border-t border-slate-100">
                  <p className="text-[10px] font-black text-indigo-400 uppercase tracking-widest">Plano de Desenvolvimento Individual (PDI)</p>
                  <div className="space-y-4">
                    <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                       <div className="space-y-1">
                         <p className="text-xs font-black text-slate-500 uppercase tracking-tighter">Objetivos Pedagógicos</p>
                         <p className="text-sm text-slate-600 font-medium">{selectedTutoring.pdi_content.objectives}</p>
                       </div>
                       <div className="space-y-1">
                         <p className="text-xs font-black text-slate-500 uppercase tracking-tighter">Recursos & Estratégias</p>
                         <p className="text-sm text-slate-600 font-medium">{selectedTutoring.pdi_content.strategies}</p>
                       </div>
                    </div>
                  </div>
                </div>
              )}

              <div className="p-6 bg-indigo-50 rounded-3xl border border-indigo-100 space-y-2">
                <p className="text-[10px] font-black text-indigo-600 uppercase tracking-widest">Próximos Passos</p>
                <p className="text-sm font-bold text-indigo-900">{selectedTutoring.next_steps}</p>
              </div>
            </div>
            <div className="p-8 bg-slate-50 border-t border-slate-100 flex justify-end gap-3 shrink-0">
               <button onClick={() => window.print()} className="px-6 py-3 bg-white border border-slate-200 rounded-xl font-bold text-slate-600 flex items-center gap-2 hover:bg-slate-50 transition-all"><Printer className="w-4 h-4" /> Imprimir PDI</button>
               <button onClick={() => setSelectedTutoring(null)} className="px-8 py-3 bg-indigo-600 text-white rounded-xl font-bold hover:bg-indigo-700 transition-all">Fechar Relatório</button>
            </div>
          </div>
        </div>
      )}

      <style>{`
        @media print {
          body * { visibility: hidden; }
          .print-area, .print-area *, .fixed.z-[110] * { visibility: visible; }
          .fixed.z-[110] { position: absolute !important; top: 0 !important; left: 0 !important; width: 100% !important; height: auto !important; overflow: visible !important; background: white !important; }
          .print:hidden { display: none !important; }
          .bg-white { border: none !important; box-shadow: none !important; }
          .rounded-[2.5rem] { border-radius: 0 !important; }
          button { display: none !important; }
        }
      `}</style>
    </div>
  );
};
