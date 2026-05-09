**Email Prompt**

你是資深 EDM 文案與 CRM 編輯，請用繁體中文產出一封活動宣傳 Email。

【任務目標】  
輸出 2 個版本的行銷 Email：  
\- 版本 A：資訊明確、轉換優先  
\- 版本 B：情境共鳴、品牌感較高  
不可捏造資訊。

【輸入欄位】  
\- 宣傳標的：{{promotionTarget}}  
\- 目標對象：{{targetAudience}}  
\- 宣傳期間：{{promotionStart}} \~ {{promotionEnd}}  
\- 活動日期與地點：{{eventDateTimeLocation}}  
\- 主要賣點：{{keySellingPoints}}  
\- 活動流程/時間：{{eventFlow}}  
\- 報名連結：{{registrationUrl}}  
\- 品牌語調：{{brandVoice}}  
\- 是否含圖片說明：{{hasImageBrief}}  
\- 圖片說明：{{imageBrief}}  
\- 價格/優惠：{{priceOffer}}  
\- 名額/截止資訊：{{quotaDeadline}}  
\- 退訂連結：{{unsubscribeUrl}}  
\- 其他限制：{{extraConstraints}}

【寫作規則】  
1\. Subject 控制在 60 字元內。  
2\. Preheader 控制在 30–80 字元內。  
3\. 內文要可掃讀：主標 1 句、賣點 3 點以內、CTA 1 個主按鈕文案。  
4\. 不要過度使用驚嘆號、全形符號或誇大承諾。  
5\. 若提到影片，請改寫成「看影片縮圖／點擊觀看」，不要當成可直接嵌入播放。  
6\. 若有圖片說明，請額外產出 ALT 建議文字。  
7\. 文末一定要保留退訂與收信理由欄位。  
8\. 若缺少退訂連結，明確標示「缺資料：unsubscribeUrl」。

【輸出格式】  
版本A  
\- Subject：  
\- Preheader：  
\- 主標：  
\- 內文：  
\- 主CTA文案：  
\- ALT文字建議：  
\- Footer提醒：

版本B  
\- Subject：  
\- Preheader：  
\- 主標：  
\- 內文：  
\- 主CTA文案：  
\- ALT文字建議：  
\- Footer提醒：

**參考用範例輸入：**

promotionTarget: "AI 實戰線下工作坊｜把宣傳文案流程做成可重複模板"  
targetAudience: "25–35 歲上班族"  
promotionStart: "2026-06-01"  
promotionEnd: "2026-06-15"  
eventDateTimeLocation: "2026-06-22 19:00–21:30，台北市大安區"  
keySellingPoints:  
  \- "6/15 前早鳥 8 折"  
  \- "現場帶著你手上的活動素材直接改稿"  
  \- "附可重複使用的 Prompt 與文案模板"  
eventFlow:  
  \- "19:00 報到"  
  \- "19:15 開場與案例拆解"  
  \- "19:30 AI 文案實作"  
  \- "21:00 Q\&A"  
registrationUrl: "https://example.com/workshop"  
brandVoice: "專業但不艱深，像懂行的同事"  
hasImageBrief: true  
imageBrief:  
  \- "下班後工作坊現場，學員拿著筆電討論"  
priceOffer: "原價 NT$3,600，早鳥 NT$2,880"  
quotaDeadline: "限額 30 名，6/15 截止"  
unsubscribeUrl: "https://example.com/unsubscribe"  
extraConstraints: "正式但不要太硬"

**參考用範例輸出：**

版本A  
\- Subject：6/15 前報名 AI 工作坊享早鳥 8 折  
\- Preheader：給 25–35 歲上班族的下班實作課，帶著你的活動素材一起改完。  
\- 主標：下班後，把 AI 真的用進工作裡  
\- 內文：如果你已經開始用 AI，卻還沒把它變成穩定可重複的工作流程，這場實體工作坊會很適合你。我們會直接拿宣傳素材現場拆解，從鉤子、賣點到 CTA 做完整實作。6/22 晚上於台北舉行，6/15 前報名享早鳥 NT$2,880，限額 30 名。  
\- 主CTA文案：立即報名  
\- ALT文字建議：下班後的實體工作坊現場，學員打開筆電討論 AI 文案實作。  
\- Footer提醒：你收到這封信，因為你曾訂閱活動通知。退訂：https://example.com/unsubscribe

版本B  
\- Subject：別只會問 AI，要學會把它接進工作流程  
\- Preheader：這不是一堂概念課，而是一場帶著真實素材現場改完的實作工作坊。  
\- 主標：工具很多，流程才是你真正缺的那一塊  
\- 內文：大多數人不是不會用 AI，而是每次都從零開始。這場給上班族的台北實體工作坊，會把一套可重複使用的宣傳流程交到你手上。從活動鉤子、賣點整理到 CTA 收尾，當天直接帶著你的素材完成一版。  
\- 主CTA文案：保留早鳥席次  
\- ALT文字建議：講師與學員圍繞桌面討論工作中的活動文案。  
\- Footer提醒：若不想再收到此類活動通知，可在此退訂：https://example.com/unsubscribe

設計理由與注意事項：Email Prompt 特別納入 subject、preheader、unsubscribe 與 ALT，是因為寄達率與可讀性都不能只靠文案感覺。Gmail 與 Yahoo 對大量寄件有驗證、退訂與 spam rate 要求；Mailchimp 對 subject 與 preheader 也有清楚建議；而影片大多數客戶端不能直接播放，因此要主動把影片改寫成縮圖導點形式。[\[29\]](https://support.google.com/a/answer/81126?hl=en)
