---
layout: post
permalink: delayed-javascript
comments: true
title: "How to deplay running a function in javascript"
date: 2016-03-27 21:19:00
description: Use setTimeout to run a deplayed function without blocking ui
font-awesome: jsfiddle
categories:
- javascirpt
- setTimeout
---

Recently when I am trying to use [resemble.js](https://huddle.github.io/Resemble.js/) to compare images a problem rasies: the computation is CPU intensive and slows the whole page a lot. While researching the solution I came across the concept of [Web Workers API](https://developer.mozilla.org/en-US/docs/Web/API/Web_Workers_API/Using_web_workers).

> **Web Workers** provide a simple means for web content to run scripts in background threads. The worker thread can perform tasks without interfering with the user interface. In addition, they can perform I/O using XMLHttpRequest (although the responseXML and channel attributes are always null). Once created, a worker can send messages to the JavaScript code that created it by posting messages to an event handler specified by that code (and vice versa.) This article provides a detailed introduction to using web workers.

I tried to take advantage of this feature immediately since it already exists in [most modern web browsers](https://en.wikipedia.org/wiki/Web_worker#Support). However, soon I found the limits of **Web Workers**:

> When web workers run in the background, they do not have direct access to the DOM but communicate with the document by message passing. This allows for multi-threaded execution of JavaScript programs.

Unfortunately, resemble.js relies heavily on the [HTML5 canvas](http://www.w3schools.com/html/html5_canvas.asp) to get pixels from a image src, and this is one of the most time-consuming part in the process. After I refractored resemble.js and moved as many computation as possible to worker thread, the speed was boosted by 100% but problem remained - page still freezed.

Finally I realized I should sacrifice performance to make the page still usable while resemble.js is computing - either in main thread or worker thread. So I decided to use **setTimeout** and wrote a small class to help me:

```javascript
/**
 * Queue a list of functions and run them in order. Can be used to run javascript without blocking
 * ui.
 */
(function ($) {
    $.fqueue = {
        _timer: null,
        _queue: [],
        _runnext: function () {
            var next = $.fqueue._queue.shift();
            if (next) {
                next.call();
            } else {
                clearTimeout($.fqueue._timer);
                $.fqueue._timer = null;
            }
        },
        _delayrun: function () {
            $.fqueue._timer = setTimeout(function () {
                $.fqueue._runnext();
                $.fqueue._delayrun();
            }, 500);
        },
        runall: function () {
            if ($.fqueue._timer != null)
                return; // already started
            $.fqueue._delayrun();
        },
        queue: function (fc) {
            if (fc) {
                $.fqueue._queue.push(fc);
            }
        }
    }
})(jQuery);
```
Basically I for each image I use `$.fqueue.queue` to queue the computation and call `$.fqueue.runall` at the end. Since name `$.queue` is alreay taken I choose `$.fqueue` instead.
