
// $(document).ready(function() {
//   $("div.pantallazo_mini").mouseover(function(e){
//     $(this).find(".caption").show("fast")
//    });
//   $("div.pantallazo_mini").mouseleave(function(e){
//     $(this).find(".caption").hide("fast")
//    });


// });

!function ($) {
  $(function(){
    var $window = $(window);
// side bar
    $('.bs-docs-sidenav').affix({
      offset: {
      top: function () { return $window.width() <= 980 ? 290 : 210 }
      , bottom: 270
      }
    });
  });
}(window.jQuery)
