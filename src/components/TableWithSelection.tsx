import { useState } from "react"
import {
  useReactTable,
  getCoreRowModel,
  flexRender,
} from "@tanstack/react-table"

import type { ColumnDef, RowSelectionState } from "@tanstack/react-table"

//--------------------------------------------------------------
// 1. Tipo dos dados
//--------------------------------------------------------------
type Employee = {
  id: number
  name: string
  position: string
  salary: number
  department: string
}

//--------------------------------------------------------------
// 2. Dados de funcionários
//--------------------------------------------------------------
const employees: Employee[] = [
  { id: 1, name: "Ana Silva", position: "Desenvolvedora", salary: 8000, department: "TI" },
  { id: 2, name: "Carlos Santos", position: "Designer", salary: 6500, department: "Marketing" },
  { id: 3, name: "Beatriz Costa", position: "Gerente", salary: 12000, department: "Vendas" },
  { id: 4, name: "Diego Oliveira", position: "Analista", salary: 5500, department: "RH" },
  { id: 5, name: "Elena Ferreira", position: "Coordenadora", salary: 9500, department: "TI" },
]

//--------------------------------------------------------------
// 3. Definição das colunas com checkbox de seleção
//--------------------------------------------------------------
const columns: ColumnDef<Employee>[] = [
  {
    id: "select",
    header: ({ table }) => (
      <input
        type="checkbox"
        checked={table.getIsAllRowsSelected()}
        onChange={table.getToggleAllRowsSelectedHandler()}
      />
    ),
    cell: ({ row }) => (
      <input
        type="checkbox"
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

//--------------------------------------------------------------
// 4. Componente com seleção de linhas
//--------------------------------------------------------------
export default function TableWithSelection() {
  // estado para controlar quais linhas estão selecionadas
  const [rowSelection, setRowSelection] = useState<RowSelectionState>({})

  const table = useReactTable({
    data: employees,
    columns,
    state: {
      rowSelection,
    },
    onRowSelectionChange: setRowSelection,
    getCoreRowModel: getCoreRowModel(),
    enableRowSelection: true,  // habilita seleção de linhas
  })

  // função para obter funcionários selecionados
  const getSelectedEmployees = () => {
    return table.getSelectedRowModel().rows.map(row => row.original)
  }

  // função para calcular salário total dos selecionados
  const getTotalSalary = () => {
    return getSelectedEmployees().reduce((total, emp) => total + emp.salary, 0)
  }

  return (
    <div style={{ padding: 20 }}>
      <h2>Tabela com Seleção de Linhas</h2>
      
      {/* Informações sobre seleção */}
      <div style={{ marginBottom: 15, padding: 10, backgroundColor: "#f0f0f0", borderRadius: 5 }}>
        <p><strong>Selecionados:</strong> {table.getSelectedRowModel().rows.length} funcionários</p>
        {table.getSelectedRowModel().rows.length > 0 && (
          <p><strong>Salário Total:</strong> R$ {getTotalSalary().toLocaleString()}</p>
        )}
      </div>

      {/* Botões de ação */}
      <div style={{ marginBottom: 15 }}>
        <button
          onClick={() => setRowSelection({})}
          style={{ marginRight: 10, padding: "5px 10px" }}
        >
          Limpar Seleção
        </button>
        <button
          onClick={() => {
            const selected = getSelectedEmployees()
            alert(`Funcionários selecionados:\n${selected.map(emp => emp.name).join('\n')}`)
          }}
          disabled={table.getSelectedRowModel().rows.length === 0}
          style={{ padding: "5px 10px" }}
        >
          Mostrar Selecionados
        </button>
      </div>

      {/* Tabela */}
      <table border={1} cellPadding={10} style={{ width: "100%", borderCollapse: "collapse" }}>
        <thead>
          {table.getHeaderGroups().map(headerGroup => (
            <tr key={headerGroup.id}>
              {headerGroup.headers.map(header => (
                <th key={header.id} style={{ backgroundColor: "#f5f5f5" }}>
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
              style={{ 
                backgroundColor: row.getIsSelected() ? "#e3f2fd" : "white" 
              }}
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

      {/* Lista dos selecionados */}
      {table.getSelectedRowModel().rows.length > 0 && (
        <div style={{ marginTop: 20, padding: 15, border: "1px solid #ddd", borderRadius: 5 }}>
          <h3>Funcionários Selecionados:</h3>
          <ul>
            {getSelectedEmployees().map(emp => (
              <li key={emp.id}>
                {emp.name} - {emp.position} - R$ {emp.salary.toLocaleString()}
              </li>
            ))}
          </ul>
        </div>
      )}
    </div>
  )
}