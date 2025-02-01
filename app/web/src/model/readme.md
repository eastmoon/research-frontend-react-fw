# Model

[Model View Controller](https://www.geeksforgeeks.org/mvc-design-pattern/) 中的模型 ( Model ) 是指 **『用於管理應用程式資料與處理業務邏輯，並回應來自視圖、控制器、模型的資訊請求。』**，這部分無論是在何種軟體系統，都會基於其系統的語言撰寫，若用在網頁應用程式，常見如對後端服務存取資料、前端服務快取、背景資料載入、用戶狀態發送等。

模型設計時機規範如下：

+ 模型負責純粹的數據處理與業務邏輯
+ 模型負責對其他第三方系統存取資料
+ 模型可為被動由控制器要求才更新數據，亦可主動發起檢查程序更新數據
+ 模型僅使用語言本身與相應的數值、數據流處理工具
+ 模型的數據應有預設值、上限值、型態，避免控制器、視圖不會因為存取異常數據導致無法預期的邏輯與呈現

在實務中模型可分為兩類型：

+ 服務 ( Service ) 負責對其它系統的操作邏輯
+ 代理 ( Proxy ) 基於服務存取結果的數據彙整、檢查、回饋

常見的實務錯誤是未設計代理者，僅而導致一下狀況：

+ 視圖或中介者直接使用服務，使得數據彙整等緩存管理存放於視圖或中介者，在共享給其他視圖時出現傳遞困境或視圖刪除導致資料遺失。
+ 數據處理撰寫在服務內，導致版本變更或處理程序岔分，需要複製相同程序而導致冗餘程式碼。

## 繼承 MVC 框架

模型 ( Model ) 依據設計需要繼承相應的類別，服務繼承 ```Service```、代理繼承 ```Proxy```，但建議服務針對不同協議的操作先封裝，進而避免操作函數的重複行為撰寫，例如 HTTP 協議用 ```APIService``` 封裝執行 ajax 指令的程序。

```js
import MVC from "@/framework/pattern/facade/mvc";
import { Proxy } from "@/framework/pattern/proxy";
class Counter extends Proxy {}
```

## 主動註冊

藉由 MVC 框架的唯一特性與重名不可註冊特性，確保僅會有一個實體的模型 存在，並永遠回傳相同的物件。

```js
if (!MVC.model.has("Counter")) MVC.register(new Counter());
export default MVC.model.retrieve("Counter");
```
