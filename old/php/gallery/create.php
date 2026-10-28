<?php
/**
 * 갤러리 생성 API (로그인 회원 + 관리자)
 * POST /php/gallery/create.php
 *
 * 일반 회원도 갤러리에 글 작성 가능
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

// 로그인 필요 (일반 회원도 가능)
requireLogin();

// 제목
$title = sanitize($_POST['title'] ?? '');

if (empty($title)) {
    jsonResponse(['error' => '제목을 입력해주세요.'], 400);
}

if (strlen($title) > 255) {
    jsonResponse(['error' => '제목은 255자 이내로 입력해주세요.'], 400);
}

// 이미지 파일 확인
if (!isset($_FILES['image']) || $_FILES['image']['error'] === UPLOAD_ERR_NO_FILE) {
    jsonResponse(['error' => '이미지를 업로드해주세요.'], 400);
}

// 이미지 업로드 처리
$uploadResult = uploadImage($_FILES['image'], 'uploads/gallery/');

if (!$uploadResult['success']) {
    jsonResponse(['error' => $uploadResult['error']], 400);
}

try {
    $stmt = $pdo->prepare("
        INSERT INTO gallery (title, image_path, thumbnail_path, author_id)
        VALUES (?, ?, ?, ?)
    ");

    $stmt->execute([
        $title,
        $uploadResult['path'],
        $uploadResult['thumbnail'] ?? $uploadResult['path'],
        getCurrentUserId()
    ]);

    $newId = $pdo->lastInsertId();

    jsonResponse([
        'success' => true,
        'message' => '갤러리가 등록되었습니다.',
        'data' => [
            'id' => $newId,
            'image_path' => $uploadResult['path']
        ]
    ], 201);

} catch (PDOException $e) {
    // 업로드된 이미지 삭제
    deleteImage($uploadResult['path']);
    if (isset($uploadResult['thumbnail'])) {
        deleteImage($uploadResult['thumbnail']);
    }

    error_log("Gallery create error: " . $e->getMessage());
    jsonResponse(['error' => '갤러리 등록 중 오류가 발생했습니다.'], 500);
}
