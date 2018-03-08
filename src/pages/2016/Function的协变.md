---
path: "/2016/function-covariant-contravariant"
date: "2016-02-04T17:16:45.000Z"
title:  "Function的协、逆变"
tags: ['scala', 'functional programming']
excerpt: "泛型编程的时候，协变(covariant)还是逆变(contravariant)很重要，在设计上层API接口的时候，正确的使用协变、逆变可以更好地约束程序员的行为，让实现变得安全、一致。"
---

泛型编程的时候，协变(covariant)还是逆变(contravariant)很重要，在设计上层API接口的时候，正确的使用协变、逆变可以更好地约束程序员的行为，让实现变得安全、一致。

协变、逆变在一般时候是比较容易理解的，但是来到FP世界之后，Function的协变、逆变就变得比较复杂。

比如： 对于`trait List[+T]`

<!-- language:uml -->
    class Animal
    class Dog
    class "List[Animal]" as LA
    class "List[Dog]" as LD
    
    Animal <|-- Dog
    LA <|-- LD
    
那对于`trait CList[-T]`

<!-- language:uml -->
    class Animal
    class Dog
    class "CList[Animal]" as LA
    class "CList[Dog]" as LD
    
    Animal <|-- Dog
    LA --|> LD

这些还都容易理解，对于`trait Func[-I, +O]`的理解就比较费劲了。

<!-- language:lang-scala -->
    import scala.reflect.runtime.universe._
    
    class Animal
    case class Dog(name: String) extends Animal
    
    class Material
    case class Wood(color: String) extends Material
    
    trait Func[-I, +O] {
      def apply(input: I): O
    }
    
    typeOf[Dog] <:< typeOf[Animal]  // return true
    typeOf[Func[Material, Dog]] <:< typeOf[Func[Wood, Animal]]    // retrun true

<!-- language:uml -->
    class Animal
    class Dog
    class Wood
    class Material
    
    class "Func[Wood, Animal]" as LA
    class "Func[Material, Dog]" as LD
    
    
    Wood --|> Material
    LA <|-- LD
    Animal <|-- Dog

理解这个的关键是理解“里氏替换原则”，也就是，任何父类出现的地方，如果用其子类来替换都应该是安全的。从这个角度看，这个`Func`完成的工作是用某种材料来制作某种动物，`Func[Wood, Animal]`是输入木头制作任何动物，`Func[Material, Dog]`是输入任何材料来制作狗。考虑下面的应用场景：

<!-- language:lang-scala -->
    val woods: List[Wood] = ...         //给定一堆木头
    
    val makeAnimalWithWood: Func[Wood, Animal] = ...
    val makeDogWithMaterial: Func[Material, Dog] = ...
    
    val describer: Animal -> String = ...
    
    woods.map(makeAnimalWithWood)       // return List[Animal]
         .map(describer)                // 接受Animal返回String
    
根据里氏替换原则，用`makeDogWithMaterial`替换`makeAnimalWithWood`是安全的。反过来，看下面代码：

<!-- language:lang-scala -->
    val materials: List[Material] = ...           // 给定一堆材料
    
    val makeAnimalWithWood: Func[Wood, Animal] = ...
    val makeDogWithMaterial: Func[Material, Dog] = ...
    
    val describer: Dog -> String = ...
    
    materials.map(makeDogWithMaterial)       // return List[Dog]
         .map(describer)                // 接受Dog返回String

这时候，用`makeAnimalWithWood`来替换`makeDogWithMaterial`就不行了，因为`materials.map(makeAnimalWithWood)`就会编译错误了，因为`makeAnimalWithWood`只接受`Wood`，而代码传递过来的是`Material`.
