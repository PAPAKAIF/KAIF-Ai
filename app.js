const form = document.getElementById("chatForm");
const promptBox = document.getElementById("prompt");
const chatArea = document.getElementById("chatArea");
const welcome = document.getElementById("welcome");
const sendBtn = document.getElementById("sendBtn");
const messages = [];

function addMessage(role, content, loading=false) {
  welcome.style.display = "none";
  const row = document.createElement("div");
  row.className = `message ${role}${loading ? " loading" : ""}`;
  if (role === "assistant") {
    const avatar = document.createElement("div");
    avatar.className = "msg-avatar";
    avatar.textContent = "K";
    row.appendChild(avatar);
  }
  const bubble = document.createElement("div");
  bubble.className = "bubble";
  bubble.textContent = content;
  row.appendChild(bubble);
  chatArea.appendChild(row);
  row.scrollIntoView({ behavior: "smooth", block: "end" });
  return { row, bubble };
}

async function sendMessage(text) {
  const clean = text.trim();
  if (!clean || sendBtn.disabled) return;
  messages.push({ role: "user", content: clean });
  addMessage("user", clean);
  promptBox.value = "";
  promptBox.style.height = "auto";
  sendBtn.disabled = true;
  const pending = addMessage("assistant", "Kaif AI is thinking…", true);
  try {
    const response = await fetch("/api/chat", {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({ messages })
    });
    const data = await response.json();
    if (!response.ok) throw new Error(data.error || "Request failed");
    pending.bubble.textContent = data.reply;
    messages.push({ role: "assistant", content: data.reply });
  } catch (error) {
    pending.bubble.textContent = error.message;
  } finally {
    pending.row.classList.remove("loading");
    sendBtn.disabled = false;
    promptBox.focus();
  }
}

form.addEventListener("submit", e => { e.preventDefault(); sendMessage(promptBox.value); });
promptBox.addEventListener("input", () => {
  promptBox.style.height = "auto";
  promptBox.style.height = Math.min(promptBox.scrollHeight, 150) + "px";
});
promptBox.addEventListener("keydown", e => {
  if (e.key === "Enter" && !e.shiftKey) { e.preventDefault(); form.requestSubmit(); }
});
document.querySelectorAll(".suggestion").forEach(btn => btn.addEventListener("click", () => sendMessage(btn.dataset.prompt)));
document.getElementById("newChat").addEventListener("click", () => {
  messages.length = 0; chatArea.innerHTML = ""; welcome.style.display = "";
  document.getElementById("sidebar").classList.remove("open"); promptBox.focus();
});
document.getElementById("menuBtn").addEventListener("click", () => document.getElementById("sidebar").classList.toggle("open"));
document.getElementById("historyBtn").addEventListener("click", () => alert("Chat history and user accounts will be added in the next development phase."));
