const WORKER_URL = 'https://reveiwddockddack.glaive21.workers.dev'; 

chrome.runtime.onMessage.addListener((request, sender, sendResponse) => {
  if (request.action === 'generate_review') {
    handleReviewGeneration(request.text);
  }
});

async function handleReviewGeneration(reviewText) {
  const toast = createToast('🤖 AI가 답글을 작성 중입니다...');

  // 3,000자 초과 시 조용히 자르기 (Silent Truncation)
  let processedText = reviewText;
  if (processedText.length > 3000) {
    processedText = processedText.substring(0, 3000) + "...(중략)";
  }

  try {
    const data = await new Promise((resolve) => {
      chrome.storage.local.get(['storeName', 'tone', 'signature', 'licenseKey'], resolve);
    });

    const payload = {
      reviewText: processedText,
      storeName: data.storeName || '우리 가게',
      tone: data.tone || '친절하게',
      signature: data.signature || ''
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

// 우클릭 및 드래그 방지 해제 로직 (체크박스 클릭을 방해하는 mousedown은 제외하고 안전하게 적용)
document.addEventListener('selectstart', function(e) { e.stopPropagation(); }, true);
document.addEventListener('dragstart', function(e) { e.stopPropagation(); }, true);
document.addEventListener('contextmenu', function(e) { e.stopPropagation(); }, true);

// 네이버 등 쇼핑몰에서만 텍스트 선택이 가능하도록 CSS를 주입합니다. (메일 등 다른 사이트 보호)
const host = window.location.hostname;
if (host.includes('naver.com') || host.includes('coupang') || host.includes('baemin')) {
  const enableSelectionStyle = document.createElement('style');
  enableSelectionStyle.textContent = `
    body, div, p, span, li, td, th, a, strong, em, b, i {
      -webkit-user-select: auto !important;
      -moz-user-select: auto !important;
      -ms-user-select: auto !important;
      user-select: auto !important;
    }
  `;
  document.head.appendChild(enableSelectionStyle);
}
