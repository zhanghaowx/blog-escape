---
layout: post
permalink: fibonacci
comments: true
title: "How to calculate nth fibonacci number?"
date: 2017-02-26 12:24:00
description: Fastest way of calculating fibonacci numbers
font-awesome: hourglass-half
categories:
- c++
- fibonacci
- dynamic programming
---

> How would you write a program to calculate a given Fibonacci number, say 50th and 500th?

**1. Use Dynamic Programming with Space Optimized**

```c++
size_t fibonacci(size_t n) {
    if (n == 0)
        return 0;
    if (n == 1)
        return 1;

    size_t a = 0;
    size_t b = 1;
    size_t c = a + b;

    for (size_t i = 2; i <= n; i++) {
        c = a + b;
        a = b;
        b = c;
    }

    return c;
}
```
- Time Complexity: O(n)
- Extra Space: O(1)

**2. Use Power of Matrix**

Because
$$
\begin{align*}
    \left(\begin{array}{ccc}
          F_{n}, & F_{n-1} \\
          F_{n-1}, & F_{n-2}
    \end{array} \right)
    \left(\begin{array}{ccc}
          1, & 1 \\
          1, & 0
    \end{array} \right)
    =
    \left(\begin{array}{ccc}
          F_{n} + F_{n-1}, & F_{n} \\
          F_{n-1} + F_{n-2}, & F_{n-1}
    \end{array} \right)
    =
    \left(\begin{array}{ccc}
          F_{n+1}, & F_{n} \\
          F_{n}, & F_{n-1}
    \end{array} \right)
\end{align*}
$$
, therefore
$$
\begin{align*}
    F_{n+1}
    =
    \left(\begin{array}{ccc}
          1, & 1 \\
          1, & 0
    \end{array} \right)^n
\end{align*}
$$

```c++
class Matrix2i {
public:
    Matrix2i(const size_t& m00, const size_t& m01,
        const size_t& m10, const size_t& m11) {
        m_data[0][0] = m00;
        m_data[0][1] = m01;
        m_data[1][0] = m10;
        m_data[1][1] = m11;
    }

    const size_t* operator[](const size_t& i) const {
        return m_data[i];
    }

    Matrix2i& multiply(const Matrix2i& other) {
        auto m00 = m_data[0][0] * other[0][0] + m_data[0][1] * other[1][0];
        auto m01 = m_data[0][0] * other[0][1] + m_data[0][1] * other[1][1];
        auto m10 = m_data[1][0] * other[0][0] + m_data[1][1] * other[1][0];
        auto m11 = m_data[1][0] * other[0][1] + m_data[1][1] * other[1][1];

        m_data[0][0] = m00;
        m_data[0][1] = m01;
        m_data[1][0] = m10;
        m_data[1][1] = m11;

        return *this;
    }

    Matrix2i& pow(size_t n) {
        if (n == 0 || n == 1) {
            return *this; // mathmatical incorrect when n == 0
        }

        Matrix2i copy(*this);

        pow(n / 2).multiply(*this);

        if (n % 2 == 1) {
            multiply(copy);
        }

        return *this;
    }

private:
    size_t m_data[2][2];
};

size_t fibonacci(size_t n) {
    if (n == 0) {
        return 0;
    }

    Matrix2i m(1, 1, 1, 0);
    return m.pow(n - 1)[0][0];
}
```
- Time Complexity: O(log(n))
- Extra Space: O(log(n)) if considering function call stacks, otherwise O(1).

**3. Use Template Metaprogramming Supported in C++11**

- **Loops** with recursive template definitions
- **Conditionals** with partial template specializations
- **Returns** using typedefs

```c++
// solution 1
template<size_t N>
struct fibonacci {
    static const size_t cValue = fibonacci<N-1>::cValue + fibonacci<N-2>::cValue;
};

template<>
struct fibonacci<0> {
    static const size_t cValue = 0;
};

template<>
struct fibonacci<1> {
    static const size_t cValue = 1;
};
```

```c++
// solution 2
template<size_t N>
struct fibonacci: integral_constant<size_t, fibonacci<N-1>::value + fibonacci<N-2>::value> {};

template<> struct fibonacci<0>: integral_constant<size_t, 0> {};
template<> struct fibonacci<1>: integral_constant<size_t, 1> {};
```

- Time Complexity: O(1)

**Performance Comparision When N is 50**

| Method    | Microseconds | Ticks |
|-----------|--------------|-------|
| O(n)      | 28           | 28200 |
| O(log(n)) | 1            | 1700  |
| O(1)      | 0            | 700   |

**However, when N is 500, integers will overflow during computation. Hence we need a `BigInt` class**

```c++
#include <vector>
using namespace std;

/**
 * Non-negative big integers with operator + supported
 */
class BigInt {
public:
    BigInt(size_t i) {
        m_digits.clear();
        while (i > 0) {
            m_digits.push_back(i % 10);
            i = i / 10;
        }
    }

    /**
     * friends defined inside class body are inline and are hidden from non-ADL lookup,
     * passing lhs by value helps optimize chained a+b+c
     */
    friend BigInt operator+ (BigInt lhs, const BigInt& rhs) {
        auto p = lhs.m_digits.begin();
        auto q = rhs.m_digits.begin();

        int carry = 0;
        while (q != rhs.m_digits.end()) {
            if (p == lhs.m_digits.end()) {
                lhs.m_digits.push_back(0);
                p = lhs.m_digits.end() - 1;
            }

            *p += *q + carry;
            carry = *p / 10;
            *p %= 10;

            p++;
            q++;
        }

        while (carry) {
            lhs.m_digits.push_back(carry);
            carry = carry / 10;
        }

        return lhs;
    }

    friend ostream& operator<< (ostream& os, const BigInt& bigInt) {
        for (int i = bigInt.m_digits.size() - 1; i >= 0; i--) {
            os << static_cast<int>(bigInt.m_digits[i]);
        }
    }

private:
    vector<char> m_digits;
};
```
And a fixed version of the previous dynamic programming solution
```c++
template<typename T>
T fibonacci1(size_t n) {
    if (n == 0)
        return 0;
    if (n == 1)
        return 1;

    T a = 0;
    T b = 1;
    T c = a + b;

    for (size_t i = 2; i <= n; i++) {
        c = a + b;
        a = b;
        b = c;
    }

    return c;
}
```
**Result**: 1394232245616978801397243828704072839500702565876973072641089629483255
71622863290691557658876222521294125 in 3157 microseconds(3157921 ticks).

**Read**
- [Program for Fibonacci Numbers](http://www.geeksforgeeks.org/program-for-nth-fibonacci-number/)
- [Stackoverflow: Calculate Fibonacci Number in Compile Time](http://stackoverflow.com/questions/22645551/calculate-the-fibonacci-number-recursive-approach-in-compile-time-constexpr)
- [Stackoverflow: Get Template Meta-Programming Compile Time Constatns at Runtime](http://stackoverflow.com/questions/908256/getting-template-metaprogramming-compile-time-constants-at-runtime)
