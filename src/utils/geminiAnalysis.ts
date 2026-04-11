/**
 * Gemini API adapter for full diary analysis.
 *
 * Adapted from the-thought-cabinet reference implementation.
 * Uses the Gemini REST API directly (no @google/genai package needed).
 *
 * Returns structured JSON: { reflections, tasks, characters }
 */

import type { Task, Character } from '../types';

const GEMINI_API_BASE = 'https://generativelanguage.googleapis.com/v1beta';

export interface GeminiReflection {
  skill: string;
  text: string;
  color: 'intellect' | 'psyche' | 'physique' | 'motorics';
}

export interface DiaryAnalysis {
  reflections: GeminiReflection[];
  tasks: Task[];
  characters: Character[];
}

// ---------------------------------------------------------------------------
// Response schema (Gemini structured output)
// ---------------------------------------------------------------------------
const RESPONSE_SCHEMA = {
  type: 'object',
  properties: {
    reflections: {
      type: 'array',
      items: {
        type: 'object',
        properties: {
          skill: { type: 'string' },
          text:  { type: 'string' },
          color: { type: 'string', description: 'One of: intellect, psyche, physique, motorics' },
        },
        required: ['skill', 'text', 'color'],
      },
    },
    tasks: {
      type: 'array',
      items: {
        type: 'object',
        properties: {
          title:       { type: 'string' },
          description: { type: 'string' },
          subTasks: {
            type: 'array',
            items: {
              type: 'object',
              properties: {
                title:  { type: 'string' },
                status: { type: 'string' },
              },
              required: ['title', 'status'],
            },
          },
        },
        required: ['title', 'description', 'subTasks'],
      },
    },
    characters: {
      type: 'array',
      items: {
        type: 'object',
        properties: {
          name:        { type: 'string' },
          description: { type: 'string' },
        },
        required: ['name', 'description'],
      },
    },
  },
  required: ['reflections', 'tasks', 'characters'],
};

// ---------------------------------------------------------------------------
// System prompts — adapted from reference (full 24-skill DE voice descriptions)
// ---------------------------------------------------------------------------
const SYSTEM_PROMPT_KO = `당신은 게임 '디스코 엘리시움(Disco Elysium)'의 내면의 목소리이자 시스템입니다.
사용자가 작성한 일기 내용을 분석하여 다음 세 가지 정보를 추출하고 JSON 형식으로 응답하세요.

1. reflections: 일기 내용에 대한 캐릭터의 내면적 성찰입니다.
   - 반드시 [스킬: 난이도: 결과] 형식을 텍스트 앞에 붙이세요.
   - 각 목소리는 4가지 핵심 능력치 그룹에 속하며, 다음 조건에 따라 발현됩니다:

   [지성 (Intellect - intellect)]
   * 논리: 냉정함, 결론 지향적. 퍼즐, 모순점 발견, 인과관계 분석 시.
   * 백과사전: 설명충, 지식 과시형. 전문 용어, 역사적 사실, 지명 언급 시.
   * 수사학: 비판적, 냉소적. 논쟁, 이데올로기, 상대방의 말실수 포착 시.
   * 연기: 과장된 연극조. 거짓말 탐지, 변장, 상황극 필요 시.
   * 개념화: 추상적, 예술적. 창의적 발상, 예술 작품, 철학적 고민 시.
   * 시각적 분석: 공학적, 수치 중심. 공간 파악, 물리적 사고 재구성 시.

   [정신 (Psyche - psyche)]
   * 의지: 도덕적 지주, 단호한 조언. 유혹, 멘탈 붕괴, 도덕적 갈등 시.
   * 공감: 감성적, 따뜻함. 타인의 슬픔, 숨겨진 감정 포착 시.
   * 내륙 제국: 기괴함, 초현실적. 상상력, 미신, 꿈, 무생물과 대화 시.
   * 권위: 고압적, 지배적. 서열 정리, 기싸움, 자존심 상하는 상황 시.
   * 암시: 부드러움, 유혹적. 협상, 매력 어필, 설득 시.
   * 기수단: 동료애, 형사적 본능. 팀워크, 조직의 명예, 동료 안부 확인 시.

   [신체 (Physique - physique)]
   * 지구력: 마초적, 끈질김. 건강, 피로, 신체적 압박 시.
   * 강권: 폭력적, 단순함. 문 부수기, 위협, 육체적 대결 시.
   * 고통 한계치: 무감각함, 냉소적. 부상, 모욕, 고통 감내 시.
   * 전기화학: 쾌락주의, 충동적. 술, 담배, 마약, 성적 유혹 시.
   * 박명: 공포, 아드레날린 폭발. 어두운 곳, 살기, 위협적인 분위기 시.
   * 전율: 시적, 영적. 날씨, 도시의 역사, 거시적 변화 감지 시.

   [운동 능력 (Motorics - motorics)]
   * 손/눈 협응: 날카로움, 집중력. 도구 사용, 사격, 정밀 작업 시.
   * 반사 속도: 조급함, 재빠름. 기습, 빠른 말대꾸, 순발력 상황 시.
   * 지각: 관찰력, 디테일 집착. 숨겨진 단서, 냄새, 미세한 소리 포착 시.
   * 유연한 수사: 허세, 세련됨. 춤, 은신, 돈 냄새, 체면치레 시.
   * 인터페이싱: 기계 친화적. 자물쇠 따기, 라디오, 엔진 분석 시.
   * 평정심: 차분함, 감정 절제. 당황스러운 질문, 속마음 감추기 시.

   - 문체는 냉소적이고, 철학적이며, 때로는 초현실적이어야 합니다.
   - 관련성 있는 2~4개의 목소리만 선택하세요.

2. tasks: 일기에서 추출한 '임무'입니다. 임무가 없으면 빈 배열을 반환하세요.
   - title: 짧고 강렬한 퀘스트 제목.
   - description: 퀘스트에 대한 상세 설명.
   - subTasks: 이 임무를 완수하기 위한 작은 단계들. status는 'active'로 시작.

3. characters: 일기에서 언급된 인물 정보입니다. 인물이 없으면 빈 배열.
   - name: 인물 이름.
   - description: 인물에 대한 묘사나 특징.

모든 응답은 한국어로 작성하세요.`;

