// ─────────────────────────────────────────────────────────────
// 将以下三行加入 src/payload.config.ts 的 collections 数组
// ─────────────────────────────────────────────────────────────
//
// import { Categories } from './collections/Categories'
// import { Products }   from './collections/Products'
// import { Documents }  from './collections/Documents'
//
// export default buildConfig({
//   collections: [
//     Users,
//     Media,
//     Categories,   // ← 新增
//     Products,     // ← 新增
//     Documents,    // ← 新增
//   ],
//   ...
// })
//
// 修改后运行：
//   pnpm payload migrate:create
//   pnpm generate:types
// ─────────────────────────────────────────────────────────────
