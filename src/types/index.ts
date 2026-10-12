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

export interface CourseMaterialItem {
  id: string;
  title: string;
  type: 'livro' | 'manual' | 'apostila';
  format: 'PDF' | 'EPUB' | 'Vídeo Explicativo';
  pages?: number;
  durationMinutes?: number;
  description: string;
  downloadUrl?: string;
  priceStandalone?: number; // Para venda avulsa no Mercado Pago
  includedInCourse: boolean;
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
  modality?: 'online' | 'hibrido';
  practicalLocation?: string;
  materials?: CourseMaterialItem[]; // Manuais, Livros digitais e Apostilas inclusos ou para venda
  isProductionLive?: boolean;
  publishedBy?: string; // 'Camilla Faria (Gerente Geral)'
  publishedAt?: string;
  mercadoPagoPaymentLink?: string;
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

export type DocumentType =
  | 'carteirinha'
  | 'certificado'
  | 'historico'
  | 'declaracao'
  | 'ementa'
  | 'segunda_via_carteirinha'
  | 'segunda_via_certificado'
  | 'segunda_via_historico'
  | 'segunda_via_declaracao';

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
  internshipHoursValidated?: number;
  internshipDetails?: string;
  isFirstIssueFree?: boolean; // 1ª via gratuita (carteirinha livre, certificado com mensalidades em dia)
  isSecondIssue?: boolean; // 2ª via paga definida pela secretaria
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

export interface EnrollmentDocumentUploads {
  photoBase64?: string;
  rgFrontBase64?: string;
  rgBackBase64?: string;
  proofResidenceBase64?: string;
  proofEducationBase64?: string;
}

export interface CentralProjectBrandConfig {
  id: 'vanguard' | 'elomak' | 'elocontabil' | 'elosign' | 'portal' | 'elowa' | 'webmail';
  name: string;
  badge: string;
  primaryColor: string;
  secondaryColor: string;
  logoUrl: string;
  slogan: string;
  faviconUrl: string;
  status: 'online' | 'maintenance' | 'offline';
  portOrPath: string;
  version: string;
  independentPanelUrl: string;
  recordsCount: number;
}

export interface CentralDatabaseConfig {
  recommendedType: string;
  activeDriver: 'mysql' | 'mariadb' | 'sqlite' | 'postgres';
  host: string;
  port: number;
  database: string;
  user: string;
  passwordMasked: string;
  charset: string;
  status: 'connected' | 'disconnected' | 'warning';
  latencyMs: number;
  totalTables: number;
  totalRecords: number;
  databaseSizeMb: number;
  tables: Array<{ name: string; description: string; rows: number; sizeKb: number }>;
}

export interface MasterTokensConfig {
  mercadopagoPublicKey: string;
  mercadopagoAccessToken: string;
  mercadopagoClientId: string;
  mercadopagoClientSecret: string;
  mercadopagoWebhookSecret: string;
  mercadopagoEnvironment: 'sandbox' | 'production';
  geminiApiKey: string;
  geminiModel: string;
  lastUpdated: string;
}

export interface BirthdayRecord {
  id: string;
  name: string;
  birthDate: string; // MM-DD or YYYY-MM-DD
  whatsapp: string;
  email: string;
  category: 'aluno' | 'cliente_oficina' | 'empresa_contabil' | 'assinante_elosign';
  congratulatedToday: boolean;
  congratulatedAt?: string;
  couponCode: string;
  discountPercent: number;
}

export interface FullEnrollmentData {
  id: string;
  fullName: string;
  cpf: string;
  rg: string;
  issuerOrg: string;
  birthDate: string;
  gender: string;
  email: string;
  phone: string;
  motherName: string;
  fatherName?: string;
  cep: string;
  street: string;
  number: string;
  complement?: string;
  neighborhood: string;
  city: string;
  state: string;
  previousEducation: string;
  previousSchool?: string;
  courseId: string;
  courseTitle: string;
  modality: 'online' | 'hibrido' | 'presencial_sg';
  documents: EnrollmentDocumentUploads;
  termsAccepted: boolean;
  signedAt: string;
  registrationNumber: string;
  status: 'pendente_pagamento' | 'ativa' | 'em_analise_documentos';
  paymentMethod: 'pix' | 'credit_card' | 'boleto';
  createdAt: string;
}

export interface StoredExamRecord {
  examId: string;
  title: string;
  score: number;
  maxPoints: number;
  date: string;
  category: string;
  verifiedBy: string;
  certificateHash?: string;
  feedback?: string;
}

export interface CourseUpdateRecord {
  year: number;
  title: string;
  hours: number;
  status: 'atualizado' | 'em_andamento';
  badge: string;
}

export interface ValidatedInternshipRecord {
  id: string;
  vacancyId?: string;
  companyName: string;
  title: string;
  hoursValidated: number;
  completionDate: string;
  supervisor: string;
  validationCode: string;
  certificateMention: string;
  status: 'validado' | 'em_andamento' | 'pendente_analise';
}

export interface CooperativeMember {
  id: string;
  userId: string;
  name: string;
  avatar: string;
  registrationNumber: string;
  courseTitle: string;
  courseCategory: string;
  city: string;
  overallAverage: number;
  completionPercentage: number;
  topPerformerBadge: boolean;
  bio: string;
  technicalSkills: string[];
  storedExams: StoredExamRecord[];
  courseUpdates: CourseUpdateRecord[];
  validatedInternships?: ValidatedInternshipRecord[];
  totalInternshipHours?: number;
  contactPhone: string;
  contactEmail: string;
  availableForHire: boolean;
  linkedinOrPortfolio?: string;
  resumeSummary: string;
  hasConcludedCourse?: boolean; // Se for aluno concluinte de cursos
  badgeIssued?: boolean; // Crachá funcional da cooperativa emitido
  badgeStatus?: 'ativo' | 'isento_concluinte' | 'anuidade_pendente' | 'renovado';
  badgeAnnualRenewalFee?: number; // Cobrado na anuidade para renovação se não for aluno concluinte
  isBadgeRenewalExempt?: boolean; // NÃO será cobrado se for aluno concluinte de cursos
}

export interface JobVacancy {
  id: string;
  title: string;
  companyName: string;
  companyLogo?: string;
  location: string;
  salaryRange: string;
  type: 'clt' | 'pj' | 'estagio' | 'prestador_servico';
  category: 'Mecânica e Máquinas' | 'Contabilidade e Gestão' | 'Tecnologia e Software' | 'Geral';
  description: string;
  requirements: string[];
  benefits: string[];
  contactEmail: string;
  contactPhone: string;
  createdAt: string;
  status: 'open' | 'filled';
  applicantsCount: number;
  // Campos de estágio opcional para validação
  isOptionalInternship?: boolean;
  internshipHours?: number;
  modality?: 'presencial' | 'remoto' | 'hibrido';
  supervisorName?: string;
  supervisorRole?: string;
  allowCourseValidation?: boolean;
}

export interface JobApplication {
  id: string;
  vacancyId: string;
  vacancyTitle: string;
  memberId: string;
  memberName: string;
  appliedAt: string;
  status: 'em_analise' | 'entrevista_agendada' | 'aprovado' | 'banco_reserva' | 'estagio_iniciado' | 'estagio_concluido';
  coverNote?: string;
  isInternship?: boolean;
  internshipHours?: number;
  companySupervisor?: string;
  validationCode?: string;
  validatedAt?: string;
  validationHoursAwarded?: number;
  supervisorEvaluation?: string;
}

// ==========================================
// SERVIDOR DE E-MAIL & WEBMAIL (PHPMailer Engine)
// Subdomínio: webmail.grupoeloizio.com.br
// ==========================================

export interface EmailAttachment {
  id: string;
  name: string;
  size: string;
  type: string;
  url: string;
  contentBase64?: string;
}

export interface EmailMessage {
  id: string;
  mailbox: string;
  folder: 'inbox' | 'sent' | 'drafts' | 'trash' | 'spam';
  fromName: string;
  fromEmail: string;
  to: string[];
  subject: string;
  date: string;
  timestamp: number;
  read: boolean;
  starred: boolean;
  bodyHtml: string;
  attachments: EmailAttachment[];
}

export interface MailboxAccount {
  id: string;
  email: string;
  name: string;
  role: 'admin' | 'student' | 'subscriber' | 'support';
  plan: 'vanguard_student' | 'subscriber_pro' | 'subscriber_enterprise' | 'admin_unlimited';
  quotaMb: number;
  usedMb: number;
  status: 'active' | 'suspended' | 'pending_payment';
  isStudentFree: boolean;
  course?: string;
  subscriptionPaymentStatus?: 'free_for_student' | 'paid_mercadopago' | 'pending_mercadopago';
  subscriptionExpiresAt?: string;
  createdAt: string;
}

export interface WhatsAppMediaAttachment {
  type: 'audio' | 'video' | 'pdf' | 'image';
  url: string;
  fileName: string;
  mimeType?: string;
  size?: string;
  duration?: number;
  pages?: number;
}

export interface WhatsAppMessage {
  id: string;
  instanceId: string;
  chatPhone: string;
  chatName: string;
  fromMe: boolean;
  type: 'text' | 'audio' | 'video' | 'pdf' | 'image';
  text: string;
  timestamp: string;
  status: 'sent' | 'delivered' | 'read';
  media?: WhatsAppMediaAttachment | null;
}

export interface WhatsAppInstance {
  id: string;
  name: string;
  phone: string;
  phoneDisplay: string;
  role: 'admin_master' | 'student' | 'subscriber';
  isMaster: boolean;
  status: 'connected' | 'connecting' | 'disconnected';
  battery: number;
  plan: 'vanguard_student' | 'subscriber_pro' | 'subscriber_enterprise';
  isStudentFree: boolean;
  subscriptionActive?: boolean;
  mercadoPagoPaymentId?: string;
  qrCode?: string | null;
  pairingCode?: string;
  createdAt: string;
  lastActive: string;
  totalSent: number;
  totalReceived: number;
  webhookUrl?: string;
}

export interface EloSignSigner {
  id: string;
  name: string;
  email: string;
  phone: string;
  cpf: string;
  order: number;
  status: 'waiting' | 'signed' | 'refused';
  signedAt?: string | null;
  ip?: string | null;
  userAgent?: string | null;
  signatureBase64?: string | null;
  selfieUrl?: string | null;
  documentPhotoUrl?: string | null;
}

export interface EloSignEnvelope {
  id: string;
  title: string;
  summary: string;
  whatsappMessage: string;
  status: 'draft' | 'pending' | 'signed' | 'expired';
  templateId?: string;
  authMethod: 'email_sms' | 'selfie_dynamic' | 'selfie_doc' | 'pix_valida';
  originalSha256: string;
  finalSha256?: string | null;
  createdAt: string;
  signedAt?: string | null;
  signers: EloSignSigner[];
  variables: Record<string, string>;
  rawText?: string;
  pdfDataUrl?: string;
  signedPdfDataUrl?: string;
  brandName?: string;
  brandLogo?: string;
  brandColor?: string;
}

export interface EloSignTemplate {
  id: string;
  title: string;
  category: string;
  description: string;
  content: string;
  variables: string[];
}

export interface EloSignSettings {
  workshopName: string;
  primaryColor: string;
  logoUrl: string;
  apiKey: string;
  currentPlan: 'start' | 'pro' | 'enterprise';
  docsUsedThisMonth: number;
  docsLimit: number;
}





