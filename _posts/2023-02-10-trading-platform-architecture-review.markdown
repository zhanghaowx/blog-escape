---
layout: post
permalink: trading-platform-architecture-review
comments: false
toc: true
title: "Trading Platform Architecture Review"
date: 2023-02-10 15:00:00
description: An overview of a trading platform's architecture
font-awesome: sitemap
categories:
- design
- review
---

This is a review of one of the possible trading platform architecture for options market making. Options market making can be a challenging and complex business. Some of the main challenges faced by options market makers include:

- **Volatility Risk**: Options market makers are exposed to the risk of large price swings in the underlying assets. This volatility risk can be difficult to manage and can lead to significant losses for market makers.

- **Market Liquidity**: Options market making requires significant liquidity, as market makers must be able to quickly buy and sell options to meet customer demand. Market makers must also have sufficient capital to withstand periods of low liquidity, when it may be difficult to buy or sell options at favorable prices.

- **Delta Hedging**: Options market makers must continually adjust their portfolios to maintain delta neutrality, meaning they must hold a balanced mix of options and underlying assets to minimize their exposure to market risk. This can be a complex and time-consuming process, requiring market makers to constantly monitor the markets and make adjustments as necessary.

- **Model Risk**: Options market making relies heavily on mathematical models to price options and manage risk. These models are subject to model risk, meaning they may not accurately reflect the behavior of the markets or the underlying assets. Market makers must continuously monitor the accuracy of their models and make adjustments as necessary to minimize model risk.

- **Competition**: The options market is highly competitive, with many market makers vying for business. Market makers must be able to offer competitive prices and respond quickly to changing market conditions in order to remain competitive.

*Number of Instruments in Options Market Making - S&P 500 Complex*
![Options Market Making Challenges]({{ site.baseurl | prepend: site.url }}/assets/images/posts/2023-02-10-trading-platform-architecture-review/options-market-making.gif)


