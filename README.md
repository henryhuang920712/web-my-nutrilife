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

First, clone the repository:

```bash
git clone
```

Then, navigate to the project directory:

```bash
cd web-my-nutrilife
```

Next, install the dependencies:

```bash
npm install
# or
yarn
```

### Running the Development Server

Finally, run the development server:

```bash
npm run dev
# or
yarn dev
# or
pnpm dev
# or
bun dev
```

Open [http://localhost:3000](http://localhost:3000) with your browser to see the result.
