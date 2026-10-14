-- =======================================================
-- EloMak - Sistema de Gestão Inteligente para Oficinas Mecânicas
-- Subdomínio Oficial: elomak.grupoeloizio.com.br
-- MySQL 8.0 Schema Oficial • Grupo Eloizio 2026
-- =======================================================

SET NAMES utf8mb4;
SET FOREIGN_KEY_CHECKS = 0;

-- 1. Tabela de Usuários do Sistema (Donos de Oficina / Gestores)
CREATE TABLE IF NOT EXISTS `usuarios_sistema` (
  `id` INT AUTO_INCREMENT PRIMARY KEY,
  `nome_oficina` VARCHAR(150) NOT NULL,
  `whatsapp_dono` VARCHAR(25) NOT NULL UNIQUE,
  `cnpj` VARCHAR(20) DEFAULT NULL,
  `cidade` VARCHAR(100) NOT NULL DEFAULT 'São Gonçalo - RJ',
  `endereco` VARCHAR(255) DEFAULT NULL,
  `email` VARCHAR(150) DEFAULT NULL,
  `logo` VARCHAR(255) DEFAULT NULL,
  `plano` ENUM('start', 'pro', 'enterprise') DEFAULT 'pro',
  `api_key` VARCHAR(64) DEFAULT NULL,
  `ativo` TINYINT(1) DEFAULT 1,
  `criado_em` DATETIME DEFAULT CURRENT_TIMESTAMP,
  `atualizado_em` DATETIME DEFAULT CURRENT_TIMESTAMP ON UPDATE CURRENT_TIMESTAMP,
  INDEX `idx_whatsapp_dono` (`whatsapp_dono`),
  INDEX `idx_api_key` (`api_key`)
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_unicode_ci;

-- 2. Tabela de Clientes da Oficina
CREATE TABLE IF NOT EXISTS `clientes_oficina` (
  `id` INT AUTO_INCREMENT PRIMARY KEY,
  `usuario_id` INT NOT NULL,
  `nome` VARCHAR(150) NOT NULL,
  `whatsapp` VARCHAR(25) NOT NULL,
  `telefone_fixo` VARCHAR(25) DEFAULT NULL,
  `cpf` VARCHAR(20) DEFAULT NULL,
  `cidade` VARCHAR(100) DEFAULT 'São Gonçalo - RJ',
  `endereco` VARCHAR(255) DEFAULT NULL,
  `email` VARCHAR(150) DEFAULT NULL,
  `observacoes` TEXT DEFAULT NULL,
  `criado_em` DATETIME DEFAULT CURRENT_TIMESTAMP,
  FOREIGN KEY (`usuario_id`) REFERENCES `usuarios_sistema`(`id`) ON DELETE CASCADE,
  INDEX `idx_cliente_whatsapp` (`whatsapp`),
  INDEX `idx_cliente_usuario` (`usuario_id`)
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_unicode_ci;

-- 3. Tabela de Veículos dos Clientes
CREATE TABLE IF NOT EXISTS `veiculos` (
  `id` INT AUTO_INCREMENT PRIMARY KEY,
  `cliente_id` INT NOT NULL,
  `placa` VARCHAR(10) NOT NULL,
  `marca` VARCHAR(50) NOT NULL,
  `modelo` VARCHAR(100) NOT NULL,
  `ano` VARCHAR(10) DEFAULT NULL,
  `cor` VARCHAR(30) DEFAULT NULL,
  `km_atual` INT DEFAULT 0,
  `combustivel` VARCHAR(30) DEFAULT 'Flex',
  `chassi` VARCHAR(30) DEFAULT NULL,
  `criado_em` DATETIME DEFAULT CURRENT_TIMESTAMP,
  FOREIGN KEY (`cliente_id`) REFERENCES `clientes_oficina`(`id`) ON DELETE CASCADE,
  INDEX `idx_veiculo_placa` (`placa`),
  INDEX `idx_veiculo_cliente` (`cliente_id`)
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_unicode_ci;

-- 4. Tabela de Ordens de Serviço (Core OS)
CREATE TABLE IF NOT EXISTS `ordem_servico` (
  `id` INT AUTO_INCREMENT PRIMARY KEY,
  `numero_os` VARCHAR(20) NOT NULL UNIQUE,
  `usuario_id` INT NOT NULL,
  `cliente_id` INT NOT NULL,
  `veiculo_id` INT NOT NULL,
  `mecanico_responsavel_id` INT DEFAULT NULL,
  `defeito` TEXT NOT NULL,
  `diagnostico` TEXT DEFAULT NULL,
  `laudo_tecnico` TEXT DEFAULT NULL,
  `status` ENUM('Pré-Atendimento', 'Aberta', 'Em Andamento', 'Aguardando Peça', 'Finalizada', 'Entregue', 'Cancelada') NOT NULL DEFAULT 'Aberta',
  `valor_mao_obra` DECIMAL(10,2) DEFAULT 0.00,
  `valor_pecas` DECIMAL(10,2) DEFAULT 0.00,
  `valor_desconto` DECIMAL(10,2) DEFAULT 0.00,
  `valor_total` DECIMAL(10,2) NOT NULL DEFAULT 0.00,
  `forma_pagamento` VARCHAR(50) DEFAULT 'Mercado Pago (PIX / Cartão)',
  `prazo_entrega` DATE DEFAULT NULL,
  `prazo_garantia` VARCHAR(50) DEFAULT '90 dias (Lei 8.078/90 CDC)',
  `fotos_json` JSON DEFAULT NULL,
  `elosign_envelope_id` VARCHAR(50) DEFAULT NULL,
  `data_entrada` DATETIME DEFAULT CURRENT_TIMESTAMP,
  `data_conclusao` DATETIME DEFAULT NULL,
  FOREIGN KEY (`usuario_id`) REFERENCES `usuarios_sistema`(`id`) ON DELETE CASCADE,
  FOREIGN KEY (`cliente_id`) REFERENCES `clientes_oficina`(`id`) ON DELETE CASCADE,
  FOREIGN KEY (`veiculo_id`) REFERENCES `veiculos`(`id`) ON DELETE CASCADE,
  INDEX `idx_os_status` (`status`),
  INDEX `idx_os_usuario` (`usuario_id`),
  INDEX `idx_os_data_entrada` (`data_entrada`)
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_unicode_ci;

-- 5. Itens da Ordem de Serviço (Peças e Serviços detalhados)
CREATE TABLE IF NOT EXISTS `os_itens` (
  `id` INT AUTO_INCREMENT PRIMARY KEY,
  `os_id` INT NOT NULL,
  `tipo` ENUM('servico', 'peca') NOT NULL DEFAULT 'servico',
  `produto_id` INT DEFAULT NULL,
  `descricao` VARCHAR(255) NOT NULL,
  `quantidade` DECIMAL(8,2) NOT NULL DEFAULT 1.00,
  `valor_unitario` DECIMAL(10,2) NOT NULL DEFAULT 0.00,
  `valor_total` DECIMAL(10,2) NOT NULL DEFAULT 0.00,
  FOREIGN KEY (`os_id`) REFERENCES `ordem_servico`(`id`) ON DELETE CASCADE,
  INDEX `idx_item_os` (`os_id`)
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_unicode_ci;

-- 6. Tabela de Orçamentos (Podem virar OS com 1 clique)
CREATE TABLE IF NOT EXISTS `orcamentos` (
  `id` INT AUTO_INCREMENT PRIMARY KEY,
  `numero_orcamento` VARCHAR(20) NOT NULL UNIQUE,
  `usuario_id` INT NOT NULL,
  `cliente_id` INT NOT NULL,
  `veiculo_id` INT NOT NULL,
  `descricao_servicos` TEXT NOT NULL,
  `valor_total` DECIMAL(10,2) NOT NULL DEFAULT 0.00,
  `status` ENUM('Pendente', 'Aprovado', 'Recusado', 'Convertido em OS') NOT NULL DEFAULT 'Pendente',
  `os_gerada_id` INT DEFAULT NULL,
  `validade_dias` INT DEFAULT 10,
  `criado_em` DATETIME DEFAULT CURRENT_TIMESTAMP,
  FOREIGN KEY (`usuario_id`) REFERENCES `usuarios_sistema`(`id`) ON DELETE CASCADE,
  FOREIGN KEY (`cliente_id`) REFERENCES `clientes_oficina`(`id`) ON DELETE CASCADE,
  FOREIGN KEY (`veiculo_id`) REFERENCES `veiculos`(`id`) ON DELETE CASCADE,
  INDEX `idx_orc_status` (`status`)
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_unicode_ci;

-- 7. Tabela de Produtos e Estoque (Baixa automática na OS)
CREATE TABLE IF NOT EXISTS `produtos_estoque` (
  `id` INT AUTO_INCREMENT PRIMARY KEY,
  `usuario_id` INT NOT NULL,
  `codigo` VARCHAR(50) NOT NULL,
  `descricao` VARCHAR(255) NOT NULL,
  `categoria` VARCHAR(50) DEFAULT 'Peças Mecânicas',
  `fornecedor` VARCHAR(150) DEFAULT NULL,
  `preco_custo` DECIMAL(10,2) NOT NULL DEFAULT 0.00,
  `preco_venda` DECIMAL(10,2) NOT NULL DEFAULT 0.00,
  `quantidade` DECIMAL(10,2) NOT NULL DEFAULT 0.00,
  `estoque_minimo` DECIMAL(10,2) NOT NULL DEFAULT 2.00,
  `unidade` VARCHAR(10) DEFAULT 'UN',
  `criado_em` DATETIME DEFAULT CURRENT_TIMESTAMP,
  FOREIGN KEY (`usuario_id`) REFERENCES `usuarios_sistema`(`id`) ON DELETE CASCADE,
  INDEX `idx_prod_codigo` (`codigo`),
  INDEX `idx_prod_usuario` (`usuario_id`)
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_unicode_ci;

-- 8. Movimentações de Estoque
CREATE TABLE IF NOT EXISTS `movimentacoes_estoque` (
  `id` INT AUTO_INCREMENT PRIMARY KEY,
  `produto_id` INT NOT NULL,
  `os_id` INT DEFAULT NULL,
  `tipo` ENUM('entrada', 'saida', 'ajuste') NOT NULL,
  `quantidade` DECIMAL(10,2) NOT NULL,
  `motivo` VARCHAR(255) NOT NULL,
  `criado_em` DATETIME DEFAULT CURRENT_TIMESTAMP,
  FOREIGN KEY (`produto_id`) REFERENCES `produtos_estoque`(`id`) ON DELETE CASCADE,
  INDEX `idx_mov_prod` (`produto_id`)
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_unicode_ci;

-- 9. Tabela do Módulo Financeiro (Contas a Pagar/Receber & PIX)
CREATE TABLE IF NOT EXISTS `financeiro_lancamentos` (
  `id` INT AUTO_INCREMENT PRIMARY KEY,
  `usuario_id` INT NOT NULL,
  `os_id` INT DEFAULT NULL,
  `tipo` ENUM('receita', 'despesa') NOT NULL,
  `categoria` VARCHAR(80) NOT NULL,
  `descricao` VARCHAR(255) NOT NULL,
  `valor` DECIMAL(10,2) NOT NULL,
  `status` ENUM('pendente', 'pago', 'cancelado') NOT NULL DEFAULT 'pendente',
  `data_vencimento` DATE NOT NULL,
  `data_pagamento` DATE DEFAULT NULL,
  `forma_pagamento` VARCHAR(50) DEFAULT 'PIX',
  `pix_qrcode` TEXT DEFAULT NULL,
  `criado_em` DATETIME DEFAULT CURRENT_TIMESTAMP,
  FOREIGN KEY (`usuario_id`) REFERENCES `usuarios_sistema`(`id`) ON DELETE CASCADE,
  INDEX `idx_fin_tipo` (`tipo`),
  INDEX `idx_fin_status` (`status`)
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_unicode_ci;

-- 10. Equipe de Mecânicos & Comissões
CREATE TABLE IF NOT EXISTS `equipe_mecanicos` (
  `id` INT AUTO_INCREMENT PRIMARY KEY,
  `usuario_id` INT NOT NULL,
  `nome` VARCHAR(150) NOT NULL,
  `whatsapp` VARCHAR(25) NOT NULL,
  `especialidade` VARCHAR(100) DEFAULT 'Motor & Suspensão',
  `comissao_percentual` DECIMAL(5,2) DEFAULT 10.00,
  `ativo` TINYINT(1) DEFAULT 1,
  `criado_em` DATETIME DEFAULT CURRENT_TIMESTAMP,
  FOREIGN KEY (`usuario_id`) REFERENCES `usuarios_sistema`(`id`) ON DELETE CASCADE
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_unicode_ci;

-- 11. Leads & Tokens Temporários do WhatsApp (Fluxo da Camilla)
CREATE TABLE IF NOT EXISTS `leads_whatsapp` (
  `id` INT AUTO_INCREMENT PRIMARY KEY,
  `whatsapp` VARCHAR(25) NOT NULL,
  `tipo` ENUM('dono', 'cliente', 'novo') NOT NULL DEFAULT 'novo',
  `token` VARCHAR(64) DEFAULT NULL,
  `expira_em` DATETIME DEFAULT NULL,
  `usado` TINYINT(1) DEFAULT 0,
  `status_triagem` VARCHAR(50) DEFAULT 'aguardando_opcao',
  `dados_temporarios_json` JSON DEFAULT NULL,
  `criado_em` DATETIME DEFAULT CURRENT_TIMESTAMP,
  `ultima_interacao` DATETIME DEFAULT CURRENT_TIMESTAMP ON UPDATE CURRENT_TIMESTAMP,
  INDEX `idx_lead_whatsapp` (`whatsapp`),
  INDEX `idx_lead_token` (`token`)
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_unicode_ci;

-- =======================================================
-- CARGA DE DADOS INICIAIS (Oficina EloMak - Grupo Eloizio)
-- =======================================================

INSERT INTO `usuarios_sistema` (`id`, `nome_oficina`, `whatsapp_dono`, `cnpj`, `cidade`, `endereco`, `email`, `logo`, `plano`, `api_key`)
VALUES (1, 'Oficina Mecânica EloMak & Grupo Eloizio', '5521996134073', '12.345.678/0001-90', 'São Gonçalo - RJ', 'Rua Dr. Nilo Peçanha, 450 - Centro', 'contato@grupoeloizio.com.br', 'https://images.unsplash.com/photo-1619642751034-765dfdf7c58e?auto=format&fit=crop&q=80&w=200', 'enterprise', 'elo_live_99a81e4b3c7d6e5f8812')
ON DUPLICATE KEY UPDATE `nome_oficina`=VALUES(`nome_oficina`);

INSERT INTO `clientes_oficina` (`id`, `usuario_id`, `nome`, `whatsapp`, `cpf`, `cidade`, `email`)
VALUES 
(1, 1, 'Marcos Vinicius de Oliveira', '5521998877112', '123.456.789-00', 'São Gonçalo - RJ', 'marcos.cliente@gmail.com'),
(2, 1, 'Carlos Eduardo Santos', '5521987654321', '987.654.321-99', 'Niterói - RJ', 'carlos.santos@gmail.com')
ON DUPLICATE KEY UPDATE `nome`=VALUES(`nome`);

INSERT INTO `veiculos` (`id`, `cliente_id`, `placa`, `marca`, `modelo`, `ano`, `cor`, `km_atual`)
VALUES 
(1, 1, 'RIO2026', 'Volkswagen', 'Gol G6 1.6 MSI', '2016', 'Prata', 124500),
(2, 2, 'KPW3A45', 'Chevrolet', 'Onix LTZ Turbo', '2021', 'Preto', 68200)
ON DUPLICATE KEY UPDATE `placa`=VALUES(`placa`);

INSERT INTO `ordem_servico` (`id`, `numero_os`, `usuario_id`, `cliente_id`, `veiculo_id`, `defeito`, `diagnostico`, `status`, `valor_mao_obra`, `valor_pecas`, `valor_total`, `data_entrada`)
VALUES 
(1, 'OS-2026-084', 1, 1, 1, 'Ruído metálico no motor em marcha lenta e luz de óleo acesa.', 'Folga excessiva nos mancais e retífica completa do cabeçote com troca de bielas.', 'Finalizada', 750.00, 1100.00, 1850.00, NOW() - INTERVAL 3 DAY),
(2, 'OS-2026-092', 1, 2, 2, 'Freio chiando e pedal baixo ao pisar fundo.', 'Pastilhas desgastadas e discos dianteiros abaixo da espessura mínima de segurança.', 'Em Andamento', 250.00, 430.00, 680.00, NOW() - INTERVAL 1 DAY)
ON DUPLICATE KEY UPDATE `numero_os`=VALUES(`numero_os`);

INSERT INTO `produtos_estoque` (`id`, `usuario_id`, `codigo`, `descricao`, `categoria`, `fornecedor`, `preco_custo`, `preco_venda`, `quantidade`, `estoque_minimo`)
VALUES 
(1, 1, 'OLEO-5W30-SYN', 'Óleo Sintético 5W30 API SP 1L', 'Lubrificantes', 'Lubrax Distribuidora', 28.50, 48.00, 42.00, 10.00),
(2, 1, 'FILT-OLEO-VW', 'Filtro de Óleo Gol/Fox/Voyage', 'Filtros', 'Mann Filter', 15.00, 32.00, 18.00, 5.00),
(3, 1, 'PAST-FREIO-ONIX', 'Jogo de Pastilhas Freio Dianteiro Onix', 'Freios', 'Fras-le', 65.00, 135.00, 8.00, 3.00),
(4, 1, 'DISCO-FREIO-VENT', 'Par de Discos de Freio Ventilados', 'Freios', 'Fremax', 140.00, 295.00, 6.00, 2.00)
ON DUPLICATE KEY UPDATE `codigo`=VALUES(`codigo`);

SET FOREIGN_KEY_CHECKS = 1;
