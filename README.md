# Parking API

## API 說明

> ### 備註
> 
> #### 認證
> 除非文件中指出該接口不需要驗證就能使用，不然所有街口預設都需要使用 HTTP 標頭的
> `token` 欄位。
> 
> 若需要測試，你可以使用這兩組 `token`：
> - 使用者：`secret_user_token75313`
> - 管理員：`secret_root_token31357`
> 
> #### 公共以及私人 API
> 公共 API 用於面對使用者的應用程式，私人 API 用於管理程式。本說明文件將會包含兩
> 種 API 的說明，接口說明中將會詳細說明是否為私人 API。
>

### 版本 1 `[/api/v1]`

#### 錯誤處理

若發生錯誤，我們將回傳 `4xx` 或者是 `5xx` 系列的回應狀態碼，並包含 JSON 說明，說明的格式如下：

    {
        "message": "錯誤說明",
        "raw": {}
    }

其中，若是有 `message` 欄位，則該欄位代表錯誤訊息；若是有 `raw` 欄位，則該欄位將會包含原始錯誤物件。

#### 獨立 OAuth 註冊 `[POST /oauth/register]`

> 公共 API。

##### 要求主體

	{
		"name": "使用者",
		"email": "user@example.com",
		"password": "passw0rd"
	}

#### 獨立 OAuth 登入 `[POST /oauth?client=parking]`

##### 要求主體

	{
		"email": "user@example.com",
		"password": "passw0rd"
	}

##### 回應主體

    {
        "accessToken": "jwt-token"
    }

#### 登入 `[/login]`

> 公共 API。

##### 使用帳號密碼 `[POST /standalone]`

###### 要求主體

	{
		"name": "使用者",
		"email": "user@example.com",
		"password": "passw0rd"
	}

> 回應請見登入回應

##### 使用 Facebook `[/social/facebook]`

###### 取得 Application ID 以及 Application Secret `[GET /secret]`

####### 回應主體

	{
		"appId": "1700100203606437",
		"secret": "c88c8f043d4b3f83389cdc630d4a6931"
	}

###### 使用 User ID 以及 Access Token 登入 `[POST /]`

####### 要求主體

	{
		"userId": "1700100203606437",
		"accessToken": "c88c8f043d4b3f83389cdc630d4a6931"
	}

##### 使用 Twitter `[/social/twitter]`

> *TODO* This will be added later.

##### 登入回應（JWT 代幣）

	{
		"token": ""
	}

#### 停車格 `[/spaces]`

##### 描述方格
本 API 將台灣劃分成多個方格，每個方格長寬皆為 0.01 度，也就是長寬 1 公里左右。
你的應用程式必須依照這個規則要求對應的方格內的停車格。

當在 API 中需要要求某一方格時（例如北緯 24.01 東經 120.02 至北緯 24.02 東經 120.03），
你必須稱之為：`24.01-24.02:120.02-120.03`。

我們支援一次取得多個方格，假設你需要取得北緯 24.01 東經 120.02 至北緯 24.05 東經 120.10
之間的 32 個方格，你只需要：`24.01-24.05:120.02-120.10`。

若是多個方格不連續，你可以用逗號分開多個區間：`24.01-24.05:120.02-120.10,24.20-24.21,120.02-120.04`。

> #### 註記
> 經緯度 1 度約為 111 公里

##### 取得停車格 `[GET /]`

###### 範例

`GET http://localhost:3000/api/v1/lots?grids=24.01-24.05:120.02-120.10,24.20-24.21,120.02-120.04&available=true`

> 公共 API

###### 選項

| 必要 | 名稱 | 型態 | 值域 | 預設值 | 說明 |
| --- | --- | --- | ---- | ----- | --- |
| 是 | `grids` | 字串 | 請見方格描述 | 無 | 要取得的方格，數量必須不多於 100 個。 |
| 否 | `available` | 布林 | `ture` 或是 `false` | `false` | 若設定為 `true`，則僅顯示空位。 |
| 否 | `serial` | 布林 | `ture` 或是 `false` | `false` | 若設定為 `true`，則每筆文件中，將會包含 `serial` 欄位。 |

###### 回應

    [
        {
            "_id": "589782a1aa338e21da33152f",
            "available": true,
            "latitude": 24.02,
            "longitude": 120.02
            "serial": "CH-CH-7B304C"
        }
    ]

##### 取得停車格 `[GET /{id}]`

###### 範例

`GET http://localhost:3000/api/v1/lots/589782a1aa338e21da33152f`

> 公共 API，某些選項為私人 API。

###### 回應

公共 API：

    {
        "_id": "589782a1aa338e21da33152f",
        "available": true,
        "latitude": 24.02,
        "longitude": 120.02,
        "name": "中山路二段 27A",
        "serial": "CH-CH-7B304C",
        "rate": [25, 1800],
        "managedBy": "彰化縣政府"
    }

私人 API：

    {
        "_id": "589782a1aa338e21da33152f",
        "available": true,
        "latitude": 24.02,
        "longitude": 120.02,
        "name": "中山路二段 27A",
        "serial": "CH-CH-7B304C",
        "rate": [25, 1800],
        "managedBy": "589805d2aa338e21da331530",
        "note": ""
    }

其中 `rate` 的表示每多少秒多少新台幣。


