# Dummy data server

Dummy data server是一套運用虛擬數據(Dummy data)的API服務伺服器；其回傳內容不包含任何有用的資料，但仍符合服務回傳結果實際數據格式。

## Reference library
> [Dummy data wiki](https://en.wikipedia.org/wiki/Dummy_data)

> [JSON-server](https://github.com/typicode/json-server)

> [lowdb](https://github.com/typicode/lowdb)

> [Nginx HTTP proxy pass](https://sharefunyeh.gitbooks.io/webdev/content/articles/understand-nginx-proxy-load-balancing-buffer-and-cache.html)

## Install
```
npm install
```

## Start
```
npm start
```

## Dummy data setting

本伺服器啟動時，會主動分析存放於資料庫檔案夾 ( /db ) 內的json檔案，並產生相對應的路由、訊息擷取行為設定；若存在自訂服務並編寫於介面資料庫 ( /api ) 下，則會取代原始路由的訊息擷取行為，改運行自定服務。

### 路由

本系統中，API的靜態路由，是由資料庫檔案夾 ( /db ) 內的檔案夾名稱定義，而回傳的靜態資料則是存在於檔案夾下的json檔內。

若資料庫檔案夾結構如下述：

```
db
└ demo1
  └ sub
└ demo2
```

則路由路徑會如下：

```
/demo1/
/demo1/sub/
/demo2/
```

注意：

1、單一檔案夾下的所有json檔案都會合併於該類別內。

2、將json檔內容區分為多個檔案，其結果與單一檔案相同。

### 服務

本系統中，API對應的預設服務為列出參數、回應對應路由的靜態資料；倘若需自定回應服務與處理方式，則可編寫自訂服務。

自訂服務是編寫於介面資料庫 ( /api ) 下的js檔案，檔案路徑等於路由的類別，檔案名稱等於路由的介面。

```
api
└ demo1
  └ buy.js
  └ sell.js
```

如上範例，經由資料庫檔案夾會先整理出路由路徑，而其中下述兩個API會由自定服務取代。

```
/demo1/buy
/demo1/sell
```

設定完服務取代對向後，在進入js檔編寫自定的服務內容。

```
// custom_service.js
exports.bind = (name, server, db) => {
	// Service content
}
```

如上範例，當檢測到自訂服務後，會傳入三項參數：
* name，此服務對應的路由名稱
* server，JSON Server物件
* db，儲存於JSON Server的靜態資料庫

## API 格式

### API 名稱

| API     | 說明 |
| :---    | :--- |
| url     | /api_url |
| method  | [GET / POST / PUT / DELETE / ...] |

傳遞數據(Params)：

| 參數    | 說明 |
| :---    | :--- |
| XXX | 傳遞參數XXX，定義、用途、值域範圍、預設值 |

```
/api_url?XXX=xxx
```
> 補充說明

返回數據(Result)：

| 參數    | 說明 |
| :---    | :--- |
| XXX | 返回數據XXX，定義、用途、值域範圍、預設值 |

```
{
  type:'200',
  result:{
    XXX: 'xxx'
  }
}
```
> 補充說明
