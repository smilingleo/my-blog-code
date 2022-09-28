---
path: "/2022/thread-model-of-rsync-based-distributed-file-system-helix-cluster"
date: "2022-09-28T15:40:41.000+08:00"
title: "基于rsync的分布式文件系统Helix集群线程模型分析"
tags: ["helix","distributed","rsync"]
excerpt: ""
---
# Thread Model

```plantuml
@startuml
participant IntegrationTest
participant FileStore1
participant HealthReportTimer1
participant HelixTaskExecutor1
participant FileSystemWatchService_master
participant FileStore2

IntegrationTest --> IntegrationTest: startZkServer
IntegrationTest --> IntegrationTest: setupCluster
IntegrationTest --> FileStore1 **: start
FileStore1 --> FileStore1: getHelixManager
activate FileStore1
FileStore1 --> HealthReportTimer1 **: create
FileStore1 --> HelixTaskExecutor1 **: create
deactivate FileStore1

FileStore1 --> FileStore1: registerStateModelFactory
FileStore1 --> FileStore1: connect to Helix cluster

FileStore1 --> FileStore1: stateModelFactory.createStateModel\naddExternalViewChangeListener(new Replicator)

FileStore1 --> FileStore1: **OFFLINE -> SLAVE**
activate FileStore1
FileStore1 --> FileStore1: replicator1.start()\n(no master yet)
deactivate FileStore1

IntegrationTest --> FileStore2 **: start
FileStore2 --> FileStore2: getHelixManager
FileStore2 --> FileStore2: ...
FileStore2 --> FileStore2: OFFLINE -> SLAVE
activate FileStore2
FileStore2 --> FileStore2: replicator2.start()\n(no master yet)
FileStore2 --> IntegrationTest: report state change
deactivate FileStore2

IntegrationTest --> FileStore1: replicator1.onExternalViewChange
activate FileStore1
FileStore1 --> FileStore1: replicator1.start()\n(still no master yet)
deactivate FileStore1

IntegrationTest --> FileStore1: drive to ideal state
FileStore1 --> FileStore1: **SLAVE -> MASTER**
activate FileStore1
FileStore1 --> FileStore1: replicator1.stop()
FileStore1 --> FileStore1: checkpointFile.findLastRecordProcessed
FileStore1 --> FileStore1: high watermark update
FileStore1 --> FileSystemWatchService_master **: create
FileStore1 --> IntegrationTest: report state change
deactivate FileStore1

group file change
    IntegrationTest --> IntegrationTest: write a file

    FileSystemWatchService_master --> FileSystemWatchService_master: alteration listener\n monitor file changes\n死循环
    FileSystemWatchService_master --> FileStore1: notify changeLogGenerator the file change
    activate FileStore1
    FileStore1 --> FileStore1: changeLogGenerator.appendChange
    deactivate FileStore1
end

IntegrationTest --> FileStore2: replicator2.onExternalViewChange
activate FileStore2
FileStore2 --> FileStore2: replicator2.start()\n(there is master now)
activate FileStore2
FileStore2 --> FileStore2: replicator2.startReplication
activate FileStore2
FileStore2 --> BackgroundRsync **: create
group sync file
    BackgroundRsync --> BackgroundRsync: rsync\nOnly sync the changeLog from master\n死循环
    FileStore2 --> FileSystemWatchService_slave **: create
    FileSystemWatchService_slave --> FileSystemWatchService_slave: alteration listener\n monitor file changes\n死循环
    FileStore2 --> ChangeLogProcessor **: create
    ChangeLogProcessor --> ChangeLogProcessor: parse file path from changeLog\nthen, call rsync to sync the file.\n死循环
end
deactivate FileStore2
deactivate FileStore2
deactivate FileStore2
@enduml
```


Notes:

1. Replicator is a RoutingTableProvider (Spectator) 因为要查找其他instance
2. When a Participant is interrupted, there could be no chance to execute the state transition like `MASTER->SLAVE`, the process just aborts.
3. If FileStore1 is down, FileStore2 will become the new Master, and it will stop the `replicator` first, which will shutdown the original `backgroundRsync`, `FSWatchService_slave` and `ChangeLogProcessor` threads first.