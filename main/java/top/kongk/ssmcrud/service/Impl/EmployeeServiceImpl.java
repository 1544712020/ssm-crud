package top.kongk.ssmcrud.service.Impl;

import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.stereotype.Service;
import top.kongk.ssmcrud.bean.Employee;
import top.kongk.ssmcrud.bean.Page;
import top.kongk.ssmcrud.dao.EmployeeDao;
import top.kongk.ssmcrud.service.EmployeeService;

import java.util.HashMap;
import java.util.List;
import java.util.Map;

@Service
public class EmployeeServiceImpl implements EmployeeService {

    @Autowired(required = false)
    EmployeeDao employeeDao;

    @Override
    public Employee getEmpById(Integer id) {
        Employee employee = employeeDao.selectByPrimaryKey(id);
        return employee;
    }

    @Override
    public boolean deleteEmpByIds(List<Integer> list) {
        int i = employeeDao.deleteByEmpIdList(list);
        if (i == list.size()) {
            return true;
        } else {
            return false;
        }
    }

    @Override
    public boolean updateByPrimaryKeyAndSelective(Employee employee) {
        //employee在controller 那里已经验证 @valid 了
        return employeeDao.updateByPrimaryKeySelective(employee) > 0;
    }

    @Override
    public Page<Employee> getEmpsBySelectiveWithPage(Employee employee, int currPage, int pageSize) {
        /*获取查询记录总数*/
        int totalCount = employeeDao.countBySelective(employee);
        if(currPage < 0) {
            currPage = 1;
        }
        /*初始化Page 生成Page对象，传入当前页数，每页记录数，以及记录总数*/
        Page<Employee> page = new Page<>(currPage, pageSize, totalCount);
        if (totalCount == 0) {
            return page;
        }
        //设置map, 因为 employeeDao.selectBySelectiveWithPage(map) 需要
        Map map = new HashMap(3);
        map.put("employee", employee);
        map.put("start", page.getStart());
        map.put("pageSize", page.getPageSize());
        /*根据employee中的条件,分页查询,返回的是某一页的list (按条件查询, 分页返回)
        map中可传入employee, start, pageSize
        List<Employee> selectBySelectiveWithPage(
        Employee employee, @Param("start") Integer start, @Param("pageSize") Integer pageSize);*/
        List<Employee> employeeList = employeeDao.selectBySelectiveWithPage(map);
        page.setLists(employeeList);
        return page;
    }

    @Override
    public int insertEmp(Employee employee) {
        //employee在controller 那里已经验证 @valid 了
        return employeeDao.insert(employee);
    }

    /*通过名字查找员工*/
    @Override
    public boolean checkEmpByName(String name) {
        //如果该name在表中查不到,则返回null
        Integer count = employeeDao.countByName(name);
        return count == null;
    }
}
