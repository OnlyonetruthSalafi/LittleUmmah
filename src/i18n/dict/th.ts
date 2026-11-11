/*
  ข้อความหน้าเว็บภาษาไทย (UI dictionary) — ปุ่ม หัวข้อ aria-label คำที่หุ่นยนต์พูด
  เนื้อหาบทเรียน/นิทานไม่อยู่ที่นี่ (อยู่ในไฟล์ข้อมูลของแต่ละเกาะเป็น { th, en })

  - ไฟล์ภาษาอื่น (en.ts ฯลฯ) ต้องมี key ครบเท่าไฟล์นี้ — TypeScript ไม่ให้ build ถ้าขาด
  - ค่าเป็น string ล้วน ตัวแปรเขียนเป็น {name} แล้วใช้ fmt() แทนค่า
  - group "speech" = ข้อความที่ส่งให้เสียงอ่าน สะกดตามเสียงได้ (เช่น ลิตเทิ่ล อุมมะฮ์)
  - หน้าไทยแสดงคำจากไฟล์นี้เป็นหลัก และคำจาก en.ts เป็นบรรทัดรอง (ไทยนำ อังกฤษรอง)
*/
import { errorText } from "./error";
import { ENGLISH_COURSE_DONE } from "../../features/languages/data/english";
import { THAI_COURSE_DONE } from "../../features/languages/data/thai";

