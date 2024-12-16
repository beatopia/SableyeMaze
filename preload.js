console.log("Preload running...");

// loop through all the content you want to preload
var images = [];
function preload() {
  for (var i = 0; i < arguments.length; i++) {
    images[i] = new Image();
    images[i].src = preload.arguments[i];
  }
}

// images and sounds
preload(
  "images/friend.jpg",
  "images/red.webp",
  "images/green.webp",
  "images/scroll.png",
  "images/characterfinal1.png",
  "balls/end.png",
  "balls/pokeball.png",
  "text/4.png",
  "text/5.png",
  "text/6.png",
  "text/7.png",
  "text/8.png",
  "text/9.png",
  "text/10.png",
  "text/11.png",
  "text/12.png",
  "text/13.png",
  "text/14.png",
  "text/15.png"
);
