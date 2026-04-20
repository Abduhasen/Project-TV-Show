//You can edit ALL of the code here
function setup() {
  const allEpisodes = getAllEpisodes();
  makePageForEpisodes(allEpisodes);
  searchInput(allEpisodes);
  setupDropdown(allEpisodes);
}

function makePageForEpisodes(episodeList) {
  const rootElem = document.getElementById("root");
  const cards = episodeList.map((episode) => createEpisodeCard(episode));

  rootElem.append(...cards);
}

function searchInput(allEpisodes) {
  const search = document.createElement("input");
  search.type = "text";
  search.placeholder = "Search episodes...";

  const countDisplay = document.createElement("p");
  countDisplay.classList.add("count-display");
  countDisplay.textContent = `Displaying ${allEpisodes.length} / ${allEpisodes.length} episodes`;

  const controls = document.createElement("div");
  controls.classList.add("controls");
  controls.append(search);
  document.body.prepend(countDisplay);
  document.body.prepend(controls);
  search.addEventListener("input", () => {
    const query = search.value.toLowerCase();

    const filtered = allEpisodes.filter((ep) => {
      const name = ep.name.toLowerCase();
      const summary = (ep.summary || "").toLowerCase().replace(/<[^>]*>/g, "");
      return name.includes(query) || summary.includes(query);
    });

    const toDisplay = query === "" ? allEpisodes : filtered;

    const rootElem = document.getElementById("root");
    rootElem.innerHTML = "";
    const cards = toDisplay.map(createEpisodeCard);
    rootElem.append(...cards);

    countDisplay.textContent = `Displaying ${toDisplay.length} / ${allEpisodes.length} episodes`;
  });
}

function setupDropdown(allEpisodes) {
  const episodeSelect = document.createElement("select");

  const allOption = document.createElement("option");
  allOption.value = "all";
  allOption.textContent = "All episodes";
  episodeSelect.appendChild(allOption);

  allEpisodes.forEach((ep) => {
    const option = document.createElement("option");
    const code = `S${ep.season.toString().padStart(2, "0")}E${ep.number.toString().padStart(2, "0")}`;
    option.value = ep.id;
    option.textContent = `${code} - ${ep.name}`;
    episodeSelect.appendChild(option);
  });

  const controls = document.querySelector(".controls");
  controls.append(episodeSelect);

  const countDisplay = document.querySelector("p");

  episodeSelect.addEventListener("change", () => {
    const value = episodeSelect.value;
    const rootElem = document.getElementById("root");
    rootElem.innerHTML = "";

    if (value === "all") {
      const cards = allEpisodes.map(createEpisodeCard);
      rootElem.append(...cards);
      countDisplay.textContent = `Displaying ${allEpisodes.length} / ${allEpisodes.length} episodes`;
      return;
    }

    const selected = allEpisodes.find((ep) => ep.id == value);
    if (selected) {
      const card = createEpisodeCard(selected);
      rootElem.append(card);
      countDisplay.textContent = `Displaying 1 / ${allEpisodes.length} episodes`;
    }
  });
}

function createEpisodeCard(episode) {
  const { name, season, number, image, summary } = episode;
  const card = document.createElement("article");
  const episodeCode = `S${season.toString().padStart(2, "0")}E${number.toString().padStart(2, "0")}`;
  const title = document.createElement("h3");
  title.textContent = `${name} - ${episodeCode}`;

  const imageOfEpisode = document.createElement("img");
  imageOfEpisode.src = image.medium;

  const summaryElement = document.createElement("p");
  summaryElement.innerHTML = summary;
  card.append(title, imageOfEpisode, summaryElement);
  return card;
}
window.onload = setup;
