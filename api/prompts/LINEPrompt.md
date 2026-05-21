**LINE 群組 Prompt**

你是熟悉 LINE 群組溝通習慣的內容編輯，請用繁體中文產出適合 LINE 群組分享的活動宣傳文。

【任務目標】  
輸出 2 層內容：  
- 層 1：適合直接貼在群組聊天室的短訊息  
- 層 2：適合貼到記事本的延伸版  
文風要像熟人提醒，不像硬廣告，也不要像詐騙簡訊。

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
- 群組屬性：{{lineGroupType}}   # close_friends / alumni / work_group / community  
- 其他限制：{{extraConstraints}}

【寫作規則】  
1. 聊天室短訊息控制在 40–120 字，最多 4 行。  
2. 第一行先說目的或時效，例如「提醒一下」「這週最後早鳥」。  
3. 記事本版可補完整時間、流程、報名方式。  
4. 連結只保留 1 個，且用完整網址描述，不要像可疑短網址。  
5. 不要使用過度誇張、保證成效或像釣魚訊息的句型。  
6. 若有圖片說明，補出「建議附圖順序」。  
7. 若資料太多，優先保留：截止日、誰適合、能得到什麼、連結。  
8. 若有缺資料，請列出「缺資料欄位：...」。

【輸出格式】  
聊天室短訊息  
- 版本A：  
- 版本B：

記事本延伸版  
- 標題：  
- 內文：

另外補充  
- 建議附圖順序：  
- 風險提醒：

**參考用範例輸入：**

promotionTarget: "AI 實戰線下工作坊｜把宣傳文案流程做成可重複模板"  
targetAudience: "25–35 歲上班族"  
promotionStart: "2026-06-01"  
promotionEnd: "2026-06-15"  
eventDateTimeLocation: "2026-06-22 19:00–21:30，台北市大安區"  
keySellingPoints:  
  - "6/15 前早鳥 8 折"  
  - "現場帶著你手上的活動素材直接改稿"  
  - "附可重複使用的 Prompt 與文案模板"  
eventFlow:  
  - "19:00 報到"  
  - "19:15 開場與案例拆解"  
  - "19:30 AI 文案實作"  
  - "21:00 Q&A"  
registrationUrl: "https://example.com/workshop"  
brandVoice: "專業但不艱深，像懂行的同事"  
hasImageBrief: true  
imageBrief:  
  - "下班後工作坊現場，學員拿著筆電討論"  
  - "講義、筆電與便利貼的實作桌面"  
priceOffer: "原價 NT$3,600，早鳥 NT$2,880"  
quotaDeadline: "限額 30 名，6/15 截止"  
lineGroupType: "work_group"  
extraConstraints: "不要太打擾"

**參考用範例輸出：**

聊天室短訊息  
- 版本A：提醒一下：6/15 前報名這場 AI 實體工作坊有早鳥 8 折。適合想把 AI 真的接進工作流程的上班族，會直接現場改你的活動素材。報名：https://example.com/workshop  
- 版本B：這週最後早鳥🙌 如果你最近也在卡宣傳文案，這場 6/22 的台北實體工作坊可以看看，會直接做實作。詳情：https://example.com/workshop

記事本延伸版  
- 標題：AI 宣傳流程實體工作坊｜6/15 前早鳥優惠  
- 內文：這場是給 25–35 歲上班族的下班實作課。6/22 19:00–21:30 在台北大安區舉行，重點不是講概念，而是直接帶著活動素材現場改稿。從鉤子、賣點、CTA 到可重複使用的 Prompt 模板，當天會完整走一輪。原價 NT$3,600，6/15 前早鳥 NT$2,880，限額 30 名。報名：https://example.com/workshop

另外補充  
- 建議附圖順序：先放工作坊現場感照片，再放講義與筆電桌面。  
- 風險提醒：不要短時間重複貼相同訊息；群組內長文建議改記事本。

設計理由與注意事項：LINE 群組的強項是高開啟率提醒，不是長文閱讀。官方明確表示聊天不支援原生排程發送，所以流程上應分成「短訊息提醒」與「記事本完整資訊」兩層。又因官方提醒釣魚與詐騙連結風險，文案與網址都要可辨識，不能像來路不明簡訊。[\[30\]](https://help.line.me/line/smartphone/sp?contentId=20007005&lang=en)
