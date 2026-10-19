const ICONS = {
  folderClosed: `<svg viewBox="0 0 24 24" width="20" height="20" fill="currentColor" class="folder-closed" aria-hidden="true"><path d="M10 4H4C2.9 4 2 4.9 2 6V18C2 19.1 2.9 20 4 20H20C21.1 20 22 19.1 22 18V8C22 6.9 21.1 6 20 6H12L10 4Z"/></svg>`,
  folderOpen: `<svg viewBox="0 0 24 24" width="20" height="20" fill="currentColor" class="folder-open" aria-hidden="true"><path d="M19 20H4C2.9 20 2 19.1 2 18V6C2 4.9 2.9 4 4 4H10L12 6H20C21.1 6 22 6.9 22 8V11H4V18L5.5 12H22L20.2 18.4C20 19.3 19.2 20 19 20Z"/></svg>`,
  file: `<svg viewBox="0 0 24 24" width="20" height="20" fill="currentColor" aria-hidden="true"><path d="M14 2H6C4.9 2 4 2.9 4 4V20C4 21.1 4.9 22 6 22H18C19.1 22 20 21.1 20 20V8L14 2ZM18 20H6V4H13V9H18V20Z"/></svg>`,
  info: `<svg viewBox="0 0 24 24" width="18" height="18" fill="currentColor" aria-hidden="true"><path d="M12 2C6.48 2 2 6.48 2 12S6.48 22 12 22 22 17.52 22 12 17.52 2 12 2ZM13 17H11V11H13V17ZM13 9H11V7H13V9Z"/></svg>`,
  play: `<svg viewBox="0 0 24 24" width="20" height="20" fill="currentColor" aria-hidden="true"><path d="M8 5V19L19 12L8 5Z"/></svg>`,
  pause: `<svg viewBox="0 0 24 24" width="20" height="20" fill="currentColor" aria-hidden="true"><path d="M6 5H10V19H6V5ZM14 5H18V19H14V5Z"/></svg>`,
  mute: `<svg viewBox="0 0 24 24" width="20" height="20" fill="currentColor" aria-hidden="true"><path d="M16.5 12C16.5 10.2 15.5 8.7 14 7.9V16C15.5 15.3 16.5 13.8 16.5 12ZM4 9V15H8L13 20V4L8 9H4ZM19.1 12L21 13.9L19.9 15L18 13.1L16.1 15L15 13.9L16.9 12L15 10.1L16.1 9L18 10.9L19.9 9L21 10.1L19.1 12Z"/></svg>`,
  unmute: `<svg viewBox="0 0 24 24" width="20" height="20" fill="currentColor" aria-hidden="true"><path d="M3 9V15H7L12 20V4L7 9H3ZM16.5 12C16.5 10.2 15.5 8.7 14 7.9V16.1C15.5 15.3 16.5 13.8 16.5 12ZM14 3.2V5.2C16.9 6 19 8.7 19 12C19 15.3 16.9 18 14 18.8V20.8C18 19.9 21 16.3 21 12C21 7.7 18 4.1 14 3.2Z"/></svg>`,
  x: `<svg viewBox="0 0 24 24" width="20" height="20" fill="currentColor" aria-hidden="true"><path d="M18.244 2.25H21.552L14.325 10.51L22.827 21.75H16.17L10.956 14.934L4.99 21.75H1.68L9.41 12.915L1.254 2.25H8.08L12.793 8.481L18.244 2.25ZM17.083 19.77H18.916L7.084 4.126H5.117L17.083 19.77Z"/></svg>`,
  ig: `<svg viewBox="0 0 24 24" width="20" height="20" fill="currentColor" aria-hidden="true"><path d="M7 2H17C19.8 2 22 4.2 22 7V17C22 19.8 19.8 22 17 22H7C4.2 22 2 19.8 2 17V7C2 4.2 4.2 2 7 2ZM12 7C9.2 7 7 9.2 7 12C7 14.8 9.2 17 12 17C14.8 17 17 14.8 17 12C17 9.2 14.8 7 12 7ZM18.5 5.5C17.7 5.5 17 6.2 17 7C17 7.8 17.7 8.5 18.5 8.5C19.3 8.5 20 7.8 20 7C20 6.2 19.3 5.5 18.5 5.5ZM12 9C13.7 9 15 10.3 15 12C15 13.7 13.7 15 12 15C10.3 15 9 13.7 9 12C9 10.3 10.3 9 12 9Z"/></svg>`,
  gh: `<svg viewBox="0 0 24 24" width="20" height="20" fill="currentColor" aria-hidden="true"><path d="M12 2C6.5 2 2 6.6 2 12.2C2 16.7 4.9 20.5 9 21.8C9.5 21.9 9.7 21.6 9.7 21.3V19.5C6.7 20.2 6.1 18.2 6.1 18.2C5.6 17 4.9 16.7 4.9 16.7C3.9 16 5 16 5 16C6.1 16.1 6.7 17.1 6.7 17.1C7.7 18.8 9.3 18.3 9.7 18C9.8 17.3 10.1 16.8 10.4 16.5C7.9 16.2 5.3 15.3 5.3 11.5C5.3 10.4 5.7 9.5 6.7 8.7C6.6 8.4 6.2 7.3 6.8 5.9C6.8 5.9 7.7 5.6 9.7 7C10.6 6.8 11.5 6.6 12.4 6.6C13.3 6.6 14.2 6.8 15.1 7C17.1 5.6 18 5.9 18 5.9C18.6 7.3 18.2 8.4 18.1 8.7C19.1 9.5 19.5 10.4 19.5 11.5C19.5 15.3 16.9 16.2 14.4 16.5C14.8 16.9 15.2 17.6 15.2 18.7V21.3C15.2 21.6 15.4 21.9 15.9 21.8C20 20.5 22.9 16.7 22.9 12.2C23 6.6 18.5 2 12 2Z"/></svg>`,
};

