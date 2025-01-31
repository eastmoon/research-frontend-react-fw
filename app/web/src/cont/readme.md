# Controller

[Model View Controller](https://www.geeksforgeeks.org/mvc-design-pattern/) 中的控制器 ( Controller ) 是指 **『中介視圖 ( View ) 與模型 ( Model ) 的功能邏輯處理，並於執行後更新視圖或模型。』**，對於這些邏輯在不同的軟體系統中各有不同，例如 [Pattern-Oriented Software Architecture](https://en.wikipedia.org/wiki/Pattern-Oriented_Software_Architecture) 中對 MVC 的解釋與範例中，控制器指處理滑鼠、鍵盤訊息處理。

控制器需處理的功能因軟體系統不同，主要是因為不同系統、語言、框架提供的基礎功能不同，例如網站的鍵盤滑鼠屬於瀏覽器傳遞給 Document、Element 的事件，若執意分離反而讓視圖 ( View ) 與 控制器 ( Controller ) 職責混淆；這也可以理解由於控制器規模與相應處理被系統處理，反而讓控制器需要設計的功能減少，進而從 MVC 演化成 [MVP](https://www.geeksforgeeks.org/mvp-model-view-presenter-architecture-pattern-in-android-with-example/)、[MVVM](https://www.geeksforgeeks.org/introduction-to-model-view-view-model-mvvm/) 的架構概念，將中介控制部分規範於 Presenter、ViweModel，在 React 社群中更有狀態服務 [redux](https://redux.js.org/)、[zustand](https://zustand-demo.pmnd.rs/) 來替代 Presenter 的存在。

不過，即便著重輕量的單頁應用程式 ( Single Page Application ) 網站中，當軟體規模擴大，仍會存在跨整個應用程式執行的控制命令，諸如啟動程序、登入程序、轉場處理、導覽處理等；這些控制流無法規範在視圖 ( View )、模型 ( Model )，也不屬於與視圖依賴的呈現者 ( Presenter )，因此，根據 MVC 的控制器定義將其規劃於此。

控制器設計時機規範如下：

+ 業務邏輯為流程，且部分邏輯有復用可能
+ 業務邏輯觸發執行範圍無法規範，例如可能是存在於頁面的元件、後端取回的訊息自動觸發等
+ 業務邏輯會對多個或不定數量視圖、模型進行內容更新

基於網頁應用程式設計以輕量內容優先，倘若應用程式本身的業務邏輯不符上述使用條件，應採用其語言與框架提供的設計方式以避免系統複雜化。

## 繼承 MVC 框架

控制器 ( Controller ) 可繼承命令樣式的命令 ( Command )、巨集 ( Macro )、非同步巨集 ( AsyncMacro ) 或進程架構的進程 ( Progress )、管線 ( Pipe )、過濾器 ( Filter )；若執行過程皆無非同步處理則可使用巨集 ( Macro )，反之則應使用進程 ( Progress )、管線 ( Pipe )。

```js
import MVC from "@/framework/pattern/facade/mvc";
import { Progress } from "@/framework/pattern/facade/progress";
class Startup extends Progress {}
```

## 主動註冊

藉由 MVC 框架的唯一特性與重名不可註冊特性，確保僅會有一個實體的控制器存在，並永遠回傳相同的物件。

```js
if (!MVC.controller.has("Startup")) MVC.register(new Startup());
export default MVC.controller.retrieve("Startup");
```

需要注意，倘若設計的控制器可被複數執行，則避免使用主動註冊，於需要時生成物件後執行。
