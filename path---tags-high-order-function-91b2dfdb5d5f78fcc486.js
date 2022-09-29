webpackJsonp([0xd3fdf7fb581e],{465:function(e,n){e.exports={pathContext:{posts:[{html:'<p>所谓高阶函数（high order function），其实就是可以接受其他函数作为参数的函数。</p>\n<p>这里其实还有另外一个概念：<em>头等函数</em>（First Class Function），First Class应该是指头等公民的含义。在Java中的一个方法（函数），只能被调用，相比值Value就像个二等公民，不能像值Value一样，既可以在表达式中被引用，又可以作为参数传入其他方法。</p>\n<p>头等函数也就是可以将其作为一个值进行传递的函数。看上去很简单，可带来的变化是巨大的。</p>\n<p>头等函数加上高阶函数，可以极大地简化代码，实现DSL。</p>\n<h2>简化代码</h2>\n<h3>Java中的匿名类</h3>\n<!-- language:lang-java -->\n<pre><code>import java.util.*\n\nTimer timer = new Timer();\nTimerTask helloTimer = new TimerTask(){\n    public void run(){\n        System.out.println("Hello Timer");\n    }\n};\ntimer.schedule(helloTimer, 1);\n\nTimerTask helloWorld = new TimerTask(){\n    public void run(){\n        System.out.println("Hello World");\n    }\n};\ntimer.schedule(helloWorld, 1);\n</code></pre>\n<p>然后每次都需要new一个TimerTask匿名类，用起来真心不方便，尤其是当你有多个匿名类要一起使用的时候，那代码看起来简直就像一坨翔，丑陋无比！本来正常的、相同抽象层次的代码应该具有相同的缩进层次，这样阅读起来很易懂、顺畅。但是因为引入匿名类，就得放在不同的缩进层次中，加上不必要的类签名定义，方法定义等boilerplate code, 阅读起来那叫一个费劲！</p>\n<p>看看scala的方式：</p>\n<h1>Scala</h1>\n<!-- language:lang-scala run -->\n<pre><code>import scala.concurrent._\nimport scala.concurrent.duration._\nimport scala.concurrent.ExecutionContext.Implicits.global\n\nval timer = new java.util.Timer()\ndef timeout[A](a: => A, duration: Duration)(implicit ec: ExecutionContext): Future[A] = {\n    val p = Promise[A]()\n    timer.schedule(new java.util.TimerTask() {\n        def run() = {\n            p.success(a)\n        }\n    }, duration.toMillis)\n    p.future\n}\n\ntimeout(println("Hello World"), 1 millisecond)\ntimeout(println("Hello Timer"), 1 millisecond)\n</code></pre>\n<p>定义一个timeout高阶函数，接受一个<code>=> A</code>函数作为参数，然后就可以方便地重复调用了。\n</p>\n<h2>自定义控制结构+鸭子类型</h2>\n<h3>try with resources</h3>\n<p>在Java中，在处理一些资源相关的数据时，经常需要用一个<code>try .... catch ... finally { res.close(); }</code>的结构，同样地，这种结构使得代码的缩进层次和逻辑抽象层次不同而影响阅读。另外更严重的问题是常常忘记关闭资源。</p>\n<p>Java中的一种解决方案是用<code>template method</code>模式，比如Spring JdbcTemplate，传入一个匿名类，比如：</p>\n<!-- language: lang-java -->\n<pre><code>jdbcTemplate.execute(new StatementCallback(){\n    public Object doInStatement(Statement stmt) throws SQLException, DataAccessException {\n        // your real logic here\n    }\n}\n</code></pre>\n<p>可以看到，真正的逻辑被缩进了两层，有很多boilerplate代码。</p>\n<p>Java 1.7中引入了try with resources的语法，一定程度上解决了这个问题：</p>\n<!-- language: lang-java -->\n<pre><code>try (BufferedReader br = new BufferedReader(new FileReader(path))) {\n    return br.readLine();\n}\n</code></pre>\n<p>但是要求在try里面的资源必须实现<code>AutoCloseable</code>接口。当然了，Java中很多东西都是围绕接口转。接口就意味着规约，要使用try-with-resources语法，就必须符合这个规约。</p>\n<p>再看看Scala中如何实现：</p>\n<!-- language: lang-scala run -->\n<pre><code>def using[T &#x3C;: { def close() }](resource: T)(block: T => Unit) {\n  try {\n    block(resource)\n  }finally {\n    if (resource != null) resource.close()\n  }\n}\ncase class Resource {\n    def close() = println("I\'m closing")\n    def doSomething() = println("boring")\n}\n\nval res = Resource()\n\nusing[Resource](res){ res =>\n    res.doSomething()\n}\n</code></pre>\n<p>和<code>try-with-resources</code>的语法比较像吧，不过不同的是，<code>using</code>不要求传入的resource必须实现某种接口，只需要该类型定义了一个<code>def close(): Unit</code>方法。这就是所谓的鸭子类型，只要你走起来像鸭子，那你就是鸭子，不是一个很好的比喻，不过将就吧。</p>\n<h3>break</h3>\n<p>当你学习scala的时候，你会发现很多java中的关键字在scala中是不支持的，其中一个就是：<code>break</code>。</p>\n<p>在一个循环的时候，当满足某个条件就退出当前循环，是一个很普遍的用法，为什么scala中会不是一个关键字呢？我自己感觉是scala强调FP，而break有很浓的指令式编程的味道。</p>\n<p>那我就是想用break怎么办？不要紧，我们可以自己定义一个自己的break。</p>\n<!-- language: lang-scala run -->\n<pre><code>class Breaks {\n  private class BreakControl extends RuntimeException\n  private val breakException = new BreakControl\n\n  // breakable接受一个() => Unit的函数作为参数，是一个高阶函数。\n  def breakable(op: => Unit) {\n    try {\n      op\n    } catch {\n      case ex: BreakControl =>\n        if (ex ne breakException) throw ex\n    }\n  }\n\n  def break(): Nothing = { throw breakException }\n}\nobject Breaks extends Breaks\n\n\nimport Breaks.{break, breakable}\n// 通过高阶函数来实现break\nbreakable {\n  for (i &#x3C;- (1 to 1000)) {\n    if (i > 10){\n      break\n    } else {\n      println(i)\n    }\n  }\n}\n</code></pre>\n<p>是不是很棒？！scala没有我们可以自己造。这就是高阶函数的用处之一。</p>',id:"/volume1/homes/leo/github/my-blog-code/src/pages/2013/高阶函数.md absPath of file >>> MarkdownRemark",frontmatter:{date:"2013-11-21T19:16:45.000Z",path:"/2013/high-order-function",title:"高阶函数",excerpt:"所谓高阶函数（high order function），其实就是可以接受其他函数作为参数的函数。",tags:["scala","functional programming","high order function"]}}],tagName:"high order function"}}}});
//# sourceMappingURL=path---tags-high-order-function-91b2dfdb5d5f78fcc486.js.map