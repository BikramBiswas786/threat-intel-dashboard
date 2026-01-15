import { useEffect, useState } from 'react';

interface WebSocketMessage {
  type: string;
  data: any;
}

export function useWebSocket(url: string) {
  const [data, setData] = useState<any>(null);
  const [connected, setConnected] = useState(false);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    const ws = new WebSocket(url);

    ws.onopen = () => {
      setConnected(true);
      console.log('✅ WebSocket connected');
    };

    ws.onmessage = (event) => {
      try {
        const message: WebSocketMessage = JSON.parse(event.data);
        setData(message.data);
      } catch (err) {
        console.error('Error parsing message:', err);
      }
    };

    ws.onerror = (err) => {
      setError('WebSocket error');
      setConnected(false);
      console.error('❌ WebSocket error:', err);
    };

    ws.onclose = () => {
      setConnected(false);
      console.log('⚠️ WebSocket closed');
    };

    return () => {
      ws.close();
    };
  }, [url]);

  return { data, connected, error };
}
