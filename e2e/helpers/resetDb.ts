export async function resetDb() {
  await fetch('http://localhost:8000/api/test/reset', {
    method: 'POST',
  })
}
