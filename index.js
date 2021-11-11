
var vue = new Vue({
    el: '#container',
    data: {
        lessons: lessons,
        cart:[],
        lessonListShown:true,
        cartShown:false,
        checkoutButtonShown:false,
    },
    methods: {
        addToCart: function f(lesson) {
            if (lesson.space === 0) {
                return
            }

            //where the lesson is found in the cart
            let lessonIndex = -1
            this.cart.forEach((cartLesson, i) => {
                if (cartLesson.subject === lesson.subject) {
                    lessonIndex = i
                }
            })
            //if item was not found
            if (lessonIndex === -1) {
                //add lesson to the cart
                this.cart.push({
                    subject:lesson.subject,
                    location:lesson.location,
                    price:lesson.price,
                    quantity:1,
                    imageURL:lesson.imageURL
                })
            } else {
                //if already found increase quantity
                this.cart[lessonIndex].quantity += 1
            }

            lesson.space = lesson.space - 1

            //show the checkout button
            this.checkoutButtonShown=true
        },
        displayCart:function f(){
            this.cartShown=true;
            this.lessonListShown=false;
        }
    }
})
