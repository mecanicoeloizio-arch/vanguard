<?php
/**
 * EloMak - Front Controller Oficial
 * Subdomínio: https://elomak.grupoeloizio.com.br
 * Document Root: /elomak/public/
 * Grupo Eloizio 2026 • PHP 8.3 MVC
 */

declare(strict_types=1);

require_once dirname(__DIR__) . '/config/config.php';
require_once dirname(__DIR__) . '/config/database.php';
require_once dirname(__DIR__) . '/config/whatsapp.php';

// Controllers
require_once APP_PATH . '/controllers/CamillaController.php';
require_once APP_PATH . '/controllers/DashboardController.php';
require_once APP_PATH . '/controllers/OsController.php';
require_once APP_PATH . '/controllers/ClienteController.php';
require_once APP_PATH . '/controllers/OrcamentoController.php';
require_once APP_PATH . '/controllers/EstoqueController.php';
require_once APP_PATH . '/controllers/FinanceiroController.php';

// Roteamento Simples e Robusto
$requestUri = parse_url($_SERVER['REQUEST_URI'] ?? '/', PHP_URL_PATH);
$route = '/' . trim((string)$requestUri, '/');

// Tratamento de Subpastas se acessado via proxy (ex: /elomak/public/)
$route = preg_replace('#^/elomak/public#', '', $route);
if ($route === '') $route = '/';

// 1. Rota de Acesso com Token (/acesso/{token})
if (preg_match('#^/acesso/([a-zA-Z0-9]+)$#', $route, $matches)) {
    $camilla = new CamillaController();
    $camilla->validarTokenAcesso($matches[1]);
    exit;
}

// 2. Rota de Verificação de WhatsApp via AJAX (/camilla/verificar)
if ($route === '/camilla/verificar') {
    $camilla = new CamillaController();
    $camilla->verificarNumero();
    exit;
}

// 3. Logout
if ($route === '/logout') {
    $camilla = new CamillaController();
    $camilla->logout();
    exit;
}

// 4. Tela Inicial (Login Exclusivo via WhatsApp)
if ($route === '/' || $route === '/index.php') {
    if (isAuthenticated()) {
        redirect(BASE_URL . '/dashboard');
    }
    require_once APP_PATH . '/views/login_whatsapp.php';
    exit;
}

// 5. Dashboard
if ($route === '/dashboard') {
    $dash = new DashboardController();
    $dash->index();
    exit;
}

// 6. Ordens de Serviço
if ($route === '/os') {
    $osCtrl = new OsController();
    $osCtrl->index();
    exit;
}
if ($route === '/os/novo') {
    $osCtrl = new OsController();
    $osCtrl->novo();
    exit;
}
if ($route === '/os/salvar') {
    $osCtrl = new OsController();
    $osCtrl->salvar();
    exit;
}
if (preg_match('#^/os/detalhes/([0-9]+)$#', $route, $matches)) {
    $osCtrl = new OsController();
    $osCtrl->detalhes((int)$matches[1]);
    exit;
}
if ($route === '/os/atualizar-status') {
    $osCtrl = new OsController();
    $osCtrl->atualizarStatus();
    exit;
}
if (preg_match('#^/os/imprimir/([0-9]+)$#', $route, $matches)) {
    $osCtrl = new OsController();
    $osCtrl->imprimirPdf((int)$matches[1]);
    exit;
}

// 7. Clientes & Veículos
if ($route === '/clientes') {
    $cliCtrl = new ClienteController();
    $cliCtrl->index();
    exit;
}
if ($route === '/clientes/salvar') {
    $cliCtrl = new ClienteController();
    $cliCtrl->salvar();
    exit;
}
if ($route === '/clientes/consultar-placa') {
    $cliCtrl = new ClienteController();
    $cliCtrl->consultarPlaca();
    exit;
}

// 8. Orçamentos
if ($route === '/orcamentos') {
    $orcCtrl = new OrcamentoController();
    $orcCtrl->index();
    exit;
}
if ($route === '/orcamentos/salvar') {
    $orcCtrl = new OrcamentoController();
    $orcCtrl->salvar();
    exit;
}
if (preg_match('#^/orcamentos/converter/([0-9]+)$#', $route, $matches)) {
    $orcCtrl = new OrcamentoController();
    $orcCtrl->converterEmOs((int)$matches[1]);
    exit;
}

// 9. Estoque & Peças
if ($route === '/estoque') {
    $estCtrl = new EstoqueController();
    $estCtrl->index();
    exit;
}
if ($route === '/estoque/salvar') {
    $estCtrl = new EstoqueController();
    $estCtrl->salvar();
    exit;
}
if ($route === '/estoque/ajustar') {
    $estCtrl = new EstoqueController();
    $estCtrl->ajustarSaldo();
    exit;
}

// 10. Financeiro
if ($route === '/financeiro') {
    $finCtrl = new FinanceiroController();
    $finCtrl->index();
    exit;
}
if ($route === '/financeiro/salvar') {
    $finCtrl = new FinanceiroController();
    $finCtrl->salvar();
    exit;
}
if (preg_match('#^/financeiro/baixar/([0-9]+)$#', $route, $matches)) {
    $finCtrl = new FinanceiroController();
    $finCtrl->baixar((int)$matches[1]);
    exit;
}

// 404 Not Found
http_response_code(404);
echo "Página não encontrada no EloMak: " . htmlspecialchars($route);
