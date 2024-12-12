import './styles.css';
class SignIn {
    constructor() {
        this.init = () => {
            const loginButton = document.getElementById("login-button");
            const usernameInput = document.getElementById("username-input");
            const iconContainerCollection = document.getElementsByClassName("icon-container");
            loginButton === null || loginButton === void 0 ? void 0 : loginButton.addEventListener("click", () => {
                window.location.href = "create.html";
            });
            usernameInput.addEventListener("input", (event) => {
                const target = event.target;
                const iconContainer = iconContainerCollection[0];
                for (let i = 0; i < iconContainer.children.length; i++) {
                    const icon = iconContainer.children[i];
                    console.log(icon);
                    icon.style.color = this.iconColors[this.iconIndex];
                }
                if (this.iconColors.length > this.iconIndex) {
                    this.iconIndex++;
                }
            });
        };
        this.iconIndex = 0;
        this.iconColors = ["red", "blue", "green", "pink", "purple", "orange", "yellow"];
    }
}
const signIn = new SignIn();
signIn.init();
//# sourceMappingURL=main.js.map