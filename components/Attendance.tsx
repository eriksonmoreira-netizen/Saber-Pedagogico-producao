
import React, { useState, useEffect } from 'react';
import { CalendarCheck, Check, X, Clock, Save, Info, Users, ChevronRight, FileText } from 'lucide-react';
import { store } from '../state/store';
import { Attendance as AttendanceType } from '../types';

type AttendanceStatus = 'presente' | 'falta' | 'falta_justificada' | 'atraso';

export const Attendance: React.FC = () => {
  const [selectedClassId, setSelectedClassId] = useState(store.classes[0]?.id || '');
  const [classes, setClasses] = useState(store.classes);
  const [students, setStudents] = useState(store.students);
  const [attendances, setAttendances] = useState(store.attendances);
  const [attendanceDate, setAttendanceDate] = useState(new Date().toISOString().split('T')[0]);
  const [isSaving, setIsSaving] = useState(false);
  
  // Estado local para a pauta do dia
  const [localAttendance, setLocalAttendance] = useState<Record<string, AttendanceStatus>>({});

  useEffect(() => {
    return store.subscribe(() => {
      setClasses(store.classes);
      setStudents(store.students);
      setAttendances(store.attendances);
    });
  }, []);

  const filteredStudents = students.filter(s => s.class_id === selectedClassId);
  
  const getStatus = (studentId: string): AttendanceStatus | undefined => {
    if (localAttendance[studentId]) return localAttendance[studentId];
    return attendances.find(a => a.student_id === studentId && a.date === attendanceDate)?.status;
  };

  const handleStatusChange = (studentId: string, status: AttendanceStatus) => {
    setLocalAttendance(prev => {
      if (prev[studentId] === status) {
        const newState = { ...prev };
        delete newState[studentId];
        return newState;
      }
      return { ...prev, [studentId]: status };
    });
  };

  const handleFinish = () => {
    if (Object.keys(localAttendance).length === 0) return;
    setIsSaving(true);
    
    // Fix: Explicitly cast status to AttendanceType['status'] to avoid 'unknown' type error during mapping
    const attendancesToSave: AttendanceType[] = Object.entries(localAttendance).map(([studentId, status]) => ({
      id: `att-${studentId}-${attendanceDate}`,
      student_id: studentId,
      class_id: selectedClassId,
      date: attendanceDate,
      status: status as AttendanceType['status'],
      lesson_number: 1
    }));

    setTimeout(() => {
      store.saveAttendances(attendancesToSave);
      setIsSaving(false);
      setLocalAttendance({});
      alert('Frequência finalizada e gravada com sucesso!');
    }, 800);
  };

  const stats = filteredStudents.reduce((acc, s) => {
    const status = getStatus(s.id);
    if (status === 'presente') acc.present++;
    else if (status === 'falta') acc.absent++;
    else if (status === 'atraso') acc.late++;
    else if (status === 'falta_justificada') acc.justified++;
    return acc;
  }, { present: 0, absent: 0, late: 0, justified: 0 });

  return (
    <div className="space-y-6 animate-in fade-in duration-500 pb-20">
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
        <div>
          <h1 className="text-3xl font-black text-slate-900 tracking-tight">Diário de Chamada</h1>
          <p className="text-slate-500 font-medium">Controle de presença diária usando estados oficiais.</p>
        </div>
        <div className="flex gap-2">
          <input 
            type="date" 
            value={attendanceDate}
            onChange={(e) => {
              setAttendanceDate(e.target.value);
              setLocalAttendance({});
            }}
            className="bg-white border border-slate-200 rounded-xl px-4 py-2.5 text-sm font-bold outline-none focus:ring-2 focus:ring-indigo-500 shadow-sm" 
          />
          <button 
            onClick={handleFinish}
            disabled={isSaving || Object.keys(localAttendance).length === 0}
            className="bg-indigo-600 text-white px-8 py-2.5 rounded-xl font-bold hover:bg-indigo-700 shadow-lg shadow-indigo-100 flex items-center gap-2 disabled:opacity-50"
          >
            {isSaving ? 'Gravando...' : <><Save className="w-4 h-4" /> Finalizar</>}
          </button>
        </div>
      </div>

      <div className="bg-white p-6 rounded-[2rem] border border-slate-200 shadow-sm flex flex-col md:flex-row md:items-center justify-between gap-6">
        <div className="flex items-center gap-4">
          <div className="p-3 bg-indigo-50 rounded-2xl text-indigo-600">
            <Users className="w-6 h-6" />
          </div>
          <div>
            <select 
              value={selectedClassId}
              onChange={(e) => {
                setSelectedClassId(e.target.value);
                setLocalAttendance({});
              }}
              className="bg-transparent border-none font-black text-xl text-slate-900 outline-none cursor-pointer focus:ring-0"
            >
              {classes.map(c => <option key={c.id} value={c.id}>{c.name}</option>)}
            </select>
            <p className="text-xs font-bold text-slate-400 uppercase tracking-widest">{filteredStudents.length} Alunos na lista</p>
          </div>
        </div>
        
        <div className="flex gap-6">
           <div className="text-center">
             <p className="text-[9px] font-black text-slate-400 uppercase tracking-widest mb-1">Presentes</p>
             <p className="text-xl font-black text-emerald-600">{stats.present}</p>
           </div>
           <div className="text-center">
             <p className="text-[9px] font-black text-slate-400 uppercase tracking-widest mb-1">Faltas</p>
             <p className="text-xl font-black text-red-500">{stats.absent}</p>
           </div>
           <div className="text-center">
             <p className="text-[9px] font-black text-slate-400 uppercase tracking-widest mb-1">Atrasos</p>
             <p className="text-xl font-black text-amber-500">{stats.late}</p>
           </div>
           <div className="text-center">
             <p className="text-[9px] font-black text-slate-400 uppercase tracking-widest mb-1">Justific.</p>
             <p className="text-xl font-black text-blue-500">{stats.justified}</p>
           </div>
        </div>
      </div>

      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-4">
        {filteredStudents.map(student => {
          const status = getStatus(student.id);
          return (
            <div key={student.id} className="bg-white p-5 rounded-[2rem] border border-slate-200 flex flex-col gap-4 hover:border-indigo-200 hover:shadow-md transition-all group">
              <div className="flex items-center gap-4 min-w-0">
                <div className="w-12 h-12 rounded-full bg-slate-50 flex items-center justify-center font-black text-slate-500 text-sm">
                  {student.name.substring(0, 2)}
                </div>
                <div className="min-w-0">
                  <p className="text-sm font-bold text-slate-800 truncate">{student.name}</p>
                  <p className="text-[10px] font-black text-slate-400 uppercase">RA: {student.registration_number}</p>
                </div>
              </div>
              <div className="flex gap-1 bg-slate-50 p-1.5 rounded-2xl">
                <button 
                  onClick={() => handleStatusChange(student.id, 'presente')}
                  className={`flex-1 flex flex-col items-center justify-center py-2.5 rounded-xl transition-all ${status === 'presente' ? 'bg-emerald-500 text-white shadow-lg shadow-emerald-100' : 'text-slate-300 hover:bg-emerald-100 hover:text-emerald-600'}`} 
                  title="Presente"
                >
                  <Check className="w-4 h-4" />
                  <span className="text-[8px] font-black uppercase mt-1">Pres</span>
                </button>
                <button 
                  onClick={() => handleStatusChange(student.id, 'falta')}
                  className={`flex-1 flex flex-col items-center justify-center py-2.5 rounded-xl transition-all ${status === 'falta' ? 'bg-red-500 text-white shadow-lg shadow-red-100' : 'text-slate-300 hover:bg-red-100 hover:text-red-600'}`} 
                  title="Falta"
                >
                  <X className="w-4 h-4" />
                  <span className="text-[8px] font-black uppercase mt-1">Falta</span>
                </button>
                <button 
                  onClick={() => handleStatusChange(student.id, 'falta_justificada')}
                  className={`flex-1 flex flex-col items-center justify-center py-2.5 rounded-xl transition-all ${status === 'falta_justificada' ? 'bg-blue-500 text-white shadow-lg shadow-blue-100' : 'text-slate-300 hover:bg-blue-100 hover:text-blue-600'}`} 
                  title="Justificada"
                >
                  <FileText className="w-4 h-4" />
                  <span className="text-[8px] font-black uppercase mt-1">Just.</span>
                </button>
                <button 
                  onClick={() => handleStatusChange(student.id, 'atraso')}
                  className={`flex-1 flex flex-col items-center justify-center py-2.5 rounded-xl transition-all ${status === 'atraso' ? 'bg-amber-500 text-white shadow-lg shadow-amber-100' : 'text-slate-300 hover:bg-amber-100 hover:text-amber-600'}`} 
                  title="Atraso"
                >
                  <Clock className="w-4 h-4" />
                  <span className="text-[8px] font-black uppercase mt-1">Atra</span>
                </button>
              </div>
            </div>
          );
        })}
      </div>

      <div className="bg-indigo-50 p-6 rounded-[2rem] border border-indigo-100 flex items-center gap-4">
        <div className="p-3 bg-white rounded-2xl text-indigo-600 shadow-sm">
          <Info className="w-5 h-5" />
        </div>
        <div className="flex-1">
          <p className="text-sm font-bold text-indigo-900">Persistência Garantida</p>
          <p className="text-xs text-indigo-700/70">Os dados de chamada são gravados localmente e ficam fixos em sua base de dados até que sejam editados.</p>
        </div>
        <button className="text-indigo-600 font-bold text-xs hover:underline flex items-center gap-1">Saiba mais <ChevronRight className="w-3 h-3" /></button>
      </div>
    </div>
  );
};
