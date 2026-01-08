# 【期末大作业】基于 React + NoSQL 思想实现的“文理小钱包”记账应用

## 一、项目背景
在《NoSQL 数据库》课程的期末考核中，我设计并实现了一个名为**“文理小钱包”**的 Web 记账应用。该项目不仅是一个前端单页应用（SPA），更核心的价值在于它模拟了 **MongoDB** 的文档型存储结构，将 NoSQL 的非关系型数据建模思想应用于实际的业务场景中。

---

## 二、技术栈选型
为了保证系统的响应速度、可维护性与视觉效果，本项目采用了以下方案：
- **核心框架**：React 18/19 (TypeScript) —— 提供强类型支持与组件化开发，确保逻辑严密。
- **样式处理**：Tailwind CSS —— 极速构建高度自定义的响应式 UI，实现精致的毛玻璃效果。
- **数据可视化**：Recharts —— 简单高效的 React 图表库，用于消费分类占比及趋势分析。
- **图标系统**：Lucide React —— 轻量且富有现代感的矢量图标。
- **数据存储**：模拟 MongoDB 文档结构（持久化于浏览器 LocalStorage），预留了后端 API 接口对接空间。

---

## 三、数据库建模 (NoSQL 思路)
在本项目中，我放弃了传统 RDBMS 的多表关联思路，采用了 MongoDB 的**集合 (Collections)** 与**文档 (Documents)** 概念。

### 1. 用户集合 (Users Collection)
```json
{
  "_id": "ObjectId",
  "username": "string",
  "password": "string (hashed)",
  "createdAt": "ISODate"
}
```

### 2. 账单集合 (Transactions Collection)
通过 `userId` 进行逻辑关联，模拟了 NoSQL 中的引用 (References) 模式，每个账单都是一个独立的文档。
```json
{
  "_id": "ObjectId",
  "userId": "ObjectId (关联用户ID)",
  "type": "income | expense",
  "category": "string (分类)",
  "amount": "number (金额)",
  "date": "string (YYYY-MM-DD)",
  "note": "string (备注)",
  "createdAt": "ISODate"
}
```

---

## 四、核心功能模块实现

### 1. 模拟数据库服务层 (db.ts)
我封装了一个服务模块，模拟了 MongoDB 的基础操作。例如，更新账单的过程就像是执行 `updateOne`：

```typescript
export const updateTransaction = (id: string, data: Partial<Transaction>): Transaction | null => {
  const transactions = getStorage<Transaction>(TRANSACTIONS_KEY);
  const index = transactions.findIndex(t => t.id === id);
  if (index === -1) return null;
  
  const updated = { ...transactions[index], ...data };
  transactions[index] = updated;
  setStorage(TRANSACTIONS_KEY, transactions);
  return updated;
};
```

### 2. 智能化仪表盘
首页通过 React 的 `useMemo` 钩子对原始文档数据进行实时聚合计算。利用 Recharts 渲染：
- **饼图**：展示支出分类占比，直观反映资金流向。
- **柱状图**：展示近七日的收支趋势，方便用户进行财务对比。

### 3. 响应式账单管理
系统实现了完整的 CRUD 逻辑：
- **搜索过滤**：支持通过备注关键字或分类进行模糊查询。
- **类型切换**：在添加账单时，系统会根据“收入”或“支出”自动切换对应的分类集。

---

## 五、界面设计亮点
1. **沉浸式交互**：登录页采用了渐变背景与毛玻璃（Backdrop Blur）效果，营造高端视觉感。
2. **移动优先**：针对移动端优化了侧边栏导航，采用响应式布局，无论在 PC 还是手机上都有流畅体验。
3. **即时反馈**：添加或删除账单后，仪表盘图表会立即通过状态更新（State Update）重绘，无需刷新页面。

---

## 六、项目总结
通过本次“文理小钱包”的开发，我深入实践了以下技术要点：
1. **Schema-less 的灵活性**：理解了在 NoSQL 中如何根据业务需求灵活定义文档结构。
2. **React 状态驱动 UI**：深刻体会到“UI 是状态的函数”这一核心原理。
3. **TypeScript 的工程化价值**：在处理复杂的账单数据过滤与聚合时，强类型检查减少了 80% 以上的低级逻辑错误。

---

> **结语**：本项目是 NoSQL 数据库思维与现代前端技术结合的一次有益尝试。如果你对代码实现或数据库建模有任何疑问，欢迎在评论区留言交流！

**标签**：`React` `MongoDB` `TypeScript` `数据可视化` `期末大作业`
