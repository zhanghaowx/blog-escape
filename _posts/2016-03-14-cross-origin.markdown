---
layout: post
permalink: cross-origin
comments: true
title:  "CORS - Cross Origin Resource Sharing"
date:   2016-03-04 21:56:45
description: Talks about HTTP access control(CORS).
categories:
- web
- cors
- rest
---

Today when I was trying to use jquery to send ajax requests to *Jenkins*, I encountered the problem of **CROS**. In order to trigger a *Jenkins* job from a webpage, I need to use **$.ajax** to send HTTP requests.

Unfortunately, when I run everything inside a local web server, I got:

{% highlight bash %}
XMLHttpRequest cannot load http://www.domain-a.com.
Origin http://www.domain-b.com is not allowed by Access-Control-Allow-Origin.
{% endhighlight %}

Where does such error come from?

> A resource makes a cross-origin HTTP request when it requests a resource from a different domain than the one which the first resource itself serves. For example, an HTML page served from http://domain-a.com makes an \<img\> src request for http://domain-b.com/image.jpg. Many pages on the web today load resources like CSS stylesheets, images and scripts from separate domains.

> For security reasons, browsers restrict cross-origin HTTP requests initiated from within scripts.  For example, XMLHttpRequest follows the same-origin policy. So, a web application using XMLHttpRequest could only make HTTP requests to its own domain. To improve web applications, developers asked browser vendors to allow XMLHttpRequest to make cross-domain requests.

## Solution 1

I tried [Allow-Control-Allow_Origin: \*](https://chrome.google.com/webstore/detail/allow-control-allow-origi/nlfbmbojpeacfghkpbjhddihlkkiljbi) Chrome extension. It worked perfectly when I made **GET** requests.
However, when I performed a **POST** request to trigger a new build on *Jenkins*, surprisingly the method is **OPTIONS** instead of **POST**, why?

### Preflighted requests

> Unlike simple requests (discussed above), "preflighted" requests first send an HTTP request by the OPTIONS method to the resource on the other domain, in order to determine whether the actual request is safe to send.  Cross-site requests are preflighted like this since they may have implications to user data.  In particular, a request is preflighted if:

> It uses methods other than GET, HEAD or POST.  Also, if POST is used to send request data with a Content-Type other than application/x-www-form-urlencoded, multipart/form-data, or text/plain, e.g. if the POST request sends an XML payload to the server using application/xml or text/xml, then the request is preflighted.

> It sets custom headers in the request (e.g. the request uses a header such as X-PINGOTHER)

Put it shortly, to perfrom a **CORS** request, my browser:

1. First send an **OPTIONS** request to target URL;
2. And then **only if** the server's respoonse to that **OPTIONS** request contains the adequate headers (**Access-Control-Allow-Origin** is one of them) to allow the **CORS** request, the browser will perform the call;
3. Otherwise the browser simply gives up.

## Solution 2

Finally I workaournded the problem by disabling **CORS** in Chrome:

{% highlight bash %}
## For Windows, option --user-data-dir is necessary
chrome.exe --user-data-dir="C:/Chrome Dev Session" --disable-web-security
## For Linux
google-chrome --disable-web-security
## For Mac OS
open -a Google\ Chrome --args --disable-web-security
{% endhighlight %}

## More

- [MDN: HTTP access control (CORS)](https://developer.mozilla.org/en-US/docs/Web/HTTP/Access_control_CORS)
- [Stackoverflow: Disable same origin policy in Chrome](http://stackoverflow.com/questions/3102819/disable-same-origin-policy-in-chrome)
- [Enable CORS](http://enable-cors.org/)
