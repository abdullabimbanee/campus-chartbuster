const token = localStorage.getItem('token');
if (!token) {
    window.location.href = '/';
}

document.getElementById('logoutBtn').addEventListener('click', () => {
    localStorage.removeItem('token');
    localStorage.removeItem('user');
    window.location.href = '/';
});

async function loadLeaderboard() {
    try {
        const res = await fetch('/api/leads/leaderboard');
        const data = await res.json();
        const board = document.getElementById('leaderboard');
        board.innerHTML = '';
        if (!Array.isArray(data)) return;
        data.forEach((l, idx) => {
            const div = document.createElement('div');
            div.className = 'lead-card';
            div.innerHTML = `
        <div class="lead-left">
          <div class="avatar">${idx + 1}</div>
          <div>
            <strong>${l.user?.name || 'Unknown'}</strong>
            <small>${l.user?.college || ''}</small>
          </div>
        </div>
        <div>
          <strong>${l.points || 0} pts</strong>
          <small>Events: ${l.eventsHosted || 0} • Participants: ${l.participants || 0}</small>
        </div>
      `;
            board.appendChild(div);
        });
    } catch (err) {
        console.error(err);
    }
}

async function loadProfile() {
    try {
        const res = await fetch('/api/leads/me', {
            headers: { Authorization: 'Bearer ' + token }
        });
        const profileDiv = document.getElementById('myprofile');
        if (!res.ok) {
            profileDiv.innerText = 'Unable to load profile';
            return;
        }
        const data = await res.json();
        profileDiv.innerHTML = `
      <strong>${data.user.name}</strong>
      <div>${data.user.college} • ${data.user.email}</div>
      <p>Points: ${data.points}</p>
      <p>Events hosted: ${data.eventsHosted}</p>
      <p>Participants reached: ${data.participants}</p>
      <p>Badges: ${data.badges?.join(', ') || '—'}</p>
    `;
    } catch (err) {
        console.error(err);
    }
}

loadLeaderboard();
loadProfile();

// refresh leaderboard every 30s (optional)
setInterval(loadLeaderboard, 30000);
