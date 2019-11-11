<template>
	<div id="app">
		<div class="header" v-if="!login">
			<nav class="navbar">
				<div class="navbar-left">
					<a href="javascript:void(0)">
						<div class="navbar-left-content">
							<img src="@/assets/company-logo.png" alt="">
							<span>陆单商务管理后台</span>
						</div>
						
					</a>
					<div class="btn-link" @click="showBtn">
						<i class="iconfont icon-MORE"></i>
					</div>
				</div>
				<div class="navbar-right">
					<div class="inform">
						<i class="iconfont icon-laba" @click="conMute" v-if="mute"></i>
						<i class="iconfont icon-jingyin" @click='conMute' v-else></i>
					</div>
					<div class="inform">
						<i class="iconfont icon-lingdang"></i>
						<span>0</span>
					</div>
					<div class="inform">
						<i class="iconfont icon-xinfengdakai"></i>
						<span>0</span>
					</div>
					<div class="avatar" @click="popup = !popup">
						<img src="@/assets/avatar-1.png" alt="">
						<i class="iconfont icon-fa-caret-down"></i>
					</div>
					<div @click="quit" v-show="popup" class="quit">
						<i class="iconfont icon-lock"></i>退出
					</div>
				</div>
			</nav>
		</div>
		<div class="sidebar" @click="popup = false" ref='sidebar' v-if="!login">
			<ul class="menu">
				<li class="item car-online">
					<router-link to="/"><i class="iconfont icon-ditu"></i>上线车辆</router-link>
				</li>
				<li class="item orderlist more" ref='orderlist' @click="start">
					<a href="javascript:void(0)" @click="func('orderlist')">
						<i class="iconfont icon-icondd1"></i>
						订单列表
						<el-badge :value="orderValue" :max='99' :hidden="orderValue===0"></el-badge>
						<i :class="[rotate?'iconfont icon-left go':'iconfont icon-left back']"></i> 
						<!-- <i class="iconfont icon-left"></i> -->
						<!-- <i class="iconfont icon-fa-caret-down" v-else></i> -->
					</a>
					<div class="smenu">
						<router-link to='/orderlist/unfinished'>
							<i class="iconfont icon-order"></i>未派车列表
							<el-badge :value="orderValue" :max="99" :hidden="orderValue===0"></el-badge>
						</router-link>
						<router-link to="/orderlist/dispatchedOrder">
							<i class="iconfont icon-hasdo"></i>已派出车辆
							<el-badge></el-badge>
						</router-link>
					</div>
				</li>
				<li class="item more" ref='carSourceManger' @click="start1">
					<a href="javascript:void(0)" @click="func('carSourceManger')">
						<i class="iconfont icon-qiche"></i>车源管理
						<i :class="[rotate1?'iconfont icon-left go':'iconfont icon-left back']"></i> 
						<!-- <i class="iconfont icon-left"></i> -->
						<!-- <i class="iconfont icon-fa-caret-down" v-else></i> -->
					</a>
					<div class="smenu">
						<router-link to="/carSourceManger/addcar"><i class="iconfont icon-add"></i>新增车源</router-link>
						<router-link to="/carSourceManger/motorcade"><i class="iconfont icon-chexing"></i>车型车队</router-link>
						<router-link to="/carSourceManger/carreview"><i class="iconfont icon-shenhe"></i>车辆审核</router-link>
						<router-link to="/carSourceManger/carlist"><i class="iconfont icon-liebiao"></i>车辆列表</router-link>
					</div>
				</li>
				<li class="item more" ref='billingManger' @click="start2">
					<a href="javascript:void(0)" @click="func('billingManger')">
						<i class="iconfont icon-bill"></i>计费管理
						<i :class="[rotate2?'iconfont icon-left go':'iconfont icon-left back']"></i> 
						<!-- <i class="iconfont icon-left"></i> -->
					</a>
					<div class="smenu">
						<router-link to="/billingManger/accountlist"><i class="iconfont icon-bill-line"></i>计费列表</router-link>
						<router-link to="/billingManger/addaccount"><i class="iconfont icon-add"></i>新增计费</router-link>
					</div>
				</li>
				<li class="item more" ref='statisticManger' @click="start3">
					<a href="javascript:void(0)" @click="func('statisticManger')">
						<i class="iconfont icon-tongji"></i>统计管理
						<i :class="[rotate3?'iconfont icon-left go':'iconfont icon-left back']"></i> 
						<el-badge :value="withdrawValue" :max='99' :hidden="withdrawValue===0"></el-badge>
						<!-- <i class="iconfont icon-left"></i> -->
					</a>
					<div class="smenu">
						<router-link to="/statisticManger/statistical"><i class="iconfont icon-tongji1"></i>车辆成本</router-link>
						<router-link to="/statisticManger/withdraw"><i class="iconfont icon-tixian"></i>车辆提现
						<el-badge :value="withdrawValue" :max='99' :hidden="withdrawValue===0"></el-badge></router-link>
						<router-link to="/statisticManger/fund"><i class="iconfont icon-tixian"></i>订单汇总</router-link>
						<router-link to="/statisticManger/record"><i class="iconfont icon-jilu"></i>佣金记录</router-link>
						<router-link to="/statisticManger/commwith"><i class="iconfont icon-yongjintixian"></i>佣金提现</router-link>
					</div>
				</li>
				<li class="item">
					<router-link to="/users"><i class="iconfont icon-user"></i>用户管理</router-link>
				</li>
				<li class="item">
					<router-link to="/meeting"><i class="iconfont icon-huiyi"></i>会议管理</router-link>
				</li>
				<li class="item">
					<router-link to="/check"><i class="iconfont icon-huiyi"></i>认证审核</router-link>
				</li>
				<li class="item">
					<router-link to="/fenxiao-order"><i class="iconfont icon-fenxiao"></i>分销订单</router-link>
				</li>
				<li class="item">
					<router-link to="/invoice"><i class="iconfont icon-fenxiao"></i>开票管理</router-link>
				</li>
				<li class="item">
					<router-link to="/feedback"><i class="iconfont icon-fenxiao"></i>用户反馈</router-link>
				</li>
				<li class="item">
					<router-link to="/admin-user"><i class="iconfont icon-quanxian"></i>权限管理</router-link>
				</li>
				<li class="item">
					<a href="javascript:void(0)" style="cursor: default;">&nbsp;</a>
				</li>
			</ul>
		</div>
		<div class="content" @click="popup = false" ref='content' v-if="!login">
			<router-view v-if='isRouterAlive'></router-view>
		</div>
		<Login v-if="login"></Login>
		<audio controls="controls" ref='audio' id="audio" v-if="!login" hidden>
			<source src="@/audio/dingdong.mp3" type="audio/mpeg" >
		</audio>
	</div>
