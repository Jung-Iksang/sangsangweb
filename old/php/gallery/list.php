<?php
/**
 * 갤러리 목록 API
 * GET /php/gallery/list.php
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

$page = max(1, intval($_GET['page'] ?? 1));
$limit = min(50, max(1, intval($_GET['limit'] ?? 12)));
$offset = ($page - 1) * $limit;

// 메인 페이지용 최신 갤러리
$isMain = isset($_GET['main']);
if ($isMain) {
    $limit = 6;
    $offset = 0;
}

try {
    // 전체 개수
    $countStmt = $pdo->query("SELECT COUNT(*) FROM gallery");
    $total = $countStmt->fetchColumn();

    // 갤러리 목록
    $sql = "
        SELECT
            g.id,
            g.title,
            g.image_path,
            g.thumbnail_path,
            g.views,
            g.created_at,
            u.username as author_name
        FROM gallery g
        JOIN users u ON g.author_id = u.id
        ORDER BY g.created_at DESC
        LIMIT :limit OFFSET :offset
    ";

    $stmt = $pdo->prepare($sql);
    $stmt->bindValue(':limit', $limit, PDO::PARAM_INT);
    $stmt->bindValue(':offset', $offset, PDO::PARAM_INT);
    $stmt->execute();

    $items = $stmt->fetchAll();

    // 날짜 포맷팅 및 이미지 경로 수정
    foreach ($items as &$item) {
        $item['created_at_formatted'] = formatDate($item['created_at']);
        // 이미지 경로가 상대 경로인 경우 절대 경로로 변환
        if ($item['image_path'] && strpos($item['image_path'], '/') !== 0) {
            $item['image_path'] = '/uploads/gallery/' . basename($item['image_path']);
        }
        if ($item['thumbnail_path'] && strpos($item['thumbnail_path'], '/') !== 0) {
            $item['thumbnail_path'] = '/uploads/gallery/' . basename($item['thumbnail_path']);
        }
    }

    jsonResponse([
        'success' => true,
        'data' => $items,
        'pagination' => $isMain ? null : [
            'current_page' => $page,
            'total_pages' => ceil($total / $limit),
            'total_items' => $total,
            'items_per_page' => $limit
        ]
    ]);

} catch (PDOException $e) {
    error_log("Gallery list error: " . $e->getMessage());
    jsonResponse(['error' => '갤러리 목록을 불러오는 중 오류가 발생했습니다.'], 500);
}
