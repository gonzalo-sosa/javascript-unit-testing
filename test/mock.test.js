import { it, describe, vi, expect } from 'vitest';
import {
  getDiscount,
  getPriceInCurrency,
  getShippingInfo,
  isOnline,
  login,
  renderPage,
  signUp,
  submitOrder,
} from '../src/mocking.js';
import { getExchangeRate } from '../src/libs/currency.js';
import { getShippingQuote } from '../src/libs/shipping.js';
import { trackPageView } from '../src/libs/analytics.js';
import { charge } from '../src/libs/payment.js';
import { sendEmail } from '../src/libs/email.js';
import security from '../src/libs/security.js';

describe('mocking', () => {
  it('sendMessage should return ok', () => {
    const sendText = vi.fn();
    sendText.mockReturnValue('ok');

    const message = 'Mensaje secreto';

    const result = sendText(message);

    expect(sendText).toHaveBeenCalled();
    expect(sendText).toHaveBeenCalledWith(message);
    expect(result).toBe('ok');
  });
});

vi.mock('../src/libs/currency');

describe('getPriceInCurrency', () => {
  it('should return price in target currency', () => {
    vi.mocked(getExchangeRate).mockReturnValue(1.5);

    const price = getPriceInCurrency(10, 'AUD');

    expect(price).toBe(15);
  });
});

vi.mock('../src/libs/shipping');

describe('getShippingInfo', () => {
  it('should return unavailable if quote cannot be fetched', () => {
    vi.mocked(getShippingQuote).mockReturnValue(null);

    const info = getShippingInfo('Perú');

    expect(info).toMatch(/unavailable/i);
  });

  it('should return shipping info if quote can be fetched', () => {
    vi.mocked(getShippingQuote).mockReturnValue({
      cost: 100,
      estimatedDays: 2,
    });

    const info = getShippingInfo('Argentina');

    /*
    expect(info).toMatch("$100");
    expect(info).toMatch(/2 days/i);
    */
    expect(info).toMatch(/shipping cost: \$100 \(2 days\)/i);
  });
});

vi.mock('../src/libs/analytics');

describe('renderPage', () => {
  it('should return correct content', async () => {
    const result = await renderPage();

    expect(result).toMatch(/content/i);
  });

  it('should call analytics', async () => {
    await renderPage();

    expect(trackPageView).toHaveBeenCalledWith('/home');
  });
});

vi.mock('../src/libs/payment');

describe('submitOrder', () => {
  const order = { totalAmount: 100 };
  const creditCard = { creditCardNumber: 123456 };

  it('should charge the customer', async () => {
    vi.mocked(charge).mockResolvedValue({ status: 'success' });

    await submitOrder(order, creditCard);

    expect(charge).toBeCalled();
    expect(charge).toBeCalledWith(creditCard, order.totalAmount);
  });

  it('should return success when payment is successful', async () => {
    vi.mocked(charge).mockResolvedValue({ status: 'success' });

    const result = await submitOrder(order, creditCard);

    expect(result).toEqual({ success: true });
  });

  it('should return error when payment is failed', async () => {
    vi.mocked(charge).mockReturnValue({
      status: 'failed',
    });

    const result = await submitOrder(order, creditCard);

    expect(result).toEqual({ success: false, error: 'payment_error' });
  });
});

// Partial Mocking
vi.mock('../src/libs/email', async (importOriginal) => {
  const originalModule = await importOriginal();

  return {
    ...originalModule,
    sendEmail: vi.fn(),
  };
});

describe('signUp', () => {
  const email = 'name@domain.com';

  /*
  beforeEach(() => {
    // vi.mocked(sendEmail).mockClear();
    // vi.clearAllMocks()
  });
  */

  it('should return false when email is not valid', async () => {
    const result = await signUp('a');

    expect(result).toBe(false);
  });

  it('should return true when email is valid', async () => {
    const result = await signUp(email);

    expect(result).toBe(true);
  });

  it('should send the welcome email if email is valid', async () => {
    await signUp(email);

    expect(sendEmail).toHaveBeenCalledOnce();
    //expect(sendEmail).toBeCalledWith(email, "Welcome aboard!");
    const [arg1, arg2] = vi.mocked(sendEmail).mock.calls[0];

    expect(arg1).toBe(email);
    expect(arg2).toMatch(/welcome/i);
  });
});

// Spy

describe('login', () => {
  const email = 'name@domain.com';

  it('should email the one-time login code', async () => {
    const spy = vi.spyOn(security, 'generateCode');

    await login(email);

    const code = spy.mock.results[0].value.toString();

    expect(sendEmail).toBeCalledWith(email, code);
  });
});

// Mocking dates

describe('isOnline', () => {
  it('should return false if the current hour is outside opening hours', () => {
    vi.setSystemTime('2024-01-01 07:59');
    expect(isOnline()).toBe(false);

    vi.setSystemTime('2024-01-01 20:01');
    expect(isOnline()).toBe(false);
  });

  it('should return true if the current hour is within opening hours', () => {
    vi.setSystemTime('2024-01-01 08:00');
    expect(isOnline()).toBe(true);

    vi.setSystemTime('2024-01-01 19:59');
    expect(isOnline()).toBe(true);
  });
});

describe('getDiscount', () => {
  it('should return a discount if is the Christmas day', () => {
    vi.setSystemTime('2024-12-25 00:01');
    expect(getDiscount()).toBeGreaterThan(0);

    vi.setSystemTime('2024-12-25 23:59');
    expect(getDiscount()).toBeGreaterThan(0);
  });

  it('should not return a discount if is not the Christmas day', () => {
    vi.setSystemTime('2024-12-24 23:59');
    expect(getDiscount()).toBe(0);

    vi.setSystemTime('2024-12-26 00:01');
    expect(getDiscount()).toBe(0);
  });
});
