// Helper to format season and episode numbers into "S01E01" format
function formatEpisodeCode(episode) {
  const season = String(episode.season).padStart(2, "0");
  const number = String(episode.number).padStart(2, "0");
  return `S${season}E${number}`;
}

// Cache episode requests so each episode URL is fetched only once
const episodeCache = {};

function getEpisodesForShow(showId) {
  if (!episodeCache[showId]) {
    episodeCache[showId] = fetch(
      `https://api.tvmaze.com/shows/${showId}/episodes`
    ).then((response) => {
      if (!response.ok) {
        throw new Error(`Failed to load episodes for show ID ${showId}`);
      }

      return response.json();
    });
  }

  return episodeCache[showId];
}

// Creates or gets the .controls container
function getControlsContainer() {
  let controls = document.querySelector(".controls");

  if (!controls) {
    controls = document.createElement("div");
    controls.className = "controls";

    const root = document.getElementById("root");
    root.parentNode.insertBefore(controls, root);
  }

  return controls;
}

async function setup() {
  const controls = getControlsContainer();

  // Create the controls once
  controls.innerHTML = `
    <select id="show-select"></select>
    <select id="episode-select"></select>
    <input id="search-input" type="text" placeholder="Search episodes..." />
    <span id="search-count">Loading shows...</span>
  `;

  const showSelect = document.getElementById("show-select");
  const episodeSelect = document.getElementById("episode-select");
  const searchInput = document.getElementById("search-input");
  const searchCount = document.getElementById("search-count");

  // Episodes belonging to the currently selected show
  let currentEpisodes = [];

  // Name of the currently selected show
  let currentShowName = "";

  try {
    // Fetch all shows
    const showsResponse = await fetch("https://api.tvmaze.com/shows");

    if (!showsResponse.ok) {
      throw new Error("Failed to load shows");
    }

    const allShows = await showsResponse.json();

    // Sort alphabetically, ignoring case
    allShows.sort((a, b) =>
      a.name.localeCompare(b.name, undefined, {
        sensitivity: "base",
      })
    );

    // Add shows to show dropdown
    allShows.forEach((show) => {
      const option = document.createElement("option");

      option.value = show.id;
      option.textContent = show.name;

      showSelect.appendChild(option);
    });

    // Update the count shown beside the controls
    function updateCount(numberOfEpisodes) {
      searchCount.textContent =
        `Displaying ${numberOfEpisodes}/${currentEpisodes.length} episodes`;
    }

    // Populate the episode dropdown for the current show
    function populateEpisodeSelect(episodes) {
      episodeSelect.innerHTML =
        `<option value="ALL">All Episodes</option>`;

      episodes.forEach((episode) => {
        const option = document.createElement("option");

        option.value = episode.id;
        option.textContent =
          `${formatEpisodeCode(episode)} - ${episode.name}`;

        episodeSelect.appendChild(option);
      });
    }

    // Load episodes for a show
    async function loadShow(showId) {
      searchCount.textContent = "Loading episodes...";

      try {
        // Find the selected show
        const selectedShow = allShows.find(
          (show) => show.id === Number(showId)
        );

        if (!selectedShow) {
          return;
        }

        currentShowName = selectedShow.name;

        // Get episodes from cache or fetch them
        currentEpisodes = await getEpisodesForShow(showId);

        // Clear search when changing shows
        searchInput.value = "";

        // Reset episode dropdown
        populateEpisodeSelect(currentEpisodes);

        // Display the new show's episodes
        makePageForEpisodes(
          currentEpisodes,
          currentShowName
        );

        updateCount(currentEpisodes.length);
      } catch (error) {
        searchCount.textContent = "Error loading episodes.";
        console.error(error);
      }
    }

    // Load the first show when the page opens
    if (allShows.length > 0) {
      await loadShow(allShows[0].id);
    }

    // Show dropdown
    showSelect.addEventListener("change", async (event) => {
      await loadShow(event.target.value);
    });

    // Search
    searchInput.addEventListener("input", (event) => {
      const searchTerm = event.target.value
        .toLowerCase()
        .trim();

      // Reset episode selector when searching
      episodeSelect.value = "ALL";

      const filteredEpisodes = currentEpisodes.filter((episode) => {
        const nameMatch = episode.name
          .toLowerCase()
          .includes(searchTerm);

        const summaryMatch = episode.summary
          ? episode.summary
              .replace(/<[^>]*>/g, "")
              .toLowerCase()
              .includes(searchTerm)
          : false;

        return nameMatch || summaryMatch;
      });

      makePageForEpisodes(
        filteredEpisodes,
        currentShowName
      );

      updateCount(filteredEpisodes.length);
    });

    // Episode dropdown
    episodeSelect.addEventListener("change", (event) => {
      const selectedId = event.target.value;

      // Clear search when selecting an episode
      searchInput.value = "";

      if (selectedId === "ALL") {
        makePageForEpisodes(
          currentEpisodes,
          currentShowName
        );

        updateCount(currentEpisodes.length);
        return;
      }

      const selectedEpisode = currentEpisodes.find(
        (episode) => episode.id === Number(selectedId)
      );

      if (selectedEpisode) {
        makePageForEpisodes(
          [selectedEpisode],
          currentShowName
        );

        updateCount(1);
      }
    });
  } catch (error) {
    searchCount.textContent = "Failed to load TV shows.";
    console.error(error);
  }
}

// Render episode cards
function makePageForEpisodes(episodeList, showName) {
  const rootElem = document.getElementById("root");

  rootElem.innerHTML = "";

  // Show heading
  const heading = document.createElement("h1");
  heading.textContent = `${showName} Episodes`;
  rootElem.appendChild(heading);

  // Show episode count
  const count = document.createElement("p");
  count.textContent = `Displaying ${episodeList.length} episodes`;
  rootElem.appendChild(count);

  // TVMaze credit
  const credit = document.createElement("p");

  credit.innerHTML =
    'Data originally from <a href="https://tvmaze.com/" target="_blank" rel="noopener noreferrer">TVMaze.com</a>';

  rootElem.appendChild(credit);

  // Episode cards container
  const container = document.createElement("div");
  container.className = "episodes-container";

  episodeList.forEach((episode) => {
    const card = document.createElement("article");
    card.className = "episode-card";

    card.innerHTML = `
      <h2>${episode.name} - ${formatEpisodeCode(episode)}</h2>

      <img
        src="${episode.image?.medium || ""}"
        alt="${episode.name}"
      >

      <div class="episode-summary">
        ${episode.summary || ""}
      </div>

      ${
        episode.url
          ? `<a href="${episode.url}" target="_blank" rel="noopener noreferrer">
               View on TVMaze
             </a>`
          : ""
      }
    `;

    container.appendChild(card);
  });

  rootElem.appendChild(container);
}

window.onload = setup;
