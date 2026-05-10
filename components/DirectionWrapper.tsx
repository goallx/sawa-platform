"use client";

import { cn } from "@/lib/utils";
import { useDirection } from "@/lib/direction";

type PlainProps = {
  layout?: "plain";
  children: React.ReactNode;
  className?: string;
};

type DashboardProps = {
  layout: "dashboard";
  sidebar: React.ReactNode;
  topbar: React.ReactNode;
  children: React.ReactNode;
  className?: string;
};

type StepProps = {
  layout: "step";
  content: React.ReactNode;
  aside: React.ReactNode;
  className?: string;
};

type DirectionWrapperProps = PlainProps | DashboardProps | StepProps;

export function DirectionWrapper(props: DirectionWrapperProps) {
  const { isRTL, dir } = useDirection();

  if (props.layout === "dashboard") {
    return (
      <div dir={dir} className={cn("min-h-screen bg-white text-[#0F172A]", props.className)}>
        <aside
          className={cn(
            "fixed inset-y-0 z-30 hidden w-[240px] border-slate-200 bg-slate-50 lg:flex lg:flex-col",
            isRTL ? "right-0 border-l" : "left-0 border-r"
          )}
        >
          {props.sidebar}
        </aside>
        <div className={cn("min-h-screen", isRTL ? "lg:mr-[240px]" : "lg:ml-[240px]")}>
          <header className="border-b border-slate-200 bg-white">{props.topbar}</header>
          <main className="p-6 md:p-8">{props.children}</main>
        </div>
      </div>
    );
  }

  if (props.layout === "step") {
    return (
      <div
        dir={dir}
        className={cn(
          "flex flex-col gap-8 lg:items-start",
          isRTL ? "lg:flex-row-reverse" : "lg:flex-row",
          props.className
        )}
      >
        <div className="w-full lg:w-[60%]">{props.content}</div>
        <aside className="w-full lg:w-[35%]">{props.aside}</aside>
      </div>
    );
  }

  return (
    <div dir={dir} className={props.className}>
      {props.children}
    </div>
  );
}
