---
---
var $window = $(window)
    , $body = $('body')
    , $banner = $('.banner')

// Disable animations/transitions until the page has loaded.
$body.addClass('is-animating');

$window.on('load', function () {
    window.setTimeout(function () {
        $body.removeClass('is-animating');
    }, 0);
});
