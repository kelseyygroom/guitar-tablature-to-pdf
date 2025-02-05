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
        this.highEString = [];
        this.bString = [];
        this.gString = [];
        this.dString = [];
        this.aString = [];
        this.eString = [];
        this.displayFretChangeModal = false;
    }

    public init = (): void => {
        this.getUserAccount();
        this.exit();
        this.export();
        this.updateTabCell();
        this.saveTab();
        this.addLine();
        this.removeLine();
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
        usernameLabel.innerHTML = "<i class='fas fa-file-pdf'></i>" + this.tabTitle;
        this.buildTabCellRows();
    };

    private addLine = (): void => {
        const addLineButton: HTMLButtonElement = document.getElementById("add-line-button") as HTMLButtonElement;
        addLineButton.addEventListener("click", () => {
            const tabData: any = this.translateTabCellsToData();
            const heighETabCellContainer: HTMLDivElement = document.getElementById("high-e-string") as HTMLDivElement;
            const bTabCellContainer: HTMLDivElement = document.getElementById("b-string") as HTMLDivElement;
            const gTabCellContainer: HTMLDivElement = document.getElementById("g-string") as HTMLDivElement;
            const dTabCellContainer: HTMLDivElement = document.getElementById("d-string") as HTMLDivElement;
            const aTabCellContainer: HTMLDivElement = document.getElementById("a-string") as HTMLDivElement;
            const eTabCellContainer: HTMLDivElement = document.getElementById("e-string") as HTMLDivElement;
            heighETabCellContainer.innerHTML = "";
            bTabCellContainer.innerHTML = "";
            gTabCellContainer.innerHTML = "";
            dTabCellContainer.innerHTML = "";
            aTabCellContainer.innerHTML = "";
            eTabCellContainer.innerHTML = "";

            this.highEString = tabData.highEString.split("");
            this.highEString.push("-");
            this.bString = tabData.bString.split("");
            this.bString.push("-");
            this.gString = tabData.gString.split("");
            this.gString.push("-");
            this.dString = tabData.dString.split("");
            this.dString.push("-");
            this.aString = tabData.aString.split("");
            this.aString.push("-");
            this.eString = tabData.eString.split("");
            this.eString.push("-");
            this.buildTabCellRows();
        });
    }

    private removeLine = (): void => {
        const removeLineButton: HTMLButtonElement = document.getElementById("remove-line-button") as HTMLButtonElement;
        removeLineButton.addEventListener("click", () => {
            const tabData: any = this.translateTabCellsToData();
            const heighETabCellContainer: HTMLDivElement = document.getElementById("high-e-string") as HTMLDivElement;
            const bTabCellContainer: HTMLDivElement = document.getElementById("b-string") as HTMLDivElement;
            const gTabCellContainer: HTMLDivElement = document.getElementById("g-string") as HTMLDivElement;
            const dTabCellContainer: HTMLDivElement = document.getElementById("d-string") as HTMLDivElement;
            const aTabCellContainer: HTMLDivElement = document.getElementById("a-string") as HTMLDivElement;
            const eTabCellContainer: HTMLDivElement = document.getElementById("e-string") as HTMLDivElement;
            heighETabCellContainer.innerHTML = "";
            bTabCellContainer.innerHTML = "";
            gTabCellContainer.innerHTML = "";
            dTabCellContainer.innerHTML = "";
            aTabCellContainer.innerHTML = "";
            eTabCellContainer.innerHTML = "";

            this.highEString = tabData.highEString.split("");
            this.highEString.pop();
            this.bString = tabData.bString.split("");
            this.bString.pop();
            this.gString = tabData.gString.split("");
            this.gString.pop();
            this.dString = tabData.dString.split("");
            this.dString.pop();
            this.aString = tabData.aString.split("");
            this.aString.pop();
            this.eString = tabData.eString.split("");
            this.eString.pop();
            this.buildTabCellRows();
        });
    }

    private saveTab = () => {
        const saveTabButton: HTMLButtonElement = document.getElementById("save-button") as HTMLButtonElement;

        saveTabButton.addEventListener("click", async () => {
            const tabData: any = this.translateTabCellsToData();
            const response = await fetch(url + "saveTab", {
                method: 'POST',
                headers: {
                  'Content-Type': 'application/json',
                },
                body: JSON.stringify({ tabData, username: this.user.username, title: this.tabTitle })
            })

            if (response) {
                saveTabButton.style.backgroundColor = "#964FF6";
                saveTabButton.classList.add("save-button-acitve");
                saveTabButton.innerHTML = '<i style="color: white; height: 1rem; width: 1rem;" class="fas fa-file"></i>Saved!';
                saveTabButton.style.color = "white";

                setTimeout(() => {
                    saveTabButton.style.color = "black";
                    saveTabButton.style.backgroundColor = "white";
                    saveTabButton.innerHTML = '<i style="height: 1rem; width: 1rem;" class="fas fa-file"></i> Save';
                }, 1000);
            }
        })
    };

    private findLongestString = (rawTabData: any) => {
        const longestString = {
            stringName: "",
            stringLength: 0
        };

        Object.entries(rawTabData).forEach((entry: any) => {
            const name = entry[0];
            const length = entry[1].length;
            if (length > longestString.stringLength) {
                longestString.stringName = name;
                longestString.stringLength = length;
            }
        });

        return longestString.stringLength;
    }

    // Format the tab & handle double digit tab cells.
    private formatTabForPDFExport = (rawTabData: any) => {
        const longestString = this.findLongestString(rawTabData);
        const formattedTab: any = {
            highEString: [],
            bString: [],
            gString: [],
            dString: [],
            aString: [],
            eString: []
        };

        console.log("raw", rawTabData)

        for (let i: number = 0; i < longestString; i++) {
            const highE = rawTabData.highEString[i];
            const b = rawTabData.bString[i];
            const g = rawTabData.gString[i];
            const d = rawTabData.dString[i];
            const a = rawTabData.aString[i];
            const e = rawTabData.eString[i];
            const prevHighE = rawTabData.highEString[i-1];
            const prevB = rawTabData.bString[i-1];
            const prevG = rawTabData.gString[i-1];
            const prevD = rawTabData.dString[i-1];
            const prevA = rawTabData.aString[i-1];
            const prevE = rawTabData.eString[i-1];
            const nextHighE = rawTabData.highEString[i+1];
            const nextB = rawTabData.bString[i+1];
            const nextG = rawTabData.gString[i+1];
            const nextD = rawTabData.dString[i+1];
            const nextA = rawTabData.aString[i+1];
            const nextE = rawTabData.eString[i+1];

            // High E
            if (
                highE !== "}" &&
                highE !== "{"
            ) {
                formattedTab.highEString.push(highE);
                if (prevHighE !== "{" && prevHighE !== "}" && nextHighE !== "}") {
                    formattedTab.highEString.push("-");
                }
            }

            // B
            if (
                b !== "}" &&
                b !== "{"
            ) {
                formattedTab.bString.push(b);
                if (prevB !== "{" && prevB !== "}" && nextB !== "}") {
                    formattedTab.bString.push("-");
                }
            }

            // G
            if (
                g !== "}" &&
                g !== "{"
            ) {
                formattedTab.gString.push(g);
                if (prevG !== "{" && prevG !== "}" && nextG !== "}") {
                    formattedTab.gString.push("-");
                }
            }

            // D
            if (
                d !== "}" &&
                d !== "{"
            ) {
                formattedTab.dString.push(d);
                if (prevD !== "{" && prevD !== "}" && nextD !== "}") {
                    console.log("d", prevD, d)
                    formattedTab.dString.push("-");
                }
            }

            // A
            if (
                a !== "}" &&
                a !== "{"
            ) {
                formattedTab.aString.push(a);
                if (prevA !== "{" && prevA !== "}" && nextA !== "}") {
                    formattedTab.aString.push("-");
                }
            }

            // E
            if (
                e !== "}" &&
                e !== "{"
            ) {
                formattedTab.eString.push(e);
                if (prevE !== "{" && prevE !== "}" && nextE !== "}") {
                    formattedTab.eString.push("-");
                }
            }

            // ADD DASH ///////////////////////////////////////////
        }

        const returnTab = {
            highEString: formattedTab.highEString.join("") + "    " + formattedTab.highEString.length,
            bString: formattedTab.bString.join("") + "    " + formattedTab.bString.length,
            gString: formattedTab.gString.join("") + "    " + formattedTab.gString.length,
            dString: formattedTab.dString.join("") + "    " + formattedTab.dString.length,
            aString: formattedTab.aString.join("") + "    " + formattedTab.aString.length,
            eString: formattedTab.eString.join("") + "    " + formattedTab.eString.length,
        }

        console.log("formatted:", returnTab)

        return returnTab;
    };

    // Export the tab.
    private export = (): void => {
        const exportButton: HTMLButtonElement = document.getElementById("export-button") as HTMLButtonElement;
        exportButton?.addEventListener("click", () => {
            const tabDataRaw: any = this.translateTabCellsToData();
            const tabData: any = this.formatTabForPDFExport(tabDataRaw);
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
        const changeFretButtons: HTMLCollectionOf<HTMLButtonElement> = document.getElementsByClassName("change-fret-button") as HTMLCollectionOf<HTMLButtonElement>;

        for (let i: number = 0; i < changeFretButtons.length; i++) {
            const changeFretInput: HTMLButtonElement = changeFretButtons[i];

            changeFretInput.addEventListener("click", () => {
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
        }
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
            if (tabStringTabCells[i].innerHTML.length == 2) {
                returnString += "{" + tabStringTabCells[i].innerHTML + "}";
            }
            else {
                returnString += tabStringTabCells[i].innerHTML;
            }
        }

        return returnString;
    };

    private translateStringData = (string: string) => {

    };

    // Builds the tabulature string rows.
    private buildTabCellRows = (): void => {
        let tempCell = "";
        let tempActive = false;

        // High E String
        this.highEString.forEach((tabCell: string, index: number) => {
            if (tabCell === "{") {
                tempActive = true;
            }
            else if (tabCell === "}") {
                tempActive = false;
                this.buildTabCellElement(tempCell, "high-e", index)
                tempCell = "";
            }

            if (tabCell === "{" || tabCell === "}") {
                return;
            }
            else if (tempActive) {
                tempCell += tabCell;
            }
            else {
                this.buildTabCellElement(tabCell, "high-e", index)
            }
        });

        // B String
        this.bString.forEach((tabCell: string, index: number) => {
            if (tabCell === "{") {
                tempActive = true;
            }
            else if (tabCell === "}") {
                tempActive = false;
                this.buildTabCellElement(tempCell, "b", index)
                tempCell = "";
            }

            if (tabCell === "{" || tabCell === "}") {
                return;
            }
            else if (tempActive) {
                tempCell += tabCell;
            }
            else {
                this.buildTabCellElement(tabCell, "b", index)
            }
        });

        // G String
        this.gString.forEach((tabCell: string, index: number) => {
            if (tabCell === "{") {
                tempActive = true;
            }
            else if (tabCell === "}") {
                tempActive = false;
                this.buildTabCellElement(tempCell, "g", index)
                tempCell = "";
            }

            if (tabCell === "{" || tabCell === "}") {
                return;
            }
            else if (tempActive) {
                tempCell += tabCell;
            }
            else {
                this.buildTabCellElement(tabCell, "g", index)
            }
        });

        // D String
        this.dString.forEach((tabCell: string, index: number) => {
            if (tabCell === "{") {
                tempActive = true;
            }
            else if (tabCell === "}") {
                tempActive = false;
                this.buildTabCellElement(tempCell, "d", index)
                tempCell = "";
                tempCell = "";
            }

            if (tabCell === "{" || tabCell === "}") {
                return;
            }
            else if (tempActive) {
                tempCell += tabCell;
            }
            else {
                this.buildTabCellElement(tabCell, "d", index)
            }
        });

        // A String
        this.aString.forEach((tabCell: string, index: number) => {
            if (tabCell === "{") {
                tempActive = true;
            }
            else if (tabCell === "}") {
                tempActive = false;
                this.buildTabCellElement(tempCell, "a", index)
                tempCell = "";
            }

            if (tabCell === "{" || tabCell === "}") {
                return;
            }
            else if (tempActive) {
                tempCell += tabCell;
            }
            else {
                this.buildTabCellElement(tabCell, "a", index)
            }
        });

        // E String
        this.eString.forEach((tabCell: string, index: number) => {
            if (tabCell === "{") {
                tempActive = true;
            }
            else if (tabCell === "}") {
                tempActive = false;
                this.buildTabCellElement(tempCell, "e", index)
                tempCell = "";
            }

            if (tabCell === "{" || tabCell === "}") {
                return;
            }
            else if (tempActive) {
                tempCell += tabCell;
            }
            else {
                this.buildTabCellElement(tabCell, "e", index)
            }
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