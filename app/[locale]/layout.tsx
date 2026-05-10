import {NextIntlClientProvider} from "next-intl";
import {notFound} from "next/navigation";
import {getMessages} from "next-intl/server";

import {AppShell} from "@/components/app-shell";
import {locales} from "@/i18n";
import {getCurrentUser} from "@/lib/auth";

export default async function LocaleLayout({
  children,
  params
}: {
  children: React.ReactNode;
  params: {locale: string};
}) {
  if (!locales.includes(params.locale as "en" | "ar")) {
    notFound();
  }

  const [messages, user] = await Promise.all([getMessages(), getCurrentUser()]);

  return (
    <NextIntlClientProvider locale={params.locale} messages={messages}>
      <AppShell userEmail={user?.email}>{children}</AppShell>
    </NextIntlClientProvider>
  );
}
