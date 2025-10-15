// src/index.ts

// Новая функция из ES2025: Set.prototype.union
const setA = new Set([1, 2, 3]);
const setB = new Set([3, 4, 5]);

const unionSet = setA.union(setB);
console.log('Объединение множеств:', Array.from(unionSet)); // [1, 2, 3, 4, 5]

function sayHello(name: string): void {
  console.log(`Привет, ${name}! Добро пожаловать в базовый проект ES2025 + TypeScript.`);
}

sayHello('Мир');
