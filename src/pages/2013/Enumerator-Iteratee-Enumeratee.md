---
path: "/2013/enumerator-iteratee-enumeratee"
date: "2013-11-11T14:16:45.000Z"
title: "Enumerator / Iteratee / Enumeratee"
tags: ['scala', 'playframework', 'blog']
excerpt: "Stream对于指令式编程已经比较成熟了，有大量的类库，丰富的API。但是对于强调不可变量，尽可能无副作用的FP来说，要考虑语言适配的问题，而目前，流行的解决方案就是：Enumerator/Iteratee。"
---

##Context

插曲：前不久微博上看到一技术“牛人”大V评论Java8的一些特性，引入lambada但没有扩展能力，集合的查询都得靠新stream api而不是Enumerator / Iterator云云。一时手欠回复了下“似乎应该是Enumerator / Iteratee“, 结果引来一身骚，被该大V泼口大骂了一个下午，没错就是像网吧里面无聊的小青年一样无营养地谩骂，实在没搞懂到底是为什么，说我说的Iteratee和他说的没”鸡毛“关系，不懂，也不想搞懂了，还是他玩他的Iterator我介绍我的Iteratee吧。

因为我们的内存、磁盘等资源还是有限的，对于一个大的Stream，Collection，我们在处理的时候不应该将其作为整体进行处理，因为这样会带来潜在的风险，比如：内存溢出，降低系统吞吐量等等。

正确的方式是将大的不可预见（unpredictable）的stream，Collection进行分解，将其分解为小的，可预见（predictable）的块进行处理。这是流模式的思想，也是Iteratee的设计目标之一。

Stream对于指令式编程已经比较成熟了，有大量的类库，丰富的API。但是对于强调不可变量，尽可能无副作用的FP来说，要考虑语言适配的问题，而目前，流行的解决方案就是：Enumerator/Iteratee。

另外，就是需要用统一的API来处理所有类型的Stream，就像指令式编程中的`InputStream.read`, `OutputStream.write`，无论什么Stream都需要支持这些基本方法。

##High Level Concept Model
Enumerator / Iteratee说起来很复杂，其实就是一个生产者 / 消费者模型。 Enumerator是生产者，创建诸多个可控的chunk，Iteratee是消费者，消费任意类型的Input Chunk。

<!-- language:lang-scala -->
    trait Enumerator {
      def |>>[A](i: Iteratee[E, A]): Future[Iteratee[E, A]] = apply(i)
    }

Enumerator驱动一个Iteratee，Iteratee处理一个Chunk之后，返回下一个状态的Iteratee. 在构造Enumerator的时候不会真正读取数据，只有在真正消费时才产生IO。

而且多个Enumerator之间可以组合，不同类型的消费者（Iteratee）也可以进行组合、变换，简言之，组合的概念就是将每个Enumerator / Iteratee都看成是一个可组合的积木，每个积木相对独立可复用，写代码就是将这些积木组合达成你想要形状的过程。这个说法很常见，OO里提倡“组合优于继承”也是一样的思想，其中的关键是如何找到最小的可复用的component，然后是通过什么样的方式进行灵活地组合。

Enumerator / Iteratee / Enumeratee就是一个非常好的例子。

##消费者 Iteratee

