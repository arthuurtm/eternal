const menu = document.getElementById('menu');
const navigator = document.getElementById('navigator');
const hideNavigator = document.getElementById('hideNavigator');
const header = document.getElementById('menu-header');
const overlay = document.getElementById('site_overlay');

function changeSitePage(src, title, focus = null, hide = null) {
    if (!!focus) {
        header.classList.add('hidden');
        navigator.classList.toggle('hidden');
    } else {
        header.classList.remove('hidden');
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
        var script = document.createElement('script');
        script.type = 'text/javascript';
        script.text = `
            function changeSitePage(src, title, focus = false, hide = false) {
                window.parent.postMessage(
                { 
                    action: 'changeSitePage',
                    src: src, 
                    title: title, 
                    focus: focus,
                    hide: hide
                },
                '*'
            );
                console.log("Solicitação enviada!");
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

window.addEventListener('message', function (event) {
    console.log("Mensagem recebida na página principal:", event.data);
    if (event.data.action === 'changeSitePage') {
        changeSitePage(event.data.src, event.data.title, event.data.focus, event.data.hide);

    } else if (event.data.action === 'changeSiteModal') {
        changeSiteModal(event.data.src,  event.data.close);
    }
});

hideNavigator.addEventListener('click', () => {
    navigator.classList.toggle('hidden');
});

changeSitePage('views/tela_jogos.html', 'Início');
