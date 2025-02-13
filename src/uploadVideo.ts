import "./uploadVideo.css";

const url = "https://guitar-tablature-to-pdf-147ddb720da0.herokuapp.com/";
// const url = "http://localhost:5000/";

class UploadVideo {
    user: any;
    tabTitle: string;
    private static tab: any;

    constructor() {
        this.user = {};
        this.tabTitle = "";
    }

    public init = () => {
        this.getUserAccount();
        this.initVideoUpload();
    }

    private initVideoUpload = () => {
        const videoInput = document.getElementById('video-upload') as HTMLInputElement;
        const canvas = document.getElementById('video-canvas') as HTMLCanvasElement;
        const ctx = canvas.getContext('2d') as CanvasRenderingContext2D;
        const saveButton = document.getElementById('save-video') as HTMLButtonElement;
        let video = document.createElement('video');
        let mediaRecorder: MediaRecorder;
        let recordedChunks: BlobPart[] = [];

        videoInput.addEventListener('change', (event: Event) => {
            const target = event.target as HTMLInputElement;
            const file = target.files?.[0];
            if (!file) return;

            const uploadButtonContainer: HTMLDivElement = document.getElementById("upload-video-buttons-container") as HTMLDivElement;
            uploadButtonContainer.style.display = "none";
            // Load the selected video
            const url = URL.createObjectURL(file);
            video.src = url;
            video.load();
            video.play();

            video.addEventListener('loadedmetadata', () => {
                canvas.width = video.videoWidth;
                canvas.height = video.videoHeight;
            });

            video.addEventListener('play', () => {
                const stream = canvas.captureStream(30); // 30 FPS
                mediaRecorder = new MediaRecorder(stream, {
                mimeType: 'video/webm; codecs=vp9'
                });

                mediaRecorder.ondataavailable = (event: BlobEvent) => {
                if (event.data.size > 0) {
                    recordedChunks.push(event.data);
                }
                };

                mediaRecorder.onstop = saveRecordedVideo;
                mediaRecorder.start();
                
                const highEStringText: HTMLDivElement = document.getElementById("tab-text-highEString") as HTMLDivElement;
                const bStringText: HTMLDivElement = document.getElementById("tab-text-bString") as HTMLDivElement;
                const gStringText: HTMLDivElement = document.getElementById("tab-text-gString") as HTMLDivElement;
                const dStringText: HTMLDivElement = document.getElementById("tab-text-dString") as HTMLDivElement;
                const aStringText: HTMLDivElement = document.getElementById("tab-text-aString") as HTMLDivElement;
                const eStringText: HTMLDivElement = document.getElementById("tab-text-eString") as HTMLDivElement;

                drawFrame();
            });
        });

        function drawFrame(): void {

            if (video.paused || video.ended) {
                return;
            }

            // Draw video frame to canvas
            ctx.drawImage(video, 0, 0, canvas.width, canvas.height);

            // Add overlay text
            ctx.font = '48px Monospace';
            ctx.fillStyle = 'white';
            ctx.strokeStyle = 'white';
            ctx.lineWidth = 2;
            ctx.textAlign = 'left';
            // High E Text Fill
            ctx.fillText(UploadVideo.tab.highEString[0], 50, canvas.height - 500);
            ctx.strokeText(UploadVideo.tab.highEString[0], 50, canvas.height - 500);
            // B Text Fill
            ctx.fillText(UploadVideo.tab.bString[0], 50, canvas.height - 450);
            ctx.strokeText(UploadVideo.tab.bString[0], 50, canvas.height - 450);
            // G Text Fill
            ctx.fillText(UploadVideo.tab.gString[0], 50, canvas.height - 400);
            ctx.strokeText(UploadVideo.tab.gString[0], 50, canvas.height - 400);
            // D Text Fill
            ctx.fillText(UploadVideo.tab.dString[0], 50, canvas.height - 350);
            ctx.strokeText(UploadVideo.tab.dString[0], 50, canvas.height - 350);
            // A Text Fill
            ctx.fillText(UploadVideo.tab.aString[0], 50, canvas.height - 300);
            ctx.strokeText(UploadVideo.tab.aString[0], 50, canvas.height - 300);
            // E Text Fill
            ctx.fillText(UploadVideo.tab.eString[0], 50, canvas.height - 250);
            ctx.strokeText(UploadVideo.tab.eString[0], 50, canvas.height - 250);

            requestAnimationFrame(drawFrame);
        }

        saveButton.addEventListener('click', () => {
            mediaRecorder.stop();
        });

        function saveRecordedVideo(): void {
            const blob = new Blob(recordedChunks, { type: 'video/webm' });
            const url = URL.createObjectURL(blob);

            const a = document.createElement('a');
            a.style.display = 'none';
            a.href = url;
            a.download = 'edited-video.webm';
            document.body.appendChild(a);
            a.click();
            URL.revokeObjectURL(url);
        }
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

        // Separate into new function.
        const title = params.get('title');
        this.tabTitle = title!;
        this.user = userAccountData;
        const tab = this.user.tabs.find((tab: any) => { return tab.tabTitle === title});
        UploadVideo.tab = this.splitTabIntoChunks(this.formatTabForPDFExport(tab.tabData));
        console.log(UploadVideo.tab)
    }

