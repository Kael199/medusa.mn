/* ============================================================
   AkiraScans — Data
   ============================================================ */

function cover(rank, palette = 'red-blue') {
    const palettes = {
        'red-blue':     ['#e63946', '#1d4ed8'],
        'blue-red':     ['#1d4ed8', '#e63946'],
        'red-purple':   ['#e63946', '#7c3aed'],
        'blue-purple':  ['#1d4ed8', '#7c3aed'],
        'red-orange':   ['#e63946', '#f97316'],
        'blue-cyan':    ['#1d4ed8', '#06b6d4'],
        'red-pink':     ['#e63946', '#ec4899'],
        'red-yellow':   ['#e63946', '#facc15'],
        'blue-teal':    ['#1d4ed8', '#14b8a6'],
        'red-dark':     ['#b91d2c', '#0b1e6e'],
        'sunset':       ['#fb923c', '#dc2626'],
        'ocean':        ['#0ea5e9', '#1e3a8a'],
        'fire':         ['#ef4444', '#7f1d1d'],
        'ice':          ['#60a5fa', '#1e40af'],
        'rose':         ['#fb7185', '#9f1239'],
        'forest':       ['#10b981', '#065f46'],
        'royal':        ['#6366f1', '#312e81'],
        'gold':         ['#fbbf24', '#92400e'],
        'crimson':      ['#dc2626', '#450a0a'],
        'sapphire':     ['#1d4ed8', '#0c1936'],
        'aurora':       ['#10b981', '#7c3aed'],
        'magma':        ['#f97316', '#7f1d1d'],
        'twilight':     ['#8b5cf6', '#1e1b4b'],
    };
    const colors = palettes[palette] || palettes['red-blue'];
    const angle = (rank * 37) % 360;
    const angle2 = (angle + 90) % 360;
    return {
        background: `linear-gradient(${angle}deg, ${colors[0]} 0%, ${colors[1]} 100%)`,
        pattern: `linear-gradient(${angle2}deg, transparent 30%, rgba(255,255,255,0.08) 50%, transparent 70%)`,
        icon: ['⚔️','🛡️','🔥','✨','🌙','⚡','🌸','🐉','👑','💎','🎭','🌊','🦋','🍀','🎪','🗡️','🏹','🔮','💀','🌹'][rank % 20],
    };
}

/* Hero feature slides (asura-style: 3 featured at top) */
const HERO_SLIDES = [
    {
        title: 'Shadow Monarch: Solo Awakening',
        author: 'Chugong · illustrated by DUBU',
        desc: 'Ten years ago, the gates to dungeons appeared. Sung Jinwoo, the weakest hunter, finds himself in a mysterious double dungeon — and becomes the only Player.',
        meta: ['9.8', '12.4M reads', 'Top action'],
        bg: 'linear-gradient(135deg,#1d4ed8 0%,#0b1e6e 60%,#1e1b4b 100%)',
        badge: '#1 Trending',
        palette: 'red-blue',
    },
    {
        title: 'Return of the Disaster-Class Hero',
        author: 'SAN.G · illustrated by In-Ok Jun',
        desc: 'After defeating the demon king, hero Sebas returns 20 years in the past to his weakest form — and resolves to save everyone he lost.',
        meta: ['9.6', '9.8M reads', 'Top fantasy'],
        bg: 'linear-gradient(135deg,#7c3aed 0%,#3b0764 60%,#1e1b4b 100%)',
        badge: '#2 Trending',
        palette: 'red-purple',
    },
    {
        title: 'Omniscient Reader\'s Viewpoint',
        author: 'Sing Shong · illustrated by Sleepy-C',
        desc: 'Kim Dokja has read his favorite web novel to its end for 10 years. When the novel becomes reality, he is the only one who knows how the story ends.',
        meta: ['9.9', '15.1M reads', 'Editor\'s pick'],
        bg: 'linear-gradient(135deg,#dc2626 0%,#0b1e6e 60%,#1e1b4b 100%)',
        badge: '#3 Trending',
        palette: 'red-dark',
    },
];

/* Trending today (horizontal carousel) */
const TRENDING = [
    { title: 'Reformation of the Deadbeat Noble',  type: 'Manhwa', chapters: 'Chapter <b>147</b>', genres: ['Action','Adventure','Fantasy'],   rating: '9.6', palette: 'red-blue'    },
    { title: 'The Sword Emperor\'s Rise of Namgung', type: 'Manhwa', chapters: 'Chapter <b>89</b>',  genres: ['Action','Martial Arts'],          rating: '9.4', palette: 'red-purple'  },
    { title: 'Return of the Disaster-Class Hero',  type: 'Manhwa', chapters: 'Chapter <b>192</b>', genres: ['Action','Fantasy'],                rating: '9.7', palette: 'fire'        },
    { title: 'Shadow Monarch: Solo Awakening',    type: 'Manhwa', chapters: 'Chapter <b>187</b>', genres: ['Action','Isekai'],                  rating: '9.8', palette: 'royal'       },
    { title: 'The Beginning After The End',       type: 'Manhua', chapters: 'Chapter <b>201</b>', genres: ['Fantasy','Reincarnation'],          rating: '9.5', palette: 'aurora'      },
    { title: 'Omniscient Reader\'s Viewpoint',    type: 'Manhwa', chapters: 'Chapter <b>201</b>', genres: ['Action','Mystery'],                 rating: '9.9', palette: 'red-dark'    },
    { title: 'Tower of God S3',                    type: 'Manhwa', chapters: 'Chapter <b>62</b>',  genres: ['Adventure','Fantasy'],              rating: '9.2', palette: 'blue-cyan'   },
    { title: 'Nano Machine',                       type: 'Manhwa', chapters: 'Chapter <b>183</b>', genres: ['Martial Arts','Action'],            rating: '9.3', palette: 'red-orange'  },
    { title: 'Second Life Ranker',                 type: 'Manhwa', chapters: 'Chapter <b>144</b>', genres: ['Fantasy','Revenge'],                rating: '9.4', palette: 'red-pink'    },
    { title: 'Martial Peak',                       type: 'Manhua', chapters: 'Chapter <b>1,547</b>', genres: ['Cultivation','Action'],           rating: '9.0', palette: 'red-yellow'  },
    { title: 'Chronicles of Heavenly Demon',       type: 'Manhwa', chapters: 'Chapter <b>88</b>',  genres: ['Martial Arts','Drama'],             rating: '9.2', palette: 'sunset'      },
    { title: 'SSS-Class Suicide Hunter',          type: 'Manhwa', chapters: 'Chapter <b>152</b>', genres: ['Action','Fantasy'],                 rating: '9.5', palette: 'twilight'    },
];

