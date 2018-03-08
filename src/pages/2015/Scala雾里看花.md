---
path: "/2015/scala-trouble-shooting"
date: "2015-04-23T19:16:45.000Z"
title:  "Scala雾里看花"
tags: ['scala', 'trouble shooting']
excerpt: "Scala的学习过程中，经常会碰到一些莫名其妙的现象，很多时候，这些语言层面的“怪象”都与scala编译器或者scala的类型系统有关。本文不是对编译器和类型系统的介绍，而是重点介绍遇到这些现象的时候，用什么样的方式，拨开云雾见蓝天，通过这些工具获取一些细节帮你了解编译器和类型系统如何工作。工欲善其事，必先利其器。"
---

Scala的学习过程中，经常会碰到一些莫名其妙的现象，很多时候，这些语言层面的“怪象”都与scala编译器或者scala的类型系统有关。

本文不是对编译器和类型系统的介绍，而是重点介绍遇到这些现象的时候，用什么样的方式，拨开云雾见蓝天，通过这些工具获取一些细节帮你了解编译器和类型系统如何工作。工欲善其事，必先利其器。
## REPL
Read-Evaluate-Print-Loop, 是一个所有学习scala的同学都要掌握的工具，可以帮你快速测试一些代码，了解一些library怎么使用。

在安装scala之后，命令行下执行`scala`，就会进入REPL.

<!-- language: bash -->
    $ scala
    Welcome to Scala version 2.11.1 (Java HotSpot(TM) 64-Bit Server VM, Java 1.6.0_65).
    Type in expressions to have them evaluated.
    Type :help for more information.

    scala>

如果是SBT项目，可以用`sbt console`进入，之后操作类型，不再重复。
###模式
scala REPL有[几种模式](http://hongjiang.info/scala-repl-modes/)，其中比较常用的就是`:paste`，可以比较方便的输入多行，不过要注意，拷贝粘贴的代码中，不要有Tab，否则会触发auto code completion，出现一堆错误提示。
### 反射

## 命令行参数
通过`man scala`, `man scalac`，可以了解scala都有哪些参数可用。注意的是：scala的命令行参数中import了scalac的参数，所以可以在scala命令后面使用任何scalac的参数。其中比较有用的参数有：

+ `-X`系列，用于输出高级选项概要。也就是正式支持的选项，向后兼容。
+ `-Y`系列。用于输出私有选项信息，可能随版本变化。参见[[6]](http://www.scala-lang.org/old/node/9313)[[7]](http://paulbutcher.com/2010/04/26/scala-compiler-advanced-options/)

`scala -X`，`scala -Y`可以分别列出当前版本所支持的所有选项。


## 参考
1. [What's the easiest way to use reify (get an AST of) an expression in Scala? stackoverflow](http://stackoverflow.com/questions/11055210/whats-the-easiest-way-to-use-reify-get-an-ast-of-an-expression-in-scala)
2. [How to investigate objects/types/etc. from Scala REPL? stackoverflow](http://stackoverflow.com/questions/11392622/how-to-investigate-objects-types-etc-from-scala-repl)
3. [Practical Type Mining in Scala ,  scaladay 2013](https://www.parleys.com/tutorial/51c38751e4b0d38b54f4625e/chapter0/about)
4. [REPL的几种模式, hongjiang](http://hongjiang.info/scala-repl-modes/)
5. [Symbols, Trees, and Types, scalaDoc](http://docs.scala-lang.org/overviews/reflection/symbols-trees-types.html)
6. [Difference between -Y and -X compiler options, scala user forum](http://www.scala-lang.org/old/node/9313)
7. [Scala Compiler Advanced Options](http://paulbutcher.com/2010/04/26/scala-compiler-advanced-options/)