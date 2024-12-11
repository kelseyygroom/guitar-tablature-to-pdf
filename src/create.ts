import './create.css';

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
        this.buildTabCellRows();
    };

    private exit = (): void => {
        const exitButton: HTMLButtonElement = document.getElementById("home-button") as HTMLButtonElement;
        exitButton?.addEventListener("click", () => {
            window.location.href = "index.html"
        });
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

    // Builds the individual tabulature string element or "button" and appends it to its corresponding string container.
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