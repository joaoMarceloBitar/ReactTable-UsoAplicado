import { useState } from "react"
import {
  useReactTable,
  getCoreRowModel,
  flexRender,
} from "@tanstack/react-table"
import type { ColumnDef, RowSelectionState } from "@tanstack/react-table"
import "./styles.css"

type Employee = {
  id: number
  name: string
  position: string
  salary: number
  department: string
}
const employees: Employee[] = [
  { id: 1, name: "Ana Silva", position: "Desenvolvedora Senior", salary: 8000, department: "TI" },
  { id: 2, name: "Carlos Santos", position: "Designer UX/UI", salary: 6500, department: "Marketing" },
  { id: 3, name: "Beatriz Costa", position: "Gerente de Vendas", salary: 12000, department: "Vendas" },
  { id: 4, name: "Diego Oliveira", position: "Analista de RH", salary: 5500, department: "RH" },
  { id: 5, name: "Elena Ferreira", position: "Coordenadora de TI", salary: 9500, department: "TI" },
  { id: 6, name: "Fernando Lima", position: "Desenvolvedor Junior", salary: 4500, department: "TI" },
  { id: 7, name: "Gabriela Rocha", position: "Analista de Marketing", salary: 5800, department: "Marketing" },
  { id: 8, name: "Hugo Mendes", position: "Vendedor", salary: 4200, department: "Vendas" },
  { id: 9, name: "Isabela Torres", position: "Gerente de RH", salary: 11000, department: "RH" },
  { id: 10, name: "João Pereira", position: "Arquiteto de Software", salary: 15000, department: "TI" },
  { id: 11, name: "Larissa Alves", position: "Social Media", salary: 4800, department: "Marketing" },
  { id: 12, name: "Marcos Barbosa", position: "Supervisor de Vendas", salary: 7500, department: "Vendas" },
  { id: 13, name: "Natália Cardoso", position: "Recrutadora", salary: 5200, department: "RH" },
  { id: 14, name: "Otávio Gomes", position: "DevOps Engineer", salary: 10500, department: "TI" },
  { id: 15, name: "Patrícia Dias", position: "Gerente de Marketing", salary: 13500, department: "Marketing" },
]

const columns: ColumnDef<Employee>[] = [
  {
    id: "select",
    header: ({ table }) => (
      <input
        type="checkbox"
        className="custom-checkbox"
        checked={table.getIsAllRowsSelected()}
        onChange={table.getToggleAllRowsSelectedHandler()}
      />
    ),
    cell: ({ row }) => (
      <input
        type="checkbox"
        className="custom-checkbox"
        checked={row.getIsSelected()}
        onChange={row.getToggleSelectedHandler()}
      />
    ),
  },
  {
    header: "ID",
    accessorKey: "id",
  },
  {
    header: "Nome",
    accessorKey: "name",
  },
  {
    header: "Cargo",
    accessorKey: "position",
  },
  {
    header: "Salário",
    accessorKey: "salary",
    cell: ({ getValue }) => `R$ ${getValue().toLocaleString()}`,
  },
  {
    header: "Departamento",
    accessorKey: "department",
  },
]

export default function TableWithSelection() {
  const [rowSelection, setRowSelection] = useState<RowSelectionState>({})

  const table = useReactTable({
    data: employees,
    columns,
    state: {
      rowSelection,
    },
    onRowSelectionChange: setRowSelection,
    getCoreRowModel: getCoreRowModel(),
    enableRowSelection: true,
  })

  const getSelectedEmployees = () => {
    return table.getSelectedRowModel().rows.map(row => row.original)
  }

  const getTotalSalary = () => {
    return getSelectedEmployees().reduce((total, emp) => total + emp.salary, 0)
  }

  return (
    <div>
      {table.getSelectedRowModel().rows.length > 0 && (
        <div className="selection-info">
          <h3>📊 Resumo da Seleção</h3>
          <p><strong>Selecionados:</strong> {table.getSelectedRowModel().rows.length} funcionários</p>
          <p><strong>Salário Total:</strong> R$ {getTotalSalary().toLocaleString()}</p>
        </div>
      )}

      <div style={{ marginBottom: "1rem", display: "flex", gap: "0.5rem" }}>
        <button
          className="btn btn-secondary"
          onClick={() => setRowSelection({})}
        >
          🗑️ Limpar Seleção
        </button>
        <button
          className="btn btn-primary"
          onClick={() => {
            const selected = getSelectedEmployees()
            alert(`Funcionários selecionados:\n${selected.map(emp => emp.name).join('\n')}`)
          }}
          disabled={table.getSelectedRowModel().rows.length === 0}
        >
          📄 Mostrar Selecionados
        </button>
      </div>
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
            <tr 
              key={row.id}
              className={row.getIsSelected() ? "selected-row" : ""}
            >
              {row.getVisibleCells().map(cell => (
                <td key={cell.id}>
                  {flexRender(cell.column.columnDef.cell, cell.getContext())}
                </td>
              ))}
            </tr>
          ))}
        </tbody>
      </table>

      {table.getSelectedRowModel().rows.length > 0 && (
        <div className="selected-list">
          <h3>👥 Funcionários Selecionados</h3>
          <ul>
            {getSelectedEmployees().map(emp => (
              <li key={emp.id}>
                <strong>{emp.name}</strong> - {emp.position} - R$ {emp.salary.toLocaleString()}
              </li>
            ))}
          </ul>
        </div>
      )}
    </div>
  )
}