import { useState, useRef, useEffect } from "react";

const SYSTEM_PROMPT = `You are REMO — the Remote Expert & Motivation Officer. You are a sharp, energetic, and knowledgeable personal assistant specializing in work-from-home productivity, career growth, and remote work lifestyle.

Your user has a strong background in:
- Customer Support (Chat & Voice, domestic & international clients)
- Sales & Inside Sales Management
- Ecommerce Category Management
- Currently seeking work-from-home job opportunities

Your personality:
- Warm but direct — no fluff, no filler
- Practical — always give actionable tips
- Motivating — you believe remote work is the future and your user is well-suited for it
- Smart — you connect their experience to remote opportunities they may not have considered

Your focus areas:
- WFH productivity hacks (time management, focus, routines, tools)
- Remote job hunting tailored to their background (customer support, sales, ecommerce)
- Home office setup & work-life balance
- Beating isolation, staying motivated, building remote habits
- Interview tips for remote roles

Always respond concisely. Use bullet points when listing tips. End with a quick follow-up question or tip to keep things moving.`;

const BOT_STARTERS = [
  "How do I stay focused working from home?",
  "Best remote jobs for my background?",
  "Help me set up a daily WFH routine",
  "How do I avoid distractions at home?",
];

function BotAvatar() {
  return (
    <div style={{
      width: 32, height: 32, borderRadius: "50%",
      background: "var(--color-background-info)",
      border: "0.5px solid var(--color-border-tertiary)",
      display: "flex", alignItems: "center", justifyContent: "center",
      flexShrink: 0, fontSize: 13, fontWeight: 500,
      color: "var(--color-text-info)"
    }}>R</div>
  );
}

function Message({ msg }) {
  const isBot = msg.role === "assistant";
  return (
    <div style={{
      display: "flex", gap: 10,
      flexDirection: isBot ? "row" : "row-reverse",
      alignItems: "flex-start",
      marginBottom: 16,
      animation: "fadeIn 0.2s ease"
    }}>
      {isBot && <BotAvatar />}
      <div style={{
        maxWidth: "78%",
        background: isBot ? "var(--color-background-secondary)" : "var(--color-background-info)",
        color: isBot ? "var(--color-text-primary)" : "var(--color-text-info)",
        borderRadius: isBot
          ? "4px 12px 12px 12px"
          : "12px 4px 12px 12px",
        padding: "10px 14px",
        fontSize: 14,
        lineHeight: 1.6,
        border: "0.5px solid var(--color-border-tertiary)",
        whiteSpace: "pre-wrap"
      }}>
        {msg.content}
      </div>
    </div>
  );
}

function TypingIndicator() {
  return (
    <div style={{ display: "flex", gap: 10, alignItems: "flex-start", marginBottom: 16 }}>
      <BotAvatar />
      <div style={{
        background: "var(--color-background-secondary)",
        border: "0.5px solid var(--color-border-tertiary)",
        borderRadius: "4px 12px 12px 12px",
        padding: "12px 16px",
        display: "flex", gap: 5, alignItems: "center"
      }}>
        {[0, 1, 2].map(i => (
          <div key={i} style={{
            width: 6, height: 6, borderRadius: "50%",
            background: "var(--color-text-tertiary)",
            animation: `bounce 1s ease-in-out ${i * 0.15}s infinite`
          }} />
        ))}
      </div>
    </div>
  );
}

