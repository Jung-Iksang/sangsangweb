<?php
/**
 * 공통 함수
 */

/**
 * JSON 응답 반환
 */
function jsonResponse($data, $statusCode = 200) {
    http_response_code($statusCode);
    header('Content-Type: application/json; charset=utf-8');
    header('Access-Control-Allow-Origin: *');
    header('Access-Control-Allow-Methods: GET, POST, PUT, DELETE, OPTIONS');
    header('Access-Control-Allow-Headers: Content-Type');
    echo json_encode($data, JSON_UNESCAPED_UNICODE);
    exit;
}

/**
 * XSS 방지를 위한 출력 이스케이프
 */
function escape($string) {
    return htmlspecialchars($string, ENT_QUOTES, 'UTF-8');
}

/**
 * 입력값 정리
 */
function sanitize($input) {
    if (is_array($input)) {
        return array_map('sanitize', $input);
    }
    return trim(strip_tags($input));
}

/**
 * 리다이렉트 URL 검증 (오픈 리다이렉트 방지)
 * 상대 경로(/로 시작)만 허용, 외부 URL 차단
 */
function sanitizeRedirect($url, $default = '/') {
    $url = trim($url);
    // 빈 값이면 기본값
    if (empty($url)) return $default;
    // 프로토콜 포함 URL 차단 (http://, https://, // 등)
    if (preg_match('#^(https?:)?//#i', $url)) return $default;
    // /로 시작하지 않으면 차단
    if ($url[0] !== '/') return $default;
    return $url;
}

/**
 * 날짜 포맷팅
 */
function formatDate($datetime, $format = 'Y.m.d') {
    return date($format, strtotime($datetime));
}

/**
 * 페이지네이션 계산
 */
function paginate($totalItems, $currentPage = 1, $perPage = 10) {
    $totalPages = ceil($totalItems / $perPage);
    $currentPage = max(1, min($currentPage, $totalPages));
    $offset = ($currentPage - 1) * $perPage;

    return [
        'current_page' => $currentPage,
        'page' => $currentPage,
        'per_page' => $perPage,
        'total_items' => $totalItems,
        'total_pages' => $totalPages,
        'offset' => $offset,
        'has_prev' => $currentPage > 1,
        'has_next' => $currentPage < $totalPages
    ];
}

/**
 * 파일 업로드 처리
 */
function uploadImage($file, $uploadDir = 'uploads/gallery/') {
    $allowedTypes = ['image/jpeg', 'image/png', 'image/gif', 'image/webp'];
    $maxSize = 5 * 1024 * 1024; // 5MB

    // 파일 검증
    if ($file['error'] !== UPLOAD_ERR_OK) {
        return ['error' => '파일 업로드에 실패했습니다.'];
    }

    if ($file['size'] > $maxSize) {
        return ['error' => '파일 크기는 5MB를 초과할 수 없습니다.'];
    }

    $finfo = finfo_open(FILEINFO_MIME_TYPE);
    $mimeType = finfo_file($finfo, $file['tmp_name']);
    finfo_close($finfo);

    if (!in_array($mimeType, $allowedTypes)) {
        return ['error' => '허용되지 않는 파일 형식입니다. (JPG, PNG, GIF, WEBP만 가능)'];
    }

    // 파일명 생성 (해시 + 타임스탬프)
    $extension = pathinfo($file['name'], PATHINFO_EXTENSION);
    $filename = md5(uniqid() . time()) . '.' . strtolower($extension);
    $filepath = $uploadDir . $filename;

    // 디렉토리 확인 및 생성
    $fullUploadDir = __DIR__ . '/../../' . $uploadDir;
    if (!is_dir($fullUploadDir)) {
        mkdir($fullUploadDir, 0755, true);
    }

    // 파일 이동
    $fullPath = $fullUploadDir . $filename;
    if (!move_uploaded_file($file['tmp_name'], $fullPath)) {
        return ['error' => '파일 저장에 실패했습니다.'];
    }

    return ['success' => true, 'path' => $filepath, 'filename' => $filename];
}

/**
 * 이미지 삭제
 */
function deleteImage($filepath) {
    $fullPath = __DIR__ . '/../../' . $filepath;
    if (file_exists($fullPath)) {
        return unlink($fullPath);
    }
    return false;
}
