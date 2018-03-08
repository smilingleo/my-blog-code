---
path: "/2018/skipper-sni-domain-fronting"
title:  "记一次奇怪的troubleshooting"
date: "2018-03-08T08:30:00.000+08"
tags: ['skipper', 'SNI', 'domain fronting']
excerpt: "在Skipper转发请求到一个https站点的时候，返回莫名404."
---

## 问题描述

因为我们的项目中用到了[Skipper](http://github.com/zalando/skipper)作为UI层的gateway，在支持一个新上线的UI应用的时候，发现一个奇怪的现象，假定：

```
Skipper Domain: https://ui.example.com
Webapp Internal Domain：https://webapp.internal.example.com
```

在Skipper收到一个请求 `GET https://ui.example.com/webapp`的时候，根据Routing规则：

```
Path("/webapp") -> "https://webapp.internal.example.com"
```

请求应该是会被转到这个地址的。测试发现：

<!-- language: lang-bash -->
    # 正常工作，返回200
    curl -i https://webapp.internal.example.com

    # 返回404
    curl -i https://ui.example.com

神奇的就是后面的测试，返回404，而且来源于一个`nginx`服务器。

## 调试

通过 `curl -vv` 比较两个请求的差异，发现两个服务器的证书CN不同，一个是 `*.example.com`，另外一个是 `*.internal.example.com`，怀疑是不是SNI相关的问题，尝试了一下：

```bash
curl -i -H "Host: webapp.internal.example.com" https://ui.example.com
```

哈，成功返回200.

查阅了一下SNI相关资料，发现了疑惑：SNI中hello_name来源于 URL中的domain name，而不是被加密的Header。一个web server如果host多个domains，在request过来的时候，会根据URI中的domain name来查找对应domain的证书，然后用来SSL握手，如果找不到证书，才会返回一个默认的页面，比如404.

但是根据我们的试验，证书应该是正确的，所以应该不是SNI的问题。

## 真相大白

问题是解决了，但是却不知道是什么原因，这让人很不舒服，继续找。无意中发现了这个[Issue](https://github.com/golang/go/issues/22704)，其中提到：

> This would break usage of net/http for [domain fronting](https://www.bamsoftware.com/papers/fronting/), an anti-censorship technique specifically relying on sending different hosts in SNI and HTTP headers. Such a use of net/http is not rare: censorship-resistant tunneling software such as [Lantern](https://github.com/getlantern/lantern) and my own project Geph both use net/http this way.

`domain fronting`？什么鬼，著名的`lantern`居然在用，查了一下，明白了。原来这个技术就是用来翻墙的，哈。

具体来说：

![domain fronting](https://www.bamsoftware.com/papers/fronting/fronting.svg)

比如你想访问被墙的网站`forbidden.example`,你可以用36计之张冠李戴，谎称我访问的是`allowed.example`, 然后在request header中指定`Host: forbidden.example`，用https，这样请求就会被加密，邪恶的探测器们就无法知道你真正的地址，而且这样也符合SNI的握手协议。

现在很多网站都支持这种技术，比如google:

```bash
curl -vv -H "Host: maps.google.com" https://www.google.com
```

从URL上看，访问的是`www.google.com`，但是你看一下返回内容会发现，这个内容却是`maps.google.com`返回的。

在我们的例子中，因为skipper中设置了`-proxy-preserve-host`，这样`Host` header会被传递给下面的目标app，而这个目标app因为支持domain fronting，尝试着去找那个 `ui.example.com`对应的证书，当然没有，所以返回`404`.

## 参考资料

1. [Domain Fronting](https://www.bamsoftware.com/papers/fronting/)
2. [Server Name Indication](https://en.wikipedia.org/wiki/Server_Name_Indication)