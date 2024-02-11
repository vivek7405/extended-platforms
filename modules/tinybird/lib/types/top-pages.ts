export type TopPagesData = {
  pathname: string
  href: string
  visits: number
  hits: number
}

export enum TopPagesSorting {
  Visitors = 'visits',
  Pageviews = 'hits',
}
