/**
 * Iyzico REST client — replaces the `iyzipay` npm package.
 *
 * The iyzipay package uses `fs.readdirSync` to dynamically scan its resources
 * directory at startup. This crashes in Vercel's serverless environment because
 * the directory is pruned during deployment. This implementation calls the same
 * three iyzico endpoints directly via native `fetch` with the IYZWSv2 auth scheme.
 *
 * Auth: IYZWSv2 base64(apiKey:<key>&randomKey:<rnd>&signature:<hmac-sha256>)
 * HMAC input: randomString + urlPath + JSON.stringify(body)
 */

import crypto from "crypto";

const apiKey = process.env.IYZICO_API_KEY;
const secretKey = process.env.IYZICO_SECRET_KEY;
const baseUrl = process.env.IYZICO_BASE_URL?.replace(/\/+$/, "");

/** Matches iyzipay's utils.formatPrice — preserves at least one decimal place. */
function formatPrice(price: unknown): string {
  const n = parseFloat(String(price));
  const s = n.toString();
  return s.includes(".") ? s : s + ".0";
}

/** Produces the IYZWSv2 Authorization header value for a given path + body. */
function buildAuth(path: string, body: object): { authorization: string; randomString: string } {
  const randomString = Date.now().toString() + Math.random().toString().slice(2, 10);
  const signature = crypto
    .createHmac("sha256", secretKey!)
    .update(randomString + path + JSON.stringify(body))
    .digest("hex");
  const encoded = Buffer.from(
    `apiKey:${apiKey}&randomKey:${randomString}&signature:${signature}`
  ).toString("base64");
  return { authorization: `IYZWSv2 ${encoded}`, randomString };
}

// eslint-disable-next-line @typescript-eslint/no-explicit-any
type IyziCallback = (err: unknown, result: any) => void;

// eslint-disable-next-line @typescript-eslint/no-explicit-any
async function iyziPost(path: string, body: object, callback: IyziCallback): Promise<void> {
  try {
    const { authorization, randomString } = buildAuth(path, body);
    const res = await fetch(baseUrl + path, {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
        Accept: "application/json",
        Authorization: authorization,
        "x-iyzi-rnd": randomString,
        "x-iyzi-client-version": "iyzipay-node-2.0.65",
      },
      body: JSON.stringify(body),
    });
    const data = (await res.json()) as Record<string, unknown>;
    callback(null, data);
  } catch (err) {
    callback(err, {});
  }
}

interface IyzicoClient {
  checkoutFormInitialize: {
    create(request: Record<string, unknown>, callback: IyziCallback): void;
  };
  checkoutForm: {
    retrieve(request: Record<string, unknown>, callback: IyziCallback): void;
  };
  refund: {
    create(request: Record<string, unknown>, callback: IyziCallback): void;
  };
}

// Returns null when env keys are absent so callers can fall back gracefully.
const iyzico: IyzicoClient | null =
  apiKey && secretKey && baseUrl
    ? {
        checkoutFormInitialize: {
          create(request, callback) {
            const path = "/payment/iyzipos/checkoutform/initialize/auth/ecom";
            const body = {
              locale: request.locale,
              conversationId: request.conversationId,
              price: formatPrice(request.price),
              paidPrice: formatPrice(request.paidPrice),
              currency: request.currency,
              basketId: request.basketId,
              paymentGroup: request.paymentGroup,
              force3ds: 0,
              callbackUrl: request.callbackUrl,
              buyer: request.buyer,
              shippingAddress: request.shippingAddress,
              billingAddress: request.billingAddress,
              basketItems: request.basketItems,
            };
            void iyziPost(path, body, callback);
          },
        },
        checkoutForm: {
          retrieve(request, callback) {
            const path = "/payment/iyzipos/checkoutform/auth/ecom/detail";
            const body = {
              locale: request.locale,
              conversationId: request.conversationId,
              token: request.token,
            };
            void iyziPost(path, body, callback);
          },
        },
        refund: {
          create(request, callback) {
            const path = "/payment/refund";
            const body = {
              locale: request.locale,
              conversationId: request.conversationId,
              paymentTransactionId: request.paymentTransactionId,
              price: formatPrice(request.price),
              ip: request.ip,
              currency: request.currency,
            };
            void iyziPost(path, body, callback);
          },
        },
      }
    : null;

export default iyzico;
