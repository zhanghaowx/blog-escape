---
layout: post
permalink: trading-platform-architecture-review
comments: false
title: "Trading Platform Architecture Review"
date: 2023-02-10 15:00:00
description: An overview of a trading platform's architecture
font-awesome: sitemap
categories:
- design
- review
---

## High Level System Overview
---
![Architecture at High Level](https://plantuml-server.kkeisuke.dev/svg/TLDDJyCm3BtdLrWzmM7_O48ROeST1XC3JboynEsYjMb970P2_7Uob7vlQWxjUy_sivqk7ADbN-H2oBpq2bPVye0c8o42hbEK32yMbJRPocJQ4Fm804kIWoWdsA0z4Y-b9ESk40_86E3d5jwnHQRiEu3XT2AOtVMvvXNc0H_Lw7y6tWT5QtgGSZxhYD_GNrbKfI73a6pzFjVkGDRTfAMD3PA5r_Lj0kYWOqVDlc7kaNLfEiMLddk2KFd3aoT8tddwF1AVIdlSQALoEg6bIwBeQg8STBJZqc96iAogNCjeCaQTpUpHZTUMh8rZwujpx8xifvOKvHtyZmwZjcYn80wpwWUrQ1UZch99Ow1sSr_lVL86PYgiCTBZR2qL1jcchQVmbARdSgAti2YUZcfuXUTNL1EaJZSeDjNKsPe-XLYGKU67-WC0.svg)


## Volatility Infrasturture
---
The Black-Scholes model is a mathematical model used to calculate the fair price or theoretical value for an option. It is one of the most widely used options pricing models and provides a basis for many derivative products.

The Black-Scholes model is based on the following five input variables:

* Stock (or other underlying) price (S)
* Strike price (K)
* Time to expiration (T)
* Risk-free interest rate (r)
* Volatility (σ)

The model calculates the option price as the sum of two components: the intrinsic value and the time value. The intrinsic value is the difference between the stock price and the strike price, and the time value is the amount the option price is worth in addition to the intrinsic value due to the remaining time to expiration and the risk involved.

### Hardware
GPUs could be used for Black-Scholes option pricing, implied volatility calculations, and Greeks (sensitivity measures), which are used in options trading to manage risk and to determine the value of options.

In addition to their speed and efficiency, GPUs are also highly scalable and can be easily added to existing trading systems to increase processing power as needed. This allows trading firms to adapt to changing market conditions and to keep up with the increasing complexity of options trading.


## Basic Trading Strategies
---
Below is an introduction of some of the basic stragies used by market makers:

### Quoting Strategies
Quoting Strategies (by options market makers) profit by creating and providing liquidity to the options market. They do this by continuously buying and selling options contracts, making money through the difference between the bid (price at which they are willing to buy) and the ask (price at which they are willing to sell) prices.

This difference is known as the bid-ask spread, and the strategies's goal is to maintain a small spread, so that they can attract a large number of trades and generate more profits from the volume. They also generate income from selling options contracts at higher prices than what they bought them for, and from collecting premiums from options buyers.

### Takeout Strategies

Under construction

### Delta Hedging Strategies
Market makers may use more advanced strategies to hedge their risk and generate additional profits, such as delta-hedging, which involves adjusting the position of underlying assets to offset changes in the value of the options they have sold.


## Risk Management
---


## Low Latency Techniques
---

### Reduce Network Latency (Market Data)
Reduce network latency for market data is the key to get signals earlier than other market participants to take action faster:

#### Hardware
* Use low latency fiber path
* Wireless microwave (e.g. [Quincy Data](https://www.cmegroup.com/partner-services/quincy-data.html))

#### Software
* Onload Library


### FPGA
FPGA, or Field-Programmable Gate Array, is a type of digital integrated circuit that can be programmed after manufacturing to perform specific tasks.

* Send BulkDeletes (aka. Mass Cancels, Purge Port) to exchanges on certain triggers, usually on specific market packets
* Send Orders (e.g. IOC) to exchanges on certain triggers, usually on specific market packets

### Tickless Server

### HyperThreading

### TLB Shootdown
TLB (Translation Lookaside Buffer) shootdown is a type of software issue that can occur in computer systems, particularly in multi-processor or multi-core systems, when two or more processors attempt to modify the same entry in the TLB simultaneously.

The TLB is a hardware component in a computer system that helps to speed up memory access by translating virtual addresses into physical addresses. When a processor needs to access a memory location, it first looks up the virtual address in the TLB, which provides the physical address of the memory location.

In a multi-processor system, it is possible for two or more processors to try to modify the same TLB entry simultaneously. This can lead to a conflict, called a TLB shootdown, which results in one or more processors invalidating their TLB entries, causing performance degradation.

TLB shootdowns can have a significant impact on system performance, particularly in high-performance computing applications where low latency and high-throughput are critical. They can result in increased latencies, decreased throughput, and increased processor utilization.

To avoid TLB shootdowns, systems can employ various techniques, such as software-based TLB management, hardware-based TLB management, and memory management units (MMUs) with larger TLBs. These techniques help to minimize the frequency and impact of TLB shootdowns and ensure that the system operates efficiently and with minimal latency.

### Cache Warming