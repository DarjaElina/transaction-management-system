import React from 'react'

export const getCategoriesStatus = (
  isFetching: boolean,
  isError: boolean,
  error: Error | null,
  trimmedSearchTerm: string,
  categoryId: string | number,
) => {
  if (isFetching) {
    return (
      <React.Fragment>
        <span aria-hidden />
        Searching…
      </React.Fragment>
    )
  }

  if (isError) {
    return error?.message
  }

  if (trimmedSearchTerm === '' && !categoryId) {
    return 'Start typing to search categories...'
  }

  return null
}
