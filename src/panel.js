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
document.querySelector("login.html").addEventListener("click", function () {
    localStorage.removeItem("usuarioActivo");
});

const usuarioActivo = localStorage.getItem("usuarioActivo");

const clientesGuardados = JSON.parse(localStorage.getItem("clientes")) || [];

const clienteActivo = clientesGuardados.find(function (cliente) {
    return cliente.nombreUsuario === usuarioActivo;
});