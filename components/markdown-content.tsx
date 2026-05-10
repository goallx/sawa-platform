import { cn } from "@/lib/utils";

interface MarkdownContentProps {
  content: string;
}

type Block =
  | { type: "heading"; text: string }
  | { type: "paragraph"; text: string }
  | { type: "list"; items: string[] }
  | { type: "divider" }
  | { type: "tip"; text: string }
  | { type: "stuck"; text: string };

export function MarkdownContent({ content }: MarkdownContentProps) {
  const blocks = parseBlocks(content);

  return (
    <div className="space-y-4">
      {blocks.map((block, index) => {
        if (block.type === "heading") {
          return (
            <h2 key={index} className="text-2xl font-semibold tracking-tight text-[#0F172A]">
              {renderInline(block.text)}
            </h2>
          );
        }

        if (block.type === "divider") {
          return <hr key={index} className="border-[#E2E8F0]" />;
        }

        if (block.type === "list") {
          return (
            <ul key={index} className="space-y-2 pl-5 text-base leading-7 text-slate-700">
              {block.items.map((item, itemIndex) => (
                <li key={itemIndex} className="list-disc">
                  {renderInline(item)}
                </li>
              ))}
            </ul>
          );
        }

        if (block.type === "tip" || block.type === "stuck") {
          const isTip = block.type === "tip";
          return (
            <div
              key={index}
              className={cn(
                "rounded-lg border p-5",
                isTip
                  ? "border-amber-200 bg-amber-50 text-amber-900"
                  : "border-sky-200 bg-sky-50 text-sky-900"
              )}
            >
              <p className="text-base leading-7">{renderInline(block.text)}</p>
            </div>
          );
        }

        return (
          <p key={index} className="text-base leading-7 text-slate-700">
            {renderInline(block.text)}
          </p>
        );
      })}
    </div>
  );
}

function parseBlocks(content: string) {
  const lines = content.split("\n");
  const blocks: Block[] = [];
  let paragraphBuffer: string[] = [];
  let listBuffer: string[] = [];

  const flushParagraph = () => {
    if (paragraphBuffer.length) {
      blocks.push({ type: "paragraph", text: paragraphBuffer.join(" ").trim() });
      paragraphBuffer = [];
    }
  };

  const flushList = () => {
    if (listBuffer.length) {
      blocks.push({ type: "list", items: listBuffer });
      listBuffer = [];
    }
  };

  for (const rawLine of lines) {
    const line = rawLine.trim();

    if (!line) {
      flushParagraph();
      flushList();
      continue;
    }

    if (line === "---") {
      flushParagraph();
      flushList();
      blocks.push({ type: "divider" });
      continue;
    }

    if (line.startsWith("# ")) {
      flushParagraph();
      flushList();
      blocks.push({ type: "heading", text: line.slice(2).trim() });
      continue;
    }

    if (line.startsWith("💡")) {
      flushParagraph();
      flushList();
      blocks.push({ type: "tip", text: line.replace(/^💡\s*/, "") });
      continue;
    }

    if (line.startsWith("Stuck?")) {
      flushParagraph();
      flushList();
      blocks.push({ type: "stuck", text: line });
      continue;
    }

    if (line.startsWith("- ") || line.startsWith("• ")) {
      flushParagraph();
      listBuffer.push(line.slice(2).trim());
      continue;
    }

    paragraphBuffer.push(line);
  }

  flushParagraph();
  flushList();

  return blocks;
}

function renderInline(text: string) {
  const parts = text.split(/(\*\*.*?\*\*)/g);

  return parts.map((part, index) => {
    if (part.startsWith("**") && part.endsWith("**")) {
      return (
        <strong key={index} className="font-semibold text-[#0F172A]">
          {part.slice(2, -2)}
        </strong>
      );
    }

    return <span key={index}>{part}</span>;
  });
}
