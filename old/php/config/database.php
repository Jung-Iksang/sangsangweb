<?php
/**
 * 데이터베이스 연결 설정
 * 상상마루 - sangsangmaru.mireene.co.kr
 *
 * 자격증명은 프로젝트 루트의 .env 파일에서 로드합니다.
 * .env.example을 참고하여 .env 파일을 생성하세요.
 */

// .env 파일 파싱
$envFile = __DIR__ . '/../../.env';
if (file_exists($envFile)) {
    $lines = file($envFile, FILE_IGNORE_NEW_LINES | FILE_SKIP_EMPTY_LINES);
    foreach ($lines as $line) {
        if (strpos(trim($line), '#') === 0) continue;
        if (strpos($line, '=') === false) continue;
        list($key, $value) = explode('=', $line, 2);
        $key = trim($key);
        $value = trim($value);
        if (!getenv($key)) {
            putenv("$key=$value");
        }
    }
}

define('DB_HOST', getenv('DB_HOST') ?: 'localhost');
define('DB_NAME', getenv('DB_NAME') ?: 'sangsangmaru');
define('DB_USER', getenv('DB_USER') ?: 'sangsangmaru');
define('DB_PASS', getenv('DB_PASS') ?: '');

// PDO 연결 옵션
$options = [
    PDO::ATTR_ERRMODE => PDO::ERRMODE_EXCEPTION,
    PDO::ATTR_DEFAULT_FETCH_MODE => PDO::FETCH_ASSOC,
    PDO::ATTR_EMULATE_PREPARES => false,
    PDO::MYSQL_ATTR_INIT_COMMAND => "SET NAMES utf8mb4"
];

try {
    $pdo = new PDO(
        "mysql:host=" . DB_HOST . ";dbname=" . DB_NAME . ";charset=utf8mb4",
        DB_USER,
        DB_PASS,
        $options
    );
} catch (PDOException $e) {
    // 프로덕션에서는 상세 에러 숨김
    error_log("Database connection failed: " . $e->getMessage());
    die(json_encode(['error' => '데이터베이스 연결에 실패했습니다.']));
}
