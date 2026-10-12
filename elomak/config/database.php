<?php
/**
 * EloMak - Conexão MySQL 8.0 com PDO
 * Grupo Eloizio 2026
 */

declare(strict_types=1);

require_once __DIR__ . '/config.php';

class Database
{
    private static ?PDO $instance = null;

    // Configurações do Banco de Dados MySQL 8.0
    private const DB_HOST = '127.0.0.1';
    private const DB_PORT = '3306';
    private const DB_NAME = 'elomak_db';
    private const DB_USER = 'root';
    private const DB_PASS = '';
    private const DB_CHARSET = 'utf8mb4';

    public static function getConnection(): PDO
    {
        if (self::$instance === null) {
            try {
                // Tenta conectar no MySQL 8.0 local/produção
                $dsn = sprintf(
                    'mysql:host=%s;port=%s;dbname=%s;charset=%s',
                    self::DB_HOST,
                    self::DB_PORT,
                    self::DB_NAME,
                    self::DB_CHARSET
                );

                self::$instance = new PDO($dsn, self::DB_USER, self::DB_PASS, [
                    PDO::ATTR_ERRMODE => PDO::ERRMODE_EXCEPTION,
                    PDO::ATTR_DEFAULT_FETCH_MODE => PDO::FETCH_ASSOC,
                    PDO::ATTR_EMULATE_PREPARES => false,
                    PDO::MYSQL_ATTR_INIT_COMMAND => "SET NAMES utf8mb4 COLLATE utf8mb4_unicode_ci"
                ]);
            } catch (PDOException $e) {
                // Fallback inteligente para SQLite em ambiente de teste/preview sem daemon MySQL ativo
                $sqlitePath = STORAGE_PATH . '/elomak_local.sqlite';
                self::$instance = new PDO('sqlite:' . $sqlitePath, null, null, [
                    PDO::ATTR_ERRMODE => PDO::ERRMODE_EXCEPTION,
                    PDO::ATTR_DEFAULT_FETCH_MODE => PDO::FETCH_ASSOC,
                ]);

                // Inicializa tabelas no SQLite se recém criado
                self::initSqliteTables(self::$instance);
            }
        }

        return self::$instance;
    }

