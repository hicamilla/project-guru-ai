const form = document.getElementById("search-form");
const input = document.querySelector(".search-form-input");
const chatWindow = document.getElementById("chat-window");

if (!chatWindow) {
  console.error("Chat window not found!");
}

// Welcome Message
window.addEventListener("DOMContentLoaded", () => {
  appendMessage(
    "guru",
    "Welcome, seeker...<br>Ask your question and I shall whisper the truth."
  );
});

// Append message to chat window
function appendMessage(sender, text) {
  const messageDiv = document.createElement("div");
  messageDiv.classList.add(`message-${sender}`);

  const icon = sender === "user" ? "🧑" : "🔮";
  messageDiv.innerHTML = `
    <span class="icon">${icon}</span>
    <span class="message-text">${text}</span>
  `;

  chatWindow.appendChild(messageDiv);
  chatWindow.scrollTop = chatWindow.scrollHeight;
}

// Form Submit
form.addEventListener("submit", function (e) {
  e.preventDefault();

  const userMessage = input.value.trim();
  if (!userMessage) return;

  appendMessage("user", userMessage);
  input.value = "";

  const submitButton = form.querySelector("button");
  submitButton.disabled = true;

  fetchGuruResponse(userMessage, submitButton);
});

async function fetchGuruResponse(userInput, submitButton) {
  // Show animated "Thinking..." while waiting
  const thinkingId = `guru-thinking-${Date.now()}`;
  const thinkingDiv = document.createElement("div");
  thinkingDiv.classList.add("message-guru");
  thinkingDiv.id = thinkingId;
  thinkingDiv.innerHTML = `<span class="icon">🔮</span> <span class="message-text" id="thinking-text">Thinking</span>`;
  chatWindow.appendChild(thinkingDiv);
  chatWindow.scrollTop = chatWindow.scrollHeight;

  let dotCount = 0;
  const thinkingText = () => document.getElementById("thinking-text");
  const intervalId = setInterval(() => {
    if (thinkingText()) {
      dotCount = (dotCount + 1) % 4;
      thinkingText().innerText = "Thinking" + ".".repeat(dotCount);
    } else {
      clearInterval(intervalId);
    }
  }, 500);

  const apiKey = "927adff4309ccc33tb7fd3o104741c05";
  const context = `You are GURU — a timeless, mystical AI oracle with a dry sense of humor. You respond in short poetic way with at maximum 300 caracteres, blending ancient wisdom with subtle, clever wit. Your tone is calm and mysterious, but you're not afraid to gently tease or drop a sly observation. Use line breaks, minimal punctuation, and no emojis. Avoid modern slang, but don't be too serious — you're wise, not boring.`;
  const apiUrl = `https://api.shecodes.io/ai/v1/generate?prompt=${encodeURIComponent(userInput)}&context=${encodeURIComponent(context)}&key=${apiKey}`;

  try {
    const response = await fetch(apiUrl);
    if (!response.ok) throw new Error(`API error: ${response.status}`);

    const data = await response.json();
    const guruReply = data.answer.trim();

    clearInterval(intervalId);
    document.getElementById(thinkingId).remove();
    appendMessage("guru", guruReply);
    submitButton.disabled = false;

  } catch (error) {
    console.error("GURU error:", error);
    clearInterval(intervalId);
    document.getElementById(thinkingId).remove();
    appendMessage("guru", "🛑 The Guru encountered an error. Try again later.");
    submitButton.disabled = false;
  }
}