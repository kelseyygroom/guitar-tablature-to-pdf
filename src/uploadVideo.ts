import "./uploadVideo.css";

const url = "https://guitar-tablature-to-pdf-147ddb720da0.herokuapp.com/";
// const url = "http://localhost:5000/";

class UploadVideo {
    user: any;
    tabTitle: string;
    private TIMER: number = 5;
    private static tab: any;
    private static tabChunks: any;
    private static selectedTabChunkId: any;
    private static videoDuration: number;
    private tabClipSegmentColors: string[];

    constructor() {
        this.user = {};
        this.tabTitle = "";
        this.tabClipSegmentColors = ["#23FE69", "#FF1493", "#00FFFF", "#9400D3", "#FDFD00", "#FF073A", "#FDFD00"]
    }

    public init = () => {
        this.getUserAccount();
        this.addTabSegmentListeners();
    }

    private addMarkers = () => {
        const videoDuration = UploadVideo.videoDuration;
        const markersContainer = document.querySelector(".markers")!;
        const startEndTimes = this.getVideoTime(UploadVideo.tabChunks.highEString);
        const markerTimes: number[] = []; // Example timestamps (percentage of range max)
        const markerEndTimes: number[] = []; // Example timestamps (percentage of range max)

        startEndTimes.forEach(time => {
            markerTimes.push(time.start);
            markerEndTimes.push(time.end);
        });
        console.log(markerTimes, markerEndTimes)

        // Function to create markers
        markersContainer.innerHTML = ""; // Clear existing markers
    
        markerTimes.forEach((time: any, index: number) => {
            const marker = document.createElement("div");
            marker.classList.add("marker");

            // Position the marker based on time
            const percent = (time / videoDuration) * 100;
            const percentEnd = (markerEndTimes[index] / videoDuration) * 100;
            marker.style.left = `${percent}%`;
            marker.style.width = `${percentEnd - percent}%`;
            marker.style.backgroundColor = `${this.tabClipSegmentColors[index]}`;
            marker.style.opacity = ".5";

            markersContainer.appendChild(marker);
        });
    };

    private getVideoText = (string: any[]) => {
        const returnArray: string[] = [];

        string.forEach(element => {
            returnArray.push(element.text);
        });

        return returnArray;
    };

    private getVideoTime = (string: any[]) => {
        const returnArray: any[] = [];

        string.forEach(element => {
            returnArray.push(element.time);
        });

        return returnArray;
    };

    private buildTabChunkHTML = () => {
        const tabChunkContainer = document.createElement("div");
        tabChunkContainer.classList.add("tab-chunk-container");

        for (let i: number = 0; i < Object.keys(UploadVideo.tabChunks.highEString).length; i++) {
            const tabChunk = document.createElement("div");
            tabChunk.id = "tab-chunk-" + UploadVideo.tabChunks.highEString[i].id;
            tabChunk.classList.add("tab-chunk-text");
            
            // High E String
            const tabChunkTextHighEContainer = document.createElement("p");
            tabChunkTextHighEContainer.innerHTML = UploadVideo.tabChunks.highEString[i].text;
            tabChunk.append(tabChunkTextHighEContainer);

            const tabChunkTextBContainer = document.createElement("p");
            tabChunkTextBContainer.innerHTML = UploadVideo.tabChunks.bString[i].text;
            tabChunk.append(tabChunkTextBContainer);

            const tabChunkTextGContainer = document.createElement("p");
            tabChunkTextGContainer.innerHTML = UploadVideo.tabChunks.gString[i].text;
            tabChunk.append(tabChunkTextGContainer);

            const tabChunkTextDContainer = document.createElement("p");
            tabChunkTextDContainer.innerHTML = UploadVideo.tabChunks.dString[i].text;
            tabChunk.append(tabChunkTextDContainer);

            const tabChunkTextAContainer = document.createElement("p");
            tabChunkTextAContainer.innerHTML = UploadVideo.tabChunks.aString[i].text;
            tabChunk.append(tabChunkTextAContainer);

            const tabChunkTextEContainer = document.createElement("p");
            tabChunkTextEContainer.innerHTML = UploadVideo.tabChunks.eString[i].text;
            tabChunk.append(tabChunkTextEContainer);
            tabChunk.style.backgroundColor = this.tabClipSegmentColors[i];
            tabChunkContainer.append(tabChunk);
        };

        return tabChunkContainer.outerHTML;
    };

    private adjustTabChunkTime = (tabChunk: any) => {
        const tabChunkId: string = tabChunk.id.split("-")[2];
        UploadVideo.selectedTabChunkId = tabChunkId;
    };

