<?php
/**
 * 게시글 수정 API (관리자 전용)
 * POST /php/posts/update.php
 */

require_once __DIR__ . '/../config/database.php';
require_once __DIR__ . '/../includes/session.php';
require_once __DIR__ . '/../includes/functions.php';

// CORS 처리
header('Access-Control-Allow-Origin: *');
header('Access-Control-Allow-Methods: POST, PUT, OPTIONS');
header('Access-Control-Allow-Headers: Content-Type');

if ($_SERVER['REQUEST_METHOD'] === 'OPTIONS') {
    exit;
}

if (!in_array($_SERVER['REQUEST_METHOD'], ['POST', 'PUT'])) {
    jsonResponse(['error' => '잘못된 요청입니다.'], 405);
}

// 관리자 권한 확인
requireAdmin();

// JSON 또는 폼 데이터 받기
$contentType = $_SERVER['CONTENT_TYPE'] ?? '';

if (strpos($contentType, 'application/json') !== false) {
    $input = json_decode(file_get_contents('php://input'), true);
    $id = intval($input['id'] ?? 0);
    $title = sanitize($input['title'] ?? '');
    $content = $input['content'] ?? '';
} else {
    $id = intval($_POST['id'] ?? 0);
    $title = sanitize($_POST['title'] ?? '');
    $content = $_POST['content'] ?? '';
}

// 입력 검증
if ($id <= 0) {
    jsonResponse(['error' => '잘못된 게시글 ID입니다.'], 400);
}

if (empty($title)) {
    jsonResponse(['error' => '제목을 입력해주세요.'], 400);
}

if (empty($content)) {
    jsonResponse(['error' => '내용을 입력해주세요.'], 400);
}

try {
    // 게시글 존재 확인
    $stmt = $pdo->prepare("SELECT id, board_type FROM posts WHERE id = ?");
    $stmt->execute([$id]);
    $post = $stmt->fetch();

    if (!$post) {
        jsonResponse(['error' => '게시글을 찾을 수 없습니다.'], 404);
    }

    // 수정
    $stmt = $pdo->prepare("
        UPDATE posts SET title = ?, content = ?, updated_at = NOW()
        WHERE id = ?
    ");
    $stmt->execute([$title, $content, $id]);

    // 폼 제출인 경우 리다이렉트
    if (strpos($contentType, 'application/json') === false) {
        header('Location: /pages/community/view.html?id=' . $id);
        exit;
    }

    jsonResponse([
        'success' => true,
        'message' => '게시글이 수정되었습니다.'
    ]);

} catch (PDOException $e) {
    error_log("Post update error: " . $e->getMessage());
    jsonResponse(['error' => '게시글 수정 중 오류가 발생했습니다.'], 500);
}
