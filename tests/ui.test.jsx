import { useState } from 'react';
import { describe, expect, jest, test } from '@jest/globals';
import { render, screen, waitFor, within } from '@testing-library/react';
import userEvent from '@testing-library/user-event';
import * as UI from '../src/components/ui/index.js';
import { canPayQuote, hasQuotedAmount } from '../src/utils/requests.js';
import { productSubtotal } from '../src/utils/money.js';
import { validateFile } from '../src/utils/files.js';

const product = { id: 'test-only', name: 'Pieza de prueba', material: 'PLA', stock: 2, status: 'ACTIVE', price: 1250.5, categoryName: 'Pruebas', images: [], description: 'Fixture de prueba' };

describe('Controles accesibles', () => {
  test('loading bloquea el doble envío y conserva el estado busy', async () => {
    const click = jest.fn();
    render(<UI.Button loading onClick={click}>Enviar</UI.Button>);
    const button = screen.getByRole('button', { name: 'Procesando…' });
    expect(button).toBeDisabled();
    expect(button).toHaveAttribute('aria-busy', 'true');
    await userEvent.click(button);
    expect(click).not.toHaveBeenCalled();
  });

  test('variantes pill y full-width conservan la apariencia primaria', () => {
    const { rerender } = render(<UI.Button variant="pill">Pagar</UI.Button>);
    expect(screen.getByRole('button')).toHaveClass('v-button--primary', 'v-button--pill');
    rerender(<UI.Button variant="full-width">Pagar</UI.Button>);
    expect(screen.getByRole('button')).toHaveClass('v-button--primary', 'v-button--full');
  });

  test('inputs generan IDs únicos, labels y descripciones de error', () => {
    render(<><UI.Input label="Correo" hint="Usá tu correo" error="Correo inválido" aria-describedby="external" /><UI.Input label="Nombre" /></>);
    const email = screen.getByLabelText('Correo');
    expect(email.id).not.toBe(screen.getByLabelText('Nombre').id);
    expect(email).toHaveAttribute('aria-invalid', 'true');
    expect(email).toHaveAccessibleDescription('Usá tu correo Correo inválido');
    expect(email.getAttribute('aria-describedby')).toContain('external');
  });

  test('switch y checkbox funcionan con teclado y nombres estables', async () => {
    function Controls() {
      const [checked, setChecked] = useState(false);
      return <><UI.Switch label="Menos movimiento" checked={checked} onChange={setChecked} /><UI.Checkbox label="Acepto" /></>;
    }
    render(<Controls />);
    await userEvent.tab();
    await userEvent.keyboard(' ');
    expect(screen.getByRole('switch', { name: 'Menos movimiento' })).toBeChecked();
    await userEvent.tab();
    await userEvent.keyboard(' ');
    expect(screen.getByLabelText('Acepto')).toBeChecked();
  });

  test('la ayuda mantiene foco y Escape cierra el disclosure', async () => {
    render(<UI.HelpDisclosure label="archivos">STL y OBJ</UI.HelpDisclosure>);
    const trigger = screen.getByRole('button', { name: 'Ayuda sobre archivos' });
    await userEvent.click(trigger);
    expect(trigger).toHaveFocus();
    expect(trigger).toHaveAttribute('aria-expanded', 'true');
    expect(screen.getByText('STL y OBJ')).toBeVisible();
    await userEvent.keyboard('{Escape}');
    expect(trigger).toHaveAttribute('aria-expanded', 'false');
    expect(screen.getByText('STL y OBJ')).not.toBeVisible();
  });

  test('tema e idioma notifican el destino de cambio', async () => {
    const theme = jest.fn();
    const language = jest.fn();
    render(<><UI.ThemeToggle theme="light" onToggle={theme} /><UI.LanguageToggle onChange={language} /></>);
    await userEvent.click(screen.getByRole('button', { name: 'Cambiar al tema oscuro' }));
    await userEvent.click(screen.getByRole('button', { name: 'Cambiar idioma a inglés' }));
    expect(theme).toHaveBeenCalledWith('dark');
    expect(language).toHaveBeenCalledWith('en');
  });

  test('el selector expone opciones, estado disabled y errores', async () => {
    render(<UI.Select label="Material" defaultValue="" placeholder="Elegí un material" options={[{ value: 'pla', label: 'PLA' }]} error="Seleccioná un material" />);
    await userEvent.selectOptions(screen.getByLabelText('Material'), 'pla');
    expect(screen.getByLabelText('Material')).toHaveValue('pla');
    expect(screen.getByLabelText('Material')).toHaveAccessibleDescription('Seleccioná un material');
  });
});

