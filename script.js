// Helper to format season and episode numbers into "S01E01" format
function formatEpisodeCode(episode) {
  const season = String(episode.season).padStart(2, "0");
  const number = String(episode.number).padStart(2, "0");
  return `S${season}E${number}`;
}

async function setup() {
  const searchInput = document.getElementById("search-input");
  const searchCount = document.getElementById("search-count");
  const episodeSelect = document.getElementById("episode-select");

  // Show loading message
  if (searchCount) {
    searchCount.textContent = "Loading episodes...";
  }
  try {
    // Fetch episodes from the API ONCE
    const response = await fetch("https://api.tvmaze.com/shows/82/episodes");
    if (!response.ok) {
      throw new Error("Failed to load episodes");
    }
    const allEpisodes = await response.json();
    // Helper to update the match counter text
    function updateCount(matchCount) {
      if (searchCount) {
        searchCount.textContent = `Displaying ${matchCount}/${allEpisodes.length} episodes`;
      }
    }
    // Populates the <select> element with all episode options
    function populateEpisodeSelect(episodes) {
      if (!episodeSelect) return;
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
    if (searchInput) {
      searchInput.addEventListener("input", (event) => {
        const searchTerm = event.target.value.toLowerCase().trim();

        if (episodeSelect) {
          episodeSelect.value = "ALL";
        }

        const filteredEpisodes = allEpisodes.filter((episode) => {
          const nameMatch = episode.name.toLowerCase().includes(searchTerm);

          const summaryMatch = episode.summary
            ? episode.summary
                .replace(/<[^>]*>/g, "")
                .toLowerCase()
                .includes(searchTerm)
            : false;

          return nameMatch || summaryMatch;
        });

        makePageForEpisodes(filteredEpisodes);
        updateCount(filteredEpisodes.length);
      });
    }

    // Dropdown selection listener
    if (episodeSelect) {
      episodeSelect.addEventListener("change", (event) => {
        const selectedId = event.target.value;
        if (searchInput) {
          searchInput.value = "";
        }
        if (selectedId === "ALL") {
          makePageForEpisodes(allEpisodes);
          updateCount(allEpisodes.length);
        } else {
          const selectedEpisode = allEpisodes.filter(
            (episode) => episode.id === Number(selectedId),
          );
          makePageForEpisodes(selectedEpisode);
          updateCount(selectedEpisode.length);
        }
      });
    }
  } catch (error) {
    // Show error to the USER, not just the console
    if (searchCount) {
      searchCount.textContent =
        "Sorry, there was a problem loading the episodes.";
    }
    console.error(error);
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
    card.querySelector(".episode-season").textContent =
      formatEpisodeCode(episode);
    card.querySelector(".episode-summery").innerHTML = episode.summary;
    rootElem.appendChild(card);
  });
}

window.onload = setup;
