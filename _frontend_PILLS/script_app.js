const App = {

    obj: {},

    load() {
        
        this.storageGet();

        const appName = 'solverpills';
        Z.terms(appName, App.obj.language, res => {
            if (res === false) {
                Z.termsError(App.obj.language);
                return;
            }
        });
        Z.recordAccess(appName);

        this.languageSet(App.obj.language);

        // Exibe menu
        document.getElementById('menu-toggle').addEventListener('click', () => this.menuShow());

        // Clique nos itens do menu
        document.querySelectorAll('.menu-item').forEach(item => {
            item.addEventListener('click', event => {
                const action = event.target.closest('.menu-item').id;
                this.menuClick(action);
            });
        });

        // Oculta menu
        document.getElementById('header-left').addEventListener('click', () => this.menuHide());
        document.getElementById('menu-dropdown').addEventListener('mouseleave', () => this.menuHide());

    },

    menuShow() {
        document.getElementById('menu-dropdown').style.display = 'block';
    },

    menuHide() {
        document.getElementById('menu-dropdown').style.display = 'none';
    },

    menuClick(action) {
        this.menuHide();
        if (action === 'menu-en') {
            App.languageSet('en');
        } else if (action === 'menu-pt') {
            App.languageSet('pt');
        } else if (action === 'menu-es') {
            App.languageSet('es');
        } else if (action === 'menu-terms') {
            this.terms();
        } else if (action === 'menu-info') {
            this.info();
        }
    },

    languageSet(lang) {
        Z.languageCurrent = lang;
        Z.html("#menu-caption-terms", Z.lng("menu-caption-terms"));
        Z.html("#menu-caption-about", Z.lng("menu-caption-about"));
        Z.html("#editor-button-run", Z.lng("Run"));
        Z.html("#editor-button-new", Z.lng("New"));
        Z.html("#editor-button-help", Z.lng("Help"));
        this.obj.language = Z.languageCurrent;
        this.storageSet();
    },

    storageGet() {
        const storage = localStorage.getItem('solverpills');
        if (storage === null) {
            this.obj = {
                language: Z.languageBrowser(),
            };
            this.storageSet();

        } else {
            this.obj = JSON.parse(storage);
        }
    },


    storageSet() {
        localStorage.setItem('solverpills', JSON.stringify(this.obj));
    },

    terms() {
        Z.termsShow('solverpills', App.obj.language, res => {
            if (res === false) {
                Z.termsError(App.obj.language);
                return;
            }
        });
    },

    info() {
        const title = Z.lng("Idealizado e desenvolvido por Maurício Garcia");
        const text = Z.lng("menu-about");
        Z.modal(title, text);
    },

}

export default App

