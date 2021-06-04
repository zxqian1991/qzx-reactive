# 说明文档

> `JSX`使得`javascript`能够使用类似`html`的方式去描述页面，一切都是函数，本库继续沿用这一概念。

本库是一个响应式的页面渲染库，它具有以下特征:

1. 响应式渲染，甚至能精细化到具体的某一个属性上去。

2. 底层架构基于微任务，逻辑清晰。

3. 是view层，可以跨平台。只需加载对应平台的渲染驱动，类似`react-dom`、`react-native`。

   @todo列表c	

- [ ] 完善dom的描述文件
- [ ] 添加兼容性支持
- [ ] 添加对指令的支持
- [ ] 添加对同一个数组变更的免diff

## 使用

### 初始化

```jsx
import Lazyman, {HTMLDOMDrive, lazyDocument, Lazyable} from 'lazyx';
Lazyman.drive(HTMLDOMDrive);
const data = Lazyable({count: 1})
Lazyman.render(
  <div onClick={() => data.count++}>{data.count}</div>,
  lazyDocument.querySelector('#root')
);
```

如上便是一个最简单的使用了，打开浏览器，点击`div`你就会发现页面变化了。

### 使用组件

```jsx
import Lazyman, {HTMLDOMDrive, lazyDocument, Lazyable, Stateable, State} from 'lazyx';

@Stateable
class Test extends Component {
  @State()
  count = 1;
  render() {
    return <div onClick={() => this.count++}>{this.count}</div>
  }
}
Lazyman.drive(HTMLDOMDrive);
Lazyman.render(
  <Test />,
  lazyDocument.querySelector('#root')
);
```

### 使用函数

```jsx
import Lazyman, {HTMLDOMDrive, lazyDocument, useLazyable} from 'lazyx';

function Test() {
  const data= useLazyable({count: 1});
  return <div onClick={() => data.count++}>{data.count}</div>;
}
Lazyman.drive(HTMLDOMDrive);
Lazyman.render(
  <Test />,
  lazyDocument.querySelector('#root')
);
```

## 说明

可以说，我们的使用方法与React基本一致，但是，却又更轻松一些，因为这里我们对用到的数据做了**响应化设计**，这个和`React`还是有本质区别的。

在React的眼里，所有的数据都是不同的，都是一次性的，视图仅和数据相关。

在本库中，理念相似，视图依然依赖数据，不同的是数据都是基于对象的，都是可响应的，数据是重复利用的。

> 这不就是vue吗！

是的，某种程度上的确可以说是`vue`，不过，底层的实现却更轻量，使用起来更像React。

### 响应化数据

在本库中，所有的有效的数据都是响应式的数据。

响应式数据是针对对象的，比如数组或普通对象，响应基于`Proxy`。

所有的关于数据的操作，都能够被监听到。

#### Lazyable方式

```jsx
import {Lazyable} from 'lazyx';
const data = Lazyable({count: 1});
```

如上所示，你便创建了一个响应式的数据`data`。后续关于数据内部属性的`增删差`都能够被监听到，这也是本库的基础。

#### Ref方式

```jsx
import {Ref} from 'lazyx';
const data = Ref(10);
console.log(data.value); // 10
```

有的时候，我们使用的并不是一个对象，而是一个普通的值，如果也想响应化，那就可以这么做。等同于:

```jsx
import {Lazyable} from 'lazyx';
const data = Lazyable({value: 10});
```

#### Stateable方式

```jsx
@Stateable()
export class A {
  @State()
  count = 10;
}
const a = new A();
```

有时候，我们会在类中使用响应数据，这时我们可以使用`Lazyable`或者`Ref`来定义各个属性:

```
export class A {
  count = Ref(10);
  data = Lazyable({a: 100})
}
```

但是这么做些许有那么点麻烦，要写很多遍。这时候就可以用上面的方式。

##### Stateable的粗暴方式

```jsx
@Stateable({forceAll: true})
export class A {
  count = 10;
}
const a = new A();
```

配置属性使用`forceAll`可以将所有的属性设置为响应式的。(不包括函数，因为函数是挂载在propotype上的)

**为什么显示的使用可响应数据**

1. 不是所有的数据都和展示相关
2. 一定程度上减少没必要的依赖以提高性能

### 精细化渲染

这是本库的特色，在`React`中，从来没有精细化一说，一些都是两个函数: `setState`和`forceUpdate`。

两个函数一执行，就开始了组件的对比与重新渲染，一旦遇到了大数据展示的情况，页面就会卡死很久。

但事实上，有的时候我们仅仅就是改了一个数据，仅仅只需要一个地方要改变！

这就是精细化渲染的由来，那什么是精细化渲染呢？

```jsx
export function Test() {
  const data = useLazyable({color: 'red'})
  return <div>
    	<div style={{color: data.color}} onClick={() => this.color = this.color === 'red' ? 'blue' : 'red'}>
        我是测试我骄傲
    	</div>
		  <div>aksdnkajnsakjsndjn</div>
      <div>aksdnkajnsakjsndjn</div>
    	.....
  </div>
}
```

