
/**
 *银行卡组件
 */
/*子组件 ： 卡正面*/
const front={
    props : ['card'],
    template :
        `<div id="cardFront" class="card"  :style="{transform : 'rotateY('+rotate+'turn)'}">
            <div id="bank"></div>
            <div id="numberOnCard" v-html="card.number"></div>
            <div id="holderOnCard" v-html="card.holder"></div>
            <div id="dateOnCard">
                <p>Valid Date</p>
                <p>MONTH/YEAR-MONTH/YEAR</p>
                <div id="applyDate" v-html="card.applyDate"></div>
                <div id="expiration" v-html="card.expiration"></div>
            </div>
            <div id="brand"><img :src="'src/'+card.brand+'.png'"></div>
        </div>`,
    data(){
        return{
            rotate : 0,
        }

    },
    mounted(){
        event.$on('toBack' , ()=>{this.rotate=0.5})
        event.$on('toFront' , ()=>{this.rotate=0})
    }
}
/*子组件 ： 卡背面*/
const back={
    props : ['card'],
    template :
        `<div id="cardBack" class="card" :style="{transform : 'rotateY('+rotate+'turn)'}">
            <div id="magneticStripe"></div>
            <div id="ccvStripe">
                <div id="ccvOnCard" v-html="card.ccv"></div> 
            </div>
        </div>`,
    data(){
        return{
            rotate :  0.5
        }
    },
    mounted(){
        event.$on('toBack' , ()=>{this.rotate=0})
        event.$on('toFront' , ()=>{this.rotate=0.5})
    }
}
/*父组件 ： 卡*/
const card={
    props  : ['card'],
    components : {
      'front' : front,
      'back' : back
    },
    template:
        `<div id="card">
            <front :card="card"></front>
            <back :card="card"></back>
         </div>`,
}

/**
 *表单组件
 */
/*子组件 ： 卡号*/
/*在组件上绑定v-model*/
const number={
    props : ['value'],
    template :
        `<div id="numberBox">
                <label for="cardNumber">Card Number</label>
                <input type="text" id="cardNumber"  maxlength="19"
                    :value="value" @input="onInput($event.target.value)">
         </div>`,
    methods : {
        onInput(value){
            var _value=value.replace(/\s*/g , "")
            if ( /[^0-9\s]/g.test(value))  value=value.replace(/[^0-9\s]/g , "")
            if ( _value.length>1 && _value.length%4==0 ){
                value=value+" "
            }
            this.$emit('input' , value)
            event.$emit('input' , value)
        }
    }
}
/*子组件 ： 持卡人*/
const holder={
    props : ['value'],
    template :
        `<div id="holderBox">
                <label for="cardHolder">Card Holder</label>
                <input type="text" id="cardHolder" maxlength="14" 
                        :value="value" @input="$emit('input' , $event.target.value)">
         </div>`,
}
/*子组件 ： 有效期*/
const expiration={
    props : ['months' , 'years'],
    template :
        `<div id="dateBox">
                <div class="dateBox">
                    <label for="expirationMonth">Month</label>
                    <select id="expirationMonth"  @change="updateMonth($event.target.value)">
                        <option v-for="(month , index) in months" :index="index" >{{ month }}</option>
                    </select>
                </div>
                <div class="dateBox">
                    <label for="expirationYear">Year</label>
                    <select  id="expirationYear" @change="updateYear($event.target.value)">
                        <option v-for="(year , index) in years" :index="index">{{ year }}</option>
                    </select>
                </div>
         </div>`,

    methods : {
        updateMonth(month){
            event.$emit('updateMonth' , month)
        },
        updateYear(year){
            event.$emit('updateYear' , year)
        }

    }
}
/*子组件 ： 安全码*/
const ccv={
    props : ['value'],
    template :
        `<div id="ccvBox">
                <label for="ccv">CCV</label>
                <input type="text" id="ccv" maxlength="3"
                    @focus="changeToBack" @blur="changeToFront"
                     :value="value" @input="$emit('input' , $event.target.value)">
         </div>`,
    methods : {
        changeToBack(){
            event.$emit('toBack')
        },
        changeToFront(){
            event.$emit('toFront')
        }
    }
}
/*父组件 ： 表单*/
const creditCardForm={
    props : ['card' , 'months' , 'years'],
    components : {
      'number' : number,
      'holder' : holder,
      'expiration' : expiration,
      'ccv' : ccv,
    },
    template :
        `<div id="form">
            <form action="" method="post" @submit.prevent="$emit('submit')">
                  <number v-model="card.number"></number>
                  <holder v-model="card.holder"></holder>
                  <expiration :months="months" :years="years"></expiration>
                  <ccv v-model="card.ccv"></ccv>
            <button type="submit" id="submit">Submit</button>
        </form>
    </div>`,
}
/**
 * event bus
 */
const event=new Vue({})
/**
 * 根实例
 */
var vm=new Vue({
    el : "#root",
    components : {
        'card' : card,
        'credit-card-form' : creditCardForm,
    },
    data : {
        card: {
            bank : '',
            brand : 'UnionPay',
            number: '',
            holder: '',
            applyDate : '',
            expiration: '',
            ccv: '',
        },
        months: ['01', '02', '03', '04', '05', '06', '07', '08', '09', '10', '11', '12'],
        thisMonth: '',
        thisYear: '',
    },
    computed : {
        years(){
            var years=[]
            var thisYear=new Date().getFullYear()
            for (let i=0 ; i<5 ; i++){
                years.push(thisYear++)
            }
            return years
        },

    },
    mounted() {
        event.$on('updateMonth', this.updateMonth)
        event.$on('updateYear' , this.updateYear)
        event.$on('input' , this.checkBankAndBrand)
    },
    methods : {
        updateMonth(month) {
            this.thisMonth=month
            this.card.expiration=`${month}/${this.thisYear}`
        },
        updateYear(year) {
            year=year.substr(2,2)
            this.thisYear=year
           this.card.expiration=`${this.thisMonth}/${year}`
        },
        checkBankAndBrand(value){
            value=value.replace(/\s/g , "")
            if (/^4/.test(value)) this.card.brand='VISA'
            if (/^5/.test(value)) this.card.brand='mastercard'
            if (/^6/.test(value)) this.card.brand='UnionPay'
        },
        submit(){
            var data=''
            var number=this.card.number.replace(/\s/g , "")
            for (let key in this.card){
                if (key == 'number')    data += `number=${number}&`
                else if (key == 'bank') continue
                else if (key == 'applyDate') data += `applyDate=${this.card.applyDate.slice(0,5)}&`
                else data += `${key}=${this.card[key]}&`
            }
            console.log(data)
            axios.post('http://localhost:8080', data , {
                headers : {
                    'Content-Type' : 'multipart/x-www-form-urlencoded'
                }
            }).then(function (res) {
                alert(res.data)
            }).catch(function (error) {
                alert("发生了错误 ： "+error)
            })
        }
    }
})
/*设置申请时间*/
var applyDate=function () {
    var now = new Date()
    var year = now.getFullYear().toString().substr(2, 2)
    var month = now.getMonth().toString()
    month = month.length == 1 ? `0${month}` : month
    return  `${month}/${year}-`
}
vm.card.applyDate=applyDate()



