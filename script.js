// 모바일 내비게이션 토글, 스무스 스크롤, 폼 검증을 담당하는 스크립트

// 돔 로드 후 실행
document.addEventListener('DOMContentLoaded', () => {
  // 요소 캐시: 성능을 위해 자주 쓰는 DOM 노드를 변수에 저장합니다.
  const navToggleButton = document.querySelector('.nav-toggle');
  const navList = document.getElementById('primary-menu');
  const yearEl = document.getElementById('year');
  const toTop = document.querySelector('.to-top');
  const contactForm = document.querySelector('.contact-form');

  // 풋터 년도 자동 갱신
  if (yearEl) {
    yearEl.textContent = String(new Date().getFullYear());
  }

  // 모바일 내비 토글 핸들러
  if (navToggleButton && navList) {
    navToggleButton.addEventListener('click', () => {
      const expanded = navToggleButton.getAttribute('aria-expanded') === 'true';
      navToggleButton.setAttribute('aria-expanded', String(!expanded));
      navList.classList.toggle('show');
    });

    // 메뉴 아이템 클릭 시 닫기 (모바일 UX)
    navList.querySelectorAll('a').forEach((link) => {
      link.addEventListener('click', () => {
        navToggleButton.setAttribute('aria-expanded', 'false');
        navList.classList.remove('show');
      });
    });
  }

  // 스무스 스크롤: 동일 페이지 내 앵커에 대해 부드럽게 스크롤합니다.
  document.querySelectorAll('a[href^="#"]').forEach((anchor) => {
    anchor.addEventListener('click', (e) => {
      const targetId = anchor.getAttribute('href');
      if (!targetId || targetId === '#' || targetId.length < 2) return;
      const targetEl = document.querySelector(targetId);
      if (!targetEl) return;
      e.preventDefault();
      targetEl.scrollIntoView({ behavior: 'smooth', block: 'start' });
    });
  });

  // 폼 검증 유틸리티
  const showError = (inputEl, message) => {
    const container = inputEl.closest('.form-row');
    if (!container) return;
    const errorEl = container.querySelector('.error');
    if (errorEl) errorEl.textContent = message;
    inputEl.setAttribute('aria-invalid', 'true');
  };

  const clearError = (inputEl) => {
    const container = inputEl.closest('.form-row');
    if (!container) return;
    const errorEl = container.querySelector('.error');
    if (errorEl) errorEl.textContent = '';
    inputEl.removeAttribute('aria-invalid');
  };

  const isEmail = (value) => /\S+@\S+\.\S+/.test(value);

  // 폼 실시간 검증: 입력 변화 시 에러 메시지를 지웁니다.
  if (contactForm) {
    const nameInput = contactForm.querySelector('#name');
    const emailInput = contactForm.querySelector('#email');
    const messageInput = contactForm.querySelector('#message');

    [nameInput, emailInput, messageInput].forEach((el) => {
      if (!el) return;
      el.addEventListener('input', () => clearError(el));
      el.addEventListener('blur', () => {
        // 간단한 블러 시점의 즉시 검증
        if (el === nameInput && !el.value.trim()) showError(el, '이름을 입력해주세요.');
        if (el === emailInput && !isEmail(el.value)) showError(el, '유효한 이메일을 입력해주세요.');
        if (el === messageInput && el.value.trim().length < 5) showError(el, '메시지를 조금 더 자세히 작성해주세요.');
      });
    });

    // 제출 시 최종 검증 및 가짜 전송 처리
    contactForm.addEventListener('submit', async (e) => {
      e.preventDefault();

      const values = {
        name: nameInput?.value.trim() || '',
        email: emailInput?.value.trim() || '',
        message: messageInput?.value.trim() || '',
      };

      let valid = true;
      if (!values.name) { showError(nameInput, '이름을 입력해주세요.'); valid = false; }
      if (!isEmail(values.email)) { showError(emailInput, '유효한 이메일을 입력해주세요.'); valid = false; }
      if (values.message.length < 5) { showError(messageInput, '메시지를 조금 더 자세히 작성해주세요.'); valid = false; }

      if (!valid) return;

      // 실제 백엔드 대신 데모용 대기 시뮬레이션
      const submitButton = contactForm.querySelector('button[type="submit"]');
      const originalText = submitButton?.textContent;
      if (submitButton) submitButton.textContent = '전송 중...';

      try {
        // 네트워크 요청이 있다고 가정하고 잠깐 대기
        await new Promise((res) => setTimeout(res, 800));
        alert('메시지가 전송되었습니다. 빠르게 회신드릴게요!');
        contactForm.reset();
      } catch (err) {
        alert('전송 중 문제가 발생했습니다. 잠시 후 다시 시도해주세요.');
      } finally {
        if (submitButton) submitButton.textContent = originalText || '보내기';
      }
    });
  }

  // 스크롤 상단으로 이동 버튼 접근성 향상: 키보드 엔터 지원 (링크라 기본 지원되지만 예시)
  if (toTop) {
    toTop.addEventListener('keydown', (e) => {
      if (e.key === 'Enter' || e.key === ' ') {
        e.preventDefault();
        document.getElementById('top')?.scrollIntoView({ behavior: 'smooth' });
      }
    });
  }
});


