---
layout: post
permalink: tiny-url
comments: true
title: "An Implementation of Tiny URL"
date: 2016-03-22 20:10:00
description: Talks about technologies behiend tinyurl.com
font-awesome: sitemap
categories:
- web
- tinyurl
- interview
---

[TinyUrl](http://tinyurl.com) is a type of URL shortener service where you can create a short URL for your long URL.
There are two main advantages of using shortened url:

* Esay to remember - instead of remembering an URL with 50+ characters, you only need to remember a few (5 or more depending on implementation)
* Portable - Some systems have limitation on the total characters to be used (e.g. SMS and [Twitter](https://twitter.com))

To implement a TinyUrl service we need:

* Implement your own URL mapping algorithm
* Have a database to store mapped URL

# URL Mapping Algorithm
Suppose we have a database which contains three columns:

|-------------------+----------------------------------+-----------|
|id (auto increment)|actual url                        |shorten url|
|:-----------------:|:--------------------------------:|:---------:|
|0                  |http://example.com/i-am-a-long-url|abcdef     |

Intuitively, we can design a hash function that maps the actual url to shorten url. But string to string mapping is not easy to compute.

Notice that in the database, each record has a unique id associated with it. What if we convert the id to a shorten url?
Basically, we need a Bijective **function f(x) = y** such that

- Each x must be associated with one and only one y;
- Each y must be associated with one and only one x.

In our case, the set of x's are integers while the set of y's are 6-letter-long strings. Actually, each 6-letter-long string can be considered as a number too, a 62-base numeric, if we map each distinct character to a number,

*e.g. 0-0, ..., 9-9, 10-a, 11-b, ..., 35-z, 36-A, ..., 61-Z.*

Then, the problem becomes [Base Conversion problem](https://en.wikipedia.org/wiki/Positional_notation#Base_conversion) which is bijection (if not overflowed)

```java
/**
* Convert a long string (typically a URL) to a six-letter (A-Z,a-z,0-9) short string. The six-letter short string can be
* consider as a 62-base integer, ranging from Base62(000000) Base62(ZZZZZZ). If we can map a long string to an integer
* in the above range, we can easily convert the integer to a six-letter short string.
*/
public class TinyUrl {
    private static String s_digitMap[] = {"0","1","2","3","4","5","6","7","8","9",
    "a","b","c","d","e","f","g","h","i","j","k","l","m","n","o","p","q","r","s","t",
    "u","v","w","x","y","z","A","B","C","D","E","F","G","H","I","J","K","L","M","N",
    "O","P","Q","R","S","T","U","V","W","X","Y","Z"};
    private static int s_digitCount = 6;
    /**
     * Convert the long string to a short string (six letters of [A-Za-z0-9])
     * @return
     */
    public static String getTinyUrl(String url) {
        StringBuffer tinyUrl = new StringBuffer();

        int remaining = getId(url);
        for(int i = 0; i < s_digitCount; i++) {
            int left = remaining % s_digitMap.length;
            remaining = remaining / s_digitMap.length;
            tinyUrl.append(s_digitMap[left]);
        }

        return tinyUrl.reverse().toString();
    }

    /**
     * Create a unique id from a URL. The id will be used as primary key in database
     * @param url
     * @return
     */
     private static int getId(String url) {
        return url.hashCode();
    }
}
```

# Database Storage
Suppose the service gets more and more traffic and thus we need to distributed data onto multiple servers.

We can use [Distributed Database](https://en.wikipedia.org/wiki/Distributed_database). But maintenance for such a db would be much more complicated (replicate data across servers, sync among servers to get a unique id, etc.).

Alternatively, we can use Distributed Key-Value Datastore.
Some distributed datastore (e.g. [Amazon's Dynamo](https://www.youtube.com/watch?v=oz-7wJJ9HZ0)) uses Consistent Hashing to hash servers and inputs into integers and locate the corresponding server using the hash value of the input. We can apply base conversion algorithm on the hash value of the input.
![How Consistent Hashing works]({{ site.baseurl | prepend: site.url }}/assets/images/posts/tiny-url-consist-hashing-1.gif)

#### Insert
1. Hash an input long url into a single integer;
2. Locate a server on the ring and store the key-longUrl on the server;
3. Compute the shorten url using base conversion (from 10-base to 62-base) and return it to the user;
4. Use [separate chaining](https://en.wikipedia.org/wiki/Hash_table#Separate_chaining) approach in hashing to avoid collisions.

#### Retrieve
1. Convert the shorten url back to the key using base conversion (from 62-base to 10-base);
2. Locate the server containing that key and return the longUrl.

# Improvements

## Database Storage: Virtual Replicas
![Virtual Replicas of Caches]({{ site.baseurl | prepend: site.url }}/assets/images/posts/tiny-url-consist-hashing-2.gif)

## Response Speed: Server-side Cache
Use [server-side caches](http://www.computerweekly.com/opinion/Server-side-flash-cache-pros-outweigh-the-cons-for-many) of hottest URLs can speed up the app.

## Response Speed: Load Balance Servers
Assume we use multiple servers to serve the app, then we need a load balancer to efficiently distribute incoming network traffic across all backend servers, also known as a *server farm* or *server pool*.

**Load Balancing Algorithms**

Different load balancing algorithms provide different benefits; the choice of load balancing method depends on your needs:

- Round Robin – Requests are distributed across the group of servers sequentially.
- Least Connections – A new request is sent to the server with the fewest current connections to clients. The relative computing capacity of each server is factored into determining which one has the least connections.
- IP Hash – The IP address of the client is used to determine which server receives the request.

# Problems

1. The URL no longer contains any hints whatsoever as to the content of URL.
2. URL redirection services are often used by questionable people for nefaious reasons (becuase the existence of problem 1).


# Read More
- [System Design for Big Data - Tiny URL](http://n00tc0d3r.blogspot.com/2013/09/big-data-tinyurl.html)
- [How to Code a URL Shortener](http://stackoverflow.com/questions/742013/how-to-code-a-url-shortener)
- [Consisten Hashing](http://www.tom-e-white.com/2007/11/consistent-hashing.html)
- [Load Balancing](https://www.nginx.com/resources/glossary/load-balancing/)
- [Short URLs Considered Harmful for Cloud Services](https://freedom-to-tinker.com/blog/vitaly/gone-in-six-characters-short-urls-considered-harmful-for-cloud-services/)
