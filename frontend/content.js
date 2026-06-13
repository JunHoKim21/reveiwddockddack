function createToast() {
    let toast = document.getElementById('review-fairy-toast');
    if (!toast) {
        toast = document.createElement('div');
        toast.id = 'review-fairy-toast';
        document.body.appendChild(toast);
    }
    return toast;
}

chrome.runtime.onMessage.addListener((request, sender, sendResponse) => {
    if (request.action === "showLoading") {
        const toast = createToast();
        toast.textContent = "AI가 답글을 작성 중입니다... 🧚";
        toast.className = "show loading";
    } 
    else if (request.action === "showResult") {
        // 클립보드 복사하기 로직
        navigator.clipboard.writeText(request.reply).then(() => {
            const toast = createToast();
            toast.textContent = "답글 복사 완료! (Ctrl+V) ✨";
            toast.className = "show success";
            
            setTimeout(() => {
                toast.className = toast.className.replace("show", "");
            }, 3000);
        }).catch(err => {
            const toast = createToast();
            toast.textContent = "클립보드 복사 실패! 알림창에서 수동 복사해주세요.";
            toast.className = "show error";
            console.error('Clipboard error:', err);
            
            // fallback (prompt)
            prompt("생성된 답글입니다 (Ctrl+C를 눌러 복사하세요):", request.reply);
            setTimeout(() => {
                toast.className = toast.className.replace("show", "");
            }, 3000);
        });
    }
    else if (request.action === "showError") {
        const toast = createToast();
        toast.textContent = request.errorMsg;
        toast.className = "show error";
        
        setTimeout(() => {
            toast.className = toast.className.replace("show", "");
        }, 4000);
    }
});
