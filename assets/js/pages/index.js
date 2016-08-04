var $window = $(window),
    $body = $('body'),
    $banner = $('.page-banner')

// Disable animations/transitions until the page has loaded.
$window.on('load', function () {
    window.setTimeout(function () {
        $body.removeClass('is-animating');
    }, 0);
});

// Read more button
// $(".more.scrolly").click(function () {
//     $('html,body').animate({
//         scrollTop: $(".page-posts").offset().top
//     }, 'slow');
// });
