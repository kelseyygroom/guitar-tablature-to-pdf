import "./signup.css";
import logo from './images/logo.svg'

const url = "https://guitar-tablature-to-pdf-147ddb720da0.herokuapp.com/";
// const url = "http://localhost:5000/";

class SignUp {
    constructor() {
        this.setLogo();
    }

    private setLogo = () => {
        const logoImage: HTMLImageElement = document.getElementById("logo") as HTMLImageElement;
        logoImage.src = logo;
    };

    public init = (): void => {
        const createUserButton: HTMLButtonElement = document.getElementById("create-user-button") as HTMLButtonElement;
        const createUsernameInput: HTMLInputElement = document.getElementById("create-username-input") as HTMLInputElement;
        const createPasswordInput: HTMLInputElement = document.getElementById("create-password-input") as HTMLInputElement;
        const createEmailInput: HTMLInputElement = document.getElementById("create-email-input") as HTMLInputElement;

        createUserButton?.addEventListener("click", async () => {
            const createUserResponse = await fetch(url + `createAccount`, {
                method: 'POST',
                headers: {
                  'Content-Type': 'application/json',
                },
                body: JSON.stringify({ username: createUsernameInput.value, password: createPasswordInput.value, email: createEmailInput.value })
            });

            const createApproval = await createUserResponse.json();

            if (createApproval === true) {
                // window.location.href = "create.html?username=" + createUsernameInput.value;
                window.location.href = "home.html?username=" + createUsernameInput.value;
            }
        });
    }
}

const signUp: SignUp = new SignUp();
signUp.init();