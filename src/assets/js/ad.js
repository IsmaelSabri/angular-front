// change buttons sale-rent property custom user
$(".filter-status button").on("click", function (e) {
  e.preventDefault();
  $(".filter-status button").removeClass("active");
  $(this).addClass("active");
});

function print(){
  console.log('funcionando en js');
}