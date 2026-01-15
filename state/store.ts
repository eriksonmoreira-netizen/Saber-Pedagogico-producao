import { Student, SchoolClass, Grade, Occurrence, Tutoring, User, PlanType, UserLead, Attendance, UserRole, Invoice } from '../types';
import { MOCK_STUDENTS, MOCK_CLASSES } from '../constants';

class DataStore {
  user: User | null = JSON.parse(localStorage.getItem('saber_user') || 'null');
  students: Student[] = JSON.parse(localStorage.getItem('saber_students') || '[]');
  classes: SchoolClass[] = JSON.parse(localStorage.getItem('saber_classes') || '[]');
  grades: Grade[] = JSON.parse(localStorage.getItem('saber_grades') || '[]');
  occurrences: Occurrence[] = JSON.parse(localStorage.getItem('saber_occurrences') || '[]');
  tutorings: Tutoring[] = JSON.parse(localStorage.getItem('saber_tutorings') || '[]');
  attendances: Attendance[] = JSON.parse(localStorage.getItem('saber_attendances') || '[]');
  invoices: Invoice[] = JSON.parse(localStorage.getItem('saber_invoices') || '[]');
  
  registeredUsers: User[] = JSON.parse(localStorage.getItem('saber_all_users') || '[]');
  
  constructor() {
    const masterEmail = 'erikson.moreira@gmail.com';

    // CORREÇÃO IMEDIATA NO LOAD: Se o usuário logado for o Erikson, força admin na hora
    if (this.user && this.user.email.toLowerCase().trim() === masterEmail) {
      console.log("👑 BOOT: Forçando permissões de Super ADM para Erikson.");
      this.user.role = 'SUPER_ADM';
      this.user.plan = 'GESTOR';
      this.user.status = 'ativo';
      this.persist();
    }

    if (this.classes.length === 0 && !localStorage.getItem('saber_initialized')) {
      this.students = MOCK_STUDENTS;
      this.classes = MOCK_CLASSES;
      this.persist();
      localStorage.setItem('saber_initialized', 'true');
    }

    // Garante que o usuário mestre exista na base global com permissões máximas
    const masterIndex = this.registeredUsers.findIndex(u => u.email.toLowerCase() === masterEmail);
    
    if (masterIndex === -1) {
      this.registeredUsers.push({
        id: 'u-master',
        full_name: 'Erikson Moreira',
        email: masterEmail,
        role: 'SUPER_ADM',
        photo_url: 'https://ui-avatars.com/api/?name=Erikson+Moreira&background=4f46e5&color=fff',
        plan: 'GESTOR',
        status: 'ativo',
        created_at: '2024-01-01T00:00:00.000Z',
        last_login: new Date().toISOString()
      });
      this.persist();
    } else {
      // Garante que se o usuário já existe, as permissões estão corretas (Prevenção de reset)
      this.registeredUsers[masterIndex].role = 'SUPER_ADM';
      this.registeredUsers[masterIndex].plan = 'GESTOR';
      this.registeredUsers[masterIndex].status = 'ativo';
      this.persist();
    }
  }

  private listeners: (() => void)[] = [];

  subscribe(listener: () => void) {
    this.listeners.push(listener);
    return () => {
      this.listeners = this.listeners.filter(l => l !== listener);
    };
  }

  private persist() {
    localStorage.setItem('saber_students', JSON.stringify(this.students));
    localStorage.setItem('saber_classes', JSON.stringify(this.classes));
    localStorage.setItem('saber_grades', JSON.stringify(this.grades));
    localStorage.setItem('saber_occurrences', JSON.stringify(this.occurrences));
    localStorage.setItem('saber_tutorings', JSON.stringify(this.tutorings));
    localStorage.setItem('saber_attendances', JSON.stringify(this.attendances));
    localStorage.setItem('saber_all_users', JSON.stringify(this.registeredUsers));
    localStorage.setItem('saber_invoices', JSON.stringify(this.invoices));
    if (this.user) {
      localStorage.setItem('saber_user', JSON.stringify(this.user));
    } else {
      localStorage.removeItem('saber_user');
    }
  }

  private notify() {
    this.persist();
    this.listeners.forEach(l => l());
  }

