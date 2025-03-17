document.addEventListener('DOMContentLoaded', () => {
  const uploadPhotoButton = document.getElementById('upload-photo-button');
  const uploadOptions = document.getElementById('upload-options');
  const showUploadedFilesButton = document.getElementById('show-uploaded-files-button');
  const uploadFileButton = document.getElementById('upload-file-button');
  const useCameraButton = document.getElementById('use-camera-button');
  const previouslyUploadedContainer = document.querySelector('.previously-uploaded-container');
  const userImageInput = document.getElementById('user-image');
  const openWebcamButton = document.getElementById('open-webcam');
  const capturePhotoButton = document.getElementById('capture-photo');
  const webcam = document.getElementById('webcam');
  const canvas = document.getElementById('canvas');
  
  uploadPhotoButton.addEventListener('click', () => {
    uploadOptions.classList.toggle('hidden');
  });

  showUploadedFilesButton.addEventListener('click', () => {
    previouslyUploadedContainer.classList.toggle('hidden');
    showPreviouslyUploadedFiles();
  });
   uploadFileButton.addEventListener('click', () => {
    userImageInput.click();
  });

  userImageInput.addEventListener('change', handleFileChange);

});

async function handleImageClick(fileURL) {
  console.log(fileURL);
  const image = await fetch(fileURL, { mode: 'cors' });
    const blob = await image.blob();
    const file = new File([blob], 'image.jpg', { type: blob.type });
  const spinnerElement = document.querySelector('.product-media-container .loading__spinner');
  const productMediaElement = document.querySelector('.product__media');
  document.querySelector('.personalized-media-container').classList.add('hidden');

  spinnerElement.classList.remove('hidden');
  productMediaElement.classList.add('hidden');

  console.log('Selected file:', file);

  const stickerId = 22098;
  const formData = new FormData();
  formData.append('gender', 'female');
  formData.append('image', file, 'image.jpg');
  formData.append('stickerIds', stickerId);
  formData.append('userId', 'shopify');
  formData.append('outputFormat', 'png');

  try {
    const response = await axios.post("https://content-api.bobbleapp.asia/v4/stickers", formData, {
      headers: {
        'Content-Type': 'multipart/form-data',
        'X-API-KEY': "eOHVOYGBUvuqpsXSvFSiONGo8mxZpmtu3Yw-7pKkwqE",
      }
    });
    const result = response.data.contents[0]?.media?.fixedWidthFull?.png?.url;
    console.log('Sticker API response:', result);

    if (result) {
      sessionStorage.setItem('PersonalizedProductImageURL', result);
       updateUserImage(result);
    }
  } catch (error) {
    console.error('Error from sticker API:', error);
    spinnerElement.classList.add('hidden');
    productMediaElement.classList.remove('hidden');
  }
}
async function handleFileChange(event) {
  const spinnerElement = document.querySelector('.product-media-container .loading__spinner');
  const productMediaElement = document.querySelector('.product__media');
  document.querySelector('.personalized-media-container').classList.add('hidden');

  spinnerElement.classList.remove('hidden');
  productMediaElement.classList.add('hidden');

  const file = event.target.files[0];
  console.log('Selected file:', file);

  const stickerId = 22098;
  const formData = new FormData();
  formData.append('gender', 'female');
  formData.append('image', file, 'image.jpg');
  formData.append('stickerIds', stickerId);
  formData.append('userId', 'demo-user');
  formData.append('outputFormat', 'png');

  // try {
  //   const response = await axios.post("https://content-api.bobbleapp.asia/v4/stickers", formData, {
  //     headers: {
  //       'Content-Type': 'multipart/form-data',
  //       'X-API-KEY': "eOHVOYGBUvuqpsXSvFSiONGo8mxZpmtu3Yw-7pKkwqE",
  //     }
  //   });
  //   const result = response.data.contents[0]?.media?.fixedWidthFull?.png?.url;
  //   console.log('Sticker API response:', result);

  //   if (result) {
  //     sessionStorage.setItem('PersonalizedProductImageURL', result);
  //      updateUserImage(result);
  //   }
  // } catch (error) {
  //   console.error('Error from sticker API:', error);
  //   spinnerElement.classList.add('hidden');
  //   productMediaElement.classList.remove('hidden');
  // }
  
   try {
    const response = await fetch('http://localhost:5000/api/upload', {
      method: 'POST',
      body: formData
    });

    if (response.ok) {
      const result = await response.json();
      console.log('File uploaded successfully:', result);
    } else {
      console.error('Failed to upload file');
    }
  } catch (error) {
    console.error('Error uploading file:', error);
  } finally {
    spinnerElement.classList.add('hidden');
    productMediaElement.classList.remove('hidden');
  }
}

