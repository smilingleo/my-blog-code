---
path: "/2013/markdown-plantuml-integration"
date: "2013-11-07T19:16:45.000Z"
title:  "边建边学-2：集成PlantUML和Markdown"
tags: ['markdown', 'plantuml', 'blog']
excerpt: "如何用Markdown+PlantUML结合来写图文并茂的博客。"
---

Markdown是一个很爽的写作格式（或者说语言更合适一点），我们不再需要复杂的富文本编辑器，用纯文本就可以编写出布局漂亮的文章。

不过Markdown对于技术类文章来说还有一个不足：我们经常需要画一些图来阐述自己的思路，但是Markdown只能引用已经存在的图。

有没有可能用Plain Text来画图呢？AscII艺术图？太原始了。试试PlantUML吧。
##PlantUML介绍
从某个角度说，[PlantUML](http://plantuml.sourceforge.net)简直就是Markdown的绝配，也只需要纯文本就可以实现漂亮的效果，只是这里变成更炫的UML图。

比如我想画一个类图，Cat和Dog继承Animal，用PlantUML来实现就是：

    @startuml
    Animal <|-- Cat
    Animal <|-- Dog
    @enduml
    
是不是很简单？来看看效果：

<!-- language:uml -->
    Animal <|-- Cat
    Animal <|-- Dog
    
怎么样？不错吧，这个图片哪里来的？其实在我发布这篇文章的时候，这个类图还不存在，只有在你访问这篇文章的时候才自动生成的。PlantUML有一个jQuery插件，可以在运行时生成图片。

PlantUML的jQuery插件用法很简单，你只需要在html中编辑：

<!-- language:lang-html -->
    <img uml="
      Animal <|-- Cat
      Animal <|-- Dog
    ">
    
jQuery插件会自动增强这个img元素，具体实现还挺有意思，这里不细说了。

可这还不够，怎么在Markdown中写`img`呢？如果你照抄上面的img代码，pegdown解析器会抛错，'<'不匹配云云。

##解决方案
基本上这种问题可以从两个方面想办法，一个是服务器端，实现一个markdown parser plugin，来定制一个特殊语法，另一个方向是从浏览器端想办法。

从上面的介绍中我们知道，已经有jQuery插件了，那从前端做似乎更加容易一些。此外，从[上一篇](http://www.learn-scala.net/blogs/2013-11-01_14.md)我们已经知道，在`pre code`前面加上一个`<!-- language:lang-scala -->`来实现语法高亮显示问题。

PlantUML的内容也可以认为是一种code，很自然地，我们可以用`pre code`来封装。比如我们可以用：

<!-- language:lang-html -->
	<!-- language:uml -->
	    Animal <|-- Cat
	    Animal <|-- Dog

这里我们自定义了一种language类型`uml`，在前端解析的时候，就能知道这个代码块是用来画图的了。

好，我们来看前端JS代码的实现：

<!-- language:lang-javascript -->
    function init() {
      var plantuml = false;
      var blocks = document.querySelectorAll('pre code');
      // 遍历所有pre code
      for (var i = 0; i < blocks.length; i += 1) {
        var code = blocks[i];
        //code.className += ' prettyprint';
        var pre = code.parentNode;
        var above = pre;
        do {
          above = above.previousSibling;
        } while (above.nodeType == Node.TEXT_NODE)
        // 检查注释元素据
        if (above.nodeType == Node.COMMENT_NODE) {
          var comment = above.data;
          // 正则表达式，获取语言类型
          var pattern = /^\s*language:\s*([\w\-]+)\s*(\w+)?\s*$/i;
          var match = pattern.exec(comment);
          if (match != null) {
            var lang = match[1];
			// 如果是uml，动态生成一个img元素，并设置uml属性值为pre code的内容。
            if (lang && lang == "uml") {
              var container = document.createElement("div");          
              var img = document.createElement("img");
              img.setAttribute("uml", code.innerText || code.textContent);

              container.appendChild(img);
              container.className = "text-center";

              pre.insertAdjacentElement('afterEnd', container);
              // 将pre code隐藏起来，只显示图片
              pre.style.display = "none";
              plantuml = true;
            }
          }
        }
      }
	  // 调用jQuery插件生成图片。
      if (plantuml) {
        plantuml_runonce();
      }
    }

然后，在html中调用：

<!-- language:lang-html -->
    <script type='text/javascript'>
      window.onload = init;    
    </script>  

搞定，收工！！写作、布局编排、画图全部纯文本，爽！

附上一个PlantUML的参考文档，原本上sourceforge网站就可以了，可惜被墙了，点击[这里](http://www.learn-scala.net/assets/ebooks/PlantUML_Language_Reference_Guide.pdf.zip)下载吧。