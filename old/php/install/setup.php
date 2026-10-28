<?php
/**
 * 초기 설치 스크립트
 * 테이블 생성 및 관리자 계정 생성
 *
 * 설치 완료 후 이 파일을 삭제하거나 이름 변경 권장
 */

// 설치 잠금 확인 - 이미 설치된 경우 접근 차단
$lockFile = __DIR__ . '/install.lock';
if (file_exists($lockFile)) {
    http_response_code(403);
    die('설치가 이미 완료되었습니다. 이 스크립트는 비활성화되었습니다.');
}

require_once __DIR__ . '/../config/database.php';

header('Content-Type: text/html; charset=utf-8');

echo "<h1>상상마루 데이터베이스 설치</h1>";
echo "<pre>";

try {
    // 1. users 테이블 생성
    $pdo->exec("
        CREATE TABLE IF NOT EXISTS users (
            id INT AUTO_INCREMENT PRIMARY KEY,
            username VARCHAR(50) UNIQUE NOT NULL,
            email VARCHAR(100) UNIQUE NOT NULL,
            password VARCHAR(255) NOT NULL,
            role ENUM('admin', 'user') DEFAULT 'user',
            created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP
        ) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_unicode_ci
    ");
    echo "✅ users 테이블 생성 완료\n";

    // 2. posts 테이블 생성 (공지사항, 보도자료)
    $pdo->exec("
        CREATE TABLE IF NOT EXISTS posts (
            id INT AUTO_INCREMENT PRIMARY KEY,
            board_type ENUM('notice', 'press') NOT NULL,
            title VARCHAR(255) NOT NULL,
            content TEXT NOT NULL,
            author_id INT NOT NULL,
            views INT DEFAULT 0,
            created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
            updated_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP ON UPDATE CURRENT_TIMESTAMP,
            FOREIGN KEY (author_id) REFERENCES users(id) ON DELETE CASCADE
        ) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_unicode_ci
    ");
    echo "✅ posts 테이블 생성 완료\n";

    // 3. gallery 테이블 생성
    $pdo->exec("
        CREATE TABLE IF NOT EXISTS gallery (
            id INT AUTO_INCREMENT PRIMARY KEY,
            title VARCHAR(255) NOT NULL,
            image_path VARCHAR(255) NOT NULL,
            thumbnail_path VARCHAR(255),
            author_id INT NOT NULL,
            views INT DEFAULT 0,
            created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
            FOREIGN KEY (author_id) REFERENCES users(id) ON DELETE CASCADE
        ) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_unicode_ci
    ");
    echo "✅ gallery 테이블 생성 완료\n";

    // 4. 관리자 계정 생성 (없으면)
    $adminUsername = 'cybercops';
    $adminEmail = 'admin@sangsangmaru.com';
    $adminRawPassword = getenv('ADMIN_PASSWORD');
    if (empty($adminRawPassword)) {
        echo "❌ 환경변수 ADMIN_PASSWORD가 설정되지 않았습니다. .env 파일을 확인하세요.\n";
        echo "</pre>";
        exit;
    }
    $adminPassword = password_hash($adminRawPassword, PASSWORD_DEFAULT);

    // 이미 존재하는지 확인
    $stmt = $pdo->prepare("SELECT id FROM users WHERE username = ?");
    $stmt->execute([$adminUsername]);

    if (!$stmt->fetch()) {
        $stmt = $pdo->prepare("
            INSERT INTO users (username, email, password, role)
            VALUES (?, ?, ?, 'admin')
        ");
        $stmt->execute([$adminUsername, $adminEmail, $adminPassword]);
        echo "✅ 관리자 계정 생성 완료 (아이디: cybercops)\n";
    } else {
        echo "ℹ️ 관리자 계정이 이미 존재합니다.\n";
    }

    // 설치 잠금 파일 생성
    file_put_contents($lockFile, date('Y-m-d H:i:s') . ' 설치 완료');

    echo "\n========================================\n";
    echo "🎉 설치가 완료되었습니다!\n";
    echo "========================================\n";
    echo "\n⚠️ 보안을 위해 이 파일(setup.php)을 삭제하거나 이름을 변경하세요.\n";
    echo "ℹ️ install.lock 파일이 생성되어 재실행이 차단됩니다.\n";

} catch (PDOException $e) {
    echo "❌ 오류 발생: " . $e->getMessage() . "\n";
}

echo "</pre>";