async function showPreviouslyUploadedFiles() {
  const userId = 'demo-user';
  try {
    const response = await fetch(`http://localhost:5000/api/user/${userId}/files`);
    if (response.ok) {
      const files = await response.json();
      const container = document.querySelector('.previously-uploaded-container');
      container.innerHTML = ''; // Clear existing content
      files.forEach(file => {
        const img = document.createElement('img');
        img.src = file;
                img.addEventListener('click', () => handleImageClick(file));
        container.appendChild(img);
      });
    } else {
      console.error('Failed to fetch files');
    }
  } catch (error) {
    console.error('Error fetching files:', error);
  }
}

// document.querySelector('.show-uploaded-files-button').addEventListener('click', showPreviouslyUploadedFiles);
document.querySelector('.personalized-media-container').addEventListener('click', updatePersonalizedPhoto);
document.querySelector('.personalized-media-containered').addEventListener('click', updateMainPhoto);

function updatePersonalizedPhoto(event) {
    document.querySelector('.product__media').classList.add('hidden');
    const clickedImage = event.target;
    const newSrc = clickedImage.getAttribute('src');
    const addingMyImage = document.querySelector('.adding-my-image');
    const existingNewImage = addingMyImage.querySelector('.new-image');
    if (existingNewImage) {
        existingNewImage.remove();
    }
    const newImage = document.createElement('img');
    newImage.src = newSrc;
    newImage.alt = 'New Product Image';
    newImage.classList.add('new-image');
    addingMyImage.appendChild(newImage);
}


function updateMainPhoto(event) {
    document.querySelector('.product__media').classList.add('hidden');
    const clickedImage = event.target;
    const newSrc = clickedImage.getAttribute('src');
    const addingMyImage = document.querySelector('.adding-my-image');
    const existingNewImage = addingMyImage.querySelector('.new-image');
    if (existingNewImage) {
        existingNewImage.remove();
    }
    const newImage = document.createElement('img');
    newImage.src = newSrc;
    newImage.alt = 'New Product Image';
    newImage.classList.add('new-image');
    addingMyImage.appendChild(newImage);
}

function updateUserImage(imageUrl) {
   const personalizedMediaContainer = document.querySelector('.personalized-media-container');
   const personalizedMediaContainer1 = document.querySelector('.personalized-media-containered');
    if (personalizedMediaContainer) {
      let imgElement = personalizedMediaContainer.querySelector('img');
      let imgElement1 = personalizedMediaContainer1.querySelector('img');
      if (imgElement) {
        imgElement.src = imageUrl;
        imgElement1.src = "https://stickers.bobblekeyboard.net/preview/b3c63bf3-9326-401a-84fb-0668b73447c7.png";
      } else {
        imgElement = document.createElement('img');
        imgElement.src = imageUrl;
        imgElement.classList.add('custom-img-style');
        imgElement.alt = "Personalized Product Image";
        personalizedMediaContainer.appendChild(imgElement);

        imgElement1 = document.createElement('img');
        imgElement1.src = "https://stickers.bobblekeyboard.net/preview/b3c63bf3-9326-401a-84fb-0668b73447c7.png";
        imgElement1.classList.add('custom-img-style');
        imgElement1.alt = "Personalized Product Image";
        personalizedMediaContainer1.appendChild(imgElement1);
      }
      sessionStorage.setItem('PersonalizedProductImageURL', imageUrl);

      document.querySelector('.product-media-container .loading__spinner').classList.add('hidden');
      document.querySelector('.product__media').classList.remove('hidden');
      document.querySelector('.personalized-media-container').classList.remove('hidden');
    }
}

function loadUserImage() {
  const imageUrl = sessionStorage.getItem('PersonalizedProductImageURL');
  if (imageUrl) {
    updateUserImage(imageUrl);
  }
}

window.onload = function() {
  loadUserImage();

    const baseImage = document.getElementById('baseImage');
    const overlayImage = document.getElementById('overlayImage');
    const imageUrl = sessionStorage.getItem('PersonalizedProductImageURL');
    overlayImage.src = imageUrl
    console.log("hi2");
    baseImage.onload = function() {
        console.log("baseImage loaded");
        overlayImage.onload = function() {
            console.log("overlayImage loaded");
            const canvas = document.getElementById('canvas');
            const ctx = canvas.getContext('2d');
            canvas.width = baseImage.width;
            canvas.height = baseImage.height;
            ctx.drawImage(baseImage, 0, 0);
            // const x = (baseImage.width - overlayImage.width) / 2;
            // const y = (baseImage.height - overlayImage.height) / 2;
            // console.log("hurra");
            // ctx.drawImage(overlayImage, x, y);
           const scaleFactor = 0.5; 
            const overlayWidth = baseImage.width * scaleFactor;
            const overlayHeight = overlayImage.height * (overlayWidth / overlayImage.width);
            const x = (baseImage.width - overlayWidth)/1.2;
            const y = (baseImage.height - overlayHeight) / 2;
            ctx.drawImage(overlayImage, x, y, overlayWidth, overlayHeight);
        };
        overlayImage.onerror = function() {
            console.error("Error loading overlayImage");
        };
        if (overlayImage.complete) {
            overlayImage.onload();
        }
    };
    baseImage.onerror = function() {
        console.error("Error loading baseImage");
    };
    if (baseImage.complete) {
        baseImage.onload();
    }
};