    private static function initSqliteTables(PDO $db): void
    {
        $db->exec("
            CREATE TABLE IF NOT EXISTS usuarios_sistema (
                id INTEGER PRIMARY KEY AUTOINCREMENT,
                nome_oficina TEXT NOT NULL,
                whatsapp_dono TEXT NOT NULL UNIQUE,
                cnpj TEXT,
                cidade TEXT DEFAULT 'São Gonçalo - RJ',
                endereco TEXT,
                email TEXT,
                logo TEXT,
                plano TEXT DEFAULT 'pro',
                api_key TEXT,
                ativo INTEGER DEFAULT 1,
                criado_em TEXT DEFAULT CURRENT_TIMESTAMP
            );

            CREATE TABLE IF NOT EXISTS clientes_oficina (
                id INTEGER PRIMARY KEY AUTOINCREMENT,
                usuario_id INTEGER NOT NULL,
                nome TEXT NOT NULL,
                whatsapp TEXT NOT NULL,
                telefone_fixo TEXT,
                cpf TEXT,
                cidade TEXT DEFAULT 'São Gonçalo - RJ',
                endereco TEXT,
                email TEXT,
                observacoes TEXT,
                criado_em TEXT DEFAULT CURRENT_TIMESTAMP
            );

            CREATE TABLE IF NOT EXISTS veiculos (
                id INTEGER PRIMARY KEY AUTOINCREMENT,
                cliente_id INTEGER NOT NULL,
                placa TEXT NOT NULL,
                marca TEXT NOT NULL,
                modelo TEXT NOT NULL,
                ano TEXT,
                cor TEXT,
                km_atual INTEGER DEFAULT 0,
                combustivel TEXT DEFAULT 'Flex',
                chassi TEXT,
                criado_em TEXT DEFAULT CURRENT_TIMESTAMP
            );

            CREATE TABLE IF NOT EXISTS ordem_servico (
                id INTEGER PRIMARY KEY AUTOINCREMENT,
                numero_os TEXT NOT NULL UNIQUE,
                usuario_id INTEGER NOT NULL,
                cliente_id INTEGER NOT NULL,
                veiculo_id INTEGER NOT NULL,
                mecanico_responsavel_id INTEGER,
                defeito TEXT NOT NULL,
                diagnostico TEXT,
                laudo_tecnico TEXT,
                status TEXT NOT NULL DEFAULT 'Aberta',
                valor_mao_obra REAL DEFAULT 0.00,
                valor_pecas REAL DEFAULT 0.00,
                valor_desconto REAL DEFAULT 0.00,
                valor_total REAL NOT NULL DEFAULT 0.00,
                forma_pagamento TEXT DEFAULT 'Mercado Pago (PIX / Cartão)',
                prazo_entrega TEXT,
                prazo_garantia TEXT DEFAULT '90 dias',
                fotos_json TEXT,
                elosign_envelope_id TEXT,
                data_entrada TEXT DEFAULT CURRENT_TIMESTAMP,
                data_conclusao TEXT
            );

            CREATE TABLE IF NOT EXISTS os_itens (
                id INTEGER PRIMARY KEY AUTOINCREMENT,
                os_id INTEGER NOT NULL,
                tipo TEXT NOT NULL DEFAULT 'servico',
                produto_id INTEGER,
                descricao TEXT NOT NULL,
                quantidade REAL NOT NULL DEFAULT 1.00,
                valor_unitario REAL NOT NULL DEFAULT 0.00,
                valor_total REAL NOT NULL DEFAULT 0.00
            );

            CREATE TABLE IF NOT EXISTS orcamentos (
                id INTEGER PRIMARY KEY AUTOINCREMENT,
                numero_orcamento TEXT NOT NULL UNIQUE,
                usuario_id INTEGER NOT NULL,
                cliente_id INTEGER NOT NULL,
                veiculo_id INTEGER NOT NULL,
                descricao_servicos TEXT NOT NULL,
                valor_total REAL NOT NULL DEFAULT 0.00,
                status TEXT NOT NULL DEFAULT 'Pendente',
                os_gerada_id INTEGER,
                validade_dias INTEGER DEFAULT 10,
                criado_em TEXT DEFAULT CURRENT_TIMESTAMP
            );

            CREATE TABLE IF NOT EXISTS produtos_estoque (
                id INTEGER PRIMARY KEY AUTOINCREMENT,
                usuario_id INTEGER NOT NULL,
                codigo TEXT NOT NULL,
                descricao TEXT NOT NULL,
                categoria TEXT DEFAULT 'Peças Mecânicas',
                fornecedor TEXT,
                preco_custo REAL NOT NULL DEFAULT 0.00,
                preco_venda REAL NOT NULL DEFAULT 0.00,
                quantidade REAL NOT NULL DEFAULT 0.00,
                estoque_minimo REAL NOT NULL DEFAULT 2.00,
                unidade TEXT DEFAULT 'UN',
                criado_em TEXT DEFAULT CURRENT_TIMESTAMP
            );

            CREATE TABLE IF NOT EXISTS financeiro_lancamentos (
                id INTEGER PRIMARY KEY AUTOINCREMENT,
                usuario_id INTEGER NOT NULL,
                os_id INTEGER,
                tipo TEXT NOT NULL,
                categoria TEXT NOT NULL,
                descricao TEXT NOT NULL,
                valor REAL NOT NULL,
                status TEXT NOT NULL DEFAULT 'pendente',
                data_vencimento TEXT NOT NULL,
                data_pagamento TEXT,
                forma_pagamento TEXT DEFAULT 'PIX',
                pix_qrcode TEXT,
                criado_em TEXT DEFAULT CURRENT_TIMESTAMP
            );

            CREATE TABLE IF NOT EXISTS equipe_mecanicos (
                id INTEGER PRIMARY KEY AUTOINCREMENT,
                usuario_id INTEGER NOT NULL,
                nome TEXT NOT NULL,
                whatsapp TEXT NOT NULL,
                especialidade TEXT DEFAULT 'Motor & Suspensão',
                comissao_percentual REAL DEFAULT 10.00,
                ativo INTEGER DEFAULT 1,
                criado_em TEXT DEFAULT CURRENT_TIMESTAMP
            );

            CREATE TABLE IF NOT EXISTS leads_whatsapp (
                id INTEGER PRIMARY KEY AUTOINCREMENT,
                whatsapp TEXT NOT NULL,
                tipo TEXT NOT NULL DEFAULT 'novo',
                token TEXT,
                expira_em TEXT,
                usado INTEGER DEFAULT 0,
                status_triagem TEXT DEFAULT 'aguardando_opcao',
                dados_temporarios_json TEXT,
                criado_em TEXT DEFAULT CURRENT_TIMESTAMP,
                ultima_interacao TEXT DEFAULT CURRENT_TIMESTAMP
            );
        ");

        // Seed inicial se vazio
        $count = (int)$db->query("SELECT COUNT(*) FROM usuarios_sistema")->fetchColumn();
        if ($count === 0) {
            $db->exec("
                INSERT INTO usuarios_sistema (id, nome_oficina, whatsapp_dono, cnpj, cidade, endereco, email, logo, plano, api_key)
                VALUES (1, 'Oficina Mecânica EloMak & Grupo Eloizio', '5521996134073', '12.345.678/0001-90', 'São Gonçalo - RJ', 'Rua Dr. Nilo Peçanha, 450 - Centro', 'contato@grupoeloizio.com.br', 'https://images.unsplash.com/photo-1619642751034-765dfdf7c58e?auto=format&fit=crop&q=80&w=200', 'enterprise', 'elo_live_99a81e4b3c7d6e5f8812');

                INSERT INTO clientes_oficina (id, usuario_id, nome, whatsapp, cpf, cidade, email)
                VALUES 
                (1, 1, 'Marcos Vinicius de Oliveira', '5521998877112', '123.456.789-00', 'São Gonçalo - RJ', 'marcos.cliente@gmail.com'),
                (2, 1, 'Carlos Eduardo Santos', '5521987654321', '987.654.321-99', 'Niterói - RJ', 'carlos.santos@gmail.com');

                INSERT INTO veiculos (id, cliente_id, placa, marca, modelo, ano, cor, km_atual)
                VALUES 
                (1, 1, 'RIO2026', 'Volkswagen', 'Gol G6 1.6 MSI', '2016', 'Prata', 124500),
                (2, 2, 'KPW3A45', 'Chevrolet', 'Onix LTZ Turbo', '2021', 'Preto', 68200);

                INSERT INTO ordem_servico (id, numero_os, usuario_id, cliente_id, veiculo_id, defeito, diagnostico, status, valor_mao_obra, valor_pecas, valor_total, data_entrada)
                VALUES 
                (1, 'OS-2026-084', 1, 1, 1, 'Ruído metálico no motor em marcha lenta e luz de óleo acesa.', 'Folga excessiva nos mancais e retífica completa do cabeçote com troca de bielas.', 'Finalizada', 750.00, 1100.00, 1850.00, datetime('now', '-3 days')),
                (2, 'OS-2026-092', 1, 2, 2, 'Freio chiando e pedal baixo ao pisar fundo.', 'Pastilhas desgastadas e discos dianteiros abaixo da espessura mínima de segurança.', 'Em Andamento', 250.00, 430.00, 680.00, datetime('now', '-1 day'));

                INSERT INTO produtos_estoque (id, usuario_id, codigo, descricao, categoria, fornecedor, preco_custo, preco_venda, quantidade, estoque_minimo)
                VALUES 
                (1, 1, 'OLEO-5W30-SYN', 'Óleo Sintético 5W30 API SP 1L', 'Lubrificantes', 'Lubrax Distribuidora', 28.50, 48.00, 42.00, 10.00),
                (2, 1, 'FILT-OLEO-VW', 'Filtro de Óleo Gol/Fox/Voyage', 'Filtros', 'Mann Filter', 15.00, 32.00, 18.00, 5.00),
                (3, 1, 'PAST-FREIO-ONIX', 'Jogo de Pastilhas Freio Dianteiro Onix', 'Freios', 'Fras-le', 65.00, 135.00, 8.00, 3.00),
                (4, 1, 'DISCO-FREIO-VENT', 'Par de Discos de Freio Ventilados', 'Freios', 'Fremax', 140.00, 295.00, 6.00, 2.00);

                INSERT INTO equipe_mecanicos (id, usuario_id, nome, whatsapp, especialidade, comissao_percentual)
                VALUES
                (1, 1, 'Mestre Eloizio Assunção', '5521987648727', 'Mecânica Geral & Retífica', 15.00),
                (2, 1, 'Tiago Mecânico', '5521996134073', 'Suspensão, Freios e Injeção', 10.00);
            ");
        }
    }
}
