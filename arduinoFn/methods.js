const {
  Led
} = require("johnny-five");

exports.ledDrawHeart = () => {

  const matrix = new Led.Matrix({
    pins: {
      data: 10,
      clock: 8,
      cs: 9
    },
    devices: 1
  });


  const heart = [
    "01100110",
    "10011001",
    "10000001",
    "10000001",
    "01000010",
    "00100100",
    "00011000",
    "00000000"
  ];


  matrix.brightness(5)

  let timer = ''
  const SetLedsTimer = () => {
    timer = setInterval(() => {
      matrix.draw(heart);
      setTimeout(() => {
        matrix.clear()
      }, 1000);
    }, 1500);
    return timer
  }

  SetLedsTimer()

  setTimeout(() => {
    clearInterval(timer)
  }, 5000);


}