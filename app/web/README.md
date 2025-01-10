# React + TypeScript + Vite

此樣板提供 React 基礎設定，並確保 Vite 與 HMR 可運作。

+ 啟動開發伺服器 ```npm run dev```
+ 編譯與發佈內容 ```npm run build```
+ 執行語法檢查 ```npm run lint```

# Storybook

此樣板提供 Storybook 基礎設定，主要用於獨立開發視圖模塊、元件，與相關的測試邏輯。

+ 啟動 Storybook ```npm run storybook```

Storybook 主要監測 ```src/view``` 目錄下的內容，採用目錄區分模塊與元件，倘若有 Storybook 規範與使用文檔，請放置於 ```.storybook/stories``` 目錄下。

# Moach

此樣板提供 Mocha 基礎設定，主要用於獨立開發模組、數據演算行為，與相關的測試邏輯。

+ 啟動 Storybook ```npm run mocha```

Mocha 主要監測  ```test``` 與 ```src/model``` 目錄下的內容，相關設定請放置於 ```.mocha``` 目錄下。

# 路徑解析 ( Path resolve ) 整合議題

本專案為 React 框架，並採用 Typescript + Vite 進行語法強化、型態檢查、開發與編譯，然而考量獨立驗證與測試，對於 View、Model 增加兩個套件 Storybook、Mocha 提供開發，然而對此會碰到載入目標物件的路徑問題。

```js
import { Checkbox } from '../component/Checkbox.tsx'
```

典型上，物件載入會採用相對路徑方式指向目標，然而，當元件、模塊的分類越多會讓相對路徑 ```../``` 符號大增，從而導致若元件移動或引用的程式移動後，相對位置將全面重新設定；針對此項問題，建議使用路徑別名的方式，從而將相對路徑替換成絕對路徑。

```js
import { Checkbox } from '@/view/component/Checkbox.tsx'
```

然而，使用路徑別名，這調整設定，必需讓相關開發工具皆適用，會出現如下調整議題。

## Vite

+ [resolve.alias - vite.dev](https://vite.dev/config/shared-options#resolve-alias)
+ [[vite] Vite Alias](https://weiyun0912.github.io/Wei-Docusaurus/docs/Vite/Vite-Alias/)

對於 React + Vite 如何使用路徑別名，可參考文獻說明，在 ```vite.config.ts``` 設定

```js
export default defineConfig({
  resolve: {
    alias: {
      "@": "./src"
    },
  },
})
```

然而，實際使用會因為路徑替換後缺乏完整路徑而無法正確找到檔案，對此修正為範本的 [vite.config.ts](./vite.config.ts)，增加 resolve 來取得完整路徑。

## TypeScript Compiler

+ [Typescript.org Document](https://www.typescriptlang.org/docs/)
    - [baseUrl - typescript.org](https://www.typescriptlang.org/tsconfig/#baseUrl)
    - [paths - typescript.org](https://www.typescriptlang.org/tsconfig/#paths)
    - [tsc CLI Options](https://www.typescriptlang.org/docs/handbook/compiler-options.html#compiler-options)
+ [Path aliases in tsconfig don't work with vue-tsc](https://github.com/vuejs/language-tools/issues/1323#issuecomment-2037218912)
+ [Should Vite do type-checking on builds by defaults? (Why tsc -b && vite build instead of just vite build)](https://github.com/vitejs/vite/discussions/18543)
+ [在 Vite + TypeScript 專案中設定路徑別名(path alias)](https://notes.boshkuo.com/docs/Vite/vite-problem2)

在 React + Typescript + Vite 範本中的  ```npm run build```，其指令共包括兩個動作 ```tsc -b && vite build```，這兩個動作分別是：

+ ```tsc -b``` Typescript compiler 執行型別檢查
+ ```vite build``` Vite 進行編譯與發佈

而倘若路徑別名僅在 Vite 設定，可以確保開發伺服器的 ```Vite``` 與編譯的 ```Vite build``` 可以正確解析內容並完成動作，可對於型態檢查的 ```tsc -b``` 則會出現無法找到目標的 ```TS2307``` 異常。

而這樣的錯誤，讓人困惑之處在 ```Vite``` 執行時是否有運行 Typescript 檢測，倘若實際編寫如下範例：

```js
let val : number = 1
val = "string"
return (
  <h1>{val}</h1>
)
```

結果是 ```Vite``` 並未因變數指定的型別與變更內容有差異而錯誤，但在 ```tsc -b``` 會出現 ```TS2322``` 異常；也有此得知 Vite 執行時在 ```vite.config.ts``` 的路徑別名並不會提供給 Typescript 運作，而若要 ```tsc -b``` 正常，則需在 ```typescript``` 的 ```compilerOptions``` 指定 ```baseUrl``` 與 ```paths```，且考量其他服務皆有使用的必要，對此將設定放在 ```tsconfig.json```。

```json
{
  "compilerOptions": {
    "baseUrl": ".",
    "paths": {
      "@/*" : ["src/*"]
    }
  }
}
```

然而，即使如此仍然無法正常解析，對此問題在文獻中看到如此描述 ***It's illustrated in this StackOverflow answer that tsc (and maybe vue-tsc) doesn't respect tsconfig.json when an input file is specified from arguments, and in this case, all compiler options must be specified with arguments.***；參考此描述，判斷當前 ```tsc -b``` 執行時，雖然基於 ```tsconfig.ts``` 得知對 ```src``` 目錄要採用 ```tsconfig.app.json``` 配置，但卻因此未引用在 ```tsconfig.ts``` 的 ```compilerOptions```。

針對上述錯誤，參考文獻建議在 ```tsconfig.app.json``` 增加如下配置，確保基於 [extends](https://www.typescriptlang.org/tsconfig/#extends) 規範繼承 ```tsconfig.ts``` 的別名設定。

```json
{
  "extends": "./tsconfig.json",
}
```

## Storybook

+ [Vite configuration - Storybook.org](https://storybook.js.org/docs/builders/vite#configuration)
+ [Framework.options.builder - Storybook.org](https://storybook.js.org/docs/api/main-config/main-config-framework#optionsbuilder)

Storybook 本身可視為一個獨立的開發伺服器服務，原則上其服務會基於在跟目錄的 Vite 設定進行運作，若有在 ```vite.config.ts``` 設置路徑別名，則會經由此項設定確保在 Storybook 的模塊與元件間能正確引用；但需要注意，由於 Storybook 與 Vite 相同不會額外進行 Typescipt 的型別檢查，因此前述的 ```TS2322``` 並不會被檢測出來。

但倘若要額外設定 Vite 配置檔，可參考如下設定：

```js
const config: StorybookConfig = {
  framework: {
    name: "@storybook/react-vite",
    options: {
      builder: {
          viteConfigPath: '../custom/vite.config.ts',
      },
    },
  },
};
```

需要注意，由於 Storybook 的 ```*.stories.ts``` 在 ```tsc -b``` 會被檢測大量函示庫異常，對此應該加入忽略目標。

## Mocha

+ [TypeScript Execute (tsx)](https://tsx.is/)

Mocha 本身是一套 Node.js 的單元測試服務，在新版導入 Typescript 後，但如何指定使用的 ```tsconfig.ts``` 則成為注意事項，由於早期文獻建議使用 ```ts-node```，在使用上若要指定則要使用 ```TS_NODE_PROJECT``` 環境變數，然而對新版的 Mocha 設定仍有出入。

為了正確引用到路徑別名，參考文獻建議改用 tsx 工具，若有在 ```vite.config.ts``` 設置路徑別名，則會經由此項設定確保在 Mocaha 的測試檔案皆能提取模組物件。
