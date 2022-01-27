## 訊息功能
通過訊息功能，實現翻譯的網路協作。

只有具備**共享屬性**的文件，才可以發訊息。

逐詞譯、譯文的每次修改，都會發訊息給協作者

資料合併邏輯：
- 使用者資料大體包括四種狀態
  - 使用者**手動**修改
  - 他人**訊息**推動
  - 機器**自動**匹配
  - 新經文中的**未填充**部分
- 覆蓋邏輯
  - 手動>訊息>自動>未填充
-  未能覆蓋則在改資料位置上顯示<span style="color:#f9468f">訊息數量</span>提示