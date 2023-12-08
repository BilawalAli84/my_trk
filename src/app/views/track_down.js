// Function to generate a random session ID
function generateSessionId(length) {
    let result = '';
    const characters = 'ABCDEFGHIJKLMNOPQRSTUVWXYZabcdefghijklmnopqrstuvwxyz0123456789';
    const charactersLength = characters.length;
    for (let i = 0; i < length; i++) {
      result += characters.charAt(Math.floor(Math.random() * charactersLength));
    }
    return result;
  }
function getScriptKeyFromScriptTag() {
  var scripts = document.getElementsByTagName('script');
  
  // Get the last script element (assuming it's the one you're interested in)
  var script = scripts[scripts.length - 1];
  console.log(script);
  // Get the src attribute from the script
  var src = script.src;
  
  // Extract the key parameter from the src
  var match = /[\?&]key=([^&]*)/.exec(src);

  // Check if the 'key' parameter was found
  if (match && match[1]) {
    return match[1];
  } else {
    return null; // or handle the absence of the 'key' parameter as needed
  }
}
  // Function to log input values
  function logInputValues(inputElements) {
    inputElements.forEach(function(inputElement) {
      console.log("Input Value on Page Load - " + inputElement.name + ": " + inputElement.value);
    });
  }
  

  // Get the current URL
  var currentUrl = window.location.href;
  var script_key = getScriptKeyFromScriptTag();
  console.log('Hi i am the script_key');
  console.log(script_key);
  // Get referring URL (if available)
  var referringUrl = document.referrer;
  
  // Get URL parameters
  var urlParameters = {};
  var urlSearchParams = new URLSearchParams(window.location.search);
  
  urlSearchParams.forEach(function(value, key) {
    urlParameters[key] = value;
  });
  
  // Check if session ID is present in local storage
  var sessionId = localStorage.getItem('session_id');
  
  if (!sessionId) {
    // If not present, generate a new session ID
    sessionId = generateSessionId(20);
    // Store the session ID in local storage
    localStorage.setItem('session_id', sessionId);
  }
  
  // Function to set input values from local storage
  function setInputValues(inputElements) {
    inputElements.forEach(function(inputElement) {
      var storedValue = localStorage.getItem(inputElement.name);
      if (storedValue) {
        inputElement.value = storedValue;
      }
    });
  }
  // Function to get input values
  function getInputValues(inputElements) {
    var inputValues = {};
  
    inputElements.forEach(function(inputElement) {
      inputValues[inputElement.name] = inputElement.value;
      // Store the input value in local storage
      localStorage.setItem(inputElement.name, inputElement.value);
    });
  
    return inputValues;
  }
  // Call the function to set input values when the page loads
  var inputElements = document.querySelectorAll('input');
  setInputValues(inputElements);
  
  function extractCookies() {
      const cookies = document.cookie.split('; ');
      let _fbp = '';
      let _fbc = '';
      let fbclid = '';
    
      cookies.forEach(function (cookie) {
        if (cookie.startsWith('_fbp=')) {
          _fbp = cookie.split('=')[1];
        } else if (cookie.startsWith('_fbc=')) {
          _fbc = cookie.split('=')[1];
        } else if (cookie.startsWith('fbclid=')) {
          fbclid = cookie.split('=')[1];
        }
      });
    
      return {
        _fbp,
        _fbc,
        fbclid,
      };
    }
  // Function to send data to the API
  function sendDataToApi(dataToSend) {
    var apiUrl = "https://tracking-backend-sooty.vercel.app/track_down";
    fetch(apiUrl, {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
      },
      body: JSON.stringify(dataToSend),
    })
      .then(function (response) {
        if (response.ok) {
          console.log("Data sent to the API successfully.");
        } else {
          console.error("Error sending data to the API:", response.statusText);
        }
      })
      .catch(function (error) {
        console.error("Error sending data to the API:", error);
      });
  }
  function logCookies() {
    console.log("All Cookies on Page Load:");
    const cookies = document.cookie.split('; ');
    cookies.forEach(function(cookie) {
      console.log(cookie);
    });
  }
  logCookies();
  
  // Call the function to send data to the API on page load
  var dataToSendOnLoad = {
    session_id: sessionId,
    current_url: currentUrl,
    reference_url: referringUrl,
    url_parameters: urlParameters,
    input_values: getInputValues(inputElements),
    track_type:'onload',
    script_key: script_key,
  };
    const cookieData = extractCookies();
    dataToSendOnLoad.fbp = cookieData._fbp;
    dataToSendOnLoad.fbc = cookieData._fbc;
    dataToSendOnLoad.fbclid = cookieData.fbclid;
    if (inputElements) {
      inputElements.forEach(function(inputElement) {
        if (inputElement.name === 'email') {
          dataToSendOnLoad.email_input = inputElement.value;
        }
      });
    }
    sendDataToApi(dataToSendOnLoad);
  
  // Add an event listener to the document to log input values when the user clicks on the screen
  document.addEventListener('click', function() {
    logInputValues(inputElements);
    // Call the function to send data to the API on click
    var dataToSendOnClick = {
      session_id: sessionId,
      current_url: currentUrl,
      reference_url: referringUrl,
      url_parameters: urlParameters,
      input_values: getInputValues(inputElements),
      track_type:'click',
      script_key: script_key,
    };
    if (inputElements) {
      inputElements.forEach(function(inputElement) {
        if (inputElement.name === 'email') {
          dataToSendOnClick.email_input = inputElement.value;
        }
      });
    }
    sendDataToApi(dataToSendOnClick);
  });