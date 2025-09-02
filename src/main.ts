import './styles.css';
import logo from "./images/landing-logo.svg"
import { v4 as uuidv4 } from 'uuid';
const url = process.env.SERVER_URL;

class SignIn {
    constructor() {
        this.setLogo();
    }

    private setLogo = () => {
        const logoImage: HTMLImageElement = document.getElementById("logo") as HTMLImageElement;
        if (!logoImage) return;
        logoImage.src = logo;
    };

    public init = (): void => {
        const guestButton: HTMLButtonElement = document.getElementById("try-as-guest-button") as HTMLButtonElement;
        const guestID: string = "Guest-" + uuidv4();
        
        guestButton?.addEventListener("click", async () => {
            const createUserResponse = await fetch(url + `createAccount`, {
                method: 'POST',
                headers: {
                  'Content-Type': 'application/json',
                },
                body: JSON.stringify({ username: guestID, password: guestID, email: "Guest" })
            });
            window.location.replace("/home.html?username=" + guestID)
        });
    }
}

const signIn: SignIn = new SignIn();
signIn.init();