    // Translates the timeline value into the video length base unit (ie. videolength is 20 seconds so 10 of 20 is 50%).
    private calculateClipToVideoRatio = () => {

    }

    private addTabSegmentListeners = () => {
        const tabSegmentStartButton: HTMLDivElement = document.getElementById("start-tab-segment-button") as HTMLDivElement;
        const tabSegmentEndButton: HTMLDivElement = document.getElementById("end-tab-segment-button") as HTMLDivElement;
        const timeline = document.getElementById("video-timeline") as HTMLInputElement;
        
        tabSegmentStartButton.addEventListener("click", () => {
            for (let i: number = 0; i < Object.keys(UploadVideo.tabChunks.highEString).length; i++) {
                if (UploadVideo.tabChunks.highEString[i].id === Number(UploadVideo.selectedTabChunkId)) {
                    UploadVideo.tabChunks.highEString[i].time.start = Math.round(Number(timeline.value) * UploadVideo.videoDuration / 100);
                }

                if (UploadVideo.tabChunks.bString[i].id === Number(UploadVideo.selectedTabChunkId)) {
                    UploadVideo.tabChunks.bString[i].time.start = Math.round(Number(timeline.value) * UploadVideo.videoDuration / 100);
                }

                if (UploadVideo.tabChunks.gString[i].id === Number(UploadVideo.selectedTabChunkId)) {
                    UploadVideo.tabChunks.gString[i].time.start = Math.round(Number(timeline.value) * UploadVideo.videoDuration / 100);
                }

                if (UploadVideo.tabChunks.dString[i].id === Number(UploadVideo.selectedTabChunkId)) {
                    UploadVideo.tabChunks.dString[i].time.start = Math.round(Number(timeline.value) * UploadVideo.videoDuration / 100);
                }

                if (UploadVideo.tabChunks.aString[i].id === Number(UploadVideo.selectedTabChunkId)) {
                    UploadVideo.tabChunks.aString[i].time.start = Math.round(Number(timeline.value) * UploadVideo.videoDuration / 100);
                }

                if (UploadVideo.tabChunks.eString[i].id === Number(UploadVideo.selectedTabChunkId)) {
                    UploadVideo.tabChunks.eString[i].time.start = Math.round(Number(timeline.value) * UploadVideo.videoDuration / 100);
                }
            };

            this.addMarkers();
            this.initVideoUpload();
        });

        tabSegmentEndButton.addEventListener("click", () => {
            for (let i: number = 0; i < Object.keys(UploadVideo.tabChunks.highEString).length; i++) {
                if (UploadVideo.tabChunks.highEString[i].id === Number(UploadVideo.selectedTabChunkId)) {
                    UploadVideo.tabChunks.highEString[i].time.end = Math.round(Number(timeline.value) * UploadVideo.videoDuration / 100);
                }

                if (UploadVideo.tabChunks.bString[i].id === Number(UploadVideo.selectedTabChunkId)) {
                    UploadVideo.tabChunks.bString[i].time.end = Math.round(Number(timeline.value) * UploadVideo.videoDuration / 100);
                }

                if (UploadVideo.tabChunks.gString[i].id === Number(UploadVideo.selectedTabChunkId)) {
                    UploadVideo.tabChunks.gString[i].time.end = Math.round(Number(timeline.value) * UploadVideo.videoDuration / 100);
                }

                if (UploadVideo.tabChunks.dString[i].id === Number(UploadVideo.selectedTabChunkId)) {
                    UploadVideo.tabChunks.dString[i].time.end = Math.round(Number(timeline.value) * UploadVideo.videoDuration / 100);
                }

                if (UploadVideo.tabChunks.aString[i].id === Number(UploadVideo.selectedTabChunkId)) {
                    UploadVideo.tabChunks.aString[i].time.end = Math.round(Number(timeline.value) * UploadVideo.videoDuration / 100);
                }

                if (UploadVideo.tabChunks.eString[i].id === Number(UploadVideo.selectedTabChunkId)) {
                    UploadVideo.tabChunks.eString[i].time.end = Math.round(Number(timeline.value) * UploadVideo.videoDuration / 100);
                }
            };

            this.addMarkers();
            this.initVideoUpload();
        });
    };