</template>

<script>
import Login from '@/views/Login.vue';
export default {
  name: 'app',
  provide(){
	  return{
		  reload: this.reload
	  }
  },
  components: {
  	Login
  },
  data() {
  	return {
  		orderValue: 0,
		withdrawValue:0,
		show:'',
		isRouterAlive: true,
		popup: false,
		show1: false,
		login: true,
		mute: false,
		rotate:false, //导航箭头旋转
		rotate1:false,
		rotate2:false, 
		rotate3:false 

  	}
  },
  methods:{
		conMute(){
			if(this.mute){
				this.$refs.audio.muted = true
			}else{
				this.$refs.audio.muted = false
			}
			this.mute = !this.mute
			sessionStorage.setItem('mute',true)
		},
	  reload(){
		  this.isRouterAlive = false
		  this.$nextTick(()=>{
			  this.isRouterAlive = true
		  })
	  },
	  func(name){
		  if(this.$refs[name].children[1].style.maxHeight !== '' && this.$refs[name].children[1].style.maxHeight !== '0em'){
			  this.$refs[name].children[1].style.maxHeight = '0em'
			  
		  }else{
			  this.$refs[name].children[1].style.maxHeight = '18.75em'
		  }
	  },
	  quit(){
		  sessionStorage.removeItem('ludan')
			sessionStorage.removeItem('mute')
		  this.login = true
		  this.$axios.post(`${this.$ludan.serverUrl}/distribution/user/logout`)
		  .then(res=>{
			  console.log(res)
			  this.$message({
				  message: '退出成功！',
				  type: 'success'
			  })
			  setTimeout(()=>{
				  window.location = '/ludan'
			  },50)
		  })
		  .catch(err=>{
			  console.log(err)
			  this.$message({
				  message: '退出成功！',
				  type: 'success'
			  })
			  setTimeout(()=>{
				  // this.$router.push('http://go2hell.xin/ludan/index.html')
				  window.location = '/ludan'
			  },50)
		  })
		  this.login = true
	  },
	  showBtn(){
		  this.show1 = !this.show1
		  // console.log(this.$refs)
		  if(this.show1){
			  this.$refs.sidebar.style.zIndex = -1
			  this.$refs.content.style.marginLeft = 0
		  }else{
			  this.$refs.sidebar.style.zIndex = 0
			  this.$refs.content.style.marginLeft = '240px'
		  }
	  },
		play(){
			this.$refs.audio.currentTime = 0
			this.$refs.audio.play()
		},
		 	//导航箭头旋转
		start(){
			this.rotate=!this.rotate;
		},
		start1(){
			this.rotate1=!this.rotate1;
		},
		start2(){
			this.rotate2=!this.rotate2;
		},
		start3(){
			this.rotate3=!this.rotate3;
		},
  },
	watch: {
		orderValue(newValue, oldValue) {
			if(oldValue === 0){
				return false
			}
			if(oldValue < newValue){
				this.play()
			}
		},
		withdrawValue(newValue, oldValue){
			if(oldValue === 0){
				return false
			}
			if(oldValue < newValue){
				this.play()
			}
		},
	},
  mounted() {
	let length1 = window.location.hash.split('/')
	if(length1.length > 2) {
		// console.log(length1)
		this.$refs[length1[1]].children[1].style.maxHeight = '18.75em'
	}
  	this.$axios.get(`${this.$ludan.httpUrl}/get-differ-acount`)
	.then(res=>{
		console.log(res.data)
		this.orderValue=res.data.result.order_acount
		this.withdrawValue=res.data.result.withdraw_acount
		localStorage.setItem('order_acount',res.data.result.order_acount)
		localStorage.setItem('withdraw_acount',res.data.result.withdraw_acount)
	})
	setInterval(()=>{
		this.$axios.get(`${this.$ludan.httpUrl}/get-differ-acount`)
		.then(res=>{
			// console.log(res.data)
			this.orderValue=res.data.result.order_acount
			this.withdrawValue=res.data.result.withdraw_acount
			localStorage.setItem('order_acount',res.data.result.order_acount)
			localStorage.setItem('withdraw_acount',res.data.result.withdraw_acount)
		})
	},30000)
		if(sessionStorage['mute']){
			this.mute = true
		}
  },
  created() {
	  if(sessionStorage['ludan']){
		  this.login = false
	  }
  	this.orderValue = parseInt(localStorage.getItem('order_acount'))
	this.withdrawValue = parseInt(localStorage.getItem('withdraw_acount'))
	
	setInterval(() => {
          this.orderValue = parseInt(localStorage.getItem('order_acount'));
          this.withdrawValue = parseInt(localStorage.getItem('withdraw_acount'));
        }, 30001)
  }
}
</script>

