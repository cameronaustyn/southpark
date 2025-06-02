
document.addEventListener('DOMContentLoaded', () => {
  const episodeList = document.getElementById('episode-list');
  const searchInput = document.getElementById('search');
  const seasonSelect = document.getElementById('season-select');
  const header = document.querySelector('header');
  let episodes = [];

  // Create Dark Mode Toggle button
  const darkToggle = document.createElement('button');
  darkToggle.textContent = '🌙 Dark Mode';
  darkToggle.id = 'dark-toggle';
  darkToggle.style.marginLeft = '10px';
  darkToggle.style.padding = '0.5rem 1rem';
  darkToggle.style.fontSize = '1rem';
  darkToggle.style.borderRadius = '6px';
  darkToggle.style.border = 'none';
  darkToggle.style.cursor = 'pointer';
  header.appendChild(darkToggle);

  // Audio Controls
  const audioContainer = document.createElement('div');
  audioContainer.id = 'audio-container';
  audioContainer.style.position = 'fixed';
  audioContainer.style.bottom = '10px';
  audioContainer.style.right = '10px';
  audioContainer.style.background = 'rgba(0,0,0,0.7)';
  audioContainer.style.padding = '0.5rem 1rem';
  audioContainer.style.borderRadius = '12px';
  audioContainer.style.display = 'flex';
  audioContainer.style.alignItems = 'center';
  audioContainer.style.gap = '10px';
  audioContainer.style.zIndex = '1000';

  const audio = document.createElement('audio');
  audio.src = 'https://upload.wikimedia.org/wikipedia/en/3/3e/South_Park_Theme_song.ogg';
  audio.loop = true;
  audio.volume = 0.2;
  audioContainer.appendChild(audio);

  const audioToggle = document.createElement('button');
  audioToggle.textContent = '🔈 Play Theme';
  audioToggle.style.cursor = 'pointer';
  audioToggle.style.border = 'none';
  audioToggle.style.background = '#ff5722';
  audioToggle.style.color = '#fff';
  audioToggle.style.padding = '0.3rem 0.7rem';
  audioToggle.style.borderRadius = '6px';

  audioToggle.onclick = () => {
    if(audio.paused) {
      audio.play();
      audioToggle.textContent = '🔇 Mute Theme';
    } else {
      audio.pause();
      audioToggle.textContent = '🔈 Play Theme';
    }
  };

  audioContainer.appendChild(audioToggle);
  document.body.appendChild(audioContainer);

  // Dark Mode toggle logic
  let darkMode = false;
  darkToggle.onclick = () => {
    darkMode = !darkMode;
    if(darkMode) {
      document.body.classList.add('dark');
      darkToggle.textContent = '☀️ Light Mode';
    } else {
      document.body.classList.remove('dark');
      darkToggle.textContent = '🌙 Dark Mode';
    }
  };

  fetch('episodes.json')
    .then(response => response.json())
    .then(data => {
      episodes = data;
      populateSeasonOptions(episodes);
      renderEpisodes(episodes);
    });

  function populateSeasonOptions(episodes) {
    const seasons = [...new Set(episodes.map(ep => ep.season))].sort((a, b) => a - b);
    seasons.forEach(season => {
      const option = document.createElement('option');
      option.value = season;
      option.textContent = `Season ${season}`;
      seasonSelect.appendChild(option);
    });
  }

  function renderEpisodes(episodesToRender) {
    episodeList.innerHTML = '';
    episodesToRender.forEach(ep => {
      const card = document.createElement('div');
      card.className = 'episode-card';
      card.innerHTML = `
        <img src="${ep.thumbnail}" alt="${ep.title}" />
        <h3><img src="${ep.character_icon}" alt="icon" class="char-icon" /> ${ep.title}</h3>
        <p>${ep.description}</p>
        <a href="${ep.link}" target="_blank" rel="noopener noreferrer">Watch Episode</a>
      `;
      episodeList.appendChild(card);
    });
  }

  searchInput.addEventListener('input', () => {
    const query = searchInput.value.toLowerCase();
    const filtered = episodes.filter(ep =>
      ep.title.toLowerCase().includes(query) ||
      ep.description.toLowerCase().includes(query)
    );
    renderEpisodes(filtered);
  });

  seasonSelect.addEventListener('change', () => {
    const season = seasonSelect.value;
    const filtered = season === 'all' ? episodes : episodes.filter(ep => ep.season == season);
    renderEpisodes(filtered);
  });
});
