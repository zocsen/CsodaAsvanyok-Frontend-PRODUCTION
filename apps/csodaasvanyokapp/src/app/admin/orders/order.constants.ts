export interface OrderStatuses {
  [key: string]: { label: string; color: string };
}

export const ORDER_STATUS: OrderStatuses = {
  0: { label: 'Függőben', color: 'warning' },
  1: { label: 'Fizetve', color: 'info' },
  2: { label: 'Feldolgozás alatt', color: 'info' },
  3: { label: 'Teljesítve', color: 'success' },
  4: { label: 'Törölve', color: 'danger' },
};
