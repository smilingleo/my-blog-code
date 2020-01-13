---
path: "/2019/rust-tokio-futures-poll-not-ready"
date: "2019-03-01T13:11:29.000+08:00"
title: "自定义Tokio Future.poll返回NotReady"
tags: ["rust", "tokio", "Future", "async programming"]
excerpt: "如何在Future.poll中返回Async::NotReady"
---

## 问题

Tokio是一个很强大的crate，实现了各种异步编程模型，是很多框架的实现基础，比如hyper, linkerd2等等。

在tokio中，一个很核心的概念就是 `Future`，类似 Javascript中的 `Promise`，但不同的是：tokio的future是用了`poll`模型而不是`push`。

```rust
trait Future {
    /// The type of the value returned when the future completes.
    type Item;

    /// The type representing errors that occurred while processing the computation.
    type Error;

    /// The function that will be repeatedly called to see if the future is
    /// has completed or not. The `Async` enum can either be `Ready` or
    /// `NotReady` and indicates whether the future is ready to produce
    /// a value or not.
    fn poll(&mut self) -> Result<Async<Self::Item>, Self::Error>;
}
```

所以，利用future实现异步编程，核心就是要实现自己的future。比如下面这个例子：

```rust
impl Future for HelloWorld {
    type Item = String;
    type Error = ();

    fn poll(&mut self) -> Poll<Self::Item, Self::Error> {
        return Ok(Async::Ready("hello world".to_string()));
    }
}

// A tuple struct, instead of a field struct.
struct Display<T>(T);
impl<T> Future for Display<T> 
where
    T: Future,
    T::Item: fmt::Display,
{
    type Item = ();
    type Error = T::Error;

    fn poll(&mut self) -> Poll<(), T::Error> {
        let value = match self.0.poll() {
            Ok(Async::Ready(value)) => value,
            Ok(Async::NotReady) => return Ok(Async::NotReady),
            Err(error) => return Err(error),
        };
        println!("{}", value);
        Ok(Async::Ready(()))
    }
}

fn main() {
    let future = Display(HelloWorld);
    tokio::run(future);
}
```

好像挺简单。但是仔细想一下，如果这个HelloWorld里需要做一些耗时的操作，需要根据进度返回NotReady或者Ready，也就是，让tokio runtime engine在poll HelloWorld future的时候，如果发现返回NotReady，那就重试。看着Display的poll方法，你可以会很简单~~很傻很天真~~地这么来实现：

```rust
impl Future for HelloWorld {
    type Item = String;
    type Error = ();

    fn poll(&mut self) -> Poll<Self::Item, Self::Error> {
        println!("polling in hello world future");
        let rand = random_integer::random_u16(100u16, 1000u16);
        if rand > 800u16 {
            return Ok(Async::Ready("hello world".to_string()));
        } else {
            return Ok(Async::NotReady);
        }
    }
}
```

写完之后`cargo run`，嗯？怎么卡住了？说好的 `repeatedly call poll method`呢？ 怎么就调用了一遍？

找了半天文档，发现在[tokio官方文档](https://tokio.rs/docs/futures/basic/)中，苦口婆心地强调：

> poll implementations must never return NotReady unless they received NotReady by calling an inner future. 

>  The key take away here is do not return NotReady unless you got NotReady from an inner future.

可是，`inner future`是什么鬼？为什么`inner future`能返回 NotReady，我的Future就不行？

再仔细看文档，发现：

> When a function returns Async::NotReady, it signals that it is currently not in a ready state and is unable to complete the operation. It is critical that the executor is notified when the state transitions to “ready”. Otherwise, the task will hang infinitely, never getting run again.


> Innermost futures, sometimes called “resources”, are the ones responsible for notifying the executor. This is done by calling notify on the task returned by task::current().

OK, 因为tokio future是poll模型，所以需要有一个<ruby>通知<rt>notify</rt></ruby>机制，告诉runtime engine可以再去poll了。

根据这个信息，简单修改如下：

```rust
impl Future for HelloWorld {
    type Item = String;
    type Error = ();

    fn poll(&mut self) -> Poll<Self::Item, Self::Error> {
        println!("polling in hello world future");
        let rand = random_integer::random_u16(100u16, 1000u16);
        if rand > 800u16 {
            return Ok(Async::Ready("hello world".to_string()));
        } else {
            futures::task::current().notify();
            return Ok(Async::NotReady);
        }
    }
}
```

上面修改简单讲就是：

1. 在发现没有完成任务的时候，返回NotReady
2. 并通知对当前task感兴趣的task，具体说就是`task::current()`，在本例中，就是Display。`task::current()`是通过thread local来实现的。

再次运行 `cargo run`：

```
tokio-test [master] $ cargo run
    Finished dev [unoptimized + debuginfo] target(s) in 0.09s
     Running `target/debug/tokio-test`
polling in hello world future
polling in hello world future
polling in hello world future
polling in hello world future
hello world
```

搞定，收工！