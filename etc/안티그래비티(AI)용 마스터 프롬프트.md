너는 지금부터 10년 차 수석 프론트엔드 개발자이자 크롬 확장 프로그램(Manifest V3) 및 Cloudflare Workers 전문가야. 
내가 제시하는 기획을 바탕으로, "리뷰뚝딱"이라는 크롬 확장 프로그램의 전체 코드를 작성해 줘.

[개발 원칙 - 반드시 지킬 것]
1. 프레임워크(React, Vue 등)를 절대 사용하지 말고, 순수 Vanilla JS, HTML, CSS만 사용해.
2. Manifest V3 표준을 엄격하게 지켜.
3. 코드는 복사해서 바로 실행할 수 있도록 완벽해야 하며, 파일별로 나누어서 출력해 줘.
4. CSS는 깔끔하고 모던한 UI(테일윈드 느낌)로 작성해 줘.

[생성해야 할 파일 목록과 요구사항]

1. manifest.json
- Manifest V3 적용.
- 권한(permissions): "contextMenus", "storage", "clipboardWrite", "activeTab", "scripting".
- background, action(popup), content_scripts 설정 포함.

2. popup.html & popup.css
- 확장 프로그램 아이콘 클릭 시 뜨는 설정창.
- 입력 폼: 가게 이름(input), 톤앤매너(select: 친절하게, 공감형, 유머러스하게), 라이선스 키(input).
- 저장 버튼과 상태 메시지 표시 영역 포함.

3. popup.js
- DOM 로드 시 chrome.storage.local에서 기존 저장된 설정값을 불러와 폼에 채움.
- 저장 버튼 클릭 시 값을 chrome.storage.local에 저장.

4. background.js
- 확장 프로그램 설치 시(chrome.runtime.onInstalled) 우클릭 메뉴("리뷰요정 - AI 답글 생성") 생성.
- 우클릭 메뉴 클릭 시(chrome.contextMenus.onClicked), 선택된 텍스트(info.selectionText)를 가져옴.
- chrome.tabs.sendMessage를 사용해 현재 활성화된 탭의 content.js로 데이터 전달.

5. content.js
- 화면 우측 하단에 상태를 알려주는 Toast 알림창 UI를 동적으로 생성하는 함수 포함 (CSS는 JS 내부에 삽입하여 페이지 스타일과 충돌 방지).
- background.js에서 메시지를 받으면 다음 동작 수행:
  a. "🤖 AI가 답글을 작성 중입니다..." Toast 띄우기.
  b. chrome.storage.local에서 '가게 이름', '톤앤매너' 가져오기.
  c. Cloudflare Worker 주소(예: "https://your-worker-url.workers.dev")로 fetch POST 요청 전송 (body: {reviewText, storeName, tone}).
  d. 응답을 받으면 navigator.clipboard.writeText()를 사용해 클립보드에 복사.
  e. Toast 창을 "✅ 클립보드 복사 완료! (Ctrl+V)"로 변경하고 3초 뒤 제거.

6. worker.js (Cloudflare Workers용 코드)
- CORS 에러가 나지 않도록 OPTIONS Preflight 요청 처리 및 응답 헤더(Access-Control-Allow-Origin: *) 세팅.
- POST 요청을 받으면 OpenAI API (gpt-4o-mini 모델)를 호출.
- 프롬프트 로직: 
  "너는 가게 사장님이야. 가게 이름은 [{가게이름}]이야. 다음 고객의 리뷰를 읽고 [{톤앤매너}] 톤으로 감사 답글을 작성해줘. 인사말, 리뷰 내용에 대한 공감, 재방문 유도 멘트를 포함해. 리뷰 텍스트: {리뷰텍스트}"
- OpenAI의 응답에서 텍스트만 추출하여 JSON 형태로 클라이언트에 반환.
- (참고: OpenAI API Key는 환경변수 ENV.OPENAI_API_KEY 로 받아온다고 가정하고 코드를 작성할 것).

위 요구사항을 바탕으로 각 파일의 전체 코드를 작성해 줘. 설명은 최소화하고 코드 위주로 출력해 줘.