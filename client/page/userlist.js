let userListModel = (function(){
    let $selectBox = $('.selectBox'),
        $searchInp = $('.searchInp'),
        $tableBox = $('.tableBox'),
        $tbody = $tableBox.children('tbody'),
        // $thead = $tableBox.children('thead'),
        $theadTh = $tbody.find('th'),
        $deleteAll = $('.deleteAll');
    let power = localStorage.getItem('power')||'';//如果没有获取到power，则将power设置为''

    //权限校验
    let checkPower = function(){
        if(!power.includes('userhandle')){
            $deleteAll.remove();//把当前元素移除掉
            //吧$theadTh中的第一个和最后一个移除掉
            $theadTh.eq(0).remove();
            $theadTh.eq($theadTh.length-1).remove();

        }
    }


    //从服务器获取数据，实现数据绑定 获取用户列表
    let render = function(){
        let departmentId = $selectBox.val();
        let search = $searchInp.val().trim(); //搜索
        console.log(departmentId,search)
        axios.get('user/list',{
            params:{  //加中括号 是get请求，
                departmentId,  
                search
            }
        }).then(result=>{
            //数据处理
            console.log('result==',result)
            let{code,data} = result;
            if(parseFloat(code) === 0){
                return data;
            }
            return Promise.reject();
        }).then(data =>{
            //数据渲染
            let str = ``;
            data.forEach(item=>{
                str+=`<tr>
                   ${power.includes('userhandle')?
                    '<td class="w3"><input type="checkbox"></td>':''}
                    <td class="w10">${item.name}</td>
                    <td class="w5">${parseInt(item.sex)===0?'女':'男'}</td>
                    <td class="w10">${item.department}</td>
                    <td class="w10">${item.job}</td>
                    <td class="w15">${item.email}</td>
                    <td class="w15">${item.phone}</td>
                    <td class="w20">${item.desc}</td>
                    ${power.includes('userhandle')?`
                        <td class="w12">
                            <a href="javascript:;">编辑</a>
                            <a href="javascript:;">删除</a>
                            ${power.includes('resetpassword')?
                               `<a href="javascript:;">重置密码</a>`:``}
                            
                        </td>`:``}
                    
                </tr>`
            })
            $tbody.html(str);

        }).catch(()=>{
            $tbody.html('');
        });
 


    }
    //从服务器获取部门信息，把部门信息设置到下拉列表中
    let selectBind = function(){
       return  axios.get('/department/list').then(result=>{
            console.log('recode===',result)
            let str = ''
            if(parseInt(result.code)===0){
                str = `<option value="0">全部</option>`;
                result.data.forEach(item=>{
                    str+=`<option value="${item.id}">${item.name}</option>`
                })
            }
            $selectBox.html(str);
        })
    }
    //筛选数据的事件处理
    let handleFilter = function() {
        $selectBox.on('change',render);
        $searchInp.on('keydown',function(ev){
            if(ev.keyCode ===13){
                //按下的是Enter键
                render();
            }
        })
    }


    return{
        init(){
            checkPower();
            selectBind().then(()=>{
                render();
            })
            handleFilter();
        }
    }
})()

userListModel.init();