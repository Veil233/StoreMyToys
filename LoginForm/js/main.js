
var Card=(function (){
    function Card() {
        this.loginCard=$("#loginCard")
        this.signUpCard=$("#signUpCard")
    }
    return Card
}) ();

Card.prototype.switch=function () {
    this.loginCard.css("transform","rotateY(0.5turn)")
    this.signUpCard.css("transform","rotateY(0)")
}

Card.prototype.back=function () {
    this.signUpCard.css("transform","rotateY(0.5turn)")
    this.loginCard.css("transform","rotateY(0)")
}
var card=new Card()

function goToSign() {
    card.switch()
    return false//防止a跳转到href
}
function backToLogin() {
    card.back()
}