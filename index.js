let displayedLessons=lessons
let cart={}
let checkoutAvailable=false
const checkoutButton=document.getElementById("checkoutButton")
checkoutButton.style.visibility="hidden"
checkoutButton.onclick=()=>{
    alert("DA")
}
var lessonList = new Vue({
    el: '#lesson-list',
    data: {
        lessons: displayedLessons
    },
    methods:{
        addToCart: function myMethod(lesson) {
            if(lesson.space===0){
                return
            }
            let reservedQuantity=cart[lesson.subject]
            if(typeof reservedQuantity==="undefined"){
                reservedQuantity=0
            }
            cart[lesson.subject]=reservedQuantity+1
            lesson.space=lesson.space-1
            if(checkoutAvailable===false){
                checkoutAvailable=true
                //show the checkout button
                checkoutButton.style.visibility="visible"
            }
        }
    }
})