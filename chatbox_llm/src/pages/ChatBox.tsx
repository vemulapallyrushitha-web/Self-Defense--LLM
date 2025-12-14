import { useState } from "react";

type Sender = "user" | "bot";

interface Message {
  sender: Sender;
  text: string;
}

const Chatbox: React.FC = () => {
  const [messages, setMessages] = useState<Message[]>([]);
  const [input, setInput] = useState("");
  const [isLoading, setIsLoading] = useState(false);

  const handleSend = async () => {
    if (!input.trim()) return;

    const userMessage: Message = { sender: "user", text: input };
    setMessages((prev) => [...prev, userMessage]);
    const userText = input;
    setInput("");
    setIsLoading(true);

    try {
      // 🔗 Connect frontend to FastAPI backend
      const response = await fetch("http://127.0.0.1:8000/chat", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ message: userText }),
      });

      const data = await response.json();
      const botMessage: Message = {
        sender: "bot",
        text: data.response || "⚠ No response from backend.",
      };

      setMessages((prev) => [...prev, botMessage]);
    } catch (error) {
      setMessages((prev) => [
        ...prev,
        { sender: "bot", text: "❌ Failed to connect to backend." },
      ]);
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <div className="flex flex-col items-center justify-center h-screen bg-gradient-to-br from-blue-50 to-purple-100">
      <div className="w-full max-w-lg bg-white shadow-xl rounded-xl p-5 flex flex-col">
        <h1 className="text-2xl font-semibold text-center mb-4 text-gray-700">
          AutoDefense Chat 🤖
        </h1>

        <div className="flex-1 overflow-y-auto border rounded-md p-3 mb-4 h-96 bg-gray-50">
          {messages.map((msg, index) => (
            <div
              key={index}
              className={`my-2 ${
                msg.sender === "user"
                  ? "text-right text-blue-700"
                  : "text-left text-green-700"
              }`}
            >
              <b>{msg.sender === "user" ? "You" : "Bot"}:</b> {msg.text}
            </div>
          ))}
          {isLoading && (
            <p className="text-gray-500 italic text-left">Bot is typing...</p>
          )}
        </div>

        <div className="flex gap-2">
          <input
            value={input}
            onChange={(e) => setInput(e.target.value)}
            placeholder="Type your message..."
            className="flex-1 border rounded-md p-2 focus:outline-none focus:ring-2 focus:ring-blue-400"
          />
          <button
            onClick={handleSend}
            disabled={isLoading}
            className="bg-blue-600 text-white px-4 py-2 rounded-md hover:bg-blue-700 transition disabled:opacity-50"
          >
            Send
          </button>
        </div>
      </div>
    </div>
  );
};

export default Chatbox;
