function uploadFile(e)
{
  e.preventDefault(); // Prevent the default form submission behavior

  const fileInput = document.getElementById('fileInput');
  const file = fileInput.files[0];

  if (!file)
  {
    console.error('No file selected');
    return;
  }

  const formData = new FormData();
  formData.append('file', file);

  fetch('http://localhost:3000/upload', {
    method: 'POST',
    body: formData,
  })
    .then((response) => response.json())
    .then((data) =>
    {
      console.log('Upload response:', data);
    })
    .catch((error) =>
    {
      console.error('Upload error:', error);
    });
}
