webpackJsonp([27141419837156],{427:function(e,n){e.exports={data:{markdownRemark:{html:"<p>函数式语言与OO（确切地讲是指令式编程）的思维方式是完全不同的，很多OO中的经验在函数式语言中不是很匹配，比如设计模式，那就是一个OO中的特定术语，而在FP中，大家常谈的是对于习惯OO思维的程序员来说玄而又玄的Monad。</p>\n<p>虽然术语不同，其实要解决的问题是相同的，设计模式也好、Monad也好，都是为了如何更好地处理异常、让代码更加简洁易懂、容易扩展等等。【所以透彻地了解问题本身，比学习一个新的技术更加重要。】</p>\n<p>本系列文章试图能够将Monad这个及其抽象的东东具体化，将其落地，变为能够理解的例子，看看在具体问题下如何使用Monad来抽象问题，简化代码。</p>\n<h2>什么是Monad</h2>\n<h3>定义</h3>\n<p>一个Monad就是一个实现了flatMap, unit等函数，包含某种数据类型的容器，更加术语化一点是参数化类型<code>M[T]</code>.</p>\n<!-- language:lang-scala -->\n<pre><code>trait M[T] {\n  def flatMap[U](f: T => M[U]) : M[U]\n  def unit[T](x: T) : M[T]\n}\n</code></pre>\n<p>Monad需要满足三个定理（没错，就是定理，感觉回到了小学、初中的数学课堂）。</p>\n<ul>\n<li>\n<p>组合律</p>\n<p><code>(x flatMap f) flatMap g == x flatMap (y => f(y) flatMap g)</code></p>\n<p>有些人可能会问，右边为什么不是 <code>x flatMap (f flatMap g)</code>呢？ 你试一下就知道了，编译器报类型匹配错误，这里<code>x</code>是一个monad，<code>f</code>, <code>g</code>都是函数，所以<code>f flatMap g</code>会类型不匹配。</p>\n</li>\n<li>\n<p>左单一</p>\n<p><code>unit(x) flatMap f == f(x)</code></p>\n</li>\n<li>\n<p>右单一</p>\n<p><code>x flatMap unit == x</code></p>\n</li>\n</ul>\n<h3>Monad举例</h3>\n<p>在Scala中Monad不是新鲜玩意，其实只要你学scala，那你就会天天用，常用的Monad有：</p>\n<ul>\n<li>Collection类，比如：List, Set, Map</li>\n<li>描述可能性的Option  (Some, None)</li>\n<li>异常处理类 Try, scalaz中的Validation等</li>\n<li>描述未来的 Future</li>\n<li>封装状态变化的State</li>\n<li>封装IO的IO</li>\n</ul>\n<h2>Monad解决什么问题</h2>\n<p>正如上面列举的几个Monad，每种Monad都是为了解决某种具体问题而存在的，正如OO中设计模式一样，只不过Monad的侧重点是：</p>\n<ul>\n<li>\n<p>让你只关注代码主流程，而将异常等分支交给flatMap来处理。</p>\n</li>\n<li>\n<p>每个Monad是一个容器或者一个平行空间，让你可以在该容器（空间）中安全地、方便地操作容器中的数据类型，而不用关心相关问题。比如：在Option空间中，你不用考虑是否有返回值的问题，不需要像指令式编程那样<code>if (rtn == null) ... else ...</code>，再比如Future，让你能够在“未来的时空”中对数据进行操作，不用担心同步的问题，因为你的运算都发生在“未来”空间中。</p>\n</li>\n<li>\n<p>结合for表达式，让你的代码更加简洁、易读。</p>\n<p><code>for { x &#x3C;- monad; y &#x3C;- f(x); ...}</code></p>\n<p>而前面讲的定律（主要是结合律和右单一），可以确保monad在for表达式中使用的正确性，比如结合律：</p>\n</li>\n</ul>\n<!-- language:lang-scala -->\n<pre><code>for {\n  y &#x3C;- for (x &#x3C;- m; y &#x3C;- f(x)) yield y\n  z &#x3C;- g(y)\n} yield z\n</code></pre>\n<p>因为满足结合律，就可以简化为：</p>\n<!-- language:lang-scala -->\n<pre><code>for {\n  x &#x3C;- m\n  y &#x3C;- f(x)\n  z &#x3C;- g(y)\n} yield z\n</code></pre>\n<p>如果翻译为map/flatMap，前者翻译为：<code>m flatMap f flatMap g</code>，后者翻译为：<code>m flatMap (x => f(x) flatMap g)</code>.</p>\n<p>而右单一定律可以保证：<code>for {x &#x3C;- m} yield x == m</code>，如果你看过scalaz，你就了解为什么scalaz中需要有专门的test case来测试这些定律了。</p>\n<p>一般来说我们不太需要关注这些定律的问题，但是如果你需要自己开发一个自己的Monad，那么你就得保证你的Monad符合这些定律，因为这样才能让你的Monad安全地应用在for表达式中。</p>",frontmatter:{title:"Monad",date:"November 26, 2013",path:"/2013/monad",tags:["scala","functional programming","monad"],excerpt:"函数式语言与OO（确切地讲是指令式编程）的思维方式是完全不同的，很多OO中的经验在函数式语言中不是很匹配，比如设计模式，那就是一个OO中的特定术语，而在FP中，大家常谈的是对于习惯OO思维的程序员来说玄而又玄的Monad。"}}},pathContext:{prev:{html:'<p>Eric Meijer说：递归是函数式编程的GOTO，应该尽可能避免。如何避免，OO中我们用while循环，FP中我们用<code>fold</code>。</p>\n<h2>什么是fold</h2>\n<p>fold就是折纸，给你一张纸条，你可以将其分为若干等份（一个集合），然后从左向右一点一点卷折起来，折成一个你想要的形状，当然也可以从右向左，还可以对半折。</p>\n<pre><code>+---+---+---+---+---+---+---+---+---+---+---+---+\n|   |   |   |   |   |   |   |   |   |   |   |   |\n| --->  |   |   |   |   |   |   |   |   |   |   |\n|   |   |   |   |   |   |   |   |   |   |   |   |\n+---+---+---+---+---+---+---+---+---+---+---+---+\n</code></pre>\n<p>这里“你想要的形状”，就是最终<code>fold</code>的输出。</p>\n<p>风向的例子，北风就是从北面吹来的风。同样的，foldRight就是从右向左折叠，操作对象是seed集合，参数是前面集合的最后一个元素。</p>\n<h2>foldRight</h2>\n<!-- language:lang-scala -->\n<pre><code>List(1,2,3).foldRight(seed)(f) = f(1, f(2, f(3, seed)))\n</code></pre>\n<p>记住：等式两边各个因子出现的顺序是相同的，都是1 -> 2 -> 3 -> seed，之所以重要，是因为最后一个<code>f(3, seed)</code>接受的参数是一个tuple: (ele, seed)，而不是(seed, ele)。\n形象化一点，假设<code>f</code>是<code>cons</code>操作，也就是<code>::</code>:</p>\n<pre><code>    ::\n  /   \\\n1       ::\n       /  \\\n      2     ::\n           /  \\\n          3    seed \n</code></pre>\n<p>例子：求整数集合之和。</p>\n<!-- language:lang-scala run -->\n<pre><code>val sum = List(1,2,3).foldRight(0) { (ele, seed) => { println(ele); seed + ele } }\nprintln(sum)\n</code></pre>\n<p>点击<code>run</code>，可以看到，输出的<code>ele</code>顺序是<code>3 -> 2 -> 1</code>.</p>\n<h2>foldLeft</h2>\n<!-- language:lang-scala -->\n<pre><code>List(1,2,3).foldLeft(seed)(g) = g(g(g(seed, 1), 2), 3)\n</code></pre>\n<p>这里，前面List中元素的处理顺序还是从左向右的，只是seed跑到了最前面，所以tuple变成了：(seed, ele)。</p>\n<p>树形结构：</p>\n<pre><code>            g\n          /   \\\n        g      3\n      /   \\\n    g       2\n  /   \\\nseed   1\n</code></pre>\n<p>注意：这里我用的函数换成了<code>g</code>，而不是前面的<code>f</code>，就是想提醒大家，这是两个不同的函数，其参数都是tuple，但是seed的顺序不同。这在编程的时候经常搞混。</p>\n<p>相同的例子：求一个整数集合的和。</p>\n<!-- language:lang-scala run -->\n<pre><code>val sum = List(1,2,3).foldLeft(0) { (seed, ele) => { println(ele); seed + ele } }\nprintln(sum)\n</code></pre>\n<p>点击<code>run</code>，可以看到，输出的<code>ele</code>顺序是<code>1 -> 2 -> 3</code>.</p>\n<h2>助记</h2>\n<p>foldLeft/foldRight中block的参数tuple顺序经常搞混，为了方便记忆，我们可以这么来看，我们用seed做基准：</p>\n<ul>\n<li>foldRight，从右向左，tuple中seed在右<code>(elem, seed)</code></li>\n<li>foldLeft, 从左向右，tuple中seed在左<code>(seed, elem)</code></li>\n</ul>\n<p>有了fold是卷折纸的概念，我们就比较容易理解unfold.</p>\n<h2>unfold</h2>\n<p>与<code>fold</code>对应，<code>unfold</code>就是反过来将一个卷折好的纸分解开，变成若干等份（集合），所以unfold是一个集合的构造过程。</p>\n<h2>例子</h2>\n<p>我们这里举一个实际的例子。</p>\n<!-- language:lang-scala -->\n<pre><code>def retry(n: Int)(block: => Future[T]): Future[T] = {\n  if (n &#x3C;= 0) {\n    Future.failed{ new RuntimeException("failed even if retried") }\n  } else {\n    block fallbackTo {\n      retry(n - 1)(block)\n    }\n  }\n}\n</code></pre>\n<p>这里我们用了递归，但是如Erik Meijer所说，递归是FP的GOTO，不容易理解，容易出错，我们来用fold来替换一下。</p>\n<p>可是一般来说fold都是需要一个集合的，而这里有什么集合？没有条件，创造条件也要上！我们可以将<code>n</code>也就是次数看成是一个集合，因为逻辑上我们要作几次，每次算一个集合元素，那么这不就是一个集合吗？</p>\n<p>这个集合就是：<code>val attempts = (1 to n) map { _ => () => block }</code>，有了操作的集合，我们就可以开始玩折纸游戏了。</p>\n<p>我们最终要“折的形状”是：成功的话返回<code>T</code>，否则返回一个Failure。我们可以将一个缺省的failure作为seed开始。</p>\n<p>而且我们期望的执行顺序是：<code>block1 recoverWith (block2 recoverWith (block3 recoverWith failure))</code>，很明显，这是一个<code>foldRight</code>。</p>\n<!-- language:lang-scala -->\n<pre><code>def retry(n: Int)(block: => Future[T]) = {\n  val ns = (1 to n).iterator\n  // 注意：这里的map不关心ns中的系数，所以用\'_\'，后面需要一个by name参数，所以需要一个() => block，否则将会提前计算，达不到重试效果。\n  val attempts = ns map { _ => () => block }\n  val failure = Future.failed{ new RuntimeException("failed even if retried") }\n  // 这里seed是一个call by name\n  attempts.foldRight(() => failure) { (attempt, seed) =>\n    // seed是call by name，这里也需要是call by name\n    () => attempt() fallbackTo{ seed() }\n  }\n}\n</code></pre>',id:"/volume1/homes/leo/github/my-blog-code/src/pages/2013/fold编程.md absPath of file >>> MarkdownRemark",frontmatter:{date:"2013-11-27T19:16:45.000Z",path:"/2013/fold",title:"折纸的艺术：fold编程",excerpt:"Eric Meijer说：递归是函数式编程的GOTO，应该尽可能避免。如何避免，OO中我们用while循环，FP中我们用`fold`。",tags:["scala","functional programming","fold"]}},next:{html:'<p>所谓高阶函数（high order function），其实就是可以接受其他函数作为参数的函数。</p>\n<p>这里其实还有另外一个概念：<em>头等函数</em>（First Class Function），First Class应该是指头等公民的含义。在Java中的一个方法（函数），只能被调用，相比值Value就像个二等公民，不能像值Value一样，既可以在表达式中被引用，又可以作为参数传入其他方法。</p>\n<p>头等函数也就是可以将其作为一个值进行传递的函数。看上去很简单，可带来的变化是巨大的。</p>\n<p>头等函数加上高阶函数，可以极大地简化代码，实现DSL。</p>\n<h2>简化代码</h2>\n<h3>Java中的匿名类</h3>\n<!-- language:lang-java -->\n<pre><code>import java.util.*\n\nTimer timer = new Timer();\nTimerTask helloTimer = new TimerTask(){\n    public void run(){\n        System.out.println("Hello Timer");\n    }\n};\ntimer.schedule(helloTimer, 1);\n\nTimerTask helloWorld = new TimerTask(){\n    public void run(){\n        System.out.println("Hello World");\n    }\n};\ntimer.schedule(helloWorld, 1);\n</code></pre>\n<p>然后每次都需要new一个TimerTask匿名类，用起来真心不方便，尤其是当你有多个匿名类要一起使用的时候，那代码看起来简直就像一坨翔，丑陋无比！本来正常的、相同抽象层次的代码应该具有相同的缩进层次，这样阅读起来很易懂、顺畅。但是因为引入匿名类，就得放在不同的缩进层次中，加上不必要的类签名定义，方法定义等boilerplate code, 阅读起来那叫一个费劲！</p>\n<p>看看scala的方式：</p>\n<h1>Scala</h1>\n<!-- language:lang-scala run -->\n<pre><code>import scala.concurrent._\nimport scala.concurrent.duration._\nimport scala.concurrent.ExecutionContext.Implicits.global\n\nval timer = new java.util.Timer()\ndef timeout[A](a: => A, duration: Duration)(implicit ec: ExecutionContext): Future[A] = {\n    val p = Promise[A]()\n    timer.schedule(new java.util.TimerTask() {\n        def run() = {\n            p.success(a)\n        }\n    }, duration.toMillis)\n    p.future\n}\n\ntimeout(println("Hello World"), 1 millisecond)\ntimeout(println("Hello Timer"), 1 millisecond)\n</code></pre>\n<p>定义一个timeout高阶函数，接受一个<code>=> A</code>函数作为参数，然后就可以方便地重复调用了。\n</p>\n<h2>自定义控制结构+鸭子类型</h2>\n<h3>try with resources</h3>\n<p>在Java中，在处理一些资源相关的数据时，经常需要用一个<code>try .... catch ... finally { res.close(); }</code>的结构，同样地，这种结构使得代码的缩进层次和逻辑抽象层次不同而影响阅读。另外更严重的问题是常常忘记关闭资源。</p>\n<p>Java中的一种解决方案是用<code>template method</code>模式，比如Spring JdbcTemplate，传入一个匿名类，比如：</p>\n<!-- language: lang-java -->\n<pre><code>jdbcTemplate.execute(new StatementCallback(){\n    public Object doInStatement(Statement stmt) throws SQLException, DataAccessException {\n        // your real logic here\n    }\n}\n</code></pre>\n<p>可以看到，真正的逻辑被缩进了两层，有很多boilerplate代码。</p>\n<p>Java 1.7中引入了try with resources的语法，一定程度上解决了这个问题：</p>\n<!-- language: lang-java -->\n<pre><code>try (BufferedReader br = new BufferedReader(new FileReader(path))) {\n    return br.readLine();\n}\n</code></pre>\n<p>但是要求在try里面的资源必须实现<code>AutoCloseable</code>接口。当然了，Java中很多东西都是围绕接口转。接口就意味着规约，要使用try-with-resources语法，就必须符合这个规约。</p>\n<p>再看看Scala中如何实现：</p>\n<!-- language: lang-scala run -->\n<pre><code>def using[T &#x3C;: { def close() }](resource: T)(block: T => Unit) {\n  try {\n    block(resource)\n  }finally {\n    if (resource != null) resource.close()\n  }\n}\ncase class Resource {\n    def close() = println("I\'m closing")\n    def doSomething() = println("boring")\n}\n\nval res = Resource()\n\nusing[Resource](res){ res =>\n    res.doSomething()\n}\n</code></pre>\n<p>和<code>try-with-resources</code>的语法比较像吧，不过不同的是，<code>using</code>不要求传入的resource必须实现某种接口，只需要该类型定义了一个<code>def close(): Unit</code>方法。这就是所谓的鸭子类型，只要你走起来像鸭子，那你就是鸭子，不是一个很好的比喻，不过将就吧。</p>\n<h3>break</h3>\n<p>当你学习scala的时候，你会发现很多java中的关键字在scala中是不支持的，其中一个就是：<code>break</code>。</p>\n<p>在一个循环的时候，当满足某个条件就退出当前循环，是一个很普遍的用法，为什么scala中会不是一个关键字呢？我自己感觉是scala强调FP，而break有很浓的指令式编程的味道。</p>\n<p>那我就是想用break怎么办？不要紧，我们可以自己定义一个自己的break。</p>\n<!-- language: lang-scala run -->\n<pre><code>class Breaks {\n  private class BreakControl extends RuntimeException\n  private val breakException = new BreakControl\n\n  // breakable接受一个() => Unit的函数作为参数，是一个高阶函数。\n  def breakable(op: => Unit) {\n    try {\n      op\n    } catch {\n      case ex: BreakControl =>\n        if (ex ne breakException) throw ex\n    }\n  }\n\n  def break(): Nothing = { throw breakException }\n}\nobject Breaks extends Breaks\n\n\nimport Breaks.{break, breakable}\n// 通过高阶函数来实现break\nbreakable {\n  for (i &#x3C;- (1 to 1000)) {\n    if (i > 10){\n      break\n    } else {\n      println(i)\n    }\n  }\n}\n</code></pre>\n<p>是不是很棒？！scala没有我们可以自己造。这就是高阶函数的用处之一。</p>',id:"/volume1/homes/leo/github/my-blog-code/src/pages/2013/高阶函数.md absPath of file >>> MarkdownRemark",frontmatter:{date:"2013-11-21T19:16:45.000Z",path:"/2013/high-order-function",title:"高阶函数",excerpt:"所谓高阶函数（high order function），其实就是可以接受其他函数作为参数的函数。",tags:["scala","functional programming","high order function"]}}}}}});
//# sourceMappingURL=path---2013-monad-a7cd4fe1985c3ea25c1c.js.map