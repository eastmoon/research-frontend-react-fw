# Container

Container 是基於 Facade 樣式 ( 外觀樣式 ) 設計的資料結構物件，目的將對物件 ( Object ) 操作整理，並用提供給其他樣式作為內容管理物件的型態。

## 引用 Container 模組

Container 其模組包括一個 Interface 和一個 Class。

```js
import { IContainer, Container } from "@/framework/pattern/container";
```

+ ```IContainer``` 為介面
+ ```Container``` 為基於 ```IContainer``` 完成的實作類別

## 建立待管理類別或介面

由於 Container 宣告需提供泛型，亦即單一 Container 僅能管理一種類別或基於介面實作的類別。

```js
class Demo {
    name : string = "";
    constructor($name : string) {
        this.name = $name
    }
}

let d1 : Demo = new Demo("1");
let d2 : Demo = new Demo("2");
```

以上範例宣告兩個基於該類別的實體物件，後續操作說明會使用。

## 建立 Container

基於指定的類別並以泛型方式宣告物件。

```js
let c : IContainer<Demo> = new Container<Demo>();
```

建立完成的 Container 共有四個操作和一個訪問屬性：

+ ```c.register(name, content)```：註冊內容
+ ```c.remove(name)```：移除內容
+ ```c.retrieve(name)```：取回內容
+ ```c.has(name)```：內容存在與否
+ ```c.size```： 容器包括多少內容

##### 註冊範例

```js
c.register(d1.name, d1);
c.register(d2.name, d2);
console.log(c.size); // print '2'
```

##### 移除範例

```js
c.register(d1.name, d1);
c.remove(d2.name);
console.log(c.size); // print '1'
c.remove(d1.name);
console.log(c.size); // print '0'
```

##### 取回範例

```js
c.register(d1.name, d1);
let d : Demo = c.retrieve(d1.name);
console.log( d === d1 ); // print 'true'
```

需要注意，取回若提供不存在的名稱，在無法找到目標時回覆為 ```null```

##### 檢測範例

```js
c.register(d1.name, d1);
console.log( c.has(d1.name) ); // print 'true'
console.log( c.has(d2.name) ); // print 'false'
```
