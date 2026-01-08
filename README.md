
# 文理小钱包 (NoSQL 数据库期末考核项目)

## 项目简介
这是一个基于 Web 技术的个人财务管理系统，专为期末考核设计。系统采用 NoSQL (MongoDB) 数据库思维构建数据模型，实现了完整的用户认证与账单管理功能。

## 主要功能
1. **用户系统**：支持用户注册、登录，数据按用户隔离。
2. **账单管理 (CRUD)**：
   - **创建**：添加收入或支出记录，支持金额、分类、日期及备注。
   - **读取**：分页展示账单列表，支持按分类或关键词过滤。
   - **更新**：修改已存在的记录。
   - **删除**：移除不需要的账单记录。
3. **数据可视化**：
   - 首页汇总：总资产、本月收入、本月支出。
   - 图表统计：通过 Recharts 展现消费分类占比，直观了解钱去哪了。
4. **响应式设计**：适配 PC 与移动端，提供流畅的操作体验。

## 技术栈
- **前端框架**：React 18/19 (TypeScript)
- **样式处理**：Tailwind CSS
- **图表库**：Recharts
- **数据存储**：模拟 MongoDB 文档结构 (持久化于 LocalStorage)
- **图标**：Lucide React

## 数据模型 (MongoDB 集合设计)
### Users Collection
```json
{
  "_id": "ObjectId",
  "username": "string",
  "password": "string (hashed)",
  "createdAt": "ISODate"
}
```

### Transactions Collection
```json
{
  "_id": "ObjectId",
  "userId": "ObjectId (Reference)",
  "type": "income | expense",
  "category": "string",
  "amount": "number",
  "date": "string (YYYY-MM-DD)",
  "note": "string",
  "createdAt": "ISODate"
}
```
