const WS_URL = import.meta.env.VITE_WS_URL;

export class WebSocketClient {

    constructor(path) {
        this.url = `${WS_URL}${path}`;
        this.socket = null;
        this.onMessage = null;
        this.onConnectionChange = null;
    }

    connect() {
        this.socket = new WebSocket(this.url);
        this.socket.onopen = () => {
            console.log("WebSocket connected");
            if (this.onConnectionChange) {
                this.onConnectionChange(true);
            }
        };

        this.socket.onmessage = (event) => {
            const data = JSON.parse(event.data);
            if (this.onMessage) {
                this.onMessage(data);
            }
        };

        this.socket.onclose = () => {
            console.log("WebSocket disconnected");
            if (this.onConnectionChange) {
                this.onConnectionChange(false);
            }
        };

        this.socket.onerror = (error) => {
            console.error("WebSocket error:", error);
        };
    }

    send(data) {
        if (!this.socket) {
            return;
        }
        if (this.socket.readyState !== WebSocket.OPEN) {
            return;
        }
        this.socket.send(JSON.stringify(data));
    }

    disconnect() {
        if (this.socket) {
            this.socket.close();
        }
    }
}