webpackJsonp([0xed28d567e2ba],{409:function(e,t){e.exports={pathContext:{posts:[{html:'<h2>起因</h2>\n<p>原来的博客站点基于Jekyll搭建，各种问题，感觉很不爽。后来看到Gatsby，基于ReactJS, GraphQL，都是我的最爱，于是果断投诚！</p>\n<h2>遇到的问题</h2>\n<h3>和prettyprint集成的问题</h3>\n<p>原来的prettyprint机制是在页面加载的时候调用<code>init()</code>，检查DOM中的<code>pre.code</code>元素。但是转到React之后，全部是前端Routing，原来写的<code>window.onload = init</code>不工作了。每次都要手动刷新。</p>\n<p>解决办法是在Gatsby Link元素的<code>onClick</code>事件中注册一个timer:</p>\n<!-- language: js -->\n<pre><code>&#x3C;Link to={frontmatter.path} onClick={() => setTimeout(init, 100)}>{frontmatter.title}&#x3C;/Link>\n</code></pre>\n<p>这样，在点击链接打开页面之后，就会调用<code>init</code>了。</p>\n<p><strong>更新：</strong>\n上面的方法更像是一个Hack，因为毕竟Link的目的只是指向一个target，不应该把不属于Link的职责(解析页面DOM并设置pre.code的style)绑定到Link上。</p>\n<p>重新思考了一下之后，重构了<code>templates/blog-post.js</code>，原来的<code>Template</code>是一个ES6箭头函数，因为我们希望的是在页面组件都Mount之后，调用<code>init</code>，所以，我们将其修改为一个扩展<code>React.Component</code>的class.</p>\n<!-- language:lang-js -->\n<pre><code>class Template extends React.Component {\n    constructor(props) {\n        super(props);\n    }\n    \n    /*\n    * Once the blog page is loaded, run init() to prettyprint the code.\n    */\n    componentDidMount() {\n        init();\n    }\n\n    render() {\n        const { markdownRemark: post } = this.props.data\n        const { frontmatter, html } = post\n        const { title, date } = frontmatter\n        const { next, prev } = this.props.pathContext\n    \n        return (\n            ...\n        )  \n    }\n}\n</code></pre>\n<p>这样，就达到目的了。</p>\n<h3>发布方法</h3>\n<p>原来以为是将这些源码直接push到 <code>smilingleo.github.io</code>，后来发现不对。</p>\n<p>需要有两个github repos，一个 <code>my-blog-code</code>, 另外一个 <code>smilingleo.github.io</code>。</p>\n<p>新的博文写完之后，需要<code>yarn deploy</code>，这样会发布到<code>public/</code>，然后将<code>public</code>目录指向<code>smilingleo.github.io</code>这个repo。</p>\n<p>所以，一篇博客需要提交两个git repos。</p>\n<h3>date格式问题</h3>\n<p>原来用Jekyll的时候，date可以是<code>YYYY-MM-dd HH:mm:ss</code>的格式，但是用Gatsby必须是<code>YYYY-MM-dd\'T\'HH:mm:ss</code>。</p>\n<h2>参考资料</h2>\n<ol>\n<li><a href="https://egghead.io/courses/build-a-blog-with-react-and-markdown-using-gatsby">Egghead教程</a></li>\n<li><a href="https://stackoverflow.com/questions/37170809/react-createclass-vs-es6-arrow-function/37170998#37170998">React.createClass vs. ES6 arrow function</a></li>\n</ol>\n<p>In summary:</p>\n<p>The short answer is that you want to use Stateless Functional Components (SFC) as often as you can; the majority of your components should be SFC\'s.</p>\n<p>Use the traditional Component class when:</p>\n<p>You need local state (<code>this.setState</code>)\nYou need a lifecycle hook (<code>componentWillMount</code>, <code>componentDidUpdate</code>, etc)\nYou need to access backing instances via refs (eg. <code>&#x3C;div ref={elem => this.elem = elem}></code>)</p>',id:"/Users/lliu/github/smilingleo.github.io/src/pages/2018/转用Gatsby搭建博客.md absPath of file >>> MarkdownRemark",frontmatter:{date:"2018-03-08T17:00:00.000+08:00",path:"/2018/blog-with-gatsby",title:"转用Gatsby打造基于github的博客站点",excerpt:"如何用Gatsby打造一个博客",tags:["blog","github","gatsby"]}}],tagName:"github"}}}});
//# sourceMappingURL=path---tags-github-bd49c873617914c54ff7.js.map