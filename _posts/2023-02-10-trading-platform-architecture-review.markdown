---
layout: post
permalink: trading-platform-architecture-review
comments: false
title: "Trading Platform Architecture Review"
date: 2023-02-10 15:00:00
description: An overview of a trading platform's architecture
font-awesome: sitemap
categories:
- review
---

## High Level System Overview
![Architecture](http://www.plantuml.com/plantuml/proxy?cache=no&src={{{ site.baseurl | prepend: site.url }}/assets/images/posts/2023-02-10-trading-platform-architecture-review/high-level-overview.plantuml)

Network Middleware

## Volality Infrasturture

## Basic Trading Strategies
Below is an introduction of some of the basic stragies used by market makers:

### Quoting Strategies
Quoting Strategies (by options market makers) profit by creating and providing liquidity to the options market. They do this by continuously buying and selling options contracts, making money through the difference between the bid (price at which they are willing to buy) and the ask (price at which they are willing to sell) prices.

This difference is known as the bid-ask spread, and the strategies's goal is to maintain a small spread, so that they can attract a large number of trades and generate more profits from the volume. They also generate income from selling options contracts at higher prices than what they bought them for, and from collecting premiums from options buyers.

### Takeout Strategies

### Delta Hedging Strategies
Market makers may use more advanced strategies to hedge their risk and generate additional profits, such as delta-hedging, which involves adjusting the position of underlying assets to offset changes in the value of the options they have sold.

## Low Latency Techniques

### Onload Library

### FPGA
FPGA, or Field-Programmable Gate Array, is a type of digital integrated circuit that can be programmed after manufacturing to perform specific tasks.


### Tickless Server
### HyperThreading
### TLB Shootdown