describe('Búsqueda y archivos', () => {
  test('búsqueda recorre resultados con flechas y selecciona con Enter', async () => {
    const onSelect = jest.fn();
    render(<UI.SearchInput results={[{ id: 'one', label: 'PLA' }, { id: 'two', label: 'PETG' }]} onSelect={onSelect} />);
    await userEvent.click(screen.getByRole('combobox'));
    await userEvent.keyboard('{ArrowDown}{ArrowDown}{Enter}');
    expect(onSelect).toHaveBeenCalledWith({ id: 'two', label: 'PETG' });
    expect(screen.getByRole('combobox')).toHaveAttribute('aria-expanded', 'false');
  });

  test('búsqueda muestra vacío, carga, error y reintento', async () => {
    const onRetry = jest.fn();
    const { rerender } = render(<UI.SearchInput />);
    await userEvent.click(screen.getByRole('combobox'));
    expect(screen.getByText('No encontramos piezas con ese término.')).toBeVisible();
    rerender(<UI.SearchInput loading />);
    expect(screen.getByText('Buscando…')).toBeVisible();
    rerender(<UI.SearchInput error="Sin conexión" onRetry={onRetry} />);
    await userEvent.click(screen.getByRole('button', { name: 'Reintentar' }));
    expect(onRetry).toHaveBeenCalledTimes(1);
  });

  test('archivos rechazan extensión/tamaño, aceptan STL y permiten quitar', async () => {
    function Upload() {
      const [file, setFile] = useState(null);
      return <UI.FileDropzone file={file} onFile={setFile} maxBytes={4} />;
    }
    render(<Upload />);
    const input = screen.getByLabelText('Archivo 3D');
    const uploader = userEvent.setup({ applyAccept: false });
    await uploader.upload(input, new File(['abc'], 'piece.exe'));
    expect(screen.getByRole('alert')).toHaveTextContent('Formato no permitido');
    await uploader.upload(input, new File(['12345'], 'piece.stl'));
    expect(screen.getByRole('alert')).toHaveTextContent('supera el máximo');
    await uploader.upload(input, new File(['123'], 'piece.STL'));
    expect(screen.getByRole('status')).toHaveTextContent('Archivo seleccionado: piece.STL');
    await userEvent.click(screen.getByRole('button', { name: 'Quitar archivo' }));
    expect(screen.getByRole('status')).toHaveTextContent('Ningún archivo seleccionado');
  });

  test('archivo en procesamiento no se puede reemplazar', () => {
    const onFile = jest.fn();
    render(<UI.FileDropzone processing onFile={onFile} />);
    expect(screen.getByLabelText('Archivo 3D')).toBeDisabled();
    expect(screen.getByRole('status')).toHaveTextContent('Procesando');
  });
});

describe('Capas y foco', () => {
  test('Drawer atrapa foco, cierra por Escape y devuelve foco al disparador', async () => {
    function Example() {
      const [open, setOpen] = useState(false);
      return <><button onClick={() => setOpen(true)} aria-expanded={open} aria-controls="drawer">Abrir</button>
        <UI.Drawer id="drawer" open={open} onClose={() => setOpen(false)} title="Tu carrito">
          <UI.Input label="Nombre" /><UI.Button>Último</UI.Button>
        </UI.Drawer></>;
    }
    render(<Example />);
    const trigger = screen.getByRole('button', { name: 'Abrir' });
    await userEvent.click(trigger);
    const dialog = screen.getByRole('dialog', { name: 'Tu carrito' });
    await waitFor(() => expect(within(dialog).getByRole('button', { name: 'Cerrar panel' })).toHaveFocus());
    await userEvent.keyboard('{Shift>}{Tab}{/Shift}');
    expect(within(dialog).getByRole('button', { name: 'Último' })).toHaveFocus();
    await userEvent.tab();
    expect(within(dialog).getByRole('button', { name: 'Cerrar panel' })).toHaveFocus();
    await userEvent.keyboard('{Escape}');
    expect(screen.queryByRole('dialog')).not.toBeInTheDocument();
    expect(trigger).toHaveFocus();
  });

  test('Panel no modal permite salir con Tab', async () => {
    render(<><UI.Panel title="Lectura"><UI.Button>Interior</UI.Button></UI.Panel><button>Exterior</button></>);
    await waitFor(() => expect(screen.getByRole('button', { name: 'Interior' })).toHaveFocus());
    await userEvent.tab();
    expect(screen.getByRole('button', { name: 'Exterior' })).toHaveFocus();
  });
});

