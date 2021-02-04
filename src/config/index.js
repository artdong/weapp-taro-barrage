
// eslint-disable-next-line import/no-mutable-exports
let Runtime, baseUrl
const env = 'test'
if (env === 'test') {
  Runtime = 'test'
  // baseUrl = 'http://localhost:3999'
  baseUrl = ''
} else {
  Runtime = 'prod'
  baseUrl = ''
}

export {
  Runtime,
  baseUrl,
}
