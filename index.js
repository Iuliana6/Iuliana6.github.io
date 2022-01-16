const apiUrl = "https://wad-cw2.herokuapp.com/"
var vue = new Vue({
    el: '#container',
    data: {
        lessons: [],
        cart: [],
        lessonListShown: true,
        cartShown: false,
        checkoutButtonShown: false,
        sortingCriteria: ["Subject", "Location", "Price", "Availability"],
        sortingOrder: ["Ascending", "Descending"],
        selectedCriteria: "Subject",
        selectedOrder: "Ascending",
        searchString: "",
        sortedLessons: [],
    },
    created: function () {
        let that = this
        fetch(apiUrl + '/lessons').then(
            function (response) {
                response.json().then(
                    function (json) {
                        that.lessons = json.result;
                        that.sortedLessons = json.result;
                    }
                )
            })
    },
    methods: {
        searchFn: function f() {
            let that = this
            fetch(apiUrl + '/search?searchString='+that.searchString, {
            }).then(
                function (response) {
                    response.json().then(
                        function (json) {
                            that.sortedLessons=json.result
                        }
                    )
                })
        },
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
            if (name === "" || phoneNumber === "") {
                alert("Please fill out all the fields")
                return;
            }
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
            this.cart.forEach(lesson => {
                fetch(apiUrl + "/order", {
                    method: 'POST', // *GET, POST, PUT, DELETE, etc.
                    mode: 'cors', // no-cors, *cors, same-origin
                    cache: 'no-cache', // *default, no-cache, reload, force-cache, only-if-cached
                    credentials: 'same-origin', // include, *same-origin, omit
                    headers: {
                        'Content-Type': 'application/json'
                        // 'Content-Type': 'application/x-www-form-urlencoded',
                    },
                    redirect: 'follow', // manual, *follow, error
                    referrerPolicy: 'no-referrer', // no-referrer, *no-referrer-when-downgrade, origin, origin-when-cross-origin, same-origin, strict-origin, strict-origin-when-cross-origin, unsafe-url
                    body: JSON.stringify({
                        name: name,
                        phoneNumber: phoneNumber,
                        subject: lesson.subject,
                        location: lesson.location,
                        price: lesson.price,
                        quantity: lesson.quantity,
                        imageURL: lesson.imageURL
                    }) // body data type must match "Content-Type" header
                });
                let newQuantity = this.lessons.filter(l => l.subject == lesson.subject)[0].space
                console.log(newQuantity)
                fetch(apiUrl + "/lessons", {
                    method: 'PUT', // *GET, POST, PUT, DELETE, etc.
                    mode: 'cors', // no-cors, *cors, same-origin
                    cache: 'no-cache', // *default, no-cache, reload, force-cache, only-if-cached
                    credentials: 'same-origin', // include, *same-origin, omit
                    headers: {
                        'Content-Type': 'application/json'
                        // 'Content-Type': 'application/x-www-form-urlencoded',
                    },
                    redirect: 'follow', // manual, *follow, error
                    referrerPolicy: 'no-referrer', // no-referrer, *no-referrer-when-downgrade, origin, origin-when-cross-origin, same-origin, strict-origin, strict-origin-when-cross-origin, unsafe-url
                    body: JSON.stringify({
                        subject: lesson.subject,
                        location: lesson.location,
                        price: lesson.price,
                        quantity: newQuantity,
                        imageURL: lesson.imageURL
                    }) // body data type must match "Content-Type" header
                });

            })
            this.cart = []
            alert("Checkout successfull")

        }
    }
})
