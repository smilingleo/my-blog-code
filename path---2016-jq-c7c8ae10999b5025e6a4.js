webpackJsonp([0xbbe8adcb7aba],{414:function(e,n){e.exports={data:{markdownRemark:{html:'<p>在API first的时代，json作为最常用的格式，充斥着程序猿的屏幕各个角落，掌握一门解析、过滤、转换json输出的工具，已经成为程序猿们安身立命的必要技能。\n这里隆重向大家介绍<a href="https://stedolan.github.io/jq/">jq</a>.</p>\n<h2>常用命令</h2>\n<h3>pipe: |</h3>\n<p>和unix管道一样。</p>\n<h3>.[]</h3>\n<p>用来将数组中内容传递给后面命令，而不是把整个数组传过去（脱包）\n还可以用<code>.[n]</code>来获取数组中第n个元素。</p>\n<h3>has(key)</h3>\n<p>检查json对象中是否有key属性。一般结合<code>select()</code>使用。</p>\n<h3>select(boolean_expr)</h3>\n<p>用来过滤输入。比如，只输出具有<code>name</code>项的json对象，可以用：<code>jq \'has("name") as $hasName | select($hasName=true)\'</code></p>\n<p>注意，<code>has(key)</code>会返回一个boolean，然后传递给后面的stream，一般来说，我更喜欢用<code>select</code>，用来过滤而不改变类型。</p>\n<h3>as</h3>\n<p>可以将某个节点object赋予一个变量名，在后面的step里引用，比如你需要引用parent的属性，你可以 <code>jq \'. as $parent | .items | .[] | {"name": .name, "id": $parent.id}\'</code>.</p>\n<h2>实战</h2>\n<p>我们将使用<code>docker inspect</code>输出结果作为例子进行解析。</p>\n<h3>列出所有docker images的inspect结果</h3>\n<!-- language:bash -->\n<pre><code>docker inspect $(docker images | tail -n +2 | awk \'{print $1":"$2}\')\n</code></pre>\n<h3>只列出所有volumes不为空的images</h3>\n<!-- language:bash -->\n<pre><code>docker inspect $(docker images | tail -n +2 | awk \'{print $1":"$2}\') | jq \'.[] | select(.Config.Volumes!=null)\'\n</code></pre>\n<h3>将json转换为csv</h3>\n<!-- language:bash -->\n<pre><code>docker inspect $(docker images | tail -n +2 | awk \'{print $1":"$2}\') | jq \'.[] | [(.RepoTags|.[0]), .DockerVersion] | @csv\'\n</code></pre>\n<p>上面例子中：</p>\n<ul>\n<li><code>.[]</code>将数组中每个单项传递给后面命令</li>\n<li><code>(.RepoTags|.[0])</code>取出第一个RepoTags的内容也就是image的name:tag</li>\n<li><code>.DockerVersion</code>取出docker版本</li>\n<li><code>将上面两个命令用</code>,`连接，表示将前面的输入同时传递给这两个命令</li>\n<li>用<code>[]</code>将上面两个命令包起来，表示将两个命令的输出结果作为数组中的一个item</li>\n<li><code>@csv</code>将前面的数组输出转换为csv格式。</li>\n</ul>\n<h3>动态key</h3>\n<p>一些json对象会用动态key，比如id，这时你会想到如果能用JSONPath的方式来搜索某个path段改多好，不用担心，参考这个：<a href="https://github.com/stedolan/jq/wiki/For-JSONPath-users">For JSONPath users</a></p>\n<p>比如： <code>..|objects.name</code>， 这里 <code>..</code>将产生一个stream，遍历所有json对象及子对象，然后用<code>objects</code>来引用。</p>\n<h2>References</h2>\n<ol>\n<li><a href="https://stedolan.github.io/jq/manual">JQ Manual</a></li>\n</ol>',frontmatter:{title:"JSON解析利器---JQ",date:"March 25, 2016",path:"/2016/jq",tags:["bash","jq","json"],excerpt:"在API first的时代，json作为最常用的格式，充斥着程序猿的屏幕各个角落，掌握一门解析、过滤、转换json输出的工具，已经成为程序猿们安身立命的必要技能。 这里隆重向大家介绍[jq](https://stedolan.github.io/jq/)."}}},pathContext:{prev:{html:'<h2>问题描述</h2>\n<p>因为我们的项目中用到了<a href="http://github.com/zalando/skipper">Skipper</a>作为UI层的gateway，在支持一个新上线的UI应用的时候，发现一个奇怪的现象，假定：</p>\n<pre><code>Skipper Domain: https://ui.example.com\nWebapp Internal Domain：https://webapp.internal.example.com\n</code></pre>\n<p>在Skipper收到一个请求 <code>GET https://ui.example.com/webapp</code>的时候，根据Routing规则：</p>\n<pre><code>Path("/webapp") -> "https://webapp.internal.example.com"\n</code></pre>\n<p>请求应该是会被转到这个地址的。测试发现：</p>\n<!-- language: lang-bash -->\n<pre><code># 正常工作，返回200\ncurl -i https://webapp.internal.example.com\n\n# 返回404\ncurl -i https://ui.example.com\n</code></pre>\n<p>神奇的就是后面的测试，返回404，而且来源于一个<code>nginx</code>服务器。</p>\n<h2>调试</h2>\n<p>通过 <code>curl -vv</code> 比较两个请求的差异，发现两个服务器的证书CN不同，一个是 <code>*.example.com</code>，另外一个是 <code>*.internal.example.com</code>，怀疑是不是SNI相关的问题，尝试了一下：</p>\n<pre><code class="language-bash">curl -i -H "Host: webapp.internal.example.com" https://ui.example.com\n</code></pre>\n<p>哈，成功返回200.</p>\n<p>查阅了一下SNI相关资料，发现了疑惑：SNI中hello_name来源于 URL中的domain name，而不是被加密的Header。一个web server如果host多个domains，在request过来的时候，会根据URI中的domain name来查找对应domain的证书，然后用来SSL握手，如果找不到证书，才会返回一个默认的页面，比如404.</p>\n<p>但是根据我们的试验，证书应该是正确的，所以应该不是SNI的问题。</p>\n<h2>真相大白</h2>\n<p>问题是解决了，但是却不知道是什么原因，这让人很不舒服，继续找。无意中发现了这个<a href="https://github.com/golang/go/issues/22704">Issue</a>，其中提到：</p>\n<blockquote>\n<p>This would break usage of net/http for <a href="https://www.bamsoftware.com/papers/fronting/">domain fronting</a>, an anti-censorship technique specifically relying on sending different hosts in SNI and HTTP headers. Such a use of net/http is not rare: censorship-resistant tunneling software such as <a href="https://github.com/getlantern/lantern">Lantern</a> and my own project Geph both use net/http this way.</p>\n</blockquote>\n<p><code>domain fronting</code>？什么鬼，著名的<code>lantern</code>居然在用，查了一下，明白了。原来这个技术就是用来翻墙的，哈。</p>\n<p>具体来说：</p>\n<p><img src="https://www.bamsoftware.com/papers/fronting/fronting.svg" alt="domain fronting"></p>\n<p>比如你想访问被墙的网站<code>forbidden.example</code>,你可以用36计之张冠李戴，谎称我访问的是<code>allowed.example</code>, 然后在request header中指定<code>Host: forbidden.example</code>，用https，这样请求就会被加密，邪恶的探测器们就无法知道你真正的地址，而且这样也符合SNI的握手协议。</p>\n<p>现在很多网站都支持这种技术，比如google:</p>\n<pre><code class="language-bash">curl -vv -H "Host: maps.google.com" https://www.google.com\n</code></pre>\n<p>从URL上看，访问的是<code>www.google.com</code>，但是你看一下返回内容会发现，这个内容却是<code>maps.google.com</code>返回的。</p>\n<p>在我们的例子中，因为skipper中设置了<code>-proxy-preserve-host</code>，这样<code>Host</code> header会被传递给下面的目标app，而这个目标app因为支持domain fronting，尝试着去找那个 <code>ui.example.com</code>对应的证书，当然没有，所以返回<code>404</code>.</p>\n<h2>参考资料</h2>\n<ol>\n<li><a href="https://www.bamsoftware.com/papers/fronting/">Domain Fronting</a></li>\n<li><a href="https://en.wikipedia.org/wiki/Server_Name_Indication">Server Name Indication</a></li>\n</ol>',id:"/Users/lliu/github/smilingleo.github.io/src/pages/2018/一则奇怪的Toubleshooting.md absPath of file >>> MarkdownRemark",frontmatter:{date:"2018-03-08T08:30:00.000+08:00",path:"/2018/skipper-sni-domain-fronting",title:"记一次奇怪的troubleshooting",excerpt:"在Skipper转发请求到一个https站点的时候，返回莫名404.",tags:["skipper","SNI","domain fronting"]}},next:{html:'<p>泛型编程的时候，协变(covariant)还是逆变(contravariant)很重要，在设计上层API接口的时候，正确的使用协变、逆变可以更好地约束程序员的行为，让实现变得安全、一致。</p>\n<p>协变、逆变在一般时候是比较容易理解的，但是来到FP世界之后，Function的协变、逆变就变得比较复杂。</p>\n<p>比如： 对于<code>trait List[+T]</code></p>\n<!-- language:uml -->\n<pre><code>class Animal\nclass Dog\nclass "List[Animal]" as LA\nclass "List[Dog]" as LD\n\nAnimal &#x3C;|-- Dog\nLA &#x3C;|-- LD\n</code></pre>\n<p>那对于<code>trait CList[-T]</code></p>\n<!-- language:uml -->\n<pre><code>class Animal\nclass Dog\nclass "CList[Animal]" as LA\nclass "CList[Dog]" as LD\n\nAnimal &#x3C;|-- Dog\nLA --|> LD\n</code></pre>\n<p>这些还都容易理解，对于<code>trait Func[-I, +O]</code>的理解就比较费劲了。</p>\n<!-- language:lang-scala -->\n<pre><code>import scala.reflect.runtime.universe._\n\nclass Animal\ncase class Dog(name: String) extends Animal\n\nclass Material\ncase class Wood(color: String) extends Material\n\ntrait Func[-I, +O] {\n  def apply(input: I): O\n}\n\ntypeOf[Dog] &#x3C;:&#x3C; typeOf[Animal]  // return true\ntypeOf[Func[Material, Dog]] &#x3C;:&#x3C; typeOf[Func[Wood, Animal]]    // retrun true\n</code></pre>\n<!-- language:uml -->\n<pre><code>class Animal\nclass Dog\nclass Wood\nclass Material\n\nclass "Func[Wood, Animal]" as LA\nclass "Func[Material, Dog]" as LD\n\n\nWood --|> Material\nLA &#x3C;|-- LD\nAnimal &#x3C;|-- Dog\n</code></pre>\n<p>理解这个的关键是理解“里氏替换原则”，也就是，任何父类出现的地方，如果用其子类来替换都应该是安全的。从这个角度看，这个<code>Func</code>完成的工作是用某种材料来制作某种动物，<code>Func[Wood, Animal]</code>是输入木头制作任何动物，<code>Func[Material, Dog]</code>是输入任何材料来制作狗。考虑下面的应用场景：</p>\n<!-- language:lang-scala -->\n<pre><code>val woods: List[Wood] = ...         //给定一堆木头\n\nval makeAnimalWithWood: Func[Wood, Animal] = ...\nval makeDogWithMaterial: Func[Material, Dog] = ...\n\nval describer: Animal -> String = ...\n\nwoods.map(makeAnimalWithWood)       // return List[Animal]\n     .map(describer)                // 接受Animal返回String\n</code></pre>\n<p>根据里氏替换原则，用<code>makeDogWithMaterial</code>替换<code>makeAnimalWithWood</code>是安全的。反过来，看下面代码：</p>\n<!-- language:lang-scala -->\n<pre><code>val materials: List[Material] = ...           // 给定一堆材料\n\nval makeAnimalWithWood: Func[Wood, Animal] = ...\nval makeDogWithMaterial: Func[Material, Dog] = ...\n\nval describer: Dog -> String = ...\n\nmaterials.map(makeDogWithMaterial)       // return List[Dog]\n     .map(describer)                // 接受Dog返回String\n</code></pre>\n<p>这时候，用<code>makeAnimalWithWood</code>来替换<code>makeDogWithMaterial</code>就不行了，因为<code>materials.map(makeAnimalWithWood)</code>就会编译错误了，因为<code>makeAnimalWithWood</code>只接受<code>Wood</code>，而代码传递过来的是<code>Material</code>.</p>',id:"/Users/lliu/github/smilingleo.github.io/src/pages/2016/Function的协变.md absPath of file >>> MarkdownRemark",frontmatter:{date:"2016-02-04T17:16:45.000Z",path:"/2016/function-covariant-contravariant",title:"Function的协、逆变",excerpt:"泛型编程的时候，协变(covariant)还是逆变(contravariant)很重要，在设计上层API接口的时候，正确的使用协变、逆变可以更好地约束程序员的行为，让实现变得安全、一致。",tags:["scala","functional programming"]}}}}}});
//# sourceMappingURL=path---2016-jq-c7c8ae10999b5025e6a4.js.map