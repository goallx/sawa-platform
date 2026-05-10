"use client";

import { useLocale, useTranslations } from "next-intl";

import { buttonVariants } from "@/components/ui/button";
import { Link, usePathname } from "@/navigation";
import { cn } from "@/lib/utils";

export default function LandingPage() {
  const t = useTranslations("landing");
  const common = useTranslations("common");
  const locale = useLocale();
  const pathname = usePathname();
  const otherLocale = locale === "en" ? "ar" : "en";
  const faqItems = [
    { q: t("faq1Q"), a: t("faq1A") },
    { q: t("faq2Q"), a: t("faq2A") },
    { q: t("faq3Q"), a: t("faq3A") },
    { q: t("faq4Q"), a: t("faq4A") },
    { q: t("faq5Q"), a: t("faq5A") }
  ];
  const proofItems = [t("proof1"), t("proof2"), t("proof3")];
  const forItems = [t("for1"), t("for2"), t("for3")];
  const noItems = [t("vsNo1"), t("vsNo2"), t("vsNo3")];
  const yesItems = [t("vsYes1"), t("vsYes2"), t("vsYes3")];

  return (
    <div className="bg-white text-[#0F172A]">
      <header className="sticky top-0 z-20 h-16 border-b border-[#E2E8F0] bg-white">
        <div className="mx-auto flex h-full max-w-6xl items-center justify-between gap-4 px-6">
          <div className="shrink-0 text-[20px] font-bold tracking-tight text-[#4F46E5]">
            {common("brand")}
          </div>
          <div className="flex items-center gap-3 md:gap-6">
            <a href="#how" className="text-sm font-medium text-[#0F172A] hover:text-[#4F46E5]">
              {t("howTitle")}
            </a>
            <a href="#faq" className="text-sm font-medium text-[#0F172A] hover:text-[#4F46E5]">
              {t("navFaq")}
            </a>
            <Link
              href={pathname}
              locale={otherLocale}
              className="text-sm font-medium text-[#0F172A]"
            >
              {locale === "en" ? "EN | عربي" : "عربي | EN"}
            </Link>
            <Link href="/login" className={buttonVariants({ className: "h-10 px-4 py-2 text-sm" })}>
              {common("apply")} →
            </Link>
          </div>
        </div>
      </header>

      <main>
        <section className="flex min-h-[80vh] items-center py-20">
          <div className="mx-auto w-full max-w-3xl px-6 text-start">
            <div className="space-y-6">
              <p className="text-sm font-bold uppercase tracking-[0.18em] text-[#4F46E5]">
                {t("heroEyebrow")}
              </p>
              <h1 className="text-5xl font-bold tracking-tight text-[#0F172A] leading-tight md:text-[48px]">
                {t("heroTitle")}
              </h1>
              <p className="max-w-xl text-xl leading-9 text-slate-500">
                {t("heroSub")}
              </p>
              <div className="pt-2">
                <Link
                  href="/login"
                  className={buttonVariants({ className: "px-8 py-4 text-lg" })}
                >
                  {t("heroCta")}
                </Link>
              </div>
              <p className="text-sm text-slate-400">{t("heroMeta")}</p>
            </div>
          </div>
        </section>

        <section id="how" className="bg-slate-50 py-24">
          <div className="mx-auto max-w-6xl px-6">
            <h2 className="text-center text-3xl font-semibold tracking-tight text-[#0F172A]">
              {t("howTitle")}
            </h2>
            <div className="mt-10 grid grid-cols-1 gap-6 md:grid-cols-3">
              <FeatureCard title={t("step1Title")} body={t("step1Desc")} />
              <FeatureCard title={t("step2Title")} body={t("step2Desc")} />
              <FeatureCard title={t("step3Title")} body={t("step3Desc")} />
            </div>
          </div>
        </section>

        <section className="bg-white py-24">
          <div className="mx-auto max-w-6xl px-6">
            <h2 className="text-center text-3xl font-semibold tracking-tight text-[#0F172A]">
              {t("proofTitle")}
            </h2>
            <div className="mt-10 grid grid-cols-1 gap-6 md:grid-cols-3">
              {proofItems.map((item) => (
                <div key={item} className="space-y-4 rounded-xl border border-[#E2E8F0] bg-white p-4">
                  <div className="flex aspect-video items-center justify-center rounded-lg bg-slate-100 text-sm text-slate-500">
                    {t("proofPlaceholder")}
                  </div>
                  <p className="text-sm font-medium text-[#0F172A]">{item}</p>
                </div>
              ))}
            </div>
            <p className="mt-8 text-center text-sm text-slate-500">{t("proofSub")}</p>
          </div>
        </section>

        <section className="bg-[#4F46E5] py-24 text-white">
          <div className="mx-auto max-w-6xl px-6">
            <h2 className="text-3xl font-semibold tracking-tight md:text-[32px]">
              {t("vsTitle")}
            </h2>
            <div className="mt-10 grid grid-cols-1 gap-8 md:grid-cols-2">
              <ul className="space-y-4">
                {noItems.map((item) => (
                  <li key={item} className="flex items-start gap-3 text-lg">
                    <span className="text-red-300">✕</span>
                    <span>{item}</span>
                  </li>
                ))}
              </ul>
              <ul className="space-y-4">
                {yesItems.map((item) => (
                  <li key={item} className="flex items-start gap-3 text-lg">
                    <span className="text-emerald-400">✓</span>
                    <span>{item}</span>
                  </li>
                ))}
              </ul>
            </div>
          </div>
        </section>

        <section className="bg-slate-50 py-24">
          <div className="mx-auto max-w-6xl px-6">
            <h2 className="text-3xl font-semibold tracking-tight text-[#0F172A]">
              {t("forTitle")}
            </h2>
            <div className="mt-10 grid grid-cols-1 gap-6 md:grid-cols-3">
              {forItems.map((item) => (
                <div
                  key={item}
                  className="rounded-lg border border-[#E2E8F0] border-s-4 border-s-[#4F46E5] bg-white p-6 italic text-slate-600"
                >
                  {item}
                </div>
              ))}
            </div>
          </div>
        </section>

        <section className="bg-white py-24">
          <div className="mx-auto max-w-4xl px-6">
            <h2 className="text-3xl font-semibold tracking-tight text-[#0F172A]">
              {t("mentorTitle")}
            </h2>
            <div className="mt-8 flex flex-col items-start gap-5 md:flex-row">
              <div className="flex h-20 w-20 shrink-0 items-center justify-center rounded-full bg-slate-200 text-lg font-semibold text-slate-600">
                {t("mentorInitials")}
              </div>
              <div className="space-y-2 text-start">
                <p className="text-xl font-semibold text-[#0F172A]">{t("mentorName")}</p>
                <p className="text-base leading-8 text-slate-500">{t("mentorBio")}</p>
              </div>
            </div>
          </div>
        </section>

        <section className="bg-slate-50 py-24">
          <div className="mx-auto max-w-3xl px-6 text-center">
            <Link href="/login" className={buttonVariants({ className: "px-8 py-4 text-lg" })}>
              {t("finalCta")}
            </Link>
            <p className="mt-4 text-sm text-slate-500">{t("finalMeta")}</p>
          </div>
        </section>

        <section id="faq" className="bg-white py-24">
          <div className="mx-auto max-w-2xl px-6">
            <h2 className="text-center text-3xl font-semibold tracking-tight text-[#0F172A]">
              {t("faqTitle")}
            </h2>
            <div className="mt-10 space-y-4">
              {faqItems.map((item) => (
                <details key={item.q} className="rounded-lg border border-[#E2E8F0] bg-white p-5">
                  <summary className="cursor-pointer text-start text-lg font-medium text-[#0F172A]">
                    {item.q}
                  </summary>
                  <p className="mt-3 text-start text-base leading-7 text-slate-500">{item.a}</p>
                </details>
              ))}
            </div>
          </div>
        </section>
      </main>

      <footer className="border-t border-[#E2E8F0] py-12">
        <div className="mx-auto flex max-w-6xl flex-col gap-4 px-6 md:flex-row md:items-center md:justify-between">
          <div>
            <p className="text-[20px] font-bold tracking-tight text-[#4F46E5]">SAWA</p>
            <p className="mt-1 text-sm text-slate-500">{t("footerTagline")}</p>
          </div>
          <div className="flex flex-wrap gap-4 text-sm text-slate-500">
            <a href="https://discord.com" target="_blank" rel="noreferrer">
              {t("footerDiscord")}
            </a>
            <a href="https://twitter.com" target="_blank" rel="noreferrer">
              {t("footerTwitter")}
            </a>
            <a href="mailto:hello@sawa.builders">{t("footerEmail")}</a>
          </div>
        </div>
      </footer>
    </div>
  );
}

function FeatureCard({ title, body }: { title: string; body: string }) {
  return (
    <div className="rounded-xl border border-[#E2E8F0] bg-white p-8 text-center">
      <h3 className="text-xl font-semibold text-[#0F172A]">{title}</h3>
      <p className="mt-3 text-base leading-7 text-slate-500">{body}</p>
    </div>
  );
}
