-- ==============================================================================
-- GRUPO ELOIZIO - ESQUEMA DE BANCO DE DADOS UNIFICADO (MySQL 8.0 & SQLite)
-- Subdomínio Central: grupoeloizio.com.br
-- Integrando: EloMak, EloContábil, EloSign, Cursos Online e Oficina Mecânica
-- Atendente Oficial: Camilla Faria (21 99613-4073)
-- Recebimentos: Mercado Pago Oficial
-- ==============================================================================

SET NAMES utf8mb4;
SET FOREIGN_KEY_CHECKS = 0;

-- 1. Clientes Unificados do Ecossistema Grupo Eloizio
CREATE TABLE IF NOT EXISTS `clientes_unificados` (
  `id` INT AUTO_INCREMENT PRIMARY KEY,
  `whatsapp` VARCHAR(30) NOT NULL UNIQUE,
  `email` VARCHAR(150) NULL,
  `nome` VARCHAR(150) NOT NULL,
  `cpf` VARCHAR(20) NULL,
  `cidade` VARCHAR(100) DEFAULT 'São Gonçalo - RJ',
  `data_nascimento` DATE NULL, -- Para felicitações da Camilla no 1º horário útil (08:00) com 15% OFF
  `tipo_perfil` ENUM('cliente_oficina', 'aluno_curso', 'empresa_contabil', 'parceiro_mecanico') DEFAULT 'cliente_oficina',
  `projetos_ativos` JSON NULL, -- Ex: ["elomak", "elocontabil", "cursos"]
  `total_gasto` DECIMAL(10,2) DEFAULT 0.00,
  `criado_em` DATETIME DEFAULT CURRENT_TIMESTAMP,
  `atualizado_em` DATETIME DEFAULT CURRENT_TIMESTAMP ON UPDATE CURRENT_TIMESTAMP,
  INDEX `idx_cli_whatsapp` (`whatsapp`),
  INDEX `idx_cli_email` (`email`)
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_unicode_ci;

-- 2. Pagamentos Centralizados Mercado Pago (Todos os Projetos)
CREATE TABLE IF NOT EXISTS `pagamentos_centralizados` (
  `id` INT AUTO_INCREMENT PRIMARY KEY,
  `transacao_mp_id` VARCHAR(100) UNIQUE,
  `projeto_origem` ENUM('elomak', 'elocontabil', 'elosign', 'cursos', 'oficina', 'central') NOT NULL,
  `referencia_externa` VARCHAR(100) NOT NULL,
  `pagador_nome` VARCHAR(150) NULL,
  `pagador_email` VARCHAR(150) NULL,
  `pagador_whatsapp` VARCHAR(30) NULL,
  `valor` DECIMAL(10,2) NOT NULL,
  `status` ENUM('pending', 'approved', 'rejected', 'refunded') DEFAULT 'pending',
  `metodo` VARCHAR(30) DEFAULT 'pix',
  `link_pagamento` TEXT NULL,
  `pix_copia_cola` TEXT NULL,
  `pix_qr_base64` LONGTEXT NULL,
  `notificado_camilla` TINYINT(1) DEFAULT 0,
  `callback_projeto_status` TINYINT(1) DEFAULT 0,
  `criado_em` DATETIME DEFAULT CURRENT_TIMESTAMP,
  `atualizado_em` DATETIME DEFAULT CURRENT_TIMESTAMP ON UPDATE CURRENT_TIMESTAMP,
  INDEX `idx_pag_origem` (`projeto_origem`),
  INDEX `idx_pag_ref` (`referencia_externa`),
  INDEX `idx_pag_status` (`status`)
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_unicode_ci;

-- 3. Interações & Atendimentos Inteligentes da Camilla Faria
CREATE TABLE IF NOT EXISTS `interacoes_camilla` (
  `id` INT AUTO_INCREMENT PRIMARY KEY,
  `whatsapp` VARCHAR(30) NOT NULL,
  `canal` VARCHAR(30) DEFAULT 'whatsapp',
  `projeto_direcionado` VARCHAR(50) DEFAULT 'central',
  `mensagem_cliente` TEXT NOT NULL,
  `resposta_camilla` LONGTEXT NOT NULL,
  `midia_anexo` VARCHAR(255) NULL,
  `diagnostico_ia` TEXT NULL,
  `chamou_eloizio` TINYINT(1) DEFAULT 0,
  `criado_em` DATETIME DEFAULT CURRENT_TIMESTAMP,
  INDEX `idx_cam_zap` (`whatsapp`)
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_unicode_ci;

-- 4. Ordens de Serviço do EloMak & Oficina
CREATE TABLE IF NOT EXISTS `ordem_servico` (
  `id` INT AUTO_INCREMENT PRIMARY KEY,
  `usuario_id` INT DEFAULT 1,
  `cliente_whatsapp` VARCHAR(30) NOT NULL,
  `placa_ou_maquina` VARCHAR(50) NOT NULL,
  `defeito_relatado` TEXT NOT NULL,
  `diagnostico_tecnico` TEXT NULL,
  `status` ENUM('Pré-Atendimento', 'Aberta', 'Em Andamento', 'Aguardando Peça', 'Finalizada', 'Entregue') DEFAULT 'Aberta',
  `valor_mao_obra` DECIMAL(10,2) DEFAULT 0.00,
  `valor_pecas` DECIMAL(10,2) DEFAULT 0.00,
  `valor_total` DECIMAL(10,2) DEFAULT 0.00,
  `pago_mercadopago` TINYINT(1) DEFAULT 0,
  `transacao_mp_id` VARCHAR(100) NULL,
  `envelope_elosign_id` VARCHAR(100) NULL,
  `data_entrada` DATETIME DEFAULT CURRENT_TIMESTAMP,
  `atualizado_em` DATETIME DEFAULT CURRENT_TIMESTAMP ON UPDATE CURRENT_TIMESTAMP,
  INDEX `idx_os_status` (`status`),
  INDEX `idx_os_cliente` (`cliente_whatsapp`)
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_unicode_ci;

-- 5. EloContábil: Funcionários & RH de Apoio (Sem CRC)
CREATE TABLE IF NOT EXISTS `elocontabil_funcionarios` (
  `id` INT AUTO_INCREMENT PRIMARY KEY,
  `empresa_whatsapp` VARCHAR(30) NOT NULL,
  `nome` VARCHAR(150) NOT NULL,
  `cargo` VARCHAR(100) NOT NULL,
  `cpf` VARCHAR(20) NOT NULL,
  `admissao` DATE NOT NULL,
  `vencimento_aso` DATE NULL,
  `tamanho_uniforme` VARCHAR(20) NULL,
  `epi_entregue` TINYINT(1) DEFAULT 1,
  `status` ENUM('ativo', 'afastado', 'desligado') DEFAULT 'ativo',
  `observacoes` TEXT NULL,
  `criado_em` DATETIME DEFAULT CURRENT_TIMESTAMP
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_unicode_ci;

-- 6. EloContábil: Cofre de Documentos Administrativos
CREATE TABLE IF NOT EXISTS `elocontabil_cofre` (
  `id` INT AUTO_INCREMENT PRIMARY KEY,
  `empresa_whatsapp` VARCHAR(30) NOT NULL,
  `titulo` VARCHAR(200) NOT NULL,
  `categoria` VARCHAR(50) NOT NULL,
  `vencimento` DATE NULL,
  `status` ENUM('valido', 'vencendo', 'vencido') DEFAULT 'valido',
  `arquivo_nome` VARCHAR(255) NULL,
  `enviado_ao_contador` TINYINT(1) DEFAULT 0,
  `criado_em` DATETIME DEFAULT CURRENT_TIMESTAMP
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_unicode_ci;

-- 7. Cursos Livres 100% Online & Matrículas
CREATE TABLE IF NOT EXISTS `cursos_matriculas` (
  `id` INT AUTO_INCREMENT PRIMARY KEY,
  `curso_id` VARCHAR(64) NOT NULL,
  `aluno_whatsapp` VARCHAR(30) NOT NULL,
  `aluno_nome` VARCHAR(150) NOT NULL,
  `aluno_email` VARCHAR(150) NOT NULL,
  `status` ENUM('aguardando_pagamento', 'ativo', 'concluido') DEFAULT 'ativo',
  `progresso_porcentagem` INT DEFAULT 0,
  `nota_final` DECIMAL(4,2) DEFAULT 0.00,
  `certificado_hash` VARCHAR(128) NULL,
  `transacao_mp_id` VARCHAR(100) NULL,
  `data_matricula` DATETIME DEFAULT CURRENT_TIMESTAMP
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_unicode_ci;

-- 8. Aniversariantes & Felicitações Automáticas Camilla Faria (1º Horário Útil: 08:00 com 15% OFF Online)
CREATE TABLE IF NOT EXISTS `aniversariantes_felicitacoes` (
  `id` INT AUTO_INCREMENT PRIMARY KEY,
  `cliente_id` INT NULL,
  `whatsapp` VARCHAR(30) NOT NULL,
  `nome` VARCHAR(150) NOT NULL,
  `data_nascimento` DATE NOT NULL,
  `ano_referencia` INT NOT NULL,
  `cupom_desconto` VARCHAR(50) DEFAULT 'PARABENS15',
  `percentual_desconto` INT DEFAULT 15,
  `status_envio` ENUM('agendado_08h', 'enviado', 'resgatado') DEFAULT 'agendado_08h',
  `mensagem_personalizada` TEXT NULL,
  `horario_disparo` DATETIME NULL,
  `resgatado_em` DATETIME NULL,
  `criado_em` DATETIME DEFAULT CURRENT_TIMESTAMP,
  INDEX `idx_aniv_data` (`data_nascimento`),
  INDEX `idx_aniv_status` (`status_envio`)
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_unicode_ci;

-- 9. Registro de Consentimento e Privacidade LGPD (Lei Federal 13.709/2018)
CREATE TABLE IF NOT EXISTS `lgpd_termos_consentimento` (
  `id` INT AUTO_INCREMENT PRIMARY KEY,
  `ip_origem` VARCHAR(45) NOT NULL,
  `whatsapp` VARCHAR(30) NULL,
  `email` VARCHAR(150) NULL,
  `origem_projeto` VARCHAR(50) NOT NULL,
  `termo_versao` VARCHAR(20) DEFAULT '2026.1',
  `aceito_em` DATETIME DEFAULT CURRENT_TIMESTAMP
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_unicode_ci;

-- 10. Inserção de Dados Iniciais de Demonstração (Incluindo Aniversariantes do Dia)
INSERT IGNORE INTO `clientes_unificados` (`whatsapp`, `email`, `nome`, `cpf`, `cidade`, `data_nascimento`, `tipo_perfil`) VALUES
('21996134073', 'camilla@grupoeloizio.com.br', 'Camilla Faria', '111.222.333-44', 'Rio de Janeiro / São Gonçalo - RJ', '1998-05-14', 'cliente_oficina'),
('21987648727', 'eloizio@grupoeloizio.com.br', 'Eloizio Assunção', '000.111.222-33', 'São Gonçalo - RJ', '1982-12-20', 'parceiro_mecanico'),
('21998877112', 'marcos.oficina@gmail.com', 'Marcos Vinicius de Oliveira', '321.654.987-00', 'São Gonçalo - RJ', '1990-10-09', 'cliente_oficina'),
('21977665544', 'claudia.confeccao@uol.com.br', 'Claudia Helena Santos', '456.789.123-55', 'Niterói - RJ', '1988-10-09', 'empresa_contabil');

-- Inserção de Felicitações Agendadas para Hoje (10 de Outubro / 09 de Outubro)
INSERT IGNORE INTO `aniversariantes_felicitacoes` (`cliente_id`, `whatsapp`, `nome`, `data_nascimento`, `ano_referencia`, `cupom_desconto`, `percentual_desconto`, `status_envio`, `mensagem_personalizada`, `horario_disparo`) VALUES
(3, '21998877112', 'Marcos Vinicius de Oliveira', '1990-10-09', 2026, 'PARABENS15', 15, 'enviado', '🎉 Parabéns Marcos! Aqui é a Camilla do Grupo Eloizio! Desejo um dia abençoado! Como presente, preparei 15% OFF com o cupom PARABENS15 para qualquer serviço ou curso pago online via Mercado Pago!', '2026-10-09 08:05:00'),
(4, '21977665544', 'Claudia Helena Santos', '1988-10-09', 2026, 'PARABENS15', 15, 'enviado', '🎂 Feliz Aniversário Claudia! Camilla da Gerência do Grupo Eloizio passando com muito carinho logo cedo! Seu presente exclusivo de 15% OFF (cupom PARABENS15) já está ativo no nosso sistema!', '2026-10-09 08:05:00');

SET FOREIGN_KEY_CHECKS = 1;
