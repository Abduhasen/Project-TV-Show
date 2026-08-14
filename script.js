function setup() {
  const allEpisodes = getAllEpisodes();
  const searchInput = document.getElementById("search-input");
  const searchCount = document.getElementById("search-count");

  // Helper to update the match counter text
  function updateCount(matchCount) {
    if (searchCount) {
      searchCount.textContent = `Displaying ${matchCount}/${allEpisodes.length} episodes`;
    }
  }

  // Initial render with all episodes
  makePageForEpisodes(allEpisodes);
  updateCount(allEpisodes.length);

  // Live search listener
  searchInput.addEventListener("input", (event) => {
    const searchTerm = event.target.value.toLowerCase().trim();

    const filteredEpisodes = allEpisodes.filter((episode) => {
      const nameMatch = episode.name.toLowerCase().includes(searchTerm);
      // Safe check in case summary is null or undefined
      const summaryMatch = episode.summary
        ? episode.summary.toLowerCase().includes(searchTerm)
        : false;

      return nameMatch || summaryMatch;
    });

    makePageForEpisodes(filteredEpisodes);
    updateCount(filteredEpisodes.length);
  });
}

function makePageForEpisodes(episodeList) {
  const rootElem = document.getElementById("root");
  const template = document.getElementById("episodes-template");

  // Clear existing episodes before rendering filtered list
  rootElem.innerHTML = "";

  episodeList.forEach((episode) => {
    const card = template.content.cloneNode(true);
    const image = card.querySelector(".episode-image");
    
    image.src = episode.image ? episode.image.medium : "";
    image.alt = episode.name;
    card.querySelector(".episode-title").textContent = episode.name;

    const season = String(episode.season).padStart(2, "0");
    const number = String(episode.number).padStart(2, "0");
    card.querySelector(".episode-season").textContent = `S${season}E${number}`;

    card.querySelector(".episode-summery").innerHTML = episode.summary;
    rootElem.appendChild(card);
  });
}

window.onload = setup;
