import { test, expect } from '@playwright/test';

test.beforeEach(async ({ request }) => {
    // Limpia y siembra la base de datos de test antes de cada prueba (queda el pedido #1)
    await request.post('http://localhost:3001/__test__/reset');
    await request.post('http://localhost:3001/__test__/seed');
});

test.describe('Flujo de Pedido E2E y Responsividad', () => {
    test('Recorrido feliz de pedido y verificacion de responsividad a 375px', async ({ page }) => {
    // Configurar viewport a 375px de celular (Funcionalidad 9)
    await page.setViewportSize({ width: 375, height: 667 });

    // Navegar con QR de Mesa 4
    await page.goto('/?mesa=4');

    // Verificar que no haya scroll horizontal
    const scrollWidth = await page.evaluate(() => document.documentElement.scrollWidth);
    expect(scrollWidth).toBeLessThanOrEqual(375);

    // Armar el pedido de café (Expreso Mediano Colombia)
    await page.getByLabel(/expreso/i).check();
    await page.getByLabel(/mediano/i).check();
    await page.getByLabel(/colombia/i).check();
    await page.getByRole('button', { name: 'Agregar al pedido' }).click();

    // Confirmar pedido desde el carrito
    await page.getByRole('button', { name: /confirmar pedido/i }).click();

    // Comprobar que devuelve el pedido #2 en estado pendiente
    await expect(page.getByText(/pedido #2/i)).toBeVisible();
    await expect(page.getByText(/pendiente/i)).toBeVisible();
    });
});