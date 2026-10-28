<?php
/**
 * 로그인 처리 API
 * POST: 로그인 실행
 * GET: 현재 로그인 상태 확인
 */

require_once __DIR__ . '/../config/database.php';
require_once __DIR__ . '/../includes/session.php';
require_once __DIR__ . '/../includes/functions.php';

// CORS 및 OPTIONS 처리
if ($_SERVER['REQUEST_METHOD'] === 'OPTIONS') {
    header('Access-Control-Allow-Origin: *');
    header('Access-Control-Allow-Methods: GET, POST, OPTIONS');
    header('Access-Control-Allow-Headers: Content-Type');
    exit;
}

// GET: 로그인 상태 확인
if ($_SERVER['REQUEST_METHOD'] === 'GET') {
    if (isLoggedIn()) {
        jsonResponse([
            'logged_in' => true,
            'user' => [
                'id' => $_SESSION['user_id'],
                'username' => $_SESSION['username'],
                'role' => $_SESSION['role']
            ],
            'csrf_token' => generateCSRFToken()
        ]);
    } else {
        jsonResponse(['logged_in' => false]);
    }
}

// POST: 로그인 처리
if ($_SERVER['REQUEST_METHOD'] === 'POST') {
    // JSON 또는 폼 데이터 받기
    $contentType = $_SERVER['CONTENT_TYPE'] ?? '';

    if (strpos($contentType, 'application/json') !== false) {
        $input = json_decode(file_get_contents('php://input'), true);
        $username = $input['username'] ?? '';
        $password = $input['password'] ?? '';
    } else {
        $username = $_POST['username'] ?? '';
        $password = $_POST['password'] ?? '';
    }

    // 입력 검증
    if (empty($username) || empty($password)) {
        jsonResponse(['error' => '아이디와 비밀번호를 입력해주세요.'], 400);
    }

    try {
        // 사용자 조회 (사용자명으로 로그인)
        $stmt = $pdo->prepare("
            SELECT id, username, email, password, role
            FROM users
            WHERE username = ?
        ");
        $stmt->execute([$username]);
        $user = $stmt->fetch();

        if (!$user || !password_verify($password, $user['password'])) {
            jsonResponse(['error' => '아이디 또는 비밀번호가 올바르지 않습니다.'], 401);
        }

        // 세션에 사용자 정보 저장
        $_SESSION['user_id'] = $user['id'];
        $_SESSION['username'] = $user['username'];
        $_SESSION['email'] = $user['email'];
        $_SESSION['role'] = $user['role'];

        // 폼 제출인 경우 리다이렉트
        if (strpos($contentType, 'application/json') === false) {
            $redirect = sanitizeRedirect($_POST['redirect'] ?? '/');
            header('Location: ' . $redirect);
            exit;
        }

        jsonResponse([
            'success' => true,
            'message' => '로그인 성공',
            'user' => [
                'id' => $user['id'],
                'username' => $user['username'],
                'role' => $user['role']
            ]
        ]);

    } catch (PDOException $e) {
        error_log("Login error: " . $e->getMessage());
        jsonResponse(['error' => '로그인 처리 중 오류가 발생했습니다.'], 500);
    }
}

jsonResponse(['error' => '잘못된 요청입니다.'], 405);
