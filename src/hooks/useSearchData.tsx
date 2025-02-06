import { useState } from 'react'
import { searchData as _searchData } from 'src/@core/layouts/utils'

export const useSearchData = <T,>(props: { searchKeys: (keyof T)[] }) => {
  const { searchKeys } = props
  const [data, setData] = useState<T[]>()
  const [filteredData, setFilteredData] = useState<T[]>()
  const searchData = (searchQuery: string) => {
    const newData = _searchData({
      data: data!,
      searchKeys: searchKeys as string[],
      searchQuery
    })
    setFilteredData(newData)
  }
  return {
    setData,
    setFilteredData,
    filteredData,
    searchData
  }
}
