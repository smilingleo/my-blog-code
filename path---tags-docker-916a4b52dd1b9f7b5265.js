webpackJsonp([0xb3e7f5b65b18],{481:function(e,n){e.exports={pathContext:{posts:[{html:'<h2>Pull Mysql Docker Image</h2>\n<!-- language: bash -->\n<pre><code>docker pull mysql:5.6\n</code></pre>\n<h2>Create MySQL Config Files</h2>\n<p>For Master, create a <code>mysql.cnf</code> file and add the following content:</p>\n<!-- language: bash -->\n<pre><code>[mysqld]\n\nserver-id = 1\nlog_bin\nbinlog_format = ROW\nbind-address = 0.0.0.0\n\nsql_mode=NO_ENGINE_SUBSTITUTION,STRICT_TRANS_TABLES\n</code></pre>\n<p>For Slave, create another <code>mysql.cnf</code> and add the following content:</p>\n<!-- language: bash -->\n<pre><code>[mysqld]\n\nserver-id = 2\nlog_bin\nbinlog_format = ROW\nbind-address = 0.0.0.0\n\nsql_mode=NO_ENGINE_SUBSTITUTION,STRICT_TRANS_TABLES\n</code></pre>\n<h2>Start Master/Slave MySQL Containers</h2>\n<p>Start Master:</p>\n<!-- language: bash -->\n<pre><code>docker run --name master -v /my/master:/etc/mysql/conf.d -e MYSQL_ROOT_PASSWORD=my-secret-pw -d mysql:5.6\n</code></pre>\n<p>Start Slave:</p>\n<!-- language: bash -->\n<pre><code>docker run --name slave -v /my/slave:/etc/mysql/conf.d -e MYSQL_ROOT_PASSWORD=my-secret-pw --link master:master -d mysql:5.6\n</code></pre>\n<p>The slave node needs to link to master node.</p>\n<h2>Setup Replication</h2>\n<p>Check the master status:</p>\n<!-- language: bash -->\n<pre><code>mysql> show master status \\G\n*************************** 1. row ***************************\n             File: mysql-bin.000003\n         Position: 120\n     Binlog_Do_DB: \n Binlog_Ignore_DB: \nExecuted_Gtid_Set: \n1 row in set (0.00 sec)\n</code></pre>\n<p>the above information is necessary for the slave configuration, especially the <code>File</code> and <code>Position</code>.</p>\n<p>Connect to Slave node, in Mysql Shell:</p>\n<!-- language: bash -->\n<pre><code>mysql> change master to master_host=\'master\',master_user=\'root\',master_password=\'my-secret-pw\',master_log_file=\'mysql-bin.000003\',master_log_pos=120;  \nQuery OK, 0 rows affected (0.00 sec)  \n\nmysql> start slave;\nQuery OK, 0 rows affected (0.01 sec)\n\nmysql> show slave status\\G\n\n// until you see the following two options are \'Yes\'\nSlave_IO_Running: Yes  \nSlave_SQL_Running: Yes  \n</code></pre>\n<p>You need to change the parameters like <code>master_log_file</code> and <code>master_log_pos</code> based on previous <code>show master status</code> output.</p>\n<h2>Test</h2>\n<p>Create some tables and insert some data on master, and check if those data are synced to slave. </p>\n<h2>Change Data Capture (CDC)</h2>\n<p>Here I used an open source library <a href="https://github.com/whitesock/open-replicator">open-replicator</a></p>\n<!-- language: scala -->\n<pre><code>import com.google.code.or._\nimport com.google.code.or.binlog._\nimport com.google.code.or.binlog.impl.event.FormatDescriptionEvent\n\nval or = new OpenReplicator()\nor.setUser("root")\nor.setPassword("my-secret-pw")\nor.setServerId(2);\nor.setHost("slave")\nor.setPort(3306)\nor.setBinlogPosition(120)\nor.setBinlogFileName("mysql-bin.000004")\n\nor.setBinlogEventListener(new BinlogEventListener() {\n  def onEvents(event: BinlogEventV4) = {\n\n  }\n})\n\nor.start()\n</code></pre>\n<p>TBD.\nSee <code>com.linkedin.databus2.producers.ORListener</code></p>\n<h2>References</h2>\n<ol>\n<li><a href="https://registry.hub.docker.com/_/mysql/">Mysql Docker Official Repo</a></li>\n<li><a href="https://github.com/linkedin/databus/wiki/Databus-for-MySQL">Databus for MySQL</a></li>\n</ol>',id:"/volume1/homes/leo/github/my-blog-code/src/pages/2015/Docker创建MySQL主从复制以及CDC测试.md absPath of file >>> MarkdownRemark",frontmatter:{date:"2015-04-21T07:16:45.000Z",path:"/2015/mysql-replication-on-docker",title:"MySQL Master/Slave Replication on Docker",excerpt:"How to setup Mysql master/slave replication.",tags:["docker","mysql"]}}],tagName:"docker"}}}});
//# sourceMappingURL=path---tags-docker-916a4b52dd1b9f7b5265.js.map