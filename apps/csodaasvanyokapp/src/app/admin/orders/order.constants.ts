

export interface OrderStatuses {
  [key: string]: { label: string, color: string };
}

export const ORDER_STATUS: OrderStatuses = {
  0: { label: 'Függőben', color: 'warning' },
  1: { label: 'Feldolgozás alatt', color: 'info' },
  2: { label: 'Teljesítve', color: 'success' },
  3: { label: 'Törölve', color: 'danger' },
};
