<?php
/**
 * ==============================================================================
 * EduVanguard - Instalador Web Profissional & Assistente de Configuração PHP
 * Compatível com Hostinger VPS KVM2 (Ubuntu / Debian / Docker / Contêiner Vanguard)
 * ==============================================================================
 */

session_start();

// Configurações e caminhos padrão
define('ROOT_PATH', realpath(__DIR__ . '/..'));
define('ENV_FILE', ROOT_PATH . '/.env');
define('SQL_FILE', ROOT_PATH . '/database.sql');
define('LOCK_FILE', __DIR__ . '/installed.lock');

// Passo atual do assistente
$step = isset($_GET['step']) ? (int)$_GET['step'] : 1;
$error = null;
$success = null;

// Verifica se já foi instalado
$alreadyInstalled = file_exists(LOCK_FILE);

// Processamento dos formulários por etapa
if ($_SERVER['REQUEST_METHOD'] === 'POST') {
    $action = $_POST['action'] ?? '';

    // Ação: Testar e Configurar Banco de Dados
    if ($action === 'setup_database') {
        $dbHost = trim($_POST['db_host'] ?? '127.0.0.1');
        $dbPort = trim($_POST['db_port'] ?? '3306');
        $dbName = trim($_POST['db_name'] ?? 'eduvanguard_db');
        $dbUser = trim($_POST['db_user'] ?? 'root');
        $dbPass = $_POST['db_pass'] ?? '';
        $createDb = isset($_POST['create_db']) && $_POST['create_db'] === '1';

        try {
            // Conexão inicial com PDO
            $dsnNoDb = "mysql:host={$dbHost};port={$dbPort};charset=utf8mb4";
            $pdoInit = new PDO($dsnNoDb, $dbUser, $dbPass, [
                PDO::ATTR_ERRMODE => PDO::ERRMODE_EXCEPTION,
                PDO::ATTR_TIMEOUT => 5
            ]);

            // Se solicitado, criar o banco de dados se não existir
            if ($createDb) {
                $pdoInit->exec("CREATE DATABASE IF NOT EXISTS `{$dbName}` CHARACTER SET utf8mb4 COLLATE utf8mb4_unicode_ci");
            }

            // Conectar ao banco específico
            $dsnWithDb = "mysql:host={$dbHost};port={$dbPort};dbname={$dbName};charset=utf8mb4";
            $pdo = new PDO($dsnWithDb, $dbUser, $dbPass, [
                PDO::ATTR_ERRMODE => PDO::ERRMODE_EXCEPTION
            ]);

            // Importar database.sql
            if (file_exists(SQL_FILE)) {
                $sqlContent = file_get_contents(SQL_FILE);
                // Executar os comandos SQL
                $pdo->exec($sqlContent);
            } else {
                throw new Exception("Arquivo de schema database.sql não encontrado na raiz!");
            }

            // Salvar variáveis na sessão para gravação posterior no .env
            $_SESSION['INSTALL_DB'] = [
                'host' => $dbHost,
                'port' => $dbPort,
                'name' => $dbName,
                'user' => $dbUser,
                'pass' => $dbPass
            ];

            $success = "Banco de dados '{$dbName}' conectado e tabelas criadas com sucesso!";
            header("Location: index.php?step=3");
            exit;
        } catch (Exception $e) {
            $error = "Erro ao configurar banco de dados: " . $e->getMessage();
        }
    }

    // Ação: Configuração das Chaves, Mercado Pago, Gemini e Admin
    if ($action === 'setup_environment') {
        $appUrl = rtrim(trim($_POST['app_url'] ?? 'http://localhost:3000'), '/');
        $appPort = trim($_POST['app_port'] ?? '3000');
        $geminiKey = trim($_POST['gemini_api_key'] ?? '');
        $mpPublicKey = trim($_POST['mp_public_key'] ?? 'APP_USR-sandbox-demo-key');
        $mpAccessToken = trim($_POST['mp_access_token'] ?? 'APP_USR-sandbox-demo-token');
        $adminName = trim($_POST['admin_name'] ?? 'Administrador EduVanguard');
        $adminEmail = trim($_POST['admin_email'] ?? 'admin@eduvanguard.com.br');
        $adminPass = trim($_POST['admin_pass'] ?? 'vanguard123');

        $dbInfo = $_SESSION['INSTALL_DB'] ?? [
            'host' => '127.0.0.1',
            'port' => '3306',
            'name' => 'eduvanguard_db',
            'user' => 'root',
            'pass' => ''
        ];

        // Conteúdo formatado para o arquivo .env
        $envContent = "# =============================================================================\n" .
                      "# EduVanguard - Variáveis de Ambiente de Produção (Hostinger KVM2)\n" .
                      "# Gerado pelo Instalador Web em " . date('Y-m-d H:i:s') . "\n" .
                      "# =============================================================================\n\n" .
                      "NODE_ENV=production\n" .
                      "PORT={$appPort}\n" .
                      "APP_URL=\"{$appUrl}\"\n\n" .
                      "# Chave da API do Google Gemini (Especialista Virtual Sofia & Assistente)\n" .
                      "GEMINI_API_KEY=\"{$geminiKey}\"\n\n" .
                      "# Banco de Dados Relacional MySQL / MariaDB\n" .
                      "DB_HOST=\"{$dbInfo['host']}\"\n" .
                      "DB_PORT={$dbInfo['port']}\n" .
                      "DB_NAME=\"{$dbInfo['name']}\"\n" .
                      "DB_USER=\"{$dbInfo['user']}\"\n" .
                      "DB_PASS=\"{$dbInfo['pass']}\"\n\n" .
                      "# Mercado Pago Gateway (PIX, Cartão e Boleto DNE / Certificados)\n" .
                      "MERCADO_PAGO_PUBLIC_KEY=\"{$mpPublicKey}\"\n" .
                      "MERCADO_PAGO_ACCESS_TOKEN=\"{$mpAccessToken}\"\n" .
                      "MERCADO_PAGO_WEBHOOK_SECRET=\"whsec_" . bin2hex(random_bytes(16)) . "\"\n\n" .
                      "# Criptografia LGPD e Assinatura ICP-Edu\n" .
                      "DATA_ENCRYPTION_SALT=\"" . bin2hex(random_bytes(24)) . "\"\n";

        // Grava no arquivo .env
        $envWritten = @file_put_contents(ENV_FILE, $envContent);

        if ($envWritten === false) {
            $error = "Não foi possível gravar o arquivo .env na raiz. Verifique as permissões de escrita na pasta do contêiner (chmod -R 775 /app).";
        } else {
            // Atualizar senha do admin no banco se configurado
            try {
                $dsnWithDb = "mysql:host={$dbInfo['host']};port={$dbInfo['port']};dbname={$dbInfo['name']};charset=utf8mb4";
                $pdo = new PDO($dsnWithDb, $dbInfo['user'], $dbInfo['pass'], [
                    PDO::ATTR_ERRMODE => PDO::ERRMODE_EXCEPTION
                ]);

                $hash = password_hash($adminPass, PASSWORD_BCRYPT);
                $stmt = $pdo->prepare("UPDATE `users` SET `name` = ?, `email` = ?, `password_hash` = ? WHERE `role` = 'admin' LIMIT 1");
                $stmt->execute([$adminName, $adminEmail, $hash]);
            } catch (Exception $e) {
                // Não fatal se falhar atualização de senha
            }

            // Criar arquivo de trava para segurança
            @file_put_contents(LOCK_FILE, json_encode([
                'installed_at' => date('c'),
                'installed_by' => $adminEmail,
                'version' => '2.5.0'
            ], JSON_PRETTY_PRINT));

            header("Location: index.php?step=4");
            exit;
        }
    }
}

