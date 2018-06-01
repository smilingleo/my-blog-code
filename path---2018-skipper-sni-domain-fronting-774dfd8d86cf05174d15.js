webpackJsonp([88252766766524],{407:function(e,o){e.exports={data:{markdownRemark:{html:'<h2>问题描述</h2>\n<p>因为我们的项目中用到了<a href="http://github.com/zalando/skipper">Skipper</a>作为UI层的gateway，在支持一个新上线的UI应用的时候，发现一个奇怪的现象，假定：</p>\n<pre><code>Skipper Domain: https://ui.example.com\nWebapp Internal Domain：https://webapp.internal.example.com\n</code></pre>\n<p>在Skipper收到一个请求 <code>GET https://ui.example.com/webapp</code>的时候，根据Routing规则：</p>\n<pre><code>Path("/webapp") -> "https://webapp.internal.example.com"\n</code></pre>\n<p>请求应该是会被转到这个地址的。测试发现：</p>\n<!-- language: lang-bash -->\n<pre><code># 正常工作，返回200\ncurl -i https://webapp.internal.example.com\n\n# 返回404\ncurl -i https://ui.example.com\n</code></pre>\n<p>神奇的就是后面的测试，返回404，而且来源于一个<code>nginx</code>服务器。</p>\n<h2>调试</h2>\n<p>通过 <code>curl -vv</code> 比较两个请求的差异，发现两个服务器的证书CN不同，一个是 <code>*.example.com</code>，另外一个是 <code>*.internal.example.com</code>，怀疑是不是SNI相关的问题，尝试了一下：</p>\n<pre><code class="language-bash">curl -i -H "Host: webapp.internal.example.com" https://ui.example.com\n</code></pre>\n<p>哈，成功返回200.</p>\n<p>查阅了一下SNI相关资料，发现了疑惑：SNI中hello_name来源于 URL中的domain name，而不是被加密的Header。一个web server如果host多个domains，在request过来的时候，会根据URI中的domain name来查找对应domain的证书，然后用来SSL握手，如果找不到证书，才会返回一个默认的页面，比如404.</p>\n<p>但是根据我们的试验，证书应该是正确的，所以应该不是SNI的问题。</p>\n<h2>真相大白</h2>\n<p>问题是解决了，但是却不知道是什么原因，这让人很不舒服，继续找。无意中发现了这个<a href="https://github.com/golang/go/issues/22704">Issue</a>，其中提到：</p>\n<blockquote>\n<p>This would break usage of net/http for <a href="https://www.bamsoftware.com/papers/fronting/">domain fronting</a>, an anti-censorship technique specifically relying on sending different hosts in SNI and HTTP headers. Such a use of net/http is not rare: censorship-resistant tunneling software such as <a href="https://github.com/getlantern/lantern">Lantern</a> and my own project Geph both use net/http this way.</p>\n</blockquote>\n<p><code>domain fronting</code>？什么鬼，著名的<code>lantern</code>居然在用，查了一下，明白了。原来这个技术就是用来翻墙的，哈。</p>\n<p>具体来说：</p>\n<p><img src="https://www.bamsoftware.com/papers/fronting/fronting.svg" alt="domain fronting"></p>\n<p>比如你想访问被墙的网站<code>forbidden.example</code>,你可以用36计之张冠李戴，谎称我访问的是<code>allowed.example</code>, 然后在request header中指定<code>Host: forbidden.example</code>，用https，这样请求就会被加密，邪恶的探测器们就无法知道你真正的地址，而且这样也符合SNI的握手协议。</p>\n<p>现在很多网站都支持这种技术，比如google:</p>\n<pre><code class="language-bash">curl -vv -H "Host: maps.google.com" https://www.google.com\n</code></pre>\n<p>从URL上看，访问的是<code>www.google.com</code>，但是你看一下返回内容会发现，这个内容却是<code>maps.google.com</code>返回的。</p>\n<p>在我们的例子中，因为skipper中设置了<code>-proxy-preserve-host</code>，这样<code>Host</code> header会被传递给下面的目标app，而这个目标app因为支持domain fronting，尝试着去找那个 <code>ui.example.com</code>对应的证书，当然没有，所以返回<code>404</code>.</p>\n<h2>参考资料</h2>\n<ol>\n<li><a href="https://www.bamsoftware.com/papers/fronting/">Domain Fronting</a></li>\n<li><a href="https://en.wikipedia.org/wiki/Server_Name_Indication">Server Name Indication</a></li>\n</ol>',frontmatter:{title:"记一次奇怪的troubleshooting",date:"March 08, 2018",path:"/2018/skipper-sni-domain-fronting",tags:["skipper","SNI","domain fronting"],excerpt:"在Skipper转发请求到一个https站点的时候，返回莫名404."}}},pathContext:{prev:{html:'<h2>起因</h2>\n<p>原来的博客站点基于Jekyll搭建，各种问题，感觉很不爽。后来看到Gatsby，基于ReactJS, GraphQL，都是我的最爱，于是果断投诚！</p>\n<h2>遇到的问题</h2>\n<h3>和prettyprint集成的问题</h3>\n<p>原来的prettyprint机制是在页面加载的时候调用<code>init()</code>，检查DOM中的<code>pre.code</code>元素。但是转到React之后，全部是前端Routing，原来写的<code>window.onload = init</code>不工作了。每次都要手动刷新。</p>\n<p>解决办法是在Gatsby Link元素的<code>onClick</code>事件中注册一个timer:</p>\n<!-- language: js -->\n<pre><code>&#x3C;Link to={frontmatter.path} onClick={() => setTimeout(init, 100)}>{frontmatter.title}&#x3C;/Link>\n</code></pre>\n<p>这样，在点击链接打开页面之后，就会调用<code>init</code>了。</p>\n<p><strong>更新：</strong>\n上面的方法更像是一个Hack，因为毕竟Link的目的只是指向一个target，不应该把不属于Link的职责(解析页面DOM并设置pre.code的style)绑定到Link上。</p>\n<p>重新思考了一下之后，重构了<code>templates/blog-post.js</code>，原来的<code>Template</code>是一个ES6箭头函数，因为我们希望的是在页面组件都Mount之后，调用<code>init</code>，所以，我们将其修改为一个扩展<code>React.Component</code>的class.</p>\n<!-- language:lang-js -->\n<pre><code>class Template extends React.Component {\n    constructor(props) {\n        super(props);\n    }\n    \n    /*\n    * Once the blog page is loaded, run init() to prettyprint the code.\n    */\n    componentDidMount() {\n        init();\n    }\n\n    render() {\n        const { markdownRemark: post } = this.props.data\n        const { frontmatter, html } = post\n        const { title, date } = frontmatter\n        const { next, prev } = this.props.pathContext\n    \n        return (\n            ...\n        )  \n    }\n}\n</code></pre>\n<p>这样，就达到目的了。</p>\n<h3>发布方法</h3>\n<p>原来以为是将这些源码直接push到 <code>smilingleo.github.io</code>，后来发现不对。</p>\n<p>需要有两个github repos，一个 <code>my-blog-code</code>, 另外一个 <code>smilingleo.github.io</code>。</p>\n<p>新的博文写完之后，需要<code>yarn deploy</code>，这样会发布到<code>public/</code>，然后将<code>public</code>目录指向<code>smilingleo.github.io</code>这个repo。</p>\n<p>所以，一篇博客需要提交两个git repos。</p>\n<h3>date格式问题</h3>\n<p>原来用Jekyll的时候，date可以是<code>YYYY-MM-dd HH:mm:ss</code>的格式，但是用Gatsby必须是<code>YYYY-MM-dd\'T\'HH:mm:ss</code>。</p>\n<h2>参考资料</h2>\n<ol>\n<li><a href="https://egghead.io/courses/build-a-blog-with-react-and-markdown-using-gatsby">Egghead教程</a></li>\n<li><a href="https://stackoverflow.com/questions/37170809/react-createclass-vs-es6-arrow-function/37170998#37170998">React.createClass vs. ES6 arrow function</a></li>\n</ol>\n<p>In summary:</p>\n<p>The short answer is that you want to use Stateless Functional Components (SFC) as often as you can; the majority of your components should be SFC\'s.</p>\n<p>Use the traditional Component class when:</p>\n<p>You need local state (<code>this.setState</code>)\nYou need a lifecycle hook (<code>componentWillMount</code>, <code>componentDidUpdate</code>, etc)\nYou need to access backing instances via refs (eg. <code>&#x3C;div ref={elem => this.elem = elem}></code>)</p>',id:"/Users/lliu/github/smilingleo.github.io/src/pages/2018/转用Gatsby搭建博客.md absPath of file >>> MarkdownRemark",frontmatter:{date:"2018-03-08T17:01:00.000+08:00",path:"/2018/blog-with-gatsby",title:"转用Gatsby打造基于github的博客站点",excerpt:"如何用Gatsby打造一个博客",tags:["blog","github","gatsby"]}},next:{html:"<p>在API first的时代，json作为最常用的格式，充斥着程序猿的屏幕各个角落，掌握一门解析、过滤、转换json输出的工具，已经成为程序猿们安身立命的必要技能。\n这里隆重向大家介绍<a href=\"https://stedolan.github.io/jq/\">jq</a>.</p>\n<h2>常用命令</h2>\n<h3>pipe: |</h3>\n<p>和unix管道一样。</p>\n<h3>.[]</h3>\n<p>用来将数组中内容传递给后面命令，而不是把整个数组传过去（脱包）\n还可以用<code>.[n]</code>来获取数组中第n个元素。</p>\n<h3>has(key)</h3>\n<p>检查json对象中是否有key属性。一般结合<code>select()</code>使用。</p>\n<h3>select(boolean_expr)</h3>\n<p>用来过滤输入。比如，只输出具有<code>name</code>项的json对象，可以用：<code>jq 'has(\"name\") as $hasName | select($hasName=true)'</code></p>\n<h2>实战</h2>\n<p>我们将使用<code>docker inspect</code>输出结果作为例子进行解析。</p>\n<h3>列出所有docker images的inspect结果</h3>\n<!-- language:bash -->\n<pre><code>docker inspect $(docker images | tail -n +2 | awk '{print $1\":\"$2}')\n</code></pre>\n<h3>只列出所有volumes不为空的images</h3>\n<!-- language:bash -->\n<pre><code>docker inspect $(docker images | tail -n +2 | awk '{print $1\":\"$2}') | jq '.[] | select(.Config.Volumes!=null)'\n</code></pre>\n<h3>将json转换为csv</h3>\n<!-- language:bash -->\n<pre><code>docker inspect $(docker images | tail -n +2 | awk '{print $1\":\"$2}') | jq '.[] | [(.RepoTags|.[0]), .DockerVersion] | @csv'\n</code></pre>\n<p>上面例子中：</p>\n<ul>\n<li><code>.[]</code>将数组中每个单项传递给后面命令</li>\n<li><code>(.RepoTags|.[0])</code>取出第一个RepoTags的内容也就是image的name:tag</li>\n<li><code>.DockerVersion</code>取出docker版本</li>\n<li><code>将上面两个命令用</code>,`连接，表示将前面的输入同时传递给这两个命令</li>\n<li>用<code>[]</code>将上面两个命令包起来，表示将两个命令的输出结果作为数组中的一个item</li>\n<li><code>@csv</code>将前面的数组输出转换为csv格式。</li>\n</ul>\n<h3>动态key</h3>\n<p>一些json对象会用动态key，比如id，这时你会想到如果能用JSONPath的方式来搜索某个path段改多好，不用担心，参考这个：<a href=\"https://github.com/stedolan/jq/wiki/For-JSONPath-users\">For JSONPath users</a></p>\n<p>比如： <code>..|objects.name</code>， 这里 <code>..</code>将产生一个stream，遍历所有json对象及子对象，然后用<code>objects</code>来引用。</p>",id:"/Users/lliu/github/smilingleo.github.io/src/pages/2016/JSON解析利器JQ.md absPath of file >>> MarkdownRemark",frontmatter:{date:"2016-03-25T19:16:45.000Z",path:"/2016/jq",title:"JSON解析利器---JQ",excerpt:"在API first的时代，json作为最常用的格式，充斥着程序猿的屏幕各个角落，掌握一门解析、过滤、转换json输出的工具，已经成为程序猿们安身立命的必要技能。 这里隆重向大家介绍[jq](https://stedolan.github.io/jq/).",tags:["bash","jq","json"]}}}}}});
//# sourceMappingURL=path---2018-skipper-sni-domain-fronting-774dfd8d86cf05174d15.js.map