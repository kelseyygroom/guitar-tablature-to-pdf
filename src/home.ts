// I started to speed through this, it's 4am and I'm just trying to get it done at this point. I want to deploy a working prototype already! 
// I'll clean this up later, I promise!
class Home {
    private user;
    private tabs: any[];
    constructor() {
        this.user = { username: "" };
        this.tabs = [];
    }

    public init = () => {
        this.getUserAccount();
    };

    private displayTabsList = () => {
        console.log(this.tabs)
        const tabListContainer: HTMLDivElement = document.getElementById("tab-list-container") as HTMLDivElement;
        this.tabs.forEach(tab => {
            console.log("tab", tab)
            const listItem = document.createElement("li");
            listItem.id = "tab-title-" + tab.tab.tabTitle;
            listItem.innerHTML = tab.tab.tabTitle;
            listItem.onclick = () => {
                this.openCreatePage(tab.tab.tabTitle);
            }
            tabListContainer.append(listItem);
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

        const userAccount = await fetch("http://localhost:5000/getUserAccount?username=" + username)
        const userAccountData = await userAccount.json()
        this.user = userAccountData;
        this.tabs = userAccountData.tabs
        this.displayTabsList();
    }
}

const home: Home = new Home();
home.init();