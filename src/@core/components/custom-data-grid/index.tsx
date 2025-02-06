import {
  DataGrid,
  DataGridProps,
  GridToolbarContainer,
  GridToolbarExport,
  GridToolbarFilterButton
} from '@mui/x-data-grid'

interface CustomDataGridProps extends DataGridProps {
  exportFields?: string[]
  disableAutoHeight?: boolean
}

function CustomToolbar({ exportFields }: CustomDataGridProps) {
  return (
    <GridToolbarContainer>
      {/* <GridToolbarDensitySelector /> */}
      <GridToolbarFilterButton />
      {/* <GridToolbarColumnsButton /> */}
      <GridToolbarExport
        csvOptions={{ fields: exportFields || null, fileName: 'pricial-export' }}
        printOptions={{ disableToolbarButton: true }}
      />
    </GridToolbarContainer>
  )
}

function CustomDataGrid(props: CustomDataGridProps) {
  const { exportFields, ...rest } = props
  return (
    <DataGrid
      {...rest}
      autoHeight
      initialState={{
        ...props.initialState,
        pagination: { paginationModel: { pageSize: 10 } }
      }}
      pageSizeOptions={[10, 25, 50, 100]}
      pagination
      disableRowSelectionOnClick
      slots={{ ...props?.slots, toolbar: () => <CustomToolbar exportFields={exportFields} {...rest} /> }}
    />
  )
}

export default CustomDataGrid
