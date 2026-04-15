import type { Category, CategoryId, WeirdNewsStory } from '../types'

export const CATEGORIES: Record<CategoryId, Category> = {
  now: { id: 'now', name: 'Need to Do It – Now', points: 3, emoji: '🔥', color: '#ef4444' },
  someday: { id: 'someday', name: 'Need to Do It – Someday', points: 2, emoji: '⏰', color: '#f59e0b' },
  forSomeReason: { id: 'forSomeReason', name: 'Need to Do It – For Some Reason', points: 1, emoji: '🤔', color: '#3b82f6' },
  whyOnList: { id: 'whyOnList', name: 'Why Is This On My List?', points: -1, emoji: '🗑️', color: '#6b7280' },
  squirrel: { id: 'squirrel', name: 'Squirrel! – What Else Did I Do?', points: 0, emoji: '🐿️', color: '#06b6d4' },
  rewards: { id: 'rewards', name: "Damn I'm Good – Look What I Get", points: 0, emoji: '🏆', color: '#f5c518' },
  reflection: { id: 'reflection', name: 'What Was I Thinking?', points: 0, emoji: '💭', color: '#8b5cf6' },
}

export const MATRIX_CATEGORIES: CategoryId[] = ['now', 'someday', 'forSomeReason', 'whyOnList']

export const ADMIN_EMAIL = 'knutesteel@gmail.com'
export const FREE_TIER_LIMIT = 10

export const COMPLETION_QUOTES: string[] = [
  "That's how it's done. Next.",
  "You magnificent beast.",
  "One less thing on your list. Zero excuses left.",
  "Done is better than perfect. You chose done.",
  "Look at you, actually doing stuff.",
  "Your future self just nodded approvingly.",
  "Boom. Check.",
  "That task never saw you coming.",
  "One small step for you, one giant leap for your to-do list.",
  "You're a productivity machine. Ugly, messy, effective.",
  "That's called momentum. Keep it.",
  "Peasants make lists. You complete them.",
  "Another one bites the dust.",
  "You actually did it. Respect.",
  "Your excuses called. They've been fired.",
]

export const BRUTAL_TRUTHS: string[] = [
  "The average person checks their phone 96 times a day. You're not average. Prove it.",
  "You'll spend 4 years of your life on social media. What if you spent 4 minutes on this instead?",
  "Nobody remembers the person who almost finished. Get it done.",
  "Busy is not the same as productive. Stop confusing the two.",
  "Every task you avoid gets heavier, not lighter.",
  "Done ugly beats perfect never. Every. Single. Time.",
  "The gap between who you are and who you want to be is called 'later'. Stop living there.",
  "Your distraction is someone else's advantage.",
  "Future you is counting on present you. Don't be a disappointment.",
  "Motivation is a liar. Systems are honest. Build the system.",
]

