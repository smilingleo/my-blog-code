webpackJsonp([0xfb9da88190b9],{449:function(n,e){n.exports={data:{markdownRemark:{html:'<p>根据Egghead上的教程，做出的博客站点有个缺陷，那就是没有分页功能，对于勤奋的博主来说，在一个页面上显示所有文章列表有点不完美，这里我们改造一下，加入分页功能。</p>\n<h2>步骤</h2>\n<ol>\n<li>引入<code>gatsby-paginate</code>组件</li>\n</ol>\n<pre><code class="language-bash">yarn add gatsby-paginate\n</code></pre>\n<ol start="2">\n<li>增加一个分页链接组件</li>\n</ol>\n<!-- language: lang-js -->\n<pre><code>import React from \'react\'\nimport Link from \'gatsby-link\'\n\nconst PaginateLink = ({ tag, url, text }) => {\n    if (!tag) {\n        return &#x3C;span>&#x3C;Link to={ url }>{ text }&#x3C;/Link>&#x3C;/span>\n    } else {\n        return &#x3C;span>{ text }&#x3C;/span>\n    }\n}\n\nexport default PaginateLink\n</code></pre>\n<ol start="3">\n<li><code>mv pages/index.js templates/</code> 然后编辑</li>\n</ol>\n<!-- language: lang-js -->\n<pre><code>import React from \'react\'\nimport Link from \'gatsby-link\'\n+import PaginateLink from \'./paginateLink\'\n+\n+const IndexPage = ({ data, pathContext }) => {\n+  // for pagination\n+  const { group, index, first, last } = pathContext;\n+  const prevUrl = index - 1 == 1 ? "" : (index - 1).toString();\n+  const nextUrl = (index + 1).toString();\n+  const total = data.allMarkdownRemark.edges.length;\n\n-const IndexPage = ({ data }) => {\nconst { edges: posts } = data.allMarkdownRemark\nreturn (\n    &#x3C;div>\n-      {posts.map(({ node: post }, pIdx) => {\n+      &#x3C;div className="posts">\n+      {group.map(({ node: post }, pIdx) => {\n        const { frontmatter } = post\n-        \n+\n        return (\n        &#x3C;div key={`post_${pIdx}`}>\n            &#x3C;h2>\n@@ -27,6 +35,18 @@ const IndexPage = ({ data }) => {\n        &#x3C;/div>\n        )\n    })}\n+      &#x3C;/div>\n+      &#x3C;div className="paginatation">\n+        &#x3C;div className="prevLink">\n+            &#x3C;PaginateLink tag={ first } url={ prevUrl } text="Prev Page" />\n+        &#x3C;/div>\n+\n+        &#x3C;p>{index} of { Math.ceil(total/12)}&#x3C;/p>\n+\n+        &#x3C;div className="nextLink">\n+            &#x3C;PaginateLink tag={ last } url={ nextUrl } text="Next Page" />\n+        &#x3C;/div>\n+      &#x3C;/div>      \n    &#x3C;/div>\n)\n}\n</code></pre>\n<ol start="4">\n<li>编辑<code>gatsby-node.js</code></li>\n</ol>\n<!-- language: lang-js -->\n<pre><code>+const pagination = require(\'gatsby-paginate\');\n\nconst createTagPages = (createPage, posts) => {\nconst tagPageTemplate = path.resolve(`src/templates/tags.js`)\n@@ -72,6 +73,15 @@ exports.createPages = ({ boundActionCreators, graphql }) => {\n\n    createTagPages(createPage, posts)\n\n+      // default pagination to 10.\n+      pagination({\n+        edges: posts,\n+        createPage: createPage,\n+        pageTemplate: "src/templates/index.js",\n+        pageLength: 10\n+      });\n+\n+\n    posts.forEach(({node}, index) => {\n        createPage({\n        path: node.frontmatter.path,\n</code></pre>\n<ol start="5">\n<li>编辑样式</li>\n<li>重新发布<code>yarn deploy</code></li>\n</ol>',frontmatter:{title:"为Gatsby博客添加分页功能",date:"March 12, 2018",path:"/2018/support-pagination-for-gatsby-blog",tags:["blog","gatsby"],excerpt:"根据Egghead上的教程，做出的博客站点有个缺陷，那就是没有分页功能，对于勤奋的博主来说，在一个页面上显示所有文章列表有点不完美，这里我们改造一下，加入分页功能。"}}},pathContext:{prev:{html:'<h2>问题</h2>\n<p>微服务不好搞。 很多原来在单一应用场景下根本不是问题的小事，在微服务架构之下就变成了大问题，比如：开发环境问题。</p>\n<p>即使你没有微服务经验，简单想象一下，如果你们的系统中有上百个微服务在运行，而你负责开发维护其中一个，你如何做开发、测试？原来单一应用开发时，我们在一台笔记本上全搞定，但把几十个服务一起在本机跑，想想都头疼。先不说你公司配发的机器是否足够强大，就是配置一下环境，让几十个服务一起正常运行起来都不是一个简单的任务。</p>\n<p>不同公司，不同技术栈，解决方式可能稍有不同，但大方向上基本上没有什么不同。</p>\n<h2>几种策略</h2>\n<p>无论何种策略，基本上将服务容器化，是必须的。有了Docker之类的容器之后，才能将某个服务的配置工作简化，想想在没有docker之前，本地安装一下Mysql，配置一下复制，是多么花时间，而通过Docker以及容器的编排工具，比如docker-compose, kubernetes等，每个人都能很容易地搭建一个复杂的运行环境。</p>\n<p>从开发人员的角度看，整个系统可以分为两部分：我在开发的，和我依赖的。我开发的一般运行在IDE中，这样容易调试。我依赖的部分无所谓，运行在什么地方影响不大，关键是如何和我开发的部分能容易的联调。</p>\n<h3>全部在本地跑</h3>\n<p>这种方式比较简单暴力。用一个docker-compose文件，将所有的服务都编织在一起，全部在本地启动。可以将自己开发的运行在HOST上，然后通过端口映射配置依赖关系。</p>\n<p>好处是简单，开发高效。但是随着服务越来越多，这种方式变得不太现实。本地跑100个containers？你的本子上磕个鸡蛋可以很快煎熟了。</p>\n<h3>全部在云端跑</h3>\n<p>这种方式倒是比较现实，所有服务都部署在云端，自己开发的部分也部署上去，远程联调。但是如果要debug一个问题，remote debug的痛苦你可以脑补一下。感觉其他服务不太正常的时候想查其日志，你也会很崩溃。</p>\n<p>嗯，还忘了说，每个开发如果都搞一套系统，你怎么控制成本的问题。</p>\n<h3>部分在本地，部分在云端</h3>\n<p>这是一个折衷的方案，我觉得也是比较理想的方案。就是把你开发的服务和一部分必要的服务在本地跑，其他的在云端。</p>\n<p>问题是：哪些服务在本地跑？哪些放云端？</p>\n<p>回答这个问题，我们就得看看微服务的一般架构是什么样的。</p>\n<h2>微服务的一般架构</h2>\n<p><img src="/static/common-architecture.png" alt="一般架构"></p>\n<p>整个系统可以分为前端和后端两部分，前端作为后端的一个特殊用户，也就是用API来构建你的UI。</p>\n<p>前端，后端有相似之处，那就是系统都有一个入口的控制器Gateway，所有的请求都通过相应的Gateway。而在前端或者后端的黑盒内部，我们可以将服务之间的依赖关系抽象为：</p>\n<!-- language:uml -->\n<pre><code>(A) --> (B)\n(A) --> (C)\n(B) --> (D)\n(C) --> (E)\n(D) -> (E)\n</code></pre>\n<p>图中箭头代表数据流向。</p>\n<h2>划分原则</h2>\n<p>划分哪些服务在本地运行，哪些服务在云端运行的一般原则是：<strong>将向你的服务发送请求的服务放在本地。</strong></p>\n<p>以上图为例，如果你开发的是服务<code>B</code>，那么你需要在本地跑<code>A</code>和<code>B</code>，然后将你本地开发的依赖指向云端的<code>D</code>。你无法和其他的开发者共享<code>A</code>，因为如果一个请求要通过<code>A</code>转发到<code>B</code>，<code>A</code>无法确定应该发送给哪个开发环境下的<code>B</code>。</p>\n<h2>其他的一些技巧</h2>\n<ul>\n<li>共享服务需要提供multi-tenancy的数据隔离能力，否则开发环境之间会相互打架。</li>\n<li>共享开发环境的维护问题，一般情况下运行最新版本，如需特殊版本，需要有高级的LB组件能根据请求中的header将请求route到特定版本。</li>\n</ul>',id:"/volume1/homes/leo/github/my-blog-code/src/pages/2018/微服务架构下的开发环境问题.md absPath of file >>> MarkdownRemark",frontmatter:{date:"2018-03-16T08:06:00.000+08:00",path:"/2018/development-environment-for-microservices",title:"微服务架构下的开发环境问题",excerpt:"本文介绍如何在微服务架构下解决开发环境的搭建、共享的问题。",tags:["微服务","架构","开发环境","microservices"]}},next:{html:"<p>Gatsby打造的博客已经很不错了，但是缺少一个评论功能。</p>\n<p>本文简单介绍如何集成Disqus评论服务到你的博客站点。</p>\n<h2>How To</h2>\n<p>首先，添加<code>react-disqus-thread</code>组件。</p>\n<pre><code>yarn add react-disqus-thread\n</code></pre>\n<p>之后，新建一个<code>Comments</code>的React组件。</p>\n<!-- language: lang-js -->\n<pre><code>const React = require('react');\nconst ReactDisqusThread = require('react-disqus-thread');\n\nclass Comments extends React.Component{\n\n    constructor(props) {\n        super(props);\n    }\n    \n    handleNewComment (comment) {\n        \n    }\n\n    render () {\n        const id = `smilingleo/${window.location.pathname}`;\n        return (\n            &#x3C;ReactDisqusThread\n                shortname=\"smilingleo\"\n                identifier={id}\n                title={this.props.title}\n                onNewComment={this.handleNewComment}/>\n        );\n    }\n};\n\nexport default Comments;\n</code></pre>\n<p>注意:</p>\n<ul>\n<li><code>identifier</code>需要是唯一的，这里我用了<code>smilingleo</code>作为前缀，加上<code>pathname</code>。</li>\n<li><code>onNewComment</code>的响应函数中，可以做一些有意思的东西，比如给你的IM发一条消息，尝试了Slack Webhook，可惜不支持CORS.</li>\n</ul>\n<p>最后，在<code>templates/blog-post.js</code>文件中添加：</p>\n<!-- language: lang-html -->\n<pre><code>&#x3C;hr />\n&#x3C;Comments title={title} />\n</code></pre>\n<p>搞定.</p>\n<h2>References</h2>\n<ol>\n<li><a href=\"https://github.com/mzabriskie/react-disqus-thread\">React Disqus thread component</a></li>\n</ol>",id:"/volume1/homes/leo/github/my-blog-code/src/pages/2018/为你的Gatsby博客添加评论功能.md absPath of file >>> MarkdownRemark",frontmatter:{date:"2018-03-12T10:07:43.000+08:00",path:"/2018/enable-comments-for-gatsby-blog",title:"为你的Gatsby博客添加评论功能",excerpt:"Gatsby打造的博客已经很不错了，但是缺少一个评论功能。本文简单介绍如何集成Disqus评论服务到你的博客站点。",tags:["blog"]}}}}}});
//# sourceMappingURL=path---2018-support-pagination-for-gatsby-blog-48d0edc627325ec990b4.js.map