const API_KEY = "AIzaSyDPe5zEr1AX-of3Gqsq04YyxOfTHyQlx2U";
let searchBarValue;
let nextPageToken;
let prevPageToken;

function fetchVideos(searchBarValue, next, previous) {
  let url = `https://www.googleapis.com/youtube/v3/search?part=snippet&key=${API_KEY}&maxResults=10&q=${searchBarValue}`;

  if (next) {
    url += `&pageToken=${nextPageToken}`;
  }

  if (previous) {
    url += `&pageToken=${prevPageToken}`;
  }

  let settings = {
    method: "GET",
  };

  fetch(url, settings)
    .then((response) => {
      if (response.ok) {
        return response.json();
      }

      throw new Error(response.statusText);
    })
    .then((responseJSON) => {
      nextPageToken = responseJSON.nextPageToken;
      prevPageToken = responseJSON.prevPageToken;
      displayResults(responseJSON);
    })
    .catch((err) => {
      console.log(err);
    });
}

function displayResults(data) {
  let videos = document.querySelector(".videos");

  videos.innerHTML = "";

  for (let i = 0; i < data.items.length; i++) {
    videos.innerHTML += `
            <div id="${data.items[i].id.videoId}">
                <h2 class="openVideo">
                    ${data.items[i].snippet.title}
                </h2>
                <img class="openVideo" src="${data.items[i].snippet.thumbnails.default.url}" />
            </div>
        `;
  }
}

function watchForm() {
  let submitButtton = document.querySelector(".searchBtn");

  submitButtton.addEventListener("click", (event) => {
    event.preventDefault();

    searchBarValue = document.querySelector("#searchBar").value;

    fetchVideos(searchBarValue, false, false);
  });
}

function watchVideos() {
  let videos = document.querySelector(".videos");

  videos.addEventListener("click", (event) => {
    if (event.target.matches(".openVideo")) {
      window.open(
        `https://www.youtube.com/watch?v=${event.target.parentNode.id}`,
        "_blank"
      );
    }
  });
}

function watchForMoreVideos() {
  let nextBtn = document.querySelector(".next");
  let prevBtn = document.querySelector(".previous");

  nextBtn.addEventListener("click", () => {
    if (nextPageToken) {
      fetchVideos(searchBarValue, true, false);
    }
  });

  prevBtn.addEventListener("click", () => {
    if (prevPageToken) {
      fetchVideos(searchBarValue, false, true);
    }
  });
}

function init() {
  watchForm();
  watchVideos();
  watchForMoreVideos();
}

init();