export const WEIRD_NEWS: WeirdNewsStory[] = [
  {
    emoji: '🚽',
    top: 'Artemis astronauts will use a $23M space toilet',
    bottom: 'but engineers forgot the cup holder',
    source: 'NASA Tech Brief',
    url: 'https://www.nasa.gov/humans-in-space/artemis/',
  },
  {
    emoji: '🐊',
    top: 'Florida man finds 11-foot gator in his kitchen',
    bottom: 'just vibing. Gator was not charged.',
    source: 'Florida Fish & Wildlife',
    url: 'https://myfwc.com/',
  },
  {
    emoji: '🍫',
    top: 'Man steals 900 Kit-Kats from warehouse',
    bottom: 'because he needed a break. Many breaks.',
    source: 'The Guardian',
    url: 'https://www.theguardian.com/',
  },
  {
    emoji: '🦕',
    top: 'Scientists discover dinosaur with 500 teeth',
    bottom: 'and a dental plan better than yours',
    source: 'Nature Paleontology',
    url: 'https://www.nature.com/',
  },
  {
    emoji: '🎰',
    top: 'Lottery winner quits job via skywriter',
    bottom: 'over boss\'s house. Twice.',
    source: 'Reuters',
    url: 'https://www.reuters.com/',
  },
  {
    emoji: '🐦',
    top: 'Ostrich escapes zoo, leads police on 2-hour chase',
    bottom: 'cops declined to comment on top speed',
    source: 'AP News',
    url: 'https://apnews.com/',
  },
  {
    emoji: '⛪',
    top: 'Priest steals $30K in baseball cards from parish',
    bottom: 'said he was "building a prayer team"',
    source: 'Catholic Herald',
    url: 'https://catholicherald.co.uk/',
  },
  {
    emoji: '🦦',
    top: 'Sea otters using shopping carts as rafts',
    bottom: 'sustainable living, apparently',
    source: 'Marine Biology Today',
    url: 'https://www.marinebio.org/',
  },
  {
    emoji: '🧀',
    top: '3,000-year-old cheese found in Egyptian tomb',
    bottom: 'still aged better than your cheddar',
    source: 'Archaeology Magazine',
    url: 'https://www.archaeology.org/',
  },
  {
    emoji: '🐄',
    top: 'Cows in Vermont given access to Wi-Fi',
    bottom: 'productivity up 12%. Humans: still distracted.',
    source: 'Vermont Ag Report',
    url: 'https://agriculture.vermont.gov/',
  },
  {
    emoji: '🤖',
    top: 'AI hired as CEO of marketing firm',
    bottom: 'first act: cancelled all meetings. Genius.',
    source: 'Tech Crunch',
    url: 'https://techcrunch.com/',
  },
  {
    emoji: '🐑',
    top: 'Sheep breaks into bakery, eats 400 croissants',
    bottom: 'no regrets detected',
    source: 'BBC News',
    url: 'https://www.bbc.com/news',
  },
  {
    emoji: '🏔️',
    top: 'Man runs 100 miles on treadmill "for fun"',
    bottom: 'went nowhere, literally. Metaphorically.',
    source: 'Runner\'s World',
    url: 'https://www.runnersworld.com/',
  },
  {
    emoji: '🐙',
    top: 'Octopus learns to open childproof bottles',
    bottom: 'humans still cannot',
    source: 'Science Daily',
    url: 'https://www.sciencedaily.com/',
  },
  {
    emoji: '🍕',
    top: 'Pizza delivery drone crashes into wedding',
    bottom: 'couple eloped to pizza place. Happy ending.',
    source: 'Eater',
    url: 'https://www.eater.com/',
  },
  {
    emoji: '🦁',
    top: 'Lion escapes safari park, found at Taco Bell',
    bottom: 'ordered three tacos and a water cup',
    source: 'Local 12 News',
    url: 'https://local12.com/',
  },
  {
    emoji: '🧲',
    top: 'Man accidentally swallows 27 magnets',
    bottom: '"I thought they were mints," he says',
    source: 'New England Journal',
    url: 'https://www.nejm.org/',
  },
  {
    emoji: '🐝',
    top: 'Beekeeper discovers bees have learned to honk',
    bottom: 'traffic now worse in apiary districts',
    source: 'Bee Culture Magazine',
    url: 'https://www.beeculture.com/',
  },
  {
    emoji: '🎸',
    top: 'Rock band performs concert inside Costco',
    bottom: 'encores went 20 minutes. Parking was free.',
    source: 'Pitchfork',
    url: 'https://pitchfork.com/',
  },
  {
    emoji: '🚀',
    top: 'SpaceX launches world\'s first coffee vending machine into orbit',
    bottom: 'astronauts finally stop complaining',
    source: 'Space.com',
    url: 'https://www.space.com/',
  },
  {
    emoji: '🐻',
    top: 'Bear breaks into national park gift shop',
    bottom: 'only takes bear-shaped honey. No charges filed.',
    source: 'NPS',
    url: 'https://www.nps.gov/',
  },
  {
    emoji: '🌮',
    top: 'Taco Bell opens location inside DMV',
    bottom: 'wait times unchanged. Mood: improved.',
    source: 'Nation\'s Restaurant News',
    url: 'https://www.nrn.com/',
  },
  {
    emoji: '🦜',
    top: 'Parrot witnesses robbery, refuses to testify',
    bottom: '"He just kept saying \'Polly wants a lawyer\'"',
    source: 'Legal Times',
    url: 'https://www.law.com/',
  },
  {
    emoji: '🐳',
    top: 'Whale swallows GoPro, footage is incredible',
    bottom: '47 million views. Whale unavailable for comment.',
    source: 'National Geographic',
    url: 'https://www.nationalgeographic.com/',
  },
  {
    emoji: '🎩',
    top: 'Man finds $40K in thrift store hat',
    bottom: 'also found a note: "should\'ve tipped more"',
    source: 'Thrift Store Today',
    url: 'https://www.goodwill.org/',
  },
]

