---
path: "/2016/jq"
date: "2016-03-25T19:16:45.000Z"
title: "JSON解析利器---JQ"
tags: ['bash','jq','json']
excerpt: "在API first的时代，json作为最常用的格式，充斥着程序猿的屏幕各个角落，掌握一门解析、过滤、转换json输出的工具，已经成为程序猿们安身立命的必要技能。
这里隆重向大家介绍[jq](https://stedolan.github.io/jq/)."
---

在API first的时代，json作为最常用的格式，充斥着程序猿的屏幕各个角落，掌握一门解析、过滤、转换json输出的工具，已经成为程序猿们安身立命的必要技能。
这里隆重向大家介绍[jq](https://stedolan.github.io/jq/).

## 常用命令

### pipe: |
和unix管道一样。

### .[]
用来将数组中内容传递给后面命令，而不是把整个数组传过去（脱包）
还可以用`.[n]`来获取数组中第n个元素。

### has(key)
检查json对象中是否有key属性。一般结合`select()`使用。

### select(boolean_expr)

用来过滤输入。比如，只输出具有`name`项的json对象，可以用：`jq 'has("name") as $hasName | select($hasName=true)'`

注意，`has(key)`会返回一个boolean，然后传递给后面的stream，一般来说，我更喜欢用`select`，用来过滤而不改变类型。

### as

可以将某个节点object赋予一个变量名，在后面的step里引用，比如你需要引用parent的属性，你可以 `jq '. as $parent | .items | .[] | {"name": .name, "id": $parent.id}'`.

## 实战
我们将使用`docker inspect`输出结果作为例子进行解析。

### 列出所有docker images的inspect结果

<!-- language:bash -->
    docker inspect $(docker images | tail -n +2 | awk '{print $1":"$2}')

### 只列出所有volumes不为空的images

<!-- language:bash -->
    docker inspect $(docker images | tail -n +2 | awk '{print $1":"$2}') | jq '.[] | select(.Config.Volumes!=null)'

### 将json转换为csv

<!-- language:bash -->
    docker inspect $(docker images | tail -n +2 | awk '{print $1":"$2}') | jq '.[] | [(.RepoTags|.[0]), .DockerVersion] | @csv'

上面例子中：

* `.[]`将数组中每个单项传递给后面命令
* `(.RepoTags|.[0])`取出第一个RepoTags的内容也就是image的name:tag
* `.DockerVersion`取出docker版本
* `将上面两个命令用`,`连接，表示将前面的输入同时传递给这两个命令
* 用`[]`将上面两个命令包起来，表示将两个命令的输出结果作为数组中的一个item
* `@csv`将前面的数组输出转换为csv格式。

### 动态key

一些json对象会用动态key，比如id，这时你会想到如果能用JSONPath的方式来搜索某个path段改多好，不用担心，参考这个：[For JSONPath users](https://github.com/stedolan/jq/wiki/For-JSONPath-users)

比如： `..|objects.name`， 这里 `..`将产生一个stream，遍历所有json对象及子对象，然后用`objects`来引用。

## References

1. [JQ Manual](https://stedolan.github.io/jq/manual)
