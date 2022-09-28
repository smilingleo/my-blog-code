webpackJsonp([0xed28d567e2ba],{399:function(e,o){e.exports={pathContext:{posts:[{html:"<h2>起因</h2>\n<p>原来的博客站点基于Jekyll搭建，各种问题，感觉很不爽。后来看到Gatsby，基于ReactJS, GraphQL，都是我的最爱，于是果断投诚！</p>\n<h2>遇到的问题</h2>\n<ul>\n<li>和prettyprint集成的问题</li>\n</ul>\n<p>原来的prettyprint机制是在页面加载的时候调用<code>init()</code>，检查DOM中的<code>pre.code</code>元素。但是转到React之后，全部是前端Routing，原来写的<code>window.onload = init</code>不工作了。每次都要手动刷新。</p>\n<p>解决办法是在Gatsby Link元素的<code>onClick</code>事件中注册一个timer:</p>\n<!-- language: js -->\n<pre><code>&#x3C;Link to={frontmatter.path} onClick={() => setTimeout(init, 100)}>{frontmatter.title}&#x3C;/Link>\n</code></pre>\n<p>这样，在点击链接打开页面之后，就会调用<code>init</code>了。</p>\n<ul>\n<li>发布方法</li>\n</ul>\n<p>原来以为是将这些源码直接push到 <code>smilingleo.github.io</code>，后来发现不对。</p>\n<p>需要有两个github repos，一个 <code>my-blog-code</code>, 另外一个 <code>smilingleo.github.io</code>。</p>\n<p>新的博文写完之后，需要<code>yarn deploy</code>，这样会发布到<code>public/</code>，然后将<code>public</code>目录指向<code>smilingleo.github.io</code>这个repo。</p>\n<p>所以，一篇博客需要提交两个git repos。</p>\n<ul>\n<li>date格式问题</li>\n</ul>\n<p>原来用Jekyll的时候，date可以是<code>YYYY-MM-dd HH:mm:ss</code>的格式，但是用Gatsby必须是<code>YYYY-MM-dd'T'HH:mm:ss</code>。</p>\n<h2>参考资料</h2>\n<ol>\n<li><a href=\"https://egghead.io/courses/build-a-blog-with-react-and-markdown-using-gatsby\">Egghead教程</a></li>\n</ol>",id:"/Users/lliu/github/smilingleo.github.io/src/pages/2018/转用Gatsby搭建博客.md absPath of file >>> MarkdownRemark",frontmatter:{date:"2018-03-08T17:00:00.000+08",path:"/2018/blog-with-gatsby",title:"转用Gatsby打造基于github的博客站点",excerpt:"如何用Gatsby打造一个博客",tags:["blog","github","gatsby"]}}],tagName:"github"}}}});
//# sourceMappingURL=path---tags-github-f2ee7c95ee62c51e234e.js.map