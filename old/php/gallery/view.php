<?php
/**
 * 갤러리 상세 API
 * GET /php/gallery/view.php?id=1
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
    jsonResponse(['error' => '잘못된 갤러리 ID입니다.'], 400);
}

try {
    // 조회수 증가
    $pdo->prepare("UPDATE gallery SET views = views + 1 WHERE id = ?")->execute([$id]);

    // 갤러리 조회
    $sql = "
        SELECT
            g.id,
            g.title,
            g.image_path,
            g.thumbnail_path,
            g.views,
            g.created_at,
            g.author_id,
            u.username as author_name
        FROM gallery g
        JOIN users u ON g.author_id = u.id
        WHERE g.id = ?
    ";

    $stmt = $pdo->prepare($sql);
    $stmt->execute([$id]);
    $item = $stmt->fetch();

    if (!$item) {
        jsonResponse(['error' => '갤러리를 찾을 수 없습니다.'], 404);
    }

    $item['created_at_formatted'] = formatDate($item['created_at']);

    // 이미지 경로가 상대 경로인 경우 절대 경로로 변환
    if ($item['image_path'] && strpos($item['image_path'], '/') !== 0) {
        $item['image_path'] = '/uploads/gallery/' . basename($item['image_path']);
    }
    if ($item['thumbnail_path'] && strpos($item['thumbnail_path'], '/') !== 0) {
        $item['thumbnail_path'] = '/uploads/gallery/' . basename($item['thumbnail_path']);
    }

    // 이전/다음 갤러리
    $prevStmt = $pdo->prepare("SELECT id, title FROM gallery WHERE id < ? ORDER BY id DESC LIMIT 1");
    $prevStmt->execute([$id]);
    $prev = $prevStmt->fetch();

    $nextStmt = $pdo->prepare("SELECT id, title FROM gallery WHERE id > ? ORDER BY id ASC LIMIT 1");
    $nextStmt->execute([$id]);
    $next = $nextStmt->fetch();

    jsonResponse([
        'success' => true,
        'data' => $item,
        'navigation' => [
            'prev' => $prev ?: null,
            'next' => $next ?: null
        ]
    ]);

} catch (PDOException $e) {
    error_log("Gallery view error: " . $e->getMessage());
    jsonResponse(['error' => '갤러리를 불러오는 중 오류가 발생했습니다.'], 500);
}
