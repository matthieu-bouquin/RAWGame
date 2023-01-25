import { urlPrefix, apiKey } from './index';

const PageDetail = (argument = "") => {
  const preparePage = () => {
    let cleanedArgument = argument.replace(/\s+/g, "-");
    
    const fetchGame = (url, argument) => {
      let finalURL = urlPrefix + url + "/" + argument + "?key=" + apiKey;
      console.log("finalURL", finalURL);
      const detailsContainer = document.querySelector('.details-container');
      
      fetch(`${finalURL}`)
        .then((response) => response.json())
        .then((response) => {
          if (response !== null && response !== undefined) {
            let { id, slug, name, description, released, background_image, website, rating, ratings_count, platforms, stores, developers, genres, tags, publishers
            } = response;
              
            detailsContainer.innerHTML = `
              <div class="hero-banner">
                <div class="banner" style="background-image: url('${background_image}');"></div>
                <a href="${website}" target="_blank" class="cta">Check Website</a>
              </div>

              <div class="section">
                <div class="top">
                  <h1>${name},</h1>
                  <h2>${rating}/5 - ${ratings_count} votes</h2>
                </div>

                <div class="bottom">
                  <div class="bottom-description">${description}</div>
                  <div class="grid-container-infos">
                    <div class="grid-item-infos">
                      <p class="title">Release Date</p>
                      <p>${released}</p>
                    </div>
                    <div class="grid-item-infos">
                      <p class="title">Developer</p>
                      <p><a class="internal" href="#games/&developers=${developers[0].id}">${developers[0].name}</a></p>
                    </div>
                    <div class="grid-item-infos">
                      <p class="title">Platforms</p>
                      <p>${platforms.map(platform => { return " " + '<a class="internal" href="#games/&platforms=' + platform.platform.id + '">' + platform.platform.name + '</a>'})}</p>
                    </div>
                    <div class="grid-item-infos">
                      <p class="title">Publisher</p>
                      <p><a href="#games/&publishers=${publishers[0].id}">${publishers[0].name}</a></p>
                    </div>
                    <div class="grid-item-infos span-2">
                      <p class="title">Genres</p>
                      <p>${genres.map(genre => { return " " + '<a class="internal" href="#games/&genres=' + genre.id + '">' + genre.name + '</a>'})}</p>
                    </div>
                    <div class="grid-item-infos span-2">
                      <p class="title">Tags</p>
                      <p>${tags.map(tag => { return " " + '<a class="internal" href="#games/&tags=' + tag.id + '">' + tag.name + '</a>'})}</p>
                    </div>
                  </div>
                </div> 
              </div>

              <div class="section">
                <h1 class="red">buy</h1>
                <a href="https://${stores[0].store.domain}" target="_blank"><p class="stores">${stores[0].store.name}</p></a>
              </div>
            `;

            let trailerUrl = urlPrefix + url + "/" + id + "/movies?key=" + apiKey;
            fetch(trailerUrl)
              .then((data) => data.json())  
              .then((data) => {
                detailsContainer.innerHTML += `
                  <div class="section">
                    <h1 class="red">trailer</h1>
                    <video controls class="video">                
                      <source src="${data.results[0].data.max}" type="video/mp4">                
                      Sorry, your browser doesn't support embedded videos.
                    </video>
                  </div>          
                `;
            });

            let screenshotUrl = urlPrefix + url + "/" + slug + "/screenshots?key=" + apiKey;
            fetch(screenshotUrl)
              .then((data) => data.json())  
              .then((data) => {
                detailsContainer.innerHTML += `
                  <div class="section">
                    <h1 class="red">screenshots</h1>
                    <div class="grid-2">
                      <div class="item" style="background-image: url('${data.results[0].image}');"></div>
                      <div class="item" style="background-image: url('${data.results[1].image}');"></div>
                      <div class="item" style="background-image: url('${data.results[2].image}');"></div>
                      <div class="item" style="background-image: url('${data.results[3].image}');"></div>
                    </div>
                  </div>          
                `;
            });

            let gameSeriesUrl = urlPrefix + url + "/" + slug + "/game-series?key=" + apiKey;
            fetch(gameSeriesUrl)
              .then((data) => data.json())  
              .then((data) => {
                let articles = document.createElement('div');
                articles.classList.add('articles');

                let newSection = document.createElement('div');
                newSection.classList.add('section');
                newSection.innerHTML = '<h1 class="red">Game Series</h1>';
                newSection.appendChild(articles);

                let articlesContent = "";
                data.results.forEach((result) => {
                  articlesContent += `
                    <div class="cardGame">
                      <div class="cardGame-container">
                        <div class="img-cardGame" alt="${result.name}" style="background-image: url('${result.background_image}');"></div>
                        <div class="content-cardGame">
                          <h3>${result.released}</h3>
                          <h3>${result.rating}/5 - ${result.ratings_count} votes</h3>
                          <p>${result.genres.map(genre => { return " " + '<a class="internal" href="#games/&genres=' + genre.id + '">' + genre.name + '</a>'})}</p>
                        </div>
                      </div>
                      <a class="internal" href="#game/${result.slug}">${result.name}</a>
                    </div>
                  `;
                });
                articles.innerHTML += articlesContent;
                detailsContainer.appendChild(newSection);
            });
          }
      });
    };
    
    fetchGame("games", cleanedArgument);
  };
  
  const render = () => {
    topPageContent.innerHTML = "";

    pageContent.innerHTML = `
      <section class="page-detail">
        <div class="details-container">...loading</div>
      </section>
    `;

    bottomPageContent.innerHTML = "";

    preparePage();
  };

  render();
};

export { PageDetail };
