import '../sass/style.scss';

import { routes } from './routes';

const urlPrefix = "https://api.rawg.io/api/";
const apiKey = process.env.RAWG_IO_APIKEY;

const setRoute = () => {
  let path = window.location.hash.substring(1).split("/");
  let pageArgument = path[1] || "";
  
  var pageContent = document.getElementById("pageContent");
  var bottomPageContent = document.getElementById("bottomPageContent");
  if (routes[path[0]] === "PageList" || routes[path[0]] === "Home") {
    var nbClicksOnSeeMoreButton = 1;
    routes[path[0]](pageArgument, nbClicksOnSeeMoreButton);
  } else {
    routes[path[0]](pageArgument);
  }
  return true;
};

window.addEventListener("hashchange", () => setRoute());
window.addEventListener("DOMContentLoaded", () => setRoute());

const keyWordsForSearchInput = document.getElementById("key-words-input");
keyWordsForSearchInput.addEventListener('keydown', () => {
  if (event.keyCode == 13) {
    window.location.href = `#games/${keyWordsForSearchInput.value}`;
  }
  setRoute();
});

export { urlPrefix, apiKey };
