"use client";

import { motion } from "framer-motion";
import { useTranslations } from "next-intl";

import LanguageSwitcher from "@/components/LanguageSwitcher";
import { useDirection } from "@/lib/direction";
import { Link } from "@/navigation";

const featureKeys = [
  ["feature1Emoji", "feature1Title", "feature1Desc"],
  ["feature2Emoji", "feature2Title", "feature2Desc"],
  ["feature3Emoji", "feature3Title", "feature3Desc"],
  ["feature4Emoji", "feature4Title", "feature4Desc"]
] as const;

const howKeys = [
  ["how1Title", "how1Desc"],
  ["how2Title", "how2Desc"],
  ["how3Title", "how3Desc"]
] as const;

const notCourseNoKeys = ["notCourseNo1", "notCourseNo2", "notCourseNo3"] as const;
const notCourseYesKeys = ["notCourseYes1", "notCourseYes2", "notCourseYes3"] as const;
const forKeys = ["for1", "for2", "for3"] as const;

const faqKeys = [
  ["faq1Q", "faq1A"],
  ["faq2Q", "faq2A"],
  ["faq3Q", "faq3A"],
  ["faq4Q", "faq4A"],
  ["faq5Q", "faq5A"]
] as const;

const sectionTransition = {
  duration: 0.55
};

function Section({
  id,
  className,
  children
}: {
  id?: string;
  className?: string;
  children: React.ReactNode;
}) {
  return (
    <motion.section
      id={id}
      initial={{ opacity: 0, y: 40 }}
      whileInView={{ opacity: 1, y: 0 }}
      viewport={{ once: true, margin: "-100px" }}
      transition={sectionTransition}
      className={className}
    >
      {children}
    </motion.section>
  );
}

function FloatingShape({
  className,
  duration,
  delay
}: {
  className: string;
  duration: number;
  delay?: number;
}) {
  return (
    <motion.div
      aria-hidden="true"
      className={className}
      animate={{ y: [0, -20, 0] }}
      transition={{ duration, delay, repeat: Infinity, ease: "easeInOut" }}
    />
  );
}

