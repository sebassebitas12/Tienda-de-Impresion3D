# Fase 3 — Componentes UI

## Propósito

Este documento identifica los componentes que se implementarán posteriormente con Tailwind CSS y shadcn/ui. No modifica el código ni instala dependencias.

## Componentes de shadcn/ui requeridos

| Componente | Uso |
|---|---|
| Button | CTAs, acciones de carrito, navegación y formularios. |
| Card | Productos, categorías, caminos de negocio y resúmenes. |
| Badge | Material, disponibilidad y estados. |
| Input | Búsqueda, datos personales y dimensiones. |
| Textarea | Descripción, notas y ayuda de diseño. |
| Label | Formularios accesibles. |
| Select | Material, color, ordenamiento y entrega. |
| RadioGroup | Selección de tipo de solicitud y opciones excluyentes. |
| Checkbox | Aceptaciones y preferencias. |
| Switch | Tema claro/oscuro. |
| Dialog | Login modal, confirmaciones y detalles breves. |
| Sheet | Menú móvil y carrito lateral. |
| Tabs | Actividad de cuenta y filtros de historial. |
| Accordion | Especificaciones y resumen editable. |
| Separator | Separación visual de secciones. |
| Skeleton | Loading de catálogo, detalle y carrito. |
| Alert | Errores y avisos persistentes. |
| Progress | Progreso del checkout y solicitud. |
| Sonner | Feedback breve después de agregar o guardar. |
| Tooltip | Ayuda para iconos y datos técnicos. |
| DropdownMenu | Cuenta, ordenamiento y acciones secundarias. |
| Breadcrumb | Contexto en catálogo y detalle. |
| Pagination | Navegación de resultados. |
| Carousel | Galería y destacados en móvil. |
| Form | Validación y asociación de campos. |
| Avatar | Cuenta del usuario, si aplica. |

## Componentes propios de la tienda

### Shell y navegación

- `SiteHeader`: logo, navegación, cuenta y carrito.
- `MobileMenu`: navegación móvil mediante `Sheet`.
- `CartButton`: acceso al carrito y contador.
- `ThemeToggle`: cambio de tema.
- `WhatsAppButton`: contacto persistente.
- `PageContainer`: ancho máximo y espaciado común.
- `PageHeader`: título, descripción y CTA contextual.

### Home

- `HeroSection`.
- `BusinessPathCards`.
- `FeaturedProducts`.
- `CategoryGrid`.
- `CategoryCard`.
- `BrandManifesto`.

### Catálogo

- `CatalogToolbar`.
- `ProductSearch`.
- `CategoryFilter`.
- `ProductSort`.
- `ResultCount`.
- `ProductGrid`.
- `ProductCard`.
- `AvailabilityBadge`.
- `CatalogSkeleton`.
- `CatalogEmptyState`.
- `CatalogErrorState`.

### Detalle

- `ProductGallery`.
- `ProductThumbnailList`.
- `ProductInfo`.
- `ProductPrice`.
- `ProductVariantSelector`.
- `QuantitySelector`.
- `ProductSpecifications`.
- `AddToCartButton`.
- `RelatedProducts`.

### Solicitud personalizada

- `QuoteTypeSelector`.
- `RequestStepper`.
- `FileUploadDropzone`.
- `UploadedFileItem`.
- `DesignHelpForm`.
- `TechnicalRequirementsForm`.
- `RequestReview`.
- `EditableReviewSection`.
- `QuoteStatusBadge`.

### Carrito y checkout

- `CartPage`.
- `CartProductSection`.
- `CartQuoteSection`.
- `CartProductItem`.
- `CartQuoteItem`.
- `CartSummary`.
- `CheckoutStepper`.
- `CheckoutCustomerForm`.
- `CheckoutDeliveryForm`.
- `CheckoutReview`.
- `OrderConfirmation`.
- `RequestConfirmation`.

### Cuenta y estados

- `LoginModal`.
- `RegisterForm`.
- `AccountSummary`.
- `ActivityList`.
- `LoadingState`.
- `EmptyState`.
- `ErrorState`.
- `SuccessState`.
- `InlineValidationMessage`.

## Orden de construcción recomendado

1. `SiteHeader`, `PageContainer` y `Button`.
2. `ProductCard`, `ProductGrid` y `ProductSearch`.
3. `ProductGallery`, `ProductInfo` y `ProductVariantSelector`.
4. `CartProductItem`, `CartQuoteItem` y `CartSummary`.
5. `QuoteTypeSelector`, `FileUploadDropzone` y formularios técnicos.
6. `CheckoutStepper`, formularios y revisión.
7. Estados, modal de login y confirmaciones.
8. Home y administración mínima.

## Regla de responsabilidad

Los componentes visuales no deben calcular precios, validar permisos ni contener reglas de negocio. Esas responsabilidades pertenecerán a servicios o hooks específicos cuando comience la implementación.
