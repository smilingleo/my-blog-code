---
path: "/2013/actor-collection-collabration"
date: "2013-11-17T14:16:45.000Z"
title: "边建边学-3：Actor协调并发场景下的集合操作"
tags: ['scala', 'functional programming']
excerpt: "很多时候为了提高性能，减少IO操作，都会将数据load出来之后缓存在内存中。本站的实现过程中也遇到类似的问题，不希望每次有人访问的时候就读取一次md文件，或者从MongoDB中查一次，而是直接在内存中读取。"
---

##上下文
很多时候为了提高性能，减少IO操作，都会将数据load出来之后缓存在内存中。本站的实现过程中也遇到类似的问题，不希望每次有人访问的时候就读取一次md文件，或者从MongoDB中查一次，而是直接在内存中读取。

带来因减少IO而提升性能的好处的同时，也出现一个人和“缓存”解决方案都会遇到的问题：数据一致性。

简单来说，就是你有同样的一份数据，冗余存放在两个地方，如何确保这两个地方的数据是一致的？再具体一点，可能的问题有：

* 数据更新的原子性

  更新数据的时候，同时将两个地方的数据都同步更新，任何一个地方更新失败，则整体更新失败。

* 缓存线程安全的问题

  如果缓存既可以被读取，又可能被更新，那么就又线程安全问题：多个线程同时操作同一个值的时候怎么协调？

##具体问题
开始的时候，我将所有的文章列表放在一个`scala.collection.mutable.ListBuffer`中：

<!-- language:lang-scala -->
    object Application extends Controller {
      lazy val allPosts: ListBuffer[Post] = ...
    
    }

因为新发布博客会增加集合内数据，所以这里用ListBuffer比较自然。当然用`var` + immutable collection也可以。

对`allPost`的操作主要有三个：

1. 在线编写一个博客的时候需要添加到集合中

2. 该集合本身是无序的，因为排序的规则可能有多种，展现的时候再排序

3. 更新一篇博文的时候同时更新集合中内容。

因为本身Application Object是单例的，多个线程共同运行的场景下就会出现线程安全的问题，类似Servlet中instance级别变量的问题。

##解决方案
直观地想，理想的解决方案就是将所有对`allPost`的写操作都串行起来，这样即使有多个线程同时操作，也没问题了。但是如何将实现串行呢？

在指令式编程的世界里，这个问题比较难于解答，一般需要通过加锁来解决。而一般的程序员看到`lock`, `synchronized`这些关键字就头疼了，即使经过无数次盲试之后侥幸实现了，也会在产品上线的时候出现这样那样、莫名其妙、让你大呼“这不科学”，“WTF”的惊呼！

但是在scala中，我们却不用担心，因为我们有`Akka Actor`。

Actor是另外一种并行计算方式，不同于线程共享内存的并发模型，Actor是基于消息的，强调不同Actor之间不共享数据。有了Actor，问题就迎刃而解了。

具体思路是：重建一个单例Actor，由该Actor来维护ListBuffer变量，所有的写操作，全部通过该消息提交任务交给其处理，这样就将并发的多个写请求串行起来了。

代码片段：

<!-- language:lang-scala -->
    object PostManager {
      // 单例manager actor
      lazy val manager = Akka.system.actorOf(Props[PostManager])
      case class NewPost(post: Post)
      
      def saveOrUpdate(unsavedPost: Post) = {
        manager ! NewPost(unsavedPost)
      }
    }
    
    class PostManager extends Actor {
      import PostManager._
      // actor是单例的，所以文章集合也是单例的。
      // all posts, but not ordered.
      lazy val allPosts: ListBuffer[Post] = Post.allPosts
      
      def receive = {
        case NewPost(newPost) =>
          // 先更新数据库，这样如果更新失败，就不会运行之后代码。一定程度上实现原子性。
          Post.upsert(newPost)
          
          val idx = allPosts.indexWhere( _.fileName == newPost.fileName )
          
          if (idx == -1){
            allPosts += newPost
          } else {
            allPosts.update(idx, newPost)
          }
      }
    }

全站一个文章集合变量感觉有点"玩具"的感觉，不过这个模型其实是可以扩展的，比如将来如果支持多用户、多博客系统，我们可以每个用户创建一个Actor、维护该用户自己的文章列表。这个Actor模型还是可以重用的。