<?php
/**
 * 게시글 삭제 API (관리자 전용)
 * POST /php/posts/delete.php
 */

require_once __DIR__ . '/../config/database.php';
require_once __DIR__ . '/../includes/session.php';
require_once __DIR__ . '/../includes/functions.php';

// CORS 처리
header('Access-Control-Allow-Origin: *');
header('Access-Control-Allow-Methods: POST, DELETE, OPTIONS');
header('Access-Control-Allow-Headers: Content-Type');

if ($_SERVER['REQUEST_METHOD'] === 'OPTIONS') {
    exit;
}

if (!in_array($_SERVER['REQUEST_METHOD'], ['POST', 'DELETE'])) {
    jsonResponse(['error' => '잘못된 요청입니다.'], 405);
}

// 관리자 권한 확인
requireAdmin();

// JSON 또는 폼 데이터 받기
$contentType = $_SERVER['CONTENT_TYPE'] ?? '';

if (strpos($contentType, 'application/json') !== false) {
    $input = json_decode(file_get_contents('php://input'), true);
    $id = intval($input['id'] ?? 0);
    $csrfToken = $input['csrf_token'] ?? '';
} else {
    $id = intval($_POST['id'] ?? 0);
    $csrfToken = $_POST['csrf_token'] ?? '';
}

// CSRF 토큰 검증
if (!verifyCSRFToken($csrfToken)) {
    jsonResponse(['error' => '잘못된 요청입니다. (CSRF 토큰 검증 실패)'], 403);
}

if ($id <= 0) {
    jsonResponse(['error' => '잘못된 게시글 ID입니다.'], 400);
}

try {
    // 게시글 존재 확인
    $stmt = $pdo->prepare("SELECT id, board_type FROM posts WHERE id = ?");
    $stmt->execute([$id]);
    $post = $stmt->fetch();

    if (!$post) {
        jsonResponse(['error' => '게시글을 찾을 수 없습니다.'], 404);
    }

    // 삭제
    $stmt = $pdo->prepare("DELETE FROM posts WHERE id = ?");
    $stmt->execute([$id]);

    // 폼 제출인 경우 리다이렉트
    if (strpos($contentType, 'application/json') === false) {
        $redirect = $post['board_type'] === 'notice' ? '/pages/community/notice.html' : '/pages/community/press.html';
        header('Location: ' . $redirect);
        exit;
    }

    jsonResponse([
        'success' => true,
        'message' => '게시글이 삭제되었습니다.'
    ]);

} catch (PDOException $e) {
    error_log("Post delete error: " . $e->getMessage());
    jsonResponse(['error' => '게시글 삭제 중 오류가 발생했습니다.'], 500);
}
