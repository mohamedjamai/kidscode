export const LessonType = {
  HTML: 'HTML',
  CSS: 'CSS',
  JavaScript: 'JavaScript',
  Python: 'Python',
} as const;

export type LessonType = typeof LessonType[keyof typeof LessonType];

export const LanguageMascots = {
  HTML: {
    name: 'Hugo de Hippo',
    emoji: '🦛',
    color: 'orange',
    message: 'Hoi! Ik ben Hugo en ik help je met HTML! Samen bouwen we coole websites!'
  },
  CSS: {
    name: 'Charlie de Chameleon',
    emoji: '🦎',
    color: 'blue',
    message: 'Hey! Ik ben Charlie en ik help je met CSS! Ik maak alles mooi en kleurrijk!'
  },
  JavaScript: {
    name: 'Joey de Jaguar',
    emoji: '🐆',
    color: 'yellow',
    message: 'Yo! Ik ben Joey en samen maken we coole animaties en games met JavaScript!'
  },
  Python: {
    name: 'Pip de Panda',
    emoji: '🐼',
    color: 'green',
    message: 'Hallo! Ik ben Pip en ik help je met Python! Samen leren we programmeren!'
  }
} as const; 