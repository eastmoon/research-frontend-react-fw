# Command

+ [Command Pattern - wiki](https://en.wikipedia.org/wiki/Command_pattern)
    - [Command](https://refactoring.guru/design-patterns/command)

Command 樣式 ( 命令樣式 ) 的特徵，是以物件來代表實際業務邏輯，並且將邏輯行動 ( action ) 或演算法 ( algorithm ) 封裝於命令物件中。

![](./command-concept.png)
> from [Command](https://refactoring.guru/design-patterns/command)

## 引用 Command 模組

Command 其模組包括一個 Interface 和兩個 Class。

```
import { ICommand, Simple, Macro } from "@/framework/pattern/command";
```

+ ```IContainer``` 為介面
+ ```Simple``` 為基於 ```ICommand``` 實作的簡單命令
    - 簡單命令用於給自訂命令繼承使用
+ ```Macro``` 為繼承 ```Container<ICommand>``` 並實作 ```ICommand``` 的巨集命令
    - 巨集命令可註冊實作 ```ICommand``` 的命令
    - 巨集執行會依據註冊的名稱，依序執行命令

## 命令的名稱

當命令生成為物件時，會依據提供給建構函數的字串為名稱，若沒有提供則用物件名稱為名。

```
let c1 : ICommand = new Simple();
console.log(c1.name); // print 'Simple'
let c2 : ICommand = new Simple("Demo")
console.log(c2.name); // print 'Demo'
```

## 命令的執行

當命令物件執行時，可以提供物件為參數或不提供，原則上函數對輸入型態定義為 ```any```，並回傳型態 ```any``` 的物件或不回傳；基於此設計，可達到如下執行方式：

##### 提供參數物件

```
let c : ICommand = new Simple();
let a : Args = { val : 1, str : "demo" };
let r : any = c.execute(a);
```

命令原則是傳入什麼回傳什麼，這樣的設計目的是透過連串的命令來改變傳入物件的數值，或基於數值改變執行方式；此外，上述範例中變數 ```a``` 與變數 ```r``` 指向相同物件。

##### 不提供參數物件

```
let c : ICommand = new Simple();
c.execute();
```

命令原則是傳入什麼回傳什麼，上述範例傳入與回傳皆為 undefined，這樣的設計目的表示要執行的行動獨立且互相無關，或行動會影響到其他數據來源。

## 巨集的執行

巨集命令需要先建立數個簡單命令並註冊，執行時會依序執行註冊的命令；巨集命令也會依據是否提供參數物件，改變註冊的簡單命令邏輯。

##### 提供參數物件

```
// 宣告自定簡單命令
class c1 extends Simple {
    execute($args: any) : any {
        $args.val = 123;
        return $args;
    }
}

class c2 extends Simple {
    execute($args: any) : any {
        $args.str = "c2";
        return $args;
    }
}

// 宣告巨集並註冊命令
let m : Macro = new Macro(null);
m.register("1", new c1());
m.register("2", new c2());

// 宣告參數物件並執行
let a : Args = { val : 1, str : "demo" };
m.execute(a);
console.log(a); // print { val : 123, str : "c2" }
```

就如前面所述，巨集執行時會依據註冊的命令修改傳入的參數物件；但需要注意，倘若巨集執行時不提供參數物件 ```m.execute()``` 則會因為註冊命令沒有防護參數物件為 undefined 的狀態導致異常；因此，若命令有修改參數物件的邏輯，應該如下增加防護措施避免巨集錯誤執行。

```
class c1 extends Simple {
    execute($args: any) : any {
        // 增加檢查程式確保傳入的 args 不為 undefined 或 null
        if ($args !== undefined && $args !== null) {
            $args.val = 123;
        }
        return $args;
    }
}
```

##### 不提供參數物件

```
// 宣告自定簡單命令
class c1 extends Simple {
    execute() {
        console.log(1234);
    }
}

class c2 extends Simple {
    execute() {
        console.log(5678);
    }
}

// 宣告巨集並註冊命令
let m : Macro = new Macro();
m.register("1", new c1());
m.register("2", new c2());

// 巨集執行
m.execute();
```

就如前面所述，這樣的設計目的表示要執行的行動獨立且互相無關，但若執行仍有順序議題，則應調整註冊的編號，來改變執行的順序。

```
m.register("2", new c1());
m.register("1", new c2());
```

如上修改，則執行順序會從原來的 c1、c2 改變為 c2、c1，需要注意，由於此部分是利用字串排序，因此字母與數字造成的順序影響應納入考量。