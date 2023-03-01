

export interface OrderStatuses {
  [key: string]: { label: string, color: string };
}

export const ORDER_STATUS: OrderStatuses = {
  PENDING: { label: 'Függőben', color: 'warning' },
  PROCESSING: { label: 'Feldolgozás alatt', color: 'info' },
  COMPLETED: { label: 'Teljesítve', color: 'success' },
  CANCELLED: { label: 'Törölve', color: 'danger' },
};