const TREE = [
  {
    id: "works",
    label: "Works",
    children: [
      { id: "odyssey", label: "Odyssey" },
      { id: "deximal", label: "Deximal" },
      { id: "life", label: "Life" },
      { id: "siphon", label: "Siphon" },
      { id: "streamius", label: "Streamius" },
      { id: "labs", label: "Labs" },
    ],
  },
  {
    id: "artifacts",
    label: "Artifacts",
    children: [
      { id: "aeons", label: "Aeons" },
      { id: "anti", label: "Anti" },
      { id: "based", label: "Based" },
      { id: "checks", label: "Checks" },
      { id: "editions", label: "Editions" },
    ],
  },
  {
    id: "notes",
    label: "Notes",
    children: [
      { id: "100", label: "100 Simple Truths" },
      { id: "6", label: "Six figures in 6 days" },
      { id: "music", label: "Your Music & People" },
      { id: "system", label: "SYSTEM.md" },
    ],
  },
  {
    id: "sounds",
    label: "Sounds",
    children: [
      { id: "lofi", label: "Lofi" },
      { id: "soul", label: "Soul" },
      { id: "ambient", label: "Ambient" },
    ],
  },
  {
    id: "links",
    label: "links",
    children: [
      { id: "x", label: "x.com", href: "https://x.com/traf", external: true, icon: "x" },
      { id: "ig", label: "Instagram", href: "https://instagram.com/traf", external: true, icon: "ig" },
      { id: "gh", label: "GitHub", href: "https://github.com/traf", external: true, icon: "gh" },
    ],
  },
];

