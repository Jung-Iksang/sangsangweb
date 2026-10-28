<?php
/**
 * 세션 관리
 */

if (session_status() === PHP_SESSION_NONE) {
    // 세션 쿠키 설정 - 경로를 /로 설정하여 모든 페이지에서 세션 유지
    session_set_cookie_params([
        'lifetime' => 0,
        'path' => '/',
        'domain' => '',
        'secure' => isset($_SERVER['HTTPS']) && $_SERVER['HTTPS'] !== 'off',
        'httponly' => true,
        'samesite' => 'Lax'
    ]);
    session_start();
}

/**
 * 로그인 여부 확인
 */
function isLoggedIn() {
    return isset($_SESSION['user_id']) && !empty($_SESSION['user_id']);
}

/**
 * 관리자 여부 확인
 */
function isAdmin() {
    return isLoggedIn() && isset($_SESSION['role']) && $_SESSION['role'] === 'admin';
}

/**
 * 현재 사용자 ID 반환
 */
function getCurrentUserId() {
    return $_SESSION['user_id'] ?? null;
}

/**
 * 현재 사용자 이름 반환
 */
function getCurrentUsername() {
    return $_SESSION['username'] ?? null;
}

/**
 * CSRF 토큰 생성
 */
function generateCSRFToken() {
    if (empty($_SESSION['csrf_token'])) {
        $_SESSION['csrf_token'] = bin2hex(random_bytes(32));
    }
    return $_SESSION['csrf_token'];
}

/**
 * CSRF 토큰 검증
 */
function verifyCSRFToken($token) {
    return isset($_SESSION['csrf_token']) && hash_equals($_SESSION['csrf_token'], $token);
}

/**
 * 로그인 필요 - 미로그인시 에러 반환
 */
function requireLogin() {
    if (!isLoggedIn()) {
        http_response_code(401);
        echo json_encode(['error' => '로그인이 필요합니다.']);
        exit;
    }
}

/**
 * 관리자 권한 필요
 */
function requireAdmin() {
    requireLogin();
    if (!isAdmin()) {
        http_response_code(403);
        echo json_encode(['error' => '관리자 권한이 필요합니다.']);
        exit;
    }
}
