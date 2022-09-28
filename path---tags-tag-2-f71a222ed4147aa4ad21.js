webpackJsonp([0x72398d712274],{468:function(e,n){e.exports={pathContext:{posts:[{html:"<h2>Tools</h2>\n<p><a href=\"https://github.com/quick123official/quick_redis_blog\">Free Redis GUI tool</a></p>\n<h2>Redis Commands 缩写</h2>\n<p>Redis里存储的value是有类型的，不同类型的值需要用不同的command来操作：</p>\n<ul>\n<li>List -> L<Cmd>, e.g., LPUSH, LLEN</li>\n<li>Hash -> H<Cmd>, e.g., HGET, HKEYS</li>\n<li>Set -> S<Cmd>, e.g, SADD, SISMEMBER,</li>\n<li>Sorted Set -> Z<Cmd></li>\n</ul>\n<p>其他缩写：</p>\n<ul>\n<li>M<Cmd> , Multiple</li>\n<li>R<Cmd>, Remove or Right(tail)</li>\n<li>B<Cmd>, Blocking, for instance, BLPOP (pop from head), BRPOP (pop from tail)</li>\n</ul>\n<h2>Github Action</h2>\n<p>Use the following to check the file structure, check out another repo</p>\n<pre><code>      - name: Check out site code\n        uses: actions/checkout@v3\n        with:\n          repository: 'smilingleo/smilingleo.github.io'\n          path: 'public'\n\n      - name: List files in the repository\n        run: |\n          ls -Rl ${{ github.workspace }}\n</code></pre>\n<h2>New Hire Training</h2>\n<p>Post Invoice -> UI -> Billing -> Message -> Presentment -> Object Query -> Billing PDF -> Event Service -> Send Email (end customer).</p>\n<h2>Genesis SoT Enable on STG</h2>\n<pre><code class=\"language-bash\">curl -i -H 'zuora-tenant-id: 9' -H 'content-type: application/json' -X POST https://stg2core-int.zuora.com/apps/internal/api/genesis-filtered-tenants/migrations -d '{\"tenantId\": \"10761\"}'\n\ncurl --request POST --url https://stg2core-int.zuora.com/apps/internal/api/genesis/source-of-truth/tenant   --header 'Content-Type: application/json'   --header 'zuora-tenant-id: 9'   --data '{\"tenantId\": \"10761\", \"phase2Enabled\": true,\"enable\": true}'\n</code></pre>",id:"/Users/lliu/github/smilingleo.github.io/src/pages/2022/2022-09-20.md absPath of file >>> MarkdownRemark",frontmatter:{date:"2022-09-21T18:21:43.000+08:00",path:"/2022/redis-commands",title:"Redis Commands 缩写",excerpt:"",tags:["tag1","tag2","tag3"]}}],tagName:"tag2"}}}});
//# sourceMappingURL=path---tags-tag-2-f71a222ed4147aa4ad21.js.map