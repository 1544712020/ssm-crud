package top.kongk.ssmcrud.test;

import org.junit.Test;
import org.junit.runner.RunWith;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.test.context.ContextConfiguration;
import org.springframework.test.context.junit4.SpringJUnit4ClassRunner;
import top.kongk.ssmcrud.bean.Department;
import top.kongk.ssmcrud.bean.Employee;
import top.kongk.ssmcrud.bean.Page;
import top.kongk.ssmcrud.dao.DepartmentDao;
import top.kongk.ssmcrud.dao.EmployeeDao;

import java.util.ArrayList;
import java.util.HashMap;
import java.util.List;
import java.util.Map;

@RunWith(SpringJUnit4ClassRunner.class)
@ContextConfiguration(locations={"classpath:applicationContext.xml"})
public class MapperTest {

    @Autowired
    DepartmentDao departmentDao;
    @Autowired
    EmployeeDao employeeDao;

    /*测试DepartmentDao中的查询全部部门信息的方法*/
    @Test
    public void testSelectAll() {
        List<Department> departments = departmentDao.selectAll();
        System.out.println(departments);
    }

    /*用于测试EmployeeDao中的通过主键查询员工信息的方法*/
    /*@Test
    public void testSelectByKey() {
        Employee employee = employeeDao.selectByPrimaryKey(2);
        System.out.println(employee);
    }*/

    /*用于测试EmployeeDao中的无条件分页查询*/
    /*@Test
    public void testSelectAllWithPage() {
        *//*调用Page的初始化函数获取pageStart和pageSize
        * 作为selectAllWithPage的参数*//*
        *//*countBySelective(null)中无参数，也就是无条件查找*//*
        Page<Employee> page = new Page<>(1, 6, employeeDao.countBySelective(null));
        List<Employee> employees = employeeDao.selectAllWithPage(page.getStart(), page.getPageSize());
        System.out.println("总记录数" + page.getTotalCount());
        for (Employee employee : employees) {
            System.out.println(employee);
        }
    }*/

    /*用于测试EmployeeDao中有条件分页查询*/
    /*@Test
    public void testSelectBySelectiveWithPage() {
        Employee employee = new Employee();
        employee.setGender("F");
        *//*employeeDao.countBySelective(employee)有条件查找*//*
        Page<Employee> page = new Page<>(1,6,
                employeeDao.countBySelective(employee));
        Map map = new HashMap(3);
        map.put("employee", employee);
        map.put("start", page.getStart());
        map.put("pageSize", page.getPageSize());
        List<Employee> employees = employeeDao.selectBySelectiveWithPage(map);
        System.out.println("总共条数" + page.getTotalCount());
        System.out.println("总共页数" + page.getTotalPage());
        for (Employee emp : employees) {
            System.out.println(emp);
        }
    }*/

    /*用于测试EmployeeDao中的批量删除*/
    /*@Test
    public void testDeleteByEmpIdList() {
        List<Integer> list = new ArrayList<>();
        list.add(447);
        list.add(449);
        int i = employeeDao.deleteByEmpIdList(list);
        System.out.println(i);
    }*/

    /*用于测试employeeDao中的根据条件更新员工的相关信息*/
    /*@Test
    public void testUpdateByPrimaryKeySelective() {
        Employee employee = new Employee();
        employee.setEmpId(379);
        employee.setGender("F");
        //employee.setEmpName("哈哈");
        int count = employeeDao.updateByPrimaryKeySelective(employee);
        System.out.println(count);
    }*/

    /*用于测试employeeDao中的插入员工信息*/
    /*@Test
    public void testInsert() {
        Employee employee = new Employee();
        employee.setEmpName("kong");
        employee.setGender("M");
        employee.setEmail("123@qq.com");
        employee.setDepartId(5);
        int count = employeeDao.insert(employee);
        System.out.println(count);
    }*/

}

