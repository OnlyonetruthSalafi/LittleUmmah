import { PlayIcon } from "@/components/icons/PlayIcon";
import { Button } from "@/components/ui/Button";

/*
  หัวเรื่องให้ภาษาไทยนำและตัวใหญ่กว่า ตามข้อกำหนด "ไทยนำ อังกฤษรอง"
  รอบแรกผมทำอังกฤษนำตาม mockup ซึ่งขัดข้อกำหนดของโปรเจกต์เอง

  สามสีของ mockup ย้ายมาอยู่กับคำไทยแทน จึงยังได้เอกลักษณ์เดิมโดยไม่ผิดลำดับภาษา
  บรรทัดอังกฤษกำกับ lang="en" ให้ screen reader ออกเสียงถูกภาษา
  leading กว้างและไม่ล็อกความสูง เพื่อไม่ให้สระบนกับวรรณยุกต์ของฟอนต์ไทยโดนตัด
*/
export function Hero() {
  return (
    <section className="mx-auto w-full max-w-3xl px-4 pt-6 pb-10 text-center sm:px-6 sm:pt-10 sm:pb-14">
      <h1 className="font-display text-3xl leading-[1.5] font-extrabold tracking-tight sm:text-5xl lg:text-6xl">
        <span className="text-brand-blue">เรียนรู้</span>{" "}
        <span className="text-brand-amber">เล่นสนุก</span>{" "}
        <span className="text-brand-green">เติบโต</span>
      </h1>

      <p
        lang="en"
        className="font-display text-ink-soft mt-1 text-xl font-bold sm:text-3xl"
      >
        Learn, Play, Grow
      </p>

      <p className="text-ink mt-4 text-lg font-semibold sm:mt-5 sm:text-xl">
        โลกที่สดใสกว่า เพื่อเด็กรุ่นใหม่ที่สดใส
      </p>
      <p className="text-ink-soft mx-auto mt-2 max-w-xl text-base sm:text-lg">
        รู้จักอิสลาม สร้างมารยาทที่ดี และทำให้พรุ่งนี้ใจดีขึ้นกว่าเดิม
      </p>

      <div className="mt-7 flex justify-center sm:mt-9">
        <Button
          href="#choose-age"
          speak="เริ่มสำรวจเลย"
          speakKey="start-exploring"
        >
          <PlayIcon className="text-sun-ink size-8 shrink-0" />
          เริ่มสำรวจเลย
        </Button>
      </div>
    </section>
  );
}
