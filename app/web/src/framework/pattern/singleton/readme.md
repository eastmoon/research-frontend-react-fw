# Singleton

+ [Singleton Pattern - wiki](https://en.wikipedia.org/wiki/Singleton_pattern)
    - [Singleton](https://refactoring.guru/design-patterns/singleton)
    - [單例模式 Singleton](https://skyyen999.gitbooks.io/-study-design-pattern-in-java/content/singleton.html)
    - [GoF 單例模式 Singleton](https://pjchender.dev/pattern/design-pattern-singleton/)

Singleton 樣式 ( 單例、唯一樣式 ) 的特徵，是在應用這個模式時，使用對象的類別必須保證只有一個實例存在。

![](./concept.png)
> from [Singleton](https://refactoring.guru/design-patterns/singleton)

## 類別使用方式

為保證其實體僅有一個，本 Singleton 實作提供兩個實體取回方式

+ 使用 new 操作元

```js
let obj : Singleton = new Singleton();
```

+ 使用 instance 靜態屬性存取器

```js
let inst : Singleton = Singleton.instance
```

## 類別繼承

Singleton 可以被繼承，而繼承的新類別具有獨立的實體。

```js
class ChildrenSingleton extends Singleton {}
```

若繼承類別有自身的屬性，可在自身的類別宣告與建構函數中設定相關數值。

```js
class ChildrenSingleton extends Singleton {
    val : number;
    constructor() {
        super();
        this.val = 123;
    }
}
```

## 設計議題

+ [Class constructor - typescript](https://www.typescriptlang.org/docs/handbook/2/classes.html#constructors)

依據 Typescript 文獻對於類別的建構函數 ( constructor ) 描述，其中有一項 **Constructors can’t have return type annotations - the class instance type is always what’s returned** 說明，此項說明是指建構函數不應該回傳任何內容。

然而，若 Singleton 的實作不透過建構回傳內容，則無法確保經由 new 操作員取得的實體為已經宣告完成的實體，而會回到原生的規則，每次 new 操作會產生新的實體。

對此，若不許建構回傳，則需將 constructor 設為 private，使得 new 操作員無法使用，來避免透過 new 產生不同實體。
