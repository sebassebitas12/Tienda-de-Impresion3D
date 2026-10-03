// Assets disponibles en public/images. Son fotos existentes, no fichas comerciales.
const assets = [
  ['hero-soporte.jpg', 'Soporte modular', 'Modular bracket'],
  ['llanta_pirelli_editada.jpg', 'Llanta decorativa', 'Decorative tire'],
  ['mascara_calavera_editada.jpg', 'Máscara calavera', 'Skull mask'],
  ['producto-base-control.jpg', 'Base para control', 'Controller stand'],
  ['producto-brazo-articulado.jpg', 'Brazo articulado', 'Articulated arm'],
  ['producto-carcasa-raspberry.jpg', 'Carcasa Raspberry', 'Raspberry case'],
  ['producto-clips-cables.jpg', 'Clips para cables', 'Cable clips'],
  ['producto-dispensador-bolsas.jpg', 'Dispensador de bolsas', 'Bag dispenser'],
  ['producto-dragon.jpg', 'Dragón articulado', 'Articulated dragon'],
  ['producto-drone.jpg', 'Brazo de drone', 'Drone arm'],
  ['producto-engranaje.jpg', 'Engranaje', 'Gear'],
  ['producto-escurridor-cubiertos.jpg', 'Escurridor de cubiertos', 'Cutlery drainer'],
  ['producto-ferula-ortopedica.jpg', 'Férula · referencia visual', 'Splint · visual reference'],
  ['producto-ganchos-llaves.jpg', 'Ganchos para llaves', 'Key hooks'],
  ['producto-letrero-escritorio.jpg', 'Letrero de escritorio', 'Desk sign'],
  ['producto-llavero-charm.jpg', 'Llavero', 'Keychain'],
  ['producto-maceta-escultural.jpg', 'Maceta escultural', 'Sculptural planter'],
  ['producto-maqueta.jpg', 'Maqueta', 'Architectural model'],
  ['producto-organizador-cajones.jpg', 'Organizador de cajones', 'Drawer organizer'],
  ['producto-patas-niveladoras.jpg', 'Patas niveladoras', 'Leveling feet'],
  ['producto-soporte-celular.jpg', 'Soporte para celular', 'Phone stand'],
  ['producto-soporte-laptop.jpg', 'Soporte para laptop', 'Laptop stand'],
  ['producto-soporte-regleta.jpg', 'Soporte para regleta', 'Power strip mount'],
  ['producto-temporal.png', 'Imagen provisional', 'Temporary image'],
  ['producto-torre-dados.jpg', 'Torre de dados', 'Dice tower'],
  ['soporte_oni_editado.jpg', 'Soporte Oni', 'Oni stand'],
];

export const catalogImageLibrary = assets.map(([file, es, en]) => ({
  path: `/images/${file}`, file, labels: { es, en },
}));
