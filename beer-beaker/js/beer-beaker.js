// Código original de Tim Ruby (https://codepen.io/TimRuby/pen/jcLia).
$(document).ready(function() {
  $(".pour") //Pour Me Another Drink, Bartender!
    .delay(2000)
    .animate(
      {
        height: "180px"
      },
      1500
    )
    .delay(1600)
    .slideUp(500);

  $("#liquid") // I Said Fill 'Er Up!
    .delay(3400)
    .animate(
      {
        height: "85px"
      },
      2500
    );

  $(".beer-foam") // Keep that Foam Rollin' Toward the Top! Yahooo!
    .delay(3400)
    .animate(
      {
        bottom: "100px"
      },
      2500
    );
});
