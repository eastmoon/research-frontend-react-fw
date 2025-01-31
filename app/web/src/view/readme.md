# View

[Model View Controller](https://www.geeksforgeeks.org/mvc-design-pattern/) 中的視圖 ( View ) 是指 **『視圖 ( View ) 是用來呈現自模型 ( Model ) 取得的資料，並依據使用者操作結果交由制器更新模型與自身。』**，原則上視圖不與模型溝通，但會自控制器、模型取得更新資料的訊號。

視圖無論在 [MVC](https://www.geeksforgeeks.org/mvc-design-pattern/)、[MVP](https://www.geeksforgeeks.org/mvp-model-view-presenter-architecture-pattern-in-android-with-example/)、[MVVM](https://www.geeksforgeeks.org/introduction-to-model-view-view-model-mvvm/) 的架構概念中，本身都不應具有實際資料，僅有互動邏輯；因此，在 MVP、MVVM 演化成將互動邏輯與參數、最終呈現資料儲存於 Presenter、ViweModel，在 React 社群中更有狀態服務 [redux](https://redux.js.org/)、[zustand](https://zustand-demo.pmnd.rs/) 來替代 Presenter 的存在。

然而，在 PureMVC 框架時做中，Presenter 由 Mediator 替代，但設計規範在本質上並無不同；然而，考量 MVP、MVVM 在單頁應用程式用於視圖的設計運用，還是將其作出區別。

視圖設計中介者 ( Mediator ) 時機規範如下：

+ 中介者會管理複數個視圖
+ 中介者會透過指定對特定模塊、元件的事件執行
+ 中介者會透過通告廣播給事件給所有偵聽的模塊、元件
+ 中介者被觸發執行範圍無法規範，例如可能是存在於頁面的元件、後端取回的訊息自動觸發等

原則上 Presenter 與 Mediator 差別在於負責模塊與元件的數量；若視圖的事件僅屬於自身的邏輯處理、資料整理，應該使用 Presenter；若視圖的事件來自於系統其它視圖、控制器、模型，應該使用 Mediator。

## 繼承 MVC 框架

```js
import MVC from "@/framework/pattern/facade/mvc";
import { Mediator } from "@/framework/pattern/mediator";
if (!MVC.view.has("Content")) MVC.register(new Mediator("Content"));
```
Mediator 本身具有對視圖廣播通知與指定視圖操作兩個功能，除非有撰寫行為進行操作的需要，否則並無需建立類別，直接生成物件後註冊即可。

## 主動註冊

藉由 MVC 框架的唯一特性與重名不可註冊特性，確保僅會有一個實體的中介者存在，並永遠回傳相同的物件。

```js
let instance : Mediator = MVC.view.retrieve("Content");
export default instance;
```

## 融合狀態服務

如前述設計原則，Mediator 設計適用於跨度整個系統的操作，倘若考量視圖元件的獨立性，實務上適合的視圖設計與事件為：

+ 視圖設計
    - 頁面 ( Page )
    - 圖層 ( Layer )
+ 視圖事件
    - 聚焦 ( onfocus )
    - 失焦 ( unfocus )
    - 顯示 ( display )
    - 消失 ( disapper )
    - 更新 ( update )

倘若要配合 React 的狀態更新機制，則需先建立 use 物件，如下的 zustand 設定。

```js
import { create } from 'zustand';
export const useStore = create((set) => ({
  count: 1,
  inc: () => set((state) => ({ count: state.count + 1 })),
  dec: () => set((state) => ({ count: state.count - 1 })),
}));
```

在元件則引入 store 後，分別取回 Mediator 與 useStore 函數，並如下註冊後執行。

```js
// import store
import ContentMediator, { useStore } from './store';
// Generate use function
const { count, inc } = useStore()
// Attach function into mediator
ContentMediator.attachEvent("main", "onfocus", inc);
// Call event
ContentMediator.on("main", "onfocus");
```
倘若經由 MVC 框架對註冊的元件發送事件，則會如下執行。

```js
// import MVC framework
import MVC from "@/framework/pattern/facade/mvc";
// Call event
MVC.on("Content", "main", "onfocus");
```
