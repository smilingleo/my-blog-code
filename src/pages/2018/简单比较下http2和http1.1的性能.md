---
path: "/2018/simple-performance-comparison-between-http2-and-http1"
date: "2018-03-19T11:24:24.000+08:00"
title: "简单比较下http/2和http/1.1的性能"
tags: ['http/2', '测试']
excerpt: "简单对比http/1.1和http/2的性能"
---

## HTTP/1.1 vs HTTP/2

* 基于二进制的
* 多路复用，用一个连接并行发送多个请求
* 压缩header以降低开销
* 允许server端主动push

## 测试

### 工具

* [nghttp](https://nghttp2.org/)
* Apache Benchmark

### 测试场景

找一个同时支持http/1.1和http/2的站点，分别以两种不同的协议，发送100个请求，比较执行时间。对于http/1.1，使用10个并发（否者输的更惨）。

### HTTP/1.1

```
ab -n 100 -c 10  https://nghttp2.org/httpbin/headers
This is ApacheBench, Version 2.3 <$Revision: 1807734 $>
Copyright 1996 Adam Twiss, Zeus Technology Ltd, http://www.zeustech.net/
Licensed to The Apache Software Foundation, http://www.apache.org/

Benchmarking nghttp2.org (be patient).....done


Server Software:        nghttpx
Server Hostname:        nghttp2.org
Server Port:            443
SSL/TLS Protocol:       TLSv1.2,ECDHE-ECDSA-AES256-GCM-SHA384,256,256
TLS Server Name:        nghttp2.org

Document Path:          /httpbin/headers
Document Length:        160 bytes

Concurrency Level:      10
Time taken for tests:   22.536 seconds
Complete requests:      100
Failed requests:        0
Total transferred:      56695 bytes
HTML transferred:       16000 bytes
Requests per second:    4.44 [#/sec] (mean)
Time per request:       2253.574 [ms] (mean)
Time per request:       225.357 [ms] (mean, across all concurrent requests)
Transfer rate:          2.46 [Kbytes/sec] received

Connection Times (ms)
              min  mean[+/-sd] median   max
Connect:     1454 1588 185.8   1571    3351
Processing:   488  519  25.3    520     614
Waiting:      487  519  25.2    520     614
Total:       1963 2107 182.7   2094    3849

Percentage of the requests served within a certain time (ms)
  50%   2094
  66%   2107
  75%   2123
  80%   2130
  90%   2161
  95%   2171
  98%   2178
  99%   3849
 100%   3849 (longest request)
```

可以看到，并发10发送100个请求总共花了`22.5`秒。

### HTTP/2

```
time nghttp -n -m 100 https://nghttp2.org/httpbin/headers

real	0m2.626s
user	0m0.013s
sys	0m0.007s
```

Note: `-n`丢弃输出。

从输出可以看到，100个请求花了`2.6`秒，完胜http/1.1！

## Bonus

用`nghttp -v`可以观察到http2多路复用的过程。

```
nghttp -v -m 2 https://nghttp2.org/httpbin/headers
[  1.213] Connected
The negotiated protocol: h2
[  2.321] recv SETTINGS frame <length=24, flags=0x00, stream_id=0>
          (niv=4)
          [SETTINGS_MAX_CONCURRENT_STREAMS(0x03):100]
          [SETTINGS_INITIAL_WINDOW_SIZE(0x04):1048576]
          [UNKNOWN(0x08):1]
          [SETTINGS_HEADER_TABLE_SIZE(0x01):8192]
[  2.321] send SETTINGS frame <length=12, flags=0x00, stream_id=0>
          (niv=2)
          [SETTINGS_MAX_CONCURRENT_STREAMS(0x03):100]
          [SETTINGS_INITIAL_WINDOW_SIZE(0x04):65535]
[  2.321] send SETTINGS frame <length=0, flags=0x01, stream_id=0>
          ; ACK
          (niv=0)
[  2.321] send PRIORITY frame <length=5, flags=0x00, stream_id=3>
          (dep_stream_id=0, weight=201, exclusive=0)
[  2.321] send PRIORITY frame <length=5, flags=0x00, stream_id=5>
          (dep_stream_id=0, weight=101, exclusive=0)
[  2.321] send PRIORITY frame <length=5, flags=0x00, stream_id=7>
          (dep_stream_id=0, weight=1, exclusive=0)
[  2.321] send PRIORITY frame <length=5, flags=0x00, stream_id=9>
          (dep_stream_id=7, weight=1, exclusive=0)
[  2.321] send PRIORITY frame <length=5, flags=0x00, stream_id=11>
          (dep_stream_id=3, weight=1, exclusive=0)
[  2.321] send HEADERS frame <length=52, flags=0x25, stream_id=13>
          ; END_STREAM | END_HEADERS | PRIORITY
          (padlen=0, dep_stream_id=11, weight=16, exclusive=0)
          ; Open new stream
          :method: GET
          :path: /httpbin/headers
          :scheme: https
          :authority: nghttp2.org
          accept: */*
          accept-encoding: gzip, deflate
          user-agent: nghttp2/1.31.0
[  2.321] send HEADERS frame <length=25, flags=0x25, stream_id=15>
          ; END_STREAM | END_HEADERS | PRIORITY
          (padlen=0, dep_stream_id=11, weight=16, exclusive=0)
          ; Open new stream
          :method: GET
          :path: /httpbin/headers
          :scheme: https
          :authority: nghttp2.org
          accept: */*
          accept-encoding: gzip, deflate
          user-agent: nghttp2/1.31.0
[  2.904] recv SETTINGS frame <length=0, flags=0x01, stream_id=0>
          ; ACK
          (niv=0)
[  2.904] recv (stream_id=13) :status: 200
[  2.904] recv (stream_id=13) date: Mon, 19 Mar 2018 03:39:26 GMT
[  2.904] recv (stream_id=13) content-type: application/json
[  2.904] recv (stream_id=13) content-length: 170
[  2.904] recv (stream_id=13) access-control-allow-origin: *
[  2.904] recv (stream_id=13) access-control-allow-credentials: true
[  2.904] recv (stream_id=13) x-backend-header-rtt: 0.00342
[  2.904] recv (stream_id=13) strict-transport-security: max-age=31536000
[  2.904] recv (stream_id=13) server: nghttpx
[  2.904] recv (stream_id=13) via: 1.1 nghttpx
[  2.904] recv (stream_id=13) x-frame-options: SAMEORIGIN
[  2.904] recv (stream_id=13) x-xss-protection: 1; mode=block
[  2.904] recv (stream_id=13) x-content-type-options: nosniff
[  2.904] recv HEADERS frame <length=201, flags=0x04, stream_id=13>
          ; END_HEADERS
          (padlen=0)
          ; First response header
{
  "headers": {
    "Accept": "*/*",
    "Accept-Encoding": "gzip, deflate",
    "Host": "nghttp2.org",
    "User-Agent": "nghttp2/1.31.0",
    "Via": "2 nghttpx"
  }
}
[  2.904] recv DATA frame <length=170, flags=0x01, stream_id=13>
          ; END_STREAM
[  2.905] recv (stream_id=15) :status: 200
[  2.905] recv (stream_id=15) date: Mon, 19 Mar 2018 03:39:26 GMT
[  2.905] recv (stream_id=15) content-type: application/json
[  2.905] recv (stream_id=15) content-length: 170
[  2.905] recv (stream_id=15) access-control-allow-origin: *
[  2.905] recv (stream_id=15) access-control-allow-credentials: true
[  2.905] recv (stream_id=15) x-backend-header-rtt: 0.003112
[  2.905] recv (stream_id=15) strict-transport-security: max-age=31536000
[  2.905] recv (stream_id=15) server: nghttpx
[  2.905] recv (stream_id=15) via: 1.1 nghttpx
[  2.905] recv (stream_id=15) x-frame-options: SAMEORIGIN
[  2.905] recv (stream_id=15) x-xss-protection: 1; mode=block
[  2.905] recv (stream_id=15) x-content-type-options: nosniff
[  2.905] recv HEADERS frame <length=25, flags=0x04, stream_id=15>
          ; END_HEADERS
          (padlen=0)
          ; First response header
{
  "headers": {
    "Accept": "*/*",
    "Accept-Encoding": "gzip, deflate",
    "Host": "nghttp2.org",
    "User-Agent": "nghttp2/1.31.0",
    "Via": "2 nghttpx"
  }
}
[  2.905] recv DATA frame <length=170, flags=0x01, stream_id=15>
          ; END_STREAM
[  2.905] send GOAWAY frame <length=8, flags=0x00, stream_id=0>
          (last_stream_id=0, error_code=NO_ERROR(0x00), opaque_data(0)=[])
```

从输出可以看到，发送两个请求，用http2只打开一个连接，并且第二个请求并没有等第一个完成之后再发送，而是同步地发送。