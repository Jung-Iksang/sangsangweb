<?php
/**
 * 회원가입 처리 API
 */

require_once __DIR__ . '/../config/database.php';
require_once __DIR__ . '/../includes/session.php';
require_once __DIR__ . '/../includes/functions.php';

// CORS 및 OPTIONS 처리
if ($_SERVER['REQUEST_METHOD'] === 'OPTIONS') {
    header('Access-Control-Allow-Origin: *');
    header('Access-Control-Allow-Methods: POST, OPTIONS');
    header('Access-Control-Allow-Headers: Content-Type');
    exit;
}

if ($_SERVER['REQUEST_METHOD'] !== 'POST') {
    jsonResponse(['error' => '잘못된 요청입니다.'], 405);
}

// JSON 또는 폼 데이터 받기
$contentType = $_SERVER['CONTENT_TYPE'] ?? '';

if (strpos($contentType, 'application/json') !== false) {
    $input = json_decode(file_get_contents('php://input'), true);
    $username = sanitize($input['username'] ?? '');
    $email = sanitize($input['email'] ?? '');
    $password = $input['password'] ?? '';
    $passwordConfirm = $input['password_confirm'] ?? '';
} else {
    $username = sanitize($_POST['username'] ?? '');
    $email = sanitize($_POST['email'] ?? '');
    $password = $_POST['password'] ?? '';
    $passwordConfirm = $_POST['password_confirm'] ?? '';
}

// 입력 검증
$errors = [];

if (empty($username)) {
    $errors[] = '사용자명을 입력해주세요.';
} elseif (strlen($username) < 2 || strlen($username) > 50) {
    $errors[] = '사용자명은 2~50자 사이여야 합니다.';
} elseif (!preg_match('/^[a-zA-Z0-9가-힣_]+$/', $username)) {
    $errors[] = '사용자명은 영문, 숫자, 한글, 밑줄(_)만 사용할 수 있습니다.';
}

if (empty($email)) {
    $errors[] = '이메일을 입력해주세요.';
} elseif (!filter_var($email, FILTER_VALIDATE_EMAIL)) {
    $errors[] = '올바른 이메일 형식이 아닙니다.';
}

if (empty($password)) {
    $errors[] = '비밀번호를 입력해주세요.';
} elseif (strlen($password) < 8) {
    $errors[] = '비밀번호는 8자 이상이어야 합니다.';
}

if ($password !== $passwordConfirm) {
    $errors[] = '비밀번호가 일치하지 않습니다.';
}

if (!empty($errors)) {
    jsonResponse(['error' => implode(' ', $errors)], 400);
}

try {
    // 중복 확인
    $stmt = $pdo->prepare("SELECT id FROM users WHERE username = ? OR email = ?");
    $stmt->execute([$username, $email]);

    if ($stmt->fetch()) {
        jsonResponse(['error' => '이미 사용 중인 사용자명 또는 이메일입니다.'], 400);
    }

    // 비밀번호 해시화
    $hashedPassword = password_hash($password, PASSWORD_DEFAULT);

    // 사용자 생성
    $stmt = $pdo->prepare("
        INSERT INTO users (username, email, password, role)
        VALUES (?, ?, ?, 'user')
    ");
    $stmt->execute([$username, $email, $hashedPassword]);

    $userId = $pdo->lastInsertId();

    // 자동 로그인
    $_SESSION['user_id'] = $userId;
    $_SESSION['username'] = $username;
    $_SESSION['email'] = $email;
    $_SESSION['role'] = 'user';

    // 폼 제출인 경우 리다이렉트
    if (strpos($contentType, 'application/json') === false) {
        $redirect = sanitizeRedirect($_POST['redirect'] ?? '/');
        header('Location: ' . $redirect);
        exit;
    }

    jsonResponse([
        'success' => true,
        'message' => '회원가입이 완료되었습니다.',
        'user' => [
            'id' => $userId,
            'username' => $username,
            'role' => 'user'
        ]
    ], 201);

} catch (PDOException $e) {
    error_log("Signup error: " . $e->getMessage());
    jsonResponse(['error' => '회원가입 처리 중 오류가 발생했습니다.'], 500);
}
