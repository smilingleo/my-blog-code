---
path: "/2013/map-flatmap-for"
date: "2013-12-01T19:16:45.000Z"
title:  "map/flatMap/for in Action"
tags: ['scala', 'functional programming']
excerpt: "前文说过了，高阶函数式函数式语言中的基石，而`map`, `flatMap`更是重要。"
---

前文说过了，高阶函数式函数式语言中的基石，而`map`, `flatMap`更是重要。

对于map，就是一个空间转换的概念，从这个空间映射到另外一个空间：

* 必须是一一对应的，也就是这个空间的一个点也需要映射到另外一个空间的一个点。

对于flatMap，一种理解是map + flatten，但是我觉得这种理解不好，应为在FP中，flatMap远比map重要。

而map、flatMap加上withFilter和foreach实现了scala中最强大的for表达式。

其实叫for表达式不准确，英文是有两种称谓：

* for comprehension

    for {
      x <- e1
      y <- e2
    } yield e

    comprehension的含义是“理解力”，人如其名，这个表达式也有很强大的理解力。看文本文希望能够对这个方面有所帮助。

* for loop


    for {
        i <- e1
    } {
        // do something.
    }

本文这里套用Martin在"Reactive Programming"中的例子，对如何应用map, flatMap, for表达式做个简单介绍。

##例子
这个例子中，我们需要实现一个随机生成器，能够随机生成：Int, Boolean, Pair, List, Tree

##实现
###规约定义
先定义一个Generator类，里面主要的方法就是一个`generate`，返回一个T

<!-- language:lang-scala -->
    trait Generator[T] { self =>
      def generate : T
    }

###随机整数生成器
我们来实现一个随机整数生成器。

<!-- language:lang-scala -->
    val integers = new Generator[Int] {
      def generate = {
        val r = new java.util.Random
        r.nextInt
      }
    }

###随机布尔值生成器
再生成一个布尔值随机生成器。

<!-- language:lang-scala -->
    val booleans = new Generator[Boolean] {
      def generate = {
        val r = new java.util.Random
        r.nextInt >= 0
      }
    }

现在问题来了，上面的代码有两个问题：

1.代码重复
`val r = new java.util.Random ; r.nextInt`出现了两次

2.有boilerplate代码，`new Generator[Boolean]`, `def generate`等等
理想的情况应该是这样的：

<!-- language:lang-scala -->
    val booleans = for (i <- integers) yield i > 0

但是如果你在REPL中尝试的话，会发现报错：

<!-- language:lang-scala -->
    scala> val boolean = for (i <- integers) yield i >= 0
    <console>:9: error: value map is not a member of Generator[Int]
           val boolean = for (i <- integers) yield i >= 0

OK, 因为for表达式就是对`map`, `flatMap`的简化，上面的代码会被翻译为：

<!-- language:lang-scala -->
    integers map { i => i > 0 }

我们没有在Generator中定义map，所以报错是必然的。修改一下：

<!-- language:lang-scala run -->
    trait Generator[T] { self =>
      def generate : T

      def map[S](f: T => S): Generator[S] = new Generator[S] {
        def generate = f(self.generate)
      }
    }
    val integers = new Generator[Int] {
      def generate = {
        val r = new java.util.Random
        r.nextInt
      }
    }

    val booleans = for (i <- integers) yield i >= 0
    booleans.generate

点击`run`按钮试试，一切顺利！不错。

###随机Pair生成器
我们再继续，来点难点的，来个随机`(Int, Int)`生成器，想一下，很简单，调用两次`integers.generate`就可以了。

<!-- language:lang-scala -->
    val pairs = new Generator[(Int, Int)] {
      def generate = (integers.generate, integers.generate)
    }

同样的，我们不希望有boilerplate代码，每次new一个匿名类，还要重新定义`generate`，这是java中的无奈之举，对于scala来说，我们希望这么写：

<!-- language:lang-scala -->
    val pairs = for {
      x <- integers
      y <- integers
    } yield (x, y)

但是当你试运行一下的时候会出现：

    scala> val pairs = for (x <- integers ; y <- integers) yield (x, y)
    <console>:9: error: value flatMap is not a member of Generator[Int]
           val pairs = for (x <- integers ; y <- integers) yield (x, y)

编译器抱怨说没有flatMap定义在Generator上，怎么回事？

同理，我们需要了解for表达式的翻译机理，上面的代码会背翻译为：

<!-- language:lang-scala -->
    integers flatMap { x => integers map { (x, _) }}

我们没有实现flatMap当然会出现这样的错误。好吧，我们来增强一下：

