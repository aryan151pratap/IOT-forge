import React, { useState, useMemo, useCallback, useEffect } from "react";
import {
  FiCopy,
  FiCheck,
  FiChevronDown,
  FiChevronRight,
  FiCode,
  FiZap,
} from "react-icons/fi";
import EditorFile from "../Device-IDE/EditorFile";
import { BsCopy } from "react-icons/bs";
import { useNotify } from "../Device-IDE/notify";

/* ============================================================================
 * BLOCK SPLITTING — separates fenced code from prose
 * ==========================================================================*/

function splitIntoBlocks(raw) {
  const blocks = [];
  const fenceRegex = /```([\w+-]*)\n?([\s\S]*?)(```|$)/g;
  let lastIndex = 0;
  let match;

  while ((match = fenceRegex.exec(raw)) !== null) {
    const [full, lang, code, closed] = match;

    if (match.index > lastIndex) {
      blocks.push({ type: "text", value: raw.slice(lastIndex, match.index) });
    }

    blocks.push({
      type: "code",
      language: (lang || "plaintext").toLowerCase(),
      value: code.replace(/\n$/, ""),
      closed: closed === "```",
    });

    lastIndex = match.index + full.length;
    if (!closed) break; // unterminated fence consumes the rest of the string
  }

  if (lastIndex < raw.length) {
    blocks.push({ type: "text", value: raw.slice(lastIndex) });
  }
  return blocks;
}

/* ============================================================================
 * PROSE PARSING — splits a text block into heading / list / table / paragraph
 * ==========================================================================*/

function tryParseTable(lines, startIndex) {
  const headerLine = lines[startIndex];
  const sepLine = lines[startIndex + 1];
  if (!headerLine || !sepLine) return null;

  const isRow = (l) => l.trim() !== "" && l.includes("|");
  const isSeparator = (l) =>
    /^\s*\|?\s*:?-{2,}:?\s*(\|\s*:?-{2,}:?\s*)*\|?\s*$/.test(l);

  if (!isRow(headerLine) || !isSeparator(sepLine)) return null;

  const splitRow = (l) =>
    l.trim().replace(/^\|/, "").replace(/\|$/, "").split("|").map((c) => c.trim());

  const header = splitRow(headerLine);
  const align = splitRow(sepLine).map((cell) => {
    const left = cell.startsWith(":");
    const right = cell.endsWith(":");
    if (left && right) return "center";
    if (right) return "right";
    if (left) return "left";
    return null;
  });

  const rows = [];
  let i = startIndex + 2;
  while (i < lines.length && isRow(lines[i])) {
    rows.push(splitRow(lines[i]));
    i++;
  }

  return { consumed: i - startIndex, header, align, rows };
}

