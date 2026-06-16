[Pipeline 2 Trigger]
이전 파이프라인에서 확정된 UI 명세서와 기획안을 바탕으로 실전 코딩과 검수를 진행한다.

Step 1: @3_frontend_rule.md 가 Next.js와 TailwindCSS, html2canvas를 활용하여 프론트엔드 UI 및 이미지 다운로드 로직 컴포넌트를 작성한다.
Step 2: 동시에 @4_backend_rule.md 는 Java, Spring Boot, MariaDB 스택을 활용하여 사용자 인증 및 크레딧 차감(월 5회 무료 카운팅) API의 Entity와 DTO, Controller 보일러플레이트를 생성한다. 비즈니스 로직의 트랜잭션 처리는 엄밀하게 작성한다.
Step 3: 두 에이전트의 코드가 1차 생성되면, @6_qa_rule.md 가 개입하여 API 타임아웃, 이미지 렌더링 실패 등 예외 상황(Edge Case)에 대한 방어 로직과 테스트 코드를 추가로 작성한다.
이 과정을 순차적으로 실행하고 완성된 코드 블록들을 제시해 줘.