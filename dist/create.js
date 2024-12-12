import './create.css';
class Create {
    constructor() {
        this.init = () => {
            this.exit();
            this.export();
            this.buildTabCellRows();
            this.updateTabCell();
        };
        // Return to home page.
        this.exit = () => {
            const exitButton = document.getElementById("home-button");
            exitButton === null || exitButton === void 0 ? void 0 : exitButton.addEventListener("click", () => {
                window.location.href = "index.html";
            });
        };
        // Export the tab.
        this.export = () => {
            const exportButton = document.getElementById("export-button");
            exportButton === null || exportButton === void 0 ? void 0 : exportButton.addEventListener("click", () => {
                this.translateTabCellsToData();
            });
        };
        this.updateTabCell = () => {
            const changeFretInput = document.getElementById("change-fret-input");
            changeFretInput.addEventListener("change", () => {
                const tabCellCollection = document.getElementsByClassName("tab-cell-active");
                const tabCell = tabCellCollection[0];
                const currentNoteDisplay = document.getElementById("current-note");
                if (tabCell !== undefined && tabCell !== null) {
                    const newFret = changeFretInput.value;
                    tabCell.innerHTML = newFret;
                    currentNoteDisplay.innerHTML = newFret;
                }
                ;
            });
        };
        this.translateTabCellsToData = () => {
            const tab = {
                highEString: this.translateTabCellString("high-e"),
                bString: this.translateTabCellString("b"),
                gString: this.translateTabCellString("g"),
                dString: this.translateTabCellString("d"),
                aString: this.translateTabCellString("a"),
                eString: this.translateTabCellString("e")
            };
            console.log("tab", tab);
            return tab;
        };
        this.translateTabCellString = (string) => {
            const tabString = document.getElementById(string + "-string");
            const tabStringTabCells = tabString === null || tabString === void 0 ? void 0 : tabString.children;
            let returnString = "";
            for (let i = 0; i < tabStringTabCells.length; i++) {
                returnString += tabStringTabCells[i].innerHTML;
            }
            return returnString;
        };
        // Builds the tabulature string rows.
        this.buildTabCellRows = () => {
            // High E String
            this.highEString.forEach((tabCell, index) => {
                this.buildTabCellElement(tabCell, "high-e", index);
            });
            // B String
            this.bString.forEach((tabCell, index) => {
                this.buildTabCellElement(tabCell, "b", index);
            });
            // G String
            this.gString.forEach((tabCell, index) => {
                this.buildTabCellElement(tabCell, "g", index);
            });
            // D String
            this.dString.forEach((tabCell, index) => {
                this.buildTabCellElement(tabCell, "d", index);
            });
            // A String
            this.aString.forEach((tabCell, index) => {
                this.buildTabCellElement(tabCell, "a", index);
            });
            // E String
            this.eString.forEach((tabCell, index) => {
                this.buildTabCellElement(tabCell, "e", index);
            });
        };
        // Builds the individual Tab Cell element and appends it to its corresponding string container.
        this.buildTabCellElement = (tabDataString, stringName, position) => {
            const tabCellContainer = document.getElementById(stringName + "-string");
            const tabCell = document.createElement("div");
            const tabDisplay = document.getElementById("current-note");
            tabCell.innerHTML += tabDataString;
            tabCell.id = stringName + position;
            tabCell.classList.add("tab-cell");
            tabCell.addEventListener("click", () => {
                const activeTabCells = document.getElementsByClassName("tab-cell-active");
                for (let i = 0; i < activeTabCells.length; i++) {
                    activeTabCells[i].classList.remove("tab-cell-active");
                }
                tabCell.classList.add("tab-cell-active");
                tabDisplay.innerHTML = tabCell.innerHTML;
            });
            tabCellContainer === null || tabCellContainer === void 0 ? void 0 : tabCellContainer.append(tabCell);
        };
        this.highEString = ["0", "-", "0", "-", "1", "1", "1", "1", "1", "1", "1", "1", "1", "1", "1", "1", "1", "1", "1", "1", "1", "1", "1", "1", "1", "1", "1", "1", "1", "2", "-", "-", "-", "-", "-", "-", "-", "-", "-", "-"];
        this.bString = ["0", "-", "0", "-", "1", "1", "1", "1", "1", "1", "1", "1", "1", "1", "1", "1", "1", "1", "1", "1", "1", "1", "1", "1", "1", "1", "1", "1", "1", "2", "-", "-", "-", "-", "-", "-", "-", "-", "-", "-"];
        this.gString = ["0", "-", "0", "-", "1", "1", "1", "1", "1", "1", "1", "1", "1", "1", "1", "1", "1", "1", "1", "1", "1", "1", "1", "1", "1", "1", "1", "1", "1", "2", "-", "-", "-", "-", "-", "-", "-", "-", "-", "-"];
        this.dString = ["2", "-", "2", "-", "1", "1", "1", "1", "1", "1", "1", "1", "1", "1", "1", "1", "1", "1", "1", "1", "1", "1", "1", "1", "1", "1", "1", "1", "1", "2", "-", "-", "-", "-", "-", "-", "-", "-", "-", "-"];
        this.aString = ["2", "-", "2", "-", "1", "1", "1", "1", "1", "1", "1", "1", "1", "1", "1", "1", "1", "1", "1", "1", "1", "1", "1", "1", "1", "1", "1", "1", "1", "2", "-", "-", "-", "-", "-", "-", "-", "-", "-", "-"];
        this.eString = ["0", "-", "0", "-", "1", "1", "1", "1", "1", "1", "1", "1", "1", "1", "1", "1", "1", "1", "1", "1", "1", "1", "1", "1", "1", "1", "1", "1", "1", "2", "-", "-", "-", "-", "-", "-", "-", "-", "-", "-"];
    }
}
const create = new Create();
create.init();
//# sourceMappingURL=create.js.map