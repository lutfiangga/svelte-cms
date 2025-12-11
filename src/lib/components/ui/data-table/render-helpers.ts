// routes/payments/columns.ts

import type { ColumnDef } from "@tanstack/table-core";
import {
  FlexRender,
  renderComponent,
  createSvelteTable,
} from "$lib/components/ui/data-table/index.js";
import DataTableActions from "./data-table-actions.svelte";
import DataTableCheckbox from "./data-table-checkbox.svelte";
import DataTableEmailButton from "./data-table-email-button.svelte";

// Tipe data untuk baris Payment
export type Payment = {
  id: string;
  amount: number;
  status: "pending" | "processing" | "success" | "failed";
  email: string;
};

// Helper untuk format mata uang
const formatCurrency = (value: number) =>
  new Intl.NumberFormat("en-US", {
    style: "currency",
    currency: "USD",
  }).format(value);

// Kolom tabel
export const columns: ColumnDef<Payment>[] = [
  {
    id: "select",
    header: ({ table }) =>
      renderComponent(DataTableCheckbox, {
        checked: table.getIsAllPageRowsSelected(),
        indeterminate:
          table.getIsSomePageRowsSelected() &&
          !table.getIsAllPageRowsSelected(),
        onCheckedChange: (value) => table.toggleAllPageRowsSelected(!!value),
        "aria-label": "Select all",
      }),
    cell: ({ row }) =>
      renderComponent(DataTableCheckbox, {
        checked: row.getIsSelected(),
        onCheckedChange: (value) => row.toggleSelected(!!value),
        "aria-label": "Select row",
      }),
    enableSorting: false,
    enableHiding: false,
  },
  {
    accessorKey: "status",
    header: "Status",
    cell: ({ row }) =>
      renderComponent(FlexRender, {
        content: `<div class="capitalize">${row.original.status}</div>`,
      }),
  },
  {
    accessorKey: "email",
    header: ({ column }) =>
      renderComponent(DataTableEmailButton, {
        onclick: column.getToggleSortingHandler(),
      }),
    cell: ({ row }) =>
      renderComponent(FlexRender, {
        content: `<div class="lowercase">${row.original.email}</div>`,
      }),
  },
  {
    accessorKey: "amount",
    header: () =>
      renderComponent(FlexRender, {
        content: `<div class="text-end">Amount</div>`,
      }),
    cell: ({ row }) =>
      renderComponent(FlexRender, {
        content: `<div class="text-end font-medium">${formatCurrency(
          row.original.amount
        )}</div>`,
      }),
  },
  {
    id: "actions",
    enableHiding: false,
    cell: ({ row }) =>
      renderComponent(DataTableActions, { id: row.original.id }),
  },
];

// Opsional: buat table instance siap pakai
export const usePaymentsTable = (data: Payment[]) =>
  createSvelteTable({
    data,
    columns,
    enableSorting: true,
    enableRowSelection: true,
    getRowId: (row) => row.id,
  });

// Export FlexRender agar bisa digunakan di luar columns
export { FlexRender };
