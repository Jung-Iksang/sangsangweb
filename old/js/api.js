/**
 * 상상마루 API 클라이언트
 */

const API_BASE = '/php';

// CSRF 토큰 저장소
let _csrfToken = null;

function getCSRFToken() {
    return _csrfToken;
}

function setCSRFToken(token) {
    if (token) _csrfToken = token;
}

/**
 * API 요청 헬퍼
 */
async function apiRequest(endpoint, options = {}) {
    const url = API_BASE + endpoint;
    const defaultOptions = {
        credentials: 'include',  // 세션 쿠키 포함
        headers: {
            'Content-Type': 'application/json'
        }
    };

    const mergedOptions = {
        ...defaultOptions,
        ...options,
        credentials: 'include',  // 항상 쿠키 포함
        headers: {
            ...defaultOptions.headers,
            ...options.headers
        }
    };

    try {
        const response = await fetch(url, mergedOptions);
        const data = await response.json();

        if (!response.ok) {
            throw new Error(data.error || '요청 처리 중 오류가 발생했습니다.');
        }

        return data;
    } catch (error) {
        console.error('API Error:', error);
        throw error;
    }
}

/**
 * 인증 API
 */
const AuthAPI = {
    // 로그인 상태 확인
    async checkStatus() {
        const response = await apiRequest('/auth/login.php');
        if (response.csrf_token) setCSRFToken(response.csrf_token);
        return response;
    },

    // 로그인
    async login(username, password) {
        return apiRequest('/auth/login.php', {
            method: 'POST',
            body: JSON.stringify({ username, password })
        });
    },

    // 로그아웃
    async logout() {
        return apiRequest('/auth/logout.php', { method: 'POST' });
    },

    // 회원가입
    async signup(username, email, password, passwordConfirm) {
        return apiRequest('/auth/signup.php', {
            method: 'POST',
            body: JSON.stringify({
                username,
                email,
                password,
                password_confirm: passwordConfirm
            })
        });
    }
};

/**
 * 게시글 API
 */
const PostsAPI = {
    // 목록 조회
    async list(type = 'notice', page = 1, limit = 10) {
        return apiRequest(`/posts/list.php?type=${type}&page=${page}&limit=${limit}`);
    },

    // 메인 페이지용 목록
    async listForMain(type = 'notice') {
        return apiRequest(`/posts/list.php?type=${type}&main`);
    },

    // 상세 조회
    async view(id) {
        return apiRequest(`/posts/view.php?id=${id}`);
    },

    // 생성 (관리자)
    async create(type, title, content) {
        return apiRequest('/posts/create.php', {
            method: 'POST',
            body: JSON.stringify({ board_type: type, title, content })
        });
    },

    // 수정 (관리자)
    async update(id, title, content) {
        return apiRequest('/posts/update.php', {
            method: 'POST',
            body: JSON.stringify({ id, title, content })
        });
    },

    // 삭제 (관리자)
    async delete(id) {
        return apiRequest('/posts/delete.php', {
            method: 'POST',
            body: JSON.stringify({ id, csrf_token: getCSRFToken() })
        });
    }
};

/**
 * 갤러리 API
 */
const GalleryAPI = {
    // 목록 조회
    async list(page = 1, limit = 12) {
        return apiRequest(`/gallery/list.php?page=${page}&limit=${limit}`);
    },

    // 메인 페이지용 목록
    async listForMain() {
        return apiRequest('/gallery/list.php?main');
    },

    // 상세 조회
    async view(id) {
        return apiRequest(`/gallery/view.php?id=${id}`);
    },

    // 생성 (로그인 회원) - FormData 사용
    async create(formData) {
        return fetch(API_BASE + '/gallery/create.php', {
            method: 'POST',
            credentials: 'include',  // 세션 쿠키 포함
            body: formData
        }).then(res => res.json());
    },

    // 삭제 (관리자)
    async delete(id) {
        return apiRequest('/gallery/delete.php', {
            method: 'POST',
            body: JSON.stringify({ id, csrf_token: getCSRFToken() })
        });
    }
};

/**
 * UI 헬퍼
 */
const UIHelper = {
    // 로그인 상태에 따른 네비게이션 업데이트
    async updateNavigation() {
        try {
            const response = await AuthAPI.checkStatus();
            const navButtonBox = document.querySelector('.nav-button-box');

            if (!navButtonBox) return;

            if (response.logged_in) {
                const user = response.user;

                // 네비게이션에는 사용자 정보와 로그아웃만 표시
                navButtonBox.innerHTML = `
                    <span class="user-info">${user.username}님</span>
                    <button class="div-wrapper logout-btn" aria-label="로그아웃">
                        <span class="text-wrapper-3">로그아웃</span>
                    </button>
                `;

                // 로그아웃 버튼 이벤트
                const logoutBtn = navButtonBox.querySelector('.logout-btn');
                if (logoutBtn) {
                    logoutBtn.addEventListener('click', async () => {
                        try {
                            await AuthAPI.logout();
                            window.location.reload();
                        } catch (error) {
                            alert('로그아웃 중 오류가 발생했습니다.');
                        }
                    });
                }

                // 현재 사용자 정보 저장 (다른 곳에서 사용)
                window.currentUser = user;
            }
        } catch (error) {
            console.log('로그인 상태 확인 실패:', error);
        }
    },

    // 게시글 목록 렌더링 (메인 페이지용)
    renderPostList(posts, containerId, linkBase) {
        const container = document.getElementById(containerId);
        if (!container) return;

        const ul = container.querySelector('.container-3');
        if (!ul) return;

        if (!posts || posts.length === 0) {
            ul.innerHTML = '<li class="container-4"><div class="text-4"><span class="p">등록된 글이 없습니다.</span></div></li>';
            return;
        }

        ul.innerHTML = posts.map((post, index) => `
            <li class="${index < 3 ? 'container-4' : 'container-5'}">
                <div class="text-${index === 0 ? '4' : (index + 4)}">
                    <a href="${linkBase}?id=${post.id}" class="${index === 0 ? 'p' : 'text-wrapper-14'}">${this.escapeHtml(post.title)}</a>
                </div>
                <div class="text-5">
                    <time datetime="${post.created_at}" class="text-wrapper-13">${post.created_at_formatted}</time>
                </div>
            </li>
        `).join('');
    },

    // 갤러리 렌더링 (메인 페이지용)
    renderGallery(items, containerId) {
        const container = document.getElementById(containerId);
        if (!container) return;

        if (!items || items.length === 0) {
            container.innerHTML = '<p style="text-align:center;padding:40px;">등록된 사진이 없습니다.</p>';
            return;
        }

        container.innerHTML = items.slice(0, 3).map(item => `
            <article class="frame-20">
                <a href="/pages/community/gallery.html?id=${item.id}" class="frame-21" style="background-image: url('${item.thumbnail_path || item.image_path}'); background-size: cover; background-position: center;">
                </a>
                <header class="frame-22">
                    <h3 class="text-wrapper-18">${this.escapeHtml(item.title)}</h3>
                </header>
                <time datetime="${item.created_at}" class="text-wrapper-19">${item.created_at_formatted}</time>
            </article>
        `).join('');
    },

    // HTML 이스케이프
    escapeHtml(text) {
        const div = document.createElement('div');
        div.textContent = text;
        return div.innerHTML;
    }
};

// 전역 노출
window.AuthAPI = AuthAPI;
window.PostsAPI = PostsAPI;
window.GalleryAPI = GalleryAPI;
window.UIHelper = UIHelper;
