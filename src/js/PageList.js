import { urlPrefix, apiKey } from './index';

import dayjs from 'dayjs';
import duration from 'dayjs/plugin/duration';

dayjs.extend(duration);

const PageList = (argument = "", nbClicksOnSeeMoreButton = 1) => {
  const platforms = () => {
    const prepareList = (nbPages = 1) => {
      const fetchList = (url) => {
        console.log("nbPages", nbPages);
        console.log("url", url);
        fetch(`${url}`)
          .then((response) => response.json())
          .then((response) => {
            if (response !== null && response !== undefined && response.count > 0) {
              response.results.forEach((platform) => {
                platformList.push(platform);
              });
            }
        });
      };
       
      let platformList = [];
      let finalURL = urlPrefix + "platforms" + "?key=" + apiKey;
      fetchList(finalURL);
      nbPages++;
      finalURL += `&page=${nbPages}`;
      fetchList(finalURL);
      return platformList;
    };
     
    return prepareList();
  }
   
  const preparePage = () => {
    let platformList = platforms();
     
    let cleanedArgument = argument.replace(/\s+/g, "-");
    let articles = "";
    console.log("nbClicksOnSeeMoreButton", nbClicksOnSeeMoreButton);
    
    const fetchList = (url, argument) => {
      let finalURL = urlPrefix + url + "?key=" + apiKey + `&page_size=${nbClicksOnSeeMoreButton * 9}`;
      if (argument) {
        finalURL += "&search=" + argument + "&search_precise=true";
      } else {
        let fromDate = dayjs().add(dayjs.duration({'days' : 1}));
        let toDate = fromDate.add(dayjs.duration({ months: Text }));
        finalURL += `&dates=${fromDate.format('YYYY-MM-DD')},${toDate.format('YYYY-MM-DD')}&ordering=-added`;
      }
      
      console.log("finalURL", finalURL);
      
      fetch(`${finalURL}`)
        .then((response) => response.json())
        .then((response) => {
          if (response !== null && response !== undefined && response.count > 0) {
            if (response.count <= nbClicksOnSeeMoreButton * 9) {
              bottomPageContent.innerHTML = "";
            }
             
            response.results.forEach((article) => {
              articles += `
                <div class="cardGame">
                  <div class="cardGame-container">
                    <div class="img-cardGame" style="background-image: url('${article.background_image}');" alt="Background image for ${article.name}"></div>
                    <div class="content-cardGame">
                      <h3>${article.released}</h3>
		      <h3>${article.rating}/5 - ${article.ratings_count} votes</h3>
		      <p>${article.genres.map(genre => { return " " + '<a class="internal" href="#games/&genres=' + genre.id + '">' + genre.name + '</a>'})}</p>
          <p>${developers[0].id}">${developers[0].name}</p>          
          </div>
		  </div>
                  <h3><a class="internal" href="#game/${article.slug}">${article.name}</a></h3>
                </div>
              `;
            });
       
            let options = "";
            platformList.forEach((platform) => {
              options += `<option value="${platform.id}">Platform : ${platform.name}</option>`;
            });
            document.querySelector(".page-list .platform-select").innerHTML = `
              <select name="select-platform" id="select-platform">
                <option value="any">Platform : any</option>
                ${options}
              </select>
            `;
            const selectPlatform = document.getElementById("select-platform");
            selectPlatform.addEventListener('change', (event) => {
              let oldHRef = window.location.href;
              if (~window.location.href.indexOf("&platforms=")) {
                oldHRef = window.location.href.substr(0, window.location.href.indexOf("&platforms="));
              } else if (~window.location.href.indexOf("/platforms=")) {
                oldHRef = window.location.href.substr(0, window.location.href.indexOf("/platforms="));
              }
              const selected = `platforms=${event.target.value}`;
              if (selected != "platforms=any") {
                if (argument && argument.indexOf("&platforms=") == -1) {
                  console.log("argument", argument);
                  console.log("oldHRef", oldHRef);
                  window.location.href = `#games/${argument}&${selected}`;
                } else {
		  if (~window.location.href.indexOf("?#games/")) {
                    window.location.href = oldHRef + "&" + selected;
		  } else if (~window.location.href.indexOf("?#games")) {
                    window.location.href = oldHRef + "/&" + selected;
                  } else {
                    window.location.href += "?#games/&" + selected;
                  }
                }
              } else {
                window.location.href = oldHRef;
              }
            });
             
            document.querySelector(".page-list .articles").innerHTML = articles;
          } else {
            bottomPageContent.innerHTML = "";
            pageContent.innerHTML = `
              <section class="page-list">
                <div class="articles">...Unfortunately, no game matched your search : "${argument}"</div>
              </section>
            `;
          }
      });
    };
     
    fetchList("games", cleanedArgument);
  };
   
  const render = () => {
    topPageContent.innerHTML = `
      <div class="description">
        <h1>Welcome,</h1>
        <p>The Hyper Progame is the world's premier event for computer and video games and related products. At The Hyper Progame, the video game industry's top talent pack the Los Angeles Convention Center, connecting tens of thousands of the best, brightest, and most innovative in the interactive entertainment industry. For three exciting days, leading-edge companies, groundbreaking new technologies, and never-before-seenproducts will be showcased. The Hyper Progame connects you with both new and existing partners, industry executives, gamers, and social influencers providing unprecedented exposure</p>
      </div>
    `;
     
    pageContent.innerHTML = `
      <section class="page-list">
        <div class="platform-select"></div>
        <div class="articles">...loading</div>
      </section>
    `;
     
    preparePage();
  };
   
  render();
   
  if (nbClicksOnSeeMoreButton < 3) {
    bottomPageContent.innerHTML = `
      <div class="cta-container">
        <button type="button" class="cta" id="show-more-button">Show more</button>
      </div>
    `;
    const showMoreButton = document.getElementById("show-more-button");
    showMoreButton.onclick = function() {
      nbClicksOnSeeMoreButton++;
      if (nbClicksOnSeeMoreButton >= 3) {
        bottomPageContent.innerHTML = "";
      }
      render();
    }
  } else {
    bottomPageContent.innerHTML = "";
  }
};

export { PageList };
