document.addEventListener('DOMContentLoaded', () => {
    // Cart functionality
    let cart = JSON.parse(localStorage.getItem('cart')) || [];
    updateCartCount();

    // Quick add buttons
    const quickAddBtns = document.querySelectorAll('.quick-add-btn');
    quickAddBtns.forEach(btn => {
        btn.addEventListener('click', (e) => {
            e.preventDefault();
            const product = {
                name: btn.dataset.name,
                price: btn.dataset.price,
                image: btn.dataset.image,
                id: Date.now()
            };
            addToCart(product);
        });
    });

    function addToCart(product) {
        cart.push(product);
        localStorage.setItem('cart', JSON.stringify(cart));
        updateCartCount();
        showNotification(`${product.name} added to cart!`);
    }

    function updateCartCount() {
        const cartCount = document.querySelector('.cart-count');
        if (cartCount) {
            cartCount.textContent = cart.length;
        }
    }

    function showNotification(message) {
        const notification = document.createElement('div');
        notification.className = 'notification';
        notification.textContent = message;
        notification.style.cssText = `
            position: fixed;
            top: 20px;
            right: 20px;
            background: linear-gradient(45deg, #ffffff, #f0f9ff);
            color: #1e3a8a;
            padding: 15px 25px;
            border-radius: 25px;
            box-shadow: 0 4px 15px rgba(0, 0, 0, 0.1);
            z-index: 1000;
            font-weight: 600;
            animation: slideIn 0.3s ease;
        `;
        
        document.body.appendChild(notification);
        
        setTimeout(() => {
            notification.remove();
        }, 3000);
    }

    // Cart page functionality
    if (window.location.pathname.includes('cart.html')) {
        displayCartItems();
    }

    function displayCartItems() {
        const cartItems = document.getElementById('cart-items');
        const cartSummary = document.getElementById('cart-summary');
        
        if (cart.length === 0) {
            cartItems.innerHTML = `
                <div class="empty-cart">
                    <h3>Your cart is empty</h3>
                    <p>Add some premium laptops to get started!</p>
                    <a href="products.html" class="shop-btn">Shop Now</a>
                </div>
            `;
            cartSummary.style.display = 'none';
        } else {
            cartItems.innerHTML = cart.map(item => `
                <div class="cart-item">
                    <img src="${item.image}" alt="${item.name}">
                    <div class="item-details">
                        <h4>${item.name}</h4>
                        <p class="item-price">${item.price}</p>
                    </div>
                    <button class="remove-btn" onclick="removeFromCart(${item.id})">×</button>
                </div>
            `).join('');
            
            updateCartSummary();
            cartSummary.style.display = 'block';
        }
    }

    function updateCartSummary() {
        const subtotal = cart.reduce((sum, item) => {
            return sum + parseFloat(item.price.replace('GHS', '').replace(',', ''));
        }, 0);
        
        const shipping = 50;
        const total = subtotal + shipping;
        
        document.getElementById('subtotal').textContent = `GHS${subtotal.toLocaleString()}.00`;
        document.getElementById('total').textContent = `GHS${total.toLocaleString()}.00`;
    }

    // Remove from cart function (global scope for onclick)
    window.removeFromCart = function(id) {
        cart = cart.filter(item => item.id !== id);
        localStorage.setItem('cart', JSON.stringify(cart));
        updateCartCount();
        displayCartItems();
    };

    // Product carousel functionality (for homepage)
    const products = document.querySelectorAll('.product');
    const dots = document.querySelectorAll('.dot');
    const prevArrow = document.getElementById('prev-arrow');
    const nextArrow = document.getElementById('next-arrow');
    let currentIndex = 1;

    if (products.length > 0) {
        function rotateImages(direction = 1) {
            const leftImage = document.querySelector('.product.left');
            const centerImage = document.querySelector('.product.center');
            const rightImage = document.querySelector('.product.right');

            if (leftImage && centerImage && rightImage) {
                leftImage.classList.remove('left');
                centerImage.classList.remove('center');
                rightImage.classList.remove('right');

                if (direction === 1) {
                    // Next
                    leftImage.classList.add('right');
                    centerImage.classList.add('left');
                    rightImage.classList.add('center');
                    currentIndex = (currentIndex + 1) % dots.length;
                } else {
                    // Previous
                    leftImage.classList.add('center');
                    centerImage.classList.add('right');
                    rightImage.classList.add('left');
                    currentIndex = (currentIndex - 1 + dots.length) % dots.length;
                }

                dots.forEach((dot, index) => {
                    dot.classList.toggle('active', index === currentIndex);
                });
            }
        }

        // Arrow navigation
        if (prevArrow) {
            prevArrow.addEventListener('click', () => rotateImages(-1));
        }
        if (nextArrow) {
            nextArrow.addEventListener('click', () => rotateImages(1));
        }

        // Dot navigation
        dots.forEach((dot, index) => {
            dot.addEventListener('click', () => {
                const direction = index > currentIndex ? 1 : -1;
                const steps = Math.abs(index - currentIndex);
                for (let i = 0; i < steps; i++) {
                    setTimeout(() => rotateImages(direction), i * 200);
                }
            });
        });

        // Click on right product to go next
        const rightProduct = document.querySelector('.product.right');
        if (rightProduct) {
            rightProduct.addEventListener('click', () => rotateImages(1));
        }
    }

    // 3D Model functionality
    function init3DModel() {
        const container = document.getElementById('3d-container');
        if (!container) return;
        
        try {
            // Check if THREE.js is available
            if (typeof THREE === 'undefined') {
                console.log('THREE.js not loaded, skipping 3D model');
                return;
            }

            const scene = new THREE.Scene();
            scene.background = new THREE.Color(0x1e3a8a);
            
            const camera = new THREE.PerspectiveCamera(75, container.offsetWidth / container.offsetHeight, 0.1, 1000);
            const renderer = new THREE.WebGLRenderer({ antialias: true });
            
            renderer.setSize(container.offsetWidth, container.offsetHeight);
            container.appendChild(renderer.domElement);

            const ambientLight = new THREE.AmbientLight(0xffffff, 1);
            scene.add(ambientLight);
            
            const directionalLight = new THREE.DirectionalLight(0xffffff, 1);
            directionalLight.position.set(5, 5, 5);
            scene.add(directionalLight);

            // Create a simple laptop-like geometry
            const laptopGeometry = new THREE.BoxGeometry(2, 0.2, 1.5);
            const laptopMaterial = new THREE.MeshLambertMaterial({ color: 0x3b82f6 });
            const laptop = new THREE.Mesh(laptopGeometry, laptopMaterial);
            scene.add(laptop);

            // Create screen
            const screenGeometry = new THREE.BoxGeometry(1.8, 0.1, 1.3);
            const screenMaterial = new THREE.MeshLambertMaterial({ color: 0x1e3a8a });
            const screen = new THREE.Mesh(screenGeometry, screenMaterial);
            screen.position.y = 0.15;
            screen.rotation.x = -0.3;
            laptop.add(screen);

            camera.position.z = 3;
            camera.position.y = 1.5;
            camera.lookAt(0, 0, 0);
            
            function animate() {
                requestAnimationFrame(animate);
                laptop.rotation.y += 0.01;
                renderer.render(scene, camera);
            }
            animate();

            window.addEventListener('resize', () => {
                camera.aspect = container.offsetWidth / container.offsetHeight;
                camera.updateProjectionMatrix();
                renderer.setSize(container.offsetWidth, container.offsetHeight);
            });

        } catch (error) {
            console.error('Error in 3D initialization:', error);
        }
    }

    // Product data for popup
    const productData = {
        0: {
            name: "BUSINESS ELITE",
            price: "GHS6,200.00",
            description: "Perfect for professionals with premium build quality and exceptional performance. Features advanced security, all-day battery life, and stunning display for productivity and business applications.",
            specs: ["Intel Core i5 Processor", "8GB RAM / 256GB SSD", "Integrated Graphics", "14\" Full HD Display", "Fingerprint Reader"]
        },
        1: {
            name: "GAMING LAPTOP PRO",
            price: "GHS8,500.00",
            description: "Experience ultimate performance with our Gaming Laptop Pro. Featuring high-end graphics, lightning-fast processing, and premium build quality. Perfect for gaming, content creation, and professional work with exceptional cooling and long-lasting battery life.",
            specs: ["Intel Core i7 Processor", "16GB RAM / 512GB SSD", "NVIDIA RTX Graphics", "15.6\" Full HD Display", "RGB Backlit Keyboard"]
        },
        2: {
            name: "ULTRABOOK SLIM",
            price: "GHS4,800.00",
            description: "Ultra-portable and lightweight design with premium materials and long-lasting battery. Perfect for students and professionals who need power and portability in a sleek, modern package.",
            specs: ["Intel Core i3 Processor", "8GB RAM / 256GB SSD", "Integrated Graphics", "13.3\" Full HD Display", "Ultra-Slim Design"]
        }
    };

    // Initialize popup when any product is clicked
    const allProducts = document.querySelectorAll('.product');
    allProducts.forEach((product, index) => {
        product.addEventListener('click', () => {
            // Update currentIndex based on which product was clicked
            if (product.classList.contains('left')) {
                currentIndex = (currentIndex - 1 + 3) % 3;
            } else if (product.classList.contains('right')) {
                currentIndex = (currentIndex + 1) % 3;
            }
            // Center product keeps current index
            showProductPopup();
        });
    });

    // Global functions for popup
    window.showProductPopup = function() {
        const popup = document.getElementById('product-popup');
        const currentProduct = productData[currentIndex];
        
        document.getElementById('popup-product-name').textContent = currentProduct.name;
        document.getElementById('popup-price').textContent = currentProduct.price;
        document.getElementById('popup-description').textContent = currentProduct.description;
        
        // Update laptop image
        const laptopImage = document.getElementById('popup-laptop-image');
        laptopImage.src = `images/img${currentIndex + 1}.png`;
        laptopImage.alt = currentProduct.name;
        
        // Update specs list
        const specsList = document.querySelector('.specs-list');
        specsList.innerHTML = currentProduct.specs.map(spec => `<li>${spec}</li>`).join('');
        
        popup.classList.add('active');
        document.body.style.overflow = 'hidden';
        
        // Initialize 3D model after popup opens
        setTimeout(() => {
            init3DModel();
        }, 500);
    };

    window.closePopup = function() {
        const popup = document.getElementById('product-popup');
        popup.classList.remove('active');
        document.body.style.overflow = 'auto';
    };

    window.addToCartFromPopup = function() {
        const currentProduct = productData[currentIndex];
        const product = {
            name: currentProduct.name,
            price: currentProduct.price,
            image: `images/img${currentIndex + 1}.png`,
            id: Date.now()
        };
        addToCart(product);
        closePopup();
    };

    // Checkout Modal Functions
    window.openCheckout = function() {
        const modal = document.getElementById('checkout-modal');
        const checkoutItems = document.getElementById('checkout-items');
        const checkoutTotal = document.getElementById('checkout-total');
        
        // Display cart items in checkout
        if (cart.length === 0) {
            alert('Your cart is empty!');
            return;
        }
        
        checkoutItems.innerHTML = cart.map((item, index) => `
            <div class="checkout-item">
                <div class="item-details">
                    <div class="item-name">${item.name}</div>
                    <div class="item-price">${item.price}</div>
                </div>
                <div class="quantity-controls">
                    <button class="quantity-btn" onclick="updateQuantity(${index}, -1)">-</button>
                    <span class="quantity-display">1</span>
                    <button class="quantity-btn" onclick="updateQuantity(${index}, 1)">+</button>
                </div>
                <button class="remove-btn" onclick="removeFromCart(${item.id})">Remove</button>
            </div>
        `).join('');
        
        // Calculate and display total
        const subtotal = cart.reduce((sum, item) => {
            return sum + parseFloat(item.price.replace('GHS', '').replace(',', ''));
        }, 0);
        const shipping = 50;
        const total = subtotal + shipping;
        checkoutTotal.textContent = `GHS${total.toLocaleString()}.00`;
        
        modal.classList.add('active');
        document.body.style.overflow = 'hidden';
    };

    window.closeCheckout = function() {
        const modal = document.getElementById('checkout-modal');
        modal.classList.remove('active');
        document.body.style.overflow = 'auto';
    };

    window.updateQuantity = function(index, change) {
        // This is a simplified version - in a real app you'd update quantities
        console.log(`Update quantity for item ${index} by ${change}`);
    };

    window.sendToWhatsApp = function() {
        const fullName = document.getElementById('fullName').value;
        const phoneNumber = document.getElementById('phoneNumber').value;
        const deliveryAddress = document.getElementById('deliveryAddress').value;
        const additionalNotes = document.getElementById('additionalNotes').value;
        
        // Validate required fields
        if (!fullName || !phoneNumber || !deliveryAddress) {
            alert('Please fill in all required fields!');
            return;
        }
        
        // Calculate total
        const subtotal = cart.reduce((sum, item) => {
            return sum + parseFloat(item.price.replace('GHS', '').replace(',', ''));
        }, 0);
        const shipping = 50;
        const total = subtotal + shipping;
        
        // Create WhatsApp message
        let message = `🛒 *NEW ORDER - RightGadgetsGH*\n\n`;
        message += `👤 *Customer Details:*\n`;
        message += `Name: ${fullName}\n`;
        message += `Phone: ${phoneNumber}\n`;
        message += `Address: ${deliveryAddress}\n`;
        if (additionalNotes) {
            message += `Notes: ${additionalNotes}\n`;
        }
        
        message += `\n📦 *Order Items:*\n`;
        cart.forEach((item, index) => {
            message += `${index + 1}. ${item.name} - ${item.price}\n`;
        });
        
        message += `\n💰 *Order Summary:*\n`;
        message += `Subtotal: GHS${subtotal.toLocaleString()}.00\n`;
        message += `Shipping: GHS50.00\n`;
        message += `*Total: GHS${total.toLocaleString()}.00*\n\n`;
        message += `Thank you for choosing RightGadgetsGH! 🚀`;
        
        // Encode message for URL
        const encodedMessage = encodeURIComponent(message);
        const whatsappNumber = '233594906859';
        const whatsappUrl = `https://wa.me/${whatsappNumber}?text=${encodedMessage}`;
        
        // Open WhatsApp
        window.open(whatsappUrl, '_blank');
        
        // Close modal and clear cart
        closeCheckout();
        cart = [];
        localStorage.setItem('cart', JSON.stringify(cart));
        updateCartCount();
        displayCartItems();
        
        // Show success message
        alert('Order sent to WhatsApp! You will be contacted shortly.');
    };

    // Add CSS for animations
    const style = document.createElement('style');
    style.textContent = `
        @keyframes slideIn {
            from {
                transform: translateX(100%);
                opacity: 0;
            }
            to {
                transform: translateX(0);
                opacity: 1;
            }
        }
        
        .cart-item {
            display: flex;
            align-items: center;
            gap: 1rem;
            padding: 1rem;
            background: rgba(255, 255, 255, 0.1);
            border-radius: 15px;
            margin-bottom: 1rem;
            backdrop-filter: blur(10px);
        }
        
        .cart-item img {
            width: 80px;
            height: 60px;
            object-fit: cover;
            border-radius: 10px;
        }
        
        .item-details h4 {
            color: white;
            margin-bottom: 0.5rem;
        }
        
        .item-price {
            color: #60a5fa;
            font-weight: 600;
        }
        
        .remove-btn {
            background: #ef4444;
            color: white;
            border: none;
            border-radius: 50%;
            width: 30px;
            height: 30px;
            cursor: pointer;
            font-size: 1.2rem;
            margin-left: auto;
        }
        
        .empty-cart {
            text-align: center;
            color: white;
            padding: 3rem;
        }
        
        .shop-btn {
            display: inline-block;
            background: linear-gradient(45deg, #ffffff, #f0f9ff);
            color: #1e3a8a;
            padding: 12px 30px;
            border-radius: 25px;
            text-decoration: none;
            font-weight: 600;
            margin-top: 1rem;
            transition: transform 0.3s ease;
        }
        
        .shop-btn:hover {
            transform: scale(1.05);
        }
        
        .cart-summary {
            background: rgba(255, 255, 255, 0.1);
            padding: 2rem;
            border-radius: 20px;
            backdrop-filter: blur(10px);
            margin-top: 2rem;
        }
        
        .summary-line {
            display: flex;
            justify-content: space-between;
            margin-bottom: 1rem;
            color: white;
        }
        
        .summary-line.total {
            font-weight: 700;
            font-size: 1.2rem;
            border-top: 1px solid rgba(255, 255, 255, 0.2);
            padding-top: 1rem;
        }
        
        .checkout-btn {
            width: 100%;
            background: linear-gradient(45deg, #ffffff, #f0f9ff);
            color: #1e3a8a;
            border: none;
            padding: 15px;
            border-radius: 25px;
            font-weight: 600;
            cursor: pointer;
            margin-top: 1rem;
            transition: transform 0.3s ease;
        }
        
        .checkout-btn:hover {
            transform: scale(1.02);
        }
    `;
    document.head.appendChild(style);
});
