webpackJsonp([0x928db457ca31],{479:function(n,e){n.exports={pathContext:{posts:[{html:'<p>经常看到很多示例代码，简洁的让人爱不释手，可是真正自己实现的时候，不得不添加各种各样的异常处理逻辑，最后发现代码总量的80%都是再做异常处理，而真正的代码逻辑只有很少的一部分。</p>\n<p>异常处理对于指令式和函数式编程都是同样需要的，只是因为实现方式的不同，让函数式编程看上去更加简洁，优雅，不需要像指令式那么繁琐。</p>\n<p>本文的目的，就是介绍函数式编程中常用的一些异常处理策略。记得把这些瑞士军刀放到你的百宝箱中，以后一定用得上。</p>\n<h2>空判断Option</h2>\n<p>如果采访100个程序员，让所有人投票他们在编程时最讨厌做的事情，但又经常犯错误的地方，我估计十有八九会是“空判断”了。</p>\n<p><code>Null</code>代表着一个对象还没有被初始化，具体点是对象的指针还没有一个确切的地址。在面向对象编程时，因为操作的都是对象，为了避免在一个<code>null</code>上面调用方法，或者 get一个<code>null</code>上的属性，而导致“空值异常”，程序员不得不做下面的事情：</p>\n<p>假设有下面一个场景：</p>\n<!-- language:uml -->\n<pre><code>Selling --> Store\nSelling --> Product\n</code></pre>\n<p>简单说，一个商场内有很多商店(Store)，每个商店卖(Selling)很多种商品(Product)，如果希望找出所有销售玩具的商店：</p>\n<!-- language:java -->\n<pre><code>public List&#x3C;Store> findByProductCategory(Category category) {\n  if (category == null)               &#x3C;1>\n    return null;\n  List&#x3C;Product> allProducts = getAllProducts(); // DB lookup\n  for (Product prod : allProducts) {\n    if (prod.category == null)        &#x3C;2>\n      continue; \n    if (category.equals(prod.category)){\n    \n</code></pre>\n<h2>参考</h2>\n<ol>\n<li><a href="https://tersesystems.com/2012/12/27/error-handling-in-scala/">Error Handling in Scala. https://tersesystems.com/2012/12/27/error-handling-in-scala. 2012</a></li>\n</ol>',id:"/volume1/homes/leo/github/my-blog-code/src/pages/2014/Scala函数式异常处理.md absPath of file >>> MarkdownRemark",frontmatter:{date:"2014-05-04T07:16:45.000Z",path:"/2014/scala-error-handling-in-fp-style",title:"Scala函数式异常处理",excerpt:"经常看到很多示例代码，简洁的让人爱不释手，可是真正自己实现的时候，不得不添加各种各样的异常处理逻辑，最后发现代码总量的80%都是再做异常处理，而真正的代码逻辑只有很少的一部分。",tags:["scala","functional programming","exception handling"]}}],tagName:"exception handling"}}}});
//# sourceMappingURL=path---tags-exception-handling-3a293afcf429f16a85c1.js.map