import "./uploadVideo.css";
import logo from "./images/landing-logo.svg"
import { io } from 'socket.io-client';

const url = "https://guitar-tablature-to-pdf-147ddb720da0.herokuapp.com/";
// const url = "http://localhost:5000/";
const socket = io(url); // Your server URL

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

    private detectBrowser(): string {
        const userAgent = navigator.userAgent;
    
        // Check for Mobile Safari
        if (/iP(hone|od|ad).*Safari/i.test(userAgent)) {
            return "Safari Mobile";
        }

        // Check for Safari on macOS (excluding Chrome and other WebKit-based browsers)
        if (/Safari/i.test(userAgent) && !/Chrome/i.test(userAgent)) {
            return "Safari";
        }
    
        // Check for Firefox
        if (/Firefox/i.test(userAgent)) {
            return "Firefox";
        }
    
        return "Other";
    }

    private openWelcomePopupModal = (htmlString: string) => {
        const popupModal: HTMLDivElement = document.getElementById("tutorial-modal") as HTMLDivElement;
        const popupModalOverlay: HTMLDivElement = document.getElementById("tutorial-modal-overlay") as HTMLDivElement;
        popupModal.innerHTML = htmlString;
        popupModal.style.display = "flex";
        popupModalOverlay.style.display = "flex";

        const confirmWelcomeButton: HTMLButtonElement = document.getElementById("welcome-confirm-button") as HTMLButtonElement;
        confirmWelcomeButton.addEventListener("click", () => {
            const uploadVideoButton: HTMLButtonElement = document.getElementById("upload-file-button") as HTMLButtonElement;
            const popupModal: HTMLDivElement = document.getElementById("tutorial-modal") as HTMLDivElement;
            const popupModalOverlay: HTMLDivElement = document.getElementById("tutorial-modal-overlay") as HTMLDivElement;
            popupModal.style.display = "none";
            popupModalOverlay.style.display = "none";

            setTimeout(() => {
                uploadVideoButton.classList.add("tab-cell-active-tutorial");
            }, 500);
        })
    };

    private openSelectFirstClipPopupModal = (htmlString: string) => {
        const popupModal: HTMLDivElement = document.getElementById("tutorial-modal") as HTMLDivElement;
        const popupModalOverlay: HTMLDivElement = document.getElementById("tutorial-modal-overlay") as HTMLDivElement;
        const tabChunksButton: HTMLButtonElement = document.getElementById("view-tab-chunks-button") as HTMLButtonElement;
        popupModal.innerHTML = htmlString;
        popupModal.style.display = "flex";
        popupModalOverlay.style.display = "flex";
        tabChunksButton.classList.remove("tab-cell-active-tutorial");

        const confirmWelcomeButton: HTMLButtonElement = document.getElementById("welcome-confirm-button") as HTMLButtonElement;
        confirmWelcomeButton.addEventListener("click", () => {
            const tabChunksButton: HTMLCollectionOf<HTMLElement> = document.getElementsByClassName("tab-chunk-text") as HTMLCollectionOf<HTMLElement>;
            const popupModal: HTMLDivElement = document.getElementById("tutorial-modal") as HTMLDivElement;
            const popupModalOverlay: HTMLDivElement = document.getElementById("tutorial-modal-overlay") as HTMLDivElement;
            popupModal.style.display = "none";
            popupModalOverlay.style.display = "none";

            setTimeout(() => {
                tabChunksButton[0].classList.add("tab-cell-active-tutorial");
            }, 500);
        })
    };

    private openSelectClipPopupModal = (htmlString: string) => {
        const popupModal: HTMLDivElement = document.getElementById("tutorial-modal") as HTMLDivElement;
        const popupModalOverlay: HTMLDivElement = document.getElementById("tutorial-modal-overlay") as HTMLDivElement;
        popupModal.innerHTML = htmlString;
        popupModal.style.display = "flex";
        popupModalOverlay.style.display = "flex";

        const confirmWelcomeButton: HTMLButtonElement = document.getElementById("welcome-confirm-button") as HTMLButtonElement;
        confirmWelcomeButton.addEventListener("click", () => {
            const tabChunksButton: HTMLButtonElement = document.getElementById("view-tab-chunks-button") as HTMLButtonElement;
            const popupModal: HTMLDivElement = document.getElementById("tutorial-modal") as HTMLDivElement;
            const popupModalOverlay: HTMLDivElement = document.getElementById("tutorial-modal-overlay") as HTMLDivElement;
            popupModal.style.display = "none";
            popupModalOverlay.style.display = "none";

            setTimeout(() => {
                tabChunksButton.classList.add("tab-cell-active-tutorial");
            }, 500);
        })
    };

    private openSetStartPointPopupModal = (htmlString: string) => {
        const popupModal: HTMLDivElement = document.getElementById("tutorial-modal") as HTMLDivElement;
        const popupModalOverlay: HTMLDivElement = document.getElementById("tutorial-modal-overlay") as HTMLDivElement;
        const tabChunksButton: HTMLCollectionOf<HTMLElement> = document.getElementsByClassName("tab-chunk-text") as HTMLCollectionOf<HTMLElement>;
        popupModal.innerHTML = htmlString;
        popupModal.style.display = "flex";
        popupModalOverlay.style.display = "flex";
        tabChunksButton[0].classList.remove("tab-cell-active-tutorial");

        const confirmWelcomeButton: HTMLButtonElement = document.getElementById("welcome-confirm-button") as HTMLButtonElement;
        confirmWelcomeButton.addEventListener("click", () => {
            const startButton: HTMLDivElement = document.getElementById("start-tab-segment-button") as HTMLDivElement;
            const popupModal: HTMLDivElement = document.getElementById("tutorial-modal") as HTMLDivElement;
            const popupModalOverlay: HTMLDivElement = document.getElementById("tutorial-modal-overlay") as HTMLDivElement;
            popupModal.style.display = "none";
            popupModalOverlay.style.display = "none";

            setTimeout(() => {
                startButton.classList.add("tab-cell-active-tutorial");
            }, 500);
        })
    };

    private openSetEndPointPopupModal = (htmlString: string) => {
        const popupModal: HTMLDivElement = document.getElementById("tutorial-modal") as HTMLDivElement;
        const popupModalOverlay: HTMLDivElement = document.getElementById("tutorial-modal-overlay") as HTMLDivElement;
        const startButton: HTMLDivElement = document.getElementById("start-tab-segment-button") as HTMLDivElement;
        popupModal.innerHTML = htmlString;
        popupModal.style.display = "flex";
        popupModalOverlay.style.display = "flex";
        startButton.classList.remove("tab-cell-active-tutorial");

        const confirmWelcomeButton: HTMLButtonElement = document.getElementById("welcome-confirm-button") as HTMLButtonElement;
        confirmWelcomeButton.addEventListener("click", () => {
            const endButton: HTMLDivElement = document.getElementById("end-tab-segment-button") as HTMLDivElement;
            const popupModal: HTMLDivElement = document.getElementById("tutorial-modal") as HTMLDivElement;
            const popupModalOverlay: HTMLDivElement = document.getElementById("tutorial-modal-overlay") as HTMLDivElement;
            popupModal.style.display = "none";
            popupModalOverlay.style.display = "none";

            setTimeout(() => {
                endButton.classList.add("tab-cell-active-tutorial");
            }, 500);
        })
    };

    private openTutorialDownloadPopupModal = (htmlString: string) => {
        const popupModal: HTMLDivElement = document.getElementById("tutorial-modal") as HTMLDivElement;
        const popupModalOverlay: HTMLDivElement = document.getElementById("tutorial-modal-overlay") as HTMLDivElement;
        const endButton: HTMLDivElement = document.getElementById("end-tab-segment-button") as HTMLDivElement;
        popupModal.innerHTML = htmlString;
        popupModal.style.display = "flex";
        popupModalOverlay.style.display = "flex";
        endButton.classList.remove("tab-cell-active-tutorial");

        const confirmWelcomeButton: HTMLButtonElement = document.getElementById("welcome-confirm-button") as HTMLButtonElement;
        confirmWelcomeButton.addEventListener("click", () => {
            const endButton: HTMLDivElement = document.getElementById("end-tab-segment-button") as HTMLDivElement;
            const popupModal: HTMLDivElement = document.getElementById("tutorial-modal") as HTMLDivElement;
            const popupModalOverlay: HTMLDivElement = document.getElementById("tutorial-modal-overlay") as HTMLDivElement;
            popupModal.style.display = "none";
            popupModalOverlay.style.display = "none";

            setTimeout(() => {
                const downloadButton: HTMLDivElement = document.getElementById("start-record") as HTMLDivElement;
                const endButton: HTMLDivElement = document.getElementById("end-tab-segment-button") as HTMLDivElement;
                endButton.classList.remove("tab-cell-active-tutorial");
                downloadButton.classList.add("tab-cell-active-tutorial");
            }, 500);
        })
    };

    private openNotificationPopupModal = (htmlString: string) => {
        const popupModal: HTMLDivElement = document.getElementById("tutorial-modal") as HTMLDivElement;
        const popupModalOverlay: HTMLDivElement = document.getElementById("tutorial-modal-overlay") as HTMLDivElement;
        popupModal.innerHTML = htmlString;
        popupModal.style.display = "flex";
        popupModalOverlay.style.display = "flex";

        const confirmWelcomeButton: HTMLButtonElement = document.getElementById("welcome-confirm-button") as HTMLButtonElement;
        const backWelcomeButton: HTMLButtonElement = document.getElementById("welcome-back-button") as HTMLButtonElement;
        
        confirmWelcomeButton.addEventListener("click", () => {
            popupModal.style.display = "none";
            popupModalOverlay.style.display = "none";
        });

        backWelcomeButton.addEventListener("click", () => {
            window.location.href = "create.html?username=" + this.user.username + "&title=" + this.tabTitle;
        });
    };

    // Tutorial Welcome.
    private initWelcomeTutorialFlow = () => {
        const welcomeLabel: HTMLLabelElement = document.createElement("label") as HTMLLabelElement;
        const welcomeButton: HTMLButtonElement = document.createElement("button") as HTMLButtonElement;
        welcomeButton.id = "welcome-confirm-button";
        welcomeButton.innerHTML = "Let's upload it!";
        welcomeLabel.innerHTML = "TabTok's Video Generator is currently in Beta. We're still working out a few kinks. There's a lot of cool stuff to check out! Let's upload the video you would like to add your tabs to. You can upload a video up to 5 minutes long.";

        setTimeout(() => {
            this.openWelcomePopupModal(welcomeLabel.outerHTML + welcomeButton.outerHTML);
        }, 10);
    };

    // Notifications.
    private initNotificationFlow = () => {
        const welcomeLabel: HTMLLabelElement = document.createElement("label") as HTMLLabelElement;
        const welcomeButton: HTMLButtonElement = document.createElement("button") as HTMLButtonElement;
        const backButton: HTMLButtonElement = document.createElement("button") as HTMLButtonElement;
        backButton.id = "welcome-back-button";
        welcomeButton.id = "welcome-confirm-button";
        welcomeButton.innerHTML = "Sweet!";
        backButton.innerHTML = "Ahh! Turn Back!";
        welcomeLabel.innerHTML = "TabTok's Video Generator is currently in Beta. We're still working out a few kinks. There's a lot of cool stuff to check out! So head on in!";

        setTimeout(() => {
            this.openNotificationPopupModal(welcomeLabel.outerHTML + welcomeButton.outerHTML + backButton.outerHTML);
        }, 10);
    };

    // Select Clip
    private initSelectClipTutorialFlow = () => {
        const welcomeLabel: HTMLLabelElement = document.createElement("label") as HTMLLabelElement;
        const welcomeButton: HTMLButtonElement = document.createElement("button") as HTMLButtonElement;
        welcomeButton.id = "welcome-confirm-button";
        welcomeButton.innerHTML = "Got it!";
        welcomeLabel.innerHTML = "Now that our video is uploaded, we'll have to select the first clip and place it on the timeline so that it matches up with our fingers.";

        setTimeout(() => {
            this.openSelectClipPopupModal(welcomeLabel.outerHTML + welcomeButton.outerHTML);
        }, 1000);
    };

    // First Clip
    private initSelectFirstClipTutorialFlow = () => {
        const welcomeLabel: HTMLLabelElement = document.createElement("label") as HTMLLabelElement;
        const welcomeButton: HTMLButtonElement = document.createElement("button") as HTMLButtonElement;
        welcomeButton.id = "welcome-confirm-button";
        welcomeButton.innerHTML = "Got it!";
        welcomeLabel.innerHTML = "Now select the clip that you'd like to edit. How about this first one?";

        setTimeout(() => {
            this.openSelectFirstClipPopupModal(welcomeLabel.outerHTML + welcomeButton.outerHTML);
        }, 1000);
    };

    // Start Point
    private initSetStartPointFlow = () => {
        const welcomeLabel: HTMLLabelElement = document.createElement("label") as HTMLLabelElement;
        const welcomeButton: HTMLButtonElement = document.createElement("button") as HTMLButtonElement;
        welcomeButton.id = "welcome-confirm-button";
        welcomeButton.innerHTML = "Got it!";
        welcomeLabel.innerHTML = "Now let's set the starting point for this segment of your tab. The starting point will be set wherever the dot on the scroll bar is when the start button is clicked.";

        setTimeout(() => {
            this.openSetStartPointPopupModal(welcomeLabel.outerHTML + welcomeButton.outerHTML);
        }, 1000);
    };

    // End Point
    private initSetEndPointFlow = () => {
        const welcomeLabel: HTMLLabelElement = document.createElement("label") as HTMLLabelElement;
        const welcomeButton: HTMLButtonElement = document.createElement("button") as HTMLButtonElement;
        welcomeButton.id = "welcome-confirm-button";
        welcomeButton.innerHTML = "Got it!";
        welcomeLabel.innerHTML = "Nice! You'll see that the colored bar that matches the clip color on the timeline has adjusted to display the clip's new starting position. Next let's set the ending point for this segment of your tab. The ending point will be set wherever the dot on the scroll bar is when the end button is clicked.";

        setTimeout(() => {
            this.openSetEndPointPopupModal(welcomeLabel.outerHTML + welcomeButton.outerHTML);
        }, 1000);
    };

    // MP4
    private initSaveMP4Flow = () => {
        const welcomeLabel: HTMLLabelElement = document.createElement("label") as HTMLLabelElement;
        const welcomeButton: HTMLButtonElement = document.createElement("button") as HTMLButtonElement;
        welcomeButton.id = "welcome-confirm-button";
        welcomeButton.innerHTML = "Got it!";
        welcomeLabel.innerHTML = "Awesome! Now that we've set our clips so they can match our fingers, we're ready to download our video for TickTok, Instagram, and Twitter! Click the download button and we'll guide you through the download!";

        setTimeout(() => {
            this.openTutorialDownloadPopupModal(welcomeLabel.outerHTML + welcomeButton.outerHTML);
        }, 1000);
    };

    private initTutorial = () => {
        this.initWelcomeTutorialFlow();
    };

    public init = () => {
        this.initNotificationFlow();

        // TODO: If firefox or safari modible doesn't work reactivate.
        // if (this.detectBrowser() === "Safari Mobile" || this.detectBrowser() === "Firefox") {
        //     const body = document.querySelector("body") as HTMLBodyElement;
        //     body.innerHTML = "<h1 style='text-align: center; color: white;'> We're sorry, TickTabs.com is not currently set up to work on your browser.</h1>";
        // }
        // else {
        this.getUserAccount();
        this.addTabSegmentListeners();
        this.addBackButtonListener();
        // }
    }

    private addClosePopupListener = () => {
        const closeIcon: HTMLElement = document.getElementById("close-tab-chunk-container-icon") as HTMLElement;
        closeIcon.addEventListener("click", () => {
            const popupModal: HTMLElement = document.getElementById("popup-modal") as HTMLElement;
            popupModal.style.display = "none";
        });
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
            tabChunk.setAttribute("color", this.tabClipSegmentColors[i]);
            tabChunkContainer.append(tabChunk);
        };

        const closeIcon = document.createElement("i");
        closeIcon.classList.add("fas");
        closeIcon.classList.add("fa-angle-down");
        closeIcon.id = "close-tab-chunk-container-icon"
        tabChunkContainer.prepend(closeIcon);

        return tabChunkContainer.outerHTML;
    };

    private adjustTabChunkTime = (tabChunk: any) => {
        const tabChunkId: string = tabChunk.id.split("-")[2];
        UploadVideo.selectedTabChunkId = tabChunkId;
    };

    private addBackButtonListener = () => {
        const backButton: HTMLElement = document.getElementById("return-to-tab-button") as HTMLElement;
        if (!backButton) return;

        backButton.addEventListener("click", () => {
            window.location.href = "create.html?username=" + this.user.username + "&title=" + this.tabTitle;
        });
    };

    private addTabSegmentListeners = () => {
        const tabSegmentStartButton: HTMLDivElement = document.getElementById("start-tab-segment-button") as HTMLDivElement;
        const tabSegmentEndButton: HTMLDivElement = document.getElementById("end-tab-segment-button") as HTMLDivElement;
        const timeline = document.getElementById("video-timeline") as HTMLInputElement;
        
        if (!tabSegmentStartButton || !tabSegmentEndButton) return;
        tabSegmentStartButton.addEventListener("click", () => {
            tabSegmentStartButton.style.backgroundColor = "#23FE69";
            setTimeout(() => {
                tabSegmentStartButton.style.backgroundColor = "rgb(29, 29, 31, .75)";
            }, 1000);

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

            // TODO: Remove this when you are finished polishing the video feature.
            if (this.tabTitle === "Tutorial") {
                this.initSetEndPointFlow();
            }
        });

        tabSegmentEndButton.addEventListener("click", () => {
            if (this.tabTitle === "Tutorial") {
                this.initSaveMP4Flow();
            }
            tabSegmentEndButton.style.backgroundColor = "#23FE69";
            setTimeout(() => {
                tabSegmentEndButton.style.backgroundColor = "rgb(29, 29, 31, .75)";
            }, 1000);

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

    private resetTimeline() {
        const timelineInput = document.getElementById("video-timeline") as HTMLInputElement;
        if (timelineInput) {
            timelineInput.value = "0"; // Set the slider to the beginning
            timelineInput.dispatchEvent(new Event("input")); // Simulate user interaction
        }
    }

    private saveVideo = async (src: Blob, tabTitle: string): Promise<void> => {
        const startButton: HTMLElement = document.getElementById('start-record') as HTMLElement;
        const video: any = document.createElement("video");
        const canvas: HTMLCanvasElement = document.getElementById("video-canvas") as HTMLCanvasElement;
        const ctx: CanvasRenderingContext2D = canvas.getContext("2d")!;
        const creatingVideoDisplay: HTMLElement = document.getElementById("loading-modal") as HTMLElement;
        const creatingVideoText: HTMLElement = document.getElementById("loading-message") as HTMLElement;
    
        let currentText: string[] = ["", "", "", "", "", ""];
        const lineHeight: number = 50;
    
        video.style.display = "none";
        video.src = URL.createObjectURL(src);
        video.crossOrigin = "anonymous";
    
        let recorder!: MediaRecorder;
        let chunks: Blob[] = [];
        let isRecording: boolean = false;
    
        function drawFrame(): void {
            if (!isRecording) return;
    
            ctx.clearRect(0, 0, canvas.width, canvas.height);
            ctx.drawImage(video, 0, 0, canvas.width, canvas.height);
    
            ctx.font = '48px Monospace';
            ctx.fillStyle = 'white';
            ctx.strokeStyle = 'white';
            ctx.lineWidth = 2;
            ctx.textAlign = 'left';
    
            currentText.forEach((text: string, index: number): void => {
                if (text) {
                    const textX: number = 50;
                    const textY: number = canvas.height - (6 - index) * lineHeight - 100;
                    ctx.fillText(text, textX, textY);
                    ctx.strokeText(text, textX, textY);
                }
            });
    
            if (video.currentTime >= video.duration) {
                recorder.stop();
                console.log("stop")
                isRecording = false;
                return;
            }
    
            requestAnimationFrame(drawFrame);
        }
    
        function resetTimeline(): void {
            const timelineInput: HTMLInputElement | null = document.getElementById("video-timeline") as HTMLInputElement;
            if (timelineInput) {
                timelineInput.value = "0";
                timelineInput.dispatchEvent(new Event("input"));
            }
        }
    
        function startRecording(): void {
            if (isRecording) return;
            creatingVideoDisplay.style.display = "flex";
            resetTimeline();
        
            chunks = [];
        
            const estimatedFrameRate: number = 30;
            const canvasStream: MediaStream = canvas.captureStream(estimatedFrameRate);
        
            let audioTracks: MediaStreamTrack[] = [];
            if ("captureStream" in video) {
                const audioStream: MediaStream = video.captureStream();
                audioTracks = audioStream.getAudioTracks();
            } else {
                const audioContext: AudioContext = new AudioContext();
                const source: MediaElementAudioSourceNode = audioContext.createMediaElementSource(video);
                const dest: MediaStreamAudioDestinationNode = audioContext.createMediaStreamDestination();
                source.connect(dest);
                source.connect(audioContext.destination);
                audioTracks = dest.stream.getAudioTracks();
            }
        
            const combinedStream: MediaStream = new MediaStream([
                ...canvasStream.getVideoTracks(),
                ...audioTracks
            ]);
        
            // **Check for supported MIME types**
            let mimeType: string = "";
            if (MediaRecorder.isTypeSupported("video/webm; codecs=vp9")) {
                mimeType = "video/webm; codecs=vp9";
            } else if (MediaRecorder.isTypeSupported("video/webm; codecs=vp8")) {
                mimeType = "video/webm; codecs=vp8";
            } else if (MediaRecorder.isTypeSupported("video/mp4; codecs=avc1.42E01E,mp4a.40.2")) {
                mimeType = "video/mp4"; // Safari prefers MP4
            } else {
                creatingVideoText.innerHTML = "ERROR: Your browser does not support recording in WebM or MP4.";
                return;
            }
        
            try {
                recorder = new MediaRecorder(combinedStream, { mimeType });
            } catch (e) {
                creatingVideoText.innerHTML = `ERROR: MediaRecorder failed. Browser might not support ${mimeType}.`;
                return;
            }
        
            recorder.ondataavailable = (e: BlobEvent): void => {
                if (e.data && e.data.size > 0) {
                    chunks.push(e.data);
                }
            };
        
            recorder.onstop = async (): Promise<void> => {
                const recordedBlob: Blob = new Blob(chunks, { type: mimeType });
                await uploadAndConvert(recordedBlob, tabTitle);
            };
        
            recorder.start();
            isRecording = true;
            video.play();
            drawFrame();
        }        
    
        async function uploadAndConvert(blob: Blob, filename: string): Promise<void> {
            creatingVideoText.innerHTML = "Uploading video for conversion...";
        
            filename = filename.replace(/ /g, "_");
        
            // Create FormData and append the video blob
            const formData: FormData = new FormData();
            formData.append("video", blob, `${filename}.webm`);
            const socketId = socket.id; // Get the socket ID for this client
            if (socketId) {
                formData.append('socketId', socketId); // Add the socketId to the form data
            } else {
                console.error('socketId is undefined');
            }        
            // Send the video to the server
            fetch(url + 'convert', {
                method: 'POST',
                body: formData,
            })
            .then(response => response.json()) // Expect JSON { message: 'Video conversion started.' }
            .then(data => {
                if (data.message) {
                    console.log(data.message); // Log the message
                } else {
                    creatingVideoText.innerHTML = 'Video processing failed.';
                }
            })
            .catch(error => {
                creatingVideoText.innerHTML = 'Error: ' + error.message;
                console.error('Fetch error:', error);
            });
        
            // Listen for the 'videoConversionComplete' event
            socket.on('videoConversionComplete', (data) => {
                console.log('Video conversion completed:', data.videoUrl);
                // Handle video URL, show the video, etc.
                creatingVideoText.innerHTML = 'Conversion Complete!';
                const a = document.createElement('a');
                a.style.display = 'none';
                a.href = data.videoUrl;
                a.download = filename + ".mp4";
                document.body.appendChild(a);
                a.click();
            });
        }        
    
        startButton.addEventListener('click', startRecording);
    };    

    private initVideoUpload = () => {
        // Get HTML elements
        const videoIcon: HTMLImageElement = document.getElementById("video-icon") as HTMLImageElement;
        const videoEditingToolsContainer: HTMLDivElement = document.getElementById("video-editing-tool-container") as HTMLDivElement;
        const videoInput = document.getElementById('video-upload') as HTMLInputElement;
        const canvas = document.getElementById('video-canvas') as HTMLCanvasElement;
        const ctx = canvas.getContext('2d')!;
        const video: any = document.createElement("video");
        const timeline = document.getElementById("video-timeline") as HTMLInputElement;
        const pauseIcon: HTMLElement = document.getElementById("pause-icon") as HTMLElement;
        const tabSegmentsDisplay: HTMLElement = document.getElementById("view-tab-chunks-button") as HTMLElement;
        videoIcon.src = logo;
        pauseIcon.style.display = "flex";

        // Six string arrays with different text.
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
            if (this.tabTitle === "Tutorial") {
                this.initSelectClipTutorialFlow();
            }
            const buttonContainer: HTMLDivElement = document.getElementById("upload-video-buttons-container") as HTMLDivElement;
            const videoCanvas: HTMLDivElement = document.getElementById("video-canvas") as HTMLDivElement;
            const videoIcon: HTMLImageElement = document.getElementById("video-icon") as HTMLImageElement;

            videoIcon.style.display = "none";
            buttonContainer.style.display = "none";
            videoCanvas.style.display = "block";

            const file = (event.target as HTMLInputElement).files?.[0];
            if (file) {
                // Initialize save video button.
                this.saveVideo(file, this.tabTitle);
                videoEditingToolsContainer.style.display = "block";
                const unloadVideoButton: HTMLElement = document.getElementById("unmount-video-button") as HTMLElement;
                unloadVideoButton.style.display = "block";

                tabSegmentsDisplay.addEventListener("click", () => {
                    if (this.tabTitle === "Tutorial") {
                        this.initSelectFirstClipTutorialFlow();
                    }
                    tabSegmentsDisplay.style.backgroundColor = "#23FE69";

                    setTimeout(() => {
                        tabSegmentsDisplay.style.backgroundColor = "rgb(29, 29, 31, .75)";
                    }, 500);

                    const popupModal: HTMLElement = document.getElementById("popup-modal") as HTMLElement;
                    popupModal.innerHTML = this.buildTabChunkHTML();
                    this.addClosePopupListener();
                    const tabChunks: HTMLCollectionOf<HTMLElement> = document.getElementsByClassName("tab-chunk-text") as HTMLCollectionOf<HTMLElement>;

                    for (let i: number = 0; i < tabChunks.length; i++) {
                        tabChunks[i].addEventListener("click", (event) => {
                            if (this.tabTitle === "Tutorial") {
                                this.initSetStartPointFlow();
                            }

                            const selectedTabIndicator: HTMLDivElement = document.getElementById("selected-tab-indicator") as HTMLDivElement;

                            for (let i: number = 0; i < tabChunks.length; i++) {
                                tabChunks[i].classList.remove("tab-segment-selected");
                            };

                            selectedTabIndicator.style.backgroundColor = tabChunks[i].getAttribute("color")!;
                            selectedTabIndicator.innerHTML = "Clip " + (i + 1); 
                            this.adjustTabChunkTime(tabChunks[i]);
                            tabChunks[i].classList.add("tab-segment-selected");
                        });
                    };
                    popupModal.style.display = "flex";
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
                        videoIcon.src = logo;
                    };
                });

                const fileURL = URL.createObjectURL(file);
                video.src = fileURL;
                video.load();
                video.muted = false; // Optional: Mute video by default

                video.addEventListener('loadedmetadata', () => {
                    UploadVideo.videoDuration = Number(video.duration.toFixed(0))
                    // Set canvas dimensions to match video
                    canvas.width = video.videoWidth;
                    canvas.height = video.videoHeight;
                    this.TIMER = Math.round(UploadVideo.tabChunks.highEString.length * UploadVideo.videoDuration / 100)
                    this.addMarkers();
                    // Start drawing frames
                    // requestAnimationFrame(drawFrame);
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

        if (title === "Tutorial") {
            this.initTutorial();
        }

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
