---
layout: default
title: Blog archive
permalink: /blog/
---
<div class="page-content wc-container">
    <h1>Blog Archive</h1>
    {% for post in site.posts %}
        {% capture this_year %}{{ post.date | date: "%Y" }}{% endcapture %}
        {% capture next_year %}{{ post.previous.date | date: "%Y" }}{% endcapture %}
        {% if forloop.first %}
            <h5>{{this_year}}</h5>
            <ul class="posts">
        {% endif %}
        <li><a href="{{ post.url | prepend: site.baseurl }}">{{ post.title }}</a></li>
        {% if forloop.last %}
            </ul>
        {% else %}
            {% if this_year != next_year %}
            </ul>
            <h5>{{next_year}}</h5>
            <ul class="posts">
            {% endif %}
        {% endif %}
    {% endfor %}
</div>
