# Seal 平台应用开发指导原则

<!-- TOC updateOnSave=false -->
- [Seal 应用](#seal-应用)
    - [架构模式](#架构模式)
    - [应用模板](#应用模板)
        - [功能介绍](#功能介绍)
        - [目录结构](#目录结构)
    - [Manifest](#manifest)
        - [应用图标](#应用图标)
    - [代码格式/规范](#代码格式规范)
- [模块](#模块)
    - [数据服务](#数据服务)
    - [Intents](#intents)
    - [权限控制](#权限控制)
    - [通知系统](#通知系统)
    - [后台服务](#后台服务)
- [React](#react)
<!-- /TOC -->

## Seal 应用

### 架构模式

- Seal 应用是基于 Seal 平台提供的服务打造的 Webapp
- 无需安装, 可直接通过浏览器使用
- 通过 seal-client-sdk 访问平台服务
- 应用之间可以通过 Intent 交互; 应用可以利用其他应用的 Intent 处理数据或访问 Seal 平台的服务, 也可以通过 Intent 将另外一个应用嵌入到当前应用中
- Seal 平台提供应用商店服务, 用户通过应用商店可以安装/升级/卸载应用(*暂未实现*)

### 应用模板

平台所有应用都应当使用 [应用模板(app-template)](https://git.keyayun.com/keyayun/app-template) 开发, 具体可参考以下步骤
```
mkdir newapp
cd newapp
git init
git pull https://git.keyayun.com/keyayun/app-template master
```

#### 功能介绍

应用模板主要提供以下方面的支持

* 应用全生命周期管理的脚本与配置, 包含开发/测试/打包发布等
* 客户端 SDK, 包含通用组件/功能函数, 服务端通信等, 详见 Client SDK
* 目标平台的接入支持
* 多语言支持

#### 目录结构

```
├── config                   // webpack/jest 配置
├── scripts                  // start/build/test 脚本
├── src
│   ├── app                  // app 所有代码/资源所属目录
│   │   ├── App.jsx          // 主应用的入口
│   │   ├── Intent.jsx       // 组件的入口
│   │   ├── icons            // 图标
│   │   ├── locales          // 多语言相关资源
│   │   └── manifest.webapp  // 应用的 manifest, 详见 Manifest
│   ├── locales              // 多语言的支持代码
│   ├── react-app-env.d.ts
│   ├── seal-client          // 客户端 SDK
│   └── targets              // 输出目标. App 和组件
│       ├── browser
│       └── intents
├── package.json
├── tsconfig.json            // Typescript 配置
├── .prettierrc              // Prettier 配置
```

### Manifest

**Manifest** 描述应用的元信息(**Metadata**), 包含应用的基本属性/功能/权限等, JSON 格式, 具体如下:

- 主要项(必填)

	1. **name**: 应用名字, 与 locale 配合可多语言化.
	2. **slug**: 应用标识, [a-z]. 用户通过 slug 访问应用, 例如应用的 slug 是 drive, 则可通过 drive.inst.company.com 访问. slug *全局唯一*.
	3. **version**: 版本号. 依据 [Semantic](https://semver.org/) 规则
	4. **icons**: 边长为2的次幂的正方形,支持多种尺寸. **128x128** 必选, 512x512 和 32x32 推荐, 分别用于应用商店中的展示, 以及页面的 favicon.
	5. **description**: 应用描述, 不超过 30 字, 支持多语言
	6. **locales**: name/description 等应用安装前需要多语言支持的字段的翻译
	7. **langs**: 应用支持的语言, ISO 639 标准
	8. **routes**: 指定资源的路径(name: /path/to/assets)和可访问性(access: private/public), 其中 **index** 是一种特殊资源, 默认指向 index.html, 当应用请求 index 时, server 会尝试将 token 等信息插入并返回.
	9. **permissions**: 详见 [权限控制](#权限控制)
	10. **notifications**: 详见 [通知系统](#通知系统)
	11. **services**: 详见 [后台服务](#后台服务)
	12. **doctypes**: 自定义文档服务. 详见 [数据服务](#数据服务)
	13. **intents**: 小组件. 详见 [Intents](#Intents)

- 次要项(可不填)

	1. name_prefix: 不为空时, 应用的全称会展示为 {prefix} - {name}, 如 **Seal - 文件管理**
	2. category: 分类
	3. long_description: 应用长描述, 推荐 200 字以内
	4. platforms: 应用在各平台的链接, iOS/Android/Mac/Windows, etc.
	5. screenshots: 应用在应用商店中的展示图
	6. developer: 开发者
	7. license: 许可

> 主要参考
>
> [FirefoxOS App 标准](https://developer.mozilla.org/en-US/docs/Archive/B2G_OS/Firefox_OS_apps/Building_apps_for_Firefox_OS/Manifest)
>
> [Web App Manifest 标准](https://www.w3.org/TR/appmanifest/)

#### 应用图标

由 svg 生成 png 图标可使用
- https://ezgif.com/svg-to-png, 可将 svg 转化为背景透明的 png
- https://iconifier.net/, 可生成 iOS 全系列 apple-touch-icon, 但**不支持SVG**
- https://www.favicon-generator.org/, 可生成 iOS/Android/Windows 全系列 icon, 但**不支持SVG**

### 代码格式/规范

#### 目录结构

#### 代码规范

## 模块

### 数据服务

形如
```json
{
  // 文档类型
  "keyayun.service.test": {
    // unique 属性只能有一个
    "unique": "name",
    // 一个 index 可以包含多个属性
    // 如果 index 中只有一个属性, 那这个属性不能和 unique 中定义的重名
    "index": {
      "two-fields": [ "first", "second" ]
    },
    "view": {
      "sort-by-third": {
        // 必填, 必须以 "function map(doc)" 开始
        "map": `function map(doc) {
                  emit(doc.third, doc.third);
                }`,
        // 可以为空
        "reduce": "_sum"
      }
    }
  }
}
```
1. 数据服务支持应用自定义文档类型, 文档类型采用 [UTI](https://en.wikipedia.org/wiki/Uniform_Type_Identifier) (a.k.a. [rDNS](https://en.wikipedia.org/wiki/Reverse_domain_name_notation)) 命名方式, 如 **keyayun.service.files**
2. 文档类型名称要求全局唯一. 建议结合 **slug** 取名, 以保证唯一性.
3. 应用可以为每种数据定义一个 **unique** 属性 , unique 属性必须为**字符串类型**, 保证**全局唯一**取值
4. 应用可以自定义 **Index/View** 以辅助数据检索
5. **Index** 定义支持多个字段, 查询语法与 [**Mango**](https://github.com/cloudant/mango) 兼容. 当 index 只包含一个属性, 且与 unique 相同时, 会被忽略
6. **View** 与 [CouchDB **MapReduce**](http://docs.couchdb.org/en/latest/ddocs/ddocs.html#view-functions) 兼容. View 函数的签名必须为 **`function map(doc)`**.
7. 数据服务 API 使用说明见 [相关文档](../../../../service/src/branch/master/docs/data.md#data-api-详细设计-version-1)

### Intents

### 权限控制

### 通知系统

### 后台服务

## React
