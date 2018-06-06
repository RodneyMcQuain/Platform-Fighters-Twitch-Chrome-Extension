document.addEventListener('DOMContentLoaded', function() {
  document.getElementById("liSsbm").addEventListener("click", ssbm);
});

document.addEventListener('DOMContentLoaded', function() {
  document.getElementById("liRoa").addEventListener("click", roa);
});

ssbm();

function roa() {
  removeByClass("roa");
  removeByClass("ssbm");
  apiRequest("roa");
}

function ssbm() {
  removeByClass("roa");
  removeByClass("ssbm");
  apiRequest("ssbm");
}

function apiRequest(className) {
  var request = new XMLHttpRequest();

  removeActive();
  if (className == "ssbm") {
    request.open('GET', 'https://api.twitch.tv/helix/streams?game_id=16282', true);
    setActive("liSsbm");
  } else if (className == "roa") {
    request.open('GET', 'https://api.twitch.tv/helix/streams?game_id=488436', true);
    setActive("liRoa");
  }

  request.setRequestHeader('Client-ID', 'e5579fbf0u0374vm05153irzz4qmnk');

  request.onload = function () {
    var data = JSON.parse(this.response);
    if (request.status >= 200 && request.status < 400) {
      for (var i = 0; i < data.data.length; i++) {
        var divStream = document.createElement('div');
        if (i == 0) {
          divStream.className = className + " first";
        } else {
          divStream.className = className;
        }

        var userId = data.data[i].user_id; //placeholder until helix api is updated
        var h1Username = document.createElement("h1");
        h1Username.textContent = userId;
        var title = data.data[i].title;
        var viewers = data.data[i].viewer_count;
        var pTitleViewers = document.createElement("p");
        pTitleViewers.textContent = title + " - " + viewers + " viewers";
        // var divUserTitleViewers =  document.createElement("div");
        // divUserTitleViewers.style.float = "right";
        // divUserTitleViewers.appendChild(h1Username);
        // divUserTitleViewers.appendChild(pTitleViewers);
        //
        // var imgThumbnail = document.createElement("img");
        // imgThumbnail.src = data.data[i].thumbnail_url;

        var a = document.createElement("a");
        a.href = "https://www.twitch.tv/" + userId;
        a.target = "_blank";

      //  divStream.appendChild(imgThumbnail);
        divStream.appendChild(h1Username);
        divStream.appendChild(pTitleViewers);
        a.appendChild(divStream);
        divContainer.appendChild(a);
      }
    } else {
      var divError = document.createElement('div');
      divError.textContent = "Sorry there was an error, " + request.status;
      divContainer.appendChild(divError);
    }
  }
  request.send();
}

function removeByClass(className) {
  var elements = document.getElementsByClassName(className);
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
