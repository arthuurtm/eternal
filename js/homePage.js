const menu = document.getElementById('menu');
const navigator = document.getElementById('navigator');
const hideNavigator = document.getElementById('hideNavigator');
const header = document.getElementById('menu-header');
const overlay = document.getElementById('site_overlay');
const loading = document.getElementById('site_loading');
const elementsLogged = document.querySelectorAll('#reqLog');

function changeSitePage(src, title, focus = null, hide = null) {

    loading.classList.remove('hidden');
    loading.classList.add('active');

    if (!!focus) {
        header.classList.add('minimized');
        navigator.classList.add('minimized');
    } else {
        header.classList.remove('minimized');
    }

    if (!!hide) {
        navigator.classList.add('hide');
    } else {
        navigator.classList.remove('hide');
    }

    var iframe = document.getElementById('site_page');
    iframe.src = src;
    iframe.title = title;

    iframe.onload = function () {
        loading.classList.add('hidden');
        loading.classList.remove('active');
        var script = document.createElement('script');
        script.type = 'text/javascript';
        script.text = `
            function changeSitePage(src, title, focus = false, hide = false) {
                window.parent.postMessage({ 
                    action: 'changeSitePage',
                    src: src, 
                    title: title, 
                    focus: focus,
                    hide: hide
                },'*');
                console.log("Solicitação enviada!");
            }

            function requestReloadTo(path) {
                window.parent.postMessage({ 
                    action: 'requestReload',
                    path: path
                },'*');
            }

            function changeSiteModal(src) {
                window.parent.postMessage({ 
                    action: 'changeSiteModal',
                    src: src,
                },'*');
            }
        `;
        iframe.contentDocument.body.appendChild(script);
    };
}

function changeSiteModal(src, close = false) {
    var iframe = document.getElementById('site_modal');
    if (!close) {
        overlay.classList.remove('hidden');
        iframe.src = src;
        iframe.onload = function () {
            var script = document.createElement('script');
            script.type = 'text/javascript';
            script.text = `
                function closeModal() {
                    window.parent.postMessage(
                    { 
                        action: 'changeSiteModal',
                        src: null,
                        close: true
                    },
                    '*'
                );
                    console.log("Solicitação enviada!");
                }
            `;
            iframe.contentDocument.body.appendChild(script);
        };

    } else {
        overlay.classList.add('hidden');
        iframe.src = '';
    }
}

function logoutUser() {
    sessionStorage.removeItem('logged');
    window.location.reload();
}

function requestReload(path) {
    if (!!path) {
        changeSiteModal(path)
    }
    window.location.reload();
}

window.addEventListener('message', function (event) {
    console.log("Mensagem recebida na página principal:", event.data);
    console.log(`Função "${event.data.action}" requisitada...`);
    if (event.data.action === 'changeSitePage') {
        changeSitePage(event.data.src, event.data.title, event.data.focus, event.data.hide);

    } else if (event.data.action === 'changeSiteModal') {
        changeSiteModal(event.data.src,  event.data.close);

    } else if (event.data.action === 'requestReload') {
        requestReload();

    } else {
        console.warn(`Função "${event.data.action}" desconhecida!`);
    }
});

hideNavigator.addEventListener('click', () => {
    navigator.classList.toggle('minimized');
});

changeSitePage('views/tela_jogos.html', 'Início');

const isLogged = sessionStorage.getItem("logged") === 'true';

if (!isLogged) {

    elementsLogged.forEach(element => {
        element.style.display = 'none';
    });

    // Cria o elemento de Login
    let frame = document.createElement('li');
    let icon = document.createElement('div');
    icon.textContent = "login";
    icon.className = "material-symbols-outlined";
    let text = document.createElement('p');
    text.textContent = "Login";
    frame.appendChild(icon);
    frame.appendChild(text);
    frame.addEventListener('click', function () {
        changeSitePage('views/tela_login.html?type=login', 'Logar', true, true);
    });

    // Adiciona o elemento de Login à lista
    let userActionsUl = document.querySelector('#user-actions-ul');
    userActionsUl.appendChild(frame);
} else {
    // Cria o elemento de Sair (apenas se o usuário estiver logado)
    let frame = document.createElement('li');
    let icon = document.createElement('div');
    icon.textContent = "logout";
    icon.className = "material-symbols-outlined";
    let text = document.createElement('p');
    text.textContent = "Sair";
    frame.appendChild(icon);
    frame.appendChild(text);
    frame.addEventListener('click', function () {
        logoutUser();
    });

    // Adiciona o elemento de Sair à lista
    let userActionsUl = document.querySelector('#user-actions-ul');
    userActionsUl.appendChild(frame);
}
