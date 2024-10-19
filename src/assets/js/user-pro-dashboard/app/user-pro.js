$(".eff").on("mousedown", function (e) {
  var clickY = e.pageY - $(this).offset().top;
  var clickX = e.pageX - $(this).offset().left;

  var el = this;
  var svg =
    '<svg><circle cx="' +
    parseInt(clickX) +
    '" cy="' +
    parseInt(clickY) +
    '" r="' +
    0 +
    '"></circle></svg>';

  $(this).find("svg").remove();
  $(this).append(svg);

  var c = $(el).find("circle");
  c.animate(
    {
      r: $(el).width() * 2,
    },
    {
      duration: 600,
      step: function (val) {
        c.attr("r", val);
      },
      complete: function () {
        c.fadeOut(400);
      },
    }
  );
});

$('.toggle-sidebar').on('click', function () {
  $(".main-sidebar").toggleClass("open");
});

function runModal() {
  $(".mdl").toggleClass("is-active");
}

function closeModal() {
  $(".mdl").removeClass("is-active");
}

function closeSmallPopup(){
  document.querySelector('.leaflet-popup-close-button').click();
  document.getElementById("restoreMap").click();
}

function saveService() {
  document.getElementById("oculto").click();
}