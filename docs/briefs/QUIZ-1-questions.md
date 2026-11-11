# QUIZ-1: คำถามท้ายบทวัย 7+ (roadmap 10.2 ข้อ 3) — ตัวบทคำถาม (Claude เขียน 11 พ.ย. 2026)

ใช้กับบท **วัย 7+** ของเกาะอิสลามพื้นฐาน (`src/features/faith/data.ts` LESSONS.juniors) และเกาะมารยาท (`src/lib/lessons.ts` moral.juniors)
1 ข้อต่อบท แตะเลือก 1 ใน 3 · คำตอบที่ถูกมาจาก `body` ของบทนั้นเท่านั้น ไม่มีเนื้อหาศาสนาใหม่ · ตอบถูก = ได้ดาวเรียนรู้ของบทนั้นตามกติกาเดิม (1 ดวง/บท/วัน) ตอบผิด = ลองใหม่ได้ ไม่หักดาว ไม่จับเวลา

**กติกาตัวเลือกฝั่งศรัทธา:** ทุกตัวเลือกเป็นข้อความจริงจากบทอื่นในเกาะเดียวกัน — ผิดเพราะ "ไม่ได้ตอบคำถามนี้" ไม่ใช่เพราะเป็นความเชื่อผิด
จึงไม่มีตัวเลือกที่กล่าวถึงอัลลอฮ์ผิดๆ (เช่น ห้าม "อัลลอฮ์อยู่ทุกที่" ทุกกรณี — ตาม comment หัวไฟล์ faith/data.ts) ภาพตัวเลือกใช้ภาพการ์ดของบทนั้น (`/faith/card-*.webp`)
**ฝั่งมารยาท:** ตัวเลือกผิดเป็นพฤติกรรมเล็กๆ ที่ไม่อันตราย ไม่มีการโทษสัตว์/คนอื่น

ข้อความเมื่อตอบผิด (ทุกข้อ): th "ยังไม่ใช่นะ ลองฟังอีกทีแล้วเลือกใหม่" · en "Not quite. Listen again and choose once more."
ข้อความเมื่อตอบถูก: th "ถูกต้อง!" + ทวน `body` ของบท · en "That's right!" + `body.en`

## เกาะอิสลามพื้นฐาน 7+

| บท | คำถาม (th / en) | ✔ ถูก | ✘ ตัวเลือก 2 | ✘ ตัวเลือก 3 |
|---|---|---|---|---|
| faith-usul | หลักพื้นฐานสามประการ คือการรู้จักอะไรบ้าง / The three fundamentals are knowing what? | พระเจ้าของเรา ศาสนาของเรา และนบีของเรา / Our Lord, our religion and our Prophet | ปฏิญาณตน ละหมาด ซะกาต ถือศีลอด และฮัจญ์ / The testimony, prayer, zakah, fasting and Hajj | เคารพภักดีอัลลอฮ์เสมือนว่าเราเห็นพระองค์ / Worshipping Allah as though we see Him |
| faith-aina-j | อัลลอฮ์ทรงอยู่ที่ไหน / Where is Allah? | ทรงอยู่เบื้องสูง ทรงสถิตอยู่บนบัลลังก์ / Above, established over the Throne | ศาสนาของเราคืออิสลาม / Our religion is Islam | นบีของเราคือท่านนบีมุฮัมมัด ﷺ / Our Prophet is Muhammad ﷺ |
| faith-shahada | ลาอิลาฮะอิลลัลลอฮ์ มีความหมายว่าอะไร / What does La ilaha illallah mean? | ไม่มีผู้ใดสมควรได้รับการเคารพภักดีโดยชอบธรรม นอกจากอัลลอฮ์ / None has the right to be worshipped except Allah | ศรัทธาต่ออัลลอฮ์ มลาอิกะฮ์ คัมภีร์ ร่อซูล วันสุดท้าย และกอดัร / Belief in Allah, the angels, the books, the messengers, the Last Day and qadar | รู้จักพระเจ้าของเรา ศาสนาของเรา และนบีของเรา / Knowing our Lord, our religion and our Prophet |
| faith-islam | ข้อไหนคือรุก่นอิสลามห้าประการ / Which are the five pillars of Islam? | ปฏิญาณตน ละหมาด ซะกาต ถือศีลอด และฮัจญ์ | ศรัทธาต่ออัลลอฮ์ มลาอิกะฮ์ คัมภีร์ ร่อซูล วันสุดท้าย และกอดัร | รู้จักพระเจ้าของเรา ศาสนาของเรา และนบีของเรา |
| faith-iman | ข้อไหนคือรุก่นอีมานหกประการ / Which are the six pillars of iman? | ศรัทธาต่ออัลลอฮ์ มลาอิกะฮ์ คัมภีร์ ร่อซูล วันสุดท้าย และกอดัร | ปฏิญาณตน ละหมาด ซะกาต ถือศีลอด และฮัจญ์ | เคารพภักดีอัลลอฮ์เสมือนว่าเราเห็นพระองค์ |
| faith-ihsan | เอี๊ยะซาน คืออะไร / What is ihsan? | เคารพภักดีอัลลอฮ์เสมือนว่าเราเห็นพระองค์ | ไม่มีผู้ใดสมควรได้รับการเคารพภักดีโดยชอบธรรม นอกจากอัลลอฮ์ | ปฏิญาณตน ละหมาด ซะกาต ถือศีลอด และฮัจญ์ |

