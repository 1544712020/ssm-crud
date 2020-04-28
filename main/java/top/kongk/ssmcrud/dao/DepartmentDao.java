package top.kongk.ssmcrud.dao;

import top.kongk.ssmcrud.bean.Department;

import java.util.List;

public interface DepartmentDao {

    /*获取部门信息*/
    List<Department> selectAll();

}
