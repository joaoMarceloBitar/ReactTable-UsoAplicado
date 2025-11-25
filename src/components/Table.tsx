import React from "react"
import { useReactTable, getCoreRowModel, flexRender } from "@tanstack/react-table"
// useReactTable()      -    cria a máquina: row model, cells, header model, meta, sorting, filtering
// getCoreRowModel()    -    gera as linhas básicas
// flexRender()         -    sabe renderizar header e cell
import type { ColumnDef } from "@tanstack/react-table"
// tipo de dado da coluna
//-----------------------------------------------------

//definindo tipo User
type User = {
  id: number
  name: string
  age: number
  email: string
}

// definindo os dados passados para a table

const data: User[] = [
  { id: 1, name: "João", age: 22, email: "joao@email.com" },
  { id: 2, name: "Maria", age: 19, email: "maria@email.com" },
  { id: 3, name: "Pedro", age: 30, email: "pedro@email.com" },
]

// definindo as colunas da table

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

// -- os campos do tipo User devem ser relativos a um accessorkey respectivo

export default function Table() {

// table recebe o retorno do hook useReactTable que recebe data e columns
// -- data: array de objetos, no caso dados do tipo user
// -- columns definem como acessar os dados pelo acessorKey

  const table = useReactTable({
    data,
    columns,
    getCoreRowModel: getCoreRowModel(),
  })

  return (
           //grossura borda     //tamanho tabela
    <table border={5}           cellPadding={13}>
        {/* header da tabela*/}
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

        {/* corpo da tabela*/}
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
