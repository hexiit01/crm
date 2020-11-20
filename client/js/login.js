$(function(){
    let $userName = $('.userName'),
        $userPass = $('.userPass'),
        $submit = $('.submit');
    $submit.click(function(){
        console.log('denglu')
        let userName = $userName.val().trim();
            userPass = $userPass.val().trim();
        //表单校验
        if(userName===''||userPass===''){
            alert('用户名者密码不能为空');
            return;
        }
        //密码需要MD5加密，32位字符串
        userPass = md5(userPass);

        //发送ajax请求
        axios.post('/user/login',{
            account:userName,
            password:userPass
        }).then(result=>{
            let{code,codeText,power} = result;
            // power 存储的权限信息

            console.log('result==',result)
            if(parseFloat(code)===0){
                //登录成功
                alert('登录成功',{
                    handled:function(){
                        //把用户 权限校验码 存储到本地
                        localStorage.setItem('power',encodeURIComponent(power));
                        //跳转到首页
                        window.location.href = 'index.html'

                    }
                })
                return;
            }else{
                alert('登录失败');
            }
            
        })
    })
})