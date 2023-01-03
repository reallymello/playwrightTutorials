import { test, expect } from '@playwright/test';

test.use({
  baseURL: 'https://petstore.swagger.io',
});

const petId: number = 31337;
const shipDate: string = new Date().toISOString();

test('can GET count of sold inventory', async ({ request }) => {
  const inventoryResponse = await request.get('/v2/store/inventory');

  expect(inventoryResponse.status()).toEqual(200);
  expect(await inventoryResponse.json()).toHaveProperty('available');
  //console.log(await inventoryResponse.json());
});

test('can POST a pet to the store', async ({ request }) => {
  const petResponse = await request.post('/v2/pet', {
    data: {
      id: petId,
      category: {
        id: 1313,
        name: 'owls',
      },
      name: 'Bitey',
      photoUrls: ['https://nightwatchjs.org/images/images1/mini_logo.svg'],
      tags: [
        {
          id: 0,
          name: 'replicant',
        },
      ],
      status: 'available',
    },
  });
  const petJson = await petResponse.json();
  //console.log(await petResponse.json());
  expect(petResponse.status()).toEqual(200);
  expect(petResponse.headers()['content-type']).toMatch(/json/);
  //console.log(`My pet id is: ${petJson.category.id}`);
});

test('can POST order to the pet store and retrieve it', async ({ request }) => {
  const orderResponse = await request.post('/v2/store/order', {
    data: {
      id: 8380430356574554000,
      petId: petId,
      quantity: 10,
      shipDate: shipDate,
      status: 'placed',
      complete: true,
    },
  });

  expect(orderResponse.status()).toEqual(200);
  const orderJson = await orderResponse.json();
  const orderId: number = orderJson.id;

  const receiptResponse = await request.get(`/v2/store/order/${orderId}`);
  expect(receiptResponse.status()).toEqual(200);
  const receiptJson = await receiptResponse.json();
  expect(receiptJson.id).toEqual(8380430356574554000);
  expect(receiptJson.quantity).toEqual(10);
  expect(receiptJson.petId).toEqual(petId);
});
/*
test('homepage has title and links to intro page', async ({ page }) => {
  await page.goto('https://playwright.dev/');

  // Expect a title "to contain" a substring.
  await expect(page).toHaveTitle(/Playwright/);

  // create a locator
  const getStarted = page.getByRole('link', { name: 'Get started' });

  // Expect an attribute "to be strictly equal" to the value.
  await expect(getStarted).toHaveAttribute('href', '/docs/intro');

  // Click the get started link.
  await getStarted.click();

  // Expects the URL to contain intro.
  await expect(page).toHaveURL(/.*intro/);
});
*/