## High Level System Overview
---
![Architecture at High Level](https://plantuml-server.kkeisuke.dev/svg/TLHDR-CW4BtpAv3lqTwhQDMFxLOvT6irJKzxeNZYe1181zXkjUf_tp7OCTY9uaDuxyqmNyorym9zE6Z6fBQXuVT_vKwO5XYxUa7H0FBDweeBnzDfisBiAEHUjC2h3bAcvVUcLGQgGKLGGlW_nZc2zEHG0tyKk0T_8oKuTuRu8RmW-Fa4hpqA3-qdWVID8hxuddF3NxuaV797VYG-aEAKOE5okHY9hop5IDRXJIkt0tGnn_4uIV1Lw22yicPKNCWp4-It_GB_ON7FLsQBmdaCqWTCXUsfaedtlmS8PFlRpt-zqQDg6WqV0k6SA7S_AkTLk3aUjP8nlsZIWM_2JRjShKmNtm6Cvsl0Fqgc14QuHqkhMg0uWATvourEw6ZJ3DTMGm0fcjlItwlL5AfM_fFV2Iq3dIn69J4TKifVTc2_FI30tatr7JKtUFBKlKoQHYEYlLXQhKbFvNAyUgWthcA4pih05mrDPGn_ccr63K4agFDMD2ZrZJzjjqFb4fA0sA6nRhLrgWkBtw9gMgWACZxpn9J4chfluAnDRT5lhLRsn7uDwwIwqo2mMn8_5HvIaGQ8iUmbnRTvsZ4vqIKy7yzoqImlg6P8hyohSr4qp1ShQhdGH8qfN8DfQ7t-1m00.svg)


## Network Infrasturture
---
**Solace**:
Solace middleware provides a messaging infrastructure that supports multiple messaging patterns such as publish-subscribe, request-reply, and point-to-point communication. This allows applications to subscribe to market data, trade notifications, and other financial events, and respond to them in real-time.

**Solcache**:
Solace Cache (SolCache) is a caching solution developed by Solace Systems. It is designed to provide fast, in-memory caching for high-performance, real-time applications. SolCache uses a distributed architecture to store and manage data in memory, across multiple nodes. This allows it to scale to handle large amounts of data while maintaining low latency and high throughput. SolCache also supports a variety of data storage and retrieval methods, including key-value, document, and graph storage.



## Volatility Infrasturture
---
The Black-Scholes model is a mathematical model used to calculate the fair price or theoretical value for an option. It is one of the most widely used options pricing models and provides a basis for many derivative products.

The Black-Scholes model is based on the following five input variables:

* Stock (or other underlying) price (S)
* Strike price (K)
* Time to expiration (T)
* Risk-free interest rate (r)
* Volatility (σ)

$$
C = N(d_1)S_t - N(d_2)Ke^{-rt} \\

\begin{array}{l}
\text{where } d_1 = \frac{\ln \frac{S_t}{K} + (r + \frac{\sigma^2}{2})t}{\sigma \sqrt{t}} \\
\text{and } d_2 = d_1 - \sigma \sqrt{t} \\
\end{array}
$$

$$
\begin{array}{l}
C	=	call option price \\
N	=	CDF of the normal distribution \\
S_t	=	spot price of an asset \\
K	=	strike price \\
r	=	risk-free interest rate \\
t	=	time to maturity \\
\sigma	=	volatility of the asset \\
\end{array}
$$

The model calculates the option price as the sum of two components: the intrinsic value and the time value. The intrinsic value is the difference between the stock price and the strike price, and the time value is the amount the option price is worth in addition to the intrinsic value due to the remaining time to expiration and the risk involved.


### Volatility Infrasturture - Hardware
[GPUs](https://developer.nvidia.com/gpugems/gpugems2/part-vi-simulation-and-numerical-algorithms/chapter-45-options-pricing-gpu) could be used for Black-Scholes option pricing, implied volatility calculations, and Greeks (sensitivity measures), which are used in options trading to manage risk and to determine the value of options.

In addition to their speed and efficiency, GPUs are also highly scalable and can be easily added to existing trading systems to increase processing power as needed. This allows trading firms to adapt to changing market conditions and to keep up with the increasing complexity of options trading.

**Read More**:
- [Options Pricing on the GPU](https://developer.nvidia.com/gpugems/gpugems2/part-vi-simulation-and-numerical-algorithms/chapter-45-options-pricing-gpu)

### Volatility Infrasturture - Retreat

## Basic Trading Strategies
---
A trading strategy decides when and how to put liquidities into the market, either passive liquidities (market making) or active liquidities (market taking):

- Market making involves acting as a liquidity provider in a particular market by offering to buy and sell financial instruments at quoted prices. Market makers earn a profit by buying at a lower price and selling at a higher price, thus profiting from the bid-ask spread. Market makers typically provide liquidity to financial markets, helping to ensure that buyers and sellers can find counterparties for their trades. Market makers can also help to reduce market volatility and improve market efficiency.

- Market taking, on the other hand, involves buying or selling financial instruments with the aim of profiting from changes in their price. Market takers typically seek to take advantage of market inefficiencies, such as price discrepancies between different markets or between related financial instruments. Market taking involves taking on market risk, as the market taker is exposed to the possibility of adverse price movements.


![Simpilified Software Architecture of a Trading Application](https://plantuml-server.kkeisuke.dev/svg/RLEnRjim4Dtv5GTEoM1hpn14aMlKQ8ocJL9qwC9ILuamJRha4OXHvDzpacD9L0qjmhrtznxlaNUHLA2qjq9ewrCDdrvrgro3GXoKtga6GMvLs271If6Ie29iL_1Fl0dnDs5Y-1VbNyU31tN4C4VwxWxkqTEGGUM9WY9iZfBh0Dhl3zwX8zYuI27j-JTczH_A9aN6kwpw68mshdamlxDoQHiV3BNxgUHt4tULTnIydMdAhw5cW-k0V4QdZr2rg7SovwpImHhDdg5dnukapW_2lNBrPNpZ_bZJj3JCy8dBbvXRzGgLYcr_SBn8MIwNCjlfHtAbrXWZNAqtFujxurGuNf-2BFCCLcX9FVh_rl4PwuQNUaweHz-wHhu9YtfnEsOgndHxO0nf1anJdK6J28TsoEkJxbFFcE_8cY5m0_AvHH-GE3LxMgCK8zxJUIKt7_5VVKkUyBgpYe6AakNgeb9EevLYUdSMcG6Uq4ywFwHkthXuFeKdhxbhov7mqgCK0tEH1WTbzQLO6skB5nSzNpD3MCDPl9EudQJLAJ1N2d777lanlmC0.svg)

Below is an introduction of some of the basic stragies used by market makers:


### Basic Trading Strategies - Quoting Strategies
Quoting Strategies (by options market makers) profit by creating and providing liquidity to the options market. They do this by continuously buying and selling options contracts, making money through the difference between the bid (price at which they are willing to buy) and the ask (price at which they are willing to sell) prices.

This difference is known as the bid-ask spread, and the strategies's goal is to maintain a small spread, so that they can attract a large number of trades and generate more profits from the volume. They also generate income from selling options contracts at higher prices than what they bought them for, and from collecting premiums from options buyers.

- Queue Priority
- Message Efficiency
- Multi-Level Quoting
- Multi-Session Quoting
- Quote with Orders

Key factors that affect the success of quoting:
- BDs
- Message Efficiency
- Prioritization

### Basic Trading Strategies - Takeout Strategies
Under construction


### Basic Trading Strategies - Delta Hedging Strategies
Market makers may use more advanced strategies to hedge their risk and generate additional profits, such as delta-hedging, which involves adjusting the position of underlying assets to offset changes in the value of the options they have sold.


### Basic Trading Strategies - Micro Market Structure
Micro Market Structure refers to the analysis of the behavior of the market at the most granular level, focusing on the price action and order flow of individual stocks or financial instruments. It's a technical analysis approach that is commonly used by traders to gain a deeper understanding of market dynamics and make more informed trading decisions.

* Find an Earlier Signal: trading participants receive data via two channels: (a) the public data feed and (b) the private data – order acknowledgements, fills, etc. **On some venues**, the private data leads the public data. For example, I might receive a fill notification for a passive order before other participants receive the trade as part of the public data feed. And since I knew my queue position, the fill tells me that at least all volume ahead of me plus my own filled quantity was traded. ([Related Linkedin Post](https://www.linkedin.com/posts/stefanschlamp_cme-lowlatency-hft-activity-7029899920635523072-_RQx?utm_source=share&utm_medium=member_ios))

## Risk Management
---
Risk is a way to describe the size of an investment. Trading desks use risk limits to restrict the size of investments that their traders can make on behalf of the firm and the firm’s investors. Limiting the size of investments is one of the primary ways that traders control risk. This is not just a matter of restricting capital since many investments (like futures) only require a small amount of money to initiate a trade. Instead, position limits are commonly based on a volatility-based estimate of size called value-at-risk, abbreviated VAR.

Trading desks typically have several VAR limits. The first limit, a soft limit, indicates the target size of the trading portfolio. The second limit, a hard limit, indicates a size which trading positions are not allowed to exceed. Trading desks use these limits to ensure that traders are following trading rules set by the firm and to ensure that diversification is working properly.

* Local View: trading based on risk-reward tradeoff
  - Market risk is the main source of risk traders consider
  - Operational risk (especially auto-trading)
  - Credit/Counterparty risk
  - Adverse selection risk (a.k.a getting picked off): use MMP to defend aganist such risks
  - Regulatory, legal and reputational risk
* Global View: risk is a resource shared/allocated across desks to maximum revenue of the whole company
  - Risk limits could be allocated based on expected PnL


## Data Platform
---


## Post Trade Technologies
---
