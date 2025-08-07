import "./signup.css";
import logo from "./images/landing-logo.svg"

const url = process.env.SERVER_URL;
// const url = "http://localhost:5000/";

class SignUp {
    private validPasswordCheckSpecial: boolean;
    private validPasswordCheckCapital: boolean;
    private validPasswordCheckNumber: boolean;
    private validPasswordCheckLength: boolean;

    constructor() {
        this.setLogo();
        this.validPasswordCheckSpecial = false;
        this.validPasswordCheckCapital = false;
        this.validPasswordCheckNumber = false;
        this.validPasswordCheckLength = false;
    }

    private setLogo = () => {
        const logoImage: HTMLImageElement = document.getElementById("logo") as HTMLImageElement;
        if (!logoImage) return;
        logoImage.src = logo;
    };

    public listenForValidPassword = () => {
        const passwordInput: HTMLInputElement = document.getElementById("create-password-input") as HTMLInputElement;
        const passwordIsValidChecklist: HTMLInputElement = document.getElementById("failed-password-error") as HTMLInputElement;
        const passwordIsValidLabel: HTMLInputElement = document.getElementById("failed-password-error-label") as HTMLInputElement;
        if (!passwordInput) return;
        passwordInput.addEventListener("keyup", (event: any) => {
            const passwordEntry: string = event.target.value;
            passwordIsValidChecklist.style.display = "flex";
            passwordIsValidLabel.style.display = "flex";
            const passwordIsSpecial: HTMLElement = document.getElementById("special-character-icon") as HTMLElement;
            const passwordIsCapital: HTMLElement = document.getElementById("capital-letter-icon") as HTMLElement;
            const passwordIsNumber: HTMLElement = document.getElementById("number-icon") as HTMLElement;
            const passwordIsOver8: HTMLElement = document.getElementById("over-8-icon") as HTMLElement;

            // Check for special characters.
            if (/[^a-zA-Z0-9]/.test(passwordEntry)) {
                passwordIsSpecial.style.display = "flex";
                this.validPasswordCheckSpecial = true;
            }
            else {
                passwordIsSpecial.style.display = "none";
                this.validPasswordCheckSpecial = false;
            }

            // Check for capital letter.
            if (/[A-Z]/.test(passwordEntry)) {
                passwordIsCapital.style.display = "flex";
                this.validPasswordCheckCapital = true;
            }
            else {
                passwordIsCapital.style.display = "none";
                this.validPasswordCheckCapital = false;
            }

            // Check for number.
            if (/[0-9]/.test(passwordEntry)) {
                passwordIsNumber.style.display = "flex";
                this.validPasswordCheckNumber = true;
            }
            else {
                passwordIsNumber.style.display = "none";
                this.validPasswordCheckNumber = false;
            }

            // Check for length over 8.
            if (passwordEntry.length >= 8) {
                passwordIsOver8.style.display = "flex";
                this.validPasswordCheckLength = true;
            }
            else {
                passwordIsOver8.style.display = "none";
                this.validPasswordCheckLength = false;
            }

            if (passwordEntry.length === 0) {
                passwordIsValidLabel.style.display = "none";
            }
            else {
                passwordIsValidLabel.style.display = "flex";
            }
        });
    };

    public init = (): void => {
        const createUserButton: HTMLButtonElement = document.getElementById("create-user-button") as HTMLButtonElement;
        const createUsernameInput: HTMLInputElement = document.getElementById("create-username-input") as HTMLInputElement;
        const createPasswordInput: HTMLInputElement = document.getElementById("create-password-input") as HTMLInputElement;
        const createEmailInput: HTMLInputElement = document.getElementById("create-email-input") as HTMLInputElement;
        const usernameErrorLabel: HTMLDivElement = document.getElementById("failed-username-error-label") as HTMLDivElement;
        if (!createUsernameInput) return;
        createUsernameInput.addEventListener("keyup", () => {
            usernameErrorLabel.style.display = "none";
        });

        createUserButton?.addEventListener("click", async () => {
            const userAccount = await fetch(url + "getUserAccount?username=" + createUsernameInput.value)
            const userData = await userAccount.json();
            console.log(userData)

            if (userData !== "No Account found.") {
                usernameErrorLabel.style.display = "flex";
                createUsernameInput.classList.add("highlight-error")

                setTimeout(() => {
                    createUsernameInput.classList.remove("highlight-error")
                }, 2000);
                
                return;
            }

            if (this.validPasswordCheckCapital && this.validPasswordCheckLength && this.validPasswordCheckNumber && this.validPasswordCheckSpecial) {

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
                createPasswordInput.classList.add("highlight-error")

                setTimeout(() => {
                    usernameErrorLabel.style.display = "none";
                    createPasswordInput.classList.remove("highlight-error")
                }, 2000);
            }
        });
    }
}

const signUp: SignUp = new SignUp();
signUp.init();
signUp.listenForValidPassword();