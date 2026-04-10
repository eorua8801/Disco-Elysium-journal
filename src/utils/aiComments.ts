import type { SkillComment, DiceCheck } from '../types';
import { SKILLS_BY_ID } from '../data/skills';
import { generateTemplateComments } from './skillMatcher';
import { useSettingsStore } from '../store/settingsStore';

// Build the system prompt for a skill character
function buildSkillPrompt(skillId: string, entryText: string): string {
  const skill = SKILLS_BY_ID[skillId];
  if (!skill) return '';

  const styleMap: Record<string, string> = {
    logic: 'coldly analytical, precise, uses numbered observations and deductive language',
    encyclopedia: 'pedantic but fascinating, likes historical context and trivia',
    rhetoric: 'argumentative, spots logical gaps, frames things as debate',
    drama: 'theatrical, notices emotional performance, loves irony',
    conceptualization: 'poetic and abstract, speaks in images and metaphors',
    'visual-calculus': 'spatial, reconstructive, notices physical details and geometry',
    volition: 'stern but caring, the voice of discipline and self-preservation',
    'inland-empire': 'uncanny, dreamlike, speaks of memories and resonances',
    empathy: 'warm but perceptive, notices emotional undercurrents',
    authority: 'commanding, thinks in hierarchies and power dynamics',
    'esprit-de-corps': 'institutional, thinks about group dynamics and precedent',
    suggestion: 'indirect, speaks of angles and approaches',
    endurance: 'stoic, about limits and survival',
    'pain-threshold': 'blunt, about what hurts and what doesn\'t',
    'physical-instrument': 'direct, physical, about action and force',
    electrochemistry: 'enthusiastic, about desire and pleasure and chemical reality',
    shivers: 'atmospheric, poetic, about the city and collective mood',
    'half-light': 'paranoid, threat-aware, about danger and reflexes',
    'hand-eye-coordination': 'precise and technical',
    perception: 'detail-obsessed, notices what others miss',
    'reaction-speed': 'rapid, about speed and first instincts',
    'savoir-faire': 'cool, stylish, about impression and presentation',
    interfacing: 'systematic, about patterns and processes',
    composure: 'measured, about maintaining the exterior',
  };

  const style = styleMap[skillId] ?? 'analytical';

  return (
    `You are ${skill.name}, a voice inside a person's psyche in the style of Disco Elysium. ` +
    `Your personality: ${skill.description} ` +
    `Your speaking style: ${style}. ` +
    `Respond in 1-2 sentences only. Be specific to the journal entry. ` +
    `Do not say "I" — speak in second person about the writer. ` +
    `Do not explain what you are. Just comment on the journal entry.\n\n` +
    `Journal entry:\n${entryText.slice(0, 800)}`
  );
}

async function fetchOllamaComment(
  skillId: string,
  entryText: string,
  url: string,
  model: string,
): Promise<string | null> {
  const prompt = buildSkillPrompt(skillId, entryText);
  if (!prompt) return null;

  const controller = new AbortController();
  const timeout = setTimeout(() => controller.abort(), 8000);

  try {
    const response = await fetch(`${url}/api/generate`, {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      signal: controller.signal,
      body: JSON.stringify({
        model,
        prompt,
        stream: false,
        options: { temperature: 0.8, num_predict: 80 },
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

export async function generateSkillComments(
  content: string,
  checks: DiceCheck[],
): Promise<SkillComment[]> {
  if (!content.trim()) return [];

  const { ollamaEnabled, ollamaUrl, ollamaModel } = useSettingsStore.getState();

  // Get matched skill IDs from template system (always runs for fallback)
  const templateResults = generateTemplateComments(content, checks, 3);

  if (!ollamaEnabled) {
    return templateResults.map(r => ({
      skillId: r.skillId,
      text: r.text,
      source: 'template' as const,
      triggeredAt: new Date().toISOString(),
    }));
  }

  // Try Ollama for each skill, fall back to template on failure
  const comments: SkillComment[] = await Promise.all(
    templateResults.map(async (r) => {
      const aiText = await fetchOllamaComment(r.skillId, content, ollamaUrl, ollamaModel);
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