<style lang="scss">
	// #audio{
	// 	position: absolute;
	// 	left: 50%;
	// 	top: 50%;
	// 	z-index: 3000;
	// 	display: none;
	// }
@media screen and (max-width: 991.98px){
	.content{
		margin-left: 0 !important;
		min-width: 605px;
	}
	.sidebar{
		z-index: -1;
	}
	.btn-link{
		display: none;
	}
	.inform{
		display: none;
	}
}
@media screen and (max-width: 605px){
	.header{
		.navbar-left-content{
			justify-content: flex-start;
			>span{
				display: none;
			}
		}
	}
}
#app {
	width: 100%;
	position: relative;
	height: 100%;
}
.router-link-exact-active{
	color: #1a2a3a;
}
.header{
	width: 100%;
	height: 60px;
	padding: 0.5rem 1rem;
	background: white;
	box-shadow: 0 2px 4px 0 rgba(0,0,0, 0.1);
	position: fixed;
	top: 0;
	z-index: 100;
}
.sidebar{
	margin-top: 60px;
	position: fixed;
	height: 100vh;
	background: #3785db;
	overflow-y: auto;
	overflow-x: hidden;
	color: white;
	&::-webkit-scrollbar {
		display: none;
	}
}
.menu{
	width: 240px;
	overflow: hidden;
}
.item{
	border-top: 1px solid #3785DB;
	line-height: 1.5;
	text-align: left;
	position: relative;
	overflow: hidden;
	>a:hover{
		color: #1a2a3a;
	}
	>a{
		display: block;
		padding: 15.5px 20px;
		transition: all 0.3s;
	}
	i{
		margin-right: 10px;
	}
	.icon-left{
		position: absolute;
		right: 20px;
		top: 1.3125rem;
		margin: 0;
		font-size: 0.8rem;
	}
	.icon-fa-caret-down{
		position: absolute;
		right: 20px;
		top: 1.3125rem;
		margin: 0;
		font-size: 0.8rem;
	}
}
.more{
	>a{
		position: relative;
	}
	>a::before{
		content: '';
		width: 14px;
		height: 14px;
		transform: rotate(45deg);
		background: #3785DB;
		position: absolute;
		left: 20px;
		bottom: -7px;
	}
}
.content{
	position: absolute;
	top: 0;
	bottom: 0;
	left: 0;
	right: 0;
	overflow-y: auto;
	overflow-x: hidden;
	transition: all 0.3s;
	margin: {
		top: 60px;
		left: 240px;
	}
	border: 1px solid #ccc;
	padding: 32px;
	background: #f8f8f8;
}
.smenu{
	background: #0c69d1;
	transition:all 0.3s ease;
	max-height: 0em;
	overflow: hidden;
	i{
		margin-right: 10px;
	}
	>a{
		display: block;
		padding: 12px 27px;
		margin: 4px 0;
		position: relative;
		font-size: 12px;
		&:hover::before{
			opacity: 1;
		}
		&::before{
			content: '';
			display: block;
			background: #333;
			height: 100%;
			width: 5px;
			position: absolute;
			left: 0;
			top: 0;
			opacity: 0;
			transition: all 0.3s ease;
		}
	}
}
.navbar{
	display: flex;
	justify-content: space-between;
	height: 100%;
}
.navbar-left{
	// width: 240px;
	height: 100%;
	display: flex;
	align-items: flex-end;
	>a{
		display: inline-block;
		height: 100%;
		width: calc(240px - 1rem);
		// text-align: center;
		// vertical-align: middle;
		.navbar-left-content{
			display: flex;
			justify-content: center;
			align-items: flex-end;
			width: 100%;
			height: 100%;
			font-size: 1rem;
			>img{
			height: 100%;
			margin-right: 5px;
		}
		}
	}
	>.btn-link{
		color: #777;
		padding: 0.375rem 0.75rem;
		cursor: pointer;
	}
}
.navbar-right{
	display: flex;
	align-items: center;
	height: 100%;
	position: relative;
	>.inform{
		min-width: 50px;
		position: relative;
		>i{
			font-weight: 900;
			color: #777;
			cursor: pointer;
		}
		>span{
			cursor: pointer;
			position: absolute;
			top: 50%;
			margin-top: -16px;
			border-radius: 50%;
			color: #fff;
			background: #ef5350;
			padding: {
				left: 0.5em;
				right: 0.5em;
			}
			font-weight: 500;
			font-size: 75%;
		}
	}
	>.avatar{
		height: 100%;
		display: flex;
		align-items: center;
		cursor: pointer;
		>img{
			height: 36px;
			border-radius: 50%;
		}
		>i{
			margin-left: 0.5rem;
			font-size: 80%;
		}
	}
}
.back{
	transform:rotate(0deg);
    transition: all 0.5s;
}
.go{
	transform:rotate(-90deg);
	transition: all 0.5s;
}
.quit{
	position: absolute;
	cursor: pointer;
	right: 0;
	bottom: -55px;
	padding: 0.6rem 1rem;
	width: 190px;
	border-bottom: 1px solid #dee2e6;
	color: #4d4d4d;
	background: #fff;
	>i{
		color: #ced4da;
		margin-right: 10px;
		width: 20px;
		font-weight: 900;
		vertical-align: middle;
	}
	&:hover{
		background: rgb(247,248,249);
	}
}
</style>
