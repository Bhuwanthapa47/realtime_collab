import SockJS from 'sockjs-client';
import Stomp from 'webstomp-client';

class WebSocketService {
  constructor() {
    this.stompClient = null;
    this.connected = false;
    this.subscriptions = new Map();
    this.connectingPromise = null;
  }

  connect(onConnected, onError) {
    // If already connected, call onConnected immediately
    if (this.connected && this.stompClient) {
      if (onConnected) onConnected();
      return Promise.resolve();
    }

    // If already connecting, return the existing promise
    if (this.connectingPromise) {
      return this.connectingPromise;
    }

    this.connectingPromise = new Promise((resolve, reject) => {
      const token = localStorage.getItem('token');
      const socket = new SockJS('http://localhost:8080/ws');
      this.stompClient = Stomp.over(socket);
      
      // Disable debug logging
      this.stompClient.debug = () => {};

      this.stompClient.connect(
        { Authorization: `Bearer ${token}` },
        () => {
          this.connected = true;
          this.connectingPromise = null;
          console.log('WebSocket connected');
          if (onConnected) onConnected();
          resolve();
        },
        (error) => {
          this.connected = false;
          this.connectingPromise = null;
          console.error('WebSocket connection error:', error);
          if (onError) onError(error);
          reject(error);
        }
      );
    });

    return this.connectingPromise;
  }

  disconnect() {
    if (this.stompClient && this.connected) {
      this.subscriptions.forEach((subscription) => subscription.unsubscribe());
      this.subscriptions.clear();
      this.stompClient.disconnect();
      this.connected = false;
      console.log('WebSocket disconnected');
    }
  }

  subscribeToBoard(boardId, callback) {
    if (!this.stompClient || !this.connected) {
      console.error('WebSocket not connected');
      return null;
    }

    const subscription = this.stompClient.subscribe(
      `/topic/board/${boardId}`,
      (message) => {
        const data = JSON.parse(message.body);
        callback(data);
      }
    );

    this.subscriptions.set(`board-${boardId}`, subscription);
    return subscription;
  }

  subscribeToTaskList(listId, callback) {
    if (!this.stompClient || !this.connected) {
      console.error('WebSocket not connected');
      return null;
    }

    const subscription = this.stompClient.subscribe(
      `/topic/list/${listId}`,
      (message) => {
        const data = JSON.parse(message.body);
        callback(data);
      }
    );

    this.subscriptions.set(`list-${listId}`, subscription);
    return subscription;
  }

  subscribeToTask(taskId, callback) {
    if (!this.stompClient || !this.connected) {
      console.error('WebSocket not connected');
      return null;
    }

    const subscription = this.stompClient.subscribe(
      `/topic/task/${taskId}`,
      (message) => {
        const data = JSON.parse(message.body);
        callback(data);
      }
    );

    this.subscriptions.set(`task-${taskId}`, subscription);
    return subscription;
  }

  unsubscribe(key) {
    const subscription = this.subscriptions.get(key);
    if (subscription) {
      subscription.unsubscribe();
      this.subscriptions.delete(key);
    }
  }

  isConnected() {
    return this.connected;
  }
}

const websocketService = new WebSocketService();
export default websocketService;
