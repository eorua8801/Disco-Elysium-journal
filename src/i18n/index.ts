/**
 * i18n — translation dictionary + useT hook
 * Usage: const T = useT(); then T.nav.journal, T.editor.save, etc.
 */
import { useSettingsStore } from '../store/settingsStore';

// ---------------------------------------------------------------------------
// Type
// ---------------------------------------------------------------------------
interface Translations {
  nav: {
    journal: string;
    newEntry: string;
    skills: string;
    settings: string;
  };
  home: {
    title: string;
    newBtn: string;
    today: string;
    earlier: string;
    loading: string;
    emptyTitle: string;
    emptySub: string;
    writeFirst: string;
    entries: (n: number) => string;
  };
  editor: {
    cancel: string;
    save: string;
    saving: string;
    words: (n: number) => string;
    rollCheck: string;
    placeholder: string;
    moods: Record<string, string>;
  };
  entry: {
    untitled: string;
    label: string;
    skillChecks: string;
    regenerate: string;
    regenerating: string;
    confirmDelete: string;
    tasks: string;
    characters: string;
    subTaskStatus: Record<string, string>;
  };
  skills: {
    title: string;
    allBtn: string;
    stats: Record<string, string>;
    names: Record<string, string>;
  };
  dice: {
    title: string;
    whatAttempting: string;
    skillLabel: string;
    difficultyLabel: string;
    cancel: string;
    roll: string;
    close: string;
    saveToEntry: string;
    vsLabel: string;
    placeholder: string;
    difficulties: Record<number, string>;
  };
  skillPanel: {
    title: string;
  };
  settings: {
    title: string;
    subtitle: string;
    aiTitle: string;
    enableOllama: string;
    ollamaDesc: string;
    ollamaUrl: string;
    model: string;
    modelHint: string;
    templatesNote: string;
    onDeviceTitle: string;
    onDeviceDesc: string;
    onDeviceNote: string;
    modelStatus: string;
    modelStatusReady: string;
    downloadModel: string;
    downloading: (pct: number) => string;
    cancelDownload: string;
    deleteModel: string;
    geminiTitle: string;
    geminiDesc: string;
    geminiApiKey: string;
    geminiApiKeyHint: string;
    geminiModel: string;
    geminiModelHint: string;
    displayTitle: string;
    scanlines: string;
    scanlinesDesc: string;
    langTitle: string;
    aboutTitle: string;
    aboutNote: string;
    aboutFan: string;
    on: string;
    off: string;
  };
}

