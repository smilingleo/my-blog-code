webpackJsonp([0x885361265986],{467:function(e,n){e.exports={pathContext:{posts:[{html:'<p>这个标题其实不是非常准确，应该说是为什么状态机在<strong>异步分布式</strong>微服务实践中变得更重要。因为如果你的微服务还只是将原来的本地方法调用替换为同步的API调用，那么恭喜你，你将原来的monolithic变成了<code>distributed</code> monolithic，并成功地给自己找了很多的麻烦。</p>\n<p>用<a href="https://microservices.io/patterns/decomposition/self-contained-service.html">self-contained service</a>里提到的例子，如果所有的API调用都是同步的，那么你在开发的时候，你的关注重点会是API调用，异常处理，但是不会想到Order的状态问题。其实不是因为程序员没有这个思维，而是因为整个transaction在这个模式下是一个整体，人们的思维会自然地将其看做一个黑盒子，从这个角度考量整个API的成功与否，以及里面的实现细节（指令式思维），不会考虑Order的状态转换，考虑也没有用，因为这些转换是实现细节，是在黑盒子里面发生的，用户不可知。用户感知的仅仅是这个API是否成功，如果成功，那么这个Order自然应该是一个<code>Created</code>的状态，如果失败，那么整个transaction应该回滚，要么用户修改请求参数（4XX错误）并重发请求，要么直接重试(500错误).</p>\n<!-- language:uml -->\n<pre><code>Client -> OrderService: POST /orders\nactivate OrderService\nOrderService -> AccountService: POST /accounts/:id/validate\nAccountService --> OrderService: response\n\nOrderService -> KitchenService: POST /tickets\nKitchenService --> OrderService: response\n\nOrderService -> PaymentService: ...\nPaymentService --> OrderService: response\n\nOrderService --> Client: response\ndeactivate OrderService\n</code></pre>\n<p>当你的实现方式变成异步的(Saga模式)之后，系统的交互就变成了下面的这种方式：</p>\n<!-- language:uml -->\n<pre><code>Client -> OrderService: POST /orders\nactivate OrderService\nOrderService -> AccountService: validateAccount message\nOrderService --> Client: response\ndeactivate OrderService\n\nAccountService --> OrderService: reply message\nactivate OrderService\nOrderService -> KitchenService: createTicket message\ndeactivate OrderService\n\n\nKitchenService --> OrderService: reply message\nactivate OrderService\nOrderService -> PaymentService: ...\ndeactivate OrderService\n\nPaymentService --> OrderService: reply message\n</code></pre>\n<p>每个service都是一个独立(self-contained)系统，系统之间通过异步消息通讯。在这种架构模式下，原来的那种“黑盒子”思维就被打破了，你就被迫需要考虑更多的细节，比如Order的状态。</p>\n<!-- language:uml -->\n<pre><code>hide empty description\n[*] -> Pending: sent msg to validate account\nPending --> TicketCreated: Kitchen replied successfully\nTicketCreated --> PaymentCollected: Payment processed\nPaymentCollected --> Created: Received payment processed msg\nPending --> Invalid: invalid account\nCreated --> [*]\nInvalid --> [*]\n</code></pre>\n<p>因为从client的角度，<code>POST /orders</code>的response是一个异步的，带一个jobId, 用户之后每次查询order job信息，你都需要告知用户当前的order状态。</p>\n<p>有了这些状态之后，对于设计者来说，会帮助你对系统有更加深入的思考。比如，在等待的过程中，如果用户想cancel订单怎么办？ 有这个状态机就可以让你可以直观地和PM讨论，在什么情况下我们允许用户cancel订单，什么情况下不允许。</p>\n<!-- language:uml -->\n<pre><code>@startuml\nhide empty description\nskinparam state {\n    BackgroundColor&#x3C;&#x3C;Focus>> LightBlue\n}\nstate Canceled &#x3C;&#x3C;Focus>>\n\n[*] -> Pending: sent msg to validate account\nPending --> TicketCreated: Kitchen replied successfully\nTicketCreated --> PaymentCollected: Payment processed\nPaymentCollected --> Created: Received payment processed msg\nPending --> Invalid: invalid account\nPending --> Canceled: received cancel request\nCanceled --> [*]\nCreated --> [*]\nInvalid --> [*]\n@enduml\n</code></pre>',id:"/Users/lliu/github/smilingleo.github.io/src/pages/2020/为什么状态机在微服务架构下变得更重要.md absPath of file >>> MarkdownRemark",frontmatter:{date:"2020-09-14T13:52:12.000+08:00",path:"/2020/src/pages/2020/",title:"为什么状态机在微服务架构下变得更重要",excerpt:"",tags:["微服务","状态机","设计"]}}],tagName:"状态机"}}}});
//# sourceMappingURL=path---tags-状态机-0b0533c38fcfc34dc904.js.map