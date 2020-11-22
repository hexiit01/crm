let visitModule=(function(){
    let customerId = null,
        $tableBox = $('.tableBox'),
        $tbody = $tableBox.find('tbody'),
        $visitTime = $('.visitTime'),
        $visitText = $('.visitText'),
        $submit = $('.submit');
    //让默认的拜访日期是明天
    let time = new Date(new Date().getTime()+24*60*60*1000).toLocaleString().split('')[0];
    time = time.formatTime('{0}-{1}-{2}')
    let bindVisitList=function(){
        return axios.get('/visit/list',{
            params:{
                customerId
            }
        }).then(result=>{
            if(parseInt(result.code!==0)) return Promise.reject();
            let str  ='';
            result.data.forEach(({
                id,visitText,visitTime
            })=>{
                str+=`<tr data-id='${id}'>
                    <th class="w5">${id}</th>
                    <th class="w15">${visitTime}</th>
                    <th class="w70">${visitText}</th>
                    <th class="w10">
                        <a href="javascript:;">删除</a>
                    </th>
                </tr>`;
            })
            $tbody.html(str);
        }).catch(()=>{
            $tbody.html('')
             
        })
    };

    //删除操作
    let deleteHandle=function(){
        $tbody.click(ev=>{
            let target = ev.target,
                $target = $(target);
            if(target.tagName ==='A' && target.innerHTML ==='删除'){
                let visitId = $target.parent().parent().attr('data-id');
                alert('您确定删除本条回访记录么',{
                    confirm:true,
                    handled:msg=>{
                        if(msg!=='CONFIRM') return;
                        axios.get('/visit/delete',{
                            params:{visitID}
                        }).then(reuslt=>{
                            if(parseInt(result.code)!==0) return Promise.reject();
                            bindVisitList();
                        }).catch(()=>{
                            alert('删除失败，请稍后重试')
                        })
                    }
                })
            }
        })
    }

    let submitHandle=function(){
        $submit.click(function(){
            axios.post('/visit/add',{
                customerId,
                visitText:$visitText.val().trim(),
                visitTime:$visitTime.val().trim()
            }).then(result=>{
                if(parseInt(result.code)!==0) return Promise.reject();
                bindVisitList();
                $visitText.val('');
            }).catch(()=>{
                alert('增加失败，请稍后重试')
            })
        })
    };
    return{
        init(){
            customerId = window.location.href.queryURLParams().customerId || 0;
            bindVisitList();
            deleteHandle();
            submitHandle();
        }
        
    }
})