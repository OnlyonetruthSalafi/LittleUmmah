import type { Dictionary } from "./index";
import { errorText } from "./error";
import { ENGLISH_COURSE_DONE } from "../../features/languages/data/english";
import { THAI_COURSE_DONE } from "../../features/languages/data/thai";

/*
  ข้อความหน้าเว็บภาษาอังกฤษ — key ต้องตรงกับ th.ts ทุกตัว
  ใช้สองที่: เป็นข้อความหลักของหน้า /en และเป็นบรรทัดรอง (lang="en") ใต้ข้อความไทยในหน้าไทย
  แก้คำที่นี่ หน้าไทยเปลี่ยนตามด้วย
*/
export const en: Dictionary = {
  seo: {
    "homeTitle": "Free, ad-free Islamic learning for children | Little Ummah",
    "description": "Little Ummah is a free, ad-free Islamic learning website for children aged 3–6 and 7+. Explore activities, games and stories together as a family.",
    "kidsDescription": "Learn through play with Nuri and activities for ages 3–6 on Little Ummah, a free, ad-free Islamic learning website for children.",
    "juniorsDescription": "Explore activities and follow your interests from age 7 on Little Ummah, a free, ad-free Islamic learning website for children.",
    "parentsDescription": "Discover the approach to content, images and audio on Little Ummah, a free, ad-free Islamic learning website for children, and choose activities for your family.",
    "learnDescription": "Choose activities, games and stories by interest and age on Little Ummah, a free, ad-free Islamic learning website for children.",
    "gamesDescription": "Explore memory, shape and thinking games on Little Ummah, a free, ad-free Islamic learning website for children.",
    "storyDescription": "Read and listen to {title} with your child on Little Ummah, a free, ad-free Islamic learning website for children.",
    "categoryDescription": "Explore {title} activities with your child on Little Ummah, a free, ad-free Islamic learning website for children.",
    "categories": {
      "moral": "Explore manners and morals through activities chosen for your child’s age on Little Ummah, a free, ad-free Islamic learning website for children.",
      "stories": "Choose stories to read and listen to with your child by age group on Little Ummah, a free, ad-free Islamic learning website for children.",
      "arabic": "Discover basic Arabic and practise reading with Nuri on Little Ummah, a free, ad-free Islamic learning website for children.",
      "explore": "Explore everyday objects and nature through age-appropriate activities on Little Ummah, a free, ad-free Islamic learning website for children.",
      "art": "Choose colours and colour pictures on Art Island at Little Ummah, a free, ad-free Islamic learning website for children."
    },
    "images": {
      "welcome": "Nuri, a white, blue and gold robot, holds a globe to welcome children to Little Ummah",
      "play": "Nuri, a white, blue and gold robot, holds a game controller for learning activities at Little Ummah"
    }
  },
  error: {
    title: errorText.title.en,
    body: errorText.body.en,
    retry: errorText.retry.en,
    home: errorText.home.en,
    reference: errorText.reference.en,
  },
  languages: {
    title: "Language island",
    subtitle: "Choose your classroom",
    welcome: "Nuri is ready. Choose a language and come read together.",
    enter: "Enter classroom",
    soon: "Coming soon",
    closedHeading: "Classrooms on the way",
    names: { english: "English", thai: "Thai", arabic: "Arabic", bengali: "Bengali", indonesian: "Indonesian" },
    courses: {
      arabic: {
        title: "Arabic classroom",
        intro: "Discover Arabic letters. Listen to Nuri and read along, one letter at a time.",
        courseDone: "Well done! You learned all 28 letters, from Alif to Ya.",
        courseDoneSpeech: "Well done! You learned all twenty-eight Arabic letters. Come back and practise with me any day.",
        pathLabel: "The 28-letter path",
        pathLearned: "{count} of {total} letters learned",
        goalHint: "Reach Ya, all 28 letters, for the big gold star",
        goalReached: "All 28 letters done. Well done!",
      },
      english: {
        title: "English classroom",
        intro: "Learn letters A–Z, words and simple phrases with Nuri.",
        courseDone: "Well done! You learned all 26 letters, from A to Z.",
        courseDoneSpeech: ENGLISH_COURSE_DONE.en,
        pathLabel: "The 26-letter path · A–Z",
        pathLearned: "{count} of {total} letters learned",
        goalHint: "Reach Z, all 26 letters, for the big gold star",
        goalReached: "All 26 letters done. Well done!",
      },
      thai: {
        title: "Thai classroom",
        intro: "Learn consonants ก–ฮ, vowels, tones and easy words with Nuri.",
        courseDone: "Well done! You learned all 44 consonants, from ก to ฮ.",
        courseDoneSpeech: THAI_COURSE_DONE.en,
        pathLabel: "The 44-consonant path · ก–ฮ",
        pathLearned: "{count} of {total} letters learned",
        goalHint: "Reach ฮ, all 44 consonants, for the big gold star",
        goalReached: "All 44 consonants done. Well done!",
      },
    },
  },
  arabic: {
    classroom: {
      metadataTitle: "Basic Languages",
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
      courseDone: "Well done! You learned all 28 letters, from Alif to Ya.",
      courseDoneSpeech: "Well done! You learned all twenty-eight Arabic letters. Come back and practise with me any day.",
      pathLabel: "The 28-letter path",
      pathLearned: "{count} of {total} letters learned",
      pathRow: "Set {n}",
      learnedMark: "learned",
      resume: "Continue where you left off",
      goalTitle: "Finish line",
      goalHint: "Reach Ya, all 28 letters, for the big gold star",
      goalReached: "All 28 letters done. Well done!",
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
  footer: {
    label: "Site footer",
    motto: "Today's little Ummah, tomorrow's grown-ups",
    promisesTitle: "Our promise",
    promiseFree: "Free for everyone (freemium)",
    promiseNoAds: "No ads",
    promiseNoTracking: "Children's data stays on the device",
    sources: "Religious content comes from the Qur'an and authentic hadith, checked against the original books",
    sourcesLink: "See our sources and content guidelines",
    islandsTitle: "Where to next?",
    sponsorTitle: "Supported by",
    sponsorThanks: "A good project supported by Shuhada Co., Ltd.",
    sponsorName: "Shuhada",
    parents: "For parents",
    home: "Home",
    copyright: "© {year} Little Ummah",
  },
  islandOrbit: {
    label: "Island ring — choose where to go",
    hint: "Swipe left or right, or use the arrows, to turn the ring",
    prev: "Previous island",
    next: "Next island",
    position: "Island {n} of {total}",
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
      loading: "Preparing the picture. Please wait.",
      loadFailed: "Image could not load. Try placing the piece again.",
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
