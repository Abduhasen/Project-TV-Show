// You can edit ALL of the code here

let allEpisodes = [];
let resultsContainer;
let searchInput;
let countDisplay;
let episodeSelect;

function setup() {
  allEpisodes = getAllEpisodes();

  createLayout();
  setupSearch();
  setupDropdown();

  displayEpisodes(allEpisodes);
}

function createLayout() {
  const rootElem = document.getElementById("root");
  const mainElem = document.createElement("main");
  mainElem.classList.add("page");

  // SEARCH
  searchInput = document.createElement("input");
  searchInput.type = "text";
  searchInput.placeholder = "Search episodes...";

  // DROPDOWN
  episodeSelect = document.createElement("select");

  // COUNT DISPLAY
  countDisplay = document.createElement("p");
  countDisplay.classList.add("count-display");

  // RESULTS
  resultsContainer = document.createElement("div");
  resultsContainer.classList.add("results-container");

  mainElem.append(searchInput, episodeSelect, countDisplay, resultsContainer);
  rootElem.append(mainElem);
}

function setupSearch() {
  searchInput.addEventListener("input", () => {
    episodeSelect.value = "all"; // reset dropdown when searching

    const query = searchInput.value.toLowerCase();

    const filtered = allEpisodes.filter((ep) => {
      const name = ep.name.toLowerCase();

      const summary = (ep.summary || "").toLowerCase().replace(/<[^>]*>/g, "");

      return name.includes(query) || summary.includes(query);
    });

    displayEpisodes(filtered);
  });
}

function setupDropdown() {
  episodeSelect.innerHTML = "";

  // RESET option (required for bonus)
  const allOption = document.createElement("option");
  allOption.value = "all";
  allOption.textContent = "All episodes";
  episodeSelect.appendChild(allOption);

  // episode options
  allEpisodes.forEach((ep) => {
    const option = document.createElement("option");

    const code = `S${ep.season.toString().padStart(2, "0")}E${ep.number
      .toString()
      .padStart(2, "0")}`;

    option.value = ep.id;
    option.textContent = `${code} - ${ep.name}`;

    episodeSelect.appendChild(option);
  });

  // behaviour
  episodeSelect.addEventListener("change", () => {
    const value = episodeSelect.value;

    // RESET VIEW
    if (value === "all") {
      displayEpisodes(allEpisodes);
      searchInput.value = "";
      return;
    }

    // SHOW ONLY ONE EPISODE (BONUS REQUIREMENT)
    const selected = allEpisodes.find((ep) => ep.id == value);

    if (selected) {
      displayEpisodes([selected]);
    }
  });
}

function displayEpisodes(episodeList) {
  resultsContainer.innerHTML = "";

  const cards = episodeList.map(createEpisodeCard);
  resultsContainer.append(...cards);

  countDisplay.textContent = `Displaying ${episodeList.length} / ${allEpisodes.length} episodes`;
}

function createEpisodeCard(episode) {
  const { name, season, number, image, summary } = episode;

  const card = document.createElement("article");
  card.classList.add("episode-card");

  const episodeCode = `S${season.toString().padStart(2, "0")}E${number
    .toString()
    .padStart(2, "0")}`;

  const title = document.createElement("h3");
  title.textContent = `${name} - ${episodeCode}`;

  const imageOfEpisode = document.createElement("img");
  imageOfEpisode.src = image?.medium || "";
  imageOfEpisode.alt = name;

  const summaryElement = document.createElement("p");
  summaryElement.innerHTML = summary;

  card.append(title, imageOfEpisode, summaryElement);

  return card;
}

window.onload = setup;
