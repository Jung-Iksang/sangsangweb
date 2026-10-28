<?php
/**
 * 게시글 상세 조회 API
 * GET /php/posts/view.php?id=1
 */

require_once __DIR__ . '/../config/database.php';
require_once __DIR__ . '/../includes/functions.php';

// CORS 처리
header('Access-Control-Allow-Origin: *');
header('Access-Control-Allow-Methods: GET, OPTIONS');
header('Access-Control-Allow-Headers: Content-Type');

if ($_SERVER['REQUEST_METHOD'] === 'OPTIONS') {
    exit;
}

if ($_SERVER['REQUEST_METHOD'] !== 'GET') {
    jsonResponse(['error' => '잘못된 요청입니다.'], 405);
}

$id = intval($_GET['id'] ?? 0);

if ($id <= 0) {
    jsonResponse(['error' => '잘못된 게시글 ID입니다.'], 400);
}

try {
    // 조회수 증가
    $stmt = $pdo->prepare("UPDATE posts SET views = views + 1 WHERE id = ?");
    $stmt->execute([$id]);

    // 게시글 조회
    $stmt = $pdo->prepare("
        SELECT p.id, p.board_type, p.title, p.content, p.views, p.created_at, p.updated_at,
               u.username as author, u.id as author_id
        FROM posts p
        JOIN users u ON p.author_id = u.id
        WHERE p.id = ?
    ");
    $stmt->execute([$id]);
    $post = $stmt->fetch();

    if (!$post) {
        jsonResponse(['error' => '게시글을 찾을 수 없습니다.'], 404);
    }

    // 날짜 포맷팅
    $post['created_at_formatted'] = formatDate($post['created_at'], 'Y.m.d H:i');
    $post['updated_at_formatted'] = formatDate($post['updated_at'], 'Y.m.d H:i');

    // 이전글/다음글
    $stmtPrev = $pdo->prepare("
        SELECT id, title FROM posts
        WHERE board_type = ? AND id < ?
        ORDER BY id DESC LIMIT 1
    ");
    $stmtPrev->execute([$post['board_type'], $id]);
    $prevPost = $stmtPrev->fetch();

    $stmtNext = $pdo->prepare("
        SELECT id, title FROM posts
        WHERE board_type = ? AND id > ?
        ORDER BY id ASC LIMIT 1
    ");
    $stmtNext->execute([$post['board_type'], $id]);
    $nextPost = $stmtNext->fetch();

    jsonResponse([
        'success' => true,
        'data' => $post,
        'prev' => $prevPost ?: null,
        'next' => $nextPost ?: null
    ]);

} catch (PDOException $e) {
    error_log("Post view error: " . $e->getMessage());
    jsonResponse(['error' => '게시글을 불러오는 중 오류가 발생했습니다.'], 500);
}
