# U-Chat
### 簡介

U-Chat是我WebApp實作課程的FinalProject，一套基於Node.js開發而成的聊天室軟體， Server端使用Express框架建立，
利用Socket.io進行Real time雙向傳輸連線。 後端沒有寫很多，主要透過socket.emit 和 socket.on， 來讓前後端傳輸與接收資料，
並記錄使用者ID，而Client端主要以JQuery寫成，方便取用DOM。

由於是WebApp，所以是跨平台的軟體，電腦、手機、平板連線即可使用。


### 網頁版連線網址:
- [U-chat](http://u-chat-weiyuan.herokuapp.com/)

### Feature:

* 多人群聊
* 私人聊天
* 上傳圖片功能
* 在線人數
* 大頭貼
* 登入介面
* 更換背景圖片
* 純手工CSS設計(花很多時間的部分，很喜歡自己搞UI設計，但弄得好累阿，是該學習Bootstrap了)
* 通知功能(限Firefox OS & Firefox Browser)
* 斷線後自動重連
* RWD響應式網站
* 
### 未來預計新增的功能:

* 音效
* 小畫家
* 貼圖功能
* 影片、音樂上傳
* 連接資料庫，儲存訊息與帳戶資料
* 好友功能

### 後端Server

需求node.js環境,進入Chatroom資料夾,輸入"node app.js"，即可啟動server。
瀏覽器開啟輸入"localhost:4000",即可連入聊天室。 手機版連線網址更改: main.js檔裡io.connect改成自己的IP即可

目前網站架設在Heroku，未來想學習react.js，重新架構一遍前端介面。
