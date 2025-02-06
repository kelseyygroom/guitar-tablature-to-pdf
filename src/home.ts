import "./home.css"
import logo from "./images/logo.svg"
import emblem from './images/emblem.svg'
const url = "https://guitar-tablature-to-pdf-147ddb720da0.herokuapp.com/";
// const url = "http://localhost:5000/";

// I started to speed through this, it's 4am and I'm just trying to get it done at this point. I want to deploy a working prototype already! 
// I'll clean this up later, I promise!
class Home {
    private user;
    private tabs: any[];
    constructor() {
        this.user = { username: "", tabs: [] };
        this.tabs = [];
    }

    public init = () => {
        const body: HTMLBodyElement = document.querySelector("body") as HTMLBodyElement;
        body.style.background = "url(" + emblem + ")";
        body.style.backgroundRepeat = "no-repeat";
        body.style.backgroundPosition = "center";
        body.style.height = "100vh";
        this.getUserAccount();
        this.createNewTab();
    };

    private displayTabsList = () => {
        const tabListContainer: HTMLDivElement = document.getElementById("tab-list-container") as HTMLDivElement;
        const loadingIcon: HTMLElement = document.getElementById("loading-icon") as HTMLElement;

        loadingIcon.style.display = "none";
        this.tabs.forEach(tab => {
            const listItem = document.createElement("li");
            listItem.id = "tab-title-" + tab.tabTitle;
            listItem.className = "list-item"
            listItem.innerHTML = '<i style="height: 1rem; width: 1rem; margin-right: 1rem;" class="fa-solid fa-guitar"></i>' + tab.tabTitle;
            listItem.onclick = () => {
                this.openCreatePage(tab.tabTitle);
            }
            tabListContainer.append(listItem);
        })
    };

    private checkIfTabExists = (title: string) => {
        if (this.user.tabs.length > 1) {
            this.user.tabs.forEach((tab: any) => {
                console.log(tab)
                if (tab.tabTitle === title) {
                    tab
                }
            })
        }
    };

    private createNewTab = () => {
        const createNewTabButton: HTMLButtonElement = document.getElementById('create-tab-button') as HTMLButtonElement;

        createNewTabButton.addEventListener("click", () => {
            const title: string | null = prompt("Enter Title", "");

            if (title) {
                this.checkIfTabExists(title)
                fetch(url + "saveTab", {
                    method: 'POST',
                    headers: {
                    'Content-Type': 'application/json',
                    },
                    body: JSON.stringify({ 
                        username: this.user.username,
                        tabData: {
                            highEString: "-----",
                            bString: "-----",
                            gString: "-----",
                            dString: "-----",
                            aString: "-----",
                            eString: "-----"
                        }, 
                        title,
                    })
                });
                window.location.href = "create.html?username=" + this.user.username + "&title=" + title;
            }
        })
    };

    private openCreatePage = (title: string) => {
        window.location.href = "/create.html?username=" + this.user.username + "&title=" + title;
    };

    private highlightTutorial = () => {
        const tutorialBox: HTMLDivElement = document.getElementById("tab-title-Tutorial") as HTMLDivElement;

        if (tutorialBox) {
            setTimeout(() => {
                tutorialBox.style.backgroundColor = "#23FE69";

                setTimeout(() => {
                    tutorialBox.style.backgroundColor = "rgba(255, 255, 255, 0.2)";
                }, 2000);
            }, 1500);
        }
    };

    private getUserAccount = async () => {
        const queryString = window.location.search; // For the current page
        const params = new URLSearchParams(queryString);
        const username = params.get('username');
        const userAccount = await fetch(url + "getUserAccount?username=" + username)
        const userAccountData = await userAccount.json()
        const userAccountLabel: HTMLElement = document.getElementById('username-label') as HTMLElement;

        // Set user account image and name.
        userAccountLabel.innerHTML = userAccountData.username + "<img style='margin-right: 0px; width: 2rem;' src='" + logo + "'></img>";
        this.user = userAccountData;
        this.tabs = userAccountData.tabs
        this.displayTabsList();
        this.highlightTutorial();
    }
}

const home: Home = new Home();
home.init();