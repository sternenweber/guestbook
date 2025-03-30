const form = document.getElementById('guestForm');
const messagesDiv = document.getElementById('messages');

form.addEventListener('submit', async (e) => {
  e.preventDefault();
  const name = document.getElementById('name').value.trim();
  const message = document.getElementById('message').value.trim();

  if (name && message) {
    await fetch('http://localhost:3000/messages', {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({ name, message }),
    });
    form.reset();
    loadMessages();
  }
});

async function loadMessages() {
  const res = await fetch('http://localhost:3000/messages');
  const data = await res.json();

  messagesDiv.innerHTML = data.map(msg => `
    <div class="message">
      <strong>${msg.name}</strong>: ${msg.message} <br/>
      <small>${new Date(msg.time).toLocaleString()}</small>
    </div>
  `).join('');
}

loadMessages();
