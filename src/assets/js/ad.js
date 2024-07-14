function print(){
  console.log('funcionando en js');
}
// alterna los colores de las filas de los atributos
$(document).ready(function() {
  $(".post:even").css("background-color","#f5f5f5"); 
});

$(document).ready(function() {
  $(".navbar-burger").click(function() {
      $(".navbar-burger, .navbar-menu", $(this).closest('.navbar')).toggleClass("is-active");
  });
});