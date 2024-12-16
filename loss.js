const button = document.getElementById("lossButton");
var friendsong = new Audio("sounds/friendsong.mp3");
const messages = [
  "Nice try! You almost had it!",
  "Since I'm feeling generous...",
  "I'll give you one more chance.",
  "Try again?",
  ":)",
];
let clickCount = 0;

button.addEventListener("click", () => {
  //listening for a click of the button
  if (clickCount < messages.length) {
    //if clickcount is less than messages length
    button.textContent = messages[clickCount];
    //make the button display the next message in the messages array
    const scale = 1 - 0.2 * clickCount;
    //make button smaller
    button.style.transform = `scale(${scale}) translateY(${clickCount * 10}px)`;
    //translate it so it moves

    clickCount++;
    //iterate click count
  }

  if (clickCount === messages.length) {
    document.body.style.backgroundImage = "url(images/friend.jpg)";
    //if you get to the end of the messages, it jump scares you
    document.body.style.backgroundSize = "cover";
    document.body.style.backgroundPosition = "center";
    button.style.display = "none";
    friendsong.volume = 0.15;
    friendsong.play();
    histheme.pause();
    setTimeout(() => {
      window.location.href = "index.html";
    }, 2500);
    //after 2.5 seconds of jumpscare, it returns you back to the maze
  }
});
var histheme = new Audio("sounds/histheme.mp3");
window.onload = function () {
  histheme.play();
  histheme.volume = 0.5;
  //play music onload
};
