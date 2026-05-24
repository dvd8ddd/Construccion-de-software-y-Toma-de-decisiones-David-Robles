const { calcularDanio } = require('../src/combate');

describe('calcularDanio', () => {

  test('daño normal: ataque mayor que defensa', () => {
    const atacante = { ataque: 15 };
    const defensor = { defensa: 5 };
    const danio = calcularDanio(atacante, defensor);
    expect(danio).toBe(10);
});

  test('defensa igual a ataque retorna 1', () => {
    const atacante = { ataque: 10 };
    const defensor = { defensa: 10 };
    const danio = calcularDanio(atacante, defensor);
    expect(danio).toBe(1);
});

  test('defensa mayor que ataque retorna 1', () => {

    const atacante = { ataque: 5 };
    const defensor = { defensa: 10 };
    const danio = calcularDanio(atacante, defensor);
    expect(danio).toBe(1);
});

  test('ataque y defensa en 0 retorna 1', () => {
    const atacante = { ataque: 0 };
    const defensor = { defensa: 0 };
    const danio = calcularDanio(atacante, defensor);
    expect(danio).toBe(1);
});

});