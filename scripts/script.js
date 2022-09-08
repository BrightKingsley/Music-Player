const container = document.querySelector(".container");
const playerLayout = document.querySelector(".player");
const blurBackground = document.querySelector(".blur");
const track = document.querySelector("audio");
const playerImg = document.querySelector(".player_image");
const artistName = document.querySelector(".artist_name");
const albumName = document.querySelector(".album_name");
const trackName = document.querySelector(".track_name");
const currentTimeDisplay = document.querySelector(".current_time");
const totalTimeDisplay = document.querySelector(".total_time");
const playerProgress = document.querySelector(".play_progress_bar");
const volumeBar = document.querySelector(".volume_bar");
const volumeIcon = document.querySelector(".volume_icon");
const loopBtn = document.querySelector(".loop_icon_wrapper");
const loopText = document.querySelector(".loop-text");
const prevTrackBtn = document.querySelector(".prev_track_icon_wrapper");
const pause_playBtn = document.querySelector(".pause-play_container");
const playBtn = document.querySelector(".play_button");
const pauseBtn = document.querySelector(".pause_button");
const nextTrackBtn = document.querySelector(".next_track_icon_wrapper");
const shuffleBtn = document.querySelector(".shuffle_icon_wrapper");
const listTracksContainer = document.querySelector(".player_list_container");
const playerList = document.querySelector(".player_list");
const navBtn = document.querySelector(".open-nav-btn");
const navOpen = document.querySelector(".open-nav");
const musicCount = document.querySelector(".music_count");
/* All selectors (wtf😂) */

let isPlaying = false;
let currentTrack = 0;

const tracks = [
  {
    album: "Legends Never Die",
    trackNo: 1,
    trackName: "I Want It",
    artist: "Juice WRLD",
  },
  {
    album: "Legends Never Die",
    trackNo: 2,
    trackName: "Conversations",
    artist: "Juice WRLD",
  },
  {
    album: "Legends Never Die",
    trackNo: 3,
    trackName: "Bad Energy",
    artist: "Juice WRLD",
  },
  {
    album: "Legends Never Die",
    trackNo: 4,
    trackName: "Righteous",
    artist: "Juice WRLD",
  },
  {
    album: "Legends Never Die",
    trackNo: 5,
    trackName: "Tell Me U Luv Me",
    artist: "Juice WRLD",
  },
  {
    album: "Legends Never Die",
    trackNo: 6,
    trackName: "Life's A Mess",
    artist: "Juice WRLD",
  },
  {
    album: "Legends Never Die",
    trackNo: 7,
    trackName: "Come And Go",
    artist: "Juice WRLD",
  },
  {
    album: "Legends Never Die",
    trackNo: 8,
    trackName: "Fighting Demons",
    artist: "Juice WRLD",
  },
  {
    album: "Legends Never Die",
    trackNo: 9,
    trackName: "Wishing Well",
    artist: "Juice WRLD",
  },
  {
    album: "Legends Never Die",
    trackNo: 10,
    trackName: "Up Up And Away",
    artist: "Juice WRLD",
  },
  {
    album: "Legends Never Die",
    trackNo: 11,
    trackName: "Stay High",
    artist: "Juice WRLD",
  },
  {
    album: "Legends Never Die",
    trackNo: 12,
    trackName: "Titanic",
    artist: "Juice WRLD",
  },
];

let looped = false;
let updateTimer;

