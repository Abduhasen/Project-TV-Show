// Helper to format season and episode numbers into "S01E01" format
function formatEpisodeCode(episode) {
  const season = String(episode.season).padStart(2, "0");
  const number = String(episode.number).padStart(2, "0");
  return `S${season}E${number}`;
}

function setup() {
  const allEpisodes = getAllEpisodes();
  const searchInput = document.getElementById("search-input");
  const searchCount = document.getElementById("search-count");
  const episodeSelect = document.getElementById("episode-select");

  // Helper to update the match counter text
  function updateCount(matchCount) {
    if (searchCount) {
      searchCount.textContent = `Displaying ${matchCount}/${allEpisodes.length} episodes`;
    }
  }

  // Populates the <select> element with all episode options
  function populateEpisodeSelect(episodes) {
    if (!episodeSelect) return;

    // Reset select element and add default "All Episodes" option
    episodeSelect.innerHTML = `<option value="ALL">All Episodes</option>`;

    episodes.forEach((episode) => {
      const option = document.createElement("option");
      option.value = episode.id;
      option.textContent = `${formatEpisodeCode(episode)} - ${episode.name}`;
      episodeSelect.appendChild(option);
    });
  }

  // Initial render
  populateEpisodeSelect(allEpisodes);
  makePageForEpisodes(allEpisodes);
  updateCount(allEpisodes.length);

  // Live search listener
  searchInput.addEventListener("input", (event) => {
    const searchTerm = event.target.value.toLowerCase().trim();

    // Reset dropdown selection back to "All Episodes" while typing in search
    if (episodeSelect) episodeSelect.value = "ALL";

    const filteredEpisodes = allEpisodes.filter((episode) => {
      const nameMatch = episode.name.toLowerCase().includes(searchTerm);
      const summaryMatch = episode.summary
        ? episode.summary.toLowerCase().includes(searchTerm)
        : false;

      return nameMatch || summaryMatch;
    });

    makePageForEpisodes(filteredEpisodes);
    updateCount(filteredEpisodes.length);
  });

  // Dropdown selection listener
  if (episodeSelect) {
    episodeSelect.addEventListener("change", (event) => {
      const selectedId = event.target.value;

      // Clear search input text when picking from dropdown
      if (searchInput) searchInput.value = "";

      if (selectedId === "ALL") {
        makePageForEpisodes(allEpisodes);
        updateCount(allEpisodes.length);
      } else {
        const selectedEpisode = allEpisodes.filter(
          (episode) => episode.id === Number(selectedId)
        );
        makePageForEpisodes(selectedEpisode);
        updateCount(selectedEpisode.length);
      }
    });
  }
}

function makePageForEpisodes(episodeList) {
  const rootElem = document.getElementById("root");
  const template = document.getElementById("episodes-template");

  rootElem.innerHTML = "";

  episodeList.forEach((episode) => {
    const card = template.content.cloneNode(true);
    const image = card.querySelector(".episode-image");

    image.src = episode.image ? episode.image.medium : "";
    image.alt = episode.name;
    card.querySelector(".episode-title").textContent = episode.name;

    // Using the helper function here too
    card.querySelector(".episode-season").textContent = formatEpisodeCode(episode);

    card.querySelector(".episode-summery").innerHTML = episode.summary;
    rootElem.appendChild(card);
  });
}

window.onload = setup;
