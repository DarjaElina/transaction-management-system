export const resetEnvironment = async () => {
  await fetch('http://localhost:8000/api/test/reset', {
    method: 'POST',
  })
}
