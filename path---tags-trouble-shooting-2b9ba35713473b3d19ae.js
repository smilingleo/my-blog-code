webpackJsonp([0xb27c295579b4],{478:function(a,e){a.exports={pathContext:{posts:[{html:'<p>Scala的学习过程中，经常会碰到一些莫名其妙的现象，很多时候，这些语言层面的“怪象”都与scala编译器或者scala的类型系统有关。</p>\n<p>本文不是对编译器和类型系统的介绍，而是重点介绍遇到这些现象的时候，用什么样的方式，拨开云雾见蓝天，通过这些工具获取一些细节帮你了解编译器和类型系统如何工作。工欲善其事，必先利其器。</p>\n<h2>REPL</h2>\n<p>Read-Evaluate-Print-Loop, 是一个所有学习scala的同学都要掌握的工具，可以帮你快速测试一些代码，了解一些library怎么使用。</p>\n<p>在安装scala之后，命令行下执行<code>scala</code>，就会进入REPL.</p>\n<!-- language: bash -->\n<pre><code>$ scala\nWelcome to Scala version 2.11.1 (Java HotSpot(TM) 64-Bit Server VM, Java 1.6.0_65).\nType in expressions to have them evaluated.\nType :help for more information.\n\nscala>\n</code></pre>\n<p>如果是SBT项目，可以用<code>sbt console</code>进入，之后操作类型，不再重复。</p>\n<h3>模式</h3>\n<p>scala REPL有<a href="http://hongjiang.info/scala-repl-modes/">几种模式</a>，其中比较常用的就是<code>:paste</code>，可以比较方便的输入多行，不过要注意，拷贝粘贴的代码中，不要有Tab，否则会触发auto code completion，出现一堆错误提示。</p>\n<h3>反射</h3>\n<h2>命令行参数</h2>\n<p>通过<code>man scala</code>, <code>man scalac</code>，可以了解scala都有哪些参数可用。注意的是：scala的命令行参数中import了scalac的参数，所以可以在scala命令后面使用任何scalac的参数。其中比较有用的参数有：</p>\n<ul>\n<li><code>-X</code>系列，用于输出高级选项概要。也就是正式支持的选项，向后兼容。</li>\n<li><code>-Y</code>系列。用于输出私有选项信息，可能随版本变化。参见<a href="http://www.scala-lang.org/old/node/9313">[6]</a><a href="http://paulbutcher.com/2010/04/26/scala-compiler-advanced-options/">[7]</a></li>\n</ul>\n<p><code>scala -X</code>，<code>scala -Y</code>可以分别列出当前版本所支持的所有选项。</p>\n<h2>参考</h2>\n<ol>\n<li><a href="http://stackoverflow.com/questions/11055210/whats-the-easiest-way-to-use-reify-get-an-ast-of-an-expression-in-scala">What\'s the easiest way to use reify (get an AST of) an expression in Scala? stackoverflow</a></li>\n<li><a href="http://stackoverflow.com/questions/11392622/how-to-investigate-objects-types-etc-from-scala-repl">How to investigate objects/types/etc. from Scala REPL? stackoverflow</a></li>\n<li><a href="https://www.parleys.com/tutorial/51c38751e4b0d38b54f4625e/chapter0/about">Practical Type Mining in Scala ,  scaladay 2013</a></li>\n<li><a href="http://hongjiang.info/scala-repl-modes/">REPL的几种模式, hongjiang</a></li>\n<li><a href="http://docs.scala-lang.org/overviews/reflection/symbols-trees-types.html">Symbols, Trees, and Types, scalaDoc</a></li>\n<li><a href="http://www.scala-lang.org/old/node/9313">Difference between -Y and -X compiler options, scala user forum</a></li>\n<li><a href="http://paulbutcher.com/2010/04/26/scala-compiler-advanced-options/">Scala Compiler Advanced Options</a></li>\n</ol>',id:"/volume1/homes/leo/github/my-blog-code/src/pages/2015/Scala雾里看花.md absPath of file >>> MarkdownRemark",frontmatter:{date:"2015-04-23T19:16:45.000Z",path:"/2015/scala-trouble-shooting",title:"Scala雾里看花",excerpt:"Scala的学习过程中，经常会碰到一些莫名其妙的现象，很多时候，这些语言层面的“怪象”都与scala编译器或者scala的类型系统有关。本文不是对编译器和类型系统的介绍，而是重点介绍遇到这些现象的时候，用什么样的方式，拨开云雾见蓝天，通过这些工具获取一些细节帮你了解编译器和类型系统如何工作。工欲善其事，必先利其器。",tags:["scala","trouble shooting"]}}],tagName:"trouble shooting"}}}});
//# sourceMappingURL=path---tags-trouble-shooting-2b9ba35713473b3d19ae.js.map