(อังกฤษของตัวเลือกซ้ำ = ใช้ `body.en` ของบทต้นทางตรงตัว)

## เกาะมารยาท 7+

| บท | คำถาม | ✔ ถูก | ✘ | ✘ |
|---|---|---|---|---|
| parents | เมื่อพ่อแม่เรียกใช้ เราควรพูดกับท่านอย่างไร / When your parents ask you to do something, how should you speak to them? | พูดด้วยคำพูดที่อ่อนโยน / With gentle words | ทำเสียง “อุฟ” แสดงความรำคาญ / Say “uff” to show you are annoyed | ทำเป็นไม่ได้ยิน / Pretend not to hear |
| truth | ทำแก้วน้ำหก แล้วแม่ถามว่าใครทำ เราควรทำอย่างไร / You spilled the water and Mum asks who did it. What should you do? | พูดความจริง แม้อาจโดนดุ / Tell the truth, even if you might be scolded | บอกว่าไม่รู้ / Say you don't know | รีบเดินหนีไป / Quickly walk away |
| sneeze | เพื่อนจามแล้วกล่าว อัลฮัมดุลิลลาฮ์ เราตอบว่าอะไร / Your friend sneezes and says Alhamdulillah. What do you reply? | ยัรฮะมุกัลลอฮ์ / Yarhamukallah | ยะฮ์ดีกุมุลลอฮ์ วะยุศลิหุบาละกุม (คำนี้คนที่จามเป็นคนตอบ) / Yahdikumullah wa yuslihu balakum (the sneezer says this) | อัสสลามุอะลัยกุม / Assalamu alaikum |
| animals | เห็นสัตว์ที่กระหายน้ำ เราควรทำอย่างไร / You see a thirsty animal. What should you do? | ให้น้ำมันดื่ม / Give it water to drink | ไล่มันไป / Chase it away | เดินผ่านไปเฉยๆ / Just walk past |
| permission | ขออนุญาตเข้าบ้านเพื่อนสามครั้งแล้ว ยังไม่มีใครอนุญาต เราควรทำอย่างไร / You asked to enter three times and nobody said yes. What should you do? | กลับไปก่อน / Go back for now | เปิดประตูเข้าไปเลย / Open the door and go in | เคาะแรงๆ ไม่หยุด / Keep banging on the door |
| calm | เมื่อรู้สึกโกรธ เราควรกล่าวว่าอะไร / When you feel angry, what should you say? | อะอูซุบิลลาฮิมินัชชัยฏอนิรรอญีม / A'udhu billahi minash-shaytanir-rajim | ยัรฮะมุกัลลอฮ์ / Yarhamukallah | ตะโกนใส่เพื่อน (ไม่ใช่คำที่ควรพูด) / Shout at your friend |
| keep-promise | นัดเพื่อนไว้แต่ไปไม่ได้ เราควรทำอย่างไร / You made a plan with a friend but cannot go. What should you do? | รีบบอกเพื่อน / Tell your friend quickly | ไม่บอก ปล่อยให้เพื่อนรอ / Say nothing and let them wait | บอกเพื่อนทีหลังว่าลืม / Tell them later that you forgot |
| save-water-power | แปรงฟันเสร็จแล้ว ควรทำอย่างไรกับก๊อกน้ำ / You finished brushing your teeth. What do you do with the tap? | ปิดก๊อกให้สนิท / Turn it off fully | เปิดทิ้งไว้ / Leave it running | เปิดให้แรงขึ้น / Turn it up |
| listen-friend | เพื่อนกำลังเล่าเรื่องให้ฟัง เราควรทำอย่างไร / Your friend is telling you something. What should you do? | ฟังให้จบ แล้วค่อยพูดหรือถาม / Listen to the end, then speak or ask | พูดแทรกทันที / Interrupt straight away | หันไปทำอย่างอื่น / Turn away and do something else |
| shared-things | ยืมหนังสือห้องสมุดมาอ่าน เราควรใช้อย่างไร / You borrowed a library book. How should you use it? | ใช้อย่างเบามือ ให้เพื่อนคนถัดไปได้อ่านด้วย / Handle it gently so the next reader can enjoy it | พับมุมหน้ากระดาษเยอะๆ / Fold down lots of page corners | ขีดเขียนลงในหนังสือ / Write in the book |

## หมายเหตุสำหรับ UI (brief แยกหลัง NURI-1)
- แสดงหลังการ์ตูนจบ เฉพาะเมื่อวัย = 7+ · วัย 3–6 ยังได้ดาวจากการดูจบตามเดิม (ตัดสิน 1 พ.ย.)
- สลับลำดับตัวเลือกแบบคงที่ (seed จาก id บท) ไม่ใช้ `Math.random`
- ตัวเลือกต้องมีข้อความ + เครื่องหมายถูก/ผิดหลังเลือก ไม่ใช้สีอย่างเดียว · ปุ่ม ≥64px · นูรีอ่านคำถามและตัวเลือก (เสียงใหม่ — Claude อัดจากตารางนี้)
- คำอาหรับในตัวเลือก (ยัรฮะมุกัลลอฮ์ ฯลฯ) ใช้คำอ่านไทยแบบเดียวกับบทเดิม ไม่ใช่อายะฮ์ จึงให้นูรีอ่านได้