<!-- language:lang-scala -->
    class Iteratee << (T, #00FF00) >> {
      Future[B] fold[B](folder: Step[E, A] => Future[B])
    }
    class ImmediateIteratee << (T, #00FF00) >>
    class Done << (O, #FF0000) >>
    class Cont << (O, #FF0000) >>
    class Error << (O, #FF0000) >>
    class Step << (T, #00FF00) >>
    class Input << (T, #00FF00) >>

    Iteratee <|-- ImmediateIteratee
    Iteratee <|-- FutureIteratee
    Iteratee <.left.> Step
    Step .left.> Input

    ImmediateIteratee <|-- DoneIteratee
    DoneIteratee .. Done
    ImmediateIteratee <|-- ContIteratee
    ContIteratee .. Cont
    ImmediateIteratee <|-- ErrorIteratee
    ErrorIteratee .. Error

    note "company objects" as oNote
    Done .. oNote
    Cont .. oNote
    Error .. oNote

Iteratee是一个Input的消费者，注意：这里的Input不是全部输入，而是a chunk of input，这个很重要，没有一个Iteratee来消费所有输入数据，而是每块一个消费者，然后通过函数组合的方式将所有块穿起来。

* 为什么不是一个完整输入对应一个消费者呢？
  这是指令式编程的思维方式，因为你需要自己考虑实现细节，设计一些游标，每次读取步进的长度，判断游标的位置来判断下一步如何操作。

* 为什么不是所有的输入chunk共享一个消费者呢？
  嗯，这个问题我不是很确定，应该是有一部分上面的原因，另外就是副作用的问题，每个Step自己维护自己的状态，可以比较容易地实现“懒加载”，在最后一步（调用`run`）的时候才真正发生IO，而之前，可以通过函数组合任意对每一步进行transform等操作。

Iteratee还有一个需要注意的地方，fold函数是一个`curried function`，有一个implicit的参数ExecutionContext，也就是在哪个线程池中执行，这个现象在Play中很普遍。

ImmediateIteratee描述了一个已经预先知道其state的Iteratee，而FutureIteratee当然就是未来才能知道其State的Iteratee。[个人感觉这个地方设计有点怪，FutureIteratee似乎应该用Future[Iteratee]更好。] 

<!-- language:uml -->
    class Step << (T, #00FF00) >> {
      Iteratee[E, A] it
    }
    class Iteratee << (T, #00FF00) >>
    class Input << (T, #00FF00) >>
    Step .left.> Input
    Step <-right-> Iteratee
    Step <|-- Done
    Step <|-- Cont
    Step <|-- Error

Step描述的是一个Iteratee的状态，其本身包含一个Iteratee不变量`it`，而Done、Cont、Error也是简单的`case class`，所以构造也很简单。


<!-- language:uml -->
    class Input << (T, #00FF00) >>
    Input <|-- El
    Input <|-- Empty
    Input <|-- EOF

Input[E]描述的是`一块`输入(a chunk of input，不是全部输入)，构造其实很简单，就是一个简单的case class，可以按照你熟悉的方式来构造。

##生产者 Enumerator
先来看看Enumerator的定义：

<!-- language:lang-scala -->
    trait Enumerator[E] {

      /**
       * Apply this Enumerator to an Iteratee
       */
      def apply[A](i: Iteratee[E, A]): Future[Iteratee[E, A]]
      def |>>[A](i: Iteratee[E, A]): Future[Iteratee[E, A]] = apply(i)
      ...

    }

由上面定义可以看到，一个`Enumerator`接受一个`Iteratee[E, A]`，并返回一个`Future[Iteratee[E, A]]`，翻译一下就是：Enumerator驱动一个消费者，消费数据之后产生一个下个状态的消费者。

Enumerator提供了大量的工厂方法（在scala中是通过伴生对象来实现），比如，你可以从一个数组创建一个Enumerator:

<!-- language:lang-scala -->
    val enumerateCountries = Enumerator[String] = Enumerator("China", "America", "Japan", "Russia", "England")

可以从一个文件中创建：

<!-- language:lang-scala -->
    val enumerateFile: Enumerator[Array[Byte]] = Enumerator.fromFile(new File("path/to/some/big/file"))

或者从一个Stream中创建：

<!-- language:lang-scala -->
    val enumerateFile: Enumerator[Array[Byte]] = Enumerator.fromStream(new java.io.FileInputStream(new File("path/to/some/big/file")))    

更加通用的方式是从一个`e: ()=>Future[Option[E]]`函数来创建，因为这个函数声明了：未来可能会产生一个`E`:

<!-- language:lang-scala -->
    def generateM[E](e: => Future[Option[E]])(implicit ec: ExecutionContext): Enumerator[E] = {
        ...
    }

发挥一下你的想象，很多事情都可以看成是Stream，比如时间：

<!-- language:lang-scala -->
    import play.api.libs.concurrent.Promise
    import play.api.libs.iteratee._
    import scala.concurrent.duration._
    import scala.concurrent.ExecutionContext.Implicits.global
    import java.util.Date

    // 截止时间
    val alertTo = new Date(System.currentTimeMillis + 1000*60)

    // 一个时间流，截止到alertTo
    val timeStream = Enumerator.generateM {
        Promise.timeout(
          if (new Date before alertTo) Some(new Date) else None, 
          1 seconds)
    }

    val printlnSink = Iteratee.foreach[Date](date => println(date))
    // 每隔一秒钟打印一次，直到alertTo
    timeStream |>> printlnSink

如果你想再play console里面运行上面的代码，可能会失败，说什么:no application started之类的，这时你需要前面加上：

<!-- language:lang-scala -->
    val app = new play.core.StaticApplication(new java.io.File("."))

创建一个测试用的application，再试一下就OK了。

除了这个例子，我觉得也可以将数据库中的游标查询用Enumerator来实现。

在Play框架中，还有一个实际的例子是`WebSocket`，有机会我们再单独介绍。

##适配器 Enumeratee
对应OO Design Pattern中的Adaptor模式，`Enumeratee`就是一个Adaptor，将不同规格的组件适配在一起。比如下面这个例子：

我们有一个String类型的Enumerator, `Enumerator("123", "456", "789", "222", "333", "444")`，还有一个累加器，`Iteratee.fold[Long, Long](0:Long) { (acc, el) => acc + el }`，两者的“规格”是不同的，一个是String， 但另外一个是Long，当然我们可以再定义一个新的Iteratee，比如：`Iteratee.fold[String, Long](0:Long) { (acc, el) => acc + el.toLong }`，但是显然，这里面有重复代码的臭味道。更加合理的方式是做一个适配，用一个适配器来讲两个已经存在的component转接后一起工作。

<!-- language:lang-scala run -->
    import play.api.libs.iteratee._
    import scala.concurrent.ExecutionContext.Implicits.global
    
    val strings = Enumerator("123", "456", "789", "222", "333", "444")
    val sum = Iteratee.fold[Long, Long](0:Long) { (acc, el) => acc + el }
    val toLong = Enumeratee.map[String]( x => x.toLong )

    strings |>> toLong &>> sum flatMap { x => x.run } onSuccess { case s => println(s) }
    // Or, transform the Enumerator first.
    strings &> toLong |>> sum flatMap { x => x.run } onSuccess { case s => println(s) }

上面例子可以看到，`Enumeratee`不但可以适配`Iteratee`，还可以转换`Enumerator`。

留个问题：`strings &> toLong`会不会产生memory的问题？ 

## 指令式 VS. 函数式

这里用一个很无聊的例子：遍历一个大文件来统计文件大小。

### 指令式风格
Use Java FileInputStream, more imperative style:

<!-- language:lang-scala -->
    val fis = new java.io.FileInputStream(new java.io.File("/Users/leo/Movies/big_file.mkv"))

    // mutable variables
    var readLength = 0
    var fileSize: Long = 0
    var buf = new Array[Byte](1024 * 8) // chunk size used in Enumerator
    val begin = System.currentTimeMillis
    do {
      readLength = fis.read(buf)
      if (readLength != -1)
        fileSize = fileSize + readLength
    }while(readLength != -1)

    println(s"File Size: $fileSize, and it took ${System.currentTimeMillis - begin} ms")

And output like `File Size: 4003885806, and it took 54701 ms`, the memory usage is about `78Mb`.

### 函数式风格
Use Enumerator / Iteratee to get file size:

<!-- language:lang-scala -->
    import play.api.libs.iteratee._
    // construct an Enumerator from a file
    val fileEnum = Enumerator.fromFile(new java.io.File("/Users/leo/Movies/big_file.mkv")) 
    // create a consumer
    val counter = Iteratee.fold[Array[Byte], Long](0: Long){ (acc, ele) => ele.size + acc }

    val begin = System.currentTimeMillis
    // where the IO really happens.
    Iteratee.flatten(fileEnum |>> counter).run.onSuccess { case x => println(s"File Size: $x, and it took ${System.currentTimeMillis - begin} ms") }


Here's the output: `File Size: 4003885806, and it took 57213 ms`, and max memory usage is about `120Mb`. 

Note: If you are running above code with Scala version < 2.10.3, you'll run into `OutOfMemory` Error, it's so funny right? Enumerator / Iteratee suppose to be designed to solve the OutOfMemory issue, actually, it's not Enumerator/Iteratee 's problem, it's a bug of scala, see [SI-7336](https://issues.scala-lang.org/browse/SI-7336)

### 对比
从上面的两种实现来看，从执行时间上，两种方式没有太大差异，但是指令式编程在内存占用方面要优于函数式编程，毕竟var变量可以复用，val变量需要重新生成。但是差别并没有想象中那么大，处理一个4G的文件，差别只是40M左右。但是带来的好处是显而易见的：因为没有mutable变量，没有副作用，并发、代码可读性有提高。