const PAGES = {
  odyssey: {
    folder: "works",
    title: "Odyssey",
    crumb: "Odyssey",
    about: `Unofficial mac app for <a href="https://cosmos.so" target="_blank" rel="noopener noreferrer">[Cosmos]</a>`,
    cta: { href: "https://odyssey-hq.vercel.app/", label: "View app" },
    media: [
      { type: "video", src: "https://tr.af/works/odyssey-0.mp4", poster: "assets/works/odyssey-0.poster.jpg", wide: true },
      { type: "image", src: "assets/works/odyssey-1.jpg", wide: true },
      { type: "image", src: "assets/works/odyssey-2.jpg", wide: true },
      { type: "image", src: "assets/works/odyssey-3.jpg", wide: true },
      { type: "image", src: "assets/works/odyssey-4.jpg", wide: true },
    ],
  },
  deximal: {
    folder: "works",
    title: "Deximal",
    crumb: "Deximal",
    about: "Personal wallet app · Unreleased private beta · Native iOS app",
    cta: { href: "https://deximal.com", label: "deximal.com" },
    media: [
      { type: "image", src: "assets/works/deximal-1.png" },
      { type: "image", src: "assets/works/deximal-2.png" },
      { type: "image", src: "assets/works/deximal-3.png" },
      { type: "image", src: "assets/works/deximal-4.png" },
      { type: "image", src: "assets/works/deximal-5.png" },
      { type: "image", src: "assets/works/deximal-6.png" },
    ],
  },
  life: {
    folder: "works",
    title: "Life",
    crumb: "Life",
    about: "Life tracking app",
    cta: { href: "https://lifeapp.so", label: "lifeapp.so" },
    media: [
      { type: "image", src: "assets/works/life-1.jpg", wide: true },
      { type: "image", src: "assets/works/life-2.jpg" },
      { type: "image", src: "assets/works/life-3.jpg" },
      { type: "image", src: "assets/works/life-4.jpg" },
      { type: "image", src: "assets/works/life-5.jpg", wide: true },
    ],
  },
  siphon: {
    folder: "works",
    title: "Siphon",
    crumb: "Siphon",
    about: "Intent-based trading interface · Trade tokens, stocks & commodities · Built on top of Hyperliquid",
    cta: { href: "https://siphon.sh", label: "siphon.sh" },
    media: [
      { type: "video", src: "https://tr.af/works/siphon-1.mp4", poster: "assets/works/siphon-1.poster.jpg", wide: true },
      { type: "image", src: "assets/works/siphon-2.jpg" },
      { type: "image", src: "assets/works/siphon-3.jpg" },
      { type: "image", src: "assets/works/siphon-4.jpg" },
      { type: "image", src: "assets/works/siphon-5.jpg" },
      { type: "image", src: "assets/works/siphon-6.jpg" },
    ],
  },
  streamius: {
    folder: "works",
    title: "Streamius",
    crumb: "Streamius",
    about: "Your media collection in one place · Save movies, series, books & games",
    cta: { href: "https://streamius.com", label: "streamius.com" },
    media: [
      { type: "video", src: "https://tr.af/works/streamius-1.mp4", poster: "assets/works/streamius-1.poster.jpg", wide: true },
      { type: "image", src: "assets/works/streamius-2.jpg" },
      { type: "image", src: "assets/works/streamius-3.jpg" },
      { type: "image", src: "assets/works/streamius-4.jpg" },
      { type: "image", src: "assets/works/streamius-5.jpg" },
      { type: "image", src: "assets/works/streamius-6.jpg" },
    ],
  },
  labs: {
    folder: "works",
    title: "Labs",
    crumb: "Labs",
    about: "Various works & experiments",
    cta: { href: "https://x.com/traf", label: "@traf" },
    media: [
      { type: "video", src: "https://tr.af/works/labs-1.mp4", poster: "assets/works/labs-1.poster.jpg", wide: true },
      { type: "image", src: "assets/works/labs-2.jpg" },
      { type: "image", src: "assets/works/labs-3.jpg" },
      { type: "image", src: "assets/works/labs-4.jpg" },
      { type: "image", src: "assets/works/labs-5.jpg" },
      { type: "image", src: "assets/works/labs-6.jpg" },
      { type: "image", src: "assets/works/labs-7.jpg" },
    ],
  },
  aeons: {
    folder: "artifacts",
    title: "Aeons",
    crumb: "Aeons",
    about: `Ephemeral NFT collection on Base · Built w/ Tom`,
    cta: { href: "https://aeons.xyz", label: "aeons.xyz" },
  },
  anti: {
    folder: "artifacts",
    title: "Anti",
    crumb: "Anti",
    about: "Future artifact systems · 888 cybernetic agents",
    cta: { href: "https://opensea.io/collection/antigens", label: "View on OpenSea" },
  },
  based: {
    folder: "artifacts",
    title: "Based",
    crumb: "Based",
    about: "Collections of art on Base (Ethereum L2) · Built w/ Tom & displaydriver",
    cta: { href: "https://opensea.io/based/created", label: "opensea.io/based" },
  },
  checks: {
    folder: "artifacts",
    title: "Checks",
    crumb: "Checks",
    about: "Checks art project",
    cta: { href: "https://checks.art", label: "checks.art" },
  },
  editions: {
    folder: "artifacts",
    title: "Editions",
    crumb: "Editions",
    about: "Edition releases and drops",
    cta: { href: "https://x.com/traf", label: "@traf" },
  },
  "100": {
    folder: "notes",
    title: "100 Simple Truths",
    crumb: "100.md",
    note: true,
  },
  "6": {
    folder: "notes",
    title: "Six figures in 6 days",
    crumb: "6.md",
    note: true,
  },
  music: {
    folder: "notes",
    title: "Your Music & People",
    crumb: "music.md",
    note: true,
  },
  system: {
    folder: "notes",
    title: "SYSTEM.md",
    crumb: "system.md",
    note: true,
  },
  lofi: {
    folder: "sounds",
    title: "Lofi",
    crumb: "Lofi",
    about: "Lofi listening room",
    cta: { href: "https://x.com/traf", label: "@traf" },
  },
  soul: {
    folder: "sounds",
    title: "Soul",
    crumb: "Soul",
    about: "Soul listening room",
    cta: { href: "https://x.com/traf", label: "@traf" },
  },
  ambient: {
    folder: "sounds",
    title: "Ambient",
    crumb: "Ambient",
    about: "Ambient listening room",
    cta: { href: "https://x.com/traf", label: "@traf" },
  },
};

