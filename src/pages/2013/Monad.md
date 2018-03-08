---
path: "/2013/monad"
date: "2013-11-26T07:16:45.000Z"
title:  "Monad"
tags: ['scala', 'functional programming', 'monad']
excerpt: "函数式语言与OO（确切地讲是指令式编程）的思维方式是完全不同的，很多OO中的经验在函数式语言中不是很匹配，比如设计模式，那就是一个OO中的特定术语，而在FP中，大家常谈的是对于习惯OO思维的程序员来说玄而又玄的Monad。"
---

函数式语言与OO（确切地讲是指令式编程）的思维方式是完全不同的，很多OO中的经验在函数式语言中不是很匹配，比如设计模式，那就是一个OO中的特定术语，而在FP中，大家常谈的是对于习惯OO思维的程序员来说玄而又玄的Monad。

虽然术语不同，其实要解决的问题是相同的，设计模式也好、Monad也好，都是为了如何更好地处理异常、让代码更加简洁易懂、容易扩展等等。【所以透彻地了解问题本身，比学习一个新的技术更加重要。】

本系列文章试图能够将Monad这个及其抽象的东东具体化，将其落地，变为能够理解的例子，看看在具体问题下如何使用Monad来抽象问题，简化代码。

##什么是Monad

###定义

一个Monad就是一个实现了flatMap, unit等函数，包含某种数据类型的容器，更加术语化一点是参数化类型`M[T]`.

<!-- language:lang-scala -->
    trait M[T] {
      def flatMap[U](f: T => M[U]) : M[U]
      def unit[T](x: T) : M[T]
    }

Monad需要满足三个定理（没错，就是定理，感觉回到了小学、初中的数学课堂）。

* 组合律

  `(x flatMap f) flatMap g == x flatMap (y => f(y) flatMap g)`

  有些人可能会问，右边为什么不是 `x flatMap (f flatMap g)`呢？ 你试一下就知道了，编译器报类型匹配错误，这里`x`是一个monad，`f`, `g`都是函数，所以`f flatMap g`会类型不匹配。

* 左单一

  `unit(x) flatMap f == f(x)`

* 右单一

  `x flatMap unit == x`

###Monad举例
在Scala中Monad不是新鲜玩意，其实只要你学scala，那你就会天天用，常用的Monad有：

* Collection类，比如：List, Set, Map
* 描述可能性的Option  (Some, None)
* 异常处理类 Try, scalaz中的Validation等
* 描述未来的 Future
* 封装状态变化的State
* 封装IO的IO

##Monad解决什么问题
正如上面列举的几个Monad，每种Monad都是为了解决某种具体问题而存在的，正如OO中设计模式一样，只不过Monad的侧重点是：

* 让你只关注代码主流程，而将异常等分支交给flatMap来处理。

* 每个Monad是一个容器或者一个平行空间，让你可以在该容器（空间）中安全地、方便地操作容器中的数据类型，而不用关心相关问题。比如：在Option空间中，你不用考虑是否有返回值的问题，不需要像指令式编程那样`if (rtn == null) ... else ...`，再比如Future，让你能够在“未来的时空”中对数据进行操作，不用担心同步的问题，因为你的运算都发生在“未来”空间中。

* 结合for表达式，让你的代码更加简洁、易读。

  `for { x <- monad; y <- f(x); ...}`

  而前面讲的定律（主要是结合律和右单一），可以确保monad在for表达式中使用的正确性，比如结合律：

<!-- language:lang-scala -->
    for {
      y <- for (x <- m; y <- f(x)) yield y
      z <- g(y)
    } yield z

因为满足结合律，就可以简化为：

<!-- language:lang-scala -->
    for {
      x <- m
      y <- f(x)
      z <- g(y)
    } yield z

如果翻译为map/flatMap，前者翻译为：`m flatMap f flatMap g`，后者翻译为：`m flatMap (x => f(x) flatMap g)`.

而右单一定律可以保证：`for {x <- m} yield x == m`，如果你看过scalaz，你就了解为什么scalaz中需要有专门的test case来测试这些定律了。

一般来说我们不太需要关注这些定律的问题，但是如果你需要自己开发一个自己的Monad，那么你就得保证你的Monad符合这些定律，因为这样才能让你的Monad安全地应用在for表达式中。