export const SQUIRREL_WARNINGS = [
  { emoji: '🐿️', title: 'SQUIRREL!', message: 'Your brain just spotted a shiny object. Is this really more important than your actual work?' },
  { emoji: '🕳️', title: 'RABBIT HOLE DETECTED', message: 'You are about to lose 47 minutes of your life. The algorithm designed this specifically for you.' },
  { emoji: '🧲', title: "IT'S A TRAP", message: 'This story was engineered by scientists to waste your time. Those scientists succeeded.' },
  { emoji: '🪤', title: 'CLICKBAIT ALERT', message: 'Your lizard brain is overriding your prefrontal cortex. The lizard brain wins 73% of the time.' },
  { emoji: '🌀', title: 'VORTEX INCOMING', message: 'One click leads to another. You know how this ends. You have been warned.' },
  { emoji: '🎪', title: 'WELCOME TO THE CIRCUS', message: 'Step right in! Leave your productivity at the door. Popcorn costs -1 point.' },
  { emoji: '🧠', title: 'MONKEY BRAIN WINS AGAIN', message: 'Your dopamine system is cheering. Your task list is crying. Choose wisely.' },
  { emoji: '⏰', title: 'TIME OF DEATH: NOW', message: 'This distraction will take 12 minutes minimum. You have been warned by science.' },
  { emoji: '🎰', title: 'SLOT MACHINE ACTIVATED', message: 'Weird news is gambling with your attention. The house always wins.' },
  { emoji: '🚨', title: 'DISTRACTION EMERGENCY', message: 'Code red. Your streak is in danger. Back away from the article slowly.' },
]

export const BOOK_CHAPTERS = [
  {
    id: 'intro',
    title: 'Why You Can\'t Get Anything Done',
    content: `You're not lazy. You're not broken. You're just human—and being human in the attention economy means you're fighting a war your brain wasn't designed to win.

Every app, every notification, every "just one more scroll" is engineered by teams of Ph.D.s whose only job is to make sure you never finish your actual work.

This system fights back.`,
  },
  {
    id: 'matrix',
    title: 'The Four Categories That Actually Matter',
    content: `Forget urgent vs. important. Forget Eisenhower. Here's the brutal truth about your task list:

**Need to Do It – Now (+3 pts)**: This is real. This has consequences. This needs your face on it today.

**Need to Do It – Someday (+2 pts)**: Legitimate work that isn't on fire yet. Don't let it become Now.

**Need to Do It – For Some Reason (+1 pt)**: You said you'd do it. You're not sure why. Do it anyway or kill it.

**Why Is This On My List? (-1 pt)**: This is guilt masquerading as a task. Delete it. Right now.`,
  },
  {
    id: 'frog',
    title: 'Eat the Frog (It\'s Uglier When It\'s Warm)',
    content: `Mark Twain said if you eat a live frog first thing in the morning, nothing worse will happen all day.

Your frog is that one task you've been avoiding. You know the one. It's sitting on your list wearing a tiny hat that says "I AM THE REAL WORK."

Five ugly minutes beats zero perfect ones. Start. Now. Ugly.`,
  },
  {
    id: 'squirrel',
    title: 'The Squirrel Problem',
    content: `Your brain is a distraction-seeking missile. It evolved to notice movement, novelty, and shiny things—because on the savanna, that kept you alive.

In the office, it keeps you on Reddit.

The squirrel categories aren't shame. They're documentation. "Look what I actually did while avoiding my real work." Understanding your squirrel patterns is the first step to taming them.`,
  },
  {
    id: 'streak',
    title: 'Why Streaks Work (And Why You\'re About to Break Yours)',
    content: `A streak isn't about perfection. It's about momentum.

Every day you complete at least one meaningful task, you're building evidence that you're the kind of person who gets shit done. That evidence compounds.

Miss a day? The streak resets, not your identity. Get back up.`,
  },
  {
    id: 'reset',
    title: 'The Weekly Reset Ritual',
    content: `Every week, you face three choices for unfinished tasks:

**Keep**: This is still real. It still matters.
**Reschedule**: Life happened. Move it forward honestly.
**Kill**: This was never real. Honor the clarity.

A task that survives three resets without moving isn't a task. It's a guilt souvenir. Kill it with fire.`,
  },
]
