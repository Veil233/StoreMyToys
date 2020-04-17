/**
 * 未完成计划项组件
 */
var todoItem= {
       props:['list'],

        template:
            `<div class="todoList">
                <button class="delete" v-on:click="deleteList"><img src="icons/delete.png"></button>
                <h3>{{ list.tittle }}</h3>
                <p>{{ list.content }}</p>
                <small>截止日期：{{ list.deadline }}</small>
                <div class="option">
                    <button class="editButton" v-on:click="editList"><img src="icons/edit.png"> 编辑</button>
                    <button class="finishButton" v-on:click="finishTodo"><img src="icons/finish.png"> 完成</button>
                </div>
            </div>`,



        methods: {
            editList() {
                /*！！！！*/
                var tittle=this.list.tittle
                var content=this.list.content
                var index=this.list.id-1
                this.$emit('edit-list' , tittle , content ,index )
            },

            finishTodo(){
                console.log(this.list.id-1)
                this.$emit('finish-todo' , this.list.id-1)
            },

            deleteList() {
                var index=this.list.id-1
                this.$emit('delete-list' , index)
            }
        }
};

/**
 * 已完成计划项组件
 */
var finishedTodo={
    props:['finished' , 'finishedTime'],

    template: `
        <div class="finishedList">
              <button class="delete" v-on:click="deleteFinished"><img src="icons/delete.png"></button>
              <h3>{{ finished.tittle }}</h3>
              <p>{{ finished.content }}</p>
              <small>完成时间：{{ finished.finishedTime }}</small>
         </div>`,

    methods:{
        deleteFinished(){
            var index=this.finished.id-1
            this.$emit('delete-finished' , index)
        }
    }
}


/**
 *计划撰写组件
 */
var createTodo={
    props: ['todo' , 'edited'],

    template:
        ` <div id="createTodo">
                <h3>美好的一天，从认真计划开始</h3>
                <input type="text" id="inputTittle" v-model="todo.tittle" placeholder="这里是计划的标题" />
                <textarea id="inputContent" v-model="todo.content" placeholder="这里是计划的内容"></textarea>
               
               <p>截止时间</p>
               <div id="deadlineDate">
                    <img src="icons/date.png">
                    <input type="date" id="date" v-model="todo.date"> 
                </div>
                <div id="deadlineTime">
                    <img src="icons/time.png">
                    <input type="time" id="time" v-model="todo.time"> 
                 </div>
                 
                 <p>快捷设置</p>
                 <div id="fastDate">
                    <button v-on:click="fastSetDate">今天</button>
                    <button v-on:click="fastSetDate">明天</button>
                    <button v-on:click="fastSetDate">后天</button>
                 </div>
                 
                 <div id="fastTime">
                    <button v-on:click="fastSetTime">1小时后</button>
                    <button v-on:click="fastSetTime">3小时后</button>
                    <button v-on:click="fastSetTime">5小时后</button>
                 </div>
                 
                <button id="addButton" v-on:click="addTodo" v-show="!edited"><img src="icons/add.png">添加计划</button>
                <button id="editButton" v-on:click="submitEdit" v-show="edited"><img src="icons/submit.png"> 修改</button>
            </div>`,


    methods:{
        addTodo(){
            /*！！！！*/
            var tittle=this.todo.tittle
            var content=this.todo.content
            var deadline=this.todo.date+""+this.todo.time
            this.$emit('new-list' , tittle , content , deadline)
        },

        submitEdit(){
            this.$emit('submit-edit')
        },

        fastSetDate(event){
            /*toLocaleDateString : YYYY/M/D
            *toDateString Fri April 12
            * */
            var date=new Date().toLocaleDateString()
            /*这种方法处理边界时间会导致额外的麻烦
            var year=date.getFullYear()
            //判断当前月份和日期是一位还是两位，是一位前边加零，否则不加
            //月份和日期从零算起，所以加一
            //getDate()返回的是今天的日期，getDay()返回的是星期
            var month=date.getMonth().toString().length=1 ? "0"+(date.getMonth()+1) : date.getMonth()+1
            var day=date.getDate().toString().length=1 ? "0"+(date.getDate()+1) : date.getDate()+1
            var today=`${year}-${month}-${day}`
            */
            switch (event.target.innerHTML) {
                case "今天" :{
                    this.todo.date=formatDateString(date , 0)
                }break
                case "明天" :{
                    this.todo.date=formatDateString(date , 1)
                }break
                case "后天" :{
                    this.todo.date=formatDateString(date , 2)
                }break

            }
        },

        fastSetTime(event ){
            /*toTimeString ： HH:mm:ss 时区 有前导零
            *toLocalTimeString : 上午/下午 H:mm:ss  无前导零
            */
            var time=new Date().toTimeString()
            var hour=time.slice(0,2)
            var minute=time.slice(3,5)

            switch (event.target.innerHTML) {
                case "1小时后" : {
                    this.todo.time=`${formatHour(hour , 1)}:${minute}`
                }break
                case "3小时后" : {
                    this.todo.time=`${formatHour(hour , 3)}:${minute}`
                }break
                case "5小时后" : {
                    this.todo.time=`${formatHour(hour , 5)}:${minute}`
                }break
            }
        },
    }
};

