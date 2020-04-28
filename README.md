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


#### 数据库中有员工表和员工所在部门的部门表

员工表列名：

![输入图片说明](https://images.gitee.com/uploads/images/2020/0428/153217_ee37ee92_6533994.png "屏幕截图.png")

部门表列名：

![输入图片说明](https://images.gitee.com/uploads/images/2020/0428/153311_e7bd3591_6533994.png "屏幕截图.png")

ER图如下所示：

![输入图片说明](https://images.gitee.com/uploads/images/2020/0428/154752_af089d74_6533994.png "屏幕截图.png")

#### 前后端交互流程图

![交互图](https://images.gitee.com/uploads/images/2020/0428/170749_fe350541_6533994.png "屏幕截图.png")



#### 码云特技

1.  使用 Readme\_XXX.md 来支持不同的语言，例如 Readme\_en.md, Readme\_zh.md
2.  码云官方博客 [blog.gitee.com](https://blog.gitee.com)
3.  你可以 [https://gitee.com/explore](https://gitee.com/explore) 这个地址来了解码云上的优秀开源项目
4.  [GVP](https://gitee.com/gvp) 全称是码云最有价值开源项目，是码云综合评定出的优秀开源项目
5.  码云官方提供的使用手册 [https://gitee.com/help](https://gitee.com/help)
6.  码云封面人物是一档用来展示码云会员风采的栏目 [https://gitee.com/gitee-stars/](https://gitee.com/gitee-stars/)
