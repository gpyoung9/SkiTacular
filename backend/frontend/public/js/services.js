var AppServices=angular.module("AppServices",[]);AppServices.factory("CommonData",function(){var data="http://localhost:4000/api/",login_status=!1,search_result=[],user="",search_status=!1;return{getData:function(){return data},setData:function(newData){data=newData},signup:function(username,pword,zip){console.log(username),login_status=!0,user=username},login:function(username,pword,zip){login_status=!0,user=username},logout:function(){login_status=!1,user=""},get_login:function(){return login_status},get_search_status:function(){return search_status},set_search_status:function(){search_status=!0},set_search_data:function(data){search_result=data},get_search_data:function(){return search_result}}}),AppServices.factory("ResortService",["$http","CommonData",function($http,CommonData){return{get_service:function(select,callback){$http.get(CommonData.getData()+select).success(function(data){callback(data.data)}).error(function(data){callback(null)})},delete_service:function(delete_call,callback){$http["delete"](CommonData.getData+delete_call).success(function(data){callback(data.data)}).error(function(data){callback(null)})},post_service:function(post_call,data_send,callback){$http({method:"POST",url:CommonData.getData()+post_call,headers:{"Content-Type":"application/x-www-form-urlencoded"},data:$.param(data_send)}).success(function(response){callback(response)}).error(function(data){callback(data)})},put_service:function(put_call,callback){$http({method:"PUT",url:CommonData.getData()+put_call}).success(function(response,status){callback(response,status)}).error(function(data,status){callback(data,status)})}}}]),AppServices.factory("UserService",["$http","CommonData",function($http,CommonData){return{get_service:function(select,callback){$http.get(CommonData.getData()+select).success(function(data){callback(data.data)}).error(function(data){callback(null)})},delete_service:function(delete_call,callback){$http["delete"](CommonData.getData+delete_call).success(function(data){callback(data.data)}).error(function(data){callback(null)})},post_service:function(post_call,data_send,callback){$http({method:"POST",url:CommonData.getData()+post_call,headers:{"Content-Type":"application/x-www-form-urlencoded"},data:$.param(data_send)}).success(function(response){callback(response)}).error(function(data){callback(data)})},put_service:function(put_call,callback){$http({method:"PUT",url:CommonData.getData()+put_call}).success(function(response,status){callback(response,status)}).error(function(data,status){callback(data,status)})}}}]);