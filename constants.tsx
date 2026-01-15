
import React from 'react';
import { 
  LayoutDashboard, 
  Users, 
  BookOpen, 
  GraduationCap, 
  CalendarCheck, 
  AlertCircle, 
  Settings,
  ShieldCheck,
  CreditCard,
  FileText,
  BrainCircuit,
  BarChart3,
  Building2,
  Lock,
  UserCheck
} from 'lucide-react';
import { Student, SchoolClass, Notification, UserRole, PlanType } from './types';

export interface NavItem {
  id: string;
  label: string;
  icon: React.ReactNode;
  roles: UserRole[];
  minPlan?: PlanType;
}

export const NAVIGATION_ITEMS: NavItem[] = [
  // Acesso liberado para todos os papéis para fins de debug/resgate conforme solicitado
  { id: 'super_adm_panel', label: 'Painel Super Adm', icon: <UserCheck />, roles: ['SUPER_ADM', 'ADMIN', 'TEACHER', 'COORDINATOR', 'PARENT'], minPlan: 'SEMENTE' },
  { id: 'dashboard', label: 'Início', icon: <LayoutDashboard />, roles: ['SUPER_ADM', 'ADMIN', 'TEACHER', 'COORDINATOR', 'PARENT'], minPlan: 'SEMENTE' },
  { id: 'classes', label: 'Minhas Turmas', icon: <BookOpen />, roles: ['SUPER_ADM', 'ADMIN', 'TEACHER', 'COORDINATOR'], minPlan: 'SEMENTE' },
  { id: 'students', label: 'Alunos', icon: <Users />, roles: ['SUPER_ADM', 'ADMIN', 'TEACHER', 'COORDINATOR'], minPlan: 'SEMENTE' },
  { id: 'grades', label: 'Notas e Boletins', icon: <GraduationCap />, roles: ['SUPER_ADM', 'ADMIN', 'TEACHER', 'COORDINATOR', 'PARENT'], minPlan: 'SEMENTE' },
  { id: 'attendance', label: 'Frequência', icon: <CalendarCheck />, roles: ['SUPER_ADM', 'ADMIN', 'TEACHER', 'COORDINATOR', 'PARENT'], minPlan: 'SEMENTE' },
  { id: 'tutoring', label: 'Tutoria / PDI', icon: <BrainCircuit />, roles: ['SUPER_ADM', 'TEACHER', 'COORDINATOR'], minPlan: 'DOCENTE' },
  { id: 'occurrences', label: 'Ocorrências', icon: <AlertCircle />, roles: ['SUPER_ADM', 'ADMIN', 'TEACHER', 'COORDINATOR', 'PARENT'], minPlan: 'DOCENTE' },
  { id: 'reports', label: 'Relatórios IA', icon: <BarChart3 />, roles: ['SUPER_ADM', 'ADMIN', 'TEACHER', 'COORDINATOR'], minPlan: 'DOCENTE' },
  { id: 'lesson_plans', label: 'Planos de Aula IA', icon: <FileText />, roles: ['SUPER_ADM', 'TEACHER'], minPlan: 'MESTRE' },
  { id: 'predictive', label: 'Análise Preditiva', icon: <ShieldCheck />, roles: ['SUPER_ADM', 'ADMIN', 'COORDINATOR'], minPlan: 'MESTRE' },
  { id: 'multi_school', label: 'Minhas Escolas', icon: <Building2 />, roles: ['SUPER_ADM', 'TEACHER', 'COORDINATOR'], minPlan: 'MESTRE_PLUS' },
  { id: 'pricing', label: 'Assinaturas', icon: <CreditCard />, roles: ['SUPER_ADM', 'ADMIN', 'TEACHER', 'COORDINATOR'], minPlan: 'SEMENTE' },
  { id: 'profile', label: 'Minha Conta', icon: <Settings />, roles: ['SUPER_ADM', 'ADMIN', 'TEACHER', 'COORDINATOR', 'PARENT'], minPlan: 'SEMENTE' },
];

export const PLAN_RANKS: Record<PlanType, number> = {
  'SEMENTE': 0,
  'DOCENTE': 1,
  'MESTRE': 2,
  'MESTRE_PLUS': 3,
  'GESTOR': 4
};

export const MOCK_CLASSES: SchoolClass[] = [
  { id: 'c1', name: '9º Ano A', subject: 'Matemática', school_year: '2024', period: 'matutino', school_name: 'Escola Estadual X', color: 'indigo', status: 'ativa', grade_criteria: [] },
  { id: 'c2', name: '1º EM B', subject: 'Física', school_year: '2024', period: 'vespertino', school_name: 'Colégio Particular Y', color: 'emerald', status: 'ativa', grade_criteria: [] },
];

export const MOCK_STUDENTS: Student[] = [
  { id: 's1', class_id: 'c1', name: 'Ana Beatriz Souza', registration_number: '2024001', birth_date: '2010-05-12', guardian_name: 'Marta Souza', guardian_phone: '(11) 98765-4321', guardian_email: 'marta@email.com', status: 'ACTIVE', tags: ['Destaque'] },
  { id: 's2', class_id: 'c1', name: 'Bruno Oliveira', registration_number: '2024002', birth_date: '2010-08-20', guardian_name: 'José Oliveira', guardian_phone: '(11) 98765-1122', guardian_email: 'jose@email.com', status: 'ACTIVE', tags: ['Risco de Evasão'] },
];

export const MOCK_NOTIFICATIONS: Notification[] = [
  { id: 'n1', type: 'GRADE', title: 'Nova Nota Publicada', message: 'A nota de Matemática da Ana Beatriz foi lançada.', date: '10 min atrás', read: false, studentId: 's1' },
  { id: 'n4', type: 'ADMIN', title: 'Upgrade de Plano', message: 'Seu período de teste do Plano Mestre expira em 3 dias.', date: '5 horas atrás', read: true }
];
