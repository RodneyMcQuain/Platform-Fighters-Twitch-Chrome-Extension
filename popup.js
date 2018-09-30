//runs at program start
ssbm();

document.addEventListener('DOMContentLoaded', function() {
  document.getElementById("liSsbm").addEventListener("click", ssbm);
});

document.addEventListener('DOMContentLoaded', function() {
  document.getElementById("liRoa").addEventListener("click", roa);
});

function ssbm() {
  removeAllByClass();
  apiRequest("ssbm");
}

function roa() {
  removeAllByClass();
  apiRequest("roa");
}

function removeAllByClass() {
  removeNoStream();
  removeByClass("roa");
  removeByClass("ssbm");
}

function removeByClass(className) {
  let elements = document.getElementsByClassName(className);
  while (elements[0])
    elements[0].parentNode.removeChild(elements[0]);
}

function removeNoStream() {
  let elements = document.getElementsByClassName("noStream");
  while (elements[0])
    elements[0].parentNode.removeChild(elements[0]);
}

function apiRequest(className) {
  let request = new XMLHttpRequest();

  removeActive();
  request = openRequest(request, className);

  request.setRequestHeader('Client-ID', API_KEY);

  request.onload = function () {
    let data = JSON.parse(this.response);
    if (request.status >= 200 && request.status < 400) {
      if (data.streams.length == 0) {
        //Called when there is no one streaming the specified game.
        createDivForNoStream();
      } else {
        for (var i = 0; i < data.streams.length; i++) {
          let divStream = createDivForStream(className);

          let h1DisplayName = createDisplayName(data, i);
          let pTitle = createTitle(data, i);
          let pViewers = createViewers(data, i);
          let imgThumbnail = createThumbnail(data, i);
          let aStreamerUrl = createStreamerUrl(data, i);

          divStream.appendChild(imgThumbnail);
          divStream.appendChild(h1DisplayName);
          divStream.appendChild(pTitle);
          divStream.appendChild(pViewers);
          aStreamerUrl.appendChild(divStream);
          divContainer.appendChild(aStreamerUrl);
        }
      }
    } else {
      let divError = document.createElement('div');
      divError.textContent = "Sorry there was an error, " + request.status;
      divContainer.appendChild(divError);
    }
  }

  request.send();
}

function removeActive() {
  document.getElementById('liSsbm').className = "";
  document.getElementById('liRoa').className = "";
}

function openRequest(request, className) {
  if (className == "ssbm") {
    request.open('GET', 'https://api.twitch.tv/kraken/streams/?game=Super%20Smash%20Bros.%20Melee', true);
    setActive("liSsbm");
  } else if (className == "roa") {
    request.open('GET', 'https://api.twitch.tv/kraken/streams/?game=Rivals%20Of%20Aether', true);
    setActive("liRoa");
  }

  return request;
}

function setActive(listElement) {
  document.getElementById(listElement).className = "active";
}

//Called when there is no one streaming the specified game.
function createDivForNoStream() {
  let divNoStream = document.createElement("div");
  let h1NoStream = document.createElement("h1");
  divNoStream.className = "noStream";

  h1NoStream.textContent = "No one is streaming this game";
  divNoStream.appendChild(h1NoStream);
  divContainer.appendChild(divNoStream);
}

function createDivForStream(className) {
  let divStream = document.createElement("div");
  divStream.className = className;

  return divStream;
}

function createDisplayName(data, index) {
  let displayName = data.streams[index].channel.display_name;
  let h1DisplayName = document.createElement("h1");
  h1DisplayName.textContent = displayName;

  return h1DisplayName;
}

function createTitle(data, index) {
  let title = data.streams[index].channel.status;
  let pTitle = document.createElement("p");
  pTitle.textContent = title;

  return pTitle;
}

function createViewers(data, index) {
  let viewers = data.streams[index].viewers;
  let pViewers = document.createElement("p");
  pViewers.textContent = "\u00A0- " + viewers + " viewers";

  return pViewers;
}

function createThumbnail(data, index) {
  let thumbnail = data.streams[index].preview.small;
  let imgThumbnail = document.createElement("img");
  imgThumbnail.src = thumbnail;

  return imgThumbnail;
}

function createStreamerUrl(data, index) {
  let streamerUrl = data.streams[index].channel.url;
  let aStreamerUrl = document.createElement("a");
  aStreamerUrl.href = streamerUrl;
  aStreamerUrl.target = "_blank";

  return aStreamerUrl;
}
