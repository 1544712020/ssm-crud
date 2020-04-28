window.onload = function() {

	//路径
	var APP_PATH = "/ssm_crud";
	//员工数据
	var EMP_DATA = "";
	var EMP_DATA_BOOL= false;
	var EMP_NAME_CHECK = false;
	var EMP_EMAIL_CHECK = false;
	//员工证记录数，当前页，员工id号
	var totalCount, CURR_PAGE, EMPID;

	//$(function() {}) 是$(document).ready(function()的简写
	//DOM加载完毕之后执行
	$(function () {
		getPage(1);
	});

	//加载首页数据
	function getPage(pageNum) {
		var emp_data = "";
		/*当声明的变量还未被初始化时，变量的默认值为undefined*/
		if (pageNum != undefined) {
			emp_data += "currPage=" + pageNum +"&";
		}
		if (EMP_DATA_BOOL)
			emp_data += EMP_DATA;
		// alert(emp_data);
		$.ajax({
			//请求路径
			url : APP_PATH + "/emps",
			//请求携带参数
			data : emp_data,
			//设置字符编码（防止从函数里面传入html页面中的中文字符出现乱码·）
			scriptCharset : 'utf-8',
			//请求类型
			type : 'GET',
			//请求成功后的回调函数
			success : function(result) {
				//若返回的员工数据总条数大于零就进行页面数据解析
				if (result.totalCount > 0) {
					//设置全局的totalCount
					totalCount = result.totalCount;
					//解析table
					build_emp_table(result);
					//解析分页信息
					build_emp_table_info(result);
					//解析分页 页码
					build_emp_table_pageNum(result);
				//否则的话将无数据填充的地方变为空
				} else {
					$("#emps_table tbody").empty();
					$("#page_nav").empty();
					$("#page_info").empty();
					alert("查询结果为空，请重新输入查询信息");
				}
			}
		});
	}

	//解析员工数据
	function build_emp_table(result) {
		//先把表清空
		$("#emps_table tbody").empty();
		//还原表单表头的 checkbox
		//$(元素id).attr(属性名称, 属性值)返回被选元素的属性值
		$("#check_all_page").attr("checked", false);
		//获取result中的所有员工列表信息
		var emps = result.lists;
		//使用jQuery中的each函数，构建表单中的每一行数据记录
		//循环遍历emps，index是当前元素的位置，emp是值
		$.each(emps, function (index, emp) {
			var checkBox = $("<td><input type='checkbox' class='check_item'></td>");
			var empId = $("<td></td>").append(emp.empId);
			var empName = $("<td></td>").append(emp.empName);
			var gender = $("<td></td>").append(emp.gender == 'M' ? "男" : "女");
			var email = $("<td></td>").append(emp.email);
			var deptName = $("<td></td>").append(emp.department.deptName);
			var edit_btn =
				//attr()以键值对形式添加属性以及属性值
				$("<button type=\"button\" class=\"btn btn-primary btn-sm edit_btn\">修改</button>").attr("empId", emp.empId);

			var delete_btn =
				$("<button type=\"button\" class=\"btn btn-danger btn-sm delete_btn\">删除</button>").attr("empId", emp.empId);

			var opt = $("<td></td>").append(edit_btn).append(" ").append(delete_btn);
			$("<tr></tr>").append(checkBox).append(empId).append(empName)
				.append(gender).append(email).append(deptName)
				.append(opt).appendTo("#emps_table tbody");/*appendTo把所有匹配的元素追加到另一个指定的元素元素集合中*/
		});
	}

	//解析分页 页码
	function build_emp_table_pageNum(result) {
		//根据bootstrap的分页代码, 来手动动态生成
		//生成之前先清空分页码
		$("#page_nav").empty();
		var ul = $("<ul></ul>").addClass("pagination");
		//首页
		var firstPage = $("<li></li>").append($("<a></a>").append("首页").attr("href", "#"));
		//前一页
		var prePage = $("<li></li>").append($("<a></a>").append("&laquo;").attr("href", "#"));
		//判断首页和前一页是否可以点击
		//调用page的方法查看是否又前一页
		if (!result.hasPre) {
			//添加disabled之后就无法点击
			firstPage.addClass("disabled");
			prePage.addClass("disabled");
		} else {
			firstPage.click(function () {
				getPage(1);
			});
			prePage.click(function () {
				getPage(result.currPage - 1);
			});
		}
		//尾页
		var lastPage = $("<li></li>").append($("<a></a>").append("末页").attr("href", "#"));
		//后一页
		var nextPage = $("<li></li>").append($("<a></a>").append("&raquo;").attr("href", "#"));
		//判断末页和后一页是否能点击
		//如果没有后一页
		if (!result.hasNext) {
			lastPage.addClass("disabled");
			nextPage.addClass("disabled");
		} else {
			lastPage.click(function () {
				getPage(result.totalPage);
			});
			nextPage.click(function () {
				getPage(result.currPage + 1);
			});
		}
		//添加第一页和前一页
		ul.append(firstPage).append(prePage);
		//循环添加页码
		$.each(result.pageNums, function (index, pageNum) {
			var page =  $("<li></li>").append($("<a></a>").append(pageNum).attr("href", "#"));
			//给每个页码添加点击事件
			page.click(function () {
				getPage(pageNum);
			});
			if (result.currPage == pageNum)
				page.addClass("active");
			ul.append(page);
		});
		//将所有的页码添加到分页导航中
		ul.append(lastPage).append(nextPage).appendTo("#page_nav");
	}
	//解析分页信息
	function build_emp_table_info(result) {
		$("#page_info").empty();
		CURR_PAGE = result.currPage;
		//每页显示记录： 当前页数： 总记录数：
		$("#page_info").append("当前页数:" + result.currPage
			+ " / " + result.totalPage
			+ "   ,  共 " + result.totalCount + " 条记录");
	}

/*----------------------------------------------------------------------------------------------------------------------------------------------------*/
	//员工新增按钮,
	$("#emp_Add_modal_Btn").click(function () {
		//在弹出模态框之前需要获取部门信息
		getDepts("#departId");
		//清空模态框中的数据
		$("#myModal form")[0].reset();
		//清空表单样式
		$("#myModal form").find("*").removeClass("has-error has-success");
		$("#myModal form").find(".help-block").text("提示信息");
		//$("#myModal form").find(".help-block").innerHTML = "hello";
		//$("#myModal form").find(".help-block").innerHTML +=  "&amp;nbsp;";
		$('#myModal').modal({
			backdrop : 'static'
		});
	});

	//ajax获取部门信息
	function getDepts(ele) {
		$.ajax({
			url : APP_PATH + "/depts",
			async : false,
			type : 'GET',
			success:function (depts) {
				//接收到后台传过来的部门信息之后,遍历, 清空并填充ele
				$(ele).empty();
				$.each(depts , function (index, dept) {
					$(ele).append(
						$("<option></option>").append(dept.deptName).attr("value", dept.deptId)
					);
				});
			}
		});
	}

	//新增员工modal中的保存按钮点击事件
	$("#emp_save_button").click(function () {
		//调用验证姓名函数
		validate_empname();
		//调用验证邮件函数
		validate_emp_email("#email_form_input");
		//在保存之前在前端校验数据（利用输入框的change事件检验）
		if (EMP_EMAIL_CHECK == false || EMP_NAME_CHECK == false) {
			$("#tips").popover('show');
			return false;
		} else {
			EMP_NAME_CHECK = false;
			EMP_EMAIL_CHECK = false;
		}
		//调用后台的方法进行保存
		$.ajax({
			url : APP_PATH + '/emps',
			type : 'POST',
			//设置字符编码（防止从函数里面传入html页面中的中文字符出现乱码·）
			scriptCharset : 'utf-8',
			//通过$().serialize()来获取元素内的所有内容（序列表表格内容为字符串）
			data : $("#emp_add_form").serialize(),
			success : function (result) {
				if (result.codeNum == 100) {
					$("#myModal").modal('hide');
					getPage(totalCount);
				} else {
					// 显示失败信息
					if (undefined != result.map.empName) {
						//显示姓名错误信息
						show_validate_msg("#empName_form_input", "error", result.map.empName);
					}
					if (undefined != result.map.email) {
						//显示邮箱错误信息
						show_validate_msg("#email_form_input", "error", result.map.email);
					}
					alert("保存失败！");
				}
			}
		});
	});
	//当鼠标离开保存按钮时将提示信息隐藏
	$("#emp_save_button").mouseleave(function () {
		$("#tips").popover('hide');
	});

	//检验用户名 通过按钮
	$("#test_emp_name_btn").click(function () {
		validate_empname();
	});
	//检验用户名 通过input的change事件（当元素失去焦点得时候change事件会发生）
	$("#empName_form_input").change(function () {
		validate_empname();
	});
	//添加keyup事件
	$("#empName_form_input").keyup(function () {
		validate_empname();
	});

	//姓名验证函数
	function validate_empname() {
		//获取输入姓名值
		var empName = $("#empName_form_input").val();
		//定义正则表达式
		var regex = /(^[a-zA-Z0-9]{6,16})|(^[\u2E80-\u9FFF]{2,15})/;
		//先根据正则表达式 校验格式
		if (!regex.test(empName)) {
			show_validate_msg("#empName_form_input", "error", "用户名6~16为字母数字组合 , 或2~15个汉字");
			EMP_NAME_CHECK = false;
			return false;
		} else {
			show_validate_msg("#empName_form_input", "success", "用户名格式正确");
		}
		/* 路径/checkempname?name=XXX :GET 后台验证该用户名是否被占用
        *  返回信息: true, false
        * */
		$.ajax({
			url : APP_PATH + '/checkempname',
			data : "name=" + empName,
			type : 'GET',
			success : function (result) {
				if(result) {
					show_validate_msg("#empName_form_input", "success", "用户名可以用");
					EMP_NAME_CHECK = true;
					return true;
				} else {
					show_validate_msg("#empName_form_input", "error", "用户名已经被占用了");
					EMP_NAME_CHECK = false;
					return false;
				}
			}
		})
	}

	//利用输入框的change事件检验（当元素失去焦点的时候会触发change事件）
	$("#email_form_input").change(function () {
		validate_emp_email("#email_form_input");
	});
	//检验邮箱格式（keyup事件会在用户输入信息，按下按钮时触发，每按一次便触发一次）
	$("#email_form_input").keyup(function () {
		validate_emp_email("#email_form_input");
	});

	/*新增modal 和 更新modal用到的 验证邮箱格式(使用正则)*/
	function validate_emp_email(ele) {
		var email = $(ele).val();
		var regex = /^[a-z\d]+(\.[a-z\d]+)*@([\da-z](-[\da-z])?)+(\.{1,2}[a-z]+)+$/;
		//先校验格式
		if (!regex.test(email)) {
			//设置格式
			show_validate_msg(ele , "error", "邮箱格式错误");
			EMP_EMAIL_CHECK = false;
		} else {
			show_validate_msg(ele , "success", "邮箱格式正确");
			EMP_EMAIL_CHECK = true;
		}
	}

	//显示校验信息函数
	function show_validate_msg(ele, status, msg) {
		//清除当前元素的校验状态
		$(ele).parent().removeClass("has-success has-error");
		$(ele).next("span").text("");
		//设置信息
		if("success"==status) {
			//添加成功属性：父元素里面的内容变为绿色（$().parent()找到当前元素得父元素）
			$(ele).parent().addClass("has-success");
			//为当前元素（输入框元素）得下一个元素添加
			$(ele).next("span").text(msg);
		}else if("error" == status) {
			//添加成功属性：父元素里面的内容变为红色（$().parent()找到当前元素得父元素）
			$(ele).parent().addClass("has-error");
			$(ele).next("span").text(msg);
		}
	}

	//获取员工信息页面
	function getPageOpt(pageNum) {
		var emp_data = "";
		if (pageNum != undefined) {
			emp_data += 'currPage=' + pageNum + "&";
		}
		if (EMP_DATA_BOOL) {
			emp_data += EMP_DATA;
		}
		$.ajax({
			url : APP_PATH + "/emps",
			data : emp_data,
			type : 'GET',
			success : function (result) {
				if (result.totalCount > 0) {
					//设置全局的totalCount
					totalCount = result.totalCount;
					//解析table
					build_emp_table(result);
					//解析分页信息
					build_emp_table_info(result);
					//解析分页 页码
					build_emp_table_pageNum(result);
				}else {
					$("#emps_table tbody").empty();
					$("#page_nav").empty();
					$("#page_info").empty();
					alert("查询结果为空，请重新输入查询信息");
				}
			}
		});
	}

	//员工组合查询按钮
	$("#emp_query_modal_btn").click(function () {
		//在弹出模态框之前需要获取部门信息
		getDeptsOfQuery("#departId_query");
		//清空模态框中的数据
		//$("#queryModal form")[0].reset();
		$('#queryModal').modal({
			backdrop : 'static'
		});
	});

	//ajax获取部门信息 专门给组合查询用的, 因为查询modal用到了不选择部门, 所以为了方便给它专门复制一份获取部门信息的函数
	function getDeptsOfQuery(ele) {
		$.ajax({
			url : APP_PATH + "/depts",
			async : false,
			type : 'GET',
			success : function (depts) {
				$(ele).empty();
				//因为查询时候可以不选择部门信息来查询员工信息
				$(ele).append($("<option value=\"0\">不选择</option>"));
				//遍历得到的部门信息
				$.each(depts , function (index, dept) {
					$(ele).append(
						$("<option></option>").append(dept.deptName).attr("value",dept.deptId)
					);
				});
			}
		});
	}

	// 组合查询模态框查询按钮点击事件
	$("#emp_query_button").click(function () {
		var empId = $("#empId_form_input_query").val();
		var empName = $("#empName_form_input_query").val();
		var email = $("#email_form_input_query").val();
		var gender = $("#queryModal input[name=gender]:checked").val();
		var departId = $("#departId_query").val();
		var info = "当前查询条件:  ";
		//传递给后台的组合查询的条件
		var s = "";
		if (empId != "") {
			s += "empId=" +empId + "&";
			info += "员工id : " + empId + " , ";
		}
		if (empName != ""){
			s += "empName=%25" + empName + "%25&";
			info += "员工姓名 : " + empName + " , ";
		}
		if (email != ""){
			s += "email=%25" +email + "%25&";
			info += "员工邮箱 : " + email + " , ";
		}
		if (gender != "N"){
			s += "gender=" +gender + "&";
			if (gender == "M")
				info += "员工性别 : 男" +  " , ";
			else
				info += "员工性别 : 女" +  " , ";
		}
		if (departId != 0){
			s += "departId=" +departId + "&";
			info += "员工部门 : " + $("#departId_query option:selected").text() + " , ";
		}
		info = info.substring(0, info.length - 2);
		if (s != "") {
			// var EMP_DATA_BOOL = false;
			//将员工数据的常量布尔值改成true
			EMP_DATA_BOOL = true;
			// var EMP_DATA = "";
			//为员工数据添加输入框的值
			EMP_DATA = s.substring(0, s.length - 1);
			//隐藏查询modal
			$('#queryModal').modal('hide');
			//查询条件文字
			$("#query_info").html(info);
			//给显示的查询条件右边添加一个图标(点击删除查询条件)
			$("#query_icon").addClass("glyphicon-remove");
			//此时的getPage 传递给后台的不止当前页,还包括组合查询的条件
			getPageOpt(1);
		} else {
			EMP_DATA_BOOL = false;
			EMP_DATA = "";
			//弹出提示框
			$("#tips_query").popover('show');
			return false;
		}
	});

	//查询条件右边的小图标 删除查询条件
	$("#query_icon").click(function () {
		EMP_DATA_BOOL = false;
		EMP_DATA = "";
		//清除自己的小图标, 并把查询条件清空
		$(this).removeClass("glyphicon-remove");
		$("#query_info").text("");
		getPage(1);
	});
	//当鼠标离开按钮时,隐藏因为错误弹出的信息
	$("#emp_query_button").mouseleave(function () {
		$('#tips_query').popover('hide');
	});

	//修改员工信息按钮模态框
	//$(document).on('click','要选择的元素',function(){})（使用document可以触发动态生成的元素按钮，而click只可以触发页面已经存在的元素）
	$(document).on("click", ".edit_btn", function () {
		//获取当前元素的员工id
		var empId = $(this).attr("empId");
		EMPID = empId;
		//在弹出模态框之前需要获取部门信息
		getDepts("#departId_update");
		//首先获取该员工的数据
		getEmp(empId);
		//弹出修改modal
		$('#editModal').modal({
			backdrop : 'static'
		});
	});

	//根据员工id值获取该员工的数据，把数据加载到更新modal中
	function getEmp(empId) {
		$.ajax({
			url : APP_PATH + "/emp/" + empId,
			type : 'GET',
			success : function (result) {
				$("#empName_update").text(result.empName);
				$("#email_form_input_update").val(result.email);
				$("#editModal input[name=gender_update]").val([result.gender]);
				$("#departId_update_div select").val([result.departId]);
			}
		});
	}

	/*更新modal中的邮箱输入框*/
	$("#email_form_input_update").change(function () {
		validate_emp_email("#email_form_input_update");
	});
	$("#email_form_input_update").keyup(function () {
		validate_emp_email("#email_form_input_update");
	});
	$("#emp_update_button").mouseleave(function () {
		$('#tips_update').popover('hide');
	});

	/*更新modal中的 更新按钮*/
	$("#emp_update_button").click(function () {
		//验证邮箱
		validate_emp_email("#email_form_input_update");
		//在保存之前先在前端校验数据--change检验
		if (EMP_EMAIL_CHECK == false) {
			$('#tips_update').popover('show');
			return false;
		}
		//把更新modal中的表单的数据提取出来
		var form_data = "empId=" + EMPID + "&"
			+ "empName=" + $("#empName_update").text() + "&"
			+ "email=" + $("#email_form_input_update").val() + "&"
			+ "gender=" + $("#editModal input[name=gender_update]:checked").val() + "&"
			+ "departId=" + $("#departId_update_div select").val();
		/* 路径/emp : PUT 更新员工信息
        *  后端会验证传递过去的数据
        *  如果更新成功, 返回的codeNum 为 100, 否则就是失败了, 并且传回错误的信息
        * */
		$.ajax({
			url : APP_PATH + '/emp',
			/*需要在web.xml中配置Hidden***filter*/
			type : 'PUT',
			data : form_data,
			/*后台加了邮箱验证,后台检测到邮箱格式不正确,会返回错误信息*/
			success : function (result) {
				if (result.codeNum == 100) {
					$('#editModal').modal('hide');
					$('#tips_update').popover('hide');
					getPage(CURR_PAGE);
				}
				else {
					//显示失败信息, 此时只显示邮箱的错误信息
					if(undefined != result.map.email){
						show_validate_msg("#email_form_input_update", "error", result.map.email);
					}
					alert("并没有更新!");
				}
			}
		});
	});

	/*页面中员工记录的末尾的删除按钮 之所以用这种方法, 是因为这个删除按钮的html代码是动态添加的*/
	$(document).on("click", ".delete_btn", function () {
		//每个删除按钮都给它添加了一个empId属性,对应着该员工
		var empId = $(this).attr("empId");
		//弹出确认删除按钮
		if (confirm("确定要删除id为" + empId + "的员工吗?")) {
			/* 路径/emp/{id} : DELETE
            * 成功返回true, 失败返回false
            * */
			$.ajax({
				url: APP_PATH + "/emp/" + empId,
				type: "DELETE",
				success: function (result) {
					if (result) {
						getPage(CURR_PAGE);
					} else {
						alert("删除失败!");
					}
				}
			});
		}
	});

	//checkbox 表单表头的选择框
	$("#check_all_page").click(function () {
		//$(obj).prop("checked")：获取checked属性
		//$(".check_item").prop("checked", true)：设置checked属性
		//根据 check_all_page 的是否被选中,来设置表单中的check_item的选中状态（$(this).prop("checked")返回true/false）
		$(".check_item").prop("checked", $(this).prop("checked"));
	});

	//设置check_item的点击事件, 来给check_all_page赋值
	$(document).on("click",".check_item", function () {
		//如果表格中的checkbox都被选中了, 那么表头的checkbox也被选中
		var flag = $(".check_item:checked").length == $(".check_item").length;
		//如果flag为true，那么#check_all_page就是选中状态
		//如果flag为false，那么#check_all_page就是未选中状态
		$("#check_all_page").prop("checked",flag);
	});

	//大删除按钮 删除被选中的人员
	$("#emp_delete_selected_btn").click(function () {
		//判断class为check_item的选择框被选择的个数
		if ($(".check_item:checked").length < 1) {
			alert("请先选择要删除的人员");
			return false;
		}

		//循环遍历每个被选择的checkBox的值
		var select_name = "", select_id = "";
		$.each($(".check_item:checked"),function () {
			//$(this).parents("tr")：用于获取被选中的checkBox的父元素（也就是所在行）
			//find("td:eq(2)")：找到所在tr(行)的第二td(列)
			//text()：获取所在行列交集单元格的数据
			//所以下面这行代码就是取员工的姓名，姓名用逗号隔开
			select_name += $(this).parents("tr").find("td:eq(2)").text() + " , ";
			//所以下面这行代码就是取员工的ID，id用逗号隔开
			select_id += $(this).parents("tr").find("td:eq(1)").text() + "-";
		});
		if (select_name.length > 3)
			select_name = select_name.substring(0, select_name.length - 3);
		if (select_id.length > 1)
			select_id = select_id.substring(0, select_id.length - 1);
		/* 路径/emp/{"1-3-4-5"} : DELETE 删除员工id为 1 3 4 5 的员工
        *  返回 true 或 false
        * */
		if (confirm("确定要删除" + select_name + "吗?")) {
			//执行删除操作
			$.ajax({
				url : APP_PATH + "/emp/" + select_id,
				type : "DELETE",
				success : function (result) {
					if (result)
						alert("删除成功");
					else
						alert("删除中出现了一些错误");
					getPage(CURR_PAGE);
				}
			})
		}
	})

}