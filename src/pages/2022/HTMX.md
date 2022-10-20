---
path: "/2022/server-side-rendering-htmx"
date: "2022-10-20T13:00:35.000+08:00"
title: "新服务器端渲染Web技术：HTMX"
tags: ["htmx","web"]
excerpt: ""
---
技术圈技术潮流真的是三十年河东，三十年河西。SOA不温不火N多年之后，换了个包装变成Microservice，就火了；之前很多RAD框架，很多DDD框架及产品也是很多年之后随着Low Code/No Code开始火了。Web圈感觉更是如此。服务端渲染框架如JSP在被以Angular, React, Vue等浏览器端渲染的SPA技术吊打多年之后，现在又逐渐开始有东山再起的苗头了。[HTMX](https://htmx.org/)技术就是一个例子。

其实这个技术本身也并不如何神奇，号称让任何html元素变成可ajax也不如何特殊，通过简单的javascript event callback机制都可以实现，不过HTMX采用声明式的定义，将需要用到Javascript的地方都用html element attribute来定义，就让一切变得不那么一样。看上去就像是一个纯静态的html

```html
<div hx-post="/mouse_entered" hx-trigger="mouseenter once">
    [Here Mouse, Mouse!]
</div>
```

就是不知道将来会不会直接也变成一个新的HTML标准。

### What HTMX Does
- server side rendering
- empower any HTML element with the ability to send AJAX call (all HTTP methods)
- dynamically replace HTML of specified scope

### Thymeleaf Template Engine
- server side template engine
- Freemarker vs Velocity (markup tag based rather than plain text based?)
- layout :: fragment
- SpringMVC, return the `layout :: fragment`

https://www.thymeleaf.org/doc/tutorials/3.0/thymeleafspring.html

### WebJars
- wrap javascript libraries using Jars
- loading static assets???? 

#reading-note #web