/* User Controls */
const controls = function () {
  function ShuffleBtn() {
    shuffleBtn.addEventListener("click", () => {
      const newOrder = shuffle(tracks);
      currentTrack = newOrder[0].trackNo;
      nowPlaying(currentTrack);
      displayListStyle(currentTrack);
      pauseTrack();
    });
  }

  function Pause_PlayBtn() {
    //PAUSE-PLAY
    addEventListener("keydown", ({ keyCode }) => {
      if (keyCode == 32) {
        pause_playTrack();
        clearInterval(setUpdate);
      }
    });
    pause_playBtn.addEventListener("click", () => {
      pause_playTrack();
      clearInterval(setUpdate);
    });
  }

  function Next_PrevBtn() {
    addEventListener("keydown", ({ keyCode }) => {
      if (keyCode == 39) {
        playNext();
      }
    });
    addEventListener("keydown", ({ keyCode }) => {
      if (keyCode == 37) {
        playPrev();
      }
    });
    nextTrackBtn.addEventListener("click", () => {
      playNext();
    });

    prevTrackBtn.addEventListener("click", () => {
      playPrev();
    });
  }

  function LoopBtn() {
    loopBtn.addEventListener("click", () => {
      !looped ? loop() : unLoop();
      // pause_playTrack();
    });
  }

  function progressControlBtn() {
    playerProgress.addEventListener("change", () => {
      track.currentTime = (playerProgress.value * track.duration) / 100;
      playerProgress.style.backgroundSize =
        ((playerProgress.value - playerProgress.min) * 100) /
          (playerProgress.max - playerProgress.min) +
        "% 100%";
      clearInterval(setUpdate);
    });
  }

  // volumeBar.addEventListener("change", () => {
  //   volumeIcon.classList.add("volume_icon-active");
  //   volumeAdjust();
  // });

  function VolumeControlBtn() {
    volumeBar.style.backgroundSize =
      ((volumeBar.value - volumeBar.min) * 100) /
        (volumeBar.max - volumeBar.min) +
      "% 100%";
    volumeBar.addEventListener("change", () => {
      volumeBar.style.backgroundSize =
        ((volumeBar.value - volumeBar.min) * 100) /
          (volumeBar.max - volumeBar.min) +
        "% 100%";
    });

    volumeBar.addEventListener("mousedown", () => {
      volumeIcon.classList.add("volume_icon-active");
    });
    volumeBar.addEventListener("mouseup", () => {
      volumeIcon.classList.remove("volume_icon-active");
    });
    //NOTE
    volumeBar.addEventListener("change", () => {
      volumeAdjust();
    });
  }

  Pause_PlayBtn();
  ShuffleBtn();
  Next_PrevBtn();
  LoopBtn();
  progressControlBtn();
  VolumeControlBtn();
};
controls();

/* Update track details */
const updateTrack = function () {
  playerProgress.value = track.currentTime;
  trackName.textContent = `${tracks[currentTrack].trackName}`;
  artistName.textContent = `${tracks[currentTrack].artist}`;
  albumName.textContent = `${tracks[currentTrack].album}`;
  playerImg.src = `/imgs/${tracks[currentTrack].trackNo}.jpg`;
  musicCount.textContent = `${currentTrack + 1}/${tracks.length}`;
};

/* Implement Dynamic Track playing */
const nowPlaying = function (trackNo) {
  track.src = `/audio/${tracks[trackNo].trackName}.m4a`;
  // pause_playTrack();
  updateTrack();
};
nowPlaying(currentTrack);

/* Toggle Pause and Play */
const pause_playTrack = function () {
  isPlaying ? pauseTrack() : playTrack();
};

/* Play Track */
const playTrack = function () {
  playBtn.classList.add("none");
  pauseBtn.classList.remove("none");
  isPlaying = true;
  track.play();
  updateTrack();
  /* Update Timer every second */
  updateTimer = setInterval(setUpdate, 1000);
};

/* Pause Track */
const pauseTrack = function () {
  pauseBtn.classList.add("none");
  playBtn.classList.remove("none");
  isPlaying = false;
  track.pause();
};

/* Play next Track */
const playNext = function () {
  if (!looped) {
    if (currentTrack < tracks.length - 1) {
      currentTrack += 1;
    } else {
      currentTrack = 0;
    }
  }
  nowPlaying(currentTrack);
  playTrack();
  displayListStyle(currentTrack);
};

/* Play previous track */
const playPrev = function () {
  if (!looped) {
    if (currentTrack != 0) {
      currentTrack -= 1;
    } else {
      currentTrack = tracks.length - 1;
    }
  }
  nowPlaying(currentTrack);
  playTrack();
  displayListStyle(currentTrack);
};

/* Implement shuffle effect. Create a new array of tracks and shuffle into a new order without having efect on the order of the original tracks array */
const shuffle = function (array) {
  const newArr = array.slice();
  const shuffled = newArr.sort(() => {
    return Math.floor(Math.random() - 0.5);
  });
  return shuffled;
};

/* Add Loop effect */
const loop = function () {
  looped = true;
  currentTrack += 0;
  nowPlaying(currentTrack);
  displayListStyle(currentTrack);
  loopText.classList.remove("loop-hidden");
};

/* Remove Loop Effect */
const unLoop = function () {
  looped = false;
  currentTrack;
  nowPlaying(currentTrack);
  displayListStyle(currentTrack);
  loopText.classList.add("loop-hidden");
};

function volumeAdjust() {
  track.volume = volumeBar.value / 100;
}

/* Get track duration when track loads */
track.onloadedmetadata = function () {
  const trackDuration = track.duration;
  setProgressTime(trackDuration);
};

