---
path: "/2022/helix-concept-model"
date: "2022-09-29T19:20:40.000+08:00"
title: "Helix概念模型"
tags: ["helix","apache","distributed"]
excerpt: ""
---
重要的思维方式：从什么角度看的问题

怎么定义 `task`, 从全局的角度看，一个*task*，有下面两个基本属性：
- location 在哪个node上执行
- state 当前处于什么状态

**task == resource, subtask == partition**

所以，从Helix的角度，一个*task*也可以认为是一个*resource*，因为task和resource都有上面两个基本属性。

一个`IdealState` /`CurrentState`也是对某个task/resource来说的。

`ZNRecord` : Zookeeper Node Record, generic的机制来存数据，类似Dao
`HelixProperty`: Domain Object，其实就是封装了ZNRecord，并通过在Helix context有意义的方法。

比如：
- `HelixProperty.getBucketSize()` -> `ZNRecord.getSimpleField()`
- `CurrentState.getState()` -> `ZNRecord.getMapField().get("current_state")`

一个Task可以被拆分为小的subtasks，对应的，resource -> partition
每个task/subtask可以有多个replica，以提高系统的可用性(availability)

<img src="https://mermaid.ink/img/Zmxvd2NoYXJ0IFRECiAgZGlyZWN0aW9uwqBMUgogIHN1YmdyYXBoIHRhc2sKICAgIFRhc2sgLS0+fHNwbGl0fCBTdWJUYXNrCiAgICBTdWJUYXNrIC0tPnwxLi5ufCBSZXBsaWNhCiAgZW5kCiAgZGlyZWN0aW9uwqBMUgogIHN1YmdyYXBoIHJlc291cmNlCiAgICBSZXNvdXJjZSAtLT4gUGFydGl0aW9uCiAgZW5kCiAgVGFzayAtLmFsaWFzLi0+IFJlc291cmNlCiAgU3ViVGFzayAtLmFsaWFzLi0+IFBhcnRpdGlvbg==" />

如下信息就是一个ZNRecord:
```json
{
    "id": "myIndex",
    "simpleFields": {
        "NUM_PARTITIONS": "3",
        "REPLICAS": "2",
    },
    "mapFields": {
        "myIndex_0": {
            "N1": "ONLINE",
            "N2": "ONLINE"
        },
        "myIndex_1": {
            "N2": "ONLINE",
            "N3": "ONLINE"
        },
        "myIndex_2": {
            "N3": "ONLINE",
            "N1": "ONLINE"
        }
    }
}```

注意里面的`simpleFields`, `mapFields`

### State
不同的应用场景，每个node的状态是什么也不尽相同。Leader/StandBy, Online/Offline等等。每个node的状态机相应的也不同。Helix作为一个框架，就是要隔离这些不同，允许用户自定义状态机，以及状态转换的时候做的动作。

注意：这里的状态特指每个Node的状态，不是业务逻辑里某个业务对象的状态。常见的状态机定义：
- Leader / Standby
- Master / Slave
- Online / Offline
- Task/ScheduledTask

- StateModelDefinition (状态机定义)只描述整个状态机长什么样，有哪些状态，从哪个状态可以转换到另外的什么状态；但是定义里并不会具体说：转换的时候做什么事情（变的部分；不同的场景不同的处理）
- 而StateModel（状态模型）才是声明状态转换的时候要做什么事情。所以，StateModel更像是个Callback的集合，*或者叫TransitionBehavior*

### Spectator
每个node有自己的状态，整个cluster需要一个big picture，那就是ExternalView, 这个view会提供给观测者spectator，来监控cluster状态。

### HelixAdmin
Helix cluster manager，通过这个manager可以创建cluster，获取cluster状态，获得cluster上的resource，创建新的resource. 开启maintenance mode.等等。

创建一个HelixAdmin：
```java
HelixAdmin admin = new HelixAdmin.Builder()
    .setZkAddress(zkSrv)
    .build();
```

cluster manager可以定义cluster里有哪些状态机；List<(clusterName, defName, def)>


### HelixManager
这个就是Helix Agent，在participant上面，那就是participant manager，在controller上面，就是controller manager. 任何需要和Helix交互的process都需要它。一般的流程是：

```java
manager = HelixManagerFactory.getZKHelixManager(clusterName, instanceName, ROLE, zkAddr);
manager.addPreConnectionCallback(cb);
manager.connect();
....
manager.disconnect();
```

我们需要通过participant manager(HelixManager)来注册状态机工厂。
```java
participantManager.getStateMachineEngine()
    .registerStateModelFactory(stateModelDefName, stateModelFactory);
```

Cluster里只有Participant node才有StateMachineEngine，其他controller，spectator都是null.

#### DefaultMessagingService
Helix Agent (manager)有一个消息服务，内置一个线程池 TaskExecutor. 只要agent connect到cluster之后，这个消息服务就会被初始化。

### StateMachineEngine
- Participant节点用*状态机引擎*注册*状态模型工厂*
- *状态模型工厂*创建*状态模型*
- *状态模型*处理状态转换消息。

状态模型其实是我们日常说的状态机。

## Questions
- ~~HelixAdmin.addStateModelDef vs HelixManager.getStateMachineEngine().registerStateModelFactory
- How does Helix dispatch jobs? via messaging?

# Helix Recipes

## Distributed Lock Manager

基于zookeeper，但是能解决：
- 第一个节点启动就取得所有lock的问题


ZkClient.connect -> new ZkEventThread(维护一个BlockingQueue<ZkEvent>，这样ZkClient收到zookeeper的消息之后会发送ZkEvent到eventThread的blocking queue)
	-> ZkEventThread 会不停地循环，从blocking queue里获取event之后event.run
		-> event是一个匿名类

ZkClient是一个ZooKeeper的Watcher实现,  ZkClient.process(WatchedEvent) 会调用各种listener.

CallbackHandler.handleChildChange -> enqueTask -> invoke -> 
	HelixTaskExecutor.onMessage -> scheduleTask (提交任务到线程池) ~~-~~> 
		HelixTask.call -> 
			HelixStateTransitionHandler.handleMessage -> invoke (根据StateModel class里方法上Annotation from，to找到对应的method，然后反射地调用。)

ZKHelixManager.connect -> createClient (初始化ZkClient) -> zkClient.subscribeStateChanges

#helix #open-source
