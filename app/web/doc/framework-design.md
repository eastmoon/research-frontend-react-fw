# 框架設計

框架設計會包括兩個主要架構設計：

+ Model View Controller
+ Pipe and Filter

此兩個架構設計概念，會基於 [GoF Design Pattern](https://en.wikipedia.org/wiki/Design_Patterns) 一書所述的設計樣式實踐成框架。

## 設計樣式

下列為本專案完成的設計樣式

+ Facade
    - [Model View Controller](../src/framework/pattern/facade/mvc)、[testcase](../test/framework/pattern/facade-mvc.spec.ts)
    - [Progress ( Pipe & Filter )](../src/framework/pattern/facade/progress)、[testcase](../test/framework/pattern/facade-progress.spec.ts)
    - [Container](../src/framework/pattern/facade/container)、[testcase](../test/framework/pattern/facade-container.spec.ts)
+ [Singleton](../src/framework/pattern/facade/singleton)、[testcase](../test/framework/pattern/singleton.spec.ts)
+ [Observer](../src/framework/pattern/facade/observer)、[testcase](../test/framework/pattern/observer.spec.ts)
+ [Command](../src/framework/pattern/facade/command)、[testcase](../test/framework/pattern/command.spec.ts)
+ [Mediator](../src/framework/pattern/facade/mediator)、[testcase](../test/framework/pattern/mediator.spec.ts)
+ [Proxy](../src/framework/pattern/facade/proxy)、[testcase](../test/framework/pattern/proxy.spec.ts)

## React MVC 框架實用規劃

+ 應用核心 ( Application )
    - 基於唯一介面 ( Singleton Facade ) 樣式設計
    - 可供存取 Model、View、Controller 註冊內容

+ 流程控制 ( Controller )
    - 進程 ( Progress )
        + 基於 Pipe & Filter 架構設計
    - 導覽 ( Navigation )
        + 基於 Router 路徑解析觸發流程控制

+ 資料模組 ( Model )
    - 服務 ( Service )
        + 用於執行遠端介面的業務邏輯
        + 僅負責管理發送邏輯
        + 僅負責統一整理取回資料
    - 代理 ( Proxy )
        + 數據彙整的資料模型
        + 若數據變更，基於觀察者 ( Observer ) 樣式廣播給偵聽者
    - 狀態 ( State )
        + 視圖元件的狀態，亦即 MVP 架構中的 Presenter
        + 基於 React 的狀態設計進行相應設計調整

+ 視圖模塊 ( View )
    - 頁面 ( Page )
        + 基於 React 規範，複合數個圖層，以 HTML、CSS、JavaScript 組成的頁面藍圖
        + 頁面負責管理相關的圖層註冊
        + 頁面負責管理相關的代理啟動
        + 頁面負責管理相應的流程啟動
        + 應註冊至應用核心
    - 圖層 ( Layer )
        + 基於 React 規範，以 HTML、CSS、JavaScript 組成座標框
        + 呈現內容是系統提供的模塊或元件
        + 應註冊至應用核心
    - 模塊 ( Module )
        + 基於 React 規範，複合數個元件，並以 HTML、CSS、JavaScript 組成互動行為與呈現內容
        + 應可於元件開發伺服器獨立測試與編輯
    - 元件 ( Compoennt )
        + 基於 React 規範，以 HTML、CSS、JavaScript 組成互動行為與呈現內容
        + 應可於元件開發伺服器獨立測試與編輯