/* Test and set current time and total duration of the track (i created this function just to refactor the code.. lol😂) */
function setProgressTime(trackDuration) {
  let currentMinutes = Math.floor(track.currentTime / 60);
  let currentSeconds = Math.floor(track.currentTime - currentMinutes * 60);
  let durationMinutes = Math.floor(trackDuration / 60);
  let durationSeconds = Math.floor(trackDuration - durationMinutes * 60);

  // durationSeconds = durationSeconds < 10 && "0" + durationSeconds; (false)
  if (currentMinutes < 10) currentMinutes = "0" + currentMinutes;
  if (currentSeconds < 10) currentSeconds = "0" + currentSeconds;
  if (durationMinutes < 10) durationMinutes = "0" + durationMinutes;
  if (durationSeconds < 10) {
    durationSeconds = "0" + durationSeconds;
  }

  currentTimeDisplay.textContent = currentMinutes + ":" + currentSeconds;
  totalTimeDisplay.textContent = durationMinutes + ":" + durationSeconds;
}

/* Display Progress Time to screen */
function displayProgressTime() {
  setProgressTime(track.duration);
}

/* Update the music progress bar with time and completion level of track (you should get what I'm tryna say..😂) */
let seekPosition = 0;
function setUpdate() {
  if (track.duration) {
    seekPosition = track.currentTime * (100 / track.duration);
    playerProgress.value = seekPosition;
    playerProgress.style.backgroundSize =
      ((playerProgress.value - playerProgress.min) * 100) /
        (playerProgress.max - playerProgress.min) +
      "% 100%";

    displayProgressTime();
  }

  /*Play next track when music comes to an end*/
  if (track.currentTime >= track.duration) {
    playNext();
    activeListTrack();
  }
}

//ADD TRACKS LIST
/* Append new tracks from the array of tracks into the tracks list */
function updateTrackList() {
  tracks.forEach((track, i) => {
    playerList.insertAdjacentHTML(
      "beforeend",
      `<div class="list_track" id="${
        i + 1
      }"><h2 class="list_track_hide track_no" id="${i + 1}">${
        track.trackName
      }</h2></div>`
    );
  });
}
updateTrackList();

let tracksInList = document.querySelectorAll(".track_no");
console.log(tracksInList);
/* Dynamically change the current track playing through the tracks list and update the player */
let listTracks = document.querySelectorAll(".list_track");
listTracks.forEach((track) => {
  track.addEventListener("click", (e) => {
    currentTrack = Number(e.target.id) - 1;
    nowPlaying(currentTrack);
    playTrack();
    activeListTrack();
  });
});

/* Initialize the styles for the current/active track playing on the tracks list on document load (before track is changed or updated) */
function displayListStyle(currentTrack) {
  listTracks.forEach((track) => track.classList.remove("list_track-active"));
  document
    .getElementById(`${currentTrack + 1}`)
    .classList.add("list_track-active");
}
displayListStyle(currentTrack);

/*Display styles indicating the current/active track playing on the tracks list when the track is changed or updated*/
function activeListTrack() {
  listTracksContainer.addEventListener("click", (e) => {
    const clicked = e.target.closest(".list_track");

    if (!clicked) return;

    listTracks.forEach((track) => track.classList.remove("list_track-active"));

    clicked.classList.add("list_track-active");
  });
}

//jQuery
/*Control the side navigation and navigation toggle button. Add draggable feature to it with jQuery Draggable*/
function NavControls() {
  let showMenu = false;

  function toggleMenu() {
    !showMenu ? showNavMenu() : clearNavMenu();
  }
  /* Add drag feature to menu button */
  const DragBtn = function () {
    $(function () {
      $(".open-nav-btn").draggable({
        containment: $("body"),
        stop: function (event, ui) {
          $(event.originalEvent.target).one("click", function (e) {
            e.stopPropagation();
          });
        },
      });

      /* Open mmenu button on click */
      $(".open-nav-btn").click(function () {
        toggleMenu();
      });
    });
  };

  blurBackground.addEventListener("click", () => {
    console.log("happy");
    clearNavMenu();
  });

  function showNavMenu() {
    navOpen.classList.add("open");
    listTracksContainer.classList.remove("player_list_open");
    blurBackground.classList.remove("hide-blur");
    tracksInList.forEach((track) => {
      track.classList.remove("list_track_hide");
    });
    showMenu = true;
  }

  function clearNavMenu() {
    navOpen.classList.remove("open");
    listTracksContainer.classList.add("player_list_open");
    blurBackground.classList.add("hide-blur");
    tracksInList.forEach((track) => {
      track.classList.add("list_track_hide");
    });
    showMenu = false;
  }

  DragBtn();
}
NavControls();

