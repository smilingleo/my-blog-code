webpackJsonp([0xe183a462a218],{445:function(e,n){e.exports={data:{markdownRemark:{html:'<h2>问题</h2>\n<p>微服务不好搞。 很多原来在单一应用场景下根本不是问题的小事，在微服务架构之下就变成了大问题，比如：开发环境问题。</p>\n<p>即使你没有微服务经验，简单想象一下，如果你们的系统中有上百个微服务在运行，而你负责开发维护其中一个，你如何做开发、测试？原来单一应用开发时，我们在一台笔记本上全搞定，但把几十个服务一起在本机跑，想想都头疼。先不说你公司配发的机器是否足够强大，就是配置一下环境，让几十个服务一起正常运行起来都不是一个简单的任务。</p>\n<p>不同公司，不同技术栈，解决方式可能稍有不同，但大方向上基本上没有什么不同。</p>\n<h2>几种策略</h2>\n<p>无论何种策略，基本上将服务容器化，是必须的。有了Docker之类的容器之后，才能将某个服务的配置工作简化，想想在没有docker之前，本地安装一下Mysql，配置一下复制，是多么花时间，而通过Docker以及容器的编排工具，比如docker-compose, kubernetes等，每个人都能很容易地搭建一个复杂的运行环境。</p>\n<p>从开发人员的角度看，整个系统可以分为两部分：我在开发的，和我依赖的。我开发的一般运行在IDE中，这样容易调试。我依赖的部分无所谓，运行在什么地方影响不大，关键是如何和我开发的部分能容易的联调。</p>\n<h3>全部在本地跑</h3>\n<p>这种方式比较简单暴力。用一个docker-compose文件，将所有的服务都编织在一起，全部在本地启动。可以将自己开发的运行在HOST上，然后通过端口映射配置依赖关系。</p>\n<p>好处是简单，开发高效。但是随着服务越来越多，这种方式变得不太现实。本地跑100个containers？你的本子上磕个鸡蛋可以很快煎熟了。</p>\n<h3>全部在云端跑</h3>\n<p>这种方式倒是比较现实，所有服务都部署在云端，自己开发的部分也部署上去，远程联调。但是如果要debug一个问题，remote debug的痛苦你可以脑补一下。感觉其他服务不太正常的时候想查其日志，你也会很崩溃。</p>\n<p>嗯，还忘了说，每个开发如果都搞一套系统，你怎么控制成本的问题。</p>\n<h3>部分在本地，部分在云端</h3>\n<p>这是一个折衷的方案，我觉得也是比较理想的方案。就是把你开发的服务和一部分必要的服务在本地跑，其他的在云端。</p>\n<p>问题是：哪些服务在本地跑？哪些放云端？</p>\n<p>回答这个问题，我们就得看看微服务的一般架构是什么样的。</p>\n<h2>微服务的一般架构</h2>\n<p><img src="/static/common-architecture.png" alt="一般架构"></p>\n<p>整个系统可以分为前端和后端两部分，前端作为后端的一个特殊用户，也就是用API来构建你的UI。</p>\n<p>前端，后端有相似之处，那就是系统都有一个入口的控制器Gateway，所有的请求都通过相应的Gateway。而在前端或者后端的黑盒内部，我们可以将服务之间的依赖关系抽象为：</p>\n<!-- language:uml -->\n<pre><code>(A) --> (B)\n(A) --> (C)\n(B) --> (D)\n(C) --> (E)\n(D) -> (E)\n</code></pre>\n<p>图中箭头代表数据流向。</p>\n<h2>划分原则</h2>\n<p>划分哪些服务在本地运行，哪些服务在云端运行的一般原则是：<strong>将向你的服务发送请求的服务放在本地。</strong></p>\n<p>以上图为例，如果你开发的是服务<code>B</code>，那么你需要在本地跑<code>A</code>和<code>B</code>，然后将你本地开发的依赖指向云端的<code>D</code>。你无法和其他的开发者共享<code>A</code>，因为如果一个请求要通过<code>A</code>转发到<code>B</code>，<code>A</code>无法确定应该发送给哪个开发环境下的<code>B</code>。</p>\n<h2>其他的一些技巧</h2>\n<ul>\n<li>共享服务需要提供multi-tenancy的数据隔离能力，否则开发环境之间会相互打架。</li>\n<li>共享开发环境的维护问题，一般情况下运行最新版本，如需特殊版本，需要有高级的LB组件能根据请求中的header将请求route到特定版本。</li>\n</ul>',frontmatter:{title:"微服务架构下的开发环境问题",date:"March 16, 2018",path:"/2018/development-environment-for-microservices",tags:["微服务","架构","开发环境","microservices"],excerpt:"本文介绍如何在微服务架构下解决开发环境的搭建、共享的问题。"}}},pathContext:{prev:{html:'<h2>HTTP/1.1 vs HTTP/2</h2>\n<ul>\n<li>基于二进制的</li>\n<li>多路复用，用一个连接并行发送多个请求</li>\n<li>压缩header以降低开销</li>\n<li>允许server端主动push</li>\n</ul>\n<h2>测试</h2>\n<h3>工具</h3>\n<ul>\n<li><a href="https://nghttp2.org/">nghttp</a></li>\n<li>Apache Benchmark</li>\n</ul>\n<h3>测试场景</h3>\n<p>找一个同时支持http/1.1和http/2的站点，分别以两种不同的协议，发送100个请求，比较执行时间。对于http/1.1，使用10个并发（否者输的更惨）。</p>\n<h3>HTTP/1.1</h3>\n<pre><code>ab -n 100 -c 10  https://nghttp2.org/httpbin/headers\nThis is ApacheBench, Version 2.3 &#x3C;$Revision: 1807734 $>\nCopyright 1996 Adam Twiss, Zeus Technology Ltd, http://www.zeustech.net/\nLicensed to The Apache Software Foundation, http://www.apache.org/\n\nBenchmarking nghttp2.org (be patient).....done\n\n\nServer Software:        nghttpx\nServer Hostname:        nghttp2.org\nServer Port:            443\nSSL/TLS Protocol:       TLSv1.2,ECDHE-ECDSA-AES256-GCM-SHA384,256,256\nTLS Server Name:        nghttp2.org\n\nDocument Path:          /httpbin/headers\nDocument Length:        160 bytes\n\nConcurrency Level:      10\nTime taken for tests:   22.536 seconds\nComplete requests:      100\nFailed requests:        0\nTotal transferred:      56695 bytes\nHTML transferred:       16000 bytes\nRequests per second:    4.44 [#/sec] (mean)\nTime per request:       2253.574 [ms] (mean)\nTime per request:       225.357 [ms] (mean, across all concurrent requests)\nTransfer rate:          2.46 [Kbytes/sec] received\n\nConnection Times (ms)\n              min  mean[+/-sd] median   max\nConnect:     1454 1588 185.8   1571    3351\nProcessing:   488  519  25.3    520     614\nWaiting:      487  519  25.2    520     614\nTotal:       1963 2107 182.7   2094    3849\n\nPercentage of the requests served within a certain time (ms)\n  50%   2094\n  66%   2107\n  75%   2123\n  80%   2130\n  90%   2161\n  95%   2171\n  98%   2178\n  99%   3849\n 100%   3849 (longest request)\n</code></pre>\n<p>可以看到，并发10发送100个请求总共花了<code>22.5</code>秒。</p>\n<h3>HTTP/2</h3>\n<pre><code>time nghttp -n -m 100 https://nghttp2.org/httpbin/headers\n\nreal    0m2.626s\nuser    0m0.013s\nsys 0m0.007s\n</code></pre>\n<p>Note: <code>-n</code>丢弃输出。</p>\n<p>从输出可以看到，100个请求花了<code>2.6</code>秒，完胜http/1.1！</p>\n<h2>Bonus</h2>\n<p>用<code>nghttp -v</code>可以观察到http2多路复用的过程。</p>\n<pre><code>nghttp -v -m 2 https://nghttp2.org/httpbin/headers\n[  1.213] Connected\nThe negotiated protocol: h2\n[  2.321] recv SETTINGS frame &#x3C;length=24, flags=0x00, stream_id=0>\n          (niv=4)\n          [SETTINGS_MAX_CONCURRENT_STREAMS(0x03):100]\n          [SETTINGS_INITIAL_WINDOW_SIZE(0x04):1048576]\n          [UNKNOWN(0x08):1]\n          [SETTINGS_HEADER_TABLE_SIZE(0x01):8192]\n[  2.321] send SETTINGS frame &#x3C;length=12, flags=0x00, stream_id=0>\n          (niv=2)\n          [SETTINGS_MAX_CONCURRENT_STREAMS(0x03):100]\n          [SETTINGS_INITIAL_WINDOW_SIZE(0x04):65535]\n[  2.321] send SETTINGS frame &#x3C;length=0, flags=0x01, stream_id=0>\n          ; ACK\n          (niv=0)\n[  2.321] send PRIORITY frame &#x3C;length=5, flags=0x00, stream_id=3>\n          (dep_stream_id=0, weight=201, exclusive=0)\n[  2.321] send PRIORITY frame &#x3C;length=5, flags=0x00, stream_id=5>\n          (dep_stream_id=0, weight=101, exclusive=0)\n[  2.321] send PRIORITY frame &#x3C;length=5, flags=0x00, stream_id=7>\n          (dep_stream_id=0, weight=1, exclusive=0)\n[  2.321] send PRIORITY frame &#x3C;length=5, flags=0x00, stream_id=9>\n          (dep_stream_id=7, weight=1, exclusive=0)\n[  2.321] send PRIORITY frame &#x3C;length=5, flags=0x00, stream_id=11>\n          (dep_stream_id=3, weight=1, exclusive=0)\n[  2.321] send HEADERS frame &#x3C;length=52, flags=0x25, stream_id=13>\n          ; END_STREAM | END_HEADERS | PRIORITY\n          (padlen=0, dep_stream_id=11, weight=16, exclusive=0)\n          ; Open new stream\n          :method: GET\n          :path: /httpbin/headers\n          :scheme: https\n          :authority: nghttp2.org\n          accept: */*\n          accept-encoding: gzip, deflate\n          user-agent: nghttp2/1.31.0\n[  2.321] send HEADERS frame &#x3C;length=25, flags=0x25, stream_id=15>\n          ; END_STREAM | END_HEADERS | PRIORITY\n          (padlen=0, dep_stream_id=11, weight=16, exclusive=0)\n          ; Open new stream\n          :method: GET\n          :path: /httpbin/headers\n          :scheme: https\n          :authority: nghttp2.org\n          accept: */*\n          accept-encoding: gzip, deflate\n          user-agent: nghttp2/1.31.0\n[  2.904] recv SETTINGS frame &#x3C;length=0, flags=0x01, stream_id=0>\n          ; ACK\n          (niv=0)\n[  2.904] recv (stream_id=13) :status: 200\n[  2.904] recv (stream_id=13) date: Mon, 19 Mar 2018 03:39:26 GMT\n[  2.904] recv (stream_id=13) content-type: application/json\n[  2.904] recv (stream_id=13) content-length: 170\n[  2.904] recv (stream_id=13) access-control-allow-origin: *\n[  2.904] recv (stream_id=13) access-control-allow-credentials: true\n[  2.904] recv (stream_id=13) x-backend-header-rtt: 0.00342\n[  2.904] recv (stream_id=13) strict-transport-security: max-age=31536000\n[  2.904] recv (stream_id=13) server: nghttpx\n[  2.904] recv (stream_id=13) via: 1.1 nghttpx\n[  2.904] recv (stream_id=13) x-frame-options: SAMEORIGIN\n[  2.904] recv (stream_id=13) x-xss-protection: 1; mode=block\n[  2.904] recv (stream_id=13) x-content-type-options: nosniff\n[  2.904] recv HEADERS frame &#x3C;length=201, flags=0x04, stream_id=13>\n          ; END_HEADERS\n          (padlen=0)\n          ; First response header\n{\n  "headers": {\n    "Accept": "*/*",\n    "Accept-Encoding": "gzip, deflate",\n    "Host": "nghttp2.org",\n    "User-Agent": "nghttp2/1.31.0",\n    "Via": "2 nghttpx"\n  }\n}\n[  2.904] recv DATA frame &#x3C;length=170, flags=0x01, stream_id=13>\n          ; END_STREAM\n[  2.905] recv (stream_id=15) :status: 200\n[  2.905] recv (stream_id=15) date: Mon, 19 Mar 2018 03:39:26 GMT\n[  2.905] recv (stream_id=15) content-type: application/json\n[  2.905] recv (stream_id=15) content-length: 170\n[  2.905] recv (stream_id=15) access-control-allow-origin: *\n[  2.905] recv (stream_id=15) access-control-allow-credentials: true\n[  2.905] recv (stream_id=15) x-backend-header-rtt: 0.003112\n[  2.905] recv (stream_id=15) strict-transport-security: max-age=31536000\n[  2.905] recv (stream_id=15) server: nghttpx\n[  2.905] recv (stream_id=15) via: 1.1 nghttpx\n[  2.905] recv (stream_id=15) x-frame-options: SAMEORIGIN\n[  2.905] recv (stream_id=15) x-xss-protection: 1; mode=block\n[  2.905] recv (stream_id=15) x-content-type-options: nosniff\n[  2.905] recv HEADERS frame &#x3C;length=25, flags=0x04, stream_id=15>\n          ; END_HEADERS\n          (padlen=0)\n          ; First response header\n{\n  "headers": {\n    "Accept": "*/*",\n    "Accept-Encoding": "gzip, deflate",\n    "Host": "nghttp2.org",\n    "User-Agent": "nghttp2/1.31.0",\n    "Via": "2 nghttpx"\n  }\n}\n[  2.905] recv DATA frame &#x3C;length=170, flags=0x01, stream_id=15>\n          ; END_STREAM\n[  2.905] send GOAWAY frame &#x3C;length=8, flags=0x00, stream_id=0>\n          (last_stream_id=0, error_code=NO_ERROR(0x00), opaque_data(0)=[])\n</code></pre>\n<p>从输出可以看到，发送两个请求，用http2只打开一个连接，并且第二个请求并没有等第一个完成之后再发送，而是同步地发送。</p>',id:"/volume1/homes/leo/github/my-blog-code/src/pages/2018/简单比较下http2和http1.1的性能.md absPath of file >>> MarkdownRemark",frontmatter:{date:"2018-03-19T11:24:24.000+08:00",path:"/2018/simple-performance-comparison-between-http2-and-http1",title:"简单比较下http/2和http/1.1的性能",excerpt:"简单对比http/1.1和http/2的性能",tags:["http/2","测试"]}},next:{html:'<p>根据Egghead上的教程，做出的博客站点有个缺陷，那就是没有分页功能，对于勤奋的博主来说，在一个页面上显示所有文章列表有点不完美，这里我们改造一下，加入分页功能。</p>\n<h2>步骤</h2>\n<ol>\n<li>引入<code>gatsby-paginate</code>组件</li>\n</ol>\n<pre><code class="language-bash">yarn add gatsby-paginate\n</code></pre>\n<ol start="2">\n<li>增加一个分页链接组件</li>\n</ol>\n<!-- language: lang-js -->\n<pre><code>import React from \'react\'\nimport Link from \'gatsby-link\'\n\nconst PaginateLink = ({ tag, url, text }) => {\n    if (!tag) {\n        return &#x3C;span>&#x3C;Link to={ url }>{ text }&#x3C;/Link>&#x3C;/span>\n    } else {\n        return &#x3C;span>{ text }&#x3C;/span>\n    }\n}\n\nexport default PaginateLink\n</code></pre>\n<ol start="3">\n<li><code>mv pages/index.js templates/</code> 然后编辑</li>\n</ol>\n<!-- language: lang-js -->\n<pre><code>import React from \'react\'\nimport Link from \'gatsby-link\'\n+import PaginateLink from \'./paginateLink\'\n+\n+const IndexPage = ({ data, pathContext }) => {\n+  // for pagination\n+  const { group, index, first, last } = pathContext;\n+  const prevUrl = index - 1 == 1 ? "" : (index - 1).toString();\n+  const nextUrl = (index + 1).toString();\n+  const total = data.allMarkdownRemark.edges.length;\n\n-const IndexPage = ({ data }) => {\nconst { edges: posts } = data.allMarkdownRemark\nreturn (\n    &#x3C;div>\n-      {posts.map(({ node: post }, pIdx) => {\n+      &#x3C;div className="posts">\n+      {group.map(({ node: post }, pIdx) => {\n        const { frontmatter } = post\n-        \n+\n        return (\n        &#x3C;div key={`post_${pIdx}`}>\n            &#x3C;h2>\n@@ -27,6 +35,18 @@ const IndexPage = ({ data }) => {\n        &#x3C;/div>\n        )\n    })}\n+      &#x3C;/div>\n+      &#x3C;div className="paginatation">\n+        &#x3C;div className="prevLink">\n+            &#x3C;PaginateLink tag={ first } url={ prevUrl } text="Prev Page" />\n+        &#x3C;/div>\n+\n+        &#x3C;p>{index} of { Math.ceil(total/12)}&#x3C;/p>\n+\n+        &#x3C;div className="nextLink">\n+            &#x3C;PaginateLink tag={ last } url={ nextUrl } text="Next Page" />\n+        &#x3C;/div>\n+      &#x3C;/div>      \n    &#x3C;/div>\n)\n}\n</code></pre>\n<ol start="4">\n<li>编辑<code>gatsby-node.js</code></li>\n</ol>\n<!-- language: lang-js -->\n<pre><code>+const pagination = require(\'gatsby-paginate\');\n\nconst createTagPages = (createPage, posts) => {\nconst tagPageTemplate = path.resolve(`src/templates/tags.js`)\n@@ -72,6 +73,15 @@ exports.createPages = ({ boundActionCreators, graphql }) => {\n\n    createTagPages(createPage, posts)\n\n+      // default pagination to 10.\n+      pagination({\n+        edges: posts,\n+        createPage: createPage,\n+        pageTemplate: "src/templates/index.js",\n+        pageLength: 10\n+      });\n+\n+\n    posts.forEach(({node}, index) => {\n        createPage({\n        path: node.frontmatter.path,\n</code></pre>\n<ol start="5">\n<li>编辑样式</li>\n<li>重新发布<code>yarn deploy</code></li>\n</ol>',id:"/volume1/homes/leo/github/my-blog-code/src/pages/2018/为Gatsby博客添加分页功能.md absPath of file >>> MarkdownRemark",frontmatter:{date:"2018-03-12T11:31:26.000+08:00",path:"/2018/support-pagination-for-gatsby-blog",title:"为Gatsby博客添加分页功能",excerpt:"根据Egghead上的教程，做出的博客站点有个缺陷，那就是没有分页功能，对于勤奋的博主来说，在一个页面上显示所有文章列表有点不完美，这里我们改造一下，加入分页功能。",tags:["blog","gatsby"]}}}}}});
//# sourceMappingURL=path---2018-development-environment-for-microservices-d6393e67bf3c37b32075.js.map