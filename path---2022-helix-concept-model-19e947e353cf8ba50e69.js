webpackJsonp([0xfa9122b5f556],{436:function(e,t){e.exports={data:{markdownRemark:{html:'<p>重要的思维方式：从什么角度看的问题</p>\n<p>怎么定义 <code>task</code>, 从全局的角度看，一个<em>task</em>，有下面两个基本属性：</p>\n<ul>\n<li>location 在哪个node上执行</li>\n<li>state 当前处于什么状态</li>\n</ul>\n<p><strong>task == resource, subtask == partition</strong></p>\n<p>所以，从Helix的角度，一个<em>task</em>也可以认为是一个<em>resource</em>，因为task和resource都有上面两个基本属性。</p>\n<p>一个<code>IdealState</code> /<code>CurrentState</code>也是对某个task/resource来说的。</p>\n<p><code>ZNRecord</code> : Zookeeper Node Record, generic的机制来存数据，类似Dao\n<code>HelixProperty</code>: Domain Object，其实就是封装了ZNRecord，并通过在Helix context有意义的方法。</p>\n<p>比如：</p>\n<ul>\n<li><code>HelixProperty.getBucketSize()</code> -> <code>ZNRecord.getSimpleField()</code></li>\n<li><code>CurrentState.getState()</code> -> <code>ZNRecord.getMapField().get("current_state")</code></li>\n</ul>\n<p>一个Task可以被拆分为小的subtasks，对应的，resource -> partition\n每个task/subtask可以有多个replica，以提高系统的可用性(availability)</p>\n<img src="https://mermaid.ink/img/Zmxvd2NoYXJ0IFRECiAgZGlyZWN0aW9uwqBMUgogIHN1YmdyYXBoIHRhc2sKICAgIFRhc2sgLS0+fHNwbGl0fCBTdWJUYXNrCiAgICBTdWJUYXNrIC0tPnwxLi5ufCBSZXBsaWNhCiAgZW5kCiAgZGlyZWN0aW9uwqBMUgogIHN1YmdyYXBoIHJlc291cmNlCiAgICBSZXNvdXJjZSAtLT4gUGFydGl0aW9uCiAgZW5kCiAgVGFzayAtLmFsaWFzLi0+IFJlc291cmNlCiAgU3ViVGFzayAtLmFsaWFzLi0+IFBhcnRpdGlvbg==" />\n<p>如下信息就是一个ZNRecord:</p>\n<pre><code class="language-json">{\n    "id": "myIndex",\n    "simpleFields": {\n        "NUM_PARTITIONS": "3",\n        "REPLICAS": "2",\n    },\n    "mapFields": {\n        "myIndex_0": {\n            "N1": "ONLINE",\n            "N2": "ONLINE"\n        },\n        "myIndex_1": {\n            "N2": "ONLINE",\n            "N3": "ONLINE"\n        },\n        "myIndex_2": {\n            "N3": "ONLINE",\n            "N1": "ONLINE"\n        }\n    }\n}\n</code></pre>\n<p>注意里面的<code>simpleFields</code>, <code>mapFields</code></p>\n<h3>State</h3>\n<p>不同的应用场景，每个node的状态是什么也不尽相同。Leader/StandBy, Online/Offline等等。每个node的状态机相应的也不同。Helix作为一个框架，就是要隔离这些不同，允许用户自定义状态机，以及状态转换的时候做的动作。</p>\n<p>注意：这里的状态特指每个Node的状态，不是业务逻辑里某个业务对象的状态。常见的状态机定义：</p>\n<ul>\n<li>\n<p>Leader / Standby</p>\n</li>\n<li>\n<p>Master / Slave</p>\n</li>\n<li>\n<p>Online / Offline</p>\n</li>\n<li>\n<p>Task/ScheduledTask</p>\n</li>\n<li>\n<p>StateModelDefinition (状态机定义)只描述整个状态机长什么样，有哪些状态，从哪个状态可以转换到另外的什么状态；但是定义里并不会具体说：转换的时候做什么事情（变的部分；不同的场景不同的处理）</p>\n</li>\n<li>\n<p>而StateModel（状态模型）才是声明状态转换的时候要做什么事情。所以，StateModel更像是个Callback的集合，<em>或者叫TransitionBehavior</em></p>\n</li>\n</ul>\n<h3>Spectator</h3>\n<p>每个node有自己的状态，整个cluster需要一个big picture，那就是ExternalView, 这个view会提供给观测者spectator，来监控cluster状态。</p>\n<h3>HelixAdmin</h3>\n<p>Helix cluster manager，通过这个manager可以创建cluster，获取cluster状态，获得cluster上的resource，创建新的resource. 开启maintenance mode.等等。</p>\n<p>创建一个HelixAdmin：</p>\n<pre><code class="language-java">HelixAdmin admin = new HelixAdmin.Builder()\n    .setZkAddress(zkSrv)\n    .build();\n</code></pre>\n<p>cluster manager可以定义cluster里有哪些状态机；List&#x3C;(clusterName, defName, def)></p>\n<h3>HelixManager</h3>\n<p>这个就是Helix Agent，在participant上面，那就是participant manager，在controller上面，就是controller manager. 任何需要和Helix交互的process都需要它。一般的流程是：</p>\n<pre><code class="language-java">manager = HelixManagerFactory.getZKHelixManager(clusterName, instanceName, ROLE, zkAddr);\nmanager.addPreConnectionCallback(cb);\nmanager.connect();\n....\nmanager.disconnect();\n</code></pre>\n<p>我们需要通过participant manager(HelixManager)来注册状态机工厂。</p>\n<pre><code class="language-java">participantManager.getStateMachineEngine()\n    .registerStateModelFactory(stateModelDefName, stateModelFactory);\n</code></pre>\n<p>Cluster里只有Participant node才有StateMachineEngine，其他controller，spectator都是null.</p>\n<h4>DefaultMessagingService</h4>\n<p>Helix Agent (manager)有一个消息服务，内置一个线程池 TaskExecutor. 只要agent connect到cluster之后，这个消息服务就会被初始化。</p>\n<h3>StateMachineEngine</h3>\n<ul>\n<li>Participant节点用<em>状态机引擎</em>注册<em>状态模型工厂</em></li>\n<li><em>状态模型工厂</em>创建<em>状态模型</em></li>\n<li><em>状态模型</em>处理状态转换消息。</li>\n</ul>\n<p>状态模型其实是我们日常说的状态机。</p>\n<h2>Questions</h2>\n<ul>\n<li><del>HelixAdmin.addStateModelDef vs HelixManager.getStateMachineEngine().registerStateModelFactory</del></li>\n<li>How does Helix dispatch jobs? via messaging?</li>\n</ul>\n<h1>Helix Recipes</h1>\n<h2>Distributed Lock Manager</h2>\n<p>基于zookeeper，但是能解决：</p>\n<ul>\n<li>第一个节点启动就取得所有lock的问题</li>\n</ul>\n<pre><code>ZkClient.connect -> new ZkEventThread(维护一个BlockingQueue&#x3C;ZkEvent>，这样ZkClient收到zookeeper的消息之后会发送ZkEvent到eventThread的blocking queue)\n    -> ZkEventThread 会不停地循环，从blocking queue里获取event之后event.run\n        -> event是一个匿名类\n\nZkClient是一个ZooKeeper的Watcher实现,  ZkClient.process(WatchedEvent) 会调用各种listener.\n\nCallbackHandler.handleChildChange -> enqueTask -> invoke -> \n    HelixTaskExecutor.onMessage -> scheduleTask (提交任务到线程池) ~~-~~> \n        HelixTask.call -> \n            HelixStateTransitionHandler.handleMessage -> invoke (根据StateModel class里方法上Annotation from，to找到对应的method，然后反射地调用。)\n\nZKHelixManager.connect -> createClient (初始化ZkClient) -> zkClient.subscribeStateChanges\n</code></pre>',frontmatter:{title:"Helix概念模型",date:"September 29, 2022",path:"/2022/helix-concept-model",tags:["helix","apache","distributed"],excerpt:""}}},pathContext:{prev:null,next:{html:"<h1>Thread Model</h1>\n<!-- language:uml -->\n<pre><code>participant IntegrationTest\nparticipant FileStore1\nparticipant HealthReportTimer1\nparticipant HelixTaskExecutor1\nparticipant FileSystemWatchService_master\nparticipant FileStore2\n\nIntegrationTest --> IntegrationTest: startZkServer\nIntegrationTest --> IntegrationTest: setupCluster\nIntegrationTest --> FileStore1 **: start\nFileStore1 --> FileStore1: getHelixManager\nactivate FileStore1\nFileStore1 --> HealthReportTimer1 **: create\nFileStore1 --> HelixTaskExecutor1 **: create\ndeactivate FileStore1\n\nFileStore1 --> FileStore1: registerStateModelFactory\nFileStore1 --> FileStore1: connect to Helix cluster\n\nFileStore1 --> FileStore1: stateModelFactory.createStateModel\\naddExternalViewChangeListener(new Replicator)\n\nFileStore1 --> FileStore1: **OFFLINE -> SLAVE**\nactivate FileStore1\nFileStore1 --> FileStore1: replicator1.start()\\n(no master yet)\ndeactivate FileStore1\n\nIntegrationTest --> FileStore2 **: start\nFileStore2 --> FileStore2: getHelixManager\nFileStore2 --> FileStore2: ...\nFileStore2 --> FileStore2: OFFLINE -> SLAVE\nactivate FileStore2\nFileStore2 --> FileStore2: replicator2.start()\\n(no master yet)\nFileStore2 --> IntegrationTest: report state change\ndeactivate FileStore2\n\nIntegrationTest --> FileStore1: replicator1.onExternalViewChange\nactivate FileStore1\nFileStore1 --> FileStore1: replicator1.start()\\n(still no master yet)\ndeactivate FileStore1\n\nIntegrationTest --> FileStore1: drive to ideal state\nFileStore1 --> FileStore1: **SLAVE -> MASTER**\nactivate FileStore1\nFileStore1 --> FileStore1: replicator1.stop()\nFileStore1 --> FileStore1: checkpointFile.findLastRecordProcessed\nFileStore1 --> FileStore1: high watermark update\nFileStore1 --> FileSystemWatchService_master **: create\nFileStore1 --> IntegrationTest: report state change\ndeactivate FileStore1\n\ngroup file change\n    IntegrationTest --> IntegrationTest: write a file\n\n    FileSystemWatchService_master --> FileSystemWatchService_master: alteration listener\\n monitor file changes\\n死循环\n    FileSystemWatchService_master --> FileStore1: notify changeLogGenerator the file change\n    activate FileStore1\n    FileStore1 --> FileStore1: changeLogGenerator.appendChange\n    deactivate FileStore1\nend\n\nIntegrationTest --> FileStore2: replicator2.onExternalViewChange\nactivate FileStore2\nFileStore2 --> FileStore2: replicator2.start()\\n(there is master now)\nactivate FileStore2\nFileStore2 --> FileStore2: replicator2.startReplication\nactivate FileStore2\nFileStore2 --> BackgroundRsync **: create\ngroup sync file\n    BackgroundRsync --> BackgroundRsync: rsync\\nOnly sync the changeLog from master\\n死循环\n    FileStore2 --> FileSystemWatchService_slave **: create\n    FileSystemWatchService_slave --> FileSystemWatchService_slave: alteration listener\\n monitor file changes\\n死循环\n    FileStore2 --> ChangeLogProcessor **: create\n    ChangeLogProcessor --> ChangeLogProcessor: parse file path from changeLog\\nthen, call rsync to sync the file.\\n死循环\nend\ndeactivate FileStore2\ndeactivate FileStore2\ndeactivate FileStore2\n</code></pre>\n<p>Notes:</p>\n<ol>\n<li>Replicator is a RoutingTableProvider (Spectator) 因为要查找其他instance</li>\n<li>When a Participant is interrupted, there could be no chance to execute the state transition like <code>MASTER->SLAVE</code>, the process just aborts.</li>\n<li>If FileStore1 is down, FileStore2 will become the new Master, and it will stop the <code>replicator</code> first, which will shutdown the original <code>backgroundRsync</code>, <code>FSWatchService_slave</code> and <code>ChangeLogProcessor</code> threads first.</li>\n</ol>",id:"/Users/lliu/github/smilingleo.github.io/src/pages/2022/Rsync Replicated File System with Helix.md absPath of file >>> MarkdownRemark",frontmatter:{date:"2022-09-28T15:40:41.000+08:00",path:"/2022/thread-model-of-rsync-based-distributed-file-system-helix-cluster",title:"基于rsync的分布式文件系统Helix集群线程模型分析",excerpt:"",tags:["helix","distributed","rsync"]}}}}}});
//# sourceMappingURL=path---2022-helix-concept-model-19e947e353cf8ba50e69.js.map