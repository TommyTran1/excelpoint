jQuery(document).ready(function($){
  var ua = navigator.userAgent, isMobileWebkit = /WebKit/.test(ua) && /Mobile/.test(ua);
  if(isMobileWebkit && Drupal.settings.dexp_animation.disable_mobile){
    $(".dexp-animate").addClass('animated');
  }else{
    $(".dexp-animate").each(function(){
      var $this = $(this);
      var animate_class = $this.data('animate');
      $this.appear(function(){
				setTimeout(function(){
					$this.addClass(animate_class);
					$this.addClass('animated');
				},300);
      },{
        accX: 0,
        accY: 0,
        one:false
      });	
    });
  }
})