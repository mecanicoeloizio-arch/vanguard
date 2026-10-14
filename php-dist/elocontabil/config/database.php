<?php
/**
 * EloContábil - Conexão de Banco de Dados PDO / SQLite / MySQL
 * Grupo Eloizio 2026
 */

declare(strict_types=1);

require_once __DIR__ . '/config.php';

class Database {
    private static ?PDO $connection = null;

    public static function getConnection(): PDO {
        if (self::$connection !== null) {
            return self::$connection;
        }

        $dbHost = getenv('DB_HOST') ?: 'localhost';
        $dbName = getenv('DB_NAME') ?: 'elocontabil';
        $dbUser = getenv('DB_USER') ?: 'root';
        $dbPass = getenv('DB_PASS') ?: '';

        // Tenta MySQL, com fallback transparente para SQLite no ambiente local
        try {
            $dsn = "mysql:host={$dbHost};dbname={$dbName};charset=utf8mb4";
            self::$connection = new PDO($dsn, $dbUser, $dbPass, [
                PDO::ATTR_ERRMODE => PDO::ERRMODE_EXCEPTION,
                PDO::ATTR_DEFAULT_FETCH_MODE => PDO::FETCH_ASSOC,
                PDO::ATTR_TIMEOUT => 3,
            ]);
        } catch (Throwable $e) {
            // Fallback para SQLite em storage/database.sqlite
            $sqlitePath = STORAGE_PATH . '/elocontabil.sqlite';
            self::$connection = new PDO("sqlite:" . $sqlitePath, null, null, [
                PDO::ATTR_ERRMODE => PDO::ERRMODE_EXCEPTION,
                PDO::ATTR_DEFAULT_FETCH_MODE => PDO::FETCH_ASSOC,
            ]);
            self::initSqliteTables(self::$connection);
        }

        return self::$connection;
    }

    private static function initSqliteTables(PDO $db): void {
        $db->exec("
            CREATE TABLE IF NOT EXISTS usuarios_contabil (
                id INTEGER PRIMARY KEY AUTOINCREMENT,
                nome TEXT NOT NULL,
                empresa TEXT NOT NULL,
                whatsapp TEXT NOT NULL,
                email TEXT NOT NULL,
                contador_email TEXT,
                criado_em TEXT DEFAULT CURRENT_TIMESTAMP
            );

            CREATE TABLE IF NOT EXISTS leads_triagem (
                id INTEGER PRIMARY KEY AUTOINCREMENT,
                contato TEXT NOT NULL,
                tipo_contato TEXT DEFAULT 'whatsapp',
                servico_interesse TEXT,
                token_acesso TEXT UNIQUE,
                expira_em TEXT,
                usado INTEGER DEFAULT 0,
                status_triagem TEXT DEFAULT 'triagem',
                criado_em TEXT DEFAULT CURRENT_TIMESTAMP
            );

            CREATE TABLE IF NOT EXISTS funcionarios (
                id INTEGER PRIMARY KEY AUTOINCREMENT,
                nome TEXT NOT NULL,
                cargo TEXT NOT NULL,
                cpf TEXT NOT NULL,
                admissao TEXT NOT NULL,
                vencimento_aso TEXT,
                tamanho_uniforme TEXT,
                epi_entregue INTEGER DEFAULT 1,
                status TEXT DEFAULT 'ativo',
                observacoes TEXT
            );

            CREATE TABLE IF NOT EXISTS ponto_registros (
                id INTEGER PRIMARY KEY AUTOINCREMENT,
                funcionario_id INTEGER,
                data TEXT NOT NULL,
                entrada TEXT,
                saida_almoco TEXT,
                retorno_almoco TEXT,
                saida TEXT,
                total_horas TEXT
            );

            CREATE TABLE IF NOT EXISTS cofre_documentos (
                id INTEGER PRIMARY KEY AUTOINCREMENT,
                titulo TEXT NOT NULL,
                categoria TEXT NOT NULL,
                vencimento TEXT,
                status TEXT DEFAULT 'valido',
                arquivo_nome TEXT,
                enviado_ao_contador INTEGER DEFAULT 0,
                criado_em TEXT DEFAULT CURRENT_TIMESTAMP
            );

            CREATE TABLE IF NOT EXISTS lembretes_agenda (
                id INTEGER PRIMARY KEY AUTOINCREMENT,
                titulo TEXT NOT NULL,
                data_limite TEXT NOT NULL,
                destinatario TEXT DEFAULT 'contador',
                concluido INTEGER DEFAULT 0,
                alerta_dias_antes INTEGER DEFAULT 3
            );

            CREATE TABLE IF NOT EXISTS financeiro_basico (
                id INTEGER PRIMARY KEY AUTOINCREMENT,
                tipo TEXT NOT NULL,
                descricao TEXT NOT NULL,
                valor REAL NOT NULL,
                vencimento TEXT NOT NULL,
                status TEXT DEFAULT 'pendente'
            );
        ");

        // Seed inicial se vazio
        $count = $db->query("SELECT COUNT(*) FROM usuarios_contabil")->fetchColumn();
        if ($count == 0) {
            $db->exec("
                INSERT INTO usuarios_contabil (nome, empresa, whatsapp, email, contador_email)
                VALUES ('Eloizio Assunção', 'Grupo Eloizio ME', '21996134073', 'mecanicoeloizio@gmail.com', 'contabilidade@grupoeloizio.com.br');

                INSERT INTO funcionarios (nome, cargo, cpf, admissao, vencimento_aso, tamanho_uniforme, epi_entregue, status)
                VALUES 
                ('Carlos Eduardo Silva', 'Mecânico Industrial Sênior', '123.456.789-00', '2024-02-15', '2026-11-20', 'G', 1, 'ativo'),
                ('Mariana Fagundes', 'Auxiliar de Atendimento', '987.654.321-11', '2025-01-10', '2027-01-10', 'M', 1, 'ativo');

                INSERT INTO cofre_documentos (titulo, categoria, vencimento, status, arquivo_nome, enviado_ao_contador)
                VALUES 
                ('Alvará de Funcionamento São Gonçalo 2026', 'Alvarás e Licenças', '2026-12-31', 'valido', 'alvara_sg_2026.pdf', 1),
                ('Contrato de Locação Galpão Central', 'Contratos', '2027-05-30', 'valido', 'contrato_locacao_2027.pdf', 1),
                ('Licença Sanitária e Ambiental', 'Alvarás e Licenças', '2026-11-15', 'alerta', 'licenca_sanitaria.pdf', 0);

                INSERT INTO lembretes_agenda (titulo, data_limite, destinatario, concluido)
                VALUES 
                ('Enviar extratos bancários e notas fiscais para o contador', '2026-10-28', 'contador', 0),
                ('Conferência prévia da folha de pagamento e vales', '2026-10-30', 'rh', 0);

                INSERT INTO financeiro_basico (tipo, descricao, valor, vencimento, status)
                VALUES 
                ('pagar', 'Aluguel do Espaço Operacional', 2400.00, '2026-10-15', 'pendente'),
                ('receber', 'Mensalidades Assinatura Manutenção', 7850.00, '2026-10-20', 'recebido');
            ");
        }
    }
}
