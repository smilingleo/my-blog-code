webpackJsonp([42213546547072],{450:function(e,t){e.exports={data:{markdownRemark:{html:'<h1>Stable Diffusion Prompt技巧</h1>\n<p>最近生成类AI技术火热，编程有Github Copilot, 文字转图片有Stable Diffusion。我自己已经用上了Copilot，感觉还是挺有用的。</p>\n<p>周末尝试了一下Stable Diffusion，刚开始感觉这个东西就是个黑魔法，用文字描述你想画的东西，AI就能帮你生成图片。可怎么能生成好看的图片呢？除了一堆搞不懂的调节参数，你好像能控制的只有输入的文字了。</p>\n<p>对于普通用户，你只能不断地试各种输入，不明就理地无脑乱撞。由此，还诞生了个新名词：Prompt Smithing，我自己翻译成了“提词匠”。一定意义上，人就变成了AI助理，我们完全没有掌控能力。</p>\n<p>基于目前机器学习的原理，底层具体是怎么工作的，确实是个黑盒子，很难预测其行为（反过来说，如果我们能准确预测其行为，也就不需要机器学习了），只能不断尝试。不过，懂一些基本的工作原理还是能帮助我们提高效率和准确率的。</p>\n<h2>工作原理</h2>\n<p>Stable Diffusion能画画的原理来源于其学习方式：从互联网上抓取海量的“图片-标题”信息，识别后将其归类进一个“超维空间”。不同的关键词周围有大量的该关键词的图片，从一个关键词移动到另外一个关键词，图片的内容会逐渐向目标关键词演化。</p>\n<p>“trending on artstation"能起作用的原理，就是因为在"artstation", "flickr"等网站上的照片都比较好看，所以我们生成的图片应该尽量靠近这些关键词周边的图片。</p>\n<p>"Octane Render"(显卡渲染，一家新西兰公司的技术)之所以能起作用，也是因为该公司以3d渲染高画质闻名。</p>\n<p>不同的画里面关键词的权重也不同，强权重的关键词会冲淡弱关键词的效果。</p>\n<p>提词出现的顺序也有一定关系。参照上面的原理，提词顺序可能代表不同的路径。</p>\n<p>很多时候，关键字和图片的关联关系不一定是有意义的，也可能只是因为习惯或者由于机器抓取图片标题时，对标题的错误解析，导致AI误以为某些关键词和图片有关联。比如中文标点符号“，”和图片水印。所以，如果遇到这个问题就得把逗号等作为negative prompt过滤掉。</p>\n<h2>最佳实践</h2>\n<p>提词应该带有下面的内容：</p>\n<ol>\n<li>画面主题描述</li>\n<li>风格，比如油画，概念画等等</li>\n<li>艺术家，比如梵高，毕加索等</li>\n</ol>\n<h2>参考资料</h2>\n<ul>\n<li><a href="https://github.com/IDEA-CCNL/Fengshenbang-LM/blob/main/fengshen/examples/stable_diffusion_chinese/taiyi_handbook.md">AI人类助理</a></li>\n<li><a href="https://www.howtogeek.com/833169/how-to-write-an-awesome-stable-diffusion-prompt/">How to write an awesome stable diffusion prompt</a></li>\n<li><a href="https://huggingface.co/stabilityai/stable-diffusion-2">Stable Diffusion 2</a></li>\n<li><a href="https://huggingface.co/spaces/Gustavosta/MagicPrompt-Stable-Diffusion">Magic Prompt (generator)</a></li>\n<li><a href="https://medium.com/@soapsudtycoon/stable-diffusion-trending-on-art-station-and-other-myths-c09b09084e33">Trending on artstation and other myths - part 1</a> - <a href="https://medium.com/@soapsudtycoon/prompt-engineering-trending-on-artstation-and-other-myths-part-2-d61e25a90517">Trending on artstation and other myths - part 2</a> (好文，建议读读)</li>\n</ul>',frontmatter:{title:"Stable Diffusion Prompt技巧",date:"November 29, 2022",path:"/2022/stable-diffusion-prompt-tips",tags:["AI","stable diffusion","机器学习"],excerpt:""}}},pathContext:{prev:null,next:{html:'<p>技术圈技术潮流真的是三十年河东，三十年河西。SOA不温不火N多年之后，换了个包装变成Microservice，就火了；之前很多RAD框架，很多DDD框架及产品也是很多年之后随着Low Code/No Code开始火了。Web圈感觉更是如此。服务端渲染框架如JSP在被以Angular, React, Vue等浏览器端渲染的SPA技术吊打多年之后，现在又逐渐开始有东山再起的苗头了。<a href="https://htmx.org/">HTMX</a>技术就是一个例子。</p>\n<p>其实这个技术本身也并不如何神奇，号称让任何html元素变成可ajax也不如何特殊，通过简单的javascript event callback机制都可以实现，不过HTMX采用声明式的定义，将需要用到Javascript的地方都用html element attribute来定义，就让一切变得不那么一样。看上去就像是一个纯静态的html</p>\n<pre><code class="language-html">&#x3C;div hx-post="/mouse_entered" hx-trigger="mouseenter once">\n    [Here Mouse, Mouse!]\n&#x3C;/div>\n</code></pre>\n<p>就是不知道将来会不会直接也变成一个新的HTML标准。</p>\n<h3>What HTMX Does</h3>\n<ul>\n<li>server side rendering</li>\n<li>empower any HTML element with the ability to send AJAX call (all HTTP methods)</li>\n<li>dynamically replace HTML of specified scope</li>\n</ul>\n<h3>Thymeleaf Template Engine</h3>\n<ul>\n<li>server side template engine</li>\n<li>Freemarker vs Velocity (markup tag based rather than plain text based?)</li>\n<li>layout :: fragment</li>\n<li>SpringMVC, return the <code>layout :: fragment</code></li>\n</ul>\n<p><a href="https://www.thymeleaf.org/doc/tutorials/3.0/thymeleafspring.html">https://www.thymeleaf.org/doc/tutorials/3.0/thymeleafspring.html</a></p>\n<h3>WebJars</h3>\n<ul>\n<li>wrap javascript libraries using Jars</li>\n<li>loading static assets???? </li>\n</ul>\n<h1>reading-note #web</h1>',id:"/volume1/homes/leo/github/my-blog-code/src/pages/2022/HTMX.md absPath of file >>> MarkdownRemark",frontmatter:{date:"2022-10-20T13:00:35.000+08:00",path:"/2022/server-side-rendering-htmx",title:"新服务器端渲染Web技术：HTMX",excerpt:"",tags:["htmx","web"]}}}}}});
//# sourceMappingURL=path---2022-stable-diffusion-prompt-tips-a8a2d8ceade506a7aad6.js.map