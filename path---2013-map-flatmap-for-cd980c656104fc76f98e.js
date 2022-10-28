webpackJsonp([0xc9d5d800bac0],{349:function(e,n){e.exports={data:{markdownRemark:{html:'<p>前文说过了，高阶函数式函数式语言中的基石，而<code>map</code>, <code>flatMap</code>更是重要。</p>\n<p>对于map，就是一个空间转换的概念，从这个空间映射到另外一个空间：</p>\n<ul>\n<li>必须是一一对应的，也就是这个空间的一个点也需要映射到另外一个空间的一个点。</li>\n</ul>\n<p>对于flatMap，一种理解是map + flatten，但是我觉得这种理解不好，应为在FP中，flatMap远比map重要。</p>\n<p>而map、flatMap加上withFilter和foreach实现了scala中最强大的for表达式。</p>\n<p>其实叫for表达式不准确，英文是有两种称谓：</p>\n<ul>\n<li>\n<p>for comprehension</p>\n<p>for {\nx &#x3C;- e1\ny &#x3C;- e2\n} yield e</p>\n<p>comprehension的含义是“理解力”，人如其名，这个表达式也有很强大的理解力。看文本文希望能够对这个方面有所帮助。</p>\n</li>\n<li>\n<p>for loop</p>\n</li>\n</ul>\n<pre><code>for {\n    i &#x3C;- e1\n} {\n    // do something.\n}\n</code></pre>\n<p>本文这里套用Martin在"Reactive Programming"中的例子，对如何应用map, flatMap, for表达式做个简单介绍。</p>\n<h2>例子</h2>\n<p>这个例子中，我们需要实现一个随机生成器，能够随机生成：Int, Boolean, Pair, List, Tree</p>\n<h2>实现</h2>\n<h3>规约定义</h3>\n<p>先定义一个Generator类，里面主要的方法就是一个<code>generate</code>，返回一个T</p>\n<!-- language:lang-scala -->\n<pre><code>trait Generator[T] { self =>\n  def generate : T\n}\n</code></pre>\n<h3>随机整数生成器</h3>\n<p>我们来实现一个随机整数生成器。</p>\n<!-- language:lang-scala -->\n<pre><code>val integers = new Generator[Int] {\n  def generate = {\n    val r = new java.util.Random\n    r.nextInt\n  }\n}\n</code></pre>\n<h3>随机布尔值生成器</h3>\n<p>再生成一个布尔值随机生成器。</p>\n<!-- language:lang-scala -->\n<pre><code>val booleans = new Generator[Boolean] {\n  def generate = {\n    val r = new java.util.Random\n    r.nextInt >= 0\n  }\n}\n</code></pre>\n<p>现在问题来了，上面的代码有两个问题：</p>\n<p>1.代码重复\n<code>val r = new java.util.Random ; r.nextInt</code>出现了两次</p>\n<p>2.有boilerplate代码，<code>new Generator[Boolean]</code>, <code>def generate</code>等等\n理想的情况应该是这样的：</p>\n<!-- language:lang-scala -->\n<pre><code>val booleans = for (i &#x3C;- integers) yield i > 0\n</code></pre>\n<p>但是如果你在REPL中尝试的话，会发现报错：</p>\n<!-- language:lang-scala -->\n<pre><code>scala> val boolean = for (i &#x3C;- integers) yield i >= 0\n&#x3C;console>:9: error: value map is not a member of Generator[Int]\n       val boolean = for (i &#x3C;- integers) yield i >= 0\n</code></pre>\n<p>OK, 因为for表达式就是对<code>map</code>, <code>flatMap</code>的简化，上面的代码会被翻译为：</p>\n<!-- language:lang-scala -->\n<pre><code>integers map { i => i > 0 }\n</code></pre>\n<p>我们没有在Generator中定义map，所以报错是必然的。修改一下：</p>\n<!-- language:lang-scala run -->\n<pre><code>trait Generator[T] { self =>\n  def generate : T\n\n  def map[S](f: T => S): Generator[S] = new Generator[S] {\n    def generate = f(self.generate)\n  }\n}\nval integers = new Generator[Int] {\n  def generate = {\n    val r = new java.util.Random\n    r.nextInt\n  }\n}\n\nval booleans = for (i &#x3C;- integers) yield i >= 0\nbooleans.generate\n</code></pre>\n<p>点击<code>run</code>按钮试试，一切顺利！不错。</p>\n<h3>随机Pair生成器</h3>\n<p>我们再继续，来点难点的，来个随机<code>(Int, Int)</code>生成器，想一下，很简单，调用两次<code>integers.generate</code>就可以了。</p>\n<!-- language:lang-scala -->\n<pre><code>val pairs = new Generator[(Int, Int)] {\n  def generate = (integers.generate, integers.generate)\n}\n</code></pre>\n<p>同样的，我们不希望有boilerplate代码，每次new一个匿名类，还要重新定义<code>generate</code>，这是java中的无奈之举，对于scala来说，我们希望这么写：</p>\n<!-- language:lang-scala -->\n<pre><code>val pairs = for {\n  x &#x3C;- integers\n  y &#x3C;- integers\n} yield (x, y)\n</code></pre>\n<p>但是当你试运行一下的时候会出现：</p>\n<pre><code>scala> val pairs = for (x &#x3C;- integers ; y &#x3C;- integers) yield (x, y)\n&#x3C;console>:9: error: value flatMap is not a member of Generator[Int]\n       val pairs = for (x &#x3C;- integers ; y &#x3C;- integers) yield (x, y)\n</code></pre>\n<p>编译器抱怨说没有flatMap定义在Generator上，怎么回事？</p>\n<p>同理，我们需要了解for表达式的翻译机理，上面的代码会背翻译为：</p>\n<!-- language:lang-scala -->\n<pre><code>integers flatMap { x => integers map { (x, _) }}\n</code></pre>\n<p>我们没有实现flatMap当然会出现这样的错误。好吧，我们来增强一下：</p>\n<!-- language:lang-scala run -->\n<pre><code>trait Generator[T] { self =>\n  def generate : T\n\n  def map[S](f: T => S): Generator[S] = new Generator[S] {\n    def generate = f(self.generate)\n  }\n\n  def flatMap[S](f: T => Generator[S]): Generator[S] = new Generator[S] {\n    def generate = f(self.generate).generate\n  }\n}\n\nval integers = new Generator[Int] {\n  def generate = {\n    val r = new java.util.Random\n    r.nextInt\n  }\n}\n\nval pairs = for {\n  x &#x3C;- integers\n  y &#x3C;- integers\n} yield (x, y)\n\npairs.generate\npairs.generate\n</code></pre>\n<p>不错吧，everything just works like a charm. </p>\n<p>我们还可以定义一些小工具，比如：</p>\n<!-- language:lang-scala -->\n<pre><code>def single[T](s: T) = new Generator[T] {\n  def generate = s\n}\n\ndef choose(from: Int, to: Int) = for { i &#x3C;- integers } yield (from + Math.abs(i) % (to - from))\n\ndef oneOf[T](choices: T*) = for ( idx &#x3C;- choose(0, choices.length) ) yield choices(idx)\n</code></pre>\n<p>看到OO中策略模式的影子了吗？</p>\n<h3>List[Int]生成器</h3>\n<!-- language:lang-scala -->\n<pre><code>def nonEmptyList = for {\n  head &#x3C;- integers\n  tail &#x3C;- lists\n} yield (head :: tail)\n\nval lists: Generator[List[Int]] = for {\n  isEmpty &#x3C;- oneOf(true, false, false, false, false)\n  list &#x3C;- if (isEmpty) single(Nil) else nonEmptyList\n} yield list\n</code></pre>\n<h3>Tree生成器</h3>\n<!-- language:lang-scala -->\n<pre><code>trait Tree\ncase class Node(left: Tree, right: Tree) extends Tree\ncase class Leaf(x: Int) extends Tree\n\ndef leafs: Generator[Leaf] = for ( i &#x3C;- integers ) yield Leaf(i)\n\n//不是尾递归，很容易StackOverflow\ndef nodes: Generator[Node] = for {\n  left &#x3C;- trees\n  right &#x3C;- trees\n} yield Node(left, right)\n\ndef trees: Generator[Tree] = for {\n  isLeaf &#x3C;- booleans\n  tree &#x3C;- if (isLeaf) leafs else nodes\n} yield tree\n</code></pre>\n<p>上面的代码因为用了递归，而且不是尾递归，很容易stackoverflow，一种workaround是增大<code>isLeaf</code>的概率，比如用<code>oneOf(true, true, true, false, false)</code>来替换<code>booleans</code>，这样就有2/3的概率为leaf，退出递归，但是还是很容易出错。下面用指令式的方式来实现以下：</p>\n<!-- language:lang-scala -->\n<pre><code>// 先根据深度，生成所有的叶子\nprivate def leafs(depth: Int): List[Option[Leaf]] = (Math.pow(2, depth - 1).toInt to 1 by -2).toList.foldLeft(List[Option[Leaf]]()) { (acc, ele) =>\n  val isLuck = booleans.generate\n  if (isLuck)\n    Some(Leaf(integers.generate)) :: Some(Leaf(integers.generate)) :: acc\n  else\n    None :: None :: acc\n}\n//依次聚集\nprivate def aggregate(children: List[Option[Tree]]): List[Option[Tree]] = {\n  if (children.length == 1) \n    children\n  else {\n    val length = children.length        \n    val parents = (length to 1 by -2).toList map { i => (children(i - 1), children(i - 2)) match {\n        case (Some(l), Some(r)) => Some(Node(l, r))\n        case (Some(l), None) => Some(Node(l, Leaf(integers.generate)))\n        case (None, Some(r)) => Some(Node(Leaf(integers.generate), r))\n        case (None, None) => Some(Leaf(integers.generate))\n      }\n    }\n    aggregate(parents)\n  }\n}\n\ndef generateTree(depth: Int) = aggregate(leafs(depth))(0).get\n</code></pre>\n<p>总的思路是：先根据深度生成可能的叶子，然后两两聚集为上一层的父节点，然后递归直到根节点。</p>\n<p>这个实现里同样没有用<code>可变量</code>。</p>\n<h4>Bonus: 打印tree</h4>\n<p>TBD</p>\n<h2>关于for表达式</h2>\n<p>如果你平常用for的场合都是在用一些collection的话，会产生一种错觉，以为for表达式智能应用在collection中，其实for表达式可以应用在任何定义了map/flatMap/withFilter/foreach的类型中，正如你在本文中看到的，那么一个问题是：</p>\n<!-- language:lang-scala -->\n<pre><code>val booleans = for ( x &#x3C;- integers ) yield x >= 0\n</code></pre>\n<p><code>booleans</code>的类型应该是什么呢？</p>\n<p>如果你经常用for于collection，你可能会觉得是一个List[Boolean]，其实不是，真正的返回值是：<code>Generator[Boolean]</code>，因为for表达式知道<code>integers</code>的类型是Generator所以其返回值也是Generator，这就是for comprehension的含义是“理解力”，人如其名，这个表达式也有很强大的理解力。看文本文希望能够对这个方面有所帮助。</p>\n<p>那么是如何实现的呢？其实很简单，将for表达式翻译为map你就知道其中玄机了。</p>\n<!-- language:lang-scala -->\n<pre><code>val booleans = for ( x &#x3C;- integers ) yield x >= 0 = integers map { _ >= 0 }\n</code></pre>',frontmatter:{title:"map/flatMap/for in Action",date:"December 01, 2013",path:"/2013/map-flatmap-for",tags:["scala","functional programming"],excerpt:"前文说过了，高阶函数式函数式语言中的基石，而`map`, `flatMap`更是重要。"}}},pathContext:{slug:"/2013/map-flatmap-for"}}}});
//# sourceMappingURL=path---2013-map-flatmap-for-cd980c656104fc76f98e.js.map