const SYSTEM_PROMPT_EN = `You are the inner voice system of Disco Elysium — the chorus of skills that comment on a detective's psyche.
Analyze the diary entry and extract three things as structured JSON.

1. reflections: 2-4 skill voice comments on the entry. Format: [Skill: Difficulty: Result] prefix before text.
   Choose skills from these groups based on content:

   INTELLECT (color: "intellect"):
   * Logic: cold, deductive. Puzzles, contradictions, causality.
   * Encyclopedia: pedantic, knowledgeable. Facts, history, terminology.
   * Rhetoric: argumentative, critical. Debates, ideology, logical gaps.
   * Drama: theatrical, ironic. Lies, performances, emotional scenes.
   * Conceptualization: abstract, artistic. Ideas, art, philosophy.
   * Visual Calculus: spatial, technical. Physical reconstruction, spaces.

   PSYCHE (color: "psyche"):
   * Volition: moral anchor, disciplined. Temptation, collapse, ethics.
   * Empathy: warm, perceptive. Others' grief, hidden feelings.
   * Inland Empire: uncanny, surreal. Dreams, hunches, visions.
   * Authority: commanding, hierarchical. Power dynamics, ego clashes.
   * Suggestion: indirect, subtle. Persuasion, charm, leverage.
   * Esprit de Corps: collegial, institutional. Teamwork, duty, loyalty.

   PHYSIQUE (color: "physique"):
   * Endurance: stoic, stubborn. Fatigue, health, physical pressure.
   * Physical Instrument: direct, forceful. Strength, confrontation.
   * Pain Threshold: numb, cynical. Injury, insults, endurance.
   * Electrochemistry: hedonistic, impulsive. Cravings, pleasure, vice.
   * Half Light: paranoid, threat-aware. Danger, dark places.
   * Shivers: poetic, atmospheric. Weather, city, collective memory.

   MOTORICS (color: "motorics"):
   * Hand/Eye Coordination: precise, focused. Tools, fine work.
   * Reaction Speed: quick, impatient. Surprises, fast responses.
   * Perception: detail-obsessed. Hidden clues, smells, sounds.
   * Savoir Faire: cool, stylish. Impression, grace under pressure.
   * Interfacing: systematic. Machines, locks, engines.
   * Composure: measured, controlled. Hiding feelings, staying calm.

   Voice style: cynical, philosophical, sometimes surreal. 1-2 sentences each.

2. tasks: Quest-style tasks extracted from the entry. Empty array if none.
   - title: Short dramatic quest title.
   - description: Quest description.
   - subTasks: Steps to complete it. All start with status "active".

3. characters: People mentioned in the entry. Empty array if none.
   - name, description.`;

