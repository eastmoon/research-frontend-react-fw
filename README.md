# React 前端框架研究

React 前端框架基於 MVP 架構概念設計設計，並著重於視圖 ( View ) 的設計與規範，對於單頁應用程式專案提供了優異的開發方向，但考量基於 React 的網頁應用程式，仍需提升整體軟體架構的延展性 ( Extensibility ) 、維護性 ( Maintainability )。

## 開發運維框架

開發運維框架是提供 DevOps 在基礎架構即程式 ( Infrastructure as Code ) 設計概念下，將專案的開發、發佈歸納入專案管理的腳本下，確保轉移至任何開發環境都能基於相應的命令介面執行相應內容。

+ 開發模式
    - 開發環境 ```do dev```
    - 開發伺服器 ```do dev server```
    - 元件開發伺服器 ```do dev component```
    - 服務開發伺服器 ```do dev service```
    - 偽資料伺服器 ```do dev dummy```
+ 發佈模式 ```do pub```

## React MVC 框架

基於 PrueMVC 架構概念配合 React 框架的 MVP 架構實作的 MVC 框架，設計目的是考量 React 框架本質僅專注於視圖 ( View ) 的設計與規範，倘若網頁的互動、結構、服務內容擴大到網頁應用程式，仍建議補充 MVC 框架作為輔助，將業務邏輯重新分門別類的管理。

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

+ 視圖模塊
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