function parseProseLines(text) {
  const lines = text.split("\n");
  const blocks = [];
  let i = 0;

  while (i < lines.length) {
    const table = tryParseTable(lines, i);
    if (table) {
      blocks.push({ type: "table", key: i, ...table });
      i += table.consumed;
      continue;
    }

    const line = lines[i];

    const header = line.match(/^(#{1,4})\s+(.*)/);
    if (header) {
      blocks.push({ type: "heading", level: header[1].length, text: header[2], key: i });
      i++;
      continue;
    }

    const bulletMatch = line.match(/^\s*[-*]\s+(.*)/);
    const numberedMatch = line.match(/^\s*\d+\.\s+(.*)/);
    if (bulletMatch || numberedMatch) {
      const ordered = !!numberedMatch;
      const items = [];
      while (i < lines.length) {
        const b = lines[i].match(/^\s*[-*]\s+(.*)/);
        const n = lines[i].match(/^\s*\d+\.\s+(.*)/);
        if (ordered && n) { items.push({ text: n[1], key: i }); i++; }
        else if (!ordered && b) { items.push({ text: b[1], key: i }); i++; }
        else break;
      }
      blocks.push({ type: "list", ordered, items, key: i });
      continue;
    }

    if (line.trim() === "") { i++; continue; }

    blocks.push({ type: "paragraph", text: line, key: i });
    i++;
  }

  return blocks;
}


function renderInline(text) {
	const notify = useNotify();
	const parts = text.split(/(\*\*[^*]+\*\*|`[^`]+`)/g).filter(Boolean);
	const handleCopy = async (code) => {
		try {
			await navigator.clipboard.writeText(code);
			notify({type: "status", message: "Link copied!"});
		} catch (err) {
			// clipboard write can fail (permissions, insecure context) — no-op is fine here
		}
	};
  	return parts.map((part, idx) => {
		if (part.includes("http")){
			if (part.startsWith("**") && part.endsWith("**")) part = part.slice(2, -2);
			const link = part;
			if (part.includes("[")) part = part.split("[")[1];
			if (part.includes("]")) part = part.split("]")[1];
			if (part.startsWith("(") && part.endsWith(")")) part = part.slice(1,-1);
			return(
				<div className="text-blue-400 break-all font-plex cursor-pointer flex flex-wrap gap-2 items-center">
					<a href={part} >{part}</a>
					<BsCopy className="text-zinc-500" onClick={() => handleCopy(part)}/>
				</div>
			)
		}
		if (part.startsWith("**") && part.endsWith("**")) {
			return (
				<span key={idx} className="font-semibold text-zinc-50">
					{part.slice(2, -2)}
				</span>
			);
		}
		if (part.startsWith("`") && part.endsWith("`")) {
			return (
				<code key={idx} className="rounded bg-zinc-800 px-1.5 py-0.5 font-mono text-[0.85em] text-orange-300">
			{part.slice(1, -1)}
			</code>
		);
		}
		if (part === "---") return
		return <React.Fragment key={idx}>{part}</React.Fragment>;
	});
}

/* ============================================================================
 * PER-TYPE RENDER FUNCTIONS
 * ==========================================================================*/

function Heading({ level, text }) {
  const Tag = `h${Math.min(level + 2, 6)}`;
  const size = Tag === "h3" ? "text-md" : "text-sm";
  return (
    <Tag className={`mt-5 mb-2 bg-orange-400/15 px-2 p-1 border-l-2 cursor-pointer border-orange-500 w-fit text-orange-200 ${size}`}>
      {renderInline(text)}
    </Tag>
  );
}

function Paragraph({ text }) {
  return <p className="text-[15px] leading-relaxed text-zinc-200">{renderInline(text)}</p>;
}

function ListBlock({ ordered, items }) {
  const Tag = ordered ? "ol" : "ul";
  return (
    <Tag className={`my-1.5 space-y-1 pl-5 text-[15px] text-zinc-200 ${ordered ? "list-decimal" : "list-disc"}`}>
      {items.map((item) => (
        <li key={item.key} className="marker:text-zinc-500">
          {renderInline(item.text)}
        </li>
      ))}
    </Tag>
  );
}

function alignClass(a) {
  return a === "center" ? "text-center" : a === "right" ? "text-right" : "text-left";
}

function TableBlock({ header, align, rows }) {
  return (
    <div className="my-2 overflow-x-auto rounded-lg border border-zinc-800">
      <table className="w-full border-collapse text-sm">
        <thead>
          <tr className="bg-zinc-800/60">
            {header.map((cell, i) => (
              <th
                key={i}
                className={`border-b border-zinc-800 px-3 py-2 font-medium text-zinc-200 ${alignClass(align[i])}`}
              >
                {renderInline(cell)}
              </th>
            ))}
          </tr>
        </thead>
        <tbody>
          {rows.map((row, r) => (
            <tr key={r} className="border-b border-zinc-800/60 last:border-0 even:bg-zinc-900/40">
              {row.map((cell, c) => (
                <td key={c} className={`px-3 py-2 align-top text-zinc-300 ${alignClass(align[c])}`}>
                  {renderInline(cell)}
                </td>
              ))}
            </tr>
          ))}
        </tbody>
      </table>
    </div>
  );
}

function TextBlock({ text }) {
  const blocks = useMemo(() => parseProseLines(text), [text]);
  return (
    <div className="space-y-1">
      {blocks.map((block) => {
        if (block.type === "heading") return <Heading key={block.key} level={block.level} text={block.text} />;
        if (block.type === "list") return <ListBlock key={block.key} ordered={block.ordered} items={block.items} />;
        if (block.type === "table") return <TableBlock key={block.key} header={block.header} align={block.align} rows={block.rows} />;
        return <Paragraph key={block.key} text={block.text} />;
      })}
    </div>
  );
}

function TextWithCursor({ text, showCursor }) {
  if (!text.trim() && !showCursor) return null;
  return (
    <div>
      <TextBlock text={text} />
      {showCursor && (
        <span className="ml-0.5 inline-block h-4 w-[2px] translate-y-0.5 animate-pulse bg-orange-500 align-middle" />
      )}
    </div>
  );
}

function guessFileName(language) {
  const map = {
    javascript: "script.js",
    js: "script.js",
    jsx: "component.jsx",
    typescript: "script.ts",
    ts: "script.ts",
    tsx: "component.tsx",
    python: "script.py",
    py: "script.py",
    css: "styles.css",
    html: "index.html",
    json: "data.json",
    bash: "script.sh",
    sh: "script.sh",
    plaintext: "notes.txt",
  };
  return map[language] || `snippet.${language || "txt"}`;
}

const EDITOR_LINE_HEIGHT = 24;
const EDITOR_MIN_HEIGHT = 160;
const EDITOR_MAX_HEIGHT = 480;

function CodeBlock({ language, value, closed, isStreaming, blockId }) {
  const [collapsed, setCollapsed] = useState(false);
  const [copied, setCopied] = useState(false);
  const [code, setCode] = useState(value);

  useEffect(() => {
    setCode(value);
  }, [value]);

  const fileName = useMemo(() => guessFileName(language), [language]);
  const fileId = useMemo(
    () => blockId || `code-${Math.random().toString(36).slice(2, 9)}`,
    [blockId]
  );

  const editorHeight = useMemo(() => {
    const lines = Math.max(1, code.split("\n").length);
    const raw = lines * EDITOR_LINE_HEIGHT + 40;
    return Math.min(EDITOR_MAX_HEIGHT, Math.max(EDITOR_MIN_HEIGHT, raw));
  }, [code]);

  const handleCopy = useCallback(async () => {
    try {
      await navigator.clipboard.writeText(code);
      setCopied(true);
      setTimeout(() => setCopied(false), 1500);
    } catch (err) {
      // clipboard write can fail (permissions, insecure context) — no-op is fine here
    }
  }, [code]);

  const handleChange = useCallback((nextContent) => {
    setCode(nextContent);
  }, []);

  return (
    <div className="my-2 shadow-lg shadow-black overflow-hidden rounded-lg border border-zinc-800 bg-zinc-950">
      <div className="flex flex-row items-center gap-2 border-b border-zinc-800 bg-zinc-900/80 px-2.5 py-1.5">
        <button
          type="button"
          onClick={() => setCollapsed((c) => !c)}
          aria-label={collapsed ? "Expand code" : "Collapse code"}
          className="flex h-6 w-6 shrink-0 items-center justify-center rounded text-zinc-500 outline-none hover:bg-zinc-800 hover:text-zinc-200 focus-visible:ring-2 focus-visible:ring-orange-500"
        >
          {collapsed ? <FiChevronRight size={14} /> : <FiChevronDown size={14} />}
        </button>

        <FiCode size={14} className="shrink-0 text-zinc-500" />
        <span className="font-plex font-mono text-xs text-zinc-300">{fileName}</span>
        <span className="shrink-0 font-mono text-[10px] uppercase tracking-wide text-zinc-500">{language}</span>

        <div className="ml-auto flex shrink-0 items-center gap-2">
          {!closed && isStreaming && (
            <span className="flex items-center gap-1 font-mono text-[10px] uppercase tracking-wide text-orange-400">
              <FiZap size={11} />
              writing…
            </span>
          )}
          <button
            type="button"
            onClick={handleCopy}
            className="flex items-center gap-1 rounded px-2 py-1 font-mono text-[11px] text-zinc-400 outline-none hover:bg-zinc-800 hover:text-zinc-200 focus-visible:ring-2 focus-visible:ring-orange-500"
          >
            {copied ? <FiCheck size={13} /> : <FiCopy size={13} />}
            {copied ? "Copied" : "Copy"}
          </button>
        </div>
      </div>

      {!collapsed && (
        <div style={{ height: `${editorHeight}px` }}>
          <EditorFile
            file={{ id: fileId, name: fileName, language, content: code}}
            onChange={handleChange}
			fontsize={14}
			lineHeight={20}
          />
        </div>
      )}
    </div>
  );
}

function TypingIndicator() {
  return (
    <div className="flex items-center gap-1 py-1">
      <span className="h-1.5 w-1.5 animate-bounce rounded-full bg-zinc-500 [animation-delay:-0.3s]" />
      <span className="h-1.5 w-1.5 animate-bounce rounded-full bg-zinc-500 [animation-delay:-0.15s]" />
      <span className="h-1.5 w-1.5 animate-bounce rounded-full bg-zinc-500" />
    </div>
  );
}

/* ============================================================================
 * MESSAGE + THREAD
 * ==========================================================================*/

export function ChatMessage({
  id,
  role = "agent",
  content = "",
  isStreaming = false,
  agentName = "Agent",
}) {
  const blocks = useMemo(() => splitIntoBlocks(content || ""), [content]);
  const isAgent = role !== "user";
  const fallbackId = useMemo(() => `m-${Math.random().toString(36).slice(2, 9)}`, []);
  const messageId = id || fallbackId;

  return (
    <div className={`flex w-full ${isAgent ? "justify-start" : "justify-end"}`}>
      <div className={`flex flex-col gap-1.5 ${isAgent ? "w-full items-start" : "max-w-[480px] items-end"}`}>
        <div className="flex items-center gap-2">
          <span className={`font-mono text-[12px] uppercase tracking-[0.15em] ${isAgent ? "text-orange-400/70" : "text-zinc-500"}`}>
            {isAgent ? agentName : "You"}
          </span>
          {isAgent && isStreaming && (
            <span className="flex items-center gap-1 font-mono text-[10px] uppercase tracking-wide text-emerald-500">
              <span className="h-1.5 w-1.5 animate-pulse rounded-full bg-emerald-500" />
              live
            </span>
          )}
        </div>

        <div className={isAgent ? "w-full" : "max-w-[480px] rounded-xl bg-orange-500/10 px-3.5 py-2.5"}>
          {blocks.length === 0 && isStreaming && <TypingIndicator />}
          {blocks.map((block, i) =>
            block.type === "code" ? (
              <CodeBlock
                key={i}
                blockId={`${messageId}-code-${i}`}
                language={block.language}
                value={block.value}
                closed={block.closed}
                isStreaming={isStreaming && i === blocks.length - 1}
              />
            ) : (
              <TextWithCursor
                key={i}
                text={block.value}
                showCursor={isStreaming && i === blocks.length - 1}
              />
            )
          )}
        </div>
      </div>
    </div>
  );
}

export default function ChatStyle({ messages = [], streamingId = null, agentName = "Agent" }) {
  return (
    <div className="flex flex-col gap-4 p-2">
      {messages.map((m) => (
        <ChatMessage
          key={m.id}
          id={m.id}
          role={m.role}
          content={m.content}
          agentName={agentName}
          isStreaming={m.id === streamingId}
        />
      ))}
    </div>
  );
}