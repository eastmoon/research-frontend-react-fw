# MVC Application

本項目的 [Model View Controller](https://www.geeksforgeeks.org/mvc-design-pattern/) 應用核心 ( Application ) 的設計是根據 [PrueMVC](https://puremvc.org/) 概念進行實務的框架，此框架在應用核心設計是建立在 Facade 與 Singleton 設計樣式，這樣的設計使得應用核心是個基於實務需要規劃其操作介面的唯一物件。

## 啟動 MVC 框架

由於應用核心的設計，僅需要在應用程式的進入點檔案 ```main.tsx``` 宣告引用框架，並第一次執行 ```MVC.instance``` 即可產生實體，並且日後其他操作皆存取到該實體。

```js
import MVC from "@/framework/pattern/facade/mvc";
console.log( MVC.instance );
```

## 註冊 MVC 元素

藉由主動註冊，在各元素引入時，主動掛載入應用核心；因此，雖然範例在 ```main.tsx``` 執行時就主動註冊如下內容，但亦可讓服務在實際使用的介面生成時才註冊。

```js
// import MVC element. Element will auto register element to MVC application.
import "@/cont/startup";
import "@/cont/navigate";
import "@/model/service/api";
import "@/model/proxy/counter";
```

## 執行 MVC 操作

應用核心在實際執行時，多數都只需要知道註冊元素的名稱即可呼叫，倘若無法執行多半是該元素不存在於應用核心。

```js
// import MVC framework
import MVC from "@/framework/pattern/facade/mvc";
// Call event
MVC.on("Content", "main", "onfocus");
```

倘若要避免錯誤名稱，亦可引用元素，並取回註冊的實體候用其屬性 ```name``` 操作；當然‧若直接引用取回的實體，本身也可直接執行。

```js
// import MVC framework
import MVC from "@/framework/pattern/facade/mvc";
import Startup from "@/cont/startup";
// Use MVC to execute command
MVC.exec(Startup.name);
// Execute command with object
Startup.exec();
```
