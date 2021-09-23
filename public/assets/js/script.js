(function ($) {


	// Hide Funcation
	$('.update-close').on("click", function(){
		$(this).parent().hide(200);
	});




	// Connect Wallet
	$('.header-button').on("click", function() {
		$('.connect-wallet-popup').addClass('active');
		$("body").addClass('overlay');
	});
	$('.connect-wallet-close').on("click", function() {
		$('.connect-wallet-popup').removeClass('active');
		$("body").removeClass('overlay');
	});

	// Connect Wallet
	$('.hero-v1-btn,.connect-error-button').on("click", function() {
		$('.sign-transaction-popup,.connect-error-popup').addClass('active');
		$("body").addClass('overlay');
	});
	$('.sign-close,.sign-close-btn,.connect-error-close,.connect-error-close-btn').on("click", function() {
		$('.sign-transaction-popup,.connect-error-popup').removeClass('active');
		$("body").removeClass('overlay');
	});

	


})(jQuery);