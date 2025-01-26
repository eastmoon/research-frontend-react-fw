# Progress

+ [Pipeline - wiki](https://en.wikipedia.org/wiki/Pipeline_(software))
    - [Pipe and Filter Architecture - System Design](https://www.geeksforgeeks.org/pipe-and-filter-architecture-system-design/)
    - [Pipes and Filters Architecture](https://www.slmanju.com/2020/05/pipes-and-filters-architecture.html)
    - [軟體架構模式（2）：Pipes and Filters](https://teddy-chen-tw.blogspot.com/2016/11/2pipes-and-filters.html)

管道與過濾器架構 ( Pipe and Filter Architecture )，這是一種架構設計樣式，其概念是將一個流程劃分為不同的步驟的過濾器，透過稱為管道的通道連接。每個過濾器專用於特定的處理功能，無論它涉及轉換、驗證或聚合資料。資料透過管道流過這些過濾器，將一個過濾器的輸出傳送到另一個過濾器的輸入。

因為每個過濾器獨立運作並專注於單一功能，使得此架構具有模組化、可復用性，並允許過濾器在不同的系統或應用程式中使用。

![](./concept.png)
> from [Pipe and Filter Architecture - System Design](https://www.geeksforgeeks.org/pipe-and-filter-architecture-system-design/)

此架構因其流程管理的概念，廣泛運用在諸如加解密工具、圖形渲染工具、人工智慧演算法系統、.NET Core 核心框架等；在互動系統中，管道與過濾器的架構則可用於場景與動畫管理，在此稱為 Progress 框架 ( 進程框架 )。

在 Progress 框架，基於 Pipe & Filter 架構概念，並依賴 Command 設計樣式實作其流程管理。

+ Filter 繼承 Simple command 實作
+ Pipe 繼承 Macro command 實作
+ 每個 Pipe 提供流程控制器
    - 流程控制藍圖，透過 Pipe 建置 Filter 時規劃其中的流程與關係
        + 每個節點 ( node ) 的輸入、輸出為多對多
        + 若有多個輸入端，可是定為輸入狀況決定是否執行
            - 輸入端皆更新才執行
            - 任意輸入端更新就執行，其餘用上個狀態
    - 流程控制物件，讓 Filter 決定前往的步驟
        + 不指定則依據藍圖依序執行
        + 指定步驟不存在則為執行失敗

## 引用 Progress 模組

## Progress 框架

#### 管線與過濾器

```js
let f1 : IFilter = new Filter1();
let f2 : IFilter = new Filter1();
let p : IPipe = new Pipe();
p.register("node1", f1);
p.register("node2", f2);
```

#### 配置管線藍圖

若未配置藍圖，則依據名稱順序依序執行，若有藍圖則依據藍圖構成執行方向。

```js
let p : IPipe = new Pipe();
p.blueprint({
  "in" : "node1",
  "node1" : [ "node2", "node3" ],
  "node2" : "node4",
  "node3" : "node4",
  "node4" : "out"
}, {
  "node4" : "and"
})
```

blueprint 函數共有兩個參數，第一個參數是藍圖每個節點的輸出對象，第二個是多輸入節點的規則 ```and```、```or```，以下為相關符號說明。

+ ```in```、```out``` 表示執行輸入端、輸出端
    - ```in``` 的輸出表示當輸入時會送給甚麼節點執行
    - ```out``` 不會在節點中，但必須只少一個節點的輸出指向 ```out```
+ ```and```、```or``` 當節點為多輸入時，應何時執行
    - ```and``` 表示所有輸入都更新有發出輸入才執行此節點
    - ```or``` 表示任一個輸入節點更新就執行，其餘解點的資料用上個狀態表示
    - 藍圖判斷為多數入的節點預設狀態為 ```or```

#### 巢狀管線

```js
let f1 : IFilter = new Filter1();
let f2 : IFilter = new Filter1();
let p1 : IPipe = new Pipe();
let p2 : IPipe = new Pipe();
let p : IPipe = new Pipe();
p1.register("1", f1);
p1.register("2", f2);
p2.register("1", f1);
p2.register("2", f2);
p.register("1", p1);
p.register("1", p2);
```

倘若巢式管線中的子管線執行失敗時，整個管線皆為失敗。

#### 管線執行

```js
let p : IPipe = new Pipe();
let res : any = p.exec({str : "123", val : 321});
```

執行需要提供一個參數物件，但若不提供則會以空物件傳遞。

執行完畢的輸出若有多個節點指向 ```out```，則輸出會為 key-value 物件結構。

#### 管線管理器

```js
interface IPipeController {
    goto ?: string;
    fail ?: boolean;
    data ?: any;
}
class filter {
    exec($args : any) : any {
        let pc : IPipeController = { "goto": "node1", "data" : {str: "123", val: 321} }
        return pc;
    }
}
```

原則上，執行管線會依照藍圖依序執行，但若執行時發生超出藍圖執行目的的部分，則應該使用 ```IPipeController``` 物件，直接回傳讓 Pipe 變更其流程。

+ ```goto```：指定執行下個節點，並將 ```data``` 的內容作為該節點的輸入；倘若目標節點不存在，視為失敗。
+ ```fail```：執行失敗程序，最終輸出失敗內容。
+ ```data```：該節點本應拋出的資料，若失敗則視為執行最後可拋出的詳細資訊物件。

#### 進程建立

+ 複合 Publisher 類別，並實作 IPublisher 介面
+ 增加相應函數並發佈通知
    - onStart：Progress 開始執行前執行
    - onComplete：Progress 完成時執行
    - onError：Progress 結束時執行

```js
let f1 : IFilter = new Filter1();
let f2 : IFilter = new Filter2();
let p : Progress = new Progress();
p.register("node1", f1);
p.register("node1", f2);
```
