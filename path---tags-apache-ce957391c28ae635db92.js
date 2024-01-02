webpackJsonp([0x7ac229f69513],{449:function(e,n){e.exports={pathContext:{posts:[{html:'<p>重要的思维方式：从什么角度看的问题</p>\n<p>怎么定义 <code>task</code>, 从全局的角度看，一个<em>task</em>，有下面两个基本属性：</p>\n<ul>\n<li>location 在哪个node上执行</li>\n<li>state 当前处于什么状态</li>\n</ul>\n<p><strong>task == resource, subtask == partition</strong></p>\n<p>所以，从Helix的角度，一个<em>task</em>也可以认为是一个<em>resource</em>，因为task和resource都有上面两个基本属性。</p>\n<p>一个<code>IdealState</code> /<code>CurrentState</code>也是对某个task/resource来说的。</p>\n<p><code>ZNRecord</code> : Zookeeper Node Record, generic的机制来存数据，类似Dao\n<code>HelixProperty</code>: Domain Object，其实就是封装了ZNRecord，并通过在Helix context有意义的方法。</p>\n<p>比如：</p>\n<ul>\n<li><code>HelixProperty.getBucketSize()</code> -> <code>ZNRecord.getSimpleField()</code></li>\n<li><code>CurrentState.getState()</code> -> <code>ZNRecord.getMapField().get("current_state")</code></li>\n</ul>\n<p>一个Task可以被拆分为小的subtasks，对应的，resource -> partition\n每个task/subtask可以有多个replica，以提高系统的可用性(availability)</p>\n<img src="https://mermaid.ink/img/Zmxvd2NoYXJ0IFRECiAgZGlyZWN0aW9uwqBMUgogIHN1YmdyYXBoIHRhc2sKICAgIFRhc2sgLS0+fHNwbGl0fCBTdWJUYXNrCiAgICBTdWJUYXNrIC0tPnwxLi5ufCBSZXBsaWNhCiAgZW5kCiAgZGlyZWN0aW9uwqBMUgogIHN1YmdyYXBoIHJlc291cmNlCiAgICBSZXNvdXJjZSAtLT4gUGFydGl0aW9uCiAgZW5kCiAgVGFzayAtLmFsaWFzLi0+IFJlc291cmNlCiAgU3ViVGFzayAtLmFsaWFzLi0+IFBhcnRpdGlvbg==" />\n<p>如下信息就是一个ZNRecord:</p>\n<pre><code class="language-json">{\n    "id": "myIndex",\n    "simpleFields": {\n        "NUM_PARTITIONS": "3",\n        "REPLICAS": "2",\n    },\n    "mapFields": {\n        "myIndex_0": {\n            "N1": "ONLINE",\n            "N2": "ONLINE"\n        },\n        "myIndex_1": {\n            "N2": "ONLINE",\n            "N3": "ONLINE"\n        },\n        "myIndex_2": {\n            "N3": "ONLINE",\n            "N1": "ONLINE"\n        }\n    }\n}```\n\n注意里面的`simpleFields`, `mapFields`\n\n### State\n不同的应用场景，每个node的状态是什么也不尽相同。Leader/StandBy, Online/Offline等等。每个node的状态机相应的也不同。Helix作为一个框架，就是要隔离这些不同，允许用户自定义状态机，以及状态转换的时候做的动作。\n\n注意：这里的状态特指每个Node的状态，不是业务逻辑里某个业务对象的状态。常见的状态机定义：\n- Leader / Standby\n- Master / Slave\n- Online / Offline\n- Task/ScheduledTask\n\n- StateModelDefinition (状态机定义)只描述整个状态机长什么样，有哪些状态，从哪个状态可以转换到另外的什么状态；但是定义里并不会具体说：转换的时候做什么事情（变的部分；不同的场景不同的处理）\n- 而StateModel（状态模型）才是声明状态转换的时候要做什么事情。所以，StateModel更像是个Callback的集合，*或者叫TransitionBehavior*\n\n### Spectator\n每个node有自己的状态，整个cluster需要一个big picture，那就是ExternalView, 这个view会提供给观测者spectator，来监控cluster状态。\n\n### HelixAdmin\nHelix cluster manager，通过这个manager可以创建cluster，获取cluster状态，获得cluster上的resource，创建新的resource. 开启maintenance mode.等等。\n\n创建一个HelixAdmin：\n```java\nHelixAdmin admin = new HelixAdmin.Builder()\n    .setZkAddress(zkSrv)\n    .build();\n</code></pre>\n<p>cluster manager可以定义cluster里有哪些状态机；List&#x3C;(clusterName, defName, def)></p>\n<h3>HelixManager</h3>\n<p>这个就是Helix Agent，在participant上面，那就是participant manager，在controller上面，就是controller manager. 任何需要和Helix交互的process都需要它。一般的流程是：</p>\n<pre><code class="language-java">manager = HelixManagerFactory.getZKHelixManager(clusterName, instanceName, ROLE, zkAddr);\nmanager.addPreConnectionCallback(cb);\nmanager.connect();\n....\nmanager.disconnect();\n</code></pre>\n<p>我们需要通过participant manager(HelixManager)来注册状态机工厂。</p>\n<pre><code class="language-java">participantManager.getStateMachineEngine()\n    .registerStateModelFactory(stateModelDefName, stateModelFactory);\n</code></pre>\n<p>Cluster里只有Participant node才有StateMachineEngine，其他controller，spectator都是null.</p>\n<h4>DefaultMessagingService</h4>\n<p>Helix Agent (manager)有一个消息服务，内置一个线程池 TaskExecutor. 只要agent connect到cluster之后，这个消息服务就会被初始化。</p>\n<h3>StateMachineEngine</h3>\n<ul>\n<li>Participant节点用<em>状态机引擎</em>注册<em>状态模型工厂</em></li>\n<li><em>状态模型工厂</em>创建<em>状态模型</em></li>\n<li><em>状态模型</em>处理状态转换消息。</li>\n</ul>\n<p>状态模型其实是我们日常说的状态机。</p>\n<h2>Questions</h2>\n<ul>\n<li>~~HelixAdmin.addStateModelDef vs HelixManager.getStateMachineEngine().registerStateModelFactory</li>\n<li>How does Helix dispatch jobs? via messaging?</li>\n</ul>\n<h1>Helix Recipes</h1>\n<h2>Distributed Lock Manager</h2>\n<p>基于zookeeper，但是能解决：</p>\n<ul>\n<li>第一个节点启动就取得所有lock的问题</li>\n</ul>\n<p>ZkClient.connect -> new ZkEventThread(维护一个BlockingQueue<ZkEvent>，这样ZkClient收到zookeeper的消息之后会发送ZkEvent到eventThread的blocking queue)\n-> ZkEventThread 会不停地循环，从blocking queue里获取event之后event.run\n-> event是一个匿名类</p>\n<p>ZkClient是一个ZooKeeper的Watcher实现,  ZkClient.process(WatchedEvent) 会调用各种listener.</p>\n<p>CallbackHandler.handleChildChange -> enqueTask -> invoke ->\nHelixTaskExecutor.onMessage -> scheduleTask (提交任务到线程池) <del>-</del>>\nHelixTask.call ->\nHelixStateTransitionHandler.handleMessage -> invoke (根据StateModel class里方法上Annotation from，to找到对应的method，然后反射地调用。)</p>\n<p>ZKHelixManager.connect -> createClient (初始化ZkClient) -> zkClient.subscribeStateChanges</p>\n<h1>helix #open-source</h1>',id:"/volume1/homes/leo/github/my-blog-code/src/pages/2022/Helix Notes.md absPath of file >>> MarkdownRemark",frontmatter:{date:"2022-09-29T19:20:40.000+08:00",path:"/2022/helix-concept-model",title:"Helix概念模型",excerpt:"",tags:["helix","apache","distributed"]}}],tagName:"apache"}}}});
//# sourceMappingURL=path---tags-apache-ce957391c28ae635db92.js.map