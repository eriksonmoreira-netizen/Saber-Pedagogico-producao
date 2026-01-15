
export type UserRole = 'SUPER_ADM' | 'ADMIN' | 'TEACHER' | 'COORDINATOR' | 'PARENT';
export type PlanType = 'SEMENTE' | 'DOCENTE' | 'MESTRE' | 'MESTRE_PLUS' | 'GESTOR';
export type UserStatus = 'ativo' | 'inativo';

export interface User {
  id: string;
  full_name: string;
  email: string;
  role: UserRole;
  photo_url: string;
  plan: PlanType;
  status: UserStatus;
  created_at: string;
  last_login?: string | null;
  terms_accepted_at?: string;
  current_school?: string;
  schools?: { id: string, name: string }[];
}

export interface Invoice {
  id: string;
  date: string;
  amount: number;
  plan: PlanType;
  status: 'PAID' | 'PENDING' | 'CANCELED';
  method: 'CARD' | 'PIX';
  pdf_url?: string;
}

export interface UserLead {
  id: string;
  name: string;
  email: string;
  signup_date: string;
  last_active: string;
  plan: PlanType;
  conversion_score: number;
  status: 'NEW' | 'ACTIVE' | 'CHURNED';
}

export interface GradeCriterion {
  name: string;
  weight: number;
  max_score: number;
}

export interface SchoolClass {
  id: string;
  name: string;
  subject: string;
  school_year: string;
  period: 'matutino' | 'vespertino' | 'noturno' | 'integral';
  school_name: string;
  color: string;
  status: 'ativa' | 'arquivada';
  grade_criteria: GradeCriterion[];
  created_by?: string;
}

export type StudentStatus = 'ACTIVE' | 'TRANSFERRED' | 'TRANSFER_DROP' | 'REASSIGNED';

export interface Student {
  id: string;
  class_id: string;
  name: string;
  registration_number: string;
  birth_date: string;
  guardian_name: string;
  guardian_phone: string;
  guardian_email: string;
  photo_url?: string;
  tags: string[];
  status: StudentStatus;
  learning_profile?: {
    style: string;
    strengths: string[];
    weaknesses: string[];
    notes: string;
  };
}

export interface Grade {
  id: string;
  student_id: string;
  class_id: string;
  evaluation_name: string;
  evaluation_type: 'EXAM' | 'ASSIGNMENT' | 'PARTICIPATION' | 'OTHER';
  score: number;
  max_score: number;
  weight: number;
  bimester: 1 | 2 | 3 | 4;
  date: string;
  observations?: string;
}

export interface Attendance {
  id: string;
  student_id: string;
  class_id: string;
  date: string;
  status: 'presente' | 'falta' | 'falta_justificada' | 'atraso';
  justification?: string;
  lesson_number: number;
}

export interface Occurrence {
  id: string;
  student_id: string;
  class_id: string;
  date: string;
  type: 'DISCIPLINARY' | 'PEDAGOGICAL' | 'PRAISE' | 'NOTICE';
  severity: 'LOW' | 'MEDIUM' | 'HIGH';
  title: string;
  description: string;
  action_taken: string;
  guardian_notified: boolean;
}

export interface TutoringGoal {
  description: string;
  deadline: string;
  status: 'pendente' | 'em_progresso' | 'concluida' | 'nao_atingida';
}

export interface Tutoring {
  id: string;
  student_id: string;
  class_id: string;
  date: string;
  type: 'tutoria' | 'mentoria' | 'pdi' | 'reuniao_responsavel';
  summary: string;
  goals: TutoringGoal[];
  next_steps: string;
  pdi_content?: {
    objectives: string;
    strategies: string;
    resources: string;
    evaluation_criteria?: string;
    timeline?: string;
  };
  follow_up_date?: string;
  attachments?: { name: string; url: string; type: string }[];
}

export interface Notification {
  id: string;
  type: 'GRADE' | 'OCCURRENCE' | 'TUTORING' | 'ADMIN';
  title: string;
  message: string;
  date: string;
  read: boolean;
  studentId?: string;
}

export interface AIInsight {
  risk_level: 'LOW' | 'MEDIUM' | 'HIGH';
  reasons: string[];
  suggestions: string[];
}
