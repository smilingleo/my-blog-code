---
path: "/2013/fold"
date: "2013-11-27T19:16:45.000Z"
title:  "折纸的艺术：fold编程"
tags: ['scala', 'functional programming', 'fold']
excerpt: "Eric Meijer说：递归是函数式编程的GOTO，应该尽可能避免。如何避免，OO中我们用while循环，FP中我们用`fold`。"
---

Eric Meijer说：递归是函数式编程的GOTO，应该尽可能避免。如何避免，OO中我们用while循环，FP中我们用`fold`。

##什么是fold
fold就是折纸，给你一张纸条，你可以将其分为若干等份（一个集合），然后从左向右一点一点卷折起来，折成一个你想要的形状，当然也可以从右向左，还可以对半折。

    +---+---+---+---+---+---+---+---+---+---+---+---+
    |   |   |   |   |   |   |   |   |   |   |   |   |
    | --->  |   |   |   |   |   |   |   |   |   |   |
    |   |   |   |   |   |   |   |   |   |   |   |   |
    +---+---+---+---+---+---+---+---+---+---+---+---+

这里“你想要的形状”，就是最终`fold`的输出。

风向的例子，北风就是从北面吹来的风。同样的，foldRight就是从右向左折叠，操作对象是seed集合，参数是前面集合的最后一个元素。

##foldRight

<!-- language:lang-scala -->
    List(1,2,3).foldRight(seed)(f) = f(1, f(2, f(3, seed)))

记住：等式两边各个因子出现的顺序是相同的，都是1 -> 2 -> 3 -> seed，之所以重要，是因为最后一个`f(3, seed)`接受的参数是一个tuple: (ele, seed)，而不是(seed, ele)。
形象化一点，假设`f`是`cons`操作，也就是`::`:

        ::
      /   \
    1       ::
           /  \
          2     ::
               /  \
              3    seed 

例子：求整数集合之和。

<!-- language:lang-scala run -->
    val sum = List(1,2,3).foldRight(0) { (ele, seed) => { println(ele); seed + ele } }
    println(sum)

点击`run`，可以看到，输出的`ele`顺序是`3 -> 2 -> 1`.

##foldLeft

<!-- language:lang-scala -->
    List(1,2,3).foldLeft(seed)(g) = g(g(g(seed, 1), 2), 3)

这里，前面List中元素的处理顺序还是从左向右的，只是seed跑到了最前面，所以tuple变成了：(seed, ele)。

树形结构：

                g
              /   \
            g      3
          /   \
        g       2
      /   \
    seed   1

 
注意：这里我用的函数换成了`g`，而不是前面的`f`，就是想提醒大家，这是两个不同的函数，其参数都是tuple，但是seed的顺序不同。这在编程的时候经常搞混。

相同的例子：求一个整数集合的和。

<!-- language:lang-scala run -->
    val sum = List(1,2,3).foldLeft(0) { (seed, ele) => { println(ele); seed + ele } }
    println(sum)

点击`run`，可以看到，输出的`ele`顺序是`1 -> 2 -> 3`.

##助记
foldLeft/foldRight中block的参数tuple顺序经常搞混，为了方便记忆，我们可以这么来看，我们用seed做基准：

* foldRight，从右向左，tuple中seed在右`(elem, seed)`
* foldLeft, 从左向右，tuple中seed在左`(seed, elem)`

有了fold是卷折纸的概念，我们就比较容易理解unfold.

##unfold
与`fold`对应，`unfold`就是反过来将一个卷折好的纸分解开，变成若干等份（集合），所以unfold是一个集合的构造过程。

##例子
我们这里举一个实际的例子。

<!-- language:lang-scala -->
    def retry(n: Int)(block: => Future[T]): Future[T] = {
      if (n <= 0) {
        Future.failed{ new RuntimeException("failed even if retried") }
      } else {
        block fallbackTo {
          retry(n - 1)(block)
        }
      }
    }

这里我们用了递归，但是如Erik Meijer所说，递归是FP的GOTO，不容易理解，容易出错，我们来用fold来替换一下。

可是一般来说fold都是需要一个集合的，而这里有什么集合？没有条件，创造条件也要上！我们可以将`n`也就是次数看成是一个集合，因为逻辑上我们要作几次，每次算一个集合元素，那么这不就是一个集合吗？

这个集合就是：`val attempts = (1 to n) map { _ => () => block }`，有了操作的集合，我们就可以开始玩折纸游戏了。

我们最终要“折的形状”是：成功的话返回`T`，否则返回一个Failure。我们可以将一个缺省的failure作为seed开始。

而且我们期望的执行顺序是：`block1 recoverWith (block2 recoverWith (block3 recoverWith failure))`，很明显，这是一个`foldRight`。

<!-- language:lang-scala -->
    def retry(n: Int)(block: => Future[T]) = {
      val ns = (1 to n).iterator
      // 注意：这里的map不关心ns中的系数，所以用'_'，后面需要一个by name参数，所以需要一个() => block，否则将会提前计算，达不到重试效果。
      val attempts = ns map { _ => () => block }
      val failure = Future.failed{ new RuntimeException("failed even if retried") }
      // 这里seed是一个call by name
      attempts.foldRight(() => failure) { (attempt, seed) =>
        // seed是call by name，这里也需要是call by name
        () => attempt() fallbackTo{ seed() }
      }
    }

