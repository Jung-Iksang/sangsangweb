<?php
/**
 * 게시글 목록 조회 API
 * GET /php/posts/list.php?type=notice&page=1&limit=10
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

// 파라미터
$type = $_GET['type'] ?? 'notice'; // notice 또는 press
$page = max(1, intval($_GET['page'] ?? 1));
$limit = min(50, max(1, intval($_GET['limit'] ?? 10)));
$forMain = isset($_GET['main']); // 메인페이지용 (최신 4개)

// 타입 검증
if (!in_array($type, ['notice', 'press'])) {
    jsonResponse(['error' => '잘못된 게시판 타입입니다.'], 400);
}

try {
    // 전체 개수 조회
    $stmt = $pdo->prepare("SELECT COUNT(*) FROM posts WHERE board_type = ?");
    $stmt->execute([$type]);
    $totalItems = $stmt->fetchColumn();

    // 메인페이지용
    if ($forMain) {
        $limit = 4;
        $page = 1;
    }

    // 페이지네이션 계산
    $pagination = paginate($totalItems, $page, $limit);

    // 게시글 조회
    $stmt = $pdo->prepare("
        SELECT p.id, p.title, p.views, p.created_at,
               u.username as author
        FROM posts p
        JOIN users u ON p.author_id = u.id
        WHERE p.board_type = ?
        ORDER BY p.created_at DESC
        LIMIT ? OFFSET ?
    ");
    $stmt->execute([$type, $limit, $pagination['offset']]);
    $posts = $stmt->fetchAll();

    // 날짜 포맷팅
    foreach ($posts as &$post) {
        $post['created_at_formatted'] = formatDate($post['created_at']);
    }

    jsonResponse([
        'success' => true,
        'data' => $posts,
        'pagination' => $pagination
    ]);

} catch (PDOException $e) {
    error_log("Posts list error: " . $e->getMessage());
    jsonResponse(['error' => '게시글 목록을 불러오는 중 오류가 발생했습니다.'], 500);
}
