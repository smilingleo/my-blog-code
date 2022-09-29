webpackJsonp([0x89660e6c0531],{415:function(e,n){e.exports={data:{markdownRemark:{html:'<p>Eric Meijer说：递归是函数式编程的GOTO，应该尽可能避免。如何避免，OO中我们用while循环，FP中我们用<code>fold</code>。</p>\n<h2>什么是fold</h2>\n<p>fold就是折纸，给你一张纸条，你可以将其分为若干等份（一个集合），然后从左向右一点一点卷折起来，折成一个你想要的形状，当然也可以从右向左，还可以对半折。</p>\n<pre><code>+---+---+---+---+---+---+---+---+---+---+---+---+\n|   |   |   |   |   |   |   |   |   |   |   |   |\n| --->  |   |   |   |   |   |   |   |   |   |   |\n|   |   |   |   |   |   |   |   |   |   |   |   |\n+---+---+---+---+---+---+---+---+---+---+---+---+\n</code></pre>\n<p>这里“你想要的形状”，就是最终<code>fold</code>的输出。</p>\n<p>风向的例子，北风就是从北面吹来的风。同样的，foldRight就是从右向左折叠，操作对象是seed集合，参数是前面集合的最后一个元素。</p>\n<h2>foldRight</h2>\n<!-- language:lang-scala -->\n<pre><code>List(1,2,3).foldRight(seed)(f) = f(1, f(2, f(3, seed)))\n</code></pre>\n<p>记住：等式两边各个因子出现的顺序是相同的，都是1 -> 2 -> 3 -> seed，之所以重要，是因为最后一个<code>f(3, seed)</code>接受的参数是一个tuple: (ele, seed)，而不是(seed, ele)。\n形象化一点，假设<code>f</code>是<code>cons</code>操作，也就是<code>::</code>:</p>\n<pre><code>    ::\n  /   \\\n1       ::\n       /  \\\n      2     ::\n           /  \\\n          3    seed \n</code></pre>\n<p>例子：求整数集合之和。</p>\n<!-- language:lang-scala run -->\n<pre><code>val sum = List(1,2,3).foldRight(0) { (ele, seed) => { println(ele); seed + ele } }\nprintln(sum)\n</code></pre>\n<p>点击<code>run</code>，可以看到，输出的<code>ele</code>顺序是<code>3 -> 2 -> 1</code>.</p>\n<h2>foldLeft</h2>\n<!-- language:lang-scala -->\n<pre><code>List(1,2,3).foldLeft(seed)(g) = g(g(g(seed, 1), 2), 3)\n</code></pre>\n<p>这里，前面List中元素的处理顺序还是从左向右的，只是seed跑到了最前面，所以tuple变成了：(seed, ele)。</p>\n<p>树形结构：</p>\n<pre><code>            g\n          /   \\\n        g      3\n      /   \\\n    g       2\n  /   \\\nseed   1\n</code></pre>\n<p>注意：这里我用的函数换成了<code>g</code>，而不是前面的<code>f</code>，就是想提醒大家，这是两个不同的函数，其参数都是tuple，但是seed的顺序不同。这在编程的时候经常搞混。</p>\n<p>相同的例子：求一个整数集合的和。</p>\n<!-- language:lang-scala run -->\n<pre><code>val sum = List(1,2,3).foldLeft(0) { (seed, ele) => { println(ele); seed + ele } }\nprintln(sum)\n</code></pre>\n<p>点击<code>run</code>，可以看到，输出的<code>ele</code>顺序是<code>1 -> 2 -> 3</code>.</p>\n<h2>助记</h2>\n<p>foldLeft/foldRight中block的参数tuple顺序经常搞混，为了方便记忆，我们可以这么来看，我们用seed做基准：</p>\n<ul>\n<li>foldRight，从右向左，tuple中seed在右<code>(elem, seed)</code></li>\n<li>foldLeft, 从左向右，tuple中seed在左<code>(seed, elem)</code></li>\n</ul>\n<p>有了fold是卷折纸的概念，我们就比较容易理解unfold.</p>\n<h2>unfold</h2>\n<p>与<code>fold</code>对应，<code>unfold</code>就是反过来将一个卷折好的纸分解开，变成若干等份（集合），所以unfold是一个集合的构造过程。</p>\n<h2>例子</h2>\n<p>我们这里举一个实际的例子。</p>\n<!-- language:lang-scala -->\n<pre><code>def retry(n: Int)(block: => Future[T]): Future[T] = {\n  if (n &#x3C;= 0) {\n    Future.failed{ new RuntimeException("failed even if retried") }\n  } else {\n    block fallbackTo {\n      retry(n - 1)(block)\n    }\n  }\n}\n</code></pre>\n<p>这里我们用了递归，但是如Erik Meijer所说，递归是FP的GOTO，不容易理解，容易出错，我们来用fold来替换一下。</p>\n<p>可是一般来说fold都是需要一个集合的，而这里有什么集合？没有条件，创造条件也要上！我们可以将<code>n</code>也就是次数看成是一个集合，因为逻辑上我们要作几次，每次算一个集合元素，那么这不就是一个集合吗？</p>\n<p>这个集合就是：<code>val attempts = (1 to n) map { _ => () => block }</code>，有了操作的集合，我们就可以开始玩折纸游戏了。</p>\n<p>我们最终要“折的形状”是：成功的话返回<code>T</code>，否则返回一个Failure。我们可以将一个缺省的failure作为seed开始。</p>\n<p>而且我们期望的执行顺序是：<code>block1 recoverWith (block2 recoverWith (block3 recoverWith failure))</code>，很明显，这是一个<code>foldRight</code>。</p>\n<!-- language:lang-scala -->\n<pre><code>def retry(n: Int)(block: => Future[T]) = {\n  val ns = (1 to n).iterator\n  // 注意：这里的map不关心ns中的系数，所以用\'_\'，后面需要一个by name参数，所以需要一个() => block，否则将会提前计算，达不到重试效果。\n  val attempts = ns map { _ => () => block }\n  val failure = Future.failed{ new RuntimeException("failed even if retried") }\n  // 这里seed是一个call by name\n  attempts.foldRight(() => failure) { (attempt, seed) =>\n    // seed是call by name，这里也需要是call by name\n    () => attempt() fallbackTo{ seed() }\n  }\n}\n</code></pre>',frontmatter:{title:"折纸的艺术：fold编程",date:"November 27, 2013",path:"/2013/fold",tags:["scala","functional programming","fold"],excerpt:"Eric Meijer说：递归是函数式编程的GOTO，应该尽可能避免。如何避免，OO中我们用while循环，FP中我们用`fold`。"}}},pathContext:{prev:{html:'<p>前文说过了，高阶函数式函数式语言中的基石，而<code>map</code>, <code>flatMap</code>更是重要。</p>\n<p>对于map，就是一个空间转换的概念，从这个空间映射到另外一个空间：</p>\n<ul>\n<li>必须是一一对应的，也就是这个空间的一个点也需要映射到另外一个空间的一个点。</li>\n</ul>\n<p>对于flatMap，一种理解是map + flatten，但是我觉得这种理解不好，应为在FP中，flatMap远比map重要。</p>\n<p>而map、flatMap加上withFilter和foreach实现了scala中最强大的for表达式。</p>\n<p>其实叫for表达式不准确，英文是有两种称谓：</p>\n<ul>\n<li>\n<p>for comprehension</p>\n<p>for {\nx &#x3C;- e1\ny &#x3C;- e2\n} yield e</p>\n<p>comprehension的含义是“理解力”，人如其名，这个表达式也有很强大的理解力。看文本文希望能够对这个方面有所帮助。</p>\n</li>\n<li>\n<p>for loop</p>\n</li>\n</ul>\n<pre><code>for {\n    i &#x3C;- e1\n} {\n    // do something.\n}\n</code></pre>\n<p>本文这里套用Martin在"Reactive Programming"中的例子，对如何应用map, flatMap, for表达式做个简单介绍。</p>\n<h2>例子</h2>\n<p>这个例子中，我们需要实现一个随机生成器，能够随机生成：Int, Boolean, Pair, List, Tree</p>\n<h2>实现</h2>\n<h3>规约定义</h3>\n<p>先定义一个Generator类，里面主要的方法就是一个<code>generate</code>，返回一个T</p>\n<!-- language:lang-scala -->\n<pre><code>trait Generator[T] { self =>\n  def generate : T\n}\n</code></pre>\n<h3>随机整数生成器</h3>\n<p>我们来实现一个随机整数生成器。</p>\n<!-- language:lang-scala -->\n<pre><code>val integers = new Generator[Int] {\n  def generate = {\n    val r = new java.util.Random\n    r.nextInt\n  }\n}\n</code></pre>\n<h3>随机布尔值生成器</h3>\n<p>再生成一个布尔值随机生成器。</p>\n<!-- language:lang-scala -->\n<pre><code>val booleans = new Generator[Boolean] {\n  def generate = {\n    val r = new java.util.Random\n    r.nextInt >= 0\n  }\n}\n</code></pre>\n<p>现在问题来了，上面的代码有两个问题：</p>\n<p>1.代码重复\n<code>val r = new java.util.Random ; r.nextInt</code>出现了两次</p>\n<p>2.有boilerplate代码，<code>new Generator[Boolean]</code>, <code>def generate</code>等等\n理想的情况应该是这样的：</p>\n<!-- language:lang-scala -->\n<pre><code>val booleans = for (i &#x3C;- integers) yield i > 0\n</code></pre>\n<p>但是如果你在REPL中尝试的话，会发现报错：</p>\n<!-- language:lang-scala -->\n<pre><code>scala> val boolean = for (i &#x3C;- integers) yield i >= 0\n&#x3C;console>:9: error: value map is not a member of Generator[Int]\n       val boolean = for (i &#x3C;- integers) yield i >= 0\n</code></pre>\n<p>OK, 因为for表达式就是对<code>map</code>, <code>flatMap</code>的简化，上面的代码会被翻译为：</p>\n<!-- language:lang-scala -->\n<pre><code>integers map { i => i > 0 }\n</code></pre>\n<p>我们没有在Generator中定义map，所以报错是必然的。修改一下：</p>\n<!-- language:lang-scala run -->\n<pre><code>trait Generator[T] { self =>\n  def generate : T\n\n  def map[S](f: T => S): Generator[S] = new Generator[S] {\n    def generate = f(self.generate)\n  }\n}\nval integers = new Generator[Int] {\n  def generate = {\n    val r = new java.util.Random\n    r.nextInt\n  }\n}\n\nval booleans = for (i &#x3C;- integers) yield i >= 0\nbooleans.generate\n</code></pre>\n<p>点击<code>run</code>按钮试试，一切顺利！不错。</p>\n<h3>随机Pair生成器</h3>\n<p>我们再继续，来点难点的，来个随机<code>(Int, Int)</code>生成器，想一下，很简单，调用两次<code>integers.generate</code>就可以了。</p>\n<!-- language:lang-scala -->\n<pre><code>val pairs = new Generator[(Int, Int)] {\n  def generate = (integers.generate, integers.generate)\n}\n</code></pre>\n<p>同样的，我们不希望有boilerplate代码，每次new一个匿名类，还要重新定义<code>generate</code>，这是java中的无奈之举，对于scala来说，我们希望这么写：</p>\n<!-- language:lang-scala -->\n<pre><code>val pairs = for {\n  x &#x3C;- integers\n  y &#x3C;- integers\n} yield (x, y)\n</code></pre>\n<p>但是当你试运行一下的时候会出现：</p>\n<pre><code>scala> val pairs = for (x &#x3C;- integers ; y &#x3C;- integers) yield (x, y)\n&#x3C;console>:9: error: value flatMap is not a member of Generator[Int]\n       val pairs = for (x &#x3C;- integers ; y &#x3C;- integers) yield (x, y)\n</code></pre>\n<p>编译器抱怨说没有flatMap定义在Generator上，怎么回事？</p>\n<p>同理，我们需要了解for表达式的翻译机理，上面的代码会背翻译为：</p>\n<!-- language:lang-scala -->\n<pre><code>integers flatMap { x => integers map { (x, _) }}\n</code></pre>\n<p>我们没有实现flatMap当然会出现这样的错误。好吧，我们来增强一下：</p>\n<!-- language:lang-scala run -->\n<pre><code>trait Generator[T] { self =>\n  def generate : T\n\n  def map[S](f: T => S): Generator[S] = new Generator[S] {\n    def generate = f(self.generate)\n  }\n\n  def flatMap[S](f: T => Generator[S]): Generator[S] = new Generator[S] {\n    def generate = f(self.generate).generate\n  }\n}\n\nval integers = new Generator[Int] {\n  def generate = {\n    val r = new java.util.Random\n    r.nextInt\n  }\n}\n\nval pairs = for {\n  x &#x3C;- integers\n  y &#x3C;- integers\n} yield (x, y)\n\npairs.generate\npairs.generate\n</code></pre>\n<p>不错吧，everything just works like a charm. </p>\n<p>我们还可以定义一些小工具，比如：</p>\n<!-- language:lang-scala -->\n<pre><code>def single[T](s: T) = new Generator[T] {\n  def generate = s\n}\n\ndef choose(from: Int, to: Int) = for { i &#x3C;- integers } yield (from + Math.abs(i) % (to - from))\n\ndef oneOf[T](choices: T*) = for ( idx &#x3C;- choose(0, choices.length) ) yield choices(idx)\n</code></pre>\n<p>看到OO中策略模式的影子了吗？</p>\n<h3>List[Int]生成器</h3>\n<!-- language:lang-scala -->\n<pre><code>def nonEmptyList = for {\n  head &#x3C;- integers\n  tail &#x3C;- lists\n} yield (head :: tail)\n\nval lists: Generator[List[Int]] = for {\n  isEmpty &#x3C;- oneOf(true, false, false, false, false)\n  list &#x3C;- if (isEmpty) single(Nil) else nonEmptyList\n} yield list\n</code></pre>\n<h3>Tree生成器</h3>\n<!-- language:lang-scala -->\n<pre><code>trait Tree\ncase class Node(left: Tree, right: Tree) extends Tree\ncase class Leaf(x: Int) extends Tree\n\ndef leafs: Generator[Leaf] = for ( i &#x3C;- integers ) yield Leaf(i)\n\n//不是尾递归，很容易StackOverflow\ndef nodes: Generator[Node] = for {\n  left &#x3C;- trees\n  right &#x3C;- trees\n} yield Node(left, right)\n\ndef trees: Generator[Tree] = for {\n  isLeaf &#x3C;- booleans\n  tree &#x3C;- if (isLeaf) leafs else nodes\n} yield tree\n</code></pre>\n<p>上面的代码因为用了递归，而且不是尾递归，很容易stackoverflow，一种workaround是增大<code>isLeaf</code>的概率，比如用<code>oneOf(true, true, true, false, false)</code>来替换<code>booleans</code>，这样就有2/3的概率为leaf，退出递归，但是还是很容易出错。下面用指令式的方式来实现以下：</p>\n<!-- language:lang-scala -->\n<pre><code>// 先根据深度，生成所有的叶子\nprivate def leafs(depth: Int): List[Option[Leaf]] = (Math.pow(2, depth - 1).toInt to 1 by -2).toList.foldLeft(List[Option[Leaf]]()) { (acc, ele) =>\n  val isLuck = booleans.generate\n  if (isLuck)\n    Some(Leaf(integers.generate)) :: Some(Leaf(integers.generate)) :: acc\n  else\n    None :: None :: acc\n}\n//依次聚集\nprivate def aggregate(children: List[Option[Tree]]): List[Option[Tree]] = {\n  if (children.length == 1) \n    children\n  else {\n    val length = children.length        \n    val parents = (length to 1 by -2).toList map { i => (children(i - 1), children(i - 2)) match {\n        case (Some(l), Some(r)) => Some(Node(l, r))\n        case (Some(l), None) => Some(Node(l, Leaf(integers.generate)))\n        case (None, Some(r)) => Some(Node(Leaf(integers.generate), r))\n        case (None, None) => Some(Leaf(integers.generate))\n      }\n    }\n    aggregate(parents)\n  }\n}\n\ndef generateTree(depth: Int) = aggregate(leafs(depth))(0).get\n</code></pre>\n<p>总的思路是：先根据深度生成可能的叶子，然后两两聚集为上一层的父节点，然后递归直到根节点。</p>\n<p>这个实现里同样没有用<code>可变量</code>。</p>\n<h4>Bonus: 打印tree</h4>\n<p>TBD</p>\n<h2>关于for表达式</h2>\n<p>如果你平常用for的场合都是在用一些collection的话，会产生一种错觉，以为for表达式智能应用在collection中，其实for表达式可以应用在任何定义了map/flatMap/withFilter/foreach的类型中，正如你在本文中看到的，那么一个问题是：</p>\n<!-- language:lang-scala -->\n<pre><code>val booleans = for ( x &#x3C;- integers ) yield x >= 0\n</code></pre>\n<p><code>booleans</code>的类型应该是什么呢？</p>\n<p>如果你经常用for于collection，你可能会觉得是一个List[Boolean]，其实不是，真正的返回值是：<code>Generator[Boolean]</code>，因为for表达式知道<code>integers</code>的类型是Generator所以其返回值也是Generator，这就是for comprehension的含义是“理解力”，人如其名，这个表达式也有很强大的理解力。看文本文希望能够对这个方面有所帮助。</p>\n<p>那么是如何实现的呢？其实很简单，将for表达式翻译为map你就知道其中玄机了。</p>\n<!-- language:lang-scala -->\n<pre><code>val booleans = for ( x &#x3C;- integers ) yield x >= 0 = integers map { _ >= 0 }\n</code></pre>',id:"/volume1/homes/leo/github/my-blog-code/src/pages/2013/map-flatMap-for.md absPath of file >>> MarkdownRemark",frontmatter:{date:"2013-12-01T19:16:45.000Z",path:"/2013/map-flatmap-for",title:"map/flatMap/for in Action",excerpt:"前文说过了，高阶函数式函数式语言中的基石，而`map`, `flatMap`更是重要。",tags:["scala","functional programming"]}},next:{html:"<p>函数式语言与OO（确切地讲是指令式编程）的思维方式是完全不同的，很多OO中的经验在函数式语言中不是很匹配，比如设计模式，那就是一个OO中的特定术语，而在FP中，大家常谈的是对于习惯OO思维的程序员来说玄而又玄的Monad。</p>\n<p>虽然术语不同，其实要解决的问题是相同的，设计模式也好、Monad也好，都是为了如何更好地处理异常、让代码更加简洁易懂、容易扩展等等。【所以透彻地了解问题本身，比学习一个新的技术更加重要。】</p>\n<p>本系列文章试图能够将Monad这个及其抽象的东东具体化，将其落地，变为能够理解的例子，看看在具体问题下如何使用Monad来抽象问题，简化代码。</p>\n<h2>什么是Monad</h2>\n<h3>定义</h3>\n<p>一个Monad就是一个实现了flatMap, unit等函数，包含某种数据类型的容器，更加术语化一点是参数化类型<code>M[T]</code>.</p>\n<!-- language:lang-scala -->\n<pre><code>trait M[T] {\n  def flatMap[U](f: T => M[U]) : M[U]\n  def unit[T](x: T) : M[T]\n}\n</code></pre>\n<p>Monad需要满足三个定理（没错，就是定理，感觉回到了小学、初中的数学课堂）。</p>\n<ul>\n<li>\n<p>组合律</p>\n<p><code>(x flatMap f) flatMap g == x flatMap (y => f(y) flatMap g)</code></p>\n<p>有些人可能会问，右边为什么不是 <code>x flatMap (f flatMap g)</code>呢？ 你试一下就知道了，编译器报类型匹配错误，这里<code>x</code>是一个monad，<code>f</code>, <code>g</code>都是函数，所以<code>f flatMap g</code>会类型不匹配。</p>\n</li>\n<li>\n<p>左单一</p>\n<p><code>unit(x) flatMap f == f(x)</code></p>\n</li>\n<li>\n<p>右单一</p>\n<p><code>x flatMap unit == x</code></p>\n</li>\n</ul>\n<h3>Monad举例</h3>\n<p>在Scala中Monad不是新鲜玩意，其实只要你学scala，那你就会天天用，常用的Monad有：</p>\n<ul>\n<li>Collection类，比如：List, Set, Map</li>\n<li>描述可能性的Option  (Some, None)</li>\n<li>异常处理类 Try, scalaz中的Validation等</li>\n<li>描述未来的 Future</li>\n<li>封装状态变化的State</li>\n<li>封装IO的IO</li>\n</ul>\n<h2>Monad解决什么问题</h2>\n<p>正如上面列举的几个Monad，每种Monad都是为了解决某种具体问题而存在的，正如OO中设计模式一样，只不过Monad的侧重点是：</p>\n<ul>\n<li>\n<p>让你只关注代码主流程，而将异常等分支交给flatMap来处理。</p>\n</li>\n<li>\n<p>每个Monad是一个容器或者一个平行空间，让你可以在该容器（空间）中安全地、方便地操作容器中的数据类型，而不用关心相关问题。比如：在Option空间中，你不用考虑是否有返回值的问题，不需要像指令式编程那样<code>if (rtn == null) ... else ...</code>，再比如Future，让你能够在“未来的时空”中对数据进行操作，不用担心同步的问题，因为你的运算都发生在“未来”空间中。</p>\n</li>\n<li>\n<p>结合for表达式，让你的代码更加简洁、易读。</p>\n<p><code>for { x &#x3C;- monad; y &#x3C;- f(x); ...}</code></p>\n<p>而前面讲的定律（主要是结合律和右单一），可以确保monad在for表达式中使用的正确性，比如结合律：</p>\n</li>\n</ul>\n<!-- language:lang-scala -->\n<pre><code>for {\n  y &#x3C;- for (x &#x3C;- m; y &#x3C;- f(x)) yield y\n  z &#x3C;- g(y)\n} yield z\n</code></pre>\n<p>因为满足结合律，就可以简化为：</p>\n<!-- language:lang-scala -->\n<pre><code>for {\n  x &#x3C;- m\n  y &#x3C;- f(x)\n  z &#x3C;- g(y)\n} yield z\n</code></pre>\n<p>如果翻译为map/flatMap，前者翻译为：<code>m flatMap f flatMap g</code>，后者翻译为：<code>m flatMap (x => f(x) flatMap g)</code>.</p>\n<p>而右单一定律可以保证：<code>for {x &#x3C;- m} yield x == m</code>，如果你看过scalaz，你就了解为什么scalaz中需要有专门的test case来测试这些定律了。</p>\n<p>一般来说我们不太需要关注这些定律的问题，但是如果你需要自己开发一个自己的Monad，那么你就得保证你的Monad符合这些定律，因为这样才能让你的Monad安全地应用在for表达式中。</p>",id:"/volume1/homes/leo/github/my-blog-code/src/pages/2013/Monad.md absPath of file >>> MarkdownRemark",frontmatter:{date:"2013-11-26T07:16:45.000Z",path:"/2013/monad",title:"Monad",excerpt:"函数式语言与OO（确切地讲是指令式编程）的思维方式是完全不同的，很多OO中的经验在函数式语言中不是很匹配，比如设计模式，那就是一个OO中的特定术语，而在FP中，大家常谈的是对于习惯OO思维的程序员来说玄而又玄的Monad。",tags:["scala","functional programming","monad"]}}}}}});
//# sourceMappingURL=path---2013-fold-ebbb4514a888e39627e8.js.map