// ---------------------------------------------------------------------------
// English
// ---------------------------------------------------------------------------
const en: Translations = {
  nav: {
    journal:  'Journal',
    newEntry: 'New Entry',
    skills:   'Skills',
    settings: 'Settings',
  },
  home: {
    title:      'Disco Journal',
    newBtn:     '⊕ New',
    today:      '◈ Today',
    earlier:    '◎ Earlier',
    loading:    'Loading entries…',
    emptyTitle: 'The journal is empty.',
    emptySub:   'What happened today?\nYour skills are waiting to weigh in.',
    writeFirst: 'Write first entry ✦',
    entries:    (n) => n === 1 ? '1 entry' : `${n} entries`,
  },
  editor: {
    cancel:      '← Cancel',
    save:        'Save',
    saving:      '…',
    words:       (n) => `${n} words`,
    rollCheck:   'Roll a skill check',
    placeholder: 'What happened? What did you feel? What are you trying to understand?',
    moods: {
      hopeful:  'Hopeful',
      neutral:  'Neutral',
      troubled: 'Troubled',
      numb:     'Numb',
    },
  },
  entry: {
    untitled:      'Untitled Entry',
    label:         'Entry',
    skillChecks:   '⚄ Skill Checks',
    regenerate:    '↻ Regenerate voices',
    regenerating:  'Generating…',
    confirmDelete: 'Delete this entry?',
    tasks:         '◈ Active Missions',
    characters:    '◎ Characters Encountered',
    subTaskStatus: {
      active:   'Active',
      success:  'Success',
      failure:  'Failure',
      deferred: 'Deferred',
    },
  },
  skills: {
    title:  'Skills',
    allBtn: 'All',
    stats: {
      Intellect: 'Intellect',
      Psyche:    'Psyche',
      Physique:  'Physique',
      Motorics:  'Motorics',
    },
    names: {
      'logic':               'Logic',
      'encyclopedia':        'Encyclopedia',
      'rhetoric':            'Rhetoric',
      'drama':               'Drama',
      'conceptualization':   'Conceptualization',
      'visual-calculus':     'Visual Calculus',
      'volition':            'Volition',
      'inland-empire':       'Inland Empire',
      'empathy':             'Empathy',
      'authority':           'Authority',
      'esprit-de-corps':     'Esprit de Corps',
      'suggestion':          'Suggestion',
      'endurance':           'Endurance',
      'pain-threshold':      'Pain Threshold',
      'physical-instrument': 'Physical Instrument',
      'electrochemistry':    'Electrochemistry',
      'shivers':             'Shivers',
      'half-light':          'Half Light',
      'hand-eye-coordination': 'Hand/Eye Coord.',
      'perception':          'Perception',
      'reaction-speed':      'Reaction Speed',
      'savoir-faire':        'Savoir Faire',
      'interfacing':         'Interfacing',
      'composure':           'Composure',
    },
  },
  dice: {
    title:           '⬡ SKILL CHECK',
    whatAttempting:  'What are you attempting?',
    skillLabel:      'Skill',
    difficultyLabel: 'Difficulty',
    cancel:          'Cancel',
    roll:            'Roll 2d6',
    close:           'Close',
    saveToEntry:     'Save to Entry',
    vsLabel:         'vs',
    placeholder:     'I tried to apologize honestly…',
    difficulties: {
      6:  'Trivial',
      8:  'Easy',
      10: 'Medium',
      12: 'Hard',
      14: 'Formidable',
      16: 'Legendary',
    },
  },
  skillPanel: {
    title: 'INTERNAL MONOLOGUE',
  },
  settings: {
    title:        'Settings',
    subtitle:     'Configure the journal',
    aiTitle:      'AI Skill Voices',
    enableOllama: 'Enable Ollama',
    ollamaDesc:   'Use a local LLM to generate dynamic skill comments instead of templates. Requires Ollama running at the configured URL.',
    ollamaUrl:    'Ollama URL',
    model:        'Model',
    modelHint:    'Recommended: gemma4:1b · gemma3:1b · phi3:mini',
    templatesNote:'Skill voices will use hand-crafted templates. Enable Ollama or On-Device AI for dynamic commentary.',
    onDeviceTitle: 'On-Device AI (Android)',
    onDeviceDesc: 'Run Gemma 4 E2B directly on this device. No server needed. Requires a one-time ~2.6 GB download.',
    onDeviceNote: 'Requires Android 10+, ARM64 chip, ~3 GB free storage. Runs fully offline after download.',
    modelStatus: 'Model: not downloaded',
    modelStatusReady: 'Model: ready ✓',
    downloadModel: 'Download model (~2.6 GB)',
    downloading: (pct) => `Downloading… ${pct}%`,
    cancelDownload: 'Cancel',
    deleteModel: 'Delete model',
    geminiTitle:      'Gemini AI (Full Analysis)',
    geminiDesc:       'Use Google Gemini to analyze entries and extract skill voices, missions, and characters. Requires a free API key from Google AI Studio.',
    geminiApiKey:     'API Key',
    geminiApiKeyHint: 'Get a free key at aistudio.google.com',
    geminiModel:      'Model',
    geminiModelHint:  'Default: gemini-2.0-flash (fast & free tier)',
    displayTitle: 'Display',
    scanlines:    'Scanlines',
    scanlinesDesc:'CRT scanline overlay effect',
    langTitle:    'Language',
    aboutTitle:   'About',
    aboutNote:    "Disco Journal — A journal app inspired by the skill system of Disco Elysium. All entries are stored locally in your browser's IndexedDB.",
    aboutFan:     'Disco Elysium is a game by ZA/UM. This is a fan project.',
    on:  'ON',
    off: 'OFF',
  },
};

