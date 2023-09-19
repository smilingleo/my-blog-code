webpackJsonp([0x5e6347fb3c40],{438:function(e,n){e.exports={data:{markdownRemark:{html:'<p>经常看到很多示例代码，简洁的让人爱不释手，可是真正自己实现的时候，不得不添加各种各样的异常处理逻辑，最后发现代码总量的80%都是再做异常处理，而真正的代码逻辑只有很少的一部分。</p>\n<p>异常处理对于指令式和函数式编程都是同样需要的，只是因为实现方式的不同，让函数式编程看上去更加简洁，优雅，不需要像指令式那么繁琐。</p>\n<p>本文的目的，就是介绍函数式编程中常用的一些异常处理策略。记得把这些瑞士军刀放到你的百宝箱中，以后一定用得上。</p>\n<h2>空判断Option</h2>\n<p>如果采访100个程序员，让所有人投票他们在编程时最讨厌做的事情，但又经常犯错误的地方，我估计十有八九会是“空判断”了。</p>\n<p><code>Null</code>代表着一个对象还没有被初始化，具体点是对象的指针还没有一个确切的地址。在面向对象编程时，因为操作的都是对象，为了避免在一个<code>null</code>上面调用方法，或者 get一个<code>null</code>上的属性，而导致“空值异常”，程序员不得不做下面的事情：</p>\n<p>假设有下面一个场景：</p>\n<!-- language:uml -->\n<pre><code>Selling --> Store\nSelling --> Product\n</code></pre>\n<p>简单说，一个商场内有很多商店(Store)，每个商店卖(Selling)很多种商品(Product)，如果希望找出所有销售玩具的商店：</p>\n<!-- language:java -->\n<pre><code>public List&#x3C;Store> findByProductCategory(Category category) {\n  if (category == null)               &#x3C;1>\n    return null;\n  List&#x3C;Product> allProducts = getAllProducts(); // DB lookup\n  for (Product prod : allProducts) {\n    if (prod.category == null)        &#x3C;2>\n      continue; \n    if (category.equals(prod.category)){\n    \n</code></pre>\n<h2>参考</h2>\n<ol>\n<li><a href="https://tersesystems.com/2012/12/27/error-handling-in-scala/">Error Handling in Scala. https://tersesystems.com/2012/12/27/error-handling-in-scala. 2012</a></li>\n</ol>',frontmatter:{title:"Scala函数式异常处理",date:"May 04, 2014",path:"/2014/scala-error-handling-in-fp-style",tags:["scala","functional programming","exception handling"],excerpt:"经常看到很多示例代码，简洁的让人爱不释手，可是真正自己实现的时候，不得不添加各种各样的异常处理逻辑，最后发现代码总量的80%都是再做异常处理，而真正的代码逻辑只有很少的一部分。"}}},pathContext:{prev:{html:'<h2>Pull Mysql Docker Image</h2>\n<!-- language: bash -->\n<pre><code>docker pull mysql:5.6\n</code></pre>\n<h2>Create MySQL Config Files</h2>\n<p>For Master, create a <code>mysql.cnf</code> file and add the following content:</p>\n<!-- language: bash -->\n<pre><code>[mysqld]\n\nserver-id = 1\nlog_bin\nbinlog_format = ROW\nbind-address = 0.0.0.0\n\nsql_mode=NO_ENGINE_SUBSTITUTION,STRICT_TRANS_TABLES\n</code></pre>\n<p>For Slave, create another <code>mysql.cnf</code> and add the following content:</p>\n<!-- language: bash -->\n<pre><code>[mysqld]\n\nserver-id = 2\nlog_bin\nbinlog_format = ROW\nbind-address = 0.0.0.0\n\nsql_mode=NO_ENGINE_SUBSTITUTION,STRICT_TRANS_TABLES\n</code></pre>\n<h2>Start Master/Slave MySQL Containers</h2>\n<p>Start Master:</p>\n<!-- language: bash -->\n<pre><code>docker run --name master -v /my/master:/etc/mysql/conf.d -e MYSQL_ROOT_PASSWORD=my-secret-pw -d mysql:5.6\n</code></pre>\n<p>Start Slave:</p>\n<!-- language: bash -->\n<pre><code>docker run --name slave -v /my/slave:/etc/mysql/conf.d -e MYSQL_ROOT_PASSWORD=my-secret-pw --link master:master -d mysql:5.6\n</code></pre>\n<p>The slave node needs to link to master node.</p>\n<h2>Setup Replication</h2>\n<p>Check the master status:</p>\n<!-- language: bash -->\n<pre><code>mysql> show master status \\G\n*************************** 1. row ***************************\n             File: mysql-bin.000003\n         Position: 120\n     Binlog_Do_DB: \n Binlog_Ignore_DB: \nExecuted_Gtid_Set: \n1 row in set (0.00 sec)\n</code></pre>\n<p>the above information is necessary for the slave configuration, especially the <code>File</code> and <code>Position</code>.</p>\n<p>Connect to Slave node, in Mysql Shell:</p>\n<!-- language: bash -->\n<pre><code>mysql> change master to master_host=\'master\',master_user=\'root\',master_password=\'my-secret-pw\',master_log_file=\'mysql-bin.000003\',master_log_pos=120;  \nQuery OK, 0 rows affected (0.00 sec)  \n\nmysql> start slave;\nQuery OK, 0 rows affected (0.01 sec)\n\nmysql> show slave status\\G\n\n// until you see the following two options are \'Yes\'\nSlave_IO_Running: Yes  \nSlave_SQL_Running: Yes  \n</code></pre>\n<p>You need to change the parameters like <code>master_log_file</code> and <code>master_log_pos</code> based on previous <code>show master status</code> output.</p>\n<h2>Test</h2>\n<p>Create some tables and insert some data on master, and check if those data are synced to slave. </p>\n<h2>Change Data Capture (CDC)</h2>\n<p>Here I used an open source library <a href="https://github.com/whitesock/open-replicator">open-replicator</a></p>\n<!-- language: scala -->\n<pre><code>import com.google.code.or._\nimport com.google.code.or.binlog._\nimport com.google.code.or.binlog.impl.event.FormatDescriptionEvent\n\nval or = new OpenReplicator()\nor.setUser("root")\nor.setPassword("my-secret-pw")\nor.setServerId(2);\nor.setHost("slave")\nor.setPort(3306)\nor.setBinlogPosition(120)\nor.setBinlogFileName("mysql-bin.000004")\n\nor.setBinlogEventListener(new BinlogEventListener() {\n  def onEvents(event: BinlogEventV4) = {\n\n  }\n})\n\nor.start()\n</code></pre>\n<p>TBD.\nSee <code>com.linkedin.databus2.producers.ORListener</code></p>\n<h2>References</h2>\n<ol>\n<li><a href="https://registry.hub.docker.com/_/mysql/">Mysql Docker Official Repo</a></li>\n<li><a href="https://github.com/linkedin/databus/wiki/Databus-for-MySQL">Databus for MySQL</a></li>\n</ol>',id:"/volume1/homes/leo/github/my-blog-code/src/pages/2015/Docker创建MySQL主从复制以及CDC测试.md absPath of file >>> MarkdownRemark",frontmatter:{date:"2015-04-21T07:16:45.000Z",path:"/2015/mysql-replication-on-docker",title:"MySQL Master/Slave Replication on Docker",excerpt:"How to setup Mysql master/slave replication.",tags:["docker","mysql"]}},next:{html:'<p>译者按语：很多翻译中将Kind和Type都翻译为“类型”，但实际上两者还是有不同的，本文中，将<code>Kind</code>翻译为“种类”，取王侯将相宁有种乎之意，是骨子里的东西。而将<code>type</code>译为“类型”。</p>\n<p>学习函数式语言如果想真正入门，一个不可避免的话题就是monad/monoid，而这些范畴论中的词汇都异常抽象，难于理解，尤其是对于从java领域转过来的同学，在很多FP的基础东西不了解情况下来研究monad就更加的困难，比如高种泛型。</p>\n<p><code>泛型</code> 我们都知道，就是某种类型的泛化（一般化），就是将某些特殊类型进行抽象，抽出一种一般化的类型<code>T</code>。而<code>高种泛型</code>就是在泛型的基础上再进行一次抽象。</p>\n<ul>\n<li>\n<p>First Order Abstraction</p>\n<p>first-order可以理解为”单次抽象“，将特定类型抽象一次，比如类型：<code>T</code>, <code>T</code>是什么？可以是任何具体类型，String，Integer，Date等等，不难发现，这就是Java中的泛型。</p>\n</li>\n<li>\n<p>Higher Order Abstraction</p>\n<p>对应first-order的单次抽象，高阶抽象就是再次抽象，也就是说：在某个东东的抽象上再进行抽象，抽象的抽象。晕了吧！</p>\n</li>\n</ul>\n<p>在继续之前，我们还得熟悉几个概念：</p>\n<ul>\n<li>\n<p>值构造器</p>\n<p>值构造器是一个function / method，接受特定值参数来构造一个特定的值(value)</p>\n<p>值构造器可以有多态：接受不同类型的参数，也可以是抽象abstract的。</p>\n</li>\n<li>\n<p>类型构造器</p>\n<p>类型构造器是一个类型，接受一个特定类型参数来构造一个特定的类型。</p>\n<p>和值构造器一样，类型构造器也可以有多态，这是高阶类型的关键。</p>\n</li>\n</ul>\n<p>先说这么多概念有什么用呢？我们还是先看一个具体的例子。</p>\n<h2>例子：Iterable</h2>\n<p>观察下面代码，我们来玩个找不同的游戏：</p>\n<!-- language:scala -->\n<pre><code>trait Iterable[T] {\n  def filter(p: T => Boolean): Iterable[T]\n  def remove(p: T => Boolean): Iterable[T] = filter(x => !p(x))\n}\n\ntrait List[T] extends Iterable[T] {\n  def filter(p: T => Boolean): List[T]\n  override def remove(p: T => Boolean): List[T] = filter(x => !p(x))\n}\n</code></pre>\n<p>看到两段代码有什么不同了吗？什么代码重复了？</p>\n<p>很容易发现：在<code>List[T]</code>中的两个方法主体结构和<code>Iterable[T]</code>中的几乎完全相同，只是返回类型不同，都期望返回自身类型。如果我们能够将返回类型也复用，那是否就可以完全去除这些重复代码呢？</p>\n<h3>通过类型构造器多态来去除重复代码</h3>\n<p>看下面代码：</p>\n<!-- language:scala -->\n<pre><code>trait Iterable[T, Container[X]] {\n  def filter(p: T => Boolean): Container[T]\n  def remove(p: T => Boolean): Container[T] = filter(x => !p(x))\n}\n\ntrait List[T] extends Iterable[T, List]\n</code></pre>\n<p>这是怎么做到的？很简单，引入了<strong>类型构造器多态</strong>的概念。上面例子中：<code>Iterable[T, Container[X]]</code>的<code>Iterable</code>是类型构造器，接受两个类型参数，引入多态概念，同样的类型构造器，让其可以接受不同类型的类型参数<code>List</code>。是不是和普通方法多态没什么区别？</p>\n<!-- language:java -->\n<pre><code>public Iterable iterable(T t, Container&#x3C;X> container) { ... }\npublic Iterable iterable(T t, List list) { ... }\n</code></pre>\n<p>因为Java的泛型没有类型构造器多态的概念，所以Java泛型无法解决上述重复代码的问题。最多只能将返回类型设为超类Iterable，然后在调用子类实现时将其强制类型转换为具体子类。</p>\n<p>有了上面的例子为上下文，我们再来看两个概念：</p>\n<h3>类型参数、类型成员</h3>\n<ul>\n<li>\n<p>Type Parameter</p>\n<p>类型参数，比如: <code>List[T]</code>，List具有一个类型参数<code>T</code>。这里的List就是一个类型构造器。List[Int]就是这个类型构造器接受类型参数Int之后构造的具体类型。</p>\n</li>\n<li>\n<p>Type Member</p>\n<p>类型成员，比如：<code>trait List { type T }</code></p>\n<p>这里<code>T</code>变成了一个trait的成员（抽象的）。在List子类实现中，指定其具体类型，比如：<code>List { type T = Int }</code>。而这里的类型成员也可能参数化，比如：<code>type Container[T]</code></p>\n<p>注意：这里的List只用来示意，并不是scala中的List实现。</p>\n</li>\n<li>\n<p>Type Parameter Vs. Type Member</p>\n<p>两者很像，只是作用范围和可见性不同:</p>\n<ul>\n<li>参数类型只是被参数化的类型的一部分（local，private）。</li>\n<li>类型变量就和不同变量一样，被封装在整个body中，可以被继承，显式地引用。</li>\n<li>两者可以相互补充。比如类型成员也可以被参数化。</li>\n</ul>\n</li>\n</ul>\n<h2>改进Iteratable</h2>\n<p>对于集合（collection）来说，很多方法，比如：map, flatMap, filter，各有作用，但是其实这些方法都有以下两个共同点：</p>\n<ol>\n<li>遍历一个集合</li>\n<li>产生一个新的集合</li>\n</ol>\n<p>仔细想想，是不是所有的这些操作都满足呢？</p>\n<ul>\n<li>map遍历一个collection，将其中的元素变形为另外类型并产生一个新的集合。</li>\n<li>flatMap遍历一个集合，将集合中元素转换为一个集合，并最后将“集合的集合”拉平，形成一个新的集合。</li>\n<li>filter遍历一个集合，判断是否符合过滤条件，并返回所有符合过滤条件的新的集合。</li>\n</ul>\n<p>找到共同点，我们就可以将其抽象出来，进而达到复用、减少重复代码的目的。对上面两个共同点，我们可以用Iterator和Builder来进行抽象实现。</p>\n<!-- language:scala -->\n<pre><code>// 产生新集合\ntrait Builder[Container[X], T] {\n  def +=(ele: T): Unit\n  def finalise(): Container[X]\n}\n// 遍历（迭代）器\ntrait Iterator[T] {\n  def next(): T\n  def hasNext(): Boolean\n  def foreach(op: T => Unit): Unit = {\n    while(hasNext()) { op(next()) }\n  }\n}\n</code></pre>\n<p>有了这两点抽象，那我们就可以对Iteratable进行改进：</p>\n<!-- language:scala -->\n<pre><code>// 类型参数Container\ntrait Buildable[Container[X]] {\n  // build方法只是返回一个Builder\n  def build[T]: Builder[Container[X], T]\n}\n\n// Iteratable没有类型参数Container\ntrait Iteratable[T] {\n  // 类型成员Container\n  type Container[X] &#x3C;: Iteratable[X]\n  def elements: Iterator[T]\n  \n  def mapTo[U, C[X]](f: T => U)(b: Buildable[C]): C[U] = {\n    val buff = b.build[U]\n    val elems = elements\n    while(elems.hasNext) {\n      buff += f(elems.next)\n    }\n    buff.finalise\n  }\n  \n  def filterTo[C[X]](f: T => Boolean)(b: Buildable[C]): C[T] = {\n    val buff = build[T]\n    val elems = elements\n    while(elems.hasNext) {\n      val elem = elems.next\n      if (f(elem)) buff += elem\n    }\n    buff.finalise\n  }\n  \n  def flatMapTo[U, C[X]](f: T => Iterable[U])(b: Buildable[C]): C[U] = {\n    val buff = build[U]\n    val elems = elements\n    while(elems.hasNext) {\n      f(elems.next).elements.foreach(buff += _)\n    }\n    buff.finalise\n  }\n  \n  def map[U](f: T => U)(b: Buildable[Container]): Container[U] = mapTo[U, Container](f)(b)\n  \n  def filterTo(f: T => Boolean)(b: Buildable[Container]) : Container[T] =\n    filterTo[Container](f)(b)\n  \n  def flatMap[U](f: T => Iteratable[U])(b: Buildable[Container]): Container[U] = \n    flatMapTo[U, Container](f, b)\n    \n}\n</code></pre>\n<p>上面的代码中，我们用<code>Buildable</code>和<code>Iterator</code>将前文提到的两个共同点进行抽象，并在<code>Iteratable</code>的实现中，利用这两个抽象：Curried的参数<code>b: Buildable[C]</code>以及<code>def elements: Iterator[T]</code>抽象方法，分别实现了：<code>map</code>, <code>filter</code>, <code>flatMap</code>。</p>\n<p>而Iteratable的具体实现，只需要具化上面两个抽象就可以了。比如List的实现：</p>\n<!-- language:scala -->\n<pre><code>object ListBuildable extends Buildable[List] {\n  def build[T]: Builder[List, T] = new ListBuffer[T] with Builder[List, T]() {\n    // `+=` 是scala标准库中ListBuffer的方法\n    def finalise(): List[T] = toList\n  }\n}\n\nclass List[T] extends Iteratable[T] {\n  type Container[X] = List[X]\n  def elements: Iterator[T] = new Iterator {\n    ......\n  }\n}\n</code></pre>\n<p>有了上面的实现，我们就可以利用scala的另外一个机制：implicit来实现根据类型来自动选择匹配的<code>Buildable</code>了。</p>\n<h3>Scala标准库实现</h3>\n<p>掌握上面的思想，我们回头再看scala标准库中collection的实现机制，就很容易理解了。scala的collection架构正是基于<code>builders</code>和<code>traversals</code>思想实现的。</p>\n<!-- language:scala -->\n<pre><code>package scala.collection.mutable\nclass Builder[-Elem, +To] {\n  def +=(elem: Elem): this.type\n  def result(): To\n  def clear(): Unit\n  def mapResult[NewTo](f: To => NewTo): Builder[Elem, NewTo] = ...\n}\n</code></pre>\n<p>可以看出上面的<code>result</code>方法就是：我们例子中的<code>finalise</code>，此外多了<code>clear</code>, <code>mapResult</code>两个方法。</p>\n<p>再看看<code>Buildable</code>的实现：</p>\n<!-- language:scala -->\n<pre><code>package scala.collection.generic\ntrait CanBuildFrom[-From, -Elem, +To] {\n  // Creates a new builder \n  def apply(from: From): Builder[Elem, To] \n}\n</code></pre>\n<p>在scala中，换了个名字：<code>CanBuildFrom</code>，感觉会更贴切一些（不过从dual的角度就感觉不那么好了）。</p>\n<p>上面的<code>apply</code>就是<code>build</code>只是多了一个参数。</p>\n<p>再来看<code>Iteratable</code>:</p>\n<!-- language:scala -->\n<pre><code>package scala.collection\nclass TraversableLike[+Elem, +Repr] {\n  def newBuilder: Builder[Elem, Repr] // deferred\n  def foreach[U](f: Elem => U)        // deferred\n          ...\n  def filter(p: Elem => Boolean): Repr = {\n    val b = newBuilder\n    foreach { elem => if (p(elem)) b += elem }\n    b.result\n  } \n}\n</code></pre>\n<h3>类型参数 vs. 类型成员</h3>\n<p>在上面的例子中，我们同时使用了类型参数和类型成员。</p>\n<ul>\n<li>Buildable的主要目的是构建某种类型的Container，因此使用类型参数将其显式地暴露给客户端。</li>\n<li>对于Iterable，用户更关心的是其中包含的元素类型，而不是容器(Iterable本身就类似个容器了)，所以我们采用类型成员。</li>\n</ul>\n<h2>关于类型(Type)和种类(Kind)</h2>\n<p>其实中文“类型”在这里很混淆，将英文中的两个词type、kind都翻译为“类型”了，其实是有差别的，我们这里将type翻译为"类型"，kind翻译为"种类"。</p>\n<p>值、特定类型和种类的关系可以从下图中得到解答。</p>\n<p><img src="http://i.stack.imgur.com/K0dwL.jpg" alt="values, types and kinds的关系图"></p>\n<ul>\n<li>特定类型是对某种特定类型的值进行分类，比如Int是对1，2，3，4等值的分类，1，2，3是值，Int是Type(类型)。</li>\n<li>种类是对特定类型的归类，比如对Int, String, List[Int]等类型，我们进行高阶抽象，可以认为这些特定类型都是相同种类的，可以用<code>*</code>来描述。这里<code>*</code>不是用来描述任意值的，而是<em>任意一个特定类型</em>。</li>\n<li>种类<code>K</code>可以是<code>*</code> (看下面定义)，也可以是<code>K → K</code>，其中<code>→</code>是<em>种类构造器</em>，用来构造一个<strong>用于归纳类型构造器的种类</strong>，绕口吧，简单地说就是<code>K → K</code>接受一个种类参数，返回一个新的种类.</li>\n</ul>\n<h3>Kind的定义</h3>\n<pre><code>Kind ::= \'*(\' Type \',\' Type \')\' | [id \'@\' ] Kind \'→\' Kind\n</code></pre>\n<p><code>*(T, U)</code>种类中<code>T</code>用来描述类型下边界(lower bound)，<code>U</code>为类型上边界(upper bound)。在Scala中，最低边界是<code>Nothing</code>因为它使一切类型的子类，最高边界是<code>Any</code>，它使所有类型的超类。因为我们经常使用upper bound, 所以，我们用<code>*(Nothing, U)</code>，简化为<code>*(U)</code>来描述一个种类，特别地，<code>*(Nothing, Any)</code>可以简化为<code>*</code>。</p>\n<p>上文的几个例子：</p>\n<table>\n<thead>\n<tr>\n<th align="center">Scala 类型定义</th>\n<th align="center">Kind 定义</th>\n</tr>\n</thead>\n<tbody>\n<tr>\n<td align="center">Container\n[\nX\n]</td>\n<td align="center">*\n → \n*</td>\n</tr>\n<tr>\n<td align="center">Pair\n[\nT, U\n]</td>\n<td align="center">*\n → \n*\n → \n*</td>\n</tr>\n<tr>\n<td align="center">Container\n[\nX\n]\n &#x3C;: Iterable\n[\nX\n]</td>\n<td align="center">X @ \n*\n → \n*\n(Iterable\n[\nX\n]\n)</td>\n</tr>\n<tr>\n<td align="center">C[X &#x3C;: Ordered\n[\nX\n]\n] &#x3C;: Iterable\n[\nX\n]</td>\n<td align="center">X @ \n*\n(Ordered\n[\nX\n]\n) → \n*\n(Iterable\n[\nX\n]\n)</td>\n</tr>\n</tbody>\n</table>\n<p>有了Kind定义，我们就可以通过其进行Kind推导，比如<code>T</code>的种类是<code>X @ K → K\'</code>，如果<code>U</code>的Kind是<code>K</code>，那么很简单的通过替换，我们就可以知道<code>T[U]</code>的Kind是<code>K\'</code>。</p>\n<h3>子种类Subkinding</h3>\n<p>scala中，我们通过<code>&#x3C;:</code>或者<code>>:</code>来表述两个类型（type）之间的关系。比如：<code>Int &#x3C;: Number</code>。</p>\n<p>对于种类，我们可以重载<code>&#x3C;:</code> and <code>>:</code>，用来描述两个种类之间的关系。比如：<code>*(T, U) &#x3C;: *(T\', U\')</code>，当且仅当：<code>T\' &#x3C;: T</code> AND <code>U &#x3C;: U\'</code>时上述关系成立。这个相对容易理解，因为<code>T</code>/<code>T\'</code>是类型参数，和方法参数一样，是逆变(contravariance)的。</p>\n<p>scala编译器正是通过应用这些规则来进行type/kind检查的。比如，scala编译器将对下面代码报错：</p>\n<!-- language:scala run -->\n<pre><code>class Iterable[Container[X], T]\ntrait NumericList[T &#x3C;: Number] extends Iterable[NumericList, T]\n</code></pre>\n<p>你可以点击<code>run</code>按钮试试，看看编译会出现什么结果。</p>\n<p>之所以报错，是因为<code>Iterable[NumericList, T]</code>的问题。我们可以应用上面学到的subkinding来分析一下。</p>\n<p><code>NumericList[T &#x3C;: Number]</code>的种类是：<code>*(Number) → *</code>，很显然，它必须是<code>Iterable</code>的第一个类型参数<code>NumericList</code>的子种类， 也就是：<code>*(Number) → * &#x3C;: * → *</code>。在<code>→</code>左边的是种类参数，是逆变的(contravariant)，所以这里我们需要：<code>* &#x3C;: *(Number)</code>，但是这显然是不成立的。所以scala编译器会报错：<code>type T\'s bounds &#x3C;: Number are stricter than type X\'s declared bounds >: Nothing &#x3C;: Any</code>。</p>\n<p>OK then, how to make it work ? 我们需要引入一个新的类型参数：Bound</p>\n<!-- language:scala run -->\n<pre><code>class Iterable[Container[X &#x3C;: Bound], T &#x3C;: Bound, Bound]\ntrait NumericList[T &#x3C;: Number] extends Iterable[NumericList, T, Number]\n</code></pre>\n<p><code>Iterable[Container[X &#x3C;: Bound], T &#x3C;: Bound, Bound]</code>的种类是：<code>*(Bound) → * → *(Bound) → * → *</code></p>\n<p><code>NumericList[T &#x3C;: Number]</code>的种类是：<code>*(Number) → *</code>，该种类必须是<code>Iterable</code>第一个参数的子种类，也就是：<code>*(Number) → * &#x3C;: *(Bound) → *</code>，而<code>Bound</code>已经指定为<code>Number</code>，经过替换，就有了：<code>*(Number) → * &#x3C;: *(Number) → *</code>，左右两边相同，自然是满足要求了。</p>\n<h3>高种类型</h3>\n<p>如果你使用scala 2.11.x版本，在REPL中，就可以通过<code>:type</code>来查看一个类型的种类（Kind）了。比如：</p>\n<!-- language:scala run -->\n<pre><code>scala> :kind -v List\nscala.collection.immutable.List\'s kind is F[+A]\n* -(+)-> *\nThis is a type constructor: a 1st-order-kinded type.\n\nscala> :kind -v Pair[_, _]\nscala.Tuple2\'s kind is F[+A1,+A2]\n* -(+)-> * -(+)-> *\nThis is a type constructor: a 1st-order-kinded type.\n</code></pre>\n<p>可以看到，两者的类型一个是：<code>* → *</code> 另外一个是 <code>* → * → *</code>，而且，两个都是：<code>1st-order-kinded type</code>。那怎么才算是一个<code>higher order kinded type</code>呢？</p>\n<p>在上面的图中:<code>Functor[List]</code>是<code>higher order kinded type</code>: <code>(* → *) → *</code>，这个和<code>Pair[_, _]</code>的<code>* → * → *</code>相比，不就多了个括号吗？玄机就再这个括号上：<code>(* → *) → *</code>表示你接受一个一阶类型* → *，然后产生一个最终的类型。类型的类型，所以是高阶类型。</p>\n<h2>Implicit机制</h2>\n<p><code>implicit</code>是scala中一个很强大的东西，其主要出发点是“偷懒”，没错，就是偷懒，让程序员可以偷懒，将本来应该码农干的活交给“编译器”完成。</p>\n<p>implicit能帮我们码农的有两个地方：隐式参数和隐式转换。</p>\n<h3>隐式参数</h3>\n<p>具体来说，就是你可以将一个方法调用的参数（显式注为implicit）省略掉，编译器会在当前上下文中找能用于补充缺失掉参数的值，如果能找到，就自动填充，找不到就会在编译时报错。比如下面例子：</p>\n<!-- language:scala run -->\n<pre><code>def foo[T](t: T)(implicit integral: Integral[T]) = { println(integral) }\nfoo(1)\n</code></pre>\n<p>注意<code>foo(1)</code>中只提供了第一个参数，一个<code>Int</code>值，但是第二个参数被省略了，scala编译器就会查找当前scope中有没有类型为<code>Integral[Int]</code>的<code>implicit</code>值。很幸运，scala.math.Numeric中定义了<code>implicit object IntIsIntegral extends IntIsIntegral with Ordering.IntOrdering</code>，所以编译器会找到<code>IntIsIntegral</code>对象然后自动补充第二个参数。</p>\n<p>那我们再试一下<code>foo(1.0)</code>，这个时候，编译器会报错。为什么呢？查查scala.math.Numeric源码，我们就会发现：scala为Double提供了implicit Fractional对象，make sense，double不是整数嘛。同时scala还是提供了一个对象<code>DoubleAsIfIntegral</code>，但并没有标记为<code>implicit</code>，所以编译器找不到。了解了原因，简单做如下改动：</p>\n<!-- language:scala run -->\n<pre><code>def foo[T](t: T)(implicit integral: Integral[T]) = { println(integral) }\nfoo(1)\nimplicit val doubleAsIfIntegral = scala.math.Numeric.DoubleAsIfIntegral\nfoo(1.0)\n</code></pre>\n<p>现在大家都happy了。</p>\n<p>你可以通过<code>implicitly[Integral[Double]]</code>来自行查找是否有符合条件的隐式参数。</p>\n<h3>隐式转换</h3>\n<p>implicit的另外一个作用是隐式转换，同样也是帮助码农的。具体讲，就是当你在调用某个方法在某个对象上的时候，如果这个对象的类A并没有定义这个方法，scala的编译器先不会报错，会尝试着在当前scope中查找：</p>\n<ol>\n<li>具有该方法定义的类型 B</li>\n<li>能够将A转换为B的转换器</li>\n</ol>\n<p>如果能找到，那么scala将自动进行上述转换，找不到，报错。例如：</p>\n<!-- language:scala -->\n<pre><code>"123".map(_.toInt)\n</code></pre>\n<p><code>"123"</code>是一个<code>java.lang.String</code>类型，String上并没有定义<code>map</code>方法，但是编译器也没有报错，而且顺利执行了。这就是隐式转换：scala编译器会在上下文中找到<code>implicit def augmentString(x: String): StringOps = new StringOps(x)</code>，可以将<code>String</code>转换为有<code>map</code>定义的<code>StringOps</code>。</p>\n<p>你可以通过<code>implicitly[String => StringOps]</code>进行自行查找符合条件的转换器。</p>\n<p>基于隐式参数和隐式转换，在Scala的类型系统中，有两个语法糖：view bound (CC &#x3C;% Seq[T]) 和 context bound (T : Integral)。</p>\n<h3>View Bounds</h3>\n<p>说实话不知道这个翻译为什么好，在微博上和几位国内scala大牛们探讨过，一些人认为应该直译为：“视界”，我自己倒是觉得应该叫“化界”？因为：</p>\n<ol>\n<li>“视界”，可见到的边界，太笼统，含义模糊，“化界”顾名思义，可“转化到的边界”</li>\n<li>化界听上去比较炫，像是玄幻小说中很高深的境界，^_^</li>\n</ol>\n<p>You can think of <code>T &#x3C;% Ordered[T]</code> as saying, “I can use any T, so long as T can be treated as an Ordered[T].” This is different from saying that T is an Ordered[T], which is what an upper bound, <code>T &#x3C;: Ordered[T]</code>, would say.</p>\n<p>有时候隐式参数和隐式转换可以同时存在、起作用，比如下面代码：</p>\n<!-- language:scala run -->\n<pre><code>def getIndex[T, CC](seq: CC, value: T)(implicit converter: CC => Seq[T]) = seq.indexOf(value)\n\ngetIndex("abcde", \'c\')\ngetIndex(List(1,3,2,5), 3)\n</code></pre>\n<p>上面代码中<code>CC</code>可以是任何能转换为<code>Seq</code>的类型，所以<code>String</code>和<code>List</code>都可以应用。</p>\n<p>首先，<code>converter</code>是一个隐式参数，其次，因为<code>seq</code>对象的类型是<code>CC</code>，其上面并没有定义<code>indexOf</code>方法，所以“隐式转换”介入。</p>\n<p>事实上，这个用法非常普遍，所以scala专门为其提供了一个语法糖：view bound <code>CC &#x3C;% Seq[T]</code>，重写上面代码：</p>\n<!-- language:scala run -->\n<pre><code>def getIndex[T, CC &#x3C;% Seq[T]](seq: CC, value: T) = seq.indexOf(value)\n</code></pre>\n<p>运行上面代码，你可以从输出看到scala编译器会将方法重新定义为：<code>getIndex: [T, CC](list: CC, value: T)(implicit evidence$1: CC => Seq[T])Int</code>，和第一种方法一样。</p>\n<h3>Context Bounds</h3>\n<p>再看下面一个例子：</p>\n<!-- language:scala run -->\n<pre><code>def sum[T](list: List[T])(implicit integral: Integral[T]): T = {\n    import integral._   // get the implicits in question into scope\n    list.foldLeft(integral.zero)(_ + _)\n}\n</code></pre>\n<p>这里有一个隐式参数<code>integral</code>类型为<code>Integral[T]</code>，如果方法传入<code>Int</code>，那么scala编译器就会找<code>implicitly[Integral[Int]]</code>，这个我们在隐式参数小节已经说过了。</p>\n<p>这里主要关注另外一个问题：<code>list.foldLeft(integral.zero)(_ + _)</code>，其中<code>_</code>的类型应该是<code>T</code>，但是<code>T</code>上面有定义<code>+</code>方法吗？我们先把<code>import integral._</code>去掉，就会发现编译出错：</p>\n<!-- language:scala -->\n<pre><code>&#x3C;console>:8: error: type mismatch;\n found   : T\n required: String\n           list.foldLeft(integral.zero)(_ + _)\n                                        ^\n</code></pre>\n<p>原来scala编译器尝试着将<code>T</code>转换为<code>String</code>了，这里应该是<code>Predef.any2string</code>起了作用。</p>\n<p>加上<code>import integral._</code>，一切工作了。</p>\n<p>回头想一下，其实挺有意思的：我们给一个泛型<code>T</code>动态地添加了<code>+</code>方法，但是并不改变<code>T</code>的代码。而这就是context bound的意义。</p>\n<p>这个在流行框架<code>Scalaz</code>中应用非常广泛。scala同样为其创建了专门的语法糖：<code>[T : Ordering]</code>。采用语法糖，这个例子可以重写为：</p>\n<!-- language:scala run -->\n<pre><code>def sum[T : Integral](list: List[T]): T = {\n  val integral = implicitly[Integral[T]]\n  import integral._\n  list.foldLeft(integral.zero)(_ + _)\n}\n</code></pre>\n<p>编译器编译之后，会生成一个<code>sum: [T](list: List[T])(implicit evidence$1: Integral[T])T</code>的方法。</p>\n<p>这里有点让人confusing的地方是：<code>T: Integral</code>的写法感觉像是说：<code>T</code>是<code>Integral</code>的类型，就像：<code>m: T</code>，可实际上应该认为是：<code>T</code>在<code>Integral</code>的<code>Context</code>中。</p>\n<h2>结束语</h2>\n<p>scala的类型系统确实是一个难点，但同时也是要真正掌握scala语言所必须的知识点。很多概念都很晦涩，对于像我们这些凡人，要想掌握没有太好的办法，只能多看、多练、多想。</p>\n<h2>参考</h2>\n<ol>\n<li><a href="http://stackoverflow.com/questions/6246719/what-is-a-higher-kinded-type-in-scala">Adriaan Moors. What is a higher kinded type in scala. StackOverflow. http://stackoverflow.com/questions/6246719/what-is-a-higher-kinded-type-in-scala. 2011</a></li>\n<li><a href="http://docs.scala-lang.org/overviews/core/architecture-of-scala-collections.html">Martin Odersky and Lex Spoon. Architecture of Scala Collection. scala-lang website. http://docs.scala-lang.org/overviews/core/architecture-of-scala-collections.html. 2013</a></li>\n<li><a href="http://stackoverflow.com/questions/5598085/where-does-scala-look-for-implicits">Daniel C. Sobral. Types of Implicits. StackOverflow. http://stackoverflow.com/questions/5598085/where-does-scala-look-for-implicits. 2011</a></li>\n<li><a href="http://blogs.atlassian.com/2013/09/scala-types-of-a-higher-kind/">Jed Wesley-Smith. Scala Types Of a Higher Kind. http://blogs.atlassian.com/2013/09/scala-types-of-a-higher-kind/</a></li>\n</ol>',id:"/volume1/homes/leo/github/my-blog-code/src/pages/2014/高种泛型.md absPath of file >>> MarkdownRemark",frontmatter:{date:"2014-01-08T19:16:45.000Z",path:"/2014/generics-of-a-higher-kind",title:"高种泛型 (Generics of a Higher Kind)",excerpt:"Generics of a Higher Kind翻译加自我理解。",tags:["scala","functional programming","Generics"]}}}}}});
//# sourceMappingURL=path---2014-scala-error-handling-in-fp-style-1576515909d51eb6952b.js.map