const NOTE_HTML = {
  "100": "<h1>100 Simple Truths</h1>\n<p class=\"meta\">2021-07-26</p>\n<p>It\u2019s 100% off if you don\u2019t buy it.</p>\n<p>Not wanting something is as good as having it.</p>\n<p>Someone else\u2019s success isn\u2019t your failure.</p>\n<p>A question opens the mind, a statement keeps it closed.</p>\n<p>Time spent on things you can't control takes time away from things you can.</p>\n<p>Being creative is just combining interest with initiative.</p>\n<p>Success, like happiness, cannot be pursued. It must ensue.</p>\n<p>Value compliments and insults the same.</p>\n<p>Consuming information won't make you smart, applying it will.</p>\n<p>Be happy with what you have, while you work for what you want.</p>\n<p>Life is too short to not be pursuing the best opportunity you know of.</p>\n<p>Inspiration is a productivity multiplier, but it\u2019s perishable. Act quickly.</p>\n<p>Minimalism isn't about owning nothing, it\u2019s about nothing owning you.</p>\n<p>Demotivated because of how long it takes? The time will pass anyways.</p>\n<p>People don't care what you can do, they care about what you can do for them.</p>\n<p>How much you eat affects your size, how much you move affects your shape.</p>\n<p>Not having the time for it is another way of saying it\u2019s not important.</p>\n<p>Choose consistency over intensity, because consistency compounds.</p>\n<p>Most traditions are solutions to forgotten problems.</p>\n<p>You were born in one day, you will die in one day, you can change in one day.</p>\n<p>Yesterday is gone, tomorrow isn't promised, today is all there is.</p>\n<p>Focus on nothing when it doesn\u2019t matter, so you\u2019ll focus better when it does.</p>\n<p>More choices often lead to less action. Do more by doing less.</p>\n<p>It\u2019s not the thing itself that upsets you, but your interpretation of it.</p>\n<p>Focus is repeatedly saying no to almost everything.</p>\n<p>You can either build your dream, or help someone build theirs.</p>\n<p>Stop trading time for money, start trading value for money.</p>\n<p>Learning how to learn is one of the best investments of your time.</p>\n<p>Your circumstances have nothing to do with your emotional state.</p>\n<p>Discipline is choosing between what you want now and what you want most.</p>\n<p>The real value of money is what you can afford to no longer do.</p>\n<p>If you lower your expectations, you\u2019ll rarely be disappointed.</p>\n<p>Creativity is an infinite resource\u2014the more you spend, the more you have.</p>\n<p>Every 'no' improves your ability to fulfill on a future yes.</p>\n<p>The gap between where you are and where you want to be is closer than you think.</p>\n<p>Your ideas are worth nothing without the will to act on them.</p>\n<p>Be interesting to others by being interested in them.</p>\n<p>Every single person you meet knows something you don\u2019t.</p>\n<p>Speak when you have something to say, not when you want to say something.</p>\n<p>Mediocrity is the path of least resistance, also making it the most competitive.</p>\n<p>Being busy is not a badge of honor\u2014it's a lack of freedom.</p>\n<p>Your thoughts and feelings are choices. Control them or they'll control you.</p>\n<p>You don't lack motivation, you lack a better reason.</p>\n<p>Time is your most valuable resource, spend it wisely.</p>\n<p>Admit when you\u2019re wrong, show humility when you\u2019re right.</p>\n<p>Your brain doesn\u2019t fill up with more information, it expands along with it.</p>\n<p>If it takes less than 5 minutes, don\u2019t schedule it, do it now.</p>\n<p>Your biggest competitor in life is yourself.</p>\n<p>Life only gives you what you decided you could have.</p>\n<p>The internet removes the barrier from how much you can learn about anything.</p>\n<p>Ignore the noise, people will criticize you no matter what you do.</p>\n<p>Avoiding stupidity can often be a better strategy than seeking out brilliance.</p>\n<p>If you have time to consume, you have time to create.</p>\n<p>There\u2019s no right or wrong time, there\u2019s just time and what you choose to do with it.</p>\n<p>You can steal all the ideas you want, but action can only come from within.</p>\n<p>Get comfortable with changing your mind after learning new information.</p>\n<p>Food fuels your brain, information fuels your mind. You are what you consume.</p>\n<p>Read to find new ideas, write to understand them, implement to learn from them.</p>\n<p>Your current habits are a sneak peek of your desired future.</p>\n<p>The best teachers are your previous mistakes.</p>\n<p>Working hard doesn\u2019t get you anywhere if you\u2019re working on the wrong thing.</p>\n<p>Being alone is physical, feeling alone is mental.</p>\n<p>Silence is a blank canvas for your thoughts.</p>\n<p>If it doesn't feel like work, no one can compete with you.</p>\n<p>Compare upwards and feel envy, compare downwards and feel grateful.</p>\n<p>You are not what you say or think, you are what you do.</p>\n<p>There are no million dollar ideas, only million dollar executions.</p>\n<p>What you believe is what you settle for.</p>\n<p>Saying yes benefits others, saying no benefits you.</p>\n<p>The quality of your mind determines the quality of your life.</p>\n<p>Being great is just being consistently good.</p>\n<p>Spending time on things that buy you time is always a good use of it.</p>\n<p>The dots only connect in retrospect.</p>\n<p>Consuming puts you to work for the internet, creating puts the internet to work for you.</p>\n<p>Hours don't equal output.</p>\n<p>Luck favors those in motion.</p>\n<p>The only difference between creators & consumers is the willingness to publish.</p>\n<p>If you never get bored of learning, you'll never get tired of living.</p>\n<p>The more you move, the easier it is to keep moving.</p>\n<p>The only productivity hack you need is enjoying what you do.</p>\n<p>How you do anything, is how you do everything.</p>\n<p>Beliefs are more about belonging than they are about truth.</p>\n<p>Continuous improvement is better than delayed perfection.</p>\n<p>Do many things that you like to find the few things that you love.</p>\n<p>Your first impression isn\u2019t your appearance, it\u2019s your energy.</p>\n<p>You're not bad at something, you're just new to it.</p>\n<p>Death is the price we pay for life, learn to make peace with it.</p>\n<p>The sooner you pay the price, the less it will cost you in the long run.</p>\n<p>Motivation more often comes after starting, not before.</p>\n<p>Integrity is being the same person no matter the circumstance.</p>\n<p>Increase your rate of success by increasing your rate of failure.</p>\n<p>The cost of anything in life is either money, time, or attention.</p>\n<p>Discipline is doing what you hate to do as if you love it.</p>\n<p>The less you have to work with, the more you'll do with what you have.</p>\n<p>Absorb what's useful, discard what isn't, add what's uniquely yours.</p>\n<p>Most bad things in life come from too much or too little of any one thing.</p>\n<p>If you\u2019re reading this, you have everything you need to start.</p>\n<p>Peace is the absence of desire.</p>\n<p>No one owes you anything.</p>\n<p>(self.__next_f=self.__next_f||[]).push([0])</p>\n<p>self.__next_f.push([1,\"11:[]\\\\nb:\\\\\"$W11\\\\\"\\\\n\"])</p>\n<p>self.__next_f.push([1,\"15:T6cc,\"])</p>\n<p>self.__next_f.push([1,\"1a:T717,\"])</p>\n<p>self.__next_f.push([1,\"1d:T717,\"])</p>\n<p>self.__next_f.push([1,\"1f:T726,\"])</p>\n<p>self.__next_f.push([1,\"d:[[\\\\\"$\\\\\",\\\\\"meta\\\\\",\\\\\"0\\\\\",{\\\\\"charSet\\\\\":\\\\\"utf-8\\\\\"}],[\\\\\"$\\\\\",\\\\\"meta\\\\\",\\\\\"1\\\\\",{\\\\\"name\\\\\":\\\\\"viewport\\\\\",\\\\\"content\\\\\":\\\\\"width=device-width, initial-scale=1\\\\\"}]]\\\\n\"])</p>\n<p>self.__next_f.push([1,\"2e:I[27201,[\\\\\"/_next/static/chunks/2unz48i6dus1f.js?dpl=dpl_EQF46CTCvQDheZE42mhG6BGFbfh7\\\\\",\\\\\"/_next/static/chunks/14mrh2-p_w84d.js?dpl=dpl_EQF46CTCvQDheZE42mhG6BGFbfh7\\\\\"],\\\\\"IconMark\\\\\"]\\\\na:null\\\\n\"])</p>",
  "6": "<h1>Six figures in 6 days</h1>\n<p class=\"meta\">2020-09-30</p>\n<p>This title is a little misleading.</p>\n<p>Sure, it took me 6 days to amass 3,626 sales for a total of $101,528, but like any overnight success, it was years in the making. In my case, about 7 years.</p>\n<p>In 2013, the jailbreaking days of iOS were in full effect. Inspired, I created and sold an icon set titled 'Greyish HD' on the Cydia store for $0.99. It was the first few dollars I ever made on the internet. I think I made a total of $17, and it was magical.</p>\n<p>create something once with sufficient effort, then sell it repeatedly with minimal effort.</p>\n<p>Fast forward 7 years later, minus 6 days. I saw some people sharing screenshots of their iPhones after discovering that iOS 14 now allows you to add custom icons to your home screen using the Siri Shortcuts app. This was the first time you can sorta customize iOS, and it was catching on quick.</p>\n<p>This is something people have been doing for years on jailbroken iOS and Android devices, except this time, you can do it natively on iOS.</p>\n<p>, and embedded them on a</p>\n<p>site using</p>\n<p>. All of this took just a few hours.</p>\n<p>The next day, the tweet had hundreds of retweets, thousands of likes, and over 100k impressions. The day after that, almost a million. The next thing I knew, it was everywhere. My icons got published on notable tech sites like</p>\n<p>Cult of Mac</p>\n<p>Creative Bloq</p>\n<p>, and plenty more. I think at this time I was around the $6k mark in sales.</p>\n<p>Then, MKBHD happened. He shared a</p>\n<p>about all of this\u2014using my icons for his setup, and linked them in the description. The next thing I knew, I was making $28 what felt like every 28 seconds. My phone turned into the ultimate dopamine dispenser (if it wasn't already). I had to disable notifications.</p>\n<p>The day after, sales jumped from $6k to about $40k, and during the time of this writing, sales are at $116,147 from 4,188 customers.</p>\n<p>All from one. Single.</p>\n<p>The right content, posted at the right time, can create unimaginable results. Although there's likely plenty of other variables that went into making this work, there are a few key insights that increased my odds.</p>\n<p>Publish often</p>\n<p>Continually putting things out into the world creates proof of work. The difference between where you are and where you want to be could be as little as sharing what you build, or even what you know.</p>\n<p>Act immediately</p>\n<p>I could have easily ignored the requests for the icons, or directed people to icon sets that already existed, but that would be a missed opportunity. Since I've done similar icon sets so many times already in the past, I was ready for it. Acting quickly is crucial if you plan on riding the wave.</p>\n<p>Be Transparent</p>\n<p>this tweet</p>\n<p>the day after posting my home screen with details of all the hype, and it created even more hype. It brought another 600k impressions and added fuel to an already growing fire.</p>\n<p>Share what works, and share what doesn't.</p>\n<p>Transparency is visibility.</p>\n<p>Have a clear schedule</p>\n<p>Charge more</p>\n<p>Do it for the art</p>\n<p>So what came of all this? I suspect this is why most of you are here reading this, so here's a recap of everything that came from last week in numbers, from the time of this writing:</p>\n<p>Metrics, 1 week in:</p>\n<p>4,188 total icon sales</p>\n<p>$116,147 in revenue</p>",
  "music": "<h1>Your Music & People</h1>\n<p class=\"meta\">2020-01-15</p>\n<p>10 timeless insights from</p>\n<p>Your Music and People</p>\n<p>Derek Sivers</p>\n<p>1/ Marketing is an extension of your art</p>\n<p>The way you present something is just as important as what you present. The former will influence how people perceive the latter.</p>\n<p>2/ Everything you do is a test</p>\n<p>The entire process of creating something is all an experiment. It's impossible to fail if your only goal was to see what happens.</p>\n<p>3/ Restrictions set you free</p>\n<p>Feeling stuck? Set yourself some creative limitations. The more specific the constraints, the easier they'll be to fulfill on.</p>\n<p>4/ Proudly alienate</p>\n<p>Your art isn't for everyone. Deliberately exclude anyone who isn't your ideal customer. Rejecting the 99% will connect you better to the 1%.</p>\n<p>5/ Show who you are</p>\n<p>We're all different, only some of us show it. Define who you are, then declare it over and over again. Embed parts of your personality and philosophy into your business.</p>\n<p>6/ Stay small</p>\n<p>People are turned away by bland personalities and corporate speech. Let others be everything to everyone, you focus on being something to someone. Take pride in saying 'I' instead of 'we'.</p>\n<p>7/ Put people to work</p>\n<p>People love doing favors. It gives them a sense of importance and meaning. Don't be afraid to ask people what you need. Most are happy to help.</p>\n<p>8/ Success isn't destiny</p>\n<p>You're pulled to success by those around you. The more effectively you provide value to others, the more they'll reciprocate. Acknowledge their importance, and bring them along for the ride.</p>\n<p>9/ Focus on the fundamentals</p>\n<p>No one knows the future, so forget trying to predict it. Focus on the fundamentals, or what doesn't change in your business. Be stubborn with your vision, but flexible with the details.</p>\n<p>10/ Good advice excites you</p>\n<p>Differentiate good vs bad advice by how you react to it. Advice can either make you feel drained and uninspired, or excited and energetic. Ignore the former, act on the latter.</p>\n<p>(self.__next_f=self.__next_f||[]).push([0])</p>\n<p>self.__next_f.push([1,\"11:[]\\\\nb:\\\\\"$W11\\\\\"\\\\n\"])</p>\n<p>self.__next_f.push([1,\"15:T6cc,\"])</p>\n<p>self.__next_f.push([1,\"1a:T717,\"])</p>\n<p>self.__next_f.push([1,\"1d:T717,\"])</p>\n<p>self.__next_f.push([1,\"1f:T726,\"])</p>\n<p>self.__next_f.push([1,\"d:[[\\\\\"$\\\\\",\\\\\"meta\\\\\",\\\\\"0\\\\\",{\\\\\"charSet\\\\\":\\\\\"utf-8\\\\\"}],[\\\\\"$\\\\\",\\\\\"meta\\\\\",\\\\\"1\\\\\",{\\\\\"name\\\\\":\\\\\"viewport\\\\\",\\\\\"content\\\\\":\\\\\"width=device-width, initial-scale=1\\\\\"}]]\\\\n\"])</p>\n<p>self.__next_f.push([1,\"2e:I[27201,[\\\\\"/_next/static/chunks/2unz48i6dus1f.js?dpl=dpl_EQF46CTCvQDheZE42mhG6BGFbfh7\\\\\",\\\\\"/_next/static/chunks/14mrh2-p_w84d.js?dpl=dpl_EQF46CTCvQDheZE42mhG6BGFbfh7\\\\\"],\\\\\"IconMark\\\\\"]\\\\na:null\\\\n\"])</p>",
  "system": "<h1>SYSTEM.md</h1>\n<p class=\"meta\">2026-10-08</p>\n<p>Personal defaults for working with agents.</p>\n<p>Follow the existing design system. Without one, start with monochrome, clear contrast, and a subtle accent</p>\n<p>Keep names, appearance, and behavior consistent across screens and platforms. Respect native conventions; let each page's purpose guide its layout</p>\n<p>Use shared tokens for color, type, spacing, size, corners, and motion. Prefer built-in scales over arbitrary values</p>\n<p>Keep a clear hierarchy and only the actions people need. Skip decorative panels and unnecessary controls</p>\n<p>Define shared text styles by role. Don't override size, weight, tracking, or line height locally</p>\n<p>For a new design system, use few sizes and weights with clear size differences. Keep headings strong and body text quiet</p>\n<p>when existing project or native components don't cover the need. Add reusable components and improvements back to the library</p>\n<p>Keep existing or native icon sets. Otherwise use</p>\n<p>through a shared component. Match stroke, corners, optical size, and text color; don't mix sets or draw replacements</p>\n<p>Use the same treatment for matching surfaces, including glass. Avoid double borders; use smaller inner corner radii to keep gaps even</p>\n<p>Apply themes to sheets, menus, native controls, and browser UI. No initial flash or transitions when switching</p>\n<p>Prefer interactive demos. Reuse real product components and framing in demos, previews, and shared images</p>\n<p>Compress media and serve appropriate sizes without noticeable quality loss. Archive originals outside the repo; keep only assets the project uses</p>\n<p>Load visible media first; defer the rest. Prefer video to GIFs, with pause controls and a still image for reduced motion</p>\n<p>Define gutters, headers, scrolling, and footers in shared layouts. Leave room for fixed controls and safe areas</p>\n<p>Keep text columns readable; give tables, charts, and demos the width they need</p>\n<p>No layout shifts. Reserve media and loading space; preserve size, position, spacing, and type across states</p>\n<p>Give sections generous spacing and keep related elements close. Remove spacing left by deleted content</p>\n<p>Match control heights and baselines. Tabs and paired action buttons share equal widths; standalone controls fit content, sidebar controls fill their column</p>\n<p>Align headings, text, and actions across columns. Keep alignment with wrapped text, empty screens, and dense content</p>\n<p>Keep button labels on one line with room around text and icons. Correct alignment by eye</p>\n<p>Fit dialogs to their content. Keep them within the viewport and scroll any overflow</p>\n<p>Reflow on small screens; don't shrink type or clip controls. Wrap choices or use dropdowns; sideways scrolling is for media</p>\n<p>Make interactive rows clickable edge to edge, including padding. Give small icons comfortable hit areas</p>\n<p>Prefer native controls. Preserve editing, selection, gestures, and keyboard shortcuts when customizing them</p>\n<p>Provide buttons and keyboard controls for drag and swipe actions</p>\n<p>Reuse shared components for appearance and behavior: loading, clearing, copying, disabled states</p>\n<p>Use tabs for a few choices, dropdowns for longer lists. Skip single-option selectors and unnecessary steps</p>\n<p>Keep menus on-screen and above surrounding content. Scroll long lists within a maximum height</p>\n<p>Menu triggers toggle and stay active while open. Support keyboard navigation, Escape, and outside dismissal</p>\n<p>Replace default browser focus rings with subtle styles that match the UI. Keep input and keyboard focus clear</p>\n<p>Don't hide focused controls behind overlays. Return focus to the opening control when dialogs close</p>\n<p>Inputs use consistent labels and spacing, useful placeholders, appropriate keyboards, and built-in clear, paste, or copy actions</p>\n<p>Show errors beside fields. On submit, focus the first invalid field. Don't block typing during validation</p>\n<p>Place decorative input icons, prefixes, and suffixes inside the field with matching padding; clicking them focuses the input</p>\n<p>Autofocus clear input flows, not mobile browsing. Keep paste, autofill, OTP suggestions, and zoom working</p>\n<p>Make hover and press visible but subtle. Label icon controls; don't rely on color alone or make noninteractive elements look clickable</p>\n<p>Style text selection, carets, and placeholders to match the UI. Use pointer cursors only for clickable elements</p>\n<p>Keep control labels unselectable; content and inputs stay selectable</p>\n<p>Show loading states where the content belongs. Use skeletons in place of missing content; don't add extra loaders or temporary layouts</p>\n<p>Skip loaders for quick responses. Never delay a result to show one</p>\n<p>Keep content during refresh and drafts after errors. Preserve focus, selection, and scroll unless the action changes them</p>\n<p>Clear account data when switching accounts</p>",

};