describe('Separación de catálogo y cotización', () => {
  test('PriceTag evita NaN, infinito y valores sin definir; conserva céntimos', () => {
    const { container, rerender } = render(<UI.PriceTag />);
    expect(container).toBeEmptyDOMElement();
    rerender(<UI.PriceTag amount={NaN} />);
    expect(container).toBeEmptyDOMElement();
    rerender(<UI.PriceTag amount={-1} />);
    expect(container).toBeEmptyDOMElement();
    rerender(<UI.PriceTag amount={1250.5} />);
    expect(container).toHaveTextContent(/1\s250,5/);
  });

  test.each(['PENDING_QUOTE', 'IN_REVIEW'])('%s nunca muestra importe aunque reciba uno', status => {
    const request = { status, quotedPrice: 100000, description: 'Solicitud fixture' };
    const { container } = render(<><UI.CartItem kind="request" request={request} /><UI.QuoteSummaryPanel request={request} onPay={jest.fn()} /></>);
    expect(container.querySelector('.v-price')).toBeNull();
    expect(screen.queryByRole('spinbutton')).not.toBeInTheDocument();
    expect(screen.queryByRole('button', { name: 'Pagar cotización' })).not.toBeInTheDocument();
  });

  test('cotización aprobada exige monto y vigencia antes de ofrecer pago', () => {
    const now = Date.parse('2026-09-30T12:00:00Z');
    const request = { status: 'APPROVED', quotedPrice: 15000, quoteValidUntil: '2026-10-01T00:00:00Z' };
    const { rerender } = render(<UI.QuoteSummaryPanel request={request} now={now} onPay={jest.fn()} />);
    expect(screen.getByRole('button', { name: 'Pagar cotización' })).toBeVisible();
    rerender(<UI.QuoteSummaryPanel request={request} now={Date.parse('2026-10-02')} onPay={jest.fn()} />);
    expect(screen.queryByRole('button', { name: 'Pagar cotización' })).not.toBeInTheDocument();
    expect(screen.getByText('Cotización caducada')).toBeVisible();
  });

  test('SINPE no habilita comprobantes sin destino; no confirma al seleccionar un archivo', () => {
    render(<UI.SinpePaymentBlock receipt={new File(['a'], 'receipt.pdf')} />);
    expect(screen.getByLabelText('Comprobante SINPE')).toBeDisabled();
    expect(screen.queryByText('Pago confirmado.')).not.toBeInTheDocument();
  });

  test('ProductCard ignora stock heredado y conserva el estado de imagen', () => {
    render(<UI.ProductCard product={{ ...product, stock: 0 }} href="/producto/test-only" showPrice />);
    expect(screen.queryByText('Sin stock')).not.toBeInTheDocument();
    expect(screen.queryByText('En stock (5)')).not.toBeInTheDocument();
    expect(screen.getByText('Imagen no disponible')).toBeVisible();
    expect(screen.getByRole('link')).toHaveAttribute('href', '/producto/test-only');
  });

  test('CartItem permite pedir una cantidad sin consultar stock del dataset', () => {
    render(<UI.CartItem product={{ ...product, stock: 0 }} quantity={1} />);
    expect(screen.getByRole('spinbutton', { name: /Cantidad de/ })).toBeEnabled();
    expect(screen.getByRole('spinbutton', { name: /Cantidad de/ })).not.toHaveAttribute('max');
  });

  test('subtotal y elegibilidad rechazan datos incompletos', () => {
    expect(productSubtotal(2, 1250.5)).toBe(2501);
    expect(productSubtotal(0, 5)).toBeNull();
    expect(productSubtotal(1.5, 5)).toBeNull();
    expect(productSubtotal(2, NaN)).toBeNull();
    expect(canPayQuote({ status: 'PENDING_QUOTE', quotedPrice: 100 })).toBe(false);
    expect(canPayQuote({ status: 'APPROVED', quotedPrice: 100 })).toBe(false);
    expect(hasQuotedAmount({ status: 'QUOTED', quotedPrice: '100' })).toBe(false);
    expect(validateFile(new File([], 'empty.stl'))?.status).toBe('error-size');
  });
});

test('feedback, secciones y navegación renderizan con semántica', async () => {
  const dismiss = jest.fn();
  render(<><UI.SectionBlock title="Catálogo" kicker="Taller"><UI.EmptyState title="Sin piezas" /></UI.SectionBlock>
    <UI.StepperBar steps={['Datos', 'Pago']} current={1} /><UI.Toast message="Guardado" onDismiss={dismiss} />
    <UI.NavLink href="/catalogo" current>Tienda</UI.NavLink><UI.Skeleton /><UI.SignalMetric value="STL / OBJ" label="Formatos" />
    <UI.ErrorState description="Intentá de nuevo" /><UI.BrandLogo compact /><UI.StatusIndicator>Disponible</UI.StatusIndicator>
    <UI.RevealOnScroll>Contenido visible sin observer</UI.RevealOnScroll></>);
  expect(screen.getByRole('navigation', { name: 'Progreso' }).querySelector('[aria-current="step"]')).toHaveTextContent('Pago');
  expect(screen.getByRole('link', { name: 'Tienda' })).toHaveAttribute('aria-current', 'page');
  expect(screen.getByRole('status')).toHaveTextContent('Guardado');
  await userEvent.click(screen.getByRole('button', { name: 'Cerrar notificación' }));
  expect(dismiss).toHaveBeenCalledTimes(1);
});
