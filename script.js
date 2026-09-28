const prodMenu = document.getElementById('prodMenu');
const tabButtons = document.querySelectorAll('.tabsBtn');
const showMoreBtn = document.getElementById('showMoreBtn');

let productsData = []; 


function loadProducts() {
    fetch('products.json')
        .then(response => response.json())
        .then(data => {
            productsData = data; 
            renderCards('coffee'); 
        })
        .catch(error => console.error('Ошибка загрузки JSON:', error));
}


function renderCards(category) {
    if (!prodMenu) return;
    
    prodMenu.innerHTML = ''; 

    
    const filteredProducts = productsData.filter(product => product.category === category);

    filteredProducts.forEach((product, index) => {
        const mobileHiddenClass = (index >= 4) ? 'mobile-hidden' : '';

        
        
        
        let imgName = product.category;
        if (imgName === 'coffee') imgName = 'coffe'; 
        
        const imagePath = `./img/${imgName}${index + 1}.jpg`;

        
        const cardHTML = `
            <article class="card ${mobileHiddenClass}" data-name="${product.name}">
                <div class="image-container">
                    <img class="zoom-image" src="${imagePath}" alt="${product.name}">
                </div>
                <div class="cardDescription">
                    <h2 class="costCard">${product.name}</h2>
                    <p class="descripCard">${product.description}</p>
                    <p class="costCard">$${product.price}</p>
                </div>
            </article>
        `;

        prodMenu.insertAdjacentHTML('beforeend', cardHTML);
    });

    handleShowMoreButton(filteredProducts.length);
    initModalEvents();
    
    
    initModalOpen();
}


function handleShowMoreButton(cardsCount) {
    if (!showMoreBtn) return;
    
    
    if (window.innerWidth <= 786 && cardsCount > 4) {
        showMoreBtn.classList.remove('hidden'); 
    } else {
        showMoreBtn.classList.add('hidden'); 
    }
}




if (showMoreBtn) {
    showMoreBtn.addEventListener('click', () => {
        if (!prodMenu) return;

        
        const hiddenCards = prodMenu.querySelectorAll('.mobile-hidden');

        
        hiddenCards.forEach(card => {
            card.classList.remove('mobile-hidden');
        });

        
        showMoreBtn.classList.add('hidden');
    });
}


tabButtons.forEach(button => {
    button.addEventListener('click', () => {
        tabButtons.forEach(btn => btn.classList.remove('active'));
        button.classList.add('active');

        const selectedCategory = button.getAttribute('data-category');
        renderCards(selectedCategory);
    });
});


loadProducts();
const sliderLine = document.getElementById('sliderLine');
const btnNext = document.getElementById('btnNext');

const btnPrev = document.getElementById('btnPrew') || document.getElementById('btnPrev'); 

const dashes = document.querySelectorAll('.dash');

if (sliderLine && (btnNext || btnPrev)) {
    
    function getStepWidth() {
        const firstCard = sliderLine.firstElementChild;
        if (!firstCard) return 0;
        const cardWidth = firstCard.offsetWidth; 
        const gap = parseFloat(window.getComputedStyle(sliderLine).gap) || 0; 
        return cardWidth + gap;
    }

    function updatePagination() {
        const currentCard = sliderLine.firstElementChild;
        if (!currentCard) return;
        const currentIndex = currentCard.getAttribute('data-index');
        dashes.forEach(dash => {
            if (String(dash.getAttribute('data-index')) === String(currentIndex)) {
                dash.classList.add('active');
            } else {
                dash.classList.remove('active');
            }
        });
    }

    let isAnimating = false;

    btnNext.addEventListener('click', () => {
        if (isAnimating) return;
        isAnimating = true;
        const stepWidth = getStepWidth();
        sliderLine.classList.add('animated'); 
        sliderLine.style.transform = `translateX(-${stepWidth}px)`;
    });

    btnPrev.addEventListener('click', () => {
        if (isAnimating) return;
        isAnimating = true;
        const stepWidth = getStepWidth();
        sliderLine.classList.remove('animated');
        const lastCard = sliderLine.lastElementChild;
        const firstCard = sliderLine.firstElementChild;
        sliderLine.insertBefore(lastCard, firstCard);
        updatePagination(); 
        sliderLine.style.transform = `translateX(-${stepWidth}px)`;
        requestAnimationFrame(() => {
            setTimeout(() => {
                sliderLine.classList.add('animated');
                sliderLine.style.transform = 'translateX(0)';
            }, 20);
        });
    });

    sliderLine.addEventListener('transitionend', () => {
        const stepWidth = getStepWidth();
        if (sliderLine.classList.contains('animated') && sliderLine.style.transform !== 'translateX(0px)' && sliderLine.style.transform !== 'translateX(0)') {
            requestAnimationFrame(() => {
                sliderLine.classList.remove('animated');
                const firstCard = sliderLine.firstElementChild;
                sliderLine.appendChild(firstCard);
                updatePagination(); 
                sliderLine.style.transform = 'translateX(0)';
                isAnimating = false;
            });
        } else {
            sliderLine.classList.remove('animated');
            isAnimating = false;
        }
    });

    updatePagination(); }

