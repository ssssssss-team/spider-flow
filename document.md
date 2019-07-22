# spider-flow使用说明

#### 启动
- 本项目为SpringBoot项目,运行SpiderApplication类,访问http://localhost:8088/即可

#### 图形说明
| 图形   | 图形说明   |
| ----- | --- |
| 正方形   | 抓取页面   |
| 平行四边形   | 定义变量   |
| 双边矩形   | 输出(主要用于测试输出至页面表格)   |
| 圆柱   | 定义数据源   |
| 双正方形   | 执行SQL   |
| 箭头   | 流转方向   |

#### 抓取页面
- 循环变量：用来定义循环变量，主要目的是抓取多个同类URL,如：projectIndex
- 循环次数：定义循环次数，可使用${}从变量中获取值（FreeMarker语法），如：10
- 起始URL：抓取地址，可使用${}从变量中获取值（FreeMarker语法）如：https://gitee.com/${projectUrls[projectIndex]}
- 请求方法：GET、POST
- 请求参数：用来设置请求参数，可添加多个，参数值处可使用${}来获取值
- 请求header：用来设置请求header，可添加多个，header值处可使用${}来获取值

#### 定义变量
- 变量名：定义变量名称
- 变量值：可使用${}从变量中获取值（FreeMarker语法）如：${selectors(resp.html,'.categorical-project-card a','attr','href')}

#### 定义数据源
- 数据库类型，目前仅支持Mysql(其它驱动未引入至项目中)
- 数据库连接，如：jdbc:mysql://127.0.0.1:3306/test?useUnicode=true&characterEncoding=utf-8
- 用户名，如：root
- 密码,如：123456
> 需要注意的是，此处不支持${}语法

#### 输出
- 输出项，该值为页面中显示表格的列名
- 输出值，该值为页面中显示表格单元格值，语法同样支持${}

#### 执行SQL
- 数据源，选择之前定义好的数据源
- 语句类型，select/insert/update/delete
- SQL语句，如INSERT INTO gitee_gvp(project_name, project_link,project_desc) VALUES (#${projectNames[projectIndex]}#,#${projectUrls[projectIndex]}#,#${projectDesc}#)
> 需要注意的是，SQL语句不支持${}语法，但是参数是支持的，另外参数需要用##包起来

#### 箭头
- 条件，每个箭头都可以添加条件，当条件成立时，才流向所指向的节点，不写即不判断，直接流向下一个节点

#### 内置变量
| 变量名称 | 变量值 |
| -------- | ------ |
|  resp    | HttpResponse对象|
|  rs      | SQL执行结果，类型：int或List<Map<String,Object>>   | 

#### HttpResponse对象
| 字段名称 | 字段类型 | 字段描述 |
| -------- | -------- | -------- |
|  html    |  String  | 页面HTML |
|  json    |  JSONObject/JSONArray | 内容转json结果         |
|  bytes   |  bytes[] | 二进制结果  |
|  cookies | Map<String,String>  |  cookies   |
|  headers | Map<String,String>  |  headers   |
|  statusCode | int  |  HTTP状态码 |

