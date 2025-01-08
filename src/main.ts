import './styles.css';

class SignIn {
    private iconIndex: number;
    private iconColors: string[];

    constructor() {
        this.iconIndex = 0;
        this.iconColors = ["red", "blue", "green", "pink", "purple", "orange", "yellow"];
    }

    public init = (): void => {
        const loginButton: HTMLButtonElement = document.getElementById("login-button") as HTMLButtonElement;
        const createUserButton: HTMLButtonElement = document.getElementById("create-user-button") as HTMLButtonElement;
        const loginErrorLabel: HTMLLabelElement = document.getElementById("failed-login-error") as HTMLLabelElement;
        const usernameInput: HTMLInputElement = document.getElementById("username-input") as HTMLInputElement;
        const passwordInput: HTMLInputElement = document.getElementById("password-input") as HTMLInputElement;
        const createUsernameInput: HTMLInputElement = document.getElementById("create-username-input") as HTMLInputElement;
        const createPasswordInput: HTMLInputElement = document.getElementById("create-password-input") as HTMLInputElement;
        const createEmailInput: HTMLInputElement = document.getElementById("create-email-input") as HTMLInputElement;
        const iconContainerCollection: HTMLCollectionOf<HTMLDivElement> = document.getElementsByClassName("icon-container") as HTMLCollectionOf<HTMLDivElement>;
        
        loginButton?.addEventListener("click", async () => {
            const userResponse = await fetch(`http://localhost:5000/login?username=${usernameInput.value}&pass=${passwordInput.value}`);
            console.log("userResponse", userResponse)

            const loginApproval = await userResponse.json();

            if (loginApproval === true) {
                // window.location.href = "create.html?username=" + usernameInput.value;
                window.location.href = "home.html?username=" + createUsernameInput.value;
            }
            else {
                loginErrorLabel.style.display = "block";
            }
        });

        createUserButton?.addEventListener("click", async () => {
            const createUserResponse = await fetch(`http://localhost:5000/createAccount`, {
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

const signIn: SignIn = new SignIn();
signIn.init();