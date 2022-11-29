webpackJsonp([45758362528925],{471:function(n,e){n.exports={pathContext:{posts:[{html:'<p>Markdown是一个很爽的写作格式（或者说语言更合适一点），我们不再需要复杂的富文本编辑器，用纯文本就可以编写出布局漂亮的文章。</p>\n<p>不过Markdown对于技术类文章来说还有一个不足：我们经常需要画一些图来阐述自己的思路，但是Markdown只能引用已经存在的图。</p>\n<p>有没有可能用Plain Text来画图呢？AscII艺术图？太原始了。试试PlantUML吧。</p>\n<h2>PlantUML介绍</h2>\n<p>从某个角度说，<a href="http://plantuml.sourceforge.net">PlantUML</a>简直就是Markdown的绝配，也只需要纯文本就可以实现漂亮的效果，只是这里变成更炫的UML图。</p>\n<p>比如我想画一个类图，Cat和Dog继承Animal，用PlantUML来实现就是：</p>\n<pre><code>@startuml\nAnimal &#x3C;|-- Cat\nAnimal &#x3C;|-- Dog\n@enduml\n</code></pre>\n<p>是不是很简单？来看看效果：</p>\n<!-- language:uml -->\n<pre><code>Animal &#x3C;|-- Cat\nAnimal &#x3C;|-- Dog\n</code></pre>\n<p>怎么样？不错吧，这个图片哪里来的？其实在我发布这篇文章的时候，这个类图还不存在，只有在你访问这篇文章的时候才自动生成的。PlantUML有一个jQuery插件，可以在运行时生成图片。</p>\n<p>PlantUML的jQuery插件用法很简单，你只需要在html中编辑：</p>\n<!-- language:lang-html -->\n<pre><code>&#x3C;img uml="\n  Animal &#x3C;|-- Cat\n  Animal &#x3C;|-- Dog\n">\n</code></pre>\n<p>jQuery插件会自动增强这个img元素，具体实现还挺有意思，这里不细说了。</p>\n<p>可这还不够，怎么在Markdown中写<code>img</code>呢？如果你照抄上面的img代码，pegdown解析器会抛错，\'&#x3C;\'不匹配云云。</p>\n<h2>解决方案</h2>\n<p>基本上这种问题可以从两个方面想办法，一个是服务器端，实现一个markdown parser plugin，来定制一个特殊语法，另一个方向是从浏览器端想办法。</p>\n<p>从上面的介绍中我们知道，已经有jQuery插件了，那从前端做似乎更加容易一些。此外，从<a href="http://www.learn-scala.net/blogs/2013-11-01_14.md">上一篇</a>我们已经知道，在<code>pre code</code>前面加上一个<code>&#x3C;!-- language:lang-scala --></code>来实现语法高亮显示问题。</p>\n<p>PlantUML的内容也可以认为是一种code，很自然地，我们可以用<code>pre code</code>来封装。比如我们可以用：</p>\n<!-- language:lang-html -->\n<pre><code>&#x3C;!-- language:uml -->\n    Animal &#x3C;|-- Cat\n    Animal &#x3C;|-- Dog\n</code></pre>\n<p>这里我们自定义了一种language类型<code>uml</code>，在前端解析的时候，就能知道这个代码块是用来画图的了。</p>\n<p>好，我们来看前端JS代码的实现：</p>\n<!-- language:lang-javascript -->\n<pre><code>function init() {\n  var plantuml = false;\n  var blocks = document.querySelectorAll(\'pre code\');\n  // 遍历所有pre code\n  for (var i = 0; i &#x3C; blocks.length; i += 1) {\n    var code = blocks[i];\n    //code.className += \' prettyprint\';\n    var pre = code.parentNode;\n    var above = pre;\n    do {\n      above = above.previousSibling;\n    } while (above.nodeType == Node.TEXT_NODE)\n    // 检查注释元素据\n    if (above.nodeType == Node.COMMENT_NODE) {\n      var comment = above.data;\n      // 正则表达式，获取语言类型\n      var pattern = /^\\s*language:\\s*([\\w\\-]+)\\s*(\\w+)?\\s*$/i;\n      var match = pattern.exec(comment);\n      if (match != null) {\n        var lang = match[1];\n        // 如果是uml，动态生成一个img元素，并设置uml属性值为pre code的内容。\n        if (lang &#x26;&#x26; lang == "uml") {\n          var container = document.createElement("div");          \n          var img = document.createElement("img");\n          img.setAttribute("uml", code.innerText || code.textContent);\n\n          container.appendChild(img);\n          container.className = "text-center";\n\n          pre.insertAdjacentElement(\'afterEnd\', container);\n          // 将pre code隐藏起来，只显示图片\n          pre.style.display = "none";\n          plantuml = true;\n        }\n      }\n    }\n  }\n  // 调用jQuery插件生成图片。\n  if (plantuml) {\n    plantuml_runonce();\n  }\n}\n</code></pre>\n<p>然后，在html中调用：</p>\n<!-- language:lang-html -->\n<pre><code>&#x3C;script type=\'text/javascript\'>\n  window.onload = init;    \n&#x3C;/script>  \n</code></pre>\n<p>搞定，收工！！写作、布局编排、画图全部纯文本，爽！</p>\n<p>附上一个PlantUML的参考文档，原本上sourceforge网站就可以了，可惜被墙了，点击<a href="http://www.learn-scala.net/assets/ebooks/PlantUML_Language_Reference_Guide.pdf.zip">这里</a>下载吧。</p>',id:"/Users/lliu/github/smilingleo.github.io/src/pages/2013/集成PlantUML和Markdown.md absPath of file >>> MarkdownRemark",frontmatter:{date:"2013-11-07T19:16:45.000Z",path:"/2013/markdown-plantuml-integration",title:"边建边学-2：集成PlantUML和Markdown",excerpt:"如何用Markdown+PlantUML结合来写图文并茂的博客。",tags:["markdown","plantuml","blog"]}},{html:'<p>本文将是一个系列文章，循序渐进地介绍本站的构建过程，不只是简单的技术介绍，重点是建站过程遇到的问题分析，以及解决的过程，所以起名<strong>“边建边学”</strong>系列。</p>\n<p>希望对学习<code>Scala</code>+<code>Playframework</code>的童鞋有所启发。</p>\n<p>本篇重点介绍如何用markdown来写技术文章，以及如何优化代码片段。</p>\n<h2>需求</h2>\n<ul>\n<li>用markdown来写博客，对不同代码类型能够进行美化</li>\n<li>技术博客一般会在文中包含部分代码片段，在看文章的时候，如果能运行一下这个代码片段，看看执行结果是什么，会对理解技术有所帮助，所以这里需要一个Web REPL (Read Eval Print Loop)</li>\n<li>博文列表中只显示博文头</li>\n</ul>\n<h2>实现</h2>\n<h3>markdown</h3>\n<p>用Markdown写文章的流程是这样的：</p>\n<ol>\n<li>\n<p>在本地创建md文件，用markdown语法写文章</p>\n<p>markdown语法不是本文的介绍重点，需要温习的童鞋请查看<a href="http://zh.wikipedia.org/zh-cn/Markdown">维基百科</a>，编辑工具可以考虑使用：<a href="http://mouapp.com">Mou</a>，或者chrome插件stackedit。</p>\n</li>\n<li>\n<p>将文章发布到网站。</p>\n<p>发布的最终目的是将文章上传到网站，可以是存到数据库中，可以是上传为一个文件，因为文章的特殊性，创作过程需要跟踪记录，而且md文章本身也是一个文件，所以直接将文件上传搞定。</p>\n<p>具体上传途径是通过git。其实从版本管理的角度，md文件和其他源代码文件没有什么不同。</p>\n</li>\n<li>\n<p>mardkown解析成为HTML</p>\n<p>这个解析有两种选择，一个是在服务器端解析，另外一个是在浏览器端通过javascript来解析。个人觉得没有太大不同，这里选择一个github上开源的工具来实现：<a href="https://github.com/sirthias/pegdown">Pegdown</a>。</p>\n<p>具体代码非常简单：</p>\n</li>\n</ol>\n<!-- language:lang-scala -->\n<pre><code>val processor = new PegDownProcessor()\nval markdownContent = "##title2\\n*item1"\nval htmlContent = processor.markdownToHtml(markdownContent)\n</code></pre>\n<ol start="4">\n<li>\n<p>代码美化</p>\n<p>将MD转换为html之后，代码片段只是被转换为：<code>&#x3C;pre>&#x3C;code> .... &#x3C;/code>&#x3C;/pre></code>，但是如何按照相应语言的语法进行高亮显示呢？其实任何Web效果的东西都没有什么神秘的，只是应用CSS而已。</p>\n<p>这里我们选用的是<a href="https://code.google.com/p/google-code-prettify/">prettify.js</a>，当然，还可以选择其他方案，比如<a href="http://highlightjs.org">highlight.js</a>.</p>\n<p>具体方案如下：</p>\n</li>\n</ol>\n<!-- language:lang-javascript -->\n<pre><code>&#x3C;script type=\'text/javascript\'>\n    function init() {\n        var prettify = false;\n        var blocks = document.querySelectorAll(\'pre code\')\n        for (var i = 0; i &#x3C; blocks.length ; i++) {\n            blocks[i].className += \'prettyprint\';\n            prettify = true;\n        }\n        if (prettify) {\n          prettyPrint();\n        }\n    }\n    window.onload = init;\n&#x3C;/script>\n</code></pre>\n<p>简单说，就是在页面（dom）加载完成之后，查找所有的pre+code元素，然后给该元素class添加<code>prettyprint</code>，这样有了预定义的样式表，代码语法高亮特性就实现了。\n<br>\n代码片段执行的部分将有专门的章节介绍，此处略过。\n</p>\n<h3>博文列表只显示文章头</h3>\n<p>在列表页面，将在一个页面列出大量的内容，如果将每篇文章都完整地列出来，那么页面将变得很长，而且也不方便用户查找，而如果能够只显示文章的开头部分，就可以让读者快速地了解文章大致内容，并且快速浏览近期文章，有选择性地查看文章。</p>\n<p>这个说起来其实很简单，展示部分内容逻辑上也很简单，只是简单截取文章开头的前N个字符而已。总体上是这个思路，可实际上会比这个稍微复杂一些。原因在于博文不是简单的plain text，而是HTML代码，如果只简单截取前面N个字符，极有可能会造成HTML片段不完整导致页面错误。</p>\n<p>知道问题所在之后，解决办法其实也就简单了。我们可以简单分析一下markdown转换为html之后的代码结构，比如：</p>\n<!-- language:lang-html -->\n<pre><code>&#x3C;h1>手工打造博客站点-1: 用Markdown写博文&#x3C;/h1>\n&#x3C;p>本文将是一个系列文章，循序渐进地介绍本站的构建过程，不只是简单的技术介绍，重点是建站过程遇到的问题分析，以及解决的过程。&#x3C;/p>\n&#x3C;p>希望对学习&#x3C;code>Scala&#x3C;/code>+&#x3C;code>Playframework&#x3C;/code>的童鞋有所启发。&#x3C;/p>\n&#x3C;p>本篇重点介绍如何用markdown来写技术文章，以及如何优化代码片段。&#x3C;/p>\n&#x3C;h2>需求&#x3C;/h2>\n……\n</code></pre>\n<p>很明显，标题、段落等html元素都是同级的，所以我们只需要一次计算每个html元素所包含内容的长度，当叠加到超过阀值时，将前面元素内容输出就好了。具体的办法是：先将html字符串解析为XML DOM，然后迭代每个一级children节点。</p>\n<!-- language:lang-scala -->\n<pre><code>val content = Source.fromFile(file, "UTF-8", 1024).mkString\nval htmlContent = "&#x3C;article>" + processor.markdownToHtml(content) + "&#x3C;/article>"\n// only show part of the article\nval xml = scala.xml.XML.loadString(htmlContent)\nvar i: Long = 0L\nval elemList = xml.child.takeWhile( el => { i += el.toString().length; i &#x3C; ConfigUtils.BLOG_HEAD_LENGTH } )\nval part = "&#x3C;article>" + elemList.mkString + s"""&#x3C;p>&#x3C;a href="/blogs/${file.getName}">[...]&#x3C;/a>&#x3C;/p>&#x3C;/article>"""\n</code></pre>\n<p>备注：</p>\n<ul>\n<li>在转换为html之后，需要在外面包一个<code>&#x3C;article></code>容器元素。</li>\n<li>从一个Seq容器元素中截取前面部分元素用<code>takeWhile</code>，此处有一个<code>var</code>可变参数的使用，其实也可以不用，只是用在这里容易一些。</li>\n<li>在最后添加一个指向文章全文的链接。</li>\n</ul>\n<h2>预告</h2>\n<p>下篇，将介绍如何将网页中的代码片段提交到服务器端执行并返回执行结果，也就是Web GUI REPL，敬请关注。</p>',id:"/Users/lliu/github/smilingleo.github.io/src/pages/2013/用markdown写博客.markdown absPath of file >>> MarkdownRemark",frontmatter:{date:"2013-11-01T14:06:45.000Z",path:"/2013/blogging-with-markdown",title:"边建边学-1: 用Markdown写博文",excerpt:"本文将是一个系列文章，循序渐进地介绍本站的构建过程，不只是简单的技术介绍，重点是建站过程遇到的问题分析，以及解决的过程，所以起名**“边建边学”**系列。",tags:["markdown","blog"]}}],tagName:"markdown"}}}});
//# sourceMappingURL=path---tags-markdown-f756f8423fb6f37e9340.js.map