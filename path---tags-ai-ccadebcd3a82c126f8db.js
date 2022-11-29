webpackJsonp([56384549829646],{456:function(t,n){t.exports={pathContext:{posts:[{html:'<h1>Stable Diffusion Prompt技巧</h1>\n<p>最近生成类AI技术火热，编程有Github Copilot, 文字转图片有Stable Diffusion。我自己已经用上了Copilot，感觉还是挺有用的。</p>\n<p>周末尝试了一下Stable Diffusion，刚开始感觉这个东西就是个黑魔法，用文字描述你想画的东西，AI就能帮你生成图片。可怎么能生成好看的图片呢？除了一堆搞不懂的调节参数，你好像能控制的只有输入的文字了。</p>\n<p>对于普通用户，你只能不断地试各种输入，不明就理地无脑乱撞。由此，还诞生了个新名词：Prompt Smithing，我自己翻译成了“提词匠”。一定意义上，人就变成了AI助理，我们完全没有掌控能力。</p>\n<p>基于目前机器学习的原理，底层具体是怎么工作的，确实是个黑盒子，很难预测其行为（反过来说，如果我们能准确预测其行为，也就不需要机器学习了），只能不断尝试。不过，懂一些基本的工作原理还是能帮助我们提高效率和准确率的。</p>\n<h2>工作原理</h2>\n<p>Stable Diffusion能画画的原理来源于其学习方式：从互联网上抓取海量的“图片-标题”信息，识别后将其归类进一个“超维空间”。不同的关键词周围有大量的该关键词的图片，从一个关键词移动到另外一个关键词，图片的内容会逐渐向目标关键词演化。</p>\n<p>“trending on artstation"能起作用的原理，就是因为在"artstation", "flickr"等网站上的照片都比较好看，所以我们生成的图片应该尽量靠近这些关键词周边的图片。</p>\n<p>"Octane Render"(显卡渲染，一家新西兰公司的技术)之所以能起作用，也是因为该公司以3d渲染高画质闻名。</p>\n<p>不同的画里面关键词的权重也不同，强权重的关键词会冲淡弱关键词的效果。</p>\n<p>提词出现的顺序也有一定关系。参照上面的原理，提词顺序可能代表不同的路径。</p>\n<p>很多时候，关键字和图片的关联关系不一定是有意义的，也可能只是因为习惯或者由于机器抓取图片标题时，对标题的错误解析，导致AI误以为某些关键词和图片有关联。比如中文标点符号“，”和图片水印。所以，如果遇到这个问题就得把逗号等作为negative prompt过滤掉。</p>\n<h2>最佳实践</h2>\n<p>提词应该带有下面的内容：</p>\n<ol>\n<li>画面主题描述</li>\n<li>风格，比如油画，概念画等等</li>\n<li>艺术家，比如梵高，毕加索等</li>\n</ol>\n<h2>参考资料</h2>\n<ul>\n<li><a href="https://github.com/IDEA-CCNL/Fengshenbang-LM/blob/main/fengshen/examples/stable_diffusion_chinese/taiyi_handbook.md">AI人类助理</a></li>\n<li><a href="https://www.howtogeek.com/833169/how-to-write-an-awesome-stable-diffusion-prompt/">How to write an awesome stable diffusion prompt</a></li>\n<li><a href="https://huggingface.co/stabilityai/stable-diffusion-2">Stable Diffusion 2</a></li>\n<li><a href="https://huggingface.co/spaces/Gustavosta/MagicPrompt-Stable-Diffusion">Magic Prompt (generator)</a></li>\n<li><a href="https://medium.com/@soapsudtycoon/stable-diffusion-trending-on-art-station-and-other-myths-c09b09084e33">Trending on artstation and other myths - part 1</a> - <a href="https://medium.com/@soapsudtycoon/prompt-engineering-trending-on-artstation-and-other-myths-part-2-d61e25a90517">Trending on artstation and other myths - part 2</a> (好文，建议读读)</li>\n</ul>',id:"/volume1/homes/leo/github/my-blog-code/src/pages/2022/2022-11-29 Stable Diffusion Notes.md absPath of file >>> MarkdownRemark",frontmatter:{date:"2022-11-29T18:40:31.000+08:00",path:"/2022/stable-diffusion-prompt-tips",title:"Stable Diffusion Prompt技巧",excerpt:"",tags:["AI","stable diffusion","机器学习"]}}],tagName:"AI"}}}});
//# sourceMappingURL=path---tags-ai-ccadebcd3a82c126f8db.js.map