<!-- language:lang-scala run -->
    trait Generator[T] { self =>
      def generate : T

      def map[S](f: T => S): Generator[S] = new Generator[S] {
        def generate = f(self.generate)
      }

      def flatMap[S](f: T => Generator[S]): Generator[S] = new Generator[S] {
        def generate = f(self.generate).generate
      }
    }

    val integers = new Generator[Int] {
      def generate = {
        val r = new java.util.Random
        r.nextInt
      }
    }

    val pairs = for {
      x <- integers
      y <- integers
    } yield (x, y)
    
    pairs.generate
    pairs.generate

不错吧，everything just works like a charm. 

我们还可以定义一些小工具，比如：

<!-- language:lang-scala -->
    def single[T](s: T) = new Generator[T] {
      def generate = s
    }

    def choose(from: Int, to: Int) = for { i <- integers } yield (from + Math.abs(i) % (to - from))

    def oneOf[T](choices: T*) = for ( idx <- choose(0, choices.length) ) yield choices(idx)

看到OO中策略模式的影子了吗？

###List[Int]生成器

<!-- language:lang-scala -->
    def nonEmptyList = for {
      head <- integers
      tail <- lists
    } yield (head :: tail)

    val lists: Generator[List[Int]] = for {
      isEmpty <- oneOf(true, false, false, false, false)
      list <- if (isEmpty) single(Nil) else nonEmptyList
    } yield list

###Tree生成器

<!-- language:lang-scala -->
    trait Tree
    case class Node(left: Tree, right: Tree) extends Tree
    case class Leaf(x: Int) extends Tree

    def leafs: Generator[Leaf] = for ( i <- integers ) yield Leaf(i)

    //不是尾递归，很容易StackOverflow
    def nodes: Generator[Node] = for {
      left <- trees
      right <- trees
    } yield Node(left, right)

    def trees: Generator[Tree] = for {
      isLeaf <- booleans
      tree <- if (isLeaf) leafs else nodes
    } yield tree

上面的代码因为用了递归，而且不是尾递归，很容易stackoverflow，一种workaround是增大`isLeaf`的概率，比如用`oneOf(true, true, true, false, false)`来替换`booleans`，这样就有2/3的概率为leaf，退出递归，但是还是很容易出错。下面用指令式的方式来实现以下：

<!-- language:lang-scala -->
    // 先根据深度，生成所有的叶子
    private def leafs(depth: Int): List[Option[Leaf]] = (Math.pow(2, depth - 1).toInt to 1 by -2).toList.foldLeft(List[Option[Leaf]]()) { (acc, ele) =>
      val isLuck = booleans.generate
      if (isLuck)
        Some(Leaf(integers.generate)) :: Some(Leaf(integers.generate)) :: acc
      else
        None :: None :: acc
    }
    //依次聚集
    private def aggregate(children: List[Option[Tree]]): List[Option[Tree]] = {
      if (children.length == 1) 
        children
      else {
        val length = children.length        
        val parents = (length to 1 by -2).toList map { i => (children(i - 1), children(i - 2)) match {
            case (Some(l), Some(r)) => Some(Node(l, r))
            case (Some(l), None) => Some(Node(l, Leaf(integers.generate)))
            case (None, Some(r)) => Some(Node(Leaf(integers.generate), r))
            case (None, None) => Some(Leaf(integers.generate))
          }
        }
        aggregate(parents)
      }
    }

    def generateTree(depth: Int) = aggregate(leafs(depth))(0).get

总的思路是：先根据深度生成可能的叶子，然后两两聚集为上一层的父节点，然后递归直到根节点。

这个实现里同样没有用`可变量`。

####Bonus: 打印tree
TBD

##关于for表达式
如果你平常用for的场合都是在用一些collection的话，会产生一种错觉，以为for表达式智能应用在collection中，其实for表达式可以应用在任何定义了map/flatMap/withFilter/foreach的类型中，正如你在本文中看到的，那么一个问题是：

<!-- language:lang-scala -->
    val booleans = for ( x <- integers ) yield x >= 0

`booleans`的类型应该是什么呢？

如果你经常用for于collection，你可能会觉得是一个List[Boolean]，其实不是，真正的返回值是：`Generator[Boolean]`，因为for表达式知道`integers`的类型是Generator所以其返回值也是Generator，这就是for comprehension的含义是“理解力”，人如其名，这个表达式也有很强大的理解力。看文本文希望能够对这个方面有所帮助。

那么是如何实现的呢？其实很简单，将for表达式翻译为map你就知道其中玄机了。

<!-- language:lang-scala -->
    val booleans = for ( x <- integers ) yield x >= 0 = integers map { _ >= 0 }
