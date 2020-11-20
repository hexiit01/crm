module.exports = {
	//=>WEB服务端口号
	PORT: 9999 ,

	//=>CROS跨域相关信息
	CROS: {
		ALLOW_ORIGIN: 'http://127.0.0.1:5500',
		ALLOW_METHODS: 'PUT,POST,GET,DELETE,OPTIONS,HEAD',
		HEADERS: 'Content-Type,Content-Length,Authorization, Accept,X-Requested-With',
		CREDENTIALS: true  //在跨域模式下 是否允许携带资源凭证
	},

	//=>SESSION存储相关信息
	SESSION: {
		secret: 'ZFPX', //加密的密钥
		saveUninitialized: false,
		resave: false,
		cookie: {
			maxAge: 1000 * 60 * 60 * 24 * 30//session过期时间 30天
		}
	}
};