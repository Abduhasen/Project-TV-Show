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
  const card = document.createElement("article");
  const episodeCode = `S${episode.season.toString().padStart(2, "0")}E${episode.number.toString().padStart(2, "0")}`;
  const title = document.createElement("h3");
  title.textContent = `${episode.name} - ${episodeCode}`;
  card.append(title);
  const imageOfEpisode = document.createElement("img");
  imageOfEpisode.src = episode.image.medium;
  card.append(imageOfEpisode);
  const summary = document.createElement("p");
  summary.innerHTML = episode.summary;
  card.append(summary);
  return card;
}
window.onload = setup;
