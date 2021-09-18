$(document).ready(function(){
    let height = window.innerHeight;
    $('.window-section').css("min-height", `${height}px`);
    $('.selected-amount').html($('#rangeInput').val());

    $('#rangeInput').on('change', function(){
        const amount = $(this).val();
        $('.selected-amount').html(amount);
        $('.image-1').css('color', '#388447');

        if(amount < 33.334) {
            $('#image-1').attr("src", "assets/images/tree/tree-1-green.png");
            $('#image-2').attr("src", "assets/images/tree/tree-2-gray.png");
            $('#image-3').attr("src", "assets/images/tree/tree-3-gray.png");
            
            $('.bannar-text').html('“Alone, in the forest, you stand, and watch the passing of the seasons."');
            
            $('.banner-image').attr("src", "assets/images/card-image-default.png");

            $('.image-1').css('color', '#388447');
            $('.image-2').css('color', '#8C8D90');
            $('.image-3').css('color', '#8C8D90');

        } else if(amount < 66.667) {
            $('#image-1').attr("src", "assets/images/tree/tree-1-gray.png");
            $('#image-2').attr("src", "assets/images/tree/tree-2-green.png");
            $('#image-3').attr("src", "assets/images/tree/tree-3-gray.png");
            
            $('.bannar-text').html("In the shadow of your roots, I am born again");
            
            $('.banner-image').attr("src", "assets/images/card-image-next.png");

            $('.image-1').css('color', '#8C8D90');
            $('.image-2').css('color', '#388447');
            $('.image-3').css('color', '#8C8D90');
        } else {
            $('#image-1').attr("src", "assets/images/tree/tree-1-gray.png");
            $('#image-2').attr("src", "assets/images/tree/tree-2-gray.png");
            $('#image-3').attr("src", "assets/images/tree/tree-3-green.png");

            $('.image-1').css('color', '#8C8D90');
            $('.image-2').css('color', '#8C8D90');
            $('.image-3').css('color', '#388447');
        }
    });

    var slider = document.getElementById('rangeInput');
    var selector = document.getElementById('selector');
    var progressbar = document.getElementById('Progressbar');

    selector.style.left = this.value + "%";
    progressbar.style.width = this.value + "%";

    slider.onchange = function () {
        selector.style.left = this.value + "%";
        progressbar.style.width = this.value + "%";
    }
});

