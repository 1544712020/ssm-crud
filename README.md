# ssm-crud

#### 介绍
此项目实现了对数据库数据的增删查改，后端使用Spring+MyBatis+SpringMVC，前端使用了jQuery+JavaScript+AJAX，前后端实现了异步交互，前端页面可以异步更新。项目主要实现了员工的增加、删除、批量删除、更新、查询。员工管理模块主要功能如下图所示：

![输入图片说明](https://images.gitee.com/uploads/images/2020/0428/152446_88bc24d5_6533994.jpeg "主要功能.jpeg")

#### 软件架构
软件架构设计 项目结构可以划分为以下几个层次

- 持久对象层：该层由实体类组成
- 数据访问层：该层由DAO接口和MyBatis映射文件组成
- 业务逻辑层：该层由Service接口和实现类组成
- Web表现层：该层由SpringMVC中的Controller类和HTML页面以及JS文件组成

#### 项目开发以及运行环境
- 操作系统：Windows
- Web服务器：Tomcat
- Java开发包：JDK
- 开发工具：IDEA
- 项目构建工具：Maven
- 数据库：MySQL
- 浏览器：谷歌

#### 数据库中有员工表和员工所在部门的部门表

员工表列名：

![输入图片说明](https://images.gitee.com/uploads/images/2020/0428/153217_ee37ee92_6533994.png "屏幕截图.png")

部门表列名：

![输入图片说明](https://images.gitee.com/uploads/images/2020/0428/153311_e7bd3591_6533994.png "屏幕截图.png")

ER图如下所示：

![输入图片说明](https://images.gitee.com/uploads/images/2020/0428/154752_af089d74_6533994.png "屏幕截图.png")

#### 前后端交互流程图

![交互图](https://images.gitee.com/uploads/images/2020/0428/170749_fe350541_6533994.png "屏幕截图.png")

#### 项目截图

主页

![输入图片说明](https://images.gitee.com/uploads/images/2020/0513/173013_6f0ea070_6533994.jpeg "主页.jpg")

新增员工

![输入图片说明](https://images.gitee.com/uploads/images/2020/0513/173119_16325993_6533994.jpeg "新增员工.jpg")

查询员工

![输入图片说明](https://images.gitee.com/uploads/images/2020/0513/173136_2773bd3c_6533994.jpeg "查询员工.jpg")

更新员工

![输入图片说明](https://images.gitee.com/uploads/images/2020/0513/173144_c38f9692_6533994.jpeg "更新员工.jpg")

删除单个

![输入图片说明](https://images.gitee.com/uploads/images/2020/0513/173154_30aacf57_6533994.jpeg "删除单个.jpg")

批量删除

![输入图片说明](https://images.gitee.com/uploads/images/2020/0513/173202_f5848bc9_6533994.jpeg "批量删除.jpg")
