// eslint-disable-next-line @typescript-eslint/no-require-imports
const Iyzipay = require("iyzipay") as new (options: {
  apiKey: string;
  secretKey: string;
  uri: string;
}) => IyzicoClient;

interface IyzicoCallback {
  // eslint-disable-next-line @typescript-eslint/no-explicit-any
  (err: unknown, result: any): void;
}

interface IyzicoClient {
  checkoutFormInitialize: {
    create(request: Record<string, unknown>, callback: IyzicoCallback): void;
  };
  checkoutForm: {
    retrieve(request: Record<string, unknown>, callback: IyzicoCallback): void;
  };
  refund: {
    create(request: Record<string, unknown>, callback: IyzicoCallback): void;
  };
}

const apiKey = process.env.IYZICO_API_KEY;
const secretKey = process.env.IYZICO_SECRET_KEY;
const uri = process.env.IYZICO_BASE_URL;

// Returns null when env keys are absent so callers can fall back gracefully.
const iyzico: IyzicoClient | null =
  apiKey && secretKey && uri
    ? new Iyzipay({ apiKey, secretKey, uri })
    : null;

export default iyzico;
