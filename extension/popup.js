document.addEventListener('DOMContentLoaded', () => {
  const storeNameInput = document.getElementById('storeName');
  const toneSelect = document.getElementById('tone');
  const signatureInput = document.getElementById('signature');
  const licenseKeyInput = document.getElementById('licenseKey');
  const saveBtn = document.getElementById('saveBtn');
  const statusMessage = document.getElementById('statusMessage');

  chrome.storage.local.get(['storeName', 'tone', 'signature', 'licenseKey'], (result) => {
    if (result.storeName) storeNameInput.value = result.storeName;
    if (result.tone) toneSelect.value = result.tone;
    if (result.signature) signatureInput.value = result.signature;
    if (result.licenseKey) licenseKeyInput.value = result.licenseKey;
  });

  saveBtn.addEventListener('click', () => {
    const settings = {
      storeName: storeNameInput.value,
      tone: toneSelect.value,
      signature: signatureInput.value,
      licenseKey: licenseKeyInput.value
    };

    chrome.storage.local.set(settings, () => {
      statusMessage.textContent = '✅ 설정이 성공적으로 저장되었습니다.';
      setTimeout(() => { statusMessage.textContent = ''; }, 2000);
    });
  });
});
