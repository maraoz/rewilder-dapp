(function ($) {

    'use strict';

	/*------------------------------------
    countdown
	--------------------------------------*/
	if (jQuery("[data-countdown]").length > 0) {
		$('[data-countdown]').each(function () {
			var $this = $(this), finalDate = $(this).data('countdown');
			$this.countdown(finalDate, function (event) {
				$this.html(event.strftime('<span class="cdown days"><p>Days</p> <span class="time-count">%-D</span></span> <span class="cdown hour"><p>Hours</p> <span class="time-count">%-H</span></span> <span class="cdown minutes"><p>Minutes</p> <span class="time-count">%M</span></span> '));
			});
		});
	};

	// ================ Accordion =================
	$(".accordion-head").click(function(){
		$(this).toggleClass("active").next().slideToggle().parent().siblings().children('.accordion-head').removeClass('.active');
    });
	

})(jQuery);

