webpackJsonp([17976388717192],{442:function(e,n){e.exports={pathContext:{posts:[{html:'<p>根据Egghead上的教程，做出的博客站点有个缺陷，那就是没有分页功能，对于勤奋的博主来说，在一个页面上显示所有文章列表有点不完美，这里我们改造一下，加入分页功能。</p>\n<h2>步骤</h2>\n<ol>\n<li>引入<code>gatsby-paginate</code>组件</li>\n</ol>\n<pre><code class="language-bash">yarn add gatsby-paginate\n</code></pre>\n<ol start="2">\n<li>增加一个分页链接组件</li>\n</ol>\n<!-- language: lang-js -->\n<pre><code>import React from \'react\'\nimport Link from \'gatsby-link\'\n\nconst PaginateLink = ({ tag, url, text }) => {\n    if (!tag) {\n        return &#x3C;span>&#x3C;Link to={ url }>{ text }&#x3C;/Link>&#x3C;/span>\n    } else {\n        return &#x3C;span>{ text }&#x3C;/span>\n    }\n}\n\nexport default PaginateLink\n</code></pre>\n<ol start="3">\n<li><code>mv pages/index.js templates/</code> 然后编辑</li>\n</ol>\n<!-- language: lang-js -->\n<pre><code>import React from \'react\'\nimport Link from \'gatsby-link\'\n+import PaginateLink from \'./paginateLink\'\n+\n+const IndexPage = ({ data, pathContext }) => {\n+  // for pagination\n+  const { group, index, first, last } = pathContext;\n+  const prevUrl = index - 1 == 1 ? "" : (index - 1).toString();\n+  const nextUrl = (index + 1).toString();\n+  const total = data.allMarkdownRemark.edges.length;\n\n-const IndexPage = ({ data }) => {\nconst { edges: posts } = data.allMarkdownRemark\nreturn (\n    &#x3C;div>\n-      {posts.map(({ node: post }, pIdx) => {\n+      &#x3C;div className="posts">\n+      {group.map(({ node: post }, pIdx) => {\n        const { frontmatter } = post\n-        \n+\n        return (\n        &#x3C;div key={`post_${pIdx}`}>\n            &#x3C;h2>\n@@ -27,6 +35,18 @@ const IndexPage = ({ data }) => {\n        &#x3C;/div>\n        )\n    })}\n+      &#x3C;/div>\n+      &#x3C;div className="paginatation">\n+        &#x3C;div className="prevLink">\n+            &#x3C;PaginateLink tag={ first } url={ prevUrl } text="Prev Page" />\n+        &#x3C;/div>\n+\n+        &#x3C;p>{index} of { Math.ceil(total/12)}&#x3C;/p>\n+\n+        &#x3C;div className="nextLink">\n+            &#x3C;PaginateLink tag={ last } url={ nextUrl } text="Next Page" />\n+        &#x3C;/div>\n+      &#x3C;/div>      \n    &#x3C;/div>\n)\n}\n</code></pre>\n<ol start="4">\n<li>编辑<code>gatsby-node.js</code></li>\n</ol>\n<!-- language: lang-js -->\n<pre><code>+const pagination = require(\'gatsby-paginate\');\n\nconst createTagPages = (createPage, posts) => {\nconst tagPageTemplate = path.resolve(`src/templates/tags.js`)\n@@ -72,6 +73,15 @@ exports.createPages = ({ boundActionCreators, graphql }) => {\n\n    createTagPages(createPage, posts)\n\n+      // default pagination to 10.\n+      pagination({\n+        edges: posts,\n+        createPage: createPage,\n+        pageTemplate: "src/templates/index.js",\n+        pageLength: 10\n+      });\n+\n+\n    posts.forEach(({node}, index) => {\n        createPage({\n        path: node.frontmatter.path,\n</code></pre>\n<ol start="5">\n<li>编辑样式</li>\n<li>重新发布<code>yarn deploy</code></li>\n</ol>',id:"/volume1/homes/leo/github/my-blog-code/src/pages/2018/为Gatsby博客添加分页功能.md absPath of file >>> MarkdownRemark",frontmatter:{date:"2018-03-12T11:31:26.000+08:00",path:"/2018/support-pagination-for-gatsby-blog",title:"为Gatsby博客添加分页功能",excerpt:"根据Egghead上的教程，做出的博客站点有个缺陷，那就是没有分页功能，对于勤奋的博主来说，在一个页面上显示所有文章列表有点不完美，这里我们改造一下，加入分页功能。",tags:["blog","gatsby"]}},{html:"<p>Gatsby打造的博客已经很不错了，但是缺少一个评论功能。</p>\n<p>本文简单介绍如何集成Disqus评论服务到你的博客站点。</p>\n<h2>How To</h2>\n<p>首先，添加<code>react-disqus-thread</code>组件。</p>\n<pre><code>yarn add react-disqus-thread\n</code></pre>\n<p>之后，新建一个<code>Comments</code>的React组件。</p>\n<!-- language: lang-js -->\n<pre><code>const React = require('react');\nconst ReactDisqusThread = require('react-disqus-thread');\n\nclass Comments extends React.Component{\n\n    constructor(props) {\n        super(props);\n    }\n    \n    handleNewComment (comment) {\n        \n    }\n\n    render () {\n        const id = `smilingleo/${window.location.pathname}`;\n        return (\n            &#x3C;ReactDisqusThread\n                shortname=\"smilingleo\"\n                identifier={id}\n                title={this.props.title}\n                onNewComment={this.handleNewComment}/>\n        );\n    }\n};\n\nexport default Comments;\n</code></pre>\n<p>注意:</p>\n<ul>\n<li><code>identifier</code>需要是唯一的，这里我用了<code>smilingleo</code>作为前缀，加上<code>pathname</code>。</li>\n<li><code>onNewComment</code>的响应函数中，可以做一些有意思的东西，比如给你的IM发一条消息，尝试了Slack Webhook，可惜不支持CORS.</li>\n</ul>\n<p>最后，在<code>templates/blog-post.js</code>文件中添加：</p>\n<!-- language: lang-html -->\n<pre><code>&#x3C;hr />\n&#x3C;Comments title={title} />\n</code></pre>\n<p>搞定.</p>\n<h2>References</h2>\n<ol>\n<li><a href=\"https://github.com/mzabriskie/react-disqus-thread\">React Disqus thread component</a></li>\n</ol>",id:"/volume1/homes/leo/github/my-blog-code/src/pages/2018/为你的Gatsby博客添加评论功能.md absPath of file >>> MarkdownRemark",frontmatter:{date:"2018-03-12T10:07:43.000+08:00",path:"/2018/enable-comments-for-gatsby-blog",title:"为你的Gatsby博客添加评论功能",excerpt:"Gatsby打造的博客已经很不错了，但是缺少一个评论功能。本文简单介绍如何集成Disqus评论服务到你的博客站点。",tags:["blog"]}},{html:'<h2>起因</h2>\n<p>原来的博客站点基于Jekyll搭建，各种问题，感觉很不爽。后来看到Gatsby，基于ReactJS, GraphQL，都是我的最爱，于是果断投诚！</p>\n<h2>遇到的问题</h2>\n<h3>和prettyprint集成的问题</h3>\n<p>原来的prettyprint机制是在页面加载的时候调用<code>init()</code>，检查DOM中的<code>pre.code</code>元素。但是转到React之后，全部是前端Routing，原来写的<code>window.onload = init</code>不工作了。每次都要手动刷新。</p>\n<p>解决办法是在Gatsby Link元素的<code>onClick</code>事件中注册一个timer:</p>\n<!-- language: js -->\n<pre><code>&#x3C;Link to={frontmatter.path} onClick={() => setTimeout(init, 100)}>{frontmatter.title}&#x3C;/Link>\n</code></pre>\n<p>这样，在点击链接打开页面之后，就会调用<code>init</code>了。</p>\n<p><strong>更新：</strong>\n上面的方法更像是一个Hack，因为毕竟Link的目的只是指向一个target，不应该把不属于Link的职责(解析页面DOM并设置pre.code的style)绑定到Link上。</p>\n<p>重新思考了一下之后，重构了<code>templates/blog-post.js</code>，原来的<code>Template</code>是一个ES6箭头函数，因为我们希望的是在页面组件都Mount之后，调用<code>init</code>，所以，我们将其修改为一个扩展<code>React.Component</code>的class.</p>\n<!-- language:lang-js -->\n<pre><code>class Template extends React.Component {\n    constructor(props) {\n        super(props);\n    }\n    \n    /*\n    * Once the blog page is loaded, run init() to prettyprint the code.\n    */\n    componentDidMount() {\n        init();\n    }\n\n    render() {\n        const { markdownRemark: post } = this.props.data\n        const { frontmatter, html } = post\n        const { title, date } = frontmatter\n        const { next, prev } = this.props.pathContext\n    \n        return (\n            ...\n        )  \n    }\n}\n</code></pre>\n<p>这样，就达到目的了。</p>\n<h3>发布方法</h3>\n<p>原来以为是将这些源码直接push到 <code>smilingleo.github.io</code>，后来发现不对。</p>\n<p>需要有两个github repos，一个 <code>my-blog-code</code>, 另外一个 <code>smilingleo.github.io</code>。</p>\n<p>新的博文写完之后，需要<code>yarn deploy</code>，这样会发布到<code>public/</code>，然后将<code>public</code>目录指向<code>smilingleo.github.io</code>这个repo。</p>\n<p>所以，一篇博客需要提交两个git repos。</p>\n<h3>date格式问题</h3>\n<p>原来用Jekyll的时候，date可以是<code>YYYY-MM-dd HH:mm:ss</code>的格式，但是用Gatsby必须是<code>YYYY-MM-dd\'T\'HH:mm:ss</code>。</p>\n<h2>参考资料</h2>\n<ol>\n<li><a href="https://egghead.io/courses/build-a-blog-with-react-and-markdown-using-gatsby">Egghead教程</a></li>\n<li><a href="https://stackoverflow.com/questions/37170809/react-createclass-vs-es6-arrow-function/37170998#37170998">React.createClass vs. ES6 arrow function</a></li>\n</ol>\n<p>In summary:</p>\n<p>The short answer is that you want to use Stateless Functional Components (SFC) as often as you can; the majority of your components should be SFC\'s.</p>\n<p>Use the traditional Component class when:</p>\n<p>You need local state (<code>this.setState</code>)\nYou need a lifecycle hook (<code>componentWillMount</code>, <code>componentDidUpdate</code>, etc)\nYou need to access backing instances via refs (eg. <code>&#x3C;div ref={elem => this.elem = elem}></code>)</p>',id:"/volume1/homes/leo/github/my-blog-code/src/pages/2018/转用Gatsby搭建博客.md absPath of file >>> MarkdownRemark",frontmatter:{date:"2018-03-08T17:01:00.000+08:00",path:"/2018/blog-with-gatsby",title:"转用Gatsby打造基于github的博客站点",excerpt:"如何用Gatsby打造一个博客",tags:["blog","github","gatsby"]}},{html:'<h2>Context</h2>\n<p>插曲：前不久微博上看到一技术“牛人”大V评论Java8的一些特性，引入lambada但没有扩展能力，集合的查询都得靠新stream api而不是Enumerator / Iterator云云。一时手欠回复了下“似乎应该是Enumerator / Iteratee“, 结果引来一身骚，被该大V泼口大骂了一个下午，没错就是像网吧里面无聊的小青年一样无营养地谩骂，实在没搞懂到底是为什么，说我说的Iteratee和他说的没”鸡毛“关系，不懂，也不想搞懂了，还是他玩他的Iterator我介绍我的Iteratee吧。</p>\n<p>因为我们的内存、磁盘等资源还是有限的，对于一个大的Stream，Collection，我们在处理的时候不应该将其作为整体进行处理，因为这样会带来潜在的风险，比如：内存溢出，降低系统吞吐量等等。</p>\n<p>正确的方式是将大的不可预见（unpredictable）的stream，Collection进行分解，将其分解为小的，可预见（predictable）的块进行处理。这是流模式的思想，也是Iteratee的设计目标之一。</p>\n<p>Stream对于指令式编程已经比较成熟了，有大量的类库，丰富的API。但是对于强调不可变量，尽可能无副作用的FP来说，要考虑语言适配的问题，而目前，流行的解决方案就是：Enumerator/Iteratee。</p>\n<p>另外，就是需要用统一的API来处理所有类型的Stream，就像指令式编程中的<code>InputStream.read</code>, <code>OutputStream.write</code>，无论什么Stream都需要支持这些基本方法。</p>\n<h2>High Level Concept Model</h2>\n<p>Enumerator / Iteratee说起来很复杂，其实就是一个生产者 / 消费者模型。 Enumerator是生产者，创建诸多个可控的chunk，Iteratee是消费者，消费任意类型的Input Chunk。</p>\n<!-- language:lang-scala -->\n<pre><code>trait Enumerator {\n  def |>>[A](i: Iteratee[E, A]): Future[Iteratee[E, A]] = apply(i)\n}\n</code></pre>\n<p>Enumerator驱动一个Iteratee，Iteratee处理一个Chunk之后，返回下一个状态的Iteratee. 在构造Enumerator的时候不会真正读取数据，只有在真正消费时才产生IO。</p>\n<p>而且多个Enumerator之间可以组合，不同类型的消费者（Iteratee）也可以进行组合、变换，简言之，组合的概念就是将每个Enumerator / Iteratee都看成是一个可组合的积木，每个积木相对独立可复用，写代码就是将这些积木组合达成你想要形状的过程。这个说法很常见，OO里提倡“组合优于继承”也是一样的思想，其中的关键是如何找到最小的可复用的component，然后是通过什么样的方式进行灵活地组合。</p>\n<p>Enumerator / Iteratee / Enumeratee就是一个非常好的例子。</p>\n<h2>消费者 Iteratee</h2>\n<!-- language:lang-scala -->\n<pre><code>class Iteratee &#x3C;&#x3C; (T, #00FF00) >> {\n  Future[B] fold[B](folder: Step[E, A] => Future[B])\n}\nclass ImmediateIteratee &#x3C;&#x3C; (T, #00FF00) >>\nclass Done &#x3C;&#x3C; (O, #FF0000) >>\nclass Cont &#x3C;&#x3C; (O, #FF0000) >>\nclass Error &#x3C;&#x3C; (O, #FF0000) >>\nclass Step &#x3C;&#x3C; (T, #00FF00) >>\nclass Input &#x3C;&#x3C; (T, #00FF00) >>\n\nIteratee &#x3C;|-- ImmediateIteratee\nIteratee &#x3C;|-- FutureIteratee\nIteratee &#x3C;.left.> Step\nStep .left.> Input\n\nImmediateIteratee &#x3C;|-- DoneIteratee\nDoneIteratee .. Done\nImmediateIteratee &#x3C;|-- ContIteratee\nContIteratee .. Cont\nImmediateIteratee &#x3C;|-- ErrorIteratee\nErrorIteratee .. Error\n\nnote "company objects" as oNote\nDone .. oNote\nCont .. oNote\nError .. oNote\n</code></pre>\n<p>Iteratee是一个Input的消费者，注意：这里的Input不是全部输入，而是a chunk of input，这个很重要，没有一个Iteratee来消费所有输入数据，而是每块一个消费者，然后通过函数组合的方式将所有块穿起来。</p>\n<ul>\n<li>\n<p>为什么不是一个完整输入对应一个消费者呢？\n这是指令式编程的思维方式，因为你需要自己考虑实现细节，设计一些游标，每次读取步进的长度，判断游标的位置来判断下一步如何操作。</p>\n</li>\n<li>\n<p>为什么不是所有的输入chunk共享一个消费者呢？\n嗯，这个问题我不是很确定，应该是有一部分上面的原因，另外就是副作用的问题，每个Step自己维护自己的状态，可以比较容易地实现“懒加载”，在最后一步（调用<code>run</code>）的时候才真正发生IO，而之前，可以通过函数组合任意对每一步进行transform等操作。</p>\n</li>\n</ul>\n<p>Iteratee还有一个需要注意的地方，fold函数是一个<code>curried function</code>，有一个implicit的参数ExecutionContext，也就是在哪个线程池中执行，这个现象在Play中很普遍。</p>\n<p>ImmediateIteratee描述了一个已经预先知道其state的Iteratee，而FutureIteratee当然就是未来才能知道其State的Iteratee。[个人感觉这个地方设计有点怪，FutureIteratee似乎应该用Future[Iteratee]更好。] </p>\n<!-- language:uml -->\n<pre><code>class Step &#x3C;&#x3C; (T, #00FF00) >> {\n  Iteratee[E, A] it\n}\nclass Iteratee &#x3C;&#x3C; (T, #00FF00) >>\nclass Input &#x3C;&#x3C; (T, #00FF00) >>\nStep .left.> Input\nStep &#x3C;-right-> Iteratee\nStep &#x3C;|-- Done\nStep &#x3C;|-- Cont\nStep &#x3C;|-- Error\n</code></pre>\n<p>Step描述的是一个Iteratee的状态，其本身包含一个Iteratee不变量<code>it</code>，而Done、Cont、Error也是简单的<code>case class</code>，所以构造也很简单。</p>\n<!-- language:uml -->\n<pre><code>class Input &#x3C;&#x3C; (T, #00FF00) >>\nInput &#x3C;|-- El\nInput &#x3C;|-- Empty\nInput &#x3C;|-- EOF\n</code></pre>\n<p>Input[E]描述的是<code>一块</code>输入(a chunk of input，不是全部输入)，构造其实很简单，就是一个简单的case class，可以按照你熟悉的方式来构造。</p>\n<h2>生产者 Enumerator</h2>\n<p>先来看看Enumerator的定义：</p>\n<!-- language:lang-scala -->\n<pre><code>trait Enumerator[E] {\n\n  /**\n   * Apply this Enumerator to an Iteratee\n   */\n  def apply[A](i: Iteratee[E, A]): Future[Iteratee[E, A]]\n  def |>>[A](i: Iteratee[E, A]): Future[Iteratee[E, A]] = apply(i)\n  ...\n\n}\n</code></pre>\n<p>由上面定义可以看到，一个<code>Enumerator</code>接受一个<code>Iteratee[E, A]</code>，并返回一个<code>Future[Iteratee[E, A]]</code>，翻译一下就是：Enumerator驱动一个消费者，消费数据之后产生一个下个状态的消费者。</p>\n<p>Enumerator提供了大量的工厂方法（在scala中是通过伴生对象来实现），比如，你可以从一个数组创建一个Enumerator:</p>\n<!-- language:lang-scala -->\n<pre><code>val enumerateCountries = Enumerator[String] = Enumerator("China", "America", "Japan", "Russia", "England")\n</code></pre>\n<p>可以从一个文件中创建：</p>\n<!-- language:lang-scala -->\n<pre><code>val enumerateFile: Enumerator[Array[Byte]] = Enumerator.fromFile(new File("path/to/some/big/file"))\n</code></pre>\n<p>或者从一个Stream中创建：</p>\n<!-- language:lang-scala -->\n<pre><code>val enumerateFile: Enumerator[Array[Byte]] = Enumerator.fromStream(new java.io.FileInputStream(new File("path/to/some/big/file")))    \n</code></pre>\n<p>更加通用的方式是从一个<code>e: ()=>Future[Option[E]]</code>函数来创建，因为这个函数声明了：未来可能会产生一个<code>E</code>:</p>\n<!-- language:lang-scala -->\n<pre><code>def generateM[E](e: => Future[Option[E]])(implicit ec: ExecutionContext): Enumerator[E] = {\n    ...\n}\n</code></pre>\n<p>发挥一下你的想象，很多事情都可以看成是Stream，比如时间：</p>\n<!-- language:lang-scala -->\n<pre><code>import play.api.libs.concurrent.Promise\nimport play.api.libs.iteratee._\nimport scala.concurrent.duration._\nimport scala.concurrent.ExecutionContext.Implicits.global\nimport java.util.Date\n\n// 截止时间\nval alertTo = new Date(System.currentTimeMillis + 1000*60)\n\n// 一个时间流，截止到alertTo\nval timeStream = Enumerator.generateM {\n    Promise.timeout(\n      if (new Date before alertTo) Some(new Date) else None, \n      1 seconds)\n}\n\nval printlnSink = Iteratee.foreach[Date](date => println(date))\n// 每隔一秒钟打印一次，直到alertTo\ntimeStream |>> printlnSink\n</code></pre>\n<p>如果你想再play console里面运行上面的代码，可能会失败，说什么:no application started之类的，这时你需要前面加上：</p>\n<!-- language:lang-scala -->\n<pre><code>val app = new play.core.StaticApplication(new java.io.File("."))\n</code></pre>\n<p>创建一个测试用的application，再试一下就OK了。</p>\n<p>除了这个例子，我觉得也可以将数据库中的游标查询用Enumerator来实现。</p>\n<p>在Play框架中，还有一个实际的例子是<code>WebSocket</code>，有机会我们再单独介绍。</p>\n<h2>适配器 Enumeratee</h2>\n<p>对应OO Design Pattern中的Adaptor模式，<code>Enumeratee</code>就是一个Adaptor，将不同规格的组件适配在一起。比如下面这个例子：</p>\n<p>我们有一个String类型的Enumerator, <code>Enumerator("123", "456", "789", "222", "333", "444")</code>，还有一个累加器，<code>Iteratee.fold[Long, Long](0:Long) { (acc, el) => acc + el }</code>，两者的“规格”是不同的，一个是String， 但另外一个是Long，当然我们可以再定义一个新的Iteratee，比如：<code>Iteratee.fold[String, Long](0:Long) { (acc, el) => acc + el.toLong }</code>，但是显然，这里面有重复代码的臭味道。更加合理的方式是做一个适配，用一个适配器来讲两个已经存在的component转接后一起工作。</p>\n<!-- language:lang-scala run -->\n<pre><code>import play.api.libs.iteratee._\nimport scala.concurrent.ExecutionContext.Implicits.global\n\nval strings = Enumerator("123", "456", "789", "222", "333", "444")\nval sum = Iteratee.fold[Long, Long](0:Long) { (acc, el) => acc + el }\nval toLong = Enumeratee.map[String]( x => x.toLong )\n\nstrings |>> toLong &#x26;>> sum flatMap { x => x.run } onSuccess { case s => println(s) }\n// Or, transform the Enumerator first.\nstrings &#x26;> toLong |>> sum flatMap { x => x.run } onSuccess { case s => println(s) }\n</code></pre>\n<p>上面例子可以看到，<code>Enumeratee</code>不但可以适配<code>Iteratee</code>，还可以转换<code>Enumerator</code>。</p>\n<p>留个问题：<code>strings &#x26;> toLong</code>会不会产生memory的问题？ </p>\n<h2>指令式 VS. 函数式</h2>\n<p>这里用一个很无聊的例子：遍历一个大文件来统计文件大小。</p>\n<h3>指令式风格</h3>\n<p>Use Java FileInputStream, more imperative style:</p>\n<!-- language:lang-scala -->\n<pre><code>val fis = new java.io.FileInputStream(new java.io.File("/Users/leo/Movies/big_file.mkv"))\n\n// mutable variables\nvar readLength = 0\nvar fileSize: Long = 0\nvar buf = new Array[Byte](1024 * 8) // chunk size used in Enumerator\nval begin = System.currentTimeMillis\ndo {\n  readLength = fis.read(buf)\n  if (readLength != -1)\n    fileSize = fileSize + readLength\n}while(readLength != -1)\n\nprintln(s"File Size: $fileSize, and it took ${System.currentTimeMillis - begin} ms")\n</code></pre>\n<p>And output like <code>File Size: 4003885806, and it took 54701 ms</code>, the memory usage is about <code>78Mb</code>.</p>\n<h3>函数式风格</h3>\n<p>Use Enumerator / Iteratee to get file size:</p>\n<!-- language:lang-scala -->\n<pre><code>import play.api.libs.iteratee._\n// construct an Enumerator from a file\nval fileEnum = Enumerator.fromFile(new java.io.File("/Users/leo/Movies/big_file.mkv")) \n// create a consumer\nval counter = Iteratee.fold[Array[Byte], Long](0: Long){ (acc, ele) => ele.size + acc }\n\nval begin = System.currentTimeMillis\n// where the IO really happens.\nIteratee.flatten(fileEnum |>> counter).run.onSuccess { case x => println(s"File Size: $x, and it took ${System.currentTimeMillis - begin} ms") }\n</code></pre>\n<p>Here\'s the output: <code>File Size: 4003885806, and it took 57213 ms</code>, and max memory usage is about <code>120Mb</code>. </p>\n<p>Note: If you are running above code with Scala version &#x3C; 2.10.3, you\'ll run into <code>OutOfMemory</code> Error, it\'s so funny right? Enumerator / Iteratee suppose to be designed to solve the OutOfMemory issue, actually, it\'s not Enumerator/Iteratee \'s problem, it\'s a bug of scala, see <a href="https://issues.scala-lang.org/browse/SI-7336">SI-7336</a></p>\n<h3>对比</h3>\n<p>从上面的两种实现来看，从执行时间上，两种方式没有太大差异，但是指令式编程在内存占用方面要优于函数式编程，毕竟var变量可以复用，val变量需要重新生成。但是差别并没有想象中那么大，处理一个4G的文件，差别只是40M左右。但是带来的好处是显而易见的：因为没有mutable变量，没有副作用，并发、代码可读性有提高。</p>',id:"/volume1/homes/leo/github/my-blog-code/src/pages/2013/Enumerator-Iteratee-Enumeratee.md absPath of file >>> MarkdownRemark",frontmatter:{date:"2013-11-11T14:16:45.000Z",path:"/2013/enumerator-iteratee-enumeratee",title:"Enumerator / Iteratee / Enumeratee",excerpt:"Stream对于指令式编程已经比较成熟了，有大量的类库，丰富的API。但是对于强调不可变量，尽可能无副作用的FP来说，要考虑语言适配的问题，而目前，流行的解决方案就是：Enumerator/Iteratee。",tags:["scala","playframework","blog"]}},{html:'<p>Markdown是一个很爽的写作格式（或者说语言更合适一点），我们不再需要复杂的富文本编辑器，用纯文本就可以编写出布局漂亮的文章。</p>\n<p>不过Markdown对于技术类文章来说还有一个不足：我们经常需要画一些图来阐述自己的思路，但是Markdown只能引用已经存在的图。</p>\n<p>有没有可能用Plain Text来画图呢？AscII艺术图？太原始了。试试PlantUML吧。</p>\n<h2>PlantUML介绍</h2>\n<p>从某个角度说，<a href="http://plantuml.sourceforge.net">PlantUML</a>简直就是Markdown的绝配，也只需要纯文本就可以实现漂亮的效果，只是这里变成更炫的UML图。</p>\n<p>比如我想画一个类图，Cat和Dog继承Animal，用PlantUML来实现就是：</p>\n<pre><code>@startuml\nAnimal &#x3C;|-- Cat\nAnimal &#x3C;|-- Dog\n@enduml\n</code></pre>\n<p>是不是很简单？来看看效果：</p>\n<!-- language:uml -->\n<pre><code>Animal &#x3C;|-- Cat\nAnimal &#x3C;|-- Dog\n</code></pre>\n<p>怎么样？不错吧，这个图片哪里来的？其实在我发布这篇文章的时候，这个类图还不存在，只有在你访问这篇文章的时候才自动生成的。PlantUML有一个jQuery插件，可以在运行时生成图片。</p>\n<p>PlantUML的jQuery插件用法很简单，你只需要在html中编辑：</p>\n<!-- language:lang-html -->\n<pre><code>&#x3C;img uml="\n  Animal &#x3C;|-- Cat\n  Animal &#x3C;|-- Dog\n">\n</code></pre>\n<p>jQuery插件会自动增强这个img元素，具体实现还挺有意思，这里不细说了。</p>\n<p>可这还不够，怎么在Markdown中写<code>img</code>呢？如果你照抄上面的img代码，pegdown解析器会抛错，\'&#x3C;\'不匹配云云。</p>\n<h2>解决方案</h2>\n<p>基本上这种问题可以从两个方面想办法，一个是服务器端，实现一个markdown parser plugin，来定制一个特殊语法，另一个方向是从浏览器端想办法。</p>\n<p>从上面的介绍中我们知道，已经有jQuery插件了，那从前端做似乎更加容易一些。此外，从<a href="http://www.learn-scala.net/blogs/2013-11-01_14.md">上一篇</a>我们已经知道，在<code>pre code</code>前面加上一个<code>&#x3C;!-- language:lang-scala --></code>来实现语法高亮显示问题。</p>\n<p>PlantUML的内容也可以认为是一种code，很自然地，我们可以用<code>pre code</code>来封装。比如我们可以用：</p>\n<!-- language:lang-html -->\n<pre><code>&#x3C;!-- language:uml -->\n    Animal &#x3C;|-- Cat\n    Animal &#x3C;|-- Dog\n</code></pre>\n<p>这里我们自定义了一种language类型<code>uml</code>，在前端解析的时候，就能知道这个代码块是用来画图的了。</p>\n<p>好，我们来看前端JS代码的实现：</p>\n<!-- language:lang-javascript -->\n<pre><code>function init() {\n  var plantuml = false;\n  var blocks = document.querySelectorAll(\'pre code\');\n  // 遍历所有pre code\n  for (var i = 0; i &#x3C; blocks.length; i += 1) {\n    var code = blocks[i];\n    //code.className += \' prettyprint\';\n    var pre = code.parentNode;\n    var above = pre;\n    do {\n      above = above.previousSibling;\n    } while (above.nodeType == Node.TEXT_NODE)\n    // 检查注释元素据\n    if (above.nodeType == Node.COMMENT_NODE) {\n      var comment = above.data;\n      // 正则表达式，获取语言类型\n      var pattern = /^\\s*language:\\s*([\\w\\-]+)\\s*(\\w+)?\\s*$/i;\n      var match = pattern.exec(comment);\n      if (match != null) {\n        var lang = match[1];\n        // 如果是uml，动态生成一个img元素，并设置uml属性值为pre code的内容。\n        if (lang &#x26;&#x26; lang == "uml") {\n          var container = document.createElement("div");          \n          var img = document.createElement("img");\n          img.setAttribute("uml", code.innerText || code.textContent);\n\n          container.appendChild(img);\n          container.className = "text-center";\n\n          pre.insertAdjacentElement(\'afterEnd\', container);\n          // 将pre code隐藏起来，只显示图片\n          pre.style.display = "none";\n          plantuml = true;\n        }\n      }\n    }\n  }\n  // 调用jQuery插件生成图片。\n  if (plantuml) {\n    plantuml_runonce();\n  }\n}\n</code></pre>\n<p>然后，在html中调用：</p>\n<!-- language:lang-html -->\n<pre><code>&#x3C;script type=\'text/javascript\'>\n  window.onload = init;    \n&#x3C;/script>  \n</code></pre>\n<p>搞定，收工！！写作、布局编排、画图全部纯文本，爽！</p>\n<p>附上一个PlantUML的参考文档，原本上sourceforge网站就可以了，可惜被墙了，点击<a href="http://www.learn-scala.net/assets/ebooks/PlantUML_Language_Reference_Guide.pdf.zip">这里</a>下载吧。</p>',id:"/volume1/homes/leo/github/my-blog-code/src/pages/2013/集成PlantUML和Markdown.md absPath of file >>> MarkdownRemark",frontmatter:{date:"2013-11-07T19:16:45.000Z",path:"/2013/markdown-plantuml-integration",title:"边建边学-2：集成PlantUML和Markdown",excerpt:"如何用Markdown+PlantUML结合来写图文并茂的博客。",tags:["markdown","plantuml","blog"]}},{html:'<p>本文将是一个系列文章，循序渐进地介绍本站的构建过程，不只是简单的技术介绍，重点是建站过程遇到的问题分析，以及解决的过程，所以起名<strong>“边建边学”</strong>系列。</p>\n<p>希望对学习<code>Scala</code>+<code>Playframework</code>的童鞋有所启发。</p>\n<p>本篇重点介绍如何用markdown来写技术文章，以及如何优化代码片段。</p>\n<h2>需求</h2>\n<ul>\n<li>用markdown来写博客，对不同代码类型能够进行美化</li>\n<li>技术博客一般会在文中包含部分代码片段，在看文章的时候，如果能运行一下这个代码片段，看看执行结果是什么，会对理解技术有所帮助，所以这里需要一个Web REPL (Read Eval Print Loop)</li>\n<li>博文列表中只显示博文头</li>\n</ul>\n<h2>实现</h2>\n<h3>markdown</h3>\n<p>用Markdown写文章的流程是这样的：</p>\n<ol>\n<li>\n<p>在本地创建md文件，用markdown语法写文章</p>\n<p>markdown语法不是本文的介绍重点，需要温习的童鞋请查看<a href="http://zh.wikipedia.org/zh-cn/Markdown">维基百科</a>，编辑工具可以考虑使用：<a href="http://mouapp.com">Mou</a>，或者chrome插件stackedit。</p>\n</li>\n<li>\n<p>将文章发布到网站。</p>\n<p>发布的最终目的是将文章上传到网站，可以是存到数据库中，可以是上传为一个文件，因为文章的特殊性，创作过程需要跟踪记录，而且md文章本身也是一个文件，所以直接将文件上传搞定。</p>\n<p>具体上传途径是通过git。其实从版本管理的角度，md文件和其他源代码文件没有什么不同。</p>\n</li>\n<li>\n<p>mardkown解析成为HTML</p>\n<p>这个解析有两种选择，一个是在服务器端解析，另外一个是在浏览器端通过javascript来解析。个人觉得没有太大不同，这里选择一个github上开源的工具来实现：<a href="https://github.com/sirthias/pegdown">Pegdown</a>。</p>\n<p>具体代码非常简单：</p>\n</li>\n</ol>\n<!-- language:lang-scala -->\n<pre><code>val processor = new PegDownProcessor()\nval markdownContent = "##title2\\n*item1"\nval htmlContent = processor.markdownToHtml(markdownContent)\n</code></pre>\n<ol start="4">\n<li>\n<p>代码美化</p>\n<p>将MD转换为html之后，代码片段只是被转换为：<code>&#x3C;pre>&#x3C;code> .... &#x3C;/code>&#x3C;/pre></code>，但是如何按照相应语言的语法进行高亮显示呢？其实任何Web效果的东西都没有什么神秘的，只是应用CSS而已。</p>\n<p>这里我们选用的是<a href="https://code.google.com/p/google-code-prettify/">prettify.js</a>，当然，还可以选择其他方案，比如<a href="http://highlightjs.org">highlight.js</a>.</p>\n<p>具体方案如下：</p>\n</li>\n</ol>\n<!-- language:lang-javascript -->\n<pre><code>&#x3C;script type=\'text/javascript\'>\n    function init() {\n        var prettify = false;\n        var blocks = document.querySelectorAll(\'pre code\')\n        for (var i = 0; i &#x3C; blocks.length ; i++) {\n            blocks[i].className += \'prettyprint\';\n            prettify = true;\n        }\n        if (prettify) {\n          prettyPrint();\n        }\n    }\n    window.onload = init;\n&#x3C;/script>\n</code></pre>\n<p>简单说，就是在页面（dom）加载完成之后，查找所有的pre+code元素，然后给该元素class添加<code>prettyprint</code>，这样有了预定义的样式表，代码语法高亮特性就实现了。\n<br>\n代码片段执行的部分将有专门的章节介绍，此处略过。\n</p>\n<h3>博文列表只显示文章头</h3>\n<p>在列表页面，将在一个页面列出大量的内容，如果将每篇文章都完整地列出来，那么页面将变得很长，而且也不方便用户查找，而如果能够只显示文章的开头部分，就可以让读者快速地了解文章大致内容，并且快速浏览近期文章，有选择性地查看文章。</p>\n<p>这个说起来其实很简单，展示部分内容逻辑上也很简单，只是简单截取文章开头的前N个字符而已。总体上是这个思路，可实际上会比这个稍微复杂一些。原因在于博文不是简单的plain text，而是HTML代码，如果只简单截取前面N个字符，极有可能会造成HTML片段不完整导致页面错误。</p>\n<p>知道问题所在之后，解决办法其实也就简单了。我们可以简单分析一下markdown转换为html之后的代码结构，比如：</p>\n<!-- language:lang-html -->\n<pre><code>&#x3C;h1>手工打造博客站点-1: 用Markdown写博文&#x3C;/h1>\n&#x3C;p>本文将是一个系列文章，循序渐进地介绍本站的构建过程，不只是简单的技术介绍，重点是建站过程遇到的问题分析，以及解决的过程。&#x3C;/p>\n&#x3C;p>希望对学习&#x3C;code>Scala&#x3C;/code>+&#x3C;code>Playframework&#x3C;/code>的童鞋有所启发。&#x3C;/p>\n&#x3C;p>本篇重点介绍如何用markdown来写技术文章，以及如何优化代码片段。&#x3C;/p>\n&#x3C;h2>需求&#x3C;/h2>\n……\n</code></pre>\n<p>很明显，标题、段落等html元素都是同级的，所以我们只需要一次计算每个html元素所包含内容的长度，当叠加到超过阀值时，将前面元素内容输出就好了。具体的办法是：先将html字符串解析为XML DOM，然后迭代每个一级children节点。</p>\n<!-- language:lang-scala -->\n<pre><code>val content = Source.fromFile(file, "UTF-8", 1024).mkString\nval htmlContent = "&#x3C;article>" + processor.markdownToHtml(content) + "&#x3C;/article>"\n// only show part of the article\nval xml = scala.xml.XML.loadString(htmlContent)\nvar i: Long = 0L\nval elemList = xml.child.takeWhile( el => { i += el.toString().length; i &#x3C; ConfigUtils.BLOG_HEAD_LENGTH } )\nval part = "&#x3C;article>" + elemList.mkString + s"""&#x3C;p>&#x3C;a href="/blogs/${file.getName}">[...]&#x3C;/a>&#x3C;/p>&#x3C;/article>"""\n</code></pre>\n<p>备注：</p>\n<ul>\n<li>在转换为html之后，需要在外面包一个<code>&#x3C;article></code>容器元素。</li>\n<li>从一个Seq容器元素中截取前面部分元素用<code>takeWhile</code>，此处有一个<code>var</code>可变参数的使用，其实也可以不用，只是用在这里容易一些。</li>\n<li>在最后添加一个指向文章全文的链接。</li>\n</ul>\n<h2>预告</h2>\n<p>下篇，将介绍如何将网页中的代码片段提交到服务器端执行并返回执行结果，也就是Web GUI REPL，敬请关注。</p>',id:"/volume1/homes/leo/github/my-blog-code/src/pages/2013/用markdown写博客.markdown absPath of file >>> MarkdownRemark",frontmatter:{date:"2013-11-01T14:06:45.000Z",path:"/2013/blogging-with-markdown",title:"边建边学-1: 用Markdown写博文",excerpt:"本文将是一个系列文章，循序渐进地介绍本站的构建过程，不只是简单的技术介绍，重点是建站过程遇到的问题分析，以及解决的过程，所以起名**“边建边学”**系列。",tags:["markdown","blog"]}}],tagName:"blog"}}}});
//# sourceMappingURL=path---tags-blog-0b1ceb2eea2a2ee7b125.js.map