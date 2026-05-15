/* ================= 1. LOGIN SYSTEM ================= */
let loginForm = document.getElementById("loginForm");
if (loginForm) {
    loginForm.addEventListener("submit", function(event) {
        event.preventDefault();
        
        let email = document.getElementById("loginEmail").value;
        let password = document.getElementById("loginPassword").value;
        let loginError = document.getElementById("loginError");

        // كود فالياديشن بسيط (تقدر تغير الإيميل والباسورد براحتك للجامعة)
        if (email === "admin@gamezone.com" && password === "123456") {
            // استخراج الاسم من الإيميل عشان نعرضه فوق
            let userName = email.split('@')[0];
            localStorage.setItem("loggedInUser", userName);
            
            // تحويله فوراً لصفحة المنتجات بعد النجاح
            window.location.href = "products.html";
        } else {
            loginError.innerHTML = "Invalid email or password! (Try: admin@gamezone.com / 123456)";
        }
    });
}

// عرض اسم المستخدم في الـ Nav بصفحة المنتجات
let welcomeUser = document.getElementById("welcomeUser");
if (welcomeUser) {
    let savedUser = localStorage.getItem("loggedInUser");
    if (savedUser) {
        welcomeUser.innerHTML = `Welcome, <span style="color: #38bdf8; text-transform: capitalize;">${savedUser}</span>! 🎮`;
    }
}


/* ================= 2. WELCOME BUTTON (INDEX) ================= */
let button = document.getElementById("changeTextBtn");
if (button) {
    button.onclick = function() {
        document.getElementById("message").innerHTML = "Welcome Gamer 🔥 Enjoy Your Experience";
    };
}


/* ================= 3. CONTACT FORM VALIDATION ================= */
let form = document.getElementById("contactForm");
if (form) {
    form.addEventListener("submit", function(event) {
        event.preventDefault();
        let name = document.getElementById("name").value;
        let email = document.getElementById("email").value;
        let message = document.getElementById("messageInput").value;
        let error = document.getElementById("error");

        if (name === "" || email === "" || message === "") {
            error.innerHTML = "All fields are required!";
            error.style.color = "red";
        } else {
            error.style.color = "lightgreen";
            error.innerHTML = "Message Sent Successfully!";
            form.reset();
        }
    });
}


/* ================= 4. FETCH PRODUCTS & LIVE CART WITH TOTAL ================= */
let productsTable = document.getElementById("products-table");
let cartCount = document.getElementById("cart-count");
let liveCartTable = document.getElementById("liveCartTable");
let cartTotal = document.getElementById("cartTotal");
let clearCartBtn = document.getElementById("clearCartBtn");

let myCart = [];

if (productsTable) {
    fetch("products.json")
    .then(response => response.json())
    .then(data => {
        let productsArray = data.Products; 
        productsTable.innerHTML = ""; 

        productsArray.forEach(function(product, index) {
            productsTable.innerHTML += `
            <tr>
                <td>${index + 1}</td>
                <td><img src="images/ps5-controller.jpg" width="50" style="border-radius:5px;" onerror="this.src='https://via.placeholder.com/50'"></td>
                <td style="color: #a855f7; font-weight: bold;">${product.Name}</td>
                <td>Gaming Gear</td>
                <td style="color: #22c55e; font-weight: bold;">$${product.Price}</td>
                <td>10</td>
                <td>
                    <button class="add-to-cart-btn" data-name="${product.Name}" data-price="${product.Price}" style="background: #a855f7; color: white; border: none; padding: 5px 10px; border-radius: 4px; cursor: pointer;">
                        Add to Cart
                    </button>
                </td>
            </tr>
            `;
        });
        setupLiveCart();
    })
    .catch(error => console.error("Error fetching data:", error));
}

function setupLiveCart() {
    let buttons = document.querySelectorAll(".add-to-cart-btn");
    
    buttons.forEach(function(button) {
        button.onclick = function() {
            let name = button.getAttribute("data-name");
            let price = Number(button.getAttribute("data-price")); // تحويله لرقم عشان الحسابات
            
            myCart.push({ name: name, price: price });
            updateCartUI();
        };
    });
}

// دالة تحديث السلة والـ Total لايف
function updateCartUI() {
    // 1. تحديث العداد فوق
    if (cartCount) cartCount.innerHTML = myCart.length;
    
    // 2. تحديث الجدول وحساب الإجمالي
    if (liveCartTable) {
        if (myCart.length === 0) {
            liveCartTable.innerHTML = `<tr><td colspan="3" style="text-align: center; color: #9ca3af; padding: 15px;">Your cart is empty. Click "Add to Cart" above!</td></tr>`;
            if (cartTotal) cartTotal.innerHTML = "$0";
            return;
        }

        liveCartTable.innerHTML = ""; 
        let totalSum = 0;

        myCart.forEach(function(item) {
            totalSum += item.price; // جمع الأسعار
            liveCartTable.innerHTML += `
            <tr>
                <td style="padding: 10px; border-bottom: 1px solid #1f2937;">${item.name}</td>
                <td style="color: #22c55e; padding: 10px; border-bottom: 1px solid #1f2937;">$${item.price}</td>
                <td style="padding: 10px; border-bottom: 1px solid #1f2937;">1</td>
            </tr>
            `;
        });

        // طباعة الإجمالي الكلي
        if (cartTotal) cartTotal.innerHTML = `$${totalSum}`;
    }
}

// تشغيل زرار مسح السلة
if (clearCartBtn) {
    clearCartBtn.onclick = function() {
        myCart = []; // تصفير المصفوفة
        updateCartUI(); // تحديث الشكل
    };
}