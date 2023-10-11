// на базе async/await
export async function postData(url, data) {
  const response = await fetch(url, {
    method: 'POST',
    body: data,
  });

  if (!response.ok) throw new Error('Упс!');

  return response;
}
