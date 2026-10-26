document.addEventListener("DOMContentLoaded", () => {

    const menuButton = document.getElementById("mobileMenuButton");
    const sidebar = document.getElementById("sidebar");
    const menuIcon = document.getElementById("menuIcon");

    // Verifica se os elementos existem
    if (!menuButton || !sidebar) {
        console.error("Botão ou menu lateral não encontrado.");
        return;
    }

    // Cria a camada de fundo
    const overlay = document.createElement("div");

    overlay.id = "menuOverlay";
    overlay.setAttribute("aria-hidden", "true");

    document.body.appendChild(overlay);

    const mediaQuery = window.matchMedia("(max-width: 1023px)");

    // Abre ou fecha o menu
    function setMenuState(open) {

        // Em desktop, o menu permanece fixo
        if (!mediaQuery.matches) {
            open = false;
        }

        sidebar.classList.toggle("menu-open", open);
        overlay.classList.toggle("active", open);

        document.body.classList.toggle("menu-active", open);

        menuButton.setAttribute(
            "aria-expanded",
            String(open)
        );

        menuButton.setAttribute(
            "aria-label",
            open
                ? "Fechar menu de navegação"
                : "Abrir menu de navegação"
        );

        if (menuIcon) {
            menuIcon.textContent = open ? "close" : "menu";
        }
    }

    // Clique no botão
    menuButton.addEventListener("click", () => {

        const isOpen = sidebar.classList.contains("menu-open");

        setMenuState(!isOpen);

    });

    // Clique no fundo fecha o menu
    overlay.addEventListener("click", () => {
        setMenuState(false);
    });

    // Fecha ao selecionar um link
    sidebar.querySelectorAll("a").forEach(link => {

        link.addEventListener("click", () => {

            if (mediaQuery.matches) {
                setMenuState(false);
            }

        });

    });

    // Fecha ao pressionar Escape
    document.addEventListener("keydown", event => {

        if (event.key === "Escape") {
            setMenuState(false);
        }

    });

    // Ajusta o comportamento ao redimensionar a tela
    mediaQuery.addEventListener("change", () => {
        setMenuState(false);
    });

    
    // Estado inicial do menu
    if (mediaQuery.matches) {
        setMenuState(false);
    } else {
        sidebar.classList.remove("menu-open");
        overlay.classList.remove("active");
        document.body.classList.remove("menu-active");

        menuButton.setAttribute("aria-expanded", "false");
        menuButton.setAttribute("aria-label", "Abrir menu de navegação");

        if (menuIcon) {
            menuIcon.textContent = "menu";
        }
    }

});
