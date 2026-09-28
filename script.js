
const buttons = document.querySelectorAll('.tabsBtn');
const coffeeMenu = document.getElementById('coffee-menu');
const teaMenu = document.getElementById('tea-menu');
const dessMenu = document.getElementById('dess-menu')
buttons.forEach(button => {
    button.addEventListener('click', () => {
        buttons.forEach(btn => btn.classList.remove('active'));
        button.classList.add('active');

        const category = button.getAttribute('data-category');

        if (category === 'coffee') {
            coffeeMenu.classList.remove('hidden');
            teaMenu.classList.add('hidden');
            dessMenu.classList.add('hidden');
        } else if (category === 'tea') {
            teaMenu.classList.remove('hidden');
            coffeeMenu.classList.add('hidden');
            dessMenu.classList.add('hidden');
            
        }else if (category === 'dess') {
            dessMenu.classList.remove('hidden');
            coffeeMenu.classList.add('hidden');
            teaMenu.classList.add('hidden');
        }
    });
});
const sliderLine = document.getElementById('sliderLine');
const btnNext = document.getElementById('btnNext');
const btnPrev = document.getElementById('btnPrev'); const dashes = document.querySelectorAll('.dash');

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

updatePagination();