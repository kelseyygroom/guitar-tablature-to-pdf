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

    private verifyEmail = (email: string) => {
        const emailRegex = /^[a-zA-Z0-9._%+-]+@[a-zA-Z0-9.-]+\.[a-zA-Z]{2,}$/;
        return emailRegex.test(email);
    };

    private verifyPassword = (password: string) => {
        const passwordRegex = /^(?=.*[a-z])(?=.*[A-Z])(?=.*\d)(?=.*[@$!%*?&])[A-Za-z\d@$!%*?&]{8,}$/;
        return passwordRegex.test(password);
    };

    public init = (): void => {
        const createUserButton: HTMLButtonElement = document.getElementById("create-user-button") as HTMLButtonElement;
        const createUsernameInput: HTMLInputElement = document.getElementById("create-username-input") as HTMLInputElement;
        const createPasswordInput: HTMLInputElement = document.getElementById("create-password-input") as HTMLInputElement;
        const createEmailInput: HTMLInputElement = document.getElementById("create-email-input") as HTMLInputElement;

        createUserButton?.addEventListener("click", async () => {
            if (this.verifyEmail(createEmailInput.value) && this.verifyPassword(createPasswordInput.value)) {
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
            }
            else {
                alert("Must be valid email.\nOR\nUsername is taken.\nOR\nPasswords must contian a capital character, special character, and a number. (Like 'P@ssword1').")
            }
        });
    }
}

const signUp: SignUp = new SignUp();
signUp.init();