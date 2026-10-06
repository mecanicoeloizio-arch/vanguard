export type UserRole = 'student' | 'teacher' | 'admin';

export interface User {
  id: string;
  name: string;
  email: string;
  role: UserRole;
  avatar: string;
  cpf?: string;
  registrationNumber: string; // Matrícula
  courseId?: string; // For students
  department?: string; // For teachers
  phone?: string;
  status: 'active' | 'suspended' | 'graduated';
  encryptedDataHash?: string;
  password?: string;
}

export interface Lesson {
  id: string;
  title: string;
  description: string;
  durationMinutes: number;
  videoUrl: string;
  transcript: string;
  downloadableMaterials?: { title: string; url: string; size: string }[];
  isCompleted?: boolean;
}

export interface CourseModule {
  id: string;
  title: string;
  description: string;
  lessons: Lesson[];
}

export interface Course {
  id: string;
  title: string;
  shortDescription: string;
  fullDescription: string;
  category: 'Tecnologia' | 'Negócios' | 'Saúde' | 'Design' | 'Educação' | 'Engenharia';
  price: number;
  installments: number; // e.g. 12x
  workloadHours: number;
  level: 'Iniciante' | 'Intermediário' | 'Avançado';
  instructorId: string;
  instructorName: string;
  instructorTitle: string;
  thumbnail: string;
  featured: boolean;
  syllabus: CourseModule[];
  tags: string[];
  enrolledStudentsCount: number;
  rating: number;
}

export interface GradeItem {
  id: string;
  studentId: string;
  courseId: string;
  subject: string;
  p1: number; // Prova 1
  p2: number; // Prova 2
  assignment: number; // Trabalho
  finalExam?: number;
  average: number;
  status: 'Aprovado' | 'Recuperação' | 'Reprovado' | 'Em Andamento';
}

export interface AttendanceRecord {
  id: string;
  studentId: string;
  date: string;
  subject: string;
  status: 'present' | 'absent' | 'justified';
  verifiedCode?: string;
}

export interface QuizQuestion {
  id: string;
  question: string;
  options: string[];
  correctOptionIndex: number;
  explanation: string;
}

export interface Exam {
  id: string;
  courseId: string;
  title: string;
  description: string;
  type: 'quiz' | 'exam' | 'assignment';
  dueDate: string;
  durationMinutes: number;
  totalPoints: number;
  questions?: QuizQuestion[];
  instructions?: string;
}

export interface StudentSubmission {
  id: string;
  examId: string;
  studentId: string;
  studentName: string;
  submittedAt: string;
  score?: number;
  status: 'submitted' | 'graded' | 'late';
  answers?: { questionId: string; selectedOption: number }[];
  attachedFileName?: string;
  teacherFeedback?: string;
}

export type DocumentType = 'carteirinha' | 'certificado' | 'historico' | 'declaracao';

export interface DocumentRequest {
  id: string;
  studentId: string;
  studentName: string;
  documentType: DocumentType;
  title: string;
  feeAmount: number;
  paymentStatus: 'pending' | 'paid' | 'failed';
  paymentMethod?: 'pix' | 'credit_card' | 'boleto';
  mercadoPagoPaymentId?: string;
  requestedAt: string;
  issuedAt?: string;
  validationHash?: string;
  downloadUrl?: string;
}

export interface FinancialTransaction {
  id: string;
  type: 'tuition' | 'document_fee' | 'enrollment';
  description: string;
  amount: number;
  studentId?: string;
  studentName?: string;
  date: string;
  dueDate: string;
  status: 'paid' | 'pending' | 'overdue';
  paymentMethod: 'pix' | 'credit_card' | 'boleto';
  mercadoPagoReference: string;
}

export interface ScheduleEvent {
  id: string;
  courseId: string;
  dayOfWeek: 'Segunda' | 'Terça' | 'Quarta' | 'Quinta' | 'Sexta' | 'Sábado';
  startTime: string;
  endTime: string;
  subject: string;
  teacherName: string;
  roomOrLink: string;
  hasChanged?: boolean;
  changeNotice?: string;
}

export interface PushNotification {
  id: string;
  title: string;
  message: string;
  targetRole: 'all' | 'student' | 'teacher' | 'admin';
  category: 'grade' | 'schedule' | 'payment' | 'academic' | 'system';
  timestamp: string;
  read: boolean;
  linkAction?: string;
}

export interface ChatMessage {
  id: string;
  senderId: string;
  senderName: string;
  senderRole: UserRole;
  senderAvatar: string;
  receiverId?: string; // null for course channel
  courseId?: string;
  content: string;
  timestamp: string;
  fileAttachment?: { name: string; size: string };
}

export interface SupportTicket {
  id: string;
  userId: string;
  userName: string;
  userRole: UserRole;
  category: 'financeiro' | 'secretaria' | 'academico' | 'tecnico';
  subject: string;
  description: string;
  status: 'aberto' | 'em_analise' | 'resolvido';
  priority: 'baixa' | 'media' | 'alta';
  createdAt: string;
  messages: { sender: string; text: string; time: string }[];
}

