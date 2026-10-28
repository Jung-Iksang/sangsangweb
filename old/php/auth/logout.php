<?php
/**
 * 로그아웃 처리
 */

require_once __DIR__ . '/../includes/session.php';
require_once __DIR__ . '/../includes/functions.php';

// 세션 파기
$_SESSION = [];

if (ini_get("session.use_cookies")) {
    $params = session_get_cookie_params();
    setcookie(session_name(), '', time() - 42000,
        $params["path"], $params["domain"],
        $params["secure"], $params["httponly"]
    );
}

session_destroy();

// JSON 요청인 경우 JSON 응답 (fetch API 지원)
$contentType = $_SERVER['CONTENT_TYPE'] ?? '';
$acceptHeader = $_SERVER['HTTP_ACCEPT'] ?? '';
$isAjax = isset($_SERVER['HTTP_X_REQUESTED_WITH']) &&
          strtolower($_SERVER['HTTP_X_REQUESTED_WITH']) === 'xmlhttprequest';
$isJson = strpos($contentType, 'application/json') !== false ||
          strpos($acceptHeader, 'application/json') !== false;

if ($isAjax || $isJson) {
    jsonResponse(['success' => true, 'message' => '로그아웃 되었습니다.']);
}

// 일반 요청인 경우 리다이렉트
$redirect = sanitizeRedirect($_GET['redirect'] ?? '/');
header('Location: ' . $redirect);
exit;
