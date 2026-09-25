
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