  login(userData: User) {
    const emailKey = userData.email.toLowerCase().trim();
    const now = new Date().toISOString();
    
    // REGRA DE OURO PARA ADMIN (Erikson Moreira)
    // Isso é a interceptação agressiva solicitada para o login
    if (emailKey === 'erikson.moreira@gmail.com') {
      console.log("👑 LOGIN OVERRIDE: Erikson detetado, forçando ADMIN/GESTOR.");
      userData.role = 'SUPER_ADM';
      userData.plan = 'GESTOR';
      userData.status = 'ativo';
      userData.full_name = 'Erikson Moreira';
    }

    const existingIndex = this.registeredUsers.findIndex(u => u.email.toLowerCase() === emailKey);
    
    if (existingIndex !== -1) {
      const existing = this.registeredUsers[existingIndex];
      const updatedUser: User = { 
        ...existing,
        ...userData,
        last_login: now,
        status: 'ativo'
      };
      
      // Re-garante os privilégios mestre no merge final
      if (emailKey === 'erikson.moreira@gmail.com') {
        updatedUser.role = 'SUPER_ADM';
        updatedUser.plan = 'GESTOR';
      }
      
      this.registeredUsers[existingIndex] = updatedUser;
      this.user = updatedUser;
    } else {
      const newUser: User = {
        ...userData,
        id: `u-${Date.now()}`,
        status: 'ativo',
        created_at: now,
        last_login: now,
        plan: (emailKey === 'erikson.moreira@gmail.com') ? 'GESTOR' : (userData.plan || 'SEMENTE'),
        role: (emailKey === 'erikson.moreira@gmail.com') ? 'SUPER_ADM' : (userData.role || 'TEACHER')
      };
      this.registeredUsers = [newUser, ...this.registeredUsers];
      this.user = newUser;
    }
    
    this.notify();
  }

  logout() {
    this.user = null;
    this.notify();
  }

  addUserBySuperAdm(userData: User) {
    const exists = this.registeredUsers.some(u => u.email.toLowerCase() === userData.email.toLowerCase());
    if (exists) return;
    this.registeredUsers = [userData, ...this.registeredUsers];
    this.notify();
  }

  updateUserBySuperAdm(userId: string, updates: Partial<User>) {
    this.registeredUsers = this.registeredUsers.map(u => {
      if (u.id === userId) {
        const updated = { ...u, ...updates };
        // Impede que o Erikson seja rebaixado por engano via Painel
        if (u.email.toLowerCase().trim() === 'erikson.moreira@gmail.com') {
          updated.role = 'SUPER_ADM';
          updated.plan = 'GESTOR';
        }
        return updated;
      }
      return u;
    });

    if (this.user?.id === userId) {
      this.user = { ...this.user, ...updates };
      // Override final para o usuário atual
      if (this.user.email.toLowerCase().trim() === 'erikson.moreira@gmail.com') {
        this.user.role = 'SUPER_ADM';
        this.user.plan = 'GESTOR';
      }
    }
    this.notify();
  }

  deleteUserBySuperAdm(userId: string) {
    // Impede deletar o Erikson
    const targetUser = this.registeredUsers.find(u => u.id === userId);
    if (targetUser?.email.toLowerCase().trim() === 'erikson.moreira@gmail.com') return;
    
    if (this.user?.id === userId) return;
    this.registeredUsers = this.registeredUsers.filter(u => u.id !== userId);
    this.notify();
  }

  addInvoice(invoice: Invoice) {
    this.invoices = [invoice, ...this.invoices];
    this.notify();
  }

  upgradePlan(newPlan: PlanType) {
    if (this.user) {
      this.updateUserBySuperAdm(this.user.id, { plan: newPlan });
    }
  }

  updateStudent(studentId: string, updates: Partial<Student>) {
    this.students = this.students.map(s => s.id === studentId ? { ...s, ...updates } : s);
    this.notify();
  }

  saveGrades(newGrades: Grade[]) {
    const existingMap = new Map();
    this.grades.forEach(g => existingMap.set(`${g.student_id}-${g.bimester}-${g.evaluation_name}`, g));
    newGrades.forEach(g => existingMap.set(`${g.student_id}-${g.bimester}-${g.evaluation_name}`, g));
    this.grades = Array.from(existingMap.values());
    this.notify();
  }

  saveAttendances(newAttendances: Attendance[]) {
    const existingMap = new Map();
    this.attendances.forEach(a => existingMap.set(`${a.student_id}-${a.date}`, a));
    newAttendances.forEach(a => existingMap.set(`${a.student_id}-${a.date}`, a));
    this.attendances = Array.from(existingMap.values());
    this.notify();
  }

  saveOccurrence(occ: Occurrence) {
    const idx = this.occurrences.findIndex(o => o.id === occ.id);
    if (idx !== -1) this.occurrences[idx] = occ;
    else this.occurrences = [occ, ...this.occurrences];
    this.notify();
  }

  saveTutoring(tut: Tutoring) {
    const exists = this.tutorings.findIndex(t => t.id === tut.id);
    if (exists !== -1) this.tutorings[exists] = tut;
    else this.tutorings = [tut, ...this.tutorings];
    this.notify();
  }

  setAllData(data: { students: Student[], classes: SchoolClass[], grades: Grade[], occurrences: Occurrence[], tutorings: Tutoring[], attendances: Attendance[] }) {
    this.students = data.students;
    this.classes = data.classes;
    this.grades = data.grades;
    this.occurrences = data.occurrences;
    this.tutorings = data.tutorings;
    this.attendances = data.attendances;
    this.notify();
  }

  reset() {
    this.students = [];
    this.classes = [];
    this.grades = [];
    this.occurrences = [];
    this.tutorings = [];
    this.attendances = [];
    this.registeredUsers = this.registeredUsers.filter(u => u.email === 'erikson.moreira@gmail.com');
    this.invoices = [];
    localStorage.removeItem('saber_initialized');
    this.notify();
  }
}

export const store = new DataStore();