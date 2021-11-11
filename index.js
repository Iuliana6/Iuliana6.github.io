var vue = new Vue({
    el: '#container',
    data: {
        lessons: lessons,
        cart: [],
        lessonListShown: true,
        cartShown: false,
        checkoutButtonShown: false,
        sortAscending: true,
        sortingCriteria:["Subject","Location","Price","Availability"],
        sortingOrder:["Ascending","Descending"],
        selectedCriteria:"Subject",
        selectedOrder:"Ascending"
    },
    computed: {
        sortedLessons() {
            let compare=(a, b)=> {
                //if ascending is false flip the order
                if (a.price > b.price) {
                    return this.sortAscending ? 1 : -1;
                }
                if (a.price < b.price) return this.sortAscending ? -1 : 1;
                return 0;
            }

            return this.lessons.sort(compare);
        }
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
                    subject: lesson.subject,
                    location: lesson.location,
                    price: lesson.price,
                    quantity: 1,
                    imageURL: lesson.imageURL
                })
            } else {
                //if already found increase quantity
                this.cart[lessonIndex].quantity += 1
            }

            lesson.space = lesson.space - 1

            //show the checkout button
            this.checkoutButtonShown = true
        },
        removeFromCart: function f(lesson) {
            this.lessons.forEach(l => {
                //add quantity back to lesson list
                if (l.subject === lesson.subject) {
                    l.space += lesson.quantity
                }
            })
            //remove lesson from cart
            this.cart = this.cart.filter(l => l.subject !== lesson.subject)
        },
        toggleCart: function f() {
            this.cartShown = !this.cartShown;
            this.lessonListShown = !this.lessonListShown;
        },

        checkout: function f() {
            let name = document.getElementById("name-input").value
            let phoneNumber = document.getElementById("phone-input").value
            for (let i = 0; i < name.length; i++) {
                let c = name.charAt(i)
                if (!((c >= 'a' && c <= 'z') || (c >= 'A' && c <= 'Z') || c === ' ')) {
                    alert("Invalid name")
                    return;
                }
            }
            for (let i = 0; i < phoneNumber.length; i++) {
                let c = phoneNumber.charAt(i)
                if (!(c >= '0' && c <= '9')) {
                    alert("Invalid phone number")
                    return
                }
            }
            alert("Checkout successfull")
        }
    }
})