如上所示，我们自定义了一个`Test`组件。当我们点击`我是测试我骄傲`的时候，`color`的值会发生变化。

在`React`中，发生了变化的话，将是真个组件重新计算、diff，非常耗时。

但是在我们的组件中，你会发现几乎是`瞬间`的。

没有复杂的`diff`，就是瞬间：

> div的style属性检测到了color的变化，发现与上一个值不同，重新计算style并设置div的属性

就是这么的自然而然。你可以理解成：

**color已经通过一些方式与style绑定了**

也就是说，任何与`color`有关的地方都会自动的更新而不是整体的`DIFF`。

### ref

你也可以使用ref来获取实例，本库的ref的使用更加的简单、符合直觉:

```jsx
function A() {
  const data = useLazyable({ref: undefined});
  useMounted(() => {
    console.log(data.ref);
  })
  return <div ref={data.ref}>dddd</div>
}
```

如上所示，你会在控制台看到打印出的`div实例`。

> 怎么做的？可以思考一下~~在后面函数化部分会介绍。

### 生命周期

> 组件的创建、销毁的过程中，会触发一些生命周期的函数。

#### 类组件

```jsx
class A extends Component {
  onCreated() {
    return () => {}
  }
  onMounted() {
    return () => {}
  }
  onUnMounted() {}
	render() {return <div>ddd</div>}
}
```

##### onCreated

这个函数是在组件实例化后调用，这个时候组件还没被渲染、加载。

这个函数可以返回一个函数，也可以什么都不返回。

若返回的是一个函数，该函数将在组件被卸载的时候调用。

##### onMounted

这个函数在组件被加载后调用，这个时候组件已经切切实时的展示在页面了。

函数可以返回一个函数，也可以什么都不返回。

若返回的是一个函数，该函数将在组件被卸载的时候调用。

##### onUnMounted

该函数在组件卸载的时候被调用。它是最后执行的(前面可能有`onCreated`和`onMounted`的回调)

#### 函数组件

```jsx
export function Test() {
  useCreated(() => {})
  useMounted(() => {})
  useUnMounted(() => {})
  return <div>ddd</div>
}
```

这几个生命周期与类组件一致，只不过是以`hooks`的形式存在。

## 实现

### 函数化

这是依赖得以被记录的关键。

```jsx
export function() {
	const data = useLazyable({count: 0})
  return <div onClick={() => data.count++}>{data.count}</div>
}
```

上述`jsx`最终会转化成这样:

```jsx
React.createElement('div', {onClick: () => data.count++}, [data.count]);
```

如上所示，`createElement`这个函数在开始执行前，`data.count`就已经被记录了，传给`createElement`的仅仅是一个计算后的值，这意味着:

即使你能够通过某种方式去记录依赖，那也是在`createElemet`这层外面去记录。

如果这样的话，又不可不免的走回了老路: `这与setState并无区别`。

**除非，在需要的时候，在计算**

是的，除非，这个值在需要的时候才被计算，然后被记录。

也就是说，如果要实现精细化记录，我们的`createElement`就得像这样:

```jsx
React.createElement(
  'div', 
  [{
    type: 'normal',
    property: 'onClick',
    value: () => () => data.count++
  }],
  [() => data.count]
);
```

如上所示，`this.count`由一个表达式，变成了一个箭头函数。

这个时候，在`React.createElement`执行前，`data.count`还没计算。到了`createElement`内部，在需要的地方再计算、记录即可。

#### props的转化

你会注意到的是，上面除了`data.count`哪里被转换了外，中间的`props`属性部分也被转换了，而且变化还挺大。

是的，`props`也要转化为函数，但是，不同的是，我们在使用的过程中可能经常会使用解构函数。

```jsx
<div style={{color: 'red'}} {...someData} className="sss"></div>
```

如上所示，因为有多种不同使用属性的方式，我们就转换成了一个个的数组，并用`type`来表示类别:

* normal表示就是普通的属性赋值
* rest表示的是解构对象

#### 利用babel实现转化

你也许好奇，怎么转换的呢，这其实都依赖与强大的`babel`，基于`babel`写一个小小的转换插件即可，具体可以参考源码。

#### ref的实现

上面说到了`ref`，你一定很好奇是怎么实现的吧，其实，这是充分的利用了`js`的单线程。

`ref`会被转化成一个`prop`类型:

```jsx
{
  type: 'normal',
  property: 'ref',
  value: () => data.ref
}
```

那我们只需要使用监听函数即可:

```jsx
  private handleRef(value: FunctionalValue) {
    let target: any;
    let key: string | number | symbol | undefined;
    const unsub = onLazyable("get", (t, k, v) => {
      target = t;
      key = k;
    });
    value();
    unsub();
    if (target !== undefined && key !== undefined) {
      target[key] = this.virualElemet.native || this.virualElemet.instance;
    }
  }
```

如上所示，`value`函数执行前开启一个监听，执行完之后解除监听，那么就能够记录依赖了什么数据了。









