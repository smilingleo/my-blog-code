webpackJsonp([37018601524425],{471:function(e,t){e.exports={pathContext:{posts:[{html:'<h1>Thread Model</h1>\n<pre><code class="language-plantuml">@startuml\nparticipant IntegrationTest\nparticipant FileStore1\nparticipant HealthReportTimer1\nparticipant HelixTaskExecutor1\nparticipant FileSystemWatchService_master\nparticipant FileStore2\n\nIntegrationTest --> IntegrationTest: startZkServer\nIntegrationTest --> IntegrationTest: setupCluster\nIntegrationTest --> FileStore1 **: start\nFileStore1 --> FileStore1: getHelixManager\nactivate FileStore1\nFileStore1 --> HealthReportTimer1 **: create\nFileStore1 --> HelixTaskExecutor1 **: create\ndeactivate FileStore1\n\nFileStore1 --> FileStore1: registerStateModelFactory\nFileStore1 --> FileStore1: connect to Helix cluster\n\nFileStore1 --> FileStore1: stateModelFactory.createStateModel\\naddExternalViewChangeListener(new Replicator)\n\nFileStore1 --> FileStore1: **OFFLINE -> SLAVE**\nactivate FileStore1\nFileStore1 --> FileStore1: replicator1.start()\\n(no master yet)\ndeactivate FileStore1\n\nIntegrationTest --> FileStore2 **: start\nFileStore2 --> FileStore2: getHelixManager\nFileStore2 --> FileStore2: ...\nFileStore2 --> FileStore2: OFFLINE -> SLAVE\nactivate FileStore2\nFileStore2 --> FileStore2: replicator2.start()\\n(no master yet)\nFileStore2 --> IntegrationTest: report state change\ndeactivate FileStore2\n\nIntegrationTest --> FileStore1: replicator1.onExternalViewChange\nactivate FileStore1\nFileStore1 --> FileStore1: replicator1.start()\\n(still no master yet)\ndeactivate FileStore1\n\nIntegrationTest --> FileStore1: drive to ideal state\nFileStore1 --> FileStore1: **SLAVE -> MASTER**\nactivate FileStore1\nFileStore1 --> FileStore1: replicator1.stop()\nFileStore1 --> FileStore1: checkpointFile.findLastRecordProcessed\nFileStore1 --> FileStore1: high watermark update\nFileStore1 --> FileSystemWatchService_master **: create\nFileStore1 --> IntegrationTest: report state change\ndeactivate FileStore1\n\ngroup file change\n    IntegrationTest --> IntegrationTest: write a file\n\n    FileSystemWatchService_master --> FileSystemWatchService_master: alteration listener\\n monitor file changes\\n死循环\n    FileSystemWatchService_master --> FileStore1: notify changeLogGenerator the file change\n    activate FileStore1\n    FileStore1 --> FileStore1: changeLogGenerator.appendChange\n    deactivate FileStore1\nend\n\nIntegrationTest --> FileStore2: replicator2.onExternalViewChange\nactivate FileStore2\nFileStore2 --> FileStore2: replicator2.start()\\n(there is master now)\nactivate FileStore2\nFileStore2 --> FileStore2: replicator2.startReplication\nactivate FileStore2\nFileStore2 --> BackgroundRsync **: create\ngroup sync file\n    BackgroundRsync --> BackgroundRsync: rsync\\nOnly sync the changeLog from master\\n死循环\n    FileStore2 --> FileSystemWatchService_slave **: create\n    FileSystemWatchService_slave --> FileSystemWatchService_slave: alteration listener\\n monitor file changes\\n死循环\n    FileStore2 --> ChangeLogProcessor **: create\n    ChangeLogProcessor --> ChangeLogProcessor: parse file path from changeLog\\nthen, call rsync to sync the file.\\n死循环\nend\ndeactivate FileStore2\ndeactivate FileStore2\ndeactivate FileStore2\n@enduml\n</code></pre>\n<p>Notes:</p>\n<ol>\n<li>Replicator is a RoutingTableProvider (Spectator) 因为要查找其他instance</li>\n<li>When a Participant is interrupted, there could be no chance to execute the state transition like <code>MASTER->SLAVE</code>, the process just aborts.</li>\n<li>If FileStore1 is down, FileStore2 will become the new Master, and it will stop the <code>replicator</code> first, which will shutdown the original <code>backgroundRsync</code>, <code>FSWatchService_slave</code> and <code>ChangeLogProcessor</code> threads first.</li>\n</ol>',id:"/volume1/homes/leo/github/my-blog-code/src/pages/2022/Rsync Replicated File System with Helix.md absPath of file >>> MarkdownRemark",frontmatter:{date:"2022-09-28T15:40:41.000+08:00",path:"/2022/thread-model-of-rsync-based-distributed-file-system-helix-cluster",title:"基于rsync的分布式文件系统Helix集群线程模型分析",excerpt:"",tags:["helix","distributed","rsync"]}}],tagName:"rsync"}}}});
//# sourceMappingURL=path---tags-rsync-09d86026a964284b550c.js.map