/*格式化日期*/
function formatDateString( dateString , addition ) {
    /*由于年份是四位数，所以年份可以使用slice（0,4）获取， （而非slice（0,3）因为取不到右边界）
    * 由于toLocalDateString（）方法获取到的月份和日期没有前导零，因此无法按固定位数获取
    * 所以月份从第五位（年份后的“/" 位置截取到倒数一个"/" （也就是第二个，使用lastIndexOf（）)字符
    * 日期从倒数第一个"/"的下一位截取到末尾
    **/
    var newDateString=""
    var secondSlah=dateString.lastIndexOf("/")
    /*思路是获取两个"/"之间的字符为月份，因为年份位数固定，所以只需要获取最后一个"/"的位置*/
    var year=dateString.slice(0,4)
    var month=dateString.slice(5,secondSlah)
    var day=parseInt(dateString.slice(secondSlah+1))+addition
    month=month.length==1 ?  "0"+month : month
    day=day.length==1 ? "0"+day : day
    /*判断月份和日期是几位数，是1位则添加前导零，因为input只接受YYYY-MM-DD格式*/
    console.log(`formatting date string\n getting year=${year},\n month=${month},\n day=${day}`)
    newDateString=`${year}-${month}-${day}`
    console.log("formatted date string is :"+newDateString)
    return newDateString
}

/*格式化时间*/
function formatHour( hour , addition ) {
    var newHour=parseInt(hour)+addition
    if (newHour>=24) newHour-=24
    newHour=newHour.toString()
    newHour=newHour.length==1? "0"+newHour : newHour
    return newHour
}

/**
 * 实例
 */
var vm=new Vue({
    el:'#root',
    
    components:{
        'todo-item' : todoItem,
        'create-todo' : createTodo,
        'finished-todo' : finishedTodo
    },

    data:{
        currentTab:'list',
        listFontSize:'20',
        finishFontSize:'16',

        //todoItem
        nextId:1,
        editedIndex:'',
        lists:[],
        key:1,

        //createTodo
        todo:{
            tittle:'' , content:'', time:'', date:''
        },
        edited:false,

        //finishedTodo
        finishedList:[],
        fIndex:1
    },


    methods: {
        changeTab() {
            if (this.currentTab == 'list') {
                this.currentTab = 'finish'
                this.listFontSize='16'
                this.finishFontSize='20'
            }
            else {
                this.currentTab = 'list'
                this.listFontSize='20'
                this.finishFontSize='16'
            }
        },
        newList( tittle , content , deadline){
            deadline=deadline || "未设置"
            var key="uf"+(this.key++)
            var value={ id:this.nextId++ , tittle:tittle , content:content , deadline:deadline}
            this.lists.push(value)
            this.todo.tittle=''
            this.todo.content=''
            store.save(key , value)
        },

        editList( tittle , content  , index ){
            this.todo.tittle=tittle
            this.todo.content=content
            this.editedIndex=index
            this.edited=true
        },

        submitEdit(){
            var key="uf"+(this.editedIndex+1)//需要加括号否则是字符串相加成uf01
            var value={id:this.editedIndex+1 , tittle:this.todo.tittle , content:this.todo.content , deadline: this.todo.date+this.todo.time}
            this.lists.splice(this.editedIndex , 1 , value )
            store.delete( "this" , key )
            store.save( key , value)
            this.edited=false
        },

        deleteList(index){
            var key="uf"+(index+1)
            this.lists.splice(index , 1)
            store.delete( "this" , key )
        },

        deleteAll(){
            this.lists=[]
            this.finishedList=[]
            this.nextId=1
            store.delete("all")
        },

        finishTodo(index){
            var ufKey="uf"+(index+1)//未完成的key,
            var fKey="f"+(this.fIndex++)//已完成的key
            var value=JSON.parse(JSON.stringify(this.lists[index]))
            var unfinished=this.lists[index]
            var finishedTime=new Date().toLocaleTimeString()
            this.finishedList.push({ id:unfinished.id , tittle:unfinished.tittle , content:unfinished.content , finishedTime:finishedTime})
            this.lists.splice(index , 1)
            store.save( fKey , value )//存已完成
            store.delete("this" , ufKey)//删除未完成
        },

        deleteFinished(index) {
            var key="f"+(index+1)
            this.finishedList.splice( index , 1 )
            store.delete("this" , key )
        }
    }
})

/**
 * localstorage存、取、删除
 */
var store={
    save(key , value){
        try{
            localStorage.setItem( key , JSON.stringify(value) )
            console.log("save data key : "+key+" value : "+JSON.stringify(value) +" successfully")
        }
        catch (e) {
            console.log("error:"+e)
        }
    },

    fetch(){
        var length=localStorage.length
        console.log("data length : "+length)
        var unfinishedList=[]
        var finishedList=[]
        var pattern=/^f/g
        for (let i=0 ; i<length ; i++){
            var key=localStorage.key(i)
            var value=  JSON.parse(localStorage.getItem(key) )
            if(pattern.test(key)){
                console.log("read finished todo in localstorage  : " + value)
                finishedList[i]=value
            }
            else {
                console.log("read unfinished todo in localstorage  : " + value)
                unfinishedList[i]=value
            }
        }
        vm.lists=unfinishedList
        vm.finishedList=finishedList
        console.log("read successfully , now finished : "+vm.finishedList+" unfinished : "+vm.lists)
    },

    delete(option , key){
        switch (option) {
            case "this" : {
                console.log("deleting value which key is : " + key  + " value is : " + localStorage.getItem(key))
                localStorage.removeItem(key)
            }break

            case "all" : {
                window.localStorage.clear()
                console.log("clear all")
            }break
        }
    }
}

window.onload=function() {
    store.fetch()
}

