# MyNutriLife Interactive Platform

This project is inspired by the GitHub project [MyNutriLife](https://github.com/KrystalChang/DB_project_MyNutriLife).

## Project Introduction

"MyNutriLife" is a personalized health and nutrition management system designed to help users track daily dietary intake and provide customized nutritional advice based on the **Dietary Reference Intakes (DRI), 8th Edition** published by the Taiwanese Ministry of Health and Welfare.

The system is built on a real "Food Nutrition Dataset" from the government open data platform and allows users to log daily food consumption. It automatically calculates nutrient intake and compares it to recommended values, offering progress analysis. Additional features include article browsing and bookmarking, allowing users to explore knowledge related to health and nutrition.

The platform is designed with two main user types:

- **General Users (User):** The primary audience of the system, open to the general public, who can log and analyze their dietary intake and nutrient levels.
- **Operators (Operator):** Medical or nutrition-related professionals, such as doctors, pharmacists, and dietitians, who can author and publish nutrition and health-related articles for users to read and gain dietary insights.

## Goals of This Project

Building upon the foundation of "MyNutriLife," this project aims to create an **interactive platform using Next.js** with the following features:

- **Health Articles:** A repository of articles to educate users on health and wellness topics.
- **Personalized Diet Advice:** Tailored dietary recommendations based on user data and dietary reference guidelines.

## Getting Started

### Prerequisites

Before you start, make sure you have the following installed on your machine:

- [Node.js](https://nodejs.org/en/)
- [npm](https://www.npmjs.com/) or [yarn](https://yarnpkg.com/) or [pnpm](https://pnpm.io/) or [bun](https://bunpkg.com/)
- [Git](https://git-scm.com/)

### Installation

#### 1. Download the PostgreSQL backup file

Download the PostgreSQL backup file and restore it to your local PostgreSQL database.

#### 2. Clone the repository

```bash
git clone <repository-url>
```

#### 3. Navigate to the project directory

```bash
cd web-my-nutrilife
```

#### 4. Install dependencies

```bash
npm install
# or
yarn install
```

If Next.js is not installed, you can add it manually:

```
npm install next react react-dom
```

#### 5. Set up environment variables

Generate a secure password and store it in the .env file:

```bash
openssl rand -base64 32
```

Then, create a .env file in the root directory and add the following database configuration:

```
DB_NAME=
DB_USER=
DB_PASSWORD=
DB_HOST=
DB_PORT=

NEXTAUTH_SECRET= # YOUR SECURE PASSWORD
```

#### 6. Running the Development Server

```
npm run dev
# or
yarn dev
# or
pnpm dev
# or
bun dev
```

### Project Structure

```
app/
├── api/                   # 伺服器端 API
│   ├── auth/              # 使用者認證
│   │   ├── [...nextauth]/
│   │   │   ├── options.js  # 認證選項設定
│   │   │   ├── route.js    # 處理使用者登入/登出
│   ├── food/
│   │   ├── search/
│   │   │   ├── route.js    # 依關鍵字搜尋食物
│   ├── foodSearch/
│   │   ├── route.js        # 取得所有食物資料
│   ├── meal/
│   │   ├── add/
│   │   │   ├── route.js    # 新增飲食記錄
│   │   ├── delete/
│   │   │   ├── route.js    # 刪除飲食記錄
│   │   ├── list/
│   │   │   ├── route.js    # 取得飲食記錄
│   ├── nutrient/
│   │   ├── list/
│   │   │   ├── route.js    # 查詢使用者某段時間內的營養攝取
│   │   ├── route.js        # 查詢特定食物的營養成分
│   ├── nutrientAnalysis/
│   │   ├── route.js        # 取得使用者每日營養攝取數據
│   ├── user/
│   │   ├── route.js        # 使用者驗證
├── components/
│   ├── authProvider.js     # 使用者驗證 Provider，封裝應用程式內的使用者資料
│   ├── navbar.js           # 導覽列
│   ├── navbarSearch.js     # 導覽列內的搜尋欄
│   ├── searchFood.js       # 搜尋結果顯示
│   ├── searchInfo.js       # 搜尋結果的下拉選單
│   ├── dropdown/
│   │   ├── optionMenu.js   # 使用者個人資料的下拉選單
│   ├── modal/              # 模態視窗
│   │   ├── modal.js        # 基礎模態視窗元件
│   │   ├── loginModal.js   # 登入視窗
│   │   ├── registerModal.js# 註冊視窗
│   ├── calendar/
│   │   ├── datePicker.js   # 日期選擇器
│   ├── dashboard/          # 儀表板元件
│   │   ├── dailyIntakeProvider.js  # 提供單日飲食數據的 Context Provider
│   │   ├── charts/
│   │   │   ├── dailyProgress.js    # 每日攝取進度條
│   │   │   ├── caloriesBreakdown.js # 主要三大營養素圓形進度條
│   │   │   ├── nutrientAnalysis.js # 攝取歷史紀錄與建議攝取折線圖
│   │   │   ├── dailyComposition.js # 其他營養素攝取進度條
│   │   │   ├── recordView.js       # 飲食記錄表格
│   ├── record/
│   │   ├── mealTracker.js  # 餐點紀錄表格，含編輯與刪除功能
│   ├── sidebar.js
│   ├── ui/                 # UI 元件
├── app/
│   ├── clientLayout.js     # 用戶端 layout
│   ├── dashboard/
│   │   ├── page.js         # 儀表板頁面
│   ├── record/
│   │   ├── page.js         # 記錄飲食的頁面
│   ├── search/
│   │   ├── page.js         # 搜尋營養素的頁面
│   ├── layout.js           # 頁面的主要佈局
│   ├── page.js             # 首頁
│   ├── globals.css
```