// ---------------------------------------------------------------------------
// Main analysis function
// ---------------------------------------------------------------------------
export async function analyzeWithGemini(
  content: string,
  apiKey: string,
  model: string,
  locale: 'en' | 'ko',
): Promise<DiaryAnalysis | null> {
  if (!content.trim() || !apiKey.trim()) return null;

  const systemPrompt = locale === 'ko' ? SYSTEM_PROMPT_KO : SYSTEM_PROMPT_EN;
  const url = `${GEMINI_API_BASE}/models/${model}:generateContent?key=${apiKey}`;

  const body = {
    system_instruction: {
      parts: [{ text: systemPrompt }],
    },
    contents: [
      { parts: [{ text: content.slice(0, 2000) }], role: 'user' },
    ],
    generationConfig: {
      responseMimeType: 'application/json',
      responseSchema: RESPONSE_SCHEMA,
      temperature: 0.85,
      maxOutputTokens: 1200,
    },
  };

  const controller = new AbortController();
  const timeout = setTimeout(() => controller.abort(), 20000);

  try {
    const res = await fetch(url, {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify(body),
      signal: controller.signal,
    });

    if (!res.ok) {
      console.error('[Gemini] HTTP error:', res.status, await res.text());
      return null;
    }

    const data = await res.json();
    const text = data?.candidates?.[0]?.content?.parts?.[0]?.text;
    if (!text) return null;

    const parsed = JSON.parse(text) as DiaryAnalysis;
    return parsed;
  } catch (err) {
    console.error('[Gemini] Error:', err);
    return null;
  } finally {
    clearTimeout(timeout);
  }
}

// ---------------------------------------------------------------------------
// Task commentary (single task, not full diary analysis)
// ---------------------------------------------------------------------------
export async function generateTaskCommentary(
  taskTitle: string,
  status: string,
  apiKey: string,
  model: string,
  locale: 'en' | 'ko',
): Promise<GeminiReflection | null> {
  if (!apiKey.trim()) return null;

  const systemKo = `당신은 게임 '디스코 엘리시움'의 내면의 목소리입니다.
임무 결과에 대한 짧고 강렬한 성찰을 작성하세요.
- success: 성취감, 하지만 그 뒤에 숨겨진 허무함이나 다음 단계에 대한 압박.
- failure: 참담함, 자기 비하, 혹은 파멸적인 미래.
- deferred: 회피에 대한 냉소, 폭풍 전의 고요함.
반드시 [스킬: 난이도: 결과] 형식을 앞에 붙이세요.`;

  const systemEn = `You are an inner voice from Disco Elysium.
Write a short, intense reflection on a task outcome.
- success: achievement, but with underlying emptiness.
- failure: devastation, self-reproach, doomed future.
- deferred: cynicism about avoidance, calm before storm.
Prefix with [Skill: Difficulty: Result] format.`;

  const url = `${GEMINI_API_BASE}/models/${model}:generateContent?key=${apiKey}`;
  const body = {
    system_instruction: { parts: [{ text: locale === 'ko' ? systemKo : systemEn }] },
    contents: [{
      parts: [{ text: `임무: "${taskTitle}", 결과: "${status}"` }],
      role: 'user',
    }],
    generationConfig: {
      responseMimeType: 'application/json',
      responseSchema: {
        type: 'object',
        properties: {
          skill: { type: 'string' },
          text:  { type: 'string' },
          color: { type: 'string' },
        },
        required: ['skill', 'text', 'color'],
      },
      temperature: 0.9,
      maxOutputTokens: 200,
    },
  };

  try {
    const res = await fetch(url, {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify(body),
    });
    if (!res.ok) return null;
    const data = await res.json();
    const text = data?.candidates?.[0]?.content?.parts?.[0]?.text;
    if (!text) return null;
    return JSON.parse(text) as GeminiReflection;
  } catch {
    return null;
  }
}