// Verificação de requisitos do sistema no Passo 1
$reqs = [
    'php_version' => [
        'name' => 'Versão do PHP (>= 7.4 ou 8.x)',
        'pass' => version_compare(PHP_VERSION, '7.4.0', '>='),
        'detail' => PHP_VERSION
    ],
    'pdo_mysql' => [
        'name' => 'Extensão PDO MySQL (pdo_mysql)',
        'pass' => extension_loaded('pdo_mysql'),
        'detail' => extension_loaded('pdo_mysql') ? 'Instalada' : 'Não encontrada'
    ],
    'json' => [
        'name' => 'Suporte a JSON (ext/json)',
        'pass' => extension_loaded('json'),
        'detail' => extension_loaded('json') ? 'Ativo' : 'Não encontrado'
    ],
    'curl' => [
        'name' => 'Extensão cURL (ext/curl)',
        'pass' => extension_loaded('curl'),
        'detail' => extension_loaded('curl') ? 'Ativo' : 'Recomendado'
    ],
    'write_env' => [
        'name' => 'Permissão de Escrita (.env / Raiz)',
        'pass' => is_writable(ROOT_PATH) || (file_exists(ENV_FILE) && is_writable(ENV_FILE)),
        'detail' => is_writable(ROOT_PATH) ? 'Gravável' : 'Requer permissão chmod 775'
    ],
    'sql_schema' => [
        'name' => 'Arquivo de Esquema (database.sql)',
        'pass' => file_exists(SQL_FILE),
        'detail' => file_exists(SQL_FILE) ? 'Encontrado (' . round(filesize(SQL_FILE)/1024, 1) . ' KB)' : 'database.sql ausente'
    ]
];

