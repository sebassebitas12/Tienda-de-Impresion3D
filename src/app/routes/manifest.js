export const publicPages = [
  ['/', 'home'], ['/catalogo', 'catalog'], ['/producto/:id', 'product'],
  ['/solicitud', 'request'], ['/solicitud/archivo', 'requestFile'], ['/solicitud/ayuda-diseno', 'requestDesign'],
  ['/carrito', 'cart'], ['/checkout/productos', 'checkoutProducts'], ['/checkout/solicitud', 'checkoutRequest'],
  ['/pedidos/:id', 'order'], ['/cuenta', 'account'],
  ['/nosotros', 'about'], ['/contacto', 'contact'], ['/faq', 'faq'], ['/materiales', 'materials'],
  ['/requisitos', 'requirements'], ['/terminos', 'terms'], ['/privacidad', 'privacy'], ['/envios', 'shipping'],
];
export const authPages = [['/login', 'login'], ['/registro', 'register']];
export const adminPages = [
  ['/admin', 'dashboard'], ['/admin/pedidos', 'orders'], ['/admin/pedidos/:id', 'order'],
  ['/admin/solicitudes', 'requests'], ['/admin/solicitudes/:id', 'requestDetail'],
  ['/admin/catalogo', 'products'], ['/admin/catalogo/nuevo', 'productNew'], ['/admin/catalogo/:id/editar', 'productEdit'],
  ['/admin/catalogo/categorias', 'categories'], ['/admin/clientes', 'customers'],
  ['/admin/clientes/:id', 'customerDetail'], ['/admin/actividad', 'activity'],
];
