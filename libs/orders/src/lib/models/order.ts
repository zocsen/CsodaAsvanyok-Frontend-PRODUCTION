import { OrderItem } from './order-item';
import { User } from '@csodaasvanyok-frontend-production/users';

export class Order {
  id?: string;
  orderItems?: OrderItem[];
  shippingAddress1?: string;
  city?: string;
  zip?: string;
  country?: string;
  phone?: string;
  status?: number;
  totalPrice?: string;
  user?: User;
  dateOrdered?: string;
  name?: string;
  email?: string;
  deliveryMethod?: string;
  billingAddress1?: string;
  billingCity?: string;
  billingZip?: string;
  billingCountry?: string;
}
