import './create.css';
import jsPDF from "jspdf";
import emblem from './images/main-logo.svg'
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
        const body: HTMLBodyElement = document.querySelector("body") as HTMLBodyElement;
        if (!body) return;
        body.style.background = "url(" + emblem + ")";
        body.style.backgroundRepeat = "no-repeat";
        body.style.backgroundPosition = "center";
        body.style.height = "100vh";
        const tabCellContainer: HTMLDivElement = document.getElementById("tab-cell-container") as HTMLDivElement;
        const tabPreviewContainer: HTMLDivElement = document.getElementById("tab-preview-container") as HTMLDivElement;
        tabCellContainer.addEventListener("scroll", () => this.syncScroll(tabCellContainer, tabPreviewContainer));
        tabPreviewContainer.addEventListener("scroll", () => this.syncScroll(tabCellContainer, tabPreviewContainer));
        this.getUserAccount();
        this.export();
        this.updateTabCell();
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
        this.tutorial();
        this.saveTab();
    }

    // Return to home page.
    private exit = (): void => {
        const exitButton: HTMLButtonElement = document.getElementById("back-button") as HTMLButtonElement;

        exitButton?.addEventListener("click", () => {
            window.location.href = "home.html?username=" + this.user.username;
        });
    };

    private loadTab = () => {
        const overlay: HTMLDivElement = document.getElementById("popup-modal-overlay") as HTMLDivElement;

        setTimeout(() => {
            overlay.style.display = "none";
        }, 100);

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
        usernameLabel.innerHTML = this.tabTitle + '<i style="height: 1rem; width: 1rem; margin-bottom: 2px;" class="fas fa-floppy-disk" id="save-button"></i>';
        // Include this when you create the menu.
        // + "<i style='padding-top: .2rem;' class='fas fa-bars'></i>";
        this.exit();
        this.buildTabCellRows();

        if (tab && tab.tabData) {
            this.formatTabForPDFExport(tab.tabData);
        }
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
            this.formatTabForPDFExport(this.translateTabCellsToData());
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
            this.formatTabForPDFExport(this.translateTabCellsToData());
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
                saveTabButton.classList.add("tab-cell-active-tutorial-icon");
                saveTabButton.style.color = "white";

                setTimeout(() => {
                    saveTabButton.classList.remove("tab-cell-active-tutorial-icon");
                    this.formatTabForPDFExport(tabData)
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

        // This can be made into a separate function, same with below.
        let highERawLength;
        let bRawLength;
        let gRawLength;
        let dRawLength;
        let aRawLength;
        let eRawLength;
        
        if (typeof rawTabData.highEString === "string") {
            highERawLength = rawTabData.highEString.split("");
            bRawLength = rawTabData.bString.split("");
            gRawLength = rawTabData.gString.split("");
            dRawLength = rawTabData.dString.split("");
            aRawLength = rawTabData.aString.split("");
            eRawLength = rawTabData.eString.split("");
        }
        else {
            highERawLength = rawTabData.highEString;
            bRawLength = rawTabData.bString;
            gRawLength = rawTabData.gString;
            dRawLength = rawTabData.dString;
            aRawLength = rawTabData.aString;
            eRawLength = rawTabData.eString;
        }

        const maxRawLength = Math.max(highERawLength.length, bRawLength.length, gRawLength.length, dRawLength.length, aRawLength.length, eRawLength.length)

        for (let i: number = 0; i < maxRawLength; i++) {
            if (rawTabData.highEString[i] === undefined) {
                rawTabData.highEString += "-";
            }

            if (rawTabData.bString[i] === undefined) {
                rawTabData.bString += "-";
            }

            if (rawTabData.gString[i] === undefined) {
                rawTabData.gString += "-";
            }

            if (rawTabData.dString[i] === undefined) {
                rawTabData.dString += "-";
            }

            if (rawTabData.aString[i] === undefined) {
                rawTabData.aString += "-";
            }

            if (rawTabData.eString[i] === undefined) {
                rawTabData.eString += "-";
            }
        };

        // This whole method is pretty sloppy, consider moving from string and arrays for data to something like objects.
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
                highE !== "{"
            ) {
                formattedTab.highEString.push(highE);
                if (prevHighE !== "{" && nextHighE !== "}" && highE !== "}") {
                    formattedTab.highEString.push("-");
                }
            }

            // B
            if (
                b !== "{"
            ) {
                formattedTab.bString.push(b);
                if (prevB !== "{" && nextB !== "}" && b !== "}") {
                    formattedTab.bString.push("-");
                }
            }

            // G
            if (
                g !== "{"
            ) {
                formattedTab.gString.push(g);
                if (prevG !== "{" && nextG !== "}" && g !== "}") {
                    formattedTab.gString.push("-");
                }
            }

            // D
            if (
                d !== "{"
            ) {
                formattedTab.dString.push(d);
                if (prevD !== "{" && nextD !== "}" && d !== "}") {
                    formattedTab.dString.push("-");
                }
            }

            // A
            if (
                a !== "{"
            ) {
                formattedTab.aString.push(a);
                if (prevA !== "{" && nextA !== "}" && a !== "}") {
                    formattedTab.aString.push("-");
                }
            }

            // E
            if (
                e !== "{"
            ) {
                formattedTab.eString.push(e);
                if (prevE !== "{" && nextE !== "}" && e !== "}") {
                    formattedTab.eString.push("-");
                }
            }
        }

        const highELength = formattedTab.highEString.join("").split("");
        const bLength = formattedTab.bString.join("").split("");
        const gLength = formattedTab.gString.join("").split("");
        const dLength = formattedTab.dString.join("").split("");
        const aLength = formattedTab.aString.join("").split("");
        const eLength = formattedTab.eString.join("").split("");
        const maxLength = Math.max(highELength.length, bLength.length, gLength.length, dLength.length, aLength.length, eLength.length)

        let tempTab = {
            highEString: [] as string[],
            bString: [] as string[],
            gString: [] as string[],
            dString: [] as string[],
            aString: [] as string[],
            eString: [] as string[]
        }

        // This can be made into a separate function.
        for (let i: number = 0; i < maxLength; i++) {
            tempTab.highEString.push(formattedTab.highEString[i] || "-")
            tempTab.bString.push(formattedTab.bString[i] || "-")
            tempTab.gString.push(formattedTab.gString[i] || "-")
            tempTab.dString.push(formattedTab.dString[i] || "-")
            tempTab.aString.push(formattedTab.aString[i] || "-")
            tempTab.eString.push(formattedTab.eString[i] || "-")
        };

        tempTab = {
            highEString: tempTab.highEString,
            bString: tempTab.bString,
            gString: tempTab.gString,
            dString: tempTab.dString,
            aString: tempTab.aString,
            eString: tempTab.eString
        }

        // Use the index of the last number to determine the length of the pdf doc.
        let indexOfLastNumber = 0;

        // Second loop.
        for (let i: number = 0; i < tempTab.highEString.length; i++) {
            const highE = tempTab.highEString[i] || "-";
            const b = tempTab.bString[i] || "-";
            const g = tempTab.gString[i] || "-";
            const d = tempTab.dString[i] || "-";
            const a = tempTab.aString[i] || "-";
            const e = tempTab.eString[i] || "-";

            if (
                highE !== "-" ||
                b !== "-" ||
                g !== "-" ||
                d !== "-" ||
                a !== "-" ||
                e !== "-"
            ) {
                indexOfLastNumber = i;
            }

            // High E
            if (
                highE === "}"
            ) {
                tempTab.highEString[i] = "-"
            }

            // B
            if (
                b === "}"
            ) {
                tempTab.bString[i] = "-"
            }

            // G
            if (
                g === "}"
            ) {
                tempTab.gString[i] = "-"
            }

            // D
            if (
                d === "}"
            ) {
                tempTab.dString[i] = "-"
            }

            // A
            if (
                a === "}"
            ) {
                tempTab.aString[i] = "-"
            }

            // E
            if (
                e === "}"
            ) {
                tempTab.eString[i] = "-"
            }

            if (
                highE === "}" ||
                b  === "}" ||
                g  === "}" ||
                d  === "}" ||
                a  === "}" ||
                e === "}"
            ) {
                // High E
                if (
                    highE === "}"
                ) {
                    tempTab.highEString[i] = "-"
                }
                else {
                    tempTab.highEString.splice(i, 0, "-");
                }

                // B
                if (
                    b === "}"
                ) {
                    tempTab.bString[i] = "-"
                }
                else {
                    tempTab.bString.splice(i, 0, "-");
                }

                // G
                if (
                    g === "}"
                ) {
                    tempTab.gString[i] = "-"
                }
                else {
                    tempTab.gString.splice(i, 0, "-");
                }

                // D
                if (
                    d === "}"
                ) {
                    tempTab.dString[i] = "-"
                }
                else {
                    tempTab.dString.splice(i, 0, "-");
                }

                // A
                if (
                    a === "}"
                ) {
                    tempTab.aString[i] = "-"
                }
                else {
                    tempTab.aString.splice(i, 0, "-");
                }

                // E
                if (
                    e === "}"
                ) {
                    tempTab.eString[i] = "-"
                }
                else {
                    tempTab.eString.splice(i, 0, "-");
                }
            }
        }

        const returnTab: any = {
            highEString: tempTab.highEString.slice(0, indexOfLastNumber + 4).join(""),
            bString: tempTab.bString.slice(0, indexOfLastNumber + 4).join(""),
            gString: tempTab.gString.slice(0, indexOfLastNumber + 4).join(""),
            dString: tempTab.dString.slice(0, indexOfLastNumber + 4).join(""),
            aString: tempTab.aString.slice(0, indexOfLastNumber + 4).join(""),
            eString: tempTab.eString.slice(0, indexOfLastNumber + 4).join("")
        }

        // Display the Preview Tab.
        const highEPreview: HTMLDivElement = document.getElementById("high-e-string-preview") as HTMLDivElement;
        const bPreview: HTMLDivElement = document.getElementById("b-string-preview") as HTMLDivElement;
        const gPreview: HTMLDivElement = document.getElementById("g-string-preview") as HTMLDivElement;
        const dPreview: HTMLDivElement = document.getElementById("d-string-preview") as HTMLDivElement;
        const aPreview: HTMLDivElement = document.getElementById("a-string-preview") as HTMLDivElement;
        const ePreview: HTMLDivElement = document.getElementById("e-string-preview") as HTMLDivElement;

        highEPreview.innerHTML = tempTab.highEString.slice(0, Math.min(
            tempTab.highEString.length, 
            tempTab.bString.length, 
            tempTab.gString.length,
            tempTab.dString.length,
            tempTab.aString.length,
            tempTab.eString.length
        )).join("");
        bPreview.innerHTML = tempTab.bString.slice(0, Math.min(
            tempTab.highEString.length, 
            tempTab.bString.length, 
            tempTab.gString.length,
            tempTab.dString.length,
            tempTab.aString.length,
            tempTab.eString.length
        )).join("");
        gPreview.innerHTML = tempTab.gString.slice(0, Math.min(
            tempTab.highEString.length, 
            tempTab.bString.length, 
            tempTab.gString.length,
            tempTab.dString.length,
            tempTab.aString.length,
            tempTab.eString.length
        )).join("");
        dPreview.innerHTML = tempTab.dString.slice(0, Math.min(
            tempTab.highEString.length, 
            tempTab.bString.length, 
            tempTab.gString.length,
            tempTab.dString.length,
            tempTab.aString.length,
            tempTab.eString.length
        )).join("");
        aPreview.innerHTML = tempTab.aString.slice(0, Math.min(
            tempTab.highEString.length, 
            tempTab.bString.length, 
            tempTab.gString.length,
            tempTab.dString.length,
            tempTab.aString.length,
            tempTab.eString.length
        )).join("");
        ePreview.innerHTML = tempTab.eString.slice(0, Math.min(
            tempTab.highEString.length, 
            tempTab.bString.length, 
            tempTab.gString.length,
            tempTab.dString.length,
            tempTab.aString.length,
            tempTab.eString.length
        )).join("");

        return returnTab;
    };

    // Export the tab.
    private export = (): void => {
        const exportButton: HTMLButtonElement = document.getElementById("pdf-button") as HTMLButtonElement;
        exportButton?.addEventListener("click", () => {
            const tabDataRaw: any = this.translateTabCellsToData();
            const tabData: any = this.formatTabForPDFExport(tabDataRaw);
            const doc = new jsPDF();
            doc.setFont("courier", "normal");
            let index: number = 0;
            const initialRange: number = 50
            let range: number = initialRange;
            const loopRange: number = Math.ceil(tabData.highEString.length / range);
            // Adds the title if this is a feature we want.
            // doc.text([
            //     this.tabTitle
            // ], 10, 10);
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

        // For PDF
        const pdfButton: HTMLElement = document.getElementById("export-button") as HTMLElement;
        pdfButton.addEventListener("click", () => {
            window.location.href = "uploadVideo.html?username=" + this.user.username + "&title=" + this.tabTitle;
        })
    };

    private syncScroll = (source: any, target: any) => {
        target.scrollLeft = source.scrollLeft;
    }

    private openWelcomePopupModal = (htmlString: string) => {
        const popupModal: HTMLDivElement = document.getElementById("popup-modal") as HTMLDivElement;
        const popupModalOverlay: HTMLDivElement = document.getElementById("popup-modal-overlay") as HTMLDivElement;
        popupModal.innerHTML = htmlString;
        popupModal.style.display = "flex";
        popupModalOverlay.style.display = "flex";

        const confirmWelcomeButton: HTMLButtonElement = document.getElementById("welcome-confirm-button") as HTMLButtonElement;
        confirmWelcomeButton.addEventListener("click", () => {
            const newLineButton: HTMLButtonElement = document.getElementById("add-line-button") as HTMLButtonElement;
            const popupModal: HTMLDivElement = document.getElementById("popup-modal") as HTMLDivElement;
            const popupModalOverlay: HTMLDivElement = document.getElementById("popup-modal-overlay") as HTMLDivElement;
            popupModal.style.display = "none";
            popupModalOverlay.style.display = "none";

            setTimeout(() => {
                newLineButton.classList.add("tab-cell-active-tutorial");
            }, 500);
        })
    };

    private openNewLinePopupModal = (htmlString: string) => {
        const newLineButton: HTMLButtonElement = document.getElementById("add-line-button") as HTMLButtonElement;
        const popupModal: HTMLDivElement = document.getElementById("popup-modal") as HTMLDivElement;
        const popupModalOverlay: HTMLDivElement = document.getElementById("popup-modal-overlay") as HTMLDivElement;
        popupModal.innerHTML = htmlString;
        popupModal.style.display = "flex";
        popupModalOverlay.style.display = "flex";
        newLineButton.classList.remove("tab-cell-active-tutorial");

        const confirmNewLineButton: HTMLButtonElement = document.getElementById("new-line-confirm-button") as HTMLButtonElement;
        confirmNewLineButton.addEventListener("click", () => {
            const popupModal: HTMLDivElement = document.getElementById("popup-modal") as HTMLDivElement;
            const popupModalOverlay: HTMLDivElement = document.getElementById("popup-modal-overlay") as HTMLDivElement;
            popupModal.style.display = "none";
            popupModalOverlay.style.display = "none";

            // Change Fret -> Save Flow.
            this.initChangeFretTutorialFlow();
        })
    };

    // Tutorial Welcome.
    private initSaveTutorialFlow = () => {
        const saveLabel: HTMLLabelElement = document.createElement("label") as HTMLLabelElement;
        const saveButton: HTMLButtonElement = document.createElement("button") as HTMLButtonElement;
        saveButton.id = "save-confirm-button";
        saveButton.innerHTML = "Got it!";
        saveLabel.innerHTML = "Excellent! Now let's save our tab.";
        
        this.openSavePopupModal(saveLabel.outerHTML + saveButton.outerHTML);
    };

    private openSavePopupModal = (htmlString: string) => {
        const saveButton: HTMLButtonElement = document.getElementById("save-button") as HTMLButtonElement;
        const popupModal: HTMLDivElement = document.getElementById("popup-modal") as HTMLDivElement;
        const popupModalOverlay: HTMLDivElement = document.getElementById("popup-modal-overlay") as HTMLDivElement;
        popupModal.innerHTML = htmlString;
        saveButton.classList.add("tab-cell-active-tutorial-icon");
        popupModal.style.display = "flex";
        popupModalOverlay.style.display = "flex";
        const confirmSaveButton: HTMLButtonElement = document.getElementById("save-confirm-button") as HTMLButtonElement;

        confirmSaveButton.addEventListener("click", () => {
            const popupModal: HTMLDivElement = document.getElementById("popup-modal") as HTMLDivElement;
            const popupModalOverlay: HTMLDivElement = document.getElementById("popup-modal-overlay") as HTMLDivElement;
            popupModal.style.display = "none";
            popupModalOverlay.style.display = "none";
        });

        saveButton.addEventListener("click", () => {
            // Save Flow -> Export Flow.
            this.initExportTutorialFlow();
        });
    };

    private openExportPopupModal = (htmlString: string) => {
        const popupModal: HTMLDivElement = document.getElementById("popup-modal") as HTMLDivElement;
        const popupModalOverlay: HTMLDivElement = document.getElementById("popup-modal-overlay") as HTMLDivElement;
        popupModal.innerHTML = htmlString;
        popupModal.style.display = "flex";
        popupModalOverlay.style.display = "flex";
        const exportButton: HTMLButtonElement = document.getElementById("export-confirm-button") as HTMLButtonElement;

        exportButton.addEventListener("click", () => {
            const popupModal: HTMLDivElement = document.getElementById("popup-modal") as HTMLDivElement;
            const popupModalOverlay: HTMLDivElement = document.getElementById("popup-modal-overlay") as HTMLDivElement;
            popupModal.style.display = "none";
            popupModalOverlay.style.display = "none";

            const exportButton: HTMLElement = document.getElementById("export-button") as HTMLElement;
            exportButton.classList.add("tab-cell-active-tutorial");

            const pdfButton: HTMLElement = document.getElementById("pdf-button") as HTMLElement;
            pdfButton.classList.add("tab-cell-active-tutorial");
        })
    };

    // Tutorial Export.
    private initExportTutorialFlow = () => {
        const saveButton: HTMLButtonElement = document.getElementById("save-button") as HTMLButtonElement;
        const exportLabel: HTMLLabelElement = document.createElement("label") as HTMLLabelElement;
        const exportButton: HTMLButtonElement = document.createElement("button") as HTMLButtonElement;
        saveButton.classList.remove("tab-cell-active-tutorial-icon");
        exportButton.id = "export-confirm-button";
        exportButton.innerHTML = "Got it!";
        exportLabel.innerHTML = "Excellent! Now that our tab has been saved, let's create a video with our tab on it! That way we can post it to TickTok, Instagram, Twitter, and more!";

        setTimeout(() => {
            this.openExportPopupModal(exportLabel.outerHTML + exportButton.outerHTML);
        }, 1500);
    };

    // Tutorial Welcome.
    private initWelcomeTutorialFlow = () => {
        const welcomeLabel: HTMLLabelElement = document.createElement("label") as HTMLLabelElement;
        const welcomeButton: HTMLButtonElement = document.createElement("button") as HTMLButtonElement;
        welcomeButton.id = "welcome-confirm-button";
        welcomeButton.innerHTML = "Got it!";
        welcomeLabel.innerHTML = "Welcome to the tutorial! Let's do a quick walk through so we can get the ropes. Let's get started by adding a new line!";

        setTimeout(() => {
            this.openWelcomePopupModal(welcomeLabel.outerHTML + welcomeButton.outerHTML);
        }, 1500);
    };

    // Tutorial New Line.
    private initNewLineTutorialFlow = () => {
        const newLineButton: HTMLButtonElement = document.getElementById("add-line-button") as HTMLButtonElement;
        newLineButton.addEventListener("click", () => {
            const newLineLabel: HTMLLabelElement = document.createElement("label") as HTMLLabelElement;
            const newLineButton: HTMLButtonElement = document.createElement("button") as HTMLButtonElement;
            newLineButton.id = "new-line-confirm-button";
            newLineButton.innerHTML = "Got it!";
            newLineLabel.innerHTML = "Awesome! Now let's change one of the frets to a new number. Let's add a zero to one of our frets!";
            
            setTimeout(() => {
                this.openNewLinePopupModal(newLineLabel.outerHTML + newLineButton.outerHTML);
            }, 1000);
        });
    };

    // Tutorial Change Fret.
    private initChangeFretTutorialFlow = () => {
        const tabCellButtons: HTMLCollectionOf<HTMLDivElement> = document.getElementsByClassName("tab-cell") as HTMLCollectionOf<HTMLDivElement>;
        // const saveButton: HTMLButtonElement = document.getElementById("save-button") as HTMLButtonElement;

        for (let i: number = 0; i < tabCellButtons.length; i++) {
            const tabCell: HTMLDivElement = tabCellButtons[i] as HTMLDivElement;
            tabCell.classList.add("tab-cell-active-tutorial");

            tabCell.addEventListener("click", () => {
                const tabCellButtons: HTMLCollectionOf<HTMLDivElement> = document.getElementsByClassName("tab-cell") as HTMLCollectionOf<HTMLDivElement>;
        
                for (let i: number = 0; i < tabCellButtons.length; i++) {
                    const tabCell: HTMLDivElement = tabCellButtons[i] as HTMLDivElement;
                    tabCell.classList.remove("tab-cell-active-tutorial");
                    const zeroButton: HTMLDivElement = document.getElementById("0-button") as HTMLDivElement;
                    zeroButton.classList.add("tab-cell-active-tutorial");
                    zeroButton.addEventListener("click", () => {
                        zeroButton.classList.remove("tab-cell-active-tutorial");
                        this.initSaveTutorialFlow();
                    });
                }
            });
        };
    };

    // TODO Parse out the Tutorial into it's own class, in it's own directory.
    private tutorial = () => {
        if (this.tabTitle === "Tutorial") {
            // Welcome -> New Line Flow.
            this.initWelcomeTutorialFlow();

            // New Line -> Change Fret Flow.
            this.initNewLineTutorialFlow();
        }
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
                };

                this.formatTabForPDFExport(this.translateTabCellsToData());
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

        if (this.tabTitle === "Tutorial") {
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
                    }, 500);            
                }

                this.initSaveTutorialFlow();
            });
        }
        else {
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
                    }, 500);            
                }
            });
        }
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
            tabCell.style.opacity = "1";
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