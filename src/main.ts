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
        const usernameInput: HTMLInputElement = document.getElementById("username-input") as HTMLInputElement;
        const iconContainerCollection: HTMLCollectionOf<HTMLDivElement> = document.getElementsByClassName("icon-container") as HTMLCollectionOf<HTMLDivElement>;
        
        loginButton?.addEventListener("click", () => {
            window.location.href = "create.html"
        });

        usernameInput.addEventListener("input", (event: Event) => {
            const target: HTMLInputElement = event.target as HTMLInputElement;
            
            const iconContainer: HTMLDivElement = iconContainerCollection[0];

            for (let i: number = 0; i < iconContainer.children.length; i++) {
                const icon = iconContainer.children[i] as HTMLElement;
                console.log(icon)
                icon.style.color = this.iconColors[this.iconIndex];

            }

            if (this.iconColors.length > this.iconIndex) {
                this.iconIndex++
            }
        });
    }
}

const signIn: SignIn = new SignIn();
signIn.init();