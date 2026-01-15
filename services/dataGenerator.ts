
import { Student, SchoolClass, Grade, Attendance, Occurrence, Tutoring, StudentStatus } from '../types';

const FIRST_NAMES = ['Ana', 'Bruno', 'Carla', 'Diego', 'Eduarda', 'Felipe', 'Giovanna', 'Henrique', 'Isabela', 'João', 'Kátia', 'Leonardo', 'Maria', 'Nícolas', 'Olívia', 'Pedro', 'Quitéria', 'Rafael', 'Sofia', 'Thiago', 'Guilherme', 'Leticia', 'Marcos', 'Fernanda', 'Ricardo', 'Beatriz'];
const LAST_NAMES = ['Silva', 'Santos', 'Oliveira', 'Souza', 'Rodrigues', 'Ferreira', 'Alves', 'Pereira', 'Lima', 'Gomes', 'Costa', 'Ribeiro', 'Martins', 'Carvalho', 'Almeida', 'Lopes', 'Soares', 'Fernandes', 'Vieira', 'Barbosa', 'Mendes', 'Teixeira', 'Farias'];

const STATUS_OPTIONS: StudentStatus[] = ['ACTIVE', 'TRANSFERRED', 'TRANSFER_DROP', 'REASSIGNED'];

export const generateTestData = () => {
  const classes: SchoolClass[] = [
    { id: 'efaf-6', name: '6º Ano - EFAF', subject: 'Geral', school_year: '2024', period: 'matutino', school_name: 'Colégio Saber', color: 'indigo', status: 'ativa', grade_criteria: [] },
    { id: 'efaf-7', name: '7º Ano - EFAF', subject: 'Geral', school_year: '2024', period: 'matutino', school_name: 'Colégio Saber', color: 'blue', status: 'ativa', grade_criteria: [] },
    { id: 'efaf-8', name: '8º Ano - EFAF', subject: 'Geral', school_year: '2024', period: 'matutino', school_name: 'Colégio Saber', color: 'cyan', status: 'ativa', grade_criteria: [] },
    { id: 'efaf-9', name: '9º Ano - EFAF', subject: 'Geral', school_year: '2024', period: 'matutino', school_name: 'Colégio Saber', color: 'emerald', status: 'ativa', grade_criteria: [] },
    { id: 'em-1', name: '1º EM', subject: 'Geral', school_year: '2024', period: 'vespertino', school_name: 'Colégio Saber', color: 'amber', status: 'ativa', grade_criteria: [] },
    { id: 'em-2', name: '2º EM', subject: 'Geral', school_year: '2024', period: 'vespertino', school_name: 'Colégio Saber', color: 'orange', status: 'ativa', grade_criteria: [] },
    { id: 'em-3', name: '3º EM', subject: 'Geral', school_year: '2024', period: 'vespertino', school_name: 'Colégio Saber', color: 'rose', status: 'ativa', grade_criteria: [] },
  ];

  const students: Student[] = [];
  const grades: Grade[] = [];
  const occurrences: Occurrence[] = [];
  const tutorings: Tutoring[] = [];
  const attendances: Attendance[] = [];

  const currentMonth = new Date().getMonth();
  const currentBimester = Math.ceil((currentMonth + 1) / 3);
  const today = new Date();

  for (let i = 1; i <= 300; i++) {
    const classIdx = Math.floor(Math.random() * classes.length);
    const targetClass = classes[classIdx];
    const firstName = FIRST_NAMES[Math.floor(Math.random() * FIRST_NAMES.length)];
    const lastName = LAST_NAMES[Math.floor(Math.random() * LAST_NAMES.length)];
    const studentId = `st-generated-${i}`;

    let status: StudentStatus = 'ACTIVE';
    const rand = Math.random();
    if (rand > 0.95) status = 'TRANSFERRED';
    else if (rand > 0.90) status = 'TRANSFER_DROP';
    else if (rand > 0.85) status = 'REASSIGNED';

    const student: Student = {
      id: studentId,
      class_id: targetClass.id,
      name: `${firstName} ${lastName}`,
      registration_number: `2024${String(i).padStart(4, '0')}`,
      birth_date: '2010-05-15',
      guardian_name: `${LAST_NAMES[Math.floor(Math.random() * LAST_NAMES.length)]} Paterno`,
      guardian_phone: `(11) 9${Math.floor(10000000 + Math.random() * 90000000)}`,
      guardian_email: `${firstName.toLowerCase()}@example.com`,
      status: status,
      tags: i % 15 === 0 ? ['Risco de Evasão'] : i % 25 === 0 ? ['Destaque'] : [],
      learning_profile: {
        style: i % 2 === 0 ? 'Visual' : 'Cinestésico',
        strengths: ['Criatividade', 'Participação'],
        weaknesses: ['Foco'],
        notes: 'Perfil gerado automaticamente.'
      }
    };
    students.push(student);

    occurrences.push({
      id: `occ-gen-${studentId}`,
      student_id: studentId,
      class_id: targetClass.id,
      date: new Date(today.getTime() - Math.random() * 30 * 24 * 60 * 60 * 1000).toISOString().split('T')[0],
      type: i % 5 === 0 ? 'DISCIPLINARY' : 'PEDAGOGICAL',
      severity: i % 10 === 0 ? 'MEDIUM' : 'LOW',
      title: i % 5 === 0 ? 'Conflito em sala' : 'Destaque em atividade em grupo',
      description: 'Registro automático de desempenho comportamental.',
      action_taken: 'Conversa realizada com o aluno.',
      guardian_notified: i % 2 === 0
    });

    for (let t = 1; t <= 2; t++) {
      tutorings.push({
        id: `tut-gen-${studentId}-${t}`,
        student_id: studentId,
        class_id: targetClass.id,
        date: new Date(today.getTime() - (t * 15) * 24 * 60 * 60 * 1000).toISOString().split('T')[0],
        // Fixed: changed 'MENTORING' to 'mentoria' to match the Tutoring type definition in types.ts
        type: 'mentoria',
        summary: `Sessão de mentoria ${t} para acompanhamento de metas.`,
        // Fixed: updated goal object properties (description, deadline, status) to match TutoringGoal interface
        goals: [
          { description: 'Melhorar organização de estudos', deadline: today.toISOString().split('T')[0], status: t === 1 ? 'concluida' : 'pendente' },
          { description: 'Aumentar participação em aula', deadline: today.toISOString().split('T')[0], status: 'pendente' }
        ],
        next_steps: 'Acompanhar progresso na próxima quinzena.',
        pdi_content: { 
          objectives: 'Focar em competências socioemocionais.', 
          strategies: 'Dinâmicas de grupo e reflexão.', 
          resources: 'Material de apoio pedagógico' 
        }
      });
    }

    for (let d = 0; d < 10; d++) {
      const date = new Date(today);
      date.setDate(today.getDate() - d);
      if (date.getDay() === 0 || date.getDay() === 6) continue;

      attendances.push({
        id: `att-gen-${studentId}-${d}`,
        student_id: studentId,
        class_id: targetClass.id,
        date: date.toISOString().split('T')[0],
        status: Math.random() > 0.9 ? 'falta' : 'presente',
        lesson_number: 1
      });
    }

    grades.push({
      id: `grade-gen-${studentId}`,
      student_id: studentId,
      class_id: targetClass.id,
      evaluation_name: 'Avaliação Mensal',
      evaluation_type: 'EXAM',
      score: 4 + Math.random() * 6,
      max_score: 10,
      weight: 1,
      bimester: currentBimester as any,
      date: today.toISOString().split('T')[0],
    });
  }

  return { students, classes, grades, occurrences, tutorings, attendances };
};