export interface ERPLog {
  id: string;
  system: 'TOTVS Edu' | 'SAP Education' | 'Senior Sponte' | 'Webhooks Core';
  action: string;
  entity: 'Matrícula' | 'Nota' | 'Financeiro' | 'Frequência';
  status: 'success' | 'syncing' | 'failed';
  timestamp: string;
  payloadHash: string;
}

export interface LibraryItem {
  id: string;
  title: string;
  author: string;
  category: 'Livro' | 'Artigo' | 'Apostila' | 'Paper Científico';
  description: string;
  fileSize: string;
  format: 'PDF' | 'EPUB';
  downloadUrl: string;
  readOnlineAvailable: boolean;
  coverImage: string;
}

export interface AcademicEvent {
  id: string;
  title: string;
  type: 'prova' | 'trabalho' | 'reuniao' | 'feriado' | 'vestibular' | 'evento';
  date: string;
  endDate?: string;
  description: string;
  targetRole: 'all' | 'student' | 'teacher';
}

export interface MarketingLead {
  id: string;
  name: string;
  email: string;
  phone: string;
  courseInterest: string;
  status: 'novo' | 'em_atendimento' | 'proposta_enviada' | 'matriculado';
  notes?: string;
  createdAt: string;
  source: 'chat_sofia' | 'whatsapp' | 'email_marketing' | 'vitrine';
  proposalCode?: string;
  discountPercentage?: number;
}

export interface MercadoPagoConfig {
  publicKey: string;
  accessToken: string;
  clientId?: string;
  clientSecret?: string;
  webhookUrl: string;
  webhookSecret?: string;
  environment: 'sandbox' | 'production';
  autoApproveSimulation: boolean;
  pixDiscountPercent: number;
  maxInstallments: number;
  notificationEmail: string;
  lastTestedAt?: string;
  connectionStatus: 'connected' | 'disconnected' | 'testing' | 'invalid_credentials';
}

export interface SofiaSettings {
  name: string;
  title: string;
  personality: 'romantica_sonhadora' | 'academica' | 'comercial';
  romanticToneLevel: 'alta' | 'moderada' | 'poetica_maxima';
  activeCoupon: string;
  discountPercentage: number;
  whatsappNumber: string;
  welcomeMessage: string;
  enablePoeticQuotes: boolean;
  enableDirectCheckoutAction: boolean;
}

export type IntegrationCategory = 'payment' | 'communication' | 'ai' | 'erp' | 'government' | 'webhook' | 'custom';

export interface IntegrationKeyRecord {
  id: string;
  name: string;
  category: IntegrationCategory;
  service: string;
  primaryToken: string;
  secondaryKey?: string;
  secretKey?: string;
  endpointUrl?: string;
  environment: 'sandbox' | 'production';
  status: 'active' | 'testing' | 'inactive' | 'error';
  lastPingAt?: string;
  autoSync: boolean;
  notes?: string;
  createdAt: string;
  updatedAt: string;
  rateLimitPerMinute?: number;
  webhookEvents?: string[];
}

export interface SystemUpdateHistoryItem {
  id: string;
  version: string;
  appliedAt: string;
  appliedBy: string;
  status: 'success' | 'rolled_back';
  description: string;
  migrationsApplied: string[];
}

export interface SystemAvailableUpdate {
  version: string;
  title: string;
  releaseDate: string;
  severity: 'feature' | 'security' | 'critical';
  changelog: string[];
  databaseMigrations: string[];
  downloadSize: string;
}

export interface SystemUpdateManager {
  currentVersion: string;
  releaseChannel: 'stable' | 'beta' | 'lts';
  autoCheckUpdates: boolean;
  lastCheckDate: string;
  availableUpdate: SystemAvailableUpdate | null;
  backupSnapshotCount: number;
  lastBackupDate?: string;
  autoBackupBeforeUpdate: boolean;
  updateHistory: SystemUpdateHistoryItem[];
}

export interface IntegrationAuditLog {
  id: string;
  timestamp: string;
  service: string;
  action: string;
  status: 'success' | 'warning' | 'error';
  payloadSummary: string;
  latencyMs: number;
  ipAddress?: string;
}

export type ModuleCategory = 'core' | 'finance' | 'academic' | 'communication' | 'security' | 'business';

export interface SystemModule {
  id: string;
  slug: string;
  name: string;
  description: string;
  version: string;
  category: ModuleCategory;
  enabled: boolean;
  isCore: boolean;
  dependencies: string[];
  installedAt: string;
  updatedAt: string;
  status: 'healthy' | 'warning' | 'updating' | 'error';
  author: string;
  changelog: string[];
  features: string[];
}

export interface CommandExecutionResult {
  command: string;
  output: string;
  status: 'success' | 'warning' | 'error';
  timestamp: string;
  executionTimeMs: number;
}

export interface SecurityAuditCategory {
  score: number;
  passed: boolean;
  checks: Array<{ name: string; status: 'passed' | 'warning' | 'failed'; detail: string }>;
}

export interface SecurityAuditReport {
  lastAuditAt: string;
  overallScore: number;
  status: 'secure' | 'warning' | 'vulnerable';
  categories: {
    authentication: SecurityAuditCategory;
    financial: SecurityAuditCategory;
    ai_guardrails: SecurityAuditCategory;
    data_protection: SecurityAuditCategory;
  };
  totalChecks: number;
  passedChecks: number;
}

