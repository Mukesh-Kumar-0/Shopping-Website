document.addEventListener("DOMContentLoaded", function() {
    const categoriesContainer = document.getElementById('categories-container');
    const searchInput = document.getElementById('search-input');

    function createCategoryElement(category) {
        const categoryElement = document.createElement('div');
        categoryElement.className = 'category';

        const categoryLink = document.createElement('a');
        categoryLink.href = category.link;
        categoryLink.textContent = category.name;
        categoryElement.appendChild(categoryLink);

        if (category.subcategories) {
            const subcategoryContainer = document.createElement('div');
            subcategoryContainer.className = 'subcategory-container';

            category.subcategories.forEach(subcategory => {
                const subcategoryElement = createSubcategoryElement(subcategory);
                subcategoryContainer.appendChild(subcategoryElement);
            });

            categoryElement.appendChild(subcategoryContainer);
        }

        categoryElement.addEventListener('mouseover', (e) => {
            e.stopPropagation();
            const subcategoryContainer = categoryElement.querySelector('.subcategory-container');
            if (subcategoryContainer) {
                subcategoryContainer.classList.add('visible');
                categoryLink.classList.add('expanded');
            }
        });

        categoryElement.addEventListener('mouseleave', (e) => {
            e.stopPropagation();
            const subcategoryContainer = categoryElement.querySelector('.subcategory-container');
            if (subcategoryContainer) {
                subcategoryContainer.classList.remove('visible');
                categoryLink.classList.remove('expanded');
            }
        });

        return categoryElement;
    }

    function createSubcategoryElement(subcategory) {
        const subcategoryElement = document.createElement('div');
        subcategoryElement.className = 'subcategory';

        const subcategoryLink = document.createElement('a');
        subcategoryLink.href = subcategory.link;
        subcategoryLink.textContent = subcategory.name;
        subcategoryElement.appendChild(subcategoryLink);

        if (subcategory.subcategories) {
            const nestedSubcategoryContainer = document.createElement('div');
            nestedSubcategoryContainer.className = 'nested-subcategory-container';

            subcategory.subcategories.forEach(nestedSubcategory => {
                const nestedSubcategoryElement = createSubcategoryElement(nestedSubcategory);
                nestedSubcategoryContainer.appendChild(nestedSubcategoryElement);
            });

            subcategoryElement.appendChild(nestedSubcategoryContainer);
        }

        subcategoryElement.addEventListener('mouseover', (e) => {
            e.stopPropagation();
            const nestedSubcategoryContainer = subcategoryElement.querySelector('.nested-subcategory-container');
            if (nestedSubcategoryContainer) {
                nestedSubcategoryContainer.classList.add('visible');
                subcategoryLink.classList.add('expanded');
            }
        });

        subcategoryElement.addEventListener('mouseleave', (e) => {
            e.stopPropagation();
            const nestedSubcategoryContainer = subcategoryElement.querySelector('.nested-subcategory-container');
            if (nestedSubcategoryContainer) {
                nestedSubcategoryContainer.classList.remove('visible');
                subcategoryLink.classList.remove('expanded');
            }
        });

        return subcategoryElement;
    }

    function populateCategories(categories) {
        categories.forEach(category => {
            const categoryElement = createCategoryElement(category);
            categoriesContainer.appendChild(categoryElement);
        });
    }

    function filterCategories(query) {
        const allCategories = Array.from(categoriesContainer.getElementsByClassName('category'));
        allCategories.forEach(category => {
            const categoryName = category.firstChild.textContent.toLowerCase();
            const subcategories = Array.from(category.getElementsByClassName('subcategory'));

            let categoryMatch = categoryName.includes(query.toLowerCase());

            subcategories.forEach(subcategory => {
                const subcategoryName = subcategory.firstChild.textContent.toLowerCase();
                const nestedSubcategories = Array.from(subcategory.getElementsByClassName('nested-subcategory'));

                let subcategoryMatch = subcategoryName.includes(query.toLowerCase());

                nestedSubcategories.forEach(nestedSubcategory => {
                    const nestedSubcategoryName = nestedSubcategory.firstChild.textContent.toLowerCase();
                    const match = nestedSubcategoryName.includes(query.toLowerCase());
                    nestedSubcategory.style.display = match ? 'block' : 'none';
                    if (match) subcategoryMatch = true;
                });

                subcategory.style.display = subcategoryMatch ? 'block' : 'none';
                if (subcategoryMatch) categoryMatch = true;
            });

            category.style.display = categoryMatch ? 'block' : 'none';
        });
    }

    searchInput.addEventListener('input', (e) => {
        const query = e.target.value;
        filterCategories(query);
    });

    fetch('categories.json')
        .then(response => response.json())
        .then(data => {
            populateCategories(data.categories);
        })
        .catch(error => console.error('Error fetching categories:', error));
});
let slideIndex = 0;
showSlides();

function showSlides() {
  let i;
  let slides = document.getElementsByClassName("mySlides");
  let dots = document.getElementsByClassName("dot");
  for (i = 0; i < slides.length; i++) {
    slides[i].style.display = "none";  
  }
  slideIndex++;
  if (slideIndex > slides.length) {slideIndex = 1}    
  for (i = 0; i < dots.length; i++) {
    dots[i].className = dots[i].className.replace(" active", "");
  }
  slides[slideIndex-1].style.display = "block";  
  dots[slideIndex-1].className += " active";
  setTimeout(showSlides, 2000); 
}
function updateCart() {
    var messageElement = document.getElementById('message');
    messageElement.classList.remove('hidden');
    messageElement.classList.add('show');
    setTimeout(function() {
        messageElement.classList.remove('show');
        messageElement.classList.add('hidden');
    }, 3000);
}

let cart = [];

function addToCart(productName, productPrice) {
    let product = cart.find(item => item.name === productName);
    if (product) {
        product.quantity++;
    } else {
        cart.push({ name: productName, price: productPrice, quantity: 1 });
    }
    alert("Added successfully!")
    updateCartDisplay();
}

function updateCartDisplay() {
    const cartElement = document.getElementById('cart');
    cartElement.innerHTML = '';

    if (cart.length === 0) {
        cartElement.innerHTML = '<p>Your cart is empty.</p>';
    } else {
        cart.forEach(item => {
            const itemElement = document.createElement('div');
            itemElement.className = 'cart-item';
            itemElement.innerHTML = `${item.name} - $${item.price} x ${item.quantity} 
            <button onclick="removeFromCart('${item.name}')">Remove</button>`;
            cartElement.appendChild(itemElement);
        });

        const totalElement = document.createElement('div');
        totalElement.className = 'cart-total';
        const total = cart.reduce((sum, item) => sum + item.price * item.quantity, 0);
        totalElement.innerHTML = `Total: $${total}`;
        cartElement.appendChild(totalElement);
        updateCart()
    }
}

function removeFromCart(productName) {
    cart = cart.filter(item => item.name !== productName);
    updateCartDisplay();
    updateCart()
}