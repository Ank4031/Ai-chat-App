import React, { useEffect, useRef, useState } from "react";
import { useSelector, useDispatch } from "react-redux";
import { loginUser } from "../store/Auth.slice.js";
import { useNavigate } from "react-router-dom";

function Roomchat() {
  const [messages, setMessages] = useState([]);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState("");
  const msgRef = useRef();
  const navigate = useNavigate();
  const dispatch = useDispatch();
  const user = useSelector((state) => state.auth.userData);

  const messagesEndRef = useRef(null); // ref for auto-scrolling

  // --------------------- SCROLL TO BOTTOM ---------------------
  const scrollToBottom = () => {
    messagesEndRef.current?.scrollIntoView({ behavior: "smooth" });
  };

  useEffect(() => {
    scrollToBottom(); // scroll whenever messages change
  }, [messages]);

  // --------------------- CHECK LOGIN + LOAD MESSAGES ---------------------
  useEffect(() => {
    const verify = async () => {
      const res = await fetch(`${import.meta.env.VITE_BACKEND_PATH}/users/checklogin`, {
        method: "GET",
        credentials: "include",
      });

      if (!res.ok) {
        navigate("/login");
        return;
      }

      const data = await res.json();
      dispatch(loginUser(data));
    };

    const loadMessages = async () => {
      const res = await fetch(`${import.meta.env.VITE_BACKEND_PATH}/messages/get`, {
        method: "GET",
        credentials: "include",
      });

      if (!res.ok) {
        setError("Failed to load messages");
        return;
      }

      const data = await res.json();
      setMessages(data.data || []);
    };

    verify();
    loadMessages();
  }, [dispatch, navigate]);

  // --------------------- SEND MESSAGE ---------------------
  const sendMessage = async () => {
    const text = msgRef.current.value.trim();
    if (!text || loading) return;

    msgRef.current.value = "";
    setLoading(true);

    try {
      // Save user message
      const res1 = await fetch(`${import.meta.env.VITE_BACKEND_PATH}/messages/add`, {
        method: "POST",
        credentials: "include",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ message: text, userid: user.data._id, type: "user" }),
      });

      if (!res1.ok) throw new Error("Failed to send message");
      const userMsg = await res1.json();
      setMessages((prev) => [...prev, userMsg.data]);

      // AI response from backend
      const aiResp = await fetch(`${import.meta.env.VITE_BACKEND_PATH}/ai/respond`, {
        method: "POST",
        credentials: "include",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ message: text }),
      });

      if (!aiResp.ok) throw new Error("AI proxy error");
      const aiJson = await aiResp.json();
      const aiMessage = aiJson?.data?.text || "";

      const aiDisplay = { _id: Date.now(), message: aiMessage, sender: "ai", type: "ai" };
      setMessages((prev) => [...prev, aiDisplay]);

      // Save AI message to backend
      await fetch(`${import.meta.env.VITE_BACKEND_PATH}/messages/add`, {
        method: "POST",
        credentials: "include",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ message: aiMessage, userid: "ai", type: "ai" }),
      });

      setLoading(false);
    } catch (err) {
      setError(err.message || "Chat error");
      setLoading(false);
    }
  };

  // --------------------- UI ---------------------
  return (
    <div className="flex flex-col h-full w-full max-w-2xl mx-auto p-4 bg-gray-50">
      {/* Messages Container */}
    <div className="flex-1 overflow-y-auto mb-4 p-4 border rounded-md bg-white flex flex-col"
    style={{ maxHeight: "400px" }}> {/* set fixed height */}
    {messages.length === 0 && <p className="text-gray-400 text-center">No messages yet.</p>}

    {messages.map((msg) => (
    <div
        key={msg._id}
        className={`my-2 p-2 rounded-lg max-w-[70%] break-words 
            ${msg.type === "ai" ? "bg-blue-100 text-blue-900 self-start" : "bg-green-200 text-green-900 self-end"}`}
        >
        {msg.type === "ai" ? "AI: " : "You: "}
        {msg.message}
    </div>
    ))}

    <div ref={messagesEndRef} /> {/* dummy div to scroll into view */}
    </div>


      {/* Input + Send Button */}
      <div className="flex gap-2">
        <input
          type="text"
          ref={msgRef}
          disabled={loading}
          className="flex-1 border p-2 rounded-lg focus:outline-none focus:ring focus:ring-blue-300"
          placeholder="Type your message..."
          onKeyDown={(e) => e.key === "Enter" && sendMessage()}
        />
        <button
          onClick={sendMessage}
          disabled={loading}
          className="bg-blue-500 text-white px-4 py-2 rounded-lg disabled:opacity-50"
        >
          Send
        </button>
      </div>

      {/* Loading & Error */}
      {loading && <p className="text-blue-600 mt-2">AI is thinking...</p>}
      {error && <p className="text-red-500 mt-2">{error}</p>}
    </div>
  );
}

export default Roomchat;
