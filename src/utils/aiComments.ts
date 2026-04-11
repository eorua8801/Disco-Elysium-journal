import type { SkillComment, DiceCheck } from '../types';
import { SKILLS_BY_ID } from '../data/skills';
import { generateTemplateComments } from './skillMatcher';
import { useSettingsStore } from '../store/settingsStore';
import { getT } from '../i18n';

// ---------------------------------------------------------------------------
// Skill voice style descriptions (used in both EN and KO prompts)
// ---------------------------------------------------------------------------
const STYLE_EN: Record<string, string> = {
  'logic':               'coldly analytical, uses numbered observations and deductive language',
  'encyclopedia':        'pedantic but fascinating, drops historical trivia',
  'rhetoric':            'argumentative, spots logical gaps, frames things as debate',
  'drama':               'theatrical, notices emotional performance, loves irony',
  'conceptualization':   'poetic, abstract, speaks in images and metaphors',
  'visual-calculus':     'spatial, reconstructive, notices physical details',
  'volition':            'stern but caring, voice of discipline and self-preservation',
  'inland-empire':       'uncanny, dreamlike, speaks of memories and resonances',
  'empathy':             'warm but perceptive, notices emotional undercurrents',
  'authority':           'commanding, thinks in hierarchies and power dynamics',
  'esprit-de-corps':     'institutional, thinks about group dynamics and precedent',
  'suggestion':          'indirect, speaks of angles and hidden leverage',
  'endurance':           'stoic, about limits and surviving',
  'pain-threshold':      'blunt, about what hurts and what does not',
  'physical-instrument': 'direct, physical, about action and force',
  'electrochemistry':    'enthusiastic, about desire and chemical reality',
  'shivers':             'atmospheric, about the city and collective mood',
  'half-light':          'paranoid, threat-aware, about danger and reflexes',
  'hand-eye-coordination': 'precise and technical',
  'perception':          'detail-obsessed, notices what others miss',
  'reaction-speed':      'rapid-fire, about first instincts',
  'savoir-faire':        'cool, stylish, about impression and presentation',
  'interfacing':         'systematic, about patterns and processes',
  'composure':           'measured, about maintaining the exterior',
};

const STYLE_KO: Record<string, string> = {
  'logic':               '냉철하고 분석적, 연역적 언어와 번호 매긴 관찰 사용',
  'encyclopedia':        '꼼꼼하고 박학다식, 역사적 사실과 잡학 즐겨 인용',
  'rhetoric':            '논쟁적, 논리적 허점을 찾아냄, 모든 것을 토론으로 봄',
  'drama':               '연극적, 감정적 연기에 주목, 아이러니를 즐김',
  'conceptualization':   '시적이고 추상적, 이미지와 은유로 말함',
  'visual-calculus':     '공간적, 재구성적, 물리적 세부사항에 주목',
  'volition':            '엄하지만 배려심 있음, 규율과 자기 보존의 목소리',
  'inland-empire':       '기이하고 몽환적, 기억과 울림에 대해 말함',
  'empathy':             '따뜻하지만 예리함, 감정의 흐름을 감지',
  'authority':           '권위적, 위계와 권력 역학으로 생각',
  'esprit-de-corps':     '제도적, 집단 역학과 선례를 중시',
  'suggestion':          '간접적, 각도와 숨겨진 지렛대에 대해 말함',
  'endurance':           '금욕적, 한계와 생존에 관함',
  'pain-threshold':      '직설적, 무엇이 아프고 아프지 않은지',
  'physical-instrument': '직접적, 행동과 힘에 관함',
  'electrochemistry':    '열정적, 욕망과 화학적 현실에 관함',
  'shivers':             '분위기적, 도시와 집단적 기분에 관함',
  'half-light':          '편집증적, 위협 감지, 위험과 반사에 관함',
  'hand-eye-coordination': '정밀하고 기술적',
  'perception':          '세부사항 집착, 다른 사람이 놓치는 것을 포착',
  'reaction-speed':      '빠른 반응, 첫 번째 본능에 관함',
  'savoir-faire':        '쿨하고 세련됨, 인상과 표현에 관함',
  'interfacing':         '체계적, 패턴과 과정에 관함',
  'composure':           '침착함, 외면 유지에 관함',
};

