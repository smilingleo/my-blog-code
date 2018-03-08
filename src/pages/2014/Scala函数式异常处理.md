---
path: "/2014/scala-error-handling-in-fp-style"
date: "2014-05-04T07:16:45.000Z"
title:  "Scala函数式异常处理"
tags: ['scala', 'functional programming', 'exception handling']
excerpt: "经常看到很多示例代码，简洁的让人爱不释手，可是真正自己实现的时候，不得不添加各种各样的异常处理逻辑，最后发现代码总量的80%都是再做异常处理，而真正的代码逻辑只有很少的一部分。"
---

经常看到很多示例代码，简洁的让人爱不释手，可是真正自己实现的时候，不得不添加各种各样的异常处理逻辑，最后发现代码总量的80%都是再做异常处理，而真正的代码逻辑只有很少的一部分。

异常处理对于指令式和函数式编程都是同样需要的，只是因为实现方式的不同，让函数式编程看上去更加简洁，优雅，不需要像指令式那么繁琐。

本文的目的，就是介绍函数式编程中常用的一些异常处理策略。记得把这些瑞士军刀放到你的百宝箱中，以后一定用得上。

##空判断Option
如果采访100个程序员，让所有人投票他们在编程时最讨厌做的事情，但又经常犯错误的地方，我估计十有八九会是“空判断”了。

`Null`代表着一个对象还没有被初始化，具体点是对象的指针还没有一个确切的地址。在面向对象编程时，因为操作的都是对象，为了避免在一个`null`上面调用方法，或者 get一个`null`上的属性，而导致“空值异常”，程序员不得不做下面的事情：

假设有下面一个场景：

<!-- language:uml -->
    Selling --> Store
    Selling --> Product
    
简单说，一个商场内有很多商店(Store)，每个商店卖(Selling)很多种商品(Product)，如果希望找出所有销售玩具的商店：

<!-- language:java -->
    public List<Store> findByProductCategory(Category category) {
      if (category == null)	              <1>
        return null;
      List<Product> allProducts = getAllProducts(); // DB lookup
      for (Product prod : allProducts) {
        if (prod.category == null)        <2>
          continue; 
        if (category.equals(prod.category)){
        

## 参考
1. [Error Handling in Scala. https://tersesystems.com/2012/12/27/error-handling-in-scala. 2012](https://tersesystems.com/2012/12/27/error-handling-in-scala/)