const folderLabel = {
  works: "Works",
  artifacts: "Artifacts",
  notes: "Notes",
  sounds: "Sounds",
  links: "links",
};

const el = {
  finder: document.getElementById("finder"),
  tree: document.getElementById("file-tree"),
  breadcrumb: document.getElementById("breadcrumb"),
  content: document.getElementById("content"),
  menuToggle: document.getElementById("menu-toggle"),
  privacy: document.getElementById("privacy-btn"),
};

function renderTree(activeId) {
  el.tree.innerHTML = TREE.map((folder) => {
    const open = folder.children.some((c) => c.id === activeId) || folder.id === "works";
    const kids = folder.children
      .map((child) => {
        if (child.external) {
          return `<a class="sidebar-row" href="${child.href}" target="_blank" rel="noopener noreferrer" title="@traf">${ICONS[child.icon] || ICONS.file}<span>${child.label}</span></a>`;
        }
        const current = child.id === activeId ? ' aria-current="page"' : "";
        return `<a class="sidebar-row" href="#/${child.id}"${current}>${ICONS.file}<span>${child.label}</span></a>`;
      })
      .join("");
    return `<details class="folder" ${open ? "open" : ""}>
      <summary>${ICONS.folderClosed}${ICONS.folderOpen}<span>${folder.label}</span></summary>
      <div class="folder-body">${kids}</div>
    </details>`;
  }).join("");
}

