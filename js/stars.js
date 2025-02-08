function setupStars(containerSelector, initialRating = 0) {
    const container = document.querySelector(containerSelector);
    const stars = container.querySelectorAll('.star');
    let selectedValue = initialRating;

    // Verifica se o contêiner deve bloquear o hover
    const isHoverBlocked = container.classList.contains('block');

    // Inicializa as estrelas com base no valor inicial
    highlightStars(selectedValue);

    // Evento para passar o mouse (hover)
    stars.forEach(star => {
        star.addEventListener('mouseover', () => {
            if (!isHoverBlocked) { // Só permite hover se não estiver bloqueado
                const value = star.getAttribute('data-value');
                highlightStars(value);
            }
        });

        star.addEventListener('mouseout', () => {
            if (!isHoverBlocked) { // Só permite resetar se não estiver bloqueado
                highlightStars(selectedValue);
            }
        });

        star.addEventListener('click', () => {
            if (!isHoverBlocked) { // Só permite clicar se não estiver bloqueado
                selectedValue = star.getAttribute('data-value');
                highlightStars(selectedValue);
            }
        });
    });

    // Função para ativar as estrelas visualmente
    function highlightStars(value) {
        stars.forEach(star => {
            if (star.getAttribute('data-value') <= value) {
                star.classList.add('selected');
            } else {
                star.classList.remove('selected');
            }
        });
    }

    // Retorna a função para obter e modificar a avaliação
    return {
        getRating: () => selectedValue,
        setRating: (value) => { // Permite modificar a avaliação programaticamente
            selectedValue = value;
            highlightStars(selectedValue);
        },
        isHoverBlocked: () => isHoverBlocked, // Retorna se o hover está bloqueado
    };
}