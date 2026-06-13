document.addEventListener('DOMContentLoaded', () => {
    // 로드 시 기존 값 불러오기
    chrome.storage.sync.get(['storeName', 'tone'], (items) => {
        if (items.storeName) document.getElementById('storeName').value = items.storeName;
        if (items.tone) document.getElementById('tone').value = items.tone;
    });

    // 저장 버튼 클릭 시
    document.getElementById('saveBtn').addEventListener('click', () => {
        const storeName = document.getElementById('storeName').value;
        const tone = document.getElementById('tone').value;

        chrome.storage.sync.set({ storeName, tone }, () => {
            const status = document.getElementById('status');
            status.textContent = '저장되었습니다!';
            setTimeout(() => {
                status.textContent = '';
            }, 2000);
        });
    });
});