    private initVideoUpload = () => {
        // Get HTML elements
        const videoEditingToolsContainer: HTMLDivElement = document.getElementById("video-editing-tool-container") as HTMLDivElement;
        const videoInput = document.getElementById('video-upload') as HTMLInputElement;
        const canvas = document.getElementById('video-canvas') as HTMLCanvasElement;
        const ctx = canvas.getContext('2d')!;
        const video = document.createElement('video');
        const timeline = document.getElementById("video-timeline") as HTMLInputElement;
        const pauseIcon: HTMLElement = document.getElementById("pause-icon") as HTMLElement;
        const tabChunksIcon: HTMLElement = document.getElementById("view-tab-chunks-button") as HTMLElement;

        // Six string arrays with different text
        const strings1 = this.getVideoText(UploadVideo.tab.highEString);
        const strings2 = this.getVideoText(UploadVideo.tab.bString);
        const strings3 = this.getVideoText(UploadVideo.tab.gString);
        const strings4 = this.getVideoText(UploadVideo.tab.dString);
        const strings5 = this.getVideoText(UploadVideo.tab.aString);
        const strings6 = this.getVideoText(UploadVideo.tab.eString);

        // Corresponding time arrays (start and end times for each string)
        const times1 = this.getVideoTime(UploadVideo.tabChunks.highEString);
        const times2 = this.getVideoTime(UploadVideo.tabChunks.bString);
        const times3 = this.getVideoTime(UploadVideo.tabChunks.gString);
        const times4 = this.getVideoTime(UploadVideo.tabChunks.dString);
        const times5 = this.getVideoTime(UploadVideo.tabChunks.aString);
        const times6 = this.getVideoTime(UploadVideo.tabChunks.eString);

        // Settings
        const lineHeight = 50; // Space between lines

        // Track current text for each line
        let currentText = ["", "", "", "", "", ""];

        // Handle file upload and video load
        videoInput.addEventListener("change", (event) => {
            const buttonContainer: HTMLDivElement = document.getElementById("upload-video-buttons-container") as HTMLDivElement;
            const videoCanvas: HTMLDivElement = document.getElementById("video-canvas") as HTMLDivElement;
            const videoIcon: HTMLElement = document.getElementById("video-icon") as HTMLElement;
            
            videoIcon.style.display = "none";
            buttonContainer.style.display = "none";
            videoCanvas.style.display = "block";

            const file = (event.target as HTMLInputElement).files?.[0];
            if (file) {
                videoEditingToolsContainer.style.display = "block";
                const unloadVideoButton: HTMLElement = document.getElementById("unmount-video-button") as HTMLElement;
                unloadVideoButton.style.display = "block";
                let tabChunkContainerOpen = false;

                tabChunksIcon.addEventListener("click", () => {
                    const popupModal: HTMLElement = document.getElementById("popup-modal") as HTMLElement;
                    popupModal.innerHTML = this.buildTabChunkHTML();
                    const tabChunks: HTMLCollectionOf<HTMLElement> = document.getElementsByClassName("tab-chunk-text") as HTMLCollectionOf<HTMLElement>;

                    if (tabChunkContainerOpen) {
                        popupModal.style.display = "none";
                        tabChunkContainerOpen = false;
                    }
                    else {
                        for (let i: number = 0; i < tabChunks.length; i++) {
                            tabChunks[i].addEventListener("click", () => {
                                for (let i: number = 0; i < tabChunks.length; i++) {
                                    tabChunks[i].classList.remove("tab-segment-selected");
                                };

                                this.adjustTabChunkTime(tabChunks[i]);
                                tabChunks[i].classList.add("tab-segment-selected");
                            });
                        };
                        popupModal.style.display = "flex";
                        tabChunkContainerOpen = true;
                    }
                });

                unloadVideoButton.addEventListener("click", () => {
                    if (video !== null && video !== undefined) {
                        video.pause(); // Stop playback
                        video.removeAttribute('src'); // Remove the src attribute
                        video.load();  // Unload the video
                        ctx.clearRect(0, 0, canvas.width, canvas.height); // Clear the canvas
                        videoEditingToolsContainer.style.display = "none";
                        videoCanvas.style.display = "none";
                        buttonContainer.style.display = "flex";
                        videoIcon.style.display = "block";
                    }
                });

                const fileURL = URL.createObjectURL(file);
                video.src = fileURL;
                video.load();
                video.play();
                video.muted = false; // Optional: Mute video by default

                video.addEventListener('loadedmetadata', () => {
                    UploadVideo.videoDuration = Number(video.duration.toFixed(0))
                    // Set canvas dimensions to match video
                    canvas.width = video.videoWidth;
                    canvas.height = video.videoHeight;
                    this.TIMER = Math.round(UploadVideo.tabChunks.highEString.length * UploadVideo.videoDuration / 100)
                    this.addMarkers();
                    // Start drawing frames
                    requestAnimationFrame(drawFrame);
                });
            }
        });

        // Function to update text for each line based on video time
        function updateText(strings: string[], times: { start: number; end: number }[], lineIndex: number) {
            const currentTime = video.currentTime;
            currentText[lineIndex] = '';
            times.forEach((time, index) => {
                if (currentTime >= time.start && currentTime < time.end) {
                    currentText[lineIndex] = strings[index];
                }
            });
        }

        // Toggle play/pause on click
        videoEditingToolsContainer.addEventListener("click", () => {
            if (!video.src) {
                return;
            }

            if (video.paused) {
                requestAnimationFrame(drawFrame)
                video.play();
                pauseIcon.style.display = "none";
            } else {
                video.pause();
                pauseIcon.style.display = "flex";
            }
        });

        timeline.addEventListener("change", () => {
            drawFrame();
        })

        function drawSingleFrame() {
            ctx.clearRect(0, 0, canvas.width, canvas.height);
            ctx.drawImage(video, 0, 0, canvas.width, canvas.height);
        }

        // Seek video to the corresponding time when dragging the scroll bar
        timeline.addEventListener("input", () => {
            const seekTime = (Number(timeline.value) / 100) * video.duration;
            if (Number.isNaN(seekTime)) {
                return;
            }
            video.currentTime = seekTime;
            drawSingleFrame(); // Draw the current frame
            video.pause(); // Pause the video
            pauseIcon.style.display = "flex";
        });

        // Update text for all six lines
        video.addEventListener('timeupdate', () => {
            console.log(video.currentTime)
            const progress = (video.currentTime / video.duration) * 100;
            timeline.value = progress.toString();
            updateText(strings1, times1, 0);
            updateText(strings2, times2, 1);
            updateText(strings3, times3, 2);
            updateText(strings4, times4, 3);
            updateText(strings5, times5, 4);
            updateText(strings6, times6, 5);
        });

        function drawFrame(): void {
            if (video.paused || video.ended) {
                return;
            }
            ctx.clearRect(0, 0, canvas.width, canvas.height);

            // Draw video frame to canvas
            ctx.drawImage(video, 0, 0, canvas.width, canvas.height);

            // Set text style
            ctx.font = '48px Monospace';
            ctx.fillStyle = 'white';
            ctx.strokeStyle = 'white';
            ctx.lineWidth = 2;
            ctx.textAlign = 'left';

            // Display all six strings stacked vertically
            currentText.forEach((text, index) => {
                if (text) {
                    const textX = 50;
                    const textY = canvas.height - (6 - index) * lineHeight - 100;
                    ctx.fillText(text, textX, textY);
                    ctx.strokeText(text, textX, textY);
                }
            });

            requestAnimationFrame(drawFrame);
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
        UploadVideo.tabChunks = this.splitTabIntoChunks(this.formatTabForPDFExport(tab.tabData));
        this.initVideoUpload();
    }

    private splitTabIntoChunks = (tab: any) => {
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

        // The counter doubles as the length of the string that gets displayed on the video.
        let counter: number = 33;
        let timer: number = this.TIMER;

        for (let i: number = 0; i < highESplitArray.length; i++) {
            highEReturnArray.push(highESplitArray[i]);
            bReturnArray.push(bSplitArray[i]);
            gReturnArray.push(gSplitArray[i]);
            dReturnArray.push(dSplitArray[i]);
            aReturnArray.push(aSplitArray[i]);
            eReturnArray.push(eSplitArray[i]);

            if (i === counter || i === highESplitArray.length - 1) {
                returnObj.highEString.push({text: highEReturnArray.join(""), id: i, time: { start: timer, end: timer + this.TIMER }});
                returnObj.bString.push({text: bReturnArray.join(""), id: i, time: { start: timer, end: timer + this.TIMER }});
                returnObj.gString.push({text: gReturnArray.join(""), id: i, time: { start: timer, end: timer + this.TIMER }});
                returnObj.dString.push({text: dReturnArray.join(""), id: i, time: { start: timer, end: timer + this.TIMER }});
                returnObj.aString.push({text: aReturnArray.join(""), id: i, time: { start: timer, end: timer + this.TIMER }});
                returnObj.eString.push({text: eReturnArray.join(""), id: i, time: { start: timer, end: timer + this.TIMER }});
                counter += 33;
                timer += this.TIMER;
                highEReturnArray.splice(0, i);
                bReturnArray.splice(0, i);
                gReturnArray.splice(0, i);
                dReturnArray.splice(0, i);
                aReturnArray.splice(0, i);
                eReturnArray.splice(0, i);
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