function mediaHtml(items) {
  if (!items?.length) return "";
  return `<div class="media-grid">${items
    .map((item, i) => {
      const wide = item.wide ? " wide" : "";
      if (item.type === "video") {
        return `<div class="media-frame${wide}">
          <video src="${item.src}" poster="${item.poster || ""}" muted loop playsinline preload="metadata" data-video></video>
          <div class="video-controls">
            <button type="button" data-play aria-label="Play video">${ICONS.play}</button>
            <button type="button" data-mute aria-label="Unmute video" aria-pressed="false">${ICONS.mute}</button>
          </div>
        </div>`;
      }
      return `<div class="media-frame${wide}"><img src="${item.src}" alt="" loading="${i < 2 ? "eager" : "lazy"}" draggable="false"></div>`;
    })
    .join("")}</div>`;
}

function renderPage(id) {
  const page = PAGES[id] || PAGES.odyssey;
  const route = PAGES[id] ? id : "odyssey";
  document.title = `Traf`;
  renderTree(route);

  const folder = folderLabel[page.folder] || "Works";
  const aboutBtn = page.about
    ? `<button type="button" class="about-btn" id="about-btn" aria-label="About ${page.title}" aria-expanded="false">${ICONS.info}</button>
       <div class="about-pop" id="about-pop">${page.about}</div>`
    : "";
  const cta = page.cta
    ? `<a class="cta" href="${page.cta.href}" target="_blank" rel="noopener noreferrer">[${page.cta.label}]</a>`
    : "";

  el.breadcrumb.innerHTML = `
    <a class="crumb-root" href="#/">traf</a>
    <span class="sep crumb-root" aria-hidden="true">/</span>
    <a href="#/${page.folder === "works" ? "odyssey" : route}">${folder}</a>
    <span class="sep" aria-hidden="true">/</span>
    <a href="#/${route}" aria-current="page">${page.crumb}</a>
    ${aboutBtn}
    ${cta}
  `;

  if (page.note) {
    el.content.innerHTML = `<article class="note">${NOTE_HTML[route] || `<h1>${page.title}</h1>`}</article>`;
  } else if (page.media?.length) {
    el.content.innerHTML = `<h1 class="sr-only">${page.title}</h1>${mediaHtml(page.media)}`;
  } else {
    el.content.innerHTML = `<div class="empty-panel"><h1>${page.title}</h1><p>${page.about || ""}</p>${
      page.cta ? `<p><a href="${page.cta.href}" target="_blank" rel="noopener noreferrer">[${page.cta.label}]</a></p>` : ""
    }</div>`;
  }

  wireAbout();
  wireVideos();
  closeMobileMenu();
}

