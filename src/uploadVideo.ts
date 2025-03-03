import "./uploadVideo.css";
import logo from "./images/emblem.svg"

const url = "https://guitar-tablature-to-pdf-147ddb720da0.herokuapp.com/";
// const url = "http://localhost:5000/";
const apiKey = 'eyJ0eXAiOiJKV1QiLCJhbGciOiJSUzI1NiJ9.eyJhdWQiOiIxIiwianRpIjoiNzBjYWM3ZjY2YWRkYWE3ZTFiNjY1ZjI5YzRkNzliZjQyZjk5NzhiZDZlYTBmMmFmN2Y5ZmRhZDc1ZDNiZTk2YWJkNjI0MjhjZDc3ZTkzNTIiLCJpYXQiOjE3NDA1NjY0MDQuODE3MjY5LCJuYmYiOjE3NDA1NjY0MDQuODE3MjcxLCJleHAiOjQ4OTYyNDAwMDQuODExNjM5LCJzdWIiOiI3MTE3MTY1MyIsInNjb3BlcyI6WyJ1c2VyLnJlYWQiLCJ1c2VyLndyaXRlIiwidGFzay5yZWFkIiwidGFzay53cml0ZSIsIndlYmhvb2sucmVhZCIsIndlYmhvb2sud3JpdGUiLCJwcmVzZXQucmVhZCIsInByZXNldC53cml0ZSJdfQ.B8py_YqzZMacZP2WnSQHJm_Gh97EvSz1j1g4nvGOsGd9DvxqUha3ZOuiSZsOD-0bItKPBFJP7PLILZd1K5YCJwvSV1e5XkmaUM4_QYo870xi8DfmNR6bN5zf5nquwj7aVORirv6_q1pzjV5tg3j0RXSMV-GSsBA4wCE3oLEOg6GtcEVdV5soLv5jwbWhauDSuFoXiZI61bQut2TsAngVUlN0wyLr3ufH68izMwRRlPJdpHh_D7KfjTdMN5Gxb9QKUGjJ0ekdw5e5JZKACSGZNJAdcHeEElcTHnFLnjn0I-4edwQaBbu1qwvEF8ZvFN0ZrPvBEUtkd5bzyuT60NOzensyfnHyYaiZd1FaiGN_bLIsW_vCfUfDWOiOAEeRHb_mpwj64y2sLT1HGFqi6rWFS3b4uNxD22TF7DM62PiS6AzCljhG4n8fScdncLmT6DuqQ7PPcj4HfE5ixd8QuuES7ZwP05RDmTeNgN-lYZ-Kkb-5l06ElwOc9K7-ORSU_iPp0pCJtf5KrtVcdqd4HZ3zgCZ7EBczKbTMusP4eCKo0r-TmoZCx0grJ83MBoPkgtRrQwzyyaLl-qq4_eSvmelYLsYS6BwLIE_YF-ljXf90JkuQIFZpCpHKICebrbGiCVrr93WTqvUz4hmrqEuilbwh-etxjF_Nd-Kq5hJ9RjZSz5s';

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
        this.addBackButtonListener();
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
        
        backButton.addEventListener("click", () => {
            window.location.href = "create.html?username=" + this.user.username + "&title=" + this.tabTitle;
        });
    };

    private addTabSegmentListeners = () => {
        const tabSegmentStartButton: HTMLDivElement = document.getElementById("start-tab-segment-button") as HTMLDivElement;
        const tabSegmentEndButton: HTMLDivElement = document.getElementById("end-tab-segment-button") as HTMLDivElement;
        const timeline = document.getElementById("video-timeline") as HTMLInputElement;
        
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
        });

        tabSegmentEndButton.addEventListener("click", () => {
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
        const video = document.createElement("video");
        const canvas: HTMLCanvasElement = document.getElementById("video-canvas") as HTMLCanvasElement;
        const ctx = canvas.getContext("2d")!;
        const creatingVideoDisplay: HTMLElement = document.getElementById("loading-modal") as HTMLElement;
        const creatingVideoText: HTMLElement = document.getElementById("loading-message") as HTMLElement;

        let currentText = ["", "", "", "", "", ""];
        const lineHeight = 50;

        video.style.display = "none";
        video.src = URL.createObjectURL(src);

        let recorder: MediaRecorder, chunks: Blob[] = [], stream: MediaStream;
        let isRecording = false;

        function drawFrame(): void {
            if (!isRecording) return;

            ctx.clearRect(0, 0, canvas.width, canvas.height);
            ctx.drawImage(video, 0, 0, canvas.width, canvas.height);

            ctx.font = '48px Monospace';
            ctx.fillStyle = 'white';
            ctx.strokeStyle = 'white';
            ctx.lineWidth = 2;
            ctx.textAlign = 'left';

            currentText.forEach((text, index) => {
                if (text) {
                    const textX = 50;
                    const textY = canvas.height - (6 - index) * lineHeight - 100;
                    ctx.fillText(text, textX, textY);
                    ctx.strokeText(text, textX, textY);
                }
            });

            if (video.currentTime >= video.duration) {
                recorder.stop();
                isRecording = false;
                return;
            }

            requestAnimationFrame(drawFrame);
        }

        function resetTimeline() {
            const timelineInput = document.getElementById("video-timeline") as HTMLInputElement;
            if (timelineInput) {
                timelineInput.value = "0"; // Set the slider to the beginning
                timelineInput.dispatchEvent(new Event("input")); // Simulate user interaction
            }
        }

        function startRecording(): void {
            if (isRecording) return;
            creatingVideoDisplay.style.display = "flex";
            resetTimeline();

            chunks = [];
            const estimatedFrameRate = 30;
            stream = canvas.captureStream(estimatedFrameRate);
            recorder = new MediaRecorder(stream, { mimeType: "video/webm" });

            recorder.ondataavailable = (e: BlobEvent) => {
                if (e.data && e.data.size > 0) {
                    chunks.push(e.data);
                }
            };

            recorder.onstop = async () => {
                const webmBlob = new Blob(chunks, { type: "video/webm" });
                await uploadAndConvert(webmBlob, tabTitle);
            };

            recorder.start();
            isRecording = true;
            video.play();
            drawFrame();
        }

        async function uploadAndConvert(blob: Blob, filename: string): Promise<void> {
            try {
                creatingVideoText.innerHTML = "Starting upload and conversion process...";

                // Step 1: Create CloudConvert Job
                const jobResponse = await fetch("https://api.cloudconvert.com/v2/jobs", {
                    method: "POST",
                    headers: {
                        "Authorization": `Bearer ${apiKey}`,
                        "Content-Type": "application/json"
                    },
                    body: JSON.stringify({
                        tasks: {
                            "upload": { "operation": "import/upload" },
                            "convert": {
                                "operation": "convert",
                                "input": ["upload"],
                                "output_format": "mp4",
                                "options": { 
                                    "video_codec": "h264",     
                                    "audio_codec": "aac",  // Ensure audio is processed with AAC code                                
                                }
                            },
                            "export": { "operation": "export/url", "input": ["convert"] }
                        }
                    })
                });
        
                if (!jobResponse.ok) {
                    creatingVideoText.innerHTML = `ERROR: Job Creation Error: ${jobResponse.statusText}`;
                }
        
                const jobData = await jobResponse.json();
                creatingVideoText.innerHTML = "MP4 Conversion in progress...";

                // Step 2: Extract Upload Task & Parameters
                const uploadTask = jobData.data.tasks.find((task: any) => task.operation === "import/upload");
                if (!uploadTask || !uploadTask.result?.form?.url) {
                    creatingVideoText.innerHTML = "ERROR: Upload URL not found in CloudConvert response.";
                }
        
                const uploadUrl = uploadTask.result.form.url;
                const parameters = uploadTask.result.form.parameters || {}; // Ensure parameters exist

                // Step 3: Prepare Form Data (Including Required Parameters)
                const formData = new FormData();
                
                // Append all required parameters from CloudConvert's response
                for (const [key, value] of Object.entries(parameters)) {
                    formData.append(key, value as string);
                }
        
                formData.append("file", blob, filename + ".webm");
        
                // Step 4: Upload File
                const uploadFileResponse = await fetch(uploadUrl, { method: "POST", body: formData });
        
                if (!uploadFileResponse.ok) {
                    const errorText = await uploadFileResponse.text();
                    creatingVideoText.innerHTML = `File Upload Error: ${errorText}`;
                }
        
                creatingVideoText.innerHTML = "File uploaded successfully. Waiting for conversion...";

                // Step 5: Poll for Conversion Status
                const jobId = jobData.data.id;
                let convertedFileUrl: string | null = null;
        
                while (!convertedFileUrl) {
                    await new Promise(res => setTimeout(res, 5000)); // Wait 5 seconds before checking status
        
                    const jobStatusResponse = await fetch(`https://api.cloudconvert.com/v2/jobs/${jobId}`, {
                        headers: { "Authorization": `Bearer ${apiKey}` }
                    });
        
                    const jobStatusData = await jobStatusResponse.json();
                    creatingVideoText.innerHTML = 'Conversion Status: "' + jobStatusData.data.status + '"';
                    const exportTask = jobStatusData.data.tasks.find((task: any) => task.operation === "export/url" && task.status === "finished");
                    convertedFileUrl = exportTask?.result?.files?.[0]?.url || null;
                }
        
                if (convertedFileUrl) {
                    const a = document.createElement("a");
                    a.href = convertedFileUrl;
                    a.download = filename + ".mp4";
                    document.body.appendChild(a);
                    a.click();
                    document.body.removeChild(a);
                    creatingVideoText.innerHTML = "Downloading...";
                    const loadingIcon: HTMLElement = document.getElementById("loading-icon") as HTMLElement;
                    loadingIcon.style.display = "none";

                    setTimeout(() => {
                        creatingVideoDisplay.style.display = "none";
                        const backButton: HTMLElement = document.getElementById("return-to-tab-button") as HTMLElement;
                        backButton.click();
                    }, 5000);
                } else {
                    creatingVideoText.innerHTML = "Else";
                }
        
            } catch (error) {
                console.error("Error during WebM to MP4 conversion:", error);
            }
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
        const video = document.createElement('video');
        const timeline = document.getElementById("video-timeline") as HTMLInputElement;
        const pauseIcon: HTMLElement = document.getElementById("pause-icon") as HTMLElement;
        const tabSegmentsDisplay: HTMLElement = document.getElementById("view-tab-chunks-button") as HTMLElement;
        videoIcon.src = logo;

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
