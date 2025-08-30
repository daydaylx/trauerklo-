import { Message } from "../types/core";

export function ChatView({ messages }: { messages: Message[] }) {
  return (
    <div className="flex flex-col gap-3">
      {messages.map(m => (
        <div key={m.id} className={m.role === "user" ? "self-end max-w-[85%]" : "self-start max-w-[85%]"}>
          <div className={`px-3 py-2 rounded-2xl text-sm ${
            m.role === "user"
              ? "glass bg-white/10 rounded-br-sm"
              : "glass bg-white/6 rounded-bl-sm"
          }`}>
            {m.text}
          </div>
        </div>
      ))}
    </div>
  );
}
