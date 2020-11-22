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
            console.log('resulttt==',result)
            let{code,codeText,data} = result;
            console.log("parseFloat(code)===",parseFloat(code),parseFloat(code)===0,data)
            if(parseFloat(code) === 0){
                return Promise.resolve(data);
            }
            return Promise.reject();
        }).then(data =>{
            //数据渲染
            let str = ``;
            data.forEach(item=>{
                //data-id   data-name 自定义属性，方便之后 点击修改 和删除的操作获取id和name
                str+=`<tr data-id=${item.id} data-name=${item.name}>
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
                            <a href="useradd.html?userId=${item.id}">编辑</a>
                            <a href="javascript:;">删除</a>
                            ${power.includes('resetpassword')?
                               `<a href="javascript:;">重置密码</a>`:``}
                            
                        </td>`:``}
                    
                </tr>`
            })
            $tbody.html(str);

        }).catch((msg)=>{
            $tbody.html(msg);
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

    //基于事件委托处理员工的相关操作
    let handleDelegate = function(){
        $tbody.click(function (ev){
            let target = ev.target,
                tarTag = target.tagName,  //获得标签名 大写
                tarVal = target.innerText,  //获得标签中的内容
                $target = $(target); //转为jquery 对象
            //重置密码
            if(tarTag==='A' && tarVal ==='重置密码'){
                //从自定义属性中获取id
                let $grandpa =  $target.parent().parent(),
                   userId = $grandpa.attr('data-id'),
                   username= $grandpa.attr('data-name');
                alert(`确定要把${username}的密码重置么？`,{
                    title:'警告！警告！',
                    confirm:true,
                    handled:msg=>{
                        if(msg ==='CONFIRM'){
                            //用户点击的是确定
                        }
                    }
                })
                
                return;
            }

        })
    };


    return{
        init(){
            checkPower();
            selectBind().then(()=>{
                render();
            })
            handleFilter();
            handleDelegate();
        }
    }
})()

userListModel.init();