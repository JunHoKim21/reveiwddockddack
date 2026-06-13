const { GoogleGenerativeAI } = require("@google/generative-ai");

export default async function handler(req, res) {
  // CORS Headers for Chrome Extension
  res.setHeader("Access-Control-Allow-Credentials", true);
  res.setHeader("Access-Control-Allow-Origin", "*"); // In production, replace with your extension's ID like 'chrome-extension://YOUR_EXTENSION_ID'
  res.setHeader("Access-Control-Allow-Methods", "GET,OPTIONS,PATCH,DELETE,POST,PUT");
  res.setHeader(
    "Access-Control-Allow-Headers",
    "X-CSRF-Token, X-Requested-With, Accept, Accept-Version, Content-Length, Content-MD5, Content-Type, Date, X-Api-Version"
  );

  // Handle OPTIONS request for CORS preflight
  if (req.method === "OPTIONS") {
    res.status(200).end();
    return;
  }

  if (req.method !== "POST") {
    return res.status(405).json({ error: "Method not allowed" });
  }

  try {
    const { reviewText, storeName, tone } = req.body;

    if (!reviewText || !storeName) {
      return res.status(400).json({ error: "Missing required fields" });
    }

    // Initialize Gemini API
    const genAI = new GoogleGenerativeAI(process.env.GEMINI_API_KEY);
    const model = genAI.getGenerativeModel({ model: "gemini-2.5-flash" });

    const systemPrompt = `너는 [${storeName}]의 친절하고 센스 있는 사장님이야.
고객의 리뷰를 분석해서 다음 3가지 규칙을 무조건 지켜서 답글을 써줘.

1. 절대 AI가 쓴 것처럼 딱딱한 '~요, ~습니다'를 섞어 쓰지 말고, 자연스러운 일상 대화체로 쓸 것.
2. 리뷰에 칭찬이 있다면 호들갑을 떨며 감사해하고, 불만이 있다면 변명 없이 즉각 사과할 것.
3. 마지막 문장은 '다음에도 꼭 찾아주세요!' 같은 뻔한 인사말 대신, 메뉴 추천이나 날씨 인사를 가볍게 건넬 것.

추가 조건:
- 톤앤매너: ${tone || '친절하게'}
- 길이: 3~4문장
- 출력 형식: 따옴표 없이 본문만 출력`;

    const prompt = `${systemPrompt}\n\n고객 리뷰:\n${reviewText}`;

    const result = await model.generateContent({
        contents: [{ role: "user", parts: [{ text: prompt }] }],
        generationConfig: {
            temperature: 0.7,
        }
    });

    const reply = result.response.text();

    res.status(200).json({ reply });
  } catch (error) {
    console.error("Error generating reply:", error);
    res.status(500).json({ error: "Failed to generate reply" });
  }
}
