# Mediator

+ [Mediator Pattern - wiki](https://en.wikipedia.org/wiki/Mediator_pattern)
    - [Mediator](https://refactoring.guru/design-patterns/mediator)

Mediator 樣式 ( 中介者樣式 ) 的特徵，是建立一個中介物件，管理其他物件間的互動邏輯，從而避免物件間直接互動，導致物件間的依賴度提升且複雜化。

![](./concept.png)
> from [Mediator](https://refactoring.guru/design-patterns/mediator)


中介者樣式在很多互動框架中都會提供相似的概念：

+ Angular、Vue 的[雙向綁定](https://angular.dev/guide/templates/two-way-binding)
+ React 的 [Redux](https://redux.js.org/introduction/getting-started)、[zustand](https://zustand.docs.pmnd.rs/getting-started/introduction) 的狀態管理
+ 架構設計樣式中 [MVP ( model view presenter )](https://en.wikipedia.org/wiki/Model%E2%80%93view%E2%80%93presenter)、[MVVM ( model view viewmodel )](https://en.wikipedia.org/wiki/Model%E2%80%93view%E2%80%93viewmodel) 的 presenter、viewmodel。

這些設計概念都是將互動邏輯、數值彙整至一個區域的物件負責管理，並確保視圖 ( View ) 的元件僅負責數值的取用與互動邏輯的觸發。

因此，在實務設計中，對於中介者應該對於互動範圍進行區分：

+ 頁面 ( Page )、圖層 ( Layer ) 的狀態登記與觸發，使用 Mediator
+ 模塊 ( Module ) 的狀態管理，使用 Mediator 或 zustand 等狀態管理服務
+ 元件 ( Component ) 的狀態管理，使用 zustand 等狀態管理服務

這其中的差別在於 Mediator 的設計本身會包括以下設計：

+ 對目標發送事件
+ 對群體進行廣播
+ 行為執行並觸發事件

若僅考慮其中幾項設計，狀態管理的設計會比使用 Mediator 樣式的設計更加簡潔與容易上手，且多數狀態管理工具包括元件的框架更新畫面邏輯；因此，Mediator 應更偏重在視圖 ( View ) 間的行為管理，而非模塊、元件的狀態管理。

## 引用 Mediator 模組

Mediator 其模組包括一個 Interface 和一個 Class。

```js
import { IMediator, Mediator } from "@/framework/pattern/mediator";
```

+ ```IMediator``` 為繼承 ```IPublisher``` 的中介者介面
+ ```Mediator``` 為繼承 ```Publisher``` 並實作 ```IMediator``` 的中介者類別
    - 中介者類別本身繼承觀察者的發佈類別，其主要是用來註冊事件與處理函數。
    - 中介者類別本身具有基於元件的事件連接 ( attach )、分離 ( detach )、觸發 ( on ) 事件對應的處理函數。

## 中介者

以下範本的 ```UIComponet``` 應依據網頁框架改變類別名稱或生成方式。

#### 元件連結事件 ( attachEvent ) 處理事件

```js
let com = new UIComponent()
let m = new Mediator()
com.name = "demo";
com.handler = () => { console.log('show demo') };
m.attachEvent(com.name, "event", com.handler);
console.log(m.count); // print 1
console.log(m.names); // print 'demo'
console.log(m.size); // print 1
console.log(m.keys); // print 'event'
```

中介者繼承觀察者的發佈，因此可以用 ```size``` 與 ```keys``` 取回註冊的事件，但若要註冊的元件明則要用 ```count``` 與 ```names```。

#### 元件分離事件 ( detachEvent ) 處理事件

```js
let com = new UIComponent()
let m = new Mediator()
com.name = "demo";
com.handler1 = () => { console.log('show demo') };
com.handler2 = () => { console.log('show demo') };
m.attachEvent(com.name, "event1", com.handler1);
m.attachEvent(com.name, "event2", com.handler2);
console.log(m.count); // print 1
console.log(m.size); // print 2
com.detachEvent(com.name, "event1");
console.log(m.count); // print 1
console.log(m.size); // print 1
com.detachEvent(com.name);
console.log(m.count); // print 0
console.log(m.size); // print 0
```

中介者的分離事件 ( detachEvent ) 共有兩個參數與不同處理方式：

+ 指輸入元件名稱 ( name ) 與事件名稱 ( event )，會根據這兩資料，刪除中介者管理資料結構中的處理函數。
+ 只輸入元件名稱 ( name )，則會由中介者管理的資料結構中刪除所有元件關聯的事件與處理函數資料。

#### 指定元件執行事件

```js
let com = new UIComponent()
let m = new Mediator()
com.name = "demo";
com.handler = () => { console.log('show demo') };
m.attachEvent(com.name, "event", com.handler);
m.on(com.name, "event"); // print 'show demo'
```

中介者使用觸發 ( on ) 會根據元件名稱、事件名稱來尋找要執行的處理函數，實務觸發可以執行 async / await。

#### 廣播給所有登記的元件

```js
let com = new UIComponent()
let m = new Mediator()
com.name = "demo";
com.handler = () => { console.log('show demo') };
let f = () => { console.log('show fun') };
m.attach("event", f);
m.attachEvent(com.name, "event", com.handler);
m.notify("event"); // print 'show fun' 'show demo'
```

中介者繼承觀察者的發佈，可以使用通知 ( notify ) 並以事件名稱來尋找要執行的處理函數。

#### 繼承 Mediator 後執行行為並觸發廣播

```js
let count = 0;
class SubMediator extends Mediator {
    do() {
        count = 100;
        this.notify("event", 5);
    }
}
let sm : SubMediator = new SubMediator()
let com = new UIComponent()
com.name = "demo";
com.handler = (x) => { console.log('show', (count + x)) };
im.attachEvent(com.name, "event", com.handler);
im.dothing(); // print 'show 105'
```

繼承中介者的類別，應該提供相應的行為函數，而行為函數則會封裝相應的處理邏輯，並用事件通知 ( notify ) 或觸發 ( on ) 讓註冊的元件執行相應的畫面行為。
