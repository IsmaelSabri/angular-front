function saveService() {
  document.getElementById("oculto").click();
}
//bypass to see the ad
function runPopup() {
  document.getElementById("linkPopup").click();
}
//bypass close the ad
function closeSmallPopup(){
  document.querySelector('.leaflet-popup-close-button').click();
  document.getElementById("restoreMap").click();
}
function cuoreLike() {
  document.getElementById("likePopup").click();
}
//modal newHome
/*$(".modal-toggle").on("click", function (e) {
  e.preventDefault();
  $(".modal").toggleClass("is-active");
});*/
//search filters
/*$('.filters-toggle').on('click', function(e) {
  e.preventDefault();
  $('.static-modal').toggleClass('is-active');
});*/
function runModal() {
  $(".modal").toggleClass("is-active");
}

function closeModal() {
  $(".modal").removeClass("is-active");
}
// reset checkboxes & check venta by default - filters-form
function uncheck() {
  $(":checkbox").prop("checked", false).parent().removeClass("active");
  $(":radio").prop("checked", false).parent().removeClass("active");
  $(".ant-radio-button").removeClass("ant-radio-button-checked");
  $(".ant-radio-button-wrapper").removeClass("ant-radio-button-wrapper-checked");
  $(".ant-segmented-item-label:contains('Venta')").trigger('click');

  //$("#two.saleRadio").prop("checked", true);// pone en venta por default el filtrado
  $(".ant-select-clear").trigger('click'); // tipos de vivienda
  //$('.ant-select').prop('selectedIndex', 0); // select
  //$(".p-icon-wrapper").trigger('click');
}
// bulma nav
$(document).ready(function() {
  $(".navbar-burger").click(function() {
      $(".navbar-burger, .navbar-menu", $(this).closest('.navbar')).toggleClass("is-active");
  });
});
// select
//jquery modal
$(".contact__form-privacy a").click(function (e) {
  e.preventDefault();
  $("body").toggleClass("is-fixed");
  $(".modal__gray-back").fadeIn(300);
  return false;
});

$(".modal__close-btn").click(function (e) {
  $("body").toggleClass("is-fixed");
  $(".modal__gray-back").fadeOut(300);
});

//sidebar to list
$(document).ready(function(){
  $('.sidebarbtn').click(function(){
  $('#mySidenav, body').toggleClass('active');
  })
  $('.closebtn').click(function(){
     $('#mySidenav, body').removeClass('active');    
  })
})


