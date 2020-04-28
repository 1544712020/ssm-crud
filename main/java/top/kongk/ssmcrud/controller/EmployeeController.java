package top.kongk.ssmcrud.controller;

import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.stereotype.Controller;
import org.springframework.validation.BindingResult;
import org.springframework.validation.FieldError;
import org.springframework.web.bind.annotation.*;
import top.kongk.ssmcrud.bean.Employee;
import top.kongk.ssmcrud.bean.Page;
import top.kongk.ssmcrud.service.EmployeeService;
import top.kongk.ssmcrud.utils.Msg;

import javax.validation.Valid;
import java.util.ArrayList;
import java.util.HashMap;
import java.util.List;
import java.util.Map;

@Controller
public class EmployeeController {

    @Autowired(required = false)
    EmployeeService employeeService;

    /**
    * 通过id查询员工
     */
    @RequestMapping(value = "/emp/{id}", method = RequestMethod.GET)
    @ResponseBody
    public Employee getEmployee(@PathVariable("id") Integer id) {
        return employeeService.getEmpById(id);
    }

    /**
     * 删除多个或单个员工 把 1-3-4-9 解析成 list 1 3 4 9
     */
    @RequestMapping(value = "/emp/{ids}", method = RequestMethod.DELETE)
    @ResponseBody
    public boolean deleteEmployees(@PathVariable("ids") String ids){
        ids = ids.trim();

        if (ids == null || ids.isEmpty()) {
            return false;
        }
        /*通过字符串中的“-”来对字符串进行分割*/
        String[] split = ids.split("-");
        List<Integer> list = new ArrayList<>(split.length);
        for (String s : split) {
            /*Integer.valueOf()将字符串解析成为int*/
            list.add(Integer.valueOf(s));
        }
        return employeeService.deleteEmpByIds(list);
    }

    /*根据主键 更新 employee*/
    @RequestMapping(value = "/emp", method = RequestMethod.PUT)
    @ResponseBody
    /*@Valid和bindingResult要一一对应，在Employee实体类上添加了校验规则，使用@Valid开启校验功能*/
    /**BindingResult是springmvc的一个验证框架*/
    public Msg getEmployee(@Valid Employee employee, BindingResult bindingResult) {
        /*验证出错返回*/
        if (bindingResult.hasErrors()) {
            List<FieldError> fieldErrors = bindingResult.getFieldErrors();
            Map map = new HashMap<String, Object>();
            for (FieldError fieldError : fieldErrors) {
                /*将错误信息放在map中*/
                map.put(fieldError.getField(), fieldError.getDefaultMessage());
            }
            /*返回"处理失败"以及处理失败的信息*/
            return Msg.fail().addMap(map);
        }
        if (employeeService.updateByPrimaryKeyAndSelective(employee)) {
            return Msg.success();
        } else {
            return Msg.fail();
        }
    }

    /*根据条件 分页查询员工*/
    @RequestMapping(value = "/emps", method = RequestMethod.GET)
    @ResponseBody
    public Page<Employee> getEmployees(Employee employee,
                                       @RequestParam(name = "currPage", defaultValue = "1") int currPage,
                                       @RequestParam(name = "pageSize", defaultValue = "5") int pageSize) {
        if (currPage < 1 || pageSize <1) {
            return null;
        }
        return employeeService.getEmpsBySelectiveWithPage(employee, currPage, pageSize);
    }

    /*新增员工*/
    @RequestMapping(value = "/emps", method = RequestMethod.POST)
    @ResponseBody
    public Msg addEmployee(@Valid Employee employee, BindingResult bindingResult) {
        //如果验证出现了错误
        if (bindingResult.hasErrors()) {
            Map map = new HashMap();
            //获取错误
            List<FieldError> fieldErrors = bindingResult.getFieldErrors();
            for (FieldError fieldError : fieldErrors) {
                map.put(fieldError.getField(), fieldError.getDefaultMessage());
            }
            return Msg.fail().addMap(map);
        } else {
            int count = employeeService.insertEmp(employee);
            if (count > 0) {
                return Msg.success();
            }
            else {
                return Msg.fail();
            }
        }
    }

    /**
     * 通过name查询员工
     */
    @RequestMapping(value = "/checkempname")
    @ResponseBody
    public boolean checkEmployeeName(String name) {
        /*如果该名字可用返回true*/
        return  employeeService.checkEmpByName(name);
    }

}
