import Table from "./components/Table"
import './App.css'
import TableSortSearch from "./components/TableSortSearch"
import TableWithPagination from "./components/TableWithPagination"
import TableWithSelection from "./components/TableWithSelection"

function App() {

  return (
    <>
      <header>
        <Table />
      </header>
      <header>  
        <TableSortSearch />
      </header>
      <header>
        <TableWithPagination />
      </header>
      <header>
        <TableWithSelection />
      </header>
    </>
  )
}

export default App
