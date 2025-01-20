# Observer

+ [Observer Pattern - wiki](https://en.wikipedia.org/wiki/Observer_pattern)
    - [Observer](https://refactoring.guru/design-patterns/observer)

Observer 樣式 ( 觀察者樣式 ) 的特徵，是以訂閱機制對一個觀察目標註冊，並且在目標本身的狀態改變時發出通知給所有觀察者；觀察者樣式也是事件系統的基礎，事件觀察者回持續監看事件是否發生，而若事件產生則會發送通知給所有訂閱者。

![](./concept.png)
> from [Observer](https://refactoring.guru/design-patterns/observer)

觀察者樣式用不同的語言、框架解釋時會用不同的字詞與結構，例如 GoF 原書使用 Subject 與 Observer、RxJS 框架用 Observable 與 Subscriber、參考文獻用 Publisher 與 Subscriber，雖然用詞與結構有所差異，但設計大方向並沒有不同。

觀察者樣式本質有兩個部分：

+ 通告處理物件：前述的 Observer、Subscriber，主要負責處理目標發出通知時要處理的程序。
+ 通告管理物件：前述的 Subject、Observable、Publisher，主要負責收整通告處理物件，並提供觸發通告的相關行為。

藉由實作這結構便可完成簡易的事件廣播。

## 引用 Observer 模組

Observer 其模組包括一個 Type 三個 Interface 和兩個 Class。

```js
import { TSubscriber, ISubscriber, ISubject, Subject, IPublish, Publisher } from "@/framework/pattern/observer";
```

+ ```TSubscriber``` 為訂閱處理函數型態
+ ```ISubscriber``` 為訂閱者介面，用於建立訂閱資訊
+ ```ISubject``` 為主題介面，規範了主題類別的主要行為
+ ```IPublish``` 為發佈介面，規範了發佈類別的主要行為
+ ```Subject``` 為基於 ```ISubject``` 實作的主題類別
    - 主題物件提供了根據 ```TSubscriber``` 的連接 ( attach )、分離 ( detach )、通知 ( notify ) 的廣播邏輯
+ ```Publisher``` 為繼承 ```Container<ISubject>``` 並實作 ```IPublish``` 的發佈類別
    - 發佈類別會透過 Container 管理登記的 Subject，亦即發佈類別管理者複數個主題。
    - 發佈類別可以經由實作 ```ISubscriber``` 的物件註冊主體與相應的處理函數。

## 主題

#### 連結 ( attach ) 處理函數

```js
let s = new Subject();
s.attach((x : any) => { console.log(x) });
```

原則上，連結 ( attach ) 可以使用匿名函數，但匿名函數會導致記憶體位置僅有主題知道，會因此無法經由分離 ( detach ) 從主題移除處理函數。

#### 分離 ( detach ) 處理函數

```js
let f = (x : any) => { console.log(x) };
let s = new Subject();
s.attach(f);
console.log(s.size); // print 1
s.detach(f);
console.log(s.size); // print 0
```

#### 通告 ( notify ) 處理函數

```js
let f = (x : any) => { console.log("f", x) };
let s = new Subject();
s.attach(f);
s.notify(1); // print f1
```

通告執行順序一般為連結的順序，此外發佈並未採用 async / await 的句型，因此會一次性通知所有處理函數，若後續有非同步行為發動則應是處理函數自身管理。

## 發佈

#### 連結 ( attach )、分離 ( detach ) 處理函數

```js
let f = (x : any) => { console.log(x) };
let p = new Publisher();
p.attach("demo", f);
p.detach("demo", f);
```

原則上，發佈類別的連結與分離就是在主題管理邏輯上，讓指定的主題物件連結處理函數。

#### 訂閱 ( subscribe )、反訂閱 ( unsubscribe )

訂閱是讓符合 ```ISubscriber``` 介面的物件可以將處理函數訂閱到目標主題的方式，其訂閱方式共有三種。

+ 使用匿名物件

```js
let p = new Publisher();
p.subscribe({
    subject: "demo",
    handler: (x : any) => { console.log(x) }
})
```

與前述的匿名函數連結相同，使用匿名物件無法使用反訂閱 ( unsubscribe ) 移除，但若匿名物件的函數是指向另外的具名函數，仍可以透過 ```detach``` 移除，就如下範例。

```js
let f = (x : any) => { console.log(x) };
let p = new Publisher();
p.subscribe({
    subject: "demo",
    handler: f
})
p.detach("demo", f);
```

+ 具名物件

```js
let sub : ISubscriber = {
    subject: "demo",
    handler: (x) => { console.log(x) }
}
let p = new Publisher();
p.subscribe(sub);
p.unsubscribe(sub);
```

具名物件與匿名物件本質相同，但可以透過指向變數的物件來管理訂閱狀態。

+ 類別實作 ```ISubscriber```

```js
class subc implements ISubscriber {
    subject: string = "demo";
    handler ( x : any ) {
        console.log("soc", x)
    }
}
let subo = new subc();
let p = new Publisher();
p.subscribe(subo);
p.unsubscribe(subo);
```

利用類別實作要訂閱的主題，可以讓處理函數可以經由類別得到更多的設計靈活性。

#### 通告 ( notify ) 處理函數

```js
let f = (x : any) => { console.log("f", x) };
let s : ISubscriber = {
    subject: "demo",
    handler: (x) => { console.log("s", x) }
}
let p = new Publisher();
p.attach("demo", f);
p.subscribe(s)
p.notify("demo", 1); // print f1 s1
```

發佈的通告增加要通告的主題，其後對主題內連結的處理函數發送通告。
