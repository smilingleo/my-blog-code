webpackJsonp([0xcac727c02867],{447:function(e,n){e.exports={data:{markdownRemark:{html:'<h2>Context</h2>\n<p>Learning a new language is not only about its syntax, library, but also its tooling, how to run it, dependency management, how to look up the API document.</p>\n<p>As a Java world engineer over a decade, I have been used to the <a href="https://docs.oracle.com/javase/1.5.0/docs/tooldocs/solaris/javadoc.html">javadoc structure</a>. When I start to learn Rust, everything is different (which is a good thing ^_^), I don\'t even know how to find the right API doc.</p>\n<p>As a spoiled user in Java world, this skill becomes quite important. So I summarised my exploration experience below, and hope it could help folks who have the same trouble.</p>\n<p>Take the following <code>actix-web</code> <a href="https://github.com/actix/examples/blob/master/json/src/main.rs">json example code</a> as an example:</p>\n<pre><code class="language-rust">/// This handler uses `HttpRequest::json()` for loading json object.\nfn index(req: HttpRequest) -> Box&#x3C;Future&#x3C;Item = HttpResponse, Error = Error>> {\n    req.json()\n        .from_err()  // convert all errors into `Error`\n        .and_then(|val: MyObj| {\n            println!("model: {:?}", val);\n            Ok(HttpResponse::Ok().json(val))  // &#x3C;- send response\n        })\n        .responder()\n}\n</code></pre>\n<h2><code>req.json()</code></h2>\n<p>Go to <a href="https://docs.rs/actix-web/0.6.10/actix_web/">actix-web doc site</a>, search <code>HttpRequest</code>.</p>\n<p>There is no <code>json()</code> method in the left-top corner <code>Methods</code> area. Then <code>HttpRequest</code> must implement some <code>trait</code> which has a <code>json()</code> method.</p>\n<p>Go check the <code>Trait Implementations</code>, there is a <code>HttpMessage</code>, which is possible, click it and click the <code>HttpMessage</code> link in the right panel to navigate to the <code>HttpMessage</code> page. Now, you can find the <code>json</code> method in <code>Provided Methods</code> panel.</p>\n<p>Check the source code of <code>HttpMessage::json</code></p>\n<pre><code class="language-rust">fn json&#x3C;T: DeserializeOwned>(self) -> JsonBody&#x3C;Self, T>\nwhere\n    Self: Stream&#x3C;Item = Bytes, Error = PayloadError> + Sized,\n{\n    JsonBody::new(self)\n}\n</code></pre>\n<p>And by the way, <code>JsonBody</code> implements <code>Future</code>, so this <code>json()</code> actually returns a Future of Json.</p>\n<h2><code>.from_err()</code></h2>\n<p>The <code>json()</code> method returns a <code>JsonBody</code> struct, but it doesn\'t have a method named <code>from_err()</code>, But it implements <code>Future</code> trait, which has this method defined.</p>\n<h2><code>.and_then()</code></h2>\n<p>Since <code>from_err()</code> returns a <code>FromErr</code> which also implements <code>Future</code>.</p>\n<h2><code>.responder()</code></h2>\n<p>This one is strange, you can\'t find it in the <code>Methods/Provided Methods</code> areas of <code>Future</code>, <code>HttpMessage</code> or <code>JsonBody</code>.</p>\n<p>Search it and we know it\'s <code>AsyncResponder</code> trait that implements it, and check the source code:</p>\n<pre><code class="language-rust">pub trait AsyncResponder&#x3C;I, E>: Sized {\n    fn responder(self) -> Box&#x3C;Future&#x3C;Item = I, Error = E>>;\n}\n\nimpl&#x3C;F, I, E> AsyncResponder&#x3C;I, E> for F\nwhere\n    F: Future&#x3C;Item = I, Error = E> + \'static,\n    I: Responder + \'static,\n    E: Into&#x3C;Error> + \'static,\n{\n    fn responder(self) -> Box&#x3C;Future&#x3C;Item = I, Error = E>> {\n        Box::new(self)\n    }\n}\n</code></pre>\n<p>So, actually, it is implemented for <code>F: Future</code> already.</p>\n<p><strong>In summary, the whole code chain actually works under <code>Future</code> namespace.</strong></p>\n<h2>What If ...</h2>\n<p>What I hope is actually something like Java(or other strong typed languages) does, given a <code>struct</code>:</p>\n<ul>\n<li>\n<p>we want to know all the <code>trait</code>s it implemented.</p>\n<p>You can find them in the left panel, and also a list in the main area.</p>\n</li>\n<li>\n<p>we want to know all the methods it has, and the methods implemented for all the traits.</p>\n<p>For each trait in the list in main area, there is a <code>[+]</code>, you need to click and unfold it before you can see all the methods, that\'s the trick.</p>\n</li>\n</ul>\n<p>I love Rust, hope the tooling can get better and better over time.</p>\n<p><strong>PS:</strong></p>\n<p>It seems I\'m not the only one who has this trouble, <a href="https://github.com/rust-lang/rust/issues/40116">https://github.com/rust-lang/rust/issues/40116</a></p>',frontmatter:{title:"How To Read Rust API Doc",date:"June 01, 2018",path:"/2018/how-to-read-rust-api-doc",tags:["rust"],excerpt:""}}},pathContext:{prev:{html:'<h2>问题</h2>\n<p>Tokio是一个很强大的crate，实现了各种异步编程模型，是很多框架的实现基础，比如hyper, linkerd2等等。</p>\n<p>在tokio中，一个很核心的概念就是 <code>Future</code>，类似 Javascript中的 <code>Promise</code>，但不同的是：tokio的future是用了<code>poll</code>模型而不是<code>push</code>。</p>\n<pre><code class="language-rust">trait Future {\n    /// The type of the value returned when the future completes.\n    type Item;\n\n    /// The type representing errors that occurred while processing the computation.\n    type Error;\n\n    /// The function that will be repeatedly called to see if the future is\n    /// has completed or not. The `Async` enum can either be `Ready` or\n    /// `NotReady` and indicates whether the future is ready to produce\n    /// a value or not.\n    fn poll(&#x26;mut self) -> Result&#x3C;Async&#x3C;Self::Item>, Self::Error>;\n}\n</code></pre>\n<p>所以，利用future实现异步编程，核心就是要实现自己的future。比如下面这个例子：</p>\n<pre><code class="language-rust">impl Future for HelloWorld {\n    type Item = String;\n    type Error = ();\n\n    fn poll(&#x26;mut self) -> Poll&#x3C;Self::Item, Self::Error> {\n        return Ok(Async::Ready("hello world".to_string()));\n    }\n}\n\n// A tuple struct, instead of a field struct.\nstruct Display&#x3C;T>(T);\nimpl&#x3C;T> Future for Display&#x3C;T> \nwhere\n    T: Future,\n    T::Item: fmt::Display,\n{\n    type Item = ();\n    type Error = T::Error;\n\n    fn poll(&#x26;mut self) -> Poll&#x3C;(), T::Error> {\n        let value = match self.0.poll() {\n            Ok(Async::Ready(value)) => value,\n            Ok(Async::NotReady) => return Ok(Async::NotReady),\n            Err(error) => return Err(error),\n        };\n        println!("{}", value);\n        Ok(Async::Ready(()))\n    }\n}\n\nfn main() {\n    let future = Display(HelloWorld);\n    tokio::run(future);\n}\n</code></pre>\n<p>好像挺简单。但是仔细想一下，如果这个HelloWorld里需要做一些耗时的操作，需要根据进度返回NotReady或者Ready，也就是，让tokio runtime engine在poll HelloWorld future的时候，如果发现返回NotReady，那就重试。看着Display的poll方法，你可以会很简单<del>很傻很天真</del>地这么来实现：</p>\n<pre><code class="language-rust">impl Future for HelloWorld {\n    type Item = String;\n    type Error = ();\n\n    fn poll(&#x26;mut self) -> Poll&#x3C;Self::Item, Self::Error> {\n        println!("polling in hello world future");\n        let rand = random_integer::random_u16(100u16, 1000u16);\n        if rand > 800u16 {\n            return Ok(Async::Ready("hello world".to_string()));\n        } else {\n            return Ok(Async::NotReady);\n        }\n    }\n}\n</code></pre>\n<p>写完之后<code>cargo run</code>，嗯？怎么卡住了？说好的 <code>repeatedly call poll method</code>呢？ 怎么就调用了一遍？</p>\n<p>找了半天文档，发现在<a href="https://tokio.rs/docs/futures/basic/">tokio官方文档</a>中，苦口婆心地强调：</p>\n<blockquote>\n<p>poll implementations must never return NotReady unless they received NotReady by calling an inner future. </p>\n</blockquote>\n<blockquote>\n<p> The key take away here is do not return NotReady unless you got NotReady from an inner future.</p>\n</blockquote>\n<p>可是，<code>inner future</code>是什么鬼？为什么<code>inner future</code>能返回 NotReady，我的Future就不行？</p>\n<p>再仔细看文档，发现：</p>\n<blockquote>\n<p>When a function returns Async::NotReady, it signals that it is currently not in a ready state and is unable to complete the operation. It is critical that the executor is notified when the state transitions to “ready”. Otherwise, the task will hang infinitely, never getting run again.</p>\n</blockquote>\n<blockquote>\n<p>Innermost futures, sometimes called “resources”, are the ones responsible for notifying the executor. This is done by calling notify on the task returned by task::current().</p>\n</blockquote>\n<p>OK, 因为tokio future是poll模型，所以需要有一个<ruby>通知<rt>notify</rt></ruby>机制，告诉runtime engine可以再去poll了。</p>\n<p>根据这个信息，简单修改如下：</p>\n<pre><code class="language-rust">impl Future for HelloWorld {\n    type Item = String;\n    type Error = ();\n\n    fn poll(&#x26;mut self) -> Poll&#x3C;Self::Item, Self::Error> {\n        println!("polling in hello world future");\n        let rand = random_integer::random_u16(100u16, 1000u16);\n        if rand > 800u16 {\n            return Ok(Async::Ready("hello world".to_string()));\n        } else {\n            futures::task::current().notify();\n            return Ok(Async::NotReady);\n        }\n    }\n}\n</code></pre>\n<p>上面修改简单讲就是：</p>\n<ol>\n<li>在发现没有完成任务的时候，返回NotReady</li>\n<li>并通知对当前task感兴趣的task，具体说就是<code>task::current()</code>，在本例中，就是Display。<code>task::current()</code>是通过thread local来实现的。</li>\n</ol>\n<p>再次运行 <code>cargo run</code>：</p>\n<pre><code>tokio-test [master] $ cargo run\n    Finished dev [unoptimized + debuginfo] target(s) in 0.09s\n     Running `target/debug/tokio-test`\npolling in hello world future\npolling in hello world future\npolling in hello world future\npolling in hello world future\nhello world\n</code></pre>\n<p>搞定，收工！</p>',id:"/volume1/homes/leo/github/my-blog-code/src/pages/2019/Tokio Future.poll返回NotReady.md absPath of file >>> MarkdownRemark",frontmatter:{date:"2019-03-01T13:11:29.000+08:00",path:"/2019/rust-tokio-futures-poll-not-ready",title:"自定义Tokio Future.poll返回NotReady",excerpt:"如何在Future.poll中返回Async::NotReady",tags:["rust","tokio","Future","async programming"]}},next:{html:'<h2>HTTP/1.1 vs HTTP/2</h2>\n<ul>\n<li>基于二进制的</li>\n<li>多路复用，用一个连接并行发送多个请求</li>\n<li>压缩header以降低开销</li>\n<li>允许server端主动push</li>\n</ul>\n<h2>测试</h2>\n<h3>工具</h3>\n<ul>\n<li><a href="https://nghttp2.org/">nghttp</a></li>\n<li>Apache Benchmark</li>\n</ul>\n<h3>测试场景</h3>\n<p>找一个同时支持http/1.1和http/2的站点，分别以两种不同的协议，发送100个请求，比较执行时间。对于http/1.1，使用10个并发（否者输的更惨）。</p>\n<h3>HTTP/1.1</h3>\n<pre><code>ab -n 100 -c 10  https://nghttp2.org/httpbin/headers\nThis is ApacheBench, Version 2.3 &#x3C;$Revision: 1807734 $>\nCopyright 1996 Adam Twiss, Zeus Technology Ltd, http://www.zeustech.net/\nLicensed to The Apache Software Foundation, http://www.apache.org/\n\nBenchmarking nghttp2.org (be patient).....done\n\n\nServer Software:        nghttpx\nServer Hostname:        nghttp2.org\nServer Port:            443\nSSL/TLS Protocol:       TLSv1.2,ECDHE-ECDSA-AES256-GCM-SHA384,256,256\nTLS Server Name:        nghttp2.org\n\nDocument Path:          /httpbin/headers\nDocument Length:        160 bytes\n\nConcurrency Level:      10\nTime taken for tests:   22.536 seconds\nComplete requests:      100\nFailed requests:        0\nTotal transferred:      56695 bytes\nHTML transferred:       16000 bytes\nRequests per second:    4.44 [#/sec] (mean)\nTime per request:       2253.574 [ms] (mean)\nTime per request:       225.357 [ms] (mean, across all concurrent requests)\nTransfer rate:          2.46 [Kbytes/sec] received\n\nConnection Times (ms)\n              min  mean[+/-sd] median   max\nConnect:     1454 1588 185.8   1571    3351\nProcessing:   488  519  25.3    520     614\nWaiting:      487  519  25.2    520     614\nTotal:       1963 2107 182.7   2094    3849\n\nPercentage of the requests served within a certain time (ms)\n  50%   2094\n  66%   2107\n  75%   2123\n  80%   2130\n  90%   2161\n  95%   2171\n  98%   2178\n  99%   3849\n 100%   3849 (longest request)\n</code></pre>\n<p>可以看到，并发10发送100个请求总共花了<code>22.5</code>秒。</p>\n<h3>HTTP/2</h3>\n<pre><code>time nghttp -n -m 100 https://nghttp2.org/httpbin/headers\n\nreal    0m2.626s\nuser    0m0.013s\nsys 0m0.007s\n</code></pre>\n<p>Note: <code>-n</code>丢弃输出。</p>\n<p>从输出可以看到，100个请求花了<code>2.6</code>秒，完胜http/1.1！</p>\n<h2>Bonus</h2>\n<p>用<code>nghttp -v</code>可以观察到http2多路复用的过程。</p>\n<pre><code>nghttp -v -m 2 https://nghttp2.org/httpbin/headers\n[  1.213] Connected\nThe negotiated protocol: h2\n[  2.321] recv SETTINGS frame &#x3C;length=24, flags=0x00, stream_id=0>\n          (niv=4)\n          [SETTINGS_MAX_CONCURRENT_STREAMS(0x03):100]\n          [SETTINGS_INITIAL_WINDOW_SIZE(0x04):1048576]\n          [UNKNOWN(0x08):1]\n          [SETTINGS_HEADER_TABLE_SIZE(0x01):8192]\n[  2.321] send SETTINGS frame &#x3C;length=12, flags=0x00, stream_id=0>\n          (niv=2)\n          [SETTINGS_MAX_CONCURRENT_STREAMS(0x03):100]\n          [SETTINGS_INITIAL_WINDOW_SIZE(0x04):65535]\n[  2.321] send SETTINGS frame &#x3C;length=0, flags=0x01, stream_id=0>\n          ; ACK\n          (niv=0)\n[  2.321] send PRIORITY frame &#x3C;length=5, flags=0x00, stream_id=3>\n          (dep_stream_id=0, weight=201, exclusive=0)\n[  2.321] send PRIORITY frame &#x3C;length=5, flags=0x00, stream_id=5>\n          (dep_stream_id=0, weight=101, exclusive=0)\n[  2.321] send PRIORITY frame &#x3C;length=5, flags=0x00, stream_id=7>\n          (dep_stream_id=0, weight=1, exclusive=0)\n[  2.321] send PRIORITY frame &#x3C;length=5, flags=0x00, stream_id=9>\n          (dep_stream_id=7, weight=1, exclusive=0)\n[  2.321] send PRIORITY frame &#x3C;length=5, flags=0x00, stream_id=11>\n          (dep_stream_id=3, weight=1, exclusive=0)\n[  2.321] send HEADERS frame &#x3C;length=52, flags=0x25, stream_id=13>\n          ; END_STREAM | END_HEADERS | PRIORITY\n          (padlen=0, dep_stream_id=11, weight=16, exclusive=0)\n          ; Open new stream\n          :method: GET\n          :path: /httpbin/headers\n          :scheme: https\n          :authority: nghttp2.org\n          accept: */*\n          accept-encoding: gzip, deflate\n          user-agent: nghttp2/1.31.0\n[  2.321] send HEADERS frame &#x3C;length=25, flags=0x25, stream_id=15>\n          ; END_STREAM | END_HEADERS | PRIORITY\n          (padlen=0, dep_stream_id=11, weight=16, exclusive=0)\n          ; Open new stream\n          :method: GET\n          :path: /httpbin/headers\n          :scheme: https\n          :authority: nghttp2.org\n          accept: */*\n          accept-encoding: gzip, deflate\n          user-agent: nghttp2/1.31.0\n[  2.904] recv SETTINGS frame &#x3C;length=0, flags=0x01, stream_id=0>\n          ; ACK\n          (niv=0)\n[  2.904] recv (stream_id=13) :status: 200\n[  2.904] recv (stream_id=13) date: Mon, 19 Mar 2018 03:39:26 GMT\n[  2.904] recv (stream_id=13) content-type: application/json\n[  2.904] recv (stream_id=13) content-length: 170\n[  2.904] recv (stream_id=13) access-control-allow-origin: *\n[  2.904] recv (stream_id=13) access-control-allow-credentials: true\n[  2.904] recv (stream_id=13) x-backend-header-rtt: 0.00342\n[  2.904] recv (stream_id=13) strict-transport-security: max-age=31536000\n[  2.904] recv (stream_id=13) server: nghttpx\n[  2.904] recv (stream_id=13) via: 1.1 nghttpx\n[  2.904] recv (stream_id=13) x-frame-options: SAMEORIGIN\n[  2.904] recv (stream_id=13) x-xss-protection: 1; mode=block\n[  2.904] recv (stream_id=13) x-content-type-options: nosniff\n[  2.904] recv HEADERS frame &#x3C;length=201, flags=0x04, stream_id=13>\n          ; END_HEADERS\n          (padlen=0)\n          ; First response header\n{\n  "headers": {\n    "Accept": "*/*",\n    "Accept-Encoding": "gzip, deflate",\n    "Host": "nghttp2.org",\n    "User-Agent": "nghttp2/1.31.0",\n    "Via": "2 nghttpx"\n  }\n}\n[  2.904] recv DATA frame &#x3C;length=170, flags=0x01, stream_id=13>\n          ; END_STREAM\n[  2.905] recv (stream_id=15) :status: 200\n[  2.905] recv (stream_id=15) date: Mon, 19 Mar 2018 03:39:26 GMT\n[  2.905] recv (stream_id=15) content-type: application/json\n[  2.905] recv (stream_id=15) content-length: 170\n[  2.905] recv (stream_id=15) access-control-allow-origin: *\n[  2.905] recv (stream_id=15) access-control-allow-credentials: true\n[  2.905] recv (stream_id=15) x-backend-header-rtt: 0.003112\n[  2.905] recv (stream_id=15) strict-transport-security: max-age=31536000\n[  2.905] recv (stream_id=15) server: nghttpx\n[  2.905] recv (stream_id=15) via: 1.1 nghttpx\n[  2.905] recv (stream_id=15) x-frame-options: SAMEORIGIN\n[  2.905] recv (stream_id=15) x-xss-protection: 1; mode=block\n[  2.905] recv (stream_id=15) x-content-type-options: nosniff\n[  2.905] recv HEADERS frame &#x3C;length=25, flags=0x04, stream_id=15>\n          ; END_HEADERS\n          (padlen=0)\n          ; First response header\n{\n  "headers": {\n    "Accept": "*/*",\n    "Accept-Encoding": "gzip, deflate",\n    "Host": "nghttp2.org",\n    "User-Agent": "nghttp2/1.31.0",\n    "Via": "2 nghttpx"\n  }\n}\n[  2.905] recv DATA frame &#x3C;length=170, flags=0x01, stream_id=15>\n          ; END_STREAM\n[  2.905] send GOAWAY frame &#x3C;length=8, flags=0x00, stream_id=0>\n          (last_stream_id=0, error_code=NO_ERROR(0x00), opaque_data(0)=[])\n</code></pre>\n<p>从输出可以看到，发送两个请求，用http2只打开一个连接，并且第二个请求并没有等第一个完成之后再发送，而是同步地发送。</p>',id:"/volume1/homes/leo/github/my-blog-code/src/pages/2018/简单比较下http2和http1.1的性能.md absPath of file >>> MarkdownRemark",frontmatter:{date:"2018-03-19T11:24:24.000+08:00",path:"/2018/simple-performance-comparison-between-http2-and-http1",title:"简单比较下http/2和http/1.1的性能",excerpt:"简单对比http/1.1和http/2的性能",tags:["http/2","测试"]}}}}}});
//# sourceMappingURL=path---2018-how-to-read-rust-api-doc-49543ee2720909ad20ce.js.map