export const th = {
  agePreference: { kids: "ดูบทของวัย 3–6 ปี", juniors: "ดูบทของวัย 7 ปีขึ้นไป" },
  seo: {
    "homeTitle": "เว็บเรียนรู้อิสลามสำหรับเด็ก ฟรี ไม่มีโฆษณา | Little Ummah",
    "description": "Little Ummah เว็บเรียนรู้อิสลามสำหรับเด็กวัย 3–6 ปีและ 7 ปีขึ้นไป เรียนรู้ผ่านกิจกรรม เกม และนิทาน ใช้ฟรี ไม่มีโฆษณา ให้ผู้ปกครองเลือกเรียนรู้ไปกับลูก",
    "kidsDescription": "กิจกรรมสำหรับเด็กวัย 3–6 ปี เรียนรู้ผ่านการเล่นกับครูนูรี บน Little Ummah เว็บเรียนรู้อิสลามสำหรับเด็ก ใช้ฟรี ไม่มีโฆษณา",
    "juniorsDescription": "กิจกรรมสำหรับเด็กวัย 7 ปีขึ้นไป เลือกสำรวจและเรียนรู้ตามความสนใจ บน Little Ummah เว็บเรียนรู้อิสลามสำหรับเด็ก ใช้ฟรี ไม่มีโฆษณา",
    "parentsDescription": "รู้จักแนวทางเนื้อหา ภาพ และเสียงของ Little Ummah เว็บเรียนรู้อิสลามสำหรับเด็ก ใช้ฟรี ไม่มีโฆษณา เพื่อให้ผู้ปกครองเลือกกิจกรรมให้เหมาะกับลูก",
    "learnDescription": "เลือกหมวดกิจกรรม เกม และนิทานตามความสนใจและช่วงวัย บน Little Ummah เว็บเรียนรู้อิสลามสำหรับเด็ก ใช้ฟรี ไม่มีโฆษณา",
    "gamesDescription": "เลือกเกมฝึกความจำ รูปทรง และการคิดสำหรับเด็ก บน Little Ummah เว็บเรียนรู้อิสลามสำหรับเด็ก ใช้ฟรี ไม่มีโฆษณา",
    "storyDescription": "อ่านและฟังนิทานเรื่อง {title} ไปกับลูก บน Little Ummah เว็บเรียนรู้อิสลามสำหรับเด็ก ใช้ฟรี ไม่มีโฆษณา",
    "categoryDescription": "เลือกกิจกรรมหมวด{title}ไปกับลูก บน Little Ummah เว็บเรียนรู้อิสลามสำหรับเด็ก ใช้ฟรี ไม่มีโฆษณา",
    "categories": {
      "faith-basics": "เรียนรู้อิสลามพื้นฐานสำหรับเด็กวัย 3–6 ปีและ 7 ปีขึ้นไป ผ่านคำถามและคำตอบกับครูนูรี ใช้ฟรี ไม่มีโฆษณา",
      "moral": "เรียนรู้มารยาทและศีลธรรมผ่านกิจกรรมที่ผู้ปกครองเลือกให้เหมาะกับวัย บน Little Ummah เว็บเรียนรู้อิสลามสำหรับเด็ก ใช้ฟรี ไม่มีโฆษณา",
      "stories": "เลือกอ่านและฟังนิทานไปกับลูก แบ่งตามช่วงวัย บน Little Ummah เว็บเรียนรู้อิสลามสำหรับเด็ก ใช้ฟรี ไม่มีโฆษณา",
      "arabic": "เริ่มรู้จักภาษาอาหรับ ฟังและฝึกอ่านตามครูนูรี บน Little Ummah เว็บเรียนรู้อิสลามสำหรับเด็ก ใช้ฟรี ไม่มีโฆษณา",
      "explore": "ชวนลูกสำรวจสิ่งรอบตัวและธรรมชาติผ่านกิจกรรมตามช่วงวัย บน Little Ummah เว็บเรียนรู้อิสลามสำหรับเด็ก ใช้ฟรี ไม่มีโฆษณา",
      "art": "ชวนลูกเลือกสีและระบายภาพในเกาะศิลปะ บน Little Ummah เว็บเรียนรู้อิสลามสำหรับเด็ก ใช้ฟรี ไม่มีโฆษณา"
    },
    "images": {
      "welcome": "นูรี หุ่นยนต์สีขาว น้ำเงิน และทอง ถือลูกโลกต้อนรับเด็กเข้าสู่ Little Ummah",
      "play": "นูรี หุ่นยนต์สีขาว น้ำเงิน และทอง ถือจอยเกมสำหรับกิจกรรมการเรียนรู้ใน Little Ummah"
    }
  },
  error: {
    title: errorText.title.th,
    body: errorText.body.th,
    retry: errorText.retry.th,
    home: errorText.home.th,
    reference: errorText.reference.th,
  },
  languages: {
    title: "เกาะภาษา",
    subtitle: "เลือกห้องเรียนของหนู",
    welcome: "ครูนูรีรออยู่ เลือกภาษาที่อยากเรียน แล้วมาอ่านไปด้วยกันนะ",
    enter: "เข้าห้องเรียน",
    soon: "เร็วๆ นี้",
    closedHeading: "ห้องเรียนที่กำลังเตรียม",
    names: { english: "ภาษาอังกฤษ", thai: "ภาษาไทย", arabic: "ภาษาอาหรับ", bengali: "ภาษาเบงกาลี", indonesian: "ภาษาอินโดนีเซีย" },
    courses: {
      arabic: {
        title: "ห้องเรียนภาษาอาหรับ",
        intro: "รู้จักอักษรอาหรับ ฟังครูนูรีและฝึกอ่านตามทีละตัว",
        courseDone: "เก่งมาก! เรียนครบ 28 ตัว ตั้งแต่อะลิฟถึงยาอ์แล้ว",
        courseDoneSpeech: "เก่งมากเลย หนูเรียนอักษรอาหรับครบทั้งยี่สิบแปดตัวแล้ว กลับมาทบทวนกับครูได้ทุกวันนะ",
        pathLabel: "เส้นทาง 28 อักษร",
        pathLearned: "เรียนแล้ว {count} จาก {total} ตัว",
        goalHint: "เรียนถึงยาอ์ ครบ 28 ตัว รับดาวทองดวงใหญ่",
        goalReached: "ครบ 28 ตัวแล้ว เก่งมาก!",
      },
      english: {
        title: "ห้องเรียนภาษาอังกฤษ",
        intro: "เรียนตัวอักษร A–Z คำศัพท์ และประโยคง่ายๆ ไปกับครูนูรี",
        courseDone: "เก่งมาก! เรียนครบ 26 ตัว ตั้งแต่ A ถึง Z แล้ว",
        courseDoneSpeech: ENGLISH_COURSE_DONE.th,
        pathLabel: "เส้นทาง 26 ตัวอักษร A–Z",
        pathLearned: "เรียนแล้ว {count} จาก {total} ตัว",
        goalHint: "เรียนถึง Z ครบ 26 ตัว รับดาวทองดวงใหญ่",
        goalReached: "ครบ 26 ตัวแล้ว เก่งมาก!",
      },
      thai: {
        title: "ห้องเรียนภาษาไทย",
        intro: "เรียนพยัญชนะ ก–ฮ สระ วรรณยุกต์ และคำง่ายๆ ไปกับครูนูรี",
        courseDone: "เก่งมาก! เรียนครบ 44 ตัว ตั้งแต่ ก ถึง ฮ แล้ว",
        courseDoneSpeech: THAI_COURSE_DONE.th,
        pathLabel: "เส้นทาง 44 พยัญชนะ ก–ฮ",
        pathLearned: "เรียนแล้ว {count} จาก {total} ตัว",
        goalHint: "เรียนถึง ฮ ครบ 44 ตัว รับดาวทองดวงใหญ่",
        goalReached: "ครบ 44 ตัวแล้ว เก่งมาก!",
      },
    },
  },
  arabic: {
    classroom: {
      metadataTitle: "เรียนภาษาเบื้องต้น",
      otherIslands: "ไปเกาะอื่นกัน",
      title: "ห้องเรียนภาษาอาหรับ",
      instructions: "ครูหุ่นยนต์อ่านให้ฟังก่อน แล้วเว้นจังหวะให้หนูอ่านตามออกเสียงดังๆ",
      chooseAge: "เลือกช่วงวัย",
      activeAge: "กำลังเรียนช่วงวัยนี้",
      chooseLetters: "เลือกชุดตัวอักษร",
      chooseCategory: "เลือกหมวดบทเรียน",
      activeUnit: "กำลังเรียนชุดนี้",
      idle: "กดปุ่มเริ่มเรียน แล้วครูจะสอนทีละตัว",
      paused: "พักอยู่ กดเรียนต่อเมื่อพร้อมนะ",
      teaching: "ครูกำลังสอน: {title}",
      listen: "ครูอ่านนำ ฟังให้ดีนะ",
      echo: "ตาหนูแล้ว! อ่านตามครูดังๆ",
      great: "เก่งมาก!",
      unitDone: "เรียนครบชุดนี้แล้ว เก่งมากเลย ไปชุดต่อไปกัน",
      courseDone: "เก่งมาก! เรียนครบ 28 ตัว ตั้งแต่อะลิฟถึงยาอ์แล้ว",
      courseDoneSpeech: "เก่งมากเลย หนูเรียนอักษรอาหรับครบทั้งยี่สิบแปดตัวแล้ว กลับมาทบทวนกับครูได้ทุกวันนะ",
      pathLabel: "เส้นทาง 28 อักษร",
      pathLearned: "เรียนแล้ว {count} จาก {total} ตัว",
      pathRow: "ชุดที่ {n}",
      learnedMark: "เรียนแล้ว",
      resume: "เรียนต่อจากตัวที่ค้างไว้",
      goalTitle: "เส้นชัย",
      goalHint: "เรียนถึงยาอ์ ครบ 28 ตัว รับดาวทองดวงใหญ่",
      goalReached: "ครบ 28 ตัวแล้ว เก่งมาก!",
      allDone: "เรียนครบทุกชุดแล้ว เก่งมากเลย",
      pronunciation: "อ่านว่า: {say}",
      meaning: "ความหมาย: {meaning}",
      nextUnit: "ไปชุดถัดไป",
      again: "เรียนอีกรอบ",
      start: "เริ่มเรียน",
      continue: "เรียนต่อ",
      pause: "พักก่อน",
      listenAgain: "ฟังอีกครั้ง",
      previous: "ก่อนหน้า",
      next: "ตัวถัดไป",
      progress: "{title} · บทที่ {current} จาก {total}",
      activeStep: "บทที่กำลังเรียนอยู่",
      echoSpeech: "อ่านตามครูนะ ... {say}",
      cheerSpeech: "เก่งมาก ไปดูตัวต่อไปกันนะ",
      doneSpeech: "เก่งมากเลย เรียนจบชุดนี้แล้ว พักสักหน่อย แล้วมาเรียนชุดต่อไปกับครูนะ"
    }
  },
  stories: {
    shelf: {
      metadataTitle: "เกาะเรื่องเล่า",
      title: "เรื่องจริงจากอัลกุรอาน",
      hadithTitle: "เรื่องจริงจากหะดีษ",
      hadith2Title: "เรื่องจริงจากหะดีษ ชุดที่ 2",
      back: "เกาะเรื่องเล่า",
      label: "ตู้หนังสือนิทาน",
      soon: "เร็วๆ นี้",
      soonSuffix: " (เร็วๆ นี้)",
      soonSpeech: "{title} เร็วๆ นี้"
    },
    guide: {
      replay: "ฟังครูนูรีอีกครั้ง",
      name: "ครูนูรี",
      intro: "อัสสลามุอะลัยกุม ครูนูรีเองนะ เรื่องเล่าที่นี่ เราใช้เรื่องจริงจากอัลกุรอานและหะดีษเท่านั้น ลองเลือกหนังสือบนตู้ ให้เหมาะกับวัยของเรานะ"
    },
    book: {
      metadataTitle: "นิทาน",
      label: "หนังสือนิทาน {title}",
      previous: "หน้าก่อน / Previous page",
      next: "หน้าถัดไป / Next page",
      pause: "พัก",
      again: "อ่านอีกครั้ง",
      play: "เล่นนิทาน",
      continue: "เล่นต่อ",
      cover: "ปก",
      page: "หน้า {page} / {count}",
      reading: "อ่านว่า: {reading}",
      meaning: "ความหมาย: {meaning}",
      intro: "กดปุ่มเล่น แล้วมาฟังนิทานกันนะ",
      end: "จบแล้ว"
    }
  },
  moral: {
    metadataTitle: "เกาะมารยาทและศีลธรรม",
    hero: {
      chooseAge: "เลือกช่วงวัย / Choose an age",
      skipGuide: "ข้ามคำแนะนำของหุ่นยนต์ / Skip the guide",
      hearGuide: "ฟังหุ่นยนต์แนะนำหน้านี้อีกครั้ง / Hear the robot guide again",
      skip: "ข้าม / Skip",
      hearAgain: "ฟังอีกครั้ง / Hear again"
    },
    lessons: {
      mission: "ภารกิจวันนี้",
      missionLabel: "ภารกิจวันนี้ {done} จาก {goal}",
      stars: "ดาว {count} จาก {maxStars}",
      listenAgain: "ฟังอีกครั้ง",
      close: "ปิด"
    },
    cartoon: {
      pause: "พัก",
      watchAgain: "ดูอีกครั้ง",
      play: "เล่นต่อ",
      previous: "ฉากก่อนหน้า / Previous",
      next: "ฉากถัดไป / Next",
      scene: "ฉาก {index} จาก {total}",
      sayPrompt: "ตาหนูแล้ว! พูดว่า {word}"
    }
  },
  explore: {
    metadataTitle: "เกาะสำรวจโลก",
    photoCredits: "เครดิตภาพถ่ายสัตว์",
    newTab: " (เปิดในแท็บใหม่)",
    by: "โดย"
  },
  header: {
    homeLabel: "Little Ummah หน้าแรก",
    parentsShort: "ผู้ปกครอง",
    parents: "สำหรับผู้ปกครอง",
  },
  sound: {
    label: "เสียงอ่าน",
    on: "เสียงเปิด",
    off: "เสียงปิด",
    noVoice: "อุปกรณ์นี้ยังไม่มีเสียงอ่านภาษาไทยติดตั้งไว้",
    noVoiceShort: "อุปกรณ์นี้ยังไม่มีเสียงอ่านภาษาไทย",
  },
  nav: {
    home: "หน้าแรก",
  },
  notFound: {
    title: "ไม่พบหน้านี้",
    body: "หน้าที่หาอาจย้ายไปแล้ว กดปุ่มหน้าแรกเพื่อกลับไปเลือกเกาะกันใหม่นะ",
  },
  speech: {
    logoHome: "ลิตเทิ่ล อุมมะฮ์ หน้าแรก",
    parents: "สำหรับผู้ปกครอง",
    soundOn: "เปิดเสียงแล้ว",
  },
  hero: {
    arcTitle: "Learn, Play, Grow",
    arcLearn: "Learn,",
    arcPlay: "Play,",
    arcGrow: "Grow",
    learn: "เรียนรู้",
    play: "เล่นสนุก",
    grow: "เติบโต",
    love: "รู้จักความรัก",
    obey: "เชื่อฟัง",
    trust: "ไว้วางใจ",
    parents: "คุณพ่อคุณแม่",
    faith: "และเปี่ยมไปด้วยศรัทธา",
    islam: "ด้วยอิสลาม",
    speech: "เรียนรู้ เล่นสนุก เติบโต",
  },
  footer: {
    label: "ท้ายเว็บ",
    motto: "อุมมะฮ์ตัวน้อยในวันนี้ คือ ผู้ใหญ่ในวันหน้า",
    promisesTitle: "สัญญาของเรา",
    promiseFree: "ทุกคนเข้าใช้ได้แบบฟรี (Freemium)",
    promiseNoAds: "ไม่มีโฆษณา",
    promiseNoTracking: "ข้อมูลเด็กไม่ออกจากเครื่อง",
    sources: "เนื้อหาศาสนาจากอัลกุรอานและหะดีษเศาะฮีห์ ตรวจกับตำราต้นฉบับ",
    sourcesLink: "ดูหลักฐานและแนวทางเนื้อหา",
    islandsTitle: "ไปเกาะไหนดี",
    sponsorTitle: "ผู้สนับสนุนค่าใช้จ่าย",
    sponsorThanks: "สนับสนุนโครงการดีๆ โดยบริษัท ชูฮาดา จำกัด",
    sponsorName: "ชูฮาดา",
    parents: "สำหรับผู้ปกครอง",
    home: "หน้าแรก",
    copyright: "© {year} Little Ummah",
  },
  islandOrbit: {
    label: "วงเกาะ เลือกเกาะที่อยากไป",
    hint: "ปัดซ้าย–ขวา หรือกดลูกศร เพื่อหมุนดูเกาะอื่น",
    prev: "เกาะก่อนหน้า",
    next: "เกาะถัดไป",
    position: "เกาะที่ {n} จาก {total}",
  },
  ageGroupSelector: {
    kidsLabel: "วัย 3-6 ปี",
    kidsHint: "เรียนรู้ผ่านการเล่น",
    juniorsLabel: "วัย 7 ปีขึ้นไป",
    juniorsHint: "อ่านเองได้ สำรวจเอง",
    label: "เลือกช่วงวัย",
  },
  valueBar: {
    label: "ทางลัดไปหมวดการเรียนรู้",
  },
  otherIslands: {
    title: "ไปเกาะอื่นกัน",
    hint: "เรียนรู้เรื่องราวดีๆ อีกมากมาย",
  },
  logo: {
    brand: "Little Ummah",
    today: "อุมมะฮ์ตัวน้อยในวันนี้",
    tomorrow: "คือ ผู้ใหญ่ในวันหน้า",
  },
  ageHome: {
    kidsTitle: "วัย 3-6 ปี",
    kidsHint: "เรียนรู้ผ่านการเล่น แตะเกาะที่อยากไปได้เลย",
    juniorsTitle: "วัย 7 ปีขึ้นไป",
    juniorsHint: "อ่านเองได้ สำรวจเอง เลือกเกาะที่อยากเรียนรู้",
  },
  lessonCard: {
    reading: "อ่านว่า:",
    meaning: "ความหมาย:",
    listen: "ฟัง",
  },
  gameNavigation: {
    games: "หน้าเกม",
  },
  gameTile: {
    soon: "เร็วๆ นี้",
    play: "{pairs} คู่ · เล่นเลย",
  },
  memoryGame: {
    ready: "กดเริ่มเล่นเพื่อสับการ์ด",
    started: "เริ่มแล้ว เลือกการ์ดสองใบที่มีภาพเหมือนกัน",
    choose: "เลือกการ์ดสองใบที่มีภาพเหมือนกัน",
    opened: "เปิด {name} เลือกอีกหนึ่งใบ",
    found: "จับคู่ {name} ได้แล้ว",
    mismatch: "{first} กับ {name} ยังไม่เหมือนกัน ลองจำภาพไว้นะ",
    praise: "เก่งมาก",
    wonAnnouncement: "เก่งมาก! จับคู่ครบ {pairs} คู่ ใช้ {moves} ครั้ง",
    progress: "เก่งมาก จับคู่ได้ {found} จาก {pairs} คู่",
    hiddenAnnouncement: "คว่ำการ์ดแล้ว ลองเลือกคู่อีกครั้ง",
    title: "จับคู่ภาพ",
    groupPairs: "{group} · {pairs} คู่",
    help: "แตะการ์ดสองใบ หาภาพที่เหมือนกัน",
    pairsFound: "จับคู่ได้ {found} / {pairs}",
    pairsCaption: "จับคู่ได้",
    moves: "เปิดแล้ว {moves} ครั้ง",
    movesCaption: "เปิดแล้ว",
    start: "เริ่มเล่น",
    wellDone: "เก่งมาก!",
    complete: "จับคู่ครบแล้ว มาเล่นกันอีกนะ",
    again: "เล่นอีกครั้ง",
    card: "การ์ดใบที่ {index}, {state}{matched}",
    faceDown: "คว่ำอยู่",
    matchedSuffix: ", จับคู่แล้ว",
    matched: "จับคู่แล้ว",
  },
  learnIndex: {
    metadataTitle: "เกาะการเรียนรู้ทั้งหมด",
    title: "เลือกเกาะที่อยากไป",
  },
  islandPage: {
    metadataTitle: "เกาะ{name}",
    metadataFallback: "เกาะการเรียนรู้",
  },
  memoryPage: {
    metadataTitle: "จับคู่ภาพ — เลือกช่วงวัย",
    easyTitle: "จับคู่ภาพ — วัย 3-6 ปี",
    hardTitle: "จับคู่ภาพ — วัย 7 ปีขึ้นไป",
    hint: "เลือกช่วงวัย แล้วมาเริ่มจับคู่กัน",
  },
  layout: {
    title: "Little Ummah — เรียนรู้ เล่นสนุก เติบโต",
    titleTemplate: "%s | Little Ummah",
    description: "เว็บไซต์เรียนรู้อิสลามสำหรับเด็ก เรียนรู้ศรัทธา สร้างมารยาทที่ดี และเติบโตเป็นคนดีของโลกใบนี้ สำหรับเด็กวัย 3-6 ปี และ 7 ปีขึ้นไป",
  },
  obeyArc: {
    title: "Love, Believe, Obey",
    love: "Love,",
    believe: "Believe,",
    obey: "Obey",
  },
  // ข้อความระบบเกม
  games: {
    // บทที่มีคำกล่าวซิกรุ (ไม่ใช่อายะฮ์) — Claude ตรวจเอง (AGENTS.md ข้อ 4) หน้าอังกฤษใช้คำทับศัพท์ที่เด็กมุสลิมทั่วโลกคุ้น
    dhikr: {
      countGo: "บิสมิลลาฮ์ เริ่มกันเลย",
      mashaAllah: "มาชาอัลลอฮ์",
      lightMazeHalf: "มาชาอัลลอฮ์ ตั้งใจเก็บแสงได้ดีเลย",
      lightMazeComplete: "อัลฮัมดุลิลลาฮ์ เก็บแสงครบแล้ว",
    },
    countdown: {
      three: "สาม",
      two: "สอง",
      one: "หนึ่ง",
      go: "เริ่ม!",
      announcement: "เริ่ม! Go!"
    },
    hub: {
      title: "เกาะเกม",
      intro: "เลือกหมวดที่ชอบ แล้วไปเล่นกันเลย",
      chooseCategory: "เลือกหมวดเกม / Choose a category",
      ageUnit: "ปี",
      collected: "สะสมแล้ว {stars} ดาว",
      playLabel: "เล่น {name} · สะสม {stars} ดาว",
      soon: "กำลังเตรียม",
      soonLabel: "{name} กำลังเตรียม ยังเล่นไม่ได้",
      soonBody: "นูรีกำลังเตรียมเกมนี้อยู่นะ อีกไม่นานมาเล่นกัน",
      soonClose: "ตกลง",
      metadataTitle: "เกาะแห่งการเล่น — Mini Game Center",
      metadataDescription: "เกมเรียนรู้สำหรับเด็ก 9 เกม จับคู่สี รูปทรง ความจำ จิ๊กซอว์ และอักษรอาหรับ"
    },
    intro: {
      listen: "ฟังวิธีเล่น / Listen",
      choose: "เลือกด่าน",
      level: "ด่าน",
      play: "ไปเล่นกันเลย!",
      mazeHelp: "กดปุ่มทิศ ปัดนิ้ว หรือแตะทางที่จะไป",
      tap: "แตะภาพเพื่อเล่น",
      drag: "แตะชิ้น แล้วแตะช่อง หรือลากไปวาง",
      picture: " ภาพ{name}"
    },
    player: {
      loading: "กำลังเตรียมเกม…",
      notFound: "ไม่พบเกม"
    },
    shell: {
      correct: "ถูกแล้ว! • Well done!",
      retry: "ลองอีกครั้งนะ • Try again",
      hub: "รวมเกม",
      sound: "เสียงเกม / Game sound",
      soundOn: "เสียงเปิด",
      soundOff: "เสียงปิด",
      level: "ด่าน",
      progress: "ความคืบหน้าด่าน / Level progress",
      listen: "ฟังวิธีเล่น",
      ready: "พร้อมแล้ว ลองเลย! • You can do it!",
      choose: "เลือกด่านใหม่",
      restart: "เริ่มใหม่",
      celebrateAlt: "หุ่นยนต์ร่วมยินดี",
      complete: "เก่งมาก ผ่านด่านแล้ว!",
      stars: "ได้รับ 3 ดาว",
      next: "ด่านต่อไป",
      again: "เล่นอีกครั้ง",
      more: "เลือกเกมใหม่",
      noVoice: "อุปกรณ์นี้ไม่มีเสียงอ่าน ใช้ภาพและคำแนะนำบนหน้าจอได้เลย",
      result: "เก่งมาก ผ่านด่าน {level} แล้ว!",
      collected: "สะสมเกมนี้ {stars} ดาว ",
      collectedSecondary: "• {stars} stars collected"
    },
    hubProgress: {
      stars: "ดาว",
      collected: "สะสม {stars} ดาว"
    },
    tutorial: {
      skip: "ข้ามการสอน"
    },
    rotate: {
      title: "หมุนจอให้นอนก่อนนะ แล้วมาเล่นกัน",
      fullscreen: "เปิดเต็มจอ"
    },
    voiceIntro: {
      start: "เริ่มเล่น",
      ready: "หุ่นยนต์บอกวิธีเล่นจบแล้ว",
      speaking: "หุ่นยนต์กำลังบอกวิธีเล่น กดเริ่มเล่นข้ามได้",
      again: "ฟังวิธีเล่นอีกครั้ง / Listen again"
    },
    find: {
      find: "หา…"
    },
    lightMaze: {
      starSpeech: "ได้พลังแสงแล้ว เพื่อนหุ่นยนต์จะหลบให้สักครู่นะ",
      slowSpeech: "เพื่อนหุ่นยนต์เดินช้าลงแล้ว ค่อยๆ เลือกทางนะ",
      shieldSpeech: "ได้โล่แล้ว ช่วยกันการแตะได้หนึ่งครั้ง",
      warpSpeech: "ประตูนี้พาไปอีกจุด ลองเลือกทางต่อได้เลย",
      bumpSpeech: "ไม่เป็นไร แสงยังอยู่ครบ เราไปต่อกันนะ",
      starToast: "พลังแสง! เพื่อนหุ่นหลบให้ • Light power!",
      slowToast: "เพื่อนเดินช้าลง • Robots slow down",
      shieldToast: "ได้โล่ 1 ครั้ง • Shield on",
      shieldUsed: "โล่ช่วยไว้แล้ว • Shield used",
      warp: "วาร์ป! • Warp!",
      checkpoint: "ถึงจุดพัก • Rest spot saved",
      safe: "ไม่เป็นไร แสงยังอยู่ครบ • Your lights are safe",
      power: "★ พลังแสง",
      slow: "◷ ช้าลง",
      shield: "◈ โล่ 1",
      move: "ปุ่มพาหุ่นลูกกลมเดิน / Move the robot",
      board: "เขาวงกตแสง {name} เหลือเม็ดแสง {left} เม็ด ใช้ปุ่มทิศหรือลูกศรพาหุ่นลูกกลมเดิน / Light maze, {left} lights left",
      upLeft: "ซ้ายบน",
      upRight: "ขวาบน",
      downLeft: "ซ้ายล่าง",
      downRight: "ขวาล่าง"
    },
    matching: {
      leftRight: "ซ้าย → ขวา • Left → right",
      tapDrag: "แตะชิ้น → แตะช่อง หรือลาก • Tap → tap, or drag",
      hint: "คำใบ้",
      hide: "ซ่อนภาพช่วย",
      show: "ดูภาพช่วย",
      unavailable: "ภาพยังไม่พร้อม จับคู่ตัวเลขแทนได้เลย",
      destinations: "ช่องวาง / Destinations",
      selectFirst: "แตะเลือกชิ้นก่อน แล้วแตะช่องนี้",
      pieces: "ชิ้นที่เลือกได้ / Pieces",
      placed: "วางแล้ว {done} จาก {total} ชิ้น",
      trySlot: "ลองวาง {name} ในช่องที่มีลูกศร",
      placedCount: " วางแล้ว {n}",
      placedItem: "วาง {name} แล้ว",
      selected: "เลือก {name} แล้ว แตะช่องที่ตรงกัน",
      pictureGuide: "Picture guide"
    },
    memory: {
      board: "กระดานการ์ดความจำ / Memory card board",
      matched: " จับคู่แล้ว",
      moves: "เปิดไปแล้ว {moves} ครั้ง ",
      movesSecondary: "· {moves} moves",
      card: "เปิดการ์ด {index} / Card {index}"
    },
    puzzle: {
      help: "แตะชิ้นภาพ แล้วแตะช่องในถาด หรือลากไปวาง",
      retry: "ยังไม่ใช่ช่องนี้ ดูภาพช่วยในถาดแล้วลองใหม่นะ",
      selectFirst: "แตะเลือกชิ้นภาพก่อน แล้วแตะช่องในถาด",
      hide: "ซ่อนภาพช่วย",
      show: "ดูภาพช่วย",
      hint: "คำใบ้",
      placed: " วางแล้ว / placed",
      pieces: "ชิ้นภาพที่รอวาง / Puzzle pieces",
      selected: "เลือกชิ้นภาพแล้ว แตะช่องในถาดที่รูปร่างตรงกัน",
      placedCount: "วางแล้ว {done} จาก {total} ชิ้น",
      hintSlot: "ลองวางชิ้นที่เลือกในช่องที่มีลูกศร ช่องที่ {index}",
      tray: "ถาดจิ๊กซอว์ ภาพ{name} / Puzzle tray: {secondary}",
      slot: "ช่องที่ {index} / Slot {index}{placed}",
      piece: "ชิ้นภาพที่ {index} ของภาพ{name} / Piece {index} of {secondary}",
      pictureGuide: "Picture guide"
    },
    sequence: {
      retry: "ลองเปรียบเทียบกับชิ้นอื่น แล้ววางใหม่ได้นะ",
      hint: "คำใบ้",
      order: "แผ่นทองเรียงจากซ้ายหน้าไปขวาหลัง / Order from front left to back right",
      selectFirst: "เลือกของเล่นก่อน แล้วแตะแผ่นทอง",
      toys: "ของเล่นที่รอเรียง / Toys to order",
      help: "{name} แตะของเล่น แล้วแตะแผ่นทอง หรือลากไปวาง เริ่มจากแผ่นซ้ายหน้า",
      placedCount: "วาง {name} ถูกแล้ว {done} จาก {total} ชิ้น",
      hintTile: "ลองวาง {name} บนแผ่นทองที่มีลูกศร แผ่นที่ {index}",
      placed: ": {name} วางแล้ว / {secondary}, placed",
      position: "แผ่นที่ {index} / Position {index}{placed}",
      selected: "เลือก {name} แล้ว แตะแผ่นทองที่ต้องการวาง",
      picked: "เลือก {name} แล้ว ",
      pickedSecondary: "· {name} selected"
    },
    shape: {
      loading: "กำลังเตรียมภาพ รอสักครู่",
      loadFailed: "โหลดภาพไม่สำเร็จ ลองวางชิ้นเดิมอีกครั้ง",
      hint: "คำใบ้",
      island: "เกาะหยอดรูปทรง / Shape sorter island",
      placed: " หยอดแล้ว",
      selectFirst: "แตะเลือกชิ้นรูปทรงก่อน แล้วแตะช่องนี้",
      pieces: "ชิ้นรูปทรงของเรา / Our shape pieces",
      placedCount: "หยอด {name} ลงช่องแล้ว {done} จาก {total} ชิ้น",
      hintSlot: "ลองหยอด {name} ในช่องที่มีลูกศร",
      slot: "ช่อง{name} / {secondary} slot{placed}",
      placedItem: "หยอด {name} แล้ว",
      selected: "เลือก {name} แล้ว แตะช่องที่ตรงกัน",
      picked: "เลือก {name} แล้ว ",
      pickedSecondary: "· {name} selected"
    },
    audio: {
      great: "เก่งมาก",
      correct: "ถูกต้อง",
      retry: "ลองอีกครั้งนะ",
      close: "ใกล้แล้ว สู้ๆ นะ",
      complete: "เย้ ผ่านด่านแล้ว"
    },
    error: {
      title: "พักสักนิด แล้วลองใหม่",
      retry: "ลองใหม่",
      hub: "รวมเกม"
    }
  },
};
