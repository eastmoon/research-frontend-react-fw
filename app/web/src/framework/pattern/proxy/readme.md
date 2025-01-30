# Proxy

+ [Proxy Pattern - wiki](https://en.wikipedia.org/wiki/Proxy_pattern)
    - [Proxy](https://refactoring.guru/design-patterns/proxy)

Proxy 樣式 ( 代理者樣式 ) 的特徵，是建立一個中介物件，管理其他物件間的互動邏輯，從而避免物件間直接互動，導致物件間的依賴度提升且複雜化。

![](./concept.png)
> from [Proxy](https://refactoring.guru/design-patterns/proxy)

依照文獻，代理者樣式可以包括以下兩個設計：

#### 服務 ( Service )

服務 ( Service ) 是提供基礎服務操作邏輯的類別，延伸可以依據其服務功能的邏輯設計如下類別：

+ APIService：對遠端 API 通訊擷取數據
+ FetchService：對遠端檔案擷取數據
+ DBService：對資料庫擷取數據
+ SocketService：對 Socket 操作邏輯

#### 代理者 ( Proxy )

代理者 ( Prxoy ) 是提供業務邏輯與數據彙整的類別，其類別應基於功能與業務設計邏輯，並宣告與利用相應的服務 ( Service ) 類別。

此外，代理者完成運作後，自身可以發動事件，並觸發偵聽代理者事件的處理函數。

## 引用 Proxy 模組

Proxy 其模組包括一個 Interface 和兩個 Class。

```js
import { IProxy, Service, Proxy } from "@/framework/pattern/proxy";
```

+ ```IProxy``` 為代理者介面
+ ```Service``` 為基於 ```IProxy``` 實作的服務類別
    - 服務類別的操作函數只實作了基礎運作邏輯
    - 若要對修改操作函數概念，應繼承並改寫操作函數的封裝邏輯
+ ```Proxy``` 為繼承 ```Publisher``` 並實作 ```IProxy``` 的代理者類別
    - 代理者的操作函數在基礎邏輯之上，封裝 Promise 的簡易操作邏輯
    - 代理者繼承 ```Publisher```，可以提供事件註冊與通知

## 代理者

代理者介面 ( IProxy ) 最主要行為是操作函數，此函數是一種封裝函數，會依據服務、代理者的功能設計方向，對要操作要執行的目標函數進行邏輯封裝；因此，實作的服務 ( Service ) 或代理者 ( Proxy ) 會依據其相應功能來調整 ```op``` 函數的邏輯。

操作函數 ```op``` 包括兩個參數，第一個為指定使用的設定屬性、第二個為要傳入函數的設定函數的參數物件，其基礎運作邏輯為：

+ 經由第一參數尋找 ```class``` 宣告的函數。
+ 執行函數時傳入第二參數，並取回該函數的回應內容。
+ 倘若第一參數無法尋找到函數，則應該回應 ```null``` 數值。

#### 服務的操作函數 ( operation function )

若以 Service 的操作函數為範本，其執行結果如下：

```js
let o : IProxy = new Service();
let res : any = o.op("demo", 123);
console.log(res); // print null
```

因為不存在名為 demo 的函數，因此回應為 ```null```，而若要執行 demo 函數，則設計如下：

```js
class SubService extends Service {
    demo($args : any) {
        return $args;
    }
}
let o : IProxy = new Service();
let res : any = o.op("demo", 123);
console.log(res); // print 123
```

#### 代理者的操作函數 ( operation function )

若以 Proxy 的操作函數為範本，在基礎運作邏輯之上增加回應為 Promise 封裝，則設計如下：

```js
let o : IProxy = new Proxy();
o.op("demo", 123)
    .then((response: any) => {
        console.log("Promise resolved with value: " + response);
    })
    .catch((error: any) => {
        console.error("Promise rejected with error: " + error);
    });
```

若改為 async / await 的範本，其設計如下：

```js
try {
  let o : IProxy = new Proxy();
  const value = await o.op("demo", 123);
  console.log('Promise resolved with value: ' + value);
} catch (error) {
  console.error('Promise rejected with error: ' + error);
}
```

以上範例，因為 ```demo``` 不存在會因此執行到錯誤部分 ```error```，而若要執行 demo 函數，則設計如下：

```js
class SubProxy extends Proxy {
    demo($args : any) {
        return $args;
    }
}
let o : IProxy = new Proxy();
o.op("demo", 123)
    .then((response: any) => {
        console.log(response); // print 123
    });
```

實務上 service 與 proxy 的 op 行為都是可以執行 async / await。

#### 代理者的通告

代理者 ( Proxy ) 除了操作函數外，還有繼承觀察者的發佈類別，此目的是當操作完成後可直接發動通知，讓偵聽的物件執行相應的處理函數。

```js
let count = 0;
class SubProxy extends Proxy {
    async calc($args : any) {
        if ( typeof $args === "number" && $args > 0 ) {
            this.notify("calc", $args);
            return $args;
        }
        return null;
    }
}
let f1 = (x : any) => {
    count += (Number(x) + 1);
}
let f2 = (x : any) => {
    count += (Number(x) + 1);
}
let p : Prxoy = new SubProxy();
p.attach("calc", f1);
p.attach("calc", f2);
console.log(p.size);  // print 1
let res : any = await px.op("calc", 1);
console.log(res); // print 1
console.log(count); // print 5
```

上述範例中，當操作函數封裝目標函數並執行時，會藉此發動通知函數 ```notify```，並對連結在 calc 事件下的函數 f1、f2 執行。
