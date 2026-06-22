export default {
  async fetch(request, env, ctx) {
    // CORS 헤더 설정
    const corsHeaders = {
      "Access-Control-Allow-Origin": "*", 
      "Access-Control-Allow-Methods": "GET,HEAD,POST,OPTIONS",
      "Access-Control-Max-Age": "86400",
      "Access-Control-Allow-Headers": "Content-Type",
    };

    // Preflight 요청 (OPTIONS) 처리
    if (request.method === "OPTIONS") {
      return new Response(null, { headers: corsHeaders });
    }

    if (request.method !== "POST") {
      return new Response(JSON.stringify({ error: "Method not allowed" }), { 
        status: 405, 
        headers: corsHeaders 
      });
    }

    try {
      const { reviewText, storeName, tone } = await request.json();

      const prompt = `너는 가게 사장님이야. 가게 이름은 [${storeName}]이야. 다음 고객의 리뷰를 읽고 [${tone}] 톤으로 감사 답글을 작성해줘. 인사말, 리뷰 내용에 대한 공감, 재방문 유도 멘트를 포함해. 리뷰 텍스트: ${reviewText}`;

      if (!env.GEMINI_API_KEY) {
        throw new Error("Cloudflare 환경변수가 비어있습니다! 대시보드 [Settings] -> [Variables and Secrets] 에 GEMINI_API_KEY 가 정확히 등록되었는지 확인 후 '저장 및 배포'를 눌러주세요.");
      }

      // 1.5 버전이 아닌 사장님 키에 맞는 최신 2.5 버전 사용!
      const url = `https://generativelanguage.googleapis.com/v1beta/models/gemini-2.5-flash:generateContent?key=${env.GEMINI_API_KEY}`;

      const geminiResponse = await fetch(url, {
        method: "POST",
        headers: {
          "Content-Type": "application/json"
        },
        body: JSON.stringify({
          contents: [{
            parts: [{ text: prompt }]
          }],
          generationConfig: {
            temperature: 0.7
          }
        })
      });

      const data = await geminiResponse.json();

      if (!geminiResponse.ok) {
        throw new Error(data.error?.message || "Gemini API 호출에 실패했습니다.");
      }

      const reply = data.candidates[0].content.parts[0].text;

      return new Response(JSON.stringify({ reply }), {
        headers: { ...corsHeaders, "Content-Type": "application/json" }
      });
    } catch (error) {
      return new Response(JSON.stringify({ error: error.message }), { 
        status: 500, 
        headers: corsHeaders 
      });
    }
  }
};
