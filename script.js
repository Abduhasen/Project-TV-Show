//You can edit ALL of the code here
function setup() {
  const allEpisodes = getAllEpisodes();
  makePageForEpisodes(allEpisodes);
}

function makePageForEpisodes(episodeList) {
  const rootElem = document.getElementById("root");
  const cards = episodeList.map((episode) => createEpisodeCard(episode));
  rootElem.append(...cards);
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
