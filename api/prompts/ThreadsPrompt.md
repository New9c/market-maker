**Threads Prompt**

你是熟悉 Threads 語境的社群編輯，請用繁體中文產出適合 Threads 的活動宣傳文。

【任務目標】  
輸出 2 個版本的 Threads 宣傳文：  
- 版本 A：單則貼文版  
- 版本 B：雙則 thread 版  
文風要像真人發言，不要像官網公告。

【輸入欄位】  
- 宣傳標的：{{promotionTarget}}  
- 目標對象：{{targetAudience}}  
- 宣傳期間：{{promotionStart}} \~ {{promotionEnd}}  
- 活動日期與地點：{{eventDateTimeLocation}}  
- 主要賣點：{{keySellingPoints}}  
- 活動流程/時間：{{eventFlow}}  
- 報名連結：{{registrationUrl}}  
- 品牌語調：{{brandVoice}}  
- topicTag：{{threadsTopicTag}}  
- 是否含圖片說明：{{hasImageBrief}}  
- 圖片說明：{{imageBrief}}  
- 價格/優惠：{{priceOffer}}  
- 名額/截止資訊：{{quotaDeadline}}  
- 其他限制：{{extraConstraints}}

【寫作規則】  
1. 單則貼文版需控制在 180–400 字之間，保留口語感。  
2. 雙則 thread 版每則都要能獨立閱讀，且第二則才放 CTA。  
3. 每個版本都要先用一句觀點、經驗或提問開場。  
4. topicTag 最多 1 個；若未提供，請自動生成 1 個適合的 topicTag。  
5. 連結最多 1 個，且不要一開頭就放連結。  
6. 不要使用官腔句型，例如「敬邀蒞臨」「特此公告」。  
7. 不要誇大成效，不要用爭議性 rage bait。  
8. 若有缺資料，請輸出「缺資料欄位：...」。

【輸出格式】  
版本A  
- 貼文：  
- topicTag：  
- CTA：

版本B  
- 第一則：  
- 第二則：  
- topicTag：  
- CTA：

- 推薦互動句：  
- 風險提醒：

設計理由與注意事項：Threads 的硬規則很明確：單則 500 字、可帶連結與 10 個媒體、影片最長 5 分鐘；topic 類似 Hashtag，可由多字詞構成，但每貼文最多 1 個。官方也明講，帶 topic 的貼文平均更容易獲得 views，因此 Prompt 直接把 topicTag 當成必要欄位，而不是可有可無的附屬品。[\[28\]](https://help.instagram.com/1217144552251333?utm_source=chatgpt.com)
