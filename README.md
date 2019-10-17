#### 引入方式


#### 支持 ES module
```
import neo4jData from "neo4j-data"
```
#### 支持CJS
```
var neo4jData = require("neo4jData");
```
#### 支持AMD
```
require(['neo4j-data'],function(neo4j-data){
   ...
   ...
   ...
})
```
#### 支持link
```
<script src="https://unpkg.com/neo4j-data"></script>
```


#### 使用实例
```

import neo4jData from "neo4j-data"


const neo4j = new neo4jData();
<!-- 初始化配置 -->
neo4j.config({
    url : '填入url',
    username : '填入用户名',
    password : '填入密码'
})
<!-- 运行match语句 -->
neo4j.runMatch(
      "需要执行的MATCH语句"
      )
     .then(result=>{
         <!-- 对结果进行处理  -->
         let info = neo4j.dataDetail(result.records);
         neo4j.close();
})
```


#### 处理后数据结构

```
{
    
nodes: [{…}, {…}, {…}, {…}, {…}, {…}, {…}],
nodesMap: {239979: {…}, 263732: {…}, 441610: {…}, 458585: {…}, 459032: {…}, 481273: {…}, 482247: {…}},
relationships: [{…}, {…}, {…}, {…}, {…}, {…}, {…}],
relationshipsMap:  {239979: {…}, 263732: {…}, 441610: {…}, 458585: {…}, 459032: {…}, 481273: {…}, 482247: {…}},
}

```