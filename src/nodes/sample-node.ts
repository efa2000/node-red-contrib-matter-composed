import { Node, NodeDef } from '@node-red/nodes';

interface SampleNodeConfig extends NodeDef {
  property: string;
  timeout: number;
  units: string;
}

module.exports = function (RED: any) {
  function SampleNode(this: Node, config: SampleNodeConfig) {
    RED.nodes.createNode(this, config);
    
    const node = this;
    node.property = config.property || 'payload';
    node.timeout = config.timeout || 5000;
    node.units = config.units || 'ms';

    node.on('input', function (msg: any, send: (msg: any) => void, done: (err?: Error) => void) {
      try {
        // Обработка входящего сообщения
        node.log(`Received message: ${JSON.stringify(msg)}`);
        
        // Установка статуса ноды
        node.status({ fill: 'blue', shape: 'dot', text: 'Processing...' });

        // Пример преобразования данных
        const inputValue = msg.payload;
        let outputValue: any;

        if (typeof inputValue === 'number') {
          outputValue = inputValue * 2;
        } else if (typeof inputValue === 'string') {
          outputValue = inputValue.toUpperCase();
        } else {
          outputValue = inputValue;
        }

        // Создание нового сообщения
        const newMsg = {
          ...msg,
          payload: outputValue,
          originalPayload: inputValue,
          processedAt: new Date().toISOString(),
          nodeId: node.id
        };

        // Логирование
        node.log(`Transformed ${inputValue} to ${outputValue}`);

        // Отправка сообщения
        send(newMsg);

        // Обновление статуса
        node.status({ fill: 'green', shape: 'dot', text: `Processed: ${outputValue}` });

        // Очистка статуса через таймаут
        setTimeout(() => {
          node.status({});
        }, node.timeout);

        if (done) {
          done();
        }
      } catch (error) {
        node.error(`Error processing message: ${error}`, msg);
        node.status({ fill: 'red', shape: 'ring', text: 'Error' });
        if (done) {
          done(error as Error);
        }
      }
    });

    node.on('close', function () {
      // Очистка ресурсов при закрытии ноды
      node.status({});
      node.log('Node closed');
    });
  }

  RED.nodes.registerType('sample-node', SampleNode);
}