// document.getElementById('user-image').addEventListener('change', handleFileChange);

 document.getElementById('use-camera-button').addEventListener('click', async function() {
      const webcamElement = document.getElementById('webcam');
      const captureButton = document.getElementById('capture-photo');

      webcamElement.classList.toggle('hidden');
      captureButton.classList.toggle('hidden');

      try {
        const stream = await navigator.mediaDevices.getUserMedia({ video: true });
        webcamElement.srcObject = stream;
      } catch (error) {
        console.error('Error accessing webcam:', error);
      }
    });
  document.getElementById('capture-photo').addEventListener('click', function() {
      const spinnerElement = document.querySelector('.product-media-container .loading__spinner');
  const productMediaElement = document.querySelector('.product__media');
      document.querySelector('.personalized-media-container').classList.add('hidden');

  spinnerElement.classList.remove('hidden');
  productMediaElement.classList.add('hidden');

      const webcamElement = document.getElementById('webcam');
      const canvasElement = document.getElementById('canvas');
      const context = canvasElement.getContext('2d');

      canvasElement.width = webcamElement.videoWidth;
      canvasElement.height = webcamElement.videoHeight;
      context.drawImage(webcamElement, 0, 0, canvasElement.width, canvasElement.height);

      canvasElement.toBlob(async function(blob) {
        const file = new File([blob], 'webcam-image.jpg', { type: 'image/jpeg' });
        console.log('Captured file:', file);

        const stickerId = 22098;
        const formData = new FormData();
        formData.append('gender', 'female');
        formData.append('image', file, 'image.jpg');
        formData.append('stickerIds', stickerId);
        formData.append('userId', 'shopify');
        formData.append('outputFormat', 'png');

        try {
          const response = await axios.post("https://content-api.bobbleapp.asia/v4/stickers", formData, {
            headers: {
              'Content-Type': 'multipart/form-data',
              'X-API-KEY': "eOHVOYGBUvuqpsXSvFSiONGo8mxZpmtu3Yw-7pKkwqE",
            }
          });
          const result = response.data.contents[0]?.media?.fixedWidthFull?.png?.url;
          console.log('Sticker API response:', result);

          if (result) {
             sessionStorage.setItem('PersonalizedProductImageURL', result);
             updateUserImage(result);
          }
        } catch (error) {
          console.error('Error from sticker API:', error);
          document.querySelector('.product-media-container .loading__spinner').classList.add('hidden');
          productMediaElement.classList.remove('hidden');
        }
      }, 'image/jpeg');

    webcamElement.classList.add('hidden');
      document.getElementById('capture-photo').classList.add('hidden');
    });

document.getElementById('ProductSubmitButton-template--16347001782316__main').addEventListener('click', async function(event) {
    event.preventDefault();

  const personalizedImageUrl = sessionStorage.getItem('PersonalizedProductImageURL');
  console.log('Retrieved Personalized Image URL:', personalizedImageUrl);

  const productId = '7551475810348';
  const variantId = '43342632910892';

  try {
    const item = {
      id: variantId,
      quantity: 1,
      properties: {
        'PersonalizedImageURL': ''
      }
    };

    if (personalizedImageUrl) {
      item.properties['PersonalizedImageURL'] = personalizedImageUrl;
    }

    console.log('Item to be added to cart:', item);

    const response = await axios.post('/cart/add.js', {
      items: [item]
    }, {
      headers: {
        'Content-Type': 'application/json'
      }
    });

    console.log('Add to Cart response:', response.data);
    triggerShopifyNotification();

    // window.location.href = '/cart';
  } catch (error) {
    console.error('Error adding to cart:', error);
  }
});

  // const triggerShopifyNotification = () => {
  //   const cartNotification = document.getElementById('cart-notification');
  //   if (cartNotification) {
  //     cartNotification.classList.add('active');
  //     setTimeout(() => {
  //       cartNotification.classList.remove('active');
  //     }, 3000);
  //   }
  // };
