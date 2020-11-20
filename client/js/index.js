//在所有的权限之前，我们可以先做权限校验
//权限校验，最好不是控制元素的显示隐藏，而是真正的控制元素有或者没有
$(function(){
    //获得权限标识//需要用decodeURIConent解密
    let power = localStorage.getItem('power');
    power = encodeURIComponent(power);
    if(!power){
        alert('当前操作无效请重新登录！',
        {
            handled:()=>{
                window.location.href = 'login.html';
            }
        });
    }
    console.log('power==',power)
    let str  = `	<div class="itemBox">
            <h3>
                <i class="iconfont icon-yuangong"></i>
                员工管理
            </h3>
            <nav class="item">
                <a href="page/userlist.html" target="_iframe">员工列表</a>
                ${power.includes('userhandle')?
                     `<a href="page/useradd.html" target="_iframe">新增员工</a>`:``}

            </nav>
        </div>
        <div class="itemBox">
            <h3>
                <i class="iconfont icon-guanliyuan"></i>
                部门管理
            </h3>
            <nav class="item">
                <a href="page/departmentlist.html" target="_iframe">部门列表</a>
               ${power.includes('departhandle')?`<a href="page/departmentadd.html" target="_iframe">新增部门</a>`:``} 
            </nav>
        </div>
        <div class="itemBox">
            ${power.includes('jobhandle')?`
                <h3>
                    <i class="iconfont icon-zhiwuguanli"></i>
                    职务管理
                </h3>
                <nav class="item">
                    <a href="page/joblist.html" target="_iframe">职务列表</a>
                    <a href="page/jobadd.html" target="_iframe">新增职务</a>
                </nav>
            `:``}
        </div>
        <div class="itemBox">
            <h3>
                <i class="iconfont icon-kehuguanli"></i>
                客户管理
            </h3>
            <nav class="item">
            
                <a href="page/customerlist.html" target="_iframe">我的客户</a>
                ${power.includes('departcustomer')||power.includes('allcustomer')?`
                <a href="page/customerlist.html" target="_iframe">全部客户</a>`:``}
                
                <a href="page/customeradd.html" target="_iframe">新增客户</a>
            </nav>
        </div>`;
        $('.menuBox').html(str);
});


//首页的正常业务处理
$(function(){ 
    let $header = $('headerBox');
     let   $baseBox = $('.baseBox');
      let  $spanName = $baseBox.children('span');
        $signoutBtn = $baseBox.children('a'),
        $footer = $('footerBox'),
        $container = $('container'),
        $menuBox = $('.menuBox'),
        $itemBox = $menuBox.find('.itemBox'),
        $navList = $('.navBox a'),
        $iframeBox = $('.iframeBox');
   
    //动态计算出container区域的高度
    function computed(){
        $spanName.val(44)
        let winH = $(window).height();
        $container.css('height',winH-$header.outerHeight()-$footer.outerHeight()); 
        
    }  
    computed();
    $(window).on('resize',computed);//当窗口大小改变，重新计算高度

    //每次进入首页都需要验证用户是否登录（登录态校验）
    axios.get('user/login').then(result => {
        console.log('result.cod===',result)
        if (parseFloat(result.code) === 0) {
            //已经登录过，我们需要获取登录用户的基本信息
            return axios.get('user/info');//请求成功走下面的then
        }
        //请求失败，
        alert('您还没有登录，请先登录',{
            handled:function(){
               // window.location.href = 'login.html';
            }
        });
        //请求失败，执行reject，不走下面的then，而走catch，catch什么也不做可以不写
        return Promise.reject();
    }).then(result=>{
        //走到这里，已经从服务器获取到用户信息了
        console.log("result2= " ,result)

        if(result.code===0){
            let data = result.data;
            $spanName.html('您好，'+data.name)
        }
    });

    //安全退出
    $signoutBtn.click(function(){

        console.log("fff");

        axios.get('/user/signout').then(result=>{
            if(parseFloat(result.code)===0){
                //把本地存储的power信息清除
                localStorage.removeItem('power');
                window.location.href = 'login.html'
                return;
            }else{
                alert('退出失败')
            }
            
        })
    });

    //基于事件委托，实现折叠菜单
    $menuBox.click(function (ev){
        let target = ev.target,
            tarTag = target.tagName,//获取标签名  大写的
            $target = $(target);//把原生的元素对象转为jquery对象，之后可以基于jquery方法来操作
            //统一事件源，如果点的是i，则将$target指向父节点H3，找父节点H3的弟弟进行操作
            //如果事件源是H3则直接找H3的弟弟来操作
        tarTag === 'I' ?($target =$target.parent(),tarTag ='H3'):null;
        if(tarTag==='H3'){
            $target.next().stop().slideToggle(300);  // $target 的弟弟结束当前动画，进行下一个动画

        }

    })

    let $organize = $itemBox.filter(':lt(3)');//filter 在集合中二次筛选，:lt(3) 小于3  gt大于
    $customer = $itemBox.eq(3),  //eq是jquery的方法，get是原生的。
    initIndex = 0,
    HASH=window.location.href.queryURLParams()['HASH']||'organize';//utils中的queryURLParams方法
    HASH==="customer"?initIndex = 1:null;
    
    function change(index){
        $navList.eq(initIndex).addClass('active').siblings().removeClass('active');
        if(index ===0){
            $organize.css('display','block');
            $customer.css('display','none');
            $iframeBox.attr('src','page/userlist.html')
           
        }else{
            $organize.css('display','none');
            $customer.css('display','block');
            $iframeBox.attr('src','page/customerlist.html')
        }
        

    }
    change(initIndex);
    

    // $iframeBox
    //点击导航实现menu的切换
    $navList.click(function(){
        let $this = $(this),//当前点击的是哪个a
            index= $this.index();
            console.log(index)
        //获得组织结构 一组3个元素
       
        //当前点击的              siblings()其余的
        // $this.addClass('active').siblings().removeClass('active');
        change(index);
    })



  });