function wireAbout() {
  const btn = document.getElementById("about-btn");
  const pop = document.getElementById("about-pop");
  if (!btn || !pop) return;
  btn.addEventListener("click", (e) => {
    e.stopPropagation();
    const open = !pop.classList.contains("open");
    pop.classList.toggle("open", open);
    btn.setAttribute("aria-expanded", String(open));
  });
  document.addEventListener("click", (e) => {
    if (!pop.classList.contains("open")) return;
    if (pop.contains(e.target) || btn.contains(e.target)) return;
    pop.classList.remove("open");
    btn.setAttribute("aria-expanded", "false");
  }, { once: true });
}

function wireVideos() {
  el.content.querySelectorAll(".media-frame").forEach((frame) => {
    const video = frame.querySelector("video[data-video]");
    if (!video) return;
    const playBtn = frame.querySelector("[data-play]");
    const muteBtn = frame.querySelector("[data-mute]");
    const sync = () => {
      playBtn.innerHTML = video.paused ? ICONS.play : ICONS.pause;
      playBtn.setAttribute("aria-label", video.paused ? "Play video" : "Pause video");
      muteBtn.innerHTML = video.muted ? ICONS.mute : ICONS.unmute;
      muteBtn.setAttribute("aria-pressed", String(!video.muted));
      muteBtn.setAttribute("aria-label", video.muted ? "Unmute video" : "Mute video");
    };
    playBtn.addEventListener("click", () => {
      if (video.paused) video.play(); else video.pause();
      sync();
    });
    muteBtn.addEventListener("click", () => {
      video.muted = !video.muted;
      sync();
    });
    video.addEventListener("click", () => {
      if (video.paused) video.play(); else video.pause();
      sync();
    });
    sync();
  });
}

