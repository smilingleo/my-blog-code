---
path: "/2022/redis-commands"
date: "2022-09-21T20:08:16.000+08:00"
title: "Redis Commands 缩写"
tags: ["redis"]
excerpt: ""
---
## Redis Commands 缩写

Redis里存储的value是有类型的，不同类型的值需要用不同的command来操作：
- List -> L<Cmd>, e.g., LPUSH, LLEN
- Hash -> H<Cmd>, e.g., HGET, HKEYS
- Set -> S<Cmd>, e.g, SADD, SISMEMBER,
- Sorted Set -> Z<Cmd>

其他缩写：
- M<Cmd> , Multiple
- R<Cmd>, Remove or Right(tail)
- B<Cmd>, Blocking, for instance, BLPOP (pop from head), BRPOP (pop from tail)