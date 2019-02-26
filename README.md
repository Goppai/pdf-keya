此模版的目的是 support 所有之后的 Seal App 的开发。 所有的新 Seal App 应当从此模版开始

## 引用

- 从 [Create React App](https://github.com/facebook/create-react-app) 生成.
- 参考 [Cozy Scripts](https://github.com/CPatchane/create-cozy-app#readme).

## 结构

整个结构从 create-reat-app 生成.

### config

由 create-react-app eject 而来， 内含所有路径设置， 以及 webpack 设置.

### scripts

包含所有辅助开发的脚本. 现在有 4 个

- start: 用于开发
- build: 用于发布
- test: 用于测试, 目前无测试标准
- translate: 用于进行多语言文件的生成, 下有详细解释

### src

下面有 4 个子目录:

#### targets

放入口文件, 以下文件不需进行改动， 每个 App 均相同

- manifest.webapp, 这是每个 app 的描述文件, 服务器需读取
- browser 目录下是通过启动 app 的模式打开的入口文件
- intents 目录下是通过启动 intents 的模式的入口文件

#### locales

react-intl 的集成， 用于多语言

#### seal-client

Library, 封装了服务端交互相关的逻辑

#### app

App 特有的数据和代码, 此目录下包括所有模版内需要 App 进行特化的代码

## 使用

### 初次使用

#### 克隆

```
git clone git@git.keyayun.com:keyayun/app-template.git [appname]
git remote rename origin template
git remote add [app-repository] origin
git remote push [app-repository]
```

#### 更改内容

- src/app/manifest.webapp
- src/app/locales 内包含 App 自己的翻译内容
- src/app/icons 内为 App 自己的 Icon
- src/app/App|Intent 为 App 的入口组件

## 升级

### 如果从 app-template clone 而来

git merge template/master

### 如果通过 copy 文件而来

- 覆盖 config, scripts 目录到本地
- 覆盖 src/locales, src/seal-client, src/targets 目录到本地
- 根据 package.json 的 diff 更改/安装 包

## 开发事项

### 开发

npm start

### 发布

npm build

### 多语言

##### 用法可参考 [react-intl](https://github.com/yahoo/react-intl) 在自己的 app 内进行翻译

用 react 组件的方式使用

```js
import React from 'react';
import { FormattedMessage } from 'react-intl';

export const Hello1 = () => (
  <p>
    <FormattedMessage
      id="example.Hello1"
      defaultMessage="Just... Hello world! This is a first hello view"
    />
  </p>
);
```

用 formatMessage 函数的方式使用

```js
import { injectIntl, defineMessages } from 'react-intl';
const messages = defineMessages({
  delete: {
    id: 'example.delete',
    defaultMessage: 'Delete'
  }
});
class TodoRemoveButton extends Component {
  render() {
    const { formatMessage } = this.props.intl;
    return <div label={formatMessage(messages.delete)} />;
  }
}

// get mutations from the client to use deleteDocument
export default injectIntl(withMutations()(TodoRemoveButton));
```

#### 翻译流程

翻译有两种流程:
第一种是开发定义 id. 第二种是产品定义 id.

##### 开发定义 id

- 好处

  1. 开发对于产品的依赖在于设计图和文档， 不需要有翻译 id 的依赖
  2. 当出现多行的文本的时候， 开发更容易把握将翻译分为几行
  3. 部分翻译需要有变量介入， 开发更容易写出合适的原始翻译文本， 翻译内容需涵盖变量

- 坏处

  1. 当翻译出现问题的时候， 不容易界定错误在于开发还是产品
  2. 翻译进行更改的时候， 需要进行人工 merge

- 使用流程
  1. 调用 yarn build && yarn langs 来生成并更新 src/locales/template.json 文件
  2. 按照 template.json 内的对应内容， copy 到新的语言文件， 进行翻译， 比如翻译为 src/locales/data/zh.json

##### 产品定义 id

好处还坏处和 开发定义 id 正好相反

- 使用流程

  1. 产品生成所有翻译的.json 文件
  2. 开发负责定期更新文件到 repository 中
  3. 开发直接使用产品翻译好的.json 文件， 不跑 yarn langs 脚本.

- 结论

两种模式各有优缺点， 但是可以很容易互相转换， 并没有严格的冲突， 所以可以采用项目合适的方法和习惯进行开发.
defineMessages 不是必须的操作， 但是为了后期的维护性， 推荐使用.

#### 原则

- 所有的 message 由开发决定， 包括 id 和 default 值
- 所有的 message 定义在所在 feature 相关的目录/文件
- code 内所有文件可以直接引用 react-intl
- 源码决定 message id 和 default 值, 脚本负责收集 template.json, 翻译集中在一个地方

### prettierrc

请配置 code 的 prettier, 这样可以通过工具保证代码风格的一致

### css

推荐使用 styled-components 进行 css 覆盖写法, 尽可能不在 code 内写 style={{width: 80}}这样的内容
