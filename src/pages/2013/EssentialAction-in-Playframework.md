---
path: "/2013/essential-action-in-play"
date: "2013-11-05T09:16:45.000Z"
title: "EssentialAction in Playframework"
tags: ['scala', 'playframework']
excerpt: "Playframework中EssentialAction理解"
---

##Play!框架的核心
Play!的内核其实非常简单，简单地说，Play框架所实现的可以用一个函数表达式来描述：

`RequestHeader -> Array[Byte] -> Result`

具体讲，就是接受一个`RequestHeader`，然后读入类型为`Array[Byte]`的Request Body，计算完毕之后返回一个`Result`。

注：函数式语言的表达就是高度抽象，但异常简洁。

##问题及优化

###文件上传
上面的描述有一个问题：我们假定要把请求内容*全部*读入内存（或者写入磁盘），对于简单应用不是什么问题，但是对于文件上传等场景，这肯定是有问题的，所以，Play开发者做了优化。

注：此处可以看出函数式语言的一个优点：仅需要了解你的函数定义，就能分析出潜在的问题。而如果面向对象的方式一般关注在对象之间的通信、方法调用，从方法签名上往往会忽略这些细节。

优化的思路当然是将请求内容一部分一部分地读入（chunk），所以这个函数就变成了：

`RequestHeader -> Iteratee[Array[Byte], Result]`

`Iteratee`是个什么东东？简单讲就是一个`Monad`，什么是Monad？可以类比为OO世界中的设计模式：专门为了解决某类问题的特定方法。Iteratee可以将输入（Input）分步(Step)读入，而且可以进行精细控制遇到EOF、Empty、El(chunk)的时候应该如何处理，是继续（Cont），结束（Done）还是抛错（Error）。这里不做详细介绍。有兴趣的可以参见：[这篇博客](http://apocalisp.wordpress.com/2010/10/17/scalaz-tutorial-enumeration-based-io-with-iteratees/)

Iteratee本身也是一个`Arrow`（简单理解为函数），所以如果我们定义一个新类型：

<!-- language:lang-scala -->
    type ==>[E, R] = Iteratee[E, R]

上面的函数用scala来写就会变为：

<!-- language:lang-scala -->
    RequestHeader => Array[Byte] ==> Result

注：`==>[E, R]`和`E ==> R`是等价的，是scala的一个语法糖。

上面的表达式看上去更简洁，更有趣了。

###文件下载
有了`Iteratee`我们就可以分块处理请求了，但是响应呢？同样地，如果响应中的数据量很大，比如文件下载，从上面的函数定义看，依旧会把文件完全读入到内存中，同样的问题。

解决的思路也是一样的。我们可以将`Result`看做下面的数据结构：

<!-- language:lang-scala -->
    case class Result(header: ResponseHeader, body: Array[Byte])

问题主要在`body`上，类型是Array[Byte]，需要有一个新的数据类型将起封装，可以分块地处理输出内容，这就是`Enumerator`，一个用来将响应数据分块(chunk)的东东。

所以最终Play框架核心可以看做下面的API：

<!-- language:lang-scala -->
    case class Result[E](headers:ResponseHeaders, body:Enumerator[E])(implicit writeable:Writeable[E])
    type ==>[E, R] = Iteratee[E, R]
    RequestHeader => Array[Byte] ==> Result


下面我们来看看Request和Result各自的类图，了解一下都有哪些实现。

<!-- language:uml -->
    title Request Class Hierarchy
    class RequestHeader << (T, #00FF00)>>
    class Request << (T, #00FF00)>>

    RequestHeader <|-- Request
    Request <|-- WrappedRequest
    Request <|-- FakeRequest
    WrappedRequest <|-- AuthenticatedRequest

    center footer 图一：Request 类图

真简单啊，比OO世界里面的一些MVC框架中的类层次结构少多了。

<!-- language:uml -->
    title Result Class Hierarchy
    class WithHeaders << (T, #00FF00) >>
    class Result << (T, #00FF00) >>

    class PlainResult << (T, #FF0000) deprecated>>
    class AsyncResult << (C, #FF0000) deprecated>>
    class ChunkedResult << (D, #FF0000) deprecated>>

    WithHeaders <|-- Result
    Result <|-- PlainResult
    Result <|-- AsyncResult
    PlainResult <|-- SimpleResult
    SimpleResult <|-- ChunkedResult
    SimpleResult <|-- Status

    center footer 图二：Result 类图

目前Play2.2中Result有两个子类：PlainResult和AsyncResult，但这两个Result已经被标记为deprecated了，从2.3开始，Play将只支持SimpleResult。为什么呢？ 想想其实很简单：单一职责原则。所谓`AsyncResult`其实本身职责不单一，有异步和Result两个，而直接使用：`Future[SimpleResult]`则清晰很多。另外ChunkedResult被废弃的原因也一样。