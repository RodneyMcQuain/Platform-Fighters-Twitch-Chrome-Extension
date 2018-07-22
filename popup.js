document.addEventListener('DOMContentLoaded', function() {
  document.getElementById("liSsbm").addEventListener("click", ssbm);
});

document.addEventListener('DOMContentLoaded', function() {
  document.getElementById("liRoa").addEventListener("click", roa);
});

//runs at program start
ssbm();

function apiRequest(className) {
  let request = new XMLHttpRequest();

  removeActive();
  if (className == "ssbm") {
    request.open('GET', 'https://api.twitch.tv/kraken/streams/?game=Super%20Smash%20Bros.%20Melee', true);
    setActive("liSsbm");
  } else if (className == "roa") {
    request.open('GET', 'https://api.twitch.tv/kraken/streams/?game=Rivals%20Of%20Aether', true);
    setActive("liRoa");
  }

  request.setRequestHeader('Client-ID', 'e5579fbf0u0374vm05153irzz4qmnk');

  request.onload = function () {
    let data = JSON.parse(this.response);
    if (request.status >= 200 && request.status < 400) {
      if (data.streams.length == 0) {
        let divNoStream = document.createElement("div");
        let h1NoStream = document.createElement("h1");
        divNoStream.className = "noStream";

        h1NoStream.textContent = "No one is streaming this game";
        divNoStream.appendChild(h1NoStream);
        divContainer.appendChild(divNoStream);
      } else {
        for (var i = 0; i < data.streams.length; i++) {
          let divStream = document.createElement("div");
          divStream.className = className;

          let displayName = data.streams[i].channel.display_name;
          let h1DisplayName = document.createElement("h1");
          h1DisplayName.textContent = displayName;

          let title = data.streams[i].channel.status;
          let pTitle = document.createElement("p");
          pTitle.textContent = title;

          let viewers = data.streams[i].viewers;
          let pViewers = document.createElement("p");
          pViewers.textContent = "\u00A0- " + viewers + " viewers";

          let thumbnail = data.streams[i].preview.small;
          let imgThumbnail = document.createElement("img");
          imgThumbnail.src = thumbnail;

          let streamerUrl = data.streams[i].channel.url;
          let aStreamerUrl = document.createElement("a");
          aStreamerUrl.href = streamerUrl;
          aStreamerUrl.target = "_blank";

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

function ssbm() {
  removeNoStream();
  removeByClass("roa");
  removeByClass("ssbm");
  apiRequest("ssbm");
}

function roa() {
  removeNoStream();
  removeByClass("roa");
  removeByClass("ssbm");
  apiRequest("roa");
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

function removeActive() {
  document.getElementById('liSsbm').className = "";
  document.getElementById('liRoa').className = "";
}

function setActive(listElement) {
  document.getElementById(listElement).className = "active";
}