$allRequirementsPassed = true;
foreach ($reqs as $k => $r) {
    if (!$r['pass'] && $k !== 'curl') {
        $allRequirementsPassed = false;
    }
}
?>
<!DOCTYPE html>
<html lang="pt-BR">
<head>
  <meta charset="UTF-8">
  <meta name="viewport" content="width=device-width, initial-scale=1.0">
  <title>Instalador Web EduVanguard - Hostinger KVM2 VPS (Vanguard)</title>
  <script src="https://cdn.tailwindcss.com"></script>
  <link rel="preconnect" href="https://fonts.googleapis.com">
  <link rel="preconnect" href="https://fonts.gstatic.com" crossorigin>
  <link href="https://fonts.googleapis.com/css2?family=Plus+Jakarta+Sans:wght@400;500;600;700;800&family=JetBrains+Mono:wght@400;600&display=swap" rel="stylesheet">
  <style>
    body { font-family: 'Plus Jakarta Sans', sans-serif; }
    code, pre { font-family: 'JetBrains Mono', monospace; }
  </style>
</head>
<body class="bg-slate-950 text-slate-100 min-h-screen flex flex-col justify-between selection:bg-indigo-500 selection:text-white">

  <!-- Cabeçalho -->
  <header class="border-b border-slate-800 bg-slate-900/60 backdrop-blur-md sticky top-0 z-50">
    <div class="max-w-5xl mx-auto px-4 sm:px-6 py-4 flex items-center justify-between">
      <div class="flex items-center gap-3">
        <div class="w-10 h-10 rounded-xl bg-gradient-to-tr from-indigo-600 to-amber-500 flex items-center justify-center shadow-lg shadow-indigo-600/30 text-white font-black text-xl">
          V
        </div>
        <div>
          <h1 class="text-lg font-bold tracking-tight text-white flex items-center gap-2">
            EduVanguard <span class="text-xs bg-indigo-500/20 text-indigo-300 border border-indigo-500/30 px-2 py-0.5 rounded-full font-mono font-normal">v2.5.0</span>
          </h1>
          <p class="text-xs text-slate-400">Instalador Automático & Setup VPS Hostinger KVM2</p>
        </div>
      </div>

      <div class="hidden sm:flex items-center gap-2 text-xs text-slate-400 font-mono">
        <span class="inline-block w-2.5 h-2.5 rounded-full bg-emerald-500 animate-pulse"></span>
        Contêiner: <strong class="text-indigo-400">Vanguard</strong>
      </div>
    </div>
  </header>

  <!-- Conteúdo Principal -->
  <main class="max-w-5xl mx-auto px-4 sm:px-6 py-8 flex-1 w-full">

    <!-- Stepper de Progresso -->
    <div class="mb-8">
      <div class="grid grid-cols-4 gap-2 sm:gap-4 text-center">
        <div class="flex flex-col items-center">
          <div class="w-8 h-8 rounded-full flex items-center justify-center text-xs font-bold mb-1 <?php echo $step >= 1 ? 'bg-indigo-600 text-white ring-4 ring-indigo-500/20' : 'bg-slate-800 text-slate-400'; ?>">
            1
          </div>
          <span class="text-xs <?php echo $step === 1 ? 'text-indigo-400 font-semibold' : 'text-slate-400'; ?>">Diagnóstico</span>
        </div>
        <div class="flex flex-col items-center">
          <div class="w-8 h-8 rounded-full flex items-center justify-center text-xs font-bold mb-1 <?php echo $step >= 2 ? 'bg-indigo-600 text-white ring-4 ring-indigo-500/20' : 'bg-slate-800 text-slate-400'; ?>">
            2
          </div>
          <span class="text-xs <?php echo $step === 2 ? 'text-indigo-400 font-semibold' : 'text-slate-400'; ?>">Banco SQL</span>
        </div>
        <div class="flex flex-col items-center">
          <div class="w-8 h-8 rounded-full flex items-center justify-center text-xs font-bold mb-1 <?php echo $step >= 3 ? 'bg-indigo-600 text-white ring-4 ring-indigo-500/20' : 'bg-slate-800 text-slate-400'; ?>">
            3
          </div>
          <span class="text-xs <?php echo $step === 3 ? 'text-indigo-400 font-semibold' : 'text-slate-400'; ?>">Configurações</span>
        </div>
        <div class="flex flex-col items-center">
          <div class="w-8 h-8 rounded-full flex items-center justify-center text-xs font-bold mb-1 <?php echo $step >= 4 ? 'bg-emerald-600 text-white ring-4 ring-emerald-500/20' : 'bg-slate-800 text-slate-400'; ?>">
            ✓
          </div>
          <span class="text-xs <?php echo $step === 4 ? 'text-emerald-400 font-semibold' : 'text-slate-400'; ?>">Conclusão</span>
        </div>
      </div>
    </div>

    <!-- Alertas -->
    <?php if ($error): ?>
      <div class="mb-6 p-4 rounded-xl bg-red-950/80 border border-red-500/40 text-red-200 flex items-start gap-3 text-sm">
        <svg class="w-5 h-5 text-red-400 shrink-0 mt-0.5" fill="none" viewBox="0 0 24 24" stroke="currentColor">
          <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M12 8v4m0 4h.01M21 12a9 9 0 11-18 0 9 9 0 0118 0z" />
        </svg>
        <div>
          <strong class="font-bold text-red-300">Atenção no Processamento:</strong>
          <p class="mt-0.5"><?php echo htmlspecialchars($error); ?></p>
        </div>
      </div>
    <?php endif; ?>

    <?php if ($success): ?>
      <div class="mb-6 p-4 rounded-xl bg-emerald-950/80 border border-emerald-500/40 text-emerald-200 flex items-start gap-3 text-sm">
        <svg class="w-5 h-5 text-emerald-400 shrink-0 mt-0.5" fill="none" viewBox="0 0 24 24" stroke="currentColor">
          <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M5 13l4 4L19 7" />
        </svg>
        <div><?php echo htmlspecialchars($success); ?></div>
      </div>
    <?php endif; ?>

    <!-- Se já instalado -->
    <?php if ($alreadyInstalled && $step < 4): ?>
      <div class="mb-6 p-4 rounded-xl bg-amber-950/60 border border-amber-500/30 text-amber-200 text-sm flex items-center justify-between">
        <div>
          <strong>Aviso:</strong> A aplicação já foi instalada anteriormente. O arquivo <code>installed.lock</code> está presente.
        </div>
        <a href="index.php?step=4" class="px-3 py-1.5 bg-amber-600 hover:bg-amber-500 text-white font-medium rounded-lg text-xs">
          Ver Instruções de Uso
        </a>
      </div>
    <?php endif; ?>

    <!-- ETAPA 1: Diagnóstico e Pré-Requisitos -->
    <?php if ($step === 1): ?>
      <div class="bg-slate-900 border border-slate-800 rounded-2xl p-6 sm:p-8 shadow-xl">
        <div class="mb-6">
          <h2 class="text-xl font-bold text-white mb-1">Passo 1: Verificação de Pré-Requisitos do Servidor</h2>
          <p class="text-sm text-slate-400">
            Validação do ambiente VPS Hostinger (PHP, extensões necessárias, permissões e arquivo SQL).
          </p>
        </div>

        <div class="space-y-3 mb-8">
          <?php foreach ($reqs as $key => $r): ?>
            <div class="flex items-center justify-between p-3.5 rounded-xl border <?php echo $r['pass'] ? 'bg-slate-950/60 border-slate-800' : 'bg-red-950/30 border-red-900/50'; ?>">
              <div class="flex items-center gap-3">
                <span class="w-6 h-6 rounded-full flex items-center justify-center text-xs <?php echo $r['pass'] ? 'bg-emerald-500/20 text-emerald-400 border border-emerald-500/30' : 'bg-red-500/20 text-red-400 border border-red-500/30'; ?>">
                  <?php echo $r['pass'] ? '✓' : '✕'; ?>
                </span>
                <div>
                  <div class="text-sm font-medium text-slate-200"><?php echo htmlspecialchars($r['name']); ?></div>
                  <div class="text-xs text-slate-400"><?php echo htmlspecialchars($r['detail']); ?></div>
                </div>
              </div>
              <span class="text-xs font-mono font-semibold px-2.5 py-1 rounded-md <?php echo $r['pass'] ? 'bg-emerald-500/10 text-emerald-400' : 'bg-red-500/10 text-red-400'; ?>">
                <?php echo $r['pass'] ? 'Aprovado' : 'Falhou'; ?>
              </span>
            </div>
          <?php endforeach; ?>
        </div>

        <div class="p-4 rounded-xl bg-indigo-950/40 border border-indigo-800/40 text-xs text-indigo-300 leading-relaxed mb-6">
          <strong>💡 Dica Hostinger KVM2:</strong> Dentro do contêiner <strong>Vanguard</strong>, certifique-se de que o diretório raiz tenha permissão de escrita para o servidor web executando:
          <pre class="mt-2 p-2 bg-slate-950 rounded-lg text-amber-300 font-mono text-[11px] overflow-x-auto">chown -R www-data:www-data /app && chmod -R 775 /app</pre>
        </div>

        <div class="flex justify-end">
          <?php if ($allRequirementsPassed): ?>
            <a href="index.php?step=2" class="px-6 py-2.5 bg-indigo-600 hover:bg-indigo-500 text-white font-semibold rounded-xl shadow-lg shadow-indigo-600/30 text-sm flex items-center gap-2 transition">
              Avançar para Banco de Dados
              <svg class="w-4 h-4" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M9 5l7 7-7 7" />
              </svg>
            </a>
          <?php else: ?>
            <button disabled class="px-6 py-2.5 bg-slate-800 text-slate-500 font-semibold rounded-xl text-sm cursor-not-allowed">
              Corrija os itens acima para prosseguir
            </button>
          <?php endif; ?>
        </div>
      </div>
    <?php endif; ?>

    <!-- ETAPA 2: Configuração e Importação do Banco de Dados SQL -->
    <?php if ($step === 2): ?>
      <div class="bg-slate-900 border border-slate-800 rounded-2xl p-6 sm:p-8 shadow-xl">
        <div class="mb-6">
          <h2 class="text-xl font-bold text-white mb-1">Passo 2: Conexão & Criação do Banco de Dados</h2>
          <p class="text-sm text-slate-400">
            Informe as credenciais do seu servidor MySQL / MariaDB no VPS Hostinger. O instalador criará as tabelas e fará a carga inicial de dados automaticamente.
          </p>
        </div>

        <form method="POST" action="index.php?step=2" class="space-y-5">
          <input type="hidden" name="action" value="setup_database">

          <div class="grid grid-cols-1 sm:grid-cols-3 gap-4">
            <div class="sm:col-span-2">
              <label class="block text-xs font-semibold text-slate-300 mb-1">Host do MySQL / MariaDB</label>
              <input type="text" name="db_host" value="127.0.0.1" required class="w-full px-4 py-2.5 bg-slate-950 border border-slate-800 rounded-xl text-sm focus:border-indigo-500 focus:outline-none font-mono">
              <span class="text-[11px] text-slate-500">Geralmente <code>127.0.0.1</code> ou o IP interno do contêiner db.</span>
            </div>
            <div>
              <label class="block text-xs font-semibold text-slate-300 mb-1">Porta</label>
              <input type="number" name="db_port" value="3306" required class="w-full px-4 py-2.5 bg-slate-950 border border-slate-800 rounded-xl text-sm focus:border-indigo-500 focus:outline-none font-mono">
            </div>
          </div>

          <div>
            <label class="block text-xs font-semibold text-slate-300 mb-1">Nome do Banco de Dados</label>
            <input type="text" name="db_name" value="eduvanguard_db" required class="w-full px-4 py-2.5 bg-slate-950 border border-slate-800 rounded-xl text-sm focus:border-indigo-500 focus:outline-none font-mono">
          </div>

          <div class="grid grid-cols-1 sm:grid-cols-2 gap-4">
            <div>
              <label class="block text-xs font-semibold text-slate-300 mb-1">Usuário do Banco</label>
              <input type="text" name="db_user" value="root" required class="w-full px-4 py-2.5 bg-slate-950 border border-slate-800 rounded-xl text-sm focus:border-indigo-500 focus:outline-none font-mono">
            </div>
            <div>
              <label class="block text-xs font-semibold text-slate-300 mb-1">Senha do Banco</label>
              <input type="password" name="db_pass" placeholder="••••••••" class="w-full px-4 py-2.5 bg-slate-950 border border-slate-800 rounded-xl text-sm focus:border-indigo-500 focus:outline-none font-mono">
            </div>
          </div>

          <div class="p-3.5 bg-slate-950 rounded-xl border border-slate-800 flex items-center gap-3">
            <input type="checkbox" name="create_db" id="create_db" value="1" checked class="w-4 h-4 rounded text-indigo-600 bg-slate-900 border-slate-700 focus:ring-0">
            <label for="create_db" class="text-xs text-slate-300 cursor-pointer">
              <strong>Criar o banco de dados automaticamente</strong> caso ele ainda não exista no servidor MySQL.
            </label>
          </div>

          <div class="p-4 rounded-xl bg-amber-950/20 border border-amber-800/30 text-xs text-amber-200">
            <strong>Tabelas inclusas no <code>database.sql</code>:</strong> Usuários (Alunos, Professores, Direção), Cursos, Aulas, Boletim de Notas, Frequência, Provas & Quizzes, Solicitações de Documentos, Pagamentos Mercado Pago, Leads da Sofia IA e Logs de Auditoria ERP.
          </div>

          <div class="flex items-center justify-between pt-4">
            <a href="index.php?step=1" class="text-xs text-slate-400 hover:text-white transition">
              ← Voltar ao Diagnóstico
            </a>
            <button type="submit" class="px-6 py-2.5 bg-indigo-600 hover:bg-indigo-500 text-white font-semibold rounded-xl shadow-lg shadow-indigo-600/30 text-sm flex items-center gap-2 transition">
              Criar & Importar Banco de Dados
              <svg class="w-4 h-4" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M9 5l7 7-7 7" />
              </svg>
            </button>
          </div>
        </form>
      </div>
    <?php endif; ?>

    <!-- ETAPA 3: Configuração do Ambiente (.env, Mercado Pago, Gemini e Admin) -->
    <?php if ($step === 3): ?>
      <div class="bg-slate-900 border border-slate-800 rounded-2xl p-6 sm:p-8 shadow-xl">
        <div class="mb-6">
          <h2 class="text-xl font-bold text-white mb-1">Passo 3: Configuração do Sistema & Integrações</h2>
          <p class="text-sm text-slate-400">
            Personalize a URL canônica, a chave de Inteligência Artificial para a especialista virtual Sofia e o administrador mestre da plataforma.
          </p>
        </div>

        <form method="POST" action="index.php?step=3" class="space-y-6">
          <input type="hidden" name="action" value="setup_environment">

          <!-- Bloco Servidor -->
          <div class="space-y-4">
            <h3 class="text-xs font-bold uppercase tracking-wider text-indigo-400">Configurações de Rede & Domínio</h3>
            <div class="grid grid-cols-1 sm:grid-cols-3 gap-4">
              <div class="sm:col-span-2">
                <label class="block text-xs font-semibold text-slate-300 mb-1">URL Pública da Aplicação</label>
                <input type="url" name="app_url" value="http://<?php echo $_SERVER['HTTP_HOST'] ?? 'localhost:3000'; ?>" required class="w-full px-4 py-2.5 bg-slate-950 border border-slate-800 rounded-xl text-sm focus:border-indigo-500 focus:outline-none font-mono">
                <span class="text-[11px] text-slate-500">Ex: <code>https://seudominio.com.br</code> ou IP do VPS.</span>
              </div>
              <div>
                <label class="block text-xs font-semibold text-slate-300 mb-1">Porta Node/Express</label>
                <input type="number" name="app_port" value="3000" required class="w-full px-4 py-2.5 bg-slate-950 border border-slate-800 rounded-xl text-sm focus:border-indigo-500 focus:outline-none font-mono">
              </div>
            </div>
          </div>

          <!-- Bloco Gemini & IA -->
          <div class="space-y-4 pt-4 border-t border-slate-800">
            <h3 class="text-xs font-bold uppercase tracking-wider text-amber-400">Especialista Virtual Sofia (Inteligência Artificial)</h3>
            <div>
              <label class="block text-xs font-semibold text-slate-300 mb-1">Chave de API do Google Gemini (GEMINI_API_KEY)</label>
              <input type="password" name="gemini_api_key" placeholder="AIzaSy..." class="w-full px-4 py-2.5 bg-slate-950 border border-slate-800 rounded-xl text-sm focus:border-indigo-500 focus:outline-none font-mono">
              <span class="text-[11px] text-slate-500">Obtenha sua chave gratuita em <a href="https://aistudio.google.com" target="_blank" class="text-indigo-400 underline">aistudio.google.com</a>. Caso não preencha agora, a Sofia funcionará em modo assistente local heurístico.</span>
            </div>
          </div>

          <!-- Bloco Mercado Pago -->
          <div class="space-y-4 pt-4 border-t border-slate-800">
            <h3 class="text-xs font-bold uppercase tracking-wider text-sky-400">Gateway Mercado Pago (PIX, Cartão e Boletos)</h3>
            <div class="grid grid-cols-1 sm:grid-cols-2 gap-4">
              <div>
                <label class="block text-xs font-semibold text-slate-300 mb-1">Public Key (Opcional - Sandbox)</label>
                <input type="text" name="mp_public_key" placeholder="APP_USR-xxxx-xxxx" class="w-full px-4 py-2.5 bg-slate-950 border border-slate-800 rounded-xl text-sm focus:border-indigo-500 focus:outline-none font-mono text-xs">
              </div>
              <div>
                <label class="block text-xs font-semibold text-slate-300 mb-1">Access Token (Opcional - Sandbox)</label>
                <input type="password" name="mp_access_token" placeholder="APP_USR-xxxx-xxxx" class="w-full px-4 py-2.5 bg-slate-950 border border-slate-800 rounded-xl text-sm focus:border-indigo-500 focus:outline-none font-mono text-xs">
              </div>
            </div>
          </div>

          <!-- Bloco Administrador Mestre -->
          <div class="space-y-4 pt-4 border-t border-slate-800">
            <h3 class="text-xs font-bold uppercase tracking-wider text-emerald-400">Conta do Administrador Geral (Direção)</h3>
            <div class="grid grid-cols-1 sm:grid-cols-3 gap-4">
              <div>
                <label class="block text-xs font-semibold text-slate-300 mb-1">Nome do Gestor</label>
                <input type="text" name="admin_name" value="Carlos Alberto Mendes" required class="w-full px-4 py-2.5 bg-slate-950 border border-slate-800 rounded-xl text-sm focus:border-indigo-500 focus:outline-none">
              </div>
              <div>
                <label class="block text-xs font-semibold text-slate-300 mb-1">E-mail de Login</label>
                <input type="email" name="admin_email" value="carlos.mendes@direcao.eduvanguard.com.br" required class="w-full px-4 py-2.5 bg-slate-950 border border-slate-800 rounded-xl text-sm focus:border-indigo-500 focus:outline-none font-mono text-xs">
              </div>
              <div>
                <label class="block text-xs font-semibold text-slate-300 mb-1">Senha de Acesso</label>
                <input type="text" name="admin_pass" value="vanguard123" required class="w-full px-4 py-2.5 bg-slate-950 border border-slate-800 rounded-xl text-sm focus:border-indigo-500 focus:outline-none font-mono">
              </div>
            </div>
          </div>

          <div class="flex items-center justify-between pt-4">
            <a href="index.php?step=2" class="text-xs text-slate-400 hover:text-white transition">
              ← Voltar ao Banco
            </a>
            <button type="submit" class="px-6 py-2.5 bg-emerald-600 hover:bg-emerald-500 text-white font-semibold rounded-xl shadow-lg shadow-emerald-600/30 text-sm flex items-center gap-2 transition">
              Salvar .env & Finalizar Instalação
              <svg class="w-4 h-4" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M5 13l4 4L19 7" />
              </svg>
            </button>
          </div>
        </form>
      </div>
    <?php endif; ?>

    <!-- ETAPA 4: Conclusão & Próximos Passos -->
    <?php if ($step === 4): ?>
      <div class="bg-slate-900 border border-slate-800 rounded-2xl p-6 sm:p-8 shadow-xl">
        <div class="text-center max-w-xl mx-auto mb-8">
          <div class="w-16 h-16 bg-emerald-500/20 text-emerald-400 rounded-full flex items-center justify-center mx-auto mb-4 border border-emerald-500/30 ring-8 ring-emerald-500/10">
            <svg class="w-8 h-8" fill="none" viewBox="0 0 24 24" stroke="currentColor">
              <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2.5" d="M5 13l4 4L19 7" />
            </svg>
          </div>
          <h2 class="text-2xl font-bold text-white mb-2">Instalação Concluída com Sucesso!</h2>
          <p class="text-sm text-slate-300">
            O banco de dados relacional foi provisionado com as tabelas essenciais e o arquivo de configuração <code>.env</code> foi salvo na raiz do projeto.
          </p>
        </div>

        <!-- Instruções para iniciar o contêiner Vanguard -->
        <div class="space-y-4 mb-8">
          <h3 class="text-sm font-bold text-white uppercase tracking-wider flex items-center gap-2">
            <span class="w-2 h-2 rounded-full bg-indigo-500"></span>
            Como iniciar o serviço no Hostinger KVM2 (Contêiner Vanguard):
          </h3>

          <div class="bg-slate-950 p-4 rounded-xl border border-slate-800 space-y-3 font-mono text-xs">
            <div class="text-slate-400"># 1. Acesse a pasta do projeto descompactado no seu VPS:</div>
            <div class="text-indigo-300">cd /caminho/do/projeto</div>

            <div class="text-slate-400 mt-2"># 2. Instale os pacotes Node e gere o build de produção:</div>
            <div class="text-amber-300">npm install && npm run build</div>

            <div class="text-slate-400 mt-2"># 3. Inicie o servidor da aplicação com PM2 (Recomendado para VPS):</div>
            <div class="text-emerald-400">npm install -g pm2</div>
            <div class="text-emerald-400">pm2 start server.ts --name "Vanguard" --interpreter tsx</div>
            <div class="text-emerald-400">pm2 save && pm2 startup</div>
          </div>
        </div>

        <!-- Credenciais Padrão -->
        <div class="grid grid-cols-1 sm:grid-cols-3 gap-4 mb-8">
          <div class="p-4 rounded-xl bg-slate-950 border border-slate-800">
            <div class="text-xs text-indigo-400 font-semibold mb-1">Portal da Direção (Admin)</div>
            <div class="text-xs text-slate-300 font-mono">carlos.mendes@direcao.eduvanguard.com.br</div>
            <div class="text-[11px] text-slate-500 mt-1">Senha: <code>vanguard123</code></div>
          </div>
          <div class="p-4 rounded-xl bg-slate-950 border border-slate-800">
            <div class="text-xs text-amber-400 font-semibold mb-1">Portal do Professor</div>
            <div class="text-xs text-slate-300 font-mono">mariana.fernandes@professor.eduvanguard.com.br</div>
            <div class="text-[11px] text-slate-500 mt-1">Senha: <code>vanguard123</code></div>
          </div>
          <div class="p-4 rounded-xl bg-slate-950 border border-slate-800">
            <div class="text-xs text-emerald-400 font-semibold mb-1">Portal do Aluno</div>
            <div class="text-xs text-slate-300 font-mono">lucas.silva@aluno.eduvanguard.com.br</div>
            <div class="text-[11px] text-slate-500 mt-1">Senha: <code>vanguard123</code></div>
          </div>
        </div>

        <div class="flex flex-col sm:flex-row items-center justify-between gap-4 pt-4 border-t border-slate-800">
          <div class="text-xs text-slate-400">
            Consulte o <strong>MANUAL_INSTALACAO_VPS_HOSTINGER.md</strong> na raiz para configurações de Nginx SSL e Docker Compose.
          </div>
          <a href="../" class="w-full sm:w-auto px-6 py-2.5 bg-indigo-600 hover:bg-indigo-500 text-white font-semibold rounded-xl text-center shadow-lg shadow-indigo-600/30 text-sm transition">
            Abrir Plataforma EduVanguard
          </a>
        </div>
      </div>
    <?php endif; ?>

  </main>

  <!-- Rodapé -->
  <footer class="border-t border-slate-800/80 bg-slate-900/40 py-6 text-center text-xs text-slate-500">
    <div class="max-w-5xl mx-auto px-4 flex flex-col sm:flex-row items-center justify-between gap-2">
      <div>EduVanguard &copy; <?php echo date('Y'); ?> - Sistema Educacional & Gestão de Cursos Online</div>
      <div>Hostinger KVM2 VPS Deployment Guide & Auto-Installer</div>
    </div>
  </footer>

</body>
</html>