function routeFromHash() {
  const raw = location.hash.replace(/^#\/?/, "");
  if (!raw || raw === "works") return "odyssey";
  if (PAGES[raw]) return raw;
  if (raw === "artifacts") return "aeons";
  if (raw === "notes") return "100";
  if (raw === "sounds") return "lofi";
  return "odyssey";
}

function closeMobileMenu() {
  el.finder.dataset.menuOpen = "false";
  el.menuToggle.setAttribute("aria-expanded", "false");
}

el.menuToggle.addEventListener("click", () => {
  const open = el.finder.dataset.menuOpen !== "true";
  el.finder.dataset.menuOpen = String(open);
  el.menuToggle.setAttribute("aria-expanded", String(open));
});

el.privacy.addEventListener("click", () => {
  const on = el.privacy.getAttribute("aria-pressed") === "true";
  el.privacy.setAttribute("aria-pressed", String(!on));
  document.body.classList.toggle("privacy-off", on);
  el.privacy.title = on ? "Turn privacy on (/)" : "Turn privacy off (/)";
});

window.addEventListener("keydown", (e) => {
  if (e.key === "/" && !e.metaKey && !e.ctrlKey && document.activeElement === document.body) {
    e.preventDefault();
    el.privacy.click();
  }
});

window.addEventListener("hashchange", () => renderPage(routeFromHash()));
if (!location.hash) location.hash = "#/odyssey";
else renderPage(routeFromHash());
