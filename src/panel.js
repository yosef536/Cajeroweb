// Cambia entre secciones del panel. Solo maneja la vista;
// la lógica de negocio (saldo real, validaciones, etc.) se conecta aparte.
const navItems = document.querySelectorAll('.panel-nav-item');
const views = document.querySelectorAll('.panel-view');

navItems.forEach(item => {
    item.addEventListener('click', () => {
        navItems.forEach(i => i.classList.remove('is-active'));
        views.forEach(v => v.classList.remove('is-active'));

        item.classList.add('is-active');
        document.getElementById('view-' + item.dataset.target).classList.add('is-active');
    });
});