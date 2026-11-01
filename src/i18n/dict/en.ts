import type { Dictionary } from "./index";

/*
  ข้อความหน้าเว็บภาษาอังกฤษ — key ต้องตรงกับ th.ts ทุกตัว
  ใช้สองที่: เป็นข้อความหลักของหน้า /en และเป็นบรรทัดรอง (lang="en") ใต้ข้อความไทยในหน้าไทย
  แก้คำที่นี่ หน้าไทยเปลี่ยนตามด้วย
*/
export const en: Dictionary = {
  arabic: {
    classroom: {
      metadataTitle: "Arabic Basics Island",
      otherIslands: "Visit other islands",
      title: "Arabic Classroom",
      instructions: "Listen to your robot teacher, then read aloud when it is your turn.",
      chooseAge: "Choose your age group",
      activeAge: "Current age group",
      chooseLetters: "Choose a letter set",
      chooseCategory: "Choose a lesson category",
      activeUnit: "Current set",
      idle: "Press Start to learn one letter at a time.",
      paused: "Taking a break. Press Continue when you are ready.",
      teaching: "Your teacher is teaching: {title}",
      listen: "Listen carefully as your teacher reads.",
      echo: "Your turn! Read aloud after your teacher.",
      great: "Well done!",
      unitDone: "Well done! You finished this set. Let’s try the next one.",
      allDone: "Well done! You finished every set.",
      pronunciation: "Say: {say}",
      meaning: "Meaning: {meaning}",
      nextUnit: "Next set",
      again: "Again",
      start: "Start",
      continue: "Continue",
      pause: "Pause",
      listenAgain: "Listen again",
      previous: "Previous",
      next: "Next",
      progress: "{title} · Lesson {current} of {total}",
      activeStep: "Current lesson",
      echoSpeech: "Read after me ... {say}",
      cheerSpeech: "Well done! Let’s look at the next one.",
      doneSpeech: "Well done! You finished this set. Take a little break, then join me for the next set."
    }
  },
  stories: {
    shelf: {
      metadataTitle: "Stories Island",
      title: "Stories",
      back: "Stories",
      label: "Story bookshelf",
      soon: "Coming soon",
      soonSuffix: " (Coming soon)",
      soonSpeech: "{title}, coming soon"
    },
    guide: {
      replay: "Listen to Teacher Nuri again",
      name: "Teacher Nuri",
      intro: "Assalamu alaikum! I'm Teacher Nuri. Every story here is a true story from the Quran and hadith only. Pick a book from the shelf that fits your age!"
    },
    book: {
      metadataTitle: "Story",
      label: "Storybook: {title}",
      previous: "Previous page",
      next: "Next page",
      pause: "Pause",
      again: "Read again",
      play: "Play",
      continue: "Continue",
      cover: "Cover",
      page: "Page {page} / {count}",
      reading: "Read: {reading}",
      meaning: "Meaning: {meaning}",
      intro: "Press play and let's listen to the story!",
      end: "The End"
    }
  },
  moral: {
    metadataTitle: "Manners and Morals Island",
    hero: {
      chooseAge: "Choose an age",
      skipGuide: "Skip the guide",
      hearGuide: "Hear the robot guide again",
      skip: "Skip",
      hearAgain: "Hear again"
    },
    lessons: {
      mission: "Today",
      missionLabel: "Today's mission: {done} of {goal}",
      stars: "Stars: {count} of {maxStars}",
      listenAgain: "Listen again",
      close: "Close"
    },
    cartoon: {
      pause: "Pause",
      watchAgain: "Watch again",
      play: "Play",
      previous: "Previous",
      next: "Next",
      scene: "Scene {index} of {total}",
      sayPrompt: "Your turn! Say {word}"
    }
  },
  explore: {
    metadataTitle: "Explore Island",
    photoCredits: "Photo credits",
    newTab: " (opens in a new tab)",
    by: "By"
  },
  header: {
    homeLabel: "Little Ummah home",
    parentsShort: "Parents",
    parents: "Parents",
  },
  sound: {
    label: "Read aloud",
    on: "Sound on",
    off: "Sound off",
    noVoice: "This device has no English read-aloud voice installed",
    noVoiceShort: "This device has no English read-aloud voice",
  },
  nav: {
    home: "Home",
  },
  notFound: {
    title: "Page not found",
    body: "This page may have moved. Tap Home to pick an island again.",
  },
  speech: {
    logoHome: "Little Ummah, home",
    parents: "For parents",
    soundOn: "Sound is on",
  },
  hero: {
    arcTitle: "Learn, Play, Grow",
    arcLearn: "Learn,",
    arcPlay: "Play,",
    arcGrow: "Grow",
    learn: "Learn",
    play: "Play",
    grow: "Grow",
    love: "Learn to love,",
    obey: "obey",
    trust: "and trust",
    parents: "your parents,",
    faith: "and grow in faith",
    islam: "through Islam",
    speech: "Learn, Play, Grow",
  },
  categoryGrid: {
    heading: "Learning categories",
  },
  ageGroupSelector: {
    kidsLabel: "Ages 3–6",
    kidsHint: "Learn through play",
    juniorsLabel: "Ages 7+",
    juniorsHint: "Read and explore on your own",
    label: "Choose an age group",
  },
  valueBar: {
    label: "Learning category shortcuts",
  },
  otherIslands: {
    title: "More islands",
    hint: "Discover many more things to learn",
  },
  logo: {
    brand: "Little Ummah",
    today: "Today's little Ummah",
    tomorrow: "are tomorrow's grown-ups",
  },
  ageHome: {
    kidsTitle: "Ages 3–6",
    kidsHint: "Learn through play. Tap an island to begin.",
    juniorsTitle: "Ages 7+",
    juniorsHint: "Read and explore on your own. Pick an island.",
  },
  lessonCard: {
    reading: "Read as:",
    meaning: "Meaning:",
    listen: "Listen",
  },
  gameNavigation: {
    games: "Games",
  },
  gameTile: {
    soon: "Coming soon",
    play: "{pairs} pairs · Play",
  },
  memoryGame: {
    ready: "Press Start to shuffle the cards",
    started: "Let’s begin. Choose two cards with matching pictures",
    choose: "Choose two cards with matching pictures",
    opened: "You turned over {name}. Choose one more card",
    found: "You matched {name}",
    mismatch: "{first} and {name} do not match. Try to remember the pictures",
    praise: "Well done",
    wonAnnouncement: "Well done! You found all {pairs} pairs in {moves} moves",
    progress: "Well done. You found {found} of {pairs} pairs",
    hiddenAnnouncement: "The cards are face down. Try choosing another pair",
    title: "Memory Match",
    groupPairs: "{group} · {pairs} pairs",
    help: "Turn over two cards. Find the matching pictures.",
    pairsFound: "Pairs found: {found} / {pairs}",
    pairsCaption: "Pairs found",
    moves: "{moves} moves",
    movesCaption: "Moves",
    start: "Start",
    wellDone: "Well done!",
    complete: "You found every pair!",
    again: "Play again",
    card: "Card {index}, {state}{matched}",
    faceDown: "face down",
    matchedSuffix: ", matched",
    matched: "Matched",
  },
  learnIndex: {
    metadataTitle: "All learning islands",
    title: "Choose an island",
  },
  islandPage: {
    metadataTitle: "{name} Island",
    metadataFallback: "Learning island",
  },
  memoryPage: {
    metadataTitle: "Memory Match — Choose an age group",
    easyTitle: "Memory Match — Ages 3–6",
    hardTitle: "Memory Match — Ages 7+",
    hint: "Choose your age group to play.",
  },
  layout: {
    title: "Little Ummah — Learn, Play, Grow",
    titleTemplate: "%s | Little Ummah",
    description: "An Islamic learning website for children: learn about faith, build good manners, and grow into good people in this world. For ages 3–6 and 7+.",
  },
  obeyArc: {
    title: "Love, Believe, Obey",
    love: "Love,",
    believe: "Believe,",
    obey: "Obey",
  },
  // ข้อความระบบเกม
  games: {
    dhikr: {
      countGo: "Bismillah, let's begin!",
      mashaAllah: "Masha'Allah!",
      lightMazeHalf: "Masha'Allah, you're collecting the lights so well!",
      lightMazeComplete: "Alhamdulillah, you collected all the lights!",
    },
    countdown: {
      three: "Three",
      two: "Two",
      one: "One",
      go: "Go!",
      announcement: "Go!"
    },
    hub: {
      title: "Games Island",
      intro: "Choose a category. Let's play!",
      chooseCategory: "Choose a game category",
      ageUnit: "yrs",
      collected: "{stars} stars collected",
      playLabel: "Play {name} · {stars} stars collected",
      soon: "Coming soon",
      soonLabel: "{name}, coming soon, not ready to play yet",
      soonBody: "Nuri is getting this game ready. Come back soon to play.",
      soonClose: "OK",
      metadataTitle: "Mini Game Center",
      metadataDescription: "Nine learning games for children: colors, shapes, memory, puzzles, and Arabic letters."
    },
    intro: {
      listen: "Listen",
      choose: "Choose a level",
      level: "Level",
      play: "Let’s play →",
      mazeHelp: "Press a direction, swipe, or tap where to go",
      tap: "Tap a picture to play",
      drag: "Tap a piece, then its home — or drag it there",
      picture: " Picture: {name}"
    },
    player: {
      loading: "Getting ready…",
      notFound: "Game not found"
    },
    shell: {
      correct: "Well done!",
      retry: "Try again",
      hub: "Game Hub",
      sound: "Game sound",
      soundOn: "Sound on",
      soundOff: "Sound off",
      level: "Level",
      progress: "Level progress",
      listen: "Listen",
      ready: "You can do it!",
      choose: "Choose level",
      restart: "Restart",
      celebrateAlt: "A robot celebrating",
      complete: "You did it! Level complete",
      stars: "You earned 3 stars",
      next: "Next level →",
      again: "Play again",
      more: "More games",
      noVoice: "Voice unavailable. Follow the pictures.",
      result: "You did it! Level {level} complete",
      collected: "{stars} stars collected",
      collectedSecondary: "• {stars} stars collected"
    },
    hubProgress: {
      stars: "Stars",
      collected: "{stars} stars collected"
    },
    tutorial: {
      skip: "Skip"
    },
    rotate: {
      title: "Turn your screen sideways to play",
      fullscreen: "Full screen"
    },
    voiceIntro: {
      start: "Start",
      ready: "Your guide has finished explaining the game.",
      speaking: "Your guide is explaining the game. Press Start to skip.",
      again: "Listen again"
    },
    find: {
      find: "Find…"
    },
    lightMaze: {
      starSpeech: "You have light power! The robot friends will move away for a little while.",
      slowSpeech: "The robot friends are slower now. Take your time choosing a path.",
      shieldSpeech: "You have a shield! It protects you from one bump.",
      warpSpeech: "This gate takes you somewhere else. Choose your next path.",
      bumpSpeech: "It’s okay. You still have all your lights. Let’s keep going.",
      starToast: "Light power!",
      slowToast: "Robots slow down",
      shieldToast: "Shield on",
      shieldUsed: "Shield used",
      warp: "Warp!",
      checkpoint: "Rest spot saved",
      safe: "Your lights are safe",
      power: "★ Light power",
      slow: "◷ Slow down",
      shield: "◈ Shield 1",
      move: "Move the robot",
      board: "Light maze, {name}, {left} lights left. Use the direction buttons or arrow keys to move.",
      upLeft: "Up-left",
      upRight: "Up-right",
      downLeft: "Down-left",
      downRight: "Down-right"
    },
    matching: {
      leftRight: "Left → right",
      tapDrag: "Tap → tap, or drag",
      hint: "Hint",
      hide: "Hide picture guide",
      show: "Show picture guide",
      unavailable: "Match the numbers while the picture is unavailable.",
      destinations: "Destinations",
      selectFirst: "Choose a piece first, then tap this space.",
      pieces: "Pieces",
      placed: "Placed {done} of {total} pieces",
      trySlot: "Try putting {name} in the space with the arrow.",
      placedCount: " Placed {n}",
      placedItem: "Placed {name}",
      selected: "Selected {name}. Tap the matching space.",
      pictureGuide: "Picture guide"
    },
    memory: {
      board: "Memory card board",
      matched: " Matched",
      moves: "{moves} moves",
      movesSecondary: "· {moves} moves",
      card: "Card {index}"
    },
    puzzle: {
      help: "Tap a piece, then a space in the tray, or drag it there.",
      retry: "Try another space. Look at the picture guide in the tray.",
      selectFirst: "Choose a picture piece first, then tap a space in the tray.",
      hide: "Hide picture guide",
      show: "Show picture guide",
      hint: "Hint",
      placed: " placed",
      pieces: "Puzzle pieces",
      selected: "Piece selected. Tap the matching shape in the tray.",
      placedCount: "Placed {done} of {total} pieces",
      hintSlot: "Try putting the selected piece in space {index}, marked with an arrow.",
      tray: "Puzzle tray: {name}",
      slot: "Slot {index}{placed}",
      piece: "Piece {index} of {name}",
      pictureGuide: "Picture guide"
    },
    sequence: {
      retry: "Compare it with the other pieces, then try again.",
      hint: "Hint",
      order: "Order from front left to back right",
      selectFirst: "Choose a toy first, then tap a gold tile.",
      toys: "Toys to order",
      help: "{name}. Tap a toy, then a gold tile, or drag it there. Start at the front left.",
      placedCount: "Placed {name} correctly. {done} of {total} pieces.",
      hintTile: "Try putting {name} on gold tile {index}, marked with an arrow.",
      placed: ": {name}, placed",
      position: "Position {index}{placed}",
      selected: "Selected {name}. Tap the gold tile where you want to put it.",
      picked: "{name} selected",
      pickedSecondary: "· {name} selected"
    },
    shape: {
      hint: "Hint",
      island: "Shape sorter island",
      placed: " placed",
      selectFirst: "Choose a shape first, then tap this space.",
      pieces: "Our shape pieces",
      placedCount: "Placed {name}. {done} of {total} pieces.",
      hintSlot: "Try putting {name} in the space with the arrow.",
      slot: "{name} slot{placed}",
      placedItem: "Placed {name}",
      selected: "Selected {name}. Tap the matching space.",
      picked: "{name} selected",
      pickedSecondary: "· {name} selected"
    },
    audio: {
      great: "Well done!",
      correct: "Correct!",
      retry: "Try again.",
      close: "Almost there. Keep trying!",
      complete: "Yay! Level complete."
    },
    error: {
      title: "Let’s try again.",
      retry: "Retry",
      hub: "Game Hub"
    }
  },
};
