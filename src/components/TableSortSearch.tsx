import { useState } from "react"
import {
  useReactTable,
  getCoreRowModel,
  getFilteredRowModel,
  getSortedRowModel,
  flexRender,
} from "@tanstack/react-table"
import type { ColumnDef, SortingState } from "@tanstack/react-table"
import "./styles.css"

type Product = {
  id: number
  name: string
  price: number
  stock: number
}

const products: Product[] = [
  { id: 1, name: "Maçã", price: 5, stock: 120 },
  { id: 2, name: "Banana", price: 3, stock: 80 },
  { id: 3, name: "Morango", price: 10, stock: 40 },
  { id: 4, name: "Abacate", price: 7, stock: 60 },
  { id: 5, name: "Laranja", price: 4, stock: 95 },
  { id: 6, name: "Uva", price: 12, stock: 35 },
  { id: 7, name: "Manga", price: 8, stock: 50 },
  { id: 8, name: "Kiwi", price: 15, stock: 25 },
  { id: 9, name: "Abacaxi", price: 9, stock: 30 },
  { id: 10, name: "Melão", price: 6, stock: 45 },
  { id: 11, name: "Melancia", price: 11, stock: 20 },
  { id: 12, name: "Pêssego", price: 13, stock: 28 },
]

const columns: ColumnDef<Product>[] = [
  {
    header: "ID",
    accessorKey: "id",
  },
  {
    header: "Produto",
    accessorKey: "name",
  },
  {
    header: "Preço",
    accessorKey: "price",
  },
  {
    header: "Estoque",
    accessorKey: "stock",
  },
]

export default function TableSortSearch() {
  const [globalFilter, setGlobalFilter] = useState("")
  const [sorting, setSorting] = useState<SortingState>([])

  const table = useReactTable({
    data: products,
    columns,
    state: {
      globalFilter,
      sorting,
    },
    onGlobalFilterChange: setGlobalFilter,
    onSortingChange: setSorting,
    getCoreRowModel: getCoreRowModel(),         // render básico
    getFilteredRowModel: getFilteredRowModel(), // habilita search
    getSortedRowModel: getSortedRowModel(),     // habilita sort
    globalFilterFn: "includesString",           // modo de busca (string)
  })

  const filteredRows = table.getFilteredRowModel().rows
  
  return (
    <div>
      <input
        type="text"
        placeholder="🔍 Buscar produto..."
        value={globalFilter ?? ""}
        onChange={e => setGlobalFilter(e.target.value)}
        className="search-input"
        style={{ marginBottom: "1rem" }}
      />
      
      <p style={{ marginBottom: "1rem", color: "#666" }}>
        Mostrando {filteredRows.length} de {products.length} produtos
      </p>

      <table className="modern-table">
        <thead>
          {table.getHeaderGroups().map(headerGroup => (
            <tr key={headerGroup.id}>
              {headerGroup.headers.map(header => (
                <th
                  key={header.id}
                  onClick={header.column.getToggleSortingHandler()}
                >
                  {flexRender(header.column.columnDef.header, header.getContext())}
                  {{
                    asc: " 🔼",
                    desc: " 🔽",
                  }[header.column.getIsSorted() as string] ?? null}
                </th>
              ))}
            </tr>
          ))}
        </thead>
        <tbody>
          {filteredRows.length === 0 ? (
            <tr>
              <td colSpan={4} style={{ textAlign: "center", padding: "2rem", color: "#666" }}>
                Nenhum produto encontrado
              </td>
            </tr>
          ) : (
            filteredRows.map(row => (
              <tr key={row.id}>
                {row.getVisibleCells().map(cell => (
                  <td key={cell.id}>
                    {flexRender(cell.column.columnDef.cell, cell.getContext())}
                  </td>
                ))}
              </tr>
            ))
          )}
        </tbody>
      </table>
    </div>
  )
}
