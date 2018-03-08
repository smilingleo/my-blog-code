---
path: "/2015/aop-by-mixin-in-scala"
date: "2015-08-13T10:16:45.000Z"
title: "用Mixin组合实现Scala中的AOP"
tags: ['scala', 'functional programming', 'AOP', 'mixin']
excerpt: "在Java世界，AOP（Aspect Oriented Programming， 面向方面编程)是很多框架的基础。这种将关注点按照“方面”来切分的编程模型极大地简化了编程的复杂度，尤其是在多维度因子交织在一起的时候的各种场景。对于代码的可读性、可维护性、可重用性都是极大的帮助。"
---

## Java中的AOP

在Java世界，AOP（Aspect Oriented Programming， 面向方面编程)是很多框架的基础。这种将关注点按照“方面”来切分的编程模型极大地简化了编程的复杂度，尤其是在多维度因子交织在一起的时候的各种场景。对于代码的可读性、可维护性、可重用性都是极大的帮助。

不过AOP一个令人诟病的地方是其透明性，也就是说对于开发人员来说，我不知道我的某个方法会不会被某个Aspect切面一刀，有些时候，会造成一些意想不到的后果，比如Spring的transaction管理，如果通过aop的方式来定义，比如：

<!-- language: xml -->
	<tx:advice id="txCommonAdvice" transaction-manager="transactionManager">
		<tx:attributes>
			<tx:method name="save*" propagation="REQUIRED"/>
			<tx:method name="remove*" propagation="REQUIRED"/>
			<tx:method name="update*" propagation="REQUIRED"/>
			<tx:method name="delete*" propagation="REQUIRED"/>
			<tx:method name="*" propagation="REQUIRED" read-only="true"/>
		</tx:attributes>
	</tx:advice>

那么被这个切面拦截的任何方法都会导致Spring Transaction Manager启动一个事务，甚至是像`toString()`, `equal(other)`等这样的方法，而且因为其透明性，开发人员往往意识不到这个问题。

## Scala中的AOP
在Scala的世界里，AOP的思想其实也是适用的，当然，因为Scala就运行在jvm上面，很多code weaver工具也照样是可以用的，比如aspectj, asm等等，个人不是很喜欢这些东西，更喜欢用显式的方式来告诉我的代码读者，我的代码会做哪些事情。No Magic，是我的一个信条。

Scala的Mixin机制trait，可以很好地实现显式的AOP，举个例子：

<!-- language: scala run -->
    trait Task { def execute }
    trait TaskLogging extends Task {
        abstract override def execute = {
            println("before execute")
            super.execute
            println("after execute")
        }
    }
    class MyTask extends Task {
        override def execute = {
            println("do something")
        }
    }
    
    val task = new MyTask
    task.execute    // 输出 'do something'，没什么稀奇的
    
    val task2 = new MyTask with TaskLogging
    task2.execute   // 点击'run'看看会输出什么？
    
在上面代码中，`MyTask`和`TaskLogging`都是只关注于自己的逻辑（Aspect），在运行时，可以构建一个`MyTask with TaskLogging`的`task2`instance，就可以将两个方面组合在一起了。当然你还可以增加新的方面，比如：

<!-- language: scala -->
    trait Transactional extends Task {
        abstract override def execute = {
            println("begin transaction")
            try {
                super.execute
                println("commit transaction")
            } catch {
                case _: Exception =>
                    println("rollback transaction")
            }
        }
    }
    
    val task3 = new MyTask with TaskLogging with Transactional
    task3.execute
    
这样，就可以构建一个有事务，有logging的task。

总结一下，定义一个Aspect的步骤：

1. 重载trait中的方法
2. 方法前逻辑，比如logging、begin transaction等等
3. 调用`super`对象的方法
4. 方法后逻辑，比如logging、commit transaction等

这里，主要的知识点是调用`super.execute`的执行顺序，在用`with Trait`定义一个新类型的时候，多个Trait会形成一个Stack，执行的时候会按照出栈顺序执行，比如：

<!-- language: scala -->
    val task = new MyTask with TaskLogging with Transactional
    task.execute
    
TaskLogging先入栈，Transactional后入，那么执行的时候，先执行Transactional，后执行TaskLogging，就会输出：

<!-- language -->
    begin transaction
    before execute
    do something
    after execute
    commit transaction
    
换一个顺序：

<!-- language: scala -->
    val task = new MyTask with TaskLogging with Transactional
    task.execute

那么输出将会是另外一个顺序。    

### 抽象方法中的super call
注意一个细节，在`TaskLogging.execute`中，我们调用了`super.execute`，仔细想想，感觉很奇怪，几个疑点：

1. TaskLogging的super是谁？
2. 为什么`MyTask.execute`是最后执行的？
 
查询《Programming in Scala》“traits as stackable modifications“章节后，我们可以了解到：

1. trait中的super call是动态绑定，是在另外一个trait或者class实现一个具体的方法之后。
2. 所以trait中的方法必须标注: `abstract override`，以此来告诉编译器，你是故意这么来用的。

用scalac编译上述源文件，生成.class文件之后，用`jad`等工具查看反编译类，会发现其实`MyTask with TaskLogging`会产生一个匿名类，继承MyTask，实现TaskLogging接口，回头再看TaskLogging中定义的`super.execute`，就能理解了，原来在调用TaskLogging.execute方法的时候的`this`，已经是匿名类的实例了，当然其super是合法的。然后其执行顺序也就能理解了。

但是这里明显有一个矛盾：从代码执行角度看，生成的匿名类是MyTask和TaskLogging的子类，这点可以通过`task.isInstanceOf[MyTask] && task.isInstanceOf[TaskLogging]`中判断得出，但是从字面上看，在trait TaskLogging中调用`super.execute`，又给人感觉莫名其妙。可能这也是scala需要在jvm上运行所做的妥协吧。

## Stackable Actor模式
在Akka中，这种Mixin的用法非常的有帮助，比如在对actor进行监控的时候，我们希望能记录每个actor发送消息的路径，每个actor接收消息之后处理所花费的时间、调用次数等等，如果不用这种trait mixin的话，代码将非常凌乱。

之所以单独将这个模式提出来，其实还因为这个模式中利用了PartialFunction的特性，让代码更加的优雅。看例子：

<!-- language: scala run -->
    type Receive = PartialFunction[Any, Unit]

    trait Actor {
        def receive: Receive
        def unhandled(msg: Any): Unit = println(s"unhandled message: $msg")
    }

    trait StackableActor extends Actor {
        def wrapped: Receive
        def receive: Receive = {
            case x => if (wrapped.isDefinedAt(x)) wrapped(x) else unhandled(x)
        }
    }

     trait LoggingActor extends StackableActor { 
        override def wrapped: Receive = { 
            case x => 
                println(s"start processing message: $x")
                super.receive(x)
                println("end of processing message:" + x) 
        }
    }

    class MyActor extends StackableActor with LoggingActor {
        override def wrapped: Receive = {
            case "something" =>
                println("I can only do 'something'")
        }
    }

    new MyActor() receive ("something")
    new MyActor() receive ("else")
    