export default function RemoBOT() {
  const [messages, setMessages] = useState([
    {
      role: "assistant",
      content: "Hey! I'm REMO — your Remote Expert & Motivation Officer 🎯\n\nWith your background in customer support, sales, and ecommerce, you're already built for remote work success. Ask me anything about WFH productivity, job hunting, or building great remote habits.\n\nWhat's on your mind today?"
    }
  ]);
  const [input, setInput] = useState("");
  const [loading, setLoading] = useState(false);
  const bottomRef = useRef(null);
  const inputRef = useRef(null);

  useEffect(() => {
    bottomRef.current?.scrollIntoView({ behavior: "smooth" });
  }, [messages, loading]);

  const sendMessage = async (text) => {
    const trimmed = (text || input).trim();
    if (!trimmed || loading) return;
    setInput("");

    const newMessages = [...messages, { role: "user", content: trimmed }];
    setMessages(newMessages);
    setLoading(true);

    try {
      const res = await fetch("https://api.anthropic.com/v1/messages", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          model: "claude-sonnet-4-20250514",
          max_tokens: 1000,
          system: SYSTEM_PROMPT,
          messages: newMessages.map(m => ({ role: m.role, content: m.content }))
        })
      });
      const data = await res.json();
      const reply = data.content?.find(b => b.type === "text")?.text || "Sorry, I couldn't process that. Try again!";
      setMessages([...newMessages, { role: "assistant", content: reply }]);
    } catch {
      setMessages([...newMessages, { role: "assistant", content: "Oops — something went wrong. Check your connection and try again!" }]);
    } finally {
      setLoading(false);
      inputRef.current?.focus();
    }
  };

  const handleKey = (e) => {
    if (e.key === "Enter" && !e.shiftKey) {
      e.preventDefault();
      sendMessage();
    }
  };

  return (
    <>
      <style>{`
        @keyframes fadeIn { from { opacity: 0; transform: translateY(6px); } to { opacity: 1; transform: none; } }
        @keyframes bounce { 0%, 100% { transform: translateY(0); } 50% { transform: translateY(-4px); } }
        .chip:hover { background: var(--color-background-secondary) !important; border-color: var(--color-border-primary) !important; }
        textarea:focus { outline: none; box-shadow: none; border-color: var(--color-border-secondary) !important; }
      `}</style>

      <div style={{ display: "flex", flexDirection: "column", height: 520, maxWidth: 680, margin: "0 auto" }}>

        <div style={{
          display: "flex", alignItems: "center", gap: 10,
          padding: "12px 16px",
          borderBottom: "0.5px solid var(--color-border-tertiary)",
          background: "var(--color-background-primary)"
        }}>
          <div style={{
            width: 38, height: 38, borderRadius: "50%",
            background: "var(--color-background-info)",
            border: "0.5px solid var(--color-border-tertiary)",
            display: "flex", alignItems: "center", justifyContent: "center",
            fontSize: 15, fontWeight: 500, color: "var(--color-text-info)"
          }}>R</div>
          <div>
            <div style={{ fontWeight: 500, fontSize: 15, color: "var(--color-text-primary)" }}>REMO</div>
            <div style={{ fontSize: 12, color: "var(--color-text-secondary)" }}>Remote Expert & Motivation Officer</div>
          </div>
          <div style={{
            marginLeft: "auto", fontSize: 11, fontWeight: 500,
            background: "var(--color-background-success)",
            color: "var(--color-text-success)",
            padding: "3px 10px",
            borderRadius: "var(--border-radius-md)",
            border: "0.5px solid var(--color-border-success)"
          }}>Online</div>
        </div>

        <div style={{
          flex: 1, overflowY: "auto",
          padding: "16px",
          background: "var(--color-background-primary)"
        }}>
          {messages.map((msg, i) => <Message key={i} msg={msg} />)}
          {loading && <TypingIndicator />}
          <div ref={bottomRef} />
        </div>

        {messages.length === 1 && (
          <div style={{
            display: "flex", gap: 8, flexWrap: "wrap",
            padding: "8px 16px",
            borderTop: "0.5px solid var(--color-border-tertiary)"
          }}>
            {BOT_STARTERS.map((s, i) => (
              <button key={i} className="chip" onClick={() => sendMessage(s)} style={{
                fontSize: 12, padding: "5px 12px",
                borderRadius: "var(--border-radius-md)",
                border: "0.5px solid var(--color-border-tertiary)",
                background: "var(--color-background-primary)",
                color: "var(--color-text-secondary)",
                cursor: "pointer", transition: "all 0.15s"
              }}>{s}</button>
            ))}
          </div>
        )}

        <div style={{
          padding: "12px 16px",
          borderTop: "0.5px solid var(--color-border-tertiary)",
          display: "flex", gap: 8, alignItems: "flex-end",
          background: "var(--color-background-primary)"
        }}>
          <textarea
            ref={inputRef}
            rows={1}
            value={input}
            onChange={e => {
              setInput(e.target.value);
              e.target.style.height = "auto";
              e.target.style.height = Math.min(e.target.scrollHeight, 100) + "px";
            }}
            onKeyDown={handleKey}
            placeholder="Ask REMO anything..."
            style={{
              flex: 1, resize: "none", padding: "8px 12px",
              borderRadius: "var(--border-radius-md)",
              border: "0.5px solid var(--color-border-tertiary)",
              background: "var(--color-background-secondary)",
              color: "var(--color-text-primary)",
              fontSize: 14, lineHeight: 1.5,
              fontFamily: "var(--font-sans)",
              transition: "border-color 0.15s"
            }}
          />
          <button
            onClick={() => sendMessage()}
            disabled={!input.trim() || loading}
            style={{
              padding: "8px 16px",
              borderRadius: "var(--border-radius-md)",
              border: "0.5px solid var(--color-border-secondary)",
              background: input.trim() && !loading ? "var(--color-background-info)" : "var(--color-background-secondary)",
              color: input.trim() && !loading ? "var(--color-text-info)" : "var(--color-text-tertiary)",
              fontSize: 14, fontWeight: 500, cursor: input.trim() && !loading ? "pointer" : "default",
              transition: "all 0.15s", flexShrink: 0
            }}
          >Send</button>
        </div>
      </div>
    </>
  );
}
