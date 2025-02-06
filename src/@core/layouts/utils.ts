// ** Types
import { NextRouter } from 'next/router'
import { NavGroup, NavLink } from 'src/@core/layouts/types'

/**
 * Check for URL queries as well for matching
 * Current URL & Item Path
 *
 * @param item
 * @param activeItem
 */
export const handleURLQueries = (router: NextRouter, path: string | undefined): boolean => {
  if (Object.keys(router.query).length && path) {
    const arr = Object.keys(router.query)

    return router.asPath.includes(path) && router.asPath.includes(router.query[arr[0]] as string) && path !== '/'
  }

  return false
}

/**
 * Check if the given item has the given url
 * in one of its children
 *
 * @param item
 * @param currentURL
 */
export const hasActiveChild = (item: NavGroup, currentURL: string): boolean => {
  const { children } = item

  if (!children) {
    return false
  }

  for (const child of children) {
    if ((child as NavGroup).children) {
      if (hasActiveChild(child, currentURL)) {
        return true
      }
    }
    const childPath = (child as NavLink).path

    // Check if the child has a link and is active
    if (
      child &&
      childPath &&
      currentURL &&
      (childPath === currentURL || (currentURL.includes(childPath) && childPath !== '/'))
    ) {
      return true
    }
  }

  return false
}

/**
 * Check if this is a children
 * of the given item
 *
 * @param children
 * @param openGroup
 * @param currentActiveGroup
 */
export const removeChildren = (children: NavLink[], openGroup: string[], currentActiveGroup: string[]) => {
  children.forEach((child: NavLink) => {
    if (!currentActiveGroup.includes(child.title)) {
      const index = openGroup.indexOf(child.title)
      if (index > -1) openGroup.splice(index, 1)

      // @ts-ignore
      if (child.children) removeChildren(child.children, openGroup, currentActiveGroup)
    }
  })
}

export const getColorForString = (str: string) => {
  let hash = 0;
  str.split('').forEach(char => {
    hash = char.charCodeAt(0) + ((hash << 5) - hash)
  })
  let colour = '#'
  for (let i = 0; i < 3; i++) {
    const value = (hash >> (i * 8)) & 0xff
    colour += value.toString(16).padStart(2, '0')
  }
  return colour
}



export const truncateText = (value: string, maxLength: number) => {
  const needsTruncate = value.length + 3 > maxLength;
  if (needsTruncate) {
    return value.slice(0, maxLength - 3) + '...';
  }
  return value;
}

export const pluralPipe = (value: string, count: number, pluralSuffix = 's') => {
  if (!count || count <= 1) {
    return count + ' ' + value;
  }
  return count + ' ' + value + pluralSuffix;
}

export const searchData = <T extends any[]>(params: { data: T, searchQuery: string, searchKeys: string[] }) => {
  const { data, searchKeys, searchQuery } = params;
  return (data || []).filter(item => {
    let searchStr = '';
    for (const key of searchKeys) {
      searchStr += String(item[key]) + ' '
    }
    return searchStr.toLowerCase().includes(searchQuery.toLowerCase())
  })
}