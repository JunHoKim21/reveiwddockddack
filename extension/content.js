const WORKER_URL = 'https://reveiwddockddack.glaive21.workers.dev'; 

chrome.runtime.onMessage.addListener((request, sender, sendResponse) => {
  if (request.action === 'generate_review') {
    handleReviewGeneration(request.text);
  }
});

async function handleReviewGeneration(reviewText) {
  const toast = createToast('🤖 AI가 답글을 작성 중입니다...');

  try {
    const data = await new Promise((resolve) => {
      chrome.storage.local.get(['storeName', 'tone', 'licenseKey'], resolve);
    });

    const payload = {
      reviewText: reviewText,
      storeName: data.storeName || '우리 가게',
      tone: data.tone || '친절하게'
    };

    const response = await fetch(WORKER_URL, {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify(payload)
    });

    const result = await response.json();
    
    if (result.reply) {
      await navigator.clipboard.writeText(result.reply);
      updateToast(toast, '✅ 클립보드 복사 완료! (Ctrl+V)');
    } else {
      updateToast(toast, `❌ 에러: ${result.error || '서버 응답 없음'}`, true);
    }
  } catch (error) {
    updateToast(toast, '❌ 네트워크 오류가 발생했습니다.', true);
  }

  setTimeout(() => {
    if (toast.parentNode) toast.parentNode.removeChild(toast);
  }, 3000);
}

function createToast(message) {
  const toast = document.createElement('div');
  toast.innerText = message;
  toast.style.position = 'fixed';
  toast.style.bottom = '24px';
  toast.style.right = '24px';
  toast.style.backgroundColor = '#3b82f6';
  toast.style.color = '#ffffff';
  toast.style.padding = '14px 24px';
  toast.style.borderRadius = '8px';
  toast.style.boxShadow = '0 10px 15px -3px rgba(0,0,0,0.1)';
  toast.style.fontFamily = 'sans-serif';
  toast.style.fontSize = '14px';
  toast.style.fontWeight = '600';
  toast.style.zIndex = '2147483647';
  document.body.appendChild(toast);
  return toast;
}

function updateToast(toast, message, isError = false) {
  toast.innerText = message;
  toast.style.backgroundColor = isError ? '#ef4444' : '#10b981';
}

// 글로벌하게 우클릭/드래그를 강제 해제하는 로직이 다른 웹사이트(메일 등)의 체크박스나 버튼 클릭을 방해하는 문제가 있어 제거합니다.
// 대신, 사용자가 텍스트를 드래그할 수 있는 가장 안전한 수준의 CSS만 조심스럽게 적용하거나 단축키 기능을 활용하는 것이 좋습니다.
