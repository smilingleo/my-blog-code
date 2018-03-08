---
path: "/2013/blogging-with-markdown"
date: "2013-11-01T14:06:45.000Z"
title:   "边建边学-1: 用Markdown写博文"
tags: ['markdown', 'blog']
excerpt: "本文将是一个系列文章，循序渐进地介绍本站的构建过程，不只是简单的技术介绍，重点是建站过程遇到的问题分析，以及解决的过程，所以起名**“边建边学”**系列。"
---

本文将是一个系列文章，循序渐进地介绍本站的构建过程，不只是简单的技术介绍，重点是建站过程遇到的问题分析，以及解决的过程，所以起名**“边建边学”**系列。

希望对学习`Scala`+`Playframework`的童鞋有所启发。

本篇重点介绍如何用markdown来写技术文章，以及如何优化代码片段。

##需求
* 用markdown来写博客，对不同代码类型能够进行美化
* 技术博客一般会在文中包含部分代码片段，在看文章的时候，如果能运行一下这个代码片段，看看执行结果是什么，会对理解技术有所帮助，所以这里需要一个Web REPL (Read Eval Print Loop)
* 博文列表中只显示博文头

##实现
###markdown
用Markdown写文章的流程是这样的：

1. 在本地创建md文件，用markdown语法写文章

    markdown语法不是本文的介绍重点，需要温习的童鞋请查看[维基百科](http://zh.wikipedia.org/zh-cn/Markdown)，编辑工具可以考虑使用：[Mou](http://mouapp.com)，或者chrome插件stackedit。

2. 将文章发布到网站。

    发布的最终目的是将文章上传到网站，可以是存到数据库中，可以是上传为一个文件，因为文章的特殊性，创作过程需要跟踪记录，而且md文章本身也是一个文件，所以直接将文件上传搞定。

    具体上传途径是通过git。其实从版本管理的角度，md文件和其他源代码文件没有什么不同。

3. mardkown解析成为HTML

    这个解析有两种选择，一个是在服务器端解析，另外一个是在浏览器端通过javascript来解析。个人觉得没有太大不同，这里选择一个github上开源的工具来实现：[Pegdown](https://github.com/sirthias/pegdown)。

    具体代码非常简单：

<!-- language:lang-scala -->
    val processor = new PegDownProcessor()
    val markdownContent = "##title2\n*item1"
    val htmlContent = processor.markdownToHtml(markdownContent)


4. 代码美化

    将MD转换为html之后，代码片段只是被转换为：`<pre><code> .... </code></pre>`，但是如何按照相应语言的语法进行高亮显示呢？其实任何Web效果的东西都没有什么神秘的，只是应用CSS而已。
    
    这里我们选用的是[prettify.js](https://code.google.com/p/google-code-prettify/)，当然，还可以选择其他方案，比如[highlight.js](http://highlightjs.org).
    
    具体方案如下：
    
<!-- language:lang-javascript -->
    <script type='text/javascript'>
        function init() {
            var prettify = false;
            var blocks = document.querySelectorAll('pre code')
            for (var i = 0; i < blocks.length ; i++) {
                blocks[i].className += 'prettyprint';
                prettify = true;
            }
            if (prettify) {
              prettyPrint();
            }
        }
        window.onload = init;
    </script>


简单说，就是在页面（dom）加载完成之后，查找所有的pre+code元素，然后给该元素class添加`prettyprint`，这样有了预定义的样式表，代码语法高亮特性就实现了。
    
代码片段执行的部分将有专门的章节介绍，此处略过。
    
###博文列表只显示文章头
在列表页面，将在一个页面列出大量的内容，如果将每篇文章都完整地列出来，那么页面将变得很长，而且也不方便用户查找，而如果能够只显示文章的开头部分，就可以让读者快速地了解文章大致内容，并且快速浏览近期文章，有选择性地查看文章。

这个说起来其实很简单，展示部分内容逻辑上也很简单，只是简单截取文章开头的前N个字符而已。总体上是这个思路，可实际上会比这个稍微复杂一些。原因在于博文不是简单的plain text，而是HTML代码，如果只简单截取前面N个字符，极有可能会造成HTML片段不完整导致页面错误。

知道问题所在之后，解决办法其实也就简单了。我们可以简单分析一下markdown转换为html之后的代码结构，比如：

<!-- language:lang-html -->
    <h1>手工打造博客站点-1: 用Markdown写博文</h1>
    <p>本文将是一个系列文章，循序渐进地介绍本站的构建过程，不只是简单的技术介绍，重点是建站过程遇到的问题分析，以及解决的过程。</p>
    <p>希望对学习<code>Scala</code>+<code>Playframework</code>的童鞋有所启发。</p>
    <p>本篇重点介绍如何用markdown来写技术文章，以及如何优化代码片段。</p>
    <h2>需求</h2>
    ……


很明显，标题、段落等html元素都是同级的，所以我们只需要一次计算每个html元素所包含内容的长度，当叠加到超过阀值时，将前面元素内容输出就好了。具体的办法是：先将html字符串解析为XML DOM，然后迭代每个一级children节点。

<!-- language:lang-scala -->

    val content = Source.fromFile(file, "UTF-8", 1024).mkString
    val htmlContent = "<article>" + processor.markdownToHtml(content) + "</article>"
    // only show part of the article
    val xml = scala.xml.XML.loadString(htmlContent)
    var i: Long = 0L
    val elemList = xml.child.takeWhile( el => { i += el.toString().length; i < ConfigUtils.BLOG_HEAD_LENGTH } )
    val part = "<article>" + elemList.mkString + s"""<p><a href="/blogs/${file.getName}">[...]</a></p></article>"""


备注：

* 在转换为html之后，需要在外面包一个`<article>`容器元素。
* 从一个Seq容器元素中截取前面部分元素用`takeWhile`，此处有一个`var`可变参数的使用，其实也可以不用，只是用在这里容易一些。
* 在最后添加一个指向文章全文的链接。

##预告
下篇，将介绍如何将网页中的代码片段提交到服务器端执行并返回执行结果，也就是Web GUI REPL，敬请关注。