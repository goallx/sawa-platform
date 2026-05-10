import ReactMarkdown from "react-markdown";
import remarkGfm from "remark-gfm";

export function MarkdownContent({ content }: { content: string }) {
  return (
    <div className="max-w-none space-y-4 text-slate-700">
      <ReactMarkdown
        remarkPlugins={[remarkGfm]}
        components={{
          h1: ({ children }) => (
            <h1 className="text-2xl font-semibold tracking-tight text-[#0F172A]">
              {children}
            </h1>
          ),
          h2: ({ children }) => (
            <h2 className="text-lg font-semibold text-[#0F172A]">{children}</h2>
          ),
          p: ({ children }) => <p className="text-base leading-7 text-slate-700">{children}</p>,
          ul: ({ children }) => <ul className="space-y-2 pl-5">{children}</ul>,
          li: ({ children }) => <li className="list-disc text-base leading-7">{children}</li>,
          strong: ({ children }) => <strong className="font-semibold text-[#0F172A]">{children}</strong>
        }}
      >
        {content}
      </ReactMarkdown>
    </div>
  );
}
