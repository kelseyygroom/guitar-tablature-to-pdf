import "./home.css"
import emblem from './images/main-logo.svg'
const url = process.env.SERVER_URL;
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
        if (!body) return;
        body.style.background = "url(" + emblem + ")";
        body.style.backgroundRepeat = "no-repeat";
        body.style.backgroundPosition = "center";
        body.style.height = "100vh";
        this.getUserAccount();
        this.createNewTab();
        this.reloadPage();
    };

    private openPopUpModal = (htmlString: string) => {
        const popupModal: HTMLDivElement = document.getElementById("popup-modal") as HTMLDivElement;
        const popupModalOverlay: HTMLDivElement = document.getElementById("popup-modal-overlay") as HTMLDivElement;
        popupModal.innerHTML = htmlString;
        const cancelButton: HTMLButtonElement = document.getElementById("cancel-button") as HTMLButtonElement;
        cancelButton.addEventListener("click", () => {
            this.closePopupModal();
        })

        popupModal.style.display = "flex";
        popupModalOverlay.style.display = "flex";
    };

    private addDeleteButtonListeners = () => {
        const deleteButtons: HTMLCollectionOf<HTMLElement> = document.getElementsByClassName("delete-icon") as HTMLCollectionOf<HTMLElement>;

        for (let i: number = 0; i < deleteButtons.length; i++) {
            const deleteButton: HTMLElement = deleteButtons[i] as HTMLElement;

            deleteButton.addEventListener("click", (event: any) => {
                this.deleteTab(deleteButton);
            });
        }
    };

    private checkForEmptyTabs = () => {
        if (this.user.tabs.length === 0) {
            const createNewTabButton: HTMLElement = document.getElementById("create-tab-button") as HTMLElement;
            createNewTabButton.classList.add("notify");
        }
    };

    private displayTabsList = () => {
        const tabListContainer: HTMLDivElement = document.getElementById("tab-list-container") as HTMLDivElement;
        const loadingIcon: HTMLElement = document.getElementById("loading-icon") as HTMLElement;

        loadingIcon.style.display = "none";

        this.tabs.forEach(tab => {
            const listItem = document.createElement("li");

            // Create the tab title list item.
            listItem.id = "tab-title-" + tab.tabTitle;
            listItem.className = "list-item";

            // Indicate to user when video is ready for download.
            if (tab.videoS3URL && tab.videoS3URL.length >= 1) {
                const existingURL = window.localStorage.getItem(tab.videoS3URL);

                if (existingURL) {
                    listItem.innerHTML = '<a download href="' + tab.videoS3URL[0] + '"><i style="position: absolute; height: 1rem; width: 1rem; left: 1rem; top: calc(50% - .5rem);" class="fas fa-video"></i></a>';    
                }
                else {
                    const label: HTMLLabelElement = document.createElement("label") as HTMLLabelElement;
                    const cancelButton: HTMLButtonElement = document.createElement("button") as HTMLButtonElement;
                    label.style.color = "white";
                    label.innerHTML = "Your \"" + tab.tabTitle + "\" video is ready! Click the flashing green video icon to download it.";
                    cancelButton.innerHTML = "Cool!";
                    cancelButton.id = "cancel-button";
                    this.openPopUpModal(label.outerHTML + cancelButton.outerHTML);
                    window.localStorage.setItem(tab.videoS3URL, "true");
                    listItem.innerHTML = '<a download href="' + tab.videoS3URL[0] + '"><i style="position: absolute; height: 1rem; width: 1rem; left: 1rem; top: calc(50% - .5rem);" class="fas fa-video notify-icon"></i></a>';    
                }
            }
            else {
                listItem.innerHTML = '<i style="position: absolute; height: 1rem; width: 1rem; left: 1rem;" class="fa-solid fa-guitar"></i>';
            }

            listItem.innerHTML += '<p>' + tab.tabTitle + '</p><i id="' + tab.tabTitle + '-icon" style="position: absolute; height: 1rem; width: 1rem; right: 1rem;" class="delete-icon fas fa-trash-can"></i>';

            // Open the create page when the Tab title is selected.
            const openCreatePageButton = listItem.children[1] as HTMLElement;
            openCreatePageButton.onclick = () => {
                this.openCreatePage(tab.tabTitle);
            }

            tabListContainer.append(listItem);
        })
    };

    private checkIfTabExists = (title: string) => {
        let tabExists = false;

        if (this.user.tabs.length > 1) {
            this.user.tabs.forEach((tab: any) => {
                if (tab.tabTitle === title) {
                    tabExists = true;
                }
            })
        }

        return tabExists;
    };

    private addNewTabToDb = () => {
        const createButton: HTMLButtonElement = document.getElementById("create-button") as HTMLButtonElement;
        createButton.addEventListener("click", () => {
            const createInput: HTMLInputElement = document.getElementById("create-new-tab-input") as HTMLInputElement;
            const title = createInput.value;

            if (title.length > 1) {
                if (this.checkIfTabExists(title)) {
                    const createErrorLabel: HTMLLabelElement = document.getElementById("create-error-label") as HTMLLabelElement;
                    createErrorLabel.style.display = "flex";
                    return
                }

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
                        tabTitle: title,
                    })
                });
                window.location.href = "create.html?username=" + this.user.username + "&title=" + title;
            };
        });
    }

    private reloadPage = () => {
        const reloadButton: HTMLDivElement = document.getElementById("reload-icon") as HTMLDivElement;

        reloadButton.addEventListener("click", () => {
            window.location.reload();
        })
    }

    private closePopupModal = () => {
        const popupModal: HTMLDivElement = document.getElementById("popup-modal") as HTMLDivElement;
        const popupModalOverlay: HTMLDivElement = document.getElementById("popup-modal-overlay") as HTMLDivElement;

        popupModal.innerHTML = "";
        popupModal.style.display = "none";
        popupModalOverlay.style.display = "none";
    }

    private createNewTab = () => {
        const createNewTabButton: HTMLButtonElement = document.getElementById('create-tab-button') as HTMLButtonElement;

        createNewTabButton.addEventListener("click", () => {
            const createLabel: HTMLInputElement = document.createElement("h4") as HTMLInputElement;
            const createErrorLabel: HTMLLabelElement = document.createElement("label") as HTMLLabelElement;
            const createInput: HTMLInputElement = document.createElement("input") as HTMLInputElement;
            const createButton: HTMLButtonElement = document.createElement("button") as HTMLButtonElement;
            const cancelButton: HTMLButtonElement = document.createElement("button") as HTMLButtonElement;
            cancelButton.innerHTML = "Cancel";
            cancelButton.id = "cancel-button";
            createErrorLabel.innerHTML = "This Title is already taken.";
            cancelButton.innerHTML = "Cancel";
            createErrorLabel.id = "create-error-label";
            createButton.innerHTML = "Create";
            createButton.id = "create-button";
            createLabel.innerHTML = "What would you like to name your tab?";
            createLabel.id = "create-label";
            createInput.id = "create-new-tab-input";
            createInput.placeholder = "Title";
            this.openPopUpModal(createLabel.outerHTML + createInput.outerHTML + createErrorLabel.outerHTML + createButton.outerHTML + cancelButton.outerHTML);
            this.addNewTabToDb();
            // cancelButton.addEventListener("click", () => {
            //     // TODO
            // })
        });
    };

    private openCreatePage = (title: string) => {
        window.location.href = "/create.html?username=" + this.user.username + "&title=" + title;
    };

    private highlightTutorial = () => {
        const tutorialBox: HTMLDivElement = document.getElementById("tab-title-Tutorial") as HTMLDivElement;

        if (tutorialBox) {
            const firstTimeTutorial = window.localStorage.getItem("Tutorial");

            if (firstTimeTutorial !== "true") {
                setTimeout(() => {
                    tutorialBox.style.backgroundColor = "#23FE69";
    
                    setTimeout(() => {
                        tutorialBox.style.backgroundColor = "rgba(43, 43, 43, 0.2)";
                    }, 2000);
                }, 1500);

                window.localStorage.setItem("Tutorial", "true");
            }
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
        userAccountLabel.innerHTML = userAccountData.username.length >= 1 ? userAccountData.username : "Test User";
        // Include this icon when you create the menu.
        //  + "<i class='fas fa-bars'></i>";
        this.user = userAccountData;
        this.tabs = userAccountData.tabs
        this.displayTabsList();
        this.highlightTutorial();
        this.addDeleteButtonListeners();
        this.checkForEmptyTabs();
    }

    // Delete the tab based on the list-item delete-icon that was clicked.
    private deleteTab = async (deleteTabButton: HTMLElement) => {
        const tabTitle: string = deleteTabButton.id.split("-")[0];
        const response = await fetch(url + "deleteTab", {
            method: 'POST',
            headers: {
                'Content-Type': 'application/json',
            },
            body: JSON.stringify({ username: this.user.username, title: tabTitle })
        })

        if (response) {
            const listItem: HTMLDataListElement = document.getElementById("tab-title-" + tabTitle) as HTMLDataListElement;
            listItem.style.display = "none";
        }
    };
}

const home: Home = new Home();
home.init();