// Estrai la logica di ridimensionamento dell'immagine in una funzione separata
function resizeAndSetImage(file, uploadedImg, imgPreview) {
    const maxSizeKB = 500; // Massima dimensione in kilobyte
    const maxWidthOrHeight = 500; // Massima larghezza o altezza
  
    // Leggi il file come blob
    const reader = new FileReader();
    reader.onload = function () {
      const img = new Image();
      img.src = reader.result;
      img.onload = function () {
        const canvas = document.createElement('canvas');
        const ctx = canvas.getContext('2d');
  
        // Calcola le nuove dimensioni in base al maxWidthOrHeight
        let newWidth, newHeight;
        if (img.width > img.height) {
          newWidth = maxWidthOrHeight;
          newHeight = (img.height / img.width) * maxWidthOrHeight;
        } else {
          newHeight = maxWidthOrHeight;
          newWidth = (img.width / img.height) * maxWidthOrHeight;
        }
        canvas.width = newWidth;
        canvas.height = newHeight;
        ctx.drawImage(img, 0, 0, newWidth, newHeight);
  
        canvas.toBlob((blob) => {
          if (blob.size / 1024 <= maxSizeKB) {
            console.log(uploadedImg.value,'BEFORE')
            uploadedImg.value = new File([blob], file.name, { type: file.type });
            imgPreview.value.src = URL.createObjectURL(uploadedImg.value);
          } else {
            console.error('L\'immagine selezionata supera la dimensione massima consentita.');
            alert('L\'immagine selezionata supera la dimensione massima consentita.');
          }
        }, uploadedImg.value.type, 0.9);
      };
    };
    reader.readAsDataURL(file);
  }
  function previewImage(event, uploadedImg, imgPreview) {
    uploadedImg.value = event.target.files[0];
    console.log(uploadedImg.value, 'guarda il peso è APPENA caricata');
    if (!uploadedImg.value.type.startsWith('image/')) {
      console.error('Il file selezionato non è un\'immagine.');
      alert('Il file selezionato non è un\'immagine.');
      return;
    }
    resizeAndSetImage(uploadedImg.value, uploadedImg, imgPreview);
  }

  export {resizeAndSetImage, previewImage}