export default function LandingPage() {
  const t = useTranslations("landing");
  const { dir } = useDirection();

  return (
    <div className="bg-white text-slate-900">
      <header className="sticky top-0 z-50 border-b border-slate-200 bg-white/90 backdrop-blur">
        <div
          dir="ltr"
          className="mx-auto flex h-16 max-w-6xl items-center justify-between gap-4 px-4 md:px-8"
        >
          <Link href="/" className="flex items-center gap-2 text-xl font-bold text-indigo-600">
            <span>{t("brand")}</span>
            <svg
              aria-hidden="true"
              viewBox="0 0 12 12"
              className="h-3 w-3 -translate-y-0.5 fill-indigo-600"
            >
              <path d="M1 2h6.2L4.6 0l1.4 0L11 5.5 6 11 4.6 11l2.6-2H1z" />
            </svg>
          </Link>

          <div dir={dir} className="flex items-center gap-3 md:gap-6">
            <nav className="hidden items-center gap-6 sm:flex">
              <a href="#vision" className="text-sm font-medium text-slate-500 hover:text-slate-900">
                {t("navVision")}
              </a>
              <a href="#how" className="text-sm font-medium text-slate-500 hover:text-slate-900">
                {t("navHow")}
              </a>
              <a href="#faq" className="text-sm font-medium text-slate-500 hover:text-slate-900">
                {t("navFaq")}
              </a>
            </nav>
            <div className="scale-90">
              <LanguageSwitcher />
            </div>
            <motion.div
              animate={{ scale: [1, 1.02, 1] }}
              transition={{ duration: 3, repeat: Infinity, ease: "easeInOut" }}
            >
              <Link
                href="/signup"
                className="rounded-lg bg-indigo-600 px-4 py-2 text-sm font-medium text-white transition-colors hover:bg-indigo-700"
              >
                {t("navJoin")}
              </Link>
            </motion.div>
          </div>
        </div>
      </header>

      <main>
        <section className="relative flex min-h-[85vh] items-center overflow-hidden px-4 py-20 md:px-8">
          <div className="pointer-events-none absolute inset-0">
            <div className="absolute inset-y-0 start-1/2 -translate-x-1/2 text-[280px] font-bold leading-none text-slate-100 opacity-60 md:text-[420px]">
              &gt;
            </div>
            <FloatingShape
              className="absolute start-[8%] top-24 h-12 w-12 rounded-full bg-indigo-50"
              duration={6}
            />
            <FloatingShape
              className="absolute end-[10%] top-36 h-20 w-20 rounded-2xl bg-slate-100"
              duration={8}
              delay={0.5}
            />
            <FloatingShape
              className="absolute bottom-24 start-[18%] h-16 w-16 rounded-full border border-slate-200"
              duration={5}
              delay={0.2}
            />
            <FloatingShape
              className="absolute bottom-16 end-[14%] h-24 w-24 rounded-3xl bg-indigo-50/80"
              duration={7}
              delay={0.8}
            />
          </div>

          <div className="relative mx-auto w-full max-w-5xl text-start">
            <motion.p
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.5, delay: 0 }}
              className="text-sm font-semibold uppercase tracking-[0.28em] text-indigo-600"
            >
              {t("heroEyebrow")}
            </motion.p>
            <motion.h1
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.5, delay: 0.1 }}
              className="mt-6 max-w-4xl text-6xl font-bold leading-[0.95] md:text-7xl"
            >
              <span className="bg-gradient-to-r from-indigo-600 to-sky-500 bg-clip-text text-transparent">
                {t("heroTitle")}
              </span>
            </motion.h1>
            <motion.p
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.5, delay: 0.2 }}
              className="mt-6 max-w-2xl text-xl leading-relaxed text-slate-500"
            >
              {t("heroSub")}
            </motion.p>
            <motion.div
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.5, delay: 0.3 }}
              className="mt-10"
            >
              <motion.div
                animate={{ scale: [1, 1.02, 1] }}
                transition={{ duration: 3, repeat: Infinity, ease: "easeInOut" }}
                className="inline-flex"
              >
                <Link
                  href="/signup"
                  className="inline-flex rounded-lg bg-indigo-600 px-8 py-4 text-lg font-medium text-white transition-colors hover:bg-indigo-700"
                >
                  {t("heroCta")}
                </Link>
              </motion.div>
            </motion.div>
            <motion.p
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.5, delay: 0.4 }}
              className="mt-4 text-sm text-slate-400"
            >
              {t("heroMeta")}
            </motion.p>
          </div>
        </section>

        <Section className="bg-white px-4 py-24 md:px-8">
          <div className="mx-auto max-w-4xl">
            <h2 className="text-3xl font-bold text-slate-900 md:text-4xl">{t("problemTitle")}</h2>
            <div className="mt-10 space-y-4">
              <motion.p
                initial={{ opacity: 0, y: 40 }}
                whileInView={{ opacity: 1, y: 0 }}
                viewport={{ once: true, margin: "-100px" }}
                transition={{ duration: 0.5, delay: 0.05 }}
                className="text-2xl leading-relaxed text-slate-500"
              >
                {t("problem1")}
              </motion.p>
              <motion.p
                initial={{ opacity: 0, y: 40 }}
                whileInView={{ opacity: 1, y: 0 }}
                viewport={{ once: true, margin: "-100px" }}
                transition={{ duration: 0.5, delay: 0.15 }}
                className="text-3xl font-bold leading-tight text-slate-900 md:text-4xl"
              >
                {t("problem2")}
              </motion.p>
              <motion.p
                initial={{ opacity: 0, y: 40 }}
                whileInView={{ opacity: 1, y: 0 }}
                viewport={{ once: true, margin: "-100px" }}
                transition={{ duration: 0.5, delay: 0.25 }}
                className="text-xl leading-relaxed text-slate-500"
              >
                {t("problem3")}
              </motion.p>
            </div>
          </div>
        </Section>

        <Section id="vision" className="bg-slate-50 px-4 py-24 md:px-8">
          <div className="mx-auto max-w-4xl">
            <h2 className="text-3xl font-bold text-indigo-600 md:text-4xl">{t("visionTitle")}</h2>
            <p className="mt-6 max-w-3xl text-xl leading-relaxed text-slate-600">
              {t("visionText")}
            </p>
          </div>
        </Section>

        <Section id="how" className="bg-white px-4 py-24 md:px-8">
          <div className="mx-auto max-w-6xl">
            <h2 className="text-center text-3xl font-bold text-slate-900 md:text-4xl">
              {t("howTitle")}
            </h2>
            <div className="mt-12 grid grid-cols-1 gap-8 md:grid-cols-3">
              {howKeys.map(([titleKey, descKey], index) => (
                <motion.div
                  key={titleKey}
                  initial={{ opacity: 0, y: 40 }}
                  whileInView={{ opacity: 1, y: 0 }}
                  viewport={{ once: true, margin: "-100px" }}
                  transition={{ duration: 0.5, delay: index * 0.1 }}
                  className="rounded-xl border border-slate-200 bg-white p-8 text-center"
                >
                  <h3 className="text-2xl font-bold text-indigo-600">{t(titleKey)}</h3>
                  <p className="mt-3 leading-7 text-slate-500">{t(descKey)}</p>
                </motion.div>
              ))}
            </div>
          </div>
        </Section>

        <Section className="bg-white px-4 py-24 md:px-8">
          <div className="mx-auto max-w-6xl">
            <h2 className="text-center text-3xl font-bold text-slate-900 md:text-4xl">
              {t("featuresTitle")}
            </h2>
            <div className="mt-12 grid grid-cols-1 gap-6 md:grid-cols-2">
              {featureKeys.map(([emojiKey, titleKey, descKey], index) => (
                <motion.div
                  key={titleKey}
                  initial={{ opacity: 0, y: 40 }}
                  whileInView={{ opacity: 1, y: 0 }}
                  viewport={{ once: true, margin: "-100px" }}
                  transition={{ duration: 0.5, delay: index * 0.1 }}
                  whileHover={{ scale: 1.02, y: -4, boxShadow: "0 18px 45px rgba(15, 23, 42, 0.08)" }}
                  className="rounded-xl border border-slate-200 bg-white p-8"
                >
                  <div className="text-2xl">{t(emojiKey)}</div>
                  <h3 className="mt-5 text-xl font-bold text-slate-900">{t(titleKey)}</h3>
                  <p className="mt-3 leading-7 text-slate-500">{t(descKey)}</p>
                </motion.div>
              ))}
            </div>
          </div>
        </Section>

        <Section className="bg-slate-900 px-4 py-24 text-white md:px-8">
          <div className="mx-auto max-w-5xl">
            <h2 className="text-center text-3xl font-bold md:text-4xl">{t("notCourseTitle")}</h2>
            <div className="mt-12 grid grid-cols-1 gap-12 md:grid-cols-2">
              <div className="space-y-5">
                {notCourseNoKeys.map((key, index) => (
                  <motion.div
                    key={key}
                    initial={{ opacity: 0, y: 20 }}
                    whileInView={{ opacity: 1, y: 0 }}
                    viewport={{ once: true, margin: "-100px" }}
                    transition={{ duration: 0.45, delay: index * 0.15 }}
                    className="flex items-center gap-3"
                  >
                    <motion.span
                      initial={{ scale: 0 }}
                      whileInView={{ scale: 1 }}
                      viewport={{ once: true }}
                      transition={{ duration: 0.25, delay: index * 0.15 }}
                      className="flex h-6 w-6 shrink-0 items-center justify-center rounded-full bg-red-400 text-sm font-semibold text-white"
                    >
                      ✕
                    </motion.span>
                    <span className="text-base text-slate-200">{t(key)}</span>
                  </motion.div>
                ))}
              </div>
              <div className="space-y-5">
                {notCourseYesKeys.map((key, index) => (
                  <motion.div
                    key={key}
                    initial={{ opacity: 0, y: 20 }}
                    whileInView={{ opacity: 1, y: 0 }}
                    viewport={{ once: true, margin: "-100px" }}
                    transition={{ duration: 0.45, delay: index * 0.15 }}
                    className="flex items-center gap-3"
                  >
                    <motion.span
                      initial={{ scale: 0 }}
                      whileInView={{ scale: 1 }}
                      viewport={{ once: true }}
                      transition={{ duration: 0.25, delay: index * 0.15 }}
                      className="flex h-6 w-6 shrink-0 items-center justify-center rounded-full bg-emerald-400 text-sm font-semibold text-white"
                    >
                      ✓
                    </motion.span>
                    <span className="text-base text-white">{t(key)}</span>
                  </motion.div>
                ))}
              </div>
            </div>
          </div>
        </Section>

        <Section className="bg-indigo-50 px-4 py-24 md:px-8">
          <div className="mx-auto max-w-4xl rounded-2xl border border-indigo-100 bg-white p-8 md:p-10">
            <p className="text-sm font-semibold uppercase tracking-[0.24em] text-indigo-600">
              {t("firstQuestLabel")}
            </p>
            <h2 className="mt-4 text-2xl font-bold text-slate-900 md:text-3xl">
              {t("firstQuestTitle")}
            </h2>
            <p className="mt-3 text-lg italic text-slate-500">{t("firstQuestSub")}</p>
            <p className="mt-5 max-w-2xl leading-7 text-slate-600">{t("firstQuestDesc")}</p>
            <div className="mt-8">
              <Link
                href="/signup"
                className="inline-flex rounded-lg bg-indigo-600 px-6 py-3 text-base font-medium text-white transition-colors hover:bg-indigo-700"
              >
                {t("firstQuestCta")}
              </Link>
            </div>
            <p className="mt-4 text-sm text-slate-400">{t("firstQuestMeta")}</p>
          </div>
        </Section>

        <Section className="bg-slate-50 px-4 py-24 md:px-8">
          <div className="mx-auto max-w-6xl">
            <h2 className="text-center text-3xl font-bold text-slate-900 md:text-4xl">{t("forTitle")}</h2>
            <div className="mt-12 grid grid-cols-1 gap-6 md:grid-cols-3">
              {forKeys.map((key, index) => (
                <motion.div
                  key={key}
                  initial={{ opacity: 0, y: 40 }}
                  whileInView={{ opacity: 1, y: 0 }}
                  viewport={{ once: true, margin: "-100px" }}
                  transition={{ duration: 0.5, delay: index * 0.1 }}
                  className="rounded-xl border border-slate-200 border-s-4 border-s-indigo-600 bg-white p-6 italic leading-7 text-slate-700"
                >
                  {t(key)}
                </motion.div>
              ))}
            </div>
          </div>
        </Section>

        <Section className="bg-white px-4 py-24 md:px-8">
          <div className="mx-auto max-w-2xl">
            <h2 className="text-center text-3xl font-bold text-slate-900 md:text-4xl">
              {t("mentorTitle")}
            </h2>
            <div className="mt-12 flex flex-col items-center gap-6 text-center md:flex-row md:text-start">
              <div className="flex h-20 w-20 shrink-0 items-center justify-center rounded-full bg-slate-200 text-xl font-bold text-slate-500">
                {t("mentorInitials")}
              </div>
              <div>
                <h3 className="text-xl font-bold text-slate-900">{t("mentorName")}</h3>
                <p className="mt-2 leading-relaxed text-slate-500">{t("mentorBio")}</p>
                <a
                  href="https://goallx.com"
                  target="_blank"
                  rel="noreferrer"
                  className="mt-3 inline-flex text-sm font-medium text-indigo-600 hover:underline"
                >
                  {t("mentorCta")}
                </a>
              </div>
            </div>
          </div>
        </Section>

        <Section className="bg-slate-900 px-4 py-24 text-white md:px-8">
          <div className="mx-auto max-w-4xl text-center">
            <h2 className="text-4xl font-bold leading-tight md:text-5xl">{t("heroTitle")}</h2>
            <div className="mt-8">
              <motion.div
                animate={{ scale: [1, 1.02, 1] }}
                transition={{ duration: 3, repeat: Infinity, ease: "easeInOut" }}
                className="inline-flex"
              >
                <Link
                  href="/signup"
                  className="inline-flex rounded-lg bg-indigo-600 px-8 py-4 text-lg font-medium text-white transition-colors hover:bg-indigo-500"
                >
                  {t("finalCta")}
                </Link>
              </motion.div>
            </div>
            <p className="mt-4 text-sm text-slate-300">{t("finalMeta")}</p>
          </div>
        </Section>

        <Section id="faq" className="bg-white px-4 py-24 md:px-8">
          <div className="mx-auto max-w-2xl">
            <h2 className="text-center text-3xl font-bold text-slate-900 md:text-4xl">
              {t("faqTitle")}
            </h2>
            <div className="mt-12 space-y-6">
              {faqKeys.map(([questionKey, answerKey], index) => (
                <motion.details
                  key={questionKey}
                  initial={{ opacity: 0, y: 30 }}
                  whileInView={{ opacity: 1, y: 0 }}
                  viewport={{ once: true, margin: "-100px" }}
                  transition={{ duration: 0.45, delay: index * 0.08 }}
                  className="border-b border-slate-200 pb-4"
                >
                  <summary className="flex cursor-pointer list-none items-center justify-between gap-4 text-base font-medium text-slate-900">
                    <span>{t(questionKey)}</span>
                    <span className="text-slate-400">▼</span>
                  </summary>
                  <p className="mt-3 leading-relaxed text-slate-500">{t(answerKey)}</p>
                </motion.details>
              ))}
            </div>
          </div>
        </Section>
      </main>

      <footer className="border-t border-slate-200 px-4 py-12 md:px-8">
        <div className="mx-auto flex max-w-6xl flex-col gap-4 md:flex-row md:items-center md:justify-between">
          <div className="space-y-1">
            <p className="text-sm font-semibold text-slate-900">{t("brand")}</p>
            <p className="text-sm text-slate-500">{t("footerTagline")}</p>
          </div>
        </div>
      </footer>
    </div>
  );
}
