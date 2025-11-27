import { useReactTable, getCoreRowModel, flexRender } from "@tanstack/react-table"
import type { ColumnDef } from "@tanstack/react-table"
import "./styles.css"

type User = {
  id: number
  name: string
  age: number
  email: string
}

const data: User[] = [
  { id: 1, name: "João Silva", age: 22, email: "joao.silva@email.com" },
  { id: 2, name: "Maria Santos", age: 19, email: "maria.santos@email.com" },
  { id: 3, name: "Pedro Costa", age: 30, email: "pedro.costa@email.com" },
  { id: 4, name: "Ana Oliveira", age: 25, email: "ana.oliveira@email.com" },
  { id: 5, name: "Carlos Ferreira", age: 28, email: "carlos.ferreira@email.com" },
  { id: 6, name: "Beatriz Lima", age: 24, email: "beatriz.lima@email.com" },
  { id: 7, name: "Rafael Souza", age: 32, email: "rafael.souza@email.com" },
  { id: 8, name: "Juliana Rocha", age: 27, email: "juliana.rocha@email.com" },
]

const columns: ColumnDef<User>[] = [
  {
    header: "ID",
    accessorKey: "id",
  },
  {
    header: "Nome",
    accessorKey: "name",
  },
  {
    header: "Idade",
    accessorKey: "age",
  },
  {
    header: "Email",
    accessorKey: "email",
  },
]

export default function Table() {
  const table = useReactTable({
    data,
    columns,
    getCoreRowModel: getCoreRowModel(),
  })

  return (
    <table className="modern-table">
      <thead>
        {table.getHeaderGroups().map(headerGroup => (
          <tr key={headerGroup.id}>
            {headerGroup.headers.map(header => (
              <th key={header.id}>
                {flexRender(header.column.columnDef.header, header.getContext())}
              </th>
            ))}
          </tr>
        ))}
      </thead>
      <tbody>
        {table.getRowModel().rows.map(row => (
          <tr key={row.id}>
            {row.getVisibleCells().map(cell => (
              <td key={cell.id}>
                {flexRender(cell.column.columnDef.cell, cell.getContext())}
              </td>
            ))}
          </tr>
        ))}
      </tbody>
    </table>
  )
}
