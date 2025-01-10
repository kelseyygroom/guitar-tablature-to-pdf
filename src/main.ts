import './styles.css';
const url = "https://guitar-tablature-to-pdf-147ddb720da0.herokuapp.com/";
// const url = "http://localhost:5000/";

class SignIn {
    private iconIndex: number;
    private iconColors: string[];

    constructor() {
        this.iconIndex = 0;
        this.iconColors = ["red", "blue", "green", "pink", "purple", "orange", "yellow"];
    }

    public init = (): void => {
        const loginButton: HTMLButtonElement = document.getElementById("login-button") as HTMLButtonElement;
        const loginErrorLabel: HTMLLabelElement = document.getElementById("failed-login-error") as HTMLLabelElement;
        const usernameInput: HTMLInputElement = document.getElementById("username-input") as HTMLInputElement;
        const passwordInput: HTMLInputElement = document.getElementById("password-input") as HTMLInputElement;
        
        loginButton?.addEventListener("click", async () => {
            const userResponse = await fetch(url + `login?username=${usernameInput.value}&pass=${passwordInput.value}`);
            const loginApproval = await userResponse.json();
            if (loginApproval === true) {
                window.location.href = "home.html?username=" + usernameInput.value;
            }
            else {
                loginErrorLabel.style.display = "block";
            }
        });
    }
}

const signIn: SignIn = new SignIn();
signIn.init();