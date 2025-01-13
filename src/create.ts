import './create.css';
import jsPDF from "jspdf";
const url = "https://guitar-tablature-to-pdf-147ddb720da0.herokuapp.com/";
// const url = "http://localhost:5000/";

class Create {
    private user: any;
    private tabTitle: string;
    private highEString: string[];
    private bString: string[];
    private gString: string[];
    private dString: string[];
    private aString: string[];
    private eString: string[];
    private displayFretChangeModal: boolean;

    constructor() {
        this.user = { username: "Guest" };
        this.tabTitle = "";
        this.highEString = ["-", "-", "-", "-", "-", "-", "-", "-", "-", "-", "-", "-"];
        this.bString = ["-", "-", "-", "-", "-", "-", "-", "-", "-", "-", "-", "-"];
        this.gString = ["-", "-", "-", "-", "-", "-", "-", "-", "-", "-", "-", "-"];
        this.dString = ["-", "-", "-", "-", "-", "-", "-", "-", "-", "-", "-", "-"];
        this.aString = ["-", "-", "-", "-", "-", "-", "-", "-", "-", "-", "-", "-"];
        this.eString = ["-", "-", "-", "-", "-", "-", "-", "-", "-", "-", "-", "-"];
        this.displayFretChangeModal = false;
    }

    public init = (): void => {
        this.getUserAccount();
        this.exit();
        this.export();
        this.updateTabCell();
        this.saveTab();
        this.addLine();
        this.listenForModalClose();
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
        this.user = userAccountData;
        this.loadTab();
    }

    // Return to home page.
    private exit = (): void => {
        const exitButton: HTMLButtonElement = document.getElementById("home-button") as HTMLButtonElement;
        exitButton?.addEventListener("click", () => {
            window.location.href = "home.html?username=" + this.user.username;
        });
    };

    private loadTab = () => {
        const queryString = window.location.search;
        const params = new URLSearchParams(queryString);
        const title = params.get('title');
        this.tabTitle = title!;
        const tab = this.user.tabs.find((tab: any) => { return tab.tabTitle === title});

        if (tab) {
            this.highEString = tab.tabData.highEString.split("");
            this.bString = tab.tabData.bString.split("");
            this.gString = tab.tabData.gString.split("");
            this.dString = tab.tabData.dString.split("");
            this.aString = tab.tabData.aString.split("");
            this.eString = tab.tabData.eString.split("");
        }

        const usernameLabel: HTMLDivElement = document.getElementById("username-label") as HTMLDivElement;
        usernameLabel.innerHTML = this.tabTitle;
        this.buildTabCellRows();
    };

    private addLine = (): void => {
        const addLineButton: HTMLButtonElement = document.getElementById("add-line-button") as HTMLButtonElement;
        addLineButton.addEventListener("click", () => {
            console.log("connect")
            // let temphighEArray = this.highEString;
            // let tempbArray = this.bString;
            // let tempgArray = this.gString;
            // let tempdArray = this.dString;
            // let tempaArray = this.aString;
            // let tempeArray = this.eString;
            // this.highEString.push("-");
            // this.bString.push("-");
            // this.gString.push("-");
            // this.dString.push("-");
            // this.aString.push("-");
            // this.eString.push("-");
            this.buildTabCellRows();
        });
    }

    private saveTab = () => {
        const saveTabButton: HTMLButtonElement = document.getElementById("save-button") as HTMLButtonElement;

        saveTabButton.addEventListener("click", () => {
            const tabData: any = this.translateTabCellsToData();
            fetch(url + "saveTab", {
                method: 'POST',
                headers: {
                  'Content-Type': 'application/json',
                },
                body: JSON.stringify({ tabData, username: this.user.username, title: this.tabTitle })
            })
        })
    };

    // Export the tab.
    private export = (): void => {
        const exportButton: HTMLButtonElement = document.getElementById("export-button") as HTMLButtonElement;
        exportButton?.addEventListener("click", () => {
            const tabData: any = this.translateTabCellsToData();
            const doc = new jsPDF();
            doc.setFont("courier", "normal");
            let index: number = 0;
            const initialRange: number = 50
            let range: number = initialRange;
            const loopRange: number = Math.ceil(tabData.highEString.length / range);

            for (let i: number = 0; i < loopRange; i++) {
                doc.text([
                    "e| ", 
                    "b| ", 
                    "g| ", 
                    "d| ",
                    "a| ",
                    "e| "
                ], 10, range - 40);

                doc.text([
                    tabData.highEString.slice(index, range), 
                    tabData.bString.slice(index, range), 
                    tabData.gString.slice(index, range), 
                    tabData.dString.slice(index, range),
                    tabData.aString.slice(index, range),
                    tabData.eString.slice(index, range)
                ], 20, range - 40);

                index = index + initialRange;
                range = range + initialRange;
            }

            doc.save(this.tabTitle);
        });
    };

