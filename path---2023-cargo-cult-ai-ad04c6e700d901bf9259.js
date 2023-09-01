webpackJsonp([0xacab904c0137],{459:function(p,n){p.exports={data:{markdownRemark:{html:'<p>本文为chatGPT翻译稿，原文参见：<a href="https://queue.acm.org/detail.cfm?id=3595860">https://queue.acm.org/detail.cfm?id=3595860</a></p>\n<hr>\n<p>“思考科学问题的能力是智力的定义本质吗？”——艾德琳·V·莱文</p>\n<p>物理学家卡尔·萨根曾经写道：“科学不仅仅是一种知识体系；它还是一种思维方式。”这种思维方式需要怀疑的严谨和残酷的诚实，以彻底调查、推理和试图证伪假设，而不是草率地下结论。但是，人们很容易做出决策。尽管我们自称聪明，但人类很容易相信基于少量相关信息的显著谬误，而不是严格寻求确定因果基础。 </p>\n<p>这种人们如此轻易相信奇妙、奇幻事物的倾向，正是另一位物理学家理查德·费曼所称的船货崇拜科学。费曼以太平洋岛屿上的一群“船货崇拜”者来命名这种现象，他们相信在第二次世界大战后，建造着陆道和控制塔的复制品可以确保补给飞机继续着陆。然而飞机从未来过。这些人忽略了一个事实，即是战争的爆发，而非着陆道的存在，导致飞机在那里着陆。 </p>\n<blockquote>\n<p>wiki: 货物崇拜（英文：Cargo Cults，又译货物运动）是一种宗教形式，特别出现于一些与世隔绝的原住民中。当货物崇拜者看见外来的先进科技物品，便会将之当作神祇般崇拜。</p>\n<p>最为知名的货物崇拜，是瓦努阿图塔纳岛的「约翰布鲁姆教」（John Frum Movement）。第二次世界大战太平洋战争时，美军于塔纳岛创建一临时基地。当时岛上的原住民看见美军于「大铁船」（军舰）内出来，皆觉得十分惊讶。此外，他们也看到，有一些「大铁鸟」（军用飞机）运送穿着美军军服的人及许多物资。这些原住民看见这种情况均感到很惊讶，并觉得这些「大铁船」及「大铁鸟」十分厉害。加上美军也提供部份物资给原住民，而这些物资对原住民来说十分有用，结果令这些原住民将美军当作神。</p>\n</blockquote>\n<p>如今，有人推测，如GPT-4等大型语言模型（LLM）可以看作是通用人工智能（AGI: artificial general intelligence）的早期版本。与任务特定的人工智能（AI）不同，AGI被认为能够执行人类可能能够完成的任何一般任务。认为LLM是新兴AGI的观点令人不安。LLM展示了许多智能行为和原则，但缺少一些基本的东西：<strong>科学探究的严谨</strong>。如今的AI模型缺乏抽象思维能力，包括问答中的“为什么？”和“如何？”。 </p>\n<p>科学思维能力是智能的决定性本质吗？事实上我们并不知道。目前还没有一个全面的理论来解释智能是什么，或者它是如何从基本原则中涌现出来的。然而，显然，如今的LLM尚不能复制科学思维，这使人们能够结合培根的经验主义和笛卡尔的理性主义，扩大科学理论的可证伪知识领域。科学研究方法使人类能够确定普遍性、非决定性和因果性等方面，从而最终实现操纵自然世界，推动人类福祉的发展。 </p>\n<p>有证据表明，人类大脑并非天生就具有科学思维能力，然而，它可以被教会如何这样做。相信UFO、ESP以及社交媒体上传播的任何东西的船货崇拜现象广泛存在，这种现象和萨根、费曼等科学巨匠共用一个物种。如今的尖端LLM也不是天生具有科学性。但与人类大脑不同，有充分理由相信，除非发展新的算法范式，否则他们永远无法实现这一目标。 </p>\n<h2>一种主导的算法范式</h2>\n<p>人工智能领域取得了可观的进展，包括最近引起轰动的ChatGPT，这些进展主要归功于一种称为多层（或深度）神经网络的机器学习方法的成功。这种方法在20世纪40年代被发明，几乎所有神经网络（网）的基本概念以及相关方法（包括卷积神经网络和反向传播）都在20世纪80年代就已经存在了。然而，直到大规模数字数据集和足够快的GPU（图形处理器单元）硬件出现才开始出现使用神经网络的应用。 </p>\n<p>神经网络在当今人工智能领域的主导地位归功于它们惊人的突现能力。神经网络是一种数学函数，提供经验信息的表示，并为给定输入计算输出。神经网络的数学形式是加权有向图，顶点称为神经元，边称为连接。对于模型如GPT-3，它有1750亿连接，因此有1750亿个权重，函数将有数十亿个术语。 </p>\n<p>神经网络的权重和偏差是通过称为深度学习的过程来确定的，该过程使用反向传播算法逐步降低模型预测和训练数据之间的误差。训练后的神经网络模型有效地将训练数据转化为抽象表示，抑制无关信息并放大或扭曲分类所必需的特征。这些抽象表示最初用于实现各种各样的输入数据的分类，但也可以用于生成。今天，AI模型能够生成从聊天提示到图像的任何东西（例如，由生成对抗网络生成的图像）。这些生成任务背后的转换器模型，例如LLM GPT-3，仍然使用神经网络的基本架构，并增加了注意力来通过跟踪序列数据中的关系来学习上下文。 </p>\n<p>因此，使用神经网络进行深度学习已被证明是一种强大而灵活的计算框架。然而，如果目标是实现具有科学推理能力的AGI，这种方法最终可能会停滞不前。神经网络可能在建立普适性、非确定性或因果推理等方面本质上无法实现某些事情。即使是它们所能做的事情，神经网络也需要消耗极高的资源。在通往AGI的道路上，这种方法真正能够取得多大的改进，而且是否真的可持续？</p>\n<h2>从富裕时期到匮乏时期</h2>\n<p>摩尔定律推动的计算能力和存储容量的显著增加，推动了数据语料库的爆炸，使得深度学习等资源密集型方法成为可能。例如，谷歌BERT（双向编码器表示转换）的训练需要33亿个令牌和40多个训练周期。与此相比，一个普通孩子在5岁之前可能听到4500万个单词。这相当于BERT的3000倍之差，也远远不及培训GPT-3可能使用的数百亿个令牌。 </p>\n<p>今天的数据和资源丰富与计算时代的基础算法工作形成了鲜明的对比，当时的创新是基于匮乏的。计算存储和处理能力非常有限且非常宝贵，因此需要新的算法方法来解决在低效的蛮力方法不可能解决的情况下的问题。 </p>\n<p>实现AGI可能需要重新回到这种匮乏的思维模式，设计新的算法方法，可以极大地节省信息处理和抽象模型生成。训练越来越大的神经网络所需的成本和能源消耗的飙升不太可能是可持续的，并且将需要这种转变。如今的大型AI模型的成本可能达数千万美元，并且每年消耗太瓦小时的能源。与之相比，人脑消耗的能量微不足道。 </p>\n<p>好消息是，今天的AI模型中的数据表示可能远非实现某种能力所需的最小算法表示，因此还有充足的空间进行基于匮乏的算法创新。 </p>\n<p>即使解决了这个资源问题，AI基本限制中仍存在无法科学思考的问题。除非引入基本算法创新来使AI能够提出和回答“为什么”的问题，否则当前的方法将无法实现AGI。</p>\n<h2>模型的普遍性——还是缺乏普遍性？</h2>\n<p>神经网络是一种模型。它们提供了一个计算结果的数学过程，而不是直接测量结果。人类已经发展了数个世纪的模型来帮助预测和理解，并最终提高生产率。不需要每次需要特定信息，如火箭的轨迹或电容器中的储存能量时进行测量，通常可以确定一个数学过程，从而实现准确的预测结果。 </p>\n<p>开发这样的预测模型是理论科学的基础。数学模型的成功通常取决于其预测性的普适性。具体来说，开发用于预测一种现象的数学过程在多大程度上能够成功预测完全不同类别的现象？ </p>\n<p>举个例子，考虑开发一个预测行星运动的模型，这是17世纪天文学家约翰内斯·开普勒探讨的问题。开普勒通过仔细研究来自天文学家泰科·布拉赫的详细天文观测数据，创造了他著名的行星运动三定律。这三定律普遍描述了太阳系中行星的轨道形状，速度和周期，基于其距离太阳的距离。虽然这些结果可以推广到其他行星系统或其他轨道体（卫星，人造卫星等），但它们不能转化为非轨道引力现象。艾萨克·牛顿在机械理论和引力理论方面的突破才能发展出一个统一的数学框架，以描述行星运动和苹果从树上掉落的运动。 </p>\n<p>因此，牛顿的方法比开普勒的方法更具有普适性，但这并不是全部。有些物理情境下，牛顿模型会失效。20世纪初的突破，包括爱因斯坦对广义相对论的研究和量子力学理论的发现，提供了更普适的方法来预测不同领域的物理现象。这些数学模型可以用来准确地预测会发生什么，跨越比牛顿模型涉及的问题领域更广泛的范围。 </p>\n<p>AI使用的神经网络模型有多普遍？并不是很普遍。神经网络的预测仅适用于训练中涉及的情况。如果不包括足够不同的情况作为训练数据，AI将无法进行准确的预测。AI的生成能力也受限于培训场景的范围。 </p>\n<p>考虑一个训练了布拉赫天文数据的神经网络；结果将是一个能够预测已知行星相对于地球参考系位置的AI模型，但不可推广到其他坐标系，其他天体或其他行星系统。行星运动的AI模型不仅比开普勒的模型更少普适性，而且无法通过提出行星为什么会运动的问题来朝向增加普适性的方向发展。</p>\n<h2>不同类型的模型</h2>\n<p>值得注意的是两种类型的模型之间的主要区别：人工智能中使用的模型与理论物理中遇到的模型。 </p>\n<p>人工智能模型完全是由数据驱动，使用数学函数——神经网络的函数——来编码大型数据集的抽象表示。 </p>\n<p>理论物理中通常发现的模型，如牛顿力学，是观察到的物理现象的概括。这样的模型以微分或积分方程的形式书写，通过科学方法进行严密的假设测试，以确定其在相关领域内的通用性。这些方程的解决方案往往需要计算强度，需要使用正式的数学方法来精确解决。这些模型还通过描述潜在的数据生成过程来建立因果推断——我们将回到这个主题——。 </p>\n<p>为什么如果它的模型是数据驱动的而不是通用的，人工智能会变得如此有用呢？人工智能似乎特别适合的任务，如图像识别和写作文章，是人类大脑也熟练掌握的任务的一个子集。或许这并不令人惊讶，因为神经网络是受到大脑中神经元突触网络的启发产生的。神经网络已被证明在模拟人类行为方面非常出色，这是一个实验结果——并不基于任何理论基础。没有简单的科学理论来解释人脑实际上是如何工作的，因此无法证明为什么人工智能在模仿大脑能力方面表现得如此出色；但是，当涉及建模这些人类掌握的任务时，还没有更好的替代方案。 </p>\n<p>这里的一个关键点是，无论是人工智能模型还是物理模型，都不能被称为智能。使人类智能与今天的人工智能不同的是其能力：提问为什么，从第一原则出发进行推理，并创建实验和模型来测试假设。真正的人工智能应该做到同样的：开发越来越复杂的模型，以像人类一样普遍地解释现象。这将是远离复制人类船只崇拜行为，对于人工智能的期望目标。</p>\n<h2>不确定性</h2>\n<p>考虑到普适性，还有另一个问题：如果您将所有在宇宙中产生的数据都提供给人工智能，那会怎样？一定有足够大的神经网络能够做任何事情。不幸的是，即使您不知道如何收集、存储和处理所有这些数据，这也是行不通的。这种理想的、数据驱动的超级智能是由数学家皮埃尔-西蒙·拉普拉斯于1814年提出的，但经过20世纪的科学发展已经被证明是不可能实现的。 </p>\n<p>主要原因是宇宙中内在的不确定性，在量子力学领域被发现。古典动力学理论中的混沌系统的额外发现也提出了一个问题：即使初始条件中有微小的扰动，也可能导致截然不同的结果，需要无限精度的测量来进行数据采集。 </p>\n<p>最后，逆问题[见侧栏：人工智能能听到鼓的形状吗？]也提出了另一个挑战：即使有关系统的所有相关数据都可用，也不可能确定其原因，由于非唯一性和从正向问题到逆向问题的信息丢失。 </p>\n<p>量子力学系统和混沌系统是科学家已经确立了一些因果链的两个例子，但具体的结果无法预测。可以编写一个微分方程，以确定性地预测粒子概率振幅的动态演化，但在实际测量之前无法确定可观察量，例如粒子的位置。同样，可以写出混沌系统的控制方程，例如双摆的方程，但在没有精确的初始条件和直接计算的情况下，无法预测其在以后的时间的位置。 </p>\n<p>自然界中充满了这样的例子，意外可能发生，这是由于内在的不确定性所致。通过纯经验方法确定这些现象背后的原因是不可能实现的。</p>\n<h3>侧栏：人工智能能听到鼓的形状吗？</h3>\n<p>我最近开始询问那些来面试研究职位的候选人，是否可能听到一个鼓的形状。这个看似无害的问题是由数学家马克·卡克在1966年提出的，困扰了数学界数十年。 </p>\n<p>我经常得到的快速答案是：“当然可以听到鼓的形状。只需要一个足够大的与鼓面形状相关的声音数据集（用于监督学习），或者甚至不用关联形状（用于非监督学习），并使用有效的训练算法和验证方法。一旦模型被训练好了，它将从任何给定的记录频谱中推断出鼓的形状。” </p>\n<p>这个答案是错误的，这就是为什么卡克著名的问题值得在今天的人工智能背景下解决复杂问题的原因。在20世纪90年代，数学家们最终证明了听到鼓的形状是不可能的，或者至少不是唯一的。这是因为存在形状不同但产生完全相同声音的鼓面，或者在数学上说，是等谱的。数学家们通过研究Helmholtz方程边值问题中得出的洞见，来回答卡克的问题，该方程描述了鼓面的运动。卡克的问题的答案不能仅通过对频谱数据的经验分析来解决。 </p>\n<p>机器学习模型如何处理一对具有不同形状但等谱的鼓面？如果训练数据中包含两种形状的频谱，则在采用有标签的监督学习方法时，模型有有限的可能性得到正确答案。但如果训练中只包含一种形状的频谱，并使用另一种形状的频谱进行推断，则模型会给出错误的预测鼓形状的结果。也许我们应该警惕，并将所有等谱鼓面形状包含在训练集中？那么我们面临的问题是如何事先知道有多少这样的形状。我们必须返回到抽象的数学推理中。 </p>\n<p>对于熟悉逆问题的人来说，卡克的鼓只是一个例子，这些观察结果并不令人惊讶。逆问题试图使用观察到的数据来确定产生数据的因果因素。在振动鼓的情况下，纯经验主导的数据驱动方法只能提供部分理解。然而，随着数据驱动的机器学习的强大工具的不断提高，所有问题都开始看起来像钉子。从分析方法中获得的强大见解被忽视了，这在许多面试候选人中经常发生。 </p>\n<p>虽然大多数候选人答错了这个问题，但他们可以快速学习如何全面地探索逆问题的解决空间。相反，人工智能并不是一种通用智能，它不知道如何问出和回答鼓面谱是什么，是否可能有等谱的鼓，如果有，有多少。人类可以接受培训，提出这些问题，并使用人类已经开发的严谨科学和分析方法，得出全面可证伪的假设作为答案。人工智能还没有达到这个水平。</p>\n<h2>因果推断</h2>\n<p>那么，在可以建立因果关系的情况下呢？即使在这种情况下，AI也不会成功地回答为什么。当前基于神经网络的AI无法推断有关数据生成过程的特征，因此无法建立因果推断。通过科学假设测试和使用反事实逻辑做到这一点，并不在神经网络的范围之内，仍然是人类行为的一个特征，AI尚未能够实现。 </p>\n<p>需要注意的是，人类可能会错误地在因果关系的语境中使用AI，而实际上不存在因果关系——有效地加剧了人类船货崇拜的创造。这是因为神经网络非常擅长识别数据集中的相关性。然而，任何具备基本统计培训经历的人都知道，相关性并不意味着因果关系。存在许多重要的例子，显示出数据相关性映射到虚假因果链的关系，如鸟嘴鸟数量和人类出生率之间的关系以及气候变化的出现是由于海盗数量下降的结果。 </p>\n<p>在关键时刻需要建立因果推断的场景中使用AI的相关能力越来越普遍。一个重要的例子是在确定医学诊断方面应用AI。需要注意的是，在将神经网络委托决策建立在建立因果关系的基础上的情况下（如根据症状确定疾病），特别是当人类生命处于危险之中时，应该谨慎对待。如果用作医生分析数据的辅助工具，在临床环境中，AI可以极大地有益——只要人类医生自身接受过保持独立推理、假设测试和决策制定的培训。AI的输出应被视为一个潜在有益的相关性指标，而不是被视为因果命令。</p>\n<h2>人工智能与人类的交互：增强还是削弱人类智能？</h2>\n<p>为什么人类决策者的独立思考如此重要？除了无法建立因果关系外，AI的输出也无法解释，有时完全毫无意义。这并不是说我们不知道AI如何工作。原则上，可以追踪神经网络为给定输入所做的每个计算，以了解其是如何得出答案的。然而，如今神经网络的规模之大不仅使这种方法不切实际，而且实际上毫无意义，这导致了神经网络的黑箱功能的印象。 </p>\n<p>同样，即使训练算法易于理解，任何给定权重具有特定值的原因也是不可推导的。数十亿个权重是通过许多培训时期与庞大的可选数据库确定的。因此，针对相同任务设计的神经网络，如果经过不同的训练，可能会产生不同的行为，导致权重不同。 </p>\n<p>AI错误和误分类的例子比比皆是。其中一些例子旨在阐明确定错误输出的原因之难。例如，如果像向量梯度那样设计了似乎是噪音的图像添加到图像中，这可能会导致错误的分类，因为它在高维决策边界上跨越了神经网络。 </p>\n<p>在其他情况下，AI分类是错误的，因为它所训练的数据中存在人为干扰。临床情境中的例子包括一个神经网络，它被训练用于在胸片上检测肺炎，但在测试从其他医院的X射线成像系统收集的数据时性能严重下降。这种退化是由于这些其他X射线成像系统图像人为干扰的差异造成的。AI模型还学会了将不相关的特征，如放置在X射线前的病人的金属代币，与疾病发生相关联。 </p>\n<p>如今的转换器模型旨在超越以往的方法，开发AI用于定制应用，如肺炎检测AI模型。 LLMs是领先的例子。这些模型提供了一种新的AI范例，利用迁移学习将一个庞大的模型应用于各种不同的任务。然而，这些基础转换器模型（也称为基础模型）引入了新的风险：所有派生自少数转换器模型的下游AI系统都将继承这些父转换器模型的任何错误或有问题的偏见。 </p>\n<p>还有一些没有意义的转换器模型输出，如ChatGPT的“幻觉”。例如，当询问巨大血管瘤患者是否可以服用抗凝剂时，ChatGPT不仅给出了错误的答案，与所有临床指标相矛盾，因此可能对患者构成致命危险，而且还创建了假冒引文来支持其主张。 </p>\n<p>这不仅令人不安，而且会成为误用AI的明显例子，如果这样的回应应用于临床环境中。 ChatGPT不是设计为提供事实上的正确答案。它被设计为按顺序选择最有可能跟随一串单词的令牌，以与人类语言的句法一致的方式排列一组单词。有意义的答案的有些是统计概率的结果，即在语法正确的段落中实际包含可验证的正确信息的概率。将这种类型的错误输出称为幻觉是不恰当的。这些响应不是由于模型的预期行为出现错误，而是由于模型本身的基本限制造成的。 </p>\n<p>尽管存在这些限制，AI将继续被采用用于人类使用，不可避免地，人类认知将作出相应的调整。最近的历史已经显示，人类会对新技术做出认知调整。互联网搜索引擎的出现改变了人类的回忆，使其更多地权重信息来源而不是信息本身。将AI纳入工作流程中提高人类生产力不应取代独立人类理性的培训和提高。否则，我们的社会可能会出现新的人类船货崇拜热潮。</p>\n<h2>对思维的反思：通向AGI的道路？</h2>\n<p>训练一个足够大的神经网络来模拟大部分人脑所能做的事情可能是有可能的。最近神经网络在图像字幕和文章写作等人类类似任务中的成功表明，大脑的处理或许并不像曾经想象的那样计算困难。这个结果本身可能是一个科学突破。 </p>\n<p>然而，这样的进展并不意味着我们已经完成了实现AGI所需的工作。需要新颖的算法方法来超越纯经验推理的边界，包括科学思维所需的抽象推理、假设测试和反事实逻辑。还需要一种稀缺心态，以实现算法效率，使未来的AI系统能够可持续地消耗资源。 </p>\n<p>尽管存在挑战，但仍有巨大的乐观主义理由。AI和AGI研究提供的最激动人心的机会之一是理解人类思维和智力的一个最大未解决科学问题。迄今为止，没有科学理论能够解释人类的思维方式以及原因。 </p>\n<p>最后值得问的问题是AGI是否真的有可能实现。如果AGI被定义为与人类相等的智能，那么答案必须是肯定的。人脑的存在本身就表明，应该有可能将物质配置成与人一样聪明的形式。但是否AGI真的是一个值得追求的目标还无法确定，因为缺少全面的科学理解关于人类智力的构成。形成类似于船货崇拜的行为绝对不是一个值得模仿的行为，但为什么人类却会这样做还是一个未解之谜。 </p>\n<p>也许人类大脑本质上是有点懒惰的。对于人类来说，通过科学的推理和思考解决问题需要特殊的、集中的精力。人类认知的默认懒惰可能是演化压力选择高效能量支出的结果，因为大脑是一个重要的能量消耗者。在寻求创造能够复制人类大脑能力的AGI之前，这些假设应该得到回答。否则，在未来的某个时候，我们将不仅拥有人类的船货崇拜，还将拥有AGI的船货崇拜。</p>',frontmatter:{title:"Cargo Cult AI： 船货崇拜AI",date:"May 16, 2023",path:"/2023/cargo-cult-ai",tags:["LLM","AGI","ChatGPT"],excerpt:""}}},pathContext:{prev:null,next:{html:'<h1>Stable Diffusion Prompt技巧</h1>\n<p>最近生成类AI技术火热，编程有Github Copilot, 文字转图片有Stable Diffusion。我自己已经用上了Copilot，感觉还是挺有用的。</p>\n<p>周末尝试了一下Stable Diffusion，刚开始感觉这个东西就是个黑魔法，用文字描述你想画的东西，AI就能帮你生成图片。可怎么能生成好看的图片呢？除了一堆搞不懂的调节参数，你好像能控制的只有输入的文字了。</p>\n<p>对于普通用户，你只能不断地试各种输入，不明就理地无脑乱撞。由此，还诞生了个新名词：Prompt Smithing，我自己翻译成了“提词匠”。一定意义上，人就变成了AI助理，我们完全没有掌控能力。</p>\n<p>基于目前机器学习的原理，底层具体是怎么工作的，确实是个黑盒子，很难预测其行为（反过来说，如果我们能准确预测其行为，也就不需要机器学习了），只能不断尝试。不过，懂一些基本的工作原理还是能帮助我们提高效率和准确率的。</p>\n<h2>工作原理</h2>\n<p>Stable Diffusion能画画的原理来源于其学习方式：从互联网上抓取海量的“图片-标题”信息，识别后将其归类进一个“超维空间”。不同的关键词周围有大量的该关键词的图片，从一个关键词移动到另外一个关键词，图片的内容会逐渐向目标关键词演化。</p>\n<p>“trending on artstation"能起作用的原理，就是因为在"artstation", "flickr"等网站上的照片都比较好看，所以我们生成的图片应该尽量靠近这些关键词周边的图片。</p>\n<p>"Octane Render"(显卡渲染，一家新西兰公司的技术)之所以能起作用，也是因为该公司以3d渲染高画质闻名。</p>\n<p>不同的画里面关键词的权重也不同，强权重的关键词会冲淡弱关键词的效果。</p>\n<p>提词出现的顺序也有一定关系。参照上面的原理，提词顺序可能代表不同的路径。</p>\n<p>很多时候，关键字和图片的关联关系不一定是有意义的，也可能只是因为习惯或者由于机器抓取图片标题时，对标题的错误解析，导致AI误以为某些关键词和图片有关联。比如中文标点符号“，”和图片水印。所以，如果遇到这个问题就得把逗号等作为negative prompt过滤掉。</p>\n<h2>最佳实践</h2>\n<p>提词应该带有下面的内容：</p>\n<ol>\n<li>画面主题描述</li>\n<li>风格，比如油画，概念画等等</li>\n<li>艺术家，比如梵高，毕加索等</li>\n</ol>\n<h2>参考资料</h2>\n<ul>\n<li><a href="https://github.com/IDEA-CCNL/Fengshenbang-LM/blob/main/fengshen/examples/stable_diffusion_chinese/taiyi_handbook.md">AI人类助理</a></li>\n<li><a href="https://www.howtogeek.com/833169/how-to-write-an-awesome-stable-diffusion-prompt/">How to write an awesome stable diffusion prompt</a></li>\n<li><a href="https://huggingface.co/stabilityai/stable-diffusion-2">Stable Diffusion 2</a></li>\n<li><a href="https://huggingface.co/spaces/Gustavosta/MagicPrompt-Stable-Diffusion">Magic Prompt (generator)</a></li>\n<li><a href="https://medium.com/@soapsudtycoon/stable-diffusion-trending-on-art-station-and-other-myths-c09b09084e33">Trending on artstation and other myths - part 1</a> - <a href="https://medium.com/@soapsudtycoon/prompt-engineering-trending-on-artstation-and-other-myths-part-2-d61e25a90517">Trending on artstation and other myths - part 2</a> (好文，建议读读)</li>\n</ul>',id:"/volume1/homes/leo/github/my-blog-code/src/pages/2023/2022-11-29 Stable Diffusion Notes.md absPath of file >>> MarkdownRemark",frontmatter:{date:"2023-02-02T12:30:32.000+08:00",path:"/2023/stable-diffusion-prompt-tips",title:"Stable Diffusion Prompt技巧",excerpt:"",tags:["AI","stable diffusion","机器学习"]}}}}}});
//# sourceMappingURL=path---2023-cargo-cult-ai-ad04c6e700d901bf9259.js.map