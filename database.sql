-- ==============================================================================
-- EduVanguard - Esquema de Banco de Dados Relacional (MySQL / MariaDB / PostgreSQL)
-- Sistema de Gestão Escolar, Cursos Online, Leads e Controle de Acesso
-- ==============================================================================

SET NAMES utf8mb4;
SET FOREIGN_KEY_CHECKS = 0;

-- 1. Tabela de Usuários & Controle de Acesso (RBAC)
CREATE TABLE IF NOT EXISTS `users` (
  `id` VARCHAR(64) NOT NULL PRIMARY KEY,
  `name` VARCHAR(150) NOT NULL,
  `email` VARCHAR(150) NOT NULL UNIQUE,
  `password_hash` VARCHAR(255) NOT NULL,
  `role` ENUM('student', 'teacher', 'admin') NOT NULL DEFAULT 'student',
  `avatar` VARCHAR(255) NULL,
  `cpf` VARCHAR(20) NULL,
  `registration_number` VARCHAR(50) NOT NULL UNIQUE, -- Matrícula / Registro Acadêmico
  `course_id` VARCHAR(64) NULL,
  `department` VARCHAR(100) NULL,
  `phone` VARCHAR(30) NULL,
  `status` ENUM('active', 'suspended', 'graduated') NOT NULL DEFAULT 'active',
  `encrypted_data_hash` VARCHAR(128) NULL,
  `created_at` TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
  `updated_at` TIMESTAMP DEFAULT CURRENT_TIMESTAMP ON UPDATE CURRENT_TIMESTAMP
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_unicode_ci;

-- 2. Tabela de Cursos da Vitrine
CREATE TABLE IF NOT EXISTS `courses` (
  `id` VARCHAR(64) NOT NULL PRIMARY KEY,
  `title` VARCHAR(200) NOT NULL,
  `short_description` VARCHAR(255) NOT NULL,
  `full_description` TEXT NOT NULL,
  `category` ENUM('Tecnologia', 'Negócios', 'Saúde', 'Design', 'Educação', 'Engenharia') NOT NULL,
  `price` DECIMAL(10,2) NOT NULL DEFAULT 0.00,
  `installments` INT NOT NULL DEFAULT 12,
  `workload_hours` INT NOT NULL DEFAULT 120,
  `level` ENUM('Iniciante', 'Intermediário', 'Avançado') NOT NULL DEFAULT 'Iniciante',
  `instructor_id` VARCHAR(64) NOT NULL,
  `instructor_name` VARCHAR(150) NOT NULL,
  `instructor_title` VARCHAR(150) NOT NULL,
  `thumbnail` VARCHAR(255) NOT NULL,
  `featured` TINYINT(1) NOT NULL DEFAULT 0,
  `enrolled_students_count` INT NOT NULL DEFAULT 0,
  `rating` DECIMAL(3,2) NOT NULL DEFAULT 5.00,
  `tags` TEXT NULL, -- Formato JSON ou separado por vírgula
  `created_at` TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
  INDEX idx_category (`category`),
  INDEX idx_featured (`featured`)
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_unicode_ci;

-- 3. Módulos do Curso
CREATE TABLE IF NOT EXISTS `course_modules` (
  `id` VARCHAR(64) NOT NULL PRIMARY KEY,
  `course_id` VARCHAR(64) NOT NULL,
  `title` VARCHAR(200) NOT NULL,
  `description` TEXT NULL,
  `order_index` INT NOT NULL DEFAULT 1,
  FOREIGN KEY (`course_id`) REFERENCES `courses`(`id`) ON DELETE CASCADE
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_unicode_ci;

-- 4. Aulas e Vídeos
CREATE TABLE IF NOT EXISTS `lessons` (
  `id` VARCHAR(64) NOT NULL PRIMARY KEY,
  `module_id` VARCHAR(64) NOT NULL,
  `title` VARCHAR(200) NOT NULL,
  `description` TEXT NULL,
  `duration_minutes` INT NOT NULL DEFAULT 30,
  `video_url` VARCHAR(255) NOT NULL,
  `transcript` LONGTEXT NULL,
  `order_index` INT NOT NULL DEFAULT 1,
  FOREIGN KEY (`module_id`) REFERENCES `course_modules`(`id`) ON DELETE CASCADE
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_unicode_ci;

-- 5. Progresso de Conclusão de Aulas
CREATE TABLE IF NOT EXISTS `lesson_completions` (
  `id` VARCHAR(64) NOT NULL PRIMARY KEY,
  `student_id` VARCHAR(64) NOT NULL,
  `lesson_id` VARCHAR(64) NOT NULL,
  `completed_at` TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
  UNIQUE KEY `uniq_student_lesson` (`student_id`, `lesson_id`)
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_unicode_ci;

-- 6. Boletim Escolar & Notas (P1, P2, Trabalho, Média Final)
CREATE TABLE IF NOT EXISTS `grades` (
  `id` VARCHAR(64) NOT NULL PRIMARY KEY,
  `student_id` VARCHAR(64) NOT NULL,
  `course_id` VARCHAR(64) NOT NULL,
  `subject` VARCHAR(150) NOT NULL,
  `p1` DECIMAL(4,2) NOT NULL DEFAULT 0.00,
  `p2` DECIMAL(4,2) NOT NULL DEFAULT 0.00,
  `assignment` DECIMAL(4,2) NOT NULL DEFAULT 0.00,
  `final_exam` DECIMAL(4,2) NULL,
  `average` DECIMAL(4,2) NOT NULL DEFAULT 0.00,
  `status` ENUM('Aprovado', 'Recuperação', 'Reprovado', 'Em Andamento') NOT NULL DEFAULT 'Em Andamento',
  `updated_at` TIMESTAMP DEFAULT CURRENT_TIMESTAMP ON UPDATE CURRENT_TIMESTAMP,
  FOREIGN KEY (`student_id`) REFERENCES `users`(`id`) ON DELETE CASCADE,
  INDEX idx_student_grades (`student_id`)
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_unicode_ci;

-- 7. Registro de Presença em Tempo Real
CREATE TABLE IF NOT EXISTS `attendance` (
  `id` VARCHAR(64) NOT NULL PRIMARY KEY,
  `student_id` VARCHAR(64) NOT NULL,
  `subject` VARCHAR(150) NOT NULL,
  `attendance_date` DATE NOT NULL,
  `status` ENUM('present', 'absent', 'justified') NOT NULL DEFAULT 'present',
  `verified_code` VARCHAR(50) NULL,
  `created_at` TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
  FOREIGN KEY (`student_id`) REFERENCES `users`(`id`) ON DELETE CASCADE
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_unicode_ci;

-- 8. Provas e Avaliações Online
CREATE TABLE IF NOT EXISTS `exams` (
  `id` VARCHAR(64) NOT NULL PRIMARY KEY,
  `course_id` VARCHAR(64) NOT NULL,
  `title` VARCHAR(200) NOT NULL,
  `description` TEXT NULL,
  `type` ENUM('quiz', 'exam', 'assignment') NOT NULL DEFAULT 'quiz',
  `due_date` DATETIME NOT NULL,
  `duration_minutes` INT NOT NULL DEFAULT 60,
  `total_points` INT NOT NULL DEFAULT 10,
  `questions_json` LONGTEXT NULL,
  `instructions` TEXT NULL,
  `created_at` TIMESTAMP DEFAULT CURRENT_TIMESTAMP
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_unicode_ci;

-- 9. Entregas de Avaliações pelos Alunos
CREATE TABLE IF NOT EXISTS `student_submissions` (
  `id` VARCHAR(64) NOT NULL PRIMARY KEY,
  `exam_id` VARCHAR(64) NOT NULL,
  `student_id` VARCHAR(64) NOT NULL,
  `submitted_at` TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
  `status` ENUM('submitted', 'graded', 'late') NOT NULL DEFAULT 'submitted',
  `score` DECIMAL(4,2) NULL,
  `feedback` TEXT NULL,
  `answers_json` LONGTEXT NULL,
  `file_url` VARCHAR(255) NULL,
  FOREIGN KEY (`student_id`) REFERENCES `users`(`id`) ON DELETE CASCADE
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_unicode_ci;

-- 10. Emissão de Documentos Acadêmicos (Carteirinha DNE, Certificado, etc.)
CREATE TABLE IF NOT EXISTS `document_requests` (
  `id` VARCHAR(64) NOT NULL PRIMARY KEY,
  `student_id` VARCHAR(64) NOT NULL,
  `student_name` VARCHAR(150) NOT NULL,
  `type` ENUM('student_id_card', 'certificate', 'transcript', 'enrollment_declaration') NOT NULL,
  `title` VARCHAR(200) NOT NULL,
  `requested_at` TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
  `status` ENUM('pending_payment', 'processing', 'ready', 'rejected') NOT NULL DEFAULT 'pending_payment',
  `fee` DECIMAL(10,2) NOT NULL DEFAULT 0.00,
  `payment_method` ENUM('pix', 'credit_card', 'boleto') NULL,
  `payment_id` VARCHAR(100) NULL,
  `download_url` VARCHAR(255) NULL,
  `verification_code` VARCHAR(100) NULL,
  `hash_icp` VARCHAR(128) NULL,
  `expires_at` DATE NULL,
  FOREIGN KEY (`student_id`) REFERENCES `users`(`id`) ON DELETE CASCADE
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_unicode_ci;

-- 11. Transações Financeiras & Pagamentos Mercado Pago
CREATE TABLE IF NOT EXISTS `financial_transactions` (
  `id` VARCHAR(64) NOT NULL PRIMARY KEY,
  `student_id` VARCHAR(64) NOT NULL,
  `student_name` VARCHAR(150) NOT NULL,
  `description` VARCHAR(255) NOT NULL,
  `amount` DECIMAL(10,2) NOT NULL,
  `due_date` DATE NOT NULL,
  `paid_at` DATETIME NULL,
  `status` ENUM('paid', 'pending', 'overdue') NOT NULL DEFAULT 'pending',
  `method` ENUM('pix', 'credit_card', 'boleto') NOT NULL DEFAULT 'pix',
  `mercado_pago_payment_id` VARCHAR(100) NULL,
  `barcode` VARCHAR(100) NULL,
  `qr_code_pix` TEXT NULL,
  `installments` INT NOT NULL DEFAULT 1,
  `invoice_url` VARCHAR(255) NULL,
  `created_at` TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
  INDEX idx_status (`status`)
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_unicode_ci;

-- 12. Leads de Marketing & Sofia IA (Vendas & Atendimento)
CREATE TABLE IF NOT EXISTS `marketing_leads` (
  `id` VARCHAR(64) NOT NULL PRIMARY KEY,
  `name` VARCHAR(150) NOT NULL,
  `email` VARCHAR(150) NOT NULL,
  `phone` VARCHAR(30) NOT NULL,
  `course_interest` VARCHAR(150) NOT NULL,
  `source` VARCHAR(50) NOT NULL DEFAULT 'chat_sofia',
  `status` ENUM('novo', 'contatado', 'proposta_enviada', 'matriculado', 'perdido') NOT NULL DEFAULT 'proposta_enviada',
  `proposal_code` VARCHAR(50) NOT NULL,
  `discount_percentage` INT NOT NULL DEFAULT 15,
  `notes` TEXT NULL,
  `created_at` TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
  INDEX idx_lead_status (`status`),
  INDEX idx_proposal (`proposal_code`)
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_unicode_ci;

-- 13. Mensagens de Chat & Comunicação Interna
CREATE TABLE IF NOT EXISTS `chat_messages` (
  `id` VARCHAR(64) NOT NULL PRIMARY KEY,
  `sender_id` VARCHAR(64) NOT NULL,
  `sender_name` VARCHAR(150) NOT NULL,
  `sender_role` ENUM('student', 'teacher', 'admin') NOT NULL,
  `avatar` VARCHAR(255) NULL,
  `content` TEXT NOT NULL,
  `course_id` VARCHAR(64) NULL,
  `created_at` TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
  INDEX idx_chat_course (`course_id`)
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_unicode_ci;

-- 14. Tickets de Suporte / Help Desk
CREATE TABLE IF NOT EXISTS `support_tickets` (
  `id` VARCHAR(64) NOT NULL PRIMARY KEY,
  `user_id` VARCHAR(64) NOT NULL,
  `user_name` VARCHAR(150) NOT NULL,
  `user_role` ENUM('student', 'teacher', 'admin') NOT NULL,
  `subject` VARCHAR(200) NOT NULL,
  `category` VARCHAR(100) NOT NULL,
  `priority` ENUM('baixa', 'media', 'alta', 'critica') NOT NULL DEFAULT 'media',
  `status` ENUM('open', 'in_progress', 'resolved', 'closed') NOT NULL DEFAULT 'open',
  `created_at` TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
  `updated_at` TIMESTAMP DEFAULT CURRENT_TIMESTAMP ON UPDATE CURRENT_TIMESTAMP
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_unicode_ci;

-- 15. Auditoria & Integração ERP (TOTVS, SAP, Senior)
CREATE TABLE IF NOT EXISTS `erp_logs` (
  `id` VARCHAR(64) NOT NULL PRIMARY KEY,
  `target_system` VARCHAR(50) NOT NULL,
  `action` VARCHAR(100) NOT NULL,
  `status` ENUM('success', 'failed', 'pending') NOT NULL DEFAULT 'success',
  `records_affected` INT NOT NULL DEFAULT 0,
  `payload_summary` TEXT NULL,
  `sha256_hash` VARCHAR(128) NOT NULL,
  `created_at` TIMESTAMP DEFAULT CURRENT_TIMESTAMP
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_unicode_ci;

-- 16. Certificados Digitais & Validação Pública de Autenticidade (MEC / ICP-Edu)
CREATE TABLE IF NOT EXISTS `certificate_validations` (
  `id` VARCHAR(64) NOT NULL PRIMARY KEY,
  `student_id` VARCHAR(64) NOT NULL,
  `student_name` VARCHAR(150) NOT NULL,
  `course_id` VARCHAR(64) NOT NULL,
  `course_title` VARCHAR(200) NOT NULL,
  `workload_hours` INT NOT NULL DEFAULT 120,
  `validation_hash` VARCHAR(128) NOT NULL UNIQUE,
  `book_number` VARCHAR(20) NOT NULL DEFAULT 'Livro 04',
  `sheet_number` VARCHAR(20) NOT NULL DEFAULT 'Folha 89',
  `registry_number` VARCHAR(50) NOT NULL UNIQUE,
  `final_grade` DECIMAL(4,2) NOT NULL DEFAULT 9.50,
  `completion_date` DATE NOT NULL,
  `issued_at` TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
  `status` ENUM('valido', 'suspenso', 'revogado') NOT NULL DEFAULT 'valido',
  INDEX idx_hash (`validation_hash`),
  INDEX idx_student_cert (`student_id`)
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_unicode_ci;

-- 17. Registro de Webhooks do Mercado Pago (IPN & Notificações de Pagamento)
CREATE TABLE IF NOT EXISTS `mercadopago_webhooks` (
  `id` VARCHAR(64) NOT NULL PRIMARY KEY,
  `event_id` VARCHAR(100) NOT NULL,
  `event_type` VARCHAR(50) NOT NULL,
  `payment_id` VARCHAR(100) NULL,
  `status` VARCHAR(50) NOT NULL,
  `payload_json` LONGTEXT NULL,
  `received_at` TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
  INDEX idx_mp_payment (`payment_id`)
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_unicode_ci;

-- 18. Cofre de Tokens & Chaves de Integração (API Vault)
CREATE TABLE IF NOT EXISTS `integration_tokens_vault` (
  `id` VARCHAR(64) NOT NULL PRIMARY KEY,
  `name` VARCHAR(150) NOT NULL,
  `category` ENUM('payment', 'communication', 'ai', 'erp', 'government', 'webhook', 'custom') NOT NULL,
  `service` VARCHAR(100) NOT NULL,
  `primary_token` TEXT NOT NULL,
  `secondary_key` VARCHAR(255) NULL,
  `secret_key` TEXT NULL,
  `endpoint_url` VARCHAR(255) NULL,
  `environment` ENUM('sandbox', 'production') NOT NULL DEFAULT 'production',
  `status` ENUM('active', 'testing', 'inactive', 'error') NOT NULL DEFAULT 'active',
  `auto_sync` BOOLEAN NOT NULL DEFAULT TRUE,
  `notes` TEXT NULL,
  `last_ping_at` TIMESTAMP NULL,
  `created_at` TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
  `updated_at` TIMESTAMP DEFAULT CURRENT_TIMESTAMP ON UPDATE CURRENT_TIMESTAMP,
  INDEX idx_service_cat (`service`, `category`)
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_unicode_ci;

-- 19. Histórico e Gerenciador de Atualizações Futuras do Sistema
CREATE TABLE IF NOT EXISTS `system_updates_history` (
  `id` VARCHAR(64) NOT NULL PRIMARY KEY,
  `version` VARCHAR(50) NOT NULL,
  `applied_by` VARCHAR(150) NOT NULL,
  `status` ENUM('success', 'rolled_back') NOT NULL DEFAULT 'success',
  `description` TEXT NOT NULL,
  `migrations_applied_json` TEXT NULL,
  `applied_at` TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
  INDEX idx_version (`version`)
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_unicode_ci;


-- ==============================================================================
-- Carga Inicial de Dados (Seed Inicial)
-- ==============================================================================

-- Usuários Padrão para Acesso aos Portais
-- Senha padrão inicial: 'vanguard123' (Hash bcrypt)
INSERT INTO `users` (`id`, `name`, `email`, `password_hash`, `role`, `avatar`, `cpf`, `registration_number`, `course_id`, `department`, `phone`, `status`, `encrypted_data_hash`)
VALUES
('user_ceo_eloizio', 'Eloizio Silva (CEO)', 'mecanicoeloizio@gmail.com', '$2y$10$e8wJtG4e2aI1QvYpIu8gLe8yT7B7t2v9pG1vX1k2l3m4n5o6p7q8r', 'admin', 'https://images.unsplash.com/photo-1507003211169-0a1dd7228f2d?auto=format&fit=crop&q=80&w=250', '128.***.***-34', 'CEO-2026-0001', NULL, 'Diretoria Geral & Grupo Eloizio', '(21) 98764-8727', 'active', '9a8b7c6d5e4f3a2b1c0d9e8f7a6b5c4d3e2f1a0b5c4d3e2f1a0b9a8b7c6d5e4f'),
('user_admin_camilla', 'Camilla Faria', 'camilla@grupoeloizio.com.br', '$2y$10$e8wJtG4e2aI1QvYpIu8gLe8yT7B7t2v9pG1vX1k2l3m4n5o6p7q8r', 'admin', 'https://images.unsplash.com/photo-1534528741775-53994a69daeb?auto=format&fit=crop&q=80&w=250', '219.***.***-60', 'GER-2026-0002', NULL, 'Gerência Geral & Atendimento Inteligente', '(21) 99613-4073', 'active', '8b7c6d5e4f3a2b1c0d9e8f7a6b5c4d3e2f1a0b5c4d3e2f1a0b9a8b7c6d5e4f9a'),
('user_student_1', 'Lucas Silva Prado', 'lucas.silva@aluno.eduvanguard.com.br', '$2y$10$e8wJtG4e2aI1QvYpIu8gLe8yT7B7t2v9pG1vX1k2l3m4n5o6p7q8r', 'student', 'https://images.unsplash.com/photo-1534528741775-53994a69daeb?auto=format&fit=crop&q=80&w=250', '348.***.***-89', 'MAT-2026-9812', 'course_1', NULL, '(11) 98765-4321', 'active', 'e3b0c44298fc1c149afbf4c8996fb92427ae41e4649b934ca495991b7852b855'),
('user_teacher_1', 'Profa. Dra. Mariana Fernandes', 'mariana.fernandes@professor.eduvanguard.com.br', '$2y$10$e8wJtG4e2aI1QvYpIu8gLe8yT7B7t2v9pG1vX1k2l3m4n5o6p7q8r', 'teacher', 'https://images.unsplash.com/photo-1573496359142-b8d87734a5a2?auto=format&fit=crop&q=80&w=250', NULL, 'DOC-2024-4011', NULL, 'Departamento de Tecnologia & Inovação', '(11) 97123-9988', 'active', '7f83b1657ff1fc53b92dc18148a1d65dfc2d4b1fa3d677284addd200126d9069'),
('user_admin_1', 'Carlos Alberto Mendes', 'carlos.mendes@direcao.eduvanguard.com.br', '$2y$10$e8wJtG4e2aI1QvYpIu8gLe8yT7B7t2v9pG1vX1k2l3m4n5o6p7q8r', 'admin', 'https://images.unsplash.com/photo-1507003211169-0a1dd7228f2d?auto=format&fit=crop&q=80&w=250', NULL, 'DIR-2022-0001', NULL, 'Diretoria Geral & Gestão Acadêmica', '(11) 99887-1122', 'active', '6b86b273ff34fce19d6b804eff5a3f5747ada4eaa22f1d49c01e52ddb7875b4b')
ON DUPLICATE KEY UPDATE `name`=VALUES(`name`);

-- Cursos em Destaque na Vitrine
INSERT INTO `courses` (`id`, `title`, `short_description`, `full_description`, `category`, `price`, `installments`, `workload_hours`, `level`, `instructor_id`, `instructor_name`, `instructor_title`, `thumbnail`, `featured`, `enrolled_students_count`, `rating`, `tags`)
VALUES
('course_1', 'Engenharia de Software Moderna & Arquitetura Cloud', 'Do design de sistemas escaláveis à computação distribuída e integração com Inteligência Artificial.', 'Este curso completo de nível superior desenvolve competências sólidas em microsserviços, DevOps, segurança de software, banco de dados distribuídos e automação em nuvem com GCP e AWS.', 'Tecnologia', 1890.00, 12, 360, 'Avançado', 'user_teacher_1', 'Profa. Dra. Mariana Fernandes', 'Doutora em Ciência da Computação pela USP', 'https://images.unsplash.com/photo-1517694712202-14dd9538aa97?auto=format&fit=crop&q=80&w=800', 1, 342, 4.95, '["Arquitetura", "Cloud", "TypeScript", "DevOps", "Clean Architecture"]'),
('course_2', 'Gestão Estratégica de Negócios & Liderança Digital', 'Metodologias ágeis, OKRs, inteligência financeira e liderança de times remotos.', 'Aprenda as práticas executivas mais modernas do mercado global. Focado em tomadores de decisão que desejam escalar operações.', 'Negócios', 1450.00, 12, 280, 'Intermediário', 'user_teacher_1', 'Profa. Dra. Mariana Fernandes', 'Consultora de Negócios e Mestre em Gestão', 'https://images.unsplash.com/photo-1460925895917-afdab827c52f?auto=format&fit=crop&q=80&w=800', 1, 289, 4.88, '["Gestão", "Liderança", "Agile", "OKRs", "Negócios"]'),
('course_3', 'Design de Interfaces (UI/UX) & Experiência Centrada no Usuário', 'Figma avançado, Design Systems, testes de usabilidade e prototipagem interativa.', 'Domine os fundamentos do Design Thinking à entrega de interfaces digitais de alta fidelidade para web e aplicativos móveis.', 'Design', 1290.00, 12, 200, 'Iniciante', 'user_teacher_1', 'Profa. Dra. Mariana Fernandes', 'Especialista em Experiência do Usuário', 'https://images.unsplash.com/photo-1581291518633-83b4ebd1d83e?auto=format&fit=crop&q=80&w=800', 1, 415, 4.92, '["UI", "UX", "Figma", "Design System", "Mobile"]')
ON DUPLICATE KEY UPDATE `title`=VALUES(`title`);

-- Leads Iniciais no Funil de Vendas da Sofia IA
INSERT INTO `marketing_leads` (`id`, `name`, `email`, `phone`, `course_interest`, `source`, `status`, `proposal_code`, `discount_percentage`, `notes`)
VALUES
('lead_1', 'Rafael Guimarães Albuquerque', 'rafael.guimaraes@gmail.com', '(11) 98844-3322', 'Engenharia de Software Moderna & Arquitetura Cloud', 'chat_sofia', 'proposta_enviada', 'PROP-SOFIA-8821', 15, 'Interesse alto em transição de carreira para Tech. Solicitou informações sobre o cupom SOFIA15.'),
('lead_2', 'Camila Vasconcelos', 'camila.vasconcelos@hotmail.com', '(21) 97722-1100', 'Gestão Estratégica de Negócios & Liderança Digital', 'whatsapp_direto', 'matriculado', 'PROP-SOFIA-7734', 15, 'Matrícula efetuada via Mercado Pago após atendimento da Sofia Especialista Virtual.'),
('lead_3', 'Thiago Rocha', 'thiago.rocha@outlook.com', '(31) 99112-4455', 'Design de Interfaces (UI/UX)', 'vitrine_hero', 'novo', 'PROP-SOFIA-4419', 15, 'Aguardando envio de proposta personalizada por e-mail.')
ON DUPLICATE KEY UPDATE `name`=VALUES(`name`);

SET FOREIGN_KEY_CHECKS = 1;
