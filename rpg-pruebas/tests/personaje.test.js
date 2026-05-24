const Personaje = require('../src/personaje');

describe('Personaje', () => {

  test('Personaje recien creado tiene vida completa', () => {
    const heroe = new Personaje('Aria', 100, 15, 5);

    expect(heroe.vidaActual).toBe(100);
  });

  test('recibirDanio reduce la vida correctamente', () => {
    const heroe = new Personaje('Aria', 100, 15, 5);

    heroe.recibirDanio(30);

    expect(heroe.vidaActual).toBe(70);
  });

  test('recibirDanio con valor letal deja la vida en 0', () => {
    const heroe = new Personaje('Aria', 100, 15, 5);

    heroe.recibirDanio(100);

    expect(heroe.vidaActual).toBe(0);
  });

  test('recibirDanio con valor negativo lanza error', () => {
    const heroe = new Personaje('Aria', 100, 15, 5);

    expect(() => heroe.recibirDanio(-10)).toThrow(Error);
  });

  test('curar aumenta la vida correctamente', () => {
    const heroe = new Personaje('Aria', 100, 15, 5);

    heroe.recibirDanio(40);
    heroe.curar(20);

    expect(heroe.vidaActual).toBe(80);
  });

  test('curar nunca excede la vida maxima', () => {
    const heroe = new Personaje('Aria', 100, 15, 5);

    heroe.curar(50);

    expect(heroe.vidaActual).toBe(100);
  });

  test('estaVivo retorna true si vida > 0', () => {
    const heroe = new Personaje('Aria', 100, 15, 5);

    expect(heroe.estaVivo()).toBe(true);
  });

  test('estaVivo retorna false si vida = 0', () => {
    const heroe = new Personaje('Aria', 100, 15, 5);

    heroe.recibirDanio(100);

    expect(heroe.estaVivo()).toBe(false);
  });

  test('subirNivel restaura la vida y aumenta stats', () => {
    const heroe = new Personaje('Aria', 100, 15, 5);

    heroe.recibirDanio(50);
    heroe.subirNivel();

    expect(heroe.nivel).toBe(2);
    expect(heroe.vidaActual).toBe(heroe.vidaMaxima);
  });

  test('ganarExperiencia sube de nivel al pasar el umbral', () => {
    const heroe = new Personaje('Aria', 100, 15, 5);

    heroe.ganarExperiencia(100);

    expect(heroe.nivel).toBe(2);
  });

});