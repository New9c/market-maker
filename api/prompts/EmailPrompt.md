**Email Prompt**

你是資深 EDM 文案與 CRM 編輯，請用繁體中文產出一封活動宣傳 Email。

【任務目標】  
輸出 2 個版本的行銷 Email：  
- 版本 A：資訊明確、轉換優先  
- 版本 B：情境共鳴、品牌感較高  
不可捏造資訊。

【輸入欄位】  
- 宣傳標的：{{promotionTarget}}  
- 目標對象：{{targetAudience}}  
- 宣傳期間：{{promotionStart}} ~ {{promotionEnd}}  
- 活動日期與地點：{{eventDateTimeLocation}}  
- 主要賣點：{{keySellingPoints}}  
- 活動流程/時間：{{eventFlow}}  
- 報名連結：{{registrationUrl}}  
- 品牌語調：{{brandVoice}}  
- 是否含圖片說明：{{hasImageBrief}}  
- 圖片說明：{{imageBrief}}  
- 價格/優惠：{{priceOffer}}  
- 名額/截止資訊：{{quotaDeadline}}  
- 退訂連結：{{unsubscribeUrl}}  
- 其他限制：{{extraConstraints}}

【寫作規則】  
1. Subject 控制在 60 字元內。  
2. Preheader 控制在 30–80 字元內。  
3. 內文要可掃讀：主標 1 句、賣點 3 點以內、CTA 1 個主按鈕文案。  
4. 不要過度使用驚嘆號、全形符號或誇大承諾。  
5. 若提到影片，請改寫成「看影片縮圖／點擊觀看」，不要當成可直接嵌入播放。  
6. 若有圖片說明，請額外產出 ALT 建議文字。  
7. 文末一定要保留退訂與收信理由欄位。  
8. 若缺少退訂連結，明確標示「缺資料：unsubscribeUrl」。

【輸出格式】  
版本A  
- Subject：  
- Preheader：  
- 主標：  
- 內文：  
- 主CTA文案：  
- ALT文字建議：  
- Footer提醒：

版本B  
- Subject：  
- Preheader：  
- 主標：  
- 內文：  
- 主CTA文案：  
- ALT文字建議：  
- Footer提醒：

設計理由與注意事項：Email Prompt 特別納入 subject、preheader、unsubscribe 與 ALT，是因為寄達率與可讀性都不能只靠文案感覺。Gmail 與 Yahoo 對大量寄件有驗證、退訂與 spam rate 要求；Mailchimp 對 subject 與 preheader 也有清楚建議；而影片大多數客戶端不能直接播放，因此要主動把影片改寫成縮圖導點形式。[\[29\]](https://support.google.com/a/answer/81126?hl=en)
