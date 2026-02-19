export type MessageCallback = (message: string) => void;

class WebSocketService {
  private socket: WebSocket | null = null;
  private url: string = "";
  private messageCallback: MessageCallback | null = null;
  private manuallyClosed = false;
  private reconnectAttempts = 0;
  private maxReconnectAttempts = 1;


  public connect(url: string, onMessage?: MessageCallback): void {
    this.url = url;
    this.messageCallback = onMessage ?? null;
    this.manuallyClosed = false;

    // Agar allaqachon ulangan bo‘lsa
    if (this.socket && this.socket.readyState === WebSocket.OPEN) {
      console.warn("⚠️ WebSocket allaqachon ulangan.");
      return;
    }

    this.socket = new WebSocket(this.url);

    this.socket.onopen = () => {
      console.log("✅ WebSocket ulandi:", this.url);
      this.reconnectAttempts = 0;
    };

    this.socket.onmessage = (event: MessageEvent) => {
      console.log("📩 Xabar keldi:", event.data);
      if (this.messageCallback) {
        this.messageCallback(event.data);
      }
    };

    this.socket.onerror = (error) => {
      console.error("❌ WebSocket xato:", error);
    };

    this.socket.onclose = () => {
      console.log("🔌 WebSocket uzildi");
      this.socket = null;

      if (!this.manuallyClosed) {
        this.reconnect();
      }
    };
  }

  /*
    Ulanishni uzadi
   */
  public disconnect(): void {
    this.manuallyClosed = true;

    if (this.socket) {
      this.socket.close();
      this.socket = null;
      console.log("🔴 WebSocket aloqasi yopildi");
    }
  }

  /**
   * Xabar yuboradi
   */
  public sendMessage(message: string): void {
    if (this.socket && this.socket.readyState === WebSocket.OPEN) {
      this.socket.send(message);
      console.log("📤 Xabar yuborildi:", message);
    } else {
      console.warn("⚠️ WebSocket ochiq emas, xabar yuborilmadi.");
    }
  }

  /**
   * Serverdan keladigan xabarlarni o‘qish uchun callback belgilaydi
   */
  public onMessage(callback: MessageCallback): void {
    this.messageCallback = callback;
  }

  
  public isConnected(): boolean {
    return this.socket !== null && this.socket.readyState === WebSocket.OPEN;
  }

  
  private reconnect(): void {
    this.reconnectAttempts++;

    if (this.reconnectAttempts > this.maxReconnectAttempts) {
      // toast.error("E-imzo ni tekshiring va boshqatan urinib ko‘ring");
      return;
    }

    console.log("🔄 Qayta ulanmoqda (darhol)...");
    this.connect(this.url, this.messageCallback || undefined);
  }
}

const webSocketService = new WebSocketService();
export default webSocketService;