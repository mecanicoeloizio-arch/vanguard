<?php
/**
 * EloContábil - Front Controller Principal
 * Subdomínio: elocontabil.grupoeloizio.com.br
 * Diretório Raiz: /elocontabil/public/
 * Grupo Eloizio 2026
 */

declare(strict_types=1);

if (session_status() === PHP_SESSION_NONE) {
    session_start();
}

require_once dirname(__DIR__) . '/config/config.php';
require_once dirname(__DIR__) . '/config/database.php';
require_once dirname(__DIR__) . '/app/controllers/CamillaController.php';
require_once dirname(__DIR__) . '/app/controllers/ModulosController.php';

$requestUri = parse_url($_SERVER['REQUEST_URI'] ?? '/', PHP_URL_PATH);
$route = '/' . trim((string)$requestUri, '/');

// Tratamento para subdiretórios se acessado via proxy
$route = preg_replace('#^/elocontabil/public#', '', $route);
if ($route === '') $route = '/';

// 1. Rota de Acesso com Token (/acesso/{token})
if (preg_match('#^/acesso/([a-zA-Z0-9]+)$#', $route, $matches)) {
    $camilla = new CamillaController();
    $camilla->validarToken($matches[1]);
    exit;
}

// 2. Rota AJAX de Verificação de Contato pela Camilla (/api/verificar_contato)
if ($route === '/api/verificar_contato') {
    $camilla = new CamillaController();
    $camilla->verificarContato();
    exit;
}

// 3. Logout
if ($route === '/logout') {
    $camilla = new CamillaController();
    $camilla->logout();
    exit;
}

// 4. Ações de Formulário (Salvar Funcionário / Documento)
if ($route === '/acao/salvar_funcionario' && $_SERVER['REQUEST_METHOD'] === 'POST') {
    $ctrl = new ModulosController();
    $ctrl->salvarFuncionario($_POST);
    header("Location: " . BASE_URL . "/dashboard?tab=rh&sucesso=funcionario_adicionado");
    exit;
}

if ($route === '/acao/salvar_documento' && $_SERVER['REQUEST_METHOD'] === 'POST') {
    $ctrl = new ModulosController();
    $ctrl->salvarDocumentoCofre($_POST);
    header("Location: " . BASE_URL . "/dashboard?tab=admin&sucesso=documento_salvo");
    exit;
}

// 5. Dashboard (Requer sessão autenticada por token)
if ($route === '/dashboard') {
    $userSession = $_SESSION['elocontabil_user'] ?? null;
    if (!$userSession || time() > ($userSession['expires_at'] ?? 0)) {
        header("Location: " . BASE_URL . "/?erro=sessao_expirada");
        exit;
    }

    $modulosCtrl = new ModulosController();
    $dadosRH = $modulosCtrl->getDadosRH();
    $dadosAdmin = $modulosCtrl->getDadosAdministrativo();
    $dadosCamilla = $modulosCtrl->getDadosCamilla();

    require_once APP_PATH . '/views/dashboard.php';
    exit;
}

// 6. Home: Tela de Login Sem Senha (Exclusivo WhatsApp / E-mail com a Camilla)
require_once APP_PATH . '/views/home.php';
exit;