const modalOverlay = document.getElementById('modalOverlay');
const modalCloseBtn = document.getElementById('modalCloseBtn');
const modalActionCloseBtn = document.getElementById('modalActionCloseBtn');



function initModalEvents() {
    const cards = document.querySelectorAll('.card');
    cards.forEach(card => {
        card.addEventListener('click', () => {
            const productName = card.getAttribute('data-name');
            const productImg = card.querySelector('.zoom-image').src; 
            const productInfo = productsData.find(p => p.name === productName);
            if (productInfo) {
                openModal(productInfo, productImg);
            }
        });
    });
}
function openModal(product, imgSrc) {
    if (!modalOverlay) return;
    document.getElementById('modalImg').src = imgSrc;
    document.getElementById('modalTitle').textContent = product.name;
    document.getElementById('modalDesc').textContent = product.description;
    const basePrice = parseFloat(product.price);
    const sizeBlock = document.getElementById('sizeBlock');
    sizeBlock.innerHTML = '';
    Object.keys(product.sizes).forEach((key, index) => {
        const sizeInfo = product.sizes[key];
        const activeClass = index === 0 ? 'active' : ''; 
        sizeBlock.insertAdjacentHTML('beforeend', `
            <button type="button" class="option-btn twiterrBtn ${activeClass}" data-add="${sizeInfo['add-price']}">
                <span>${key.toUpperCase()}</span>
                <span>${sizeInfo.size}</span>
            </button>
        `);
    });
    
    const additivesBlock = document.getElementById('additivesBlock');
    additivesBlock.innerHTML = '';
    product.additives.forEach((additive, index) => {
        additivesBlock.insertAdjacentHTML('beforeend', `
            <button type="button" class="option-btn twiterrBtn" data-add="${additive['add-price']}">
                <span>${index + 1}</span>
                <span>${additive.name}</span>
            </button>
        `);
    });
    function calculateTotalPrice() {
        let currentTotal = basePrice;

        
        const activeSizeBtn = sizeBlock.querySelector('.option-btn.active');
        if (activeSizeBtn) {
            currentTotal += parseFloat(activeSizeBtn.getAttribute('data-add'));
        }

        
        const activeAdditivesButtons = additivesBlock.querySelectorAll('.option-btn.active');
        activeAdditivesButtons.forEach(btn => {
            currentTotal += parseFloat(btn.getAttribute('data-add'));
        });

        
        document.getElementById('modalTotalPrice').textContent = `$${currentTotal.toFixed(2)}`;
    }

    calculateTotalPrice();
    const sizeButtons = sizeBlock.querySelectorAll('.option-btn');
    sizeButtons.forEach(btn => {
        btn.addEventListener('click', () => {
            
            sizeButtons.forEach(b => b.classList.remove('active'));       
          btn.classList.add('active');
            
            calculateTotalPrice();
        });
    });

    
    const additiveButtons = additivesBlock.querySelectorAll('.option-btn');
 additiveButtons.forEach(btn => {
     btn.addEventListener('click', () => {
        
       btn.classList.toggle('active');
         
            calculateTotalPrice();
        });
    });
    modalOverlay.classList.add('open');
    document.body.classList.add('lock');
}

function closeModal() {
    modalOverlay.classList.remove('open');
    document.body.classList.remove('lock');
}
if (modalOverlay) {
    if (modalCloseBtn) modalCloseBtn.addEventListener('click', closeModal);
if (modalActionCloseBtn) modalActionCloseBtn.addEventListener('click', closeModal);
    modalOverlay.addEventListener('click', (e) => {
        if (e.target === modalOverlay) {
            closeModal();
        }
    });
    window.addEventListener('keydown', (e) => {
        if (e.key === 'Escape') {
            closeModal();
        }});
}
const burgerBtn = document.getElementById('burgerBtn');
const navMenu = document.getElementById('navMenu');
const navLinks = document.querySelectorAll('.nav-link');
if (burgerBtn && navMenu) {
        burgerBtn.addEventListener('click', () => {
        burgerBtn.classList.toggle('open'); 
        navMenu.classList.toggle('open');   
        document.body.classList.toggle('lock'); 
    });
    navLinks.forEach(link => {
        link.addEventListener('click', () => {
            burgerBtn.classList.remove('open');
            navMenu.classList.remove('open');
            document.body.classList.remove('lock');
        });
    });
}