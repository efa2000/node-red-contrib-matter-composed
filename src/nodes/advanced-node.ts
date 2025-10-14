import { Node, NodeDef } from '@node-red/nodes';

interface AdvancedNodeConfig extends NodeDef {
  apiKey: string;
  endpoint: string;
  method: string;
  headers: string;
  retryCount: number;
}

module.exports = function (RED: any) {
  function AdvancedNode(this: Node, config: AdvancedNodeConfig) {
    RED.nodes.createNode(this, config);
    
    const node = this;
    node.apiKey = config.apiKey;
    node.endpoint = config.endpoint;
    node.method = config.method || 'GET';
    node.retryCount = config.retryCount || 3;

    // Парсинг headers из строки в объект
    let headers: Record<string, string> = {};
    try {
      if (config.headers) {
        headers = JSON.parse(config.headers);
      }
    } catch (error) {
      node.warn('Invalid headers format, using empty headers');
    }

    node.on('input', async function (msg: any, send: (msg: any) => void, done: (err?: Error) => void) {
      try {
        node.status({ fill: 'yellow', shape: 'dot', text: 'Requesting...' });

        // Подготовка данных для запроса
        const requestData = {
          method: node.method,
          headers: {
            'Content-Type': 'application/json',
            'Authorization': `Bearer ${node.apiKey}`,
            ...headers
          },
          ...(msg.payload && node.method !== 'GET' && { body: JSON.stringify(msg.payload) })
        };

        let retries = 0;
        let response: Response;

        // Логика повторных попыток
        while (retries <= node.retryCount) {
          try {
            response = await fetch(node.endpoint, requestData);
            
            if (response.ok) {
              break;
            }
            
            if (retries === node.retryCount) {
              throw new Error(`HTTP ${response.status}: ${response.statusText}`);
            }
            
            retries++;
            node.warn(`Request failed, retrying (${retries}/${node.retryCount})`);
            await new Promise(resolve => setTimeout(resolve, 1000 * retries));
          } catch (error) {
            if (retries === node.retryCount) {
              throw error;
            }
            retries++;
            await new Promise(resolve => setTimeout(resolve, 1000 * retries));
          }
        }

        const data = await response!.json();

        // Создание выходного сообщения
        const outputMsg = {
          ...msg,
          payload: data,
          request: {
            endpoint: node.endpoint,
            method: node.method,
            status: response!.status,
            headers: Object.fromEntries(response!.headers.entries())
          },
          timestamp: new Date().toISOString()
        };

        send(outputMsg);
        node.status({ fill: 'green', shape: 'dot', text: `Success: ${response!.status}` });

        if (done) {
          done();
        }
      } catch (error) {
        node.error(`API request failed: ${error}`, msg);
        node.status({ fill: 'red', shape: 'ring', text: 'Request failed' });
        if (done) {
          done(error as Error);
        }
      }
    });
  }

  RED.nodes.registerType('advanced-node', AdvancedNode);
}