    private splitTabIntoChunks = (tab: any) => {
        const chunkLength = 10;
        const highESplitArray: string [] = tab.highEString.split("");
        const bSplitArray: string [] = tab.bString.split("");
        const gSplitArray: string [] = tab.gString.split("");
        const dSplitArray: string [] = tab.dString.split("");
        const aSplitArray: string [] = tab.aString.split("");
        const eSplitArray: string [] = tab.eString.split("");

        const highEReturnArray: string [] = [];
        const bReturnArray: string [] = [];
        const gReturnArray: string [] = [];
        const dReturnArray: string [] = [];
        const aReturnArray: string [] = [];
        const eReturnArray: string [] = [];

        const returnObj: any = {
            highEString: [],
            bString: [],
            gString: [],
            dString: [],
            aString: [],
            eString: []
        };

        let counter: number = 33;

        for (let i: number = 0; i < highESplitArray.length; i++) {
            highEReturnArray.push(highESplitArray[i]);
            bReturnArray.push(bSplitArray[i]);
            gReturnArray.push(gSplitArray[i]);
            dReturnArray.push(dSplitArray[i]);
            aReturnArray.push(aSplitArray[i]);
            eReturnArray.push(eSplitArray[i]);

            if (i === counter) {
                returnObj.highEString.push(highEReturnArray.join(""));
                returnObj.bString.push(bReturnArray.join(""));
                returnObj.gString.push(gReturnArray.join(""));
                returnObj.dString.push(dReturnArray.join(""));
                returnObj.aString.push(aReturnArray.join(""));
                returnObj.eString.push(eReturnArray.join(""));
                counter += counter;
            }
        }

        return returnObj;
    };

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
        const highEStringText: HTMLDivElement = document.getElementById("tab-text-highEString") as HTMLDivElement;
        const bStringText: HTMLDivElement = document.getElementById("tab-text-bString") as HTMLDivElement;
        const gStringText: HTMLDivElement = document.getElementById("tab-text-gString") as HTMLDivElement;
        const dStringText: HTMLDivElement = document.getElementById("tab-text-dString") as HTMLDivElement;
        const aStringText: HTMLDivElement = document.getElementById("tab-text-aString") as HTMLDivElement;
        const eStringText: HTMLDivElement = document.getElementById("tab-text-eString") as HTMLDivElement;

        highEStringText.innerHTML = tempTab.highEString.slice(0, Math.min(
            tempTab.highEString.length, 
            tempTab.bString.length, 
            tempTab.gString.length,
            tempTab.dString.length,
            tempTab.aString.length,
            tempTab.eString.length
        )).join("");
        bStringText.innerHTML = tempTab.bString.slice(0, Math.min(
            tempTab.highEString.length, 
            tempTab.bString.length, 
            tempTab.gString.length,
            tempTab.dString.length,
            tempTab.aString.length,
            tempTab.eString.length
        )).join("");
        gStringText.innerHTML = tempTab.gString.slice(0, Math.min(
            tempTab.highEString.length, 
            tempTab.bString.length, 
            tempTab.gString.length,
            tempTab.dString.length,
            tempTab.aString.length,
            tempTab.eString.length
        )).join("");
        dStringText.innerHTML = tempTab.dString.slice(0, Math.min(
            tempTab.highEString.length, 
            tempTab.bString.length, 
            tempTab.gString.length,
            tempTab.dString.length,
            tempTab.aString.length,
            tempTab.eString.length
        )).join("");
        aStringText.innerHTML = tempTab.aString.slice(0, Math.min(
            tempTab.highEString.length, 
            tempTab.bString.length, 
            tempTab.gString.length,
            tempTab.dString.length,
            tempTab.aString.length,
            tempTab.eString.length
        )).join("");
        eStringText.innerHTML = tempTab.eString.slice(0, Math.min(
            tempTab.highEString.length, 
            tempTab.bString.length, 
            tempTab.gString.length,
            tempTab.dString.length,
            tempTab.aString.length,
            tempTab.eString.length
        )).join("");

        return returnTab;
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
}

const uploadVideo: UploadVideo = new UploadVideo();
uploadVideo.init();