    private updateTabCell = (): void => {
        const changeFretInput: HTMLSelectElement = document.getElementById("change-fret-input") as HTMLSelectElement;

        changeFretInput.addEventListener("change", () => {
            const tabCellCollection: HTMLCollectionOf<HTMLElement> = document.getElementsByClassName("tab-cell-active") as HTMLCollectionOf<HTMLElement>;
            const tabCell: HTMLElement = tabCellCollection[0] as HTMLElement;
            const currentNoteDisplay: HTMLElement = document.getElementById("current-note") as HTMLElement;

            if (tabCell !== undefined && tabCell !== null) {
                const newFret: string = changeFretInput.value;
                tabCell.innerHTML = newFret;
                currentNoteDisplay.innerHTML = newFret;
                if (tabCell.innerHTML !== "-") {
                    // tabCell.style.backgroundColor = "#1D1D1F";
                }
            };
        });
    };

    private translateTabCellsToData = (): object => {
        const tab: object = {
            highEString: this.translateTabCellString("high-e"),
            bString: this.translateTabCellString("b"),
            gString: this.translateTabCellString("g"),
            dString: this.translateTabCellString("d"),
            aString: this.translateTabCellString("a"),
            eString: this.translateTabCellString("e")
        };

        return tab;
    };

    private translateTabCellString = (string: string) => {
        const tabString = document.getElementById(string + "-string");
        const tabStringTabCells = tabString?.children!;
        let returnString = "";

        for (let i: number = 0; i < tabStringTabCells.length; i++) {
            returnString += tabStringTabCells[i].innerHTML;
        }

        return returnString;
    };

    // Builds the tabulature string rows.
    private buildTabCellRows = (): void => {
        // High E String
        this.highEString.forEach((tabCell: string, index: number) => {
            this.buildTabCellElement(tabCell, "high-e", index)
        });

        // B String
        this.bString.forEach((tabCell: string, index: number) => {
            this.buildTabCellElement(tabCell, "b", index)
        });

        // G String
        this.gString.forEach((tabCell: string, index: number) => {
            this.buildTabCellElement(tabCell, "g", index)
        });

        // D String
        this.dString.forEach((tabCell: string, index: number) => {
            this.buildTabCellElement(tabCell, "d", index)
        });

        // A String
        this.aString.forEach((tabCell: string, index: number) => {
            this.buildTabCellElement(tabCell, "a", index)
        });

        // E String
        this.eString.forEach((tabCell: string, index: number) => {
            this.buildTabCellElement(tabCell, "e", index)
        });
    }

    private listenForModalClose = () => {
        const changeFretModal: HTMLDivElement = document.getElementById("change-fret-modal") as HTMLDivElement;

        window.addEventListener("click", (event) => {
            const activeTabCells: HTMLCollectionOf<HTMLDivElement> = document.getElementsByClassName("tab-cell-active") as HTMLCollectionOf<HTMLDivElement>;

            // @ts-ignore
            if (!changeFretModal.contains(event.target) && this.displayFretChangeModal) {
                for (let i: number = 0; i < activeTabCells.length; i++) {
                    if (activeTabCells[i].innerHTML !== "-") {
                        activeTabCells[i].style.opacity = "1";
                    }

                    activeTabCells[i].classList.remove("tab-cell-active")
                }

                // Click occurred outside the element
                changeFretModal.style.display = "none";
            setTimeout(() => {
                this.displayFretChangeModal = false;
            }, 500);            }
        })
    }

    // Builds the individual Tab Cell element and appends it to its corresponding string container.
    private buildTabCellElement = (tabDataString: string, stringName: string, position: number): void => {
        const tabCellContainer = document.getElementById(stringName + "-string")
        const tabCell = document.createElement("div");
        const tabDisplay = document.getElementById("current-note") as HTMLElement;
        tabCell.innerHTML += tabDataString;
        tabCell.id = stringName + position;
        tabCell.classList.add("tab-cell")

        if (tabCell.innerHTML === "-") {
            tabCell.style.opacity = ".6";
        }

        tabCell.addEventListener("click", () => {
            const activeTabCells: HTMLCollectionOf<HTMLDivElement> = document.getElementsByClassName("tab-cell-active") as HTMLCollectionOf<HTMLDivElement>;
            const changeFretModal: HTMLDivElement = document.getElementById("change-fret-modal") as HTMLDivElement;

            for (let i: number = 0; i < activeTabCells.length; i++) {
                activeTabCells[i].classList.remove("tab-cell-active")
            }
            tabCell.classList.add("tab-cell-active")
            tabDisplay!.innerHTML = tabCell.innerHTML;
            changeFretModal.style.display = "flex";
            setTimeout(() => {
                this.displayFretChangeModal = true;
            }, 500);
        });

        tabCellContainer?.append(tabCell);
    }
}

const create: Create = new Create();
create.init();