/* Popular (sidebar top 10) */
const POPULAR = [
    { title: 'Reformation of the Deadbeat Noble',  rating: '9.6', chapters: 'Ch. 147',  palette: 'red-blue'   },
    { title: 'The Sword Emperor\'s Rise',          rating: '9.4', chapters: 'Ch. 89',   palette: 'red-purple' },
    { title: 'Return of the Disaster-Class Hero',  rating: '9.7', chapters: 'Ch. 192',  palette: 'fire'       },
    { title: 'Shadow Monarch: Solo Awakening',    rating: '9.8', chapters: 'Ch. 187',  palette: 'royal'      },
    { title: 'The Beginning After The End',       rating: '9.5', chapters: 'Ch. 201',  palette: 'aurora'     },
    { title: 'Omniscient Reader\'s Viewpoint',    rating: '9.9', chapters: 'Ch. 201',  palette: 'red-dark'   },
    { title: 'Tower of God S3',                    rating: '9.2', chapters: 'Ch. 62',   palette: 'blue-cyan'  },
    { title: 'Nano Machine',                       rating: '9.3', chapters: 'Ch. 183',  palette: 'red-orange' },
    { title: 'Second Life Ranker',                 rating: '9.4', chapters: 'Ch. 144',  palette: 'red-pink'   },
    { title: 'Martial Peak',                       rating: '9.0', chapters: 'Ch. 1547', palette: 'red-yellow' },
];

/* Latest Updates (grid) */
const LATEST = [
    { title: 'Solo Iron Knight',                  chapter: '187',   time: '12m ago',  type: 'HOT', palette: 'red-blue'    },
    { title: 'Heavenly Demon Reborn',             chapter: '94',    time: '32m ago',  type: 'NEW', palette: 'red-purple'  },
    { title: 'Regressor Instruction Manual',      chapter: '128',   time: '1h ago',   type: 'NEW', palette: 'blue-red'    },
    { title: 'Omniscient Reader',                 chapter: '201',   time: '2h ago',   type: 'HOT', palette: 'red-dark'    },
    { title: 'Tower of God S3',                   chapter: '62',    time: '3h ago',   type: 'NEW', palette: 'blue-cyan'   },
    { title: 'Nano Machine',                      chapter: '183',   time: '4h ago',   type: 'NEW', palette: 'red-orange'  },
    { title: 'Martial Peak',                      chapter: '1,547', time: '5h ago',   type: 'NEW', palette: 'red-yellow'  },
    { title: 'Second Life Ranker',                chapter: '144',   time: '6h ago',   type: 'HOT', palette: 'red-pink'    },
    { title: 'God of High School',                chapter: '569',   time: '7h ago',   type: 'NEW', palette: 'fire'        },
    { title: 'Heavenly Demon Chronicles',        chapter: '88',    time: '8h ago',   type: 'NEW', palette: 'sunset'      },
    { title: 'Player Who Returned',               chapter: '52',    time: '10h ago',  type: 'NEW', palette: 'ocean'       },
    { title: 'Dungeon Blacksmith',                chapter: '76',    time: '11h ago',  type: 'HOT', palette: 'royal'       },
    { title: 'Academy Genius Swordsman',          chapter: '112',   time: '13h ago',  type: 'NEW', palette: 'ice'         },
    { title: 'Boundless Necromancer',             chapter: '94',    time: '15h ago',  type: 'NEW', palette: 'forest'      },
    { title: 'Chronicles of an Aristocrat',       chapter: '108',   time: '17h ago',  type: 'NEW', palette: 'gold'        },
    { title: 'SSS-Class Suicide Hunter',          chapter: '152',   time: '19h ago',  type: 'HOT', palette: 'red-purple'  },
    { title: 'Regressor\'s Life',                 chapter: '63',    time: '20h ago',  type: 'NEW', palette: 'crimson'     },
    { title: 'Apotheosis',                        chapter: '847',   time: '22h ago',  type: 'NEW', palette: 'red-orange'  },
    { title: 'Magic Emperor',                     chapter: '234',   time: '1d ago',   type: 'NEW', palette: 'sapphire'    },
    { title: 'Cultivator Against Hero Society',   chapter: '76',    time: '1d ago',   type: 'NEW', palette: 'aurora'      },
];

/* Genres for sidebar */
const GENRES = [
    'Action','Adventure','Romance','Fantasy','Isekai','Martial Arts',
    'Slice of Life','Horror','Sci-Fi','Comedy','Drama','Mystery','Supernatural','Sports','Historical'
];

window.AKIRA_DATA = { HERO_SLIDES, TRENDING, POPULAR, LATEST, GENRES, cover };