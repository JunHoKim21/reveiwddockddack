📄 [Part 1] 서비스 기획서 (MVP 아키텍처)
1. 서비스 개요
서비스명: 리뷰뚝딱 (Review Ttuk-ttak)

플랫폼: 크롬 확장 프로그램 (Chrome Extension - Manifest V3)

목적: 자영업자가 드래그 & 우클릭만으로 리뷰 답글을 AI로 자동 생성하여 클립보드에 복사.

2. 기술 스택 (무자본, 무서버 아키텍처)
프론트엔드 (크롬 익스텐션): Vanilla JavaScript, HTML, CSS (React/Vue 등 무거운 프레임워크 절대 금지)

백엔드 (API 프록시): Cloudflare Workers (서버 구축 없이 1개의 스크립트 파일로 OpenAI API 호출 및 키 은닉)

데이터베이스: chrome.storage.local (브라우저 로컬 저장소 활용, 별도 외부 DB 없음)

AI 모델: OpenAI gpt-4o-mini (속도가 빠르고 비용이 극도로 저렴함)

3. 핵심 기능 명세 및 동작 로직
Popup UI (설정 화면):

항목: 가게 이름, 답글 톤앤매너(드롭다운: 친절하게, 유머러스하게, 전문적으로), 라이선스 키

저장: '저장' 버튼 클릭 시 chrome.storage.local에 저장.

Background Script (우클릭 메뉴):

확장 프로그램 설치 시 컨텍스트 메뉴(우클릭 메뉴)에 "리뷰요정 - AI 답글 생성" 항목 추가.

사용자가 텍스트를 드래그(선택)하고 해당 메뉴를 클릭하면, 선택된 텍스트를 Content Script로 전달.

Content Script (화면 동작 및 API 호출):

우클릭 메뉴가 실행되면 화면 우측 하단에 "🤖 AI가 답글을 작성 중입니다..."라는 작은 알림창(Toast) 렌더링.

Cloudflare Worker(프록시 서버)로 선택한 텍스트, 가게 이름, 톤앤매너, 라이선스 키를 Fetch API로 전송.

응답이 오면 클립보드에 텍스트 자동 복사 후, 알림창을 "✅ 클립보드에 복사되었습니다! (Ctrl+V)"로 변경하고 3초 뒤 사라짐.

Cloudflare Worker (프록시 & 검증):

CORS(교차 출처 리소스 공유) 헤더를 설정하여 크롬 익스텐션의 요청을 허용.

요청받은 데이터로 OpenAI API 프롬프트 조합 후 호출.

(MVP 단계의 라이선스 처리): 라이선스 키가 특정 문자열(예: PRO_USER_2024)이 아니면 익스텐션 단에서 남은 무료 횟수를 차감하도록 유도 (복잡한 DB 검증은 MVP에서 생략).