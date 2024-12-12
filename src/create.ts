import './create.css';
import jsPDF from "jspdf";

class Create {
    private highEString: string[];
    private bString: string[];
    private gString: string[];
    private dString: string[];
    private aString: string[];
    private eString: string[];

    constructor() {
        this.highEString = ["0", "-", "0", "-", "1", "1", "1", "1", "1", "1", "1", "1", "1", "1", "1", "1", "1", "1", "1", "1", "1", "1", "1", "1", "1", "1", "1", "1", "1", "2", "-", "-", "-", "-", "-", "-", "-", "-", "-", "-"];
        this.bString = ["0", "-", "0", "-", "1", "1", "1", "1", "1", "1", "1", "1", "1", "1", "1", "1", "1", "1", "1", "1", "1", "1", "1", "1", "1", "1", "1", "1", "1", "2", "-", "-", "-", "-", "-", "-", "-", "-", "-", "-"];
        this.gString = ["0", "-", "0", "-", "1", "1", "1", "1", "1", "1", "1", "1", "1", "1", "1", "1", "1", "1", "1", "1", "1", "1", "1", "1", "1", "1", "1", "1", "1", "2", "-", "-", "-", "-", "-", "-", "-", "-", "-", "-"];
        this.dString = ["2", "-", "2", "-", "1", "1", "1", "1", "1", "1", "1", "1", "1", "1", "1", "1", "1", "1", "1", "1", "1", "1", "1", "1", "1", "1", "1", "1", "1", "2", "-", "-", "-", "-", "-", "-", "-", "-", "-", "-"];
        this.aString = ["2", "-", "2", "-", "1", "1", "1", "1", "1", "1", "1", "1", "1", "1", "1", "1", "1", "1", "1", "1", "1", "1", "1", "1", "1", "1", "1", "1", "1", "2", "-", "-", "-", "-", "-", "-", "-", "-", "-", "-"];
        this.eString = ["0", "-", "0", "-", "1", "1", "1", "1", "1", "1", "1", "1", "1", "1", "1", "1", "1", "1", "1", "1", "1", "1", "1", "1", "1", "1", "1", "1", "1", "2", "-", "-", "-", "-", "-", "-", "-", "-", "-", "-"];
    }

    public init = (): void => {
        this.exit();
        this.export();
        this.buildTabCellRows();
        this.updateTabCell();
    };

    // Return to home page.
    private exit = (): void => {
        const exitButton: HTMLButtonElement = document.getElementById("home-button") as HTMLButtonElement;
        exitButton?.addEventListener("click", () => {
            window.location.href = "index.html"
        });
    };

    // Export the tab.
    private export = (): void => {
        const exportButton: HTMLButtonElement = document.getElementById("export-button") as HTMLButtonElement;
        exportButton?.addEventListener("click", () => {
            const tabData: any = this.translateTabCellsToData();
            console.log(tabData)
            const doc = new jsPDF();
            doc.text([
                tabData.highEString, 
                tabData.bString, 
                tabData.gString, 
                tabData.dString,
                tabData.aString,
                tabData.eString
            ], 10, 10);
            doc.save("myPDF.pdf");
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

        console.log("tab", tab)
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

    // Builds the individual Tab Cell element and appends it to its corresponding string container.
    private buildTabCellElement = (tabDataString: string, stringName: string, position: number): void => {
        const tabCellContainer = document.getElementById(stringName + "-string")
        const tabCell = document.createElement("div");
        const tabDisplay = document.getElementById("current-note") as HTMLElement;
        tabCell.innerHTML += tabDataString;
        tabCell.id = stringName + position;
        tabCell.classList.add("tab-cell")

        tabCell.addEventListener("click", () => {
            const activeTabCells = document.getElementsByClassName("tab-cell-active");

            for (let i: number = 0; i < activeTabCells.length; i++) {
                activeTabCells[i].classList.remove("tab-cell-active")
            }
            tabCell.classList.add("tab-cell-active")
            tabDisplay!.innerHTML = tabCell.innerHTML;
        });

        tabCellContainer?.append(tabCell);
    }
}

const create: Create = new Create();
create.init();