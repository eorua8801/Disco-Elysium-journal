// Disco Elysium — 24 Skills Data
// Each skill has authored comment templates and keyword triggers.
// Templates use {{topic}} for the matched subject from the entry.

export type StatGroup = 'Intellect' | 'Psyche' | 'Physique' | 'Motorics';

export type Mood = 'hopeful' | 'neutral' | 'troubled' | 'numb';

export interface Skill {
  id: string;
  name: string;
  stat: StatGroup;
  color: string;
  description: string;
  keywords: string[];
  successTemplates: string[];  // for passed checks / positive context
  failureTemplates: string[];  // for failed checks / negative context
  neutralTemplates: string[];  // for passive comments
}

export const SKILLS: Skill[] = [
  // ─── INTELLECT ───────────────────────────────────────────────
  {
    id: 'logic',
    name: 'Logic',
    stat: 'Intellect',
    color: '#4a90d9',
    description: 'The cold engine of reason. Finds patterns. Draws conclusions.',
    keywords: ['because', 'therefore', 'reason', 'think', 'understand', 'conclude', 'analyze', 'problem', 'solution', 'cause', 'effect', 'plan'],
    successTemplates: [
      'The reasoning holds. {{topic}} follows logically from the evidence at hand.',
      'This is correct. The conclusion regarding {{topic}} is well-supported.',
      'Cross-referencing all known data, {{topic}} is the only consistent interpretation.',
      'Solid analysis. {{topic}} resolves the contradiction.',
    ],
    failureTemplates: [
      'The logic falls apart here. {{topic}} doesn\'t follow from the premises.',
      'This is a non-sequitur. {{topic}} and the conclusion have no causal relationship.',
      'You\'re missing a step. The argument about {{topic}} has a hole in it.',
      'Error in reasoning detected. Revisit the assumptions about {{topic}}.',
    ],
    neutralTemplates: [
      'Note the pattern in {{topic}}. Repetition is data.',
      'This is worth filing away. {{topic}} may become relevant later.',
      'Observation logged: {{topic}} presents an interesting variable.',
      'The facts regarding {{topic}} are as follows — and they\'re stranger than expected.',
    ],
  },
  {
    id: 'encyclopedia',
    name: 'Encyclopedia',
    stat: 'Intellect',
    color: '#5ba0e9',
    description: 'A vast archive of mostly useless facts, occasionally brilliant.',
    keywords: ['history', 'fact', 'know', 'remember', 'learn', 'study', 'book', 'read', 'culture', 'origin', 'named', 'called', 'century', 'year'],
    successTemplates: [
      'Correct! {{topic}} has a fascinating historical precedent worth noting.',
      'This connects to the broader pattern. {{topic}} echoes something from the past.',
      'Cross-referencing the archives — {{topic}} is more significant than it appears.',
    ],
    failureTemplates: [
      'That\'s... not quite accurate regarding {{topic}}. The actual history is more complicated.',
      'The record on {{topic}} is being misread. Check the source.',
      'Incomplete data. More research needed on {{topic}}.',
    ],
    neutralTemplates: [
      'Interesting. {{topic}} has roots going back further than most people know.',
      'For reference: {{topic}} was not always this way.',
      'The context for {{topic}} is: it\'s been like this for a very long time.',
    ],
  },
  {
    id: 'rhetoric',
    name: 'Rhetoric',
    stat: 'Intellect',
    color: '#6ab0f9',
    description: 'The art of persuasion. Detects arguments and their weaknesses.',
    keywords: ['argue', 'convince', 'explain', 'tell', 'say', 'discuss', 'debate', 'persuade', 'wrong', 'right', 'opinion', 'believe', 'agree', 'disagree'],
    successTemplates: [
      'That was well-argued. {{topic}} is now framed persuasively.',
      'The case for {{topic}} is solid. Anyone reasonable would come around.',
      'Good rhetorical move. {{topic}} lands exactly where it needed to.',
    ],
    failureTemplates: [
      'The argument about {{topic}} is full of holes. It won\'t hold up.',
      'Weak framing. {{topic}} needs a stronger logical foundation.',
      'You\'re being reactive, not persuasive, about {{topic}}.',
    ],
    neutralTemplates: [
      'The way {{topic}} is being framed reveals something about the framer.',
      'Someone is trying to make you feel a certain way about {{topic}}. Notice it.',
      'The words used for {{topic}} are doing a lot of work.',
    ],
  },
  {
    id: 'drama',
    name: 'Drama',
    stat: 'Intellect',
    color: '#7ac0ff',
    description: 'Detects performance. Also enjoys it tremendously.',
    keywords: ['feel', 'felt', 'emotional', 'cry', 'laugh', 'smile', 'dramatic', 'performance', 'pretend', 'lie', 'face', 'reaction', 'scene', 'act'],
    successTemplates: [
      'That was a performance. A good one. {{topic}} landed.',
      'You read the room on {{topic}} — beautifully done.',
      'Perfect dramatic timing. {{topic}} was exactly the right move.',
    ],
    failureTemplates: [
      'That was overplayed. {{topic}} came across as desperate.',
      'The mask slipped. {{topic}} was not convincing.',
      'You miscalculated the emotional stakes of {{topic}}.',
    ],
    neutralTemplates: [
      'There\'s a performance quality to {{topic}} that shouldn\'t be ignored.',
      'Everyone\'s playing a role in this story about {{topic}}.',
      'The drama around {{topic}} is half the content.',
    ],
  },
  {
    id: 'conceptualization',
    name: 'Conceptualization',
    stat: 'Intellect',
    color: '#89d0ff',
    description: 'Sees the art in things. Gives ideas form.',
    keywords: ['idea', 'concept', 'meaning', 'symbol', 'metaphor', 'imagine', 'create', 'design', 'art', 'beautiful', 'vision', 'represent', 'express', 'creative'],
    successTemplates: [
      'There\'s something genuinely interesting here. {{topic}} has real aesthetic weight.',
      'The concept behind {{topic}} is coherent — and maybe even meaningful.',
      'This crystallizes into something. {{topic}} is an idea that has legs.',
    ],
    failureTemplates: [
      'It\'s trying too hard. {{topic}} is reaching for depth it doesn\'t have.',
      'The concept of {{topic}} doesn\'t hold together under examination.',
      'Empty aesthetics. {{topic}} looks like meaning but isn\'t.',
    ],
    neutralTemplates: [
      'There\'s an image forming around {{topic}}. Let it develop.',
      '{{topic}} could be the seed of something larger.',
      'The shape of {{topic}} is interesting even if the content isn\'t yet.',
    ],
  },
  {
    id: 'visual-calculus',
    name: 'Visual Calculus',
    stat: 'Intellect',
    color: '#a0d8ff',
    description: 'Reconstructs events from physical evidence. Sees what happened.',
    keywords: ['see', 'look', 'notice', 'observe', 'watch', 'found', 'space', 'place', 'position', 'distance', 'move', 'direction', 'physical', 'scene'],
    successTemplates: [
      'The geometry checks out. {{topic}} happened exactly as visualized.',
      'Reconstruction confirmed. {{topic}} leaves specific physical traces.',
      'The spatial logic of {{topic}} is consistent with the evidence.',
    ],
    failureTemplates: [
      'The numbers don\'t add up. {{topic}} can\'t have happened this way.',
      'Physical impossibility detected in the account of {{topic}}.',
      'The reconstruction of {{topic}} fails at this point.',
    ],
    neutralTemplates: [
      'Note the spatial details of {{topic}}. They matter more than they seem.',
      'Walk it back. {{topic}} has a sequence of events worth mapping.',
      'The environment around {{topic}} is telling a parallel story.',
    ],
  },

  // ─── PSYCHE ──────────────────────────────────────────────────
  {
    id: 'volition',
    name: 'Volition',
    stat: 'Psyche',
    color: '#9b59b6',
    description: 'The will to keep going. The small voice that says: not yet.',
    keywords: ['keep', 'try', 'give up', 'continue', 'persist', 'resist', 'control', 'stop', 'hold', 'discipline', 'will', 'motivation', 'force', 'despite'],
    successTemplates: [
      'You held it together. {{topic}} didn\'t break you — not this time.',
      'Discipline asserted. {{topic}} has been faced and survived.',
      'Good. The refusal to collapse in the face of {{topic}} is itself an accomplishment.',
    ],
    failureTemplates: [
      'The will buckled. {{topic}} got through the defenses.',
      'This is a failure of discipline regarding {{topic}}. It happens.',
      'You let {{topic}} in further than you should have.',
    ],
    neutralTemplates: [
      '{{topic}} is exactly the kind of thing that erodes you over time. Keep an eye on it.',
      'The ongoing relationship with {{topic}} requires more will than it looks like.',
      'You\'re managing {{topic}}. That\'s different from resolving it.',
    ],
  },
  {
    id: 'inland-empire',
    name: 'Inland Empire',
    stat: 'Psyche',
    color: '#c39bd3',
    description: 'The subconscious made loud. Dreams, hunches, visions.',
    keywords: ['dream', 'feel', 'sense', 'strange', 'weird', 'haunted', 'memory', 'past', 'soul', 'ghost', 'spirit', 'something', 'wrong', 'right', 'know'],
    successTemplates: [
      'The feeling was right. Something in {{topic}} was pointing at something real.',
      'Trust it. The instinct about {{topic}} has been confirmed by events.',
      'The subconscious got there first. {{topic}} is significant — emotionally, cosmically.',
    ],
    failureTemplates: [
      'The feeling was lying. {{topic}} was a red herring.',
      'The intuition about {{topic}} was wishful thinking dressed up as insight.',
      'That sensation around {{topic}} — it was just fear. Nothing more.',
    ],
    neutralTemplates: [
      'Something in {{topic}} smells like a memory you haven\'t had yet.',
      'The resonance around {{topic}} is unusual. Something is reaching.',
      '{{topic}} keeps appearing. This is not a coincidence. Probably.',
      'The texture of {{topic}} feels wrong in a way that might mean something.',
    ],
  },
  {
    id: 'empathy',
    name: 'Empathy',
    stat: 'Psyche',
    color: '#ff8fb1',
    description: 'Reads people. Feels what they feel. Sometimes too much.',
    keywords: ['friend', 'people', 'relationship', 'understand', 'hurt', 'lonely', 'together', 'alone', 'care', 'love', 'help', 'connect', 'other', 'they', 'she', 'he'],
    successTemplates: [
      'You understood what {{topic}} needed from you in that moment.',
      'The read was accurate. {{topic}} was experiencing exactly what you sensed.',
      'Connection achieved. {{topic}} felt seen because they were.',
    ],
    failureTemplates: [
      'You missed it. {{topic}} needed something different and you didn\'t notice.',
      'The projection onto {{topic}} was about you, not them.',
      'The empathetic failure around {{topic}} is going to cost something.',
    ],
    neutralTemplates: [
      'The way you wrote about {{topic}} — there\'s grief underneath that.',
      'There\'s something unsaid between you and {{topic}}. Both of you know it.',
      '{{topic}} is carrying something. You can feel the weight of it from here.',
      'The people in {{topic}} are more complicated than the narrative suggests.',
    ],
  },
  {
    id: 'authority',
    name: 'Authority',
    stat: 'Psyche',
    color: '#f39c12',
    description: 'Commands respect. Understands power. Tends toward dominance.',
    keywords: ['power', 'control', 'boss', 'lead', 'authority', 'respect', 'demand', 'rule', 'order', 'command', 'decide', 'responsibility', 'strong', 'weak'],
    successTemplates: [
      'Correct. {{topic}} required someone to take charge, and you did.',
      'The authority was warranted here. {{topic}} needed direction.',
      'Power exercised appropriately. {{topic}} was handled.',
    ],
    failureTemplates: [
      'The attempt at authority over {{topic}} failed. They saw through it.',
      'You came at {{topic}} from a position of weakness, not strength.',
      'The command structure around {{topic}} is not respecting you.',
    ],
    neutralTemplates: [
      'Someone holds power over {{topic}}. Figure out who.',
      '{{topic}} is a question of who gets to make the rules.',
      'The hierarchy around {{topic}} is worth mapping.',
    ],
  },
  {
    id: 'esprit-de-corps',
    name: 'Esprit de Corps',
    stat: 'Psyche',
    color: '#e67e22',
    description: 'Institutional memory. The collective spirit of the force.',
    keywords: ['team', 'group', 'together', 'we', 'us', 'department', 'organization', 'community', 'belong', 'part', 'role', 'duty', 'institution'],
    successTemplates: [
      'The team dynamic around {{topic}} was read correctly.',
      'Collective action worked. {{topic}} is better for the collaboration.',
      'The institutional understanding of {{topic}} proved useful.',
    ],
    failureTemplates: [
      'The team failed {{topic}} — or {{topic}} failed the team.',
      'The institution isn\'t built to handle {{topic}}. This is a known failure mode.',
      'Collective blindness at work. {{topic}} was missed by everyone.',
    ],
    neutralTemplates: [
      '{{topic}} is not just about you. Others have been here before.',
      'The collective memory says: {{topic}} ends a certain way. Keep that in mind.',
      'There\'s a protocol for {{topic}}. Whether it helps is another question.',
    ],
  },
  {
    id: 'suggestion',
    name: 'Suggestion',
    stat: 'Psyche',
    color: '#d35400',
    description: 'Indirect influence. The gentle push. The nudge.',
    keywords: ['maybe', 'perhaps', 'could', 'suggest', 'indirect', 'hint', 'subtle', 'approach', 'influence', 'way', 'gentle', 'nudge', 'offer'],
    successTemplates: [
      'The indirect approach worked on {{topic}}. They didn\'t notice the push.',
      'Suggestion effective. {{topic}} shifted without knowing why.',
      'The gentle influence around {{topic}} landed perfectly.',
    ],
    failureTemplates: [
      'The suggestion was too obvious. {{topic}} saw through it.',
      'The nudge regarding {{topic}} was too weak to matter.',
      'The indirect approach failed. {{topic}} needed something more direct.',
    ],
    neutralTemplates: [
      'There\'s a way to approach {{topic}} that doesn\'t trigger resistance.',
      '{{topic}} is more persuadable than it seems — with the right angle.',
      'The indirect path through {{topic}} is longer but less defended.',
    ],
  },

  // ─── PHYSIQUE ─────────────────────────────────────────────────
  {
    id: 'endurance',
    name: 'Endurance',
    stat: 'Physique',
    color: '#c0392b',
    description: 'The body\'s refusal. Keeps going when it shouldn\'t.',
    keywords: ['tired', 'exhausted', 'sleep', 'sick', 'pain', 'hurt', 'endure', 'survive', 'keep going', 'body', 'health', 'rest', 'long', 'hard', 'difficult'],
    successTemplates: [
      'The body held. {{topic}} was brutal but survivable.',
      'Endurance confirmed. You came through {{topic}} intact.',
      'The physical toll of {{topic}} was absorbed. Somehow.',
    ],
    failureTemplates: [
      'The body gave out on {{topic}}. It had limits.',
      'This is unsustainable. {{topic}} is taking more than you have.',
      'Physical failure is a kind of message. {{topic}} is too much.',
    ],
    neutralTemplates: [
      'The body is keeping score on {{topic}}. Check in.',
      '{{topic}} has a physical dimension that isn\'t being acknowledged.',
      'The tiredness around {{topic}} is real. It\'s not just in your head.',
    ],
  },
  {
    id: 'pain-threshold',
    name: 'Pain Threshold',
    stat: 'Physique',
    color: '#c0392b',
    description: 'Endures what others can\'t. Also doesn\'t know when to stop.',
    keywords: ['pain', 'hurt', 'injury', 'suffer', 'bleed', 'wound', 'ache', 'sore', 'damaged', 'broken', 'tolerate', 'bear', 'withstand'],
    successTemplates: [
      'You absorbed {{topic}} without breaking. That\'s something.',
      'The pain from {{topic}} was processed and set aside. Functional.',
      'Through {{topic}} and still operational. Respect.',
    ],
    failureTemplates: [
      'That went deeper than expected. {{topic}} actually got through.',
      'This level of discomfort around {{topic}} is interfering with function.',
      'The threshold was exceeded. {{topic}} left a mark.',
    ],
    neutralTemplates: [
      '{{topic}} is painful in a way you\'ve learned to normalize. Don\'t.',
      'There\'s a hurt at the center of {{topic}} that keeps getting deferred.',
      'The numbness around {{topic}} is itself a kind of pain.',
    ],
  },
  {
    id: 'physical-instrument',
    name: 'Physical Instrument',
    stat: 'Physique',
    color: '#e74c3c',
    description: 'The body as tool. Raw strength. Presence.',
    keywords: ['strong', 'lift', 'carry', 'physical', 'body', 'force', 'push', 'move', 'heavy', 'weight', 'power', 'action', 'build'],
    successTemplates: [
      'The physical approach to {{topic}} worked. Direct, effective.',
      'The body solved what the mind was overcomplicating about {{topic}}.',
      'Strength applied appropriately. {{topic}} yielded.',
    ],
    failureTemplates: [
      'Brute force failed on {{topic}}. This one requires finesse.',
      'The physical dimension of {{topic}} was miscalculated.',
      'The body was wrong for the job. {{topic}} needed something else.',
    ],
    neutralTemplates: [
      'There\'s a physical solution lurking inside {{topic}}.',
      '{{topic}} has a weight to it. Literally or not.',
      'The body is already responding to {{topic}}. Trust that.',
    ],
  },
  {
    id: 'electrochemistry',
    name: 'Electrochemistry',
    stat: 'Physique',
    color: '#ff6b35',
    description: 'The body\'s appetites. Raw want. Chemical truth.',
    keywords: ['want', 'need', 'desire', 'pleasure', 'drink', 'eat', 'enjoy', 'high', 'rush', 'energy', 'excitement', 'impulse', 'urge', 'vice', 'indulge'],
    successTemplates: [
      'YES. {{topic}} delivered exactly what was needed. The body is satisfied.',
      'The impulse was right this time. {{topic}} paid off.',
      'The chemistry around {{topic}} is working in your favor.',
    ],
    failureTemplates: [
      'The craving made you reckless about {{topic}}.',
      'This is the body lying again. {{topic}} was not worth the cost.',
      'The crash after {{topic}} is going to be proportional to the high.',
    ],
    neutralTemplates: [
      'There\'s a chemical component to the feeling around {{topic}}. Don\'t overthink it.',
      '{{topic}} triggers something. The body knows what it wants.',
      'The want around {{topic}} isn\'t shameful. It\'s data.',
    ],
  },
  {
    id: 'shivers',
    name: 'Shivers',
    stat: 'Physique',
    color: '#a8d8ea',
    description: 'The city whispering. Atmosphere, geography, collective memory.',
    keywords: ['city', 'street', 'wind', 'cold', 'weather', 'night', 'air', 'place', 'world', 'outside', 'walk', 'atmosphere', 'mood', 'feeling', 'landscape'],
    successTemplates: [
      'The city agrees. {{topic}} is part of something larger.',
      'The atmosphere confirmed it. {{topic}} was the right read.',
      'Something in the air resonated with {{topic}}. The world was listening.',
    ],
    failureTemplates: [
      'The signal was noise. {{topic}} didn\'t mean what the atmosphere suggested.',
      'Reading too much into {{topic}}. The city is not speaking to you specifically.',
      'The atmospheric interpretation of {{topic}} was projection.',
    ],
    neutralTemplates: [
      'The city is doing something around {{topic}}. Feel it.',
      '{{topic}} is not just personal. It has geography. History. Weather.',
      'Something in the air has changed. {{topic}} is part of that shift.',
      'The world hums differently today. Something about {{topic}} is responsible.',
    ],
  },
  {
    id: 'half-light',
    name: 'Half Light',
    stat: 'Physique',
    color: '#ff4444',
    description: 'Fight or flight. Threat detection. Violence as reflex.',
    keywords: ['danger', 'threat', 'afraid', 'fear', 'protect', 'attack', 'defend', 'unsafe', 'risk', 'violent', 'aggressive', 'intense', 'tense', 'nervous', 'guard'],
    successTemplates: [
      'The threat assessment was correct. {{topic}} was actually dangerous.',
      'The instinct to be cautious about {{topic}} was right.',
      'Danger avoided. The warning about {{topic}} was real.',
    ],
    failureTemplates: [
      'False alarm. {{topic}} wasn\'t actually threatening.',
      'The panic response to {{topic}} was disproportionate.',
      'You scared yourself unnecessarily with {{topic}}.',
    ],
    neutralTemplates: [
      'Something about {{topic}} feels like a trap. Trust that feeling enough to be careful.',
      '{{topic}} has a danger signature that shouldn\'t be ignored.',
      'The body is already preparing for something. {{topic}} is the trigger.',
    ],
  },

  // ─── MOTORICS ─────────────────────────────────────────────────
  {
    id: 'hand-eye-coordination',
    name: 'Hand/Eye Coordination',
    stat: 'Motorics',
    color: '#27ae60',
    description: 'The marriage of observation and action. Precision.',
    keywords: ['focus', 'precise', 'accurate', 'detail', 'careful', 'exact', 'coordinate', 'skill', 'practiced', 'work', 'manual', 'hand', 'technique'],
    successTemplates: [
      'Precise execution. {{topic}} was handled with technical accuracy.',
      'The coordination between intention and action around {{topic}} was flawless.',
      'Clean. {{topic}} was done right.',
    ],
    failureTemplates: [
      'Fumbled. {{topic}} needed more precision than was available.',
      'The execution of {{topic}} was sloppy.',
      'The gap between intention and reality in {{topic}} is showing.',
    ],
    neutralTemplates: [
      '{{topic}} requires more attention to detail than it\'s getting.',
      'There\'s a technique to {{topic}} that makes it easier. Find it.',
      'The small things inside {{topic}} are where the actual work is.',
    ],
  },
  {
    id: 'perception',
    name: 'Perception',
    stat: 'Motorics',
    color: '#2ecc71',
    description: 'Notices what others miss. Detail-oriented to a fault.',
    keywords: ['notice', 'see', 'hear', 'smell', 'sense', 'detail', 'small', 'miss', 'catch', 'observe', 'clue', 'sign', 'signal', 'indicate'],
    successTemplates: [
      'Caught it. {{topic}} contains a detail that most people walk past.',
      'The perceptual read on {{topic}} was accurate. That detail matters.',
      'You noticed {{topic}} before it could hide. Good.',
    ],
    failureTemplates: [
      'You missed something in {{topic}}. It was right there.',
      'The detail in {{topic}} that mattered most went unnoticed.',
      'Perception failure. {{topic}} had more information than was processed.',
    ],
    neutralTemplates: [
      'There\'s something small in {{topic}} that\'s carrying a large amount of meaning.',
      '{{topic}} has a tell. Find it.',
      'The edges of {{topic}} are more interesting than the center.',
    ],
  },
  {
    id: 'reaction-speed',
    name: 'Reaction Speed',
    stat: 'Motorics',
    color: '#1abc9c',
    description: 'Faster than thought. Acts on instinct.',
    keywords: ['quick', 'fast', 'sudden', 'immediately', 'react', 'respond', 'instant', 'reflex', 'moment', 'second', 'first', 'unexpected', 'surprise'],
    successTemplates: [
      'The fast response to {{topic}} was correct. No time to overthink it.',
      'First instinct was right about {{topic}}. The slower mind would have ruined it.',
      'Reacted correctly to {{topic}} before the analysis was complete.',
    ],
    failureTemplates: [
      'Too slow on {{topic}}. The moment passed.',
      'The hesitation on {{topic}} cost something.',
      'The window for {{topic}} closed before it was used.',
    ],
    neutralTemplates: [
      '{{topic}} moves faster than deliberation. Keep up.',
      'The first thirty seconds of {{topic}} contain the most information.',
      'Speed matters here. {{topic}} is not going to wait.',
    ],
  },
  {
    id: 'savoir-faire',
    name: 'Savoir Faire',
    stat: 'Motorics',
    color: '#16a085',
    description: 'Cool under pressure. Knows how to present.',
    keywords: ['cool', 'style', 'smooth', 'confident', 'impression', 'presentation', 'class', 'manner', 'graceful', 'composed', 'casual', 'effortless'],
    successTemplates: [
      'Smooth. {{topic}} was handled with the appropriate level of cool.',
      'No one saw the effort. {{topic}} looked effortless.',
      'The style landed. {{topic}} made exactly the impression it needed to.',
    ],
    failureTemplates: [
      'The cool facade cracked on {{topic}}. It showed.',
      'Trying too hard. {{topic}} needed more casual.',
      'The savoir-faire failed on {{topic}}. Awkward.',
    ],
    neutralTemplates: [
      '{{topic}} is a test of composure. Treat it accordingly.',
      'How you carry yourself through {{topic}} is the message.',
      'The manner of engaging with {{topic}} matters as much as the content.',
    ],
  },
  {
    id: 'interfacing',
    name: 'Interfacing',
    stat: 'Motorics',
    color: '#0e9e7a',
    description: 'Makes technology behave. Understands machines.',
    keywords: ['machine', 'system', 'device', 'technology', 'computer', 'phone', 'tool', 'app', 'work', 'fix', 'break', 'operate', 'function', 'digital'],
    successTemplates: [
      'The system responded correctly to {{topic}}. Good inputs.',
      'Technical success. {{topic}} is operational.',
      'The interface with {{topic}} was clean. No friction.',
    ],
    failureTemplates: [
      'System error on {{topic}}. Something in the process is wrong.',
      'The technical approach to {{topic}} failed. Try a different angle.',
      '{{topic}} is not cooperating. This requires troubleshooting.',
    ],
    neutralTemplates: [
      '{{topic}} has a logic to it. Find the pattern and it becomes manageable.',
      'The system around {{topic}} has rules. Learn them.',
      'There\'s an interface for {{topic}}. You just haven\'t found it yet.',
    ],
  },
  {
    id: 'composure',
    name: 'Composure',
    stat: 'Motorics',
    color: '#27ae60',
    description: 'Doesn\'t crack. Keeps the outside calm whatever the inside is doing.',
    keywords: ['calm', 'composed', 'control', 'steady', 'stable', 'balance', 'stress', 'pressure', 'maintain', 'hold together', 'crisis', 'overwhelm', 'handle'],
    successTemplates: [
      'Composure maintained. {{topic}} was faced without visible fracture.',
      'The outside stayed calm during {{topic}}. That was the right call.',
      'Held it together. {{topic}} passed and the mask didn\'t slip.',
    ],
    failureTemplates: [
      'Composure failed on {{topic}}. Others saw.',
      'The cracks showed. {{topic}} got through the professional surface.',
      'The external collapse around {{topic}} is going to have consequences.',
    ],
    neutralTemplates: [
      '{{topic}} is going to test composure. Start preparing.',
      'The steady surface around {{topic}} is doing a lot of work underneath.',
      'What you\'re not saying about {{topic}} is keeping the peace. For now.',
    ],
  },
];

// Helpers
export const SKILLS_BY_ID: Record<string, Skill> = Object.fromEntries(
  SKILLS.map(s => [s.id, s])
);

export const SKILLS_BY_STAT: Record<StatGroup, Skill[]> = {
  Intellect: SKILLS.filter(s => s.stat === 'Intellect'),
  Psyche: SKILLS.filter(s => s.stat === 'Psyche'),
  Physique: SKILLS.filter(s => s.stat === 'Physique'),
  Motorics: SKILLS.filter(s => s.stat === 'Motorics'),
};

export const STAT_COLORS: Record<StatGroup, string> = {
  Intellect: 'var(--intellect)',
  Psyche: 'var(--psyche)',
  Physique: 'var(--physique)',
  Motorics: 'var(--motorics)',
};

export const DIFFICULTY_LABELS: Record<number, string> = {
  6: 'Trivial',
  8: 'Easy',
  10: 'Medium',
  12: 'Hard',
  14: 'Formidable',
  16: 'Legendary',
};
