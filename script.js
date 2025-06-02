document.addEventListener('DOMContentLoaded', () => {
  const episodeList = document.getElementById('episode-list');
  const searchInput = document.getElementById('search');
  const seasonSelect = document.getElementById('season-select');
  let episodes = [];

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
        <img src="\${ep.thumbnail}" alt="\${ep.title}" />
        <h3>\${ep.title}</h3>
        <p>\${ep.description}</p>
        <a href="\${ep.link}" target="_blank">Watch Episode</a>
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
