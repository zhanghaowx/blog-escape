---
layout: post
permalink: low-latency-techniques
comments: false
toc: true
title: "Low Latency Techniques"
date: 2023-02-18 15:00:00
description: An overview of low latency techniques used in trading
font-awesome: exchange
categories:
- review
---

This post is a summary of all the low latency techniques I have used or heard of in my past years of exprience in financial industry.

# Hardware Low Latency Techniques
---
### FPGA
FPGA, or Field-Programmable Gate Array, is a type of digital integrated circuit that can be programmed after manufacturing to perform specific tasks.

* Send BulkDeletes (aka. Mass Cancels, Purge Port) to exchanges on certain triggers, usually on specific market packets
* Send Orders (e.g. IOC) to exchanges on certain triggers, usually on specific market packets

<!--
@startuml
skinparam linetype polyline

cloud Exchange #lightpink

package FPGA #lightblue {
  [MAC] as MAC_MD
  [MAC] as MAC_ORDER
  [TCP]
  [Market Data Handling] as MD
  [Order Formatting] as ORDER
  [Trading Logic] as STRAT
}

queue "\t\t\t\t\t\t\t\tPCIe\t\t\t\t\t\t\t\t" as PCIE

Exchange -r-> MAC_MD: "Market Data"
Exchange <-r-> MAC_ORDER: "Order Entry"

MAC_MD -r-> MD
MD -d-> STRAT
STRAT -l-> ORDER
ORDER -l-> TCP
TCP <-l-> MAC_ORDER

PCIE <-u-> STRAT
PCIE <-u-> TCP

@enduml
-->
![FPGA Internal Achitecture](https://plantuml-server.kkeisuke.dev/svg/NP7TJeGm48NlvoacUCqB66EM0AicRfOWTxen8srOGYbOIY8nlhjJYYnkI4lxdVav0xl1ah5Zgs1eQjsJeHPLhQMTUebzfoPt0IXLDmfClyepwKhYZQghi-rhtG3qL3R4R9yzH8lmeKQ9tu3uUeZY4zA0_7u_9DVac2Tfxc0HPwTP9DD8YmbPmaVIWfjNFdhEFHeX3UuxqvArVzAbY27149-xgYvdwQN8em9-03v7oOw2D_l_oU8dUSq2byX22h2E6vhmVXdX5eEDoU0ISxS6pOOuphjDjJLJ0E3Jbr89kAFWexSuxnWg1dwSUVU0lmtmuWPgsm30cMGwhbKsm2N1Jch1V_ON.svg)

Reference:
* [Youtube: FPGAs and low latency trading - Williston Hayes - Optiver](https://www.youtube.com/watch?v=RCb8PsdipHI&ab_channel=Optiver)

### Server Configurations

A server running low latency applications needs special tuning. Below is a list of topics we need dive into:

- **Tickless Kernel**:
A tickless kernel is a type of operating system kernel that operates without a periodic timer interrupt, commonly referred to as a "tick." In traditional operating systems, the kernel uses a periodic timer interrupt to drive various system-level tasks, such as scheduling processes, updating system statistics, and handling timeouts.

- **CPU Isolation**:
CPU isolation is a technique used in computer systems to ensure that specific tasks or processes are executed on dedicated or isolated CPU resources. The goal of CPU isolation is to prevent interference or resource contention between different tasks or processes, thus ensuring predictable performance, latency, and resource utilization. In practice, CPU isolation is often implemented by assigning a dedicated set of CPU cores or hardware threads to a specific task or process. The OS then configures the CPU scheduler to only schedule the isolated task or process on these dedicated resources, and to prevent other tasks or processes from executing on them. This can be accomplished through the use of CPU masks, CPU sets, or CPU affinity settings in the OS scheduler.

- **HyperThreading**:
Hyper-threading is a technology that allows a single physical processor to present itself as two virtual processors to the operating system, potentially allowing for increased performance. However, this performance increase can also depend on the workload and the nature of the application being run. Especially when you have low latency requirements for your critial path, you may not want to share physical resources with others.


**Reference:**
- [Low latency tuning guide](https://rigtorp.se/low-latency-guide/)

# Software Low Latency
---

### TLB Shootdowns
TLB (Translation Lookaside Buffer) shootdown is a type of software issue that can occur in computer systems, particularly in multi-processor or multi-core systems, when two or more processors attempt to modify the same entry in the TLB simultaneously.

The TLB is a hardware component in a computer system that helps to speed up memory access by translating virtual addresses into physical addresses. When a processor needs to access a memory location, it first looks up the virtual address in the TLB, which provides the physical address of the memory location.

In a multi-processor system, it is possible for two or more processors to try to modify the same TLB entry simultaneously. This can lead to a conflict, called a TLB shootdown, which results in one or more processors invalidating their TLB entries, causing performance degradation.

Here is a few situations that you may see TLB shootdown:
* Context Switches
* Sytem Call
  - `munmap`: calling the `munmap` system call in a multi-threaded process returns memory to the kernal, and may cause pages from the VM to PM mapping to become stale, presenting a security risk as well as being incorrect. `nummap` is sometimes called as a result of a `free()` or `delete` call, which is often paired with `malloc()` or `new` call, or as a result of using Disk-backed mapping, also known as memory-mapped I/O or memory-mapped file I/O.
  - `madvise`: calling the `madvise` system call change the mapping in a way that might cause incorrect behavior in other CPUs, and also often triggers TLB shootdowns.

TLB shootdowns can have a significant impact on system performance, particularly in high-performance computing applications where low latency and high-throughput are critical. They can result in increased latencies, decreased throughput, and increased processor utilization.

To avoid TLB shootdowns, systems can employ various techniques, such as software-based TLB management, hardware-based TLB management, and memory management units (MMUs) with larger TLBs. These techniques help to minimize the frequency and impact of TLB shootdowns and ensure that the system operates efficiently and with minimal latency.

Below is one way to check TLB shootdowns:
```python
with open("/proc/interrupts", "r") as f:
    for line in f:
        if "TLB shootdowns" in line:
            # Extract the number of TLB shootdowns from the line
            tlb_shootdowns = int(line.strip().split()[1])
            print("Number of TLB shootdowns:", tlb_shootdowns)
```
Note that the format of the `/proc/interrupts` file can vary between different Linux systems and kernel versions, so you may need to adjust the code to handle different formats or provide error handling for lines that do not contain the expected information.


### Cache Warming


### Ring/Circular Buffer


### Object Pool