// ---------------------------------------------------------------------------
// Korean
// ---------------------------------------------------------------------------
const ko: Translations = {
  nav: {
    journal:  '일지',
    newEntry: '새 항목',
    skills:   '기술',
    settings: '설정',
  },
  home: {
    title:      '디스코 일지',
    newBtn:     '⊕ 새로 쓰기',
    today:      '◈ 오늘',
    earlier:    '◎ 이전',
    loading:    '불러오는 중…',
    emptyTitle: '일지가 비어 있습니다.',
    emptySub:   '오늘은 무슨 일이 있었나요?\n당신의 인격들이 기다리고 있습니다.',
    writeFirst: '첫 번째 항목 쓰기 ✦',
    entries:    (n) => `${n}개의 항목`,
  },
  editor: {
    cancel:      '← 취소',
    save:        '저장',
    saving:      '…',
    words:       (n) => `${n}자`,
    rollCheck:   '기술 판정 굴리기',
    placeholder: '무슨 일이 있었나요? 어떤 감정을 느꼈나요? 무엇을 이해하려 하나요?',
    moods: {
      hopeful:  '희망적',
      neutral:  '중립',
      troubled: '불안',
      numb:     '무감각',
    },
  },
  entry: {
    untitled:      '제목 없음',
    label:         '항목',
    skillChecks:   '⚄ 기술 판정',
    regenerate:    '↻ 목소리 재생성',
    regenerating:  '생성 중…',
    confirmDelete: '이 항목을 삭제하시겠습니까?',
    tasks:         '◈ 진행 중인 임무',
    characters:    '◎ 등장인물',
    subTaskStatus: {
      active:   '진행',
      success:  '성공',
      failure:  '실패',
      deferred: '유예',
    },
  },
  skills: {
    title:  '기술',
    allBtn: '전체',
    stats: {
      Intellect: '지성',
      Psyche:    '정신',
      Physique:  '체력',
      Motorics:  '운동',
    },
    names: {
      'logic':               '논리',
      'encyclopedia':        '백과사전',
      'rhetoric':            '수사학',
      'drama':               '연기',
      'conceptualization':   '개념화',
      'visual-calculus':     '시각 연산',
      'volition':            '의지력',
      'inland-empire':       '내지 제국',
      'empathy':             '공감',
      'authority':           '권위',
      'esprit-de-corps':     '단체 정신',
      'suggestion':          '암시',
      'endurance':           '인내력',
      'pain-threshold':      '고통 한계치',
      'physical-instrument': '신체 도구',
      'electrochemistry':    '전기화학',
      'shivers':             '전율',
      'half-light':          '박명',
      'hand-eye-coordination': '손/눈 협응',
      'perception':          '지각',
      'reaction-speed':      '반응 속도',
      'savoir-faire':        '처세술',
      'interfacing':         '인터페이싱',
      'composure':           '침착',
    },
  },
  dice: {
    title:           '⬡ 기술 판정',
    whatAttempting:  '무엇을 시도했나요?',
    skillLabel:      '기술',
    difficultyLabel: '난이도',
    cancel:          '취소',
    roll:            '2d6 굴리기',
    close:           '닫기',
    saveToEntry:     '항목에 저장',
    vsLabel:         'vs',
    placeholder:     '솔직하게 사과하려 했다…',
    difficulties: {
      6:  '사소',
      8:  '쉬움',
      10: '보통',
      12: '어려움',
      14: '강력',
      16: '전설',
    },
  },
  skillPanel: {
    title: '내면의 독백',
  },
  settings: {
    title:        '설정',
    subtitle:     '일지 환경 설정',
    aiTitle:      'AI 기술 목소리',
    enableOllama: 'Ollama 활성화',
    ollamaDesc:   '설정된 URL에서 Ollama를 실행해 템플릿 대신 동적 기술 코멘트를 생성합니다.',
    ollamaUrl:    'Ollama URL',
    model:        '모델',
    modelHint:    '추천: gemma4:1b · gemma3:1b · phi3:mini',
    templatesNote:'기술 목소리는 제작된 템플릿을 사용합니다. Ollama 또는 온디바이스 AI를 활성화하면 동적 코멘트가 생성됩니다.',
    onDeviceTitle: '온디바이스 AI (안드로이드)',
    onDeviceDesc: 'Gemma 4 E2B를 기기에서 직접 실행합니다. 서버 불필요. 최초 1회 약 2.6GB 다운로드가 필요합니다.',
    onDeviceNote: 'Android 10+, ARM64 칩, 약 3GB 여유 공간 필요. 다운로드 후 완전 오프라인 동작.',
    modelStatus: '모델: 미다운로드',
    modelStatusReady: '모델: 준비됨 ✓',
    downloadModel: '모델 다운로드 (~2.6 GB)',
    downloading: (pct) => `다운로드 중… ${pct}%`,
    cancelDownload: '취소',
    deleteModel: '모델 삭제',
    geminiTitle:      'Gemini AI (전체 분석)',
    geminiDesc:       'Google Gemini로 일기를 분석해 기술 목소리, 임무, 인물을 추출합니다. Google AI Studio에서 무료 API 키를 발급받으세요.',
    geminiApiKey:     'API 키',
    geminiApiKeyHint: 'aistudio.google.com에서 무료 키 발급',
    geminiModel:      '모델',
    geminiModelHint:  '기본값: gemini-2.0-flash (빠르고 무료 티어)',
    displayTitle: '화면',
    scanlines:    '스캔라인',
    scanlinesDesc:'CRT 스캔라인 오버레이 효과',
    langTitle:    '언어',
    aboutTitle:   '정보',
    aboutNote:    '디스코 일지 — 디스코 엘리시움 기술 시스템에서 영감을 받은 일지 앱입니다. 모든 항목은 브라우저의 IndexedDB에 로컬 저장됩니다.',
    aboutFan:     '디스코 엘리시움은 ZA/UM의 게임입니다. 이것은 팬 프로젝트입니다.',
    on:  'ON',
    off: 'OFF',
  },
};

// ---------------------------------------------------------------------------
// Hooks
// ---------------------------------------------------------------------------
export function useT(): Translations {
  const locale = useSettingsStore(s => s.locale);
  return locale === 'ko' ? ko : en;
}

/** Non-hook version for use outside React components (e.g. aiComments.ts) */
export function getT(locale: 'en' | 'ko'): Translations {
  return locale === 'ko' ? ko : en;
}
