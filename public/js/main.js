document.addEventListener('DOMContentLoaded', () => {
    const fileInput = document.getElementById('menuFile');
    const uploadForm = document.getElementById('uploadForm');
    const statusMessage = document.getElementById('statusMessage');

    if (uploadForm) {
        uploadForm.addEventListener('submit', async (e) => {
            e.preventDefault();

            const formData = new FormData();
            if (fileInput.files.length > 0) {
                formData.append('menuFile', fileInput.files[0]);
            } else {
                statusMessage.textContent = 'Please select a file to upload.';
                statusMessage.style.color = 'red';
                return;
            }

            try {
                const response = await fetch('/upload', {
                    method: 'POST',
                    body: formData
                });

                const result = await response.json();

                if (result.success) {
                    statusMessage.textContent = result.message;
                    statusMessage.style.color = 'green';
                } else {
                    statusMessage.textContent = result.message;
                    statusMessage.style.color = 'red';
                }
            } catch (error) {
                console.error('Error:', error);
                statusMessage.textContent = 'An error occurred during upload.';
                statusMessage.style.color = 'red';
            }
        });
    }
});
