---
path: "/2015/mysql-replication-on-docker"
date: "2015-04-21T07:16:45.000Z"
title:  "MySQL Master/Slave Replication on Docker"
tags: ['docker', 'mysql']
excerpt: "How to setup Mysql master/slave replication."
---

## Pull Mysql Docker Image

<!-- language: bash -->
    docker pull mysql:5.6

## Create MySQL Config Files
For Master, create a `mysql.cnf` file and add the following content:

<!-- language: bash -->
    [mysqld]

    server-id = 1
    log_bin
    binlog_format = ROW
    bind-address = 0.0.0.0

    sql_mode=NO_ENGINE_SUBSTITUTION,STRICT_TRANS_TABLES


For Slave, create another `mysql.cnf` and add the following content:

<!-- language: bash -->
    [mysqld]

    server-id = 2
    log_bin
    binlog_format = ROW
    bind-address = 0.0.0.0

    sql_mode=NO_ENGINE_SUBSTITUTION,STRICT_TRANS_TABLES


## Start Master/Slave MySQL Containers
Start Master:

<!-- language: bash -->
    docker run --name master -v /my/master:/etc/mysql/conf.d -e MYSQL_ROOT_PASSWORD=my-secret-pw -d mysql:5.6


Start Slave:

<!-- language: bash -->
    docker run --name slave -v /my/slave:/etc/mysql/conf.d -e MYSQL_ROOT_PASSWORD=my-secret-pw --link master:master -d mysql:5.6


The slave node needs to link to master node.

## Setup Replication
Check the master status:

<!-- language: bash -->
    mysql> show master status \G
    *************************** 1. row ***************************
                 File: mysql-bin.000003
             Position: 120
         Binlog_Do_DB: 
     Binlog_Ignore_DB: 
    Executed_Gtid_Set: 
    1 row in set (0.00 sec)


the above information is necessary for the slave configuration, especially the `File` and `Position`.

Connect to Slave node, in Mysql Shell:

<!-- language: bash -->
    mysql> change master to master_host='master',master_user='root',master_password='my-secret-pw',master_log_file='mysql-bin.000003',master_log_pos=120;  
    Query OK, 0 rows affected (0.00 sec)  

    mysql> start slave;
    Query OK, 0 rows affected (0.01 sec)

    mysql> show slave status\G

    // until you see the following two options are 'Yes'
    Slave_IO_Running: Yes  
    Slave_SQL_Running: Yes  


You need to change the parameters like `master_log_file` and `master_log_pos` based on previous `show master status` output.

## Test
Create some tables and insert some data on master, and check if those data are synced to slave. 

## Change Data Capture (CDC)
Here I used an open source library [open-replicator](https://github.com/whitesock/open-replicator)

<!-- language: scala -->
    import com.google.code.or._
    import com.google.code.or.binlog._
    import com.google.code.or.binlog.impl.event.FormatDescriptionEvent

    val or = new OpenReplicator()
    or.setUser("root")
    or.setPassword("my-secret-pw")
    or.setServerId(2);
    or.setHost("slave")
    or.setPort(3306)
    or.setBinlogPosition(120)
    or.setBinlogFileName("mysql-bin.000004")

    or.setBinlogEventListener(new BinlogEventListener() {
      def onEvents(event: BinlogEventV4) = {

      }
    })

    or.start()



TBD.
See `com.linkedin.databus2.producers.ORListener`


## References
1. [Mysql Docker Official Repo](https://registry.hub.docker.com/_/mysql/)
2. [Databus for MySQL](https://github.com/linkedin/databus/wiki/Databus-for-MySQL)
