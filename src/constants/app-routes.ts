export const APP_ROUTES = {
    private: {
        lista: {
            name: '/lista/:slug'
        },
        gerenciar: {
            name: '/lista/gerenciar'
        },
        nova: {
            name: '/lista/nova'
        },
        recuperar: {
            name: "/cadastro/recuperar"
        }
    },

    public: {
        home: "/",
        cadastro: "/cadastro",
        login: "/login"
    }
}