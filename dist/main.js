import './styles.css';
class SignIn {
    constructor() {
        this.initloginListener = () => {
            const loginButton = document.getElementById("login-button");
            loginButton === null || loginButton === void 0 ? void 0 : loginButton.addEventListener("click", () => {
                window.location.href = "create.html";
            });
        };
    }
}
const signIn = new SignIn();
signIn.initloginListener();
//# sourceMappingURL=main.js.map