// ---------------------------------------------------------------------------
// Prompt builders — optimised for small models (Gemma 4 1B etc.)
// Short, direct, single-task instructions work best for sub-3B models.
// ---------------------------------------------------------------------------
function buildPromptEn(skillId: string, entryText: string): string {
  const skill = SKILLS_BY_ID[skillId];
  if (!skill) return '';
  const style = STYLE_EN[skillId] ?? 'observant';
  return (
    `You are ${skill.name}, a voice in someone's psyche (like Disco Elysium). ` +
    `Style: ${style}. ` +
    `Write exactly 1-2 sentences commenting on this journal entry. ` +
    `Use second person ("you"). No greetings or explanations.\n\n` +
    `Entry: ${entryText.slice(0, 600)}`
  );
}

function buildPromptKo(skillId: string, entryText: string): string {
  const skill = SKILLS_BY_ID[skillId];
  if (!skill) return '';
  const T = getT('ko');
  const nameKo = T.skills.names[skillId] ?? skill.name;
  const style = STYLE_KO[skillId] ?? '관찰력 있음';
  return (
    `당신은 ${nameKo}입니다. 디스코 엘리시움처럼 인간 정신 속의 목소리 역할을 합니다. ` +
    `말투: ${style}. ` +
    `아래 일기 항목에 대해 정확히 1~2문장으로 코멘트하세요. ` +
    `2인칭("당신은")을 사용하세요. 인사말이나 설명 없이 바로 코멘트만 쓰세요.\n\n` +
    `일기: ${entryText.slice(0, 600)}`
  );
}

// ---------------------------------------------------------------------------
// Ollama fetch
// ---------------------------------------------------------------------------
async function fetchOllamaComment(
  skillId: string,
  entryText: string,
  url: string,
  model: string,
  locale: 'en' | 'ko',
): Promise<string | null> {
  const prompt = locale === 'ko'
    ? buildPromptKo(skillId, entryText)
    : buildPromptEn(skillId, entryText);
  if (!prompt) return null;

  const controller = new AbortController();
  const timeout = setTimeout(() => controller.abort(), 10000);

  try {
    const response = await fetch(`${url}/api/generate`, {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      signal: controller.signal,
      body: JSON.stringify({
        model,
        prompt,
        stream: false,
        options: {
          temperature: 0.85,
          num_predict: 90,   // enough for 1-2 sentences
          top_p: 0.92,
        },
      }),
    });

    if (!response.ok) return null;
    const data = await response.json();
    return data.response?.trim() || null;
  } catch {
    return null;
  } finally {
    clearTimeout(timeout);
  }
}

// ---------------------------------------------------------------------------
// Public API
// ---------------------------------------------------------------------------
export async function generateSkillComments(
  content: string,
  checks: DiceCheck[],
): Promise<SkillComment[]> {
  if (!content.trim()) return [];

  const { ollamaEnabled, ollamaUrl, ollamaModel, locale } = useSettingsStore.getState();
  const templateResults = generateTemplateComments(content, checks, 3);

  if (!ollamaEnabled) {
    return templateResults.map(r => ({
      skillId: r.skillId,
      text: r.text,
      source: 'template' as const,
      triggeredAt: new Date().toISOString(),
    }));
  }

  const comments: SkillComment[] = await Promise.all(
    templateResults.map(async (r) => {
      const aiText = await fetchOllamaComment(r.skillId, content, ollamaUrl, ollamaModel, locale);
      return {
        skillId: r.skillId,
        text: aiText ?? r.text,
        source: (aiText ? 'ollama' : 'template') as 'ollama' | 'template',
        triggeredAt: new Date().toISOString(),
      };
    })
  );

  return comments;
}
