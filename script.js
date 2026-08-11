//You can edit ALL of the code here
function setup() {
  const allEpisodes = getAllEpisodes();
  makePageForEpisodes(allEpisodes);
}

function makePageForEpisodes(episodeList) {
  const rootElem = document.getElementById("root");
  const template = document.getElementById("episodes-template");

  episodeList.forEach((episode) => {
    const card = template.content.cloneNode(true);
    const image = card.querySelector(".episode-image");
    image.src = episode.image.medium;
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
