chrome.runtime.onInstalled.addListener(() => {
    chrome.contextMenus.create({
        id: "generate-review-reply",
        title: "[리뷰뚝딱] AI 답글 생성",
        contexts: ["selection"]
    });
});

chrome.contextMenus.onClicked.addListener((info, tab) => {
    if (info.menuItemId === "generate-review-reply" && info.selectionText) {
        // Content script에 알림을 띄우라고 메시지 전송
        chrome.tabs.sendMessage(tab.id, { action: "showLoading" });

        // Storage에서 설정값 가져오기
        chrome.storage.sync.get(['storeName', 'tone'], async (items) => {
            const storeName = items.storeName || "우리 가게";
            const tone = items.tone || "친절하게";

            try {
                // Vercel API 호출
                const apiUrl = 'https://reveiwddockddack.vercel.app/api/generate'; 

                const response = await fetch(apiUrl, {
                    method: 'POST',
                    headers: {
                        'Content-Type': 'application/json'
                    },
                    body: JSON.stringify({
                        reviewText: info.selectionText,
                        storeName: storeName,
                        tone: tone
                    })
                });

                if (!response.ok) {
                    throw new Error(`API error: ${response.status}`);
                }

                const data = await response.json();
                
                if (data.reply) {
                    // 성공 시 결과를 클립보드 복사 및 완료 알림
                    chrome.tabs.sendMessage(tab.id, { 
                        action: "showResult", 
                        reply: data.reply 
                    });
                } else {
                    throw new Error('No reply in response');
                }

            } catch (error) {
                console.error("Error generating reply:", error);
                chrome.tabs.sendMessage(tab.id, { 
                    action: "showError", 
                    errorMsg: "답글 생성에 실패했습니다. API 연결을 확인해주세요." 
                });
            }
        });
    }
});
