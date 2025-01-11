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

# Design document

+ [開發環境整合設計](./doc/develop-integrate.md)
