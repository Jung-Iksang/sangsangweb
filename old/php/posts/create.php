<?php
/**
 * 게시글 작성 API (관리자 전용)
 * POST /php/posts/create.php
 */

require_once __DIR__ . '/../config/database.php';
require_once __DIR__ . '/../includes/session.php';
require_once __DIR__ . '/../includes/functions.php';

// CORS 처리
header('Access-Control-Allow-Origin: *');
header('Access-Control-Allow-Methods: POST, OPTIONS');
header('Access-Control-Allow-Headers: Content-Type');

if ($_SERVER['REQUEST_METHOD'] === 'OPTIONS') {
    exit;
}

if ($_SERVER['REQUEST_METHOD'] !== 'POST') {
    jsonResponse(['error' => '잘못된 요청입니다.'], 405);
}

// 관리자 권한 확인
requireAdmin();

// JSON 또는 폼 데이터 받기
$contentType = $_SERVER['CONTENT_TYPE'] ?? '';

if (strpos($contentType, 'application/json') !== false) {
    $input = json_decode(file_get_contents('php://input'), true);
    $boardType = sanitize($input['board_type'] ?? '');
    $title = sanitize($input['title'] ?? '');
    $content = $input['content'] ?? ''; // HTML 허용
} else {
    $boardType = sanitize($_POST['board_type'] ?? '');
    $title = sanitize($_POST['title'] ?? '');
    $content = $_POST['content'] ?? '';
}

// 입력 검증
$errors = [];

if (!in_array($boardType, ['notice', 'press'])) {
    $errors[] = '잘못된 게시판 타입입니다.';
}

if (empty($title)) {
    $errors[] = '제목을 입력해주세요.';
} elseif (strlen($title) > 255) {
    $errors[] = '제목은 255자를 초과할 수 없습니다.';
}

if (empty($content)) {
    $errors[] = '내용을 입력해주세요.';
}

if (!empty($errors)) {
    jsonResponse(['error' => implode(' ', $errors)], 400);
}

try {
    $stmt = $pdo->prepare("
        INSERT INTO posts (board_type, title, content, author_id)
        VALUES (?, ?, ?, ?)
    ");
    $stmt->execute([$boardType, $title, $content, getCurrentUserId()]);

    $postId = $pdo->lastInsertId();

    // 폼 제출인 경우 리다이렉트
    if (strpos($contentType, 'application/json') === false) {
        $redirect = $boardType === 'notice' ? '/pages/community/notice.html' : '/pages/community/press.html';
        header('Location: ' . $redirect);
        exit;
    }

    jsonResponse([
        'success' => true,
        'message' => '게시글이 등록되었습니다.',
        'id' => $postId
    ], 201);

} catch (PDOException $e) {
    error_log("Post create error: " . $e->getMessage());
    jsonResponse(['error' => '게시글 등록 중 오류가 발생했습니다.'], 500);
}
