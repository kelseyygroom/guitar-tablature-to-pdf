import "./home.css"
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
            listItem.innerHTML = '<i style="color: black; height: 1rem; width: 1rem; margin-right: 1rem;" class="fa-solid fa-guitar"></i>' + tab.tabTitle;
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

    private getUserAccount = async () => {
        // Get the query string from the URL
        const queryString = window.location.search; // For the current page

        // Use URLSearchParams to parse the query string
        const params = new URLSearchParams(queryString);

        // Get individual parameters by name
        const username = params.get('username');

        const userAccount = await fetch(url + "getUserAccount?username=" + username)
        const userAccountData = await userAccount.json()
        const userAccountLabel: HTMLElement = document.getElementById('username-label') as HTMLElement;
        userAccountLabel.innerHTML = "Welcome " + userAccountData.username + "<i class='fas fa-user'></i>";
        this.user = userAccountData;
        this.tabs = userAccountData.tabs
        this.displayTabsList();
    }
}

const home: Home = new Home();
home.init();